import { whitespaceFilter } from "_@microsoft_fast-foundation@2.46.9@@microsoft/fast-foundation";
import {Behaviour} from "../../src/engine/Behaviour";
import { number } from "../../src/engine/validators/number";
import {RoomModule, RoomType } from "./modules/RoomModule";
export class BehaviourDemo extends Behaviour {

    //在此定义脚本中的属性
    @String()
    roomtype:RoomType = "WaterFactory";
    //游戏编辑模式或运行模式开始时会执行一次

    @number()
    primeproducetime = 5;//多少小时产出一次

    @number()
    production = 20;//一次产出多少

    @number()
    totalpeopleattribute = 1;//速度 有一个根据总特质转化的式子
    @number()
    coefficient = 0.2;
    @number()
    radix = 0.2;
   

    onStart() {

    }

    //游戏运行模式开始时会执行一次
    onPlayStart() {

    }

    //每次屏幕刷新执行
    onUpdate() {

    }

    //平均每16ms执行一次
    onTick(duringTime: number) {

    }

    getRoomType(){
        return this.roomtype;
    }

    getattribute(type:RoomType){//转化能源
        const Attribute = {
            WaterFactory:"water",
            EnergyFactory:"energy",
            FoodFactory:"food"
        }
        return Attribute[type];
    }

    calculatePeriod(){ //计算消耗周期
        let period = this.primeproducetime - (this.totalpeopleattribute*this.coefficient) + this.radix;
        return period;
    }
}