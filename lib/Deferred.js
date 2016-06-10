function Deferred(Promise) {
	var resolve, reject;
	var promise = new Promise(function(a, b) {
		resolve = a;
		reject = b;
	});
	promise.Promise = Promise;
	promise.resolve = resolve;
	promise.reject = reject;
	promise.fin = promise.done = function(method) {
		return promise.then(method, method);
	};
	return promise;
}
module.exports = Deferred;