var Extended = require('./Extended');
function Deferred(Promise, extensions, args) {
	var resolve, reject;
	return Extended(new Promise(function(a, b) {
		resolve = a;
		reject = b;
	}), [ function(that) {
		return {
			initialize : function() {
				that.Promise = Promise;
				that.handled = false;
				that.resolve = function(val) {
					that.handled = true;
					resolve(val);
				}
				that.reject = function(err) {
					that.handled = true;
					reject(err);
				}
				that.destroy = that.end;
				that.fin = that.done;
			},
			end : function(err, result) {
				if (err) {
					that.reject(err);
				} else {
					that.resolve(result);
				}
				return that;
			},
			done : function(method) {
				that.then(method, method);
				return that;
			}
		}
	} ].concat(extensions || []), args);
}
module.exports = Deferred;