function Hero(name, hp, atk) {
	this.name = name;
	this.hp = hp;
	this.atk = atk;
};

function dieRoll(rolls, sides){
	for (i = 0; i < rolls; i++) {
		return ((Math.random() * sides) + 1).toFixed(0);
	}
};

function fight() {
	var fighterA = new Hero("Buttz", 12, 5);
	var fighterB = new Hero("Skele-Bro", 6, 2);

	var count = 0;

	while (fighterA.hp > 0 && fighterB.hp > 0) {
		// iterate the roundo
		count++;

		// fighterA attacks fighterB
		fighterB.hp -= dieRoll(1, fighterA.atk);
		output(fighterB.name + ': ' + fighterB.hp);
		
		// fighterB attacks fighterA
		fighterA.hp -= dieRoll(1, fighterB.atk);
		output(fighterA.name + ': ' + fighterA.hp);

		// evaluate resultzors
		if (fighterA.hp <= 0) {
			output(fighterB.name + " wins!");
		} else if (fighterB.hp <= 0) {
			output(fighterA.name + " wins!");
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