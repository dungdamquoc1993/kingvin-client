
cc.Class({
	extends: cc.Component,

	properties: {
		header: cc.Node,
		CaNhan: cc.Node,
		KetSat: cc.Node,
		BaoMat: cc.Node,
	},
	init(){
		this.CaNhan = this.CaNhan.getComponent('CaNhan');
		this.KetSat = this.KetSat.getComponent('KetSat');
		this.BaoMat = this.BaoMat.getComponent('BaoMat');
		this.KetSat.init();
		this.BaoMat.init();

		this.body = [this.CaNhan, this.KetSat, this.BaoMat];

		Promise.all(this.header.children.map(function(obj) {
			return obj.getComponent('itemHeadMenu');
		}))
		.then(result => {
			this.header = result;
		});
	},
	onEnable: function () {
		//cc.RedT.inGame.header.node.active = false;
	},
	onDisable: function () {
		//cc.RedT.inGame.header.node.active = true;
	},
	onSelectHead: function(event, name){
		Promise.all(this.header.map(function(header) {
			if (header.node.name == name) {
				header.select();
			}else{
				header.unselect();
			}
		}));
		Promise.all(this.body.map(function(body) {
			if (body.node.name == name) {
				body.node.active = true;	
			}else{
				body.node.active = false;
			}
		}));
	},
	superView:function(name){
		if(name == "CaNhan"){
			this.onSelectHead(null, "CaNhan");
		}else if(name == "KetSat"){
			this.onSelectHead(null, "KetSat");
		}else if(name == "BaoMat"){
			this.onSelectHead(null, "BaoMat");
		}
	},
	onData: function(data){
		if (void 0 !== data.history){
			cc.RedT.inGame.dialog.lichsu.onData(data.history);
		}
		if (void 0 !== data.the_cao){
			cc.RedT.inGame.dialog.the_cao.onData(data.the_cao);
		}
		if (void 0 !== data.level){
			this.CaNhan.level(data.level);
		}
	},
});
