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


export class Test_xjy extends Behaviour {

  
   
    //不储存
    private lastTime = 0;//经过的时间
    private nowTime = 0;
    private producePos = 0;


    //储存 还有个roomtype在上面
    roomId = 0;
    roomLevel = 1;
    peopleInRoom;
    roompos = new Array();
    people: number[] = [16,32];//储存进来人的id
    private gamecontroller
    
    onStart() {
        this.gamecontroller = getGameObjectById("GameController").getBehaviour(GameController);
    }

    //游戏运行模式开始时会执行一次
    onPlayStart() {
        this.gameObject.onClick = (e) => {
            if(e.button ==0){
                console.log("点击判断")
                // this.gameObject.getBehaviour(PersonClass).personModule.personId = 2;
                // this.gamecontroller.addPerson(this.gameObject);
                getGameObjectById("Person").getBehaviour(PersonClass).personModule.personId = 2;
                getGameObjectById("Person").getBehaviour(PersonClass).personModule.race = PersonRace.Dwarf;
                this.gamecontroller.addPerson(getGameObjectById("Person"));
                console.log("现在加入的人"+this.gamecontroller.getPersonById(2).getBehaviour(PersonClass).personModule.race);
                getGameObjectById("WaterFactory").getBehaviour(RoomClass).addPersonInRoom(2);
                console.log(getGameObjectById("WaterFactory").getBehaviour(RoomClass).peopleInRoom);
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
    calculateSize(){//计算房间容量
        const sizetable = {
            1: 2,
            2: 4,
            3: 5
        }
        return sizetable[this.roomLevel];
    }

    addPerson(id:number){//记录人物编号 并判断是否超出限额
        if(this.people.length<this.calculateSize()){
            //this.people[totalPeople] = id;//把id存起来
            this.people[this.people.length] = id
        }
        else {
            console.log("已满");
            return
        };
        
    }
    removePerson(id:number){//记录人物编号
        for(var p=0;p<this.people.length;p++){
            if(this.people[p]==id){
                this.people.splice(p,1);//删除
                break;
            }
        }
    }
    getPeopleCount(){
        let count = 0;
        for(let p = 0;p++;p=this.people.length ){
            count++;
        }
        return count;
    }

    calculateTotalAttribute(){ //计算人物总属性 房间人物该属性之和

    }


}