import {
    allComponents,
    provideFASTDesignSystem
} from "@microsoft/fast-components";
import { EditorHost } from "./EditorHost";
import { HierarchyTree } from "./HierarchyTree";
import { InspectorPanel } from "./InspectorPanel";
provideFASTDesignSystem().register(allComponents);


async function startup() {
    const editorHost = new EditorHost();
    const saveButton = document.getElementById("save-button");
    saveButton.onclick = async () => {
        const response = await editorHost.execute('getSceneSerializedData', null);
        const fs = require("fs");
        fs.writeFileSync('assets/scenes/main.yaml', response);
        alert('保存成功')
    };

    const playButton = document.getElementById('play-button');
    playButton.onclick = () => {
        editorHost.send({ command: "changeMode", data: "play" })
    }
    const editButton = document.getElementById('edit-button');
    editButton.onclick = () => {
        editorHost.send({ command: "changeMode", data: "edit" })
    }

    await editorHost.start();

    const inspector = new InspectorPanel(editorHost);
    await new HierarchyTree(editorHost).start(inspector);
}

startup();
