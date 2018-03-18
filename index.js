const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

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
    console.log(error);
    console.log(result);
		if (error || result == null) {
			res.status(500).json({success: false, data: error});
		} else {
			res.status(200).json(result.rows);
		}
	});
}

function getBooks(callback) {
  client.connect(function(err) {
    if (err) {
      console.log("Error connecting to DB: ")
      console.log(err);
      callback(err, null);
    }

    var sql = "SELECT * FROM book;";
    var params = [];

    var query = client.query(sql, params, function(err, result) {
      // we are now done getting the data from the DB, disconnect the client
      client.end(function(err) {
        if (err) throw err;
      });

      if (err) {
        console.log("Error in query: ")
        console.log(err);
        callback(err, null);
      }

      console.log("Found result: " + JSON.stringify(result.rows));

      // call whatever function the person that called us wanted, giving it
      // the results that we have been compiling
      callback(null, result.rows);
    });
  });
}
