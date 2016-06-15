module.exports = function Extended(that, extensions, args) {
	var constructors = [];
	for (var i = 0; i < extensions.length; i++) {
		var from = extensions[i];
		if (!from)
			continue;
		if (typeof from === 'function') {
			from = from(that);
		}
		for ( var key in from) {
			if (key === 'initialize') {
				constructors.push(from[key]);
			} else {
				that[key] = from[key];
			}
		}
	}
	args = args || [];
	constructors.forEach(function(constructor) {
		constructor.apply(that, args);
	});
	return that;
}
