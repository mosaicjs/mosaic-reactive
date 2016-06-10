/**
 * This example shows how values from two streams can be transformed and
 * "zipped" together.
 */
var reactive = require('../');

var source1 = newStream();
var source2 = newStream();

// Put transformed values from two streams together.
var out = newStream().zip(
// Values from the first stream are changed to upper case
source1.map(function(value) {
	return value.toUpperCase();
}),
// Values from the second stream are wrapped in '<' and '>' symbols.
source2.map(function(value) {
	return '<' + value + '>';
}))
// Output the resulting value pairs
.each(function(array) {
	// This array contains transformed values from the first stream
	// with the corresponding changed values from the second stream
	console.log('* ', array.join(': '));
});

// First stream content
[ 'first', 'second', 'third', 'fourth', 'fifth' ].forEach(source1.emit);

// Values for the second stream
[ 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight' ]
		.forEach(source2.emit);

// Terminate source streams
source1.end();
source2.end();

// Wait for the finishing of the resulting output stream
return out.then(function() {
	console.log('Finished');
}, function(err) {
	console.log('Error!', err);
});

// Creates and returns a new stream
function newStream() {
	return reactive.Stream(Promise, {
		methods : reactive
	});
}