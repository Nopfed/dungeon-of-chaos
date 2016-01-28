function Hero(options) {
	options = options || {};

	this.name = options.name || 'New Hero';
	this.lvl = options.lvl || 1;
	this.maxHp = options.maxHp || 1;
	this.baseHp = options.baseHp || 1;
	this.hp = options.hp || 1;
	this.xp = options.xp || 0;
	this.atk = options.atk || 1;
	this.miss = options.miss || 1;
	this.armor = options.armor || 0;
	this.gold = options.gold || 10;
	this.abilities = options.abilities || [];
	this.bag = options.bag || [];
	this.helm = options.helm || {};
	this.neck = options.neck || {};
	this.chest = options.chest || {};
	this.ring = options.ring || {};
	this.weap = options.weap || {};
	this.pants = options.pants || {};
	this.feet = options.feet || {};

	this.randomColor = Math.floor(Math.random()*(256))
		+','+Math.floor(Math.random()*(256))
		+','+Math.floor(Math.random()*(256));
	this.randomAlpha = Math.random();

	//this.attack = function (otherHero) {
	//	return this.atk - otherHero.armor;
	//}
};