function filter(filter, stream) {
	stream = stream || this;
	var result = stream.clone();
	stream.then(result.resolve, result.reject);
	var subscription = stream.subscribe(function(p) {
		stream.Promise.resolve().then(function() {
			return filter(p);
		}).then(function(ok) {
			if (ok) {
				result.emit(p);
			}
		});
	});
	result.fin(subscription.unsubscribe);
	return result;
}
module.exports = filter;