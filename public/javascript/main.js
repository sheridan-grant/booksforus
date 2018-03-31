angular.module('booksForUs', [])

.controller('bookViewer', [ '$scope', '$http', function($scope, $http) {
  $scope.currentBooks = [];

  $scope.propertyName = 'title';
  $scope.reverse = false;

  $http.get("/books")
    .then(function(books) {
      console.log(books);
      for (var i = 0; i < books.data.data.length; i++) {
        var tmp = books.data.data[i];
        $scope.currentBooks.push({
          title: tmp.title,
          description: tmp.description,
          name: tmp.name,
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
}]);
