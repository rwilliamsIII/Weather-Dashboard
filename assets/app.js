// moment js to get current date and time
var currentDate = moment().format("MMM Do YYYY, h:mm:ss a");
console.log(currentDate);

// global variables for ajax call and adding content to page
var apiKey = "b03435d2b43059ea11fb5360dc72b23b";
var submitCity = $("#submit-city");
var userCity;
var cityHistory = $("#searchResults");
var currentWeather = $("#currentWeather");
var fiveDay = $("#fiveDay");
var searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
var city = "" || searchHistory[0];
loadFiveDayForecast(loadCurrentWeather(city));

// created function to load search history

function loadSearchHistory(){
    for(var i = 0; i < searchHistory.length; i++){
        var previousCities = $("<div>");
        previousCities.text(searchHistory[i]);
        previousCities.addClass("list-group-item");
        previousCities.attr("data-city", searchHistory[i]);
        previousCities.addClass("saved-city");
        previousCities.appendTo(cityHistory);
    }
}

// created function for 5 day forecast

function loadFiveDayForecast(city){
    var userCity = $("#desiredCity").val().trim();
    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + userCity + "&appid=" + apiKey + "&units=imperial"

    $.ajax({
        url: queryURL,
        method: "GET"
    })

    .then(function (forecastData) {
        fiveDay.empty();
      for(var j = 0; j < forecastData.list.length; j++) {
          if(forecastData.list[j].dt_txt.indexOf("00:00:00") !== -1) {
              var farenheightTemp = Math.floor((forecastData.list[j].main.temp));

            //   formatting date and time for 5 day forecast
              var fiveDayDate = moment(new Date(forecastData.list[j].dt_txt).toLocaleDateString()).format("LL");

            //   creating cards for 5 Day and appending to page
            var card = $("<div class='card'>");
            var cardBody = $("<div class='card-body'>");
            var cardImg = $("<img class='image' src='https://openweathermap.org/img/wn/'>" + forecastData.list[j].weather[0].icon);
            cardImg.appendTo(cardBody);
            $("<p class='card-text'>").text(fiveDayDate).appendTo(cardBody);
            $("<p class= 'card-text'>").text("Temperature (F): " + farenheightTemp).appendTo(cardBody);
            $("<p class= 'card-text'>").text("Humidity: " + forecastData.list[j].main.humidity + "%").appendTo(cardBody);

            card.append(cardBody);

            fiveDay.append(card);
          }
      }
    })
};

function loadCurrentWeather(city) {
    
    var userCity = $("#desiredCity").val().trim();
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + userCity + "&appid=" + apiKey;

    $.ajax({
        url: queryURL,
        method: "GET"
    })

    .then(function(weatherData) {

        // setting variables for temp conversion from Kelvin to Farenheight
        var farenheightTemp = Math.floor((weatherData.main.temp - 273.15) * 1.8 + 32);
        var feelsLikeTemp = Math.floor((weatherData.main.feels_like - 273.15) * 1.8 + 32);

        // adding Weather Icons
        var weatherIcon = $("<img>");
        weatherIcon.attr("class", "image");
        weatherIcon.attr("src", "https://openweathermap.org/img/wn/" + weatherData.weather[0].icon + "@2px.png");

        currentWeather.empty();
        $("#weatherIcon").empty();

        $("#weatherIcon").append(weatherIcon)
        $("<h3>").text("City: " + weatherData.name).appendTo(currentWeather)
        $("<h3>").text("Date: " + currentDate).appendTo(currentWeather)
        $("<h3>").text("Current Temperature (F): " + farenheightTemp).appendTo(currentWeather)
        $("<h3>").text("Feels Like: " + feelsLikeTemp).appendTo(currentWeather)
        $("<h3>").text("Humidity: " + weatherData.main.humidity + "%").appendTo(currentWeather)
        $("<h3>").text("Wind Speed: " + weatherData.wind.speed + "MPH").appendTo(currentWeather)

        var latitude = weatherData.coord.lat;
        var longitude = weatherData.coord.lon;
        var queryURL2 = "https://api.openweathermap.org/data/2.5/uvi?appid=" + apiKey + "&lat=" + latitude + "&lon=" + longitude;

        $.ajax({
            url: queryURL2,
            method: "GET"
        })

        .then(function(moreData) {
            $("<h3 id = ' + city + '>").text("UV Index: " + moreData.value).appendTo(currentWeather);

            if(moreData.value <= 2) {
                $('#' + city).addClass("green");
            }
            else if(moreData.value <= 5) {
                $('#' + city).addClass("yellow");
            }
            else if(moreData.value <= 7) {
                $('#' + city).addClass("orange");
            }
            else if(moreData.value <= 10) {
                $('#' + city).addClass("red");
            }
            else if(moreData.value > 10) {
                $('#' + city).addClass("purple");
            }

        });

        loadFiveDayForecast(userCity);
    });
};


submitCity.on("click", function(event){
    event.preventDefault();
    var newDiv = $("<div>");
    var userCity = $("#desiredCity").val().trim();

    newDiv.text(userCity);
    newDiv.attr("data-city", userCity);
    newDiv.addClass("saved-city");
    newDiv.addClass("list-group-item")

    searchHistory.unshift(userCity);

    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));

    newDiv.prependTo(cityHistory)

    loadCurrentWeather();
    $("#cityInput").val("");
});

$(document).on("click", ".saved-city", function(){
    var city = $(this).attr("data-city")
    loadCurrentWeather(city)
})

// pulls up search history when page loads
$(document).ready(function(){
    loadSearchHistory();

});

