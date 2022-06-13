import { b2BodyDef, b2BodyType, b2CircleShape, b2Contact, b2ContactImpulse, b2ContactListener, b2DrawFlags, b2EdgeShape, b2Fixture, b2FixtureDef, b2Manifold, b2PointState, b2Shape, b2Vec2, b2World } from "@flyover/box2d";
import { CircleCollider, EdgeCollider } from "./behaviours/Collider";
import { RigidBody } from "./behaviours/RigidBody";
import { DebugDraw } from "./draw";
import { GameObject } from "./engine";
import { System } from "./engine/systems/System";
import { Transform } from "./engine/Transform";

export class GameSystem extends System {

    public m_world: b2World;

    private context: CanvasRenderingContext2D
    private debugDraw = new DebugDraw()
    constructor(context: CanvasRenderingContext2D) {
        super();
        this.context = context;
        this.debugDraw.m_ctx = context;
    }

    onStart() {
        const gravity: b2Vec2 = new b2Vec2(0, -100);

        const world = new b2World(gravity);
        world.SetContactListener(new MyContactListener())
        world.SetDebugDraw(this.debugDraw);

        this.m_world = world

        function visit(gameObject: GameObject) {
            const rigidBodyComponent = gameObject.getBehaviour(RigidBody)
            if (rigidBodyComponent) {
                const bodyDefine = new b2BodyDef();
                bodyDefine.position.Set(rigidBodyComponent.x, rigidBodyComponent.y);
                bodyDefine.type = rigidBodyComponent.type as any as b2BodyType;
                const rigidBody = world.CreateBody(bodyDefine);
                rigidBody.SetUserData(gameObject);
                const edgeComponent = gameObject.getBehaviour(EdgeCollider);
                if (edgeComponent) {
                    const shape = new b2EdgeShape();
                    shape.Set(
                        new b2Vec2(edgeComponent.startX, edgeComponent.startY),
                        new b2Vec2(edgeComponent.endX, edgeComponent.endY)
                    );
                    rigidBody.CreateFixture(shape, 0.0);
                }
                const circleComponent = gameObject.getBehaviour(CircleCollider);
                if (circleComponent) {

                    const shape = new b2CircleShape();
                    shape.m_radius = circleComponent.radius

                    const fd = new b2FixtureDef();
                    fd.shape = shape;
                    fd.density = 20.0;
                    fd.friction = 1.0;
                    rigidBody.CreateFixture(fd);
                }

            }
            for (const child of gameObject.children) {
                visit(child);
            }
        }
        visit(this.rootGameObject)
    }

    onTick() {
        const s = 0.5 * this.context.canvas.width / DebugDraw.EXTENT
        for (let b2body = this.m_world.GetBodyList(); b2body; b2body = b2body.GetNext()) {
            const b2Transform = b2body.GetTransform();
            const gameObject = b2body.GetUserData() as GameObject;
            const transform = gameObject.getBehaviour(Transform)
            transform.x = b2Transform.p.x * s;
            transform.y = -b2Transform.p.y * s;
        }
    }

    onUpdate() {



        let timeStep = settings.m_hertz > 0 ? 1 / settings.m_hertz : 0;

        if (settings.m_pause) {
            if (settings.m_singleStep) {
                settings.m_singleStep = false;
            } else {
                timeStep = 0;
            }
        }

        let flags = b2DrawFlags.e_none;
        if (settings.m_drawShapes) { flags |= b2DrawFlags.e_shapeBit; }
        if (settings.m_drawJoints) { flags |= b2DrawFlags.e_jointBit; }
        this.debugDraw.SetFlags(flags);

        this.m_world.SetAllowSleeping(settings.m_enableSleep);
        this.m_world.SetWarmStarting(settings.m_enableWarmStarting);
        this.m_world.SetContinuousPhysics(settings.m_enableContinuous);
        this.m_world.SetSubStepping(settings.m_enableSubStepping);
        const mode = this.gameEngine.mode;
        if (mode === 'edit') {
            this.context.save();
            this.context.setTransform(1, 0, 0, 1, 0, 0)
            const s = 0.5 * this.context.canvas.width / DebugDraw.EXTENT;
            this.context.translate(0.5 * this.context.canvas.width, 0.5 * this.context.canvas.height);
            this.context.scale(1, -1);
            this.context.scale(s, s)
            this.context.lineWidth /= s;
            this.m_world.DrawDebugData()
            this.context.restore();
        }
        else if (mode === 'play') {
            this.m_world.Step(timeStep, settings.m_velocityIterations, settings.m_positionIterations);
        }


    }

    onEnd() {
        console.log('游戏结束')
    }
}



export class Settings {
    public m_windowWidth: number = 1600;
    public m_windowHeight: number = 900;
    public m_hertz: number = 60;
    public m_velocityIterations: number = 8;
    public m_positionIterations: number = 3;
    // #if B2_ENABLE_PARTICLE
    // Particle iterations are needed for numerical stability in particle
    // simulations with small particles and relatively high gravity.
    // b2CalculateParticleIterations helps to determine the number.
    // #endif
    public m_drawShapes: boolean = true;
    // #endif
    public m_drawJoints: boolean = true;
    public m_drawControllers: boolean = true;
    public m_enableWarmStarting: boolean = true;
    public m_enableContinuous: boolean = true;
    public m_enableSubStepping: boolean = false;
    public m_enableSleep: boolean = true;
    public m_pause: boolean = false;
    public m_singleStep: boolean = false;
    // #if B2_ENABLE_PARTICLE
    public m_strictContacts: boolean = false;
    // #endif
}

const settings = new Settings()
export class ContactPoint {
    public fixtureA!: b2Fixture;
    public fixtureB!: b2Fixture;
    public readonly normal: b2Vec2 = new b2Vec2();
    public readonly position: b2Vec2 = new b2Vec2();
    public state: b2PointState = b2PointState.b2_nullState;
    public normalImpulse: number = 0;
    public tangentImpulse: number = 0;
    public separation: number = 0;
}


class MyContactListener extends b2ContactListener {

    BeginContact(contact: b2Contact<b2Shape, b2Shape>): void {

    }

    EndContact(contact: b2Contact<b2Shape, b2Shape>): void {

    }

    PreSolve(contact: b2Contact<b2Shape, b2Shape>, oldManifold: b2Manifold): void {

    }

    PostSolve(contact: b2Contact<b2Shape, b2Shape>, impulse: b2ContactImpulse): void {

    }
}