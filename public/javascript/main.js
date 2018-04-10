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
    return $http.get("/addFavorite", book_id);
  }

  bookFactory.removeFavorite = function(book_id) {
    return $http.get("/removeFavorite", book_id);
  }

  return bookFactory;
}])
.controller('bookController', ['$scope', 'bookFactory', function($scope, bookFactory) {
  $scope.currentBooks = [];
  $scope.currentFavorites = [];
  $scope.currentAuthors = [];
  $scope.propertyName = 'title';
  $scope.username = "";
  $scope.password = "";
  $scope.isLoggedIn = false;
  $scope.reverse = false;

  $scope.signup = function() {
    var user = {
      username: $scope.username,
      password: $scope.password
    };

    if (user.username != "" && user.password != "") {
      bookFactory.signup(user).then(function(response) {
        if (response.data.success) {
          $scope.username = "";
          $scope.password = "";
          $scope.isLoggedin = true;
          bookFactory.getFavorites().then(function(response) {
            console.log(response);
          });
        }
      });
    }
  };

  $scope.login = function() {
    var user = {
      username: $scope.username,
      password: $scope.password
    };

    if (user.username != "" && user.password != "") {
      bookFactory.login(user).then(function(response) {
        if (response.data.success) {
          $scope.username = "";
          $scope.password = "";
          $scope.isLoggedin = true;
          bookFactory.getFavorites().then(function(response) {
            console.log(response);
          });
        }
      });
    }
  };

  $scope.logout = function() {
    bookFactory.logout().then(function(response) {
      $scope.isLoggedin = false;
    });
  };

  $scope.toggleFavorite = function(book_id) {
    var favorite = false;
    var params = {
      book_id: book_id
    };

    for (var i = 0; i < $scope.currentFavorites.length; i++) {
      if ($scope.currentFavorites[i].book_id == book_id) {
        favorite = true;
      }
    }

    if (!favorite) {
      $("#h" + book_id).css("color", "red");
      bookFactory.addFavorite(params).then(function(response) {
        console.log(response);
      });
    } else {
      $("#h" + book_id).css("color", "black");
      bookFactory.removeFavorite(params).then(function(response) {
        console.log(response);
      });
    }
  };

  $scope.titleFilter = function(filterType) {
    if (filterType == 1) {
      $scope.propertyName = 'title';
      $scope.reverse = false;
    } else {
      $scope.propertyName = 'title';
      $scope.reverse = true;
    }
  };

  $scope.scoreFilter = function(filterType) {
    if (filterType == 1) {
      $scope.propertyName = 'score';
      $scope.reverse = false;
    } else {
      $scope.propertyName = 'score';
      $scope.reverse = true;
    }
  };

  $scope.incrementScore = function(idx) {
    if (!$scope.currentBooks[idx].inc &&
        $scope.currentBooks[idx].score == 0) {
      $scope.currentBooks[idx].score++;
      $scope.currentBooks[idx].inc = true;
      $scope.currentBooks[idx].dec = false;
      bookFactory.changeScore({
          score: $scope.currentBooks[idx].score,
          book_id: $scope.currentBooks[idx].book_id
        });
    } else if ($scope.currentBooks[idx].dec &&
              !$scope.currentBooks[idx].inc) {
      $scope.currentBooks[idx].score = 0;
      $scope.currentBooks[idx].inc = false;
      $scope.currentBooks[idx].dec = false;
      bookFactory.changeScore({
          score: $scope.currentBooks[idx].score,
          book_id: $scope.currentBooks[idx].book_id
        });
    }
  };

  $scope.decrementScore = function(idx) {
    if (!$scope.currentBooks[idx].dec &&
        $scope.currentBooks[idx].score == 0) {
      $scope.currentBooks[idx].score--;
      $scope.currentBooks[idx].dec = true;
      $scope.currentBooks[idx].inc = false;
      bookFactory.changeScore({
          score: $scope.currentBooks[idx].score,
          book_id: $scope.currentBooks[idx].book_id
        });
    } else if ($scope.currentBooks[idx].inc &&
              !$scope.currentBooks[idx].dec) {
      $scope.currentBooks[idx].score = 0;
      $scope.currentBooks[idx].inc = false;
      $scope.currentBooks[idx].dec = false;
      bookFactory.changeScore({
          score: $scope.currentBooks[idx].score,
          book_id: $scope.currentBooks[idx].book_id
        });
    }
  };

  bookFactory.getBooks().then(function(books) {
    for (var i = 0; i < books.data.data.length; i++) {
      var tmp = books.data.data[i];
      $scope.currentBooks.push({
        id: i,
        book_id: tmp.book_id,
        title: tmp.title,
        description: tmp.description,
        name: tmp.name,
        author_id: tmp.author_id,
        score: tmp.score,
        inc: false,
        dec: false
      });
    }
  });

  bookFactory.getAuthors().then(function(authors) {
    for (var i = 0; i < authors.data.data.length; i++) {
      var tmp = authors.data.data[i];
      $scope.currentAuthors.push({
        author_id: tmp.author_id,
        name: tmp.name
      });
    }
  });

  $scope.addBook = function() {
    var author_id = null;

    for (var i = 0; i < $scope.currentAuthors.length; i++) {
      if ($scope.currentAuthors[i].name == $scope.newAuthor) {
        author_id = $scope.currentAuthors[i].author_id;
        break;
      }
    }

    if (author_id != null) {

      var params = {
        author: author_id,
        title: $scope.newTitle,
        desc: $scope.newDescription
      };

      bookFactory.addBook(params).then(function(response) {
        bookFactory.getBooks().then(function(books) {
          $scope.currentBooks = [];
          for (var i = 0; i < books.data.data.length; i++) {
            var tmp = books.data.data[i];
            $scope.currentBooks.push({
              id: i,
              book_id: tmp.book_id,
              title: tmp.title,
              description: tmp.description,
              name: tmp.name,
              author_id: tmp.author_id,
              score: tmp.score,
              inc: false,
              dec: false
            });
          }

          $scope.newTitle = "";
          $scope.newAuthor = "";
          $scope.newDescription = "";

          $('form.collapse').collapse();
        });
      });
    } else {
      var params = {
        author: $scope.newAuthor,
        title: $scope.newTitle,
        desc: $scope.newDescription
      };

      bookFactory.addAuthor(params).then(function(response) {
        bookFactory.getBooks().then(function(books) {
          $scope.currentBooks = [];
          for (var i = 0; i < books.data.data.length; i++) {
            var tmp = books.data.data[i];
            $scope.currentBooks.push({
              id: i,
              book_id: tmp.book_id,
              title: tmp.title,
              description: tmp.description,
              name: tmp.name,
              author_id: tmp.author_id,
              score: tmp.score,
              inc: false,
              dec: false
            });
          }

          $scope.newTitle = "";
          $scope.newAuthor = "";
          $scope.newDescription = "";

          $('form.collapse').slideUp();
        });
      });
    }
  };

  $scope.modelOptions = {
    debounce: {
      default: 500,
      blur: 250
    },
    getterSetter: true
  };
}]);
