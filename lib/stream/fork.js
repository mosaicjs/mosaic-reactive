function fork(stream) {
	stream = stream || this;
	var result = stream.clone();
	stream.pipe(result);
	return result;
}
module.exports = fork;