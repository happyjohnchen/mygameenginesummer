import { Behaviour } from "../../src/engine/Behaviour";
import { Transform } from "../../src/engine/Transform";

export class CameraMouseController extends Behaviour {

    //在此定义脚本中的属性

    



    //游戏编辑模式或运行模式开始时会执行一次
    onStart() {
        const myCameraTransform = this.gameObject.getBehaviour(Transform);
        let mouseDownTransform = new Transform();
        let mouseDown = false;
        const body = document.body;
        const mouseDownPosition = {x: 0, y: 0};
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

    }

    //游戏运行模式开始时会执行一次
    onPlayStart() {

    }

    //每次屏幕刷新执行
    onUpdate() {

    }

    //平均每16ms执行一次
    onTick(duringTime: number) {

    }
}