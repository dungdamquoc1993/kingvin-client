
var BrowserUtil = require('BrowserUtil');
cc.Class({
    extends: cc.Component,

    properties: {
        username: {
            default: null,
            type: cc.EditBox,
        },
        password: {
            default: null,
            type: cc.EditBox,
        },
        captcha:  cc.EditBox,
		capchaSprite: cc.Sprite,
        checkboxOn: cc.Node,
        checkboxOff: cc.Node
    },
    onLoad: function() {
        var self = this;
        this.editboxs = [this.username, this.password];
        this.editboxs_i = 0;
        this.keyHandle = function(t) {
            return t.keyCode === cc.macro.KEY.tab ? (self.changeNextFocusEditBox(),
                t.preventDefault && t.preventDefault(),
                !1) : t.keyCode === cc.macro.KEY.enter ? (BrowserUtil.focusGame(), self.onLoginClick(),
                t.preventDefault && t.preventDefault(),
                !1) : t.keyCode === cc.macro.KEY.escape ? (cc.RedT.inGame.dialog.onClickBack(),
                t.preventDefault && t.preventDefault(),
                !1) : void 0
        }
        var e = localStorage.getItem("username")
          , i = localStorage.getItem("password");
        e && i && (this.username.string = e,
        this.password.string = i,
        this.checkboxOn.active = !0,
        this.checkboxOff.active = !1)
    },
    onEnable: function () {
        cc.sys.isBrowser && this.addEvent();
        this.node.runAction(cc.RedT.inGame.dialog.actionShow);
    },
    onDisable: function () {
        cc.sys.isBrowser && this.removeEvent();
        this.clean();
        cc.RedT.inGame.dialog.resetSizeDialog(this.node);
    },
    addEvent: function() {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        for (var t in this.editboxs) {
            BrowserUtil.getHTMLElementByEditBox(this.editboxs[t]).addEventListener("keydown", this.keyHandle, !1)
        }
    },
    removeEvent: function() {
        for (var t in this.editboxs) {
            BrowserUtil.getHTMLElementByEditBox(this.editboxs[t]).removeEventListener("keydown", this.keyHandle, !1)
        }
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    },
    onKeyDown: function (event) {

        switch(event.keyCode) {
            case cc.macro.KEY.escape:
                this.isTop() && cc.RedT.inGame.dialog.onClickBack();
                break;
            case cc.macro.KEY.tab:
                this.isTop() && this.changeNextFocusEditBox();
                break;
            case cc.macro.KEY.enter:
                this.isTop() && this.onLoginClick();
        }
    },
    toPassword: function (){
     if (this.password.inputFlag == 5) {
      this.password.inputFlag = 0;
     }
    },
    toNormal: function(){
      if (this.password.inputFlag == 0) {
       this.password.inputFlag = 5;
      }
    },
    changeNextFocusEditBox: function() {
        for (var t = !1, e = 0, i = this.editboxs.length; e < i; e++){
            if (BrowserUtil.checkEditBoxFocus(this.editboxs[e])) {
                BrowserUtil.focusEditBox(this.editboxs[e]);
                t = !0;
                break
            }
        }
        !t && 0 < this.editboxs.length && BrowserUtil.focusEditBox(this.editboxs[0]);
    },
    isTop: function() {
        return !cc.RedT.inGame.notice.node.active && !cc.RedT.inGame.loading.active;
    },
    clean: function(){
        this.username.string = this.captcha.string = this.password.string = '';
        this.captcha.node.active = false;
    },
    onLoginClick: function() {
        var error = null;

        if (this.username.string.length > 32 || this.username.string.length < 3 || this.username.string.match(new RegExp("^[a-zA-Z0-9]+$")) === null)
            error = 'Tên tài khoản không đúng!!';
        else if (this.password.string.length > 32 || this.password.string.length < 6)
            error = 'Mật khẩu không đúng!!';

        if (error) {
            cc.RedT.inGame.notice.show({title:"ĐĂNG NHẬP", text:error});
            return;
        }else{
            if (this.captcha.node.active === true) {
				if (this.captcha.string.length > 6 || this.captcha.string.length < 4){
					cc.RedT.inGame.notice.show({title:"ĐĂNG NHẬP", text:'Captcha không đúng!!'});
				}else{
					cc.RedT.inGame.auth({authentication:{username:this.username.string, password:this.password.string, captcha:this.captcha.string}});
                    this.checkboxOn.active ? (localStorage.setItem("username", this.username.string),
                    localStorage.setItem("password", this.password.string)) : (localStorage.removeItem("username"),
                    localStorage.removeItem("password"));
				}
			}else{
				cc.RedT.inGame.auth({authentication:{username: this.username.string, password: this.password.string}});
                this.checkboxOn.active ? (localStorage.setItem("username", this.username.string),
                localStorage.setItem("password", this.password.string)) : (localStorage.removeItem("username"),
                localStorage.removeItem("password"));
			}
            
        }
        
    },
    initCaptcha: function(t) {
		this.captcha.node.active = true;
		let o = new Image;
		o.src = t;
		o.width = 150;
		o.height = 50;
		setTimeout(function() {
			let t = new cc.Texture2D;
			t.initWithElement(o);
			t.handleLoadedTexture();
			let e = new cc.SpriteFrame(t);
			this.capchaSprite.spriteFrame = e;
		}.bind(this), 10)
	},
	reCaptcha: function(){
		cc.RedT.send({captcha: 'signIn'});
	},
    rememberMe: function() {
        this.checkboxOn.active ? (this.checkboxOff.active = !0,
        this.checkboxOn.active = !1) : (this.checkboxOff.active = !1,
        this.checkboxOn.active = !0)
    }
});
