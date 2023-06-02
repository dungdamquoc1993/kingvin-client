import Play from "./ShootFish.Play";
import App from "./scripts/common/App";
import Configs from "./scripts/common/Configs";
import PopupCoinTransfer from "./ShootFish.PopupCoinTransfer";
import Utils from "./scripts/common/Utils";
import BroadcastReceiver from "./scripts/common/BroadcastReceiver";
//import MiniGameNetworkClient from "./scripts/networks/MiniGameNetworkClient";
import InPacket from "./scripts/networks/Network.InPacket";
import cmd from "./Lobby/src/Lobby.Cmd";
import ShootFishNetworkClient from "./scripts/networks/ShootFishNetworkClient";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Lobby extends cc.Component {

    public static instance: Lobby = null;
   
    @property(cc.Node)
    Layout: cc.Node = null;

    @property(cc.Prefab)
    MiniPanel: cc.Node = null;

    @property(cc.Node)
    Notice: cc.Node = null;

    @property(cc.Node)
    Loading: cc.Node = null;

    @property(cc.Node)
    lblLoading: cc.Label = null;

    @property(cc.Label)
    lblNotice: cc.Label = null;

    @property(cc.Node)
    playNode: cc.Node = null;

    @property(cc.Label)
    lblBalance: cc.Label = null;

    @property(PopupCoinTransfer)
    popupCoinTransfer: PopupCoinTransfer = null;

    private play: Play = null;
    private timeOutLoading: any = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        Lobby.instance = this;
        cc.RedT.inGame = this;
        Configs.Login.Coin = cc.RedT.user.red;
		var MiniPanel = cc.instantiate(this.MiniPanel);
		cc.RedT.MiniPanel = MiniPanel.getComponent('MiniPanel');
		this.Layout.insertChild(MiniPanel);

        this.play = this.playNode.getComponent(Play);
        this.play.node.active = false;

        this.lblBalance.string = Utils.formatNumber(Configs.Login.CoinFish);

        BroadcastReceiver.register(BroadcastReceiver.USER_UPDATE_COIN, () => {
            this.lblBalance.string = Utils.formatNumber(Configs.Login.CoinFish);
        }, this);

        ShootFishNetworkClient.getInstance().checkConnect((isLogined) => {
            if (!isLogined) {
                this.showNotice(true,"Đăng nhập thất bại, vui lòng thử lại.");
                return;
            }
            Play.SERVER_CONFIG = Configs.Login.FishConfigs;
            BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
            if (Configs.Login.CoinFish <= 0) {

                this.showNotice(true,"Tiền trong Bắn Cá của bạn đã hết, bạn có muốn chuyển tiền vào không?");
                this.popupCoinTransfer.show();
            }
        });

        ShootFishNetworkClient.getInstance().addOnClose(() => {
            this.showNotice(true,"Mất kết nối, đang thử kết nối lại...");
        }, this);

        /*MiniGameNetworkClient.getInstance().addListener((data) => {
            let inPacket = new InPacket(data);
            switch (inPacket.getCmdId()) {
                case cmd.Code.GET_MONEY_USE: {
                    let res = new cmd.ResGetMoneyUse(data);
                    Configs.Login.Coin = res.moneyUse;
                    BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
                    break;
                }
            }
        }, this);*/

        cc.RedT.send({scene:"shootfish", g:{shootfish:{ingame:true}}});
    }

    actBack() {
        cc.audioEngine.stopAll();
        cc.director.preloadScene('MainGame', (c, t, item) => {
            this.showErrLoading("Đang tải..." + parseInt("" + ((c / t) * 100)) + "%");
        }, (err, sceneAsset) => {
            ShootFishNetworkClient.getInstance().backgame();
            cc.director.loadScene('MainGame');
        });
    }

    actHonors() {

    }

    showErrLoading(msg?: string) {
        this.showLoading(true, -1);
        this.lblLoading.string = msg ? msg : "Mất kết nối, đang thử lại...";
    }

    showLoading(isShow: boolean, timeOut: number = 15) {
        this.lblLoading.string = "Đang tải...";
        if (this.timeOutLoading != null) clearTimeout(this.timeOutLoading);
        if (isShow) {
            if (timeOut > 0) {
                this.timeOutLoading = setTimeout(() => {
                    this.showLoading(false);
                }, timeOut * 1000);
            }
            this.Loading.active = true;
        } else {
            this.Loading.active = false;
        }
    }

    actRoom1() {
        this.show(false);
        this.play.show(true, 1);
    }

    actRoom2() {
        this.show(false);
        this.play.show(true, 2);
    }

    actRoom3() {
        this.show(false);
        this.play.show(true, 3);
    }

    onData(data) {
	//console.log(data);
        if (void 0 !== data.shootfish){
            this.ShootFish(data.shootfish);
		}
		if (void 0 !== data.mini){
			cc.RedT.MiniPanel.onData(data.mini);
		}
		if (void 0 !== data.TopHu){
			cc.RedT.MiniPanel.TopHu.onData(data.TopHu);
		}
		if (void 0 !== data.taixiu){
			cc.RedT.MiniPanel.TaiXiu.TX_Main.onData(data.taixiu);
		}
	}

    ShootFish(data){
	//console.log(data);
        if (void 0 !== data.user) {
            Configs.Login.Coin = data.user.red;
            this.popupCoinTransfer.userData(data.user.red);
            cc.RedT.userData(data.user);
        }
        if (void 0 !== data.notice) {
            this.showNotice(true, data.notice);
        }
    }

    public showNotice(isShow: boolean, msg?: string){
        this.Notice.active = isShow;
        this.lblNotice.string = msg;
    }

    dimissNotice() {
        this.Notice.active = false;
    }

    public show(isShow: boolean) {
        this.node.active = isShow;
        BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
    }
}
