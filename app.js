var express = require('express');
var request = require('request');

var app = express();

var key = process.env.etherscanAPI;
var address = process.env.ethAddress;

app.get('/', function (req, res) {
 	res.send('Welcome to FeedVitalik! For just 1 Wei () you can help feed a starving Vitalik...will you be the hero the crypto world needs?');

 	var balanceUrl = 'https://api.etherscan.io/api?module=account&action=balance&address='+address+'&tag=latest&apikey='+key;
 	var txUrl = 'https://api.etherscan.io/api?module=account&action=txlist&address='+address+'&tag=latest&apikey='+key;
 	
 	// GET Balance
	request(balanceUrl, function (error, response, body) {
	    if (!error && response.statusCode == 200) {
	        console.log("Balance request: " + body)
	     }
	})

	//GET Tx
	request(txUrl, function (error, response, body) {
	    if (!error && response.statusCode == 200) {
	        console.log("Tx request: " + body)
	     }
	})

});

app.listen(3000, function () {
  console.log('FeedVitalik listening on port 3000!');
});