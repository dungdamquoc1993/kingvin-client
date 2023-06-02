
cc.Class({
	extends: cc.Component,
	properties: {
		icons: {
			default: [],
			type: cc.Prefab,
		},
	},
	init(obj){
		this.RedT = obj;
	},
	random: function(){
		var icon = (Math.random()*11)>>0;
		this.setIcon(icon);
		return icon;
	},
	setIcon: function(icon, data = false){
		this.node.removeAllChildren();
		var child = cc.instantiate(this.icons[icon]);
		child.setScale(cc.v2(1.2, 1.2));
		this.node.addChild(child);
		if (data) {
			this.data = icon;
		}
	},
});
