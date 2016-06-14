function Deferred(Promise) {
	var resolve, reject;
	var promise = new Promise(function(a, b) {
		resolve = a;
		reject = b;
	});
	promise.Promise = Promise;
	promise.resolve = resolve;
	promise.destroy = promise.end = function(err, result) {
		if (err) {
			reject(err);
		} else {
			resolve(result);
		}
		return promise;
	}
	promise.reject = reject;
	promise.fin = promise.done = function(method) {
		promise.then(method, method);
		return promise;
	};
	return promise;
}
module.exports = Deferred;