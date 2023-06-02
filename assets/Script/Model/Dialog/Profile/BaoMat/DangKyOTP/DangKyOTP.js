var BrowserUtil = require('BrowserUtil');
var helper = require('Helper');

cc.Class({
 extends: cc.Component,

 properties: {
  phone: {
   default: null,
   type: cc.EditBox,
  },
  otp: {
   default: null,
   type: cc.EditBox,
  },
  labelMaVung: cc.Label,
  mavung: '',
  moreMaVung:  cc.Node,
  nodeReg: cc.Node,
  nodeInfo: cc.Node,
  labelPhone: cc.Label,
  labelPhone2: cc.Label,
  typeOTP: '',
 },
 onLoad() {
  var self = this;
  this.editboxs = [this.phone, this.otp];
  this.labelMaVung.string = "Chọn Mã Vùng !";
  this.keyHandle = function(t) {
   return t.keyCode === cc.macro.KEY.tab ? (self.changeNextFocusEditBox(),
    t.preventDefault && t.preventDefault(),
    !1) : t.keyCode === cc.macro.KEY.enter ? (BrowserUtil.focusGame(), self.onRegClick(),
    t.preventDefault && t.preventDefault(),
    !1) : void 0
  }
  var infoRed8 = JSON.parse(cc.sys.localStorage.getItem("infoRed8"));
  if (infoRed8) {
   this.labelPhone.string = infoRed8.phone;
   this.labelPhone2.string = infoRed8.phone;
  }
 },
 onEnable: function() {
  cc.sys.isBrowser && this.nodeReg.active && this.addEvent();
 },
 onDisable: function() {
  cc.sys.isBrowser && this.nodeReg.active && this.removeEvent();
  this.clear();
 },
 addEvent: function() {
  cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
  for (var t in this.editboxs) {
   if (this.editboxs[t])
    BrowserUtil.getHTMLElementByEditBox(this.editboxs[t]).addEventListener("keydown", this.keyHandle, !1)
  }
 },
 removeEvent: function() {
  cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
  for (var t in this.editboxs) {
   if (this.editboxs[t])
    BrowserUtil.getHTMLElementByEditBox(this.editboxs[t]).removeEventListener("keydown", this.keyHandle, !1)
  }
 },
 onKeyDown: function(event) {
  switch (event.keyCode) {
   case cc.macro.KEY.tab:
    this.isTop() && this.changeNextFocusEditBox();
    break;
   case cc.macro.KEY.enter:
    this.isTop() && this.onRegClick();
  }
 },
 changeNextFocusEditBox: function() {
  for (var t = !1, e = 0, i = this.editboxs.length; e < i; e++) {
   if (BrowserUtil.checkEditBoxFocus(this.editboxs[e])) {
    BrowserUtil.focusEditBox(this.editboxs[e]);
    t = !0;
    break
   }
  }!t && 0 < this.editboxs.length && BrowserUtil.focusEditBox(this.editboxs[0]);
 },
 isTop: function() {
  return !cc.RedT.inGame.notice.node.active && !cc.RedT.inGame.loading.active;
 },
 MaVungselect: function(event, select){
  this.mavung = select;
        event.target.parent.children.forEach(function(obj){
            if (obj.name === select) {
                obj.children[0].active = true;
                this.labelMaVung.string = obj.children[1].getComponent(cc.Label).string;
            }else{
                obj.children[0].active = false;
            }
            this.moreMaVung.active = false;
        }.bind(this));
 },
 toggleMaVung: function(){
        this.moreMaVung.active = !this.moreMaVung.active;
    },
 onOTPClick: function() {
  if (!helper.checkPhoneValid(this.phone.string)){
    cc.RedT.inGame.notice.show({title: 'LỖI!',text: 'Số điện thoại không hợp lệ.'});
  }else if (this.mavung === '0'){
    cc.RedT.inGame.notice.show({title: 'LỖI!',text: 'Bạn chưa chọn mã vùng.'});
  } else {
    cc.RedT.send({user: {security: {OTPTele: {phone:this.phone.string, mavung:this.mavung}}}});
  }
 },
 changerTypeOTP: function(e){
     this.typeOTP = e.node.name;
 },
 onGetOTP: function() {
 	console.log('phone: ' + this.phone.string + ' ' + 'type:' + this.typeOTP + ' ' + 'mã vùng:' + this.labelMaVung.string);
  if (!helper.checkPhoneValid(this.phone.string)) {
   cc.RedT.inGame.notice.show({
    title: 'LỖI!',
    text: 'Số điện thoại không đúng định dạng'
   });
  } else {
   if (this.typeOTP == 1)
   {
    cc.RedT.send({
     user: {
      security: {
        sendOTP: {phone: this.phone.string, mavung:this.mavung, type: this.typeOTP}
      }
     }
    });
    this.onTaiTeleClick();
	}
   else
   {
    cc.RedT.send({
     user: {
      security: {
        sendOTP: {phone: this.phone.string, mavung:this.mavung, type: this.typeOTP}
      }
     }
    });
}
  }
 },
 onTaiTeleClick: function(){
  cc.sys.openURL("https://t.me/men88OTP_bot");
  this.labelMaVung.string = "Chọn Mã Vùng !";
 },
 onRegClick: function() {
  

  if (!helper.checkPhoneValid(this.phone.string) || helper.isEmpty(this.otp.string) || this.otp.string.length != 4) {
   cc.RedT.inGame.notice.show({title: 'LỖI!',text: 'Bạn nhập không đúng thông tin'});
}else{
   // Send
   cc.RedT.send({user: {security: {regOTP: {phone: this.phone.string, mavung:this.mavung, otp: this.otp.string}}}});
   
}},
 clear: function() {
  if (this.phone)
   this.phone.string = "";
 if (this.mavung)
   this.mavung = "0";
  if (this.otp)
   this.otp.string = "";
 },
 statusOTP: function(status) {
  this.nodeReg.active = !status;
  this.nodeInfo.active = status;
 },
});
