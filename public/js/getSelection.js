(function() {

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
                    win = window.open(_url, "windowname1", 'width=800, height=600'),
                    pollTimer = window.setInterval(function() {
                        try {
                            if (win.document.URL.indexOf(REDIRECT) != -1) {
                                window.clearInterval(pollTimer);
                                var url = win.location.hash;
                                if (url.indexOf('error=access_denied') === -1) {
                                    var splitUrl,
                                        url = url.slice(1, url.length),
                                        splitUrl = url.split('&').sort(),
                                        acToken = splitUrl[0].split('=')[1],
                                        expiresIn = splitUrl[1].split('=')[1],
                                        tokenType = splitUrl[2].split('=')[1];
                                    that.token = acToken;
                                    that.validateToken(acToken);
                                } else {
                                    keep.showLoginError(url);
                                }
                                win.close();
                            }
                        } catch (e) {}
                    }, 100);
            },
            validateToken: function(token, validateOnly) {
                var that = this;
                $.ajax({
                    url: VALIDURL + token,
                    data: null,
                    success: function(responseText) {
                        if (!responseText.error) {
                            if(!validateOnly) {
                                that.getUserInfo(token);
                            } else {
                                keep.updateLoginStatus({
                                    status : 'unchanged'
                                });
                            }
                        } else {
                            that.user = undefined;

                            keep.updateLoginStatus();

                            keep.showLoginError(responseText.error);
                        }
                    },
                    dataType: "jsonp"
                });
            },
            getUserInfo: function(acToken) {
                var that = this;
                $.ajax({
                    url: 'https://www.googleapis.com/oauth2/v1/userinfo?access_token=' + acToken,
                    data: null,
                    success: function(resp) {
                        that.user = resp;
                        keep.updateLoginStatus({
                            status : 'new',
                            name : resp.name
                        });
                        keep.saveTag();
                    },
                    dataType: "jsonp"
                });
            }
        }
    }

    var KeeperClient = function() {

    }

    KeeperClient.prototype = (function() {
        var _wrapper,
            _keepBtn,
            _dialog,
            _overlay,
            _saveBtn,
            _cancelBtn,
            _authSaveBtn,
            _signedInStatus,
            _tagInput,
            _tagHolder;

        return {
            init: function() {
                _wrapper = document.getElementById('kp-wrapper');

                _keepBtn = document.getElementById('kp-btn');

                _dialog = document.getElementById('kp-dialog');

                _overlay = document.getElementById('kp-overlay');

                _saveBtn = document.getElementById('kp-saveTag');

                _authSaveBtn = document.getElementById('kp-authSaveTag');

                _signedInStatus = document.getElementById('kp-signedInStatus');

                _cancelBtn = document.getElementsByClassName('kp-cancel');

                _tagInput = document.getElementById('kp-tagName');

                _tagHolder = document.getElementById('kp-tagHolder');

                this.auth = authenticator();

                this.bindEvents();
            },
            getSelectedText: function() {
                if (window.getSelection) {
                    return window.getSelection().toString();
                } else if (document.selection) {
                    return document.selection.createRange().text;
                } else {
                    return '';
                }
            },
            showKeeperClient: function(left, top) {
                _keepBtn.style.display = 'block';
                _keepBtn.style.left = left + 15 + 'px';
                _keepBtn.style.top = top + 15 + 'px';
            },
            hideKeeperClient: function() {
                _keepBtn.style.display = 'none';
            },
            showDialog: function(type, selection) {
                var that = this,
                    saveDialog = document.getElementById('kp-saveForm'),
                    loaderDialog = document.getElementById('kp-loader'),
                    successDialog = document.getElementById('kp-success'),
                    regretDialog = document.getElementById('kp-regret');

                _dialog.style.display = 'block';

                that.hideKeeperClient();

                //Hide all dialogs
                saveDialog.style.display = 'none';
                successDialog.style.display = 'none';
                regretDialog.style.display = 'none';
                loaderDialog.style.display = 'none';


                switch (type) {
                    case 'save':
                        var words = selection.split(' '),
                            displayText,
                            selectionPara = document.getElementById('kp-selection');

                        // Reset
                        _tagInput.value = '';
                        _tagInput.setAttribute('placeholder', 'Your tag name goes here');
                        _tagInput.classList.remove('emptyError');

                        _tagHolder.innerHTML = '';

                        _tagInput.removeEventListener('keydown');
                        _tagInput.addEventListener('keydown', function(e) {
                            if(e.which == '32' || e.which == '186') {
                                var me = this;
                                that.addToTagList(this.value);
                                setTimeout(function() {
                                    me.value = '';
                                })
                            } 
                        });

                        // Disable Save btn
                        _saveBtn.style.display = 'inline-block';
                        _authSaveBtn.style.display = 'none';
                        _saveBtn.setAttribute('disabled', 'disabled');

                        if (words.length > 3) {
                            displayText = '"' + words[0] + ' ' + words[1] + ' ....' + words[words.length - 1] + '"';
                        } else {
                            displayText = '"' + selection + '"';
                        }

                        selectionPara.setAttribute('title', selection);
                        selectionPara.innerHTML = displayText;

                        that.auth.validateToken(that.auth.token, true);

                        saveDialog.style.display = 'block';
                        _tagInput.focus();
                        break;
                    case 'loader':
                        loaderDialog.style.display = 'block';
                        break;
                    case 'success':
                        successDialog.style.display = 'block';
                        break;
                    case 'regret':
                        regretDialog.style.display = 'block';
                        break;
                }
            },
            addToTagList : function(text) {
                if(text !== '') {
                    var tagBox = document.createElement('div'),
                        crossBtn = document.createElement('span');

                    crossBtn.innerText = 'x';
                    crossBtn.classList.add('cross');

                    tagBox.classList.add('kp-tagBox');
                    tagBox.innerHTML = '<span class="kp-tag">' + text + '</span>';

                    tagBox.appendChild(crossBtn);

                    crossBtn.addEventListener('click', function() {
                        this.parentElement.remove();
                    });

                    _tagHolder.appendChild(tagBox);
                }
            },
            closeDialog: function() {
                var that = this;
                that.hideKeeperClient();
                this.hideOverLay();
                _dialog.style.display = 'none';
            },
            showOverLay: function() {
                _overlay.style.display = 'block';
            },
            hideOverLay: function() {
                _overlay.style.display = 'none';
            },
            updateLoginStatus : function(obj) {
                if(obj) {
                    if(obj.status == 'new') {
                        _signedInStatus.innerText = "Signed in as : " + obj.name;
                    }
                    _saveBtn.style.display = 'inline-block';
                    _authSaveBtn.style.display = 'none';
                    _saveBtn.removeAttribute('disabled');
                } else {
                    _signedInStatus.innerText = "Not signed in";
                    _saveBtn.style.display = 'none';
                    _authSaveBtn.style.display = 'inline-block';
                }
                // if (name) {
                //     _signedInStatus.innerText = "Signed in as : " + name;                
                //     _saveBtn.removeAttribute('disabled');
                // } else {
                //     _signedInStatus.innerText = "Not signed in";
                //     _saveBtn.setAttribute('disabled', 'disabled');
                // }
            },
            saveTag: function() {
                this.showDialog('loader');
                this.postAttributes();
            },
            getCurrentTags : function() {
                var tagArray = [],
                    tags = document.getElementsByClassName('kp-tag');
                for (var i = 0; i < tags.length; i++) {
                    tagArray.push(tags[i].innerText);
                };
                if(_tagInput.value !== '') {
                    tagArray.push(_tagInput.value);
                }
                return tagArray;
            },
            validateInput: function() {
                var that = this;
                if (that.getCurrentTags().length === 0) {
                    _tagInput.classList.add('emptyError');
                    _tagInput.setAttribute('placeholder', 'Enter a tag name first !');
                    _tagInput.focus();
                    return false;
                } else {
                    return true;
                }
            },
            postAttributes: function() {
                var that = this,
                    attrObj = {
                        'location': window.location.href,
                        'selection': that.selection,
                        'tag': JSON.stringify(that.getCurrentTags()),
                        'user': JSON.stringify(this.auth.user)
                    };

                $.post('/data/keepNote', attrObj, function(res) {
                    if (res && res.success) {
                        that.showDialog('success');
                    } else {
                        that.showDialog('regret');
                    }
                });
            },
            showLoginError: function(error) {
                console.log(error);
            }/*,
            validateUserLogin: function() {
                var that = this;
                if (that.auth.user && that.auth.validateToken(that.auth.token, true)) {
                    _saveBtn.style.display = 'inline-block';
                    _authSaveBtn.style.display = 'none';
                } else {
                    _saveBtn.style.display = 'none';
                    _authSaveBtn.style.display = 'inline-block';
                }
            }*/,
            bindEvents: function() {
                var that = this;
                _keepBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    that.selection = that.getSelectedText();
                    that.showDialog('save', that.selection);
                    that.showOverLay();
                });

                document.addEventListener('mouseup', function(e) {
                    if (that.getSelectedText() !== "" && _keepBtn.style.display === 'none') {
                        that.showKeeperClient(e.clientX, e.clientY);
                    } else {
                        that.hideKeeperClient();
                    }
                })

                _authSaveBtn.addEventListener('click', function() {
                    if (that.validateInput.call(that)) {
                        that.auth.login();
                    }
                });

                _saveBtn.addEventListener('click', function() {
                    if (that.validateInput.call(that)) {
                        that.saveTag.call(that);
                    }
                });

                for (var i = 0; i < _cancelBtn.length; i++) {
                    _cancelBtn[i].addEventListener('click', function() {
                        that.closeDialog.call(that);
                    });
                }
            }
        }
    })()

    var keep = new KeeperClient();
    keep.init();


})();
