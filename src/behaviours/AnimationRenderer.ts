import {Renderer} from "../engine";
import {Behaviour} from "../engine/Behaviour";
import {Rectangle} from "../engine/math";
import {string} from "../engine/validators/string";
import {number} from "../engine/validators/number";
import {boolean} from "../engine/validators/boolean";

export class AnimationRenderer extends Behaviour implements Renderer {
    @string()
    imagePathPrefix = "";//路径前缀

    @string()
    imagePathSuffix = "";//路径后缀

    @number()
    startNum = 1;//第一张图片编号

    @number()
    endNum = 2;//最后一张图片编号

    @number({allowZero: false})
    frameForEachImage = 1;//每张图片显示帧数

    @boolean()
    private _pauseAnimation = false;
    get pauseAnimation(): boolean {
        return this._pauseAnimation;
    }

    set pauseAnimation(value: boolean) {
        this._pauseAnimation = value;
    }

    currentImage = new Image();
    private currentNum = 0;
    private frameCount = 0;

    getBounds(): Rectangle {
        return {
            x: 0,
            y: 0,
            width: this.currentImage ? this.currentImage.width : 0,
            height: this.currentImage ? this.currentImage.height : 0,
        };
    }

    onStart() {
        this.currentNum = 0;
        if (this.imagePathPrefix !== "" && this.imagePathSuffix !== "") {
            this.currentImage = this.engine.resourceManager.getImage(this.imagePathPrefix + this.startNum + this.imagePathSuffix);
        }
    }

    onTick(duringTime: number) {
        if (this.startNum > this.endNum) {
            this.endNum = this.startNum;
        }
        this.currentImage = this.engine.resourceManager.getImage(this.imagePathPrefix + (this.startNum + this.currentNum) + this.imagePathSuffix);
        if (this.pauseAnimation) {
            return;
        }
        this.frameCount++;
        if (this.frameCount >= this.frameForEachImage) {
            this.frameCount = 0;
            this.currentNum++;
            if (this.currentNum > (this.endNum - this.startNum)) {
                this.currentNum = 0;
            }
        }
    }

}
