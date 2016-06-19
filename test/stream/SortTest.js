var expect = require('expect.js');
var test = require('../test').test;
var newStream = require('../test').newStream;

describe('#sort', function() {
	function testSort(msg, firstSet, secondSet, control, comparator) {
		test(msg, function() {
			var source = newStream();
			var first = source.clone();
			var second = source.clone();
			var result = source.clone().sort([ first, second ], comparator);

			var testArray = [];
			result.each(function(slot) {
				// console.log('* ', value);
				testArray.push(slot.idx + ':' + slot.val);
			});

			firstSet.forEach(function(val) {
				first.emit(val);
			});
			secondSet.forEach(function(val) {
				second.emit(val);
			});

			var finished = false;
			result.done(function() {
				finished = true;
			});
			// The resulting stream is closed when all sources are closed
			first.end();
			second.end();
			// source.end();
			return result.then(function() {
				expect(finished).to.be(true);
				expect(testArray).to.eql(control);
			});

		});
	}
	testSort('1. should compare inputs and generate sorted output', //
	[ 'A', 'C', 'E', 'G', 'I', 'J', 'K' ], //
	[ 'B', 'C', 'D', 'E', 'F', 'H' ], //
	[ '0:A', '1:B', '0:C', '1:C', '1:D', '0:E', '1:E', '1:F', '0:G', '1:H',
			'0:I', '0:J', '0:K' ], //
	function(a, b) {
		return a > b ? 1 : a < b ? -1 : 0;
	});

	testSort('2. should compare inputs and generate sorted output', //
	('id-1, id-3, id-4, id-5, id-8, id-14, id-16, id-19, ' + //
	'id-21, id-23, id-24, id-29, id-31, id-32, id-33, ' + //
	'id-34, id-36, id-37, id-38, id-39, id-40, id-42, ' + //
	'id-43, id-45, id-46, id-47, id-48, id-49, id-50')//
	.split(', '),//

	'id-1, id-8, id-21, id-29, id-32, id-37, id-42, id-45, id-47, id-50'
			.split(', '), //
	[ '0:id-1', '1:id-1', '0:id-3', '0:id-4', '0:id-5', '0:id-8', '1:id-8',
			'0:id-14', '0:id-16', '0:id-19', '0:id-21', '1:id-21', '0:id-23',
			'0:id-24', '0:id-29', '1:id-29', '0:id-31', '0:id-32', '1:id-32',
			'0:id-33', '0:id-34', '0:id-36', '0:id-37', '1:id-37', '0:id-38',
			'0:id-39', '0:id-40', '0:id-42', '1:id-42', '0:id-43', '0:id-45',
			'1:id-45', '0:id-46', '0:id-47', '1:id-47', '0:id-48', '0:id-49',
			'0:id-50', '1:id-50' ], //
	function(a, b) {
		a = +(a.substring('id-'.length));
		b = +(b.substring('id-'.length));
		return a > b ? 1 : a < b ? -1 : 0;
	});

	var x = [ //
	[ 'A', null ], //
	[ null, 'B' ], //
	[ 'C', 'C' ], //
	[ null, 'D' ], //
	[ 'E', 'E' ], //
	[ null, 'F' ], //
	[ 'G', null ], //
	];

});
