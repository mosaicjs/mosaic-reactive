function map(f, stream) {
	stream = stream || this;
	var result = stream.clone();
	stream.then(result.resolve, result.reject);
	var subscription = stream.subscribe(function(p) {
		result.emit(f ? stream.Promise.resolve().then(function() {
			return f(p);
		}) : stream.Promise.resolve(p));
	});
	result.fin(subscription.unsubscribe);
	return result;
}

module.exports = map;