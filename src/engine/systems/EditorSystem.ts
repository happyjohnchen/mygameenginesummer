import {GameObject, getAllComponentDefinationNames, getBehaviourClassByName} from "../../engine";
import {RuntimeHost} from "../../host";
import {GameObjectInfo, GameObjectComponents} from "../../types";
import {System} from "./System";
import {Transform} from "../Transform";
// @ts-ignore
import {Prefab} from "../../behaviours/Prefab";

export class EditorSystem extends System {

    onStart(): void {
        const host = new RuntimeHost();
        const engine = this.gameEngine;

        const getSceneSerializedData = () => {
            function visit(gameObject:GameObject){
                if (gameObject.hasBehaviour(Prefab)){
                    gameObject.children = [];
                }
                for (const child of gameObject.children){
                    visit(child);
                }
            }
            visit(this.rootGameObject.children[0]);
            return engine.serilize(this.rootGameObject.children[0]);
        }
        const getAllGameObjects = () => {

            function createGameObjectInfo(gameObject: GameObject, info: GameObjectInfo[]) {
                const children = gameObject.children || []
                for (const child of children) {
                    const childrenInfo: GameObjectInfo[] = [];
                    info.push({name: child.id || "GameObject", children: childrenInfo, uuid: child.uuid})
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
                    properties.push({name, value: b[name], type, editorType, options})
                }
                return {
                    name: componentName,
                    properties: properties
                }
            })
            return allComponents;

        }
        const modifyComponentProperty = (param: any) => {
            const {gameObjectUUID, componentName, propertyName, value} = param;
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
            // 以下数组中,每一组的组件是互斥的
            // 同一 GameObject 添加一个组件后，就不能添加同组中的其他组件了
            const groupedComponentsLimitation = [
                ['BoxCollider', 'EdgeCollider', 'CircleCollider'],
                ['TextRenderer', 'ShapeRectRenderer', 'ShapeCircleRenderer', 'ImageRenderer', 'AnimationRenderer', 'RoundedRectRenderer']
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
                    return {name: componentName}
                })
        }

        const addComponentToGameObject = (data: { gameObjectUUID: number, componentName: string }) => {
            const gameObject = GameObject.map[data.gameObjectUUID];
            const behaviourClass = getBehaviourClassByName(data.componentName);
            gameObject.addBehaviour(new behaviourClass());
            console.log(data.gameObjectUUID + " add component " + data.componentName);
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

        const upMoveGameObjectByGameObjectUUID = (gameObjectUUID: number) => {
            const gameObject = GameObject.map[gameObjectUUID];
            const parent = gameObject.parent;
            parent.upMoveChild(gameObject);
        }
        const downMoveGameObjectByGameObjectUUID = (gameObjectUUID: number) => {
            const gameObject = GameObject.map[gameObjectUUID];
            const parent = gameObject.parent;
            parent.downMoveChild(gameObject);
        }

        const removeGameObjectByGameObjectUUID = (gameObjectUUID: number) => {
            const gameObject = GameObject.map[gameObjectUUID];
            const parent = gameObject.parent;
            parent.removeChild(gameObject);
        }

        const createNewGameObject = (parentUUID: number) => {
            const parent = GameObject.map[parentUUID];
            const newGameObject = new GameObject();
            newGameObject.id = "NewGameObject";
            parent.addChild(newGameObject);
            //默认添加一个Transform
            const gameObject = GameObject.map[newGameObject.uuid];
            gameObject.addBehaviour(new Transform());
        }

        const getCurrentSceneName = () => {
            return engine.currentSceneName;
        }

        const loadScene = (scene: string) => {
            this.gameEngine.loadScene(scene);
        }

        const setGameObjectChosenByGameObjectUUID = (data: { gameObjectUUID: number, chosen: boolean}) => {
            const gameObject = GameObject.map[data.gameObjectUUID];
            if (gameObject.active){
                gameObject.chosen = data.chosen;
            }
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
        host.registerCommand(upMoveGameObjectByGameObjectUUID);
        host.registerCommand(downMoveGameObjectByGameObjectUUID);
        host.registerCommand(removeGameObjectByGameObjectUUID);
        host.registerCommand(createNewGameObject);
        host.registerCommand(getCurrentSceneName);
        host.registerCommand(loadScene);
        host.registerCommand(setGameObjectChosenByGameObjectUUID);
        host.start()
    }
}