import {Behaviour} from "../../src/engine/Behaviour";
import {getGameObjectById} from "../../src/engine";
import {GameController} from "./GameController";
import {RoundedRectRenderer} from "../../src/behaviours/RoundedRectRenderer";

export class UiSaveArchive extends Behaviour {

    //在此定义脚本中的属性


    //游戏编辑模式或运行模式开始时会执行一次
    onStart() {
        const gameController = getGameObjectById("GameController").getBehaviour(GameController);
        this.gameObject.onClick=()=>{
            gameController.saveArchive();
        }
    }

    //游戏运行模式开始时会执行一次
    onPlayStart() {

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
}