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
	this.playerStatListSelector = options.playerStatListSelector || 'player-stat-list';

	this.mobNameSelector = options.mobNameSelector || 'mob-name';
	this.mobHpSelector = options.mobHpSelector || 'mob-hp';
	this.mobSelectSelector = options.mobSelectSelector || 'mob-select';
	this.mobStatListSelector = options.mobStatListSelector || 'mob-stat-list';

	// Cached UI Element wrappers
	this.fightLog = document.getElementById(this.fightLogSelector);

	this.playerNameElem = document.getElementById(this.playerNameSelector);
	this.playerHpElem = document.getElementById(this.playerHpSelector);
	this.playerSelectElem = document.getElementById(this.playerSelectSelector);
	this.playerStatListElem = document.getElementById(this.playerStatListSelector);
	this.playerStatListItems = [];

	this.mobNameElem = document.getElementById(this.mobNameSelector);
	this.mobHpElem = document.getElementById(this.mobHpSelector);
	this.mobSelectElem = document.getElementById(this.mobSelectSelector);
	this.mobStatListElem = document.getElementById(this.mobStatListSelector);
	this.mobStatListItems = [];

	// Reset the fight
	this.reset = function () {
		var i, stat, playerSelection, mobSelection;

		// clear the log
		this.clearLog();

		this.output('-------------------');

		// Reset player
		playerSelection = this.playerSelectElem.options[this.playerSelectElem.selectedIndex];
		this.player = new Hero(heroes[playerSelection.parentNode.label][playerSelection.value]);
		// Reset and generate player stat list elements
		while (this.playerStatListElem.firstChild) {
			this.playerStatListElem.removeChild(this.playerStatListElem.firstChild);
		}
		this.playerStatListItems = [];
		for (var stat in this.player) {
			// Only direct properties, strings, numbers, & booleans
			if (this.player.hasOwnProperty(stat)
				&& (typeof this.player[stat] === 'string'
					|| typeof this.player[stat] === 'number'
					|| typeof this.player[stat] === 'boolean')) {
				// skip name and hp, already displayed
				if (stat === 'name' || stat === 'hp') {
					continue;
				}

				statElem = document.createElement('li');
				statElem.textContent = stat + ': ' + this.player[stat];
				statElem.setAttribute('id', 'player-'+stat);

				this.playerStatListElem.appendChild(statElem);
			}
		}

		// Reset mob
		mobSelection = this.mobSelectElem.options[this.mobSelectElem.selectedIndex];
		this.mob = new Hero(mobs[mobSelection.parentNode.label][mobSelection.value]);
		// Reset and generate player stat list elements
		while (this.mobStatListElem.firstChild) {
			this.mobStatListElem.removeChild(this.mobStatListElem.firstChild);
		}
		this.mobStatListItems = [];
		for (stat in this.mob) {
			// Only direct properties, strings, numbers, & booleans
			if (this.mob.hasOwnProperty(stat)
				&& (typeof this.mob[stat] === 'string'
					|| typeof this.mob[stat] === 'number'
					|| typeof this.player[stat] === 'boolean')) {
				// skip name and hp, already displayed
				if (stat === 'name' || stat === 'hp') {
					continue;
				}

				statElem = document.createElement('li');
				statElem.textContent = stat + ': ' + this.mob[stat];
				statElem.setAttribute('id', 'mob-'+stat);

				this.mobStatListElem.appendChild(statElem);
			}
		}

		
		// Reset round
		this.round = 0;

		// announce the fight & update UI
		this.output(this.player.formatName() + ' vs. ' + this.mob.formatName());
		this.updateInterface();
	};

	// Simulate a round of fighting
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

	// Update the interface with game information
	this.updateInterface = function () {
		var statElem;

		// update player information
		document.getElementById('player-hp').textContent = this.player.hp;
		document.getElementById('player-name').textContent = this.player.name;

		// update mob information
		document.getElementById('mob-hp').textContent = this.mob.hp;
		document.getElementById('mob-name').textContent = this.mob.name;

		// update round information
		document.getElementById('round-count').textContent = this.round;
	};

	// Output a message to both the fight log container and window.console
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

	// Roll a die
	// Returns random number from 1 to sides (inclusive)
	this.dieRoll = function (sides) {
		var min = 1;
		return Math.floor(Math.random() * (sides - min + 1)) + min;
	};

	// Clear the fight log container and the console
	this.clearLog = function () {
		this.fightLog.textContent = '';
		console.clear();
	};

	// Initialize
	this.init = function () {
		function populateSelect(selectElem, groupLabel, group) {
			var i, optgroupElem, optionElem;

			// Populate player <select> with all lvl 1 classes
			// Create an <optgroup> to hold level 1 hero classes
			optgroupElem = document.createElement('optgroup');
			optgroupElem.setAttribute("label", groupLabel);

			// Add each class as an <option>
			for (i = 0; i < group.length; i++) {
				optionElem = document.createElement('option');
				optionElem.textContent = group[i].name;
				optionElem.value = i;

				// Add player class <option> to lvl 1 <optgroup>
				optgroupElem.appendChild(optionElem);
			}

			// Add lvl 1 <optgroup> to player <select>
			selectElem.appendChild(optgroupElem);
		};

		populateSelect(this.playerSelectElem, "Rogue", heroes["Rogue"]);
		populateSelect(this.playerSelectElem, "Sorceress", heroes["Sorceress"]);
		populateSelect(this.playerSelectElem, "Warrior", heroes["Warrior"]);
		populateSelect(this.playerSelectElem, "Priest", heroes["Priest"]);

		populateSelect(this.mobSelectElem, "Snow Mobs", mobs["Snow Mobs"]);
		populateSelect(this.mobSelectElem, "Swamp Mobs", mobs["Swamp Mobs"]);
		populateSelect(this.mobSelectElem, "Desert Mobs", mobs["Desert Mobs"]);
		populateSelect(this.mobSelectElem, "Cave Mobs", mobs["Cave Mobs"]);

		//Reset
		this.reset();
	};

	// Self-initialize
	this.init();
};

window.onload = function () {
	window.dungeon = new DungeonGame();
};