function getQuote() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      // Typical action to be performed when the document is ready:
      const response = JSON.parse(xhttp.response);
      console.log(response);
      const quote = response["contents"]["quotes"][0]["quote"];
      const author = response["contents"]["quotes"][0]["author"];
      document.getElementById("quote_text").innerHTML = quote;
      document.getElementById("quote_author").innerHTML = "~" + author;
      chrome.storage.sync.set({ quotes: { quote: quote, author: author } });
    }
  };
  xhttp.open("GET", "https://quotes.rest/qod?category=inspire", true);
  xhttp.send();
}
