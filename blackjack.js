// Model
const model = {
  deck: [],
  playerHand: [],
  dealerHand: [],
  playerScore: 0,
  dealerScore: 0,
  playerTurn: true,
  playerCash: 1000, // Initial amount to get started
  playerBet: 0,
};

// View
const view = {
  displayMessage: function (message) {
    const messageArea = document.getElementById("message-area");
    messageArea.textContent = message;
  },

  renderCard: function (card, elementId) {
    const cardElement = document.createElement("div");
    cardElement.className = "card";
    cardElement.textContent = card;
    document.getElementById(elementId).appendChild(cardElement);
    if (card.includes("♥") || card.includes("♦")) {
      cardElement.style.color = "red";
    }
  },

  clearTable: function () {
    const playerH2Element = document.getElementById("player-h2");
    const playerCashElement = document.getElementById("player-cash");
    const messageArea = document.getElementById("message-area");
    const playerHandElement = document.getElementById("player-hand");
    const dealerHandElement = document.getElementById("dealer-hand");

    playerH2Element.innerHTML = "Player Hand:";
    playerCashElement.textContent = JSON.stringify(model.playerCash);
    playerHandElement.textContent = "";
    dealerHandElement.textContent = "";

    messageArea.textContent = "Welcome to Blackjack!";
  },

  updateScores: function (playerScore, dealerScore, playerCash) {
    // const playerScoreElement = document.getElementById("player-score");
    // const dealerScoreElement = document.getElementById("dealer-score");
    // playerScoreElement.textContent = `Player Score: ${playerScore}`;
    // dealerScoreElement.textContent = `Dealer Score: ${dealerScore}`;

    const playerH2Element = document.getElementById("player-h2");
    const dealerH2Element = document.getElementById("dealer-h2");
    // const playerCashOnHand = playerCash;
    playerH2Element.textContent = `Player Hand: ${playerScore}, $${JSON.stringify(playerCash)}`;
    dealerH2Element.textContent = `Dealer Hand: ${dealerScore}`;
  },
};

