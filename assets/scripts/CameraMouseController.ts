import { ImageRenderer, ImageRenderer as imageRenderer } from "../../src/behaviours/ImageRenderer";
import { ShapeRectRenderer } from "../../src/behaviours/ShapeRectRenderer";
import { createGameObject, GameObject, getBehaviourClassByName, getGameObjectById, hasGameObjectById } from "../../src/engine";
import { Behaviour } from "../../src/engine/Behaviour";
import { Rectangle } from "../../src/engine/math";
import { Transform } from "../../src/engine/Transform";
import { number } from "../../src/engine/validators/number";

export class CameraMouseController extends Behaviour {

    //在此定义脚本中的属性

    myBackGround: GameObject;
    leftController: GameObject;
    rightController: GameObject;
    upController: GameObject;
    downController: GameObject;
    isHonver = false;
    direction: number;
    backgroundImageRectangle: Rectangle

    @number()
    speed = 5;

    canvas = document.getElementById('game') as HTMLCanvasElement;



    //游戏编辑模式或运行模式开始时会执行一次
    onStart() {

        const myCameraTransform = this.gameObject.getBehaviour(Transform);
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
        this.checkBackgroundRenderer()

        this.leftController = new GameObject();
        this.gameObject.addChild(this.leftController);
        const transformLeft = new Transform();
        transformLeft.x = - 490;
        transformLeft.y = 100;
        transformLeft.rotation = -90
        this.leftController.addBehaviour(transformLeft);
        const imageLeft = new imageRenderer()
        imageLeft.imagePath = 'assets/images/arr1_trans.png'
        this.leftController.addBehaviour(imageLeft)

        this.leftController.onHoverIn = (e) => {
            this.direction = 1;
            this.isHonver = false;
            imageLeft.imagePath = 'assets/images/arr1.png'
            console.log("left Controller")
        }
        this.leftController.onHoverOut = (e) => {
            this.direction = 0;
            imageLeft.imagePath = 'assets/images/arr1_trans.png'
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
        const imageRight = new imageRenderer()
        imageRight.imagePath = 'assets/images/arr1_trans.png'
        this.rightController.addBehaviour(imageRight)

        this.rightController.onHoverIn = (e) => {
            this.direction = 2;
            this.isHonver = false;
            imageRight.imagePath = 'assets/images/arr1.png'
            console.log("right Controller")
        }
        this.rightController.onHoverOut = (e) => {
            this.direction = 0;
            this.isHonver = false;
            imageRight.imagePath = 'assets/images/arr1_trans.png'
            //console.log("left Controller")
        }


        this.upController = new GameObject();
        this.gameObject.addChild(this.upController);
        const transformUp = new Transform();
        transformUp.x = -80;
        transformUp.y = -275;
        transformUp.rotation = 0
        this.upController.addBehaviour(transformUp);
        const imageUp = new imageRenderer()
        imageUp.imagePath = 'assets/images/arr1_trans.png'
        this.upController.addBehaviour(imageUp)

        this.upController.onHoverIn = (e) => {
            this.direction = 3;
            this.isHonver = false;
            imageUp.imagePath = 'assets/images/arr1.png'
            console.log("up Controller")
        }
        this.upController.onHoverOut = (e) => {
            this.direction = 0;
            this.isHonver = false;
            imageUp.imagePath = 'assets/images/arr1_trans.png'
            //console.log("left Controller")
        }

        this.downController = new GameObject();
        this.gameObject.addChild(this.downController);
        const transformDown = new Transform();
        transformDown.x = 100;
        transformDown.y = 275;
        transformDown.rotation = 180
        this.downController.addBehaviour(transformDown);
        const imageDown = new imageRenderer()
        imageDown.imagePath = 'assets/images/arr1_trans.png'
        this.downController.addBehaviour(imageDown)

        this.downController.onHoverIn = (e) => {
            this.direction = 4;
            this.isHonver = false;
            imageDown.imagePath = 'assets/images/arr1.png'
            console.log("down Controller")
        }
        this.downController.onHoverOut = (e) => {
            this.direction = 0;
            this.isHonver = false;
            imageDown.imagePath = 'assets/images/arr1_trans.png'
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
                if (this.gameObject.getBehaviour(Transform).x - 0.5 * this.canvas.width * this.gameObject.getBehaviour(Transform).scaleX - this.myBackGround.getBehaviour(Transform).x >= 0) {
                    this.gameObject.getBehaviour(Transform).x = this.gameObject.getBehaviour(Transform).x - this.speed;
                }
                break;
            case 2:
                if (this.gameObject.getBehaviour(Transform).x + 0.5 * this.canvas.width - this.myBackGround.getBehaviour(Transform).x - this.backgroundImageRectangle.width <= 0) {
                    this.gameObject.getBehaviour(Transform).x = this.gameObject.getBehaviour(Transform).x + this.speed;
                }

                break;
            case 3:
                if (this.gameObject.getBehaviour(Transform).y - 0.5 * this.canvas.height - this.myBackGround.getBehaviour(Transform).y >= 0)
                    this.gameObject.getBehaviour(Transform).y = this.gameObject.getBehaviour(Transform).y - this.speed;
                break;
            case 4:
                if (this.gameObject.getBehaviour(Transform).y + 0.5 * this.canvas.height - this.myBackGround.getBehaviour(Transform).y - this.backgroundImageRectangle.height <= 0) {
                    this.gameObject.getBehaviour(Transform).y = this.gameObject.getBehaviour(Transform).y + this.speed;
                }
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

    }

    checkBackgroundRenderer() {

        if (!this.myBackGround.hasBehaviour(imageRenderer)) {
            const imageRenderer = new ImageRenderer()
            imageRenderer.imagePath = "assets/engineTest/images/th.jpg"
            this.myBackGround.addBehaviour(imageRenderer);
        }
        this.backgroundImageRectangle = this.myBackGround.getBehaviour(imageRenderer).getBounds();
    }
}