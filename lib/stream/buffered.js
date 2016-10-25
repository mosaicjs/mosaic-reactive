function buffered(size, stream) {
	stream = stream || this;
	var result = stream.clone(true);
	var buffer = [];
  result.flush = function flush(){
    result.emit(buffer);
    buffer = [];
  };
	stream.each(function(p) {
		buffer.push(p);
		if (buffer.length >= size) {
		  result.flush();
		}
	});
	stream.done(function() {
		try {
			if (buffer.length > 0) {
			  result.flush();
			}
		} finally {
			result.end();
		}
	});
	return result;
}

module.exports = buffered;