// User StoryPseudocode

//1. Declare 4 global variables.
//    1first variable keeps track of number of cards that .ave been pulled from deck. maybe : numCardsPulled
//    2.*actually an object* one for "player" holds entities cards, score
//    3."dealer's - holds cards and score
//    4.object that holds 2 functions- initialize the "deck of cards and one for shuffling deck. need to be initiated by player with a button 
//2. Create HTML elements (two <div>s) for the card decks:
//3. Deck 2(actually "player's hand where the cards go for player) should display an empty card outline.
//4. Deck 3("dealer's" hand) should display an empty card outline.
//5. Create cached element references for each of the card decks.
//6. Add an event listener for the "hit" & "stand" button.
//7. Write an initialization function that assigns 52 cards" to deck 1, then invoke it.
//8. Declare a render() function to display a card after it is flipped.
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
    setupInstructionsToggle(); 
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
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    console.log(deck);
}

function startGame() {
    // Dealer's first card (hidden) only shows back of card
    hidden = deck.pop();
    dealerSum += getValue(hidden);
    dealerAceCount += checkAce(hidden);
    
    // Dealer's second card
    let cardImg = document.createElement("img");
    let card = deck.pop();
    cardImg.src = "./cards/" + card + ".png";
    cardImg.alt = "Dealer's card " + card;
    cardImg.classList.add("card");
    cardImg.setAttribute("data-index", 1);
    dealerSum += getValue(card);
    dealerAceCount += checkAce(card);
    document.getElementById("dealer-cards").append(cardImg);
    console.log(`Dealer's visible card: ${card}, dealerSum: ${dealerSum}`);

    // Player's initial two cards
    for (let i = 0; i < 2; i++) {
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "./cards/" + card + ".png";
        cardImg.alt = "Your card " + card;
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

    const dealerHit = () => {
        if (dealerSum < 17) {
            let cardImg = document.createElement("img");
            let card = deck.pop(); // removes last card from deck which simulates drawing card from top
            cardImg.src = "./cards/" + card + ".png";
            cardImg.classList.add("card");
            dealerSum += getValue(card);
            dealerAceCount += checkAce(card);
            document.getElementById("dealer-cards").append(cardImg);
            dealerSum = reduceAce(dealerSum, dealerAceCount);
            
            setTimeout(dealerHit, 1000); // Delay of 1 second before next card is drawn
        } else {
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
            //Updates the displayed values for the sums and the result message
            document.getElementById("dealer-sum").innerText = dealerSum;
            document.getElementById("your-sum").innerText = yourSum;
            document.getElementById("results").innerText = message;
        }
    };

    dealerHit();
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

