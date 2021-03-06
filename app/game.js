function DungeonGame(options) {
	options = options || {};

	// Initialize player, mob, and round count
	this.player = options.player || new Hero();
	this.mob = options.mob || new Mob();
	this.moosic = new Audio("media/best.wav");
	//this.moosic.play();
	this.biomeRoll = 0;
	this.currentBiome = '';
	this.inputText = '';

	this.room = 1;

	// UI selectors
	this.fightLogSelector = options.fightLogSelector || 'fight-log';

	this.playerNameSelector = options.playerNameSelector || 'player-name';
	this.playerHpSelector = options.playerHpSelector || 'player-hp';
	this.playerSelectSelector = options.playerSelectSelector || 'player-select';
	this.playerStatListSelector = options.playerStatListSelector || 'player-stat-list';

	//this.mobNameSelector = options.mobNameSelector || 'mob-name';
	//this.mobHpSelector = options.mobHpSelector || 'mob-hp';
	//this.mobSelectSelector = options.mobSelectSelector || 'mob-select';
	//this.mobStatListSelector = options.mobStatListSelector || 'mob-stat-list';

	// Cached UI Element wrappers
	this.fightLog = document.getElementById(this.fightLogSelector);
	this.roomCount = document.getElementById('room-count');
	this.helmDisplay = document.getElementById('hero-helm');
	this.neckDisplay = document.getElementById('hero-neck');
	this.chestDisplay = document.getElementById('hero-chest');
	this.ringDisplay =	document.getElementById('hero-ring');
	this.weapDisplay = document.getElementById('hero-weap');
	this.pantsDisplay = document.getElementById('hero-pants');
	this.feetDisplay = document.getElementById('hero-feet');

	this.playerNameElem = document.getElementById(this.playerNameSelector);
	this.playerHpElem = document.getElementById(this.playerHpSelector);
	this.playerSelectElem = document.getElementById(this.playerSelectSelector);
	this.playerStatListElem = document.getElementById(this.playerStatListSelector);

	//this.mobNameElem = document.getElementById(this.mobNameSelector);
	//this.mobHpElem = document.getElementById(this.mobHpSelector);
	//this.mobSelectElem = document.getElementById(this.mobSelectSelector);
	//this.mobStatListElem = document.getElementById(this.mobStatListSelector);

	// Initialize speech synthesis voice and message container
	this.voice = window.speechSynthesis.getVoices()[1]; // en-US
	this.synthMessage = new SpeechSynthesisUtterance();
	this.speechMuted = true;

	// Reset the fight
	this.reset = function () {
		var i, stat, playerSelection, mobSelection;

		// clear the log
		this.clearLog();
		this.biomeRoll = this.dieRoll(1,4);

		// Reset room to first room
		this.room = 1;

		// Reset player
		playerSelection = this.playerSelectElem.options[this.playerSelectElem.selectedIndex];
		this.player = new Hero(heroes[playerSelection.value]);
		this.player.maxHp = this.player.hp;
		this.player.baseHp = this.player.hp;

		
		this.player.helm = new item();
		this.player.neck = new item();
		this.player.chest = new item();
		this.player.ring = new item();
		this.player.weap = new item();
		this.player.pants = new item();
		this.player.feet = new item();

		if (this.biomeRoll === 1) {
			this.currentBiome = "Cave";
		} else if (this.biomeRoll === 2) {
			this.currentBiome = "Desert";
		} else if (this.biomeRoll === 3) {
			this.currentBiome = "Swamp";
		} else if (this.biomeRoll === 4) {
			this.currentBiome = "Tundra";
		}

		// Initialize Dungeon Engine
		this.dungeonEngine = new DungeonEngine("dungeon-canvas");

		this.output("The "+this.currentBiome+" welcomes you, "+this.player.name+'.', "Gold");
		this.output('');
		this.output('Room: '+this.room, "Gray");

		// Reset mob
		this.getMob(this.biomeRoll);

		//update UI
		this.updateInterface();
	};

	this.checkKey = function () {
		var x, keyPress;

		x = event.keyCode;
		keyPress = String.fromCharCode(x);

		if (keyPress === 'p') {
			this.drinkPotion();
		} else if (keyPress === 'a') {
			this.fight();
		} else if (keyPress === 's') {
			this.fight('Steal');
		} else if (keyPress === 'r') {
			this.reset();
		}
	};

	//select a random monster based on player's current level
	this.getMob = function (biomeNum){
		var biome = biomeNum;

		if (biome === 1 && this.player.lvl <= 5) {
			this.mob = new Mob(mobs["Cave Mobs"][this.dieRoll(0,(this.player.lvl*3)-1)]);
			this.output(this.mob.name + ' appears!', "red");
		} else if (biome === 2 && this.player.lvl <= 5) {
			this.mob = new Mob(mobs["Desert Mobs"][this.dieRoll(0,(this.player.lvl*3)-1)]);
			this.output(this.mob.name + ' appears!', "red");
		} else if (biome === 3 && this.player.lvl <= 5) {
			this.mob = new Mob(mobs["Swamp Mobs"][this.dieRoll(0,(this.player.lvl*3)-1)]);
			this.output(this.mob.name + ' appears!', "red");
		} else if (biome === 4 && this.player.lvl <= 5) {
			this.mob = new Mob(mobs["Snow Mobs"][this.dieRoll(0,(this.player.lvl*3)-1)]);
			this.output(this.mob.name + ' appears!', "red");
		} else if (this.player.lvl > 5) {
			if (biome === 1) {
				this.mob = new Mob(mobs["Cave Mobs"][this.dieRoll(12, 14)]);
				this.output(this.mob.name + ' appears!', "red");
			} else if (biome === 2) {
				this.mob = new Mob(mobs["Desert Mobs"][this.dieRoll(12, 14)]);
				this.output(this.mob.name + ' appears!', "red");
			} else if (biome === 3) {
				this.mob = new Mob(mobs["Swamp Mobs"][this.dieRoll(12, 14)]);
				this.output(this.mob.name + ' appears!', "red");
			} else {
				this.mob = new Mob(mobs["Snow Mobs"][this.dieRoll(12, 14)]);
				this.output(this.mob.name + ' appears!', "red");
			}
		}
	};

	//player drinks a potion, which heals for half their base maximum level HP 
	//rounded up
	this.drinkPotion = function (){
		
		if (this.player.potions <= 0){
			this.output('You are all out of potions!');
		}else if(this.player.hp < this.player.maxHp) {
			
			if (this.player.hp > 0) {
				this.player.hp = this.player.hp + Math.ceil(this.player.baseHp/2);
				this.player.potions--;
				this.output('You gained ' + Math.ceil(this.player.baseHp/2) + ' hp.');
				this.output('You have ' + this.player.potions + ' potions left.');
				
				if (this.player.hp > this.player.maxHp) {
					this.player.hp = this.player.maxHp;
				}
				
				this.updateInterface();
			}else {
				this.output('You have died. Please play again.',"Gray");
			}

		}else {
			this.output('You are already at max HP!');
		}
	};

	//when a player reaches enough experience, they will level up and gain new 
	//stats/abilities
	this.playerLevelUp = function (){
		this.player.xp = this.player.xp - ((this.player.lvl*10));
		this.player.lvl++;
		this.player.baseHp = this.player.baseHp + Math.ceil(this.player.baseHp/2);
		this.player.maxHp = this.player.maxHp + this.player.baseHp;
		this.player.hp = this.player.maxHp;
		this.player.atk = this.player.atk + 2;
	};

	//equip a piece of gear to the appropriate gear slot, swaps any gear currently 
	//equipped
	this.equip = function (player, item){
		
		if (item['type'] === "Helmet" && player.helm !== item) {
			player.atk = player.atk + item.dmg - player.helm.dmg;
			player.armor = player.armor + item.armor - player.helm.armor;
			player.hp = player.hp + item.hp - player.helm.hp;
			player.maxHp = player.maxHp + item.hp - player.helm.hp;
			player.helm = item;
			this.output('Equipped ' + item.name + '.', "Bisque");
		} else if (item['type'] === "Neck" && player.neck !== item) {
			player.atk = player.atk + item.dmg - player.neck.dmg;
			player.armor = player.armor + item.armor - player.neck.armor;
			player.hp = player.hp + item.hp - player.neck.hp;
			player.maxHp = player.maxHp + item.hp - player.neck.hp;
			player.neck = item;
			this.output('Equipped ' + item.name + '.', "Bisque");
		} else if (item['type'] === "Chest" && player.chest !== item) {
			player.atk = player.atk + item.dmg - player.chest.dmg;
			player.armor = player.armor + item.armor - player.chest.armor;
			player.hp = player.hp + item.hp - player.chest.hp;
			player.maxHp = player.maxHp + item.hp - player.chest.hp;
			player.chest = item;
			this.output('Equipped ' + item.name + '.', "Bisque");
		} else if (item['type'] === "Ring" && player.ring !== item) {	
			player.atk = player.atk + item.dmg - player.ring.dmg;
			player.armor = player.armor + item.armor - player.ring.armor;
			player.hp = player.hp + item.hp - player.ring.hp;
			player.maxHp = player.maxHp + item.hp - player.ring.hp;
			player.ring = item;
			this.output('Equipped ' + item.name + '.', "Bisque");
		} else if (item['type'] === "Weapon" && player.weap !== item) {	
			player.atk = player.atk + item.dmg - player.weap.dmg;
			player.armor = player.armor + item.armor - player.weap.armor;
			player.hp = player.hp + item.hp - player.weap.hp;
			player.maxHp = player.maxHp + item.hp - player.weap.hp;
			player.weap = item;
			this.output('Equipped ' + item.name + '.', "Bisque");
		} else if (item['type'] === "Pants" && player.pants !== item) {	
			player.atk = player.atk + item.dmg - player.pants.dmg;
			player.armor = player.armor + item.armor - player.pants.armor;
			player.hp = player.hp + item.hp - player.pants.hp;
			player.maxHp = player.maxHp + item.hp - player.pants.hp;
			player.pants = item;
			this.output('Equipped ' + item.name + '.', "Bisque");
		} else if (item['type'] === "Feet" && player.feet !== item) {
			player.atk = player.atk + item.dmg - player.feet.dmg;
			player.armor = player.armor + item.armor - player.feet.armor;
			player.hp = player.hp + item.hp - player.feet.hp;
			player.maxHp = player.maxHp + item.hp - player.feet.hp;
			player.feet = item;
			this.output('Equipped ' + item.name + '.', "Bisque");
		}else {
			this.output('You already have that item equipped!');
		}

		this.updateInterface();
	};

	//unequip a piece of gear from a gear slot
	this.unequip = function (player, itemType){

		switch(itemType !== '') {
    		case "Helmet":
        		player.helm = new item();
        		break;
    		case "Neck":
        		player.neck = new item();
        		break;
        	case "Chest":
        		player.chest = new item();
        		break;
        	case "Ring":
        		player.ring = new item();
        		break;
        	case "Weapon":
        		player.weap = new item();
        		break;
        	case "Pants":
        		player.pants = new item();
        		break;
        	case "Feet":
        		player.feet = new item();
        		break;
    		default:
        		this.output('Nothing equipped in that gear slot.');
		}
	};

	// Simulate a round of fighting
	// if action is not supplied, assume 'Melee' action
	this.fight = function (action) {
		var playerActionStat, playerStat, playerRoll, playerActionDamage, 
			playerRolls, playerTargetStat, mobAction, mobActionStat, mobStat, 
			mobRoll, mobActionDamage, mobRolls, mobTargetStat, lootRoll,
			goldDrop, droppedItem, potionFlip;

		// default to 'Melee' action
		action = action || 'Melee';

		// fix for speech synth
		window.speechSynthesis.cancel();

		// Fight cannot continue if a participant is dead
		if (this.player.hp > 0) {

			// Player makes action roll
			playerActionStat = actions[action]['stat'];
			playerStat = this.player[playerActionStat] || 0;
			playerTargetStat = actions[action]['target-stat'];
			playerRoll = (this.dieRoll(1, playerStat)*actions[action].rolls);

			playerActionDamage = playerRoll - this.mob.armor;

			if (playerActionDamage < 0) {
				playerActionDamage = 0;
			}

			// Announce player action
			if (playerRoll <= this.player.miss) {
				this.output(this.player.name+'\'s ' + action 
					+ ' missed!', "LightGray", 1);
			} else {
				this.output(this.player.name+'\'s ' + action + ' ' 
					+ actions[action].verb + ' ' 
					+ playerActionDamage + ' ' 
					+ actions[action]['verb-damage'] + '!', "White", 1);

				if (action === 'Steal'){
					this.player.gold = this.player.gold + playerRoll;
				}
				
				// Subtract player roll from mob target stat
				this.mob[playerTargetStat] = this.mob[playerTargetStat] - playerActionDamage;
			}

			
			if(this.mob[playerTargetStat] <= 0){
				this.mob[playerTargetStat] = 0;
			}

			this.updateInterface();			

			// Check if mob is dead
			if (this.mob.hp <= 0) {
				this.output(this.mob.name + ' has died!', "white", 1);

				//get xp
				this.player.xp = this.player.xp + this.mob.xp;
				this.output('You gained ' + this.mob.xp + ' xp.', "LightSkyBlue", 0);
				
				//level up if you have enough xp
				if (this.player.xp >= ((this.player.lvl*10))){
					this.output('Congratulations, you leveled up!', "LightSkyBlue", 1);
					this.playerLevelUp();
				}

				//roll loot to drop
				lootRoll = this.dieRoll(1, 100);
				potionFlip = this.dieRoll(0, 1);
				goldDrop = this.dieRoll(1, this.player.lvl*2);

				if (this.player.lvl !== 1){
					if (lootRoll <= 5) {

						droppedItem = loots["Legendary"][this.dieRoll(0, 1)];

						this.output(this.mob.name + ' dropped ' + droppedItem.name 
						+ ' and ' + goldDrop + ' gold!', "Lime", 0);

						this.player.gold = this.player.gold + goldDrop;
						this.equip(this.player, droppedItem);

						if (potionFlip) {
							this.player.potions++;
							this.output('You found a potion!', "Lime", 1);
						}
					} else if (lootRoll > 5 && lootRoll <= 35) {

						droppedItem = loots["Rare"][this.dieRoll(0, 1)];

						this.output(this.mob.name + ' dropped ' + droppedItem.name 
						+ ' and ' + goldDrop + ' gold!', "Lime", 0);
						
						this.player.gold = this.player.gold + goldDrop;
						this.equip(this.player, droppedItem);

						if (potionFlip) {
							this.output('You found a potion!', "Lime", 1);
							this.player.potions++;
						}
					} else if (lootRoll > 35) {

						droppedItem = loots["Common"][this.dieRoll(0, 19)];

						this.output(this.mob.name + ' dropped ' + droppedItem.name 
							+ ' and ' + goldDrop + ' gold!', "Lime", 0);

						this.player.gold = this.player.gold + goldDrop;
						this.equip(this.player, droppedItem);

						if (potionFlip) {
							this.player.potions++;
							this.output('You found a potion!', "Lime", 1);
						}
					}
				}  else {
					this.output(this.mob.name + ' dropped ' + goldDrop + ' gold!');
					this.player.gold = this.player.gold + goldDrop;

					if (potionFlip) {
						this.player.potions++;
						this.output('You found a potion!', "Lime", 1);
					}
				}
				
				this.output('');
				this.room++;
				this.output('Room: ' + this.room, "Gray", 0);
				this.getMob(this.biomeRoll);
				this.updateInterface();
			} else {
				// Mob chooses action
				mobAction = 'Melee';

				// Mob makes action roll
				mobActionStat = actions[mobAction]['stat'];
				mobStat = this.mob[mobActionStat] || 0;
				mobTargetStat = actions[mobAction]['target-stat'];
				mobRoll = (this.dieRoll(1, mobStat)*actions[mobAction].rolls) - this.mob.miss;
				
				if (mobRoll < 0) {
					mobRoll = 0;
				}

				mobActionDamage = mobRoll - this.player.armor;

				if (mobActionDamage < 0) {
					mobActionDamage = 0;
				}

				// Announce mob action
				if (mobRoll === 0) {
					this.output(this.mob.name+'\'s ' + mobAction + ' missed!', 
						"LightGreen", 1);
				} else {
					this.output(this.mob.name+'\'s ' + mobAction + ' ' + actions[mobAction].verb 
						+ ' ' + mobActionDamage + ' ' + actions[mobAction]['verb-damage'] 
						+ '!',"Red", 1);
					
					// Subtract mob roll from player target stat
					this.player[mobTargetStat] = this.player[mobTargetStat] - mobActionDamage;
				}

				if(this.player[mobTargetStat] <= 0){
					this.player[mobTargetStat] = 0;
				}

				// Check if player is dead
				if (this.player.hp <= 0) {
					this.output(this.player.name + ' has died!',"Red", 1);
					this.output('You were defeated by ' + this.mob.name + '.',"Red", 1);
					//this.output(this.playerFinalStats());
				}
			}

			// Update interface
			this.updateInterface();

		} else {
			this.output('You have died. Please play again.',"Gray", 1);
		}
	};

	// Update the interface with game information
	this.updateInterface = function () {
		// Update GUI, pass in game state object
		this.dungeonEngine.updateLoop({
			player: this.player,
			mob: this.mob
		}, this.currentBiome);

		this.roomCount.innerHTML = this.room;
		this.helmDisplay.innerHTML = this.player.helm.name;
		this.neckDisplay.innerHTML = this.player.neck.name;
		this.chestDisplay.innerHTML = this.player.chest.name;
		this.ringDisplay.innerHTML = this.player.ring.name;
		this.weapDisplay.innerHTML = this.player.weap.name;
		this.pantsDisplay.innerHTML = this.player.pants.name;
		this.feetDisplay.innerHTML = this.player.feet.name;
	};

	// Output a message to both the fight log container and window.console
	this.output = function (message, color, muteSpeech) {
		var messageText, lineBreak, span;

		// log to console
		console.log(message);

		if (this.fightLog === '') {
			// create a new text node with the message
			messageText = document.createTextNode(message);

			// create a new <br> element to act as a line break
			lineBreak = document.createElement('br');

			// append message text and line break
			this.fightLog.appendChild(messageText);
			this.fightLog.appendChild(lineBreak);
		} else {
			// create a new text node with the message
			messageText = document.createTextNode(message);
			span = document.createElement('span');
			span.style.color = color;

			// create a new <br> element to act as a line break
			lineBreak = document.createElement('br');

			// append message text and line break
			this.fightLog.insertBefore(lineBreak, this.fightLog.childNodes[0]);
			span.appendChild(messageText);
			this.fightLog.insertBefore(span, this.fightLog.childNodes[0]);
			//this.fightLog.insertBefore(messageText, this.fightLog.childNodes[0]);
		}

		if (!this.speechMuted && !muteSpeech && message != '') {
			this.speak(message);
		}
	};

	//Get input from the player
	this.getInput = function () {

		this.inputText = document.forms["player-input"]["input"].value;
		
		return this.inputText;
	};

	// Roll a die
	// Returns random number from min to sides (inclusive)
	this.dieRoll = function (min, sides) {

		return Math.floor(Math.random() * (sides - min + 1)) + min;
	};

	// Clear the fight log container and the console
	this.clearLog = function () {
		this.fightLog.textContent = '';
		console.clear();
	};

	// Speech Synthesis
	this.speaking = false;
	this.speechQueue = [];
	var speechReady = new Event('speech-ready');
	window.speechSynthesis.addEventListener('speech-ready', function (e) {
		console.log('heard speech-ready');
	});

	this.speak = function (message) {
		if (this.voice) {
			this.synthMessage = new SpeechSynthesisUtterance(message);
			this.synthMessage.text = message;
			this.synthMessage.voice = this.voice;
			//this.synthMessage.lang = 'en-US';
			this.synthMessage.volume = 1; // 0 to 1
			this.synthMessage.rate = 0.75; // 0 to 10
			this.synthMessage.pitch = 1; // 0 to 2

			this.synthMessage.onend = function onend(evt) {
				console.log('end', evt);
				if (this.speechQueue.length > 0) {
					window.speechSynthesis.speak(this.speechQueue.shift());
				}
			}.apply(this);

			this.synthMessage.onerror = function onerror(evt) {
				console.log('error', evt);
			}.apply(this);

			if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
				this.speechQueue.push(this.synthMessage);
			} else {
				window.speechSynthesis.speak(this.synthMessage);
			}
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
				optionElem.textContent = group[i].name;
				optionElem.value = i;

				// Add player class <option> to lvl 1 <optgroup>
				optgroupElem.appendChild(optionElem);
			}

			// Add lvl 1 <optgroup> to player <select>
			selectElem.appendChild(optgroupElem);
		};

		populateSelect(this.playerSelectElem, "Classes", heroes);

		//populateSelect(this.mobSelectElem, "Snow Mobs", mobs["Snow Mobs"]);
		//populateSelect(this.mobSelectElem, "Swamp Mobs", mobs["Swamp Mobs"]);
		//populateSelect(this.mobSelectElem, "Desert Mobs", mobs["Desert Mobs"]);
		//populateSelect(this.mobSelectElem, "Cave Mobs", mobs["Cave Mobs"]);

		// Voice Synthesis
		// Has to wait for the voice list to load first
		window.speechSynthesis.onvoiceschanged = (function () {
			var voices = window.speechSynthesis.getVoices();
			this.voice = voices[3];
			this.synthMessage.voice = this.voice;
		}).bind(this);

		//Reset
		//this.reset();
	};

	// Self-initialize
	this.init();
};
