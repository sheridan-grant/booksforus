angular.module('booksForUs', [])

.controller('bookViewer', [ '$scope', '$http', function($scope, $http) {
  $scope.currentBooks = [];
  $scope.titleAcsend = false;
  $scope.titleDesend = false;
  $scope.scoreAcsend = false;
  $scope.scoreDesend = false;

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
      $scope.titleAcsend = true;
      $scope.titleDesend = false;
    } else {
      $scope.titleAcsend = false;
      $scope.titleDesend = true;
    }
  }

  $scope.scoreFilter = function(filterType) {
    if (filterType == 1) {
      $scope.scoreAcsend = true;
      $scope.scoreDesend = false;
    } else {
      $scope.scoreAcsend = false;
      $scope.scoreDesend = true;
    }
  }

  $scope.filterBooksBy = function() {
    var sortingParams = [];

    if ($scope.titleAcsend) {
      sortingParams.push('title');
    } else if ($scope.titleDesend) {
      sortingParams.push('-title');
    }

    if ($scope.scoreAcsend) {
      sortingParams.push('title');
    } else if ($scope.scoreDesend) {
      sortingParams.push('-title');
    }

    return sortingParams;
  }
}]);
