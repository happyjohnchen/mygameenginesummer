import { ImageRenderer } from "../../src/behaviours/ImageRenderer";
import { GameObject, getBehaviourClassByName, getGameObjectById } from "../../src/engine";
import { Behaviour } from "../../src/engine/Behaviour";
import { boolean } from "../../src/engine/validators/boolean";
import { number } from "../../src/engine/validators/number";
import { findKey } from "./findEnumKey";
import { GameController } from "./GameController";
import { GameSet } from "./GameSet";
import { RoomModule, RoomPosition, RoomStatus, RoomType } from "./modules/RoomModule";
import { RoomClass } from "./RoomClass";
import { RoomSet, setRoomImage } from "./RoomSet";
export class Room extends Behaviour {

    //在此定义脚本中的属性

    roomModule: RoomModule
    canCreate


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
    addRoomClass() {//合完许佳阳的就放粗来
        //this.gameObject.addBehaviour(Roomclass);
        //gameObeject.removeBehaviour(Roomclass);
    }

    destroyRoom(roomId: number) {//1.单独的房间销毁；2.已升级的房间销毁

        let gameController = getGameObjectById("GameController").getBehaviour(GameController)
        let thisRoomGameObject = gameController.getRoomById(roomId)
        let thisRoom = thisRoomGameObject.getBehaviour(Room)
        console.log(thisRoom.roomModule.level)
        if (thisRoom.roomModule.level == 1) {
            this.clearRoomValue(thisRoomGameObject)

        }
        else if (thisRoom.roomModule.level > 1) {
            let neighbourRoom = gameController.getRoomById(this.roomModule.neighbourId)
            this.clearRoomValue(thisRoomGameObject)
            this.clearRoomValue(neighbourRoom)
        }
    }
    getBorder(roomId: number) {//返回房间x,y值
        let gameController = getGameObjectById("GameController").getBehaviour(GameController)
        let thisRoomGameObject = gameController.getRoomById(roomId)
        let thisRoomModule = thisRoomGameObject.getBehaviour(Room).roomModule
        let xPosition = thisRoomModule.position.x
        let yPosition = thisRoomModule.position.y
        let position = new RoomPosition()
        position.x = xPosition * 150
        position.y = yPosition * 100
        if (thisRoomModule.level == 1) {
            return position
        }
        else if (thisRoomModule.level > 1) {
            let neighbourRoomGameObjectPositionX = gameController.getRoomById(thisRoomModule.neighbourId).getBehaviour(Room).roomModule.position.x
            if (neighbourRoomGameObjectPositionX < xPosition)
                position.x = neighbourRoomGameObjectPositionX * 150
            return position
        }

    }
    clearRoomValue(room: GameObject) {
        let roomClass = room.getBehaviour(RoomClass)
        room.removeBehaviour(roomClass)//合完许佳阳的放出来这2句
        //room.getBehaviour(ImageRenderer).imagePath="灰色图片的路径"
        let roomModule = room.getBehaviour(Room).roomModule
        roomModule.level = 0;
        roomModule.neighbourId = -1
        roomModule.roomType = RoomType.noType
        roomModule.roomStatus = RoomStatus.canBuild
        console.log("clear" + room)

    }

