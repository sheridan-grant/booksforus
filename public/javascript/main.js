angular.module('booksForUs', [])
.controller('bookViewer', ['$scope', '$http', function($scope, $http) {
  $scope.currentBooks = [];

  $scope.propertyName = 'title';
  $scope.reverse = false;

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
  $scope.addBook = function() {

    console.log($scope.newName + ' - ' + $scope.newAuthor + ' - ' + $scope.newDescription);
  };
}]);
