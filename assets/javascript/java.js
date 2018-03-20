// Initialize Firebase
var config = {
    apiKey: "AIzaSyDFxvI2pF2TVAL8YxlTKiIJsA3zAT8wT1I",
    authDomain: "dinetime-c2874.firebaseapp.com",
    databaseURL: "https://dinetime-c2874.firebaseio.com",
    projectId: "dinetime-c2874",
    storageBucket: "",
    messagingSenderId: "647476940046"
    };
    firebase.initializeApp(config);
    var database = firebase.database();
    
// Food Search
$("#search-food").on("click", function (event) {
    event.preventDefault();
    var food = $("#food-input").val().trim();
    if (food !== "") {
        $("#food-input").val("")
        foodSearch(food);
    }

})  // End of $("#search-food").on("click", function (event) {}


// Drink Search
$("#search-drink").on("click", function (event) {
    event.preventDefault();

    var drink = $("#drink-input").val().trim();
    if (drink !== "") {
        $("#drink-input").val("")
        drinkSearch(drink);
    }
    

})  // End of $("#search-food").on("click", function (event) {}


// Food search function
function foodSearch(food) {
    var API_KEY = "fb001d1c57dffa88545ebe6f986046e9	";
    var APP_ID = "5f782d14";
    var queryURL = "https://api.edamam.com/search?app_id=" + APP_ID + "&app_key=" + API_KEY + "&q=" + food;

    $.ajax({
        url: queryURL,
        method: 'GET',
    }).then(function (response) {
        $("#food-drink-view").empty();

        for (var i = 0; i < response.hits.length; i++) {
            var imageDiv = $('<div>');
            imageDiv.addClass('imgClass');

            var image = $("<img>");
            image.attr("src", response.hits[i].recipe.image);
            imageDiv.append(image);

            var pOne = $("<p>").text("Label: " + response.hits[i].recipe.label);
            imageDiv.append(pOne);

            var pTwo = $("<p>").text("Ingredient: " + response.hits[i].recipe.ingredientLines);
            imageDiv.append(pTwo);

            var pThree = $("<p>").text("Calories: " + response.hits[i].recipe.calories);
            imageDiv.append(pThree);

            var pFour = $("<p>").text("Total Weight: " + response.hits[i].recipe.totalWeight);
            imageDiv.append(pFour);

            $("#food-drink-view").prepend(imageDiv);
        }


    })

}   //  End of function foodSearch(food){}



// Drink search function
function drinkSearch(drink) {
    var queryURL = "https://www.thecocktaildb.com/api/json/v1/1/search.php?s=" + drink;

    // API response function
    $.ajax({
        url: queryURL,
        method: 'GET',
    }).then(function (response) {
        $("#food-drink-view").empty();

        for (var i = 0; i < response.drinks.length; i++) {
            
            var drinkObj = response.drinks[i]
            var drinkName = drinkObj.strDrink
            var ingredients = [];
            var measurements = [];

            for (var j = 9; j < 23; j++) {
                var ingredient = drinkObj[Object.keys(drinkObj)[j]];
                var measurement = drinkObj[Object.keys(drinkObj)[j + 16]];
                if (ingredient !== "") {

                    ingredients.push(ingredient)
                    measurements.push(measurement);
                    console.log(ingredient, measurement)
                }    

            }
            database.ref().push( {
                drink: drinkName,
                ID: drinkObj.idDrink,
                type: drinkObj.strAlcoholic,
                ingredients: ingredients,
                measurements: measurements,
                picture: drinkObj.strDrinkThumb,
                instructions: drinkObj.strInstructions,
            });
        }

    })  // End of the response function

}   //  End of function foodSearch(food){}

database.ref().on("child_added", function(snapshot) {
    console.log([Object.keys(snapshot.val())[1]]);
    if ([Object.keys(snapshot.val())[1]] == "drink") {
        console.log('test')
        var imageDiv = $('<div>');
        imageDiv.addClass('imgClass');

        // Make an image div
        var image = $("<img>");
        image.attr("src", snapshot.val().picture);
        imageDiv.append(image);
        var pOne = $("<p>").text("Drink-ID: " + snapshot.val().ID);
        imageDiv.append(pOne);
        var pTwo = $("<p>").text("Drink Label: " + snapshot.val().drink);
        imageDiv.append(pTwo);
        var pThree = $("<p>").text("Alcohol: " + snapshot.val().type);
        imageDiv.append(pThree);
        var ingredients = snapshot.val().ingredients;
        var measurements = snapshot.val().measurements;
        var recipe = $("<div>");
        recipe.attr("id", "recipe");
        for (let i = 0; i < ingredients.length; i++) {
            $(recipe).append(measurements[i] + " " + ingredients[i] + ", ");  
        }
        imageDiv.append(recipe);
        var pFive = $("<p>").text("Instruction: " + snapshot.val().instructions);
        imageDiv.append(pFive);
        $("#food-drink-view").prepend(imageDiv);
    }
})
