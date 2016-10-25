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
		Deferred : __webpack_require__(2),
		Extended : __webpack_require__(3),
		Stream : __webpack_require__(4),
		StreamMixin : __webpack_require__(5),
		stream : __webpack_require__(6)
	};

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var Extended = __webpack_require__(3);
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

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = function Extended(that, extensions, args) {
		var constructors = [];
		for (var i = 0; i < extensions.length; i++) {
			var from = extensions[i];
			if (!from)
				continue;
			if (typeof from === 'function') {
				from = from(that);
			}
			for ( var key in from) {
				if (key === 'initialize') {
					constructors.push(from[key]);
				} else {
					that[key] = from[key];
				}
			}
		}
		args = args || [];
		constructors.forEach(function(constructor) {
			constructor.apply(that, args);
		});
		return that;
	}


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var Deferred = __webpack_require__(2);
	var StreamMixin = __webpack_require__(5);
	module.exports = function Stream(Promise, options) {
		options = options || this || {};
		return Deferred(Promise, [ StreamMixin, {
			_newClone : function() {
				return new Stream(Promise, options);
			},
		}, options ]);

	}


/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = function(that) {
		return {
			_newClone : function() {
				throw new Error();
			},
			initialize : function(options) {
				that.listeners = [];
				that.clones = [];
				that.options = options || {};
				that.write = that.fire = that.emit;
				that.on = that.subscribe;
				that.off = that.unsubscribe;
				that.done(function() {
					that.listeners = [];
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
				if (!that.handled) {
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
				if (!that.handled) {
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
			clone : function(detach) {
				var s = that._newClone();
				if (!detach) {
					that.clones.push(s);
					s.done(function() {
						removeFromList(that.clones, s);
					});
				}
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

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	  batched : __webpack_require__(7),
	  buffered : __webpack_require__(8),
	  combine : __webpack_require__(9),
	  delay : __webpack_require__(10),
	  each : __webpack_require__(11),
	  filter : __webpack_require__(12),
	  first : __webpack_require__(13),
	  flat : __webpack_require__(14),
	  fork : __webpack_require__(15),
	  group : __webpack_require__(16),
	  interval : __webpack_require__(17),
	  map : __webpack_require__(18),
	  merge : __webpack_require__(19),
	  pipe : __webpack_require__(20),
	  sort : __webpack_require__(21),
	  zip : __webpack_require__(22)
	};

/***/ },
/* 7 */
/***/ function(module, exports) {

	function batched(batchSize, stream) {
	  stream = stream || this;
	  var output = stream.clone();
	  var batch;
	  var counter = 0;
	  stream.each(function(entry) {
	    if (counter % batchSize === 0) {
	      if (batch) {
	        batch.end();
	      }
	      batch = stream.clone();
	      batch.id = counter / batchSize;
	      output.write(batch);
	    }
	    batch.write(entry);
	    counter++;
	  });
	  stream.done(function() {
	    if (batch) {
	      batch.end();
	    }
	  })
	  return output;
	}
	module.exports = batched;

/***/ },
/* 8 */
/***/ function(module, exports) {

	function buffered(size, stream) {
		stream = stream || this;
		var result = stream.clone(true);
		var buffer = [];
	  result.flush = function flush(){
	    result.emit(buffer);
	    buffer = [];
	  };
		stream.each(function(p) {
			buffer.push(p);
			if (buffer.length >= size) {
			  result.flush();
			}
		});
		stream.done(function() {
			try {
				if (buffer.length > 0) {
				  result.flush();
				}
			} finally {
				result.end();
			}
		});
		return result;
	}

	module.exports = buffered;

/***/ },
/* 9 */
/***/ function(module, exports) {

	function combine(first, second, result) {
		result = result || this;
		var subscriptions = [];
		var a, b;
		subscriptions.push(first.subscribe(function(val) {
			a = val;
			doCombine();
		}));
		subscriptions.push(second.subscribe(function(val) {
			b = val;
			doCombine();
		}));
		function doCombine() {
			if (a !== undefined && b !== undefined) {
				result.emit([ a, b ]);
			}
		}
		first.then(result.resolve, result.reject);
		second.then(result.resolve, result.reject);
		result.done(function() {
			subscriptions.forEach(function(subscription) {
				subscription.end();
			});
		});
		return result;
	}

	module.exports = combine;

/***/ },
/* 10 */
/***/ function(module, exports) {

	function delay(timeout, result) {
		result = result || this;
		var t = setTimeout(function() {
			result.emit();
		}, timeout);
		result.done(function() {
			clearTimeout(t);
		});
		return result;
	}

	module.exports = delay;

/***/ },
/* 11 */
/***/ function(module, exports) {

	function each(f, stream) {
		stream = stream || this;
		var subscription = stream.subscribe(function(val) {
			f(val);
		});
		stream.done(subscription);
		return stream;
	}

	module.exports = each;

/***/ },
/* 12 */
/***/ function(module, exports) {

	function filter(filter, stream) {
		stream = stream || this;
		var result = stream.clone();
		stream.then(result.resolve, result.reject);
		stream.each(function(value) {
			if (filter(value)) {
				result.emit(value);
			}
		});
		result.done(stream.end);
		return result;
	}
	module.exports = filter;

/***/ },
/* 13 */
/***/ function(module, exports) {

	function first(size, stream) {
		stream = stream || this;
		var result = stream.clone();
		var counter = 0;
		stream.each(function(data) {
			if (counter < size) {
				result.emit(data);
			}
			counter++;
			if (counter == size) {
				stream.end();
			}
		});
		return result;
	}
	module.exports = first;

/***/ },
/* 14 */
/***/ function(module, exports) {

	function flat(stream) {
		stream = stream || this;
		var result = stream.clone();
		stream.then(result.resolve, result.reject);
		stream.each(function flatValue(val) {
			if (val === undefined)
				return;
			if (!!val && typeof val.each === 'function') {
				val.each(flatValue);
			} else if (!!val && Array.isArray(val)) {
				val.forEach(flatValue);
			} else {
				result.emit(val);
			}
		});
		return result;
	}
	module.exports = flat;

/***/ },
/* 15 */
/***/ function(module, exports) {

	function fork(stream) {
		stream = stream || this;
		var result = stream.clone();
		stream.pipe(result);
		return result;
	}
	module.exports = fork;

/***/ },
/* 16 */
/***/ function(module, exports) {

	function group(comparator, stream) {
		stream = stream || this;
		var result = stream.clone(true);
		if (!comparator) {
			comparator = function(a, b) {
				return a == b;
			}
		}
		var buffer = [];
		var prev;
		stream.each(function(value) {
			if (prev !== undefined && comparator(prev, value) != 0) {
				result.emit(buffer);
				buffer = [];
			}
			buffer.push(value);
			prev = value;
		});
		stream.done(function() {
			try {
				if (buffer.length) {
					result.emit(buffer);
				}
			} finally {
				result.end();
			}
		});
		return result;
	}

	module.exports = group;

/***/ },
/* 17 */
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
/* 18 */
/***/ function(module, exports) {

	function map(f, stream) {
		stream = stream || this;
		var result = stream.clone();
		stream.then(result.resolve, result.reject);
		var subscription = stream.subscribe(function(val) {
			result.emit(f ? f(val) : val);
		});
		result.done(subscription);
		return result;
	}

	module.exports = map;

/***/ },
/* 19 */
/***/ function(module, exports) {

	function merge(streams, result) {
		result = result || this;
		for (var i = 0; i < streams.length; i++) {
			var stream = streams[i];
			// Finish the resulting stream if there is an error
			stream.then(null, function(err) {
				result.reject(err);
			});
			stream.each(function(p) {
				result.emit(p);
			});
		}
		// Close the resulting stream when all streams are finished
		result.Promise.all(streams).then(function() {
			result.resolve();
		});
		return result;
	}
	module.exports = merge;

/***/ },
/* 20 */
/***/ function(module, exports) {

	function pipe(stream, that) {
		that = that || this;
		that.each(function(value){
			stream.emit(value);
		});
		that.then(stream.resolve, stream.reject);
		return that;
	}
	module.exports = pipe;

/***/ },
/* 21 */
/***/ function(module, exports) {

	function sort(streams, compare, result) {
		result = result || this;
		if (!compare) {
			compare = function(a, b) {
				return a > b ? 1 : a < b ? -1 : 0;
			};
		}
		var buffer = [];
		var counters = [];
		streams.forEach(function(stream, idx) {
			var counter = [ 0 ];
			counters.push(counter);
			stream.each(function(val) {
				buffer.push({
					idx : idx,
					val : val
				});
				counter[0]++;
				doSort();
			});
			stream.done(function() {
				counter.done = true;
				doSort();
			})
		});
		result.Promise.all(streams).then(result.resolve, result.reject);

		function doSort() {
			function available() {
				var ok = counters.length > 0;
				for (var i = 0; ok && i < counters.length; i++) {
					var counter = counters[i]; 
					ok = counter.done || counter[0] > 0;
				}
				if (ok) {
					for (var i = 0; i < counters.length; i++) {
						counters[i][0]--;
					}
				}
				return ok;
			}
			while (available() && buffer.length) {
				buffer.sort(function(a, b) {
					var result = compare(a.val, b.val);
					if (result === 0) {
						result = a.idx - b.idx;
					}
					return result;
				});
				var slot = buffer.shift();
				result.emit(slot);
			}
		}
		return result;
	}

	module.exports = sort;

/***/ },
/* 22 */
/***/ function(module, exports) {

	function zip(streams, result) {
		result = result || this;
		var buffers = [];
		streams.forEach(function(stream, idx) {
			var buf = [];
			buffers.push(buf);
			stream.each(function(val) {
				buf.push(val);
				doZip();
			});
			stream.then(result.resolve, result.reject);
		});

		function doZip() {
			var ok = true;
			for (var i = 0; ok && i < buffers.length; i++) {
				ok = !!buffers[i].length;
			}
			if (ok) {
				var array = [];
				for (var i = 0; i < buffers.length; i++) {
					var buf = buffers[i];
					array.push(buf.shift());
				}
				result.emit(array);
			}
		}
		return result;
	}

	module.exports = zip;

/***/ }
/******/ ])
});
;