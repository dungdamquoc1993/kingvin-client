var BrowserUtil = require('BrowserUtil');
var helper      = require('Helper');

cc.Class({
	extends: cc.Component,

	properties: {
		TenDoiBong: [cc.Label],
		TrangThai: cc.Label,
		NguoiThamGia: cc.Label,
		KetQua: cc.Label,
	},
	init: function (obj, data, index) {
		this.controll = obj;
		this.data = data;
		this.TenDoiBong[0].string = data.team1;
		this.TenDoiBong[1].string = data.team2;
		
		if (data.status) {
			this.TrangThai.string = 'ĐÃ KẾT THÚC';
			this.KetQua.string = 'KẾT QUẢ: ' + data.ketqua;
			this.TrangThai.node.color = cc.Color.RED;
		}
		else
		{
			this.KetQua.string = '';
			this.TrangThai.string = 'ĐANG DIỄN RA';
			this.TrangThai.node.color = cc.Color.CYAN;
		};
		
		
		this.NguoiThamGia.string = '99';
		// body...
	},
	onThamGia: function () {
		cc.RedT.audio.playClick();
		cc.RedT.MiniPanel.Dialog.showBongDaLichSuPhien();
		cc.RedT.MiniPanel.Dialog.BongDaLichSuPhien.onInfo(this.data);
		cc.RedT.send({g:{bongda:{getphien:this.data.phien}}});
	},
	onChiTiet: function(){
		cc.RedT.audio.playClick();
		cc.RedT.MiniPanel.Dialog.showBongDaChiTiet();
		cc.RedT.MiniPanel.Dialog.BongDaChiTiet.onData(this.data.giaidau);
	},
	onKetQua: function(){
		cc.RedT.audio.playClick();
		cc.RedT.MiniPanel.Dialog.showBongDaChiTiet();
		cc.RedT.MiniPanel.Dialog.BongDaChiTiet.onDienbien(this.data.dienbien);
	},
});
