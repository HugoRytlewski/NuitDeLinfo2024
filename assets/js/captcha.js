class GamingCaptcha {
    constructor() {
      this.initElements();
      this.attachEventListeners();
      this.resetGameState();
    }
  
    initElements() {
      this.form = document.getElementById("contactForm");
      this.nameInput = document.getElementById("name");
      this.emailInput = document.getElementById("email");
      this.messageInput = document.getElementById("message");
      this.gamingCaptcha = document.getElementById("gamingCaptcha");
      this.captchaStatus = document.getElementById("captchaStatus");
      this.submitBtn = document.getElementById("submitBtn");
      this.captchaModal = document.getElementById("captchaModal");
      this.gameSelection = document.getElementById("gameSelection");
      this.gameContainer = document.getElementById("gameContainer");
      this.cancelCaptcha = document.getElementById("cancelCaptcha");
    }
  
    attachEventListeners() {
      this.gamingCaptcha.addEventListener("click", () => this.openCaptchaModal());
      this.cancelCaptcha.addEventListener("click", () =>
        this.closeCaptchaModal()
      );
      this.form.addEventListener("submit", (e) => this.handleSubmit(e));
      this.gameSelection.addEventListener("click", (e) => {
        const gameType = e.target.dataset.game;
        if (gameType) this.startGame(gameType);
      });
    }
  
    resetGameState() {
      this.captchaVerified = false;
      this.currentGame = null;
      this.gameCompleted = false;
      this.moveInterval = null;
    }
  
    openCaptchaModal() {
      if (this.captchaVerified) return;
      this.gameContainer.innerHTML = "";
      this.gameSelection.style.display = "flex";
      this.captchaModal.style.display = "flex";
      document.body.classList.add("modal-open");
      this.resetGameState();
    }
  
    closeCaptchaModal() {
      this.captchaModal.style.display = "none";
      document.body.classList.remove("modal-open");
      this.gameContainer.innerHTML = "";
      this.gameSelection.style.display = "flex";
      if (this.moveInterval) {
        clearInterval(this.moveInterval);
        this.moveInterval = null;
      }
    }
  
    startGame(gameType) {
      if (this.captchaVerified) return;
      this.currentGame = gameType;
      this.gameSelection.style.display = "none";
      this.gameContainer.innerHTML = "";
  
      switch (gameType) {
        case "memory":
          this.renderMemoryGame();
          break;
        case "platformer":
          this.renderPlatformerGame();
          break;
        case "shooter":
          this.renderShooterGame();
          break;
      }
    }
  
    renderMemoryGame() {
      const emojis = ["🐋", "🐬", "🦈", "🐙", "🐠", "🦑"];
      const gameCards = [...emojis, ...emojis].sort(() => Math.random() - 0.5);
  
      const styles = `
              <style>
                  .memory-grid {
                      display: grid;
                      grid-template-columns: repeat(4, 1fr);
                      gap: 12px;
                      margin: 20px auto;
                      padding: 0 10px;
                  }
                  .memory-card {
                      position: relative;
                      height: 80px;
                      transform-style: preserve-3d;
                      transition: transform 0.6s;
                      cursor: pointer;
                  }
                  .memory-card.flipped {
                      transform: rotateY(180deg);
                  }
                  .memory-card-face {
                      position: absolute;
                      width: 100%;
                      height: 100%;
                      backface-visibility: hidden;
                      -webkit-backface-visibility: hidden;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      font-size: 2em;
                      border-radius: 8px;
                      background-color: #1f2937;
                  }
                  .memory-card-front {
                      background-color: #2563eb;
                      transform: rotateY(180deg);
                  }
                  .memory-card-back {
                      background-color: #1f2937;
                      transform: rotateY(0deg);
                  }
                  .memory-card.matched .memory-card-front {
                      background-color: #059669;
                  }
              </style>
          `;
  
      this.gameContainer.innerHTML = `
              ${styles}
              <div class="game-stats">
                  <span>Coups: <span id="moveCount">0</span></span>
                  <span>Paires: <span id="pairCount">0/6</span></span>
              </div>
              <div class="memory-grid">
                  ${gameCards
                    .map(
                      (emoji, index) => `
                      <div class="memory-card" data-card="${emoji}">
                          <div class="memory-card-face memory-card-front">${emoji}</div>
                          <div class="memory-card-face memory-card-back">❓</div>
                      </div>
                  `
                    )
                    .join("")}
              </div>
          `;
  
      let flippedCards = [];
      let canFlip = true;
      let moves = 0;
      let pairs = 0;
  
      const cards = document.querySelectorAll(".memory-card");
      cards.forEach((card) => {
        card.addEventListener("click", () => {
          if (
            !canFlip ||
            flippedCards.includes(card) ||
            card.classList.contains("matched")
          )
            return;
  
          card.classList.add("flipped");
          flippedCards.push(card);
  
          if (flippedCards.length === 2) {
            moves++;
            document.getElementById("moveCount").textContent = moves;
            canFlip = false;
  
            if (flippedCards[0].dataset.card === flippedCards[1].dataset.card) {
              pairs++;
              document.getElementById("pairCount").textContent = `${pairs}/6`;
              flippedCards.forEach((card) => card.classList.add("matched"));
              flippedCards = [];
              canFlip = true;
  
              if (pairs === 6) {
                setTimeout(() => this.completeGame(), 500);
              }
            } else {
              setTimeout(() => {
                flippedCards.forEach((card) => card.classList.remove("flipped"));
                flippedCards = [];
                canFlip = true;
              }, 1000);
            }
          }
        });
      });
    }
  
    renderPlatformerGame() {
      const styles = `
              <style>
                  .platformer-container {
                      position: relative;
                      width: 100%;
                      height: 300px;
                      background-color: #1f2937;
                      overflow: hidden;
                      border-radius: 8px;
                  }
                  .player {
                      position: absolute;
                      width: 30px;
                      height: 30px;
                      background-color: #3b82f6;
                      border-radius: 50%;
                      transition: left 0.1s;
                  }
                  .goal {
                      position: absolute;
                      width: 50px;
                      height: 50px;
                      background-color: #059669;
                      border-radius: 8px;
                  }
                  .platform {
                      position: absolute;
                      height: 20px;
                      background-color: #4b5563;
                  }
                  .controls {
                      display: flex;
                      justify-content: center;
                      gap: 10px;
                      margin-top: 20px;
                  }
                  .control-btn {
                      padding: 15px 30px;
                      font-size: 1.5em;
                      cursor: pointer;
                      user-select: none;
                      -webkit-user-select: none;
                      background: #2563eb;
                      border: none;
                      border-radius: 8px;
                      color: white;
                  }
              </style>
          `;
  
      this.gameContainer.innerHTML = `
              ${styles}
              <div class="platformer-container">
                  <div class="player"></div>
                  <div class="goal"></div>
                  <div class="platform" style="width: 100%; bottom: 0;"></div>
              </div>
              <div class="controls">
                  <button class="control-btn" id="leftBtn">⬅️</button>
                  <button class="control-btn" id="rightBtn">➡️</button>
              </div>
          `;
  
      const player = document.querySelector(".player");
      const goal = document.querySelector(".goal");
      const container = document.querySelector(".platformer-container");
      const leftBtn = document.getElementById("leftBtn");
      const rightBtn = document.getElementById("rightBtn");
  
      let playerPos = { x: 30, y: container.offsetHeight - 50 };
      player.style.left = `${playerPos.x}px`;
      player.style.bottom = `20px`;
  
      goal.style.right = "30px";
      goal.style.bottom = "20px";
  
      let gameCompleted = false;
      let currentDirection = null;
  
      const movePlayer = (direction) => {
        if (gameCompleted) return;
        currentDirection = direction;
  
        if (this.moveInterval) {
          clearInterval(this.moveInterval);
        }
  
        const speed = 5;
        this.moveInterval = setInterval(() => {
          if (currentDirection === "left" && playerPos.x > 0) {
            playerPos.x -= speed;
            player.style.left = `${playerPos.x}px`;
          } else if (
            currentDirection === "right" &&
            playerPos.x < container.offsetWidth - 30
          ) {
            playerPos.x += speed;
            player.style.left = `${playerPos.x}px`;
  
            if (playerPos.x > container.offsetWidth - 100) {
              gameCompleted = true;
              this.completeGame();
              clearInterval(this.moveInterval);
              this.moveInterval = null;
            }
          }
        }, 16);
      };
  
      const stopMoving = () => {
        if (gameCompleted) return;
        currentDirection = null;
        if (this.moveInterval) {
          clearInterval(this.moveInterval);
          this.moveInterval = null;
        }
      };
  
      // Support tactile amélioré
      leftBtn.addEventListener(
        "touchstart",
        (e) => {
          if (gameCompleted) return;
          e.preventDefault();
          movePlayer("left");
        },
        { passive: false }
      );
  
      rightBtn.addEventListener(
        "touchstart",
        (e) => {
          if (gameCompleted) return;
          e.preventDefault();
          movePlayer("right");
        },
        { passive: false }
      );
  
      // Support souris (gardé pour desktop)
      leftBtn.addEventListener("mousedown", () => {
        if (!gameCompleted) movePlayer("left");
      });
  
      rightBtn.addEventListener("mousedown", () => {
        if (!gameCompleted) movePlayer("right");
      });
  
      // Arrêt au relâchement tactile et souris
      document.addEventListener("touchend", stopMoving);
      document.addEventListener("touchcancel", stopMoving);
      document.addEventListener("mouseup", stopMoving);
  
      // Support clavier
      document.addEventListener("keydown", (e) => {
        if (gameCompleted) return;
        if (e.key === "ArrowLeft") movePlayer("left");
        if (e.key === "ArrowRight") movePlayer("right");
      });
  
      document.addEventListener("keyup", (e) => {
        if (gameCompleted) return;
        if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
          stopMoving();
        }
      });
    }
  
    renderShooterGame() {
      const styles = `
              <style>
                  .shooter-container {
                      position: relative;
                      width: 100%;
                      height: 300px;
                      background-color: #1f2937;
                      overflow: hidden;
                      border-radius: 8px;
                  }
                  .target {
                      position: absolute;
                      width: 40px;
                      height: 40px;
                      background-color: #ef4444;
                      border-radius: 50%;
                      cursor: pointer;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      font-size: 1.5em;
                      transition: transform 0.2s;
                  }
                  .target:hover {
                      transform: scale(1.1);
                  }
                  .score {
                      position: absolute;
                      top: 10px;
                      right: 10px;
                      padding: 5px 10px;
                      background-color: rgba(0, 0, 0, 0.5);
                      border-radius: 4px;
                  }
              </style>
          `;
  
      this.gameContainer.innerHTML = `
              ${styles}
              <div class="shooter-container">
                  <div class="score">Cibles: <span id="targetCount">0</span>/5</div>
              </div>
          `;
  
      const container = document.querySelector(".shooter-container");
      let targetsHit = 0;
  
      const createTarget = () => {
        const target = document.createElement("div");
        target.className = "target";
        target.textContent = "🎯";
  
        const maxX = container.offsetWidth - 40;
        const maxY = container.offsetHeight - 40;
        target.style.left = `${Math.random() * maxX}px`;
        target.style.top = `${Math.random() * maxY}px`;
  
        target.addEventListener("click", () => {
          target.style.display = "none";
          targetsHit++;
          document.getElementById("targetCount").textContent = targetsHit;
  
          if (targetsHit >= 5) {
            this.completeGame();
          } else {
            createTarget();
          }
        });
  
        container.appendChild(target);
      };
  
      createTarget();
    }
  
    completeGame() {
      this.gameCompleted = true;
      const validateBtn = document.createElement("button");
      validateBtn.textContent = "Valider le Captcha";
      validateBtn.className = "validate-btn";
      validateBtn.addEventListener("click", () => {
        this.captchaVerified = true;
        this.submitBtn.disabled = false;
        this.closeCaptchaModal();
  
        this.gamingCaptcha.disabled = true;
        this.gamingCaptcha.style.opacity = "0.5";
        this.gamingCaptcha.style.cursor = "not-allowed";
        this.gamingCaptcha.innerHTML = `
                  <div class="btn-content">
                      <span>✅ Vérifié</span>
                  </div>
              `;
      });
      this.gameContainer.appendChild(validateBtn);
    }
  
    handleSubmit(e) {
      e.preventDefault();
      if (this.captchaVerified) {
        alert("Formulaire envoyé avec succès !");
        this.form.reset();
        this.captchaStatus.textContent = "";
        this.submitBtn.disabled = true;
        this.captchaVerified = false;
  
        // Reset du bouton de captcha
        this.gamingCaptcha.disabled = false;
        this.gamingCaptcha.style.opacity = "1";
        this.gamingCaptcha.style.cursor = "pointer";
        this.gamingCaptcha.innerHTML = `
                  <div class="btn-content">
                      <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M13 5L20 12L13 19M4 12H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                      <span class="btn-text">Vérification humaine</span>
                  </div>
              `;
      }
    }
  }
  
  // Initialisation
  new GamingCaptcha();