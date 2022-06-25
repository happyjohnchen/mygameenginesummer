async function startupCompiler() {
    const {createServer} = require('vite');
    const server = await createServer({
        // 任何合法的用户配置选项，加上 `mode` 和 `configFile`
        configFile: false,
        root: __dirname,
        server: {
            port: 3000
        }
    })
    await server.listen()

    server.printUrls()
}

let runtimeView;

async function startEditor() {

    const {app, BrowserWindow, BrowserView} = require('electron')

    function createWindow() {
        //设定编辑器尺寸
        const fs = require('fs');
        const engineUIConfig = JSON.parse(fs.readFileSync('engineUIConfig.json').toString());
        const editorProcess = new BrowserWindow({
            width: engineUIConfig.canvasWidth + engineUIConfig.hierarchyPanelWidth + engineUIConfig.inspectorPanelWidth,
            height: engineUIConfig.canvasHeight + engineUIConfig.controlPanelHeight + engineUIConfig.assetsPanelHeight,
            webPreferences: {
                nodeIntegration: true,  //允许渲染进程使用Nodejs
                contextIsolation: false //允许渲染进程使用Nodejs
            }
        })
        editorProcess.loadURL('http://localhost:3000/editor.html')
        editorProcess.openDevTools();


        setTimeout(() => {
            runtimeView = new BrowserView()
            editorProcess.setBrowserView(runtimeView)
            const fs = require('fs');
            const engineUIConfig = JSON.parse(fs.readFileSync('engineUIConfig.json').toString());
            runtimeView.setBounds({
                x: engineUIConfig.hierarchyPanelWidth,
                y: engineUIConfig.controlPanelHeight,
                width: engineUIConfig.canvasWidth,
                height: engineUIConfig.canvasHeight
            })
            const mode = 'edit'
            const scene = fs.readFileSync('src/defaultScene.txt');
            runtimeView.webContents.loadURL(`http://localhost:3000/index.html?mode=${mode}&scene=${scene}`);
            runtimeView.webContents.openDevTools({mode: 'undocked'});
        }, 5000)
    }

    app.whenReady().then(() => {
        createWindow();
        app.on('activate', () => {
            if (BrowserWindow.getAllWindows().length === 0) createRuntimeProcess()
        })

    })

    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') app.quit()
    })
}

async function startup() {
    new WebSocketProxy().start();
    await startupCompiler();
    await startEditor();
}


class WebSocketProxy {

    editorClient
    runtimeClient;

    start() {
        const {Server} = require('ws');
        const wss = new Server({port: 1234});
        wss.on('connection', (client) => {
            client.on('message', (text) => {
                const message = JSON.parse(text);
                if (message.command === 'login') {
                    this.handleLogin(message, client)
                } else if (message.command === 'changeMode') {
                    this.handleChangeMode(message)
                } else {
                    this.handleDispatchToOtherRendererProcess(message, text)
                }
            });
        });
    }

    handleChangeMode(message) {
        const mode = message.data;
        const fs = require('fs');
        const scene = fs.readFileSync('src/defaultScene.txt');
        runtimeView.webContents.loadURL(`http://localhost:3000/index.html?mode=${mode}&scene=${scene}`);
    }

    handleLogin(data, client) {
        if (data.id === 'editor') {
            this.editorClient = client;
        } else if (data.id === 'runtime') {
            this.runtimeClient = client;
        }
        if (this.editorClient && this.runtimeClient) {
            const text = JSON.stringify({command: 'loginSuccess'});
            this.editorClient.send(text);
            this.runtimeClient.send(text);
        }
    }

    handleDispatchToOtherRendererProcess(data, text) {
        if (data.id === 'editor') {
            this.runtimeClient.send(text);
        } else if (data.id === 'runtime') {
            this.editorClient.send(text);
        }
    }
}


startup().catch(e => {
    console.log(e)
})



