import {Behaviour} from "../../src/engine/Behaviour";
import { string } from "../../src/engine/validators/string";

export class loadScene extends Behaviour {

    //在此定义脚本中的属性
    @string()
    scenes = ""

    //游戏编辑模式或运行模式开始时会执行一次
    onStart() {

    }

    //游戏运行模式开始时会执行一次
    onPlayStart() {
        this.gameObject.onClick = () => {
            this.engine.loadScene(this.scenes);
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