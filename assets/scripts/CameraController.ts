import { ImageRenderer } from "../../src/behaviours/ImageRenderer";
import { ShapeRectRenderer } from "../../src/behaviours/ShapeRectRenderer";
import { createGameObject, GameObject, getBehaviourClassByName, getGameObjectById, hasGameObjectById } from "../../src/engine";
import { Behaviour } from "../../src/engine/Behaviour";
import { Transform } from "../../src/engine/Transform";
import { number } from "../../src/engine/validators/number";

export class CameraController extends Behaviour {

    //在此定义脚本中的属性

    myBackGround: GameObject;
    leftController;
    rightController;
    isHonver = false;
    direction: number;
    
    @number()
    speed = 5;
    



    //游戏编辑模式或运行模式开始时会执行一次
    onStart() {
        


        const myCameraTransform = this.gameObject.getBehaviour(Transform);
        let mouseDownTransform = new Transform();
        //let mouseDown = false;
        const body = document.body;
        const mouseDownPosition = { x: 0, y: 0 };
        document.oncontextmenu = () => {
            return false;
        }
        /* body.onmousedown = (e) => {
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
        } */
        body.onwheel = (e) => {
            this.gameObject.getBehaviour(Transform).scaleX += e.deltaY / 5000;
            this.gameObject.getBehaviour(Transform).scaleY += e.deltaY / 5000;
        }
        console.log("camara controller is prepared.")


    }

    //游戏运行模式开始时会执行一次
    onPlayStart() {
        this.checkBackground()

        this.leftController = new GameObject();
        this.gameObject.addChild(this.leftController);
        const transformLeft = new Transform();
        transformLeft.x = - 490;
        transformLeft.y = 100;
        transformLeft.rotation = -90
        this.leftController.addBehaviour(transformLeft);
        const imageLeft = new ImageRenderer()
        imageLeft.imagePath = 'assets/images/arr1_trans.png'
        this.leftController.addBehaviour(imageLeft)

        this.leftController.onHoverIn = (e) => {
            this.direction = 1;
            this.isHonver = false;
            console.log("left Controller")
        }
        this.leftController.onHoverOut = (e) => {
            this.direction = 0;
            this.isHonver = false;
            //console.log("left Controller")
        }


        this.rightController = new GameObject();
        this.gameObject.addChild(this.rightController);
        const transformRight = new Transform();
        transformRight.x = 490;
        transformRight.y = -105;
        transformRight.rotation = 90
        this.rightController.addBehaviour(transformRight);
        const imageRight = new ImageRenderer()
        imageRight.imagePath = 'assets/images/arr1_trans.png'
        this.rightController.addBehaviour(imageRight)

        this.rightController.onHoverIn = (e) => {
            this.direction = 2;
            this.isHonver = false;
            console.log("right Controller")
        }
        this.rightController.onHoverOut = (e) => {
            this.direction = 0;
            this.isHonver = false;
            //console.log("left Controller")
        }

    }

    //每次屏幕刷新执行
    onUpdate() {

    }

    //平均每16ms执行一次
    onTick(duringTime: number) {
        switch (this.direction) {
            case 1:
                this.gameObject.getBehaviour(Transform).x = this.gameObject.getBehaviour(Transform).x - this.speed;
                break;
            case 2:
                this.gameObject.getBehaviour(Transform).x = this.gameObject.getBehaviour(Transform).x + this.speed;
                break;

        }

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
        if (!this.myBackGround.hasBehaviour(ImageRenderer)) {
            // const imageRenderer  =  new ImageRenderer();
            // imageRenderer.imagePath = 'assets/engineTest/images/testImage.png'
            // this.myBackGround.addBehaviour(imageRenderer);
        }
    }

    checkBackgroundRenderer() {

        /* if(!this.myBackGround.hasBehaviour(ImageRenderer))
        {
            this.myBackGround.addBehaviour(new ImageRenderer)
        } */
    }
}