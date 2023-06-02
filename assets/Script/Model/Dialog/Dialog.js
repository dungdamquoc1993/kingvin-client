
var signIn = require('SignIn'),
	signUp = require('SignUp'),
	forGotPass = require('ForGotPass'),
	signName = require('SignName'),
	shop = require('Shop'),
	DaiLy = require('DaiLy'),
	SieuZon = require('SieuZon'),
	//PhuHo = require('TopPhuHo'),
	profile = require('Profile'),
	lichsu = require('LichSu'),
	Settings = require('Settings'),
	the_cao = require('TheCao'),
	GiftCode = require('GiftCode'),
	DEvent = require('DEvent'),
	PokerNap = require('PokerNap'),
	NhiemVu = require('NhiemVu'),
	BonusNap = require('BonusNap'),
	iMessage = require('iMessage');

cc.Class({
	extends: cc.Component,
	properties: {
		bgShow: cc.Node,
		signIn: signIn,
		signUp: signUp,
		ForGotPass: forGotPass,
		signName: signName,
		shop: shop,
		DaiLy: DaiLy,
		profile: profile,
		lichsu: lichsu,
		the_cao: the_cao,
		SieuZon: SieuZon,
		//PhuHo: PhuHo,
		QuangCao: cc.Node,
		NhiemVu: NhiemVu,
		BonusNap: BonusNap,
		settings: Settings,
		GiftCode: GiftCode,
		DEvent: DEvent,
		PokerNap: PokerNap,
		iMessage: iMessage,
	},
	init: function () {
		this.actionShow = cc.spawn(cc.scaleTo(0.5, 1).easing(cc.easeBackOut(2.5)), cc.fadeTo(0.5, 255));
		this.objShow = null;
		this.objTmp = null;
		this.shop.init();
		this.DaiLy.init();
		this.profile.init();
		//this.lichsu.init();
		this.the_cao.init();
		this.bgShow.active = true;
	},

	onClickBack: function () {
		cc.RedT.audio.playUnClick();
		this.onBack();
	},
	onBack: function () {
		this.bgShow.active = false;
		if (this.objShow != null) {
			if (void 0 == this.objShow.previous || null == this.objShow.previous) {
				this.objShow.active = false;
				this.node.active = false;
				this.objShow = null;
			} else {
				this.objTmp = this.objShow;
				this.objShow = this.objShow.previous;
				this.objTmp.previous = null;
				this.objTmp.active = false;
				this.objShow.active = true;
				this.objTmp = null;
			}
		} else {
			this.node.active = false;
		}
	},
	onClosePrevious: function (obj) {
		this.bgShow.active = false;
		if (void 0 !== obj.previous && null !== obj.previous) {
			this.onClosePrevious(obj.previous);
			delete obj.previous;
			//obj.previous = null;
		}
		obj.active = false;
	},
	onCloseDialog: function () {
		this.bgShow.active = false;
		if (this.objShow != null) {
			if (void 0 == this.objShow.previous || null == this.objShow.previous) {
				this.objShow.active = this.node.active = false;
				this.objShow = null;
			} else {
				this.onClosePrevious(this.objShow.previous);
				this.objShow.active = this.node.active = false;
				delete this.objShow.previous;
				//this.objShow.previous        = null;
				this.objShow = null;
			}
		} else {
			this.node.active = false
		}
	},

	resetSizeDialog: function (node) {
		node.stopAllActions();
		node.scale = 0.5;
		node.opacity = 0;
	},

	/**
	 * Function Show Dialog
	*/
	showSignIn: function () {
		this.bgShow.active = true;
		this.node.active = this.signIn.node.active = true;
		this.objShow = this.signIn.node;
	},
	showSignUp: function () {
		this.bgShow.active = true;
		this.node.active = this.signUp.node.active = true;
		this.objShow = this.signUp.node;
	},
	showForGotPass: function () {
		this.bgShow.active = true;
		this.objShow.active = false;
		this.ForGotPass.node.previous = this.objShow;
		this.node.active = this.ForGotPass.node.active = true;
		this.objShow = this.ForGotPass.node;
	},
	showSignName: function () {
		this.bgShow.active = true;
		this.node.active = this.signName.node.active = true;
		this.signUp.node.active = this.signIn.node.active = false;
		this.objShow = this.signName.node;
	},
	showShop: function (event, name) {
		if (cc.RedT.IS_LOGIN) {
			this.bgShow.active = true;
			this.node.active = this.shop.node.active = true;
			this.objShow = this.shop.node;
			this.shop.superView(name);
		} else {
			this.showSignIn();
		}
	},
	showDaiLy: function () {
		if (cc.RedT.IS_LOGIN) {
			var self = this;
			this.bgShow.active = true;
			if(this.DaiLy != null) {
				this.node.active = this.DaiLy.node.active = true;
				this.objShow = this.DaiLy.node;
				return;
			}
		} else {
			this.showSignIn();
		}
	},
	showProfile: function (event, name) {
		this.bgShow.active = true;
		this.node.active = this.profile.node.active = true;
		this.objShow = this.profile.node;
		this.profile.superView(name);
	},
	showSetting: function (event) {
		this.bgShow.active = true;
		this.node.active = this.settings.node.active = true;
		this.objShow = this.settings.node;
	},
	showHistory: function (event) {
		cc.RedT.inGame.dialog.onClickBack();
		this.bgShow.active = true;
		this.node.active = this.lichsu.node.active = true;
		this.objShow = this.lichsu.node;
	},
	showGiftCode: function (event) {
		this.bgShow.active = true;
		if (cc.RedT.IS_LOGIN) {
			this.node.active = this.GiftCode.node.active = true;
			this.objShow = this.GiftCode.node;
		} else {
			this.showSignIn();
		}
	},
	showDEvent: function (event) {
		this.bgShow.active = true;
		if (cc.RedT.IS_LOGIN) {
			this.node.active = this.DEvent.node.active = true;
			this.objShow = this.DEvent.node;
		} else {
			this.showSignIn();
		}
	},
	showPokerNap: function (obj) {
		this.bgShow.active = true;
		this.node.active = this.PokerNap.node.active = true;
		this.objShow = this.PokerNap.node;
		this.PokerNap.init(obj);
	},
	showiMessage: function (obj) {
		this.bgShow.active = true;
		this.node.active = this.iMessage.node.active = true;
		this.objShow = this.iMessage.node;
	},
	showSieuZon: function (obj) {
		this.bgShow.active = true;
		this.node.active = this.SieuZon.node.active = true;
		this.objShow = this.SieuZon.node;
	},
	/*showPhuHo: function (obj) {
		this.bgShow.active = true;
		this.node.active = this.PhuHo.node.active = true;
		this.objShow = this.PhuHo.node;
	},*/
	showBonusNap: function (obj) {
		this.bgShow.active = true;
		if (cc.RedT.IS_LOGIN) {
			this.node.active = this.BonusNap.node.active = true;
			this.objShow = this.BonusNap.node;
			this.BonusNap.init(obj);
		} else {
			this.showSignIn();
		}
	},
	/*showQuangCao: function (obj) {
		this.bgShow.active = true;
		if (cc.RedT.IS_LOGIN) {
			this.node.active = this.QuangCao.active = true;
			this.objShow = this.QuangCao;
		} else {
			this.showSignIn();
		}
	},*/
	ShowNhiemVu: function (obj) {
		this.bgShow.active = true;
		if (cc.RedT.IS_LOGIN) {
			this.node.active = this.NhiemVu.node.active = true;
			this.objShow = this.NhiemVu.node;
			this.NhiemVu.init(obj);
		} else {
			this.showSignIn();
		}
	},
});
