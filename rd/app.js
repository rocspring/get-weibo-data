var requestApi = require('./request.js');

var uid = '1272740494',
    containerid = '100505' + uid,
    page = 1;


function proxyGetFollwersList() {
    return requestApi.getFollwersList(containerid);
}
function proxyGetFansList() {
    return requestApi.getFansList(containerid);
}

proxyGetFollwersList().then(proxyGetFansList);
