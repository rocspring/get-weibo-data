var fs = require('file-system');
var path = require('path');

function saveData(path, data) {
    writeToFile(path, data);
}

function writeToFile(path, data) {
    var isFileExist = fs.existsSync(path);

    if(!isFileExist){
        // 过滤最后存在的文件路径
        var dir = path.replace(/(\/[^\/]*\.[^\/]*)$/, '');
        fs.mkdirSync(dir);
    }

    fs.openSync(path, 'w');
    fs.appendFileSync(path, data);
    // fs.close(path);
}

module.exports = {
        saveData: saveData
};
