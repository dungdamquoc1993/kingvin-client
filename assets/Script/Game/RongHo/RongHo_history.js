
let Helper = require('Helper');

cc.Class({
    extends: cc.Component,

    properties: {
        page:     cc.Prefab,
        content:  cc.Node,
        cointRed: cc.Node,
        cointXu:  cc.Node,

        iconR:   cc.SpriteFrame,
        iconH:  cc.SpriteFrame,
        iconL:  cc.SpriteFrame,

        red:      true,
    },
    onLoad () {
        let page = cc.instantiate(this.page);
        page.y = -263;
        this.node.addChild(page);
        this.page = page.getComponent('Pagination');
        Promise.all(this.content.children.map(function(obj){
            return obj.getComponent('RongHo_history_item');
        }))
        .then(tab => {
            this.content = tab;
        })
        this.page.init(this);
    },
    onEnable: function() {
        this.get_data();
    },
    get_data: function(page = 1){
        cc.RedT.send({g:{rongho:{log:{red:this.red, page:page}}}});
    },
    changerCoint: function(){
        this.red             = !this.red;
        this.cointRed.active = !this.cointRed.active;
        this.cointXu.active  = !this.cointXu.active;
        this.get_data();
    },
    onData: function(data){
        let self = this;
        this.page.onSet(data.page, data.kmess, data.total);

        Promise.all(this.content.map(function(obj, i){
            let dataT = data.data[i];
            if (void 0 !== dataT) {
                obj.node.active  = true;

                obj.bg.active    = i%2;

                obj.time.string  = Helper.getStringDateByTime(dataT.time);
                obj.phien.string = dataT.phien;

                let numb  = 0;
                dataT.kq.forEach(function(dot){
                    if (dot) {
                        numb++;
                    }
                });

                if (dataT.kq[0] > dataT.kq[1]) {
                    obj.kqSprite.spriteFrame = self.iconR;
                    obj.kqLabel.string = dataT.kq[0];
                }else if (dataT.kq[0] < dataT.kq[1]) {
                    obj.kqSprite.spriteFrame = self.iconL;
                    obj.kqLabel.string = dataT.kq[1];
                }else{
                    obj.kqSprite.spriteFrame = self.iconH;
                    obj.kqLabel.string = dataT.kq[0];
                }
                


                //obj.kqSprite.spriteFrame = numb === 0 ? self.iconRed : (!(numb%2) ? self.iconWhite : self.iconRed);
                //obj.kqLabel.string = numb === 0 ? 4 : numb;

                obj.rong.string   = Helper.numberWithCommas(dataT.rong);
                obj.ho.string     = Helper.numberWithCommas(dataT.ho);
                obj.hoa.string   = Helper.numberWithCommas(dataT.hoa);
                obj.ro.string   = Helper.numberWithCommas(dataT.ro);
                obj.co.string = Helper.numberWithCommas(dataT.co);
                obj.tep.string = Helper.numberWithCommas(dataT.tep);
                obj.bich.string = Helper.numberWithCommas(dataT.bich);
                obj.win.string    = Helper.numberWithCommas(dataT.betwin);

                if (dataT.kq[0] > dataT.kq[1]) {
                    obj.rong.node.color = cc.Color.YELLOW;
                    obj.ho.node.color = cc.Color.WHITE;
                    obj.hoa.node.color = cc.Color.WHITE;
                }else if (dataT.kq[0] < dataT.kq[1]){
                    obj.rong.node.color = cc.Color.YELLOW;
                    obj.ho.node.color = cc.Color.WHITE;
                    obj.hoa.node.color = cc.Color.WHITE;
                }else if (dataT.kq[0] == dataT.kq[1]){
                    obj.rong.node.color = cc.Color.WHITE;
                    obj.ho.node.color = cc.Color.WHITE;
                    obj.hoa.node.color = cc.Color.YELLOW;
                }

                if (dataT.kq[2] == "♥" && dataT.kq[3] == "♥") {
                    obj.co.node.color = cc.Color.YELLOW;
                }else{
                    obj.co.node.color = cc.Color.WHITE;
                }
                if (dataT.kq[2] == "♦" && dataT.kq[3] == "♦") {
                    obj.ro.node.color = cc.Color.YELLOW;
                }else{
                    obj.ro.node.color = cc.Color.WHITE;
                }
                if (dataT.kq[2] == "♣" && dataT.kq[3] == "♣") {
                    obj.tep.node.color = cc.Color.YELLOW;
                }else{
                    obj.tep.node.color = cc.Color.WHITE;
                }
                if (dataT.kq[2] == "♠" && dataT.kq[3] == "♠") {
                    obj.bich.node.color = cc.Color.YELLOW;
                }else{
                    obj.bich.node.color = cc.Color.WHITE;
                }
            }else{
                obj.node.active = false;
            }
        }))
    },
});
