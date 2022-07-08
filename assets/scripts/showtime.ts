import { TextRenderer } from "../../src/behaviours/TextRenderer";
import {Behaviour} from "../../src/engine/Behaviour";
import { number } from "../../src/engine/validators/number";
import {GameObject, getGameObjectById} from "../../src/engine";
import { TimeControllerSystem } from "./TimeControllerSystem";
import { string } from "../../src/engine/validators/string";
import { GameController } from "./GameController";
export class ShowTime extends Behaviour {

    //在此定义脚本中的属性
    /* 显示时间*/

   private nowmin = 0;
   private nowhour = 0;
   private nowday = 0;

   @number()
   startTime = 8;//初始显示时间
    //游戏开始时会执行一次
    onStart() { //基础数值
        if(this.nowmin<10){
            this.gameObject.getBehaviour(TextRenderer).text = "第"+this.nowday + "天" + " " + this.nowhour + ":0" + this.nowmin;
        }
        else{
            this.gameObject.getBehaviour(TextRenderer).text = "第"+this.nowday + "天" + " " + this.nowhour + ":" + this.nowmin;
        }
    }

    //每次屏幕刷新执行
    onUpdate() {
        if(this.nowmin<10){
            this.gameObject.getBehaviour(TextRenderer).text = "第"+this.nowday + "天" + " " + this.nowhour + ":0" + this.nowmin;
        }
        else{
            this.gameObject.getBehaviour(TextRenderer).text = "第"+this.nowday + "天" + " " + this.nowhour + ":" + this.nowmin;
        }
        
    }

    //平均每16ms执行一次 从gamecontroller拿到时间
    onTick(duringTime: number) {
        // this.nowhour= getGameObjectById('TimeController').getBehaviour(TimeControllerSystem).getHourTime()+this.startTime;
        // this.nowmin = getGameObjectById('TimeController').getBehaviour(TimeControllerSystem).getMinTime();
        // this.nowday = getGameObjectById('TimeController').getBehaviour(TimeControllerSystem).getDayCount();
        //console.log(getGameObjectById('TimeController').getBehaviour(TimeControllerSystem).gettotalgamesecondtime());
        this.nowhour = getGameObjectById("GameController").getBehaviour(GameController).game.time.getHourTime()+this.startTime;
        this.nowmin = getGameObjectById("GameController").getBehaviour(GameController).game.time.getMinTime();
        this.nowday = getGameObjectById("GameController").getBehaviour(GameController).game.time.getDayCount();
    }

    
}