
cc.Class({
    extends: cc.Component,

    properties: {
        editOTP: cc.EditBox,
        thongtin: cc.Node,
        xoasdt: cc.Node
    },
    onload() {
        this.thongtin.active = true;
        this.xoasdt.active = false;
    },
    onClickXoa: function() {
        this.xoasdt.active = true;
        this.thongtin.active = false;
    },
    onSubmit: function(){
        cc.RedT.send({user: {security: {delete: {otp:this.editOTP.string}}}});
    },
    onClickOTP: function(){
		cc.RedT.send({otp:{type: 1}});
	},
});
