import { extractGameObject, getGameObjectById } from "../../src/engine";
import {Behaviour} from "../../src/engine/Behaviour";
import { number } from "../../src/engine/validators/number";
import { Attribute } from "./Attribute";
import {RoomModule, RoomType } from "./modules/RoomModule";
import {string} from "../../src/engine/validators/string";
export class addAttribute extends Behaviour  {
    //
    //用来挂载到可点击的增加属性的物品上

    private value = 0;
    @string()
    private type = "";
    @number()
    private addvaluecount = 20;
    //游戏开始时会执行一次
    onStart() {//点击会增加数量
        console.log(this.type);
        this.gameObject.onClick = (e) => {
            if(e.button ==0){
                console.log(this.type);
                const a = getGameObjectById(this.type.toString());
                getGameObjectById(this.type).getBehaviour(Attribute).setvalue(this.addvaluecount);
                const parent = this.gameObject.parent;
                parent.removeChild(this.gameObject);           
                
            }
     
        }
    }

    //每次屏幕刷新执行
    onUpdate() {
       
    }

    //平均每16ms执行一次
    onTick(duringTime: number) {
        
    }

    setvalue(value:number){
        this.addvaluecount = value;
    }

    settype(roomtype:string){
        this.type = roomtype;
    }
}