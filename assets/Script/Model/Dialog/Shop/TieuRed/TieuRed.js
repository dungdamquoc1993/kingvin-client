
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
        RutBank: {
            default: null,
            type: cc.Node,
        },
        MuaTheCao: {
            default: null,
            type: cc.Node,
        },
    },
    init(){
        this.RutBank     = this.RutBank.getComponent('bankRut');
        this.MuaTheCao  = this.MuaTheCao.getComponent('shopMuaTheCao');
        this.MuaTheCao.init();
        this.RutBank.init();
        Promise.all(this.header.children.map(function(obj) {
            return obj.getComponent('itemContentMenu');
        }))
        .then(result => {
            this.header = result;
        });
    },
    onSelectheader: function(event, name){
        this.body.active = true;
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
    onData: function(data){
        if (!!data.list) {
            this.RutBank.onData(data.list);
        }
    },
});
