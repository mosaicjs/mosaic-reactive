# mosaic-reactive

A very simple reactive framework inspired by the http://reactivex.io/.
Features:
 * < 250 lines of code; < 5 (kbytes non minimized)
 * Based on PromiseA-compliant promises; can be used with any external promise 
   implementations.
 * Each stream is a deferred object with resolve/reject/then methods. Main methods:
   - deferred
   - stream
 * Provides the following methods:
   - buffered 
   - filter
   - map
   - merge
   - zip
 * Experimental methods
   - delay
   - interval

Example: 
```
// var Promise = require('promise'); // - not required in NodeJS environment 
var reactive = require('mosaic-reactive');

var source = source(Promise, {
    methods: reactive  
});
source.map(function(p){
    return p.then(function(value){
        return value.toUpperCase();
    });
});

source.subscirbe(function(p){
    return p.then(function(value){
        console.log('* ', value);
    });
});
var array = ['first', 'second', 'third', 'fourth', 'fifth']; 
array.forEach(function(value){
    source.emit(value);
});

return source.then(function(){
    console.log('Finished');
}, function(err){
    console.log('Error!', err);
});

```
