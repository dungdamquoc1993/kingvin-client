
var BrowserUtil = require('BrowserUtil');
var helper      = require('Helper');

cc.Class({
	extends: cc.Component,

	properties: {
		scrollview: {
			default: null,
			type: cc.ScrollView,
        },
		header: cc.Node,
        body: cc.Node,
        checkDaiLy: {
			default: [],
			type: cc.Node
		},
		prefabDaiLy: {
			default: null,
			type: cc.Prefab,
		},
	},
	init(){
		var self = this;
		this.isLoaded = false;
	},
	start(){
        Promise.all(this.header.children.map(function(obj) {
			return obj.getComponent('itemContentMenu');
		}))
		.then(result => {
			this.header = result;
		});
    },
	onNhiemVu: function(data){
		//console.log(data);
		var self  = this;
		self.scrollview.content.removeAllChildren(); //remove all children	
		if (data) {
			//console.log(data.userInfo);
			Promise.all(data.map(function(info, index){
				var item = cc.instantiate(self.prefabDaiLy);
				var component = item.getComponent('BonusNap_Item');
				component.init(self, info, index);
				self.scrollview.content.addChild(item);
				return component;
			}))
		}
	},
	onSelectHead: function(event, name){
		Promise.all(this.header.map(function(header) {
			if (header.node.name == name) {
				header.select();
			}else{
				header.unselect();
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
	onData: function(data) {
		console.log(data);
		if (void 0 !== data && !this.isLoaded){
			this.isLoaded = true;
			this.onNhiemVu(data);
		}
	},
});
