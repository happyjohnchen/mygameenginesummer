import { GameObject, getGameObjectById } from "../../src/engine";
import { Behaviour } from "../../src/engine/Behaviour";
import { PersonClass } from "./PersonClass";
import { GameController } from "./GameController";
import { TimeControllerSystem } from "./TimeControllerSystem";
import { Transform } from "../../src/engine/Transform";
import { number } from "../../src/engine/validators/number";
import { randomName, randomRace } from "./RandomSys";
import { PersonRace } from "./modules/PersonModule";
import { RoomType } from "./modules/RoomModule";
import { AnimationRenderer } from "../../src/behaviours/AnimationRenderer";

export class PersonSet extends Behaviour {

    @number()
    startPostionX = -400;

    @number()
    startPositonY = -175;

    //在此定义脚本中的属性
    peopleCount: number;
    gameController: GameController
    private nowTime: number
    lastTimeCreate = 0
    //private createPeriod = 3600
    private createPeriod = 5 * 60 * 60
    first = true;



    //游戏编辑模式或运行模式开始时会执行一次
    onStart() {
        this.gameController = getGameObjectById('GameController').getBehaviour(GameController);
        //this.gameObject.addBehaviour(this.gameController)
        //le.log(this.gameController);
        //console.log(this.gameObject)
    }

    //游戏运行模式开始时会执行一次
    onPlayStart() {
        //console.log(this.gameObject)
        //this.gameController.addPerson(this.gameObject);
        this.peopleCount = this.gameController.getPeopleCount();
        //this.newPerson();
    }

    //每次屏幕刷新执行
    onUpdate() {

    }

    //平均每16ms执行一次
    onTick(duringTime: number) {
        this.nowTime = getGameObjectById('TimeController').getBehaviour(TimeControllerSystem).getTotalGameSecondTime();
        if(!this.first){
            if (this.nowTime - this.lastTimeCreate >= this.createPeriod) {
                this.lastTimeCreate = this.nowTime;
                this.newPerson();
                //console.log("OnTick" + this.newPerson);
            }
        }
        else{
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
        //改变人物大小
        transform.scaleX = 0.15;
        transform.scaleY = 0.15;
        const personClass = new PersonClass()
        let race = randomRace()
        let name = randomName()
        switch (race) {
            case 0:
                personClass.personModule.race = PersonRace.Human;
                personClass.personModule.personName = name;
                //console.log("case 0 :" + PersonRace.Human)
                break;
            case 1:
                personClass.personModule.race = PersonRace.Giant;
                personClass.personModule.personName = name;
                //console.log("case 1")
                break;
            case 2:
                personClass.personModule.race = PersonRace.Dwarf;
                personClass.personModule.personName = name;
                //console.log("case 2")
                break;
            case 3:
                personClass.personModule.race = PersonRace.Spirit;
                personClass.personModule.personName = name;
                //console.log("case 3")
                break;
            default:
                //console.log("Wrong!!!" + race)

        }
        /* personClass.personModule.race = PersonRace.Human;
        personClass.personModule.personName = name;
 */

        this.gameObject.addChild(newPerson);
        personClass.personModule.personId = this.gameController.getPeopleCount();
        personClass.personModule.room = 0;
        newPerson.addBehaviour(new AnimationRenderer);
        //console.log("Name & Race" + personClass)
        newPerson.addBehaviour(personClass);
        newPerson.addBehaviour(transform);
        this.gameController.addPerson(newPerson);
        console.log(newPerson.getBehaviour(AnimationRenderer))
        personClass.setAnimation(RoomType.noType);
        this.first =false;


    }

}