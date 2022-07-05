import { AnimationRenderer } from "../../src/behaviours/AnimationRenderer";
import { ImageRenderer } from "../../src/behaviours/ImageRenderer";
import { Behaviour } from "../../src/engine/Behaviour";
import { Transform } from "../../src/engine/Transform";
import { PersonModule, PersonRace } from "./modules/PersonModule";
import { RoomModule, RoomType } from "./modules/RoomModule";

export class PersonClass extends Behaviour {

    personModule: PersonModule = new PersonModule()
    //在此定义脚本中的属性
    /* personId: number
    personName: string
    animationId: number
    room: Behaviour
    personRace: PersonRace */

    //游戏编辑模式或运行模式开始时会执行一次
    onStart() {
        //this.personModule = new PersonModule()
        //console.log("PersonClass!!!")
        // console.log(this.gameObject)
        //this.personModule.race = PersonRace.Human;


    }

    //游戏运行模式开始时会执行一次
    onPlayStart() {
        this.gameObject.onClick = () => {
            //移动房间
            return this.gameObject;
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

    setAnimation(roomType: RoomType) {
        const animationRenderer = this.gameObject.getBehaviour(AnimationRenderer);
        animationRenderer.imagePathPrefix = "assets/images/PeopleAnimations/testAnimation/"
            + roomType.toString() + '-' + this.personModule.race.toString() + '-';
        animationRenderer.imagePathSuffix = '.png'
        animationRenderer.startNum = 1;
        animationRenderer.endNum = 4;
        animationRenderer.frameForEachImage = 20;

    }
    setPostion(x: number, y: number) {
        const transform = this.gameObject.getBehaviour(Transform)
        transform.x = x;
        transform.y = y;
    }


}