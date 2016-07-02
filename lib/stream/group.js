function group(comparator, stream) {
	stream = stream || this;
	var result = stream.clone(true);
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
		try {
			if (buffer.length) {
				result.emit(buffer);
			}
		} finally {
			result.end();
		}
	});
	return result;
}

module.exports = group;