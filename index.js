//1/30/2024
//Started at 4:33 PM, stopped at 5:50 PM, cont at 6:30 PM, stopped at 7:44 PM
//1/31/2024
//Started at 12:39 PM, stopped at 1:23 PM, cont at 3:00 PM, stopped at 4:25PM
/*****************************************************************************
 * Challenge 2: Review the provided code. The provided code includes:
 * -> Statements that import data from games.js
 * -> A function that deletes all child elements from a parent element in the DOM
*/

// import the JSON data about the crowd funded games from the games.js file
import GAMES_DATA from './games.js';

// create a list of objects to store the data about the games using JSON.parse
const GAMES_JSON = JSON.parse(GAMES_DATA)

// remove all child elements from a parent element in the DOM
function deleteChildElements(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

/*****************************************************************************
 * Challenge 3: Add data about each game as a card to the games-container
 * Skills used: DOM manipulation, for loops, template literals, functions
*/

// grab the element with the id games-container
const gamesContainer = document.getElementById("games-container");

// create a function that adds all data from the games array to the page
function addGamesToPage(games) {
    sort(games);
    // loop over each item in the data
    for (let i = 0; i < games.length; ++i){
        const game = games[i];
        // create a new div element, which will become the game card
        let newDiv  = document.createElement('div');

        // add the class game-card to the list
        newDiv.classList.add("game-card");
        window.setTimeout(() => newDiv.classList.add('list-element'), 50 * i);
        // set the inner HTML using a template literal to display some info 
        // about each game
        // TIP: if your images are not displaying, make sure there is space
        // between the end of the src attribute and the end of the tag ("/>")
        const info = `
            <img 
                class = "game-img"
                src = ${game.img} 
            />
            <div class = "game-title"> 
                <h1>${game.name}</h1> 
            </div>
            
            <div class = "game-desc"> 
                ${game.description} 
            </div>

            <div class = "game-progress"> 
                $${game.pledged.toLocaleString('en-US')}/${game.goal.toLocaleString('en-US')} 
                collected (${Math.round((game.pledged/game.goal) * 10000) / 100}%)
            </div>

            <div class = "game-backers"> 
                Backed by ${game.backers} ${game.backers == 1? "user" : "users"}
            </div>
        `;

        newDiv.innerHTML = info;

        // append the game to the games-container
        gamesContainer?.append(newDiv);
    }
}

// call the function we just defined using the correct variable
// later, we'll call this function using a different list of games
//addGamesToPage(GAMES_JSON); -left here for the sake of challenge

/*************************************************************************************
 * Challenge 4: Create the summary statistics at the top of the page displaying the
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: arrow functions, reduce, template literals
*/

// grab the contributions card element
const contributionsCard = document.getElementById("num-contributions");

// use reduce() to count the number of total contributions by summing the backers
const totalContributions = GAMES_JSON.reduce((total, game) => {
    return total + game.backers;
}, 0);

// set the inner HTML using a template literal and toLocaleString to get a number with commas
if (contributionsCard) contributionsCard.innerHTML = `
    <div>
        ${totalContributions.toLocaleString('en-US')}
    </div>
`;

// grab the amount raised card, then use reduce() to find the total amount raised
const raisedCard = document.getElementById("total-raised");
const totalRaised = GAMES_JSON.reduce((total, game) => {
    return total + game.pledged;
}, 0);

// set inner HTML using template literal
if (raisedCard) raisedCard.innerHTML = `
    <div>
        $${totalRaised.toLocaleString('en-US')}
    </div>
`;

// grab number of games card and set its inner HTML
const gamesCard = document.getElementById("num-games");

if (gamesCard) gamesCard.innerHTML = `
    <div>
        ${GAMES_JSON.length.toLocaleString('en-US')}
    </div>
`;

/*************************************************************************************
 * Challenge 5: Add functions to filter the funded and unfunded games
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: functions, filter
*/

// select each button in the "Our Games" section
const unfundedBtn = document.getElementById("unfunded-btn");
const fundedBtn = document.getElementById("funded-btn");
const allBtn = document.getElementById("all-btn");
const sortOptions = document.getElementById("sort-select");

// for sorting purposes
let gamesList = GAMES_JSON;

// show only games that do not yet have enough funding
function filterUnfundedOnly() {
    deleteChildElements(gamesContainer);

    // use filter() to get a list of games that have not yet met their goal
    const unfundedOnly = GAMES_JSON.filter((game) => game.pledged < game.goal);
    gamesList = unfundedOnly;
    // use the function we previously created to add the unfunded games to the DOM
    addGamesToPage(unfundedOnly);

    unfundedBtn?.classList.add("selected-button");
    fundedBtn?.classList.remove("selected-button");
    allBtn?.classList.remove("selected-button");
}

// show only games that are fully funded
function filterFundedOnly() {
    deleteChildElements(gamesContainer);

    // use filter() to get a list of games that have met or exceeded their goal
    const fundedOnly = GAMES_JSON.filter((game) => game.pledged >= game.goal);
    gamesList = fundedOnly;
    // use the function we previously created to add unfunded games to the DOM
    addGamesToPage(fundedOnly);

    fundedBtn?.classList.add("selected-button");
    unfundedBtn?.classList.remove("selected-button");
    allBtn?.classList.remove("selected-button");
}

// show all games
function showAllGames() {
    deleteChildElements(gamesContainer);
    gamesList = GAMES_JSON;
    // add all games from the JSON data to the DOM
    addGamesToPage(GAMES_JSON);

    allBtn?.classList.add("selected-button");
    unfundedBtn?.classList.remove("selected-button");
    fundedBtn?.classList.remove("selected-button");
}

// decides what sort to use
function sort(array){
    switch(sortOptions?.value){
        //A -> Z
        case "A->Z": 
            array = array.sort((a, b) => a.name > b.name? 1 : -1);
            break;
        case "Z->A":
            array = array.sort((a, b) => a.name > b.name? -1 : 1);
            break;
        case "MostRaised":
            array = array.sort((a, b) => a.pledged > b.pledged? -1 : 1);
            break;
        case "LeastRaised":
            array = array.sort((a, b) => a.pledged > b.pledged? 1 : -1);
            break;
        case "MostBacked":
            array = array.sort((a, b) => a.backers > b.backers? -1 : 1);
            break;
        case "LeastBacked":
            array = array.sort((a, b) => a.backers > b.backers? 1 : -1);
            break;
        case "MostCompleted":
            array = array.sort((a, b) => a.pledged/a.goal > b.pledged/b.goal? -1 : 1);
            break;
        case "LeastCompleted":
            array = array.sort((a, b) => a.pledged/a.goal > b.pledged/b.goal? 1 : -1);
            break;
    }
}


// add event listeners with the correct functions to each button
unfundedBtn?.addEventListener("click", filterUnfundedOnly);
fundedBtn?.addEventListener("click", filterFundedOnly);
allBtn?.addEventListener("click", showAllGames);
sortOptions?.addEventListener("change", () => {
    sort(gamesList);
    deleteChildElements(gamesContainer);
    addGamesToPage(gamesList);
});

showAllGames();

/*************************************************************************************
 * Challenge 6: Add more information at the top of the page about the company.
 * Skills used: template literals, ternary operator
*/

// grab the description container
const descriptionContainer = document.getElementById("description-container");

// use filter or reduce to count the number of unfunded games
const unfundedNumber = GAMES_JSON.reduce((acc, game) => {
    return acc + (game.pledged < game.goal? 1 : 0);
}, 0);

// create a string that explains the number of unfunded games using the ternary operator
const displayStr = `A total of $${totalRaised.toLocaleString('en-US')} has been raised for 
    ${GAMES_JSON.length.toLocaleString('en-US')} games. 
    ${unfundedNumber > 0? 
        //If there are any unfunded games
        `Currently, ${unfundedNumber.toLocaleString('en-US')} 
        ${unfundedNumber == 1? "game" : "games"} ${unfundedNumber == 1? "remains" : "remain"} unfunded.
        We need your help to fund ${unfundedNumber == 1? "this" : "these"} amazing ${unfundedNumber == 1? "game" : "games"}!`
        //If there are no unfunded games
        : "All games were funded successfully! Thank you for your support!"}
`;

// create a new DOM element containing the template string and append it to the description container
const descriptionDiv = document.createElement('div');
descriptionDiv.innerHTML = displayStr;
descriptionContainer?.append(descriptionDiv);


/************************************************************************************
 * Challenge 7: Select & display the top 2 games
 * Skills used: spread operator, destructuring, template literals, sort 
 */

const firstGameContainer = document.getElementById("first-game");
const secondGameContainer = document.getElementById("second-game");

const sortedGames =  GAMES_JSON.sort( (item1, item2) => {
    return item2.pledged - item1.pledged;
});

// use destructuring and the spread operator to grab the first and second games
const [first, second, ...rest] = sortedGames;

// create a new element to hold the name of the top pledge game, then append it to the correct element
const fdiv = document.createElement('div');
fdiv.classList.add('top-game-title')
fdiv.innerHTML = first.name;
firstGameContainer?.append(fdiv);

// do the same for the runner up item
const sdiv = document.createElement('div');
sdiv.classList.add('top-game-title')
sdiv.innerHTML = second.name;
secondGameContainer?.append(sdiv);