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
	strm.subscribe = function(listener) {
		var f;
		if (!strm.closed) {
			listeners.push(listener);
			f = function() {
				return strm.unsubscribe(listener);
			};
		} else {
			f = function() {
			};
		}
		f.unsubscribe = f.end = f;
		f.stream = f.strm = strm;
		return f;
	};
	strm.unsubscribe = function(listener) {
		removeFromList(listeners, listener);
		return strm;
	};
	strm.emit = function(value) {
		if (strm.closed)
			return;
		try {
			listeners.forEach(function(listener) {
				listener(value);
			});
		} catch (err) {
			strm.reject(err);
		}
	};
	strm._newClone = function(Promise, options) {
		return new Stream(Promise, options);
	}
	strm.clone = function() {
		var s = strm._newClone(strm.Promise, options);
		clones.push(s);
		s.done(function() {
			removeFromList(clones, s);
		});
		return s;
	};
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

	function removeFromList(list, item) {
		for (var i = list.length - 1; i >= 0; i--) {
			if (list[i] === item) {
				list.splice(i, 1);
			}
		}
	}
}

module.exports = Stream;
