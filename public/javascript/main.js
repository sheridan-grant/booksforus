(function () {

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
          var json = JSON.parse(this.responseText);

          console.log(json);
     }
  };
  xhttp.open("GET", "/books", true);
  xhttp.send();
})();
