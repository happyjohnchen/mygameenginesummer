import { whitespaceFilter } from "_@microsoft_fast-foundation@2.46.9@@microsoft/fast-foundation";
import { Prefab } from "../../src/behaviours/Prefab";
import { GameObject, getGameObjectById,createGameObject } from "../../src/engine";
import {Behaviour} from "../../src/engine/Behaviour";
import { number } from "../../src/engine/validators/number";
import { addAttribute } from "./addAttribute";
import {RoomModule, RoomType } from "./modules/RoomModule";
import { TimeControllerSystem } from "./TimeControllerSystem";
import {string} from "../../src/engine/validators/string";


export class RoomClass extends Behaviour {

    
    @string()
    roomtype= "water";// water food energy
    @number()
    primeproducetime = 5;//多少小时产出一次

    @number()
    production = 20;//一次产出多少

    @number()
    totalpeopleattribute = 1;//总人物属性 有一个根据总特质转化的式子
    @number()
    coefficient = 0.2;
    @number()
    radix = 0.2;
   
    private lastTime = 0;//经过的时间
    private nowTime = 0;

    onStart() {
        this.gameObject.onClick = (e) => {
            if(e.button ==0){
                //console.log("点击");
            }
     
        }
        
    }

    //游戏运行模式开始时会执行一次
    onPlayStart() {

    }

    //每次屏幕刷新执行
    onUpdate() { //获取自己的父物体判断是否是自己生成的 这样可以单个调整数值
        // if(getGameObjectById("addAttributePrefab")){
        //     const parentgameObject = getGameObjectById("addAttributePrefab").parent.parent;
        //     if(parentgameObject==this.gameObject){
        //         getGameObjectById("addAttributePrefab").getBehaviour(addAttribute).setvalue(this.production);
        //         //getGameObjectById("addAttributePrefab").getBehaviour(addAttribute).settype(this.roomtype);
        //     }        
        // }
        console.log(this.getRoomType() + "时间周期为："+this.calculatePeriod() + "小时");
        
    }

    //平均每16ms执行一次   每一个小时产出一个增加
    onTick(duringTime: number) {
        this.nowTime= getGameObjectById('TimeController').getBehaviour(TimeControllerSystem).getMinTime();
        this.lastTime = this.lastTime==60? 0:this.lastTime;
        if(this.nowTime-this.lastTime >=this.calculatePeriod()*60){
            this.createProduction();
            this.lastTime = this.nowTime;    
            //console.log(this.lasttime);
        }
    }

    getRoomType(){
        return this.roomtype;
    }


    calculatePeriod(){ //计算消耗周期
        let period = this.primeproducetime - (this.totalpeopleattribute*this.coefficient) + this.radix;
        return period;
    }

    createProduction(){ //把type 和 产出值 赋给预制体
        const attributeprefab = new Prefab();
        attributeprefab.prefabPath = 'assets/engineTest/prefabs/add'+this.roomtype +'Prefab.yaml'
        this.gameObject.addBehaviour(attributeprefab);
        console.log(this.roomtype);   
    }

    getProduction(){
        return this.production;
    }
}