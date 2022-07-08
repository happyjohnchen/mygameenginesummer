import { TextRenderer } from "../../src/behaviours/TextRenderer";
import {Behaviour} from "../../src/engine/Behaviour";
import { number } from "../../src/engine/validators/number";
import {GameObject, getGameObjectById} from "../../src/engine";
import { TimeControllerSystem } from "./TimeControllerSystem";
import { string } from "../../src/engine/validators/string";
import { GameController } from "./GameController";
import { RoomType } from "./modules/RoomModule";
import { PersonRace } from "./modules/PersonModule";
export class AttributeSystem extends Behaviour {

    //在此定义脚本中的属性
    /*
        属性系统 包含属性控制中所有算法
    */

    
   
     private Primevalue = 60;//初始数值
     private gameobject;

     private water = 0;
     private energy = 0;
     private food = 0;
     private material= 0;

     @number()
     consumePerTime = 1;//一次消耗多少
     private lastTime = 0;//经过的时间
     private nowTime = 0;
     @number()
     onceConsumeTime = 1;//多少小时消耗一次
     @number()
     primeProduceTime = 5;//基础时间
     @number()
     maxValue = 1000;
     minValue= 0;
     @number()
     coefficient = 0.2;
     @number()
     radix = 0.2;

     private gamecontroller
     private timeController
     private game
    //游戏开始时会执行一次
    onStart() { //游戏开始时的数值
        
       
    }
    onPlayStart(){
        this.gamecontroller = getGameObjectById("GameController").getBehaviour(GameController);
        this.timeController = getGameObjectById("TimeController").getBehaviour(TimeControllerSystem);
        this.game = this.gamecontroller.game;
        this.nowTime = this.timeController.getTotalGameSecondTime();
        this.lastTime = this.timeController.getTotalGameSecondTime();
    }
    //每次屏幕刷新执行 显示数值
    onUpdate() {
        

    }

    onTick(duringTime: number) {//一小时进行消耗
        this.nowTime= this.timeController.getTotalGameSecondTime();
        if(this.nowTime-this.lastTime >=1*60*60){
            this.consumeForFoodWater();
            this.lastTime = this.nowTime;  
        }
        if(this.game.water==0||this.game.energy==0||this.game.food==0){
                this.endGame();
        }
    }


    changeAttributeValue(changedValue:number,type:string){ //改变水，食物，能源，材料value 且value最大值最小值不能超过最大值最小值
        switch(type){
            case "water":
                this.game.water = this.changeValue(this.game.water,changedValue);
                //console.log("目前水属性值"+this.game.water);
            break;
            case "energy":
                this.game.energy = this.changeValue(this.game.energy,changedValue);
                console.log("目前电属性值"+this.game.energy);
            break;
            case "food":
                this.game.food = this.changeValue(this.game.food,changedValue);
                //console.log("目前食物属性值"+this.game.energy);
            break;
            case"material":
            this.game.material = this.changeValue(this.game.material,changedValue);//可能没有上限 到时候再说
                console.log("目前材料属性值"+this.game.material);
            break;
        }
        
    }

    changeValue(primeValue:number,addValue:number){  //三种属性检查超没超过上下限  上下限也可以变为参数
        let newNumber = addValue+primeValue;
        newNumber = newNumber>this.maxValue?this.maxValue:newNumber;
        newNumber = newNumber<this.minValue?this.minValue:newNumber;
        return newNumber;
    }

   calculateCreatePeriod(roomlevel:number,totalAttribute:number){//计算产出周期
    const primeTimeTable = {
        1:5,
        2:5,
        3:7
    }
    let period = primeTimeTable[roomlevel] - (totalAttribute*this.coefficient) + this.radix;
    return period;
   }

   calculateProduction(roomlevel:number,type:string){ //计算产出
    const energyTable = {
        1: 30,
        2: 70,
        3: 154
    }

    const foodWaterTable = {
        1: 20,
        2: 45,
        3: 98
    }
    const materialTable = {
        1:10,
        2:25,
        3:40
    }
    switch(type){
        case("energy"):
            return energyTable[roomlevel];
        case("material"):
            return materialTable[roomlevel];
        default:
            return foodWaterTable[roomlevel];

    }
    
   }

   ConsumeForEnergy(level:number){//计算电力消耗量
        const consumption = {
            1: 2,
            2: 4,
            3: 7
        }
        this.game.energy = this.changeValue(this.game.energy,-consumption[level]);
        console.log("目前电量"+this.game.energy);
   }

   consumeForFoodWater(){//计算水和食物消耗 
    const peopleCount = this.game.people.length;//拿到人的总数
    this.game.water= this.changeValue(this.game.water,-peopleCount);//减去人数总数的数值
    this.game.food= this.changeValue(this.game.food,-peopleCount);
    console.log("水和食物消耗"+peopleCount);
    console.log("水"+this.game.water);
    console.log("食物"+this.game.food);
   }

   consumeForMaterial(consume:number){//判断是否可以消耗 不可以则返回false 可以返回true
    if(consume<=this.game.material){
        //this.game.material -= consume;//减去消耗
        return true;
    }
        else{
            //触发提醒ui
            getGameObjectById("ConsumeNot").active = true;
            return false;
        }
   }

   getPeopleAttribute(peopletype:PersonRace,roomType:RoomType){ //根据人种得到对应属性值
        const waterForPeople = {  //0123分别对应 人 巨人 矮人 精灵
            0:2,
            1:1,
            2:1,
            3:4
        }
        const energyForPeople = {
            0:2,
            1:4,
            2:1,
            3:1
        }
        const foodForPeople = {
            0:2,
            1:1,
            2:4,
            3:1
        }
        switch(roomType){
            case RoomType.WaterFactory:
                return waterForPeople[peopletype];
            case RoomType.EnergyFactory:
                return energyForPeople[peopletype];
            case RoomType.FoodFactory:
                return foodForPeople[peopletype];
        }
   }

   endGame(){
        this.game.time.setSpeed(0);
        this.engine.loadScene('assets/scenes/end.yaml');
   }
}