function zip(streams, result) {
	result = result || this;
	var buffers = [];
	streams.forEach(function(stream, idx) {
		var buf = [];
		buffers.push(buf);
		stream.each(function(val) {
			buf.push(val);
			doZip();
		});
		stream.then(result.resolve, result.reject);
	});

	function doZip() {
		var ok = true;
		for (var i = 0; ok && i < buffers.length; i++) {
			ok = !!buffers[i].length;
		}
		if (ok) {
			var array = [];
			for (var i = 0; i < buffers.length; i++) {
				var buf = buffers[i];
				array.push(buf.shift());
			}
			result.emit(array);
		}
	}
	return result;
}

module.exports = zip;