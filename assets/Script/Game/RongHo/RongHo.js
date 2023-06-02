
let helper = require('Helper');
let notice = require('Notice');
let dialog = require('RongHo_dialog');

cc.Class({
	extends: cc.Component,

	properties: {
		audioMoBat:      cc.AudioSource,
		audioSingleChip: cc.AudioSource,
		audioMultiChip:  cc.AudioSource,
		audioXocDia:     cc.AudioSource,

		audioMultiChip2: cc.AudioSource,
		audioMultiChip3: cc.AudioSource,
		audioMultiChip4: cc.AudioSource,
		audioMultiChip5: cc.AudioSource,

		box_rong:   cc.Node,
		box_ho:     cc.Node,
		box_hoa:     cc.Node,
		box_ro:   cc.Node,
		box_co:   cc.Node,
		box_bich: cc.Node,
		box_tep: cc.Node,

		total_rong:   cc.Label,
		total_ho:     cc.Label,
		total_hoa:   cc.Label,
		total_ro:   cc.Label,
		total_co: cc.Label,
		total_bich: cc.Label,
		total_tep: cc.Label,

		me_rong:   cc.Label,
		me_ho:     cc.Label,
		me_hoa:   cc.Label,
		me_ro:   cc.Label,
		me_co: cc.Label,
		me_bich: cc.Label,
		me_tep: cc.Label,

		me_name:   cc.Label,
		me_balans: cc.Label,
		me_avatar: cc.Sprite,
		
		me_name1:   cc.Label,
		me_balans1: cc.Label,
		me_avatar1: cc.Sprite,
		
		me_name2:   cc.Label,
		me_balans2: cc.Label,
		me_avatar2: cc.Sprite,
		
		me_name3:   cc.Label,
		me_balans3: cc.Label,
		me_avatar3: cc.Sprite,
		
		me_name4:   cc.Label,
		me_balans4: cc.Label,
		me_avatar4: cc.Sprite,
		
		me_name5:   cc.Label,
		me_balans5: cc.Label,
		me_avatar5: cc.Sprite,
		
		me_name6:   cc.Label,
		me_balans6: cc.Label,
		me_avatar6: cc.Sprite,
		
		user1:    cc.Node,
		user2:    cc.Node,
		user3:    cc.Node,
		user4:    cc.Node,
		user5:    cc.Node,
		user6:    cc.Node,
		labelTime: cc.Label,

		box_chip:    cc.Node,

		users_bg:    cc.Node,
		users_count: cc.Label,

		chip_1000:    cc.SpriteFrame,
		chip_10000:   cc.SpriteFrame,
		chip_50000:   cc.SpriteFrame,
		chip_100000:  cc.SpriteFrame,
		chip_1000000: cc.SpriteFrame,

		dot_hu:   cc.SpriteFrame,
		dot_long: cc.SpriteFrame,
		dot_he:   cc.SpriteFrame,

		card_rong:   cc.SpriteFrame,
		card_ho: cc.SpriteFrame,

		cardrong: cc.Node,
		cardho: cc.Node,
		cardf: [cc.Sprite],

		log_chan: cc.Label,
		log_le:   cc.Label,
		log_top:  cc.Node,
		logMain:  cc.Node,
		redH:    cc.Node,
		miniNotice: cc.Node,
		prefabNotice: cc.Prefab,
		bet:     cc.Node,
		MiniPanel: cc.Prefab,
		loading:   cc.Node,
		notice:    notice,
		dialog:    dialog,

		red: true,
	},
	ctor: function(){
		this.logs = [];
		this.nan  = false;
		this.cuoc = 1000;
		this.maxDot = {x:44, y:44};
		this.maxBox1_3 = {x:103, y:104};
		this.maxBox1_1 = {x:121, y:184};
		this.clients = {
			'red': {
				'rong':   0,
				'ho':     0,
				'hoa':   0,
				'ro':   0,
				'co': 0,
				'bich': 0,
				'tep': 0,
			},
		};

		this.logcuoc = {
			'red': {
				'rong':   0,
				'ho':     0,
				'hoa':   0,
				'ro':   0,
				'co': 0,
				'bich': 0,
				'tep': 0,
			},
		};

		this.users = {
			'red': {
				'rong':   0,
				'ho':     0,
				'hoa':   0,
				'ro':   0,
				'co': 0,
				'bich': 0,
				'tep': 0,
			},
		};
	},
	onLoad () {
		cc.RedT.inGame = this;
		var MiniPanel = cc.instantiate(this.MiniPanel);
		cc.RedT.MiniPanel = MiniPanel.getComponent('MiniPanel');
		this.redH.insertChild(MiniPanel);
		this.logMain = this.logMain.children.map(function(obj){
			return obj.children[0].getComponent(cc.Sprite);
		});

		this.logMain.reverse();
		this.log_top = this.log_top.children.map(function(obj){
			let data = {'cell':obj};
			let cell = obj.children.map(function(obj){
				return {c:obj.children[0].getComponent(cc.Sprite), t:obj.children[1].getComponent(cc.Label)};
			});
			cell.reverse();
			data.data = cell;
			return data;
		});

		this.log_top.reverse();
		this.me_name.string = cc.RedT.user.name;
		this.me_balans.string = helper.numberWithCommas(cc.RedT.user.red);
		this.updateSpriteFrame('avatar/'+cc.RedT.user.avatar,this.me_avatar);
		// random anh
		this.updateSpriteFrame('avatar/'+(Math.random()*18),this.me_avatar1);
		this.updateSpriteFrame('avatar/'+(Math.random()*18),this.me_avatar2);
		this.updateSpriteFrame('avatar/'+(Math.random()*18),this.me_avatar3);
		this.updateSpriteFrame('avatar/'+(Math.random()*18),this.me_avatar4);
		this.updateSpriteFrame('avatar/'+(Math.random()*18),this.me_avatar5);

		setTimeout(function(){
			cc.RedT.send({scene:"rongho", g:{rongho:{ingame:true}}});
		},1500);
	},
	onData: function(data) {
		if (void 0 !== data.user){
			this.userData(data.user);
			cc.RedT.userData(data.user);
		}
		if (void 0 !== data.rongho){
			this.rongho(data.rongho);
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
	},

	updateSpriteFrame : function (imgUrl, target_, cb) {
		let target = target_;
			cc.loader.loadRes(imgUrl, cc.SpriteFrame, function (err, spriteFrame){
				if (!!err){
					//cc.log(err);
				}else{
					if (target.isValid){
						target.spriteFrame = spriteFrame;
					}
				}
			});
		
	},
	invokeCallback : function (cb) {
		if (!!cb && typeof cb === 'function') {
			cb.apply(null, Array.prototype.slice.call(arguments, 1));
		}
	},

	backGame: function(){
		clearInterval(this.timeInterval);
		cc.RedT.send({g:{rongho:{outgame:true}}});
		cc.RedT.inGame.notice.show({title:"Thoát game", text:'Xác nhận hành động.\nHành động thực hiện thoát khỏi game này?', button:{type: "exit_game", text: "Thoát"}});
	},
	signOut: function(){
		clearInterval(this.timeInterval);
		cc.director.preloadScene('MainGame', function(){
			cc.director.loadScene('MainGame', function(){
				cc.RedT.inGame.signOut();
			});
		})
	},
	userData: function(data){
		if (this.red) {
			if(data.red)
				this.me_balans.string = helper.numberWithCommas(data.red);
		}else{
			this.me_balans.string = helper.numberWithCommas(data.xu);
		}
	},
	rongho: function(data){
		if (!!data.ingame) {
			this.ronghoIngame(data.ingame);
		}
		if (!!data.finish) {
			this.ronghoFinish(data.finish);
		}
		if (!!data.history) {
			this.dialog.history.onData(data.history);
		}
		if (!!data.tops) {
			this.dialog.top.onData(data.tops);
		}
		if (!!data.status) {
			this.status(data.status);
		}
		if (!!data.chip) {
			this.clientsChip(data.chip);
		}
		if (!!data.mechip) {
			//this.meChip(data.mechip);
		}
		if (!!data.client) {		
			this.updateClient(data.client);
		}
		if (!!data.me) {
			this.updateMe(data.me,true);
		}
		if (void 0 !== data.notice) {
			this.addNotice(data.notice);
		}
	},
	ronghoIngame: function(data){
		if (data.client) {
			this.countClient(data.client);
		}
		if (!!data.chip) {
			this.ingameChip(data.chip);
		}
		if (!!data.time) {
			this.time_remain = data.time-1;
			this.playTime();
			if (this.time_remain > 32 && data.logs.length) {
				this.setDot([data.logs[0].rong, data.logs[0].ho, data.logs[0].chatrong, data.logs[0].chatho]);
			}
		}
		if (!!data.data) {
			this.updateData(data.data);
		}
		if (!!data.logs) {
			this.logs = data.logs;
			this.setLogs();
		}
		if (!!data.me) {
			this.updateMe(data.me,true);
		}
		if (!!data.chats) {
		}
	},
	ingameChip: function(data){
		for (let [key, value] of Object.entries(data)) {
			let max = this.maxBox1_3;
			switch(data.box) {
				case 'rong':
					max = this.maxBox1_1;
				break;

				case 'ho':
					max = this.maxBox1_1;
				break;
			}
			for (let [keyT, valueT] of Object.entries(value)) {
				if (valueT > 0) {
					while (valueT) {
						let x = (Math.random()*(max.x+1))>>0;
						let y = (Math.random()*(max.y+1))>>0;

						let newN = new cc.Node;
						newN = newN.addComponent(cc.Sprite);
						newN.spriteFrame = this['chip_'+keyT];
						newN.node.position = cc.v2(x, y);
						newN.node.scale = 0.3;
						this['box_'+key].children[1].addChild(newN.node);
						valueT--;
					}
				}
			}
		}
		
	},
	ronghoFinish: function(data){
		let dice = {red1:data[0], red2:data[1], red3:data[2], red4:data[3]};
		this.logs.unshift(dice);
		this.logs.length > 48 && this.logs.pop();
		this.setDot(data);
		this.time_remain = 43;
		this.playTime();

		this.FinishTT();
	},
	FinishTT: function(){
		this.showKQ();
		this.setLogs();
	},
	showKQ: function(){
		let data = Object.values(this.logs[0]);
		if (data[0] > data[1]) {
			this.box_rong.children[0].active = true;
		}else if (data[0] == data[1]) {
			this.box_hoa.children[0].active = true;
		}
		else if (data[0] < data[1]) {
			this.box_ho.children[0].active = true;
		}if (data[2] == "♥" && data[3] == "♥") {
			//cc.log('Co');
			this.box_co.children[0].active = true;
		}if (data[2] == "♠" && data[3] == "♠") {
			//cc.log('bich');
			this.box_bich.children[0].active = true;
		}if (data[2] == "♣" && data[3] == "♣") {
			//cc.log('tep');
			this.box_tep.children[0].active = true;
		}if (data[2] == "♦" && data[3] == "♦") {
			//cc.log('ro');
			this.box_ro.children[0].active = true;
		}
		
	},
	setDot: function(data){
		this.cardrong.active = true;
		this.cardho.active = true;


		switch(data[2]) {
			case "♥":
				this.cardf[0].spriteFrame = cc.RedT.util.card.getCard(data[0]-1, 0);
				break;
			case "♦":
				this.cardf[0].spriteFrame = cc.RedT.util.card.getCard(data[0]-1, 1);
			  	break;
			case "♣":
				this.cardf[0].spriteFrame = cc.RedT.util.card.getCard(data[0]-1, 2);
				break;
			case "♠":
				this.cardf[0].spriteFrame = cc.RedT.util.card.getCard(data[0]-1, 3);
				break;
		}

		switch(data[3]) {
			case "♥":
				this.cardf[1].spriteFrame = cc.RedT.util.card.getCard(data[1]-1, 0);
				break;
			case "♦":
				this.cardf[1].spriteFrame = cc.RedT.util.card.getCard(data[1]-1, 1);
			  	break;
			case "♣":
				this.cardf[1].spriteFrame = cc.RedT.util.card.getCard(data[1]-1, 2);
				break;
			case "♠":
				this.cardf[1].spriteFrame = cc.RedT.util.card.getCard(data[1]-1, 3);
				break;
		}
	},
	onDestroy(){
		void 0 !== this.timeInterval && clearInterval(this.timeInterval);
	},
	playTime: function(){
		void 0 !== this.timeInterval && clearInterval(this.timeInterval);
		this.timeInterval = setInterval(function(){
			if (this.time_remain > 32) {
				var time = helper.numberPad(this.time_remain-33, 2);
				if(this.labelTime)
				this.labelTime.string = time;
			}else if(this.time_remain > 30){
				this.cardf[0].spriteFrame = this.card_rong;
				this.cardf[1].spriteFrame = this.card_ho;
				this.time_remain === 32 && this.resetData();
			}else{
				if (this.time_remain > -1) {
					var time = helper.numberPad(this.time_remain, 2);
					this.labelTime.string = time;

					if (this.time_remain < 11) {
						this.labelTime.node.color = cc.Color.RED;
					}else{
						this.labelTime.node.color = cc.Color.WHITE
					}
				}else clearInterval(this.timeInterval);
			}
			this.time_remain--;
		}.bind(this), 1000);
	},
	countClient: function(client){
		this.users_count.string = client;
	},
	updateData: function(data){
		if (this.red) {
			this.total_rong.string   = data.red.rong   > 0 ? helper.numberWithCommas(data.red.rong)   : '';
			this.total_ho.string     = data.red.ho     > 0 ? helper.numberWithCommas(data.red.ho)     : '';
			this.total_hoa.string   = data.red.hoa   > 0 ? helper.numberWithCommas(data.red.hoa)   : '';
			this.total_ro.string   = data.red.ro   > 0 ? helper.numberWithCommas(data.red.ro)   : '';
			this.total_co.string = data.red.co > 0 ? helper.numberWithCommas(data.red.co) : '';
			this.total_bich.string = data.red.bich > 0 ? helper.numberWithCommas(data.red.bich) : '';
			this.total_tep.string = data.red.tep > 0 ? helper.numberWithCommas(data.red.tep) : '';
		}
	},
	resetData: function(){
		this.box_rong.children[1].removeAllChildren();
		this.box_ho.children[1].removeAllChildren();
		this.box_hoa.children[1].removeAllChildren();
		this.box_ro.children[1].removeAllChildren();
		this.box_co.children[1].removeAllChildren();
		this.box_bich.children[1].removeAllChildren();
		this.box_tep.children[1].removeAllChildren();

		this.box_rong.children[0].active   = false;
		this.box_ho.children[0].active     = false;
		this.box_hoa.children[0].active = false;
		this.box_ro.children[0].active = false;
		this.box_co.children[0].active   = false;
		this.box_bich.children[0].active   = false;
		this.box_tep.children[0].active   = false;

		this.total_rong.string   = '';
		this.total_ho.string     = '';
		this.total_hoa.string   = '';
		this.total_ro.string   = '';
		this.total_co.string = '';
		this.total_bich.string = '';
		this.total_tep.string = '';

		this.me_rong.string   = '';
		this.me_ho.string     = '';
		this.me_hoa.string   = '';
		this.me_ro.string   = '';
		this.me_co.string = '';
		this.me_bich.string = '';
		this.me_tep.string = '';

		this.me_rong._string   = '';
		this.me_ho._string     = '';
		this.me_hoa._string   = '';
		this.me_ro._string   = '';
		this.me_co._string = '';
		this.me_bich._string = '';
		this.me_tep._string = '';


		this.users.red.rong   = 0;
		this.users.red.ho     = 0;
		this.users.red.hoa   = 0;
		this.users.red.ro   = 0;
		this.users.red.co = 0;
		this.users.red.bich = 0;
		this.users.red.tep = 0;

		this.clients.red.rong   = 0;
		this.clients.red.ho     = 0;
		this.clients.red.hoa   = 0;
		this.clients.red.ro   = 0;
		this.clients.red.co = 0;
		this.clients.red.bich = 0;
		this.clients.red.tep = 0;

		this.logcuoc.red.rong   = 0;
		this.logcuoc.red.ho     = 0;
		this.logcuoc.red.hoa   = 0;
		this.logcuoc.red.ro   = 0;
		this.logcuoc.red.co = 0;
		this.logcuoc.red.bich = 0;
		this.logcuoc.red.tep = 0;
	},
	setLogs: function(){
		let self = this;
		this.logMain.forEach(function(obj, index){
			let data = self.logs[index];
			if (data) {
				obj.node.active = true;
				data = Object.values(data);
				if (data[0] > data[1]) {
					obj.spriteFrame = self.dot_long;
				}else if (data[0] == data[1]) {
					obj.spriteFrame = self.dot_he;
				}else{
					obj.spriteFrame = self.dot_hu;
				}
			}else{
				obj.node.active = false;
			}
		});

		let tmp_DS = -1;
		let tmp_arrA = [];
		let tmp_arrB = [];
		let c_chan = 0;
		let c_le = 0;

		let newArr = self.logs.slice();
		newArr.reverse();
		newArr.forEach(function(newDS){
			let data = Object.values(newDS);
			let gameChan = 0;
			data.forEach(function(kqH){
				if (kqH) {
					gameChan++;
				}
			});

			let type  = !(gameChan%2);
			if (tmp_DS === -1) {
				tmp_DS = type;
			}
			if (type !== tmp_DS || tmp_arrB.length > 3) {
				tmp_DS = type;
				tmp_arrA.push(tmp_arrB);
				tmp_arrB = [];
			}
			if (type === tmp_DS) {
				tmp_arrB.push(gameChan)
			}
		});

		tmp_arrA.push(tmp_arrB);
		tmp_arrA.reverse();
		tmp_arrA = tmp_arrA.slice(0, 12);

		this.log_top.forEach(function(obj, index){
			let data = tmp_arrA[index];
			if (data) {
				obj.cell.active = true;

				obj.data.forEach(function(cell, j){
					let jD = data[j];
					if (void 0 !== jD) {
						cell.c.node.parent.active = true;
						cell.c.spriteFrame = !(jD%2) ? (jD === 4 ? self.dot_red : self.dot_white) : self.dot_red;


						cell.t.string = jD === 0 ? 4 : jD;

						if (!(jD%2)) {
							c_chan++;
						}else{
							c_le++;
						}
					}else{
						cell.c.node.parent.active = false;
					}
				});
			}else{
				obj.cell.active = false;
			}
		});

		this.log_chan.string = c_chan;
		this.log_le.string   = c_le;
	},
	changerBet: function(event, bet){
		let target = event.target;
		this.cuoc = target.name;
		this.bet.children.forEach(function(obj){
			if (obj == target) {
				obj.children[0].active = false;
				obj.children[1].active = true;
				obj.pauseSystemEvents();
				obj.opacity = 255;
			}else{
				obj.children[0].active = true;
				obj.children[1].active = false;
				obj.resumeSystemEvents();
				obj.opacity = 99;
			}
		})
	},
	onCuoc: function(event, box){
		this.logcuoc.red[box]  += parseInt(this.cuoc);
		this.meChip({box:box, cuoc:parseInt(this.cuoc)});
		this.updateMe(this.logcuoc,false);
		cc.RedT.send({g:{rongho:{cuoc:{red:this.red, cuoc:this.cuoc, box:this.logcuoc}}}});
		this.logcuoc.red.rong   = 0;
		this.logcuoc.red.ho     = 0;
		this.logcuoc.red.hoa   = 0;
		this.logcuoc.red.ro   = 0;
		this.logcuoc.red.co = 0;
		this.logcuoc.red.bich = 0;
		this.logcuoc.red.tep = 0;
	},
	ClickCuoc: function(){
		cc.RedT.send({g:{rongho:{cuoc:{red:this.red, cuoc:this.cuoc, box:this.logcuoc}}}});
		this.logcuoc.red.rong   = 0;
		this.logcuoc.red.ho     = 0;
		this.logcuoc.red.hoa   = 0;
		this.logcuoc.red.ro   = 0;
		this.logcuoc.red.co = 0;
		this.logcuoc.red.bich = 0;
		this.logcuoc.red.tep = 0;
		this.me_rong._string = this.me_rong.string; 
		this.me_rong.string   = '';
		this.me_ho._string = this.me_ho.string; 
		this.me_ho.string     = '';
		this.me_hoa._string = this.me_hoa.string; 
		this.me_hoa.string   = '';
		this.me_ro._string = this.me_ro.string; 
		this.me_ro.string   = '';
		this.me_co._string = this.me_co.string; 
		this.me_co.string = '';
		this.me_bich._string = this.me_bich.string; 
		this.me_bich.string = '';
		this.me_tep._string = this.me_tep.string; 
		this.me_tep.string = '';
		
		
		setTimeout(function(){
			if(this.users.red.rong > 0)
			this.me_rong.string   = helper.numberWithCommas(this.users.red.rong);
			if(this.users.red.rong > 0)
			this.me_ho.string     =helper.numberWithCommas(this.users.red.ho);
			if(this.users.red.rong > 0)
			this.me_hoa.string   = helper.numberWithCommas(this.users.red.hoa);
			if(this.users.red.rong > 0)
			this.me_ro.string   = helper.numberWithCommas(this.users.red.ro);
			if(this.users.red.rong > 0)
			this.me_co.string = helper.numberWithCommas(this.users.red.co);
			if(this.users.red.rong > 0)
			this.me_bich.string = helper.numberWithCommas(this.users.red.bich);
			if(this.users.red.rong > 0)
			this.me_tep.string = helper.numberWithCommas(this.users.red.tep);

		}.bind(this),500);
	},
	ClickReset: function(){
		//
		this.box_rong.children[1].removeAllChildren();
		this.box_ho.children[1].removeAllChildren();
		this.box_hoa.children[1].removeAllChildren();
		this.box_ro.children[1].removeAllChildren();
		this.box_co.children[1].removeAllChildren();
		this.box_bich.children[1].removeAllChildren();
		this.box_tep.children[1].removeAllChildren();

		this.me_rong.string   = '';
		this.me_ho.string     = '';
		this.me_hoa.string   = '';
		this.me_ro.string   = '';
		this.me_co.string = '';
		this.me_bich.string = '';
		this.me_tep.string = '';

		this.logcuoc.red.rong   = 0;
		this.logcuoc.red.ho     = 0;
		this.logcuoc.red.hoa   = 0;
		this.logcuoc.red.ro   = 0;
		this.logcuoc.red.co = 0;
		this.logcuoc.red.bich = 0;
		this.logcuoc.red.tep = 0;
	},
	addNotice:function(text){
		var notice = cc.instantiate(this.prefabNotice)
		var noticeComponent = notice.getComponent('mini_warning')
		noticeComponent.text.string = text;
		this.miniNotice.addChild(notice);


		setTimeout(function(){
			if(this.users.red.rong > 0)
			this.me_rong.string   = helper.numberWithCommas(this.users.red.rong);
			if(this.users.red.rong > 0)
			this.me_ho.string     =helper.numberWithCommas(this.users.red.ho);
			if(this.users.red.rong > 0)
			this.me_hoa.string   = helper.numberWithCommas(this.users.red.hoa);
			if(this.users.red.rong > 0)
			this.me_ro.string   = helper.numberWithCommas(this.users.red.ro);
			if(this.users.red.rong > 0)
			this.me_co.string = helper.numberWithCommas(this.users.red.co);
			if(this.users.red.rong > 0)
			this.me_bich.string = helper.numberWithCommas(this.users.red.bich);
			if(this.users.red.rong > 0)
			this.me_tep.string = helper.numberWithCommas(this.users.red.tep);

		}.bind(this),500);
	},
	clientsChip: function(data){
		let nodeBox = null;
		let max     = this.maxBox1_3;

		switch(data.box) {
			case 'rong':
				nodeBox = this.box_rong;
				max = this.maxBox1_1;
			break;

			case 'ho':
				nodeBox = this.box_ho;
				max = this.maxBox1_1;
			break;

			case 'hoa':
				nodeBox = this.box_hoa;
			break;

			case 'ro':
				nodeBox = this.box_ro;
			break;

			case 'co':
				nodeBox = this.box_co;
			break;

			case 'bich':
				nodeBox = this.box_bich;
			break;

			case 'tep':
				nodeBox = this.box_tep;
			break;
		}

		let position = this.users_bg.parent.convertToWorldSpaceAR(this.users_bg.position);
		position = nodeBox.children[1].convertToNodeSpaceAR(position);

		let newN = new cc.Node;
		newN = newN.addComponent(cc.Sprite);
		newN.spriteFrame = this['chip_'+data.cuoc];
		newN.node.scale    = 0.67;

		let x = (Math.random()*(max.x+1))>>0;
		let y = (Math.random()*(max.y+1))>>0;

		nodeBox.children[1].addChild(newN.node);
		let copy = cc.instantiate(this.audioSingleChip.node);
		newN.node.addChild(copy);
		copy = copy.getComponent(cc.AudioSource);

		newN.node.runAction(
			cc.sequence(
				cc.spawn(
					cc.scaleTo(0.3, 0.3),
					cc.moveTo(0.3, cc.v2(0, 0))
				),
				cc.callFunc(function(){this.play()}, copy),
				cc.sequence(
					cc.moveTo(0.1, cc.v2(0, 0)),
					cc.moveTo(0.1, cc.v2(0, 0))
				)
			));
		
	},
	meChip: function(data){
		let nodeBet = null;
		let nodeBox = null;
		let max     = this.maxBox1_3;
		this.bet.children.forEach(function(bet){
			if (bet.name == data.cuoc) {
				nodeBet = bet;
			}
		});

		switch(data.box) {
			case 'rong':
				nodeBox = this.box_rong;
				max = this.maxBox1_1;
			break;

			case 'ho':
				nodeBox = this.box_ho;
				max = this.maxBox1_1;
			break;

			case 'hoa':
				nodeBox = this.box_hoa;
			break;

			case 'ro':
				nodeBox = this.box_ro;
			break;

			case 'co':
				nodeBox = this.box_co;
			break;

			case 'bich':
				nodeBox = this.box_bich;
			break;

			case 'tep':
				nodeBox = this.box_tep;
			break;
		}

		let position = nodeBet.parent.convertToWorldSpaceAR(nodeBet.position);
		position = nodeBox.children[1].convertToNodeSpaceAR(position);

		let newN = new cc.Node;
		newN = newN.addComponent(cc.Sprite);
		newN.spriteFrame = this['chip_'+data.cuoc];
		newN.node.position = position;

		let x = (Math.random()*(max.x+1))>>0;
		let y = (Math.random()*(max.y+1))>>0;
		nodeBox.children[1].addChild(newN.node);
		let copy = cc.instantiate(this.audioSingleChip.node);
		newN.node.addChild(copy);
		copy = copy.getComponent(cc.AudioSource);
		newN.node.runAction(
			cc.sequence(
				cc.spawn(
					cc.scaleTo(0.3, 0.3),
					cc.moveTo(0.3, cc.v2(0, 0))
				),
				cc.callFunc(function(){this.play()}, copy),
				cc.sequence(
					cc.moveTo(0.1, cc.v2(0, 0)),
					cc.moveTo(0.1, cc.v2(0, 0))
				)
			));
	},
	updateMe: function(data,status){
		if (data.red) {
			this.updateMeRed(data.red,status);
		}
	},
	updateMeRed: function(data,status){
		if (data.rong > 0) {
			if(status)
			this.users.red.rong = data.rong;
			this.red && (this.me_rong.string = helper.numberWithCommas(data.rong));
		}
		if (data.ho > 0) {
			if(status)
			this.users.red.ho = data.ho;
			this.red && (this.me_ho.string = helper.numberWithCommas(data.ho));
		}
		if (data.hoa > 0) {
			if(status)
			this.users.red.hoa = data.hoa;
			this.red && (this.me_hoa.string = helper.numberWithCommas(data.hoa));
		}
		if (data.ro > 0) {
			if(status)
			this.users.red.ro = data.ro;
			this.red && (this.me_ro.string = helper.numberWithCommas(data.ro));
		}
		if (data.co > 0) {
			if(status)
			this.users.red.co = data.co;
			this.red && (this.me_co.string = helper.numberWithCommas(data.co));
		}
		if (data.bich > 0) {
			if(status)
			this.users.red.bich = data.bich;
			this.red && (this.me_bich.string = helper.numberWithCommas(data.bich));
		}
		if (data.tep > 0) {
			if(status)
			this.users.red.tep = data.tep;
			this.red && (this.me_tep.string = helper.numberWithCommas(data.tep));
		}
	},
	updateClient: function(data){
		if (data.red) {
			this.updateClientRed(data.red);
		}
		!!data.databot && this.updateBootClient(data.databot);
	},
	effectBalans: function(number1 ,number2,node){
		let number1x=number1.replace('.','');
		number1x = parseInt(number1);
		let number2x = parseInt(number2);
		if(number1x > number2x){
			this.timeIntervalbalans = setInterval(function(){
				number1 = node.string.replace('.','');
				number1x = parseInt(number1);
				if(number1x == number2x || number1x < number2x){
					node.string = helper.numberWithCommas(number2x);
					clearInterval(this.timeIntervalbalans);
					return;
				}
				number1x-=1000;
				node.string =  helper.numberWithCommas(number1x);
			}.bind(this),10);
		}else if(number1x < number2x){ 
			this.timeIntervalbalans = setInterval(function(){
				number1=node.string.replace('.','');
				number1x = parseInt(number1);
				if(number1x == number2x || number1x > number2x){
					node.string = helper.numberWithCommas(number2x);
					clearInterval(this.timeIntervalbalans);
					return;
				}
				number1x+=1000;
				node.string =  helper.numberWithCommas(number1x);
			}.bind(this),10);
		}
		 
	},	
	updateBootClient: function(data){
		if(data[0] != null){
			this.user1.active = true;
			if(this.user1.active == false){
				this.updateSpriteFrame('avatar/'+(Math.random()*18),this.me_avatar1);
			}
			this.me_name1.string =data[0].name;
				this.me_balans1.string = helper.numberWithCommas(data[0].red);			
		}else{
			this.user1.active = false;
		}
		
		if(data[1] != null){
			if(this.user2.active == false){
				this.updateSpriteFrame('avatar/'+(Math.random()*18),this.me_avatar2);
			}
			this.user2.active = true;
			this.me_name2.string =data[1].name;
			this.me_balans2.string = helper.numberWithCommas(data[1].red);
		}else{
			this.user2.active = false;
		}
		if(data[2] != null){
			if(this.user3.active == false){
				this.updateSpriteFrame('avatar/'+(Math.random()*18),this.me_avatar3);
			}
			this.user3.active = true;
			this.me_name3.string =data[2].name;
			this.me_balans3.string = helper.numberWithCommas(data[2].red);
			
		}else{
			this.user3.active = false;
		}
		if(data[3] != null){
			if(this.user4.active == false){
				this.updateSpriteFrame('avatar/'+(Math.random()*18),this.me_avatar4);
			}
			this.user4.active = true;
			this.me_name4.string =data[3].name;
			this.me_balans4.string = helper.numberWithCommas(data[3].red);
		}else{
			this.user4.active = false;
		}
		if(data[4] != null){
			if(this.user5.active == false){
				this.updateSpriteFrame('avatar/'+(Math.random()*18),this.me_avatar5);
			}
			this.user5.active = true;
			this.me_name5.string =data[4].name;
			this.me_balans5.string = helper.numberWithCommas(data[4].red);
			
		}else{
			this.user5.active = false;
		}
		
		if(data[5] != null){
			if(this.user6.active == false){
				this.updateSpriteFrame('avatar/'+(Math.random()*18),this.me_avatar6);
			}
			this.user6.active = true;
			this.me_name6.string =data[5].name;
			this.me_balans6.string = helper.numberWithCommas(data[5].red);
			
		}else{
			this.user6.active = false;
		}		
	},	
	
	updateClientRed: function(data){
		if (data.rong > 0) {
			this.clients.red.rong = data.rong;
			this.red && (this.total_rong.string = helper.numberWithCommas(data.rong));
		}
		if (data.ho > 0) {
			this.clients.red.ho = data.ho;
			this.red && (this.total_ho.string = helper.numberWithCommas(data.ho));
		}
		if (data.hoa > 0) {
			this.clients.red.hoa = data.hoa;
			this.red && (this.total_hoa.string = helper.numberWithCommas(data.hoa));
		}
		if (data.ro > 0) {
			this.clients.red.ro = data.ro;
			this.red && (this.total_ro.string = helper.numberWithCommas(data.ro));
		}
		if (data.co > 0) {
			this.clients.red.co = data.co;
			this.red && (this.total_co.string = helper.numberWithCommas(data.co));
		}
		if (data.bich > 0) {
			this.clients.red.bich = data.bich;
			this.red && (this.total_bich.string = helper.numberWithCommas(data.bich));
		}
		if (data.tep > 0) {
			this.clients.red.tep = data.tep;
			this.red && (this.total_tep.string = helper.numberWithCommas(data.tep));
		}
	},
	status: function(data){
		setTimeout(function() {
			var temp = new cc.Node;
			temp.addComponent(cc.Label);
			temp = temp.getComponent(cc.Label);
			temp.string = (data.win ? '+' : '-') + helper.numberWithCommas(data.bet);
			temp.font = data.win ? cc.RedT.util.fontCong : cc.RedT.util.fontTru;
			temp.lineHeight = 130;
			temp.fontSize   = 25;
			temp.node.position = cc.v2(0, 90);
			this.miniNotice.addChild(temp.node);
			temp.node.runAction(cc.sequence(cc.moveTo(4, cc.v2(0, 200)), cc.callFunc(function(){this.node.destroy()}, temp)));
			data.win && cc.RedT.send({user:{updateCoint: true}});
			if(void 0 !== data.thuong && data.thuong > 0){
				var thuong = new cc.Node;
				thuong.addComponent(cc.Label);
				thuong = thuong.getComponent(cc.Label);
				thuong.string = '+' + helper.numberWithCommas(data.thuong);
				thuong.font = cc.RedT.util.fontEffect;
				thuong.lineHeight = 90;
				thuong.fontSize   = 14;
				this.miniNotice.addChild(thuong.node);
				thuong.node.runAction(cc.sequence(cc.moveTo(4, cc.v2(0, 100)), cc.callFunc(function(){this.node.destroy()}, thuong)))
			}
		}
		.bind(this), 4e3)
	},
});
