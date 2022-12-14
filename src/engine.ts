import * as yaml from 'js-yaml';
import {Behaviour} from "./engine/Behaviour";
import {ResourceManager} from "./engine/ResourceManager";
import {EditorSystem} from './engine/systems/EditorSystem';
import {GameLifeCycleSystem} from './engine/systems/GameLifeCycleSystem';
import {MouseControlSystem} from './engine/systems/MouseControlSystem';
import {CanvasContextRenderingSystem} from './engine/systems/RenderingSystem';
import {System} from './engine/systems/System';
import {TransformSystem} from './engine/systems/TransformSystem';
import {Transform} from "./engine/Transform";
import {GameSystem} from './GameSystem';

const canvas = document.getElementById('game') as HTMLCanvasElement;
const context = canvas.getContext('2d')
context.font = "40px Arial";

//设定运行时尺寸
const url = "engineUIConfig.json"/*json文件url，本地的就写本地的位置，如果是服务器的就写服务器的路径*/
const request = new XMLHttpRequest();
request.open("get", url);/*设置请求方法与路径*/
request.send(null);/*不发送数据到服务器*/
request.onload = function () {/*XHR对象获取到返回信息后执行*/
    if (request.status == 200) {/*返回状态为200，即为数据获取成功*/
        const engineUIConfig = JSON.parse(request.responseText);
        canvas.width = engineUIConfig.canvasWidth;
        canvas.height = engineUIConfig.canvasHeight;
        console.log("分辨率:" + canvas.width + "x" + canvas.height);
        if (engineUIConfig.launchMode) {
            canvas.width *= engineUIConfig.launchModeZoomIndex;
            canvas.height *= engineUIConfig.launchModeZoomIndex;
            const loadingImage = new Image();
            loadingImage.src = engineUIConfig.launchModeLoadingImage;
            loadingImage.onload = () => {
                context.drawImage(loadingImage, 0, 0, canvas.width, canvas.height);
            }
        }
    }
}

const gameObjects: { [id: string]: GameObject } = {}

export class Matrix {

    a = 1;
    b = 0;
    c = 0;
    d = 1;
    tx = 0;
    ty = 0;

    constructor(a: number = 1, b: number = 0, c: number = 0, d: number = 1, tx: number = 0, ty: number = 0) {
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        this.tx = tx;
        this.ty = ty;

    }

    updateFromTransformProperties(x: number, y: number, scaleX: number, scaleY: number, rotation: number) {
        this.tx = x;
        this.ty = y;

        let skewX, skewY;
        skewX = skewY = rotation / 180 * Math.PI;


        this.a = Math.cos(skewY) * scaleX;
        this.b = Math.sin(skewY) * scaleX;
        this.c = -Math.sin(skewX) * scaleY;
        this.d = Math.cos(skewX) * scaleY;

    }
}

function getQuery(): { [key: string]: string } {
    let result = {};
    const search = window.location.search;
    if (search) {
        const queryString = search.substring(1);
        const splitRegulation = /[&=]/;
        const tempArr = queryString.split(splitRegulation);
        for (let i = 0; i < tempArr.length; i = i + 2) {
            result[tempArr[i]] = tempArr[i + 1]
        }
    }
    return result;
}


export class GameEngine {
    currentSceneName: string = 'assets/engineTest/scenes/main.yaml';
    rootGameObject = new GameObject();
    lastTime: number = 0;
    storeDuringTime: number = 0;
    resourceManager = new ResourceManager();
    systems: System[] = [];
    loadSceneData: string = '';
    ready: boolean = false;

    public mode: "edit" | "play" = 'edit'

