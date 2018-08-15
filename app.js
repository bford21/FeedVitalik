const express = require('express')
var request = require('request');
var path    = require("path");

const app = express();
app.use(express.static(__dirname + '/View'));
app.use(express.static(__dirname + '/Images'));

var key = process.env.infuraAPIKey;
var secret = process.env.infuraAPISecret;

// Get most recent block number
var eth_blockNumber = 'eth_blockNumber';

// Get most recent block by number and use array of transactions thats returned
var eth_getBlockByHash = 'eth_getBlockByHash';

var getBlockNumber = 'https://api.infura.io/v1/jsonrpc/mainnet/'+eth_blockNumber+'?token='+key;
var getBlockByHash = 'https://api.infura.io/v1/jsonrpc/mainnet/'+eth_getBlockByHash+'?token='+key+'&params=["0xb3b20624f8f0f86eb50dd04688409e5cea4bd02d700bf6e79e9384d47d6a5a35",true]';

var callAPI = function (url, cb) {
	//use request to make the external http call to the JSON api
	request({
		url: url,
		json: true
	}, function (error, response, body) {
		if (!error && response.statusCode === 200) {
		  cb(body.result);// Send body/response to callback
		  console.log(body);
		}
	})
};

app.get('/', (req, res) => {
  res.sendFile('index.html');

  //var get = function(cb) {
 // return callAPI(getBlockByHash, cb);
//};

//res.send(get);

});

app.listen(8000, () => {
  console.log('Example app listening on port 8000!')
});