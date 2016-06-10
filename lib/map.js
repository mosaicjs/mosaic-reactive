function map(f, stream) {
	stream = stream || this;
	var result = stream.clone();
	stream.then(result.resolve, result.reject);
	var subscription = stream.subscribe(function(val) {
		result.emit(f ? f(val) : val);
	});
	result.done(subscription.unsubscribe);
	return result;
}

module.exports = map;