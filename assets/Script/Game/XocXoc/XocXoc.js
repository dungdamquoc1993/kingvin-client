
let helper = require('Helper');
let notice = require('Notice');
let dialog = require('XocXoc_dialog');

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
		box_chan:   cc.Node,
		box_le:     cc.Node,
		box_red3:   cc.Node,
		box_red4:   cc.Node,
		box_white3: cc.Node,
		box_white4: cc.Node,
		total_chan:   cc.Label,
		total_le:     cc.Label,
		total_red3:   cc.Label,
		total_red4:   cc.Label,
		total_white3: cc.Label,
		total_white4: cc.Label,
		me_chan:   cc.Label,
		me_le:     cc.Label,
		me_red3:   cc.Label,
		me_red4:   cc.Label,
		me_white3: cc.Label,
		me_white4: cc.Label,
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
		timeWait:  cc.Label,
		nodeWait:  cc.Node,
		box_chip:    cc.Node,
		users_bg:    cc.Node,
		users_count: cc.Label,
		nodeBat: cc.Node,
		chip_1000:    cc.SpriteFrame,
		chip_10000:   cc.SpriteFrame,
		chip_50000:   cc.SpriteFrame,
		chip_100000:  cc.SpriteFrame,
		chip_1000000: cc.SpriteFrame,
		dot_red:   cc.SpriteFrame,
		dot_white: cc.SpriteFrame,

		dot: {
			default: [],
			type: cc.Sprite,
		},

		log_chan: cc.Label,
		log_le:   cc.Label,
		log_top:  cc.Node,
		logMain:  cc.Node,
		redH:    cc.Node,
		miniNotice: cc.Node,
		Animation: cc.Animation,
		prefabNotice: cc.Prefab,
		bet:     cc.Node,
		nodeRed: cc.Node,
		nodeXu:  cc.Node,
		MiniPanel: cc.Prefab,
		loading:   cc.Node,
		notice:    notice,
		dialog:    dialog,
		red: true,
	},
	ctor: function(){
		this.logs = [];
		this.nan  = false;
		this.cuoc = '1000';
		this.actionBatOpen  = cc.moveTo(0.5, cc.v2(165, 150));
		this.actionBatClose = cc.sequence(
			cc.callFunc(function(){
				this.resetData();
			}, this),
			cc.moveTo(0.5, cc.v2(0, 0)),
			cc.delayTime(0.5),
			cc.callFunc(function(){
				this.audioXocDia.play();
				this.Animation.play();
			}, this));
		this.maxDot = {x:16, y:18};

		this.maxBox1_3 = {x:0, y:0};
		this.maxBox1_1 = {x:0, y:0};

		this.clients = {
			'red': {
				'chan':   0,
				'le':     0,
				'red3':   0,
				'red4':   0,
				'white3': 0,
				'white4': 0,
			},
			'xu': {
				'chan':   0,
				'le':     0,
				'red3':   0,
				'red4':   0,
				'white3': 0,
				'white4': 0,
			},
		};

		this.logcuoc = {
			'red': {
				'chan':   0,
				'le':     0,
				'red3':   0,
				'red4':   0,
				'white3': 0,
				'white4': 0,
			},
		};

		this.users = {
			'red': {
				'chan':   0,
				'le':     0,
				'red3':   0,
				'red4':   0,
				'white3': 0,
				'white4': 0,
			},
			'xu': {
				'chan':   0,
				'le':     0,
				'red3':   0,
				'red4':   0,
				'white3': 0,
				'white4': 0,
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
			cc.RedT.send({scene:"xocxoc", g:{xocxoc:{ingame:true}}});
		},1000)
	},
	onData: function(data) {
		if (void 0 !== data.user){
			this.userData(data.user);
			cc.RedT.userData(data.user);
		}
		if (void 0 !== data.xocxoc){
			this.xocxoc(data.xocxoc);
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
	backGame: function(){
		clearInterval(this.timeInterval);
		cc.RedT.send({g:{xocxoc:{outgame:true}}});
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
	xocxoc: function(data){
		if (!!data.ingame) {
			this.xocxocIngame(data.ingame);
		}
		if (!!data.finish) {
			this.xocxocFinish(data.finish);
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
	xocxocIngame: function(data){
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
				this.nodeBat.position = cc.v2(0, 246);
				this.setDot([data.logs[0].red1, data.logs[0].red2, data.logs[0].red3, data.logs[0].red4]);
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
				case 'chan':
					max = this.maxBox1_1;
				break;

				case 'le':
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
	xocxocFinish: function(data){
		let dice = {red1:data[0], red2:data[1], red3:data[2], red4:data[3]};
		this.logs.unshift(dice);
		this.logs.length > 48 && this.logs.pop();
		this.setDot(data);
		this.labelTime.node.active = false;
		this.time_remain = 43;
		this.playTime();

		if (!this.nan) {
			this.FinishTT();
		}
	},
	FinishTT: function(){
		this.audioMoBat.play();
		this.nodeBat.runAction(
			cc.sequence(
				this.actionBatOpen,
				cc.callFunc(this.showKQ, this),
				cc.delayTime(1),
				cc.callFunc(this.showKQ2, this),
			)
		);
		this.setLogs();
	},
	showKQ: function(){
		let data = Object.values(this.logs[0]);
		let numb = 0;
		data.forEach(function(dot){
			if (dot) {
				numb++;
			}
		});

		if (!(numb%2)) {
			this.box_chan.children[0].active = true;
		}else{
			this.box_le.children[0].active = true;
		}

		switch(numb) {
			case 0:
				this.box_white4.children[0].active = true;
			break;

			case 1:
				this.box_white3.children[0].active = true;
			break;

			case 3:
				this.box_red3.children[0].active = true;
			break;

			case 4:
				this.box_red4.children[0].active = true;
			break;
		}
	},
	showKQ2: function(){
		let audioLost = 0;
		let audioWin  = 0;
		let node1 = null;
		let node2 = null;
		let data  = Object.values(this.logs[0]);
		let numb  = 0;
		data.forEach(function(dot){
			if (dot) {
				numb++;
			}
		});

		let position = this.box_chip.parent.convertToWorldSpaceAR(this.box_chip.position);
		let centerMid = null;
		let centerLR  = null;

		if (!(numb%2)) {
			node1 = this.box_chan.children[1];
			audioLost += this.box_le.children[1].children.length;
			centerMid = this.box_le.children[1].convertToNodeSpaceAR(position);
			Promise.all(this.box_le.children[1].children.map(function(chip){
				chip.runAction(
					cc.spawn(
						cc.scaleTo(0.4, 0.5),
						cc.moveTo(0.4, centerMid)
					),
				);
			}));
		}else{
			node1 = this.box_le.children[1];
			audioLost += this.box_chan.children[1].children.length;
			centerMid = this.box_chan.children[1].convertToNodeSpaceAR(position);
			Promise.all(this.box_chan.children[1].children.map(function(chip){
				chip.runAction(
					cc.spawn(
						cc.scaleTo(0.4, 0.5),
						cc.moveTo(0.4, centerMid)
					),
				);
			}));
		}

		let red3   = this.box_red3.children[1].convertToNodeSpaceAR(position);
		let red4   = this.box_red4.children[1].convertToNodeSpaceAR(position);
		let white3 = this.box_white3.children[1].convertToNodeSpaceAR(position);
		let white4 = this.box_white4.children[1].convertToNodeSpaceAR(position);

		switch(numb) {
			case 0:
				node2 = this.box_white4.children[1];
				audioLost += this.box_red3.children[1].children.length+this.box_red4.children[1].children.length+this.box_white3.children[1].children.length;
				Promise.all(this.box_red3.children[1].children.map(function(chip){
					chip.runAction(
						cc.spawn(
							cc.scaleTo(0.4, 0.5),
							cc.moveTo(0.4, red3)
						),
					);
				}));
				Promise.all(this.box_red4.children[1].children.map(function(chip){
					chip.runAction(
						cc.spawn(
							cc.scaleTo(0.4, 0.5),
							cc.moveTo(0.4, red4)
						),
					);
				}));
				Promise.all(this.box_white3.children[1].children.map(function(chip){
					chip.runAction(
						cc.spawn(
							cc.scaleTo(0.4, 0.5),
							cc.moveTo(0.4, white3)
						),
					);
				}));
			break;

			case 1:
				node2 = this.box_white3.children[1];
				audioLost += this.box_red3.children[1].children.length+this.box_red4.children[1].children.length+this.box_white4.children[1].children.length;
				Promise.all(this.box_red3.children[1].children.map(function(chip){
					chip.runAction(
						cc.spawn(
							cc.scaleTo(0.4, 0.5),
							cc.moveTo(0.4, red3)
						),
					);
				}));
				Promise.all(this.box_red4.children[1].children.map(function(chip){
					chip.runAction(
						cc.spawn(
							cc.scaleTo(0.4, 0.5),
							cc.moveTo(0.4, red4)
						),
					);
				}));
				Promise.all(this.box_white4.children[1].children.map(function(chip){
					chip.runAction(
						cc.spawn(
							cc.scaleTo(0.4, 0.5),
							cc.moveTo(0.4, white4)
						),
					);
				}));
			break;

			case 2:
				audioLost += this.box_red3.children[1].children.length+this.box_red4.children[1].children.length+this.box_white3.children[1].children.length+this.box_white4.children[1].children.length;
				Promise.all(this.box_red3.children[1].children.map(function(chip){
					chip.runAction(
						cc.spawn(
							cc.scaleTo(0.4, 0.5),
							cc.moveTo(0.4, red3)
						),
					);
				}));
				Promise.all(this.box_red4.children[1].children.map(function(chip){
					chip.runAction(
						cc.spawn(
							cc.scaleTo(0.4, 0.5),
							cc.moveTo(0.4, red4)
						),
					);
				}));
				Promise.all(this.box_white3.children[1].children.map(function(chip){
					chip.runAction(
						cc.spawn(
							cc.scaleTo(0.4, 0.5),
							cc.moveTo(0.4, white4)
						),
					);
				}));
				Promise.all(this.box_white4.children[1].children.map(function(chip){
					chip.runAction(
						cc.spawn(
							cc.scaleTo(0.4, 0.5),
							cc.moveTo(0.4, white4)
						),
					);
				}));
			break;

			case 3:
				node2 = this.box_red3.children[1];
				audioLost += this.box_white3.children[1].children.length+this.box_red4.children[1].children.length+this.box_white4.children[1].children.length;
				Promise.all(this.box_white3.children[1].children.map(function(chip){
					chip.runAction(
						cc.spawn(
							cc.scaleTo(0.4, 0.5),
							cc.moveTo(0.4, white3)
						),
					);
				}));
				Promise.all(this.box_red4.children[1].children.map(function(chip){
					chip.runAction(
						cc.spawn(
							cc.scaleTo(0.4, 0.5),
							cc.moveTo(0.4, red4)
						),
					);
				}));
				Promise.all(this.box_white4.children[1].children.map(function(chip){
					chip.runAction(
						cc.spawn(
							cc.scaleTo(0.4, 0.5),
							cc.moveTo(0.4, white4)
						),
					);
				}));
			break;

			case 4:
				node2 = this.box_red4.children[1];
				audioLost += this.box_white3.children[1].children.length+this.box_red3.children[1].children.length+this.box_white4.children[1].children.length;
				Promise.all(this.box_white3.children[1].children.map(function(chip){
					chip.runAction(
						cc.spawn(
							cc.scaleTo(0.4, 0.5),
							cc.moveTo(0.4, white3)
						),
					);
				}));
				Promise.all(this.box_red3.children[1].children.map(function(chip){
					chip.runAction(
						cc.spawn(
							cc.scaleTo(0.4, 0.5),
							cc.moveTo(0.4, red3)
						),
					);
				}));
				Promise.all(this.box_white4.children[1].children.map(function(chip){
					chip.runAction(
						cc.spawn(
							cc.scaleTo(0.4, 0.5),
							cc.moveTo(0.4, white4)
						),
					);
				}));
			break;
		}
		!!audioLost && this.audioMultiChip.play();
		setTimeout(function(){
			let self = this;
			audioWin += node1.children.length;
			node1.children.forEach(function(chip){
				let copy = cc.instantiate(chip);
				copy.position = centerMid;
				copy.scale    = 0.5;

				let x = (Math.random()*(self.maxBox1_1.x+1))>>0;
				let y = (Math.random()*(self.maxBox1_1.y+1))>>0;

				node1.addChild(copy);
				copy.runAction(
					cc.sequence(
						cc.spawn(
							cc.scaleTo(0.4, 0.3),
							cc.moveTo(0.4, cc.v2(x, y))
						),
						cc.sequence(
							cc.moveTo(0.1, cc.v2(x, y-6)),
							cc.moveTo(0.1, cc.v2(x, y))
						)
					));
			});

			if (node2) {
				audioWin += node2.children.length;
				let node2red = node2.convertToNodeSpaceAR(position);
				node2.children.forEach(function(chip){
					let copy = cc.instantiate(chip);
					copy.position = node2red;
					copy.scale    = 0.5;

					let x = (Math.random()*(self.maxBox1_3.x+1))>>0;
					let y = (Math.random()*(self.maxBox1_3.y+1))>>0;

					node2.addChild(copy);
					copy.runAction(
						cc.sequence(
							cc.spawn(
								cc.scaleTo(0.4, 0.3),
								cc.moveTo(0.4, cc.v2(x, y))
							),
							cc.sequence(
								cc.moveTo(0.1, cc.v2(x, y-6)),
								cc.moveTo(0.1, cc.v2(x, y))
							)
						));
				});
			}
			if (!!audioWin) {
				Promise.all([1,2,3,4,5].map(function(audio){
					if (audio !== 1) {
						self['audioMultiChip'+audio].play();
					}else{
						self.audioMultiChip.play();
					}
				}));
			}
			setTimeout(function(){
				let positionUser = this.users_bg.parent.convertToWorldSpaceAR(this.users_bg.position);
				let position1_1 = node1.convertToNodeSpaceAR(positionUser);

				node1.children.forEach(function(chip){
					chip.runAction(
						cc.spawn(
							cc.fadeTo(0.4, 0),
							cc.moveTo(0.4, position1_1)
						));
				});
				if (node2) {
					let position1_3 = node2.convertToNodeSpaceAR(positionUser);
					node2.children.forEach(function(chip){
						chip.runAction(
							cc.spawn(
								cc.fadeTo(0.4, 0),
								cc.moveTo(0.4, position1_3)
							));
					});
				}
			}.bind(this), 3000);
		}.bind(this), 1500);
	},
	setDot: function(data){
		let self = this;
		let Dot_x = (Math.random()*(this.maxDot.x+1))>>0;
		let Dot_y = (Math.random()*(this.maxDot.y+1))>>0;
		let DotCheck = Dot_y-Dot_x;
		if (DotCheck > 22) {
			Dot_y = Dot_y-Dot_y/1.4;
		}
		this.dot[0].node.position = cc.v2(Dot_x, Dot_y);

		Dot_x = (Math.random()*(this.maxDot.x+1))>>0;
		Dot_y = (Math.random()*(this.maxDot.y+1))>>0;
		DotCheck = Dot_y-Dot_x;
		if (DotCheck > 22) {
			Dot_y = Dot_y-Dot_y/1.4;
		}
		this.dot[1].node.position = cc.v2(Dot_x, Dot_y);

		Dot_x = (Math.random()*(this.maxDot.x+1))>>0;
		Dot_y = (Math.random()*(this.maxDot.y+1))>>0;
		DotCheck = Dot_y-Dot_x;
		if (DotCheck > 22) {
			Dot_y = Dot_y-Dot_y/1.4;
		}
		this.dot[2].node.position = cc.v2(Dot_x, Dot_y);

		Dot_x = (Math.random()*(this.maxDot.x+1))>>0;
		Dot_y = (Math.random()*(this.maxDot.y+1))>>0;
		DotCheck = Dot_y-Dot_x;
		if (DotCheck > 22) {
			Dot_y = Dot_y-Dot_y/1.4;
		}
		this.dot[3].node.position = cc.v2(Dot_x, Dot_y);

		this.dot.forEach(function(dot, index){
			let check = data[index];
			if (check) {
				dot.spriteFrame = self.dot_red;
			}else{
				dot.spriteFrame = self.dot_white;
			}
		});
	},
	onDestroy(){
		void 0 !== this.timeInterval && clearInterval(this.timeInterval);
	},
	playTime: function(){
		void 0 !== this.timeInterval && clearInterval(this.timeInterval);
		this.timeInterval = setInterval(function(){
			if(this.time_remain > 0 && (this.time_remain % 2 == 0)){
				if(this.users_count.string != null || !this.users_count.string == ''){

					if((Math.random()*2+1) < 2 ){
						this.users_count.string = parseInt(this.users_count.string) + (Math.random()*6 +1)>>0;
					}else{
						
						this.users_count.string = parseInt(this.users_count.string) - (Math.random()*4 +1)>>0;
						if(parseInt(this.users_count.string) <= 0){
							this.users_count.string = parseInt(this.users_count.string) + (Math.random()*6 +1)>>0;
						}
					}
				}
				
			}
			if (this.time_remain > 32) {
				var time = helper.numberPad(this.time_remain-33, 2);
				if(this.timeWait)
				this.timeWait.string = time;
				if(	this.labelTime)
				this.labelTime.node.active = false;
				if(this.nodeWait)
				this.nodeWait.active = true;
			}else if(this.time_remain > 30){
				// Xoc Dia
				if(this.labelTime)
				this.labelTime.node.active = false;
				if(this.nodeWait)
				this.nodeWait.active = false;
				this.time_remain === 32 && this.nodeBat.runAction(this.actionBatClose);
			}else{
				if (this.time_remain > -1) {
					var time = helper.numberPad(this.time_remain, 2);
					if(this.labelTime)
					this.labelTime.node.active  = true;
					if(this.nodeWait)
					this.nodeWait.active  = false;
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
			this.total_chan.string   = data.red.chan   > 0 ? helper.numberWithCommas(data.red.chan)   : '';
			this.total_le.string     = data.red.le     > 0 ? helper.numberWithCommas(data.red.le)     : '';
			this.total_red3.string   = data.red.red3   > 0 ? helper.numberWithCommas(data.red.red3)   : '';
			this.total_red4.string   = data.red.red4   > 0 ? helper.numberWithCommas(data.red.red4)   : '';
			this.total_white3.string = data.red.white3 > 0 ? helper.numberWithCommas(data.red.white3) : '';
			this.total_white4.string = data.red.white4 > 0 ? helper.numberWithCommas(data.red.white4) : '';
		}else{
			this.total_chan.string   = data.xu.chan   > 0 ? helper.numberWithCommas(data.xu.chan)   : '';
			this.total_le.string     = data.xu.le     > 0 ? helper.numberWithCommas(data.xu.le)     : '';
			this.total_red3.string   = data.xu.red3   > 0 ? helper.numberWithCommas(data.xu.red3)   : '';
			this.total_red4.string   = data.xu.red4   > 0 ? helper.numberWithCommas(data.xu.red4)   : '';
			this.total_white3.string = data.xu.white3 > 0 ? helper.numberWithCommas(data.xu.white3) : '';
			this.total_white4.string = data.xu.white4 > 0 ? helper.numberWithCommas(data.xu.white4) : '';
		}
	},
	resetData: function(){
		this.box_chan.children[1].removeAllChildren();
		this.box_le.children[1].removeAllChildren();
		this.box_white4.children[1].removeAllChildren();
		this.box_white3.children[1].removeAllChildren();
		this.box_red3.children[1].removeAllChildren();
		this.box_red4.children[1].removeAllChildren();

		this.box_chan.children[0].active   = false;
		this.box_le.children[0].active     = false;
		this.box_white4.children[0].active = false;
		this.box_white3.children[0].active = false;
		this.box_red3.children[0].active   = false;
		this.box_red4.children[0].active   = false;

		this.total_chan.string   = '';
		this.total_le.string     = '';
		this.total_red3.string   = '';
		this.total_red4.string   = '';
		this.total_white3.string = '';
		this.total_white4.string = '';

		this.me_chan.string   = '';
		this.me_le.string     = '';
		this.me_red3.string   = '';
		this.me_red4.string   = '';
		this.me_white3.string = '';
		this.me_white4.string = '';

		this.users.red.chan   = 0;
		this.users.red.le     = 0;
		this.users.red.red3   = 0;
		this.users.red.red4   = 0;
		this.users.red.white3 = 0;
		this.users.red.white4 = 0;

		this.users.xu.chan   = 0;
		this.users.xu.le     = 0;
		this.users.xu.red3   = 0;
		this.users.xu.red4   = 0;
		this.users.xu.white3 = 0;
		this.users.xu.white4 = 0;

		this.clients.red.chan   = 0;
		this.clients.red.le     = 0;
		this.clients.red.red3   = 0;
		this.clients.red.red4   = 0;
		this.clients.red.white3 = 0;
		this.clients.red.white4 = 0;

		this.clients.xu.chan   = 0;
		this.clients.xu.le     = 0;
		this.clients.xu.red3   = 0;
		this.clients.xu.red4   = 0;
		this.clients.xu.white3 = 0;
		this.clients.xu.white4 = 0;

		this.logcuoc.red.chan   = 0;
		this.logcuoc.red.le     = 0;
		this.logcuoc.red.red3   = 0;
		this.logcuoc.red.red4   = 0;
		this.logcuoc.red.white3 = 0;
		this.logcuoc.red.white4 = 0;
	},
	setLogs: function(){
		let self = this;
		this.logMain.forEach(function(obj, index){
			let data = self.logs[index];
			if (data) {
				obj.node.active = true;
				data = Object.values(data);
				let gameChan = 0;     // Là chẵn
				data.forEach(function(kqH){
					if (kqH) {
						gameChan++;
					}
				});
				if (!(gameChan%2)) {
					obj.spriteFrame = self.dot_white;
				}else{
					obj.spriteFrame = self.dot_red;
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
	changerCoint: function(){
		this.red            = !this.red;
		this.nodeRed.active = !this.nodeRed.active;
		this.nodeXu.active  = !this.nodeXu.active;
		this.updateMeCoint();
	},
	onCuoc: function(event, box){
		this.logcuoc.red[box]  += parseInt(this.cuoc);
		this.meChip({box:box, cuoc:parseInt(this.cuoc)});
		this.updateMe(this.logcuoc,false);
		cc.RedT.send({g:{xocxoc:{cuoc:{red:this.red, cuoc:this.cuoc, box:this.logcuoc}}}});		
		this.logcuoc.red.chan   = 0;
		this.logcuoc.red.le     = 0;
		this.logcuoc.red.red3   = 0;
		this.logcuoc.red.red4   = 0;
		this.logcuoc.red.white3 = 0;
		this.logcuoc.red.white4 = 0;
	},
	ClickCuoc: function(){	
		cc.RedT.send({g:{xocxoc:{cuoc:{red:this.red, cuoc:this.cuoc, box:this.logcuoc}}}});		
		this.logcuoc.red.chan   = 0;
		this.logcuoc.red.le     = 0;
		this.logcuoc.red.red3   = 0;
		this.logcuoc.red.red4   = 0;
		this.logcuoc.red.white3 = 0;
		this.logcuoc.red.white4 = 0;

		this.me_chan.string   = '';
		this.me_le.string     = '';
		this.me_red3.string   = '';
		this.me_red4.string   = '';
		this.me_white3.string = '';
		this.me_white4.string = '';

		setTimeout(function(){
				this.me_chan.string   = this.users.red.chan   > 0 ? helper.numberWithCommas(this.users.red.chan)   : '';
				this.me_le.string     = this.users.red.le     > 0 ? helper.numberWithCommas(this.users.red.le)     : '';
				this.me_red3.string   = this.users.red.red3   > 0 ? helper.numberWithCommas(this.users.red.red3)   : '';
				this.me_red4.string   = this.users.red.red4   > 0 ? helper.numberWithCommas(this.users.red.red4)   : '';
				this.me_white3.string = this.users.red.white3 > 0 ? helper.numberWithCommas(this.users.red.white3) : '';
				this.me_white4.string = this.users.red.white4 > 0 ? helper.numberWithCommas(this.users.red.white4) : '';

		}.bind(this),500);

	},
	ClickReset: function(){
		//
		this.box_chan.children[1].removeAllChildren();
		this.box_le.children[1].removeAllChildren();
		this.box_white4.children[1].removeAllChildren();
		this.box_white3.children[1].removeAllChildren();
		this.box_red3.children[1].removeAllChildren();
		this.box_red4.children[1].removeAllChildren();

		this.me_chan.string   = '';
		this.me_le.string     = '';
		this.me_red3.string   = '';
		this.me_red4.string   = '';
		this.me_white3.string = '';
		this.me_white4.string = '';

		this.logcuoc.red.chan   = 0;
		this.logcuoc.red.le     = 0;
		this.logcuoc.red.red3   = 0;
		this.logcuoc.red.red4   = 0;
		this.logcuoc.red.white3 = 0;
		this.logcuoc.red.white4 = 0;

	},
	addNotice:function(text){
		var notice = cc.instantiate(this.prefabNotice)
		var noticeComponent = notice.getComponent('mini_warning')
		noticeComponent.text.string = text;
		this.miniNotice.addChild(notice);

			console.log(this.users.red);
			setTimeout(function(){
				this.me_chan.string   = this.users.red.chan   > 0 ? helper.numberWithCommas(this.users.red.chan)   : '';
				this.me_le.string     = this.users.red.le     > 0 ? helper.numberWithCommas(this.users.red.le)     : '';
				this.me_red3.string   = this.users.red.red3   > 0 ? helper.numberWithCommas(this.users.red.red3)   : '';
				this.me_red4.string   = this.users.red.red4   > 0 ? helper.numberWithCommas(this.users.red.red4)   : '';
				this.me_white3.string = this.users.red.white3 > 0 ? helper.numberWithCommas(this.users.red.white3) : '';
				this.me_white4.string = this.users.red.white4 > 0 ? helper.numberWithCommas(this.users.red.white4) : '';

		    }.bind(this),10);


	},
	clientsChip: function(data){
		let nodeBox = null;
		let max     = this.maxBox1_3;

		switch(data.box) {
			case 'chan':
				nodeBox = this.box_chan;
				max = this.maxBox1_1;
			break;

			case 'le':
				nodeBox = this.box_le;
				max = this.maxBox1_1;
			break;

			case 'red3':
				nodeBox = this.box_red3;
			break;

			case 'red4':
				nodeBox = this.box_red4;
			break;

			case 'white3':
				nodeBox = this.box_white3;
			break;

			case 'white4':
				nodeBox = this.box_white4;
			break;
		}

		let position = this.users_bg.parent.convertToWorldSpaceAR(this.users_bg.position);
		position = nodeBox.children[1].convertToNodeSpaceAR(position);

		let newN = new cc.Node;
		newN = newN.addComponent(cc.Sprite);
		newN.spriteFrame = this['chip_'+data.cuoc];
		newN.node.position = position;
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
					cc.scaleTo(0.4, 0.3),
					cc.moveTo(0.4, cc.v2(0, 0))
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
			case 'chan':
				nodeBox = this.box_chan;
				max = this.maxBox1_1;
			break;

			case 'le':
				nodeBox = this.box_le;
				max = this.maxBox1_1;
			break;

			case 'red3':
				nodeBox = this.box_red3;
			break;

			case 'red4':
				nodeBox = this.box_red4;
			break;

			case 'white3':
				nodeBox = this.box_white3;
			break;

			case 'white4':
				nodeBox = this.box_white4;
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

		// this.audioSingleChip.node
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
		if (data.xu) {
			this.updateMeXu(data.xu,status);
		}
	},
	updateMeRed: function(data,status){
		if (data.chan > 0) {
			if(status)
			this.users.red.chan = data.chan;
			this.red && (this.me_chan.string = helper.numberWithCommas(data.chan));
		}
		if (data.le > 0) {
			if(status)
			this.users.red.le = data.le;
			this.red && (this.me_le.string = helper.numberWithCommas(data.le));
		}
		if (data.red3 > 0) {
			if(status)
			this.users.red.red3 = data.red3;
			this.red && (this.me_red3.string = helper.numberWithCommas(data.red3));
		}
		if (data.red4 > 0) {
			if(status)
			this.users.red.red4 = data.red4;
			this.red && (this.me_red4.string = helper.numberWithCommas(data.red4));
		}
		if (data.white3 > 0) {
			if(status)
			this.users.red.white3 = data.white3;
			this.red && (this.me_white3.string = helper.numberWithCommas(data.white3));
		}
		if (data.white4 > 0) {
			if(status)
			this.users.red.white4 = data.white4;
			this.red && (this.me_white4.string = helper.numberWithCommas(data.white4));
		}
	},
	updateMeXu: function(data){
		if (data.chan > 0) {
			this.users.xu.chan = data.chan;
			!this.red && (this.me_chan.string = helper.numberWithCommas(data.chan));
		}
		if (data.le > 0) {
			this.users.xu.le = data.le;
			!this.red && (this.me_le.string = helper.numberWithCommas(data.le));
		}
		if (data.red3 > 0) {
			this.users.xu.red3 = data.red3;
			!this.red && (this.me_red3.string = helper.numberWithCommas(data.red3));
		}
		if (data.red4 > 0) {
			this.users.xu.red4 = data.red4;
			!this.red && (this.me_red4.string = helper.numberWithCommas(data.red4));
		}
		if (data.white3 > 0) {
			this.users.xu.white3 = data.white3;
			!this.red && (this.me_white3.string = helper.numberWithCommas(data.white3));
		}
		if (data.white4 > 0) {
			this.users.xu.white4 = data.white4;
			!this.red && (this.me_white4.string = helper.numberWithCommas(data.white4));
		}
	},

	updateClient: function(data){
		if (data.red) {
			this.updateClientRed(data.red);
		}
		if (data.xu) {
			this.updateClientXu(data.xu);
		}
		!!data.databotxocxoc && this.updateBootClient(data.databotxocxoc);
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
		if (data.chan > 0) {
			this.clients.red.chan = data.chan;
			this.red && (this.total_chan.string = helper.numberWithCommas(data.chan));
		}
		if (data.le > 0) {
			this.clients.red.le = data.le;
			this.red && (this.total_le.string = helper.numberWithCommas(data.le));
		}
		if (data.red3 > 0) {
			this.clients.red.red3 = data.red3;
			this.red && (this.total_red3.string = helper.numberWithCommas(data.red3));
		}
		if (data.red4 > 0) {
			this.clients.red.red4 = data.red4;
			this.red && (this.total_red4.string = helper.numberWithCommas(data.red4));
		}
		if (data.white3 > 0) {
			this.clients.red.white3 = data.white3;
			this.red && (this.total_white3.string = helper.numberWithCommas(data.white3));
		}
		if (data.white4 > 0) {
			this.clients.red.white4 = data.white4;
			this.red && (this.total_white4.string = helper.numberWithCommas(data.white4));
		}
	},
	updateClientXu: function(data){
		if (data.chan > 0) {
			this.clients.xu.chan = data.chan;
			!this.red && (this.total_chan.string = helper.numberWithCommas(data.chan));
		}
		if (data.le > 0) {
			this.clients.xu.le = data.le;
			!this.red && (this.total_le.string = helper.numberWithCommas(data.le));
		}
		if (data.red3 > 0) {
			this.clients.xu.red3 = data.red3;
			!this.red && (this.total_red3.string = helper.numberWithCommas(data.red3));
		}
		if (data.red4 > 0) {
			this.clients.xu.red4 = data.red4;
			!this.red && (this.total_red4.string = helper.numberWithCommas(data.red4));
		}
		if (data.white3 > 0) {
			this.clients.xu.white3 = data.white3;
			!this.red && (this.total_white3.string = helper.numberWithCommas(data.white3));
		}
		if (data.white4 > 0) {
			this.clients.xu.white4 = data.white4;
			!this.red && (this.total_white4.string = helper.numberWithCommas(data.white4));
		}
	},
	updateMeCoint: function(){
		if (this.red) {
			this.me_chan.string   = this.users.red.chan   > 0 ? helper.numberWithCommas(this.users.red.chan)   : '';
			this.me_le.string     = this.users.red.le     > 0 ? helper.numberWithCommas(this.users.red.le)     : '';
			this.me_red3.string   = this.users.red.red3   > 0 ? helper.numberWithCommas(this.users.red.red3)   : '';
			this.me_red4.string   = this.users.red.red4   > 0 ? helper.numberWithCommas(this.users.red.red4)   : '';
			this.me_white3.string = this.users.red.white3 > 0 ? helper.numberWithCommas(this.users.red.white3) : '';
			this.me_white4.string = this.users.red.white4 > 0 ? helper.numberWithCommas(this.users.red.white4) : '';

			this.total_chan.string   = this.clients.red.chan   > 0 ? helper.numberWithCommas(this.clients.red.chan)   : '';
			this.total_le.string     = this.clients.red.le     > 0 ? helper.numberWithCommas(this.clients.red.le)     : '';
			this.total_red3.string   = this.clients.red.red3   > 0 ? helper.numberWithCommas(this.clients.red.red3)   : '';
			this.total_red4.string   = this.clients.red.red4   > 0 ? helper.numberWithCommas(this.clients.red.red4)   : '';
			this.total_white3.string = this.clients.red.white3 > 0 ? helper.numberWithCommas(this.clients.red.white3) : '';
			this.total_white4.string = this.clients.red.white4 > 0 ? helper.numberWithCommas(this.clients.red.white4) : '';
		}else{
			this.me_chan.string   = this.users.xu.chan   > 0 ? helper.numberWithCommas(this.users.xu.chan)   : '';
			this.me_le.string     = this.users.xu.le     > 0 ? helper.numberWithCommas(this.users.xu.le)     : '';
			this.me_red3.string   = this.users.xu.red3   > 0 ? helper.numberWithCommas(this.users.xu.red3)   : '';
			this.me_red4.string   = this.users.xu.red4   > 0 ? helper.numberWithCommas(this.users.xu.red4)   : '';
			this.me_white3.string = this.users.xu.white3 > 0 ? helper.numberWithCommas(this.users.xu.white3) : '';
			this.me_white4.string = this.users.xu.white4 > 0 ? helper.numberWithCommas(this.users.xu.white4) : '';

			this.total_chan.string   = this.clients.xu.chan   > 0 ? helper.numberWithCommas(this.clients.xu.chan)   : '';
			this.total_le.string     = this.clients.xu.le     > 0 ? helper.numberWithCommas(this.clients.xu.le)     : '';
			this.total_red3.string   = this.clients.xu.red3   > 0 ? helper.numberWithCommas(this.clients.xu.red3)   : '';
			this.total_red4.string   = this.clients.xu.red4   > 0 ? helper.numberWithCommas(this.clients.xu.red4)   : '';
			this.total_white3.string = this.clients.xu.white3 > 0 ? helper.numberWithCommas(this.clients.xu.white3) : '';
			this.total_white4.string = this.clients.xu.white4 > 0 ? helper.numberWithCommas(this.clients.xu.white4) : '';
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
