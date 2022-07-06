import { whitespaceFilter } from "_@microsoft_fast-foundation@2.46.9@@microsoft/fast-foundation";
import { Prefab } from "../../src/behaviours/Prefab";
import { GameObject, getGameObjectById,createGameObject } from "../../src/engine";
import {Behaviour} from "../../src/engine/Behaviour";
import { number } from "../../src/engine/validators/number";
import { AddAttribute } from "./AddAttribute";
import {RoomModule, RoomType } from "./modules/RoomModule";
import { TimeControllerSystem } from "./TimeControllerSystem";
import {string} from "../../src/engine/validators/string";
import { Transform } from "../../src/engine/Transform";
import { AttributeSystem } from "./AttributeSystem";
import { GameController } from "./GameController";
import { PersonClass } from "./PersonClass";
import { Type } from "ts-morph";
import { Room } from "./Room";


export class RoomClass extends Behaviour {

    /*
        挂载在每一间屋子上 用来管理房间中的人，房间的属性和属性产出消耗等
    */



    production = 20;//一次产出多少
    @number()
    totalPeopleAttribute = 0;//总人物属性 有一个根据总特质转化的式子
   
    @number()
    level1Size = 2;
    @number()
    level2Size = 4;
    @number()
    level3Size = 5;

    roomType = RoomType.WaterFactory;

    private lastTimeCreate = 0;//产出经过的时间
    private nowTime = 0;
    private lastTimeConsume = 0;
    attributeType= "";// water food energy

    roomId = 0;
    roomLevel = 1;
    peopleInRoom: number[] = [];//储存进来人的id
    private attributeSystem

    private gamecontroller
    private timeController

    leftPositionX = 0; 左边界位置
    bottomPositionY = 0; 地面位置
    onStart() {//拿到
        
    }

    //游戏运行模式开始时会执行一次
    onPlayStart() {
        this.attributeSystem = getGameObjectById("AttributeController").getBehaviour(AttributeSystem);
        this.gamecontroller = getGameObjectById("GameController").getBehaviour(GameController);
        this.timeController = getGameObjectById("TimeController").getBehaviour(TimeControllerSystem);
        this.nowTime = this.timeController.getTotalGameSecondTime();
        this.lastTimeConsume = this.timeController.getTotalGameSecondTime();
        this.lastTimeCreate= this.timeController.getTotalGameSecondTime();

        
    }

    //每次屏幕刷新执行
    onUpdate() { 
   
       
        
    }

    //平均每16ms执行一次   产出 增加
    onTick(duringTime: number) {
        //let totalAttribute = this.calculateTotalAttribute();
        //let createPeriod = this.attributeSystem.caslculateCreatePeriod(this.roomLevel,totalAttribute);
        let createPeriod = this.attributeSystem.calculateCreatePeriod(this.roomLevel,this.totalPeopleAttribute);
        console.log("生产周期"+createPeriod);
        this.nowTime= this.timeController.getTotalGameSecondTime();
        if(this.nowTime-this.lastTimeCreate >=createPeriod*60*60){
            this.createProduction();
            this.lastTimeCreate = this.nowTime;  
        }
        if(this.nowTime-this.lastTimeConsume >=1*60*60){//1小时消耗
            this.attributeSystem.ConsumeForEnergy(this.roomLevel);
            this.lastTimeConsume = this.nowTime;  
        }

    }

    //与人物相关的方法

    changeType(room:RoomType){//转换房间属性
       switch (room){
        case RoomType.WaterFactory:
            return "water";
        case RoomType.EnergyFactory:
            return "energy";
        case RoomType.FoodFactory:
            return "food";
        default:null
       }
    }
    calculateSize(){//计算房间容量
        const sizetable = {
            1: this.level1Size,
            2: this.level2Size,
            3: this.level3Size
        }
        return sizetable[this.roomLevel];
    }

    addPersonInRoom(id:number){//记录人物编号 并判断是否超出限额
        if(this.peopleInRoom.length<this.calculateSize()){
            //this.people[totalPeople] = id;//把id存起来
            this.peopleInRoom[this.peopleInRoom.length] = id
            this.calculateTotalAttribute();//改变一次属性值
           this.setPeopleInRoom();
            return true;
        }
        else {
            console.log("已满");
            return false;
        }; 
        
    }

    removePersonInRoom(id:number){//记录人物编号
        for(var p=0;p<this.peopleInRoom.length;p++){
            if(this.peopleInRoom[p]==id){
                this.peopleInRoom.splice(p,1);//删除
                this.calculateTotalAttribute();
                break;
            }
        }
    }

