export class EditorHost {
    ws: WebSocket;

    private commandPool: { [id: string]: any; } = {};

    start() {
        const ws = new WebSocket("ws://localhost:1234");
        this.ws = ws;

        //设定编辑器尺寸
        const fs = require('fs');
        const engineUIConfig = JSON.parse(fs.readFileSync('engineUIConfig.json').toString());
        const controlPanel = document.getElementById('control-panel');
        const hierarchyPanel = document.getElementById('hierarchy-panel');
        const runtimePanel = document.getElementById('runtime-panel');
        const inspectorPanel = document.getElementById('inspector-panel');
        const filePanel = document.getElementById('file-panel');
        const assetsPanel = document.getElementById('assets-panel');
        const fileHandlePanel = document.getElementById('file-handle-panel');

        controlPanel.style.width = engineUIConfig.canvasWidth + engineUIConfig.hierarchyPanelWidth + engineUIConfig.inspectorPanelWidth;
        controlPanel.style.height = engineUIConfig.controlPanelHeight;
        controlPanel.style.top = '0';
        controlPanel.style.left = '0';

        hierarchyPanel.style.width = engineUIConfig.hierarchyPanelWidth;
        hierarchyPanel.style.height = engineUIConfig.canvasHeight;
        hierarchyPanel.style.top = engineUIConfig.controlPanelHeight + "px";
        hierarchyPanel.style.left = '0';

        runtimePanel.style.height = engineUIConfig.canvasHeight;
        runtimePanel.style.width = engineUIConfig.canvasWidth;
        runtimePanel.style.top = engineUIConfig.controlPanelHeight + "px";
        runtimePanel.style.left = engineUIConfig.hierarchyPanelWidth;

        inspectorPanel.style.width = engineUIConfig.inspectorPanelWidth;
        inspectorPanel.style.height = engineUIConfig.canvasHeight;
        inspectorPanel.style.top = engineUIConfig.controlPanelHeight;
        inspectorPanel.style.left = engineUIConfig.hierarchyPanelWidth + engineUIConfig.canvasWidth;

        filePanel.style.width = engineUIConfig.hierarchyPanelWidth;
        filePanel.style.height = engineUIConfig.assetsPanelHeight;
        filePanel.style.top = engineUIConfig.controlPanelHeight + engineUIConfig.canvasHeight;
        filePanel.style.left = '0';

        assetsPanel.style.width = (engineUIConfig.canvasWidth + engineUIConfig.inspectorPanelWidth - 200).toString();
        assetsPanel.style.height = engineUIConfig.assetsPanelHeight;
        assetsPanel.style.top = engineUIConfig.controlPanelHeight + engineUIConfig.canvasHeight;
        assetsPanel.style.left = engineUIConfig.hierarchyPanelWidth;

        fileHandlePanel.style.width = '200';
        fileHandlePanel.style.height = engineUIConfig.assetsPanelHeight;
        fileHandlePanel.style.top = engineUIConfig.controlPanelHeight + engineUIConfig.canvasHeight;
        fileHandlePanel.style.left = (engineUIConfig.hierarchyPanelWidth + engineUIConfig.canvasWidth + engineUIConfig.inspectorPanelWidth - 200).toString();


        return new Promise<void>((resolve, reject) => {
            ws.onmessage = (event) => {
                const recievedData = JSON.parse(event.data);
                if (recievedData.commandId) {
                    const requestCommand = this.commandPool[recievedData.commandId];
                    delete this.commandPool[recievedData.commandId];
                    const response = recievedData.data;
                    requestCommand.callback(response);
                }
                if (recievedData.command === 'loginSuccess') {
                    resolve();
                }
            };

            ws.onopen = () => {
                ws.send(
                    JSON.stringify({
                        command: "login",
                        id: "editor",
                    })
                );
            };
        });
    }

    send(data: any) {
        data.id = "editor";
        this.ws.send(JSON.stringify(data));
    }

    execute(type: string, param: any) {
        return new Promise<any>((resolve, reject) => {
            commandUUID++;
            const command = {command: type, data: param, commandId: commandUUID, callback: resolve};
            this.commandPool[commandUUID] = command;
            this.send(command);
        });

    }
}

let commandUUID = 0;