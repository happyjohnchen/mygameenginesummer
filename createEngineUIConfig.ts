const fs = require('fs');

const a = {
    canvasWidth: 400,
    canvasHeight: 400,
    controlPanelHeight: 100,
    assetsPanelHeight: 300,
    hierarchyPanelWidth: 400,
    inspectorPanelWidth: 400
};

fs.writeFileSync('engineUIConfig.json',JSON.stringify(a));
