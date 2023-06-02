var BrowserUtil = require('BrowserUtil');
var helper      = require('Helper');
var cachingSyntax = '';
var cachingTenTK = '';
var cachingSTK = '';

cc.Class({
    extends: cc.Component,

    properties: {
		labelBank:   cc.Label,
		edbBankcode: cc.EditBox,
        BankLabel: cc.RichText,
        NumberLabel: cc.RichText,
		AccnameLabel: cc.RichText,
		MoneyLabel: cc.RichText,
        syntaxLabel: cc.Label,
        moreBank: cc.Node,
        scrollviewBank: {
            default: null,
            type: cc.ScrollView,
        },
        prefab: {
            default: null,
            type: cc.Prefab,
        },
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
		},
		loadList: false,
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
		cc.RedT.send({shop: {info_banking:true}});
		this.onchangeBody(false);
		this.loadList === false && this.getList();
	},
    onDisable: function () {
		cc.sys.isBrowser && this.removeEvent();
		this.clean();
	},
	getList: function(){
		cc.RedT.send({shop: {bank_list:true}});
		//cc.RedT.send({'shop':{'bank_list':true}}}});
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
    toggleMoreBank: function(){
        this.moreBank.active = !this.moreBank.active;
    },
    onData(data) {
        let self = this;
		if (void 0 !== data.banklist) {
			this.onListBank(data.banklist);
		}		
        if(void 0 !== data.nap) {
			this.onchangeBody(true);
            var nap = data.nap;
            this.BankLabel.string = `<color=#FFFFFF>Tên NH:</c> ${nap.bank_name}`;
            this.NumberLabel.string = `<color=#FFFFFF>Số TK:</c> ${nap.bank_number}`;
			this.MoneyLabel.string =`<color=#FFFFFF>Số tiền:</c> ${this.SoTien.string}`;
			this.AccnameLabel.string = `<color=#FFFFFF>Tên TK:</c> ${nap.bank_accname}`;
            this.cachingSyntax = nap.syntax;
            this.syntaxLabel.string = nap.syntax;
			this.cachingTenTK = nap.bank_accname;
			this.cachingSTK = nap.bank_number;
			this.descLabel.string = `Bạn vui lòng chuyển tiền <color=#00ff00>${this.SoTien.string} VNĐ</c> đến NH <color=#00ff00>${nap.bank_name}</c> và STK <color=#00ff00>${nap.bank_number}</c>\nvới nội dung <color=#00ff00>${nap.syntax}</c> để hoàn thành giao dịch`;
        }
		if(void 0 !== data.info) {
			var info = data.info;
			this.bonusLabel.string = `Nạp tiền Ngân Hàng tự động 100%`;
			this.noteLabel.string = `Giao dịch tối thiểu <color=#00ff00>${helper.numberWithCommas(info.min)}</c> tối đa <color=#00ff00>${helper.numberWithCommas(info.max)}</c>`;
			this.bonus = info.bonus;
		}
    },
	onListBank:function(data){
		//console.log("List bank: " + JSON.stringify(data));
		this.loadList = true;
		this['i_arg'] = data.map(function(obj, index){
			let item = cc.instantiate(this.prefab);
			let comp = item.getComponent('NapRed_itemOne');
			comp.init(this, 'i_arg', 'labelBank', 'toggleMoreBank')
			comp.text.string = obj.name;
			this.scrollviewBank.content.addChild(item);
			comp.data = obj;
			return comp;
		}.bind(this));
	},
    backT: function(data){
        this.edbBankcode.string = data.code;
		this.bank = data.code;
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
        if (helper.isEmpty(this.edbBankcode.string)) {
            cc.RedT.inGame.notice.show({title:"NẠP TIỀN", text: "Vui lòng chọn ngân hàng."});
        }else if (helper.isEmpty(this.SoTien.string)) {
			cc.RedT.inGame.notice.show({title: "NẠP TIỀN", text: "Vui lòng nhập số tiền nạp"})
		}else if(helper.isEmpty(this.captcha.string)){
            cc.RedT.inGame.notice.show({title: "NẠP TIỀN", text: "Vui lòng nhập chính xác mã xác nhận"})
		}else{
			cc.RedT.inGame.bgLoading.onData({active: true, text: 'Đang gửi dữ liệu...'});
			cc.RedT.send({shop:{nap_banking:{bank:this.bank, sotien: helper.getOnlyNumberInString(this.SoTien.string), captcha: this.captcha.string}}});
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
		cc.RedT.send({captcha: 'bankingController'});
	},

    onChangerRed: function(value = 0){
        value = helper.numberWithCommas(helper.getOnlyNumberInString(value));
        this.SoTien.string = value == 0 ? "" : value;

        var valueT = helper.getOnlyNumberInString(value);
		this.rednhan.string = helper.numberWithCommas(Math.floor((valueT*1)+(valueT*this.bonus/100)*1))
    },

    onCoppySyntax: function(){
        const el = document.createElement('textarea');
        el.value = this.cachingSyntax;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
    },
	onCoppyTenTK: function(){
        const el = document.createElement('textarea');
        el.value = this.cachingTenTK;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
    },
    onCoppySTK: function(){

        const el = document.createElement('textarea');
        el.value = this.cachingSTK;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
    },
});
