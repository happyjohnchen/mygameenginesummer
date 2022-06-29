
import { ImageRenderer } from "../../../src/behaviours/ImageRenderer";
import { Prefab } from "../../../src/behaviours/Prefab";
import { GameObject } from "../../../src/engine";
import { Behaviour } from "../../../src/engine/Behaviour";
import { Transform } from "../../../src/engine/Transform";
import { number } from "../../../src/engine/validators/number";
import { RoomType } from "../../scripts/modules/RoomModule";
import { Room } from "./Room";
export enum RoomStatus {

    empty = 0,

    isBuild = 1,

    canBuild = 2
}


child: GameObject
//数组初始化
let roomPostionArray = new Array();         //先声明一维
for (var i = 0; i < 6; i++) {
    roomPostionArray[i] = new Array(i);    //在声明二维
    for (var j = 0; j < 9; j++) {
        roomPostionArray[i][j] = [0, GameObject];
    }
}
let roomTypeArray = new Array();         //先声明一维
for (var i = 0; i < 6; i++) {
    roomTypeArray[i] = new Array(i);    //在声明二维
    for (var j = 0; j < 9; j++) {
        roomTypeArray[i][j] = RoomType.noType;
    }
}





export class RoomSet extends Behaviour {
    //建坑
    createRoom(roomPositionX: number, roomPositionY: number, roomType: number, self: any) {
        if (roomType == 0 || roomPositionX + 1 > 6 || roomPositionX - 1 < -1) return;

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
        const backgroundImage = new ImageRenderer()



        if (roomType == 1) {
            backgroundImage.imagePath = 'assets/engineTest/images/testImage1.png'
        }
        else if (roomType == 2) { backgroundImage.imagePath = 'assets/engineTest/images/testImage.png' }
        self.child.addBehaviour(backgroundImage);
        this.storeBuildStatus(roomPositionX, roomPositionY, RoomStatus.canBuild, self.child)
        /* const image=new ImageRenderer();
         image.imagePath='assets//images//testImage.png'
         child.addBehaviour(image);*/


    };
    //记录每个坑的状态
    storeBuildStatus(x: number, y: number, roomStatus: RoomStatus, gameObject: GameObject) {
        roomPostionArray[x][y] = [roomStatus, gameObject];
        console.log(roomPostionArray[1][1])
    }
    setRoomType(x: number, y: number, roomType: RoomType) {
        roomTypeArray[x][y] = roomType;
    }
    //检测旁边的坑状态是否一样，相同则合并
    checkMerge(x: number, y: number) {

        if (x > 0 && roomTypeArray[x][y][1] != RoomType.noType) {
            if (roomPostionArray[x - 1][y][0] == 1 && roomTypeArray[x][y] == roomTypeArray[x - 1][y]) {
                console.log("merge")
                switch (roomTypeArray[x][y]) {
                    case 0:
                        const gameObeject = roomPostionArray[x - 1][y][1];
                        gameObeject.getBehaviour(ImageRenderer).imagePath = 'assets/engineTest/images/testImage2.png'
                }
            }
            else if (roomPostionArray[x + 1][y][0] == 1 && roomTypeArray[x][y] == roomTypeArray[x + 1][y] && x < 5) {
                console.log("merge1")
                switch (roomTypeArray[x][y]) {
                    case 0:
                        const gameObeject = roomPostionArray[x][y][1];
                        gameObeject.getBehaviour(ImageRenderer).imagePath = 'assets/engineTest/images/testImage2.png'
                }
            }




        }
    }
    checkNeighbor(x: number, y: number) {
        roomPostionArray[x][y][0] = RoomStatus.isBuild
        console.log(roomPostionArray[x][y][0])

        console.log(x, y)
        if (x - 1 < -1 || x + 1 > 6) return
if(roomPostionArray[x][y + 1][0] == 0){
        if (x - 1 >= 0 && roomPostionArray[x - 1][y][0] == 0 && roomPostionArray[x + 1][y][0] == 0) {
console.log('a')
            this.createRoom(x + 1, y, RoomStatus.canBuild, this.gameObject)
            this.createRoom(x, y + 1, RoomStatus.canBuild, this.gameObject)
            this.createRoom(x - 1, y, RoomStatus.canBuild, this.gameObject)
        }
        else if (x > 0 && roomPostionArray[x + 1][y][0] == 0) {
            console.log('b')
            this.createRoom(x + 1, y, RoomStatus.canBuild, this.gameObject)
            this.createRoom(x, y + 1, RoomStatus.canBuild, this.gameObject)

        }
        else if (x - 1 >= 0 && roomPostionArray[x - 1][y][0] == 0) {
            console.log('c')
            this.createRoom(x - 1, y, RoomStatus.canBuild, this.gameObject)
            this.createRoom(x, y + 1, RoomStatus.canBuild, this.gameObject)

        }
        else  {
            console.log("f")
            this.createRoom(x, y + 1, RoomStatus.canBuild, this.gameObject)
        }}
    }
    //在此定义脚本中的属性
    @number()
    roomtype = RoomStatus.empty;
    canUpdateRoom = false;

    //游戏开始时会执行一次
    onStart(): void {
        roomPostionArray[0][0] = -1
        roomPostionArray[0][1] = -1

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