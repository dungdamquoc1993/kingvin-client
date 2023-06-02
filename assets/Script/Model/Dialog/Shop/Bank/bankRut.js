
var BrowserUtil = require('BrowserUtil');
var helper      = require('Helper');

cc.Class({
    extends: cc.Component,

    properties: {
		labelBank:   cc.Label,
        tenNganHang: cc.EditBox,
		edbNumber: cc.EditBox,
        moreBank: cc.Node,
        scrollviewBank: {
            default: null,
            type: cc.ScrollView,
        },
        editNumber: cc.EditBox,
        editName:   cc.EditBox,
        editRut:    cc.EditBox,
        editOTP:    cc.EditBox,
        typeOTP: '',
        prefab: {
            default: null,
            type: cc.Prefab,
        },
		isLoad: false,
    },
    init(){
        var self = this;
	this.editboxs = [this.editNumber, this.editName, this.editRut,]; //this.editOTP];
        this.keyHandle = function(t) {
            return t.keyCode === cc.macro.KEY.tab ? (self.isTop() && self.changeNextFocusEditBox(),
                t.preventDefault && t.preventDefault(),
                !1) : t.keyCode === cc.macro.KEY.enter ? (BrowserUtil.focusGame(), self.onNapClick(),
                t.preventDefault && t.preventDefault(),
                !1) : void 0
        }
    },

    onEnable: function () {
        if(!this.isLoad) {
            cc.RedT.send({shop:{bank:{list:true}}});
        }
        cc.sys.isBrowser && this.addEvent();
    },
    onDisable: function () {
		this.moreBank.active = false;
        cc.sys.isBrowser && this.removeEvent();
        this.clean();
    },
    addEvent: function() {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        for (var t in this.editboxs) {
            BrowserUtil.getHTMLElementByEditBox(this.editboxs[t]).addEventListener("keydown", this.keyHandle, !1)
        }
    },
    removeEvent: function() {
        for (var t in this.editboxs) {
            BrowserUtil.getHTMLElementByEditBox(this.editboxs[t]).removeEventListener("keydown", this.keyHandle, !1)
        }
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    },
    onKeyDown: function (event) {
        switch(event.keyCode) {
            case cc.macro.KEY.tab:
                this.isTop() && this.changeNextFocusEditBox();
                break;
            case cc.macro.KEY.enter:
                this.isTop() && this.onNapClick();
        }
    },
    changeNextFocusEditBox: function() {
        for (var t = !1, e = 0, i = this.editboxs.length; e < i; e++){
            if (BrowserUtil.checkEditBoxFocus(this.editboxs[e])) {
                BrowserUtil.focusEditBox(this.editboxs[e]);
                t = !0;
                break
            }
        }
        !t && 0 < this.editboxs.length && BrowserUtil.focusEditBox(this.editboxs[0]);
    },
    isTop: function() {
        return !this.moreBank.active && !cc.RedT.inGame.notice.node.active && !cc.RedT.inGame.loading.active;
    },
    clean: function(){
        this.editNumber.string = this.editName.string = this.editRut.string = this.editOTP.string = '';
    },
    toggleMoreBank: function(){
        this.moreBank.active = !this.moreBank.active;
    },
    onData: function(data){
		//console.log("rut bank: " + JSON.stringify(data));
        this.isLoad = true;
        let self = this;
        if (data.length > 0) {
            Promise.all(data.map(function(obj, index){
                let item = cc.instantiate(self.prefab);
                let componentLeft = item.getComponent('NapRed_itemOne');
                componentLeft.init(self, 'i_arg', 'labelBank', 'toggleMoreBank')
                componentLeft.text.string = obj.bank;
                self.scrollviewBank.content.addChild(item);
                componentLeft.data = obj;
                return componentLeft;
            }))
            .then(result => {
                this['i_arg'] = result;
            })
        }
    },
    backT: function(data){
        this.tenNganHang.string = data.string;
    },
    onClickOTP: function(){
        cc.RedT.send({otp:{type:this.typeOTP}});
    },
    changerTypeOTP: function(e){
        this.typeOTP = e.node.name;
    },
    onChangerRed: function(value = 0){
        value = helper.numberWithCommas(helper.getOnlyNumberInString(value));
        this.editRut.string = value == 0 ? "" : value;
    },
    onClick: function(){
        var error = null;
        if (helper.isEmpty(this.tenNganHang.string)) {
            cc.RedT.inGame.notice.show({title:"RÚT TIỀN", text: "Vui lòng chọn ngân hàng."});
        }else if(helper.isEmpty(this.editNumber.string)){
			cc.RedT.inGame.notice.show({title:"RÚT TIỀN", text: "Vui lòng nhập số tài khoản."});
		}else if(helper.isEmpty(this.editName.string)){
			cc.RedT.inGame.notice.show({title:"RÚT TIỀN", text: "Vui lòng nhập tên tài khoản."});
		}else if(helper.isEmpty(this.editRut.string)){
			cc.RedT.inGame.notice.show({title:"RÚT TIỀN", text: "Vui lòng nhập số tiền rút."});
		}else if(helper.isEmpty(this.editOTP.string)){    
			cc.RedT.inGame.notice.show({title:"RÚT TIỀN", text: "Bạn chưa nhập otp."});
		}else {
            cc.RedT.send({shop:{bank:{rut:{
                bank:this.tenNganHang.string,
                number:this.editNumber.string,
                name:this.editName.string,
                branch:"Sai Gon",
                rut:helper.getOnlyNumberInString(this.editRut.string),
                otp:this.editOTP.string,
                code:this.editOTP.string,
            }}}});
        }
    },
});
