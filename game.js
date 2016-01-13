function hero(name, hp, atk) {
	this.heroName = name;
	this.hp = hp;
	this.atk = atk;
}

function dieRoll(rolls, sides){
	for(i = 0; i < rolls; i++) {
		return ((Math.random() * sides) + 1).toFixed(0);
	}
}

var p1 = new hero("Buttz", 12, 5);
var mob = new hero("Skele-Bro", 6, 2);
var count = 0;

while (p1.hp !== 0 && mob.hp !== 0) {
	//count++;
	//console.log(count);
	console.log(mob.hp -= dieRoll(1, p1.atk));
	console.log("mob");
	console.log(p1.hp -= dieRoll(1, mob.atk));
	console.log("player");

	if (p1.hp <= 0) {
		console.log(mob.heroName + " wins!");
		break;
	} else if (mob.hp <= 0) {
		console.log(p1.heroName + " wins!");
		break;
	}
}