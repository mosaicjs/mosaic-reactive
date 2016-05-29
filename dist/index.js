(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
		buffered : __webpack_require__(2),
		Deferred : __webpack_require__(3),
		delay : __webpack_require__(4),
		filter : __webpack_require__(5),
		interval : __webpack_require__(6),
		map : __webpack_require__(7),
		merge : __webpack_require__(8),
		Stream : __webpack_require__(9),
		zip : __webpack_require__(10)
	};

/***/ },
/* 2 */
/***/ function(module, exports) {

	function buffered(size, stream) {
		stream = stream || this;
		var result = stream.clone();
		var buffer = [];
		var subscription = stream.subscribe(function(p) {
			buffer.push(p);
			if (buffer.length >= size) {
				result.emit(stream.Promise.all(buffer));
				buffer = [];
			}
		});
		result.fin(function() {
			subsciption.unsubscribe();
		});
		stream.fin(function() {
			if (buffer.length > 0) {
				result.emit(stream.Promise.all(buffer));
				buffer = [];
			}
		});
		return result;
	}

	module.exports = buffered;

/***/ },
/* 3 */
/***/ function(module, exports) {

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

/***/ },
/* 4 */
/***/ function(module, exports) {

	function delay(timeout, result) {
		result = result || this;
		var t = setTimeout(function() {
			result.emit();
		}, timeout);
		result.fin(function() {
			clearTimeout(t);
		});
		return result;
	}

	module.exports = delay;

/***/ },
/* 5 */
/***/ function(module, exports) {

	function filter(filter, stream) {
		stream = stream || this;
		var result = stream.clone();
		stream.then(result.resolve, result.reject);
		var subscription = stream.subscribe(function(p) {
			stream.Promise.resolve().then(function() {
				return filter(p);
			}).then(function(ok) {
				if (ok) {
					result.emit(p);
				}
			});
		});
		result.fin(subscription.unsubscribe);
		return result;
	}
	module.exports = filter;

/***/ },
/* 6 */
/***/ function(module, exports) {

	function interval(timeout, result) {
		result = result || this;
		var i = 0;
		function emit() {
			result.emit(i++);
		}
		var t = setInterval(emit, timeout);
		result.then(function() {
			clearInterval(t);
		});
		return result;
	}

	module.exports = interval;

/***/ },
/* 7 */
/***/ function(module, exports) {

	function map(f, stream) {
		stream = stream || this;
		var result = stream.clone();
		stream.then(result.resolve, result.reject);
		var subscription = stream.subscribe(function(p) {
			result.emit(f ? stream.Promise.resolve().then(function() {
				return f(p);
			}) : stream.Promise.resolve(p));
		});
		result.fin(subscription.unsubscribe);
		return result;
	}

	module.exports = map;

/***/ },
/* 8 */
/***/ function(module, exports) {

	function merge(streams, result) {
		result = result || this;
		var subscriptions = [];
		for (var i = 0; i < streams.length; i++) {
			var stream = streams[i];
			// Finish the resulting stream if there is an error
			stream.then(null, function(err) {
				result.reject(err);
			});
			subscriptions.push(stream.subscribe(function(p) {
				result.emit(p);
			}));
		}
		// Close the resulting stream when all streams are finished
		result.Promise.all(streams).then(function() {
			result.resolve();
		});
		result.fin(function() {
			subscriptions.forEach(function(subscription) {
				subscription.unsubscribe();
			});
		});
		return result;
	}
	module.exports = merge;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var Deferred = __webpack_require__(3);

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

		function emit(value) {
			if (handled) {
				throw new Error('Stream was closed');
			}
			try {
				var p = Promise.resolve(value);
				listeners.forEach(function(listener) {
					listener(p);
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


/***/ },
/* 10 */
/***/ function(module, exports) {

	function zip(first, second, result) {
		result = result || this;
		var subscriptions = [];
		var a = [], b = [];
		subscriptions.push(first.subscribe(function(p) {
			a.push(p);
			doZip();
		}));
		subscriptions.push(second.subscribe(function(p) {
			b.push(p);
			doZip();
		}));
		function doZip() {
			while (a.length > 0 && b.length > 0) {
				(function(x, y) {
					var p = result.Promise.all([ x, y ]);
					result.emit(p);
				})(a.shift(), b.shift());
			}
		}
		first.then(result.resolve, result.reject);
		second.then(result.resolve, result.reject);
		result.fin(function() {
			subscriptions.forEach(function(subscription) {
				subscription.unsubscribe();
			});
		});
		return result;
	}

	module.exports = zip;

/***/ }
/******/ ])
});
;