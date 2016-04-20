var fs = require('file-system');
var path = require('path');
var Q = require('q');

// 通过promise进行改造
function saveData(path, data) {
    var deferred = Q.defer();
    writeToFile(path, data, deferred);
    return deferred.promise;
}

function writeToFile(path, data, deferred) {
    var isFileExist = fs.existsSync(path);

    if(!isFileExist){
        // 过滤最后存在的文件路径
        var dir = path.replace(/(\/[^\/]*\.[^\/]*)$/, '');
        fs.mkdirSync(dir);
    }

    fs.openSync(path, 'w');
    fs.appendFileSync(path, data);
    deferred.resolve();
    // fs.close(path);
}

module.exports = {
        saveData: saveData
};
