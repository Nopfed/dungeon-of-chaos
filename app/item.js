function item(options) {
	options = options || {};

	this.name = options.name || 'New Item';
	this.lvl = options.lvl || 1;
	this.hp = options.hp || 0;
	this.xp = options.xp || 0;
	this.dmg = options.dmg || 0;
	this.armor = options.armor || 0;
	this.gold = options.gold || 1;
	this.abilities = options.abilities || [];

};