
import { Prefab } from "../../../src/behaviours/Prefab";
import { GameObject } from "../../../src/engine";
import { Behaviour } from "../../../src/engine/Behaviour";
import { Transform } from "../../../src/engine/Transform";
import { number } from "../../../src/engine/validators/number";
import { Room } from "./Room";
export enum RoomStatus {

    empty = 0,

    isBuild = 1,

    canBuild = 2
}

child: GameObject

let roomPostionArray = new Array();         //先声明一维
for (var i = 0; i < 9; i++) {
    roomPostionArray[i] = new Array(i);    //在声明二维
    for (var j = 0; j < 6; j++) {
        roomPostionArray[i][j] = 0;
    }

}

function roomStart() {

    for (let j = 1; j < 6; j++) {
        roomPostionArray[0][j] = 2
    }
}
function checkNewRoomCanBuild() {
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 6; j++) {
            if (roomPostionArray[i][j] == 1) {
                roomPostionArray[i++][j] = 2
            }
        }
    }
}
//记录每个坑的状态
function storeBuildStatus(x:number,y:number,roomStatus:RoomStatus){
    roomPostionArray[x][y]=roomStatus;
}
function getRoomTypeById(roomId1: number, roomId2: number) {

    return RoomStatus;
}

export class RoomSet extends Behaviour {
    createRoom(roomPositionX: number, roomPositionY: number, roomType: number, self: any) {
        if (roomType == 0||roomPositionX+1>6||roomPositionX-1<-1) return;

        self.child = new GameObject();
        self.addChild(self.child)
        const childTransform = new Transform();
        childTransform.x = 0 + roomPositionX * 150;
        childTransform.y = 0 + roomPositionY * 100;
        self.child.addBehaviour(childTransform);
        const room = new Room();
        room.positionX = roomPositionX;
        room.positionY = roomPositionY;
        room.RoomType = RoomStatus.canBuild;
       
        self.child.addBehaviour(room);
        const roomPrefab = new Prefab();
        if (roomType == 1) {
            roomPrefab.prefabPath = 'assets//engineTest//prefabs//buildingPrefab.yaml'
        }
        else if(roomType == 2){roomPrefab.prefabPath = 'assets//engineTest//prefabs//roomPrefab.yaml' }
        self.child.addBehaviour(roomPrefab);
storeBuildStatus(roomPositionX,roomPositionY,RoomStatus.canBuild)
        /* const image=new ImageRenderer();
         image.imagePath='assets//images//testImage.png'
         child.addBehaviour(image);*/
       

    };
    //检测旁边的坑状态是否可以转成待开发状态
 checkNeighbor(x:number,y:number) {
     console.log(roomPostionArray[0][1])
    storeBuildStatus(x,y,1)
console.log(x,y)
if(x-1<0||x+1>6)return
  
    if(roomPostionArray[x-1][y]==0&&x>0){
        console.log("yes")
        this.createRoom(x-1,y,RoomStatus.canBuild,this.gameObject)
        this.createRoom(x,y+1,RoomStatus.canBuild,this.gameObject)
        
    }
   else if(roomPostionArray[x-1][y]==0&&roomPostionArray[x+1][y]==0){
       console.log("a")
        this.createRoom(x+1,y,RoomStatus.canBuild,this.gameObject)
        this.createRoom(x,y+1,RoomStatus.canBuild,this.gameObject)
        this.createRoom(x-1,y,RoomStatus.canBuild,this.gameObject)
    }
    else 
    {console.log("v")
        this.createRoom(x,y+1,RoomStatus.canBuild,this.gameObject)
    }
    }

    //在此定义脚本中的属性
    @number()
    roomtype = RoomStatus.empty;
    canUpdateRoom = false;

    //游戏开始时会执行一次
    onStart(): void {
        roomPostionArray[0][0]=-1
        roomPostionArray[0][1]=-1
       
        for (let i = 0; i < 2; i++)
            for (let j = 1; j < 6; j++)
                this.createRoom(j, i, 2, this.gameObject)
        /* this.gameObject.onClick = () => {
         //this.gameObject.getBehaviour(Room).RoomType=1
         roomPostionArray[2][1]=1
         console.log("click")
         checkNewRoomCanBuild()
         this.canUpdateRoom=true;
        
         };*/

    }

    //每次屏幕刷新执行
    onUpdate() {

        /* if(this.canUpdateRoom){
         for(var i=0;i<9;i++){       
               for(var j=0;j<6;j++){    
                   if(roomPostionArray[i][j]==1)  
                   console.log(i)
                   this.createRoom(j,i,roomPostionArray[i][j],this.gameObject)
             this.canUpdateRoom=false;
            }
     }
 }*/
    }

    //平均每16ms执行一次
    onTick(duringTime: number) {

    }
}