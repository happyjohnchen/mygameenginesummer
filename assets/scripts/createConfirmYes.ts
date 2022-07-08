import { GameObject, getGameObjectById } from "../../src/engine";
import {Behaviour} from "../../src/engine/Behaviour";
import { Room } from "./Room";
import { RoomSet } from "./RoomSet";

export class createConfirmYes extends Behaviour {
room:GameObject
    //在此定义脚本中的属性
setRoom(room:GameObject){
this.room=room;
}

    //游戏编辑模式或运行模式开始时会执行一次
    onStart() {

    }

    //游戏运行模式开始时会执行一次
    onPlayStart() {
        this.gameObject.onClick = () => {
            if(this.room!=null){
                this.room.getBehaviour(Room).buildRoom();
                this.room=null;
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
}