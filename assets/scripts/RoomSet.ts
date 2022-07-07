import { transform } from "_@ts-morph_common@0.16.0@@ts-morph/common/lib/typescript";
import { ImageRenderer } from "../../src/behaviours/ImageRenderer";
import { Prefab } from "../../src/behaviours/Prefab";
import { GameObject, getGameObjectById } from "../../src/engine";
import { Behaviour } from "../../src/engine/Behaviour";
import { Transform } from "../../src/engine/Transform";
import { number } from "../../src/engine/validators/number";
import { GameController } from "./GameController";
import { GameSet } from "./GameSet";
import { RoomModule, RoomPosition, RoomStatus, RoomType } from "./modules/RoomModule";
import { Room } from "./Room";
import { RoomClass } from "./RoomClass";
export function setRoomImage(roomtype: RoomType, roomLevel: number, isLeft?: boolean) {
    let imagePath: string

    switch (roomLevel) {//加图片
        case 0: imagePath = 'assets/images/buildSystem/canBuild.png'//灰色透明图片
            break;
        case 1:
            switch (roomtype) {
                case 0: imagePath = 'assets/images/buildSystem/WaterFactory.png'//WaterFactory
                    break;
                case 1: imagePath = 'assets/images/buildSystem/EnergyFactory.png'//EnergyFactory
                    break;
                case 2: imagePath = 'assets/images/buildSystem/FoodFactory.png'//FoodFactory
                    break;
            }
            break;

        case 2: case 3:

            switch (roomtype) {
                case 0:
                    if (isLeft) {
                        imagePath = 'assets/images/buildSystem/WaterFactory_left.png'//WaterFactory
                    }
                    else {
                        imagePath = 'assets/images/buildSystem/WaterFactory_right.png'//WaterFactory
                    }
                    break;
                case 1:
                    if (isLeft) {
                        imagePath = 'assets/images/buildSystem/EnergyFactory_left.png'//EnergyFactory
                    }
                    else {
                        imagePath = 'assets/images/buildSystem/EnergyFactory_right.png'//EnergyFactory
                    }
                    break;
                case 2: if (isLeft) {
                    imagePath = 'assets/images/buildSystem/FoodFactory_left.png'//FoodFactory
                }
                else {
                    imagePath = 'assets/images/buildSystem/FoodFactory_right.png'//FoodFactory
                }
                    break;
            }
            break;

    }
    return imagePath
}
export class RoomSet extends Behaviour {

    //在此定义脚本中的属性
    @number()
    roomtype = RoomStatus.empty;
    canBuildRoom = false;
    canChooseRoom = false
    buildRoomType: RoomType
    canShowSecondUi = false
    personId
    roomSetID
    updateAndDestroyBtnID
    //游戏开始时会执行一次
    onStart(): void {

    }
    onPlayStart() {
        this.roomSetID = 0
        console.log(getGameObjectById("GameController").getBehaviour(GameController).game.rooms)


        for (let j = 3; j < 6; j++) { this.createRoom(j, 0, RoomStatus.canBuild) }
        for (let j = 1; j < 6; j++) { this.createRoom(j, 1, RoomStatus.canBuild) }

    }
    //每次屏幕刷新执行
    onUpdate() {
    }

    //平均每16ms执行一次
    onTick(duringTime: number) {
    }

    createRoom(roomPositionX: number, roomPositionY: number, roomStatus: number) {
        if (roomPositionX + 1 > 6 || roomPositionX - 1 < -1) return;//超出所建的范围
        this.roomSetID++;

        //console.log(gameController1.rooms)
        let roomChild = new GameObject();
        //this.gameObject.addChild(roomChild)

        let gameController = getGameObjectById("GameController").getBehaviour(GameController)
        //console.log(gameController.game)
        gameController.addRoom(roomChild)
        const childTransform = new Transform();
        childTransform.x = -384 + roomPositionX * 149;
        childTransform.y = -166 + roomPositionY * 100;
        childTransform.scaleX = 0.083;
        childTransform.scaleY = 0.083;
        roomChild.addBehaviour(childTransform);
        const room = new Room();
        let RModule = new RoomModule()
        RModule.level = 0
        RModule.position = { x: roomPositionX, y: roomPositionY }
        RModule.roomId = this.roomSetID
        RModule.roomType = RoomType.noType
        RModule.roomStatus = RoomStatus.canBuild;
        room.roomModule = RModule
        roomChild.addBehaviour(room);

        const backgroundImage = new ImageRenderer()

        backgroundImage.imagePath = setRoomImage(RModule.roomType, RModule.level)
        roomChild.addBehaviour(backgroundImage);
        let sonChild = new GameObject();
        roomChild.addChild(sonChild)
        const sonTransform = new Transform();
        const sonImage = new ImageRenderer()
        sonImage.imagePath = 'assets/images/buildSystem/Nochose.png'

        sonChild.addBehaviour(sonTransform)
        sonChild.addBehaviour(sonImage);


    };
    setbuildRoom(roomtype: RoomType) {//建造房间
        this.buildRoomType = roomtype;
    }
    getBuildRoom() {
        return this.buildRoomType;
    }
    setRoomNotCanchoose() {

        const rooms = getGameObjectById("GameController").getBehaviour(GameController).game.rooms;
        for (const room of rooms) {
            const image = room.children[0].getBehaviour(ImageRenderer);

            image.imagePath = 'assets/images/buildSystem/Nochose.png'
        }
        this.canBuildRoom = false
    }
    setRoomCanChoose(personId: number) {//选框
        this.canChooseRoom = true;
        this.personId = personId;
        const rooms = getGameObjectById("GameController").getBehaviour(GameController).game.rooms;
        for (const room of rooms) {
            const modules = room.getBehaviour(Room).roomModule
            const roomLevel = modules.level
            //console.log("childrem")
            //console.log(room.child)
            const image = room.children[0].getBehaviour(ImageRenderer);


            if (roomLevel > 1) {
                if (room.hasBehaviour(RoomClass)) {
                    image.imagePath = 'assets/images/buildSystem/bigChose_left.png'
                    console.log("image1")
                }
                else {
                    image.imagePath = 'assets/images/buildSystem/bigChose_right.png'
                    console.log("image2")
                }
            }
            else if (roomLevel == 1) {
                image.imagePath = 'assets/images/buildSystem/chose.png'
            }



        }
    }
    setRoomCanBuild() {//选框
        const rooms = getGameObjectById("GameController").getBehaviour(GameController).game.rooms;
        for (const room of rooms) {
            const modules = room.getBehaviour(Room).roomModule
            const roomLevel = modules.level
            //console.log("childrem")
            //console.log(room.child)
            const image = room.children[0].getBehaviour(ImageRenderer);
            if (roomLevel == 0) {

                image.imagePath = 'assets/images/buildSystem/chose.png'
                console.log("image1")

            }
        }
        this.canBuildRoom = true;
    }

