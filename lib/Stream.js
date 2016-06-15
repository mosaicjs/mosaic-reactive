var Deferred = require('./Deferred');
var StreamMixin = require('./StreamMixin');
module.exports = function Stream(Promise, options) {
	options = options || this || {};
	return Deferred(Promise, [ StreamMixin, {
		_newClone : function() {
			return new Stream(Promise, options);
		},
	}, options ]);

}
