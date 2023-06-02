
var BrowserUtil = require('BrowserUtil');
var helper      = require('Helper');

cc.Class({
    extends: cc.Component,

    properties: {
		header: {
			default: null,
			type: cc.Node,
		},
		body: {
			default: null,
			type: cc.Node,
		},
	},
    init() {
		Promise.all(this.header.children.map(function(obj) {
			return obj.getComponent('itemContentMenu');
		}))
		.then(result => {
			this.header = result;
		});
    },

    onSelectHeader: function(event, name){
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
});
