
cc.Class({
	extends: cc.Component,

	properties: {
		panel: {
			default: null,
			type: cc.Node
		},
	},
	onLoad () {
		this.ttOffset     = null;
		this.ttOffset2    = null;
		this.toggleRuning = false;
	},
	onEnable: function () {
		this.panel.on(cc.Node.EventType.TOUCH_START,  this.eventStart, this);
		this.panel.on(cc.Node.EventType.TOUCH_MOVE,   this.eventMove,  this);
		this.panel.on(cc.Node.EventType.TOUCH_END,    this.eventEnd,   this);
		this.panel.on(cc.Node.EventType.TOUCH_CANCEL, this.eventEnd,   this);
	},
	onDisable: function () {
		this.panel.off(cc.Node.EventType.TOUCH_START,  this.eventStart, this);
		this.panel.off(cc.Node.EventType.TOUCH_MOVE,   this.eventMove,  this);
		this.panel.off(cc.Node.EventType.TOUCH_END,    this.eventEnd,   this);
		this.panel.off(cc.Node.EventType.TOUCH_CANCEL, this.eventEnd,   this);
	},
	eventStart: function(e){
		this.ttOffset  = cc.v2(e.touch.getLocationX() - this.node.position.x, e.touch.getLocationY() - this.node.position.y)
		this.ttOffset2 = cc.v2(e.touch.getLocationX() - (e.touch.getLocationX() - this.node.position.x), e.touch.getLocationY() - (e.touch.getLocationY() - this.node.position.y))
	},
	eventMove: function(e){
		this.node.position = cc.v2(e.touch.getLocationX() - this.ttOffset.x, e.touch.getLocationY() - this.ttOffset.y)
	},
	eventEnd: function(e){
		this.xChanger = this.ttOffset2.x - (e.touch.getLocationX() - this.ttOffset.x)
		this.yChanger = this.ttOffset2.y - (e.touch.getLocationY() - this.ttOffset.y)
		if (this.xChanger <  5 &&
			this.xChanger > -5 &&
			this.yChanger <  5 &&
			this.yChanger > -5) {
			this.toggle()
		}
	},
	toggle: function() {
		if (cc.RedT.IS_LOGIN) {
			cc.RedT.inGame.loading.active = true;
			cc.RedT.send({sieuzon: {data: "Show"}})
		} else {
			cc.RedT.inGame.dialog.showSignIn();
		}
        
	},
});
