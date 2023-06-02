var Helper = require('Helper');
cc.Class({
    extends: cc.Component,

    properties: {
		content:  cc.Node,
    },
    reset: function(){
        Promise.all(this.content.map(function(obj){
            obj.active = false
        }))
    },
});
