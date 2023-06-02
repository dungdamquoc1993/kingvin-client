var BrowserUtil = require('BrowserUtil');
var helper      = require('Helper');

cc.Class({
    extends: cc.Component,

    properties: {
        itemTemplate: cc.Node,
        header: cc.Node,
        body: cc.Node,
        sfTops: [cc.SpriteFrame],
        sfRanks: [cc.SpriteFrame]
    },
    start(){
        Promise.all(this.header.children.map(function(obj) {
			return obj.getComponent('itemContentMenu');
		}))
		.then(result => {
			this.header = result;
		});
    },
    onEnable: function() {
        for (let i = 0; i < this.itemTemplate.parent.childrenCount; i++) {
            this.itemTemplate.parent.children[i].active = true;
        }
    },
    onDisable: function() {
        for (let i = 0; i < this.itemTemplate.parent.childrenCount; i++) {
            this.itemTemplate.parent.children[i].active = false;
        }
    },
    getItem: function(){
        let item = null;
            for (let i = 0; i < this.itemTemplate.parent.childrenCount; i++) {
                let node = this.itemTemplate.parent.children[i];
                if (node != this.itemTemplate && !node.active) {
                    item = node;
                    break;
                }
            }
            if (item == null) {
                item = cc.instantiate(this.itemTemplate);
                item.parent = this.itemTemplate.parent;
            }
            item.active = true;
            return item;
    },
    onData: function(data){
        if (!!data.top.length) {
            for (let i = 0; i < data.top.length; i++) {
                let item = this.getItem();
                item.getChildByName("sprite").active = true;
                item.getChildByName("selected").active = true;
                item.getChildByName("DONGXU").active = true;
                

                item.getChildByName("lbrank").active = false;
                item.getChildByName("lbname").active = false;
                item.getChildByName("lbmoney").active = false;

                item.getChildByName("nickname").active = true;
                item.getChildByName("rank").active = true;
                item.getChildByName("money").active = true;

                item.getChildByName("sprite").getComponent(cc.Sprite).spriteFrame = cc.RedT.Avatars[data.top[i].Avatar>>0];

                item.getChildByName("fame").active = true;
                
                

                item.getChildByName("nickname").getComponent(cc.Label).string = data.top[i].Name;
                item.getChildByName("rank").getComponent(cc.Label).string = data.top[i].RankName;
                item.getChildByName("money").getComponent(cc.Label).string = helper.numberWithCommas(data.top[i].RedPlay);
                if (data.top[i].Name == cc.RedT.user.name) {
                    item.getChildByName("selected").active = true;
                } else {
                    item.getChildByName("selected").active = false;
                }
                if (data.top[i].RankName == 'KIM CƯƠNG') {
                    item.getChildByName("SprRank").active = true;
                    item.getChildByName("SprRank").getComponent(cc.Sprite).spriteFrame = this.sfRanks[0];
                } else if (data.top[i].RankName == 'BẠCH KIM') {
                    item.getChildByName("SprRank").active = true;
                    item.getChildByName("SprRank").getComponent(cc.Sprite).spriteFrame = this.sfRanks[1];
                }else if (data.top[i].RankName == 'VÀNG') {
                    item.getChildByName("SprRank").active = true;
                    item.getChildByName("SprRank").getComponent(cc.Sprite).spriteFrame = this.sfRanks[2];
                }else if (data.top[i].RankName == 'BẠC') {
                    item.getChildByName("SprRank").active = true;
                    item.getChildByName("SprRank").getComponent(cc.Sprite).spriteFrame = this.sfRanks[3];
                }else if (data.top[i].RankName == 'ĐỒNG') {
                    item.getChildByName("SprRank").active = true;
                    item.getChildByName("SprRank").getComponent(cc.Sprite).spriteFrame = this.sfRanks[4];
                }else if (data.top[i].RankName == 'SẮT') {
                    item.getChildByName("SprRank").active = true;
                    item.getChildByName("SprRank").getComponent(cc.Sprite).spriteFrame = this.sfRanks[5];
                }
            }
            
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
});
