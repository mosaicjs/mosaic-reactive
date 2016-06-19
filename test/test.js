var reactive = require('../');

module.exports = {
	test : function test(message, action) {
		it(message, function(done) {
			return Promise.resolve().then(function() {
				return action();
			}).then(function() {
				done();
			}, done);
		})
	},

	newStream : function() {
		return reactive.Stream(Promise, reactive.stream);
	}

}