import { Behaviour } from "../engine/Behaviour";
import { number } from "../engine/validators/number";

export enum RigidBodyType {

    STATIC = 0,

    KINEMATIC = 1,

    DYNAMIC = 2
}


export class RigidBody extends Behaviour {
    @number()
    x: number = 0;

    @number()
    y: number = 0;

    @number({
        editorType: 'select', options: [
            { value: RigidBodyType.STATIC, label: '静态刚体' },
            { value: RigidBodyType.KINEMATIC, label: '动力学刚体' },
            { value: RigidBodyType.DYNAMIC, label: '动态刚体' }
        ]
    })
    type: RigidBodyType = RigidBodyType.STATIC

    allowSleep: boolean = false;
}