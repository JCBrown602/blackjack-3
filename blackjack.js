// Model
const model = {
  deck: [],
  playerHand: [],
  dealerHand: [],
  playerScore: 0,
  dealerScore: 0,
  playerTurn: true,
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
      console.log("Hearts");
    }
  },

  clearTable: function () {
    const playerHandElement = document.getElementById("player-hand");
    const dealerHandElement = document.getElementById("dealer-hand");
    const playerScoreElement = document.getElementById("player-score");
    const dealerScoreElement = document.getElementById("dealer-score");
    const messageArea = document.getElementById("message-area");
    playerHandElement.innerHTML = "";
    dealerHandElement.innerHTML = "";
    playerScoreElement.textContent = "";
    dealerScoreElement.textContent = "";
    messageArea.textContent = "Welcome to Blackjack!";
  },

  updateScores: function (playerScore, dealerScore) {
    const playerScoreElement = document.getElementById("player-score");
    const dealerScoreElement = document.getElementById("dealer-score");
    playerScoreElement.textContent = `Player Score: ${playerScore}`;
    dealerScoreElement.textContent = `Dealer Score: ${dealerScore}`;
  },
};

// Controller
const controller = {
  startGame: function () {

    enableBtns();

    checkBtns("\tStart game");
    model.playerTurn = true;
    model.deck = getShuffledDeck();
    checkBtns("\t getShuffleDeck");
    model.playerHand = [drawCard(), drawCard()];
    checkBtns("\t playerHand drawCard");
    model.dealerHand = [drawCard(), drawCard()];
    checkBtns("\t dealerHand drawCard");
    model.playerScore = this.calculateHandScore(model.playerHand);
    checkBtns("\t playerScore");
    model.dealerScore = this.calculateHandScore(model.dealerHand);
    checkBtns("\t dealerScore");

    view.clearTable();
    checkBtns("\t clearTable");
    this.checkGameStatus();
    checkBtns("\t checkGameStatus");
    this.displayHands();
    checkBtns("\t displayHands");
    this.displayScores();
    checkBtns("\t displayScores");
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
    view.updateScores(playerScore, dealerScore);
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
    this.checkGameStatus();
  },

  dealerTurn: function () {
    model.playerTurn = false;
    while (model.dealerScore < 17) {
      const card = drawCard();
      model.dealerHand.push(card);
      view.renderCard(card, "dealer-hand");
      model.dealerScore = this.calculateHandScore(model.dealerHand);
      this.displayScores();
      this.checkGameStatus();
    }

    if (model.dealerScore > 21) {
      view.displayMessage("Dealer busts! You win.");
    } else if (model.dealerScore >= 17 && model.dealerScore <= 21) {
      this.checkGameStatus();
    } else if (model.dealerScore === 17) {
      this.checkGameStatus();
    }
  },

  checkGameStatus: function () {
    const playerScore = model.playerScore;
    const dealerScore = model.dealerScore;

    if (playerScore > 21) {
      view.displayMessage("Bust! You lose.");
      disableBtns();
    } else if (dealerScore > 21) {
      view.displayMessage("Dealer busts! You win.");
      disableBtns();
    } else if (playerScore === 21 && dealerScore === 21) {
      view.displayMessage("It's a tie.");
      disableBtns();
    } else if (playerScore === 21) {
      view.displayMessage("Blackjack! You win.");
      disableBtns();
    } else if (dealerScore === 21) {
      view.displayMessage("Dealer has blackjack. You lose.");
      disableBtns();
    }
    
    if (model.playerTurn === false) {
      console.log("Toggle buttons true, disabled...");
      disableBtns();
      if (playerScore >= 17 && dealerScore >= 17) {
        if (playerScore > dealerScore) {
          view.displayMessage("You win.");
        } else if (playerScore < dealerScore) {
          view.displayMessage("Dealer wins.");
        } else {
          view.displayMessage("It's a tie.");
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