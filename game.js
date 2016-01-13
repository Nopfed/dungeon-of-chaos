function Hero(options) {
	this.name = options.name;
	this.hp = options.hp;
	this.atk = options.atk;
	this.miss = options.miss;

	this.formatName = function () {
		return this.name + '(' + this.hp + ')';
	};
};

function DungeonGame() {
	// Initialize player, mob, and round count
	this.player;
	this.mob;
	this.rounds = 0;

	this.reset = function () {
		// clear the log
		this.clearLog();

		this.output('-------------------');
		// Reset player, mob, round count
		this.player = new Hero(heroes.classes[0]);
		this.mob = new Hero(cavemobs.mobs[3]);
		this.rounds = 0;

		// announce the fight & update UI
		this.output(this.player.formatName() + ' vs. ' + this.mob.formatName());
		this.updateInterface();
	};

	this.fight = function () {
		if (this.player.hp > 0 && this.mob.hp > 0) {
			// Iterate the round
			this.rounds++;

			// Announce the round
			this.output('Round ' + this.rounds);

			// Player and mob make attack rolls
			var playerAtkRoll = this.dieRoll(this.player.atk) - this.player.miss;
			var mobAtkRoll = this.dieRoll(this.mob.atk) - this.mob.miss;

			//Can't hit for less than 0
			if (playerAtkRoll < 0){
				playerAtkRoll = 0;
			}

			if (mobAtkRoll < 0){
				mobAtkRoll = 0;
			}

			// Announce player attack roll
			if (playerAtkRoll === 0){
				this.output(this.player.name + ' missed!');
			}else{
				this.output(this.player.name + ' attacks with a ' + playerAtkRoll);
			}

			// Subtract attack roll from mob hp
			this.mob.hp = this.mob.hp - playerAtkRoll;

			// Announce result of player attacking mob & update UI
			this.output(this.mob.name + ' is at ' + this.mob.hp);
			this.updateInterface();

			// Check if mob is dead
			if (this.mob.hp <= 0) {
				this.output(this.mob.name + ' has died!');
				this.output(this.player.name + ' wins!');
			} else {
				// Announce mob attack roll
				if (mobAtkRoll === 0){
					this.output(this.mob.name + ' missed!');
				} else {
					this.output(this.mob.name + ' attacks with a ' + mobAtkRoll);
				}
				// Subtract attack roll from player hp
				this.player.hp = this.player.hp - mobAtkRoll;

				// Announce result of mob attacking player & update UI
				this.output(this.player.name + ' is at ' + this.player.hp);
				this.updateInterface();

				// Check if player is dead
				if (this.player.hp <= 0) {
					this.output(this.player.name + ' has died!');
					this.output(this.mob.name + ' wins!');
				}
			}
		} else {
			this.output('The fight is already over!');
		}
	};

	this.updateInterface = function () {
		// update player hp & name
		document.getElementById('player-hp').textContent = this.player.hp;
		document.getElementById('player-name').textContent = this.player.name;

		// update mob hp & name
		document.getElementById('mob-hp').textContent = this.mob.hp;
		document.getElementById('mob-name').textContent = this.mob.name;

		// update round counter
		document.getElementById('round-count').textContent = this.rounds;
	};

	this.output = function (message) {
		var messageDiv, fightLog, lineBreak;

		// log to console
		console.log(message);

		// grab fight-log div
		fightLog = document.getElementById('fight-log');

		// create a new text node with the message
		messageText = document.createTextNode(message);

		// create a new <br> element to act as a line break
		lineBreak = document.createElement('br');

		// append message text and line break
		fightLog.appendChild(messageText);
		fightLog.appendChild(lineBreak);
	};

	this.dieRoll = function (sides) {
		var min = 1;
		//return ((Math.random() * sides) + 1).toFixed(0);
		return Math.floor(Math.random() * (sides - min + 1)) + min;
	};

	this.clearLog = function () {
		document.getElementById('fight-log').textContent = "";
	};
};

window.onload = function () {
	window.dungeon = new DungeonGame();

	window.dungeon.reset();
};