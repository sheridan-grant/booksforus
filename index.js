const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

client.connect();

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/books', function(req, res) {
    client.query('SELECT * FROM book;', (err, res) => {
      if (err) throw err;
      var rows = [];
      for (let row of res.rows) {
        rows.push(JSON.stringify(row));
      }
      client.end();

      res.writeHead(200, {
        'Content-Type': 'text/html'
      });
      res.write('<!doctype html>\n<html lang="en">\n' +
      '\n<meta charset="utf-8">\n<title>Books</title>\n' +
      '\n\n<h1>Here are the books</h1>\n' + rows.join(' :: ') + '\n\n');
      res.end();
    });
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
