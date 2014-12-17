var KeeperClient = function() {

}

KeeperClient.prototype = (function() {
    var _wrapper,
        _keepBtn,
        _dialog,
        _overlay,
        _saveBtn,
        _cancelBtn;

    return {
        init: function() {
            _wrapper = document.getElementById('kp-wrapper');

            _keepBtn = document.getElementById('kp-btn');

            _dialog = document.getElementById('kp-dialog');

            _overlay = document.getElementById('kp-overlay');

            _saveBtn = document.getElementById('kp-saveTag');

            _authSaveBtn = document.getElementById('kp-authSaveTag');

            _cancelBtn = document.getElementsByClassName('kp-cancel'),

            _tagInput = document.getElementById('kp-tagName');

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
                case 'save' :
                    var words = selection.split(' '),
                        displayText,
                        selectionPara = document.getElementById('kp-selection');

                    _tagInput.value = '';
                    _tagInput.setAttribute('placeholder', 'Your tag name goes here');

                    if (words.length > 3) {
                        displayText = '"' + words[0] + ' ' + words[1] + ' ....' + words[words.length - 1] + '"';
                    } else {
                        displayText = '"' + selection + '"';
                    }

                    selectionPara.setAttribute('title', selection);
                    selectionPara.innerHTML = displayText;

                    if(that.auth.user) {
                        _saveBtn.style.display = 'inline-block';
                        _authSaveBtn.style.display = 'none';
                    } else {
                        _saveBtn.style.display = 'none';
                        _authSaveBtn.style.display = 'inline-block';
                    }
                    saveDialog.style.display = 'block';
                    _tagInput.focus();
                    break;
            	case 'loader' :
                    loaderDialog.style.display = 'block';
                    break;
                case 'success' :
                    successDialog.style.display = 'block';
                    break;
                case 'regret' :
                    regretDialog.style.display = 'block';
                    break;
            }
        },
        closeDialog : function() {
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
        saveTag: function() {
            var that = this;

            that.tagName = _tagInput.value;
            that.showDialog('loader');
            that.postAttributes();
        },
        validateInput : function() {
            if(_tagInput.value === '') {
                _tagInput.classList.add('emptyError');
                _tagInput.setAttribute('placeholder', 'Enter a tag name first !');
                _tagInput.focus();
                return false;
            } else {
                return true;
            }
        },
        postAttributes : function () {
            var that = this,
                attrObj = {
                    'location' : window.location.href,
                    'selection' : that.selection,
                    'tag' : that.tagName,
                    'user' : JSON.stringify(this.auth.user)
                };

          $.post('/data/keepNote',attrObj,function (res){
            if(res && res.success) {
              that.showDialog('success');
            } else {
              that.showDialog('regret');
            }
          });          
        },
        showLogin : function() {

        },
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
                if(that.validateInput.call(that)) {
                    that.auth.login();
                }
            });

            _saveBtn.addEventListener('click', function() {
                if(that.validateInput.call(that)) {
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
