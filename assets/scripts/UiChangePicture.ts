import {Behaviour} from "../../src/engine/Behaviour";

export class UiChangePicture extends Behaviour {

    //在此定义脚本中的属性


    //游戏编辑模式或运行模式开始时会执行一次
    onStart() {

    }

    //游戏运行模式开始时会执行一次
    onPlayStart() {
        window.addEventListener('mousedown', (e) => {//鼠标点击
           console.log("按下");
        });
        window.addEventListener('mouseup', (e) => {//鼠标点击
            console.log("弹起");
         });
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