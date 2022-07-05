import { GameObject, getGameObjectById } from "../../src/engine";
import { Behaviour } from "../../src/engine/Behaviour";
import { GameController } from "./GameController";
import { PersonClass } from "./PersonClass";

export class PersonTestLXQ extends Behaviour {

    //在此定义脚本中的属性
    gameController: GameController
    click = true

    //游戏编辑模式或运行模式开始时会执行一次
    onStart() {
        this.gameController = getGameObjectById('GameController').getBehaviour(GameController);
        this.gameObject.onClick = (e) => {
            if (this.click) {
                console.log( this.gameController.getPersonById(1).getBehaviour(PersonClass))
                console.log("+++++Person111++++++")
                this.click = false;
            }
            else {
                console.log( this.gameController.getPersonById(2).getBehaviour(PersonClass))
                console.log("----------Person222-------")
                this.click = true;
            }
            //this.click = this.click!
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