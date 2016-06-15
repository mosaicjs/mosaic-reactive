module.exports = function(that) {
	return {
		_newClone : function() {
			throw new Error();
		},
		initialize : function(options) {
			that.listeners = [];
			that.clones = [];
			that.closed = false;
			that.options = options || {};
			that.write = that.fire = that.emit;
			that.on = that.subscribe;
			that.off = that.unsubscribe;
			that.done(function() {
				that.listeners = [];
				that.closed = true;
			});
			that.then(function(result) {
				that.clones.forEach(function(clone) {
					clone.resolve(result);
				});
			}, function(err) {
				that.clones.forEach(function(clone) {
					clone.reject(err);
				});
			})

		},
		subscribe : function(listener) {
			var f;
			if (!that.closed) {
				that.listeners.push(listener);
				f = function() {
					return that.unsubscribe(listener);
				};
			} else {
				f = function() {
				};
			}
			f.unsubscribe = f.end = f;
			f.that = f.that = that;
			return f;
		},
		unsubscribe : function(listener) {
			removeFromList(that.listeners, listener);
			return that;
		},
		emit : function(value) {
			if (!that.closed) {
				try {
					that.listeners.forEach(function(listener) {
						listener(value);
					});
				} catch (err) {
					that.reject(err);
				}
			}
			return that;
		},
		clone : function() {
			var s = that._newClone();
			that.clones.push(s);
			s.done(function() {
				removeFromList(that.clones, s);
			});
			return s;
		}
	};

	function removeFromList(list, item) {
		for (var i = list.length - 1; i >= 0; i--) {
			if (list[i] === item) {
				list.splice(i, 1);
			}
		}
	}
}