    setPeopleInRoom(){ //刷新人物位置 播放相应动画
        //等海欣合完就放出来
        // this.leftPositionX = this.gameObject.getBehaviour(Room).getBorder(this.roomId).x;
        // this.bottomPositionY = this.gameObject.getBehaviour(Room).getBorder(this.roomId).y;
        for(var p=0;p<this.peopleInRoom.length;p++){
            //这里赋值
            const person= this.gamecontroller.getPersonById(this.peopleInRoom[p]);//拿到人
            console.log(person);
            const xPos = this.leftPositionX + this.getToLeftPositionX(this.roomType,p);
            const yPos = this.bottomPositionY + this.getToBottomPositionY();
            person.getBehaviour(PersonClass).setPostion(xPos,yPos);
            
            //动画 等xq测试完就放出来
            person.getBehaviour(PersonClass).setAnimation(this.roomType);
            
        } 
    }

    getToLeftPositionX(roomType:RoomType,posNumber:number){  //根据房间属性得到五个距离左边界位置值  0 1 2 water engery food
        switch(roomType){
            case RoomType.WaterFactory:
                const waterPos={
                    0: 0,
                    1: 10,
                    2: 0.5,
                    3: 0.7,
                    4: 1
                }
                return waterPos[posNumber];
            case RoomType.EnergyFactory:
                const energyPos={
                    0: 0,
                    1: 0.2,
                    2: 0.4,
                    3: 0.8,
                    4: 1.5
                }
                return energyPos[posNumber];
            case RoomType.FoodFactory:
                const foodPos={
                    0: 0,
                    1: 0.1,
                    2: 0.5,
                    3: 0.7,
                    4: 1.2
                }
                return foodPos[posNumber];
        }
           

    }
    getToBottomPositionY(){  //这里更改距离地面的坐标
        return 5;
    }

    //属性相关的方法

    calculateTotalAttribute(){ //计算人物总属性 房间人物该属性之和
        let totalAttribute = 0;
        for(var p=0;p<this.peopleInRoom.length;p++){
            //这里写获取该id人物类属性
            //并作加法
            let person= this.gamecontroller.getPersonById(this.peopleInRoom[p]);//拿到人
            totalAttribute+= this.attributeSystem.getPeopleAttribute(person.getBehaviour(PersonClass).personModule.race,this.roomType);
            console.log(p + "增加"+this.attributeSystem.getPeopleAttribute(person.getBehaviour(PersonClass).personModule.race,this.roomType));
            // console.log(p+":"+ this.peopleInRoom[p]);
        }
        
        this.totalPeopleAttribute =  totalAttribute;
        console.log("现在总属性"+this.totalPeopleAttribute);
    }


    createProduction(){ //生成相应属性产出预制体  同时还要产出材料（还没写）
        this.attributeType = this.changeType(this.roomType);
        //console.log(this.attributeType)
        if(this.attributeType!=null){//是否能产出
            this.createPrefab(this.attributeType);
            this.createPrefab("material");
        }
    }


    createPrefab(type:string){//生成对应属性得预制体  water food energy material
        let gameObjectchild = new GameObject() //产出三种属性
        this.gameObject.parent.addChild(gameObjectchild);
        const childrenTransform = new Transform();
        childrenTransform.x = this.gameObject.getBehaviour(Transform).x ;
        childrenTransform.y = this.gameObject.getBehaviour(Transform).y ;
        gameObjectchild.addBehaviour(childrenTransform);
        const addAttributeBe = new AddAttribute();
        addAttributeBe.setType(type);
        const attributeproduction = this.attributeSystem.calculateProduction(this.roomLevel,type);
        addAttributeBe.setPrefabProduction(attributeproduction);
        gameObjectchild.addBehaviour(addAttributeBe);
        const attributeprefab = new Prefab();
        attributeprefab.prefabPath = 'assets/prefabs/add'+type+'Prefab.yaml'
        gameObjectchild.addBehaviour(attributeprefab);
    }


    getProduction(){
        return this.production;
    }
    setProduction(productionNew:number){
        this.production = productionNew;
    }


    ///   拿到属性值  ///
    getRoomType(){
        return this.attributeType;
    }

    setRoomType(type:RoomType){
        this.roomType = type;
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

    // getRoompos(){
    //     return this.roompos;
    // }
    // setRoompos(pos:any){
    //     this.roompos = pos;
    // }


}