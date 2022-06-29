import { Prefab } from "../../../src/behaviours/Prefab";
import { getGameObjectById } from "../../../src/engine";
import { Behaviour } from "../../../src/engine/Behaviour";
import { number } from "../../../src/engine/validators/number";
import { RoomSet } from "./RoomSet";

export class Room extends Behaviour {

    //在此定义脚本中的属性
    @number()
    RoomType;
    @number()
    positionX
    @number()
    positionY
    //static roomObjects:{ [id:string]: RoomType } = {}
    //游戏开始时会执行一次
    onStart() {
        
        this.gameObject.onClick = () => {
            //想在这里判断点击了物体然后返回到父物体的roomSet中，然后就可以new 一个新的房间（create newroom()），并把新的房间状态改变
            console.log("点之前"+this.gameObject.getBehaviour(Room).RoomType)
            this.gameObject.getBehaviour(Room).RoomType=1
            console.log( "点之后"+this.gameObject.getBehaviour(Room).RoomType)

            this.gameObject.getBehaviour(Prefab).prefabPath='assets/engineTest/prefabs/buildingPrefab.yaml'
            console.log(this.gameObject.getBehaviour(Prefab).prefabPath)
            const tileMapGameObj = getGameObjectById("tileMap")
            tileMapGameObj.getBehaviour(RoomSet).checkNeighbor(this.positionX,this.positionY)
        };
    }

    //每次屏幕刷新执行
    onUpdate() {

    }

    //平均每16ms执行一次
    onTick(duringTime: number) {

    }
}