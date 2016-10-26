var expect = require('expect.js');
var test = require('../test').test;
var newStream = require('../test').newStream;

describe('#buffered', function() {
  test('should group objects', function() {
    var source = newStream();
    var first = source.clone();
    var result = source.clone().buffered(2, first);

    var testArray = [];
    result.each(function(value) {
      testArray.push(value);
    });
    var control = [ 'first', 'A', 'second', 'B', 'third', 'C', 'fourth', 'D',
        'fifth', 'E', 'sixth' ];
    control.forEach(function(val, i) {
      first.emit(val);
    });
    setTimeout(function() {
      first.end();
      source.end();
    }, 10);
    return source
        .then(function() {
          expect(testArray).to.eql([ [ 'first', 'A' ], [ 'second', 'B' ],
              [ 'third', 'C' ], [ 'fourth', 'D' ], [ 'fifth', 'E' ],
              [ 'sixth' ] ]);
        });
  });
  test('should be able to flush buffer', function() {
    var source = newStream();
    var first = source.clone();
    var result = source.clone().buffered(2, first);

    var testArray = [];
    result.each(function(value) {
      testArray.push(value);
    });
    var control = [ 'first', 'A', 'second', 'B', 'third', 'C' ];
    control.forEach(function(val, i) {
      first.write(val);
      if (i === 2) {
        result.flush();
      }
    })
    source.end();
    return result.then(function() {
      expect(testArray).to.eql([ [ 'first', 'A' ], [ 'second' ],
          [ 'B', 'third' ], [ 'C' ] ]);
    });
  });
});
