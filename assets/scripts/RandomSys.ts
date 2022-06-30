import {Behaviour} from "../../src/engine/Behaviour";

export class RandomSys extends Behaviour {

    //在此定义脚本中的属性
    species;
    CharecName;
    arrSpecies = ["Human","Giant","Dwarf","Spirit"];
    arrName = ["Tom","Jerry","Sam","Taylor","Jones","Chris","Kelly","Lane","Tommy","Terry",
               "Vivian","Nancy","Emma","Elvis","Carl","Albert","Harvey","Liam","James","Bruce"];

    
    //游戏编辑模式或运行模式开始时会执行一次
    onStart() { 
        
    }

    //游戏运行模式开始时会执行一次
    onPlayStart() {
        
    }

    //每次屏幕刷新执行
    onUpdate() {
        this.getRandomName();
        this.gameObject.onClick = (e) =>{
            if(e.button == 0){
                console.log(this.arrSpecies[this.species],this.arrName[this.CharecName]);
            }
        }
    }

    //平均每16ms执行一次
    onTick(duringTime: number) {

    }

    getRandomName(){
        this.species = Math.floor((Math.random()*this.arrSpecies.length));
        this.CharecName = Math.floor(Math.random()*this.arrName.length);
    }
    
}