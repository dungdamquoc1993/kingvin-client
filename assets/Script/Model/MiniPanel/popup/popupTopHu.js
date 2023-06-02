
var helper = require('Helper');

cc.Class({
	extends: cc.Component,

	properties: {
		content: {
			default: null,
			type: cc.Node
		},
		body: {
			default: null,
			type: cc.Node
		},
		nodeRed: {
			default: null,
			type: cc.Node
		},
		nodeXu: {
			default: null,
			type: cc.Node
		},
		header: {
			default: null,
			type: cc.Node
		},
		panel: {
			default: null,
			type: cc.Node
		},
		x: {
			default: [],
			type: cc.SpriteFrame,
		},
		red: false,
		bet: "",

		spriteBetON: {
			default: [],
			type: cc.SpriteFrame
		},

		spriteBetOFF: {
			default: [],
			type: cc.SpriteFrame
		}
	},
	init: function (obj) {
		this.RedT = obj;
		cc.RedT.setting.topHu = cc.RedT.setting.topHu || {};
		if (void 0 !== cc.RedT.setting.topHu.position) {
			this.node.position = cc.RedT.setting.topHu.position;
		}
		if (void 0 !== cc.RedT.setting.topHu.open) {
			this.body.active = cc.RedT.setting.topHu.open;
		}
		if (void 0 !== cc.RedT.setting.topHu.data) {
			this.onData(cc.RedT.setting.topHu.data);
		}
	},
	onLoad() {
		this.ttOffset = null;
		this.ttOffset2 = null;
		this.toggleRuning = false;
		Promise.all(this.content.children.map(function (obj) {
			obj.hu = obj.children[3].getComponent(cc.Label);
			obj.xHu = obj.children[0].getComponent(cc.Sprite);
		}));
	},
	onEnable: function () {
		//this.panel.on(cc.Node.EventType.TOUCH_START, this.eventStart, this);
		//this.panel.on(cc.Node.EventType.TOUCH_MOVE, this.eventMove, this);
		//this.panel.on(cc.Node.EventType.TOUCH_END, this.eventEnd, this);
		//this.panel.on(cc.Node.EventType.TOUCH_CANCEL, this.eventEnd, this);
		//this.panel.on(cc.Node.EventType.MOUSE_ENTER, this.setTop, this);
		this.onChangerBet(null, "100");
	},
	onDisable: function () {
		//this.panel.off(cc.Node.EventType.TOUCH_START, this.eventStart, this);
		//this.panel.off(cc.Node.EventType.TOUCH_MOVE, this.eventMove, this);
		//this.panel.off(cc.Node.EventType.TOUCH_END, this.eventEnd, this);
		//this.panel.off(cc.Node.EventType.TOUCH_CANCEL, this.eventEnd, this);
		//this.panel.off(cc.Node.EventType.MOUSE_ENTER, this.setTop, this);
	},
	eventStart: function (e) {
		this.setTop();
		this.ttOffset = cc.v2(e.touch.getLocationX() - this.node.position.x, e.touch.getLocationY() - this.node.position.y)
		this.ttOffset2 = cc.v2(e.touch.getLocationX() - (e.touch.getLocationX() - this.node.position.x), e.touch.getLocationY() - (e.touch.getLocationY() - this.node.position.y))
	},
	eventMove: function (e) {
		this.node.position = cc.v2(e.touch.getLocationX() - this.ttOffset.x, e.touch.getLocationY() - this.ttOffset.y);
	},
	eventEnd: function (e) {
		cc.RedT.setting.topHu.position = this.node.position;
		this.xChanger = this.ttOffset2.x - (e.touch.getLocationX() - this.ttOffset.x)
		this.yChanger = this.ttOffset2.y - (e.touch.getLocationY() - this.ttOffset.y)
		if (this.xChanger < 5 &&
			this.xChanger > -5 &&
			this.yChanger < 5 &&
			this.yChanger > -5) {
			this.toggle();
		}
	},
	toggle: function () {
		cc.RedT.audio.playClick();
		this.body.active = cc.RedT.setting.topHu.open = !this.body.active;
		this.onChangerData();
	},
	onChangerCoint: function () {
		this.red = !this.red;
		this.nodeRed.active = !this.nodeRed.active;
		this.nodeXu.active = !this.nodeXu.active;
		this.onChangerData();
	},
	onChangerBet: function (e, value) {
		this.bet = value;
		this.header.children[0].children[0].getComponent(cc.Sprite).spriteFrame = this.spriteBetOFF[0];
		this.header.children[1].children[0].getComponent(cc.Sprite).spriteFrame = this.spriteBetOFF[1];
		this.header.children[2].children[0].getComponent(cc.Sprite).spriteFrame = this.spriteBetOFF[2];
		switch (value) {
			case "100":
				this.header.children[0].children[0].getComponent(cc.Sprite).spriteFrame = this.spriteBetON[0];
				break;
			case "1000":
				this.header.children[1].children[0].getComponent(cc.Sprite).spriteFrame = this.spriteBetON[1];
				break;
			case "10000":
				this.header.children[2].children[0].getComponent(cc.Sprite).spriteFrame = this.spriteBetON[2];
				break;
			default:
				break;
		}
		this.onChangerData();
	},
	onData: function (data) {
		cc.RedT.setting.topHu.data = data;
		if (this.body.active) {
			this.onChangerData();
		}
		this.onChangerGame();
	},
	onChangerData: function () {
		if (void 0 !== cc.RedT.setting.topHu.data) {
			var self = this;
			var dataName = [];
			Promise.all(this.content.children.map(function (obj) {
				var name = obj.name;
				var T = cc.RedT.setting.topHu.data[name].filter(function (temp) {
					return temp.type == self.bet && temp.red == self.red;
				});
				dataName[name] = obj;
				if (!T.length) {
					T[0] = { name: name, bet: 0 };
				} else {
					T[0].name = name;
				}
				return T[0];
			})).then(result => {
				var TT = result.sort(function (a, b) {
					return b.bet - a.bet;
				});
				Promise.all(TT.map(function (obj, index) {
					var temp = dataName[obj.name];
					temp.stopAllActions();
					var y = -(75 * (index + 1) - 37.5);
					temp.runAction(cc.moveTo(0.2, cc.v2(0, y)));
					if (helper.getOnlyNumberInString(temp.hu.string) - obj.bet !== 0) {
						helper.numberTo(temp.hu, helper.getOnlyNumberInString(temp.hu.string), obj.bet, 4900, true);
					}
					if (obj.balans > 0 && !!self.x[obj.x - 2]) {
						temp.xHu.node.active = true;
						temp.xHu.spriteFrame = self.x[obj.x - 2];
					} else {
						temp.xHu.node.active = false;
					}
				}));
			});
		}
	},
	onChangerGame: function () {
		this.RedT.MiniPoker.onGetHu();
		this.RedT.BigBabol.onGetHu();
		this.RedT.CaoThap.onGetHu();
		this.RedT.AngryBirds.onGetHu();
		if (void 0 !== cc.RedT.inGame.onGetHu) {
			cc.RedT.inGame.onGetHu();
		}
	},
	setTop: function () {
		this.node.parent.insertChild(this.node);
	},
});
