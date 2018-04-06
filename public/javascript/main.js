angular.module('booksForUs', ['ui.bootstrap'])
.factory('bookFactory', ['$http', function($http) {
  var bookFactory = {};

  bookFactory.addBook = function(book) {

  };

  bookFactory.getBooks = function() {
    var currentBooks = [];
    $http.get("/books")
      .then(function(books) {
        for (var i = 0; i < books.data.data.length; i++) {
          var tmp = books.data.data[i];
          currentBooks.push({
            book_id: tmp.book_id,
            title: tmp.title,
            description: tmp.description,
            name: tmp.name,
            author_id: tmp.author_id,
            score: tmp.score
          });
        }

        return currentBooks;
      });
  };

  bookFactory.getAuthors = function() {
    var currentAuthors = [];
    $http.get("/authors")
      .then(function(authors) {
        for (var i = 0; i < authors.data.data.length; i++) {
          var tmp = authors.data.data[i];
          currentAuthors.push({
            author_id: tmp.author_id,
            name: tmp.name
          });
        }

        return currentAuthors;
      });
  };

  return bookFactory;
}])
.controller('bookViewer', ['$scope', 'bookFactory', function($scope, bookFactory) {
  $scope.currentBooks = bookFactory.getBooks();
  $scope.currentAuthors = bookFactory.getAuthors();

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
}])
.controller('addingBooks', ['$scope', 'bookFactory', function($scope, bookFactory) {
  $scope.currentBooks = bookFactory.getBooks();
  $scope.currentAuthors = bookFactory.getAuthors();

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

      $.post("/addBook", params, function(response) {
          $scope.newTitle = "";
          $scope.newAuthor = "";
          $scope.newDescription = "";

          $('#add-book-collapse.collapse').collapse();
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
