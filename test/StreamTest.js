var expect = require('expect.js');
var reactive = require('../');

describe('Stream', function() {
	function newStream() {
		return reactive.Stream(Promise, reactive.stream);
	}
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

	describe('utility methods ', function() {
		test('map - should be be able to map objects '
				+ 'from one stream to another', function() {
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
		
		test('zip - should put objects ' + //
		'in correspondance from two streams', function() {
			var source = newStream();
			var first = source.clone();
			var second = source.clone();
			var result = source.clone().zip(first, second);

			var testArray = [];
			result.each(function(array) {
				testArray.push(array);
			});

			[ 'first', 'second', 'third', 'fourth', 'fifth' ]//
			.forEach(function(val) {
				first.emit(val);
			});
			[ 'A', 'B', 'C', 'D', 'E' ].forEach(function(val) {
				second.emit(val);
			})
			source.end();
			return source.then(function() {
				expect(testArray).to
						.eql([ [ 'first', 'A' ], [ 'second', 'B' ],
								[ 'third', 'C' ], [ 'fourth', 'D' ],
								[ 'fifth', 'E' ] ]);
			});
		});
		test('merge - should put objects ' + //
		'in correspondance from two streams', function() {
			var source = newStream();
			var first = source.clone();
			var second = source.clone();
			var result = source.clone().merge([ first, second ]);

			var testArray = [];
			result.each(function(value) {
				testArray.push(value);
			});

			var control = [ 'first', 'A', 'second', 'B', 'third', 'C',
					'fourth', 'D', 'fifth', 'E' ];
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
		test('buffered - should group objects', function() {
			var source = newStream();
			var first = source.clone();
			var result = source.clone().buffered(2, first);

			var testArray = [];
			result.each(function(value) {
				testArray.push(value);
			});
			var control = [ 'first', 'A', 'second', 'B', 'third', 'C',
					'fourth', 'D', 'fifth', 'E', 'sixth' ];
			control.forEach(function(val, i) {
				first.emit(val);
			});
			setTimeout(function() {
				first.end();
				source.end();
			}, 10);
			return source.then(function() {
				expect(testArray).to.eql([ [ 'first', 'A' ], [ 'second', 'B' ],
						[ 'third', 'C' ], [ 'fourth', 'D' ], [ 'fifth', 'E' ],
						[ 'sixth' ] ]);
			});
		});
	});
});

function test(message, action) {
	it(message, function(done) {
		return Promise.resolve().then(function() {
			return action();
		}).then(function() {
			done();
		}, done);
	})
}