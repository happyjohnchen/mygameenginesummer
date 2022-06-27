import {Behaviour} from "../engine/Behaviour";
import {number} from "../engine/validators/number";
import {Transform} from "../engine/Transform";

export class TileMap extends Behaviour {

    @number()
    tileWidth: number = 10;

    @number()
    tileHeight: number = 10;

    constructor() {
        super();
    }

    tileToWorldPosition(tileX: number, tileY: number) {
        const transform = this.gameObject.getBehaviour(Transform);
        const tWidth = this.tileWidth * transform.scaleX;
        const tHeight = this.tileHeight * transform.scaleY;
        const tX = tileX * tWidth + transform.x;
        const tY = tileY * tHeight + transform.y;
        return {x: tX, y: tY, width: tWidth, height: tHeight};
    }

}