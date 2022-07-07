import {ImageRenderer, ImageRenderer as imageRenderer} from "../../src/behaviours/ImageRenderer";
import {
    GameObject,
    getGameObjectById,
    hasGameObjectById
} from "../../src/engine";
import {Behaviour} from "../../src/engine/Behaviour";
import {Rectangle} from "../../src/engine/math";
import {Transform} from "../../src/engine/Transform";
import {number} from "../../src/engine/validators/number";

export class CameraMouseController extends Behaviour {

    //在此定义脚本中的属性

    myBackGround: GameObject;
    leftController: GameObject;
    rightController: GameObject;
    upController: GameObject;
    downController: GameObject;
    isHover = false;
    direction: number;
    backgroundImageRectangle: Rectangle

    @number()
    speed = 5;

    canvas = {width: 960, height: 540};

    cameraTransform: Transform;

    //游戏编辑模式或运行模式开始时会执行一次
    onStart() {

    }

    //游戏运行模式开始时会执行一次
    onPlayStart() {
        this.cameraTransform = this.gameObject.getBehaviour(Transform);
        const body = document.body;
        document.oncontextmenu = () => {
            return false;
        }
        body.onwheel = (e) => {
            if ((e.deltaY < 0 && this.cameraTransform.scaleX > 0.5) ||
                (e.deltaY > 0 &&
                    this.cameraTransform.x - 0.5 * this.canvas.width * this.cameraTransform.scaleX - this.myBackGround.getBehaviour(Transform).x > 0 &&
                    this.cameraTransform.x + 0.5 * this.canvas.width * this.cameraTransform.scaleX - this.myBackGround.getBehaviour(Transform).x - this.backgroundImageRectangle.width <= 0 &&
                    this.cameraTransform.y - 0.5 * this.canvas.height * this.cameraTransform.scaleY - this.myBackGround.getBehaviour(Transform).y > 0 &&
                    this.cameraTransform.y + 0.5 * this.canvas.height * this.cameraTransform.scaleX - this.myBackGround.getBehaviour(Transform).y - this.backgroundImageRectangle.height < 0)
            ) {
                this.cameraTransform.scaleX += e.deltaY / 5000;
                this.cameraTransform.scaleY += e.deltaY / 5000;
            }
        }
        console.log("camara controller is prepared.")

        this.checkBackground()
        this.checkBackgroundRenderer()

        this.leftController = new GameObject();
        this.gameObject.addChild(this.leftController);
        const transformLeft = new Transform();
        transformLeft.x = -490;
        transformLeft.y = 100;
        transformLeft.rotation = -90
        this.leftController.addBehaviour(transformLeft);
        const imageLeft = new ImageRenderer()
        imageLeft.imagePath = 'assets/images/arr1_trans.png'
        this.leftController.addBehaviour(imageLeft)

        this.leftController.onHoverIn = () => {
            this.direction = 1;
            this.isHover = false;
            imageLeft.imagePath = 'assets/images/arr1.png'
            console.log("left Controller")
        }
        this.leftController.onHoverOut = () => {
            this.direction = 0;
            imageLeft.imagePath = 'assets/images/arr1_trans.png'
            this.isHover = false;
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

        this.rightController.onHoverIn = () => {
            this.direction = 2;
            this.isHover = false;
            imageRight.imagePath = 'assets/images/arr1.png'
            console.log("right Controller")
        }
        this.rightController.onHoverOut = () => {
            this.direction = 0;
            this.isHover = false;
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
        const imageUp = new ImageRenderer()
        imageUp.imagePath = 'assets/images/arr1_trans.png'
        this.upController.addBehaviour(imageUp)

        this.upController.onHoverIn = () => {
            this.direction = 3;
            this.isHover = false;
            imageUp.imagePath = 'assets/images/arr1.png'
            console.log("up Controller")
        }
        this.upController.onHoverOut = () => {
            this.direction = 0;
            this.isHover = false;
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
        const imageDown = new ImageRenderer()
        imageDown.imagePath = 'assets/images/arr1_trans.png'
        this.downController.addBehaviour(imageDown)

        this.downController.onHoverIn = () => {
            this.direction = 4;
            this.isHover = false;
            imageDown.imagePath = 'assets/images/arr1.png'
            console.log("down Controller")
        }
        this.downController.onHoverOut = () => {
            this.direction = 0;
            this.isHover = false;
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
                if (this.cameraTransform.x - 0.5 * this.canvas.width * this.cameraTransform.scaleX - this.myBackGround.getBehaviour(Transform).x >= 0) {
                    this.cameraTransform.x = this.cameraTransform.x - this.speed;
                }
                break;
            case 2:
                if (this.cameraTransform.x + 0.5 * this.canvas.width * this.cameraTransform.scaleX - this.myBackGround.getBehaviour(Transform).x - this.backgroundImageRectangle.width * this.myBackGround.getBehaviour(Transform).scaleX <= 0) {
                    this.cameraTransform.x = this.cameraTransform.x + this.speed;
                }

                break;
            case 3:
                if (this.cameraTransform.y - 0.5 * this.canvas.height * this.cameraTransform.scaleY - this.myBackGround.getBehaviour(Transform).y >= 0)
                    this.cameraTransform.y = this.cameraTransform.y - this.speed;
                break;
            case 4:
                if (this.cameraTransform.y + 0.5 * this.canvas.height * this.cameraTransform.scaleX - this.myBackGround.getBehaviour(Transform).y - this.backgroundImageRectangle.height * this.myBackGround.getBehaviour(Transform).scaleY <= 0) {
                    this.cameraTransform.y = this.cameraTransform.y + this.speed;
                }
                break;

        }

    }

    checkBackground() {
        if (hasGameObjectById('Background')) {
            this.myBackGround = getGameObjectById('Background')
        } else {
            const child = new GameObject();
            child.id = 'Background'
            this.gameObject.parent.addChild(child)
            this.myBackGround = child
        }
    }

    checkBackgroundRenderer() {
        if (!this.myBackGround.hasBehaviour(ImageRenderer)) {
            const imageRenderer = new ImageRenderer()
            imageRenderer.imagePath = "assets/engineTest/images/th.jpg"
            this.myBackGround.addBehaviour(imageRenderer);
        }
        this.backgroundImageRectangle = this.myBackGround.getBehaviour(ImageRenderer).getBounds();
        console.log(this.backgroundImageRectangle)
    }
}