function flat(stream) {
	stream = stream || this;
	var result = stream.clone();
	stream.then(result.resolve, result.reject);
	stream.each(function flatValue(val) {
		if (val === undefined)
			return;
		if (!!val && typeof val.each === 'function') {
			val.each(flatValue);
		} else if (!!val && Array.isArray(val)) {
			val.forEach(flatValue);
		} else {
			result.emit(val);
		}
	});
	return result;
}
module.exports = flat;