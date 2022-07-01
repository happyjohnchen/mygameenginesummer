import {GameObject, getGameObjectById} from "../../engine";
import {checkPointInCircle, checkPointInRectangle, invertMatrix, Point, pointAppendMatrix} from "../math";
import {Transform} from "../Transform";
import {System} from "./System";

export class MouseControlSystem extends System {
    engineUIConfig;

    constructor() {
        super();
        const url = "engineUIConfig.json";
        const request = new XMLHttpRequest();
        request.open("get", url);/*设置请求方法与路径*/
        request.send(null);/*不发送数据到服务器*/
        request.onload = () => {/*XHR对象获取到返回信息后执行*/
            if (request.status == 200) {/*返回状态为200，即为数据获取成功*/
                this.engineUIConfig = JSON.parse(request.responseText);
            }
        }
    }

    onStart() {
        window.addEventListener('mousedown', (e) => {
            const point = {x: e.clientX, y: e.clientY};
            const camera = getGameObjectById('camera');
            if (!camera){
                return;
            }
            const cameraTransform = new Transform();

            //camera坐标表示中心点
            cameraTransform.x = camera.getBehaviour(Transform).x - camera.getBehaviour(Transform).scaleX * this.engineUIConfig.canvasWidth / 2;
            cameraTransform.y = camera.getBehaviour(Transform).y - camera.getBehaviour(Transform).scaleY * this.engineUIConfig.canvasHeight / 2;
            cameraTransform.scaleX = camera.getBehaviour(Transform).scaleX;
            cameraTransform.scaleY = camera.getBehaviour(Transform).scaleY;
            cameraTransform.rotation = camera.getBehaviour(Transform).rotation;
            //更新矩阵
            cameraTransform.globalMatrix.updateFromTransformProperties(cameraTransform.x, cameraTransform.y, cameraTransform.scaleX, cameraTransform.scaleY, cameraTransform.rotation);

            //画布坐标转化为摄像机坐标
            point.x += cameraTransform.x;
            point.y += cameraTransform.y;
            let result = this.hitTest(this.rootGameObject, point);
            if (result) {
                while (result) {
                    if (result.onClick) {
                        result.onClick(e);
                    }
                    result = result.parent;
                }
            } else {
                if (this.rootGameObject.onClick) {
                    this.rootGameObject.onClick(e);
                }
            }
        });
        window.addEventListener('mousemove', (e) => {
            const point = {x: e.clientX, y: e.clientY};
            const camera = getGameObjectById('camera')
            if (!camera){
                return;
            }
            const cameraTransform = new Transform();

            //camera坐标表示中心点
            cameraTransform.x = camera.getBehaviour(Transform).x - camera.getBehaviour(Transform).scaleX * this.engineUIConfig.canvasWidth / 2;
            cameraTransform.y = camera.getBehaviour(Transform).y - camera.getBehaviour(Transform).scaleY * this.engineUIConfig.canvasHeight / 2;
            cameraTransform.scaleX = camera.getBehaviour(Transform).scaleX;
            cameraTransform.scaleY = camera.getBehaviour(Transform).scaleY;
            cameraTransform.rotation = camera.getBehaviour(Transform).rotation;
            //更新矩阵
            cameraTransform.globalMatrix.updateFromTransformProperties(cameraTransform.x, cameraTransform.y, cameraTransform.scaleX, cameraTransform.scaleY, cameraTransform.rotation);

            //画布坐标转化为摄像机坐标
            point.x += cameraTransform.x;
            point.y += cameraTransform.y;
            const visit = (gameObject: GameObject) => {
                if (gameObject.hovered !== this.hoverTest(gameObject, point)) {
                    gameObject.hovered = this.hoverTest(gameObject, point);
                    if (gameObject.hovered && gameObject.onHoverIn) {
                        gameObject.onHoverIn(e);
                    } else if (!gameObject.hovered && gameObject.onHoverOut) {
                        gameObject.onHoverOut(e);
                    }
                }
                for (const child of gameObject.children) {
                    visit(child);
                }
            }
            visit(this.rootGameObject);
        })
    }

    hitTest(gameObject: GameObject, point: Point): GameObject {

        if (gameObject.renderer) {
            const bounds = gameObject.renderer.getBounds();
            let result = null;
            if (bounds.width) {
                result = checkPointInRectangle(point, bounds)
            } else if (bounds.radius) {
                result = checkPointInCircle(point, bounds);
            }
            if (result) {
                return gameObject;
            } else {
                return null;
            }
        } else {
            const length = gameObject.children.length;
            for (let childIndex = length - 1; childIndex >= 0; childIndex--) {
                const child = gameObject.children[childIndex];
                const childTransform = child.getBehaviour(Transform);
                const childLocalMatrix = childTransform.localMatrix;
                const childInvertLocalMatrix = invertMatrix(childLocalMatrix);
                const newPoint = pointAppendMatrix(point, childInvertLocalMatrix);
                const result = this.hitTest(child, newPoint);
                if (result) {
                    return result;
                }
            }
            return null;
        }
    }

    hoverTest(gameObject: GameObject, point: Point): boolean {
        if (gameObject.renderer) {
            const bounds = gameObject.renderer.getBounds();
            let result = false;
            if (bounds.width) {
                result = checkPointInRectangle(point, bounds)
            } else if (bounds.radius) {
                result = checkPointInCircle(point, bounds);
            }
            if (result) {
                return result;
            }
        }
        const length = gameObject.children.length;
        for (let childIndex = length - 1; childIndex >= 0; childIndex--) {
            const child = gameObject.children[childIndex];
            const childTransform = child.getBehaviour(Transform);
            const childLocalMatrix = childTransform.localMatrix;
            const childInvertLocalMatrix = invertMatrix(childLocalMatrix);
            const newPoint = pointAppendMatrix(point, childInvertLocalMatrix);
            if (this.hoverTest(child, newPoint)) {
                return true;
            }
        }
        return false;
    }
}