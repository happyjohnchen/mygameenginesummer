import { TextRenderer } from "../../src/behaviours/TextRenderer";
import {Behaviour} from "../../src/engine/Behaviour";
import { number } from "../../src/engine/validators/number";
import {GameObject, getGameObjectById} from "../../src/engine";
import { TimeControllerSystem } from "./TimeControllerSystem";
import { string } from "../../src/engine/validators/string";
export class Attribute extends Behaviour {

    //在此定义脚本中的属性
    /* 随时间调落数值*/

   
     private value = 60;//初始数值百分比
     private gameobject;

     @number()
     consumepertime = 1;//一次消耗多少

     private lasttime = 0;//经过的时间
     private nowtime = 0;
     @number()
     minpertime = 2;//多少分钟消耗一次


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
        this.nowtime= getGameObjectById('TimeController').getBehaviour(TimeControllerSystem).getMinTime();
        this.lasttime = this.lasttime==60? 0:this.lasttime;
        if(this.nowtime-this.lasttime >=this. minpertime){
            this.setvalue(-this.consumepertime);
            this.lasttime = this.nowtime;    
            console.log(this.lasttime);
        }
        
        this.onUpdate();
        //console.log(this.lasttime);
        
    }

    getvalue(){
        return this.value;
    }

    setvalue(changedvalue:number){ //改变value 且value最大值最小值不能超过最大值最小值
        let newnumber = this.value+changedvalue;
        newnumber = newnumber>this.maxvalue?this.maxvalue:newnumber;
        newnumber = newnumber<this.minvalue?this.minvalue:newnumber;
        this.value = newnumber;
    }

    getconsumepertime(){
        return this.consumepertime;
    }
    
   setconsumepertime(consume:number){
        this.consumepertime = consume;
   }
}