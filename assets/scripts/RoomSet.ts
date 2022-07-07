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
export function setRoomImage(roomtype: RoomType, roomStatus: RoomStatus) {
    let imagePath: string
    switch (roomStatus) {//加图片
        case 1:
            switch (roomtype) {
                case 1: imagePath = 'assets/engineTest/images/testImage1.png'//WaterFactory
                    break;
                case 2: imagePath = 'assets/engineTest/images/testImage2.png'//EnergyFactory
                    break;
                case 3: imagePath = 'assets/engineTest/images/testImage2.png'//FoodFactory
                    break;
            }
            break;

        case 2:

            imagePath = 'assets/engineTest/images/testImage2.png'//灰色透明图片
            break;

    }
    return imagePath
}
export class RoomSet extends Behaviour {
    //建坑
    //在此定义脚本中的属性
    @number()
    roomtype = RoomStatus.empty;
    canUpdateRoom = false;
canChooseRoom=false
buildRoomType:RoomType
    //数组初始化
personId
    roomSetID

    //游戏开始时会执行一次
    onStart(): void {

    }
    onPlayStart() {
        this.roomSetID = 0
        console.log(getGameObjectById("GameController").getBehaviour(GameController).game.rooms)
        for (let i = 0; i < 2; i++)
            for (let j = 1; j < 6; j++)
                this.createRoom(j, i, 2)
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
        childTransform.x = 0 + roomPositionX * 150;
        childTransform.y = -200 + roomPositionY * 100;
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
        if (roomStatus == RoomStatus.canBuild) {
            backgroundImage.imagePath = 'assets/engineTest/images/testImage.png'
        }

        roomChild.addBehaviour(backgroundImage);
        let sonChild = new GameObject();
        roomChild.addChild(sonChild)
        const sonTransform = new Transform();
        const sonImage = new ImageRenderer()
        sonImage.imagePath='assets/engineTest/images/Nochose.png'
        sonTransform.scaleX=0.1
        sonTransform.scaleY=0.1
        sonChild.addBehaviour(sonTransform)
        sonChild.addBehaviour(sonImage);
        this.storeBuildStatus(roomPositionX, roomPositionY, roomChild)

    };
    setbuildRoom(roomtype:RoomType){//建造房间
this.buildRoomType= roomtype;
    }
    getBuildRoom(){
return this.buildRoomType;
    }
setRoomNotCanCanchoose(){
    
    const rooms = getGameObjectById("GameController").getBehaviour(GameController).game.rooms;
    for (const room of rooms) {
        const image=room.children[0].getBehaviour(ImageRenderer);
        image.imagePath='assets/engineTest/images/Nochose.png'
    }
}
    setRoomCanChoose(personId:number) {
        this.canChooseRoom=true;
        this.personId=personId;
        const rooms = getGameObjectById("GameController").getBehaviour(GameController).game.rooms;
        for (const room of rooms) {
            const modules = room.getBehaviour(Room).roomModule
            const roomLevel = modules.level
            //console.log("childrem")
            //console.log(room.child)
            const image=room.children[0].getBehaviour(ImageRenderer);
            if(roomLevel>0){
              
                if (roomLevel > 1) {
                    if (room.hasBehaviour(RoomClass)) {
                        image.imagePath = 'assets/engineTest/images/bigChose_left.png'
                        console.log("image1")
                    }
                    else {
                        image.imagePath = 'assets/engineTest/images/bigChose_right.png'
                        console.log("image2")
                    }
                }
                else if (roomLevel == 1) {
                    image.imagePath= 'assets/engineTest/images/chose.png'
                }
            
            }
           
        }
    }
    //记录每个坑的状态
    storeBuildStatus(x: number, y: number, gameObject: GameObject) {
        //this.roomGameObjectArray[x][y] = gameObject;

    }

    getRoomBehabiour(gameObeject: GameObject) {
        // console.log(gameObeject)
        return gameObeject.getBehaviour(Room)
    }
    removeRoomClass(gameObeject: GameObject) {
       const roomclass= gameObeject.getBehaviour(RoomClass)
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
            this.removeRoomClass(neighborGameObject)//右边的房间去掉roomclass的behaviour
            switch (clickRoomData.roomType) {//加图片
                case 0:
                    clickGameobject.getBehaviour(ImageRenderer).imagePath = 'assets/engineTest/images/testImage2.png'
                    neighborGameObject.getBehaviour(ImageRenderer).imagePath = 'assets/engineTest/images/testImage21.png'
            }
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
        if (position.x > 0 && position.x < 5) {
            leftRoom = gameController.getRoomByPosition(leftPositon)
            console.log("left")
            console.log(leftRoom)
            rightRoom = gameController.getRoomByPosition(rightPositon)
            if (leftRoom != null)
                this.mergeHouse(leftRoom,clickRoom )
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
        if (position.x - 1 >= 0 && leftRoom == null && position.y != 1) this.createRoom(position.x - 1, position.y, RoomStatus.canBuild);
        if (position.x < 5 && rightRoom == null) this.createRoom(position.x + 1, position.y, RoomStatus.canBuild);
        if (bottomRoom == null) this.createRoom(position.x, position.y + 1, RoomStatus.canBuild);
        if (topRoom == null && position.y > 2) this.createRoom(position.x, position.y - 1, RoomStatus.canBuild);
        /*if (position.x - 1 >= 0 && leftRoom == null && rightRoom == null&&bottomRoom == null) {
             console.log('a')
             console.log(rightRoom)
             this.createRoom(position.x + 1, position.y, RoomStatus.canBuild)
             this.createRoom(position.x, position.y + 1, RoomStatus.canBuild)
             this.createRoom(position.x - 1, position.y, RoomStatus.canBuild)
         }
         else if (position.x > 0 && rightRoom == null&&bottomRoom == null) {
             console.log('b')
             this.createRoom(position.x + 1, position.y, RoomStatus.canBuild)
             this.createRoom(position.x, position.y + 1, RoomStatus.canBuild)

         }
         else if (position.x - 1 >= 0 && leftRoom == null && position.y != 1&&bottomRoom == null) {
             console.log('c')
             this.createRoom(position.x - 1, position.y, RoomStatus.canBuild)
             this.createRoom(position.x, position.y + 1, RoomStatus.canBuild)

         }
         else {
             console.log("f")
             this.createRoom(position.x, position.y + 1, RoomStatus.canBuild)
         }
     }*/
    }
}