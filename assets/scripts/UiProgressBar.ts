import {Behaviour} from "../../src/engine/Behaviour";
import {GameController} from "./GameController";
import {AttributeSystem} from "./AttributeSystem";
import {ShapeRectRenderer} from "../../src/behaviours/ShapeRectRenderer";
import {GameObject, getGameObjectById} from "../../src/engine";
import {TextRenderer} from "../../src/behaviours/TextRenderer";

export class UiProgressBar extends Behaviour {

    //在此定义脚本中的属性
    gameController: GameController
    attributeSystem: AttributeSystem
    energyBar: ShapeRectRenderer
    foodBar: ShapeRectRenderer
    waterBar: ShapeRectRenderer
    energyText: GameObject
    foodText: GameObject
    waterText: GameObject

    //游戏编辑模式或运行模式开始时会执行一次
    onStart() {

    }

    //游戏运行模式开始时会执行一次
    onPlayStart() {
        //获取所有对象
        this.gameController = getGameObjectById('GameController').getBehaviour(GameController);
        this.attributeSystem = getGameObjectById("AttributeController").getBehaviour(AttributeSystem);
        this.energyBar = getGameObjectById('EnergyBar').getBehaviour(ShapeRectRenderer);
        this.foodBar = getGameObjectById('FoodBar').getBehaviour(ShapeRectRenderer);
        this.waterBar = getGameObjectById('WaterBar').getBehaviour(ShapeRectRenderer);
        this.energyText = getGameObjectById('EnergyText');
        this.foodText = getGameObjectById('FoodText');
        this.waterText = getGameObjectById('WaterText');

        //隐藏数字
        this.energyText.active = false;
        this.foodText.active = false
        this.waterText.active = false;
    }

    //每次屏幕刷新执行
    onUpdate() {
        //鼠标移入显示文字
        this.energyText.active = this.gameObject.hovered;
        this.foodText.active = this.gameObject.hovered;
        this.waterText.active = this.gameObject.hovered;

        //更新数字显示
        this.energyText.getBehaviour(TextRenderer).text = this.gameController.game.energy + "/" + this.attributeSystem.maxValue;
        this.foodText.getBehaviour(TextRenderer).text = this.gameController.game.food + "/" + this.attributeSystem.maxValue;
        this.waterText.getBehaviour(TextRenderer).text = this.gameController.game.water + "/" + this.attributeSystem.maxValue;

        //更新进度条宽度
        this.energyBar.width = this.gameController.game.energy / this.attributeSystem.maxValue * 94;
        this.foodBar.width = this.gameController.game.food / this.attributeSystem.maxValue * 94;
        this.waterBar.width = this.gameController.game.water / this.attributeSystem.maxValue * 94;
    }

    //平均每16ms执行一次
    onTick(duringTime: number) {

    }

    //删除Behaviour时会执行一次
    onEnd() {

    }
}