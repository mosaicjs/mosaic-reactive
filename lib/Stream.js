var Deferred = require('./Deferred');

function Stream(Promise, options) {
	var stream = new Deferred(Promise);
	var options = options || {};
	var handled = false;
	var listeners = [];
	var clones = [];
	if (options.methods) {
		for ( var name in options.methods) {
			stream[name] = options.methods[name];
		}
	}
	stream.subscribe = function(listener) {
		var f;
		if (!stream.closed) {
			listeners.push(listener);
			f = function() {
				return stream.unsubscribe(listener);
			};
		} else {
			f = function() {
			};
		}
		f.unsubscribe = f.end = f;
		f.stream = f.stream = stream;
		return f;
	};
	stream.unsubscribe = function(listener) {
		removeFromList(listeners, listener);
		return stream;
	};
	stream.write = stream.emit = function(value) {
		if (!stream.closed) {
			try {
				listeners.forEach(function(listener) {
					listener(value);
				});
			} catch (err) {
				stream.reject(err);
			}
		}
		return stream;
	};
	stream._newClone = function(Promise, options) {
		return new Stream(Promise, options);
	}
	stream.clone = function() {
		var s = stream._newClone(stream.Promise, options);
		clones.push(s);
		s.done(function() {
			removeFromList(clones, s);
		});
		return s;
	};
	stream.closed = false;
	stream.done(function() {
		listeners = [];
		stream.closed = true;
	});
	stream.then(function(result) {
		clones.forEach(function(clone) {
			clone.resolve(result);
		});
	}, function(err) {
		clones.forEach(function(clone) {
			clone.reject(err);
		});
	})
	return stream;

	function removeFromList(list, item) {
		for (var i = list.length - 1; i >= 0; i--) {
			if (list[i] === item) {
				list.splice(i, 1);
			}
		}
	}
}

module.exports = Stream;
