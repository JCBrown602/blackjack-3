// Model
const model = {
  deck: [],
  playerHand: [],
  dealerHand: [],
  playerScore: 0,
  dealerScore: 0,
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
    console.log(card);
  },

  clearTable: function () {
    const playerHandElement = document.getElementById("player-hand");
    const dealerHandElement = document.getElementById("dealer-hand");
    const playerHandH2 = document.getElementById("player-h2");
    const dealerHandH2 = document.getElementById("dealer-h2");
    playerHandElement.innerHTML = "";
    dealerHandElement.innerHTML = "";
    playerHandH2.innerHTML = "Player: ";
    dealerHandH2.innerHTML = "Dealer: ";
  },

  updateScores: function (playerScore, dealerScore) {
    const playerHandH2 = document.getElementById("player-h2");
    const dealerHandH2 = document.getElementById("dealer-h2");
    playerHandH2.textContent = `Player Hand: ${playerScore}`;
    dealerHandH2.textContent = `Dealer Hand: ${dealerScore}`;
  },
};

// Controller
const controller = {
  startGame: function () {
    model.deck = getShuffledDeck();
    model.playerHand = [drawCard(), drawCard()];
    model.dealerHand = [drawCard(), drawCard()];
    model.playerScore = this.calculateHandScore(model.playerHand);
    model.dealerScore = this.calculateHandScore(model.dealerHand);

    view.clearTable();
    view.displayMessage("Welcome to Blackjack!");
    this.checkGameStatus();
    this.displayHands();
    this.calculateScores();

    document.getElementById("hit-button").disabled = false;
    document.getElementById("stand-button").disabled = false;
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

  calculateScores: function () {
    const playerScore = this.calculateHandScore(model.playerHand);
    const dealerScore = this.calculateHandScore(model.dealerHand);
    view.updateScores(playerScore, dealerScore);
  },

  displayScores: function () {
    const playerScore = model.playerScore;
    const dealerScore = model.dealerScore;
    view.updateScores(playerScore, dealerScore);
  },

  calculateHandScore: function (hand) {
    let score = 0;
    let hasAce = false;

    for (const theHand of Object.keys(hand)) {
      const suit = hand[theHand];
      console.log(theHand, suit);
    }

    console.log(`hand is: ${hand}, and typeOf: ${JSON.stringify(hand, null, 2)}`);
    //const handStr = JSON.stringify(hand);
    for (let card of hand) {
      console.log(`hand is: ${hand}, and typeOf: ${typeof(hand)}`);
      const rank = hand.slice(0, -1);

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

  dealCardToPlayer: function (player) {
    const card = drawCard();
    model.playerHand.push(card);
    const playerHandElement = document.getElementById("player-hand");
    view.renderCard(card, "player-hand");
    model.playerScore = this.calculateHandScore(model.playerHand);
    this.displayScores();

    if (model.playerScore > 21) {
      view.displayMessage("Bust! You lose.");
      document.getElementById("hit-button").disabled = true;
      document.getElementById("stand-button").disabled = true;
      this.dealerTurn(player);
    } else if (model.playerScore === 21) {
      view.displayMessage("Blackjack! You win.");
      document.getElementById("hit-button").disabled = true;
      document.getElementById("stand-button").disabled = true;
    }
  },  
  
  dealerTurn: function (player) {
    this.checkGameStatus();
    model.playerScore = this.calculateHandScore(model.playerHand);
    model.dealerScore = this.calculateHandScore(model.dealerScore);
    if (player.score > 21 && dealer.score <= 21) {
      view.displayMessage("Bust! You lose. Dealer wins.");
    }
    while (model.dealerScore < 17) {
      const card = drawCard();
      model.dealerHand.push(card);
      view.renderCard(card, "dealer-hand");
      model.dealerScore = this.calculateHandScore(model.dealerHand);
      this.displayScores();
    }

    if (model.dealerScore > 21) {
      view.displayMessage("Dealer busts! You win.");
      } else if (model.dealerScore >= 17 && model.dealerScore <= 21) {
        if (model.dealerScore > model.playerScore) {
          view.displayMessage("Dealer wins.");
        } else if (model.dealerScore < model.playerScore) {
          view.displayMessage("You win.");
        } else {
          view.displayMessage("It's a tie.");
        }
      } else if (model.dealerScore === 17) {
        model.dealerScore = this.calculateHandScore(model.dealerHand);
        this.displayScores();
      }
  },

  checkGameStatus: function () {
    const playerScore = model.playerScore;
    const dealerScore = model.dealerScore;
    document.getElementById("hit-button").disabled = true;
    document.getElementById("stand-button").disabled = true;

    if (playerScore > 21) {
      view.displayMessage("Bust! You lose.");
    } else if (dealerScore > 21 && playerScore <= 21) {
      view.displayMessage("Dealer busts! You win.");
    } else if (playerScore === 21 && dealerScore === 21) {
      view.displayMessage("It's a tie.");
    } else if (playerScore === 21) {
      view.displayMessage("Blackjack! You win.");
    } else if (dealerScore === 21) {
      view.displayMessage("Dealer has blackjack. You lose.");
    } else if (playerScore >= 17 && dealerScore >= 17) {
      if (playerScore > dealerScore) {
        view.displayMessage("You win.");
      } else if (playerScore < dealerScore) {
        view.displayMessage("Dealer wins.");
      } else {
        view.displayMessage("It's a tie.");
      }
    }
    document.getElementById("hit-button").disabled = false;
    document.getElementById("stand-button").disabled = false;
  },
};

// Helper functions
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
  controller.dealCardToPlayer(this.player);
});

document.getElementById("stand-button").addEventListener("click", function () {
  console.log("> Stand Button <");
  document.getElementById("hit-button").disabled = true;
  document.getElementById("stand-button").disabled = true;
  controller.dealerTurn(this.player);
});