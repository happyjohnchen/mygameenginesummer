import { getGameObjectById } from "../../src/engine";
import {Behaviour} from "../../src/engine/Behaviour";
import { RoomSet } from "./RoomSet";

export class BehaviourDemo extends Behaviour {

    //在此定义脚本中的属性


    //游戏编辑模式或运行模式开始时会执行一次
    onStart() {

    }

    //游戏运行模式开始时会执行一次
    onPlayStart() {
        this.gameObject.onClick = () => {
            const roomset = getGameObjectById("tileMap").getBehaviour(RoomSet)
           roomset.confirmYesBtn=true;
        }
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