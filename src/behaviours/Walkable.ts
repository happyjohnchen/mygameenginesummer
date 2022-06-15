import { Behaviour } from "../engine/Behaviour";
import { Transform } from "../engine/Transform";
import { number } from "../engine/validators/number";

export class Walkable extends Behaviour {
    private currentSpeed = 0;
    @number()
    speed = 1;

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
        transform.x += this.currentSpeed;
    }
}