    upgradeRoom(roomGameObject: GameObject) {//升级房间

        let roomModule = roomGameObject.getBehaviour(Room).roomModule
        console.log(roomModule.level)

        if (roomModule.level == 1) {
            console.log("up1")
            roomModule.level++

        }
        else if (roomModule.level == 2) {
            console.log("up2")
            roomModule.level++
            let gameController = getGameObjectById("GameController").getBehaviour(GameController)
            let neighborRoom = gameController.getRoomById(roomModule.neighbourId)
            neighborRoom.getBehaviour(Room).roomModule.level++

        }
        else if (roomModule.roomStatus == RoomStatus.canBuild) {
            //升级成一级
            console.log("up")
          
            roomModule.roomStatus = 1
            roomModule.level = 1//建造升级
            roomGameObject.getBehaviour(ImageRenderer).imagePath = setRoomImage(this.roomModule.roomType,this.roomModule.level)
          
            //roomModule.roomType=roomType
            roomGameObject.addBehaviour(new RoomClass())
            let roomClass = roomGameObject.getBehaviour(RoomClass)
            roomClass.setRoomid(roomModule.roomId)
            roomClass.setRoomType(roomModule.roomType)
            //xjy加了一个人口对接和等级
            roomClass.roomLevel = this.roomModule.level;
            roomModule.people = roomClass.peopleInRoom;
        }
    }
    clickAndGetRoomID() {//点击room返回room的roomid
        console.log(this.gameObject.getBehaviour(Room).roomModule.roomId)
        return this.gameObject.getBehaviour(Room).roomModule.roomId
    }
    create() {
        console.log("creat")
        const tileMapGameObj = getGameObjectById("tileMap")
        const roomSet = tileMapGameObj.getBehaviour(RoomSet)
        let thisRoom = this.gameObject.getBehaviour(Room)
      
        let thisRoomModule = thisRoom.roomModule
        //想在这里判断点击了物体然后返回到父物体的roomSet中，然后就可以new 一个新的房间（create newroom()），并把新的房间状态改变
        //console.log("点之前" + thisRoomModule.roomStatus)
        //console.log("点之后" + thisRoomModule.roomStatus)
        console.log("level:" + thisRoom.roomModule.level)
        this.upgradeRoom(this.gameObject)
        console.log("level:" + thisRoom.roomModule.level)


        //王璐：在这里是升级，然后需要先选ui进行什么操作再升级,这只是个示例，你需要从ui获取roomType的值
        thisRoomModule.roomType = this.roomModule.roomType
      
        //thisRoom.changeRoomName(thisRoomModule.roomType)
        //console.log(this.gameObject.id)

        roomSet.storeBuildStatus(this.roomModule.position.x, this.roomModule.position.x, this.gameObject)
        roomSet.checkNeighbor(this.roomModule.position)
        // roomSet.setRoomType(this.positionX, this.positionY, RoomType.WaterFactory)
        roomSet.checkMerge(this.roomModule.position)

        //console.log(getGameObjectById("GameController").getBehaviour(GameController).game.rooms)

        console.log(getGameObjectById("GameController").getBehaviour(GameController).game.rooms)
        this.canCreate = false;
        roomSet.buildRoomType=RoomType.noType;
    }
    //游戏开始时会执行一次
    onPlayStart() {
        this.canCreate = false;
        this.gameObject.onClick = () => {


            /* 测试destroy
            console.log(getGameObjectById("GameController").getBehaviour(GameController).game.rooms)
             //console.log(getGameObjectById("Rooms").children)
 const id =this.clickAndGetRoomID()
             this.destroyRoom(id)
             console.log(getGameObjectById("GameController").getBehaviour(GameController).game.rooms)*/

            const tileMapGameObj = getGameObjectById("tileMap")
            const roomSet = tileMapGameObj.getBehaviour(RoomSet)
            console.log(roomSet.canChooseRoom)
            if (roomSet.canChooseRoom ) {
                if(this.roomModule.level > 0){
                    console.log("bbbbbbbbbbbbbbbbbbbbbbbbbbbb")
                    if (this.gameObject.hasBehaviour(RoomClass)) {
                        this.gameObject.getBehaviour(RoomClass).addPersonInRoom(roomSet.personId);
                        console.log("add in 1")
                    }
                    else {
                        const neighborRoom = getGameObjectById("GameController").getBehaviour(GameController).getRoomById(this.roomModule.neighbourId);
                        neighborRoom.getBehaviour(RoomClass).addPersonInRoom(roomSet.personId);
                        console.log("add in room")
                    }
                    console.log("personid:" + roomSet.personId)
                    roomSet.setRoomNotCanchoose();
                }}

                else if(roomSet.canBuildRoom){
                    console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
                    this.canCreate = true;
                    this.roomModule.roomType=roomSet.getBuildRoom();
                    if(this.roomModule.level==0&&this.roomModule.roomType!=RoomType.noType&&this.roomModule.roomType!=RoomType.Entrance)
                    this.create();
                    roomSet.setRoomNotCanchoose();
                }
            
           
            roomSet.canChooseRoom = false;
        };
    }
    
    //每次屏幕刷新执行
    onUpdate() {

    }

    //平均每16ms执行一次
    onTick(duringTime: number) {

    }
}