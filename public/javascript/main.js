angular.module('booksForUs', ['ui.bootstrap'])
.factory('bookFactory', ['$http', function($http) {

  var bookFactory = {};

  bookFactory.addBook = function(book) {
    return $http.post("/addBook", book);
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

  return bookFactory;
}])
.controller('bookController', ['$scope', 'bookFactory', function($scope, bookFactory) {
  $scope.currentBooks = [];
  $scope.currentAuthors = [];
  $scope.propertyName = 'title';
  $scope.reverse = false;

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
    if (!$scope.currentBooks[idx].inc) {
      $scope.currentBooks[idx].score++;
      $scope.currentBooks[idx].inc = !$scope.currentBooks[idx].inc;
      $scope.currentBooks[idx].dec = false;
    } else if ($scope.currentBooks[idx].dec &&
              !$scope.currentBooks[idx].inc) {
      $scope.currentBooks[idx].score = 0;
      $scope.currentBooks[idx].inc = false;
      $scope.currentBooks[idx].dec = false;
    }
  }

  $scope.decrementScore = function(idx) {
    if (!$scope.currentBooks[idx].dec) {
      $scope.currentBooks[idx].score--;
      $scope.currentBooks[idx].dec = !$scope.dec;
      $scope.currentBooks[idx].inc = false;
    } else if ($scope.currentBooks[idx].inc &&
              !$scope.currentBooks[idx].dec) {
      $scope.currentBooks[idx].score = 0;
      $scope.currentBooks[idx].inc = false;
      $scope.currentBooks[idx].dec = false;
    }
  }

  bookFactory.getBooks().then(function(books) {
    for (var i = 0; i < books.data.data.length; i++) {
      var tmp = books.data.data[i];
      $scope.currentBooks.push({
        book_id: tmp.book_id,
        title: tmp.title,
        description: tmp.description,
        name: tmp.name,
        author_id: tmp.author_id,
        score: tmp.score,
        inc = false;
        dec = false;
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
      if ($scope.currentAuthors[i].name = $scope.newAuthor) {
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
              book_id: tmp.book_id,
              title: tmp.title,
              description: tmp.description,
              name: tmp.name,
              author_id: tmp.author_id,
              score: tmp.score
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
