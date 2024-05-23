let dealerSum = 0;
let yourSum = 0;
let dealerAceCount = 0;
let yourAceCount = 0;
let hidden;
let deck;
let canHit = true; //allows player to "hit" while yourSum <= 21

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
    for (let i = 0; i < deck.length; i++) { // loops over each element in deck array, starting at 0 incremeting by 1 until deck length -1
        let j = Math.floor(Math.random() * deck.length); // Math.random gives a number from 0-1 * 52 (# of cards) => (0-51.9999) (math.floor rounds the number)
        [deck[i], deck[j]] = [deck[j], deck[i]]; //de-structuring the array to swap the elements to simulate a shuffling algorithm.
    }
    // console.log(deck);
}

function startGame() {
    // Dealer's first card (hidden) only shows back of card
    hidden = deck.pop();
    dealerSum += getValue(hidden);
    dealerAceCount += checkAce(hidden);
    
    // Dealer's second card
    let cardImg = document.createElement("img");//creates element for new card image(new card coming)//
    let card = deck.pop(); //pops out card from the end simulating drawing card from top//
    cardImg.src = "./cards/" + card + ".png";
    cardImg.alt = "Dealer's card " + card;
    cardImg.classList.add("card"); //adding class named "card" to cardImg for the animation
    cardImg.setAttribute("data-index", 1);//numbers the cards by giving data index of 1 or 2
    dealerSum += getValue(card);
    dealerAceCount += checkAce(card);
    document.getElementById("dealer-cards").append(cardImg);
    // console.log(`Dealer's visible card: ${card}, dealerSum: ${dealerSum}`);

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

    // console.log(`Your initial sum: ${yourSum}`);
    
    if (yourSum === 21) {
        canHit = false;
        document.getElementById("results").innerText = "Blackjack! You win!";
    }

    document.getElementById("hit").addEventListener("click", hit);
    document.getElementById("stay").addEventListener("click", stay);
    document.getElementById("reset").addEventListener("click", resetGame); 
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
            
            setTimeout(dealerHit, 1000); // 1 second delay before next card
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
    // Reset everything shown
    dealerSum = 0;
    yourSum = 0;
    dealerAceCount = 0;
    yourAceCount = 0;

    // Clears  the elements for a reset
    document.getElementById("dealer-cards").innerHTML = '<img id="hidden" src="./cards/BACK.png" class="card">';
    document.getElementById("your-cards").innerHTML = '';
    document.getElementById("dealer-sum").innerText = '';
    document.getElementById("your-sum").innerText = '';
    document.getElementById("results").innerText = '';

    // Reset  from false again
    canHit = true;

    // Rebuilds and shuffles deck for a fresh start
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