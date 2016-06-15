function combine(first, second, result) {
	result = result || this;
	var subscriptions = [];
	var a, b;
	subscriptions.push(first.subscribe(function(val) {
		a = val;
		doCombine();
	}));
	subscriptions.push(second.subscribe(function(val) {
		b = val;
		doCombine();
	}));
	function doCombine() {
		if (a !== undefined && b !== undefined) {
			result.emit([ a, b ]);
		}
	}
	first.then(result.resolve, result.reject);
	second.then(result.resolve, result.reject);
	result.done(function() {
		subscriptions.forEach(function(subscription) {
			subscription.end();
		});
	});
	return result;
}

module.exports = combine;