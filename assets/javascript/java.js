
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

// function getSelectionType() {
    
// }
console.log('test');

function getDrink() {
    var userDrink = $("#drink-input").val().trim();
    var queryURL = "https://www.thecocktaildb.com/api/json/v1/1/search.php?s=" + userDrink;
    console.log(userDrink);

    $.ajax({
        method: 'GET',
        url: queryURL,
    }).then(function(response) {
        var drinkObj = response.drinks[0]
        console.log(drinkObj);
        var ingredients = [];
        for (let i = 9; i < 23; i++) {
            var ingredient = drinkObj[Object.keys(drinkObj)[i]];
            if (ingredient !== "") {
                ingredients.push(ingredient);  
            }     
        }
        var measurements = [];
        for (let i = 24; i < (ingredients.length + 24); i++){
            measurements.push(drinkObj[Object.keys(drinkObj)[i]])  
        }
        var drinkName = response.drinks[0].strDrink;
        var recipe = [];
        database.ref().push( {
            drink: drinkName,
            ingredients: ingredients,
            measurements: measurements,
            picture: drinkObj.strDrinkThumb,
        });

        console.log(measurements);
    })
}
getDrink();

database.ref().on("child_added", function(snapshot) {
    var drinkDisplay = $("<div>");
    drinkDisplay.attr({
        "id": "drinkDisplay",
    })
    var ingredients = snapshot.val().ingredients;
    var measurements = snapshot.val().measurements;
    var recipe = $("<ul>");
    recipe.attr("id", "recipe");
    for (let i = 0; i < ingredients.length; i++) {
        var recipeItem = $("<li>");
        $(recipeItem).text(ingredients[i] + ": " + measurements[i]);
        $(recipe).append(recipeItem);  
    }
    var picture = $("<img>");
    picture.attr({
        "src": snapshot.val().picture,
        'id': "drinkPic",
    });
    var drink = $("<h4>");
    drink.text(snapshot.val().drink);
    $(drinkDisplay).append(drink);
    $(drinkDisplay).append(recipe);
    $(drinkDisplay).append(picture);
    $("body").append(drinkDisplay);

});
