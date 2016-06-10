function each(f, stream) {
	stream = stream || this;
	var subscription = stream.subscribe(function(val) {
		f(val);
	});
	stream.done(subscription);
	return stream;
}

module.exports = each;