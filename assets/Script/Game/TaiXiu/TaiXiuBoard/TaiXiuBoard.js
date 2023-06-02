
var helper = require('Helper');

cc.Class({
	extends: cc.Component,

	properties: {
        nodeChonTien: {
            default: null,
            type:    cc.Node
        },
        nodeChonSo: {
            default: null,
            type:    cc.Node
        },
	},
	init (obj) {
		this.RedT = obj;
	},
	ChonTienClick: function(event, value) {
		this.RedT.input.string = helper.numberWithCommas(helper.getOnlyNumberInString(this.RedT.input.string)*1+value*1);
	},
	ChonSoClick: function(event, value) {
		this.RedT.input.string = helper.numberWithCommas(helper.getOnlyNumberInString(this.RedT.input.string+value));
	},
	onBackClick: function(){
		var number = helper.getOnlyNumberInString(this.RedT.input.string);
		this.RedT.input.string = helper.numberWithCommas(number.slice(0, number.length-1));
	},
	onCleanClick: function(){
		this.RedT.input.string = "";
	},
	onAllClick: function(){
		this.RedT.input.string = helper.numberWithCommas(this.RedT.red ? cc.RedT.user.red : cc.RedT.user.xu);
	},
	onChangerTypeClick: function(){
		if (this.nodeChonTien.active) {
			this.nodeChonTien.active = false;
			this.nodeChonSo.active = true;
		}else{
			this.nodeChonSo.active = false;
			this.nodeChonTien.active = true;
		}
	},
	onCuocClick: function(){
	},
	onCloseClick: function(){
		this.node.active = false;
		this.RedT.input.string = this.RedT.RedT.board ? '' : 'Đặt cược';
	},
});
