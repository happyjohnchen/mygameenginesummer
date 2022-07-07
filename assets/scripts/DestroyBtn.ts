import { getGameObjectById } from "../../src/engine";
import {Behaviour} from "../../src/engine/Behaviour";

export class DestroyBtn extends Behaviour {

    //在此定义脚本中的属性


    //游戏编辑模式或运行模式开始时会执行一次
    onStart() {

    }

    //游戏运行模式开始时会执行一次
    onPlayStart() {
        getGameObjectById("RoomSecondUi").active = false; 
        this.gameObject.onClick = (e) => {
            if(e.button ==0){//点击调用选择房间 同时关闭ui
                this.destroyRoom();
                getGameObjectById("RoomSecondUi").active = false;
            }
        }
    }
    destroyRoom() {
        //这里写调用房间摧毁
        console.log("摧毁");
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