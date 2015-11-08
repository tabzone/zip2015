var express = require('express'),
    fs = require('fs'),
    path = require('path'),
    Retsly = require('js-sdk'),
    moment = require('moment');

//    redis = require('../redis.js');

var router = express.Router();

//var retsly = Retsly.create('16e63ffa03ffb28b22af7ab0479fe74d', ['test']);

var retsly = Retsly.create('57124fa8854f8daa28ec2ab6c6398d87' ,['armls']);
  router.post('/', function(req, res, next) {

  var price = req.body.price;
  var condo = req.body.condo;

console.log('b' , req);
  var limit = "1" // req.param('id');
  var zipCode =  "85225"; // req.param('token');
  
  res.setHeader('Content-Type', 'application/json');
  var listings = [];
  var QueryFor = {};
  if (price)
  {
  QueryFor.zipCode =  '85225'; 
  }
  if (condo) {
    QueryFor.subtype = 'Condominium';
  }
  else
  {
   QueryFor.subtype = 'Single Family Residence'; 
  }

  if (price){
    {QueryFor.price = {gt: 199000}};
  }
  else
  {
    {QueryFor.price = {lt: 198999}};
  }


/*{
  "limit": "1",
  "zipCode": "85225",
  "daysOnMarket": "85"
}
*/
console.log('q' ,QueryFor);
  retsly.listings().query(QueryFor).getAll(function (err, data) {
        if (!data.success) {
          res.status(500).send(err);
          return
        }
        for (var id in data.bundle) {
          var listing = data.bundle[id]
          listings.push(listing);
        }

        return res.send({"listings": listings});

      });
 });

//});
module.exports = router;