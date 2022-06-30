import {Behaviour} from "../../src/engine/Behaviour";
import {GameSet} from "./GameSet";
import {ArchiveSystem} from "./archiveSystem/ArchiveSystem";
import {GameModule} from "./modules/GameModule";
import {TimeControllerSystem} from "./TimeControllerSystem";

export class GameController extends Behaviour {

    //在此定义脚本中的属性
    game: GameSet;

    //游戏编辑模式或运行模式开始时会执行一次
    onStart() {

    }

    //游戏运行模式开始时会执行一次
    onPlayStart() {
        this.readArchive();//读档
    }

    //读取存档
    readArchive() {
        //初始化
        this.game = new GameSet();
        this.game.time = this.gameObject.getBehaviour(TimeControllerSystem);
        if (this.engine.loadSceneData === '') {
            this.createNewScene()
            return;
        }

        //读取场景JSON
        let gModule = new GameModule();
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

        //设定房间列表

        //设定资源数值
        this.game.water = gModule.water;
        this.game.energy = gModule.energy;
        this.game.food = gModule.food;
        this.game.material = gModule.material;
    }

    //新建场景
    createNewScene() {
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

        //写入房间列表

        //写入资源数值
        gModule.water = this.game.water;
        gModule.energy = this.game.energy;
        gModule.food = this.game.food;
        gModule.material = this.game.material;

        //保存存档
        ArchiveSystem.saveFile("FalloutGameArchive", gModule);
    }
}