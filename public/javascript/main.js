angular.module('booksForUs', ['ui.bootstrap'])
.controller('bookViewer', ['$scope', '$http', function($scope, $http) {
  $scope.currentBooks = [];
  $scope.currentAuthors = [];

  $scope.propertyName = 'title';
  $scope.reverse = false;

  $http.get("/authors")
    .then(function(authors) {
      console.log(authors);
      for (var i = 0; i < authors.data.data.length; i++) {
        var tmp = authors.data.data[i];
        $scope.currentAuthors.push({
          author_id: tmp.author_id,
          name: tmp.name
        });
      }
    });

  $http.get("/books")
    .then(function(books) {
      console.log(books);
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
    });

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
.controller('addingBooks', ['$scope', '$http', function($scope, $http) {

  $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";

  $scope.currentBooks = [];
  $scope.currentAuthors = [];

  $http.get("/authors")
    .then(function(authors) {
      for (var i = 0; i < authors.data.data.length; i++) {
        var tmp = authors.data.data[i];
        $scope.currentAuthors.push({
          author_id: tmp.author_id,
          name: tmp.name
        });
      }
    });

  $http.get("/books")
    .then(function(books) {
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
      $http({
        url: "/addBook",
        method: "POST",
        params: {
          author: author_id,
          title: $scope.newTitle,
          desc: $scope.newDescription
        }
      }).then(function(response) {
        console.log(response);
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
