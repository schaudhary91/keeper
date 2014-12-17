var authenticator = function() {
    var OAUTHURL = 'https://accounts.google.com/o/oauth2/auth?',
            VALIDURL = 'https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=',
            SCOPE = 'profile',
            CLIENTID = '799960612757-0ilgpi2jojv8i7m8j92fgiu5gjf9upac.apps.googleusercontent.com',
            REDIRECT = 'http://localhost:3000/redirect',
            TYPE = 'token',
            _url = OAUTHURL + 'scope=' + SCOPE + '&client_id=' + CLIENTID + '&redirect_uri=' + REDIRECT + '&response_type=' + TYPE;

    return {
         login: function() {
            var that = this,
                win = window.open(_url, "windowname1", 'width=800, height=600');

            var pollTimer = window.setInterval(function() {
                try {
                    if (win.document.URL.indexOf(REDIRECT) != -1) {
                        window.clearInterval(pollTimer);
                        var url = win.location.hash,
                            splitUrl;

                        url = url.slice(1, url.length);

                        splitUrl = url.split('&').sort();

                        acToken = splitUrl[0].split('=')[1];
                        expiresIn = splitUrl[1].split('=')[1];
                        tokenType = splitUrl[2].split('=')[1];

                        win.close();

                        that.validateToken(acToken);
                    }
                } catch (e) {}
            }, 100);
        },
        validateToken : function(token) {
            var that = this;
            $.ajax({
                url: VALIDURL + token,
                data: null,
                success: function(responseText) {
                    that.getUserInfo();
                },
                dataType: "jsonp"
            });
        },
        getUserInfo : function() {
            var that = this;
            $.ajax({
                url: 'https://www.googleapis.com/oauth2/v1/userinfo?access_token=' + acToken,
                data: null,
                success: function(resp) {
                    that.user = resp;
                    keep.saveTag();
                },
                dataType: "jsonp"
            });
        }
    }
}
