var BrowserUtil = require('BrowserUtil');
var helper      = require('Helper');
var cachingSyntax = '';

cc.Class({
    extends: cc.Component,

    properties: {
        phoneLabel: cc.Label,
        nameLabel: cc.Label,
        syntaxLabel: cc.Label,
        descLabel: {
			default: null,
			type: cc.RichText,
		},
        SoTien: {
			default: null,
			type: cc.EditBox,
		},
        captcha: {
			default: null,
			type: cc.EditBox,
		},
		bonusLabel: cc.Label,
		body: cc.Node,
		body1: cc.Node,
        rednhan: cc.Label,
		capchaSprite: cc.Sprite,
		bonus: 0,
        noteLabel: {
			default: null,
			type: cc.RichText,
		}
    },

    init() {
        var self = this;
		this.editboxs = [this.SoTien, this.captcha];
		this.keyHandle = function(t) {
			return t.keyCode === cc.macro.KEY.tab ? (self.isTop() && self.changeNextFocusEditBox(),
				t.preventDefault && t.preventDefault(),
				!1) : t.keyCode === cc.macro.KEY.enter ? (BrowserUtil.focusGame(), self.onNextClick(),
				t.preventDefault && t.preventDefault(),
				!1) : void 0
		}
    },
    onEnable: function () {
		cc.sys.isBrowser && this.addEvent();
		this.reCaptcha();
		cc.RedT.send({shop: {info_momo:true}});
		this.onchangeBody(false);
	},
    onDisable: function () {
		cc.sys.isBrowser && this.removeEvent();
		this.clean();
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
			case cc.macro.KEY.tab:
				this.isTop() && this.changeNextFocusEditBox();
				break;
			case cc.macro.KEY.enter:
				this.isTop() && this.onNextClick();
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
		this.SoTien.string = this.rednhan.string = this.captcha.string = "";
	},

    onData(data) {
        
        if(void 0 !== data.nap) {
			this.onchangeBody(true);

            var nap = data.nap;


            this.phoneLabel.string = nap.phone;
            this.nameLabel.string = nap.name;

            this.cachingSyntax = nap.syntax;
            this.syntaxLabel.string = nap.syntax;
            

			this.descLabel.string = `Bạn vui lòng chuyển tiền <color=#00ff00>${this.SoTien.string} VNĐ</c> đến tài khoản nhận tiền Momo trên\nvới nội dung <color=#00ff00>${nap.syntax}</c> để hoàn thành giao dịch`;
        }
		if(void 0 !== data.info) {
			var info = data.info;
			this.bonusLabel.string = `Nạp tiền ví momo khuyến mại ${info.bonus}% tiền nạp`;
			this.noteLabel.string = `Giao dịch tối thiểu <color=#00ff00>${helper.numberWithCommas(info.min)}</c> tối đa <color=#00ff00>${helper.numberWithCommas(info.max)}</c>`;
			this.bonus = info.bonus;
		}
    },

	onchangeBody: function(bool){
		if (bool) {
			this.body.active = true;
			this.body1.active = false;
		}else{
			this.body.active = false;
			this.body1.active = true;
		}
	},

    onNextClick: function(){
    	if (helper.isEmpty(this.SoTien.string)) {
			cc.RedT.inGame.notice.show({title: "NẠP XU", text: "Vui lòng nhập đầy đủ thông tin"})
		}else if(helper.isEmpty(this.captcha.string)){
            cc.RedT.inGame.notice.show({title: "NẠP XU", text: "Vui lòng nhập chính xác mã xác nhận"})
		}else{
			cc.RedT.inGame.bgLoading.onData({active: true, text: 'Đang gửi dữ liệu...'});
			cc.RedT.send({shop:{nap_momo:{sotien: helper.getOnlyNumberInString(this.SoTien.string), captcha: this.captcha.string}}});
		} 
    },

    initCaptcha: function(t) {
		var i = this
		  , o = new Image;
		o.src = t,
		o.width = 150,
		o.height = 50,
		setTimeout(function() {
			var t = new cc.Texture2D;
			t.initWithElement(o),
			t.handleLoadedTexture();
			var e = new cc.SpriteFrame(t);
			i.capchaSprite.spriteFrame = e
		}, 10)
	},

    reCaptcha: function(){
		cc.RedT.send({captcha: 'momoController'});
	},

    onChangerRed: function(value = 0){
        value = helper.numberWithCommas(helper.getOnlyNumberInString(value));
        this.SoTien.string = value == 0 ? "" : value;

        var valueT = helper.getOnlyNumberInString(value);
		this.rednhan.string = helper.numberWithCommas(Math.floor((valueT*1)+(valueT*this.bonus/100)*1))
    },

    onCoppySyntax: function(){
		if (cc.sys.isBrowser) {
			const el = document.createElement('textarea');
			el.value = this.cachingSyntax;
			document.body.appendChild(el);
			el.select();
			document.execCommand('copy');
			document.body.removeChild(el);
		}
		else{
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "JavaCopy", "(Ljava/lang/String;)V", this.cachingSyntax);
        }
    },
    onCoppyPhoneNum: function(){
		if (cc.sys.isBrowser) {
			const el = document.createElement('textarea');
			el.value = this.phoneLabel.string;
			document.body.appendChild(el);
			el.select();
			document.execCommand('copy');
			document.body.removeChild(el);
		}
		else{
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "JavaCopy", "(Ljava/lang/String;)V", this.phoneLabel.string);
        }
    },
});
