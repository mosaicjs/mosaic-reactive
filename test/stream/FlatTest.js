var expect = require('expect.js');
var test = require('../test').test;
var newStream = require('../test').newStream;

describe('#flat', function() {
	test('should re-send single objects downstreams ', function() {
		var source = newStream();
		var values = [];
		var flatten = source.flat().map(function(value) {
			values.push(value);
		});
		var array = [ 'A', 'B', 'B', 'C', 'D', 'D', 'E' ];
		array.forEach(function(value) {
			source.emit(value);
		});
		source.end();
		return flatten.then(function() {
			expect(values).to.eql(array);
		});
	});

	test('should flatten arrays and send their content downstream',
			function() {
				var source = newStream();
				var values = [];
				var flatten = source.flat().map(function(value) {
					values.push(value);
				});
				var array = [ [ 'A', 'B' ], [ [ [ [ 'C' ] ] ] ],
						[ 'D', [ 'E', 'F' ] ] ];
				source.emit(array);
				source.end();
				return flatten.then(function() {
					expect(values).to.eql([ 'A', 'B', 'C', 'D', 'E', 'F' ]);
				});
			});

	test('should flatten stream values and send their content downstream',
			function() {
				var source = newStream();
				var values = [];
				var flatten = source.flat().map(function(value) {
					values.push(value);
				});
				var child = source.clone();
				var array = [ [ 'A', 'B' ], [ [ [ [ child ] ] ] ], 'C' ];
				source.emit(array);
				child.emit([ [ 'D' ], 'E', [ [ [ 'F' ] ] ] ]);
				source.end();
				return flatten.then(function() {
					expect(values).to.eql([ 'A', 'B', 'C', 'D', 'E', 'F' ]);
				});
			});

});
