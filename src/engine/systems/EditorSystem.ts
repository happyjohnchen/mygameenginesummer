import { GameObject, getAllComponentDefinationNames, getBehaviourClassByName } from "../../engine";
import { RuntimeHost } from "../../host";
import { GameObjectInfo, GameObjectComponents } from "../../types";
import { Behaviour } from "../Behaviour";
import { System } from "./System";

export class EditorSystem extends System {

    onStart(): void {
        const host = new RuntimeHost();
        const engine = this.gameEngine;

        const getSceneSerializedData = () => {
            return engine.serilize(this.rootGameObject.children[0]);
        }
        const getAllGameObjects = () => {

            function createGameObjectInfo(gameObject: GameObject, info: GameObjectInfo[]) {
                const children = gameObject.children || []
                for (const child of children) {
                    const childrenInfo: GameObjectInfo[] = [];
                    info.push({ name: child.id || "GameObject", children: childrenInfo, uuid: child.uuid })
                    createGameObjectInfo(child, childrenInfo);
                }
                return info;
            }

            return createGameObjectInfo(this.rootGameObject, []);
        }
        const getAllComponentsByGameObjectUUID = (gameObjectUUID: number) => {

            const gameObject = GameObject.map[gameObjectUUID];
            const allComponents: GameObjectComponents = gameObject.behaviours.map(b => {
                const componentName = (b as any).__proto__.constructor.name
                const properties: GameObjectComponents[0]['properties'] = [];
                const behaviourClass = (b as any).__proto__
                const __metadatas = behaviourClass.__metadatas || [];
                for (const metadata of __metadatas) {
                    const name = metadata.key;
                    const type = metadata.type || 'string';
                    const editorType = metadata.editorType || 'textfield'
                    const options = metadata.options;
                    properties.push({ name, value: b[name], type, editorType, options })
                }
                return {
                    name: componentName,
                    properties: properties
                }
            })
            return allComponents;

        }
        const modifyComponentProperty = (param: any) => {
            const { gameObjectUUID, componentName, propertyName, value } = param;
            const gameObject = GameObject.map[gameObjectUUID];
            const component = gameObject.behaviours.find(b => {
                return componentName === (b as any).__proto__.constructor.name
            })
            component[propertyName] = value;
            console.log(param)
        }

        const getAllComponentDefinations = (gameObjectUUID) => {
            const gameObject = GameObject.map[gameObjectUUID];
            const allComponentNames = getAllComponentDefinationNames();
            const existedComponentsName = gameObject.behaviours.map(behaviour => {
                return (behaviour as any).__proto__.constructor.name
            });
            const groupedComponentsLimitation = [
                ['BoxCollider', 'EdgeCollider', 'CircleCollider'],
                ['TextRenderer', 'ShapeRectRenderer']
            ]
            let ignoreComponentNames = existedComponentsName;
            for (const component of existedComponentsName) {
                const peer = groupedComponentsLimitation.find(peers => peers.includes(component));
                if (peer) {
                    ignoreComponentNames = ignoreComponentNames.concat(peer)
                }
            }

            return allComponentNames
                .filter(componentName => !ignoreComponentNames.includes(componentName))
                .map(componentName => {
                    return { name: componentName }
                })
        }

        const addComponentToGameObject = (data: { gameObjectUUID: number, componentName: string }) => {
            const gameObject = GameObject.map[data.gameObjectUUID];
            const behaviourClass = getBehaviourClassByName(data.componentName);
            gameObject.addBehaviour(new behaviourClass());
        }

        const removeComponentFromGameObject = (data: { gameObjectUUID: number, componentName: string }) => {
            const gameObject = GameObject.map[data.gameObjectUUID];
            const behaviourClass = getBehaviourClassByName(data.componentName);
            const behaviour = gameObject.getBehaviour(behaviourClass);
            gameObject.removeBehaviour(behaviour);
        }

        const getIDByGameObjectUUID = (gameObjectUUID: number) => {
            const gameObject = GameObject.map[gameObjectUUID];
            return gameObject.id;
        }

        const setIDByGameObjectUUID = (data: { gameObjectUUID: number, newID: string }) => {
            const gameObject = GameObject.map[data.gameObjectUUID];
            gameObject.id = data.newID;
            return data.newID;
        }




        host.registerCommand(getSceneSerializedData);
        host.registerCommand(getAllGameObjects);
        host.registerCommand(getAllComponentsByGameObjectUUID);
        host.registerCommand(modifyComponentProperty);
        host.registerCommand(getAllComponentDefinations);
        host.registerCommand(addComponentToGameObject);
        host.registerCommand(removeComponentFromGameObject);
        host.registerCommand(getIDByGameObjectUUID);
        host.registerCommand(setIDByGameObjectUUID);
        host.start()
    }
}