
var TaiXiu     = require('TaiXiu'),
	MiniPoker  = require('MiniPoker'),
	BigBabol   = require('BigBabol'),
	BauCua     = require('BauCua'),
	CaoThap    = require('CaoThap'),
	AngryBirds = require('AngryBirds'),
	TopHu      = require('popupTopHu'),
	Dialog     = require('MiniDialog');
var BongDa      = require('BongDa');
var listOpen = [];

cc.Class({
	extends: cc.Component,

	properties: {
		minigame: {
			default: null,
			type: cc.Node
		},
		Dialog:      Dialog,
		TaiXiu:      TaiXiu,
		MiniPoker:   MiniPoker,
		BigBabol:    BigBabol,
		BauCua:      BauCua,
		BongDa:     BongDa,
		CaoThap:     CaoThap,
		AngryBirds:  AngryBirds,
		TopHu:       TopHu,
		bgLight:     cc.Node,
		spriteLight: cc.Sprite,
		onLight:     cc.SpriteFrame,
		offLight:    cc.SpriteFrame,
		nodeEfect:   cc.Node,
		// Prefab
		PrefabNoHu:   cc.Prefab,
		prefabBigWin: cc.Prefab,
		light:      true,
	},
	onLoad () {
		if (void 0 === cc.RedT.setting.light) {
			cc.RedT.setting.light = true;
		}
		var self = this;
		this.node._onPreDestroy = function(){
			self.onDestroy();
		}
		this.TaiXiu     = this.TaiXiu.getComponent('TaiXiu');
		this.MiniPoker  = this.MiniPoker.getComponent('MiniPoker');
		this.BigBabol   = this.BigBabol.getComponent('BigBabol');
		this.BauCua     = this.BauCua.getComponent('BauCua');
		this.CaoThap    = this.CaoThap.getComponent('CaoThap');
		this.AngryBirds = this.AngryBirds.getComponent('AngryBirds');
		this.TopHu  = this.TopHu.getComponent('popupTopHu');
		this.Dialog = this.Dialog.getComponent('MiniDialog');
		this.Dialog.init(this);
		this.TaiXiu.init(this);
		this.MiniPoker.init(this);
		this.BigBabol.init(this);
		this.BauCua.init(this);
		this.CaoThap.init(this);
		this.AngryBirds.init(this);
		this.BongDa.init(this);
		this.TopHu.init(this);

		if (cc.RedT.IS_LOGIN){
			this.signIn();
		}
		if (cc.RedT.setting.light != this.light) {
			this.LightChanger();
		}
	},
	LightChanger: function(){
		this.light = cc.RedT.setting.light = !this.light;
		if (this.light) {
			this.bgLight.active = false;
			this.spriteLight.spriteFrame = this.offLight;
		}else{
			this.bgLight.active = true;
			this.spriteLight.spriteFrame = this.onLight;
		}
	},
	signIn:function(){
		this.minigame.active = true;
		this.TaiXiu.signIn();
	},
	newGame: function() {
		this.minigame.active = false;
		this.Dialog.onCloseDialog();
		this.TaiXiu.newGame();
		this.BauCua.newGame();
		this.CaoThap.newGame();
	},
	onData: function(data){
		if (void 0 !== data.poker){
			this.MiniPoker.onData(data.poker);
		}
		if (void 0 !== data.big_babol){
			this.BigBabol.onData(data.big_babol);
		}
		if (void 0 !== data.baucua){
			this.BauCua.onData(data.baucua);
		}
		if (void 0 !== data.bongda){
			this.BongDa.onData(data.bongda);
		}
		if (void 0 !== data.caothap){
			this.CaoThap.onData(data.caothap);
			
		}
		if (void 0 !== data.arb){
			this.AngryBirds.onData(data.arb);
			
		}
		
	},
	onDestroy: function(){
		clearInterval(this.TaiXiu.TX_Main.timeInterval);
		clearInterval(this.BauCua.timeInterval);
		void 0 !== this.CaoThap.timeInterval && clearInterval(this.CaoThap.timeInterval);
	},
	playClick: function(){
		cc.RedT.audio.playClick();
	},
	playUnClick: function(){
		cc.RedT.audio.playUnClick();
	},
	setTop: function(obj){
		if (obj.runScale === false) {
			obj.stopAllActions();
			obj.runScale = true;
			let actionOn = cc.scaleTo(0.1, 0.8333333);
			obj.runAction(cc.sequence(actionOn, cc.callFunc(function() {
				this.runScale = false;
			}, obj)));
		}
		this.minigame.children.forEach(function(game){
			if (game.active && game !== obj) {
				game.stopAllActions();
				let actionUn = cc.scaleTo(0.1, 0.5);
				game.runAction(cc.sequence(actionUn, cc.callFunc(function() {
					this.runScale = false;
				}, game)));
			}
		});
	},
});
