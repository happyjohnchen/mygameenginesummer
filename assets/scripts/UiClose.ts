import { ImageRenderer } from "../../src/behaviours/ImageRenderer";
import { getGameObjectById } from "../../src/engine";
import {Behaviour} from "../../src/engine/Behaviour";
import { string } from "../../src/engine/validators/string";
import { RoomSet } from "./RoomSet";

export class UiClose extends Behaviour {

    //在此定义脚本中的属性


    @string()
    imageUp = ""
    @string()
    imageDown = ""
    @string()
    closeName = ""
    //游戏编辑模式或运行模式开始时会执行一次
    onStart() {

    }

    //游戏运行模式开始时会执行一次
    onPlayStart() {
        this.gameObject.onClick = (e) => {
            if(e.button ==0){
            
                this.gameObject.getBehaviour(ImageRenderer).imagePath = this.imageDown;    
            }
            this.gameObject.onClickFinish = (e) => {
                if(e.button ==0){
                    this.gameObject.getBehaviour(ImageRenderer).imagePath = this.imageUp;  
                    getGameObjectById(this.closeName).active = false; 
                    getGameObjectById("tileMap").getBehaviour(RoomSet).setRoomNotCanchoose();
                }
         
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