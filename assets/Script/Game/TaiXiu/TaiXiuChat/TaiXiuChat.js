
var helper      = require('Helper');
var BrowserUtil = require('BrowserUtil');

cc.Class({
	extends: cc.Component,
	properties: {
		content: {
			default: null,
			type: cc.ScrollView
		},
		item: {
			default: null,
			type: cc.Prefab
		},
		input: {
			default: null,
			type: cc.EditBox
		},
		layout: {
			default: null,
			type: cc.Layout
		},
		sfRanks: [cc.SpriteFrame],
		isLoad: false,
	},
	init(obj){
		this.RedT = obj;
		if (void 0 !== cc.RedT.setting.taixiu.chat_active) {
			this.node.active = cc.RedT.setting.taixiu.chat_active;
		}
	},
	onLoad () {
		var self = this;
		this.keyHandle = function(t) {
			return t.keyCode === cc.macro.KEY.tab ? (t.preventDefault && t.preventDefault(),
				!1) : t.keyCode === cc.macro.KEY.enter ? (BrowserUtil.focusGame(), self.onChatClick(),
				t.preventDefault && t.preventDefault(),
				!1) : void 0
		}
	},
	onEnable: function () {
		cc.sys.isBrowser && this.addEvent();
		if (!this.isLoad) {
			cc.RedT.send({shop:{get_daily: true}});
			this.getData();
		}
	},
	onDisable: function () {
		cc.sys.isBrowser && this.removeEvent();
		this.clean();
	},
	addEvent: function() {
		BrowserUtil.getHTMLElementByEditBox(this.input).addEventListener("keydown", this.keyHandle, !1);
	},
	removeEvent: function() {
		BrowserUtil.getHTMLElementByEditBox(this.input).removeEventListener("keydown", this.keyHandle, !1);
	},
	getData: function(){
		this.isLoad = true;
		cc.RedT.send({taixiu:{getLogChat: true}});
	},
	message: function(data, tobot = false){
		var item = cc.instantiate(this.item)

		var itemComponent = item.getComponent(cc.Label);
		itemComponent.string = `     ${data.user}:	${data.value}`;
		var name = item.getChildByName("name").getComponent(cc.Label);
		item.getChildByName("iconvip").getComponent(cc.Sprite).spriteFrame = this.sfRanks[(data.vip - 1)>>0];

		if (cc.RedT.daily_list.length) {
			var regex = new RegExp("^" + data.user + "$", 'i');
			Promise.all(cc.RedT.daily_list.map(function(daily){
				if(regex.test(daily.NICKNAME.string))
					name.node.color = cc.Color.YELLOW;
			}))
		}
		if (data.vip >= 2 && data.vip <= 4) {
			name.node.color = cc.Color.MAGENTA;
		}
		if (data.vip >= 5) {
			name.node.color = new cc.Color(0, 242, 255);
		}
		if (data.user === 'Hệ Thống' || data.user === 'thinhdev') {
			name.node.color = cc.Color.RED;
		}

		name.string = `     ${data.user}`;
		this.content.content.addChild(item);
		if(tobot && this.layout.node.height > 300 && this.layout.node.height-this.layout.node.position.y-134 < 70){
			setTimeout(function(){
				this.content.scrollToBottom(0.1);
			}.bind(this), 100);
		}
	},
	logs: function(logs){
		if (logs.length) {
			var self = this;
			Promise.all(logs.map(function(message){
				return self.message(message);
			}))
			.then(result => {
				setTimeout(function(){
					this.content.scrollToBottom(0.1);
				}.bind(this), 100);
			})
		}
	},
	onData: function(data){
		if (void 0 !== data.message) {
			this.message(data.message, true);
		}
		if (void 0 !== data.logs) {
			this.logs(data.logs);
		}
	},
	onChatClick: function() {
		if(helper.isEmpty(this.input.string)){
			this.RedT.onData({err: "Nhập nội dung..."});
		}else{
			cc.RedT.send({taixiu:{chat: this.input.string}});
			this.onData({message:{user:cc.RedT.user.name, value:this.input.string, vip: cc.RedT.vip}});
			this.clean();
		}
	},
	toggle: function(){
		this.RedT.setTop();
		cc.RedT.audio.playClick();
		this.node.active = cc.RedT.setting.taixiu.chat_active = !this.node.active;
	},
	clean: function(){
		this.input.string = "";
	},
	reset: function(){
		this.content.content.destroyAllChildren();
		this.node.active = false;
	},
});
