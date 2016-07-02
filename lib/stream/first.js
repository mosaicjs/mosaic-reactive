function first(size, stream) {
	stream = stream || this;
	var result = stream.clone();
	var counter = 0;
	stream.each(function(data) {
		if (counter < size) {
			result.emit(data);
		}
		counter++;
		if (counter == size) {
			stream.end();
		}
	});
	return result;
}
module.exports = first;