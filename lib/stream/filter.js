function filter(filter, stream) {
	stream = stream || this;
	var result = stream.clone();
	stream.then(result.resolve, result.reject);
	stream.each(function(value) {
		if (filter(value)) {
			result.emit(value);
		}
	});
	return result;
}
module.exports = filter;