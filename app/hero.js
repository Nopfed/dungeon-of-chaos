function Hero(options) {
	options = options || {};

	this.name = options.name || 'New Hero';
	this.hp = options.hp || 1;
	this.atk = options.atk || 1;
	this.miss = options.miss || 1;

	this.formatName = function () {
		return this.name + '(' + this.hp + ')';
	};
};