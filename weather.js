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
