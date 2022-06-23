# MyGameEngineSummer

### 介绍

游戏开发实践课程实践作业
这是一个具有可编辑的图形化界面的游戏引擎，可用于游戏开发。

### 软件架构

游戏引擎使用ECS架构设计，运行在基于nodejs的electron之中。

### 安装教程

1. 安装nodejs
2. 安装VSCode或其他代码编辑器
3. git拉取本项目源码
4. 运行`npm install`安装项目依赖
5. 执行`npm run start`运行引擎

### 使用说明

1. 执行npm run start运行引擎
2. 通过左侧层级树查看游戏中的Game Object
3. 在右侧的属性面板添加、修改、删除属性
4. 运行游戏进行测试
5. 发布你的游戏

### 添加的功能

##### 编辑器部分

1. 新的控制面板
2. 添加 GameObject 按钮
3. 删除 GameObject 按钮
4. 上移/下移 GameObject 按钮
5. 编辑GameObject的id

##### 引擎部分

1. ShapeRectRenderer 自定义颜色
2. TextRenderer 自定义字体、字号、颜色
3. Walkable 选择移动方向
4. 新增 ShapeCircleRenderer 可绘制圆形
5. 新增 ImageRenderer 可绘制指定图片
6. 新增 RoundedRectRenderer 可绘制圆角矩形
7. 新增 boolean 布尔型验证器 可用勾选框控制属性
8. 新增 Sound 可播放音频

### 常见问题

> 若在使用游戏引擎的过程中遇到了如下问题，可尝试根据下面的步骤排查。
>
>若到某一步已经解决问题，则无需继续执行后面的步骤。

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

1. 在层级树中尚未选中任何GameObject的情况下，新的GameObject默认出现在uuid=1的MyGameObject下
2. 点击新添加GameObject的父对象
3. 在属性面板中确认已经选中父对象
4. 点击添加GameObject按钮
5. 点击控制面板中的刷新按钮
6. 使用 `npm run start` 重新启动游戏引擎

##### 点击刷新按钮后，层级树面板中依然未显示层级树

1. 点击控制面板中的编辑按钮，刷新运行时
2. 再次尝试点击控制面板中的刷新按钮，刷新编辑器
3. 关闭游戏引擎
4. 使用 `npm run start` 再次启动游戏引擎

### 参与贡献

1. Fork 本仓库
2. 新建 Feat_xxx 分支
3. 提交代码
4. 新建 Pull Request