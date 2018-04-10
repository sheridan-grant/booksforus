angular.module('booksForUs', ['ui.bootstrap'])
.factory('bookFactory', ['$http', function($http) {

  var bookFactory = {};

  bookFactory.signup = function(user) {
    return $http.post("/signup", user);
  };

  bookFactory.login = function(user) {
    return $http.post("/login", user);
  };

  bookFactory.logout = function() {
    return $http.post("/logout");
  };

  bookFactory.addBook = function(book) {
    return $http.post("/addBook", book);
  };

  bookFactory.addAuthor = function(author) {
    return $http.post("/addAuthor", author);
  };

  bookFactory.getBooks = function() {
    return $http.get("/books");
  };

  bookFactory.getAuthors = function() {
    return $http.get("/authors");
  };

  bookFactory.changeScore = function(score) {
    return $http.put("/changeScore", score);
  }

  bookFactory.getFavorites = function() {
    return $http.get("/getFavorites");
  }

  bookFactory.addFavorite = function(book_id) {
    return $http.post("/addFavorite", book_id);
  }

  bookFactory.removeFavorite = function(book_id) {
    return $http.post("/removeFavorite", book_id);
  }

  bookFactory.currentSession = function() {
    return $http.get("/currentSession");
  }

  return bookFactory;
}])
.controller('bookController', ['bookFactory', function(bookFactory) {
  var bCtrl = this;
  bCtrl.currentBooks = [];
  bCtrl.currentFavorites = [];
  bCtrl.currentAuthors = [];
  bCtrl.propertyName = 'title';
  bCtrl.view = "Favorite Books";
  bCtrl.viewAllBooks = true;
  bCtrl.username = "";
  bCtrl.password = "";
  bCtrl.reverse = false;

  bookFactory.getBooks().then(function(books) {
    for (var i = 0; i < books.data.data.length; i++) {
      var tmp = books.data.data[i];
      bCtrl.currentBooks.push({
        id: i,
        book_id: tmp.book_id,
        title: tmp.title,
        description: tmp.description,
        name: tmp.name,
        author_id: tmp.author_id,
        score: tmp.score,
        inc: false,
        dec: false,
        favorite: false
      });
    }

    bookFactory.currentSession().then(function(response) {
      if (response.data.user != null) {
        bCtrl.isLoggedIn = true;
        bCtrl.username = response.data.user;
        bookFactory.getFavorites().then(function(response) {
          for (var i = 0; i < response.data.data.length; i++) {
            var id = response.data.data[i].book_id;
            bCtrl.currentFavorites.push(id);
            for (var j = 0; j < bCtrl.currentBooks.length; j++) {
              if (id == bCtrl.currentBooks[j].book_id) {
                bCtrl.currentBooks[j].favorite = true;
                break;
              }
            }
          }
        });
      } else {
        bCtrl.isLoggedIn = false;
      }
    });
  });

  bookFactory.getAuthors().then(function(authors) {
    for (var i = 0; i < authors.data.data.length; i++) {
      var tmp = authors.data.data[i];
      bCtrl.currentAuthors.push({
        author_id: tmp.author_id,
        name: tmp.name
      });
    }
  });

  bCtrl.changeView = function() {
    if (bCtrl.view == "Favorite Books") {
      bCtrl.view = "All Books";
      bCtrl.viewAllBooks = false;
    } else {
      bCtrl.view = "Favorite Books";
      bCtrl.viewAllBooks = true;
    }
  };

  bCtrl.signup = function() {
    var user = {
      username: bCtrl.username,
      password: bCtrl.password
    };

    if (user.username != "" && user.password != "") {
      bookFactory.signup(user).then(function(response) {
        if (response.data.success) {
          bCtrl.isLoggedin = true;
          bookFactory.getFavorites().then(function(response) {
            console.log(response);
          });
        }
      });
    }
  };

  bCtrl.login = function() {
    var user = {
      username: bCtrl.username,
      password: bCtrl.password
    };

    if (user.username != "" && user.password != "") {
      bookFactory.login(user).then(function(response) {
        if (response.data.success) {
          bCtrl.isLoggedin = true;
          bookFactory.getFavorites().then(function(response) {
            for (var i = 0; i < response.data.data.length; i++) {
              var id = response.data.data[i].book_id;
              bCtrl.currentFavorites.push(id);
              for (var j = 0; j < bCtrl.currentBooks.length; j++) {
                if (id == bCtrl.currentBooks[j].book_id) {
                  bCtrl.currentBooks[j].favorite = true;
                  break;
                }
              }
            }
          });
        }
      });
    }
  };

  bCtrl.logout = function() {
    bookFactory.logout().then(function(response) {
      bCtrl.username = "";
      bCtrl.password = "";
      bCtrl.isLoggedin = false;
      bCtrl.currentFavorites.length = 0;
    });
  };

  bCtrl.toggleFavorite = function(book_id) {
    var params = {
      book_id: book_id
    };

    var fav = false;

    for (var i = 0; i < bCtrl.currentFavorites.length; i++) {
      if (bCtrl.currentFavorites[i] == book_id) {
        fav = true;
        break;
      }
    }

    if (!fav) {
      for (var i = 0; i < bCtrl.currentBooks.length; i++) {
        if (bCtrl.currentBooks[i].book_id == book_id) {
          bCtrl.currentBooks[i].favorite = true;
        }
      }

      bookFactory.addFavorite(params).then(function(response) {});
    } else {
      for (var i = 0; i < bCtrl.currentBooks.length; i++) {
        if (bCtrl.currentBooks[i].book_id == book_id) {
          bCtrl.currentBooks[i].favorite = false;
        }
      }

      bookFactory.removeFavorite(params).then(function(response) {});
    }
  };

  bCtrl.titleFilter = function(filterType) {
    if (filterType == 1) {
      bCtrl.propertyName = 'title';
      bCtrl.reverse = false;
    } else {
      bCtrl.propertyName = 'title';
      bCtrl.reverse = true;
    }
  };

  bCtrl.scoreFilter = function(filterType) {
    if (filterType == 1) {
      bCtrl.propertyName = 'score';
      bCtrl.reverse = false;
    } else {
      bCtrl.propertyName = 'score';
      bCtrl.reverse = true;
    }
  };

  bCtrl.incrementScore = function(idx) {
    if (!bCtrl.currentBooks[idx].inc &&
        bCtrl.currentBooks[idx].score == 0) {
      bCtrl.currentBooks[idx].score++;
      bCtrl.currentBooks[idx].inc = true;
      bCtrl.currentBooks[idx].dec = false;
      bookFactory.changeScore({
          score: bCtrl.currentBooks[idx].score,
          book_id: bCtrl.currentBooks[idx].book_id
        });
    } else if (bCtrl.currentBooks[idx].dec &&
              !bCtrl.currentBooks[idx].inc) {
      bCtrl.currentBooks[idx].score = 0;
      bCtrl.currentBooks[idx].inc = false;
      bCtrl.currentBooks[idx].dec = false;
      bookFactory.changeScore({
          score: bCtrl.currentBooks[idx].score,
          book_id: bCtrl.currentBooks[idx].book_id
        });
    }
  };

  bCtrl.decrementScore = function(idx) {
    if (!bCtrl.currentBooks[idx].dec &&
        bCtrl.currentBooks[idx].score == 0) {
      bCtrl.currentBooks[idx].score--;
      bCtrl.currentBooks[idx].dec = true;
      bCtrl.currentBooks[idx].inc = false;
      bookFactory.changeScore({
          score: bCtrl.currentBooks[idx].score,
          book_id: bCtrl.currentBooks[idx].book_id
        });
    } else if (bCtrl.currentBooks[idx].inc &&
              !bCtrl.currentBooks[idx].dec) {
      bCtrl.currentBooks[idx].score = 0;
      bCtrl.currentBooks[idx].inc = false;
      bCtrl.currentBooks[idx].dec = false;
      bookFactory.changeScore({
          score: bCtrl.currentBooks[idx].score,
          book_id: bCtrl.currentBooks[idx].book_id
        });
    }
  };

  bCtrl.addBook = function() {
    var author_id = null;

    for (var i = 0; i < bCtrl.currentAuthors.length; i++) {
      if (bCtrl.currentAuthors[i].name == bCtrl.newAuthor) {
        author_id = bCtrl.currentAuthors[i].author_id;
        break;
      }
    }

    if (author_id != null) {

      var params = {
        author: author_id,
        title: bCtrl.newTitle,
        desc: bCtrl.newDescription
      };

      bookFactory.addBook(params).then(function(response) {
        bookFactory.getBooks().then(function(books) {
          bCtrl.currentBooks = [];
          for (var i = 0; i < books.data.data.length; i++) {
            var tmp = books.data.data[i];
            bCtrl.currentBooks.push({
              id: i,
              book_id: tmp.book_id,
              title: tmp.title,
              description: tmp.description,
              name: tmp.name,
              author_id: tmp.author_id,
              score: tmp.score,
              inc: false,
              dec: false,
              favorite: false
            });
          }

          bCtrl.newTitle = "";
          bCtrl.newAuthor = "";
          bCtrl.newDescription = "";

          $('form.collapse').collapse();
        });
      });
    } else {
      var params = {
        author: bCtrl.newAuthor,
        title: bCtrl.newTitle,
        desc: bCtrl.newDescription
      };

      bookFactory.addAuthor(params).then(function(response) {
        bookFactory.getBooks().then(function(books) {
          bCtrl.currentBooks = [];
          for (var i = 0; i < books.data.data.length; i++) {
            var tmp = books.data.data[i];
            bCtrl.currentBooks.push({
              id: i,
              book_id: tmp.book_id,
              title: tmp.title,
              description: tmp.description,
              name: tmp.name,
              author_id: tmp.author_id,
              score: tmp.score,
              inc: false,
              dec: false,
              favorite: false
            });
          }

          bCtrl.newTitle = "";
          bCtrl.newAuthor = "";
          bCtrl.newDescription = "";

          $('form.collapse').slideUp();
        });
      });
    }
  };

  bCtrl.modelOptions = {
    debounce: {
      default: 500,
      blur: 250
    },
    getterSetter: true
  };

}]);
