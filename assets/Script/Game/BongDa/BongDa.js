
var BrowserUtil = require('BrowserUtil');
var helper      = require('Helper');

cc.Class({
	extends: cc.Component,

	properties: {
		scrollview: {
			default: null,
			type: cc.ScrollView,
        },
		prefabTranDau: {
			default: null,
			type: cc.Prefab,
		},
	},
	init(obj){
        this.RedT = obj;
        var self  = this;
		this.isLoaded = false;
	},
	onEnable: function() {
		this.onGetInfo();
		//this.scrollview.on(cc.Node.EventType.MOUSE_ENTER,  this.setTop,     this);
	},
	onDisable: function() {
		//this.scrollview.off(cc.Node.EventType.MOUSE_ENTER,  this.setTop,     this);
		this.closeGame();
	},
	setTop:function(){
		this.node.parent.insertChild(this.node);
	},
	onGetInfo: function(){
		cc.RedT.send({g:{bongda:{info:true}}});
	},
    openGame: function () {
		cc.RedT.audio.playClick();
		if (cc.RedT.IS_LOGIN){
			this.node.active = !0;
			localStorage.setItem('BongDa', true);
			this.setTop();
		}
		else
			cc.RedT.inGame.dialog.showSignIn();
	},
	closeGame:function(){
		this.node.active = !1;
		localStorage.setItem('BongDa', false);
	},
	onBongDa: function(data){
		//console.log(data);
		var self  = this;
		self.scrollview.content.removeAllChildren(); //remove all children	
		if (data) {
			Promise.all(data.map(function(data, index){
				var item = cc.instantiate(self.prefabTranDau);
				var component = item.getComponent('TranDau_Item');
				component.init(self, data, index);
				self.scrollview.content.addChild(item);
				return component;
			}))
		}
	},
	onData: function(data) {
		//console.log(data);
		if (!!data.info) {
			this.isLoaded = true;
			this.onBongDa(data.info);
		}
		if (!!data.getphien) {
			cc.RedT.MiniPanel.Dialog.BongDaLichSuPhien.onLog(data.getphien);
		}
    },
    onClickBet: function() {
		//Show dialog bet
    },
    onClickDetail: function() {
		//Show dialog detail
    },
    onClickTop: function() {
		//Show dialog Top
    },
    onClickHistory: function() {
		//Show dialog History
	},
});
