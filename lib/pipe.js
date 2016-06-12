function pipe(stream, that) {
	that = that || this;
	that.each(function(value){
		stream.emit(value);
	});
	that.then(stream.resolve, stream.reject);
	return that;
}
module.exports = pipe;