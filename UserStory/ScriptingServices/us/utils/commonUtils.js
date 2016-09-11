/* globals $ */
/* eslint-env node, dirigible */

exports.isNotNull = function(fields) {
	for (var i = 0; i < fields.length; i++) {
		if (fields[i] === undefined || fields[i] === null) {
			return false;
		}
	}
	return true;
};