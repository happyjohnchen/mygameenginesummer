import {
    allComponents,
    Button,
    provideFASTDesignSystem
} from "@microsoft/fast-components";
import { EditorHost } from "./EditorHost";
import { HierarchyTree } from "./HierarchyTree";
import { InspectorPanel } from "./InspectorPanel";
provideFASTDesignSystem().register(allComponents);


async function startup() {
    const editorHost = new EditorHost();

    //保存按钮
    const saveButton = document.getElementById("save-button") as Button;
    saveButton.onclick = async () => {
        const response = await editorHost.execute('getSceneSerializedData', null);
        const fs = require("fs");
        fs.writeFileSync('assets/scenes/main.yaml', response);
        alert('保存成功')
    };

    //刷新按钮
    const refreshButton = document.getElementById("refresh-button") as Button;
    refreshButton.onclick = () => {
        location.reload();
    }

    //编辑/运行按钮
    const playButton = document.getElementById('play-button') as Button;
    const editButton = document.getElementById('edit-button') as Button;
    const playEditMode = document.getElementById('play-edit-mode') as HTMLElement;
    editButton.innerText = ">编辑<";
    playButton.onclick = () => {
        editorHost.send({ command: "changeMode", data: "play" })
        playEditMode.innerText = "运行模式";
        playButton.innerText = ">运行<";
        editButton.innerText = "编辑";
    }
    editButton.onclick = () => {
        editorHost.send({ command: "changeMode", data: "edit" })
        playEditMode.innerText = "编辑模式";
        playButton.innerText = "运行";
        editButton.innerText = ">编辑<";
    }

    await editorHost.start();

    const inspector = new InspectorPanel(editorHost);
    await new HierarchyTree(editorHost).start(inspector);
}

startup();
