/* globals $ */
/* eslint-env node, dirigible */

var request = require('net/http/request');
var response = require('net/http/response');

var userDao = require('us/dao/userDao');
var projectDao = require('us/dao/projectDao');
var httpUtils = require('us/utils/httpUtils');
var commonUtils = require('us/utils/commonUtils');

dispatchRequest(request, response);

function dispatchRequest(httpRequest, httpResponse) {
	userDao.delete(1);
	switch(httpRequest.getMethod()) {
		case 'POST': 
			handlePostRequest(httpRequest, httpResponse);
			break;
		default:
			handleNotAllowedRequest(httpResponse);
	}
}

function handlePostRequest(httpRequest, httpResponse) {
	var user = httpUtils.getRequestBody(httpRequest);
	if (isValidUser(user)) {
		var projects = [];
		if (userDao.get(user.tokenId)) {
			projects = projectDao.getByUserId(user.tokenId);
		} else {
			userDao.create(user);
		}
		httpUtils.sendResponse(httpResponse, httpResponse.OK, 'application/json', JSON.stringify(projects));
	} else {
		httpUtils.sendResponse(httpResponse, httpResponse.BAD_REQUEST);
	}
}

function handleNotAllowedRequest(httpResponse) {
	httpUtils.sendResponse(httpResponse, httpResponse.METHOD_NOT_ALLOWED);
}

function isValidUser(user) {
	return user && commonUtils.isNotNull([user.tokenId, user.displayName, user.email]);
}
