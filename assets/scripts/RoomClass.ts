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
import { AttributeSystem } from "./AttributeSystem";


export class RoomClass extends Behaviour {

    //测试用
    // @number()
    // primeProduceTime = 5;//多少小时产出一次
    @number()
    production = 20;//一次产出多少
    @number()
    totalPeopleAttribute = 1;//总人物属性 有一个根据总特质转化的式子
    // @number()
    // coefficient = 0.2;
    // @number()
    // radix = 0.2;
   
    @number()
    level1Size = 2;
    @number()
    level2Size = 4;
    @number()
    level3Size = 5;

    roomType = RoomType.WaterFactory;
    //不储存
    private lastTime = 0;//经过的时间
    private nowTime = 0;
    private producePos = 0;
    attributeType= "water";// water food energy


    //储存 还有个roomtype在上面
    roomId = 0;
    roomLevel = 1;
    peopleInRoom;
    //roompos = new Array();
    people: number[] = [];//储存进来人的id
    AttributeSystem:GameObject

    onStart() {//拿到
        //this.AttributeSystem = getGameObjectById("AttributeController");
    }

    //游戏运行模式开始时会执行一次
    onPlayStart() {

    }

    //每次屏幕刷新执行
    onUpdate() { 
   
        //console.log(this.getRoomType() + "时间周期为："+this.calculatePeriod() + "小时");
        
    }

    //平均每16ms执行一次   每一个小时产出一个增加
    onTick(duringTime: number) {
        // let totalAttribute = this.calculateTotalAttribute();//到时候接人的时候补充算法替换
        let createPeriod = getGameObjectById("AttributeController").getBehaviour(AttributeSystem).calculateCreatePeriod(this.totalPeopleAttribute);
        this.nowTime= getGameObjectById('TimeController').getBehaviour(TimeControllerSystem).getTotalGameSecondTime();
        //this.lastTime = this.lastTime==60? 0:this.lastTime;
        if(this.nowTime-this.lastTime >=createPeriod*60*60){
            this.createProduction();
            this.lastTime = this.nowTime;  
        }
        console.log("生产周期:"+createPeriod);
    }

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

    calculateTotalAttribute(){ //计算人物总属性 房间人物该属性之和
        let totalAttribute = 0;
        for(var p=0;p<this.people.length;p++){
            //这里写获取该id人物类属性
            //并作加法
            //
        }
        return totalAttribute;
    }

    // calculatePeriod(){ //计算消耗周期
    //     let period = this.primeProduceTime - (this.totalPeopleAttribute*this.coefficient) + this.radix;
    //     return period;
    // }

    createProduction(){ //生成相应属性产出预制体
        this.attributeType = this.changeType(this.roomType);
        console.log(this.attributeType)
        if(this.attributeType!=null){
            let gameObjectchild = new GameObject()
            //gameObjectchild.parent= this.gameObject;
            this.gameObject.parent.addChild(gameObjectchild);
            const childrenTransform = new Transform();
            childrenTransform.x = this.gameObject.getBehaviour(Transform).x + this.producePos;
            childrenTransform.y = this.gameObject.getBehaviour(Transform).y + this.producePos;
            // childrenTransform.x = 0 + this.producePos;
            // childrenTransform.y = 0 + this.producePos;
            gameObjectchild.addBehaviour(childrenTransform);
            const addAttributeBe = new addAttribute();
            addAttributeBe.setType(this.attributeType);
            addAttributeBe.setPrefabProduction(this.production);
            gameObjectchild.addBehaviour(addAttributeBe);
            const attributeprefab = new Prefab();
            attributeprefab.prefabPath = 'assets/engineTest/prefabs/add'+this.attributeType +'Prefab.yaml'
            gameObjectchild.addBehaviour(attributeprefab);
        }
        console.log("create");
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