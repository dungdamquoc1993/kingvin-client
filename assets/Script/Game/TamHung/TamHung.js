
var helper = require('Helper'),
    reel   = require('TamHung_reel'),
    Line   = require('TamHung_lines'),
    gameBonus = require('TamHung_playBonus'),
    notice = require('Notice'),
    dialog = require('TamHung_dialog');

cc.Class({
    extends: cc.Component,
    properties: {
        gameBonus: gameBonus,
        audioBG:      cc.AudioSource,
        audioClick:   cc.AudioSource,

        redhat: {
            default: null,
            type: cc.Node
        },
        reels: {
            default: [],
            type: reel,
        },
        icons: {
            default: [],
            type: cc.SpriteFrame,
        },
        iconAudios: {
            default: [],
            type: cc.SpriteFrame,
        },
        betString: {
            default: [],
            type: cc.String,
        },
        iconPrefab: {
            default: null,
            type: cc.Prefab,
        },
        BigWin:       cc.Animation,
        BigWin_Label: cc.Label,
        NoHu:         cc.Animation,
        NoHu_Label:   cc.Label,
        EF_Bonus:     cc.Animation,
        EF_Free:      cc.Animation,
        buttonCoint: cc.Node,
        buttonLine:  cc.Node,
        buttonSpin:  cc.Node,
        buttonSpinSpeed:  cc.Node,
        buttonFree:  cc.Node,
        freeLabel:   cc.Label,
        buttonAuto:  cc.Node,
        buttonStop:  cc.Node,
        buttonAudio:  cc.Sprite,
        nodeRed: {
            default: null,
            type: cc.Node,
        },
        nodeXu: {
            default: null,
            type: cc.Node,
        },
        bet: {
            default: null,
            type: cc.Label,
        },
        nodeNotice: {
            default: null,
            type: cc.Node,
        },
        prefabNotice: {
            default: null,
            type: cc.Prefab,
        },
        MiniPanel: cc.Prefab,
        loading: {
            default: null,
            type: cc.Node
        },
        notice:     notice,
        dialog:     dialog,
        Line:       Line,
        hu:         cc.Label,
        taikhoan:   cc.Label,
        tong:       cc.Label,
        vuathang:   cc.Label,
        labelLine:  cc.Label,
        bangThuong: cc.Node,
        efline:     cc.Node,
        isAuto:     false,
        isSpin:     false,
        isFreeSpin: false,
        isAudio: false,
        red:     true,
        isSpeed:     false,
        isForceSpeed:     false,
        chonCuoc: cc.Node,
        game:     cc.Node,
        hu100: cc.Label,
        hu1000: cc.Label,
        hu10000: cc.Label,
        fontThang: cc.Font,
        betSelect: 0,
    },
    onLoad () {
        cc.RedT.inGame = this;
        var MiniPanel = cc.instantiate(this.MiniPanel);
        cc.RedT.MiniPanel = MiniPanel.getComponent('MiniPanel');
        this.redhat.insertChild(MiniPanel);

        this.BigWin.on('finished', this.BigWinFinish, this);
        this.BigWin.on('play',     this.BigWinPlay,   this);
        this.NoHu.on('finished', this.NoHuFinish, this);
        this.NoHu.on('play',     this.NoHuPlay,   this);

        this.EF_Bonus.on('finished', this.EF_BonusFinish, this);
        this.EF_Free.on('finished',  this.EF_FreeFinish,  this);

        var self = this;
        this.gameBonus.init(this);
        this.Line.init(this);
        this.dialog.init();
        this.isAudio =  true;
        Promise.all(this.reels.map(function(reel) {
            reel.init(self);
        }));
        cc.RedT.send({scene:"tamhung"});
        this.taikhoan.string = helper.numberWithCommas(cc.RedT.user.red);
        this.speed = 400;
        this.onGetAllHu();
        this.chonCuoc.active = true;
        this.game.active = false;
        this.resetSpin();
        if(cc.RedT.isSoundBackground()){
            cc.RedT.setSoundBackground(true);
            this.playMusic();
        }
    },

    OnChangerNhacNen: function() {

        if (this.isAudio) {
            this.audioBG.volume = 0;
            this.audioClick.volume = 0;
            this.buttonAudio.spriteFrame =  this.iconAudios[1];
            this.isAudio = false;
        }else{
            this.audioBG.volume = 1;
            this.audioClick.volume = 1;
            this.buttonAudio.spriteFrame =  this.iconAudios[0];
            this.isAudio = true;
        }
    },
    BigWinPlay: function(){
        var huong = cc.callFunc(function(){
            cc.RedT.audio.playEf('megaWin');
            helper.numberTo(this.BigWin_Label, 0, this.H_win, 2000, true);
        }, this);
        this.BigWin.node.runAction(cc.sequence(cc.delayTime(0.3), huong));
    },
    BigWinFinish: function(){
        this.isBigWin = false;
        this.BigWin.node.active = false;
        this.BigWin_Label.string = "";
        this.showLineWin(false);
        this.hieuUng();
    },
    NoHuPlay: function(){
        var huong = cc.callFunc(function(){
            cc.RedT.audio.playEf('jackpot');
            helper.numberTo(this.NoHu_Label, 0, this.H_win, 2000, true);
        }, this);
        this.NoHu.node.runAction(cc.sequence(cc.delayTime(0.3), huong));
    },
    NoHuFinish: function(){
        this.isNoHu = false;
        this.NoHu.node.active  = false;
        this.NoHu_Label.string = "";
        if (this.isAuto) {
            this.onAuto();
        }
        this.showLineWin(false);
        this.hieuUng();
    },
    EF_BonusFinish: function(){
        this.isBonus = false;
        this.EF_Bonus.node.active = false;
        this.gameBonus.onPlay();
        this.showLineWin(false);
    },
    EF_FreeFinish: function(){
        this.isFree = false;
        this.EF_Free.node.active = false;
        this.showLineWin(false);
        this.hieuUng();
    },
    EF_vuathang: function(){
        this.showLineWin(true);
        this.vuathang.string = helper.numberWithCommas(this.H_win);
        this.buttonFree.active = !!this.H_free;
        this.buttonSpin.active = !this.H_free;
        this.buttonSpinSpeed.active = !this.H_free;
        this.freeLabel.string  = this.H_free;
    },
    onChangerBet: function(event, customEventData){
  		cc.RedT.IS_SOUND && this.audioClick.play();
  		this.bet.string  = customEventData;
  		this.tong.string = helper.numberWithCommas(this.Line.data.length * helper.getOnlyNumberInString(this.bet.string));
  		this.game.active = true;
  		this.chonCuoc.active = false;
    this.resetSpin();
    this.onStop();
  		this.onGetHu();
  	},
  	onSelectBet: function(){
  		this.game.active = false;
  		this.chonCuoc.active = true;
  		this.onGetAllHu();
  		this.onGetHu();
  	},
    changerCoint: function(){
        this.red            = !this.red;
        this.nodeRed.active = !this.nodeRed.active;
        this.nodeXu.active  = !this.nodeXu.active;
        this.userData(cc.RedT.user);
        this.onGetHu();
    },
    onClickSpin: function(){
        cc.RedT.IS_SOUND && this.audioClick.play();
        this.isSpeed = false;
        this.onSpin();
    },
    onClickSpinSpeed: function(){
      cc.RedT.IS_SOUND && this.audioClick.play();
  		this.isSpeed = true;
      if(this.isAuto) this.isForceSpeed = true;
  		this.onSpin();
  	},
    onAutoSpin: function(){
        cc.RedT.IS_SOUND && this.audioClick.play();
        this.onGetSpin();
    },
    onClickAuto: function(){
        cc.RedT.audio.playClick();
        this.onAuto();
    },
    onClickStop: function(){
        cc.RedT.audio.playClick();
        this.onStop();
    },
    onSpin: function(){
        if (this.Line.data.length < 1) {
            this.addNotice('Chọn ít nhất 1 dòng');
        }else{
            this.setSpin();
            if (!this.isSpin) {
                this.node.stopAllActions();
                void 0 !== this.eflineN && void 0 !== this.H_line_win && this.H_line_win.length && this.efOneLineWin(this.eflineN, false);
                this.eflineO = this.eflineN = 0;
                this.isSpin = true;
                this.onGetSpin();
            }
        }
    },
    onAuto: function(){
        this.isAuto = !this.isAuto;
        this.buttonAuto.color = this.isAuto ? cc.Color.WHITE : cc.color(200,200,200);
        this.buttonStop.active = this.isSpin;
    },
    onStop: function(){
        this.isAuto = this.buttonStop.active = false;
        this.buttonAuto.active = true;
        this.isForceSpeed = false;
        this.buttonAuto.color  = cc.color(200,200,200);
    },
    setSpin: function(){
        this.buttonLine.pauseSystemEvents();
        this.buttonSpin.pauseSystemEvents();
        this.buttonSpinSpeed.pauseSystemEvents();
        this.buttonCoint.pauseSystemEvents();
    },
    resetSpin: function(){
        if (this.isAuto) {
            this.onAuto();
        }
        this.isForceSpeed = false;
        this.isSpeed = false;
        this.isSpin = this.buttonStop.active = false;
        this.buttonAuto.active = true;
        this.buttonLine.resumeSystemEvents();
        this.buttonSpin.resumeSystemEvents();
        this.buttonSpinSpeed.resumeSystemEvents();
        this.buttonCoint.resumeSystemEvents();
    },
    runReels: function(isSpeed){
      var self = this;
      Promise.all(this.reels.map(function(reel, index) {
        if(isSpeed || self.isForceSpeed)
          reel.spin(index,0.25);
        else
          reel.spin(index,1);
      }));
      self.isSpeed = false;
    },
    copy: function(){
        Promise.all(this.reels.map(function(reel){
            reel.icons[reel.icons.length-1].setIcon(reel.icons[2].data);
            reel.icons[reel.icons.length-2].setIcon(reel.icons[1].data);
            reel.icons[reel.icons.length-3].setIcon(reel.icons[0].data);
        }));
    },
    random: function(){
        Promise.all(this.reels.map(function(reel){
            Promise.all(reel.icons.map(function(icon, index){
                if (index > 2 && index < reel.icons.length-3) {
                    icon.random();
                }
            }));
        }));
    },
    onLineWin: function(bool){
        var self = this;
        Promise.all(this.H_line_win.map(function(obj){
            Promise.all(self.Line.lines[obj.line].map(function(icon, index){
                self.efline.children[index].children[icon].active = bool;
            }))
            let TRed = self.Line.mainLine[obj.line-1];
            if (bool) {
                TRed.onhover();
                TRed.node.pauseSystemEvents();
            }else{
                TRed.offhover();
                TRed.node.resumeSystemEvents();
            }
        }))
    },
    showLineWin: function(bool){
        this.onLineWin(bool);
        if (!bool && !this.isNoHu && !this.isBigWin && !this.isAuto && !this.isFreeSpin) {
            this.eflineN = 0;
            this.efLineWin();
        }
    },
    efLineWin: function(bool){
        if (this.H_line_win.length) {
            this.node.stopAllActions();
            var self = this;

            if (void 0 === this.H_line_win[this.eflineN]) {
                this.eflineN = 0;
            }
            this.efOneLineWin(this.eflineN, true);
            var next = cc.callFunc(function() {
                this.efOneLineWin(this.eflineN, false);
                this.eflineN += 1;
                this.efLineWin();
            }, this);
            this.node.runAction(cc.sequence(cc.delayTime(1.5), next));
        }
    },
    efOneLineWin: function(number, bool){
        var self = this;
        number = this.H_line_win[this.eflineN].line;
        Promise.all(this.Line.lines[number].map(function(icon, index){
            self.efline.children[index].children[icon].active = bool;
        }))
        let TRed = this.Line.mainLine[number-1];
        if (bool) {
            TRed.onhover();
            TRed.node.pauseSystemEvents();
        }else{
            TRed.offhover();
            TRed.node.resumeSystemEvents();
        }
    },
    hieuUng: function(){
        if (this.isBigWin && !this.isNoHu) {
            // Big Win
            this.BigWin.node.active = true;
            this.BigWin.play();
        }else if (this.isNoHu){
            // Nổ Hũ
            this.NoHu.node.active = true;
            this.NoHu.play();
        }else if (this.isBonus){
            // Bonus
            this.EF_Bonus.node.active = true;
            this.EF_Bonus.play();
            cc.RedT.audio.playEf('bonus');
        }else if (this.isFree){
            // Free
            this.EF_Free.node.active = true;
            this.EF_Free.play();
        }else if (this.H_win > 0){
         if(this.game.active){
            var temp = new cc.Node;
            temp.addComponent(cc.Label);
            temp = temp.getComponent(cc.Label);
            temp.string = helper.numberWithCommas(this.H_win);
            temp.font = this.fontThang;
            temp.lineHeight = 130;
            temp.fontSize   = 25;
            temp.node.position = cc.v2(0, 21);
            this.nodeNotice.addChild(temp.node);
            temp.node.runAction(cc.sequence(cc.moveTo(1.2, cc.v2(0, 105)), cc.callFunc(function(){
                this.speed = 0;
                temp.node.destroy();
                this.hieuUng();
                this.showLineWin(false);
            }, this)));
           }
            this.H_win = 0;
        }else{
            if (this.isAuto || this.isFreeSpin) {
                this.timeOut = setTimeout(function(){
                    this.onAutoSpin();
                    this.speed = 400;
                }
                .bind(this), this.speed);
            }else{
                this.resetSpin();
            }
        }
    },
    onData: function(data) {
        if (void 0 !== data.user){
            this.userData(data.user);
            cc.RedT.userData(data.user);
        }
        if (void 0 !== data.tamhung){
            this.TamHung(data.tamhung);
        }
        if (void 0 !== data.mini){
            cc.RedT.MiniPanel.onData(data.mini);
        }
        if (void 0 !== data.TopHu){
            cc.RedT.MiniPanel.TopHu.onData(data.TopHu);
        }
        if (void 0 !== data.taixiu){
            cc.RedT.MiniPanel.TaiXiu.TX_Main.onData(data.taixiu);
        }
    },
    userData: function(data){
        if (this.red) {
            this.taikhoan.string = helper.numberWithCommas(data.red);
        }else{
            this.taikhoan.string = helper.numberWithCommas(data.xu);
        }
    },
    TamHung: function(data){
        var self = this;
        if (void 0 !== data.status) {
            if (data.status === 1) {
                this.buttonStop.active = this.isAuto ? true : false;
                this.buttonAuto.active = !this.buttonStop.active;
                Promise.all(data.cel.map(function(cel, cel_index){
                    Promise.all(cel.map(function(icon, index){
                        self.reels[cel_index].icons[index].setIcon(icon, true);
                    }));
                }));
                this.runReels(this.isSpeed);
                this.H_line_win = data.line_win;
                this.H_win      = data.win;
                this.H_free     = data.free;
                this.isBonus    = data.isBonus;
                this.isNoHu     = data.isNoHu;
                this.isBigWin   = data.isBigWin;
                this.isFree     = data.isFree;
                this.isFreeSpin = !!data.free;
            }else{
                this.resetSpin();
            }
        }
        if (void 0 !== data.bonus) {
            this.gameBonus.onData(data.bonus);
        }
        if (void 0 !== data.log) {
            this.dialog.history.onData(data.log);
        }
        if (void 0 !== data.top) {
            this.dialog.top.onData(data.top);
        }
        if (void 0 !== data.notice) {
            this.addNotice(data.notice);
        }
    },
    onGetSpin: function(){
        cc.RedT.send({g:{tamhung:{spin:{cuoc: helper.getOnlyNumberInString(this.bet.string), red: this.red, line: this.Line.data}}}});
    },
    addNotice:function(text){
        var notice = cc.instantiate(this.prefabNotice)
        var noticeComponent = notice.getComponent('mini_warning')
        noticeComponent.text.string = text;
        this.nodeNotice.addChild(notice);
    },
    backGame: function(){
		cc.RedT.inGame.notice.show({title:"Thoát game", text:'Xác nhận hành động.\nHành động thực hiện thoát khỏi game này?', button:{type: "exit_game", text: "Thoát"}});
	},
	signOut: function(){
		cc.director.preloadScene('MainGame', function(){
			cc.director.loadScene('MainGame', function(){
				cc.RedT.inGame.signOut();
			});
		})
	},
    onGetHu: function(){
        if (void 0 !== cc.RedT.setting.topHu.data) {
            var self = this;
            var cuoc = helper.getOnlyNumberInString(self.bet.string);
            Promise.all(cc.RedT.setting.topHu.data['tamhung'].filter(function(temp){
                return temp.type == cuoc && temp.red == self.red;
            }))
            .then(result => {
                var s = helper.getOnlyNumberInString(this.hu.string);
                var bet = result[0].bet;
                if (s-bet != 0)
                    helper.numberTo(this.hu, s, bet, 2000, true);
            });
        }
    },
    onGetAllHu: function(){
  		if (void 0 !== cc.RedT.setting.topHu.data) {
  			var self = this;
  			var cuoc = helper.getOnlyNumberInString(self.bet.string);
  			Promise.all(cc.RedT.setting.topHu.data['tamhung'].filter(function (temp) {
  				return temp.red == true;
  			}))
  				.then(result => {
  					let h100 = result.filter(function (temp) { return temp.type == 100 });
  					let h1k = result.filter(function (temp) { return temp.type == 1000 });
  					let h10k = result.filter(function (temp) { return temp.type == 10000 });

  					let r100 = helper.getOnlyNumberInString(this.hu100.string);
  					let r1k = helper.getOnlyNumberInString(this.hu1000.string);
  					let r10k = helper.getOnlyNumberInString(this.hu10000.string);

  					if (r100 - h100[0].bet != 0) {
  						helper.numberTo(this.hu100, helper.getOnlyNumberInString(this.hu100.string), h100[0].bet, 4900, true);
  					}
  					if (r1k - h1k[0].bet != 0) {
  						helper.numberTo(this.hu1000, helper.getOnlyNumberInString(this.hu1000.string), h1k[0].bet, 4900, true);
  					}
  					if (r10k - h10k[0].bet != 0) {
  						helper.numberTo(this.hu10000, helper.getOnlyNumberInString(this.hu10000.string), h10k[0].bet, 4900, true);
  					}
  				});
  		}
  	},
    BangThuongToggle: function(){
        cc.RedT.audio.playClick();
        this.bangThuong.active = !this.bangThuong.active;
    },
    playMusic: function() {
        this.audioBG.play();
    },
    pauseMusic: function() {
        this.audioBG.pause();
    },
});
