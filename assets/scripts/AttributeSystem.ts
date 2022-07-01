import { TextRenderer } from "../../src/behaviours/TextRenderer";
import {Behaviour} from "../../src/engine/Behaviour";
import { number } from "../../src/engine/validators/number";
import {GameObject, getGameObjectById} from "../../src/engine";
import { TimeControllerSystem } from "./TimeControllerSystem";
import { string } from "../../src/engine/validators/string";
import { GameController } from "./GameController";
export class AttributeSystem extends Behaviour {

    //在此定义脚本中的属性
    /* 分别挂在到三个属性的物体上，用来实现随时间掉落 且控制上下限
    随房间数量消耗

    用来控制三个属性得加减
    三个属性随时间掉落并赋值

    */

    
   
     private Primevalue = 60;//初始数值
     private gameobject;

     private water = 0;
     private energy = 0;
     private food = 0;

     @number()
     consumePerTime = 1;//一次消耗多少
     private lastTime = 0;//经过的时间
     private nowTime = 0;
     @number()
     onceConsumeTime = 1;//多少小时消耗一次
     @number()
     primeProduceTime = 5;//基础时间
     
     @number()
     maxValue = 100;

     minValue= 0;

     @number()
     coefficient = 0.2;
     @number()
     radix = 0.2;

    //游戏开始时会执行一次
    onStart() { //游戏开始时的数值
        
        //this.gameObject.getBehaviour(TextRenderer).text= this.Primevalue.toString();
        //拿到数值
        
        // this.water = getGameObjectById("GameController").getBehaviour(GameController).game.water;
        // this.food = getGameObjectById("GameController").getBehaviour(GameController).game.food;
        // this.energy = getGameObjectById("GameController").getBehaviour(GameController).game.energy;

    }

    //每次屏幕刷新执行 显示数值
    onUpdate() {
        //this.gameObject.getBehaviour(TextRenderer).text= this.Primevalue.toString();
    }

    //平均每16ms执行一次 每oncetime小时掉一次
    onTick(duringTime: number) {
        // this.nowTime= getGameObjectById('TimeController').getBehaviour(TimeControllerSystem).getMinTime();
        // this.lastTime = this.lastTime==60? 0:this.lastTime;
        // if(this.nowTime-this.lastTime >=this. onceConsumeTime*60){
        //     this.setValue(-this.consumePerTime);
        //     this.lastTime = this.nowTime;    
        //     //console.log(this.lasttime);
        // }
        // //console.log(this.lasttime);
        this.water = getGameObjectById("GameController").getBehaviour(GameController).game.water;
        this.food = getGameObjectById("GameController").getBehaviour(GameController).game.food;
        this.energy = getGameObjectById("GameController").getBehaviour(GameController).game.energy;
    }

    getValue(){
        return this.Primevalue;
    }

    setValue(changedvalue:number){ //改变value 且value最大值最小值不能超过最大值最小值
        let newnumber = this.Primevalue+changedvalue;
        newnumber = newnumber>this.maxValue?this.maxValue:newnumber;
        newnumber = newnumber<this.minValue?this.minValue:newnumber;
        this.Primevalue = newnumber;
    }

    getConsumePerTime(){
        return this.consumePerTime;
    }
    
   setConsumePerTime(consume:number){
        this.consumePerTime = consume;
   }

   calculateCreatePeriod(totalAttribute:number){
    let period = this.primeProduceTime - (totalAttribute*this.coefficient) + this.radix;
    return period;
   }
}