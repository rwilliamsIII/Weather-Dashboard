var currentDate = moment().format("MMM Do YYYY, h:mm:ss a");
console.log(currentDate);

var apiKey = "b03435d2b43059ea11fb5360dc72b23b";
var submitCity = $("#submit-city");
var citySearches = $("#searchResults");
var currentWeather = $("#currentWeather");
var fiveDay = $("#fiveDay");
var searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
var city = "" || searchHistory[0];
loadFiveDayForecast(loadCurrentWeather(city));

function loadHistory(){
    for (var i = 0; i < searchHistory.length; i++){
        var historyDiv = $("<div>");
        historyDiv.text(searchHistory[i]);
        historyDiv.addClass("list-grouped-item");
        historyDiv.addClass("saved-city");
        historyDiv.attr("data-city", searchHistory[i]);
        historyDiv.appendTo(citySearches);
    }
}

function getMoreWeather (city){
    var queryURL3 = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + apiKey + "&units=imperial"

    $.ajax({
        url: queryURL3,
        method: "GET"
    })
    .then(function(forecastData){
        console.log(forecastData);
        fiveDay.empty();
        
        for (var h = 0; h < forecastData.list.length; h++){
            if (forecastData.list[h].dt_txt.indexOf("00:00:00") !== -1){
                fiveDayFarenheight = Math.floor(forecastData.list[h].main.temp);

                var fiveDayDate = moment(new Date(forecastData.list[h].dt_txt).toLocaleString()).format("LL");

                var card = $("<div class='card bg-info border-light'>");
                var cardBody = $("<div class='card-body>");

                var cardIcon = $("<img class='images' src='https://openweathermap.org/img/wn/' + forecastData.list[h].weather[0].icon + '@2px.png'/>")
                cardIcon.appendTo(cardBody);
                $("<p class='card-text'>").text(fiveDayDate).appendTo(cardBody);
                $("<p class='card-text'>").text("Temp. (F): " + fiveDayFarenheight).appendTo(cardBody);
                $("<p class='card-text'>").text("Humidity: " + forecastData.list[h].main.humidity + "%").appendTo(cardBody);

                card.append(cardBody);
                fiveDay.append(card);
            }
        }
    });
}

function getCurrentWeather(city){
    var cityInput = city || $('#cityInput').val().trim();

    if (cityInput !== ""){
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityInput + "&appid=" + APIKey;

        $.ajax({
            url: queryURL,
            method: "GET"
        })
        .then(function(weatherData){
            currentWeather.empty();
            $("#icon").empty();

            var farenheightTemp = Math.floor((weatherData.main.temp - 273.15) * 1.8 + 32);
            var feelsLikeTemp = Math.floor((weatherData.main.feels_like - 273.15) * 1.8 + 32);

            var imgIcon = $("<img>");
            imgIcon.attr("class", "image");
            imgIcon.attr("src", "https://openweathermap.org/img/wn/" + weatherData.weather[0].icon + "@2x.png");

            $("#icon").append(imgIcon);
            $("<h2 class='weather-title'>").text("Current Weather: ").appendTo(currentWeather);
            $("<h3>").text(weatherData.name + "," + currentDate).appendTo(currentWeather);
            $("<h3>").text("Current Temperature (F): " + farenheightTemp).appendTo(currentWeather);
            $("<h3>").text("Feels Like: " + feelsLikeTemp).appendTo(currentWeather);
            $("<h3>").text("Humidity: " + weatherData.main.humidity + "%");
            $("<h3>").text("Wind Speed: " + weatherData.wind.speed + "mph");

            var lat = weatherData.coord.lat;
            var lon = weatherData.coord.lon;

            var queryURL2 = "https://api.openweathermap.org/data/2.5/uvi?appid=" + APIKey + "&lat=" + lat + "&lon=" + lon;

            $.ajax({
                url: queryURL2,
                method: "GET"
            })
            .then(function(moreData){

                $("<h3 id=' + city + '>").text("UV Index: " + moreData.value).appendTo(currentWeather);

                if (moreData.value <= 2){
                    $("#" + city).addClass("green");
                }
                else if (moreData.value <= 5){
                    $("#" + city).addClass("yellow");
                }
                else if (moreData.value <= 7){
                    $("#" + city).addClass("orange");
                }
                else if (moreData.value <= 10){
                    $("#" + city).addClass("red");
                }
                else if (moreData.value > 10){
                    $("#" + city).addClass("purple");
                }
            });

        getMoreWeather(cityInput);
            
        });
    }
}

submitCity.on("click", function(event){
    event.preventDefault();
    var cityHistoryDiv = $("<div>");
    var cityInput = $("#cityInput").val().trim();

    if (cityInput !== ""){

        cityHistoryDiv.attr("data-city", cityInput);
        cityHistoryDiv.addClass("saved-city");
        cityHistoryDiv.addClass("list-group-item");
        cityHistoryDiv.text(cityInput);

        searchHistory.unshift(cityInput);

        localStorage.setItem("searchHistory", JSON.stringify(searchHistory));

        cityHistoryDiv.prependTo(citySearches);
    }
    getCurrentWeather();
    $("#cityInput").val("");
});

$(document).on("click", ".saved-city", function(){
    var city = $(this).attr("data-city");

    getCurrentWeather(city);
})

$(document).ready(function(){
    loadHistory();
});