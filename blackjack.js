// Model
const model = {
  deck: [],
  playerHand: [],
  dealerHand: [],
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
    playerHandElement.innerHTML = "";
    dealerHandElement.innerHTML = "";
  },

  updateScores: function (playerScore, dealerScore) {
    const playerHandElement = document.getElementById("player-h2");
    const dealerHandElement = document.getElementById("dealer-h2");
    playerHandElement.textContent = `Player Hand: ${playerScore}`;
    dealerHandElement.textContent = `Dealer Hand: ${dealerScore}`;
  },
};

// Controller
const controller = {
  startGame: function () {
    model.deck = getShuffledDeck();
    model.playerHand = [drawCard(), drawCard()];
    model.dealerHand = [drawCard(), drawCard()];

    view.clearTable();
    view.displayMessage("Welcome to Blackjack!");
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
    const playerHandElement = document.getElementById("player-hand");
    view.renderCard(card, "player-hand");
    model.playerScore = this.calculateHandScore(model.playerHand);
    this.displayScores();

    if (model.playerScore > 21) {
      view.displayMessage("Bust! You lose.");
      document.getElementById("hit-button").disabled = true;
      document.getElementById("stand-button").disabled = true;
    }
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
  controller.dealCardToPlayer();
});
