import { ImageRenderer } from "../../src/behaviours/ImageRenderer";
import { createGameObject, GameObject, getBehaviourClassByName, getGameObjectById, hasGameObjectById } from "../../src/engine";
import { Behaviour } from "../../src/engine/Behaviour";
import { Transform } from "../../src/engine/Transform";

export class CameraController extends Behaviour {

    //在此定义脚本中的属性

    myBackGround: GameObject;





    //游戏编辑模式或运行模式开始时会执行一次
    onStart() {
        

        const myCameraTransform = this.gameObject.getBehaviour(Transform);
        let mouseDownTransform = new Transform();
        let mouseDown = false;
        const body = document.body;
        const mouseDownPosition = { x: 0, y: 0 };
        document.oncontextmenu = () => {
            return false;
        }
        body.onmousedown = (e) => {
            mouseDown = true;
            mouseDownPosition.x = e.clientX;
            mouseDownPosition.y = e.clientY;
            mouseDownTransform = myCameraTransform;
        }
        body.onmouseup = (e) => {
            mouseDown = false
        }
        body.onmousemove = (e) => {
            if (mouseDown) {
                //移动
                this.gameObject.getBehaviour(Transform).x = (mouseDownPosition.x - e.clientX) * 0.01 + mouseDownTransform.x;
                this.gameObject.getBehaviour(Transform).y = (mouseDownPosition.y - e.clientY) * 0.01 + mouseDownTransform.y;
            }
        }
        body.onwheel = (e) => {
            this.gameObject.getBehaviour(Transform).scaleX += e.deltaY / 5000;
            this.gameObject.getBehaviour(Transform).scaleY += e.deltaY / 5000;
        }
        console.log("camara controller is prepared.")

       /*  if (this.myBackGround.hasBehaviour(ImageRenderer)) {

        } */

    }

    //游戏运行模式开始时会执行一次
    onPlayStart() {
        this.checkBackground()

    }

    //每次屏幕刷新执行
    onUpdate() {

    }

    //平均每16ms执行一次
    onTick(duringTime: number) {

    }

    checkBackground() {
        if (hasGameObjectById('background')) {
            this.myBackGround = getGameObjectById('Background')
        }
        else {
            const child = new GameObject();
            child.id = 'background'
            this.gameObject.parent.addChild(child)
            this.myBackGround = child
        }
        if(!this.myBackGround.hasBehaviour(ImageRenderer))
        {
            // const imageRenderer  =  new ImageRenderer();
            // imageRenderer.imagePath = 'assets/engineTest/images/testImage.png'
            // this.myBackGround.addBehaviour(imageRenderer);
        }
    }
    
    checkBackgroundRenderer()
    {
        
        /* if(!this.myBackGround.hasBehaviour(ImageRenderer))
        {
            this.myBackGround.addBehaviour(new ImageRenderer)
        } */
    }
}