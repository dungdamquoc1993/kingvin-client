var BrowserUtil = require('BrowserUtil');
var helper      = require('Helper');

cc.Class({
	extends: cc.Component,

	properties: {
		tenNv: {
			default: null,
			type: cc.Label
		},
		noidung: {
			default: null,
			type: cc.Label
		},
		tientrinh: {
			default: null,
			type: cc.Label
		},
		phanthuong: {
			default: null,
			type: cc.Label
		},
		dieukien: "",
		tiendo: "",
		ID: "",
		testphanthuong: "",
		info: "",
	},
	init: function (obj, info, data) {
		this.controll = obj;
		this.info = info;
		this.dieukien = info.dieukien;
		this.testphanthuong = info.phanthuong;
		this.tiendo = data.userInfo.tWinRed;
		this.tenNv.string = info.tennv;
		this.noidung.string = info.noidung;
		this.ID = info.id;
		this.phanthuong.string = helper.numberWithCommas(this.testphanthuong);
		if (this.tiendo > this.dieukien) {
			//this.button.node.color.fromHEX('#E2E2E2');
			this.tientrinh.string = '(' + helper.numberWithCommas(this.dieukien) + '/' + helper.numberWithCommas(this.dieukien) + ')';
		}
		else{
			this.tientrinh.string = '(' + helper.numberWithCommas(this.tiendo) + '/' + helper.numberWithCommas(this.dieukien) + ')';
		}
		// body...
	},
	onNhanThuong: function () {
		cc.RedT.audio.playClick();
		if (this.tiendo < this.dieukien) {
			cc.RedT.inGame.notice.show({title:"NHIỆM VỤ", text:'Chưa đủ điều kiện để nhận thưởng'});
		}
		else{
			cc.RedT.send({nhanthuong:this.info});
		}
		
		//cc.log('Nhận thưởng: ' + this.phanthuong.string + 'đ');
	},
});
