import { Behaviour } from "../../src/engine/Behaviour";
import { PersonRace } from "./modules/PersonModule";

export class PersonClass extends Behaviour {

    //在此定义脚本中的属性
    personId: number
    personName: string
    animationId: number
    room: Behaviour
    personRace: PersonRace

    //游戏编辑模式或运行模式开始时会执行一次
    onStart() {

    }

    //游戏运行模式开始时会执行一次
    onPlayStart() {
        this.gameObject.onClick = () => {
            //移动房间
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

    setAnimation(){

    }

    
}