
cc.Class({
    extends: cc.Component,
    properties: {
        item: cc.Sprite,
    },

    init(obj){
    	this.RedT = obj;
    },
    onLoad () {
    	this.icon = this.node.children[0].getComponent(cc.Sprite);
    },
    stop: function() {
    	Promise.all(this.node.children.map(function(node){
    		var animation = node.getComponents(cc.Animation);
    		Promise.all(animation.map(function(k){
    			node.removeComponent(k);
	    	}));
    	}));
    },
    random: function(){
    	var icon = ~~(Math.random()*6);
    	this.setIcon(icon);
        return icon;
    },
    setIcon:function(icon, data = false){
    	this.item.spriteFrame = this.RedT.icons[icon];
        if (data) {
            this.data = icon;
        }
    },
});
