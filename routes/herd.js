var express = require('express');
var router = express.Router();
var pg = require('pg');
var connect_config = {
  user: 'postgres',
  password: 'postgres',
  database: 'postgres',
  host: 'learn-postgres.c3ccnecqsxt1.us-west-2.rds.amazonaws.com',
  port: 5432
};

// Docker machine host
// 192.168.99.100

// AWS endpoint
// learn-postgres.c3ccnecqsxt1.us-west-2.rds.amazonaws.com

/* GET herd listing. */
router.get('/', function(req, res, next) {
  var results = [];
  pg.connect(connect_config, function(err, client, done) {
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }

    var query = client.query('SELECT * FROM herd ORDER BY purchase_date ASC');
    query.on('row', function(row) {
      results.push(row);
    });
    query.on('end', function() {
      done();
      return res.json(results);
    });
  });
});


// ADD animal to herd
router.post('/', function(req, res, next) {
  var results = [];
  var data = {breed: req.body.breed, name: req.body.name, purchase_date: req.body.purchase_date};
  pg.connect(connect_config, function(err, client, done) {
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    client.query('INSERT INTO herd (breed, name, purchase_date) values($1, $2, $3)', [data.breed, data.name, data.purchase_date]);
    var query = client.query('SELECT * FROM herd ORDER BY purchase_date ASC');
    query.on('row', function(row) {
      results.push(row);
    });
    query.on('end', function() {
      done();
      return res.json(results);
    });
  });
});
module.exports = router;
