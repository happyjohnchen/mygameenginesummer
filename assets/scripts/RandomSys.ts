import {Behaviour} from "../../src/engine/Behaviour";

export class RandomSys extends Behaviour {

    //在此定义脚本中的属性
    species;
    arrSpecies = ["Human","Giant","Dwarf","Spirit"];
    CharecName;
    arrName = "abcdefghijklmnopqrstuvwxyz";
    
    //游戏编辑模式或运行模式开始时会执行一次
    onStart() { 
        
    }

    //游戏运行模式开始时会执行一次
    onPlayStart() {
        
    }

    //每次屏幕刷新执行
    onUpdate() {
        this.species = Math.floor((Math.random()*this.arrSpecies.length));
        this.gameObject.onClick = (e) =>{
            if(e.button == 0){
                this.getRandomName(this.arrName,5);
                console.log(this.arrSpecies[this.species],this.CharecName);
            }
        }
    }

    //平均每16ms执行一次
    onTick(duringTime: number) {

    }

    getRandomName(pradix,randomLength){
        this.CharecName = " ";
        for(let i = 0;i<randomLength;i++){
            let aa = Math.floor(Math.random()*(this.arrName.length));
            this.CharecName += this.arrName.substring(aa,aa+1);
        }        
    }
}