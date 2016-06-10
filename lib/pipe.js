function pipe(stream, that) {
	that = that || this;
	var subscription = that.subscribe(function(value) {
		stream.emit(value);
	});
	that.then(stream.resolve, stream.reject);
	that.done(function() {
		subscription.unsubscribe();
	})
	return that;
}
module.exports = pipe;