function DungeonEngine(canvasId) {

	// EaselJS stage
	this.canvas = document.getElementById(canvasId);
	this.stage = new createjs.Stage(this.canvas);

	// UI variables, sizes
	this.statusBoxHeight = 50;
	this.statusBoxFontColor = "#FFFFFF";

	// Player name
	this.playerNameFont = "18px Verdana";
	this.playerNameOffsetX = 90;
	this.playerNameOffsetY = 5;

	// Player stats
	this.playerStatsFont = "14px Verdana";
	this.playerStatsOffsetX = 5;
	this.playerStatsOffsetY = 25;

	// Mob name
	this.mobFontSize = 18;
	this.mobNameFont = this.mobFontSize + 'px Verdana';
	this.mobNameOffsetX = 500;
	this.mobNameOffsetY = 5;

	// Mob stats
	this.mobStatsFont = "14px Verdana";
	this.mobStatsOffsetX = this.mobNameOffsetX + 5;
	this.mobStatsOffsetY = this.mobFontSize + this.mobNameOffsetY;

	// Player graphic
	this.playerGraphicOffsetX = 110;
	this.playerGraphicOffsetY = 0;
	this.playerGraphicBodyWidth = 50;
	this.playerGraphicBodyHeight = 100;
	this.playerGraphicHeadWidth = 50;
	this.playerGraphicHeadHeight = 50;

	// Mob graphic
	this.mobGraphicOffsetX = 510;
	this.mobGraphicOffsetY = 50;
	this.mobGraphicBodyWidth = 25;
	this.mobGraphicBodyHeight = 50;
	this.mobGraphicHeadWidth = 25;
	this.mobGraphicHeadHeight = 25;

	// EaselJS Update loop
	this.updateLoop = function (gameState, currentBiome) {
		// Clear the stage, remove all children
		this.stage.removeAllChildren();
		this.stage.clear();

		// Draw background
		function drawBackground() {
			var cave = new createjs.Bitmap("media/caveBackground.png");
			var desert = new createjs.Bitmap("media/desertBackground.png");
			var tundra = new createjs.Bitmap("media/tundraBackground.png");
			var swamp = new createjs.Bitmap("media/swampBackground.png");
			var ctx = this.stage.canvas.getContext("2d");

			if (currentBiome == "Cave") {
				this.stage.addChild(cave);

				ctx.save();
				ctx.drawImage(cave.image, 0, 0);
			}else if (currentBiome == "Desert") {
				this.stage.addChild(desert);

				ctx.save();
				ctx.drawImage(desert.image, 0, 0);
			}else if (currentBiome == "Tundra") {
				this.stage.addChild(tundra);

				ctx.save();
				ctx.drawImage(tundra.image, 0, 0);
			}else {
				this.stage.addChild(swamp);

				ctx.save();
				ctx.drawImage(swamp.image, 0, 0);
			}

			 this.stage.update();		
		};

		// Draw status box at bottom of screen
		function drawStatusBox() {
			var i, stat;

			// Draw outline
			var statusBox = new createjs.Shape();
			statusBox.graphics.beginStroke("#666699")
				.beginFill("#000080")
				.drawRect(0, this.stage.canvas.height-this.statusBoxHeight, this.stage.canvas.width, this.statusBoxHeight);
			this.stage.addChild(statusBox);

			// Draw Player name
			var playerName = new createjs.Text(gameState.player.name + ': ' + gameState.player.hp, this.playerNameFont, this.statusBoxFontColor);
			playerName.x = this.playerNameOffsetX;
			playerName.y = this.stage.canvas.height - this.statusBoxHeight + this.playerNameOffsetY;
			this.stage.addChild(playerName);

			// Draw player stats
			i = 0;
			for (stat in gameState.player) {
				// Only direct properties, strings, numbers, & booleans
				if (gameState.player.hasOwnProperty(stat)
					&& (typeof gameState.player[stat] === 'string'
						|| typeof gameState.player[stat] === 'number'
						|| typeof gameState.player[stat] === 'boolean')) {
					// skip name and hp, already displayed, hide certain stats
					if (stat === 'name' || stat === 'hp' || stat === 'miss' || stat === 'armor' || stat === 'maxHp' || stat === 'atk' || stat === 'baseHp' || stat === 'xp' || stat === 'randomColor'
						|| stat === 'randomAlpha') {
						continue;
					}

					// draw stat
					var statText = new createjs.Text(stat +': ' + gameState.player[stat],
					 this.playerStatsFont, this.statusBoxFontColor);
					statText.x = this.playerStatsOffsetX + (i*75);
					statText.y = this.stage.canvas.height - this.statusBoxHeight + this.playerStatsOffsetY +
					 this.playerNameOffsetY;// + (i*15);
					this.stage.addChild(statText);
					i++;
				}
			}

			// Draw Mob name
			var mobName = new createjs.Text(gameState.mob.name + ': ' + gameState.mob.hp, this.mobNameFont, this.statusBoxFontColor);
			mobName.x = this.mobNameOffsetX;
			mobName.y = this.stage.canvas.height - this.statusBoxHeight + this.mobNameOffsetY;
			this.stage.addChild(mobName);

			// Draw mob stats
			i = 0;
			//for (stat in gameState.mob) {
				// Only direct properties, strings, numbers, & booleans
				//if (gameState.mob.hasOwnProperty(stat)
					//&& (typeof gameState.mob[stat] === 'string'
					//	|| typeof gameState.mob[stat] === 'number'
					//	|| typeof gameState.mob[stat] === 'boolean')) {
					// skip name and hp, already displayed
					//if (stat === 'name' || stat === 'hp' || stat === 'lvl' || stat === 'xp'
					//	|| stat === '') {
					//	continue;
					//}

					// draw stat
					//var statText = new createjs.Text(stat +': ' + gameState.mob[stat], this.mobStatsFont, this.statusBoxFontColor);
					//statText.x = this.mobStatsOffsetX;
					//statText.y = this.stage.canvas.height - this.statusBoxHeight + this.mobStatsOffsetY + this.mobNameOffsetY + (i*15);
					//this.stage.addChild(statText);
					//i++;
				//}
			//}
		};

		// Draw player
		function drawPlayer() {
			// create player graphic
			// body
			var playerGraphicBody = new createjs.Shape();
			playerGraphicBody.graphics
				.beginFill('rgb('+gameState.player.randomColor+')')
				.drawRect(this.playerGraphicOffsetX,
					this.stage.canvas.height-this.statusBoxHeight-this.playerGraphicBodyHeight,
					this.playerGraphicBodyWidth,
					this.playerGraphicBodyHeight);
			this.stage.addChild(playerGraphicBody);

			// head
			var playerGraphicHead = new createjs.Shape();
			playerGraphicHead.graphics
				.beginFill('rgba('+gameState.player.randomColor+','+gameState.player.randomAlpha+')')
				.drawRect(this.playerGraphicOffsetX,
					this.stage.canvas.height-this.statusBoxHeight-this.playerGraphicBodyHeight-
					this.playerGraphicHeadHeight,
					this.playerGraphicHeadWidth,
					this.playerGraphicHeadHeight);
			this.stage.addChild(playerGraphicHead);
		};

		// Draw mob
		function drawMob() {
			// create mob graphic
			// body
			var mobGraphicBody = new createjs.Shape();
			mobGraphicBody.graphics
				.beginFill('rgb('+gameState.mob.randomColor+')')
				.drawRect(this.mobGraphicOffsetX,
					this.stage.canvas.height-this.mobGraphicBodyHeight-this.statusBoxHeight-
					 this.playerGraphicBodyHeight+this.mobGraphicOffsetY,
					this.mobGraphicBodyWidth,
					this.mobGraphicBodyHeight);
			this.stage.addChild(mobGraphicBody);

			// head
			var mobGraphicHead = new createjs.Shape();
			mobGraphicHead.graphics
				.beginFill('rgba('+gameState.mob.randomColor+','+gameState.mob.randomAlpha+')')
				.drawRect(this.mobGraphicOffsetX,
					this.stage.canvas.height-this.mobGraphicBodyHeight-this.statusBoxHeight-
					 this.playerGraphicBodyHeight-this.mobGraphicHeadHeight+this.mobGraphicOffsetY,
					this.mobGraphicHeadWidth,
					this.mobGraphicHeadHeight);
			this.stage.addChild(mobGraphicHead);
		};

		// Call draw functions for this scene
		drawBackground.call(this);
		drawStatusBox.call(this);
		drawPlayer.call(this);
		drawMob.call(this);

		// Update the stage
		this.stage.update();
	};
};
