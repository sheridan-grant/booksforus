angular.module('booksForUs', [])

.controller('bookViewer', [ '$scope', '$http', function($scope, $http) {
  $scope.currentBooks = [];

  $http.get("/books")
    .then(function(books) {
      console.log(books);
      for (var i = 0; i < books.data.length; i++) {
        var tmp = books.data[i];
        $scope.currentBooks.push({
          title: tmp.title,
          description: tmp.description,
          name: tmp.name,
          score: tmp.score
        });
      }
    });
}]);
