function delay(timeout, result) {
	result = result || this;
	var t = setTimeout(function() {
		result.emit();
	}, timeout);
	result.fin(function() {
		clearTimeout(t);
	});
	return result;
}

module.exports = delay;