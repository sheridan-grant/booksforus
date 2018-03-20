const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const { Client } = require('pg');

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/books', function(req, res) {
    bookRoute(req, res);
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

function bookRoute(req, res) {
  getBooks(function(error, result) {
    console.log(result.rows);
		if (error || result == null) {
			res.status(500).json({success: false, data: error});
		} else {
			res.status(200).json({ 'data' : result.rows });
		}
	});
}

function getBooks(callback) {
  var client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
  });

  client.connect(function(err) {
    if (err) {
      console.log("Error connecting to DB: ")
      console.log(err);
      callback(err, null);
    }

    var sql = "SELECT * FROM book;";
    var params = [];

    client.query(sql, params, function(err, result) {

      client.end(function(err) {
        if (err) throw err;
      });

      if (err) {
        console.log("Error in query: ")
        console.log(err);
        callback(err, null);
      }

      callback(null, result.rows);
    });
  });
}
