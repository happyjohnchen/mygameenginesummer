import { GameObject } from "../../src/engine";
import { Behaviour } from "../../src/engine/Behaviour";
import { PersonClass } from "./PersonClass";
import { GameController } from "./GameController";

export class PersonSet extends Behaviour {

    //在此定义脚本中的属性
    time: number;
    peopleCount: number;
    gameController: GameController



    //游戏编辑模式或运行模式开始时会执行一次
    onStart() {
        this.gameController = new GameController();
        this.gameController.addPerson(this.gameObject);
    }

    //游戏运行模式开始时会执行一次
    onPlayStart() {

    }

    //每次屏幕刷新执行
    onUpdate() {

    }

    //平均每16ms执行一次
    onTick(duringTime: number) {
        //if(this.time);

    }

    //删除Behaviour时会执行一次
    onEnd() {

    }

    newPerson() {
        const newPerson = new GameObject();
        this.gameObject.addChild(newPerson);
        const personTnfomation = new PersonClass();
        personTnfomation.personId = this.gameController.get

    }

}