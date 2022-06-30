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


export class RoomClass extends Behaviour {

    //测试用
    @string()
    roomType= "water";// water food energy
    @number()
    primeProduceTime = 5;//多少小时产出一次

    @number()
    production = 20;//一次产出多少

    @number()
    totalPeopleAttribute = 1;//总人物属性 有一个根据总特质转化的式子
    @number()
    coefficient = 0.2;
    @number()
    radix = 0.2;
   
    private lastTime = 0;//经过的时间
    private nowTime = 0;

    private producePos = 0;

    private roomId = 0;
    private roomLevel = 1;

    private peopleInRoom;

    onStart() {
    
        
    }

    //游戏运行模式开始时会执行一次
    onPlayStart() {

    }

    //每次屏幕刷新执行
    onUpdate() { //获取自己的父物体判断是否是自己生成的 这样可以单个调整数值
   
        //console.log(this.getRoomType() + "时间周期为："+this.calculatePeriod() + "小时");
        
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

    calculatePeriod(){ //计算消耗周期
        let period = this.primeProduceTime - (this.totalPeopleAttribute*this.coefficient) + this.radix;
        return period;
    }

    createProduction(){ //生成产出预制体
        let gameObjectchild = new GameObject()
        gameObjectchild.parent= this.gameObject;
        this.gameObject.addChild(gameObjectchild);
        const childrenTransform = new Transform();
        childrenTransform.x = 0 + this.producePos;
        childrenTransform.y = 0 + this.producePos;
        gameObjectchild.addBehaviour(childrenTransform);
        const attributeprefab = new Prefab();
        attributeprefab.prefabPath = 'assets/engineTest/prefabs/add'+this.roomType +'Prefab.yaml'
        gameObjectchild.addBehaviour(attributeprefab);
        console.log(gameObjectchild);
    }

    ///   拿到属性值  ///
    getRoomType(){
        return this.roomType;
    }

    setRoomType(type:string){
        this.roomType = type;
    }

 
    getProduction(){
        return this.production;
    }
    setProduction(productionNew:number){
        this.production = productionNew;
    }

    getRoomId(){
        return this.roomId;
    }
    setRoomid(id:number){
        this.roomId = id;
    }

    getRoomLevel(){
        return this.roomLevel;
    }
    setRoomLevel(level:number){
        this.roomLevel = level;
    }


}