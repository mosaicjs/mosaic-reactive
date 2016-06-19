var expect = require('expect.js');
var test = require('../test').test;
var newStream = require('../test').newStream;

describe('#group', function() {
	test('should be be able to group latest objects', function() {
		var source = newStream();
		var grouped = newStream();
		var expected = [];
		var groupped = source.group(function(a, b) {
			return a > b ? 1 : a < b ? -1 : 0;
		}).each(function(value) {
			expected.push(value);
		});
		var array = [ 'A', 'B', 'B', 'C', 'D', 'D', 'E' ];
		array.forEach(function(value) {
			source.emit(value);
		});
		source.end();
		return groupped.then(function() {
			expect(expected).to.eql([ // 
			[ 'A' ], //
			[ 'B', 'B' ], //
			[ 'C' ], //
			[ 'D', 'D' ], //
			[ 'E' ], //
			])
		});
	});
});
