function Deferred(Promise) {
	var resolve, reject;
	var promise = new Promise(function(a, b) {
		resolve = a;
		reject = b;
	});
	promise.Promise = Promise;
	promise.resolve = resolve;
	promise.reject = reject;
	return promise;
}
module.exports = Deferred;