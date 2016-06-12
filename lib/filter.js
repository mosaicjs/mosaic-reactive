function filter(filter, stream) {
	stream = stream || this;
	var result = stream.clone();
	stream.then(result.resolve, result.reject);
	var subscription = stream.subscribe(function(value) {
		if (filter(value)) {
			result.emit(value);
		}
	});
	result.done(subscription);
	return result;
}
module.exports = filter;