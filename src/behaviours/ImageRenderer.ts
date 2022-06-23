import {Renderer} from "../engine";
import {Behaviour} from "../engine/Behaviour";
import {Rectangle} from "../engine/math";
import {string} from "../engine/validators/string";

export class ImageRenderer extends Behaviour implements Renderer {
    @string()
    imagePath = "";

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
}
