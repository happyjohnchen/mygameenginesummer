import { Behaviour } from "../../src/engine/Behaviour";
import { GameSet } from "./GameSet";
import { ArchiveSystem } from "./archiveSystem/ArchiveSystem";
import { GameModule } from "./modules/GameModule";
import { TimeControllerSystem } from "./TimeControllerSystem";
import { PersonModule } from "./modules/PersonModule";
import { RoomModule, RoomPosition } from "./modules/RoomModule";
import { GameObject, getGameObjectById } from "../../src/engine";
import { Transform } from "../../src/engine/Transform";
import { Room } from "./Room";
import { RoomSet } from "./RoomSet";
import {number} from "../../src/engine/validators/number";
import {string} from "../../src/engine/validators/string";

export class GameController extends Behaviour {
    
    game: GameSet = new GameSet();//游戏资源
    private people: GameObject;//此GameObject持有所有人
    private rooms: GameObject;//此GameObject持有所有房间
    onPlayStart() {
        //获取时间系统
        this.game.time = getGameObjectById("TimeController").getBehaviour(TimeControllerSystem);
        console.log(this.game.time)
        //获取人和房间对象
        this.people = getGameObjectById("People");
        this.rooms = getGameObjectById("Rooms");
        //读档
        this.readArchive();
        console.log("GameController已就绪，游戏开始");
        console.log(this.game.water);
    }

    //读取存档
    private readArchive() {
        //初始化
        this.game = new GameSet();

        this.game.time = getGameObjectById("TimeController").getBehaviour(TimeControllerSystem);
        if (this.engine.loadSceneData === '') {
            this.createNewScene()
            return;
        }

        //读取场景JSON
        let gModule = new GameModule();
        console.log("GameController: 读取存档");
        try {
            let gameDataJSON = decodeURI(this.engine.loadSceneData);
            if (ArchiveSystem.encryptArchive) {
                //base64解码
                gameDataJSON = window.atob(gameDataJSON);
            }
            gModule = JSON.parse(gameDataJSON) as GameModule;//gMoudle是获取到的GameModule对象
            console.log(gModule);
        } catch (e) {
            console.log("GameController: loadSceneData没有被解析，因为其不是JSON格式，将创建一个新场景")
            this.createNewScene();
            return;
        }
        //设定时间
        this.game.time.setSpeed(gModule.gameTime.rate);
        this.game.time.setInitialTime(gModule.gameTime.day, gModule.gameTime.hour, gModule.gameTime.minute, gModule.gameTime.second);
        //设定人物列表
        for (const personModule of gModule.people) {
            const newPerson = new GameObject();
            this.people.addChild(newPerson);//添加到游戏场景
            this.game.people.push(newPerson);//添加到game
            newPerson.addBehaviour(new Transform());


        }
        //设定房间列表
        for (const roomModule of gModule.rooms) {
            getGameObjectById("tileMap").getBehaviour(RoomSet).createRoomFromData(roomModule)
           /* const newRoom = new GameObject();  
            this.rooms.addChild(newRoom);//添加到游戏场景
            this.game.rooms.push(newRoom);//添加到game
            newRoom.addBehaviour(new Transform());*/
          

        }
        //设定资源数值
        this.game.water = gModule.water;
        this.game.energy = gModule.energy;
        this.game.food = gModule.food;
        this.game.material = gModule.material;
        console.log("GameController: 存档已读取");
    }

    //新建场景
    private createNewScene() {
        console.log("GameController: 创建新存档");
        //设定时间
        this.game.time.setSpeed(1.0);
        this.game.time.setInitialTime(1, 0, 0, 0);
        //设定人列表为空
        this.game.people = [];
        //设定房间有一个大门

        //设定资源数值
        this.game.water = 50;
        this.game.energy = 50;
        this.game.food = 50;
        this.game.material = 0;
        console.log("GameController: 新存档创建成功");
    }

    //保存存档
    saveArchive() {
        const gModule = new GameModule();
        //写入时间
        gModule.gameTime.rate = this.game.time.getSpeed();
        gModule.gameTime.day = this.game.time.getDayCount();
        gModule.gameTime.hour = this.game.time.getHourTime();
        gModule.gameTime.minute = this.game.time.getMinTime();
        gModule.gameTime.second = this.game.time.getSecondTime();
        //写入人列表
        for (const people of this.game.people) {
            const personModule = new PersonModule();


            gModule.people.push(personModule);
        }
        //写入房间列表
        for (const room of this.game.rooms) {
            const roomModule=room.getBehaviour(Room).roomModule
            //const roomModule = new RoomModule();
            
            gModule.rooms.push(roomModule);
        }
        //写入资源数值
        gModule.water = this.game.water;
        gModule.energy = this.game.energy;
        gModule.food = this.game.food;
        gModule.material = this.game.material;

        //保存存档
        ArchiveSystem.saveFile("FalloutGameArchive", gModule);
    }

    //创建人
    addPerson(person: GameObject) {
        this.game.people.push(person);
        this.people.addChild(person);
    }

    //删除人
    removePerson(person: GameObject) {
        const index = this.game.people.indexOf(person);
        if (index >= 0) {
            this.game.people.splice(index, 1);
        }
        this.people.removeChild(person);
    }

    //创建房间
    addRoom(room: GameObject) {
        this.game.rooms.push(room);
        this.rooms.addChild(room);
    }

    //删除房间
    removeRoom(room: GameObject) {
        const index = this.game.rooms.indexOf(room);
        if (index >= 0) {
            this.game.rooms.splice(index, 1);
        }
        this.rooms.removeChild(room);
    }

    //用id获取人
    getPersonById(id: number) {
        for (const person in this.game.people) {

        }
    }

    //用id获取房间
    getRoomById(id: number) {
        if(id==-1)return;
        for (const room of this.game.rooms) {
            if (room.getBehaviour(Room).roomModule.roomId == id) {
                console.log(room)
                return room
            }
           
        }
    }
    //用Position获取房间
    getRoomByPosition(position:RoomPosition){
        for (const room of this.game.rooms) {
            let roomPosition=room.getBehaviour(Room).roomModule.position
            let positonX=roomPosition.x
            let positonY=roomPosition.y
            if (positonX == position.x&&positonY==position.y) {
                console.log(position)
                return room
            }
            
        }
        
    }
}