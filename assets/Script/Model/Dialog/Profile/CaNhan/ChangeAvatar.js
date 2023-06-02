cc.Class({
    extends: cc.Component,

    properties: {
        items: cc.Node,
        itemTemplate: cc.Node
    },

    start () {
        for (let i = 0; i < cc.RedT.Avatars.length; i++) {
            let item = cc.instantiate(this.itemTemplate);
            item.parent = this.items;
            item.getChildByName("sprite").getComponent(cc.Sprite).spriteFrame = cc.RedT.Avatars[i];
            if (i == cc.RedT.user.avatar) {
                this.selectedIdx = i;
                item.getChildByName("selected").active = true;
            } else {
                item.getChildByName("selected").active = false;
            }
            item.on("click", () => {
                this.selectedIdx = i;
                for (let j = 0; j < this.items.childrenCount; j++) {
                    let item = this.items.children[j];
                    item.getChildByName("selected").active = j == this.selectedIdx;
                }
            });
            this.selectedIdx = i;
        }
        this.itemTemplate.removeFromParent();
        this.itemTemplate = null;
    },
    show() {
        this.node.active = true;
        this.selectedIdx = -1;
        if (this.itemTemplate == null) {
            for (let i = 0; i < this.items.childrenCount; i++) {
                let item = this.items.children[i];
                if (i == cc.RedT.user.avatar) {
                    this.selectedIdx = i;
                    item.getChildByName("selected").active = true;
                } else {
                    item.getChildByName("selected").active = false;
                }
            }
        }
    },
    dimiss() {
        this.node.active = false;
    },


    actSubmit() {
        let avatar = this.selectedIdx;
		cc.RedT.inGame.setAvatar(avatar);
		cc.RedT.user.avatar = avatar;
		cc.RedT.send({user:{avatar:avatar}});
        cc.RedT.inGame.notice.show({title: "", text: "Thao tác thành công !"})
    }

});
