var expect = require('expect.js');
var test = require('./test').test;
var newStream = require('./test').newStream;

describe('Stream', function() {
	test('should be just a Promise', function() {
		var stream = newStream();
		stream.resolve();
		return stream;
	});
	test('should be be able to generate events', function() {
		var source = newStream();

		var pos = 0;
		source.each(function(val) {
			expect(val).to.eql(array[pos++]);
		});

		var array = [ 'first', 'second', 'third', 'fourth', 'fifth' ];
		array.forEach(function(value) {
			source.emit(value);
		});
		source.end();
		return source;
	});

	require('./stream');
});