    async start() {
        this.ready = false;
        this.rootGameObject.engine = this;

        //获取模式
        const mode = getQuery().mode;
        if (mode === 'edit' || mode === 'play') {
            this.mode = mode;
        } else {
            this.mode = 'play'
        }

        if (getQuery().data) {
            this.loadSceneData = getQuery().data;
        }

        if (this.mode === 'edit') {
            this.addSystem(new EditorSystem());
        } else {
            this.addSystem(new GameLifeCycleSystem());
        }
        this.addSystem(new TransformSystem());
        this.addSystem(new GameSystem(context));
        this.addSystem(new CanvasContextRenderingSystem(context));
        this.addSystem(new MouseControlSystem());

        //预加载资源
        console.log("引擎预加载资源中，请稍后...");
        const startTime = new Date();
        const assetsYaml = './assets/assets.yaml';
        await this.resourceManager.loadText(assetsYaml);
        const assetsData = this.unserilizeAssetsYaml(assetsYaml);
        if (assetsData) {
            const imageList = assetsData.images;
            for (const asset of imageList) {
                await this.resourceManager.loadImage(asset);
            }

            const prefabList = assetsData.prefabs;
            for (const prefab of prefabList) {
                await this.resourceManager.loadText(prefab);
            }

        }
        const endTime = new Date();
        console.log("资源加载完毕，用时" + (endTime.getTime() - startTime.getTime()) / 1000 + "s");

        //获取场景
        const scene = getQuery().scene;
        this.currentSceneName = scene;
        console.log("load scene: " + scene);

        await this.resourceManager.loadText(this.currentSceneName)
        this.rootGameObject.active = true;
        this.startup();
    }

    loadScene(sceneName: string, data?: string) {
        const sceneData = data ? data : '';
        window.location.href = window.location.href.split('?')[0] + `?mode=${this.mode}&scene=${sceneName}&data=${sceneData}`;
    }

    unserilizeAssetsYaml(yamlUrl: string) {
        const text = this.resourceManager.getText(yamlUrl);
        try {
            let data = yaml.load(text);
            return data;

        } catch (e) {
            console.log(e)
            alert('资源清单文件解析失败')
        }
        return null;
    }

    addSystem(system: System) {
        this.systems.push(system);
        system.rootGameObject = this.rootGameObject;
        system.gameEngine = this;
    }

    removeSystem(system: System) {
        const index = this.systems.indexOf(system);
        if (index >= 0) {
            this.systems.splice(index);
        }
    }

    getSystems() {
        return this.systems;
    }

    private startup() {
        this.ready = false;
        this.rootGameObject.addBehaviour(new Transform());
        const text = this.resourceManager.getText(this.currentSceneName);
        const scene = this.unserilize(text);

        if (scene) {
            this.rootGameObject.addChild(scene);
        }

        if (this.mode === 'edit') {
            //编辑器摄像机视角
            const cameraEditor = new GameObject();
            cameraEditor.id = 'cameraEditor';
            gameObjects[cameraEditor.id] = cameraEditor;//注册摄像机
            this.rootGameObject.addChild(cameraEditor);
            const cameraEditorTransform = new Transform();
            if (getGameObjectById('camera')) {
                cameraEditorTransform.x = getGameObjectById('camera').getBehaviour(Transform).x;
                cameraEditorTransform.y = getGameObjectById('camera').getBehaviour(Transform).y;
            }
            cameraEditor.addBehaviour(cameraEditorTransform);

            const body = document.body;
            const mouseDownPosition = {x: 0, y: 0};
            let mouseDownTransform = new Transform();
            let mouseDown = false;
            document.oncontextmenu = () => {
                return false;
            }
            body.onmousedown = (e) => {
                mouseDown = true;
                mouseDownPosition.x = e.clientX;
                mouseDownPosition.y = e.clientY;
                mouseDownTransform = cameraEditor.getBehaviour(Transform);
            }
            body.onmouseup = (e) => {
                mouseDown = false
            }
            body.onmousemove = (e) => {
                if (mouseDown) {
                    //移动cameraEditor
                    getGameObjectById('cameraEditor').getBehaviour(Transform).x = (mouseDownPosition.x - e.clientX) * 0.01 + mouseDownTransform.x;
                    getGameObjectById('cameraEditor').getBehaviour(Transform).y = (mouseDownPosition.y - e.clientY) * 0.01 + mouseDownTransform.y;
                }
            }
            body.onwheel = (e) => {
                if (e.deltaY > 0 || getGameObjectById('cameraEditor').getBehaviour(Transform).scaleX > 0) {
                    getGameObjectById('cameraEditor').getBehaviour(Transform).scaleX += e.deltaY / 5000;
                    getGameObjectById('cameraEditor').getBehaviour(Transform).scaleY += e.deltaY / 5000;
                }
            }
        }

        for (const system of this.systems) {
            system.onStart();
        }

        this.ready = true;//所有GameObject和Behaviour已经就绪

        //启动每一个behaviour
        function visit(gameObject: GameObject, mode: 'edit' | 'play') {
            for (const behaviour of gameObject.behaviours) {
                behaviour.onStart();
                if (mode === "play") {
                    behaviour.onPlayStart();
                }
            }
            for (const child of gameObject.children) {
                visit(child, mode);
            }
        }

        visit(this.rootGameObject, this.mode);

        this.enterFrame(0);
    }

