function delay(timeout, result) {
	result = result || this;
	var t = setTimeout(function() {
		result.emit();
	}, timeout);
	result.done(function() {
		clearTimeout(t);
	});
	return result;
}

module.exports = delay;