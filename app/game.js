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

	this.mobNameElem = document.getElementById(this.mobNameSelector);
	this.mobHpElem = document.getElementById(this.mobHpSelector);
	this.mobSelectElem = document.getElementById(this.mobSelectSelector);
	this.mobStatListElem = document.getElementById(this.mobStatListSelector);

	// Initialize speech synthesis voice and message container
	this.voice = window.speechSynthesis.getVoices()[1]; // en-US
	this.synthMessage = new SpeechSynthesisUtterance();

	// Reset the fight
	this.reset = function () {
		var i, stat, playerSelection, mobSelection;

		// clear the log
		this.clearLog();

		this.output('-------------------', true);

		// Reset player
		playerSelection = this.playerSelectElem.options[this.playerSelectElem.selectedIndex];
		this.player = new Hero(heroes[playerSelection.parentNode.label][playerSelection.value]);
		// Reset and generate player stat list elements
		while (this.playerStatListElem.firstChild) {
			this.playerStatListElem.removeChild(this.playerStatListElem.firstChild);
		}
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
		this.output(this.player.name + ' vs. ' + this.mob.name);
		this.updateInterface();
	};

	// Simulate a round of fighting
	// if action is not supplied, assume 'Melee' action
	this.fight = function (action) {
		var playerActionStat, playerStat, playerRoll, playerActionDamage, playerRolls, playerTargetStat,
			mobAction, mobActionStat, mobStat, mobRoll, mobActionDamage, mobRolls, mobTargetStat;

		// default to 'Melee' action
		action = action || 'Melee';

		// Fight cannot continue if a participant is dead
		if (this.player.hp > 0 && this.mob.hp > 0) {
			// Iterate & announce the round
			this.round++;
			this.output('--Round ' + this.round + '--');

			// Player makes action roll
			playerActionStat = actions[action]['stat'];
			playerStat = this.player[playerActionStat] || 0;
			playerTargetStat = actions[action]['target-stat'];
			playerRoll = (this.dieRoll(playerStat)*actions[action].rolls) - this.player.miss;

			if (playerRoll < 0) {
				playerRoll = 0;
			}

			playerActionDamage = playerRoll - this.mob.armor;

			if (playerActionDamage < 0) {
				playerActionDamage = 0;
			}

			// Announce player action
			if (playerRoll === 0) {
				this.output(this.player.name+'\'s ' + action + ' missed!');
			} else {
				this.output(this.player.name+'\'s ' + action + ' ' + actions[action].verb + ' ' + playerActionDamage + ' ' + actions[action]['verb-damage'] + '!');
				
				// Subtract player roll from mob target stat
				this.mob[playerTargetStat] = this.mob[playerTargetStat] - playerActionDamage;
			}

			// Announce result of player action
			this.output(this.mob.name+'\'s ' + playerTargetStat + ' is at ' + this.mob[playerTargetStat] + '.');
			this.updateInterface();			

			// Check if mob is dead
			if (this.mob.hp <= 0) {
				this.output(this.mob.name + ' has died!');
				this.output(this.player.name + ' wins!');
			} else {
				// Mob chooses action
				mobAction = 'Melee';

				// Mob makes action roll
				mobActionStat = actions[mobAction]['stat'];
				mobStat = this.player[mobActionStat] || 0;
				mobTargetStat = actions[mobAction]['target-stat'];
				mobRoll = (this.dieRoll(playerStat)*actions[mobAction].rolls) - this.mob.miss;
				
				if (mobRoll < 0) {
					mobRoll = 0;
				}

				mobActionDamage = mobRoll - this.player.armor;

				if (mobActionDamage < 0) {
					mobActionDamage = 0;
				}

				// Announce mob action
				if (mobRoll === 0) {
					this.output(this.mob.name+'\'s ' + mobAction + ' missed!');
				} else {
					this.output(this.mob.name+'\'s ' + mobAction + ' ' + actions[mobAction].verb + ' ' + mobActionDamage + ' ' + mobTargetStat + '!');
					
					// Subtract mob roll from player target stat
					this.player[mobTargetStat] = this.player[mobTargetStat] - mobActionDamage;
				}

				// Announce result of mob action
				this.output(this.player.name+'\'s ' + mobTargetStat + ' is at ' + this.player[mobTargetStat] + '.');

				// Check if player is dead
				if (this.player.hp <= 0) {
					this.output(this.player.name + ' has died!');
					this.output(this.mob.name + ' wins!');
				}
			}

			// Update interface
			this.updateInterface();

		} else {
			this.output('The fight is already over!');
		}
	};

	// Update the interface with game information
	this.updateInterface = function () {
		var i, stat;

		// update player stats
		this.playerHpElem.textContent = this.player.hp;
		this.playerNameElem.textContent = this.player.name;
		// other stats
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

				document.getElementById('player-'+stat).textContent = stat+': ' + this.player[stat];
			}
		}

		// update mob stats
		this.mobHpElem.textContent = this.mob.hp;
		this.mobNameElem.textContent = this.mob.name;
		// other stats
		for (var stat in this.mob) {
			// Only direct properties, strings, numbers, & booleans
			if (this.mob.hasOwnProperty(stat)
				&& (typeof this.mob[stat] === 'string'
					|| typeof this.mob[stat] === 'number'
					|| typeof this.mob[stat] === 'boolean')) {
				// skip name and hp, already displayed
				if (stat === 'name' || stat === 'hp') {
					continue;
				}

				document.getElementById('mob-'+stat).textContent = stat+': ' + this.mob[stat];
			}
		}

		// update round information
		document.getElementById('round-count').textContent = this.round;
	};

	// Output a message to both the fight log container and window.console
	this.output = function (message, muteSpeech) {
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

		if (!muteSpeech) {
			this.speak(message);
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

	this.speaking = false;
	this.speak = function (message) {
		if (this.voice) {
			this.synthMessage = new SpeechSynthesisUtterance(message);
			this.synthMessage.text = message;
			this.synthMessage.voice = this.voice;
			//this.synthMessage.lang = 'en-US';
			this.synthMessage.volume = 1; // 0 to 1
			this.synthMessage.rate = 0.75; // 0 to 10
			this.synthMessage.pitch = 1; // 0 to 2

			window.speechSynthesis.speak(this.synthMessage);
		}
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
				optionElem.textContent = group[i].name + '(' + group[i].lvl +')';
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

		// Voice Synthesis
		// Has to wait for the voice list to load first
		window.speechSynthesis.onvoiceschanged = (function () {
			var voices = window.speechSynthesis.getVoices();
			this.voice = voices[16];
			this.synthMessage.voice = this.voice;
		}).bind(this);

		//Reset
		this.reset();
	};

	// Self-initialize
	this.init();
};

window.onload = function () {
	window.dungeon = new DungeonGame();
};