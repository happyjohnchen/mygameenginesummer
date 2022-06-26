import {ShapeRectRenderer} from "../../behaviours/ShapeRectRenderer";
import {GameObject, getGameObjectById} from "../../engine";
import {Behaviour} from "../Behaviour";
import {invertMatrix, matrixAppendMatrix} from "../math";
import {TextRenderer} from "../../behaviours/TextRenderer";
import {Transform} from "../Transform";
import {System} from "./System";
import {ShapeCircleRenderer} from "../../behaviours/ShapeCircleRenderer";
import {ImageRenderer} from "../../behaviours/ImageRenderer";
import {RoundedRectRenderer} from "../../behaviours/RoundedRectRenderer";
import {AnimationRenderer} from "../../behaviours/AnimationRenderer";

export class CanvasContextRenderingSystem extends System {

    private context: CanvasRenderingContext2D

    constructor(context: CanvasRenderingContext2D) {
        super();
        this.context = context;
    }


    onAddComponent(gameObject: GameObject, component: Behaviour): void {
        if (component instanceof ShapeRectRenderer || component instanceof TextRenderer || component instanceof ShapeCircleRenderer || component instanceof ImageRenderer || component instanceof RoundedRectRenderer || component instanceof AnimationRenderer) {
            gameObject.renderer = component;
        }
    }

    onRemoveComponent(gameObject: GameObject, component: Behaviour): void {
        if (component instanceof ShapeRectRenderer || component instanceof TextRenderer || component instanceof ShapeCircleRenderer || component instanceof ImageRenderer || component instanceof RoundedRectRenderer || component instanceof AnimationRenderer) {
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

                    if (child.chosen) {
                        const bounds = child.renderer.getBounds();
                        const distance = 6;
                        context.save();
                        context.strokeStyle = "red";
                        context.lineWidth = 3;
                        if (bounds.width) {
                            //矩形边框
                            context.strokeRect(bounds.x - distance, bounds.y - distance, bounds.width + distance * 2, bounds.height + distance * 2);
                        } else if (bounds.radius) {
                            //圆形边框
                            context.moveTo(bounds.x + bounds.radius, bounds.y);
                            context.arc(bounds.x, bounds.y, bounds.radius + distance, 0, Math.PI * 2);
                            context.closePath();
                            context.stroke();
                        }
                        context.restore();
                    }

                    if (child.renderer instanceof TextRenderer) {
                        context.save();
                        const renderer = child.renderer as TextRenderer
                        context.font = renderer.fontSize + "px " + renderer.font;
                        context.fillStyle = renderer.fontColor;
                        context.fillText(renderer.text, 0, renderer.fontSize);
                        renderer.measuredTextWidth = context.measureText(renderer.text).width;
                        context.restore();
                    } else if (child.renderer instanceof ShapeRectRenderer) {
                        const renderer = child.renderer as ShapeRectRenderer;
                        context.save();
                        if (renderer.color != 'custom') {
                            context.fillStyle = renderer.color;
                        } else {
                            context.fillStyle = renderer.customColor;
                        }

                        context.fillRect(0, 0, renderer.width, renderer.height);
                        context.restore();
                    } else if (child.renderer instanceof ShapeCircleRenderer) {
                        const renderer = child.renderer as ShapeCircleRenderer;
                        context.save();
                        if (renderer.color != 'custom') {
                            context.fillStyle = renderer.color;
                        } else {
                            context.fillStyle = renderer.customColor;
                        }
                        context.beginPath();
                        context.arc(0, 0, renderer.radius, 0, 2 * Math.PI, true);
                        context.fill();
                        context.restore();
                    } else if (child.renderer instanceof ImageRenderer) {
                        const renderer = child.renderer as ImageRenderer;
                        context.drawImage(renderer.image, 0, 0);
                    } else if (child.renderer instanceof AnimationRenderer) {
                        const renderer = child.renderer as AnimationRenderer;
                        context.drawImage(renderer.currentImage, 0, 0);
                    } else if (child.renderer instanceof RoundedRectRenderer) {
                        const renderer = child.renderer as RoundedRectRenderer;
                        //避免圆角过大
                        if (renderer.cornerRadius > Math.min(renderer.width, renderer.height) / 2) {
                            renderer.cornerRadius = Math.min(renderer.width, renderer.height) / 2;
                        }
                        context.save();
                        if (renderer.color != 'custom') {
                            context.fillStyle = renderer.color;
                        } else {
                            context.fillStyle = renderer.customColor;
                        }
                        context.beginPath();
                        context.moveTo(renderer.cornerRadius, 0);
                        context.arcTo(renderer.width, 0, renderer.width, renderer.height, renderer.cornerRadius);
                        context.arcTo(renderer.width, renderer.height, 0, renderer.height, renderer.cornerRadius);
                        context.arcTo(0, renderer.height, 0, 0, renderer.cornerRadius);
                        context.arcTo(0, 0, renderer.width, 0, renderer.cornerRadius);
                        context.fill();
                        context.restore();
                    }
                }
                visitChildren(child)
            }
        }

        visitChildren(this.rootGameObject);


    }
}