    private unserilize(text: string): GameObject {
        try {
            let data = yaml.load(text);
            return createGameObject(data, this);
        } catch (e) {
            console.log(e)
            console.log("配置文件解析失败\n", text);
            alert('配置文件解析失败')
        }
        return null;
    }

    serilize(gameObject: GameObject): string {
        const json = extractGameObject(gameObject);
        const text = yaml.dump(json, {
            noCompatMode: true
        });
        console.log(text);
        return text;
    }

    enterFrame(advancedTime: number) {
        let duringTime = advancedTime - this.lastTime + this.storeDuringTime;
        const milesecondPerFrame = 1000 / 60;
        while (duringTime > milesecondPerFrame) {
            for (const system of this.systems) {
                system.onTick(milesecondPerFrame);
            }
            duringTime -= milesecondPerFrame;
        }
        this.storeDuringTime = duringTime
        context.setTransform(1, 0, 0, 1, 0, 0)
        context.clearRect(0, 0, canvas.width, canvas.height)
        for (const system of this.systems) {
            system.onUpdate();
        }
        requestAnimationFrame(this.enterFrame.bind(this));
        this.lastTime = advancedTime;
    }

}

export interface Renderer {
    getBounds()
}

export class GameObject {

    static CURRENT_UUID = 0;

    static map: { [uuid: number]: GameObject } = {};

    uuid: number = 0;

    id: string;

    parent: GameObject;

    onClick?: Function;

    onClickFinish?: Function;

    preventOnClickBubble = false;

    onHoverIn?: Function;

    onHoverOut?: Function;

    hovered = false;

    currentHovered = false;

    behaviours: Behaviour[] = [];

    renderer: Renderer;

    children: GameObject[] = [];

    _active: boolean = false;

    _chosen: boolean = false;

    engine: GameEngine;
    child: any;

    get active() {
        return this._active;
    }

    set active(value: boolean) {
        this._active = value;
        for (const behaviour of this.behaviours) {
            behaviour.active = value;
        }
        for (const child of this.children) {
            child.active = value;
        }
    }

    get chosen(): boolean {
        return this._chosen;
    }

    set chosen(value: boolean) {
        this._chosen = value;
        for (const child of this.children) {
            if (child.active) {
                child.chosen = value;
            }
        }
    }

    constructor() {
        this.uuid = GameObject.CURRENT_UUID++;
        GameObject.map[this.uuid] = this;
    }

    removeSelf(): GameObject {
        if (this === this.engine.rootGameObject) {
            //不能删除rootGameObject
            return null;
        }
        this.parent.removeChild(this);
        return this;
    }

    addChild(child: GameObject) {
        this.children.push(child);
        child.engine = this.engine;
        child.parent = this;
        for (const behaviour of child.behaviours) {
            behaviour.engine = this.engine;
            if (this.engine.ready) {
                behaviour.onStart();
                if (this.engine.mode === "play") {
                    behaviour.onPlayStart();
                }
            }
            if (this.active) {
                behaviour.active = true;
            }
        }
        if (this.active) {
            child.active = true;
        }
    }

    removeChild(child: GameObject) {
        const index = this.children.indexOf(child);
        console.log("removeChild:", index);
        if (index >= 0) {
            this.children[index].active = false;
            this.children.splice(index, 1);
        }
    }

    upMoveChild(child: GameObject) {
        const index = this.children.indexOf(child);
        if (index >= 1) {
            [this.children[index], this.children[index - 1]] = [this.children[index - 1], this.children[index]];
            console.log("upMoveChild:", index);
        }
    }

    downMoveChild(child: GameObject) {
        const index = this.children.indexOf(child);
        if (index >= 0 && index < this.children.length - 1) {
            [this.children[index], this.children[index + 1]] = [this.children[index + 1], this.children[index]];
            console.log("downMoveChild:", index);
        }
    }

    addBehaviour(behaviour: Behaviour) {
        this.behaviours.push(behaviour);
        behaviour.gameObject = this;
        if (this.engine) {
            behaviour.engine = this.engine;
            if (this.engine.ready) {
                behaviour.onStart();
                if (this.engine.mode === "play") {
                    behaviour.onPlayStart();
                }
            }
            if (this.active) {
                behaviour.active = true;
            }
        }
    }

