function DungeonGame(options) {
	options = options || {};

	// Initialize player, mob, and round count
	this.player = options.player || new Hero();
	this.mob = options.mob || new Hero();
	this.round = 0;

	// UI selectors
	this.fightLogSelector = options.fightLogSelector || 'fight-log';

	this.playerNameSelector = options.playerNameSelector || 'player-name';
	this.playerHpSelector = options.playerHpSelector || 'player-hp';
	this.playerSelectSelector = options.playerSelectSelector || 'player-select';

	this.mobNameSelector = options.mobNameSelector || 'mob-name';
	this.mobHpSelector = options.mobHpSelector || 'mob-hp';
	this.mobSelectSelector = options.mobSelectSelector || 'mob-select';

	// Cached UI Element wrappers
	this.fightLog = document.getElementById(this.fightLogSelector);

	this.playerNameElem = document.getElementById(this.playerNameSelector);
	this.playerHpElem = document.getElementById(this.playerHpSelector);
	this.playerSelectElem = document.getElementById(this.playerSelectSelector);

	this.mobNameElem = document.getElementById(this.mobNameSelector);
	this.mobHpElem = document.getElementById(this.mobHpSelector);
	this.mobSelectElem = document.getElementById(this.mobSelectSelector);

	this.reset = function () {
		// clear the log
		this.clearLog();

		this.output('-------------------');
		// Reset player, mob, round count
		this.player = new Hero(heroes.classes[this.playerSelectElem.selectedIndex]);
		this.mob = new Hero(cavemobs.mobs[this.mobSelectElem.selectedIndex]);
		this.round = 0;

		// announce the fight & update UI
		this.output(this.player.formatName() + ' vs. ' + this.mob.formatName());
		this.updateInterface();
	};

	this.fight = function () {
		if (this.player.hp > 0 && this.mob.hp > 0) {
			// Iterate the round
			this.round++;

			// Announce the round
			this.output('Round ' + this.round);

			// Player and mob make attack rolls
			var playerAtkRoll = this.dieRoll(this.player.atk) - this.player.miss;
			var mobAtkRoll = this.dieRoll(this.mob.atk) - this.mob.miss;

			//Can't hit for less than 0
			if (playerAtkRoll < 0) {
				playerAtkRoll = 0;
			}

			if (mobAtkRoll < 0){
				mobAtkRoll = 0;
			}

			// Announce player attack roll
			if (playerAtkRoll === 0){
				this.output(this.player.name + ' missed!');
			} else {
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
				if (mobAtkRoll === 0) {
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
		document.getElementById('round-count').textContent = this.round;
	};

	this.output = function (message) {
		var messageDiv, lineBreak;

		// log to console
		console.log(message);

		if (this.fightLog) {
			// create a new text node with the message
			messageText = document.createTextNode(message);

			// create a new <br> element to act as a line break
			lineBreak = document.createElement('br');

			// append message text and line break
			this.fightLog.appendChild(messageText);
			this.fightLog.appendChild(lineBreak);
		}
	};

	this.dieRoll = function (sides) {
		var min = 1;
		return Math.floor(Math.random() * (sides - min + 1)) + min;
	};

	this.clearLog = function () {
		this.fightLog.textContent = '';
	};

	this.init = function () {
		var i, optgroupElem, optionElem;

		// Populate player <select> with all lvl 1 classes
		// Create an <optgroup> to hold level 1 hero classes
		optgroupElem = document.createElement('optgroup');
		optgroupElem.setAttribute("label", "Level 1");

		// Add each class as an <option>
		for (i = 0; i < heroes.classes.length; i++) {
			optionElem = document.createElement('option');
			optionElem.textContent = heroes.classes[i].name;
			optionElem.value = i;

			// Add player class <option> to lvl 1 <optgroup>
			optgroupElem.appendChild(optionElem);
		}

		// Add lvl 1 <optgroup> to player <select>
		this.playerSelectElem.appendChild(optgroupElem);

		// Populate mob select box with all cave mobs
		// Create an <optgroup> to hold all cave mobs
		optgroupElem = document.createElement('optgroup');
		optgroupElem.setAttribute("label", "Cave Mobs");

		// Add each cave mob as an <option>
		for (i = 0; i < cavemobs.mobs.length; i++) {
			optionElem = document.createElement('option');
			optionElem.textContent = cavemobs.mobs[i].name;
			optionElem.value = i;

			// Add mob <option> to cave mob <optgroup>
			optgroupElem.appendChild(optionElem);
		}

		// Add cave mob <optgroup> to mob <select>
		this.mobSelectElem.appendChild(optgroupElem);
	};

	this.mobSelected = function () {
		var i, selectedMob;
	};
};

window.onload = function () {
	window.dungeon = new DungeonGame();

	window.dungeon.init();
	window.dungeon.reset();
};