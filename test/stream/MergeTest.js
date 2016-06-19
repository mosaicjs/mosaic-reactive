var expect = require('expect.js');
var test = require('../test').test;
var newStream = require('../test').newStream;

describe('#merge', function() {
	test('should put objects ' + //
	'in correspondance from two streams', function() {
		var source = newStream();
		var first = source.clone();
		var second = source.clone();
		var result = source.clone().merge([ first, second ]);

		var testArray = [];
		result.each(function(value) {
			testArray.push(value);
		});

		var control = [ 'first', 'A', 'second', 'B', 'third', 'C', 'fourth',
				'D', 'fifth', 'E' ];
		control.forEach(function(val, i) {
			if (i % 2 === 1) {
				second.emit(val);
			} else {
				first.emit(val);
			}
		});
		source.end();
		return source.then(function() {
			expect(testArray).to.eql(control);
		});
	});
});
