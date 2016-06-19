function group(comparator, stream) {
	stream = stream || this;
	var result = stream.clone();
	if (!comparator) {
		comparator = function(a, b) {
			return a == b;
		}
	}
	var buffer = [];
	var prev;
	stream.each(function(value) {
		if (prev !== undefined && comparator(prev, value) != 0) {
			result.emit(buffer);
			buffer = [];
		}
		buffer.push(value);
		prev = value;
	});
	stream.done(function() {
		if (buffer.length) {
			result.emit(buffer);
		}
	});
	return result;
}

module.exports = group;