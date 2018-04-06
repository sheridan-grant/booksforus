const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
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
  .get('/addBook', function(req, res) {
    getBook(req, function(error, result) {
      if (error || result == null) {
  			res.status(500).json({ success: false, data: error });
  		} else {
  			res.status(200).json({ success: true });
  		}
    })
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

function bookRoute(req, res) {
  getBooks(function(error, result) {

		if (error || result == null) {
			res.status(500).json({success: false, data: error});
		} else {
			res.status(200).json({ 'data' : result });
		}
	});
}

function getBook(req, callback) {
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

    var sql = "INSERT INTO book (title, description, score, author_id) values ($1, $2, 0, 1);";
    var params = [req.body.title, req.body.description];

    // client.query(sql, params, function(err, result) {
    //
    //   client.end(function(err) {
    //     if (err) throw err;
    //   });
    //
    //   if (err) {
    //     console.log("Error in query: ")
    //     console.log(err);
    //     callback(err, null);
    //   }
    //
    //   callback(null, result.rows);
    // });
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

    var sql = "SELECT b.book_id, b.title, b.description, b.score, a.name, a.author_id FROM Book b, Author a WHERE b.author_id = a.author_id;";
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
