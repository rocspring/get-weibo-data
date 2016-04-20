var jsonHttp = require('json-http');
var http = require('http');
var dataHandler = require('./data-handler.js');
var saveData = require('./save.js');
// var Promise = require('bluebird');
var Q = require('q');

function promiseGetFollwersList(containerid, page, dataHandlerFun) {
    console.log('start getFollwersList.');
    page = page || 1;

    var follwersListMaxPage = 0,
        follwersList = [];

    var deferred = Q.defer();
    getFollwersList(containerid, page);
    return deferred.promise;

    function getFollwersList(containerid, page) {

        containerid = containerid || '';
        page = page || 1;

        var url = 'http://m.weibo.cn/page/json?containerid=' + containerid + '_-_FOLLOWERS&page=' + page;
        console.log(url);
        http.get(url,
            function(rs){
                if(typeof rs !== 'object') {
                    console.log('接口出错');
                    deferred.reject();
                }

                if (!rs || !rs.count ) {
                    console.log('没有关注列表数据');
                    deferred.reject();
                } else {
                    rs = JSON.parse(rs);

                    if(rs && rs.cards
                        && rs.cards[0]
                        && rs.cards[0].card_group){

                        var nextPage = page + 1,
                            tempData = null;

                        rs.cards[0].maxPage && (follwersListMaxPage = rs.cards[0].maxPage);

                        if (nextPage > follwersListMaxPage) {
                            console.log('获取关注列表结束...' + 'follwersListMaxPage:'+ follwersListMaxPage );
                            // saveData.saveData('./data/follwers/' + containerid + '_follwers.txt', JSON.stringify(follwersList));
                            deferred.resolve();
                        } else {
                            // tempData = dataHandler.handlerFollwersListData(rs.cards[0].card_group);
                            // follwersList = follwersList.concat(tempData);
                            dataHandlerFun && dataHandlerFun(rs.cards[0].card_group);
                            setTimeout(function(){
                                getFollwersList(containerid, nextPage);
                            }, 100);
                        }
                    }
                }

            });
    }

}

function promiseGetFansList(containerid, page, dataHandlerFun) {
    console.log('start getFansList.');
    page = page || 1;

    var fansListMaxPage = 0,
        fansList = [];
    var deferred = Q.defer();
    getFansList(containerid, page);
    return deferred.promise;

    function getFansList(containerid, page) {

        containerid = containerid || '';
        page = page || 1;

        var url = 'http://m.weibo.cn/page/json?containerid=' + containerid + '_-_FANS&page=' + page,
            requestParam = {
                url: url,
                headers: {
                    "Cookie": '_T_WM=54a3d004550f7154574dd32991c6c9dc; SUB=_2A256Ej53DeRxGeNN61ET8i7LzD2IHXVZ_UI_rDV6PUJbstAKLVD9kW1LHetwncfluNHPgS_6xQlcckNK6cmp1w..; SUBP=0033WrSXqPxfM725Ws9jqgMF55529P9D9WW0ev21qEas4MUjo1YmwnMA5JpX5o2p; SUHB=0nluNJIsokA8V7; SSOLoginState=1461079592; gsid_CTandWM=4uTpCpOz5TFn1PMwzOojmmfBOcr'
                }
            };

        http.get(url,
            function(rs){
                if(typeof rs !== 'object') {
                    console.log('接口出错');
                    deferred.reject();
                }

                if (!rs || !rs.count) {
                    console.log('没有关注列表数据');
                    deferred.reject();
                } else {
                    rs = JSON.parse(rs);

                    if(rs.cards
                        && rs.cards[0]
                        && rs.cards[0].card_group){

                        var nextPage = page + 1,
                            tempData = null;

                        if (rs.cards[0].maxPage) {
                            fansListMaxPage = rs.cards[0].maxPage;
                        } else {
                            fansListMaxPage = 99;
                        }

                        if (nextPage > fansListMaxPage) {
                            console.log('获取粉丝列表结束...' + 'fansListMaxPage:'+ fansListMaxPage);
                            // saveData.saveData('./data/fans/' + containerid + '_fans.txt', JSON.stringify(fansList));
                            deferred.resolve();
                        } else {
                            // tempData = dataHandler.handlerFansListData(rs.cards[0].card_group);
                            // fansList = fansList.concat(tempData);
                            dataHandlerFun && dataHandlerFun(rs.cards[0].card_group);
                            setTimeout(function(){
                                getFansList(containerid, nextPage);
                            }, 100);

                        }

                    }
                }

            });
    }

}

module.exports = {
        getFollwersList: promiseGetFollwersList,
        getFansList: promiseGetFansList
};
