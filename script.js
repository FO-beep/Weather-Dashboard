// API key: 5679159db9155b7abacb53ab679eaa75
//OpenWeatherMap
//Moment.js




var userPick;
var userInput = $(".card-body");


var userSearches = [];

//----------------- Local storage -searches made by user------------------------ //

function getItems() {
    var storedCities = JSON.parse(localStorage.getItem("userSearches"));
    if (storedCities !== null) {
        userSearches = storedCities;
    };

    for (i = 0; i < userSearches.length; i++) { //
        if (i == 8) {
            break;
        }
        //  Created links/buttons
        cityListButton = $("<a>").attr({
            class: "list-group-item list-group-item-action",
            href: "#"
        });
        cityListButton.text(userSearches[i]); //
        $(".searchedCities").append(cityListButton);
    }
};


// Function that calls the getItems
getItems();


// ------------------------Main Section --------------------//
function getData() {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + userPick + "&appid=5679159db9155b7abacb53ab679eaa75"
    userInput.empty();
    $("#forecast5").empty();
    // requests
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {

        // Icon Section-Displays icon based on the response gotten // 
        var date = moment().format(" MM/DD/YYYY");
        var iconCode = response.weather[0].icon;

        var iconURL = "http://openweathermap.org/img/w/" + iconCode + ".png";

        var name = $("<h3>").html(userPick + date);
        // Name, Icons displayed in the displayed section on card
        userInput.prepend(name);

        userInput.append($("<img>").attr("src", iconURL));
        // ---------------------- Conversion with the use of moment
        var windSpeed = response.wind.speed;
        userInput.append($("<p>").html("Wind Speed: " + windSpeed));

        var humidity = response.main.humidity;
        userInput.append($("<p>").html("Humidity: " + humidity));


        var temp = Math.round((response.main.temp - 273.15) * 1.80 + 32);
        userInput.append($("<p>").html("Temperature: " + temp + " &#8457"));

        var lat = response.coord.lat;
        var lon = response.coord.lon;
        //  UV Index request and required both longitude and latitude //
        $.ajax({
            url: "https://api.openweathermap.org/data/2.5/uvi?appid=5679159db9155b7abacb53ab679eaa75&lat=" + lat + "&lon=" + lon,
            method: "GET"

        }).then(function (response) {
            userInput.append($("<p>").html("UV Index: <span>" + response.value + "</span>"));

            if (response.value <= 2) {
                $("span").attr("class", "btn btn-outline-favorable");
            };

        })
        // Second  5-day (forecast) call
        $.ajax({
            url: "https://api.openweathermap.org/data/2.5/forecast?q=" + userPick + "&appid=5679159db9155b7abacb53ab679eaa75",
            method: "GET"
            // displays 5 separate columns from the forecast response
        }).then(function (response) {
            for (i = 0; i < 5; i++) {
                // Section where columns are created, icons, dates are displayed, ------//
                var refreshCard = $("<div>").attr("class", "col dayoffive rounded-lg p-2");
                $("#forecast5").append(refreshCard);

                var myDate = new Date(response.list[i * 8].dt * 1000); ///Date generated with the use of moment //
                refreshCard.append($("<h4>").html(myDate.toLocaleDateString()));

                var iconCode = response.list[i * 8].weather[0].icon;

                var iconURL = "http://openweathermap.org/img/w/" + iconCode + ".png";
                refreshCard.append($("<img>").attr("src", iconURL));

                var temp = Math.round((response.list[i * 8].main.temp - 273.15) * 1.80 + 32);

                refreshCard.append($("<p>").html("Temp: " + temp + " &#8457"));
                // creates a var for humity from the response
                var humidity = response.list[i * 8].main.humidity;
                // displays humidity
                refreshCard.append($("<p>").html("Humidity: " + humidity));
            }
        })
    })
};
// searches and adds to history
$("#searchCity").click(function () {
    userPick = $("#citiesValue").val();
    getData();
    var listedInputs = userSearches.includes(userPick);
    if (listedInputs == true) {
        return
    } else {
        userSearches.push(userPick);
        localStorage.setItem("userSearches", JSON.stringify(userSearches));
        var cityListButton = $("<a>").attr({
            class: "list-group-item list-group-item-action",
            href: "#"
        });
        userPickListButton.text(userPick);
        $(".searchedCities").append(userPickListButton);
    };
});
// listens for action on the history buttons
$(".list-group-item").click(function () {
    userPick = $(this).text();
    getData();
});