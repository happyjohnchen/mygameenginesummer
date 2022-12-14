import { getGameObjectById } from "../../src/engine";
import {Behaviour} from "../../src/engine/Behaviour";
import { number } from "../../src/engine/validators/number";
import { AttributeSystem } from "./AttributeSystem";
import { TimeControllerSystem } from "./TimeControllerSystem";
export class ChangeTimeSpeed extends Behaviour {

    //点击按钮更改速度

    @number() //倍速是多少
    thisSpeed = 2;
    //游戏开始时会执行一次
    onStart() {
        this.gameObject.onClick = (e) => {
            if(e.button ==0){
            getGameObjectById('TimeController').getBehaviour(TimeControllerSystem).setSpeed(this.thisSpeed);
                //console.log(a.getBehaviour(Attribute).getvalue());
            }
     
        }
    }

    //每次屏幕刷新执行
    onUpdate() {

    }

    //平均每16ms执行一次
    onTick(duringTime: number) {

    }
}