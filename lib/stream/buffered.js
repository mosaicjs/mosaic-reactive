function buffered(size, stream) {
	stream = stream || this;
	var result = stream.clone(true);
	var buffer = [];
	stream.each(function(p) {
		buffer.push(p);
		if (buffer.length >= size) {
			result.emit(buffer);
			buffer = [];
		}
	});
	stream.done(function() {
		try {
			if (buffer.length > 0) {
				result.emit(buffer);
				buffer = [];
			}
		} finally {
			result.end();
		}
	});
	return result;
}

module.exports = buffered;