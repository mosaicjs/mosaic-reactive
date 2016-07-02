var expect = require('expect.js');
var test = require('../test').test;
var newStream = require('../test').newStream;

describe('#first', function() {
	test('should return first values and stop the original stream', function() {
		var sourceValues = [];
		var source = newStream().each(function(val) {
			sourceValues.push(val);
		});
		var firstValues = [];
		var first = source.first(3).each(function(value) {
			firstValues.push(value);
		});
		var array = [ 'A', 'B', 'C', 'D', 'E' ];
		array.forEach(function(value) {
			source.emit(value);
		});
		return first.then(function() {
			expect(firstValues).to.eql([ 'A', 'B', 'C' ]);
			expect(sourceValues).to.eql([ 'A', 'B', 'C' ]);
		});
	});

});
