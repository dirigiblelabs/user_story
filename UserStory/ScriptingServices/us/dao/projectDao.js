/* globals $ */
/* eslint-env node, dirigible */

exports.getByUserId = function(userId) {
	var mockedData = [
	  {
	    "projectId": "9",
	    "name": "Project 1",
	    "userStories": [
	      [
	        {
	          "userStoryId": 1,
	          "who": "Ivancho",
	          "why": "Thats why...",
	          "what": "Do something"
	        },
	        {
	          "userStoryId": 2,
	          "who": "Dancho",
	          "why": "Thats why...",
	          "what": "Test"
	        }
	      ]
	    ]
	  },
	  {
	    "projectId": "11",
	    "name": "Project 2",
	    "userStories": [
	      []
	    ]
	  },
	  {
	    "projectId": "12",
	    "name": "Project 2",
	    "userStories": [
	      []
	    ]
	  }
	];
	return mockedData;
};