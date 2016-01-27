function Hero(options) {
	options = options || {};

	this.name = options.name || 'New Hero';
	this.lvl = options.lvl || 1;
	this.hp = options.hp || 1;
	this.xp = options.xp || 0;
	this.atk = options.atk || 1;
	this.miss = options.miss || 1;
	this.armor = options.armor || 0;
	this.gold = options.gold || 10;
	this.abilities = options.abilities || [];
	this.gear = options.gear || [];
	this.bag = options.bag || [];

	this.formatName = function () {
		return this.name + '(' + this.lvl + ')';
	};

	//this.attack = function (otherHero) {
	//	return this.atk - otherHero.armor;
	//}

};