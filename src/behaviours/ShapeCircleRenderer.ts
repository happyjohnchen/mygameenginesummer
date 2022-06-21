import {Renderer} from "../engine";
import {Behaviour} from "../engine/Behaviour";
import {Circle} from "../engine/math";
import {number} from "../engine/validators/number";
import {string} from "../engine/validators/string";

export class ShapeCircleRenderer extends Behaviour implements Renderer {
    @number()
    radius = 100;
    @string({
        editorType: 'select', options: [
            {value: 'red', label: "红色"},
            {value: 'green', label: "绿色"},
            {value: 'blue', label: '蓝色'},
            {value: 'custom', label: '自定义'}
        ]
    })
    color = "red";
    @string()
    customColor = "#ffffff";

    getBounds(): Circle {
        return {
            x: 0,
            y: 0,
            radius: this.radius
        };
    }
}
