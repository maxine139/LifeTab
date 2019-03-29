function getWeather() {
  /**
   * Grab weather from storage. If exists and not stale (less than 1 hour old)
   * use that data and update DOM. Else, fetch data from API.
   */
  chrome.storage.sync.get("weather", result => {
    const data = result["weather"];
    if (data == undefined || dataIsStale(data)) {
      // Data in storage is stale or does not exist
      fetchWeather();
    } else {
      setWeatherToDOM(data);
    }
  });
}

function dataIsStale(data) {
  /**
   * Data is stale when it is over 1 hour old.
   */
  const dataDateTimeString = data["lastUpdated"];
  const dataDateTime = new Date(dataDateTimeString);
  const currentDateTime = new Date();
  const timeDifferenceInMilliseconds = currentDateTime - dataDateTime;
  const timeDifferenceInHours = timeDifferenceInMilliseconds / 1000 / 60 / 60;
  return timeDifferenceInHours >= 1;
}

function setWeatherToDOM(data) {
  /**
   * Update DOM to reflect data that was passed in.
   */
  document.getElementById("weather_location").innerHTML = data["cityName"];
  document.getElementById("current_temp").innerHTML = data["currentTemp"];
}

function fetchWeather() {
  // Create a request variable and assign a new XMLHttpRequest object to it.
  var request = new XMLHttpRequest();
  var url =
    "https://api.openweathermap.org/data/2.5/weather?q=Stockton,us&units=imperial&APPID=9318ad4220078fbc12c8d925a3487936";

  request.open("GET", url, true);

  request.onload = function() {
    var data = JSON.parse(this.response);

    if (request.status >= 200 && request.status < 400) {
      // Parse data
      const cityName = data.name;
      const currentTemp = data.main.temp;
      const currentDateTime = new Date();

      // Store data in local storage
      const currentWeather = {
        cityName: cityName,
        currentTemp: currentTemp,
        lastUpdated: currentDateTime.toString()
      };
      chrome.storage.sync.set({ weather: currentWeather });

      // Display data in DOM
      setWeatherToDOM(currentWeather);
    } else {
      console.log("error");
    }
  };
  request.send();
}
