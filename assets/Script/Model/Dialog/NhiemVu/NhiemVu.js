
var BrowserUtil = require('BrowserUtil');
var helper      = require('Helper');

cc.Class({
	extends: cc.Component,

	properties: {
		scrollview: {
			default: null,
			type: cc.ScrollView,
        },
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
	onNhiemVu: function(data){
		//console.log(data);
		var self  = this;
		self.scrollview.content.removeAllChildren(); //remove all children	
		if (data) {
			//console.log(data.userInfo);
			Promise.all(data.dataNhiemVu.map(function(info){
				var item = cc.instantiate(self.prefabDaiLy);
				var component = item.getComponent('NhiemVu_Item');
				component.init(self, info, data);
				self.scrollview.content.addChild(item);
				return component;
			}))
		}
	},
	onData: function(data) {
		console.log(data);
		if (void 0 !== data && !this.isLoaded){
			this.isLoaded = true;
			this.onNhiemVu(data);
		}
	},
});
