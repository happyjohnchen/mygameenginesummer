# MyGameEngineSummer

### 介绍

游戏开发实践课程实践作业
这是一个具有可编辑的图形化界面的游戏引擎，可用于游戏开发。

### 软件架构

游戏引擎使用ECS架构设计，运行在基于nodejs的electron之中。

### 安装教程

1. 安装 nodejs
2. 安装 VSCode
3. 安装 git
4. 使用 `git clone https://gitee.com/happyjohnchen/mygameenginesummer.git` 拉取本项目源码
5. `cd mygameenginesummer` 进入项目目录
6. 运行 `npm install` 安装项目依赖
7. 执行 `npm run start` 运行引擎

### 使用说明

1. 执行 `npm run start` 运行引擎
2. 通过左侧层级树查看游戏中的 Game Object
3. 在右侧的属性面板添加、修改、删除属性
4. 运行游戏进行测试
5. 发布你的游戏

### 添加的功能

##### 编辑器部分

1. 新的控制面板: 可切换运行/编辑模式，保存场景，刷新引擎
2. 新的资源面板: 可查看与编辑项目文件（场景、脚本、图片），可新建/删除文件和文件夹
3. 可调节的窗口大小: 可通过更改 `engineUIConfig.json` 文件更改窗口各个部分的大小
4. 添加 GameObject 按钮
5. 删除 GameObject 按钮
6. 上移/下移 GameObject 按钮
7. 编辑GameObject的id
8. 发行模式: 不显示编辑器和控制台，直接运行游戏

##### 引擎部分

1. `engine.loadScene()` 可跳转场景
2. Prefab 预制体
3. ShapeRectRenderer 自定义颜色
4. TextRenderer 自定义字体、字号、颜色
5. Walkable 选择移动方向
6. 新增 ShapeCircleRenderer 可绘制圆形
7. 新增 ImageRenderer 可绘制指定图片
8. 新增 AnimationRenderer 可渲染动画
9. 新增 RoundedRectRenderer 可绘制圆角矩形
10. 新增 boolean 布尔型验证器 可用勾选框控制属性
11. 新增 Sound 可播放音频，能控制音频自动播放和循环播放

### 常见问题

> 若在使用游戏引擎的过程中遇到了如下问题，可尝试根据下面的步骤排查。
>
>若到某一步已经解决问题，则无需继续执行后面的步骤。

##### 如何添加新的 Behaviour 组件

1. 复制 `src/behaviours/BehaviourDemo` 到 `assets/scripts` 中
2. 修改为文件名和类名 
3. 编写脚本
4. 在 `main.ts` 中使用 `registerBehaviourClass()` 注册你的新 Behaviour
5. 启动/刷新引擎，即可在添加组件菜单中看到你的新组件

##### 运行时不能正确显示场景中的内容，而是显示为空白

1. 点击控制面板的编辑按钮，刷新运行时
2. 检查摄像机的位置和显示范围
3. 确认摄像机的名称为`camera`
4. 确认摄像机的属性面板中拥有`Camera`属性
5. 使用 `npm run start` 重新启动游戏引擎

##### 层级树面板不显示层级树

1. 点击控制面板中的刷新按钮，刷新编辑器
2. 确认YAML文件没有被损坏且格式正确
3. 使用 `npm run start` 重新启动游戏引擎

##### 点击添加GameObject按钮后，新的GameObject未出现在期望的位置

1. 在层级树中尚未选中任何GameObject的情况下，新的 GameObject 默认出现在 uuid = 1 的 MyGameObject 下
2. 点击新添加GameObject的父对象
3. 在属性面板中确认已经选中父对象
4. 点击添加 GameObject 按钮
5. 点击控制面板中的刷新按钮
6. 使用 `npm run start` 重新启动游戏引擎

##### 点击刷新按钮后，层级树面板中依然未显示层级树

1. 点击控制面板中的编辑按钮，刷新运行时
2. 再次尝试点击控制面板中的刷新按钮，刷新编辑器
3. 关闭游戏引擎
4. 使用 `npm run start` 再次启动游戏引擎

##### 填写组件的文件路径后，游戏没有按预期加载相应文件

1. 检查文件名是否正确
2. 填写文件路径时，应包含文件后缀
3. 文件路径应为相对于项目的根目录，例如 `assets/images/testImage.png`
4. 确认文件格式可被浏览器打开，且文件没有损坏

##### 从资源面板加载其他场景后，刷新编辑器或运行时后又回到了 main.yaml 场景

1. 打开 `src/engine.ts` 文件
2. 找到 `class GameEngine` 中的 `defaultSceneName` 属性
3. 将属性值更改为你需要编辑的场景文件(_注意文件地址的完整及拼写_)
4. 保存 `src/engine.ts` 文件
5. 点击游戏引擎控制面板中的刷新按钮

### 参与贡献

1. Fork 本仓库
2. 新建 Feat_xxx 分支
3. 提交代码
4. 新建 Pull Request