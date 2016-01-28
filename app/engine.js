function DungeonEngine(canvasId) {
	// EaselJS stage
	this.stage = new createjs.Stage(canvasId);

	// UI variables, sizes
	this.statusBoxHeight = 150;
	this.statusBoxFontColor = "#FFFFFF";
	this.playerNameFont = "20px Verdana";
	this.playerNameOffsetX = 20;
	this.playerNameOffsetY = 20;
	this.playerStatsFont = "15px Verdana";
	this.playerStatsOffsetX = 25;
	this.playerStatsOffsetY = 25;

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
			var i;

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
			for (var stat in gameState.player) {
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
		};

		// Call draw functions for this scene
		drawBackground.call(this);
		drawStatusBox.call(this);

		// Update the stage
		this.stage.update();
	};
};
