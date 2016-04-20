var requestApi = require('./request.js');
var saveData = require('./save.js');
var dataHandlerApi = require('./data-handler.js');
var fs = require('file-system');
var Q = require('q');

var uid = '1272740494',
    containerid = '100505' + uid,
    page = 1;


function proxyGetFollwersList() {
    return requestApi.getFollwersList(containerid);
}
function proxyGetFansList() {
    return requestApi.getFansList(containerid);
}

// getFameHallFollwers();
getFansOfFameHallFollwers();

// proxyGetFollwersList().then(proxyGetFansList);

/**
 * @desc 获取名人堂关注的用户列表
 * @return {Object} 一个Promise对象
 */
function getFameHallFollwers() {

    var uid = '1272740494',
        containerid = '100505' + uid,
        page = 1,
        filePath = './data/follwers/fameHallFollwers.txt',
        fameHallFollwersList = [];

    return requestApi.getFollwersList(containerid, page, handlerFameHallFollwersData)
            .then(function(){
                saveData.saveData(filePath, JSON.stringify(fameHallFollwersList));
            });

    // 处理名人堂关注列表的数据
    function handlerFameHallFollwersData(data) {
        if(!data && !data.length){
            return;
        }

        var i = 0,
            len = data.length;

        for ( ; i < len; i++ ) {
            fameHallFollwersList.push({
                'id': data[i].user.id,
                'screen_name': data[i].user.screen_name
            });
        }
    }
}

/**
 * @desc 获取名人堂关注用户的粉丝数据
 */
function getFansOfFameHallFollwers() {
    var fameHallFollwersFilePath = './data/follwers/fameHallFollwers.txt';

    if(!fs.existsSync(fameHallFollwersFilePath)){
        return;
    }

    var fameHallFollwersListStr = fs.readFileSync(fameHallFollwersFilePath, 'utf8');
    var fameHallFollwersList = JSON.parse(fameHallFollwersListStr);

    if (!fameHallFollwersList) {
        return;
    }

    var i = 0,
        len = fameHallFollwersList.length,
        saveFansDataFunList = [];

    for (; i < len; i++) {
        (function(userData){
            var userid = fameHallFollwersList[i].id;
             saveFansDataFunList.push(function(){
                 return saveFansData(userid);
             });
        })(fameHallFollwersList[i]);
    }

    if (saveFansDataFunList.length === 0) {
        return;
    }
    saveFansDataFunList.reduce(function(soFar, f){
            return soFar.then(f);
    }, saveFansDataFunList[0]());

    function saveFansData(userid) {
        var containerid = '100505' + userid,
            page = 1,
            path = './data/fans/' + userid + '_fans.txt',
            fansList = [],
            handlerDataFun = function(data) {
                fansList = fansList.concat(data);
            };

        if(fs.existsSync(path)){
            var deferred = Q.defer();
            deferred.resolve();
            return deferred.promise;
        }
        return requestApi.getFansList(containerid, page, handlerDataFun)
                .then(function(){
                    saveData.saveData(path, JSON.stringify(fansList));
                },function(){
                    var deferred = Q.defer();
                    deferred.resolve();
                    return deferred.promise;
                });
    }
}
