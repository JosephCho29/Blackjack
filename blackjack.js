// User StoryPseudocode

//1. Declare 4 global variables.
//    1first variable keeps track of number of cards that .ave been pulled from deck. maybe : numCardsPulled
//    2.*actually an object* one for "player" holds entities cards, score
//    3."dealer's - holds cards and score
//    4.object that holds 2 functions- initialize the "deck of cards and one for shuffling deck. need to be initiated by player with a button 
//2. Create HTML elements (two <div>s) for the card decks:
//1. Deck 1(dealer's deck) should display the back of a card with a shadow outline, indicating a larger stack.
//2. Deck 2(actually "player's hand where the cards go for player) should display an empty card outline.
//3. Deck 3("dealer's" hand) should display an empty card outline.
//3. Create cached element references for each of the card decks.
//4. Add an event listener for the "hit" & "stand" button.
//5. Write an initialization function that assigns 52 cards" to deck 1, then invoke it.
//6. Declare a render() function to display a card after it is flipped.
//7. Stub up a handleClick() function for the event listener to call.
//1. Select a random card from deck 1.
//2. Remove the card from deck 1.
//3. Add the card to deck 2 or 3.
//4. Call the render() function and pass the card to it.
//8. Within the render() function (situated above handleClick()):
//1. After the first card is picked, remove the outline on deck 2.
// 2. Add the class name to display the card picked on deck 2 or 3.


// **if possible add a bet and new game/reset feature

// **if possible want to add multiple decks

// **if possible add a split option?
let dealerSum = 0;
let yourSum = 0;

let dealerAceCount = 0;
let yourAceCount = 0;

let hidden;
let deck;

let canHit = true; //allows the player (you) to draw while yourSum <= 21

window.onload = function() {
    buildDeck();
    shuffleDeck();
    startGame();
    setupInstructionsToggle(); // Add this line
}

function buildDeck() {
    let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    let types = ["C", "D", "H", "S"];
    deck = [];

    for (let i = 0; i < types.length; i++) {
        for (let j = 0; j < values.length; j++) {
            deck.push(values[j] + "-" + types[i]); //A-C -> K-C, A-D -> K-D
        }
    }
}

function shuffleDeck() {
    for (let i = 0; i < deck.length; i++) {
        let j = Math.floor(Math.random() * deck.length); // (0-1) * 52 => (0-51.9999)
        let temp = deck[i];
        deck[i] = deck[j];
        deck[j] = temp;
    }
    console.log(deck);
}

function startGame() {
    // Dealer's first card (hidden)
    hidden = deck.pop();
    dealerSum += getValue(hidden);
    dealerAceCount += checkAce(hidden);
    
    // Dealer's second card
    let cardImg1 = document.createElement("img");
    let card1 = deck.pop();
    cardImg1.src = "./cards/" + card1 + ".png";
    cardImg1.classList.add("card");
    cardImg1.setAttribute("data-index", 1);
    dealerSum += getValue(card1);
    dealerAceCount += checkAce(card1);
    document.getElementById("dealer-cards").append(cardImg1);
    console.log(`Dealer's visible card: ${card1}, dealerSum: ${dealerSum}`);

    // Player's initial two cards
    for (let i = 0; i < 2; i++) {
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "./cards/" + card + ".png";
        cardImg.classList.add("card");
        cardImg.setAttribute("data-index", i + 1);
        yourSum += getValue(card);
        yourAceCount += checkAce(card);
        document.getElementById("your-cards").append(cardImg);
    }

    console.log(`Your initial sum: ${yourSum}`);
    
    if (yourSum === 21) {
        canHit = false;
        document.getElementById("results").innerText = "Blackjack! You win!";
    }

    document.getElementById("hit").addEventListener("click", hit);
    document.getElementById("stay").addEventListener("click", stay);
    document.getElementById("reset").addEventListener("click", resetGame); // Add this line
}

function hit() {
    if (!canHit) {
        return;
    }

    let cardImg = document.createElement("img");
    let card = deck.pop();
    cardImg.src = "./cards/" + card + ".png";
    cardImg.classList.add("card");
    cardImg.setAttribute("data-index", document.getElementById("your-cards").children.length + 1);
    yourSum += getValue(card);
    yourAceCount += checkAce(card);
    document.getElementById("your-cards").append(cardImg);

    if (yourSum === 21) {
        canHit = false;
        document.getElementById("results").innerText = "Blackjack! You win!";
        return;
    }

    if (reduceAce(yourSum, yourAceCount) > 21) { //A, J, 8 -> 1 + 10 + 8
        canHit = false;
        document.getElementById("results").innerText = "Bust! You lose!";
    }
}

function stay() {
    canHit = false;
    document.getElementById("hidden").src = "./cards/" + hidden + ".png";

    dealerSum = reduceAce(dealerSum, dealerAceCount);
    yourSum = reduceAce(yourSum, yourAceCount);

    while (dealerSum < 17) {
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "./cards/" + card + ".png";
        cardImg.classList.add("card");
        dealerSum += getValue(card);
        dealerAceCount += checkAce(card);
        document.getElementById("dealer-cards").append(cardImg);
        dealerSum = reduceAce(dealerSum, dealerAceCount);
    }

    let message = "";
    if (yourSum > 21) {
        message = "Bust! You lose!";
    }
    else if (dealerSum > 21) {
        message = "You win!";
    }
    else if (yourSum == dealerSum) {
        message = "Tie!";
    }
    else if (yourSum > dealerSum) {
        message = "You Win!";
    }
    else if (yourSum < dealerSum) {
        message = "You Lose!";
    }

    document.getElementById("dealer-sum").innerText = dealerSum;
    document.getElementById("your-sum").innerText = yourSum;
    document.getElementById("results").innerText = message;
}

function getValue(card) {
    let data = card.split("-"); // "4-C" -> ["4", "C"]
    let value = data[0];

    if (isNaN(value)) { //A J Q K
        if (value == "A") {
            return 11;
        }
        return 10;
    }
    return parseInt(value);
}

function checkAce(card) {
    if (card[0] == "A") {
        return 1;
    }
    return 0;
}

function reduceAce(playerSum, playerAceCount) {
    while (playerSum > 21 && playerAceCount > 0) {
        playerSum -= 10;
        playerAceCount -= 1;
    }
    return playerSum;
}

function resetGame() {
    // Reset sums and ace counts
    dealerSum = 0;
    yourSum = 0;
    dealerAceCount = 0;
    yourAceCount = 0;

    // Clear the UI elements
    document.getElementById("dealer-cards").innerHTML = '<img id="hidden" src="./cards/BACK.png" class="card">';
    document.getElementById("your-cards").innerHTML = '';
    document.getElementById("dealer-sum").innerText = '';
    document.getElementById("your-sum").innerText = '';
    document.getElementById("results").innerText = '';

    // Reset canHit
    canHit = true;

    // Rebuild and shuffle the deck
    buildDeck();
    shuffleDeck();

    // Restart the game
    startGame();
}

function setupInstructionsToggle() {
    const instructionsBtn = document.getElementById("instructions-btn");
    const instructionsDiv = document.getElementById("instructions");

    instructionsBtn.addEventListener("click", () => {
        if (instructionsDiv.classList.contains("expanded")) {
            instructionsDiv.classList.remove("expanded");
        } else {
            instructionsDiv.classList.add("expanded");
        }
    });
}
