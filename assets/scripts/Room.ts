import {Behaviour} from "../../src/engine/Behaviour";
import { number } from "../../src/engine/validators/number";

export class Room extends Behaviour {

    //在此定义脚本中的属性
 @number()
 RoomType;
    //游戏开始时会执行一次
    onStart() {
this.RoomType=0
    }

    //每次屏幕刷新执行
    onUpdate() {

    }

    //平均每16ms执行一次
    onTick(duringTime: number) {

    }
}