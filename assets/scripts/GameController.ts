import {Behaviour} from "../../src/engine/Behaviour";
import {GameSet} from "./GameSet";
import {ArchiveSystem} from "./archiveSystem/ArchiveSystem";
import {GameModule} from "./modules/GameModule";
import {TimeControllerSystem} from "./TimeControllerSystem";
import {PersonModule} from "./modules/PersonModule";
import {RoomModule} from "./modules/RoomModule";
import {getGameObjectById} from "../../src/engine";

export class GameController extends Behaviour {

    game: GameSet;//游戏资源

    onPlayStart() {
        this.readArchive();//读档
        console.log("GameController已就绪，游戏开始");
    }

    //读取存档
    readArchive() {
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

        }
        //设定房间列表
        for (const roomModule of gModule.rooms) {

        }
        //设定资源数值
        this.game.water = gModule.water;
        this.game.energy = gModule.energy;
        this.game.food = gModule.food;
        this.game.material = gModule.material;
        console.log("GameController: 存档已读取");
    }

    //新建场景
    createNewScene() {
        console.log("GameController: 创建新存档");
        //设定时间
        this.game.time.setSpeed(1.0);
        this.game.time.setInitialTime(1, 0, 0, 0);
        //设定人列表为空
        this.game.people = [];
        //设定房间有一个大门

        //设定资源数值
        this.game.water = 0;
        this.game.energy = 0;
        this.game.food = 0;
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
            const roomModule = new RoomModule();

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
}