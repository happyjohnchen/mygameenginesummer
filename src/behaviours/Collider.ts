import { Behaviour } from "../engine/Behaviour";
import { number } from "../engine/validators/number";

export class CircleCollider extends Behaviour {
    @number({ allowZero: false })
    radius = 0;
}

export class EdgeCollider extends Behaviour {
    @number()
    startX: number
    @number()
    endX: number
    @number()
    startY: number
    @number()
    endY: number
}

export class BoxCollider extends Behaviour {
    @number({ allowZero: false })
    width: number
    @number({ allowZero: false })
    height: number
}