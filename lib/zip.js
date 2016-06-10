function zip(first, second, result) {
	result = result || this;
	var subscriptions = [];
	var a = [], b = [];
	subscriptions.push(first.subscribe(function(p) {
		a.push(p);
		doZip();
	}));
	subscriptions.push(second.subscribe(function(p) {
		b.push(p);
		doZip();
	}));
	function doZip() {
		while (a.length > 0 && b.length > 0) {
			(function(x, y) {
				result.emit([ x, y ]);
			})(a.shift(), b.shift());
		}
	}
	first.then(result.resolve, result.reject);
	second.then(result.resolve, result.reject);
	result.done(function() {
		subscriptions.forEach(function(subscription) {
			subscription.unsubscribe();
		});
	});
	return result;
}

module.exports = zip;