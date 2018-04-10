const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const PORT = process.env.PORT || 5000
const { Client } = require('pg');

var session = require('express-session');
var FileStore = require('session-file-store')(session);

express()
  .use(express.static(path.join(__dirname, 'public')))
  .use(bodyParser.urlencoded({ extended: false }))
  .use(bodyParser.json())
  .use(session({
    name: 'server-session-cookie-id',
    secret: 'pastaforyou',
    saveUninitialized: true,
    resave: true,
    store: new FileStore(),
    cookie: { maxAge: 3600000,secure: false, httpOnly: true }
  }))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/currentSession', function(req, res) {
    var s = req.session;
    if (s.favorite != null) {
      res.status(200).json({favorite: s.favorite});
    } else {
      res.status(200).json({favorite: null});
    }
  })
  .get('/authors', function(req, res) {
    getAuthors(function(error, result) {
      if (error || result == null) {
  			res.status(500).json({success: false, data: error});
  		} else {
  			res.status(200).json({'data' : result});
  		}
    });
  })
  .get('/books', function(req, res) {
    getBooks(function(error, result) {
  		if (error || result == null) {
  			res.status(500).json({success: false, data: error});
  		} else {
  			res.status(200).json({'data' : result});
  		}
  	});
  })
  .post('/addBook', function(req, res) {
    addBook(req, function(error, result) {
      if (error || result == null) {
  			res.status(500).json({success: false, data: error});
  		} else {
  			res.status(200).json({success: true});
  		}
    });
  })
  .post('/addAuthor', function(req, res) {
    addAuthor(req, function(error, result) {
      if (error || result == null) {
  			res.status(500).json({success: false, data: error});
  		} else {
        getAuthorId(req, function(error, author_id) {
          if (error || author_id == null) {
      			res.status(500).json({success: false, data: error});
      		} else {
            req.body.author = author_id;
            addBook(req, function(error, bookResult) {
              if (error || bookResult == null) {
          			res.status(500).json({success: false, data: error});
          		} else {
          			res.status(200).json({success: true});
          		}
            });
          }
        });
  		}
    });
  })
  .put('/changeScore', function(req, res) {
    changeScore(req, function(error, result) {
      if (error || result == null) {
  			res.status(500).json({success: false, data: error});
  		} else {
  			res.status(200).json({success: true});
  		}
    });
  })
  .post('/signup', function(req, res) {
    signupUser(req, function(error, result) {
      res.setHeader('Content-Type', 'application/json');
      res.send({ favorite: [] });
    });
  })
  .post('/login', function(req, res) {
    loginUser(req, function(error, result) {
      console.log(result);
      if (result.length != 0) {

      } else {

      }
    });
  })
  .post('/logout', function(req, res) {
    if (req.session.user) {
      req.session.destroy();
      res.send({ success: true });
    }
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

function loginUser(req, callback) {
  var client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true
  });

  client.connect(function(err) {
    if (err) {
      console.log("Error connecting to DB: ")
      console.log(err);
      callback(err, null);
    }

    var sql = "SELECT * FROM USERS WHERE username = $1 AND password = $2;";
    var params = [req.body.username, req.body.password];

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

function signupUser(req, callback) {

}

function changeScore(req, callback) {
  var client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true
  });

  client.connect(function(err) {
    if (err) {
      console.log("Error connecting to DB: ")
      console.log(err);
      callback(err, null);
    }

    var sql = "UPDATE book SET score = $1 WHERE book_id = $2;";
    var params = [req.body.score, req.body.book_id];

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

function getAuthors(callback) {
  var client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true
  });

  client.connect(function(err) {
    if (err) {
      console.log("Error connecting to DB: ")
      console.log(err);
      callback(err, null);
    }

    var sql = "SELECT a.author_id, a.name FROM Author a;";
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

function addBook(req, callback) {
  var client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true
  });

  client.connect(function(err) {
    if (err) {
      console.log("Error connecting to DB: ")
      console.log(err);
      callback(err, null);
    }

    var sql = "INSERT INTO book (title, description, score, author_id) values ($1, $2, 0, $3);";
    var params = [req.body.title, req.body.desc, req.body.author];

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

function addAuthor(req, callback) {
  var client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true
  });

  client.connect(function(err) {
    if (err) {
      console.log("Error connecting to DB: ")
      console.log(err);
      callback(err, null);
    }

    var sql = "INSERT INTO author (name) VALUES ($1);";
    var params = [req.body.author];

    client.query(sql, params, function(err, r) {

      client.end(function(err) {
        if (err) throw err;
      });

      if (err) {
        console.log("Error in query: ")
        console.log(err);
        callback(err, null);
      }
    });
  });
}

function getAuthorId(req, callback) {
  var client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true
  });

  client.connect(function(err) {
    if (err) {
      console.log("Error connecting to DB: ")
      console.log(err);
      callback(err, null);
    }

    var sql = "SELECT author_id FROM author a Where a.name = $1;";
    var params = [req.body.author];

    client.query(sql, params, function(err, result) {

      client.end(function(err) {
        if (err) throw err;
      });

      if (err) {
        console.log("Error in query: ")
        console.log(err);
        callback(err, null);
      }
      console.log(result);
      callback(null, result.rows);
    });
  });
}

function getBooks(callback) {
  var client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true
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
