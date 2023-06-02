
var TaiXiuLichSuPhien = require('TaiXiuLichSuPhien'),
	TaiXiuLichSu      = require('TaiXiuLichSu'),
	MiniPoker_LichSu  = require('MiniPoker_LichSu'),
	MiniPoker_Top     = require('MiniPoker_Top'),
	BigBabol_LichSu   = require('BigBabol_LichSu'),
	BigBabol_Top      = require('BigBabol_Top'),
	BauCua_LichSu     = require('BauCua_LichSu'),
	BauCua_top        = require('BauCua_top'),
	CaoThap_history   = require('CaoThap_history'),
	CaoThap_top       = require('CaoThap_top'),
	BongDaLichSuPhien = require('BongDaLichSuPhien'),
	BongDaChiTiet 	  = require('BongDa_ChiTiet'),
	AngryBird_history = require('AngryBird_history'),
	AngryBird_top     = require('AngryBird_top'),
	HelpMNPoker       = require('HelpMNPoker'),
	HelpCaoThap       = require('HelpCaoThap'),
	HelpARB       	  = require('HelpARB'),
	HelpCandy         = require('HelpCandy'),
	HelpBaucua        = require('HelpBaucua'),
	HelpTX			  = require('HelpTX');

cc.Class({
	extends: cc.Component,

	properties: {
		TaiXiuLichSuPhien: TaiXiuLichSuPhien,
		TaiXiuLichSu:      TaiXiuLichSu,
		MiniPoker_LichSu:  MiniPoker_LichSu,
		MiniPoker_Top:     MiniPoker_Top,
		BigBabol_LichSu:   BigBabol_LichSu,
		BigBabol_Top:      BigBabol_Top,
		BauCua_LichSu:     BauCua_LichSu,
		BauCua_top:        BauCua_top,
		CaoThap_history:   CaoThap_history,
		CaoThap_top:       CaoThap_top,
		AngryBird_history: AngryBird_history,
		AngryBird_top:     AngryBird_top,
		BongDaLichSuPhien: BongDaLichSuPhien,
		BongDaChiTiet:	   BongDaChiTiet,
		HelpTX:			   HelpTX,
		HelpMNPoker:	   HelpMNPoker,
		HelpCaoThap:	   HelpCaoThap,
		HelpARB:		   HelpARB,
		HelpCandy:		   HelpCandy,
		HelpBaucua:		   HelpBaucua,
	},

	init: function(obj) {
		this.objShow    = null;
		this.objTmp     = null;
		this.TaiXiuLichSuPhien.init(obj.TaiXiu);
		this.BauCua_LichSu.init(obj.BauCua);
	},

	onClickBack: function(){
		cc.RedT.audio.playUnClick();
		this.onBack();
	},
	onBack: function(){
		if(this.objShow != null){
			if(void 0 == this.objShow.previous || null == this.objShow.previous){
				this.objShow.active = false;
				this.node.active    = false;
				this.objShow        = null;
			}else{
				this.objTmp              = this.objShow;
				this.objShow             = this.objShow.previous;
				this.objTmp.previous     = null;
				this.objTmp.active       = false;
				this.objShow.active      = true;
				this.objTmp              = null;
			}
		}else{
			this.node.active = false;
		}
	},
	onClosePrevious: function(obj){
		if(void 0 !== obj.previous && null !== obj.previous){
			this.onClosePrevious(obj.previous)
			obj.previous = null
		}
		obj.active = false
	},
	onCloseDialog: function(){
		if(this.objShow != null ){
			if(void 0 == this.objShow.previous || null == this.objShow.previous){
				this.objShow.active = this.node.active = false
				this.objShow        = null
			}else{
				this.onClosePrevious(this.objShow.previous)
				this.objShow.active          = this.node.active = false
				this.objShow.previous        = null
				this.objShow                 = null
			}
		}else{
			this.node.active = false
		}
	},

	// Show
	showTaiXiuLichSuPhien: function(){
		this.node.active = this.TaiXiuLichSuPhien.node.active = true;
		this.objShow     = this.TaiXiuLichSuPhien.node;
	},
	showTaiXiuLichSu: function(){
		this.node.active = this.TaiXiuLichSu.node.active = true;
		this.objShow     = this.TaiXiuLichSu.node;
	},
	showMiniPokerLichSu: function(){
		this.node.active = this.MiniPoker_LichSu.node.active = true;
		this.objShow     = this.MiniPoker_LichSu.node;
	},
	showMiniPokerTop: function(){
		this.node.active = this.MiniPoker_Top.node.active = true;
		this.objShow     = this.MiniPoker_Top.node;
	},
	showBigBabolLichSu: function(){
		this.node.active = this.BigBabol_LichSu.node.active = true;
		this.objShow     = this.BigBabol_LichSu.node;
	},
	showBigBabolTop: function(){
		this.node.active = this.BigBabol_Top.node.active = true;
		this.objShow     = this.BigBabol_Top.node;
	},
	showBauCuaLichSu: function(){
		this.node.active = this.BauCua_LichSu.node.active = true;
		this.objShow     = this.BauCua_LichSu.node;
	},
	showBauCuaTop: function(){
		this.node.active = this.BauCua_top.node.active = true;
		this.objShow     = this.BauCua_top.node;
	},

	showCaoThap_history: function(){
		this.node.active = this.CaoThap_history.node.active = true;
		this.objShow     = this.CaoThap_history.node;
	},
	showCaoThap_top: function(){
		this.node.active = this.CaoThap_top.node.active = true;
		this.objShow     = this.CaoThap_top.node;
	},

	showAngryBird_history: function(){
		this.node.active = this.AngryBird_history.node.active = true;
		this.objShow     = this.AngryBird_history.node;
	},
	showAngryBird_top: function(){
		this.node.active = this.AngryBird_top.node.active = true;
		this.objShow     = this.AngryBird_top.node;
	},
	showBongDaLichSuPhien: function(){
		this.node.active = this.BongDaLichSuPhien.node.active = true;
		this.objShow     = this.BongDaLichSuPhien.node;
	},
	showBongDaChiTiet: function(){
		this.node.active = this.BongDaChiTiet.node.active = true;
		this.objShow     = this.BongDaChiTiet.node;
	},
	showHelpTX: function (obj) {
		this.node.active = this.HelpTX.node.active = true;
		this.objShow     = this.HelpTX.node;
	},
	showHelpMNPoker: function (obj) {
		this.node.active = this.HelpMNPoker.node.active = true;
		this.objShow     = this.HelpMNPoker.node;
	},
	showHelpCaoThap: function (obj) {
		this.node.active = this.HelpCaoThap.node.active = true;
		this.objShow     = this.HelpCaoThap.node;
	},
	showHelpARB: function (obj) {
		this.node.active = this.HelpARB.node.active = true;
		this.objShow     = this.HelpARB.node;
	},
	showHelpCandy: function (obj) {
		this.node.active = this.HelpCandy.node.active = true;
		this.objShow     = this.HelpCandy.node;
	},
	showHelpBaucua: function (obj) {
		this.node.active = this.HelpBaucua.node.active = true;
		this.objShow     = this.HelpBaucua.node;
	},
});