    //泛型
    getBehaviour<T extends typeof Behaviour>(clz: T): InstanceType<T> {
        for (const behaviour of this.behaviours) {
            if (behaviour.constructor.name === clz.name) {
                return behaviour as any;
            }
        }
        console.log("getBehaviour(): " + this.id + "找不到Behaviour: " + clz.name);
        return null;
    }

    hasBehaviour<T extends typeof Behaviour>(clz: T): boolean {
        for (const behaviour of this.behaviours) {
            if (behaviour.constructor.name === clz.name) {
                return true;
            }
        }
        return false;
    }

    removeBehaviour(behaviour: Behaviour) {
        behaviour.onEnd();
        const index = this.behaviours.indexOf(behaviour);
        if (index >= 0) {
            this.behaviours.splice(index, 1);
            behaviour.active = false;
        }
    }
}

const behaviourTable = {}

export function getAllComponentDefinationNames() {
    return Object.keys(behaviourTable);
}

export function getBehaviourClassByName(name: string) {
    return behaviourTable[name];
}

type GameObjectData = {
    id?: string
    behaviours: BehaviourData[]
    children?: GameObjectData[]
}

type BehaviourData = {
    type: string,
    properties?: { [index: string]: any }
}

export function registerBehaviourClass(behaviourClass: any) {
    const className = behaviourClass.name;
    behaviourTable[className] = behaviourClass;
}

export function extractGameObject(gameObject: GameObject): GameObjectData {
    const gameObjectData: GameObjectData = {
        behaviours: [],
    };
    if (gameObject.id) {
        gameObjectData.id = gameObject.id;
    }
    for (const behaviour of gameObject.behaviours) {
        const behaviourClass = (behaviour as any).__proto__
        const behaviourClassName = (behaviour as any).constructor.name;
        const __metadatas = behaviourClass.__metadatas || [];
        const behaviourData: BehaviourData = {type: behaviourClassName}
        gameObjectData.behaviours.push(behaviourData)
        for (const metadata of __metadatas) {
            behaviourData.properties = behaviourData.properties || {};
            behaviourData.properties[metadata.key] = behaviour[metadata.key];
        }
    }
    if (gameObject.children) {
        for (const child of gameObject.children) {
            const childData = extractGameObject(child);
            gameObjectData.children = gameObjectData.children || [];
            gameObjectData.children.push(childData);
        }
    }
    console.log(gameObjectData)
    return gameObjectData
}

export function createGameObject(data: any, gameEngine: GameEngine): GameObject {
    const gameObject = new GameObject();
    gameObject.engine = gameEngine;
    if (data.id) {
        gameObjects[data.id] = gameObject;
        gameObject.id = data.id;
    }
    for (const behaviourData of data.behaviours) {
        const behaviourClass = behaviourTable[behaviourData.type];
        if (!behaviourClass) {
            throw new Error('传入的类名不对:' + behaviourData.type);
        }
        const behaviour: Behaviour = new behaviourClass();
        const __metadatas = behaviourClass.prototype.__metadatas || [];
        // 【反序列化】哪些属性，是根据 metadata(decorator) 来决定的
        // 既然如此，【序列化】哪些属性，也应该根据同样的 metadata(decorator) 来确定
        for (const metadata of __metadatas) {
            const key = metadata.key;
            let value;
            if (behaviourData.properties && behaviourData.properties[key]) {
                value = behaviourData.properties[key];
            } else {
                if (metadata.type === 'string') {
                    value = '';
                } else if (metadata.type === 'boolean') {
                    value = false;
                } else {
                    value = 0;
                }
            }
            metadata.validator(value);
            behaviour[key] = value
        }
        gameObject.addBehaviour(behaviour);
    }

    if (data.children) {
        for (const childData of data.children) {
            const child = createGameObject(childData, gameEngine);
            gameObject.addChild(child);
        }
    }

    return gameObject;
}


export function getGameObjectById(id: string) {
    if (gameObjects[id] === null) {
        console.log("getGameObjectById(): 不存在id为 " + id + " 的GameObject");
    }
    return gameObjects[id]
}

export function hasGameObjectById(id: string): boolean {
    return gameObjects[id] !== null;
}

// rootGameObject
// A.active:true->false
//B.active:true->false