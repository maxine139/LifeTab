var today

function getWeather() {
    // Create a request variable and assign a new XMLHttpRequest object to it.
    var request = new XMLHttpRequest()
    var url = 'https://api.openweathermap.org/data/2.5/weather?q=Stockton,us&units=imperial&APPID=9318ad4220078fbc12c8d925a3487936'

    request.open('GET', url, true)

    request.onload = function () {
        var data = JSON.parse(this.response)

        if (request.status >= 200 && request.status < 400) {
            var iconCode = data.weather[0].icon;
            var iconUrl = "http://openweathermap.org/img/w/" + iconCode + ".png";
            var dtCode = data.dt;
            today = new Date(dtCode*1000)

            document.getElementById("date").innerHTML = today.toLocaleDateString("en-US")
            document.getElementById("weather_location").innerHTML = data.name;
            document.getElementById("current_temp").innerHTML = data.main.temp;
            document.getElementById("weather-icon").src = iconUrl;

            console.log(data.name)
            console.log(data.main.temp)
        }
        else {
            console.log('error')
        }
    }
    request.send()
}

function initWeatherForecast() {
    var request = new XMLHttpRequest()
    var url = 'https://api.openweathermap.org/data/2.5/forecast?q=Stockton,us&units=imperial&APPID=9318ad4220078fbc12c8d925a3487936'
    var cityName = "Stockton"
    var day1min, day1max, day2min, day2max, day3min, day3max
    var icon1Url, icon2Url, icon3Url, tmrw, tmrw2, tmrw3

    request.open('GET', url, true)

    request.onload = function() {
        var data = JSON.parse(this.response)

        if (request.status >= 200 && request.status < 400)
        {
            var icon1Code = data.list[7].weather[0].icon;
            icon1Url = "http://openweathermap.org/img/w/" + icon1Code + ".png";
            var icon2Code = data.list[15].weather[0].icon;
            icon2Url = "http://openweathermap.org/img/w/" + icon2Code + ".png";
            var icon3Code = data.list[23].weather[0].icon;
            icon3Url = "http://openweathermap.org/img/w/" + icon3Code + ".png";
            tmrw = new Date()
            tmrw2 = new Date()
            tmrw3 = new Date()

            tmrw.setDate(today.getDate()+1)
            tmrw2.setDate(today.getDate()+2)
            tmrw3.setDate(today.getDate()+3)

            day1min = data.list[2].main.temp
            day1max = data.list[7].main.temp
            day2min = data.list[10].main.temp
            day2max = data.list[15].main.temp
            day3min = data.list[18].main.temp
            day3max = data.list[23].main.temp
        }
        else {
            console.log('error')
        }
    }
    request.send()

    var modal = document.getElementById('my_modal')
    const forecastButton = document.getElementById("forecast-button");
    var span = document.getElementsByClassName("close")[0]
    forecastButton.onclick = () => {
        modal.style.display="block"
        document.getElementById("day_1_min").innerHTML = day1min
        document.getElementById("day_1_max").innerHTML = day1max
        document.getElementById("day_2_min").innerHTML = day2min
        document.getElementById("day_2_max").innerHTML = day2max
        document.getElementById("day_3_min").innerHTML = day3min
        document.getElementById("day_3_max").innerHTML = day3max

        document.getElementById("tmrw_1").innerHTML = tmrw.toLocaleDateString("en-US")
        document.getElementById("tmrw_2").innerHTML = tmrw2.toLocaleDateString("en-US")
        document.getElementById("tmrw_3").innerHTML = tmrw3.toLocaleDateString("en-US")

        document.getElementById("weather_1_icon").src = icon1Url;
        document.getElementById("weather_2_icon").src = icon2Url;
        document.getElementById("weather_3_icon").src = icon3Url;


    }

    span.onclick = () => {
        modal.style.display = "none"
    }

    window.onclick = function(event) {
        if (event.target == modal)
        {
            modal.style.display = "none"
        }
    }
}
