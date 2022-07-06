import { getGameObjectById } from "../../src/engine";
import {Behaviour} from "../../src/engine/Behaviour";
import { TimeControllerSystem } from "./TimeControllerSystem";

export class ClickChangeSpeed extends Behaviour {

    //在此定义脚本中的属性

    //游戏编辑模式或运行模式开始时会执行一次
    onStart() {

    }

    //游戏运行模式开始时会执行一次
    onPlayStart() { 
        this.gameObject.onClick = (e) => {
            if(e.button ==0){
                if(getGameObjectById('TimeController').getBehaviour(TimeControllerSystem).speed<3){
                    getGameObjectById('TimeController').getBehaviour(TimeControllerSystem).speed ++;
                }
                else{
                    getGameObjectById('TimeController').getBehaviour(TimeControllerSystem).speed = 1;   
                }
            }
     
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