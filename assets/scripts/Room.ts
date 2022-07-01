import { ImageRenderer } from "../../src/behaviours/ImageRenderer";
import { GameObject, getBehaviourClassByName, getGameObjectById } from "../../src/engine";
import { Behaviour } from "../../src/engine/Behaviour";
import { boolean } from "../../src/engine/validators/boolean";
import { number } from "../../src/engine/validators/number";
import { findKey } from "./findEnumKey";
import { GameController } from "./GameController";
import { GameSet } from "./GameSet";
import { RoomModule, RoomStatus, RoomType } from "./modules/RoomModule";
import { RoomSet } from "./RoomSet";
export class Room extends Behaviour {

    //在此定义脚本中的属性

    roomModule: RoomModule



    // clickStatus//0不可点，1可升级，2建起房子，3移动小人选择房间
    //static roomObjects:{ [id:string]: RoomType } = {}
    onStart() {

    }
    /* setRoomClick(statusNumber: number) {
         this.clickStatus = statusNumber
     }
 
     charaterMoveStatus() {
         if (this.clickStatus == 3)
             return [this.roomModule.position.x * 150, this.roomModule.position.y * 100]
     }*/
    changeRoomName(roomType: RoomType) {//根据roomtype的值切换物体名字
        this.gameObject.id = findKey(RoomType, roomType)
    }
    addRoomClass() {
        //this.gameObject.addBehaviour(Roomclass);
        //gameObeject.removeBehaviour(Roomclass);
    }

    destroyRoom(roomId: number) {//1.单独的房间销毁；2.已升级的房间销毁
       
        let gameController = getGameObjectById("GameController").getBehaviour(GameController)
        let thisRoomGameObject=gameController.getRoomById(roomId)
        let thisRoom = thisRoomGameObject.getBehaviour(Room)
        if (thisRoom.roomModule.level == 1) {
            this.clearRoomValue(thisRoomGameObject)

        }
        else if (thisRoom.roomModule.level > 1) {
            let neighbourRoom = gameController.getRoomById(this.roomModule.neighbourId)
            this.clearRoomValue(thisRoomGameObject)
            this.clearRoomValue(neighbourRoom)
        }
    }
    clearRoomValue(room: GameObject) {
        //room.removeBehaviour(RoomClass)//合完许佳阳的放出来这句
        //room.getBehaviour(ImageRenderer).imagePath="灰色图片的路径"
      let roomModule=  room.getBehaviour(Room).roomModule
        roomModule.level = 0;
        roomModule.neighbourId = -1
        roomModule.roomType = RoomType.noType
        roomModule.roomStatus = RoomStatus.canBuild
        
        
    }
    upgradeRoom(roomGameObject: GameObject) {//升级房间
        let roomModule = roomGameObject.getBehaviour(Room).roomModule
        if (roomModule.roomStatus == 0) {
            //升级成一级
            this.gameObject.getBehaviour(ImageRenderer).imagePath = 'assets/engineTest/images/testImage1.png'
            roomModule.roomStatus = 1
            roomModule.level = 1//建造升级
            //roomGameObject.addBehaviour(RoomClass)
        }
        else if (roomModule.level == 1) {
            roomModule.level++
        }
        else if (roomModule.level == 2) {
            roomModule.level++
            let gameController = getGameObjectById("GameController").getBehaviour(GameController)
            let neighborRoom = gameController.getRoomById(roomModule.neighbourId)
            neighborRoom.getBehaviour(Room).roomModule.level++
        }
    }

    //游戏开始时会执行一次
    onPlayStart() {
        //console.log(getGameObjectById("GameController").getBehaviour(GameController).game.rooms)
        this.gameObject.onClick = () => {

            //this.charaterMoveStatus()
            let thisRoom = this.gameObject.getBehaviour(Room)
            let thisRoomModule = thisRoom.roomModule
            //想在这里判断点击了物体然后返回到父物体的roomSet中，然后就可以new 一个新的房间（create newroom()），并把新的房间状态改变
            //console.log("点之前" + thisRoomModule.roomStatus)
            //console.log("点之后" + thisRoomModule.roomStatus)
            this.upgradeRoom(this.gameObject)
            const tileMapGameObj = getGameObjectById("tileMap")
            thisRoomModule.roomType = RoomType.WaterFactory

            thisRoom.changeRoomName(thisRoomModule.roomType)
            //console.log(this.gameObject.id)
            const roomSet = tileMapGameObj.getBehaviour(RoomSet)
            roomSet.storeBuildStatus(this.roomModule.position.x, this.roomModule.position.x, this.gameObject)
            roomSet.checkNeighbor(this.roomModule.position)
            // roomSet.setRoomType(this.positionX, this.positionY, RoomType.WaterFactory)
            roomSet.checkMerge(this.roomModule.position)
            //console.log(getGameObjectById("GameController").getBehaviour(GameController).game.rooms)

            console.log(getGameObjectById("GameController").getBehaviour(GameController).game.rooms)

        };
    }

    //每次屏幕刷新执行
    onUpdate() {

    }

    //平均每16ms执行一次
    onTick(duringTime: number) {

    }
}