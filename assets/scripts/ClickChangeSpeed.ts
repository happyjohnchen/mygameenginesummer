import { getGameObjectById } from "../../src/engine";
import {Behaviour} from "../../src/engine/Behaviour";
import { TimeControllerSystem } from "./TimeControllerSystem";

export class ClickChangeSpeed extends Behaviour {

    //在此定义脚本中的属性
    clicknumber:number = 1;

    //游戏编辑模式或运行模式开始时会执行一次
    onStart() {
        this.gameObject.onClick = (e) => {
            if(e.button ==0){
                if(this.clicknumber<3){
                    this.clicknumber++;
                }
                else{
                    this.clicknumber = 1;   
                }
                getGameObjectById('TimeController').getBehaviour(TimeControllerSystem).setSpeed(this.clicknumber);
            }
     
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