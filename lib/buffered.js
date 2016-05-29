function buffered(size, stream) {
	stream = stream || this;
	var result = stream.clone();
	var buffer = [];
	var subscription = stream.subscribe(function(p) {
		buffer.push(p);
		if (buffer.length >= size) {
			result.emit(stream.Promise.all(buffer));
			buffer = [];
		}
	});
	result.fin(function() {
		subsciption.unsubscribe();
	});
	stream.fin(function() {
		if (buffer.length > 0) {
			result.emit(stream.Promise.all(buffer));
			buffer = [];
		}
	});
	return result;
}

module.exports = buffered;