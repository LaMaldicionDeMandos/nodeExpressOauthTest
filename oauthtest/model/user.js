var util = require('util');
module.exports.findOrCreate = function(user, callback) {
		console.log("user: " + util.inspect(user));
		callback(null, user);
	};;