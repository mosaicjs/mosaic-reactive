var Deferred = require('./Deferred');

function Stream(Promise, options) {
	var strm = new Deferred(Promise);
	var options = options || {};
	var handled = false;
	var listeners = [];
	var clones = [];
	if (options.methods) {
		for ( var name in options.methods) {
			strm[name] = options.methods[name];
		}
	}
	strm.subscribe = subscribe;
	strm.unsubscribe = unsubscribe;
	strm.emit = emit;
	strm.destroy = strm.end = strm.resolve;
	strm.clone = clone;
	strm.closed = false;
	strm.done(function() {
		listeners = [];
		strm.closed = true;
	});
	strm.then(function(result) {
		clones.forEach(function(clone) {
			clone.resolve(result);
		});
	}, function(err) {
		clones.forEach(function(clone) {
			clone.reject(err);
		});
	})
	return strm;

	function subscribe(listener) {
		var f;
		if (!strm.closed) {
			listeners.push(listener);
			f = function() {
			};
		} else {
			f = function() {
				return strm.unsubscribe(listener);
			};
		}
		f.unsubscribe = f.end = f;
		f.stream = f.strm = strm;
		return f;
	}

	function unsubscribe(listener) {
		removeFromList(listeners, listener);
		return strm;
	}

	function emit(value) {
		if (strm.closed)
			return;
		try {
			listeners.forEach(function(listener) {
				listener(value);
			});
		} catch (err) {
			strm.reject(err);
		}
	}

	function clone() {
		var s = new Stream(Promise, options);
		clones.push(s);
		s.done(function() {
			removeFromList(clones, s);
		});
		return s;
	}

	function removeFromList(list, item) {
		for (var i = list.length - 1; i >= 0; i--) {
			if (list[i] === item) {
				list.splice(i, 1);
			}
		}
	}
}

module.exports = Stream;
