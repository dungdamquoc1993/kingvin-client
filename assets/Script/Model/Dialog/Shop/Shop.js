
var Bank = require('Bank');

cc.Class({
	extends: cc.Component,

	properties: {
		header: {
			default: null,
			type: cc.Node,
		},
		NapRIK: {
			default: null,
			type: cc.Node,
		},
		Banking: {
			default: null,
			type: cc.Node,
		},
		NapRed: {
			default: null,
			type: cc.Node,
		},
		TieuRed: {
			default: null,
			type: cc.Node,
		},
		ChuyenRed: {
			default: null,
			type: cc.Node,
		},
		Momo: {
			default: null,
			type: cc.Node
		},
		DaiLy: {
			default: null,
			type: cc.Node
		},
		Bank: Bank,
	},
	init() {
		this.NapRed = this.NapRed.getComponent('NapRed');
		this.TieuRed = this.TieuRed.getComponent('TieuRed');
		this.ChuyenRed = this.ChuyenRed.getComponent('ChuyenRed');
		this.Momo = this.Momo.getComponent('MomoController');
		this.Banking = this.Banking.getComponent('BankingController');
		this.NapRIK = this.NapRIK.getComponent('NapRIK');

		this.NapRed.init();
		this.TieuRed.init();
		this.ChuyenRed.init();
		this.Bank.init();
		this.Momo.init();
		this.NapRIK.init();
		this.Banking.init();

		this.body = [this.NapRed, this.NapRIK, this.TieuRed, this.ChuyenRed, this.Momo, this.Bank, this.Banking];
		Promise.all(this.header.children.map(function (obj) {
			return obj.getComponent('itemHeadMenu');
		}))
			.then(result => {
				this.header = result;
			});
	},
	onSelectHead: function (event, name) {
		Promise.all(this.header.map(function (header) {
			if (header.node.name == name) {
				header.select();
			} else {
				header.unselect();
			}
		}));
		Promise.all(this.body.map(function (body) {
			if (body.node.name == name) {
				body.node.active = true;
			} else {
				body.node.active = false;
			}
		}));
	},
	showDaiLy: function (){
		this.node.active = false;
		cc.RedT.inGame.dialog.showDaiLy();

	},
	superView: function (name) {
		if (name == "NapRIK" || name == "Thecao" || name == "Momo" || name == "Banking") {
			this.onSelectHead(null, "NapRIK");
			if (name != "NapRIK") this.NapRIK.onSelectHead(null, name);
		} else if (name == "TieuRed" || name == "RutBank" || name == "MuaTheNap") {
			this.onSelectHead(null, "TieuRed");
			if (name != "TieuRed") this.TieuRed.onSelectHead(null, name);
		} else if (name == "ChuyenRed") {
			this.onSelectHead(null, "ChuyenRed");
			this.ChuyenRed.onSelectHead(null, "ChuyenRed_DaiLy");
		}
	},
	onData: function (data) {
		if (void 0 !== data.nap_red) {
			this.NapRed.onData(data.nap_red);
		}
		if (void 0 !== data.mua_the_nap) {
			this.TieuRed.MuaTheCao.onData(data.mua_the_nap);
		}
		if (!!data.bank) {
			this.TieuRed.onData(data.bank);
		}
		if (void 0 !== data.chuyen_red) {
			this.ChuyenRed.onData(data.chuyen_red);
		}
		if (!!data.bank) {
			this.Bank.onData(data.bank);
		}
		if (void 0 !== data.daily) {
			this.ChuyenRed.onDaiLy(data.daily);
		}
		if(void 0 !== data.momo) {
			this.Momo.onData(data.momo);
		}
		if(void 0 !== data.banking) {
			this.Banking.onData(data.banking);
		}
	},
});
