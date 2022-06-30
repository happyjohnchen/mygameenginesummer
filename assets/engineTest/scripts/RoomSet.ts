
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
let roomGameObjectArray = new Array();         //先声明一维
for (var i = 0; i < 6; i++) {
    roomGameObjectArray[i] = new Array(i);    //在声明二维
    for (var j = 0; j < 9; j++) {
        roomGameObjectArray[i][j] = 0;
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
        if (roomType == 0 || roomPositionX + 1 > 6 || roomPositionX - 1 < -1) return;//超出所建的范围
        self.child = new GameObject();
        self.addChild(self.child)
        const childTransform = new Transform();
        childTransform.x = 0 + roomPositionX * 150;
        childTransform.y = 0 + roomPositionY * 100;
        self.child.addBehaviour(childTransform);
        const room = new Room();
        room.positionX = roomPositionX;
        room.positionY = roomPositionY;
        room.roomStatus = RoomStatus.canBuild;
        room.roomType = RoomType.noType;
        room.canUpGrade=true
        self.child.addBehaviour(room);
        const backgroundImage = new ImageRenderer()
        if (roomType == 1) {
            backgroundImage.imagePath = 'assets/engineTest/images/testImage1.png'
        }
        else if (roomType == 2) { backgroundImage.imagePath = 'assets/engineTest/images/testImage.png' }
        self.child.addBehaviour(backgroundImage);
        this.storeBuildStatus(roomPositionX, roomPositionY, self.child)

    };
    //记录每个坑的状态
    storeBuildStatus(x: number, y: number, gameObject: GameObject) {
        roomGameObjectArray[x][y] = gameObject;

    }
  
    getRoomType(gameObeject: GameObject) {
        return gameObeject.getBehaviour(Room)
    }

    mergeHouse(clickGameobject: GameObject, neighborGameObject: GameObject) {//房間合在一起
        const clickRoomData = this.getRoomType(clickGameobject)
        const neighborRoomData = this.getRoomType(neighborGameObject)
        if(!neighborRoomData.canUpGrade)return;
        if (clickRoomData.roomType != neighborRoomData.roomType) return;
       
        switch (clickRoomData.roomType) {
            case 0:
                clickGameobject.getBehaviour(ImageRenderer).imagePath = 'assets/engineTest/images/testImage2.png'
                neighborGameObject.getBehaviour(ImageRenderer).imagePath = 'assets/engineTest/images/testImage21.png'
        }
        clickRoomData.canUpGrade=false
        neighborRoomData.canUpGrade=false
    }
    //检测旁边的坑状态是否一样，相同则合并
    checkMerge(x: number, y: number) {
        let clickRoom: GameObject
        let leftRoom: GameObject
        let rightRoom: GameObject
        clickRoom = roomGameObjectArray[x][y]
        const clickRoomData = this.getRoomType(clickRoom)
        if (x > 0 && x < 5) {
            leftRoom = roomGameObjectArray[x - 1][y]
            rightRoom = roomGameObjectArray[x + 1][y]
            this.mergeHouse(clickRoom, leftRoom)
            this.mergeHouse(clickRoom, rightRoom)
        }
        else if (x == 0) {
            rightRoom = roomGameObjectArray[x + 1][y]
            this.mergeHouse(clickRoom, rightRoom)
        }
        else if (x == 6) {
            leftRoom = roomGameObjectArray[x - 1][y]
            this.mergeHouse(leftRoom, clickRoom)
        }
    }
    checkNeighbor(x: number, y: number) {

     // const bottomRoomData=roomGameObjectArray[x][y + 1].getBehaviour(Room)

        console.log(x, y)
        if (x - 1 < -1 || x + 1 > 6) return
        if ( roomGameObjectArray[x][y+1] == 0) {
            if (x - 1 >= 0 && roomGameObjectArray[x - 1][y] == 0 && roomGameObjectArray[x + 1][y] == 0) {
                console.log('a')
                this.createRoom(x + 1, y, RoomStatus.canBuild, this.gameObject)
                this.createRoom(x, y + 1, RoomStatus.canBuild, this.gameObject)
                this.createRoom(x - 1, y, RoomStatus.canBuild, this.gameObject)
            }
            else if (x > 0 && roomGameObjectArray[x + 1][y] == 0) {
                console.log('b')
                this.createRoom(x + 1, y, RoomStatus.canBuild, this.gameObject)
                this.createRoom(x, y + 1, RoomStatus.canBuild, this.gameObject)

            }
            else if (x - 1 >= 0 && roomGameObjectArray[x - 1][y] == 0) {
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
    //在此定义脚本中的属性
    @number()
    roomtype = RoomStatus.empty;
    canUpdateRoom = false;

    //游戏开始时会执行一次
    onStart(): void {
        roomGameObjectArray[0][0] = -1
        roomGameObjectArray[0][1] = -1

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
}