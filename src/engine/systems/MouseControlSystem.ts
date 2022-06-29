import {GameObject, getGameObjectById} from "../../engine";
import {checkPointInCircle, checkPointInRectangle, invertMatrix, Point, pointAppendMatrix} from "../math";
import {Transform} from "../Transform";
import {System} from "./System";

export class MouseControlSystem extends System {

    onStart() {
        window.addEventListener('mousedown', (e) => {
            const point = {x: e.clientX, y: e.clientY};
            const camera = getGameObjectById('camera');
            if (!camera){
                return;
            }
            const cameraTransform = camera.getBehaviour(Transform);
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
            const cameraTransform = camera.getBehaviour(Transform);
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