import { Camera } from './behaviours/Camera';
import { BoxCollider, CircleCollider, EdgeCollider } from './behaviours/Collider';
import { RigidBody } from './behaviours/RigidBody';
import { Rotatable } from './behaviours/Rotatable';
import { ShapeRectRenderer } from './behaviours/ShapeRectRenderer';
import { Walkable } from './behaviours/Walkable';
import { GameEngine, registerBehaviourClass } from './engine';
import { TextRenderer } from './behaviours/TextRenderer';
import { Transform } from './engine/Transform';

registerBehaviourClass(Transform);
registerBehaviourClass(TextRenderer);
registerBehaviourClass(Walkable);
registerBehaviourClass(Rotatable);
registerBehaviourClass(ShapeRectRenderer);
registerBehaviourClass(RigidBody);
registerBehaviourClass(BoxCollider);
registerBehaviourClass(CircleCollider);
registerBehaviourClass(EdgeCollider);
registerBehaviourClass(Camera);

const engine = new GameEngine()
engine.start()
