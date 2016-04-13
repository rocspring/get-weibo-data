var fs = require('fs');
var path = require('path');

function saveData(path, data) {

    var isFileExist = fs.existsSync(path);

    if (isFileExist) {
        writeFile(path, data);
    } else {
        creatFile(path, data);
    }
}

function writeFile(path, data) {

    fs.openSync(path, 'w');
    fs.appendFileSync(path, data);
    // fs.close(path);
}

function creatFile(path, data) {
    fs.openSync(path, 'w');
    fs.appendFileSync(path, data);
    // fs.close(path);
}

module.exports = {
        saveData: saveData
};
