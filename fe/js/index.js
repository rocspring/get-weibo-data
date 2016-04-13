;(function(){

    var nowHref = window.location.href;

    /**
     * @desc 获取微博的AccessToken
     */
    function getWeiboAccessToken() {

      // api参数介绍地址 http://open.weibo.com/wiki/Oauth2/authorize
        var url = 'https://api.weibo.com/oauth2/authorize', // oauth2的authorize接口
            client_id = '1658043153', //申请应用时分配的AppKey。
            redirect_uri = 'http://127.0.0.1:8080/fe/'; //授权回调地址，站外应用需与设置的回调地址一致，站内应用需填写canvas page的地址。

        var params = {
            client_id: client_id,
            redirect_uri: redirect_uri
        };

        var newHref = 'https://api.weibo.com/oauth2/authorize?client_id=1658043153&redirect_uri=http%3A%2F%2F127.0.0.1%3A8080%2Ffe%2F';
        window.location.href = newHref;
        // $.ajax({
        //     url: url,
        //     type: 'GET',
        //     data: params,
        //     dataType: 'json',
        //     success: function (re) {
        //         console.log(re.toString());
        //     },
        //     error: function(re){
        //
        //     }
        // });

        //获取的code
        // code=0edaf3e34bf5ca812ad733fc6a196c89
    }

    /**
     * @desc 获取用户关注列表
     * @param {}
     */
    function getUserAttentionList(access_token, name) {

        // 接口描述地址 http://open.weibo.com/wiki/2/friendships/friends
        var userName =name || '',
            url = 'https://api.weibo.com/2/friendships/friends.json';

        $.ajax({
            url: url,
            type: 'GET',
            data: {
                access_token: access_token,
                screen_name: userName
            },
            dataType: 'JSON',
            success: function(rs) {
                console.log(rs);
            },
            error: function(rs) {
                // body...
            }
        })
    }

  function start() {
      var reg = /code=(.*)$/,
          regResult = nowHref.match(reg);
      if(regResult){
          var access_token = regResult[1];
          getUserAttentionList(access_token, '名人堂');
      } else {
           getWeiboAccessToken();
      }

  }

  start();
})();
