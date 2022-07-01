import {Renderer} from "../engine";
import {Behaviour} from "../engine/Behaviour";
import {Rectangle} from "../engine/math";
import {string} from "../engine/validators/string";

export class ImageRenderer extends Behaviour implements Renderer {
    @string()
    imagePath = "";

    image: HTMLImageElement

    getBounds(): Rectangle {
        this.image = this.engine.resourceManager.getImage(this.imagePath);
        return {
            x: 0,
            y: 0,
            width: this.image.width,
            height: this.image.height,
        };
    }

    onStart() {
        if (this.imagePath!==""){
            this.image = this.engine.resourceManager.getImage(this.imagePath);
        }
    }

    onTick(duringTime: number) {
        this.image = this.engine.resourceManager.getImage(this.imagePath);
    }
}