    getRoomBehabiour(gameObeject: GameObject) {
        // console.log(gameObeject)
        return gameObeject.getBehaviour(Room)
    }
    removeRoomClass(gameObeject: GameObject) {
        const roomclass = gameObeject.getBehaviour(RoomClass)
        gameObeject.removeBehaviour(roomclass);
    }
    mergeHouse(clickGameobject: GameObject, neighborGameObject: GameObject) {//房間合在一起
        let clickRoom = this.getRoomBehabiour(clickGameobject)
        let neighborRoom = this.getRoomBehabiour(neighborGameObject)
        const clickRoomData = clickRoom.roomModule
        const neighborRoomData = neighborRoom.roomModule
        console.log(clickRoom)
        if (neighborRoomData.level == 1 && clickRoomData.roomType == neighborRoomData.roomType) {
            console.log("merge")
            console.log("1:")
            console.log(clickRoom)
            console.log("2:")
            console.log(neighborRoom)
            clickRoomData.neighbourId = neighborRoomData.roomId
            neighborRoomData.neighbourId = clickRoomData.roomId
            clickRoom.upgradeRoom(clickGameobject)
            neighborRoom.upgradeRoom(neighborGameObject)
            clickGameobject.getBehaviour(RoomClass).setRoomLevel(2);
            this.removeRoomClass(neighborGameObject)//右边的房间去掉roomclass的behaviour

            clickGameobject.getBehaviour(ImageRenderer).imagePath = setRoomImage(clickRoomData.roomType, clickRoomData.level, true)
            neighborGameObject.getBehaviour(ImageRenderer).imagePath = setRoomImage(neighborRoomData.roomType, neighborRoomData.level, false)

        }
    }



    getRoomByXY(x: number, y: number) {//根据xy获取room

        let gameController = getGameObjectById("GameController").getBehaviour(GameController)
        let roomPositon = new RoomPosition()
        roomPositon.x = x
        roomPositon.y = y
        let room = gameController.getRoomByPosition(roomPositon)
        if (room)
            return room
        else {
            return null
        }
    }
    //检测旁边的坑状态是否一样，相同则合并
    checkMerge(position: RoomPosition) {
        let gameController = getGameObjectById("GameController").getBehaviour(GameController)
        let leftPositon = new RoomPosition()
        leftPositon = { x: position.x - 1, y: position.y }
        let rightPositon = new RoomPosition()
        rightPositon = { x: position.x + 1, y: position.y }
        let clickRoom: GameObject
        let leftRoom: GameObject
        let rightRoom: GameObject
        clickRoom = gameController.getRoomByPosition(position)
        if (position.x > 0 && position.x < 6) {
            leftRoom = gameController.getRoomByPosition(leftPositon)
            console.log("left")
            console.log(leftRoom)
            rightRoom = gameController.getRoomByPosition(rightPositon)
            if (leftRoom != null)
                this.mergeHouse(leftRoom, clickRoom)
            if (rightRoom != null)
                this.mergeHouse(clickRoom, rightRoom)
        }
        else if (position.x == 0) {
            console.log("left1")
            console.log(rightRoom)
            rightRoom = gameController.getRoomByPosition(rightPositon)
            this.mergeHouse(clickRoom, rightRoom)
        }
        else if (position.x == 6) {
            console.log("left2")
            console.log(leftRoom)
            leftRoom = gameController.getRoomByPosition(leftPositon)
            this.mergeHouse(leftRoom, clickRoom)
        }
    }
    checkNeighbor(position: RoomPosition) {
        //检测邻居是否是空坑,如果是空的则变成待开发状态
        if (position.y == 0) return;
        let bottomRoom = this.getRoomByXY(position.x, position.y + 1)
        let leftRoom = this.getRoomByXY(position.x - 1, position.y)
        let rightRoom = this.getRoomByXY(position.x + 1, position.y)
        let topRoom = this.getRoomByXY(position.x, position.y - 1);
        if (position.x - 1 >= 0 && leftRoom == null && position.y != 1 && position.y != 2) this.createRoom(position.x - 1, position.y, RoomStatus.canBuild);
        if (position.x < 5 && rightRoom == null) this.createRoom(position.x + 1, position.y, RoomStatus.canBuild);
        if (bottomRoom == null) this.createRoom(position.x, position.y + 1, RoomStatus.canBuild);
        if (topRoom == null && position.y > 2) this.createRoom(position.x, position.y - 1, RoomStatus.canBuild);
        if (position.x - 1 >= 0 && leftRoom == null && position.y == 2) this.createRoom(position.x - 1, position.y, RoomStatus.canBuild);
    }
}