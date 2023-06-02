var BrowserUtil = require('BrowserUtil');
var helper = require('Helper');

cc.Class({
	extends: cc.Component,

	properties: {
		sImage: [cc.SpriteFrame],
		Image: cc.Sprite,
		btnNap: cc.Node,
		btnNhan: cc.Node,
		tientrinh: {
			default: null,
			type: cc.Label
		},
		per: {
			default: null,
			type: cc.Label
		},
		progress: {
			default: null,
			type: cc.ProgressBar
		},
	},
	init: function (obj, info, index) {
		this.controll = obj;
		this.info = info;
		//console.log(info);

		var phantram = (info.current / info.totalAchive);
		this.updateProgress(phantram);
		this.per.string = ((phantram*100)>>0) + '%';
		if (info.active) {
			this.btnNhan.active = true;
			this.btnNap.active = false;
		} else {
			this.btnNap.active = true;
			this.btnNhan.active = false;
		}

		this.type = info.type;

		this.Image.spriteFrame = this.sImage[(info.type - 1) >> 0];

		this.tientrinh.string = '(' + helper.numberWithCommas(info.current) + '/' + helper.numberWithCommas(info.totalAchive) + ')';
		// body...
	},
	updateProgress: function (progress) {
		this.progress.progress = progress;
	},
	onNhanThuong: function () {
		cc.RedT.send({ user: { mission: { nhanthuong: this.type } } });
	},
	onNap: function () {
		cc.RedT.inGame.dialog.onClickBack();		
		cc.RedT.inGame.dialog.showShop(null, "NapRIK");
	},
});
