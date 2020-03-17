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
