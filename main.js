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
        const editorProcess = new BrowserWindow({
            width: 1200,
            height: 800,
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
            runtimeView.setBounds({x: 400, y: 100, width: 400, height: 400})
            const mode = 'edit'
            runtimeView.webContents.loadURL(`http://localhost:3000/index.html?mode=${mode}`)
            runtimeView.webContents.openDevTools({mode: 'undocked'})
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
        runtimeView.webContents.loadURL(`http://localhost:3000/index.html?mode=${mode}`)
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



