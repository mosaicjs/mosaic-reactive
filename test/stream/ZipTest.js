var expect = require('expect.js');
var test = require('../test').test;
var newStream = require('../test').newStream;

describe('#zip', function() {
	test('should put objects in correspondance from two streams', function() {
		var source = newStream();
		var first = source.clone();
		var second = source.clone();
		var third = source.clone();
		var result = source.clone().zip([ first, second, third ]);

		var testArray = [];
		result.each(function(array) {
			testArray.push(array);
		});

		[ 'first', 'second', 'third', 'fourth', 'fifth' ]//
		.forEach(function(val) {
			first.emit(val);
		});
		[ 'A', 'B', 'C', 'D', 'E', 'F' ].forEach(function(val) {
			second.emit(val);
		});
		[ '1', '2', '3', '4', '5', '6', '7' ].forEach(function(val) {
			third.emit(val);
		})
		var finished = false;
		result.done(function() {
			finished = true;
		});
		// The resulting stream is closed when all sources are closed
		first.end();
		second.end();
		third.end();
		// source.end();
		return result.then(function() {
			expect(finished).to.be(true);
			expect(testArray).to.eql([ //
			[ 'first', 'A', '1' ],//
			[ 'second', 'B', '2' ], //
			[ 'third', 'C', '3' ], //
			[ 'fourth', 'D', '4' ],//
			[ 'fifth', 'E', '5' ] //
			]);
		});
	});
});
