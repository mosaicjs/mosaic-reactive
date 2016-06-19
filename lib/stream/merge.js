function merge(streams, result) {
	result = result || this;
	for (var i = 0; i < streams.length; i++) {
		var stream = streams[i];
		// Finish the resulting stream if there is an error
		stream.then(null, function(err) {
			result.reject(err);
		});
		stream.each(function(p) {
			result.emit(p);
		});
	}
	// Close the resulting stream when all streams are finished
	result.Promise.all(streams).then(function() {
		result.resolve();
	});
	return result;
}
module.exports = merge;