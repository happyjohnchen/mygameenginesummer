import { TextRenderer } from "../../src/behaviours/TextRenderer";
import { getGameObjectById } from "../../src/engine";
import {Behaviour} from "../../src/engine/Behaviour";
import { GameController } from "./GameController";

export class ShowSpeed extends Behaviour {

    //在此定义脚本中的属性
    speed;

    //游戏编辑模式或运行模式开始时会执行一次
    onStart() {

    }

    //游戏运行模式开始时会执行一次
    onPlayStart() {

    }

    //每次屏幕刷新执行
    onUpdate() {
        this.gameObject.getBehaviour(TextRenderer).text = "x"+this.speed;
    }

    //平均每16ms执行一次
    onTick(duringTime: number) {
        this.speed = getGameObjectById("GameController").getBehaviour(GameController).game.time.getSpeed();
    }

    //删除Behaviour时会执行一次
    onEnd() {

    }
}