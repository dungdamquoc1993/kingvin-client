//rik.fan - chia sẻ học hỏi
var helper = require('Helper');

var baseControll = require('BaseControll');

var header = require('Header'),
	dialog = require('Dialog'),
	ThongBaoNoHu = require('PushNohu'),
	newsContents = require('NewsContents'),
	bgLoading = require('bgLoading'),
	MenuRoom = require('MenuRoom'),
	notice = require('Notice');
var MainGame = cc.Class({
	extends: cc.Component,
	statics: {
		scope: null,
	},
	properties: {
		MenuRoom: MenuRoom,
		PrefabT: {
			default: [],
			type: cc.Prefab
		},
		prefabDaiLy: {
			default: null,
			type: cc.Prefab,
		},
		Avatars: [cc.SpriteFrame],
		listHoiVien: cc.Node,
		header: header,
		news: cc.Node,
		newsContents: newsContents,
		bgLoading: bgLoading,
		iconVQRed: cc.Node,
		iconCandy: cc.Node,
		iconLongLan: cc.Node,
		iconZeus: cc.Node,
		iconTamHung: cc.Node,
		iconTaiXiu: cc.Node,
		redhat: cc.Node,
		dialog: dialog,
		loading: cc.Node,
		SieuZon: cc.Node,
		ScoreSieuZon: cc.Label,
		notice: notice,
		ThongBaoNoHu: ThongBaoNoHu,

		audioBG: cc.AudioSource,
		
		url: cc.String,
		appApk: cc.String,
		wssCacert: {
			type: cc.Asset,
			default: null
		},
		arr_sound_bg: {
			default: [],
			type: [cc.AudioClip]
		},
		PanelSupport: {
			type: cc.Node,
			default: null,
		},
		animate: false,
	},
	arr_Time_Sound: null,
	timeout_Play_Sound: null,

	onLoad: function () {
		MainGame.scope = this;
		// Play sound background
		this.arr_Time_Sound = [330, 280, 250, 300, 220];  // second : da them vai s de chac chan la phat xong
		this.dialog.init();
		this.newsContents.init(this);
		this.PanelSupporttoggle();	
		//this.playMusic();
		document.cookie = "redT=1702;path=/";
		if (void 0 === cc.RedT) {
			cc.RedT = baseControll;
			cc.RedT.sslPem = this.wssCacert;
			cc.RedT.init();
		}
		if(cc.RedT.audio == null){
			var audio = cc.instantiate(this.PrefabT[0]);
			cc.game.addPersistRootNode(audio);
			cc.RedT.audio = audio.getComponent("MainAudio");
		}
		// Connect Server
		cc.RedT.reconnect();
		cc.RedT.inGame = this;
		cc.RedT.Avatars = this.Avatars;

		var MiniPanel = cc.instantiate(this.PrefabT[1]);
		cc.RedT.MiniPanel = MiniPanel.getComponent('MiniPanel');
		this.redhat.insertChild(MiniPanel);

		
		Promise.all(this.listHoiVien.children.map(function(obj){
			return obj.getComponent('TopPhuHo_item');
		}))
		.then(item => {
			this.listHoiVien = item;
		})
		
		this.iconCandy = this.iconCandy.getComponent('iconGameHu');
		this.iconVQRed = this.iconVQRed.getComponent('iconGameHu');
		this.iconLongLan = this.iconLongLan.getComponent('iconGameHu');
		this.iconZeus = this.iconZeus.getComponent('iconGameHu');
		this.iconTamHung = this.iconTamHung.getComponent('iconGameHu');
		this.iconTaiXiu = this.iconTaiXiu.getComponent('iconGameTaiXiu');

		
		if (cc.RedT.IS_LOGIN) {
			cc.RedT.send({ scene: "home" });
			this.header.reset();
			this.header.userName.string = cc.RedT.user.name;
			//this.ScoreSieuZon.string = data.profile.level.score;
			this.dialog.profile.CaNhan.username.string = cc.RedT.user.name;
			this.header.userRed.string = this.dialog.profile.KetSat.redHT.string = helper.numberWithCommas(cc.RedT.user.red);
			this.dialog.profile.KetSat.redKet.string = helper.numberWithCommas(cc.RedT.user.ketSat);
			this.dialog.profile.CaNhan.UID.string = cc.RedT.user.UID;
			this.dialog.profile.CaNhan.phone.string = cc.RedT.user.phone;
			this.dialog.profile.CaNhan.joinedOn.string = helper.getStringDateByTime(cc.RedT.user.joinedOn);
			this.setAvatar(cc.RedT.user.avatar);
		} else {
			this.dialog.settings.setMusic();
		}
		var check = localStorage.getItem('SOUND_BACKGROUND');

		if (check != null) {
		 	if (check == 'true' || cc.RedT.isSoundBackground()) {
		 		cc.RedT.setSoundBackground(true);
		 		this.playMusic();
			}
		} else {
		 	cc.RedT.setSoundBackground(true);
		 	this.playMusic();
		}

		this.isAudio =  true;
		if(cc.RedT.isSoundBackground()){
            cc.RedT.setSoundBackground(true);
            this.playMusic();
        }
	},

	playSoundBG() {
		var index = MainGame.scope.randomBetween(0, 4);
		cc.audioEngine.playMusic(MainGame.scope.arr_sound_bg[index], false);
		clearTimeout(MainGame.scope.timeout_Play_Sound);
		MainGame.scope.timeout_Play_Sound = setTimeout(function () {
			MainGame.scope.playSoundBG();
		}, MainGame.scope.arr_Time_Sound[index] * 1000);
	},
	
	autoAuth: function(obj) {
		this.loading.active = true;
		if (cc.RedT._socket == null || cc.RedT._socket.readyState != 1) {
			setTimeout(function(){
				cc.RedT.send(obj);
			}, 300);
		}else{
			cc.RedT.send(obj)
		}
	},
	resetAuth: function() {
		localStorage.removeItem('TH');
		localStorage.removeItem('HT');
	},

	auth: function (obj) {
		var self = this;
		this.loading.active = true;
		if (cc.RedT._socket == null || cc.RedT._socket.readyState != 1) {
			setTimeout(function () {
				cc.RedT.send(obj);
			}, 300);
		} else {
			cc.RedT.send(obj)
		}
	},
	unAuthorized: function (data) {
		this.loading.active = false;
		cc.RedT.inGame.resetAuth();
		if (void 0 !== data["message"]) {
			this.notice.show({ title: 'ĐĂNG KÝ', text: 'Có lỗi xảy ra, xin vui lòng thử lại...' });
		} else {
			this.notice.show(data);
		}
	},
	Authorized: function (Authorized) {
		this.loading.active = false;
		if (!Authorized) {
			this.dialog.showSignName();
		} else {
			this.signIn();
		}
	},
	onData: function (data) {
		if (void 0 !== data["unauth"]) {
			this.unAuthorized(data["unauth"]);
		}
		if (void 0 !== data.Authorized) {
			this.Authorized(data.Authorized);
		}
		if (void 0 !== data.user) {
			this.dataUser(data.user);
			cc.RedT.userData(data.user);
			if (!!data.user.mission) {
				this.dialog.BonusNap.onNhiemVu(data.user.mission);
				this.dialog.showBonusNap();
				this.loading.active = false;
			}

			if (!!data.user.top) {
				Promise.all(this.listHoiVien.map(function(obj, i){
					var dataT = data.user.top.user.top[i];
					if (!!dataT) {
						obj.node.active = true;
						obj.Avatar.spriteFrame  = cc.RedT.Avatars[dataT.Avatar>>0];
						obj.NickName.string  = dataT.Name;
					}else{
						obj.node.active = false;
					}
				}))
			}
		}
		if (void 0 !== data.mini) {
			cc.RedT.MiniPanel.onData(data.mini);
		}
		if (void 0 !== data.TopHu) {
			cc.RedT.MiniPanel.TopHu.onData(data.TopHu);
			this.dialog.DEvent.onHU(data.TopHu);
		}
		if (void 0 !== data.taixiu) {
			cc.RedT.MiniPanel.TaiXiu.TX_Main.onData(data.taixiu);
		}
		if (void 0 !== data.shop) {
			this.dialog.shop.onData(data.shop);
		}
		if (void 0 !== data.profile) {
			this.dialog.profile.onData(data.profile);
			//this.ScoreSieuZon.string = data.profile.level.score;
		}
		if (void 0 !== data.notice) {
			this.notice.show(data.notice);
		}
		if (void 0 !== data.news) {
			this.newsContents.onData(data.news);
		}
		if (void 0 !== data.captcha) {
			this.captcha(data.captcha);
		}
		if (void 0 !== data.pushnohu) {
			this.ThongBaoNoHu.onData(data.pushnohu);
		}
		if (void 0 !== data.loading) {
			this.bgLoading.onData(data.loading);
		}
		if (void 0 !== data.event) {
			this.dialog.DEvent.onData(data.event);
		}
		if (!!data.toGame) {
			this.MenuRoom.onData(data.toGame);
		}
		if (!!data.message) {
			this.dialog.iMessage.onData(data.message);
		}
		if (!!data.sieuzon) {
			this.dialog.SieuZon.onData(data.sieuzon);
			this.dialog.showSieuZon();
			this.loading.active = false;
		}
		/*
		if (!!data.phuho) {
			this.dialog.PhuHo.onData(data.phuho);
			this.dialog.showPhuHo();
			this.loading.active = false;
		}
		*/
		if (void 0 !== data.nhiemvu) {
			this.dialog.NhiemVu.onNhiemVu(data.nhiemvu);
			this.dialog.ShowNhiemVu();
			this.loading.active = false;
		}
		if (void 0 !== data.shop){
			//console.log(data.shop);
			var self  = this;
			if (!!data.shop.daily) {
				this.dialog.DaiLy.onDaiLy(data.shop.daily)
			
			Promise.all(data.shop.daily.map(function(daily, index){
				var item = cc.instantiate(self.prefabDaiLy);
				var component = item.getComponent('ChuyenRed_daily');
				component.init(self, daily, index);
				return component;
			}))
			.then(result => {
				cc.RedT.daily_list = result;
			})
			}
			
		}
	},
	captcha: function (data) {
		switch (data.name) {
			case "signIn":
				this.dialog.signIn.initCaptcha(data.data);
				break;

			case "signUp":
				this.dialog.signUp.initCaptcha(data.data);
				break;

			case "giftcode":
				this.dialog.GiftCode.initCaptcha(data.data);
				break;

			case "forgotpass":
				this.dialog.ForGotPass.initCaptcha(data.data);
				break;

			case "chargeCard":
				this.dialog.shop.NapRed.initCaptcha(data.data);
				break;

			case "withdrawXu":
				this.dialog.shop.TieuRed.MuaXu.initCaptcha(data.data);
				break;

			case "momoController":
				this.dialog.shop.Momo.initCaptcha(data.data);
				break;
			case "bankingController":
				this.dialog.shop.Banking.initCaptcha(data.data);
				break;
		}
	},
	setAvatar: function(data){
		data = data>>0;
		if (cc.RedT.Avatars[data] !== void 0) {
			this.header.avatar.spriteFrame = cc.RedT.Avatars[data];
			this.dialog.profile.CaNhan.avatar.spriteFrame = cc.RedT.Avatars[data];
		}else{
			this.header.avatar.spriteFrame = cc.RedT.Avatars[0];
			this.dialog.profile.CaNhan.avatar.spriteFrame = cc.RedT.Avatars[0];
		}
	},

    show: function() {
        if (this.animate) return;
        this.animate = true;
        this.PanelSupport.stopAllActions();
        this.PanelSupport.active = true;
        this.PanelSupport.scaleY = 0;
        this.PanelSupport.runAction(cc.sequence(
            cc.scaleTo(0.2, 1).easing(cc.easeBackOut()),
            cc.callFunc(() => {
                this.animate = false;
            })
        ));
    },

    dismiss: function() {
        if (this.animate) return;
        this.animate = true;
        this.PanelSupport.stopAllActions();
        this.PanelSupport.runAction(cc.sequence(
            cc.scaleTo(0.2, 1, 0).easing(cc.easeBackIn()),
            cc.callFunc(() => {
                this.PanelSupport.active = false;
                this.animate = false;
            })
        ));
    },
    PanelSupporttoggle: function() {
        if (this.PanelSupport.active) {
            this.dismiss();
        } else {
            this.show();
        }
    },	
	onClickSieuZon: function() {
		if (cc.RedT.IS_LOGIN) {
			this.loading.active = true;
			cc.RedT.send({sieuzon: {data: "Show"}})
		} else {
			this.dialog.showSignIn();
		}
        
	},
	onClickPhuHo: function() {
		if (cc.RedT.IS_LOGIN) {
			this.loading.active = true;
			cc.RedT.send({phuho: {data: "Show"}})
		} else {
			this.dialog.showSignIn();
		}
        
	},
	onClickMission: function() {
		if (cc.RedT.IS_LOGIN) {
			this.loading.active = true;
			cc.RedT.send({user:{mission: {getdata: true }}});
		} else {
			this.dialog.showSignIn();
		}
        
	},
	onClickNhiemVu: function() {
		if (cc.RedT.IS_LOGIN) {
			this.loading.active = true;
			cc.RedT.send({nhiemvu:100});
		} else {
			this.dialog.showSignIn();
		}
        
    },
	dataUser: function (data) {
		
		
		if (void 0 !== data.avatar){
			this.setAvatar(data.avatar);
		}
		if (void 0 !== data.name) {
			this.header.userName.string = data.name;
			this.dialog.profile.CaNhan.username.string = data.name;
		}
		if (void 0 !== data.red) {
			if(cc.RedT.setting.taixiu.isNan){
			var seq =	cc.sequence(cc.delayTime(15), cc.callFunc(() => {
					this.header.userRed.string = this.dialog.profile.KetSat.redHT.string = helper.numberWithCommas(data.red);
				}));
				this.node.runAction(seq);
		}else{
			this.header.userRed.string = this.dialog.profile.KetSat.redHT.string = helper.numberWithCommas(data.red);
		}
		}
		if (void 0 !== data.xu) {
			//this.header.userXu.string = helper.numberWithCommas(data.xu);
		}
		if (void 0 !== data.ketSat) {
			this.dialog.profile.KetSat.redKet.string = helper.numberWithCommas(data.ketSat);
		}
		if (void 0 !== data.UID) {
			this.dialog.profile.CaNhan.UID.string = data.UID;
		}
		if (void 0 !== data.phone) {
			this.dialog.profile.CaNhan.phone.string = data.phone;
			this.dialog.profile.BaoMat.DangKyOTP.statusOTP(!helper.isEmpty(data.phone));
			if (!helper.isEmpty(data.phone)) {
				this.dialog.profile.BaoMat.DangKyOTP.labelPhone.string = data.phone;
				this.dialog.profile.BaoMat.DangKyOTP.labelPhone2.string = data.phone;
				//cc.sys.localStorage.setItem('infoRed8', JSON.stringify(data));
			}
		}
		if (void 0 !== data.joinedOn) {
			this.dialog.profile.CaNhan.joinedOn.string = helper.getStringDateByTime(data.joinedOn);
		}
		if (void 0 !== data.level) {
			if (data.level.score) {
				this.ScoreSieuZon.string = data.level.score;
			}
			this.header.level(data.level);
			this.header.updateEXP(data.vipHT, data.vipNext);
		}
	},
	signOut: function () {
		cc.RedT.user = {};
		cc.RedT.IS_LOGIN = false;
		this.AllReset();
		cc.sys.localStorage.removeItem("infoRed8");
	},
	signIn: function () {
		cc.RedT.IS_LOGIN = true;
		this.header.isSignIn();
		this.dialog.onBack();
		cc.RedT.MiniPanel.signIn();
		//this.dialog.showQuangCao();
	},
	AllReset: function () {
		this.loading.active = false;
		this.newsContents.reset();
		this.header.isSignOut();
		this.dialog.onCloseDialog();
		this.MenuRoom.onBack();
		cc.RedT.MiniPanel.newGame();
		this.dialog.iMessage.reset();
	},
	noticeCopy: function(){
		let notice = cc.instantiate(cc.RedT.MiniPanel.prefabMiniNotice);
		let noticeComponent = notice.getComponent('mini_warning');
		noticeComponent.text.string = 'Đã copy nội dung được chọn';
		this.node.addChild(notice);
	},
	onGetTaiXiu: function (tai, xiu) {
		// var sTai = helper.getOnlyNumberInString(this.iconTaiXiu.tai.string);
		// var sXiu = helper.getOnlyNumberInString(this.iconTaiXiu.xiu.string);
		// if (sTai - tai != 0) {
		// 	helper.numberTo(this.iconTaiXiu.tai, sTai, tai, 1000, true);
		// }
		// if (sXiu - xiu != 0) {
		// 	helper.numberTo(this.iconTaiXiu.xiu, sXiu, xiu, 1000, true);
		// }
	},
	onGetHu: function () {
		if (void 0 !== cc.RedT.setting.topHu.data) {
			var self = this;
			// Vương Quốc Red
			Promise.all(cc.RedT.setting.topHu.data['vq_red'].filter(function (temp) {
				return temp.red == true;
			}))
				.then(result => {
					let h100 = result.filter(function (temp) { return temp.type == 100 });
					let h1k = result.filter(function (temp) { return temp.type == 1000 });
					let h10k = result.filter(function (temp) { return temp.type == 10000 });

					let r100 = helper.getOnlyNumberInString(this.iconVQRed.hu100.string);
					let r1k = helper.getOnlyNumberInString(this.iconVQRed.hu1k.string);
					let r10k = helper.getOnlyNumberInString(this.iconVQRed.hu10k.string);

					if (r100 - h100[0].bet != 0) {
						helper.numberTo(this.iconVQRed.hu100, helper.getOnlyNumberInString(this.iconVQRed.hu100.string), h100[0].bet, 4900, true);
					}
					if (r1k - h1k[0].bet != 0) {
						helper.numberTo(this.iconVQRed.hu1k, helper.getOnlyNumberInString(this.iconVQRed.hu1k.string), h1k[0].bet, 4900, true);
					}
					if (r10k - h10k[0].bet != 0) {
						helper.numberTo(this.iconVQRed.hu10k, helper.getOnlyNumberInString(this.iconVQRed.hu10k.string), h10k[0].bet, 4900, true);
					}
				});

			// Candy
			Promise.all(cc.RedT.setting.topHu.data['candy'].filter(function (temp) {
				return temp.red == true;
			}))
				.then(result => {
					let h100 = result.filter(function (temp) { return temp.type == 100 });
					let h1k = result.filter(function (temp) { return temp.type == 1000 });
					let h10k = result.filter(function (temp) { return temp.type == 10000 });

					let r100 = helper.getOnlyNumberInString(this.iconCandy.hu100.string);
					let r1k = helper.getOnlyNumberInString(this.iconCandy.hu1k.string);
					let r10k = helper.getOnlyNumberInString(this.iconCandy.hu10k.string);

					if (r100 - h100[0].bet != 0) {
						helper.numberTo(this.iconCandy.hu100, helper.getOnlyNumberInString(this.iconCandy.hu100.string), h100[0].bet, 4900, true);
					}
					if (r1k - h1k[0].bet != 0) {
						helper.numberTo(this.iconCandy.hu1k, helper.getOnlyNumberInString(this.iconCandy.hu1k.string), h1k[0].bet, 4900, true);
					}
					if (r10k - h10k[0].bet != 0) {
						helper.numberTo(this.iconCandy.hu10k, helper.getOnlyNumberInString(this.iconCandy.hu10k.string), h10k[0].bet, 4900, true);
					}
				});

				//Tam Hung
				Promise.all(cc.RedT.setting.topHu.data['tamhung'].filter(function (temp) {
					return temp.red == true;
				}))
					.then(result => {
						let h100 = result.filter(function (temp) { return temp.type == 100 });
						let h1k = result.filter(function (temp) { return temp.type == 1000 });
						let h10k = result.filter(function (temp) { return temp.type == 10000 });

						let r100 = helper.getOnlyNumberInString(this.iconTamHung.hu100.string);
						let r1k = helper.getOnlyNumberInString(this.iconTamHung.hu1k.string);
						let r10k = helper.getOnlyNumberInString(this.iconTamHung.hu10k.string);

						if (r100 - h100[0].bet != 0) {
							helper.numberTo(this.iconTamHung.hu100, helper.getOnlyNumberInString(this.iconTamHung.hu100.string), h100[0].bet, 4900, true);
						}
						if (r1k - h1k[0].bet != 0) {
							helper.numberTo(this.iconTamHung.hu1k, helper.getOnlyNumberInString(this.iconTamHung.hu1k.string), h1k[0].bet, 4900, true);
						}
						if (r10k - h10k[0].bet != 0) {
							helper.numberTo(this.iconTamHung.hu10k, helper.getOnlyNumberInString(this.iconTamHung.hu10k.string), h10k[0].bet, 4900, true);
						}
					});
			//Zeus
			Promise.all(cc.RedT.setting.topHu.data['zeus'].filter(function (temp) {
				return temp.red == true;
			}))
				.then(result => {
					let h100 = result.filter(function (temp) { return temp.type == 100 });
					let h1k = result.filter(function (temp) { return temp.type == 1000 });
					let h10k = result.filter(function (temp) { return temp.type == 10000 });

					let r100 = helper.getOnlyNumberInString(this.iconZeus.hu100.string);
					let r1k = helper.getOnlyNumberInString(this.iconZeus.hu1k.string);
					let r10k = helper.getOnlyNumberInString(this.iconZeus.hu10k.string);

					if (r100 - h100[0].bet != 0) {
						helper.numberTo(this.iconZeus.hu100, helper.getOnlyNumberInString(this.iconZeus.hu100.string), h100[0].bet, 4900, true);
					}
					if (r1k - h1k[0].bet != 0) {
						helper.numberTo(this.iconZeus.hu1k, helper.getOnlyNumberInString(this.iconZeus.hu1k.string), h1k[0].bet, 4900, true);
					}
					if (r10k - h10k[0].bet != 0) {
						helper.numberTo(this.iconZeus.hu10k, helper.getOnlyNumberInString(this.iconZeus.hu10k.string), h10k[0].bet, 4900, true);
					}
				});
			// Long Lan
			Promise.all(cc.RedT.setting.topHu.data['long'].filter(function (temp) {
				return temp.red == true;
			}))
				.then(result => {
					let h100 = result.filter(function (temp) { return temp.type == 100 });
					let h1k = result.filter(function (temp) { return temp.type == 1000 });
					let h10k = result.filter(function (temp) { return temp.type == 10000 });

					let r100 = helper.getOnlyNumberInString(this.iconLongLan.hu100.string);
					let r1k = helper.getOnlyNumberInString(this.iconLongLan.hu1k.string);
					let r10k = helper.getOnlyNumberInString(this.iconLongLan.hu10k.string);

					if (r100 - h100[0].bet != 0) {
						helper.numberTo(this.iconLongLan.hu100, helper.getOnlyNumberInString(this.iconLongLan.hu100.string), h100[0].bet, 4900, true);
					}
					if (r1k - h1k[0].bet != 0) {
						helper.numberTo(this.iconLongLan.hu1k, helper.getOnlyNumberInString(this.iconLongLan.hu1k.string), h1k[0].bet, 4900, true);
					}
					if (r10k - h10k[0].bet != 0) {
						helper.numberTo(this.iconLongLan.hu10k, helper.getOnlyNumberInString(this.iconLongLan.hu10k.string), h10k[0].bet, 4900, true);
					}
				});			
		}
	},
	playMusic: function() {
        this.audioBG.play();
    },
    pauseMusic: function() {
        this.audioBG.pause();
    },
	resumeMusic: function () {
		//cc.audioEngine.resumeMusic();
	},
	
	onSetAudio: function(){
    	if(cc.RedT.isSoundBackground()){
        	cc.RedT.setSoundBackground(false);
            this.pauseMusic();
            cc.RedT.IS_SOUND = false;
            cc.RedT.setSoundGame(false);
			this.audioIcon.spriteFrame = this.audioIcons[0];
    	}else{
    		cc.RedT.setSoundBackground(true);
            this.playMusic();
            cc.RedT.IS_SOUND = true;
            cc.RedT.setSoundGame(true);
            this.audioIcon.spriteFrame = this.audioIcons[1];
    	}
    },
	resumeMusic: function () {
		//cc.audioEngine.resumeMusic();
	},
	audioClick: function () {
		if(cc.RedT.audio != null){
			//console.log('not Null --- here');
		cc.RedT.audio.playClick();
	}
		else{
			//console.log('null --- here');
		}
	},
	audioUnClick: function () {
		if(!!cc.RedT.audio){
			//console.log('not Null --- here');
		cc.RedT.audio.playUnClick();
	}
		else{
			//console.log('null --- here');
		}
	},
	fbgroup: function () {
		cc.sys.openURL("https://rik.fan"); //fanpage
	},
	fanpage: function () {
		cc.sys.openURL("https://rik.fan"); //fanpage
	},
	//ios: function () {
		//cc.sys.openURL("https://zalo.me/0888886611"); // app
	//},
	//android: function () {
		//cc.sys.openURL("https://t.me/dautuhockiemtien"); //app
	//},
	smartotp: function () {
		cc.sys.openURL("https://rik.fan"); // otpbot
	},
    actHotline() {
		this.PanelSupporttoggle();
       cc.sys.openURL("https://rik.fan");
    },
    actTelegramSP() {
		this.PanelSupporttoggle();
        cc.sys.openURL("https://rik.fan");
    },
    actLiveChat() {
		this.PanelSupporttoggle();
        cc.sys.openURL("https://rik.fan");
    },

	/*checkLoginFacebook: function () {
		if (cc.sys.isBrowser && FB) {
			var self = this;
			self.loading.active = true;
			!isInitFB && FB && FB.init({
				appId: "1979927462336372",
				autoLogAppEvents: !0,
				xfbml: !0,
				cookie: !0,
				version: "v3.1"
			}),
				FB.getLoginStatus(function (t) {
					if ("connected" === t.status) {
						var e = t.authResponse.userID
							, i = s.LOGIN_FACEBOOK_TYPE
							, o = t.authResponse.accessToken;
						self.loginSocial(e, "", i, o)
					} else
						self.setAutoLogin(!1),
							self.loading.active = false;
				})
		}
	},
	loginFacebook: function () {
		FB.login(function (response) {
			// handle the response
			self.loading.active = false;
			if (response.status === 'connected') {
				// Logged into your app and Facebook.
				cc.log("login  : connected");
				var uid = response.authResponse.userID;
				var type = s.LOGIN_FACEBOOK_TYPE;
				var token = response.authResponse.accessToken;
				self.loginSocial(uid, "", type, token);
			} else {
				// The person is not logged into this app or we are unable to tell.
				cc.log("Not sigin");
				self.setAutoLogin(!1);
			}
		}, {
			scope: 'public_profile,email'
		});
	},
	loginSocial: function (e, i, o, n, t) {
		var s = this
			, a = {
				social_id: e,
				email: i,
				social_type: o,
				access_token: n,
				register_code: this.getRegisterCode(),
				mkt_code: this.getMarketingCode(),
				device_id: this.getDeviceID(),
				fid: this.getFID()
			};
		t && (a.otp = t);
		this.api.registerSocial(a, function (t) {
			0 === t.data.login_status ? (s.OTPLogin.setLoginFacebook(e, i, o, n),
				s.OTPLogin.clear(),
				s.hideProcessingNode(),
				s.GameCenterUI.showOtpLoginFormNode()) : (s.setAutoLogin(!0),
					s.setAccountType(!0),
					s.initDataAndConnectSFS(t.data),
					s.GameCenterUI.hideOtpLoginFormNode(),
					t.data.user.is_new && c.addTrackCompleteRegistration())
		}, function (t) {
			s.setAutoLogin(!1),
				s.deProcessingNode(),
				s.showDialogMessage(r.LOGIN_TITLE, t.msg)
		})
	},*/

	/*loadFacebookSDK() {
		if (!cc.sys.isBrowser) {
			cc.log("isMobile");
		} else {
			cc.log("isBrowser");
			var check_SDK_Exist = true;
			var temp = setInterval(function () {
				cc.log("setInterval   ");
				if (!check_SDK_Exist) {
					cc.log("clearInterval");
					clearInterval(temp);
					return;
				}

				if (document.getElementById('fb-root')) {
					check_SDK_Exist = false;
					FB.init({
						appId: '308158023154919',
						cookie: true, // enable cookies to allow the server to access
						xfbml: true, // parse social plugins on this page
						version: 'v3.2' // The Graph API version to use for the call
					});
				}
			}, 500);


			(function (d, s, id) {
				var js, fjs = d.getElementsByTagName(s)[0];
				if (d.getElementById(id)) return;
				js = d.createElement(s);
				js.id = id;
				js.src = "https://connect.facebook.net/vi_VN/sdk.js";
				fjs.parentNode.insertBefore(js, fjs);
			}(document, 'script', 'facebook-jssdk'));
		}
	},*/

	randomBetween(min, max) {
		return Math.floor(Math.random() * (max - min + 1) + min);
	}
});
