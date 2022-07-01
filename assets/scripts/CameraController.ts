import { ImageRenderer } from "../../src/behaviours/ImageRenderer";
import { ShapeRectRenderer } from "../../src/behaviours/ShapeRectRenderer";
import { createGameObject, GameObject, getBehaviourClassByName, getGameObjectById, hasGameObjectById } from "../../src/engine";
import { Behaviour } from "../../src/engine/Behaviour";
import { Transform } from "../../src/engine/Transform";
import { number } from "../../src/engine/validators/number";

export class CameraController extends Behaviour {

    //在此定义脚本中的属性

    myBackGround: GameObject;
    leftController: GameObject;
    rightController: GameObject;
    upController: GameObject;
    downController: GameObject;
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


        this.upController = new GameObject();
        this.gameObject.addChild(this.upController);
        const transformUp = new Transform();
        transformUp.x = -80;
        transformUp.y = -275;
        transformUp.rotation =0
        this.upController.addBehaviour(transformUp);
        const imageup = new ImageRenderer()
        imageup.imagePath = 'assets/images/arr1_trans.png'
        this.upController.addBehaviour(imageup)

        this.upController.onHoverIn = (e) => {
            this.direction = 3;
            this.isHonver = false;
            console.log("up Controller")
        }
        this.upController.onHoverOut = (e) => {
            this.direction = 0;
            this.isHonver = false;
            //console.log("left Controller")
        }

        this.downController = new GameObject();
        this.gameObject.addChild(this.downController);
        const transformDown = new Transform();
        transformDown.x = 100;
        transformDown.y = 275;
        transformDown.rotation = 180
        this.downController.addBehaviour(transformDown);
        const imagedown = new ImageRenderer()
        imagedown.imagePath = 'assets/images/arr1_trans.png'
        this.downController.addBehaviour(imagedown)

        this.downController.onHoverIn = (e) => {
            this.direction = 4;
            this.isHonver = false;
            console.log("down Controller")
        }
        this.downController.onHoverOut = (e) => {
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
            case 3:
                this.gameObject.getBehaviour(Transform).y = this.gameObject.getBehaviour(Transform).y - this.speed;
                break;
            case 4:
                this.gameObject.getBehaviour(Transform).y = this.gameObject.getBehaviour(Transform).y + this.speed;
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