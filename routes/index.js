var api = require('./api');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

  	/* */
  	api.getTx(function (data) {
	    // render to the index.jade and pass the data from api call
	    res.render('index', { TxResult: data});
	  });
});

module.exports = router;
