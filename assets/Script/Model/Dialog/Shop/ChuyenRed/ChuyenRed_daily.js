
cc.Class({
	extends: cc.Component,

	properties: {
		bg: {
			default: null,
			type: cc.Node
		},
		STT: {
			default: null,
			type: cc.Label
		},
		DaiLy: {
			default: null,
			type: cc.Label
		},
		NICKNAME: {
			default: null,
			type: cc.Label
		},
		Phone: {
			default: null,
			type: cc.Label
		},
		Location: {
			default: null,
			type: cc.Label
		},
		FB: "",
	},
	init: function (obj, data, index) {
		this.controll = obj;
		this.STT.string = index + 1;
		this.DaiLy.string = data.name;
		this.NICKNAME.string = data.nickname;
		this.Phone.string = data.phone;
		this.Location.string = data.location;
		this.FB = "" + data.fb;
		// body...
	},
	onChuyenClick: function () {
		cc.RedT.audio.playClick();
		this.controll.selectDaiLy(this);
	},
	onFBClick: function () {
		cc.sys.openURL(this.FB);
		// window.open(this.FB, '_blank');
	},
});
