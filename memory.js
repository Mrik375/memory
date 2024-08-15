document.addEventListener("DOMContentLoaded", function() { //Charge le DOM avant lecture JS

  const cardData = [
    { name: "babypupa", img: "/img/babypupa.jpg" },
    { name: "orangepupa", img: "/img/orangepupa.jpg" },
    { name: "pinkpupa", img: "/img/pinkpupa.jpg" },
    { name: "pupabang", img: "/img/pupabang.jpg" },
    { name: "red", img: "/img/red.jpg" },
    { name: "pupafleur", img: "/img/pupafleur.jpg" },
    { name: "pupableu", img: "/img/pupableu.jpg" },              // Tableau de cards
    { name: "pupavert", img: "/img/pupavert.jpg" },
    { name: "babypupa", img: "/img/babypupa.jpg" },
    { name: "orangepupa", img: "/img/orangepupa.jpg" },
    { name: "pinkpupa", img: "/img/pinkpupa.jpg" },
    { name: "pupabang", img: "/img/pupabang.jpg" },
    { name: "red", img: "/img/red.jpg" },
    { name: "pupafleur", img: "/img/pupafleur.jpg" },
    { name: "pupableu", img: "/img/pupableu.jpg" },
    { name: "pupavert", img: "/img/pupavert.jpg" }
  ];

  const memoryGameContainer = document.querySelector(".solarmemory"); // Séléctionne section où placer cards

  function createCardElement(card) { // Créé élément card pour la carte, créé une div avec id
    const cardElement = document.createElement("div");
    cardElement.classList.add("memory-card");
    cardElement.dataset.name = card.name;

    const frontFace = document.createElement("img"); // Créé la face AV de la carte
    frontFace.classList.add("front-face");
    frontFace.src = card.img;
    frontFace.alt = card.name;

    const backFace = document.createElement("img"); // Créé la face AR de la carte
    backFace.classList.add("back-face");
    backFace.src = "/img/back.jpg";
    backFace.alt = "back";

    cardElement.appendChild(frontFace); // Ajoute les faces av/ar en tant qu'enfants
    cardElement.appendChild(backFace);

    return cardElement; // Retourne la div représentant la carte.
  }
// Créé les élémetns (tableau d'objets contenant les données de chaques cartes), et les ajoute au 
  function initializeGame() {
    cardData.forEach(function(card) {
      const cardElement = createCardElement(card);
      memoryGameContainer.appendChild(cardElement);
    });
  }
  
function playFlipSound() { // Fonction pour jouer le son de retournement de carte
  flipSound.currentTime = 0; // Réinitialise la lecture audio à partir du début
  flipSound.volume = 0.2;
  flipSound.play(); // Joue le son
}

  initializeGame();

  const cards = document.querySelectorAll(".memory-card");
  const victoryMessage = document.getElementById("victoire");
  const flipSound = new Audio("/sound/flip.mp3"); // Charge le son de retournement

  let isCardFlipped = false;
  let lockBoard = false; // verrouille le clic si action en cours
  let firstCard, secondCard;
  let pairsFound = 0; // compteur de paires pour savoir quand l'utilisateur a gagné
  let gameActive = true; // indique si le jeu est actif

  function flipCard(card) {
    if (lockBoard || !gameActive) return; // si le jeu est verrouillé ou si l'utilisateur clique sur la même carte, rien ne se passe
    if (card === firstCard) return;

    card.classList.add("flip"); // appel du flip
    playFlipSound(); // Joue le son lorsqu'une carte se retourne

    if (!isCardFlipped) {
      isCardFlipped = true; // firstCard prend la valeur de la carte cliquée
      firstCard = card;
      return;
    }
    secondCard = card; // secondCard prend la valeur de la carte cliquée

    checkForMatch(); 
  }
  // vérifier les cartes
  function checkForMatch() {
    let isMatch = firstCard.dataset.name === secondCard.dataset.name; 

    if (isMatch) {
      disableCards(); // si victoire, cartes désactivées, sinon cartes se retournent
      pairsFound++; // incrémente le compteur de paires trouvées
    } else {
      unflipCards();
    }
  
    if (pairsFound === cards.length / 2) { // vérifie si tout a été trouvé ==> nbr de cartes en doubles / 2
      showVictory(); // Si oui, affiche message de victoire
    }
  }
  function disableCards() {
    firstCard.removeEventListener("click", handleCardClick); // supprime l'écoute sur la carte cliquée
    secondCard.removeEventListener("click", handleCardClick);

    resetBoard(); // réinitialise les variables
  }
  function unflipCards() { // verrouille quand les cartes sont en train de se retourner
    lockBoard = true;

    setTimeout(function() { // Tempo
      firstCard.classList.remove("flip"); // effet de flip quand réinitialisation
      secondCard.classList.remove("flip");
  
      resetBoard();
    }, 1200);
  }
  function resetBoard() {
    [isCardFlipped, lockBoard] = [false, false]; // réinitialise les variables
    [firstCard, secondCard] = [null, null];
  }
  function handleCardClick(event) { // capte le clic sur une carte
    flipCard(event.target.closest(".memory-card")); // trouve quelle carte doit être retournée
  }
  cards.forEach(card => card.addEventListener("click", handleCardClick));

  function showVictory() {
    setTimeout(function() { // Ajout de tempo pour laisser card se retourner avant affichage
    victoryMessage.classList.add("active");
    victoryMessage.style.display = "block"; // Affiche la div "victoire"
    gameActive = false; // Désactive le jeu actif pour permettre le redémarrage
    }, 400);
}
  // Fonction pour mélanger les cartes
  function shuffleCards() {
    cards.forEach(function(card) {
      let randomPos = Math.floor(Math.random() * cards.length);
      card.style.order = randomPos;
    });
  }
  // Mélanger les cartes au rechargement de la page
  shuffleCards();

  document.addEventListener("keydown", function(event) {
    if (event.code === "Space" && !gameActive) { // Vérifie si la touche enfoncée est la barre d'espace
      restartGame(); // Appelle la fonction pour relancer le jeu
    }
  });
  // Fonction pour relancer le jeu
  function restartGame() {
    victoryMessage.style.display = "none"; // Cache le message de victoire
    shuffleCards(); // Mélange les cartes à nouveau
    pairsFound = 0; // Réinitialise le compteur de paires trouvées
    cards.forEach(card => {
      card.classList.remove("flip");
      card.addEventListener("click", handleCardClick); // Retourne toutes les cartes
    });
    gameActive = true; // permet le redémarrage une fois que la victoire est affichée
  }
});