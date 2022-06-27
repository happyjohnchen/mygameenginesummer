import {Renderer} from "../engine";
import {Behaviour} from "../engine/Behaviour";
import {Rectangle} from "../engine/math";
import {string} from "../engine/validators/string";

export class ImageRenderer extends Behaviour implements Renderer {
    @string()
    imagePath = "";

    image: HTMLImageElement

    getBounds(): Rectangle {
        const image = new Image();
        image.src = this.imagePath;
        return {
            x: 0,
            y: 0,
            width: image.width,
            height: image.height,
        };
    }

    onStart() {
        this.image = new Image();
        this.image.src = this.imagePath;
    }
}
