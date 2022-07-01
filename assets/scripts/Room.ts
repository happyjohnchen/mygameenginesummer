import { ImageRenderer } from "../../src/behaviours/ImageRenderer";
import { getGameObjectById } from "../../src/engine";
import { Behaviour } from "../../src/engine/Behaviour";
import { boolean } from "../../src/engine/validators/boolean";
import { number } from "../../src/engine/validators/number";
import { RoomType } from "./modules/RoomModule";
import { RoomSet } from "./RoomSet";
type Compare<T, U> = (a: T, b: U) => boolean;
function findKey<T, U extends T[keyof T]>(
    record: T,
    value: U,
    compare: Compare<T[keyof T], U> = (a, b) => a === b
   ): keyof T | undefined {
     return (Object.keys(record) as Array<keyof T>).find(k =>
      compare(record[k], value)
     );
   }
export class Room extends Behaviour {

    //在此定义脚本中的属性
    @number()
    roomType;
    @number()
    positionX
    @number()
    positionY
    @number()
    roomStatus
    @boolean()
    canUpGrade
    
    clickStatus//0不可点，1可升级，2建起房子，3移动小人选择房间
    //static roomObjects:{ [id:string]: RoomType } = {}
    onStart() {

    }
    setRoomClick(statusNumber:number){
this.clickStatus=statusNumber
    }

charaterMoveStatus(){
    if(this.clickStatus==3)
    return [this.positionX*150,this.positionY*100]
}
changeRoomName(roomType:RoomType){//根据roomtype的值切换物体名字
this.gameObject.id=findKey(RoomType,roomType)

}

    //游戏开始时会执行一次
    onPlayStart() {

        this.gameObject.onClick = () => {
            console.log(this.gameObject)
            this.charaterMoveStatus()
            let thisRoom = this.gameObject.getBehaviour(Room)
            //想在这里判断点击了物体然后返回到父物体的roomSet中，然后就可以new 一个新的房间（create newroom()），并把新的房间状态改变
            console.log("点之前" + thisRoom.roomStatus)
            console.log("点之后" + thisRoom.roomStatus)
            if (thisRoom.roomStatus != 1) {
                this.gameObject.getBehaviour(ImageRenderer).imagePath = 'assets/engineTest/images/testImage1.png'
                thisRoom.roomStatus = 1

            }
            const tileMapGameObj = getGameObjectById("tileMap")
            thisRoom.roomType = RoomType.WaterFactory
            thisRoom.changeRoomName(thisRoom.roomType)
            console.log(this.gameObject.id)
            const roomSet = tileMapGameObj.getBehaviour(RoomSet)
            roomSet.storeBuildStatus(this.positionX, this.positionY, this.gameObject)
            roomSet.checkNeighbor(this.positionX, this.positionY)
            // roomSet.setRoomType(this.positionX, this.positionY, RoomType.WaterFactory)
            roomSet.checkMerge(this.positionX, this.positionY)

        };
    }

    //每次屏幕刷新执行
    onUpdate() {

    }

    //平均每16ms执行一次
    onTick(duringTime: number) {

    }
}