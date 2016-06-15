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
				that.resolve = resolve;
				that.reject = reject;
				that.destroy = that.end;
				that.fin = that.done;
			},
			end : function(err, result) {
				if (err) {
					reject(err);
				} else {
					resolve(result);
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