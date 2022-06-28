import { ImageRenderer } from "../../src/behaviours/ImageRenderer";
import { Prefab } from "../../src/behaviours/Prefab";
import { GameObject } from "../../src/engine";
import {Behaviour} from "../../src/engine/Behaviour";
import { Transform } from "../../src/engine/Transform";
import { number } from "../../src/engine/validators/number";
export enum RoomType {

    empty = 0,

    isBuild = 1,

    canBuild = 2
}
child:GameObject
function createRoom(roomPositinX:number,roomPositinY:number,roomType:number,self:any) {
   if(roomType==0)return;
   
   self.child = new GameObject();
    
    self.gameObject.addChild(self.child)
    const childTransform = new Transform();
    childTransform.x =0+roomPositinX;
    childTransform.y = 0+roomPositinY;
    self.child.addBehaviour(childTransform);
 const roomPrefab=new Prefab();
 if(roomType==1){
     roomPrefab.prefabPath='assets//prefabs//buildingPrefab.yaml'
 }
   else{roomPrefab.prefabPath='assets//prefabs//roomPrefab.yaml'}
    self.child.addBehaviour(roomPrefab);
 
   /* const image=new ImageRenderer();
    image.imagePath='assets//images//testImage.png'
    child.addBehaviour(image);*/
  

} ;
let roomPostionArray = new Array();         //先声明一维
       for(var i=0;i<9;i++){       
        roomPostionArray [i]=new Array(i);    //在声明二维
          for(var j=0;j<6;j++){      
            roomPostionArray [i][j]=0;
       }
       
}

function roomStart(){

for(let j=1;j<6;j++){
    roomPostionArray[0][j]=2
}
}
function checkNewRoomCanBuild(){
    for(var i=0;i<9;i++){         
          for(var j=0;j<6;j++){      
     if(roomPostionArray[i][j]==1){   
             roomPostionArray[i++][j]=2
     }
       }
}
}
export class RoomSet extends Behaviour {

    //在此定义脚本中的属性
    @number()
    roomtype =RoomType.empty;


    //游戏开始时会执行一次
    onStart(): void {
        roomStart();
     for(let j=1;j<6;j++)
        createRoom(0,0,roomPostionArray[0][j],this)
        

    }

    //每次屏幕刷新执行
    onUpdate() {
        checkNewRoomCanBuild()
    }

    //平均每16ms执行一次
    onTick(duringTime: number) {

    }
}