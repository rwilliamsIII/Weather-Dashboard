// moment js to get current date and time
var currentDate = moment().format("MMM Do YYYY, h:mm:ss a");
console.log(currentDate);

// global variables for ajax call and adding content to page
var apiKey = "b03435d2b43059ea11fb5360dc72b23b";
var submitCity = $("#submit-city");
var cityHistory = $("#searchResults");
var currentWeather = $("#currentWeather");
var fiveDay = $("#fiveDay");
var searchHistory = JSON.parse(localStorage.getItem("searchHistory"));


// function to print search results to page using local storage
function loadResults(){
    for(var i = 0; i < searchHistory.length; i++) {
        var resultsDiv = $("<div>");
        resultsDiv.text(searchHistory[i]);
        resultsDiv.attr("data-city", searchHistory[i]);
        resultsDiv.addClass("searched-city");
        resultsDiv.prependTo(cityHistory);
    }
}

function loadForecast(city){

    var queryUrl = "http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&cnt=5&appid=" + apiKey + "&units=imperial"
    console.log(queryUrl)

    $.ajax({
        url: queryUrl,
        method: "GET"
    })

    .then(function(forecastData){
        console.log(forecastData);

        for(var i = 0; i < forecastData.list.length; i++){
            var farenheitTemp = Math.floor((forecastData.list.main.temp - 273.15) * 1.8 + 32);
            var feelsLike = Math.floor((forecastData.list.main.feels_like - 273.15) * 1.8 + 32);

            $("<h3>").text("Date: " + forecastData.list.dt).appendTo(fiveDay)
            $("<h3>").text("Current Temperature (F): " + farenheitTemp).appendTo(fiveDay)
            $("<h3>").text("Feels like: " + feelsLike).appendTo(fiveDay)
            $("<h3>").text("Humidity: " + forecastData.list.main.humidity + "%").appendTo(fiveDay)
            $("<h3>").text("Wind Speed: " + forecastData.list.wind.speed + "mph").appendTo(fiveDay)
        }
    })
};