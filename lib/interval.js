function interval(timeout, result) {
	result = result || this;
	var i = 0;
	function emit() {
		result.emit(i++);
	}
	var t = setInterval(emit, timeout);
	result.then(function() {
		clearInterval(t);
	});
	return result;
}

module.exports = interval;