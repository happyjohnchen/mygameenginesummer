import { TextRenderer } from "../../src/behaviours/TextRenderer";
import {Behaviour} from "../../src/engine/Behaviour";
import { number } from "../../src/engine/validators/number";
import {GameObject, getGameObjectById} from "../../src/engine";
import { TimeControllerSystem } from "./TimeControllerSystem";
export class Attribute extends Behaviour {

    //在此定义脚本中的属性
    /* 随时间调落数值*/

   
     private value = 60;//初始数值百分比
     private gameobject;
     private speed = 1; //倍速

     @number()
     consumeperhour = 5;

     private lasttime = 0;//经过的时间
     private nowtime = 0;

     maxvalue = 100;
     minvalue= 0;

    //游戏开始时会执行一次
    onStart() { //基础数值
        
        this.gameObject.getBehaviour(TextRenderer).text= this.value.toString();
    }

    //每次屏幕刷新执行
    onUpdate() {
        this.gameObject.getBehaviour(TextRenderer).text= this.value.toString();
    }

    //平均每16ms执行一次 拿到时间
    onTick(duringTime: number) {
        this.nowtime= getGameObjectById('TimeController').getBehaviour(TimeControllerSystem).getHourTime();
        if(this.nowtime-this.lasttime >=1){
            this.value = this.setvalue(this.value,-this.consumeperhour);
            this.lasttime = this.nowtime;
        }
        this.onUpdate();
        console.log(this.value);
        
    }

    getvalue(){
        return this.value;
    }

    setvalue(totalevalue:number,changedvalue:number){ //改变value 且value最大值最小值不能超过最大值最小值
        let newnumber = totalevalue+changedvalue;
        newnumber = newnumber>this.maxvalue?this.maxvalue:newnumber;
        newnumber = newnumber<this.minvalue?this.minvalue:newnumber;
        return newnumber;
    }

    addvalue(){//获取属性增加value
    }

}