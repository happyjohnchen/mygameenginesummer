import { GameObject, getGameObjectById } from "../../src/engine";
import {Behaviour} from "../../src/engine/Behaviour";
import { AttributeSystem } from "./AttributeSystem";
import {RoomModule, RoomType } from "./modules/RoomModule";
import { RoomSet } from "./RoomSet";
export class UiCreateRoom extends Behaviour {

    //点击方块 返回值
    private roomTypeForUi;

    attibuteSystem:GameObject
    //游戏编辑模式或运行模式开始时会执行一次
    onStart() {
        this.attibuteSystem = getGameObjectById("AttributeController");
    }

    //游戏运行模式开始时会执行一次
    onPlayStart() {
        this.roomTypeForUi = this.gameObject.id;
        this.gameObject.onClick = (e) => {
            if(e.button ==0){//点击调用选择房间 同时关闭ui
                this.chooseRoom();
                getGameObjectById("CreateUi").active = false;
            }
        }
    }


    //每次屏幕刷新执行
    onUpdate() {

    }

    //平均每16ms执行一次
    onTick(duringTime: number) {

    }

    //删除Behaviour时会执行一次
    onEnd() {

    }

    chooseRoom(){//选择房间 调用创建函数
        
        const roomTypeTable = {
            "WaterFactory" : RoomType.WaterFactory,
            "EnergyFactory" : RoomType.EnergyFactory,
            "FoodFactory" :RoomType.FoodFactory
        }
        //console.log(this.attibuteSystem.getBehaviour(AttributeSystem).consumeForMaterial(100));
        if(this.attibuteSystem.getBehaviour(AttributeSystem).consumeForMaterial(100)==true){
         
          const roomset=  getGameObjectById("tileMap").getBehaviour(RoomSet)
          roomset.setbuildRoom(roomTypeTable[this.roomTypeForUi]);
          
          roomset.setRoomCanBuild();
            return roomTypeTable[this.roomTypeForUi]; //这个值就是返回的房间类型 邓海欣在这里写用这个值干什么  return 你根据需求 可以改
        }
        else{
            console.log("材料不够")
        }
        
         
    }
}