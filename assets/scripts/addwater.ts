import { getGameObjectById } from "../../src/engine";
import {Behaviour} from "../../src/engine/Behaviour";
import { number } from "../../src/engine/validators/number";
import { Attribute } from "./Attribute";
export class addwater extends Behaviour  {
    //
    //在此定义脚本中的属性

    private value = 0;
    @number()
    addvaluecount = 5;
    //游戏开始时会执行一次
    onStart() {//点击会增加数量
        this.gameObject.onClick = (e) => {
            if(e.button ==0){
                const a = getGameObjectById('water');
                getGameObjectById('water').getBehaviour(Attribute).setvalue(+5);
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