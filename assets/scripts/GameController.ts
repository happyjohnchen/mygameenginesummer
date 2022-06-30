import {Behaviour} from "../../src/engine/Behaviour";
import {GameSet} from "./GameSet";
import {ArchiveSystem} from "./archiveSystem/ArchiveSystem";
import {GameModule} from "./modules/GameModule";

export class GameController extends Behaviour {

    //在此定义脚本中的属性
    game = new GameSet();

    //游戏编辑模式或运行模式开始时会执行一次
    onStart() {

    }

    //游戏运行模式开始时会执行一次
    onPlayStart() {
        this.readArchive();//读档

    }

    //每次屏幕刷新执行
    onUpdate() {

    }

    //平均每16ms执行一次
    onTick(duringTime: number) {

    }

    //删除Behaviour时会执行一次
    onEnd() {

    }

    //读取存档
    readArchive() {
        //初始化
        this.game = new GameSet();
        if (this.engine.loadSceneData === '') {
            //新建场景

            return;
        }

        //读取场景
        try {
            let gameDataJSON = decodeURI(this.engine.loadSceneData);
            if (ArchiveSystem.encryptArchive) {
                //base64解码
                gameDataJSON = window.atob(gameDataJSON);
            }
            const gModule = JSON.parse(gameDataJSON) as GameModule;//gMoudle是获取到的GameModule对象
            console.log(gModule);
        } catch (e) {
            console.log("Player: loadSceneData没有被解析，因为其不是JSON格式")
        }

    }

    //保存存档
    saveArchive() {

    }
}