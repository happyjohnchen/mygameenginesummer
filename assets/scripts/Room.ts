import { ImageRenderer } from "../../src/behaviours/ImageRenderer";
import { GameObject, getBehaviourClassByName, getGameObjectById } from "../../src/engine";
import { Behaviour } from "../../src/engine/Behaviour";
import { Transform } from "../../src/engine/Transform";
import { boolean } from "../../src/engine/validators/boolean";
import { number } from "../../src/engine/validators/number";
import { AttributeSystem } from "./AttributeSystem";
import { createConfirmYes } from "./createConfirmYes";
import { findKey } from "./findEnumKey";
import { GameController } from "./GameController";
import { GameSet } from "./GameSet";
import { RoomModule, RoomPosition, RoomStatus, RoomType } from "./modules/RoomModule";
import { PersonClass } from "./PersonClass";
import { RoomClass } from "./RoomClass";
import { RoomSet, setRoomImage } from "./RoomSet";
import { UpdateBtn } from "./UpdateBtn";
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

    onlyClickRoom(roomLevel: number) {
        const roomSet = getGameObjectById("tileMap").getBehaviour(RoomSet)

        if (roomLevel > 1) {
            getGameObjectById("RoomSecondUi").active = true;
            roomSet.updateAndDestroyBtnID = this.roomModule.roomId;
        }
        else if (roomLevel == 1) {
            getGameObjectById("DestroyOnlyUi").active = true;
            roomSet.updateAndDestroyBtnID = this.roomModule.roomId;
        }
    }
    destroyRoom(roomId: number) {//1.单独的房间销毁；2.已升级的房间销毁

        let gameController = getGameObjectById("GameController").getBehaviour(GameController)
        let thisRoomGameObject = gameController.getRoomById(roomId)
        let thisRoom = thisRoomGameObject.getBehaviour(Room)
        const workRoom = this.checkRoomWhichHasRoomClass();
        if (workRoom.getBehaviour(Room).roomModule.people.length == 0) {//qqqqqqq
            console.log(thisRoom.roomModule.level)
            if (thisRoom.roomModule.level > 1) {
                let neighbourRoom = gameController.getRoomById(this.roomModule.neighbourId)
                this.clearRoomValue(neighbourRoom)
            }
            this.clearRoomValue(thisRoomGameObject)
        }
        else {
            getGameObjectById("Full").active = true
        }
    }
    getBorder(roomId: number) {//返回房间x,y值
        let gameController = getGameObjectById("GameController").getBehaviour(GameController)
        let thisRoomGameObject = gameController.getRoomById(roomId)
        let thisRoomModule = thisRoomGameObject.getBehaviour(Room).roomModule
        let xPosition = thisRoomModule.position.x
        let yPosition = thisRoomModule.position.y
        let position = new RoomPosition()
        position.x = -384 + xPosition * 149
        position.y = -166 + yPosition * 100
        if (thisRoomModule.level == 1) {
            return position
        }
        else if (thisRoomModule.level > 1) {
            console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa:")
            console.log(this.gameObject)
            let neighbourRoomGameObjectPositionX = gameController.getRoomById(thisRoomModule.neighbourId).getBehaviour(Room).roomModule.position.x
            if (neighbourRoomGameObjectPositionX < xPosition)
                position.x = neighbourRoomGameObjectPositionX * 150
            return position
        }

    }
    clearRoomValue(room: GameObject) {
        const roomlevelTable = {
            1: 20,
            2: 20,
            3: 30
        }
        let gameController = getGameObjectById("GameController").getBehaviour(GameController)

        console.log("clear")
        if (room.hasBehaviour(RoomClass)) {
            let roomClass = room.getBehaviour(RoomClass)
            room.removeBehaviour(roomClass)//合完许佳阳的放出来这2句

        }
        //room.getBehaviour(ImageRenderer).imagePath="灰色图片的路径"
        let roomModule = room.getBehaviour(Room).roomModule
        gameController.game.material += roomlevelTable[roomModule.level];
        roomModule.level = 0;
        roomModule.neighbourId = -1
        roomModule.roomType = RoomType.noType
        roomModule.roomStatus = RoomStatus.canBuild
        roomModule.hasRoomClass = false
        room.getBehaviour(ImageRenderer).imagePath = setRoomImage(roomModule.roomType, roomModule.level)


    }

    upgradeRoom(roomGameObject: GameObject) {//升级房间

        let roomModule = roomGameObject.getBehaviour(Room).roomModule
        console.log("aaaa" + roomModule.level)

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
            if (roomModule.hasRoomClass) {
                roomGameObject.getBehaviour(ImageRenderer).imagePath = setRoomImage(roomModule.roomType, roomModule.level, true)
                neighborRoom.getBehaviour(ImageRenderer).imagePath = setRoomImage(roomModule.roomType, roomModule.level, false)
            }
            else {
                roomGameObject.getBehaviour(ImageRenderer).imagePath = setRoomImage(roomModule.roomType, roomModule.level, false)
                neighborRoom.getBehaviour(ImageRenderer).imagePath = setRoomImage(roomModule.roomType, roomModule.level, true)
            }
            if (roomGameObject.hasBehaviour(RoomClass)) {
                roomGameObject.getBehaviour(RoomClass).setRoomLevel(3);

            }
            else {
                neighborRoom.getBehaviour(RoomClass).setRoomLevel(3);
            }
            console.log(neighborRoom)
        }
        else if (roomModule.roomStatus == RoomStatus.canBuild) {
            //升级成一级
            console.log("up")

            roomModule.roomStatus = 1
            roomModule.level = 1//建造升级
            roomGameObject.getBehaviour(ImageRenderer).imagePath = setRoomImage(this.roomModule.roomType, this.roomModule.level)
            let roomTransform = roomGameObject.getBehaviour(Transform)
            roomTransform.scaleX = 0.083
            roomTransform.scaleY = 0.083
            //roomModule.roomType=roomType
            roomGameObject.addBehaviour(new RoomClass())
            let roomClass = roomGameObject.getBehaviour(RoomClass)
            roomClass.setRoomid(roomModule.roomId)
            roomClass.setRoomType(roomModule.roomType)
            //xjy加了一个人口对接和等级
            roomClass.roomLevel = this.roomModule.level;
            roomModule.people = roomClass.peopleInRoom;
            roomModule.hasRoomClass = true;
        }
    }
    clickAndGetRoomID() {//点击room返回room的roomid
        console.log(this.gameObject.getBehaviour(Room).roomModule.roomId)
        return this.gameObject.getBehaviour(Room).roomModule.roomId
    }
    checkRoomWhichHasRoomClass() {
        if (this.roomModule.level == 1) {
            return this.gameObject;
        }
        else if (this.roomModule.level > 1)
            if (this.gameObject.hasBehaviour(RoomClass)) {
                return this.gameObject;
            }
            else {
                const neighborGameObject = getGameObjectById("GameController").getBehaviour(GameController).getRoomById(this.roomModule.neighbourId)
                return neighborGameObject;
            }
    }


    addPersonInRoom(personId: number) {//往房间里头加人物

        let person = getGameObjectById("GameController").getBehaviour(GameController).getPersonById(personId)
        const originRoom = person.getBehaviour(PersonClass).personModule.room
        if (originRoom == this.roomModule.roomId) return;
        const isFull = this.gameObject.getBehaviour(RoomClass).addPersonInRoom(personId)
        console.log(this.gameObject)
        console.log(isFull)
        if (!isFull) {
            getGameObjectById("PersonNot").active = true;
        }
        else {
            if (originRoom != 0) {
                console.log("111111111111111111111111")

                let room = getGameObjectById("GameController").getBehaviour(GameController).getRoomById(originRoom)
                const hasBehaviourRoom = room.getBehaviour(Room).checkRoomWhichHasRoomClass()
                hasBehaviourRoom.getBehaviour(RoomClass).removePersonInRoom(personId)
                console.log("add in 1")
            }

            person.getBehaviour(PersonClass).personModule.room = this.roomModule.roomId;
        }

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
        thisRoomModule.roomType = this.roomModule.roomType
        roomSet.checkNeighbor(this.roomModule.position)
        // roomSet.setRoomType(this.positionX, this.positionY, RoomType.WaterFactory)
        roomSet.checkMerge(this.roomModule.position)
        console.log(getGameObjectById("GameController").getBehaviour(GameController).game.rooms)
        this.canCreate = false;
        roomSet.buildRoomType = RoomType.noType;
        getGameObjectById("AttributeController").getBehaviour(AttributeSystem).consumeForMaterial(100)
    }
    //游戏开始时会执行一次
    onPlayStart() {
        this.canCreate = false;
        this.gameObject.onClick = () => {
            const tileMapGameObj = getGameObjectById("tileMap")
            const roomSet = tileMapGameObj.getBehaviour(RoomSet)
            console.log(roomSet.canChooseRoom)

            if (roomSet.canChooseRoom) {//room add person
                if (this.roomModule.level > 0) {
                    let personId = roomSet.personId
                    const workRoom = this.checkRoomWhichHasRoomClass()
                    if (personId != -1) {
                        workRoom.getBehaviour(Room).addPersonInRoom(personId)
                        roomSet.setRoomNotCanchoose();
                    }
                }
                roomSet.personId = -1;
                roomSet.canChooseRoom = false;
            }

            else if (roomSet.canBuildRoom && this.roomModule.level == 0 && this.roomModule.roomType == RoomType.noType) {//room build type
                const confirmUI = getGameObjectById("IsCreateUi");
                confirmUI.active = true
                getGameObjectById("YesBtn").getBehaviour(createConfirmYes).setRoom(this.gameObject);
            }

            else { this.onlyClickRoom(this.roomModule.level) }

        };
    }

    buildRoom() {

        const confirmUI = getGameObjectById("IsCreateUi");
        confirmUI.active = true
        this.canCreate = true;
        const tileMapGameObj = getGameObjectById("tileMap")
        const roomSet = tileMapGameObj.getBehaviour(RoomSet)
        this.roomModule.roomType = roomSet.getBuildRoom();

        this.create();
        roomSet.setRoomNotCanchoose();
        roomSet.confirmYesBtn = false;
        confirmUI.active = false;
    }
    //每次屏幕刷新执行
    onUpdate() {

    }

    //平均每16ms执行一次
    onTick(duringTime: number) {

    }
}