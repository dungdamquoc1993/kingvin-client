
var helper = require('Helper');

cc.Class({
	extends: cc.Component,

	properties: {
		nodeEfLine: cc.Node,
		nodeLine:   cc.Node,
		mainLine:   cc.Node,
	},
	init: function(obj){
		this.lines = {
			'1':  [1,1,1,1,1],
			'2':  [0,0,0,0,0],
			'3':  [2,2,2,2,2],
			'4':  [2,1,0,1,2],
			'5':  [0,1,2,1,0],
			'6':  [1,0,0,0,1],
			'7':  [1,2,2,2,1],
			'8':  [0,0,1,2,2],
			'9':  [2,2,1,0,0],
			'10': [1,0,1,2,1],
			'11': [1,2,1,0,1],
			'12': [0,1,1,1,0],
			'13': [2,1,1,1,2],
			'14': [0,1,0,1,0],
			'15': [2,1,2,1,2],
			'16': [1,1,0,1,1],
			'17': [1,1,2,1,1],
			'18': [0,0,2,0,0],
			'19': [2,2,0,2,2],
			'20': [0,2,2,2,0],
			'21': [2,0,0,0,2],
			'22': [1,0,2,0,1],
			'23': [1,2,0,2,1],
			'24': [0,2,0,2,0],
			'25': [2,0,2,0,2],
		};
		this.RedT = obj;
		var self = this;;
		Promise.all(this.mainLine.children.map(function(line){
			return line.getComponent('MyNhan_iline')
					.init(self.RedT);
		}))
		.then(result => {
			this.mainLine = result;
		});
		this.selectAll(null, "1");
	},
	onOpen: function(){
		cc.RedT.audio.playClick();
		this.node.active = true;
	},
	onClose: function(){
		cc.RedT.audio.playUnClick();
		if (this.node.active && this.data.length < 1) {
			this.RedT.addNotice('Chọn ít nhất 1 dòng');
		}else{
			this.node.active = false;
		}
	},
	select: function(e) {
		var node = e.target;
		if (node.children[0].active) {
			node.children[0].active = false;
			node.children[1].active = true;
		}else{
			node.children[0].active = true;
			node.children[1].active = false;
		}
		this.check();
	},
	check: function() {
		var self = this;
		Promise.all(this.nodeLine.children.map(function(line, index){
			return line.children[0].active ? index+1 : void 0;
		}))
		.then(result => {
			Promise.all(result.filter(function(data){
				return void 0 !== data;
			}))
			.then(data => {
				this.data = data;
				this.RedT.labelLine.string = data.length;
				this.RedT.tong.string = helper.numberWithCommas(data.length * helper.getOnlyNumberInString(this.RedT.bet.string));
			})
		})
	},
	selectChan: function(e) {
		var self = this;
		console.log(e.target);
		Promise.all(this.nodeLine.children.map(function(line, index){
			var i = index+1;
			if (i%2) {
				line.children[0].active = true;
				line.children[1].active = false;
			}else{
				line.children[0].active = false;
				line.children[1].active = true;
				return i;
			}
			return void 0;
		}))
		.then(result => {
			Promise.all(result.filter(function(data){
				return void 0 !== data;
			}))
			.then(data => {
				this.data = data;
				this.RedT.labelLine.string = data.length;
				this.RedT.tong.string = helper.numberWithCommas(data.length * helper.getOnlyNumberInString(this.RedT.bet.string));
			})
		})
	},
	selectLe: function(e) {
		var self = this;
		Promise.all(this.nodeLine.children.map(function(line, index){
			var i = index+1;
			if (i%2) {
				line.children[0].active = false;
				line.children[1].active = true;
				return i;
			}else{
				line.children[0].active = true;
				line.children[1].active = false;
			}
			return void 0;
		}))
		.then(result => {
			Promise.all(result.filter(function(data){
				return void 0 !== data;
			}))
			.then(data => {
				this.data = data;
				this.RedT.labelLine.string = data.length;
				this.RedT.tong.string = helper.numberWithCommas(data.length * helper.getOnlyNumberInString(this.RedT.bet.string));
			})
		})
	},
	selectAll: function(e, select) {
		var self = this;
		Promise.all(this.nodeLine.children.map(function(line, index){
			var check = select == "1";
			line.children[0].active = check;
			line.children[1].active = !check;
			return check ? index+1 : void 0;
		}))
		.then(result => {
			Promise.all(result.filter(function(data, index){
				return void 0 !== data;
			}))
			.then(data => {
				this.data = data;
				this.RedT.labelLine.string = data.length;
				this.RedT.tong.string = helper.numberWithCommas(data.length * helper.getOnlyNumberInString(this.RedT.bet.string));
			})
		});
	},
});
