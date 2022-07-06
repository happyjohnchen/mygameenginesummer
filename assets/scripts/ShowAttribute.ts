import { TextRenderer } from "../../src/behaviours/TextRenderer";
import { getGameObjectById } from "../../src/engine";
import {Behaviour} from "../../src/engine/Behaviour";
import { GameController } from "./GameController";

export class ShowAttribute extends Behaviour {

    //在此定义脚本中的属性
    type= ""
    value = 0;
    private gamecontroller
    private game
    //游戏编辑模式或运行模式开始时会执行一次
    onStart() {

    }

    //游戏运行模式开始时会执行一次
    onPlayStart() {
        this.type = this.gameObject.id;
        this.game = getGameObjectById("GameController").getBehaviour(GameController).game;
        
        this.getAttribute(this.type);
    }

    //每次屏幕刷新执行
    onUpdate() {
        this.gameObject.getBehaviour(TextRenderer).text = this.value.toString();
    }

    //平均每16ms执行一次
    onTick(duringTime: number) {
        this.getAttribute(this.type);
    }

    //删除Behaviour时会执行一次
    onEnd() {

    }

    getAttribute(type:string){
        switch(type){
            case "water":
               this.value =  this.game.water ;        
            break;
            case "energy":
                this.value =  this.game.energy ;
                
            break;
            case "food":
                this.value =  this.game.food;
                
            break;
            case"material":
            this.value =  this.game.material;
                
            break;
        }
    }
}