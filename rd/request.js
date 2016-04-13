var jsonHttp = require('json-http');
var dataHandler = require('./data-handler.js');
var save = require('./save.js');
// var Promise = require('bluebird');
var Q = require('q');

var follwersListMaxPage = 0,
    fansListMaxPage = 0,
    follwersList = [],
    fansList = [];

function promiseGetFollwersList(containerid, page) {
    console.log('start getFollwersList.');
    page = page || 1;
    var deferred = Q.defer();
    getFollwersList(containerid, page);
    return deferred.promise;

    function getFollwersList(containerid, page) {

        containerid = containerid || '';
        page = page || 1;

        var url = 'http://m.weibo.cn/page/json?containerid=' + containerid + '_-_FOLLOWERS&page=' + page;

        jsonHttp.getJson(url,
            function(err, rs){
                if (!rs || !rs.count ) {
                    console.log('没有关注列表数据');
                    deferred.reject();
                    return;
                }

                if(rs.cards
                    && rs.cards[0]
                    && rs.cards[0].card_group){

                    var nextPage = page + 1,
                        tempData = null;

                    rs.cards[0].maxPage && (follwersListMaxPage = rs.cards[0].maxPage);

                    if (nextPage > follwersListMaxPage) {
                        console.log('获取关注列表结束...' + 'follwersListMaxPage:'+ follwersListMaxPage );
                        save.saveData('./rd/follwers/' + containerid + '_follwers.txt', JSON.stringify(follwersList));
                        deferred.resolve();
                        return;
                    } else {
                        tempData = dataHandler.handlerFollwersListData(rs.cards[0].card_group);
                        follwersList = follwersList.concat(tempData);
                        getFollwersList(containerid, nextPage);
                    }
                }
            });
    }

}

function promiseGetFansList(containerid, page) {
    console.log('start getFansList.');
    page = page || 1;
    var deferred = Q.defer();
    getFansList(containerid, page);
    return deferred.promise;

    function getFansList(containerid, page) {

        containerid = containerid || '';
        page = page || 1;

        var url = 'http://m.weibo.cn/page/json?containerid=' + containerid + '_-_FANS&page=' + page;

        jsonHttp.getJson(url,
            function(err, rs){
                if (!rs || !rs.count ) {
                    console.log('没有粉丝列表数据');
                    deferred.reject();
                    return;
                }

                if(rs.cards
                    && rs.cards[0]
                    && rs.cards[0].card_group){

                    var nextPage = page + 1,
                        tempData = null;

                    rs.cards[0].maxPage && (fansListMaxPage = rs.cards[0].maxPage);

                    if (nextPage > fansListMaxPage) {
                        console.log('获取粉丝列表结束...' + 'fansListMaxPage:'+ fansListMaxPage);
                        save.saveData('./rd/fans/' + containerid + '_fans.txt', JSON.stringify(fansList));
                        deferred.resolve();
                        return;
                    } else {
                        tempData = dataHandler.handlerFansListData(rs.cards[0].card_group);
                        fansList = fansList.concat(tempData);
                        getFansList(containerid, nextPage);
                        return;
                    }

                }
            });
    }

}

module.exports = {
        getFollwersList: promiseGetFollwersList,
        getFansList: promiseGetFansList
};
