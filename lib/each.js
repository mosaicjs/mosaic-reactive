function each(f, stream) {
	stream = stream || this;
	var subscription = stream.subscribe(function(val) {
		f(val);
	});
	stream.done(subscription.unsubscribe);
	return stream;
}

module.exports = each;