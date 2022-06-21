import {Renderer} from "../engine";
import {Behaviour} from "../engine/Behaviour";
import {Rectangle} from "../engine/math";
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

    getBounds(): Rectangle {
        return {
            x: -this.radius,
            y: -this.radius,
            width: this.radius * 2,
            height: this.radius * 2,
        };
    }
}
