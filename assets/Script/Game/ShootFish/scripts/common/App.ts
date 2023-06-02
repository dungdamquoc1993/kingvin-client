import { String } from './../../../creator.d';
import AlertDialog from "../common/AlertDialog";
import ConfirmDialog from "../common/ConfirmDialog";
import BroadcastReceiver from "./BroadcastReceiver";

const { ccclass, property } = cc._decorator;

@ccclass
export default class App extends cc.Component {

    static instance: App = null;

    @property
    designResolution: cc.Size = new cc.Size(1280, 720);

    @property(cc.Node)
    loading: cc.Node = null;
    @property(cc.Node)
    loadingIcon: cc.Node = null;
    @property(cc.Label)
    loadingLabel: cc.Label = null;

    @property(AlertDialog)
    alertDialog: AlertDialog = null;

    @property(ConfirmDialog)
    confirmDialog: ConfirmDialog = null;

    @property([cc.SpriteFrame])
    sprFrameAvatars: Array<cc.SpriteFrame> = new Array<cc.SpriteFrame>();

    private lastWitdh: number = 0;
    private lastHeight: number = 0;

    private timeOutLoading: any = null;
    private isFisrtNetworkConnected = false;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        console.log("App onLoad");
        if (App.instance != null) {
            this.node.destroy();
            return;
        }
        App.instance = this;
        cc.game.addPersistRootNode(App.instance.node);
        // cc.debug.setDisplayStats(true);

        BroadcastReceiver.register(BroadcastReceiver.USER_LOGOUT, () => {

        }, this);
    }

    start() {
        this.updateSize();
    }

    showLoading(isShow: boolean, timeOut: number = 15) {
        this.loadingLabel.string = "Đang tải...";
        if (this.timeOutLoading != null) clearTimeout(this.timeOutLoading);
        if (isShow) {
            if (timeOut > 0) {
                this.timeOutLoading = setTimeout(() => {
                    this.showLoading(false);
                }, timeOut * 1000);
            }
            this.loading.active = true;
        } else {
            this.loading.active = false;
        }
        this.loadingIcon.stopAllActions();
        this.loadingIcon.runAction(cc.repeatForever(cc.rotateBy(1, 360)));
    }

    showErrLoading(msg?: string) {
        this.showLoading(true, -1);
        this.loadingLabel.string = msg ? msg : "Mất kết nối, đang thử lại...";
    }

    update(dt: number) {
        this.updateSize();
    }

    updateSize() {
        var frameSize = cc.view.getFrameSize();
        if (this.lastWitdh !== frameSize.width || this.lastHeight !== frameSize.height) {

            this.lastWitdh = frameSize.width;
            this.lastHeight = frameSize.height;

            var newDesignSize = cc.Size.ZERO;
            if (this.designResolution.width / this.designResolution.height > frameSize.width / frameSize.height) {
                newDesignSize = cc.size(this.designResolution.width, this.designResolution.width * (frameSize.height / frameSize.width));
            } else {
                newDesignSize = cc.size(this.designResolution.height * (frameSize.width / frameSize.height), this.designResolution.height);
            }
            // cc.log("update node size: " + newDesignSize);
            this.node.setContentSize(newDesignSize);
            this.node.setPosition(cc.v2(newDesignSize.width / 2, newDesignSize.height / 2));
        }
    }

    getAvatarSpriteFrame(avatar: string): cc.SpriteFrame {
        let avatarInt = parseInt(avatar);
        if (isNaN(avatarInt) || avatarInt < 0 || avatarInt >= this.sprFrameAvatars.length) {
            return this.sprFrameAvatars[0];
        }
        return this.sprFrameAvatars[avatarInt];
    }

    loadScene(sceneName: string) {
        cc.director.preloadScene(sceneName, (c, t, item) => {
            this.showErrLoading("Đang tải..." + parseInt("" + ((c / t) * 100)) + "%");
        }, (err, sceneAsset) => {
            this.showLoading(false);
            cc.director.loadScene(sceneName);
        });
    }

    loadPrefab(prefabPath: string, onLoaded: (error: string, prefab: cc.Prefab) => void) {
        this.showErrLoading("Đang tải...");
        cc.loader.loadRes("prefabs/" + prefabPath, cc.Prefab, (c, t, item) => {
            this.showErrLoading("Đang tải..." + parseInt("" + ((c / t) * 100)) + "%");
        }, (err, prefab) => {
            this.showLoading(false);
            onLoaded(err == null ? null : err.message, prefab);
        });
    }
    public ShowAlertDialog(mess: string)
    {
        this.alertDialog.showMsg(mess);
    }
}
