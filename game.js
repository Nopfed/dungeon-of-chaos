function Hero(name, hp, atk) {
	this.name = name;
	this.hp = hp;
	this.atk = atk;

	this.formatName = function () {
		return this.name + '(' + this.hp + ')';
	};
};

function dieRoll(rolls, sides){
	for (i = 0; i < rolls; i++) {
		return ((Math.random() * sides) + 1).toFixed(0);
	}
};

function fight() {
	// set up both fighters
	var fighterA = new Hero("Buttz", 12, 5);
	var fighterB = new Hero("Skele-Bro", 6, 2);

	var count = 0;

	// announce the fight
	output(fighterA.formatName() + ' vs. ' + fighterB.formatName());

	// fight to the death!
	while (fighterA.hp > 0 && fighterB.hp > 0) {
		var attackRollA, attackRollB;

		// iterate the roundo
		count++;

		// both fighters roll for their attacks
		attackRollA = dieRoll(1, fighterA.atk);
		attackRollB = dieRoll(1, fighterB.atk);

		// output fighterA attack roll 
		output(fighterA.name + ' attacks with a ' + attackRollA);

		// subtract attack roll from fighterB hp
		fighterB.hp = fighterB.hp - attackRollA;
		output(fighterB.name + ' is at ' + fighterB.hp);

		// check if fighterB is dead
		if (fighterB.hp <= 0) {
			output(fighterA.formatName() + " wins!");
			continue;
		}
		
		// output fighterB attack roll 
		output(fighterB.name + ' attacks with a ' + attackRollB);
		
		// subtract attack roll from fighterA hp
		fighterA.hp = fighterA.hp - attackRollB;
		output(fighterA.name + ' is at ' + fighterA.hp);

		// check if fighter A is dead
		if (fighterA.hp <= 0) {
			output(fighterB.formatName() + " wins!");
		}
	}
};

function output(message) {
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