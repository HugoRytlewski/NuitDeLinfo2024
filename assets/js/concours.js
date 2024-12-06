function createBubbles() {
    const bubbles = document.getElementById('bubbles');
    const numberOfBubbles = 100;

    for(let i = 0; i < numberOfBubbles; i++) {
        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        
        const cluster = Math.floor(Math.random() * 3);
        const baseX = (cluster * 33) + Math.random() * 20;
        bubble.style.left = `${baseX}%`;

        const size = Math.random() * 15 + 3;
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;

        bubble.style.setProperty('--duration', `${Math.random() * 3 + 2}s`);
        bubble.style.setProperty('--delay', `-${Math.random() * 2}s`);
        bubble.style.setProperty('--drift', `${Math.random() * 40 - 20}px`);
        bubble.style.setProperty('--opacity', `${Math.random() * 0.3 + 0.1}`);

        bubbles.appendChild(bubble);
    }
}

// Gestion du renouvellement des bulles avec un seul intervalle
let bubbleInterval = setInterval(() => {
    const bubbles = document.getElementById('bubbles');
    bubbles.innerHTML = '';
    createBubbles();
}, 3000);

const numbers = Array.from({length: 10}, (_, i) => i);
const phoneDisplay = document.getElementById('phoneDisplay');
const numpad = document.getElementById('numpad');
const validateBtn = document.getElementById('validateBtn');
const taskDisplay = document.getElementById('currentTask');

let currentNumber = '';
let activeNumber = null;
let colorInterval = null;
let isGameActive = true;

// Création des boutons du pavé numérique
numbers.forEach(num => {
    const button = document.createElement('button');
    button.textContent = num;
    button.dataset.number = num;
    numpad.appendChild(button);
});

function shuffleButtons() {
    if (!isGameActive) return;
    const buttons = Array.from(numpad.children);
    buttons.forEach(button => {
        button.style.order = Math.floor(Math.random() * 10);
    });
}

function resetGame() {
    isGameActive = true;
    currentNumber = '';
    phoneDisplay.textContent = '';
    validateBtn.disabled = true;
    numpad.style.pointerEvents = 'auto';
    taskDisplay.textContent = "Attrapez les chiffres bleus comme des poissons !";
    startColorChange();
    shuffleButtons();
}

function startColorChange() {
    if (colorInterval) {
        clearInterval(colorInterval);
    }
    
    if (!isGameActive) return;
    
    activeNumber = Math.floor(Math.random() * 10);
    
    colorInterval = setInterval(() => {
        if (!isGameActive) {
            clearInterval(colorInterval);
            return;
        }

        const buttons = numpad.querySelectorAll('button');
        buttons.forEach(button => {
            if(parseInt(button.dataset.number) === activeNumber) {
                button.style.backgroundColor = '#2196F3';
                button.style.transform = 'scale(1.1)';
            } else {
                button.style.backgroundColor = 'white';
                button.style.transform = 'scale(1)';
            }
        });
        activeNumber = Math.floor(Math.random() * 10);
    }, 1000);
}

numpad.addEventListener('click', (e) => {
    if(!e.target.matches('button') || !isGameActive) return;
    
    const clickedNumber = parseInt(e.target.dataset.number);
    const buttonColor = window.getComputedStyle(e.target).backgroundColor;
    
    if(buttonColor === 'rgb(33, 150, 243)') { // Bleu
        currentNumber += clickedNumber;
        phoneDisplay.textContent = currentNumber.replace(/(\d{2})/g, '$1 ').trim();
        
        if(currentNumber.length === 10) {
            isGameActive = false;
            clearInterval(colorInterval);
            validateBtn.disabled = false;
            numpad.style.pointerEvents = 'none';
            taskDisplay.textContent = "Numéro complet ! Vous pouvez valider votre participation.";
        } else {
            shuffleButtons();
        }
    }
});

validateBtn.addEventListener('click', () => {
    if (colorInterval) {
        clearInterval(colorInterval);
    }
    if (bubbleInterval) {
        clearInterval(bubbleInterval);
    }
    document.querySelector('.phone-input-section').style.display = 'none';
    document.getElementById('successMessage').style.display = 'block';
});

// Initialisation
createBubbles();
startColorChange();
shuffleButtons();