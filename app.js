var express = require('express');
var request = require('request');

var app = express();

var key = process.env.etherscanAPI;
var address = process.env.ethAddress;

app.get('/', function (req, res) {
 	res.send('Welcome to FeedVitalik! Help feed a starving Vitalik...will you be the hero the crypto world needs?');

 	var balanceUrl = 'https://api.etherscan.io/api?module=account&action=balance&address='+address+'&tag=latest&apikey='+key;
 	var txUrl = 'https://api.etherscan.io/api?module=account&action=txlist&address='+address+'&tag=latest&apikey='+key;
 	
 	// GET Balance
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
		    	console.log("Previous: " + prevLength);
		    	console.log("Length: " + length);
		    	
		    	if(length > prevLength){
			    	for (i=0; i < responseObj.result.length; i++){
			    		// Transactions are in order from newest to oldest
			    		res.write("Tx Item "+i+": " + responseObj.result[i].blockNumber);
			    		prevLength = length;
			    	}
			    }
		    }
		});
	}, 5000);

});

app.listen(3000, function () {
  console.log('FeedVitalik listening on port 3000!');
});