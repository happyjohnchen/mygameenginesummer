import { getGameObjectById } from "../../src/engine";
import {Behaviour} from "../../src/engine/Behaviour";
import { number } from "../../src/engine/validators/number";
import { Attribute } from "./Attribute";
import {RoomModule, RoomType } from "./modules/RoomModule";
export class addAttribute extends Behaviour  {
    //
    //用来挂载到可点击的增加属性的物品上

    private value = 0;
    private type:RoomType;
    @number()
    addvaluecount = 5;
    //游戏开始时会执行一次
    onStart() {//点击会增加数量
        this.gameObject.onClick = (e) => {
            if(e.button ==0){
                const a = getGameObjectById(this.type.toString());
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