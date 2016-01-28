function DungeonEngine(canvasId) {
	// EaselJS stage
	this.stage = new createjs.Stage(canvasId);

	// UI variables, sizes
	this.statusBoxHeight = 150;
	this.statusBoxFontColor = "#FFFFFF";

	// Player name
	this.playerNameFont = "20px Verdana";
	this.playerNameOffsetX = 20;
	this.playerNameOffsetY = 5;

	// Player stats
	this.playerStatsFont = "15px Verdana";
	this.playerStatsOffsetX = 25;
	this.playerStatsOffsetY = 25;

	// Mob name
	this.mobFontSize = 20;
	this.mobNameFont = this.mobFontSize + 'px Verdana';
	this.mobNameOffsetX = 300;
	this.mobNameOffsetY = 5;

	// Mob stats
	this.mobStatsFont = "15px Verdana";
	this.mobStatsOffsetX = this.mobNameOffsetX + 5;
	this.mobStatsOffsetY = this.mobFontSize + this.mobNameOffsetY;

	// Player graphic
	this.playerGraphicOffsetX = 20;
	this.playerGraphicOffsetY = 0;
	this.playerGraphicBodyWidth = 100;
	this.playerGraphicBodyHeight = 200;
	this.playerGraphicHeadWidth = 100;
	this.playerGraphicHeadHeight = 100;

	// Mob graphic
	this.mobGraphicOffsetX = 300;
	this.mobGraphicOffsetY = 0;
	this.mobGraphicBodyWidth = 100;
	this.mobGraphicBodyHeight = 200;
	this.mobGraphicHeadWidth = 100;
	this.mobGraphicHeadHeight = 100;

	// EaselJS Update loop
	this.updateLoop = function (gameState) {
		// Clear the stage, remove all children
		this.stage.removeAllChildren();
		this.stage.clear();

		// Draw background
		function drawBackground() {
			var background = new createjs.Shape();
			background.graphics.beginFill("#000000")
				.drawRect(0, 0, this.stage.canvas.width, this.stage.canvas.height);
			this.stage.addChild(background);
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
					// skip name and hp, already displayed
					if (stat === 'name' || stat === 'hp') {
						continue;
					}

					// draw stat
					var statText = new createjs.Text(stat +': ' + gameState.player[stat], this.playerStatsFont, this.statusBoxFontColor);
					statText.x = this.playerStatsOffsetX;
					statText.y = this.stage.canvas.height - this.statusBoxHeight + this.playerStatsOffsetY + this.playerNameOffsetY + (i*15);
					this.stage.addChild(statText);
					i++;
				}
			}

			// Draw Mob name
			var mobName = new createjs.Text(gameState.mob.name + ': ' + gameState.mob.hp, this.mobNameFont, this.statusBoxFontColor);
			mobName.x = this.mobNameOffsetX;
			mobName.y = this.stage.canvas.height - this.statusBoxHeight + this.mobNameOffsetY;
			this.stage.addChild(mobName);

			// Draw player stats
			i = 0;
			for (stat in gameState.mob) {
				// Only direct properties, strings, numbers, & booleans
				if (gameState.mob.hasOwnProperty(stat)
					&& (typeof gameState.mob[stat] === 'string'
						|| typeof gameState.mob[stat] === 'number'
						|| typeof gameState.mob[stat] === 'boolean')) {
					// skip name and hp, already displayed
					if (stat === 'name' || stat === 'hp') {
						continue;
					}

					// draw stat
					var statText = new createjs.Text(stat +': ' + gameState.mob[stat], this.mobStatsFont, this.statusBoxFontColor);
					statText.x = this.mobStatsOffsetX;
					statText.y = this.stage.canvas.height - this.statusBoxHeight + this.mobStatsOffsetY + this.mobNameOffsetY + (i*15);
					this.stage.addChild(statText);
					i++;
				}
			}
		};

		// Draw player
		function drawPlayer() {
			// create player graphic
			// body
			var playerGraphicBody = new createjs.Shape();
			playerGraphicBody.graphics.beginFill(gameState.player.randomColor)
				.drawRect(this.playerGraphicOffsetX,
					this.stage.canvas.height-this.statusBoxHeight-this.playerGraphicBodyHeight,
					this.playerGraphicBodyWidth,
					this.playerGraphicBodyHeight);
			this.stage.addChild(playerGraphicBody);
			// head
			var playerGraphicHead = new createjs.Shape();
			playerGraphicHead.graphics.beginFill(gameState.player.randomColor)
				.drawRect(this.playerGraphicOffsetX,
					this.stage.canvas.height-this.statusBoxHeight-this.playerGraphicBodyHeight-this.playerGraphicHeadHeight,
					this.playerGraphicHeadWidth,
					this.playerGraphicHeadHeight);
			this.stage.addChild(playerGraphicHead);
		};

		// Draw mob
		function drawMob() {
			// create mob graphic
			// body
			var mobGraphicBody = new createjs.Shape();
			mobGraphicBody.graphics.beginFill(gameState.mob.randomColor)
				.drawRect(this.mobGraphicOffsetX,
					this.stage.canvas.height-this.statusBoxHeight-this.mobGraphicBodyHeight,
					this.mobGraphicBodyWidth,
					this.mobGraphicBodyHeight);
			this.stage.addChild(mobGraphicBody);
			// head
			var mobGraphicHead = new createjs.Shape();
			mobGraphicHead.graphics.beginFill(gameState.mob.randomColor)
				.drawRect(this.mobGraphicOffsetX,
					this.stage.canvas.height-this.statusBoxHeight-this.mobGraphicBodyHeight-this.mobGraphicHeadHeight,
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
