var reactive = require('../');

var p1 = prop();
var p2 = prop();
var sum = prop().combine(p1, p2).map(function(array) {
	return array[0] + array[1];
});
var mul = prop().combine(p1, p2).map(function(array) {
	return array[0] * array[1];
});
var div = prop().combine(p1, p2).map(function(array) {
	return array[0] / array[1];
});

var result = [];
var report = prop().each(function(val){
	result.push(val);
});
sum.map(function(val){
	return p1.get() + ' + ' + p2.get() + ' = ' + val;
}).pipe(report);
mul.map(function(val){
	return p1.get() + ' x ' + p2.get() + ' = ' + val;
}).pipe(report);
div.map(function(val){
	return p1.get() + ' / ' + p2.get() + ' = ' + val;
}).pipe(report);


console.log('--------------------------');
result = [];
p1.set(10);
p2.set(5);
console.log('All operations:');
console.log(result.join('\n'));
console.log('Last operation:', report.get());

console.log('--------------------------');
result = [];
p2.set(2);
console.log('All operations:');
console.log(result.join('\n'));
console.log('Last operation:', report.get());

console.log('--------------------------');
result = [];
p1.set(18);
console.log('All operations:');
console.log(result.join('\n'));
console.log('Last operation:', report.get());


console.log('--------------------------');
result = [];
p1.set(180);
p2.set(89);
console.log('All operations:');
console.log(result.join('\n'));
console.log('Last operation:', report.get());

function prop() {
	var stream = reactive.Stream(Promise, reactive.stream);
	stream._newClone = prop;
	stream.set = stream.write;
	stream.get = function() {
		return stream.value;
	}
	stream.each(function(val) {
		stream.value = val;
	});
	return stream;
}
