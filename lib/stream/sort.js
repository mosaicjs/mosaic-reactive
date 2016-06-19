function sort(streams, compare, result) {
	result = result || this;
	if (!compare) {
		compare = function(a, b) {
			return a > b ? 1 : a < b ? -1 : 0;
		};
	}
	var buffer = [];
	var counters = [];
	streams.forEach(function(stream, idx) {
		var counter = [ 0 ];
		counters.push(counter);
		stream.each(function(val) {
			buffer.push({
				idx : idx,
				val : val
			});
			counter[0]++;
			doSort();
		});
		stream.done(function() {
			counter.done = true;
			doSort();
		})
	});
	result.Promise.all(streams).then(result.resolve, result.reject);

	function doSort() {
		function available() {
			var ok = counters.length > 0;
			for (var i = 0; ok && i < counters.length; i++) {
				var counter = counters[i]; 
				ok = counter.done || counter[0] > 0;
			}
			if (ok) {
				for (var i = 0; i < counters.length; i++) {
					counters[i][0]--;
				}
			}
			return ok;
		}
		while (available() && buffer.length) {
			buffer.sort(function(a, b) {
				var result = compare(a.val, b.val);
				if (result === 0) {
					result = a.idx - b.idx;
				}
				return result;
			});
			var slot = buffer.shift();
			result.emit(slot);
		}
	}
	return result;
}

module.exports = sort;