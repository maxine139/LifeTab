function getWeather() {
    // Create a request variable and assign a new XMLHttpRequest object to it.
    var request = new XMLHttpRequest()
    var url = 'https://api.openweathermap.org/data/2.5/weather?q=Stockton,us&units=imperial&APPID=9318ad4220078fbc12c8d925a3487936'

    request.open('GET', url, true)

    request.onload = function () {
        var data = JSON.parse(this.response)

        if (request.status >= 200 && request.status < 400) {
            document.getElementById("weather_location").innerHTML = data.name;
            document.getElementById("current_temp").innerHTML = data.main.temp;
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

    request.open('GET', url, true)

    request.onload = function() {
        var data = JSON.parse(this.response)

        if (request.status >= 200 && request.status < 400)
        {
            day1min = data.list[2].main.temp_min
            day1max = data.list[2].main.temp_max
            day2min = data.list[10].main.temp_min
            day2max = data.list[10].main.temp_max
            day3min = data.list[18].main.temp_min
            day3max = data.list[18].main.temp_max
            console.log(data.city.name)
            console.log(data.list[2].main.temp_min)
            console.log(data.list[10].main.temp_min)
            console.log(data.list[18].main.temp_min)
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
        // document.getElementById("day_1_min").innerHTML = day1min
        // document.getElementById("day_1_max").innerHTML = day1max
        // document.getElementById("day_2_min").innerHTML = day2min
        // document.getElementById("day_2_max").innerHTML = day2max
        // document.getElementById("day_3_min").innerHTML = day3min
        // document.getElementById("day_3_max").innerHTML = day3max
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
