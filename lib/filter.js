function filter(filter, stream) {
	stream = stream || this;
	var result = stream.clone();
	stream.then(result.resolve, result.reject);
	var subscription = stream.subscribe(function(p) {
		if (filter(p)) {
			result.emit(p);
		}
	});
	result.done(subscription.unsubscribe);
	return result;
}
module.exports = filter;