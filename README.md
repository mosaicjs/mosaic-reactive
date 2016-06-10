# mosaic-reactive

A very simple reactive framework inspired by the http://reactivex.io/.
Features:
 * 251 lines of code; 8Kb (non minimized)
 * Based on PromiseA-compliant promises; can be used with any external promise 
   implementations.
 * Each stream is a deferred object with resolve/reject/then methods. Main methods:
   - Deferred
   - Stream
 * Provides the following methods:
   - buffered
   - each
   - filter
   - index
   - map
   - merge
   - pipe
   - zip
 * Experimental methods
   - delay
   - interval

Example: 
```
// var Promise = require('promise'); // - not required in NodeJS environment 
var reactive = require('mosaic-reactive');

var source = reactive.Stream(Promise, {
	methods : reactive
});

var out = source.map(function(value) {
	return value.toUpperCase();
}).each(function(value) {
	console.log('* ', value);
});

var array = [ 'first', 'second', 'third', 'fourth', 'fifth' ];
array.forEach(source.emit);
source.end();

return out.then(function() {
	console.log('Finished');
}, function(err) {
	console.log('Error!', err);
});


```
