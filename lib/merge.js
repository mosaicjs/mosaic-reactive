function merge(streams, result) {
	result = result || this;
	var subscriptions = [];
	for (var i = 0; i < streams.length; i++) {
		var stream = streams[i];
		// Finish the resulting stream if there is an error
		stream.then(null, function(err) {
			result.reject(err);
		});
		subscriptions.push(stream.subscribe(function(p) {
			result.emit(p);
		}));
	}
	// Close the resulting stream when all streams are finished
	result.Promise.all(streams).then(function() {
		result.resolve();
	});
	result.done(function() {
		subscriptions.forEach(function(subscription) {
			subscription.unsubscribe();
		});
	});
	return result;
}
module.exports = merge;