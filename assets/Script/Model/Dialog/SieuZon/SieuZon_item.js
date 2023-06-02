
cc.Class({
    extends: cc.Component,

    properties: {
        userName: cc.Label,
        userVip: cc.Label
    },
    setData: function(t) {
        this.userName.string = t.Name,
        this.userVip.string = t.VipPoint
    }
});
