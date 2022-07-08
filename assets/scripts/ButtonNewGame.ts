import {Behaviour} from "../../src/engine/Behaviour";
import {ImageRenderer} from "../../src/behaviours/ImageRenderer";

export class ButtonNewGame extends Behaviour {

    //在此定义脚本中的属性


    //游戏编辑模式或运行模式开始时会执行一次
    onStart() {

    }

    //游戏运行模式开始时会执行一次
    onPlayStart() {
        this.gameObject.onClick = () => {
            this.gameObject.getBehaviour(ImageRenderer).imagePath='assets/images/Menu/StartGameChosen.png'
        }
        this.gameObject.onClickFinish = () => {
            console.log("新游戏");
            //开始新游戏
            this.engine.loadScene('assets/scenes/game.yaml', '');
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