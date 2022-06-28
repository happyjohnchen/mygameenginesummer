import { ImageRenderer } from "../../src/behaviours/ImageRenderer";
import { Prefab } from "../../src/behaviours/Prefab";
import { GameObject } from "../../src/engine";
import {Behaviour} from "../../src/engine/Behaviour";
import { Transform } from "../../src/engine/Transform";
import { number } from "../../src/engine/validators/number";
export enum RoomType {

    empty = 0,

    isBuild = 1,

    canBuild = 2
}
export class RoomSet extends Behaviour {

    //在此定义脚本中的属性
    @number()
    roomtype =RoomType.empty;


    //游戏开始时会执行一次
    onStart(): void {
        
        const child = new GameObject();
        this.gameObject.addChild(child)
     const roomPrefab=new Prefab();
        roomPrefab.prefabPath='assets/prefabs/roomPrefab.yaml'
        child.addBehaviour(roomPrefab);
        const childTransform = new Transform();
        childTransform.x =0;
        childTransform.y = 0;
        child.addBehaviour(childTransform);
        const image=new ImageRenderer();
        image.imagePath='assets/images/testImage.png'
        child.addBehaviour(image);


    }

    //每次屏幕刷新执行
    onUpdate() {

    }

    //平均每16ms执行一次
    onTick(duringTime: number) {

    }
}