import { GameObject } from "../../engine";
import { checkPointInRectangle, invertMatrix, Point, pointAppendMatrix } from "../math";
import { Transform } from "../Transform";
import { System } from "./System";

export class MouseControlSystem extends System {

    onStart() {
        window.addEventListener('mousedown', (e) => {
            const point = { x: e.clientX, y: e.clientY };
            console.log("mousedown(" + point.x + "," + point.y + ")");
            let result = this.hitTest(this.rootGameObject, point);
            if (result) {
                while (result) {
                    if (result.onClick) {
                        result.onClick();
                    }
                    result = result.parent;
                }
            }
            else {
                if (this.rootGameObject.onClick) {
                    this.rootGameObject.onClick();
                }
            }
        });
    }

    hitTest(gameObject: GameObject, point: Point): GameObject {

        if (gameObject.renderer) {
            const rectangle = gameObject.renderer.getBounds();
            const result = checkPointInRectangle(point, rectangle)
            if (result) {
                return gameObject;
            }
            else {
                return null;
            }
        }
        else {
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