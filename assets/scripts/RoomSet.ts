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

export class RoomSet extends Behaviour {
    //建坑
    //在此定义脚本中的属性
    @number()
    roomtype = RoomStatus.empty;
    canUpdateRoom = false;

    //数组初始化
    roomGameObjectArray = new Array();
    roomSetID
    makeRoomGameObjectArray() {
        for (var i = 0; i < 6; i++) {
            this.roomGameObjectArray[i] = new Array(i);    //在声明二维
            for (var j = 0; j < 9; j++) {
                this.roomGameObjectArray[i][j] = 0;
            }
        }
    }
    //游戏开始时会执行一次
    onStart(): void {

    }
    onPlayStart() {
        this.roomSetID = 0
        this.makeRoomGameObjectArray()
        this.roomGameObjectArray[0][0] = -1
        this.roomGameObjectArray[0][1] = -1

        for (let i = 0; i < 2; i++)
            for (let j = 1; j < 6; j++)
                this.createRoom(j, i, 2, this.gameObject)
    }
    //每次屏幕刷新执行
    onUpdate() {
    }

    //平均每16ms执行一次
    onTick(duringTime: number) {
    }

    createRoom(roomPositionX: number, roomPositionY: number, roomType: number, self: any) {
        if (roomType == 0 || roomPositionX + 1 > 6 || roomPositionX - 1 < -1) return;//超出所建的范围
        this.roomSetID++;
        let gameController1 = new GameSet()
        console.log(gameController1.rooms)
        let roomChild = new GameObject();
        //self.addChild(self.child)

        let gameController = getGameObjectById("GameController").getBehaviour(GameController)
        console.log(gameController.game)
        gameController.addRoom(roomChild)
        const childTransform = new Transform();
        childTransform.x = 0 + roomPositionX * 150;
        childTransform.y = 0 + roomPositionY * 100;
        roomChild.addBehaviour(childTransform);
        const room = new Room();
        let RModule = new RoomModule()
        RModule.level = 0
        RModule.position = {x: roomPositionX, y: roomPositionY}
        RModule.roomId = this.roomSetID
        RModule.roomType = RoomType.noType
        RModule.roomStatus=RoomStatus.canBuild;
        room.roomModule=RModule
        roomChild.addBehaviour(room);
        const backgroundImage = new ImageRenderer()
        if (roomType == 1) {
            backgroundImage.imagePath = 'assets/engineTest/images/testImage1.png'
        }
        else if (roomType == 2) { backgroundImage.imagePath = 'assets/engineTest/images/testImage.png' }
        roomChild.addBehaviour(backgroundImage);
        this.storeBuildStatus(roomPositionX, roomPositionY, roomChild)

    };
    //记录每个坑的状态
    storeBuildStatus(x: number, y: number, gameObject: GameObject) {
        this.roomGameObjectArray[x][y] = gameObject;

    }

    getRoomBehabiour(gameObeject: GameObject) {
        return gameObeject.getBehaviour(Room)
    }

    mergeHouse(clickGameobject: GameObject, neighborGameObject: GameObject) {//房間合在一起
        const clickRoomData = this.getRoomBehabiour(clickGameobject).roomModule
        const neighborRoomData = this.getRoomBehabiour(neighborGameObject).roomModule
        if (neighborRoomData.level!=1) return;
        if (clickRoomData.roomType != neighborRoomData.roomType) return;
        clickRoomData.neighbourId = neighborRoomData.roomID
        neighborRoomData.neighbourId = clickRoomData.roomID
        clickRoomData.level = 2
        neighborRoomData.level = 2
        switch (clickRoomData.roomType) {
            case 0:
                clickGameobject.getBehaviour(ImageRenderer).imagePath = 'assets/engineTest/images/testImage2.png'

                neighborGameObject.getBehaviour(ImageRenderer).imagePath = 'assets/engineTest/images/testImage21.png'
        }
   
    }
    //检测旁边的坑状态是否一样，相同则合并
    checkMerge(x: number, y: number) {
        let clickRoom: GameObject
        let leftRoom: GameObject
        let rightRoom: GameObject
        clickRoom = this.roomGameObjectArray[x][y]
        const clickRoomData = this.getRoomBehabiour(clickRoom)
        if (x > 0 && x < 5) {
            leftRoom = this.roomGameObjectArray[x - 1][y]
            rightRoom = this.roomGameObjectArray[x + 1][y]
            if (this.roomGameObjectArray[x - 1][y] !== -1)
                this.mergeHouse(clickRoom, leftRoom)
            this.mergeHouse(clickRoom, rightRoom)
        }
        else if (x == 0) {
            rightRoom = this.roomGameObjectArray[x + 1][y]
            this.mergeHouse(clickRoom, rightRoom)
        }
        else if (x == 6) {
            leftRoom = this.roomGameObjectArray[x - 1][y]
            this.mergeHouse(leftRoom, clickRoom)
        }
    }
    checkNeighbor(x: number, y: number) {
        //检测邻居是否是空坑,如果是空的则变成可开发状态

        console.log(x, y)
        if (x - 1 < -1 || x + 1 > 6) return
        if (this.roomGameObjectArray[x][y + 1] == 0) {
            if (x - 1 >= 0 && this.roomGameObjectArray[x - 1][y] == 0 && this.roomGameObjectArray[x + 1][y] == 0) {
                console.log('a')
                this.createRoom(x + 1, y, RoomStatus.canBuild, this.gameObject)
                this.createRoom(x, y + 1, RoomStatus.canBuild, this.gameObject)
                this.createRoom(x - 1, y, RoomStatus.canBuild, this.gameObject)
            }
            else if (x > 0 && this.roomGameObjectArray[x + 1][y] == 0) {
                console.log('b')
                this.createRoom(x + 1, y, RoomStatus.canBuild, this.gameObject)
                this.createRoom(x, y + 1, RoomStatus.canBuild, this.gameObject)

            }
            else if (x - 1 >= 0 && this.roomGameObjectArray[x - 1][y] == 0) {
                console.log('c')
                this.createRoom(x - 1, y, RoomStatus.canBuild, this.gameObject)
                this.createRoom(x, y + 1, RoomStatus.canBuild, this.gameObject)

            }
            else {
                console.log("f")
                this.createRoom(x, y + 1, RoomStatus.canBuild, this.gameObject)
            }
        }
    }
}