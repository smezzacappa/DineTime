console.log('test');
function getDrink() {
    var userDrink = 'mint julep'
    var queryURL = "https://www.thecocktaildb.com/api/json/v1/1/search.php?s=" + userDrink;

    $.ajax({
        method: 'GET',
        url: queryURL,
    }).then(function(response) {
        console.log(response);
        
    })
}
getDrink();
