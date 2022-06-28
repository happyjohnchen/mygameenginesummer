import { Behaviour } from "../engine/Behaviour";
import { Transform } from "../engine/Transform";
import { number } from "../engine/validators/number";
import {string} from "../engine/validators/string";

export class Walkable extends Behaviour {
    private currentSpeed = 0;
    @number()
    speed = 1;
    @string({
        editorType: 'select', options: [
            {value:'up', label:"向上"},
            {value:'down', label:"向下"},
            {value:'left', label:"向左"},
            {value:'right', label:"向右"}
        ]
    })
    direction = "right"

    onStart() {
        this.gameObject.onClick = () => {
        
            if (this.currentSpeed === 0) {
                this.currentSpeed = this.speed;
            } else {
                this.currentSpeed = 0;
            }
        };
    }

    onTick(duringTime: number) {
        const transform = this.gameObject.getBehaviour(Transform);
        switch (this.direction){
            case 'up':
                transform.y -= this.currentSpeed;
                break;
            case "down":
                transform.y += this.currentSpeed;
                break;
            case "left":
                transform.x -= this.currentSpeed;
                break;
            case "right":
                transform.x += this.currentSpeed;
                break;

        }
    }
}
