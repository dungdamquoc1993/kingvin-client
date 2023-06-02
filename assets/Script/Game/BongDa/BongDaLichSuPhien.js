var helper = require('Helper');

cc.Class({
    extends: cc.Component,

    properties: {
        itemPrefab: cc.Prefab,
		prefabNotice: cc.Prefab,
		notice: cc.Node,
		buttonCuoc: cc.Node,
		labelCountdown: cc.Label,
		labelPhien: cc.Label,
		labelStatus: cc.Label,
        labelDoiBong: [cc.Label],
		labelTyLe: [cc.Label],
		labelTongCuoc: [cc.Label],
		labelBanCuoc: [cc.Label],
		labelNameDialog: [cc.Label],
		labelTyLeDialog: [cc.Label],
		DialogCuoc: cc.Node,
		toggleSelectDoi1: cc.Toggle,
        toggleSelectDoi2: cc.Toggle,
		toggleSelectHoa: cc.Toggle,
		editBoxTienCuoc: cc.EditBox,
        scrollViewLeft: cc.ScrollView,
        scrollViewCenter: cc.ScrollView,
		scrollViewRight: cc.ScrollView,
    },

    init(){
		//this.RedT = obj;
		this.isLoaded = false;
        var self = this;
		
		
	},
	onEnable: function() {
		var self = this;
		this.DialogCuoc.active = false;
		self.scrollViewLeft.content.removeAllChildren(); //remove all children	
		self.scrollViewCenter.content.removeAllChildren(); //remove all children	
		self.scrollViewRight.content.removeAllChildren(); //remove all children
			
	},
	onLog: function(data) {
		var self = this;
		self.scrollViewLeft.content.removeAllChildren(); //remove all children	
		self.scrollViewCenter.content.removeAllChildren(); //remove all children	
		self.scrollViewRight.content.removeAllChildren(); //remove all children
		
		this.labelTongCuoc[0].string = helper.numberWithCommas(data.tong_L);
		this.labelBanCuoc[0].string = helper.numberWithCommas(data.tong_bancuoc_L);
		this.labelTongCuoc[2].string = helper.numberWithCommas(data.tong_R);
		this.labelBanCuoc[2].string = helper.numberWithCommas(data.tong_bancuoc_R);
		this.labelTongCuoc[1].string = helper.numberWithCommas(data.tong_C);
		this.labelBanCuoc[1].string = helper.numberWithCommas(data.tong_bancuoc_C);

		Promise.all(data.dataL.map(function(obj){
			var item = cc.instantiate(self.itemPrefab)
			var itemComponent = item.getComponent('BongDaLichSuPhien_item')
			itemComponent.time.string = helper.getStringHourByTime(obj.time)
			itemComponent.user.string   = obj.name
			itemComponent.cuoc.string   = helper.numberWithCommas(obj.bet)
			self.scrollViewLeft.content.addChild(item)
		}))
		Promise.all(data.dataC.map(function(obj){
			var item = cc.instantiate(self.itemPrefab)
			var itemComponent = item.getComponent('BongDaLichSuPhien_item')
			itemComponent.time.string = helper.getStringHourByTime(obj.time)
			itemComponent.user.string   = obj.name
			itemComponent.cuoc.string   = helper.numberWithCommas(obj.bet)
			self.scrollViewCenter.content.addChild(item)
		}))
		Promise.all(data.dataR.map(function(obj){
			var item = cc.instantiate(self.itemPrefab)
			var itemComponent = item.getComponent('BongDaLichSuPhien_item')
			itemComponent.time.string = helper.getStringHourByTime(obj.time)
			itemComponent.user.string   = obj.name
			itemComponent.cuoc.string   = helper.numberWithCommas(obj.bet)
			self.scrollViewRight.content.addChild(item)
		}))
    },
	onInfo: function(data) {
		var self = this;
		this.phien = data.phien;
		
		this.data = data;
		self.labelPhien.string = '#' + data.phien.toString();
		
		if(data.status == true && data.ketqua != ''){
			this.labelStatus.string = 'KẾT QUẢ:';
			this.labelCountdown.string = data.ketqua;
			this.buttonCuoc.active = false;
		}else{
			this.labelStatus.string = 'KẾT THÚC SAU:';
			this.buttonCuoc.active = true;
		}

		self.labelNameDialog[0].string = data.team1
		self.labelNameDialog[1].string = data.team2

		self.labelTyLeDialog[0].string = '1 ĂN ' + data.team1win;
		self.labelTyLeDialog[1].string = '1 ĂN ' + data.hoa;
		self.labelTyLeDialog[2].string = '1 ĂN ' + data.team2win;

		self.labelDoiBong[0].string = data.team1;
		self.labelDoiBong[1].string = data.team2;
		
		self.labelTyLe[0].string = data.team1 + ' | 1 ĂN ' + data.team1win;
		self.labelTyLe[1].string = 'HÒA | 1 ĂN ' + data.hoa;
		self.labelTyLe[2].string = data.team2 + ' | 1 ĂN ' + data.team2win;
		
    },
	update (dt) {
		// Đích đến

		var countDownDate = new Date();
		var gio = this.data.date*1;
		var phut = this.data.phut*1;
			countDownDate.setHours(gio,phut,0,0);
		countDownDate = countDownDate.getTime();
		// Lấy thời gian hiện tại
		var now = new Date().getTime();
	 
		// Lấy số thời gian chênh lệch
		var distance = countDownDate - now;
	 
		// Tính toán số ngày, giờ, phút, giây từ thời gian chênh lệch
		var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
		var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
		var seconds = Math.floor((distance % (1000 * 60)) / 1000);
	 
		// HIển thị chuỗi thời gian trong thẻ p
		if (this.data.status == false) {
			this.labelCountdown.string = helper.numberPad(hours, 2) + ':' + helper.numberPad(minutes, 2) + ':' + helper.numberPad(seconds, 2);
		}

	},
	onData: function(data) {
		if (!!data.log) {
			cc.log(data.log);
			//this.onLog(data.log);
		}
		if (!!data.info) {
			//cc.log(data.info);
		}
    },
	onClean: function(){
		this.toggleSelectDoi1.isChecked = false;
		this.toggleSelectDoi2.isChecked = false;
		this.toggleSelectHoa.isChecked = false;
		
		this.editBoxTienCuoc.string = '';
	},
	onAccept: function(){
		if (this.SelectOne == false && this.SelectTwo == false && this.SelectThree == false) {
			cc.RedT.inGame.notice.show({title:"DUBAI BET", text:'Chọn ít nhất một cửa để đặt cược!'});
		}else if(helper.isEmpty(this.editBoxTienCuoc.string)) {
			cc.RedT.inGame.notice.show({title:"DUBAI BET", text:'Vui lòng nhập tiền cược!'});
		}
		else if(helper.getOnlyNumberInString(this.editBoxTienCuoc.string) < 1000){
			cc.RedT.inGame.notice.show({title:"DUBAI BET", text:'Tiền cược phải ít nhất 1.000 XU!'});
		}
		cc.RedT.send({g:{bongda:{cuoc:{phien:this.phien, bet:helper.getOnlyNumberInString(this.editBoxTienCuoc.string), SelectOne:this.SelectOne, SelectTwo:this.SelectTwo, SelectThree:this.SelectThree}}}});
	},
	addNotice:function(text){
		var notice = cc.instantiate(this.prefabNotice)
		var noticeComponent = notice.getComponent('mini_warning')
		noticeComponent.text.string = text;
		this.notice.addChild(notice);
	},
	onClickCuoc: function(params) {
		//Mở dialog Cược
		this.DialogCuoc.active = true;
		this.SelectOne = false;
		this.SelectTwo = false;
		this.SelectThree = false;
		
	},
	onClickCancel: function(params) {
		//Tắt dialog cược
		this.DialogCuoc.active = false;
		this.onClean();
	},
	onChangerInput: function(){
		var value = helper.numberWithCommas(helper.getOnlyNumberInString(this.editBoxTienCuoc.string));
		this.editBoxTienCuoc.string = value == "0" ? "" : value;
	},
	onRadioClick: function(event, params){
		if (params == 'Doi1') {
			let toggle = event.node.getComponent(cc.Toggle);
			this.onSelectOne(toggle.isChecked);
		} else if (params == 'Doi2') {
			let toggle = event.node.getComponent(cc.Toggle);
			this.onSelectTwo(toggle.isChecked);
		}
		else{
			let toggle = event.node.getComponent(cc.Toggle);
			this.onSelectThree(toggle.isChecked);
		}
	},
	onSelectOne: function (isStart) {
        this.toggleSelectDoi1.isChecked = isStart;
		if (isStart) {
			//cc.log('Chọn đội 1');
			this.SelectOne = true;
		}else{
			this.SelectOne = false;
		}
    },
	onSelectTwo: function (isStart) {
        this.toggleSelectDoi2.isChecked = isStart;
		if (isStart) {
			//cc.log('Chọn đội 2');
			this.SelectTwo = true;
		}else{
			this.SelectTwo = false;
		}
    },
	onSelectThree: function (isStart) {
        this.toggleSelectHoa.isChecked = isStart;
		if (isStart) {
			//cc.log('Chọn Hòa');
			this.SelectThree = true;
		}else{
			this.SelectThree = false;
		}
    },

});
