
var Helper = require('Helper');

cc.Class({
	extends: cc.Component,

	properties: {
		date:     cc.Label,
		item:     cc.Prefab,
		content: cc.Node,
	},
	onLoad () {
		let date = new Date();
		this.date.string = Helper.numberPad(date.getDate(), 2) + '/' + Helper.numberPad(date.getMonth()+1, 2) + '/' + date.getFullYear();
		this.get_data();
	},
	get_data: function(){
		cc.RedT.send({g:{xs:{mb:{lastbet:this.date.string}}}});
	},	
	
	onData: function(data){
        this.content.removeAllChildren();
        var self = this;
        Promise.all(data.map(function(obj, index){
            var item = cc.instantiate(self.item);
            var itemComponent = item.getComponent('XoSo_last_item');
			itemComponent.ten.string  = obj.name;
			itemComponent.type.string   = self.getLoai(obj.type);
			itemComponent.so.string   = obj.so;
			itemComponent.time.string   = Helper.getStringDateByTime(obj.time);
			itemComponent.bet.string   = Helper.numberWithCommas(obj.cuoc);
            self.content.addChild(item);
        }))
    },
	getLoai: function(data){
		switch(data){
			case 'lo2':
				return 'Lô 2 Số'
				break;
			case 'lo21k':
				return 'Lô 2 Số 1k'
				break;
			case 'lo3':
				return 'Lô 3 Số'
				break;
			case 'lo4':
				return 'Lô 4 Số'
				break;
			case 'xien2':
				return 'Xiên 2'
				break;
			case 'xien3':
				return 'Xiên 3'
				break;
			case 'xien4':
				return 'Xiên 4'
				break;
			case 'de':
				return 'Đề'
				break;
			case 'daude':
				return 'Đầu Đề'
				break;
			case 'degiai7':
				return 'Đề Giải 7'
				break;
			case 'degiai1':
				return 'Đề Giải Nhất'
				break;
			case '3cang':
				return '3 Càng'
				break;
			case '4cang':
				return '4 Càng'
				break;
			case 'dau':
				return 'Đầu'
				break;
			case 'duoi':
				return 'Đuôi'
				break;
			case 'truot4':
				return 'Trượt 4'
				break;
			case 'truot8':
				return 'Trượt 8'
				break;
			case 'truot10':
				return 'Trượt 10'
				break;
		}
	},	
});