// Controller
const controller = {
  startGame: function () {

    enableBtns();

    checkCash("startGame");

    //checkBtns("\tStart game");
    model.playerTurn = true;
    model.deck = getShuffledDeck();
    //checkBtns("\t getShuffleDeck");
    model.playerHand = [drawCard(), drawCard()];
    //checkBtns("\t playerHand drawCard");
    model.dealerHand = [drawCard(), drawCard()];
    //checkBtns("\t dealerHand drawCard");
    model.playerScore = this.calculateHandScore(model.playerHand);
    //checkBtns("\t playerScore");
    model.dealerScore = this.calculateHandScore(model.dealerHand);
    //checkBtns("\t dealerScore");

    view.clearTable();
    //checkBtns("\t clearTable");
    this.checkGameStatus(model.playerBet);
    //checkBtns("\t checkGameStatus");
    this.displayHands();
    //checkBtns("\t displayHands");
    this.displayScores();
    //checkBtns("\t displayScores");
  },

  displayHands: function () {
    const playerHand = model.playerHand;
    const dealerHand = model.dealerHand;

    for (let card of playerHand) {
      view.renderCard(card, "player-hand");
    }

    for (let card of dealerHand) {
      view.renderCard(card, "dealer-hand");
    }
  },

  displayScores: function () {
    const playerScore = model.playerScore;
    const dealerScore = model.dealerScore;
    const playerCash = model.playerCash;
    view.updateScores(playerScore, dealerScore, playerCash);
  },

  calculateHandScore: function (hand) {
    let score = 0;
    let hasAce = false;

    for (let card of hand) {
      const rank = card.slice(0, -1);

      if (rank === "A") {
        hasAce = true;
        score += 11;
      } else if (["K", "Q", "J"].includes(rank)) {
        score += 10;
      } else {
        score += parseInt(rank, 10);
      }
    }

    if (hasAce && score > 21) {
      score -= 10;
    }

    return score;
  },

  dealCardToPlayer: function () {
    const card = drawCard();
    model.playerHand.push(card);
    view.renderCard(card, "player-hand");
    model.playerScore = this.calculateHandScore(model.playerHand);
    this.displayScores();
    this.checkGameStatus(model.playerBet);
  },

  dealerTurn: function () {
    model.playerTurn = false;
    while (model.dealerScore < 17) {
      const card = drawCard();
      model.dealerHand.push(card);
      view.renderCard(card, "dealer-hand");
      model.dealerScore = this.calculateHandScore(model.dealerHand);
      this.displayScores();
      checkCash("dealerTurn dealerScore < 17");
      this.checkGameStatus(model.playerBet);
    }

    if (model.dealerScore > 21) {
      view.displayMessage("Dealer busts! You win.");
      this.calculatePayout(model.playerBet * 2); // Player wins double the bet amount
    } else if (model.dealerScore >= 17 && model.dealerScore <= 21) {
      checkCash("dealerTurn dealerScore >= 17 but <= 21");
      this.checkGameStatus(model.playerBet);
    } else if (model.dealerScore === 17) {
      checkCash("dealerTurn dealerScore === 17");
      this.checkGameStatus(model.playerBet);
    }
  },

  placeBet: function (amount) {
    model.playerCash -= amount;
    model.playerBet = amount;
  },

  calculatePayout: function (amount) {
    console.log(`////// player cash: ${model.playerCash} += amount: ${amount}`)
    model.playerCash += amount;
    // model.playerBet = 0;
  },

  checkGameStatus: function (amount) {
    const playerScore = model.playerScore;
    const dealerScore = model.dealerScore;

    checkCash("CHECK GAME STATUS FUNCTION");

    if (playerScore > 21) {
      view.displayMessage("Bust! You lose.");
      disableBtns();
      this.calculatePayout(0); // Player loses the bet
    } else if (dealerScore > 21) {
      view.displayMessage("Dealer busts! You win.");
      disableBtns();
      this.calculatePayout(amount * 2); // Player wins double the bet amount
    } else if (playerScore === 21 && dealerScore === 21) {
      view.displayMessage("It's a tie.");
      disableBtns();
      this.calculatePayout(amount); // Player gets back the bet amount
    } else if (playerScore === 21) {
      view.displayMessage("Blackjack! You win.");
      disableBtns();
      this.calculatePayout(amount * 2); // Player wins double the bet amount
    } else if (dealerScore === 21) {
      view.displayMessage("Dealer has blackjack. You lose.");
      disableBtns();
      this.calculatePayout(0); // Player loses the bet
    }
    
    if (model.playerTurn === false) {
      // console.log("Toggle buttons true, disabled...");
      disableBtns();
      if (dealerScore >= 17) {
        if (playerScore > dealerScore) {
          view.displayMessage("You win.");
          checkCash("CheckGameStatus/playerturn === false, I win");
          this.calculatePayout(amount * 2); // Player wins double the bet amount
        } else if (playerScore < dealerScore) {
          view.displayMessage("Dealer wins.");
          checkCash("CheckGameStatus/playerturn === false, dealer wins");
          this.calculatePayout(0); // Player loses the bet
        } else {
          view.displayMessage("It's a tie.");
          checkCash("CheckGameStatus/playerturn === false, tie");
          this.calculatePayout(amount); // Player gets back the bet amount
        }
      }
    }
  },
};

// Helper functions
function checkBtns(msg) {
  let btn = document.getElementById("hit-button");
  if (btn.disabled) {
    console.log(`HIT BUTTON IS DISABLED! @${msg}`);
  } else {
    console.log(`hit button is NOT disabled! @${msg}`);
  }
}
function checkCash(msg) {
  console.log(`Player cash is $${model.playerCash} in ${msg}`);
}

function disableBtns() {
    document.getElementById("hit-button").disabled = true;
    document.getElementById("stand-button").disabled = true;
  } 
  
function enableBtns() {
    document.getElementById("hit-button").disabled = false;
    document.getElementById("stand-button").disabled = false;
  }

function getShuffledDeck() {
  const suits = ["♠", "♣", "♥", "♦"];
  const ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
  const deck = [];

  for (let suit of suits) {
    for (let rank of ranks) {
      deck.push(rank + suit);
    }
  }

  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  return deck;
}

function drawCard() {
  return model.deck.pop();
}

// Start the game
document.getElementById("start-button").addEventListener("click", function () {
  controller.startGame();
});

document.getElementById("hit-button").addEventListener("click", function () {
  controller.dealCardToPlayer();
});

document.getElementById("stand-button").addEventListener("click", function () {
  // document.getElementById("hit-button").disabled = true;
  // document.getElementById("stand-button").disabled = true;
  controller.dealerTurn();
});

// Bet buttons event listeners
document.getElementById("bet-10").addEventListener("click", function () {
  controller.placeBet(10);
});

document.getElementById("bet-50").addEventListener("click", function () {
  controller.placeBet(50);
});

document.getElementById("bet-100").addEventListener("click", function () {
  controller.placeBet(100);
});

document.getElementById("bet-500").addEventListener("click", function () {
  controller.placeBet(500);
});