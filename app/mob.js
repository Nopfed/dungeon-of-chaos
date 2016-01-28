function Mob(options) {
	options = options || {};

	this.name = options.name || 'New Mob';
	this.lvl = options.lvl || 1;
	//this.maxHp = options.maxHp || 1;
	//this.baseHp = options.baseHp || 1;
	this.hp = options.hp || 1;
	this.xp = options.xp || 1;
	this.atk = options.atk || 1;
	this.miss = options.miss || 1;
	this.armor = options.armor || 0;
	this.gold = options.gold || 10;
	this.abilities = options.abilities || [];

	this.randomColor = Math.floor(Math.random()*(256))
		+','+Math.floor(Math.random()*(256))
		+','+Math.floor(Math.random()*(256));
	this.randomAlpha = Math.random();

	//this.attack = function (otherHero) {
	//	return this.atk - otherHero.armor;
	//}
};