
var BrowserUtil = require('BrowserUtil');
var helper      = require('Helper');

cc.Class({
    extends: cc.Component,

    properties: {
        header:    cc.Node,
        body:    cc.Node,
        LabelName: {
            default: [],
            type: cc.Label
        },
        LabelPoint: {
            default: [],
            type: cc.Label
        },
        LabelGiaiThuong: {
            default: [],
            type: cc.Label
        },
        LabelGiaTri: {
            default: [],
            type: cc.Label
        },
        userRank: cc.Label,
        userVIP: cc.Label,
        Time: cc.Label,
        onLoadData: !1
    },
    init: function(t) {
        var e = this;
        Promise.all(this.header.children.map(function(t) {
            return t.getComponent("itemContentMenu")
        })).then(function(t) {
            e.header = t
        });
    },
    onData: function(t) {
        if (!!t.top.length) {
            this.userRank.string = t.user.UserRank;
            this.userVIP.string = t.user.VipPoint;
            for (let i = 0; i < t.top.length; i++) {
                this.LabelName[i].string = t.top[i].Name;
                this.LabelPoint[i].string = t.top[i].VipPoint;
                this.LabelGiaiThuong[i].string = t.reward[i].giaithuong;
                this.LabelGiaTri[i].string = t.reward[i].giatri;
            }
        }
    },
    onSelectHeader: function(event, name){
        Promise.all(this.header.children.map(function(header) {
            if (header.name == name) {
                header.active = true;

            }else{
                //header.active = false;
            }
        }));
        Promise.all(this.body.children.map(function(body) {
            if (body.name == name) {
                body.active = true;
            }else{
                body.active = false;
            }
        }));
    },
    onClickClose: function() {
        cc.RedT.audio.playClick(),
        cc.RedT.dialog.onBack()
    }
});
