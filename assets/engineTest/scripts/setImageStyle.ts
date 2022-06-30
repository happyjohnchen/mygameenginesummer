import { transform } from "typescript";
import { Behaviour } from "../../../src/engine/Behaviour";
import { Transform } from "../../../src/engine/Transform";

export class setImageStyle extends Behaviour {

    //在此定义脚本中的属性

setImageOrigin(){
    let children=this.gameObject.children
    for(let i=0;i<3;i++){
children[i].getBehaviour(Transform).scaleX=1
    }
}
    //游戏编辑模式或运行模式开始时会执行一次
    onStart() {

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