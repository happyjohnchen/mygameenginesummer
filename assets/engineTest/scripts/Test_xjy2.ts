import { Prefab } from "../../../src/behaviours/Prefab";
import { GameObject, getGameObjectById,createGameObject } from "../../../src/engine";
import {Behaviour} from "../../../src/engine/Behaviour";
import { number } from "../../../src/engine/validators/number";
import { AddAttribute } from "../../scripts/AddAttribute";
import {RoomModule, RoomType } from "../../scripts/modules/RoomModule";
import { TimeControllerSystem } from "../../scripts/TimeControllerSystem";
import {string} from "../../../src/engine/validators/string";
import { Transform } from "../../../src/engine/Transform";
import { RoomClass } from "../../scripts/RoomClass";
import { AttributeSystem } from "../../scripts/AttributeSystem";
import { PersonModule, PersonRace } from "../../scripts/modules/PersonModule";
import { PersonClass } from "../../scripts/PersonClass";
import { GameController } from "../../scripts/GameController";


export class Test_xjy2  extends Behaviour {

    private gamecontroller
    
    onStart() {
        this.gamecontroller = getGameObjectById("GameController").getBehaviour(GameController);
        
    }

    //游戏运行模式开始时会执行一次
    onPlayStart() {
        this.gameObject.onClick = (e) => {
            if(e.button ==0){
                console.log("点击判断")
                getGameObjectById("Person2").getBehaviour(PersonClass).personModule.personId = 2;
                getGameObjectById("Person2").getBehaviour(PersonClass).personModule.race = PersonRace.Human;
                this.gamecontroller.addPerson(getGameObjectById("Person2"));
                getGameObjectById("WaterFactory").getBehaviour(RoomClass).addPersonInRoom(2);
                console.log(getGameObjectById("WaterFactory").getBehaviour(RoomClass).peopleInRoom);
                console.log("2种族"+this.gamecontroller.getPersonById(2).getBehaviour(PersonClass).personModule.race);
            }
     
       }
  
    }

    //每次屏幕刷新执行
    onUpdate() { //获取自己的父物体判断是否是自己生成的 这样可以单个调整数值
   
        //console.log(this.getRoomType() + "时间周期为："+this.calculatePeriod() + "小时");
        
    }

    //平均每16ms执行一次   每一个小时产出一个增加
    onTick(duringTime: number) {
       
    }


}