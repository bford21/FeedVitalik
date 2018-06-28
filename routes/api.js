var request = require('request');

var key = process.env.etherscanAPI;
var address = process.env.ethAddress;

var balanceUrl = 'https://api.etherscan.io/api?module=account&action=balance&address='+address+'&tag=latest&apikey='+key;
var txUrl = 'https://api.etherscan.io/api?module=account&action=txlist&address='+address+'&tag=latest&apikey='+key;
	
var callAPI = function (url, cb) {
	//use request to make the external http call to the JSON api
	request({
		url: url,
		json: true
	}, function (error, response, body) {
		if (!error && response.statusCode === 200) {
		  cb(body.result);// Send body/response to callback
		  console.log(body.result);
		}
	})
};

// Call the api with a call back
var getBalance = function(cb) {
  return callAPI(balanceUrl, cb);
};

var getTx = function(cb) {
  return callAPI(txUrl, cb);
};

module.exports = {
  getBalance: getBalance,
  getTx: getTx
};

 	/*// GET Balance
	request(balanceUrl, function (error, response, body) {
		if (!error && response.statusCode == 200) {
		    console.log("Balance request: " + body)
		}
	});
	
	// GET Tx every 5 seconds
	// Only print new Tx
	var prevLength = 0;
	setInterval(function(){
		request(txUrl, function (error, response, body) {
		    if (!error && response.statusCode == 200) {
		    	var responseObj = JSON.parse(body);
		    	var length = responseObj.result.length;
		    	console.log("Previous Length: " + prevLength);
		    	console.log("Current Length: " + length);
		    	
		    	if(length > prevLength){
			    	for (i=0; i < responseObj.result.length; i++){
			    		// Transactions are in order from newest to oldest
			    		console.log("Tx Item "+i+": " + responseObj.result[i].blockNumber)
			    		prevLength = length;
			    	}
			    }
		    }
		});
	}, 5000);*/