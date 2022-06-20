import { Renderer } from "../engine";
import { Behaviour } from "../engine/Behaviour";
import { Rectangle } from "../engine/math";
import { string } from "../engine/validators/string";
import {number} from "../engine/validators/number";

export class TextRenderer extends Behaviour implements Renderer {

    @string()
    text = '';
    @number()
    fontSize = 40;
    @string()
    font = "微软雅黑";
    @string()
    fontColor = "#000000";

    measuredTextWidth = 0;

    getBounds(): Rectangle {
        return {
            x: 0,
            y: 0,
            width: this.measuredTextWidth,
            height: 40
        };
    }
}