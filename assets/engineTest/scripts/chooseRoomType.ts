import { transform } from "typescript";
import { ImageRenderer } from "../../../src/behaviours/ImageRenderer";
import { GameObject, getGameObjectById } from "../../../src/engine";
import {Behaviour} from "../../../src/engine/Behaviour";
import { Transform } from "../../../src/engine/Transform";
import { string } from "../../../src/engine/validators/string";
import { ensureChoose } from "./ensureChoose";
import { setImageStyle } from "./setImageStyle";

export class chooseRoomType extends Behaviour {

    //在此定义脚本中的属性


clearScale(){
    this.gameObject.getBehaviour
}
/*makeOption(id:number,isChoose:boolean){
    let child = new GameObject();
    this.gameObject.addChild(child)
    const childTransform = new Transform();
    childTransform.x = 0 + id * 150;
    child.addBehaviour(childTransform);
    const imageStyle = new setImageStyle();
    
    child.addBehaviour(imageStyle);
    const backgroundImage = new ImageRenderer()
    if (isChoose) {
        backgroundImage.imagePath = 'assets/engineTest/images/testImage1.png'
    }
    else if (roomType == 2) { backgroundImage.imagePath = 'assets/engineTest/images/testImage.png' }
    self.child.addBehaviour(backgroundImage);
    this.storeBuildStatus(roomPositionX, roomPositionY, self.child)

}*/
    //游戏编辑模式或运行模式开始时会执行一次
    onStart() {

    }

    //游戏运行模式开始时会执行一次
    onPlayStart() {
        let ensureButton=getGameObjectById('ensureButton')
        this.gameObject.onClick = () => {


            console.log(this.gameObject.id)
            //this.gameObject.parent.getBehaviour(setImageStyle).setImageOrigin();
            this.gameObject.getBehaviour(Transform).scaleX=2
        // ensureButton.getBehaviour(ensureChoose).setChoosePicture(this.gameObject.id,true)

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