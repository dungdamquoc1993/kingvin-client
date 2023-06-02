

cc.Class({
    extends: cc.Component,

    properties: {
    	header: cc.Node,
    	body:   cc.Node,
    },
    onSelectType: function(event, name) {
    	this.header.children.forEach(function(obj){
    		if (obj.name === name) {
    			obj.pauseSystemEvents();
    			obj.opacity = 255;
    		}else{
    			obj.resumeSystemEvents();
    			obj.opacity = 99;
    		}
    	});
    	this.body.children.forEach(function(obj){
    		if (obj.name === name) {
    			obj.active = true;
    		}else{
    			obj.active = false;
    		}
    	});
    },
	superView: function (name) {
		if (name === "de") {
			this.onSelectType(null, "de");
			if (name != "de") this.de.onSelectType(null, name);
		} else if (name === "lo") {
			this.onSelectType(null, "lo");
			if (name != "lo") this.lo.onSelectType(null, name);
		} else if (name === "lo_xien") {
			this.onSelectType(null, "lo_xien");
			if (name != "lo_xien") this.lo_xien.onSelectType(null, name);
		} else if (name === "dauduoi") {
			this.onSelectType(null, "dauduoi");
			if (name != "dauduoi") this.dauduoi.onSelectType(null, name);
		}else if (name === "lotruot") {
			this.onSelectType(null, "lotruot");
			if (name != "lotruot") this.lotruot.onSelectType(null, name);
		}
	},
});
