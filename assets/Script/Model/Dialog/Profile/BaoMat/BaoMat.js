var DangKyOTP = require('DangKyOTP'),
    DoiMatKhau = require('DoiMatKhau');
cc.Class({
    extends: cc.Component,

    properties: {
        header: {
            default: null,
            type: cc.Node,
        },
        DangKyOTP: DangKyOTP,
        DoiMatKhau: DoiMatKhau,
    },
    init() {
        this.body = [this.DangKyOTP.node, this.DoiMatKhau.node];
        Promise.all(this.header.children.map(function(obj) {
                return obj.getComponent('itemContentMenu');
            }))
            .then(result => {
                this.header = result;
            });
    },
    onSelectHead: function(event, name) {
        Promise.all(this.header.map(function(header) {
            if (header.node.name == name) {
                header.select();
            } else {
                header.unselect();
            }
        }));
        Promise.all(this.body.map(function(body) {
            if (body.name == name) {
                body.active = true;
            } else {
                body.active = false;
            }
        }));
        if (name == 'DangKyOTP') {
            //var infoRed8 = JSON.parse(cc.sys.localStorage.getItem("infoRed8"));
            //this.DangKyOTP.statusOTP(!!infoRed8.phone);
        }
    },
});