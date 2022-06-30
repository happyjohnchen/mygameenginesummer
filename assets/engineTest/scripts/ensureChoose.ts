import { getGameObjectById } from "../../../src/engine";
import { Behaviour } from "../../../src/engine/Behaviour";
import { Transform } from "../../../src/engine/Transform";
import { RoomType } from "../../scripts/modules/RoomModule";

export class ensureChoose extends Behaviour {

    //在此定义脚本中的属性
    
    chooseRoomTypeName
    changeOtherImageMode: boolean
RoomType:RoomType
    setChoosePicture(id: string, isChoose: boolean) {//点击了哪个房间
        this.chooseRoomTypeName = id
        this.changeOtherImageMode = true
    }
    setPictureStyle(id: string) {//点击了哪个房间
        

        let pictureTransform = getGameObjectById(id).getBehaviour(Transform)
        pictureTransform.scaleX = 2
        this.changeOtherImageMode = false
    }

    //游戏编辑模式或运行模式开始时会执行一次
    onStart() {

    }

    //游戏运行模式开始时会执行一次
    onPlayStart() {
        this.changeOtherImageMode = false
        this.gameObject.onClick = () => {
            console.log(this.chooseRoomTypeName)
        }
    }

    //每次屏幕刷新执行
    onUpdate() { 
        if (this.changeOtherImageMode) {
            console.log("in")
            this.setPictureStyle(this.chooseRoomTypeName)
        }
    }

    //平均每16ms执行一次
    onTick(duringTime: number) {

    }

    //删除Behaviour时会执行一次
    onEnd() {

    }
}