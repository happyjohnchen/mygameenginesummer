import {GameObject, getGameObjectById} from "../../engine";
import {checkPointInCircle, checkPointInRectangle, invertMatrix, Point, pointAppendMatrix} from "../math";
import {Transform} from "../Transform";
import {System} from "./System";

export class MouseControlSystem extends System {

    onStart() {
        window.addEventListener('mousedown', (e) => {
            const point = {x: e.clientX, y: e.clientY};
            const camera = getGameObjectById('camera')
            const cameraTransform = camera.getBehaviour(Transform);
            //画布坐标转化为摄像机坐标
            point.x += cameraTransform.x;
            point.y += cameraTransform.y;
            let result = this.hitTest(this.rootGameObject, point);
            if (result) {
                while (result) {
                    if (result.onClick) {
                        result.onClick();
                    }
                    result = result.parent;
                }
            } else {
                if (this.rootGameObject.onClick) {
                    this.rootGameObject.onClick();
                }
            }
        });
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
}