import { GameObject, getGameObjectById } from "../../src/engine";
import { Behaviour } from "../../src/engine/Behaviour";
import { PersonClass } from "./PersonClass";
import { GameController } from "./GameController";
import { TimeControllerSystem } from "./TimeControllerSystem";
import { Transform } from "../../src/engine/Transform";
import { number } from "../../src/engine/validators/number";
import { randomRace } from "./RandomSys";

export class PersonSet extends Behaviour {

    @number()
    startPostionX = 100;

    @number()
    startPositonY = -100;

    //在此定义脚本中的属性
    time: number;
    peopleCount: number;
    gameController: GameController
    private nowTime: number
    lastTimeCreate = 0
    private createPeriod = 15 * 60 * 50





    //游戏编辑模式或运行模式开始时会执行一次
    onStart() {
        this.gameController = new GameController();
        this.gameController.addPerson(this.gameObject);
    }

    //游戏运行模式开始时会执行一次
    onPlayStart() {
        this.peopleCount = this.gameController.getPeopleCount();
    }

    //每次屏幕刷新执行
    onUpdate() {

    }

    //平均每16ms执行一次
    onTick(duringTime: number) {
        this.nowTime = getGameObjectById('TimeController').getBehaviour(TimeControllerSystem).getTotalGameSecondTime();
        if (this.nowTime - this.lastTimeCreate >= this.createPeriod) {
            this.lastTimeCreate = this.nowTime;
            this.newPerson();
        }
    }

    //删除Behaviour时会执行一次
    onEnd() {

    }

    newPerson() {
        const newPerson = new GameObject();
        const transform = new Transform();
        transform.x = this.startPostionX;
        transform.y = this.startPositonY;
        let race = randomRace()
        switch (race) {
            case 1:
                break;
            case 2:

        }


        //this.gameObject.addChild(newPerson);
        const personTnfomation = new PersonClass();
        personTnfomation.personModule.personId = this.peopleCount++;
        newPerson.addBehaviour(personTnfomation);
        this.gameController.addPerson(newPerson);
    }

}