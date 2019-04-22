const dayStrings = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];

function getWeather() {
  /**
   * Grab weather from storage. If exists and not stale (less than 1 hour old)
   * use that data and update DOM. Else, fetch data from API.
   */
  chrome.storage.sync.get("weather", result => {
    const data = result["weather"];
    fetchForecast();
    if (data == undefined || dataIsStale(data)) {
      // Data in storage is stale or does not exist
      fetchWeather();
    } else {
      setWeatherToDOM(data);
    }
  });

  setInterval(loadDateTime, 1000);
}

function loadDateTime() {
  // Set datetime to DOM
  const currentDate = new Date();
  const currentDateTime = currentDate.toLocaleString();
  const currentDay = dayStrings[currentDate.getDay()];

  document.getElementById("current_time").innerHTML = currentDateTime;
  document.getElementById("current_day").innerHTML = currentDay;
}

function dataIsStale(data) {
  /**
   * Data is stale when it is over 1 hour old or if force_fetch is true.
   */

  if (data["force_fetch"]) {
    data["force_fetch"] = false;
    chrome.storage.sync.set(data);
    return true;
  }
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
  document.getElementById("current_temp").innerHTML =
    data["currentTemp"] + "&deg; F";
  document.getElementById("weather-icon").src = data["iconUrl"];
}

function updateWeather() {
  chrome.storage.sync.get("weather", results => {
    results["weather"]["force_fetch"] = true;
    chrome.storage.sync.set(results, () => getWeather());
  });
}

function fetchWeather() {
  // Create a request variable and assign a new XMLHttpRequest object to it.
  var request = new XMLHttpRequest();

  chrome.storage.sync.get("settings", results => {
    console.log("fetching weather");
    const city = results["settings"]["location"] || "Stockton";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city},us&units=imperial&APPID=9318ad4220078fbc12c8d925a3487936`;
    request.open("GET", url, true);
    request.onload = function() {
      var data = JSON.parse(this.response);

      if (request.status >= 200 && request.status < 400) {
        // Parse data
        const cityName = data.name;
        const currentTemp = data.main.temp.toFixed(0);
        const iconCode = data.weather[0].icon;
        const iconUrl = "http://openweathermap.org/img/w/" + iconCode + ".png";

        const currentDateTime = new Date();

        // Store data in local storage
        const currentWeather = {
          cityName: cityName,
          currentTemp: currentTemp,
          lastUpdated: currentDateTime.toString(),
          iconUrl: iconUrl,
          force_fetch: false
        };
        chrome.storage.sync.set({ weather: currentWeather });

        // Display data in DOM
        setWeatherToDOM(currentWeather);

        //   initWeatherForecast();
      } else {
        console.log("error");
      }
    };
    request.send();
  });
}

function fetchForecast() {
  var request = new XMLHttpRequest();

  chrome.storage.sync.get("settings", results => {
    console.log("fetching forecast");
    const city = results["settings"]["location"] || "Stockton";
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city},us&units=imperial&APPID=9318ad4220078fbc12c8d925a3487936`;
    var cityName = "Stockton";
    var day1min, day1max, day2min, day2max, day3min, day3max;
    var icon1Url, icon2Url, icon3Url, tmrw, tmrw2, tmrw3;

    request.open("GET", url, true);

    request.onload = function() {
      var data = JSON.parse(this.response);

      if (request.status >= 200 && request.status < 400) {
        var icon1Code = data.list[7].weather[0].icon;
        icon1Url = "http://openweathermap.org/img/w/" + icon1Code + ".png";
        var icon2Code = data.list[15].weather[0].icon;
        icon2Url = "http://openweathermap.org/img/w/" + icon2Code + ".png";
        var icon3Code = data.list[23].weather[0].icon;
        icon3Url = "http://openweathermap.org/img/w/" + icon3Code + ".png";
        tmrw = new Date();
        tmrw2 = new Date();
        tmrw3 = new Date();
        today = new Date(data.list[0].dt * 1000);
        console.log(today);
        tmrw.setDate(today.getDate() + 1);
        tmrw2.setDate(today.getDate() + 2);
        tmrw3.setDate(today.getDate() + 3);

        day1min = data.list[2].main.temp.toFixed(0);;
        day1max = data.list[7].main.temp.toFixed(0);;
        day2min = data.list[10].main.temp.toFixed(0);;
        day2max = data.list[15].main.temp.toFixed(0);;
        day3min = data.list[18].main.temp.toFixed(0);;
        day3max = data.list[23].main.temp.toFixed(0);;
      } else {
        console.log("error");
      }
    };
    request.send();

    var modal = document.getElementById("my_modal");
    const forecastButton = document.getElementById("forecast-button");
    var span = document.getElementsByClassName("close")[0];
    forecastButton.onclick = () => {
      modal.style.display = "block";
      document.getElementById("day_1_min").innerHTML = day1min;
      document.getElementById("day_1_max").innerHTML = day1max;
      document.getElementById("day_2_min").innerHTML = day2min;
      document.getElementById("day_2_max").innerHTML = day2max;
      document.getElementById("day_3_min").innerHTML = day3min;
      document.getElementById("day_3_max").innerHTML = day3max;

      document.getElementById("tmrw_1").innerHTML = tmrw.toLocaleDateString(
        "en-US"
      );
      document.getElementById("tmrw_2").innerHTML = tmrw2.toLocaleDateString(
        "en-US"
      );
      document.getElementById("tmrw_3").innerHTML = tmrw3.toLocaleDateString(
        "en-US"
      );

      document.getElementById("weather_1_icon").src = icon1Url;
      document.getElementById("weather_2_icon").src = icon2Url;
      document.getElementById("weather_3_icon").src = icon3Url;
    };

    span.onclick = () => {
      modal.style.display = "none";
    };

    window.onclick = function(event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    };
  });
}
