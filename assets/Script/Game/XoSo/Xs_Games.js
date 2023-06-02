
let MienBac     = require('XoSo_MienBac');

cc.Class({
    extends: cc.Component,

    properties: {
		MienBac: MienBac,
    },

    init: function() {
        this.actionShow = cc.spawn(cc.scaleTo(0.5, 1).easing(cc.easeBackOut(2.5)), cc.fadeTo(0.5, 255));
        this.objShow    = null;
        this.objTmp     = null;
    },

    onClickBack: function(){
        cc.RedT.audio.playUnClick();
        this.onBack();
    },
    onBack: function(){
        if(this.objShow != null){
            if(void 0 == this.objShow.previous || null == this.objShow.previous){
                this.objShow.active = false;
                this.node.active    = false;
                this.objShow        = null;
            }else{
                this.objTmp              = this.objShow;
                this.objShow             = this.objShow.previous;
                this.objTmp.previous     = null;
                this.objTmp.active       = false;
                this.objShow.active      = true;
                this.objTmp              = null;
            }
        }else{
            this.node.active = false;
        }
    },
    onClosePrevious: function(obj){
        if(void 0 !== obj.previous && null !== obj.previous){
            this.onClosePrevious(obj.previous);
            delete obj.previous;
        }
        obj.active = false;
    },
    onCloseGames: function(){
        if(this.objShow != null){
            if(void 0 == this.objShow.previous || null == this.objShow.previous){
                this.objShow.active = this.node.active = false;
                this.objShow        = null;
            }else{
                this.onClosePrevious(this.objShow.previous);
                this.objShow.active          = this.node.active = false;
                delete this.objShow.previous;
                this.objShow                 = null;
            }
        }else{
            this.node.active = false
        }
    },

    resetSizeGames: function(node){
        node.stopAllActions();
        node.scale   = 0.5;
        node.opacity = 0;
    },

	showMienBac: function (event, name) {
			this.node.active = this.MienBac.node.active = true;
			this.objShow = this.MienBac.node;
			this.MienBac.superView(name);
	},
});
