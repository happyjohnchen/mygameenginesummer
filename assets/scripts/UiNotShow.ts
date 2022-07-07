import { getGameObjectById } from "../../src/engine";
import {Behaviour} from "../../src/engine/Behaviour";

export class UiNotShow extends Behaviour {

    //在此定义脚本中的属性


    //游戏编辑模式或运行模式开始时会执行一次
    onStart() {

    }

    //游戏运行模式开始时会执行一次
    onPlayStart() {
        getGameObjectById("NightTime").active = false;
        getGameObjectById("RoomSecondUi").active = false;
        getGameObjectById("DestroyOnlyUi").active = false;  
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