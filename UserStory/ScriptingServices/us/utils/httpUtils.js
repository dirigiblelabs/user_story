/* globals $ */
/* eslint-env node, dirigible */

exports.sendResponse = function(response, status, contentType, content) {
	response.setStatus(status);
	response.setContentType(contentType);
	response.println(content);
	response.flush();
	response.close();	
};

exports.getRequestBody = function(request) {
	try {
		return JSON.parse(request.readInputText());
	} catch (e) {
		return null;
	}
};