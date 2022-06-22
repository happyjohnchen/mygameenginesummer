import {Renderer} from "../engine";
import {Behaviour} from "../engine/Behaviour";
import {Rectangle} from "../engine/math";
import {string} from "../engine/validators/string";
import {boolean} from "../engine/validators/boolean";

export class ImageRenderer extends Behaviour implements Renderer {
    @string()
    imagePath = "";
    @boolean()
    showImage = true;

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
