import {Behaviour} from "../../src/engine/Behaviour";
import {Transform} from "../../src/engine/Transform";
import {number} from "../../src/engine/validators/number";

export class Player extends Behaviour {
    @number()
    speed = 1;

    onStart() {
        const transform = this.gameObject.getBehaviour(Transform);
        document.addEventListener('keydown', (e) => {
            console.log(e.key)
            switch (e.key) {
                case 'a':
                    transform.x -= this.speed;
                    break;
                case 'd':
                    transform.x += this.speed;
                    break;
                case 'w':
                    transform.y -= this.speed;
                    break;
                case 's':
                    transform.y += this.speed;
                    break;
            }
        })
    }
}