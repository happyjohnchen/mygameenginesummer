import { TextRenderer } from "../../src/behaviours/TextRenderer";
import {Behaviour} from "../../src/engine/Behaviour";
import { number } from "../../src/engine/validators/number";
import {GameObject, getGameObjectById} from "../../src/engine";
import { TimeControllerSystem } from "./TimeControllerSystem";
import { string } from "../../src/engine/validators/string";
export class Attribute extends Behaviour {

    //在此定义脚本中的属性
    /* 分别挂在到三个属性的物体上，用来实现随时间掉落 且控制上下限
    */

   
     private value = 60;//初始数值
     private gameobject;

     @number()
     consumepertime = 1;//一次消耗多少

     private lasttime = 0;//经过的时间
     private nowtime = 0;
     @number()
     oncetime = 1;//多少小时消耗一次


     maxvalue = 100;
     minvalue= 0;

    //游戏开始时会执行一次
    onStart() { //游戏开始时的数值
        
        this.gameObject.getBehaviour(TextRenderer).text= this.value.toString();
    }

    //每次屏幕刷新执行 显示数值
    onUpdate() {
        this.gameObject.getBehaviour(TextRenderer).text= this.value.toString();
    }

    //平均每16ms执行一次 每oncetime小时掉一次
    onTick(duringTime: number) {
        this.nowtime= getGameObjectById('TimeController').getBehaviour(TimeControllerSystem).getMinTime();
        this.lasttime = this.lasttime==60? 0:this.lasttime;
        if(this.nowtime-this.lasttime >=this. oncetime*60){
            this.setvalue(-this.consumepertime);
            this.lasttime = this.nowtime;    
            //console.log(this.lasttime);
        }
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