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
	strm.fin = fin;
	strm.clone = clone;
	strm.fin(function() {
		listeners = [];
		handled = true;
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
		checkNotHandled();
		listeners.push(listener);
		return {
			strm : strm,
			unsubscribe : function() {
				return strm.unsubscribe(listener);
			}
		};
	}

	function unsubscribe(listener) {
		removeFromList(listeners, listener);
		return strm;
	}

	function checkNotHandled() {
		if (handled) {
			throw new Error('Stream was closed');
		}
	}
	function emit(value) {
		checkNotHandled();
		try {
			listeners.forEach(function(listener) {
				listener(value);
			});
		} catch (err) {
			strm.reject(err);
		}
	}

	function fin(method) {
		return strm.then(method, method);
	}

	function clone() {
		var s = new Stream(Promise, options);
		clones.push(s);
		s.fin(function() {
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
