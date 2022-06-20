import { ShapeRectRenderer } from "../../behaviours/ShapeRectRenderer";
import { GameObject, getGameObjectById } from "../../engine";
import { Behaviour } from "../Behaviour";
import { invertMatrix, matrixAppendMatrix } from "../math";
import { TextRenderer } from "../../behaviours/TextRenderer";
import { Transform } from "../Transform";
import { System } from "./System";

export class CanvasContextRenderingSystem extends System {

    private context: CanvasRenderingContext2D
    constructor(context: CanvasRenderingContext2D) {
        super();
        this.context = context;
    }


    onAddComponent(gameObject: GameObject, component: Behaviour): void {
        if (component instanceof ShapeRectRenderer || component instanceof TextRenderer) {
            gameObject.renderer = component;
        }
    }

    onRemoveComponent(gameObject: GameObject, component: Behaviour): void {
        if (component instanceof ShapeRectRenderer || component instanceof TextRenderer) {
            gameObject.renderer = null;
        }
    }

    onUpdate(): void {

        const context = this.context;
        const camera = getGameObjectById('camera')
        const cameraTransform = camera.getBehaviour(Transform);
        const invertCameraTransform = invertMatrix(cameraTransform.globalMatrix)

        function visitChildren(gameObject: GameObject) {
            for (const child of gameObject.children) {
                if (child.renderer) {
                    const transform = child.getBehaviour(Transform);
                    const matrix = matrixAppendMatrix(transform.globalMatrix, invertCameraTransform);
                    context.setTransform(
                        matrix.a,
                        matrix.b,
                        matrix.c,
                        matrix.d,
                        matrix.tx,
                        matrix.ty
                    )
                    if (child.renderer instanceof TextRenderer) {
                        context.save();
                        const renderer = child.renderer as TextRenderer
                        context.font = renderer.fontSize + "px " + renderer.font;
                        context.fillStyle = renderer.fontColor;
                        context.fillText(renderer.text, 0, renderer.fontSize);
                        renderer.measuredTextWidth = context.measureText(renderer.text).width;
                        context.restore();
                    }
                    else if (child.renderer instanceof ShapeRectRenderer) {
                        const renderer = child.renderer as ShapeRectRenderer;
                        context.save();
                        if (renderer.color != "custom") {
                            context.fillStyle = renderer.color;
                        } else {
                            context.fillStyle = renderer.customColor;
                        }

                        context.fillRect(0, 0, renderer.width, renderer.height);
                        context.restore();
                    }
                }
                visitChildren(child)
            }
        }
        visitChildren(this.rootGameObject);


    }
}