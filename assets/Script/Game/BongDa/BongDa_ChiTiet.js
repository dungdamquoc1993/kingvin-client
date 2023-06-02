
var BrowserUtil = require('BrowserUtil');
var helper      = require('Helper');

cc.Class({
	extends: cc.Component,

	properties: {
		labelContent: cc.Label,
        labelTitle: cc.Label
	},
	init(obj){
        this.RedT = obj;
        var self  = this;
		this.isLoaded = false;
	},
	onData: function(data) {
		this.labelContent.string = data;
        this.labelTitle.string = 'CHI TIẾT';
    },
    onDienbien: function(data) {
		this.labelContent.string = data;
        this.labelTitle.string = 'KẾT QUẢ';
    },
});
