const express = require('express')
var request = require('request');
var path = require("path");

const app = express();
app.use(express.static(__dirname + '/View'));
app.use(express.static(__dirname + '/Images'));

var key = process.env.infuraAPIKey;
//var secret = process.env.infuraAPISecret;

var latestBlockUrl = 'https://api.infura.io/v1/jsonrpc/mainnet/eth_blockNumber?token='+key;
var blockByNumberUrl = 'https://api.infura.io/v1/jsonrpc/mainnet/eth_getBlockByNumber?token='+key+'&params=["';
var latestBlock = "";

function ethFactory(result){
	if(result){
		console.log("Number of transactions:" + result.transactions.length);
		
		// foreach(){
		// 	console.log(result.transactions.length)
		// }
		// var transactions = new Object();

	}else{
		console.log("*** Error no result supplied to the eth factory ***");
	}
	
}

function getBlockByNumber(blockNum){
	var url = blockByNumberUrl + blockNum + '",true]';
	request({
		url: url,
		json: true
	}, function (error, response, body) {
		if (!error && response.statusCode === 200 ) {
			if (typeof body.result != 'undefined' && body.result) {
				ethFactory(body.result);
			}else{
				console.log("No result in response. body=" + body);
				console.log("Retrying...");
				getBlockByNumber(blockNum);
			}
		}
	})
}

function getLatestBlock(){
	request({
		url: latestBlockUrl,
		json: true
	}, function (error, response, body) {
		if (!error && response.statusCode === 200) {
		  // check if block is new
		  if(body.result != latestBlock){
		  	latestBlock = body.result;
			  console.log("\nLatest Block (HEX):" + latestBlock);
			  console.log("\nLatest url: " + latestBlockUrl);
		  	getBlockByNumber(latestBlock);
		  }
		}
	})
}

// Queries for latest block every 1 sec
setInterval(function(){getLatestBlock()}, 1000);

app.get('/', (req, res) => {
	res.send('index.html', {'block': 12});
});

app.listen(8000, () => {
  console.log('Example app listening on port 8000!')
});