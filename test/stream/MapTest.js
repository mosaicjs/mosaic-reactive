var expect = require('expect.js');
var test = require('../test').test;
var newStream = require('../test').newStream;

describe('#map', function() {
	test('should be be able to map objects from one stream to another',
			function() {
				var source = newStream();
				var expected = [];
				var upCaseSource = source.map(function(value) {
					return value.toUpperCase();
				}).each(function(value) {
					expected.push(value);
				});

				var array = [ 'first', 'second', 'third', 'fourth', 'fifth' ];
				array.forEach(function(value) {
					source.emit(value);
				});
				source.end();
				return upCaseSource.then(function() {
					expect(expected).to.eql(array.map(function(val) {
						return val.toUpperCase();
					}))
				});
			});
});
