import { getGameObjectById } from "../../src/engine";
import {Behaviour} from "../../src/engine/Behaviour";
import { GameController } from "./GameController";
import { Room } from "./Room";
import { RoomSet } from "./RoomSet";

export class UpdateBtn extends Behaviour {

    //在此定义脚本中的属性


    //游戏编辑模式或运行模式开始时会执行一次
    onStart() {

    }

    //游戏运行模式开始时会执行一次
    onPlayStart() {
        this.gameObject.onClick = (e) => {
            if(e.button ==0){//点击调用选择房间 同时关闭ui
                this.updateRoom();
                getGameObjectById("RoomSecondUi").active = false;
            }
        }
    }
    updateRoom() {
        //这里写调用房间升级
        let gameController = getGameObjectById("GameController").getBehaviour(GameController)
let roomid=getGameObjectById("tileMap").getBehaviour(RoomSet).updateAndDestroyBtnID
        if(roomid>=0){
          let room=  gameController.getRoomById(roomid)
          room.getBehaviour(Room).upgradeRoom(room);
          roomid=-1
        }
        console.log("升级");
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
}