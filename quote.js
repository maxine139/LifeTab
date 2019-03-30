function getQuote() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      const response = JSON.parse(xhttp.response);
      const response_quote = response["contents"]["quotes"][0]["quote"];

      // format author text
      let response_author = response["contents"]["quotes"][0]["author"];
      response_author =
        response_author == null ? "~ Unknown" : `~ ${response_author}`;

      // update html
      document.getElementById("quote_text").innerHTML = response_quote;
      document.getElementById("quote_author").innerHTML = response_author;
    }
  };
  xhttp.open("GET", "https://quotes.rest/qod?category=inspire", true);
  xhttp.send();
}
