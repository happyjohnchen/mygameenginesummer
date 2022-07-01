import { whitespaceFilter } from "_@microsoft_fast-foundation@2.46.9@@microsoft/fast-foundation";
import { Prefab } from "../../src/behaviours/Prefab";
import { GameObject, getGameObjectById,createGameObject } from "../../src/engine";
import {Behaviour} from "../../src/engine/Behaviour";
import { number } from "../../src/engine/validators/number";
import { addAttribute } from "./addAttribute";
import {RoomModule, RoomType } from "./modules/RoomModule";
import { TimeControllerSystem } from "./TimeControllerSystem";
import {string} from "../../src/engine/validators/string";
import { Transform } from "../../src/engine/Transform";
import { RoomClass } from "./RoomClass";
import { AttributeSystem } from "./AttributeSystem";


export class test extends Behaviour {

  
   
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

    gameObejecttest;
    onStart() {
    }

    //游戏运行模式开始时会执行一次
    onPlayStart() {
        this.gameObject.onClick = (e) => {
            if(e.button ==0){
                //console.log( getGameObjectById("AttributeController").getBehaviour(AttributeSystem).calculateProduction(3,"water"));
                
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