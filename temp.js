
const button = document.createElement('button');
button.innerText = "保存!";
document.body.appendChild(button);


button.onclick = () => {
    const fs = require('fs');
    fs.writeFileSync('1.txt', 'lalalallalalalla');
}


