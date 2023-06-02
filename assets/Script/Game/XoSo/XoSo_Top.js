var MienBac = require('XoSo_MBTop');

cc.Class({
    extends: cc.Component,
    properties: {
        MienBac: MienBac,
    },
    onData: function(data) {
        if (void 0 !== data.mb) {
        	console.log(data.mb);
            this.MienBac.onData(data.mb);
        }
    },
});