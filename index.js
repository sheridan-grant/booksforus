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
    if (s.user != null) {
      res.status(200).json({user: s.user.username});
    } else {
      res.status(200).json({user: null});
    }
  })
  .get('/authors', function(req, res) {
    getAuthors(function(error, result) {
      if (error || result == null) {
  			res.status(500).json({success: false, data: error});
  		} else {
  			res.status(200).json({data : result});
  		}
    });
  })
  .get('/books', function(req, res) {
    getBooks(function(error, result) {
  		if (error || result == null) {
  			res.status(500).json({success: false, data: error});
  		} else {
  			res.status(200).json({data : result});
  		}
  	});
  })
  .get('/getFavorites', function(req, res) {
    if (req.session.user) {
      getFavorites(req, function(error, result) {
        if (error || result == null) {
    			res.status(500).json({success: false, data: error});
    		} else {
    			res.status(200).json({success: true, data: result});
    		}
      });
    }
  })
  .post('/addFavorite', function(req, res) {
    if (req.session.user) {
      addFavorite(req, function(error, result) {
        if (error || result == null) {
    			res.status(500).json({success: false, data: error});
    		} else {
    			res.status(200).json({success: true});
    		}
      });
    }
  })
  .post('/removeFavorite', function(req, res) {
    if (req.session.user) {
      removeFavorite(req, function(error, result) {
        if (error || result == null) {
    			res.status(500).json({success: false, data: error});
    		} else {
    			res.status(200).json({success: true});
    		}
      });
    }
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
        getAuthorId(req, function(error, data) {
          if (error || data == null) {
      			res.status(500).json({success: false, data: error});
      		} else {
            req.body.author = data[0].author_id;
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
    signupUser(req, function(error, data) {
      loginUser(req, function(error, result) {
        if (error || result == null) {
    			res.status(500).json({success: false, data: error});
    		} else {
          req.session.user = result[0].username;
          req.session.user_id = result[0].user_id;
    			res.status(200).json({success: true});
    		}
      });
    });
  })
  .post('/login', function(req, res) {
    loginUser(req, function(error, result) {
      if (error || result == null) {
  			res.status(500).json({success: false, data: error});
  		} else {
        req.session.user = result[0].username;
        req.session.user_id = result[0].user_id;
  			res.status(200).json({success: true});
  		}
    });
  })
  .post('/logout', function(req, res) {
    if (req.session.user) {
      req.session.destroy();
      res.status(200).json({success: true});
    } else {
      res.status(200).json({success: false});
    }
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

function getFavorites(req, callback) {
  var client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true
  });

  client.connect(function(err) {
    if (err) {
      console.log("Error connecting to DB: ");
      console.log(err);
      callback(err, null);
    }

    var sql = "SELECT * FROM favorite_books_list f WHERE f.user_id = $1";
    var params = [req.session.user_id];

    client.query(sql, params, function(err, result) {

      client.end(function(err) {
        if (err) throw err;
      });

      if (err) {
        console.log("Error in query: ");
        console.log(err);
        callback(err, null);
      }

      callback(null, result.rows);
    });
  });
}

function addFavorite(req, callback) {
  var client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true
  });

  client.connect(function(err) {
    if (err) {
      console.log("Error connecting to DB: ");
      console.log(err);
      callback(err, null);
    }

    var sql = "INSERT INTO favorite_books_list (user_id, book_id) VALUES ($1, $2);";
    var params = [req.session.user_id, req.body.book_id];

    client.query(sql, params, function(err, result) {

      client.end(function(err) {
        if (err) throw err;
      });

      if (err) {
        console.log("Error in query: ");
        console.log(err);
        callback(err, null);
      }

      callback(null, result);
    });
  });
}

function removeFavorite(req, callback) {
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

    var sql = "DELETE FROM favorite_books_list f WHERE f.user_id = $1 AND f.book_id = $2;";
    var params = [req.session.user_id, req.body.book_id];

    client.query(sql, params, function(err, result) {

      client.end(function(err) {
        if (err) throw err;
      });

      if (err) {
        console.log("Error in query: ")
        console.log(err);
        callback(err, null);
      }

      callback(null, result);
    });
  });
}

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

    var sql = "INSERT INTO users (username, password) VALUES ($1, $2);";
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

    client.query(sql, params, function(err, result) {

      client.end(function(err) {
        if (err) throw err;
      });

      if (err) {
        console.log("Error in query: ")
        console.log(err);
        callback(err, null);
      }

      callback(err, result);
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

    var sql = "SELECT author_id FROM author a WHERE a.name = $1;";
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
