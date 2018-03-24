(function () {

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
          var json = JSON.parse(this.responseText);

          var html = "";

          for (var i = 0; i < json.data.length; i++) {
            var tmp = json.data[i];
            html += "<div class=\"card\">" +
                          "<div class=\"card-body\">" +
                            "<h5 class=\"card-title\">" + tmp.title + "</h5>" +
                            "<p class=\"card-text\">" + tmp.description + "</p>" +
                          "</div>" +
                          "<ul class=\"list-group list-group-flush\">" +
                            "<li class=\"list-group-item\">" + tmp.author_id + "</li>" +
                            "<li class=\"list-group-item\">" +
                              "Score:" +
                              "<span class=\"score\">" + tmp.score + "</span>" +
                              "<span class=\"score-vote glyphicon glyphicon-thumbs-up\"></span>" +
                              "<span class=\"score-vote glyphicon glyphicon-thumbs-down\"></span>" +
                            "</li>" +
                          "</ul>" +
                        "</div>";
          }

          var resultsDiv = document.getElementById('results');
          resultsDiv.innerHTML = html;
     }
  };
  xhttp.open("GET", "/books", true);
  xhttp.send();
})();
