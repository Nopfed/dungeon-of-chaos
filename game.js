function Hero(name, hp, atk) {
	this.name = name;
	this.hp = hp;
	this.atk = atk;

	this.formatName = function () {
		return this.name + '(' + this.hp + ')';
	};
};

function DungeonGame() {
	// Initialize player, mob, and round count
	this.player = new Hero("Player", 12, 5);
	this.mob = new Hero("Skele-Bro", 6, 2);
	this.rounds = 0;

	this.reset = function () {
		this.output('-------------------');
		// Reset player, mob, round count
		this.player = new Hero("Player", 12, 5);
		this.mob = new Hero("Skele-Bro", 6, 2);
		this.rounds = 0;

		// announce the fight & update UI
		this.output(this.player.formatName() + ' vs. ' + this.mob.formatName());
		this.updateInterface();
	};

	this.fight = function () {
		// Iterate the round
		this.rounds++;

		// Announce the round
		this.output('Round ' + this.rounds);

		// Player and mob make attack rolls
		var playerAtkRoll = this.dieRoll(1, this.player.atk);
		var mobAtkRoll = this.dieRoll(1, this.mob.atk);

		// Announce player attack roll
		this.output(this.player.name + ' attacks with a ' + playerAtkRoll);

		// Subtract attack roll from mob hp
		this.mob.hp = this.mob.hp - playerAtkRoll;

		// Announce result of player attacking mob & update UI
		this.output(this.mob.name + ' is at ' + this.mob.hp);
		this.updateInterface();

		// Check if mob is dead
		if (this.mob.hp <= 0) {
			this.output(this.player.name + ' wins!');
		} else {
			// Announce mob attack roll
			this.output(this.mob.name + ' attacks with a ' + mobAtkRoll);

			// Subtract attack roll from player hp
			this.player.hp = this.player.hp - mobAtkRoll;

			// Announce result of mob attacking player & update UI
			this.output(this.player.name + ' is at ' + this.player.hp);
			this.updateInterface();

			// Check if player is dead
			if (this.player.hp <= 0) {
				this.output(this.mob.name + ' wins!');
			}
		}		
	};

	this.updateInterface = function () {
		// update player hp
		document.getElementById('player-hp').textContent = this.player.hp;

		// update mob hp
		document.getElementById('mob-hp').textContent = this.mob.hp;

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

	this.dieRoll = function (rolls, sides) {
		for (i = 0; i < rolls; i++) {
			return ((Math.random() * sides) + 1).toFixed(0);
		}
	};

	this.clearLog = function () {
		document.getElementById('fight-log').textContent = "";
	};
};

window.onload = function () {
	window.dungeon = new DungeonGame();

	window.dungeon.reset();
}