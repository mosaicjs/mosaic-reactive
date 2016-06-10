var reactive = require('../');

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
