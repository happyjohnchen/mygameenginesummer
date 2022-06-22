import {
    Accordion,
    AccordionItem,
    Select,
    ListboxOption,
    TextField,
    Button, Checkbox,
} from "@microsoft/fast-components";
import type {GameObjectComponentProperty, GameObjectComponents} from "../src/types";
import {EditorHost} from "./EditorHost";

export class InspectorPanel {
    private accordion: Accordion;
    public selectedGameObjectUUID;

    constructor(private editorHost: EditorHost) {
        this.accordion = document.getElementById("inspector-accordion") as Accordion;
        this.selectedGameObjectUUID = 1;
    }

    async onSelectGameObject(gameObjectUUID: number) {
        this.selectedGameObjectUUID = gameObjectUUID;

        //添加组件按钮
        const addComponentButton = document.getElementById("add-component-button") as Button;

        const addComponentSelect = document.getElementById("add-component-select") as Select;
        const componentDefinations = await this.editorHost.execute(
            "getAllComponentDefinations",
            gameObjectUUID
        );
        addComponentSelect.innerHTML = "";
        componentDefinations.forEach((componentDefination) => {
            const option = new ListboxOption();
            option.value = componentDefination.name;
            option.textContent = componentDefination.name;
            addComponentSelect.appendChild(option);
        });

        addComponentButton.onclick = async () => {
            const componentToAdd = addComponentSelect.value;
            await this.editorHost.execute("addComponentToGameObject", {
                gameObjectUUID,
                componentName: componentToAdd,
            });
            await this.updateComponentsUI(gameObjectUUID);
        };

        await this.updateComponentsUI(gameObjectUUID);
    }

    async updateComponentsUI(gameObjectUUID: number) {
        this.accordion.innerHTML = "";

        const allComponents: GameObjectComponents = await this.editorHost.execute(
            "getAllComponentsByGameObjectUUID",
            gameObjectUUID
        );

        //编辑GameObjectID
        const idTextField = new TextField();
        const gameObjectID: string = await this.editorHost.execute(
            "getIDByGameObjectUUID",
            gameObjectUUID
        );
        idTextField.currentValue = gameObjectID;
        idTextField.onchange = () => {
            let newID: string = idTextField.value;
            this.editorHost.execute("setIDByGameObjectUUID", {
                gameObjectUUID,
                newID,
            });
        };
        this.accordion.appendChild(idTextField);

        //编辑组件
        for (const component of allComponents) {
            const accordionItem = new AccordionItem();

            const componentName: string = component.name;

            const content = document.createElement("div");
            for (const property of component.properties) {
                const div = document.createElement("div");

                const label = document.createElement("span");
                label.innerText = property.name + ":";
                const factory = factoryMap[property.editorType];
                const editorUI = factory(property);
                editorUI.onchange = () => {
                    let value: string | number | boolean = editorUI.value;
                    if (property.type === "number") {
                        value = parseFloat(value);
                    } else if (property.type === "boolean") {
                        const checkbox = editorUI as Checkbox;
                        value = checkbox.checked;
                    }
                    this.editorHost.execute("modifyComponentProperty", {
                        gameObjectUUID,
                        componentName,
                        propertyName: property.name,
                        value,
                    });
                };
                div.appendChild(label);
                div.appendChild(editorUI);

                content.appendChild(div);
            }

            accordionItem.appendChild(content);

            const button = new Button();
            button.textContent = "删除";
            button.onclick = async () => {
                console.log("删除", gameObjectUUID, componentName);
                await this.editorHost.execute("removeComponentFromGameObject", {
                    gameObjectUUID,
                    componentName,
                });
                await this.updateComponentsUI(gameObjectUUID);
                await this.updateComponentsUI(gameObjectUUID);
            };
            accordionItem.appendChild(button);

            const heading = document.createElement("div");
            heading.slot = "heading";
            heading.innerText = componentName;
            accordionItem.appendChild(heading);

            this.accordion.appendChild(accordionItem);
        }

        //上移下移按钮
        const upMoveGameObjectButton = document.getElementById("up-move-game-object-button");
        const downMoveGameObjectButton = document.getElementById("down-move-game-object-button");
        upMoveGameObjectButton.onclick = async () => {
            await this.editorHost.execute("upMoveGameObjectByGameObjectUUID", gameObjectUUID);
        }
        downMoveGameObjectButton.onclick = async () => {
            await this.editorHost.execute("downMoveGameObjectByGameObjectUUID", gameObjectUUID);
        }

        //删除对象按钮
        const removeGameObjectButton = document.getElementById(
            "remove-game-object-button"
        ) as Button;
        removeGameObjectButton.onclick = async () => {
            if (confirm("确定要删除" + gameObjectID + "吗？")) {
                console.log("删除GameObject:", gameObjectUUID);
                await this.editorHost.execute("removeGameObjectByGameObjectUUID", gameObjectUUID);
                location.reload();
            }
        };
    }
}

let factoryMap = {
    select: createSelect,
    textfield: createTextField,
    checkbox: createCheckBox,
};

function createSelect(property: GameObjectComponentProperty) {
    const input = new Select();
    property.options!.forEach((o) => {
        const option = new ListboxOption();
        option.value = o.value.toString();
        option.textContent = o.label.toString();
        input.appendChild(option);
        return option;
    });
    return input;
}

function createTextField(property: GameObjectComponentProperty) {
    const input = new TextField();
    input.value = property.value;
    return input;
}

function createCheckBox(property: GameObjectComponentProperty) {
    const input = new Checkbox();
    input.checked = property.value;
    return input;
}
