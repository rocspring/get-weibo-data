var requestApi = require('./request.js');

var uid = '',
    containerid = '100505' + uid,
    page = 1;


function proxyGetFollwersList() {
    return requestApi.getFollwersList(containerid);
}
function proxyGetFansList() {
    return requestApi.getFansList(containerid);
}

proxyGetFollwersList().then(proxyGetFansList);
