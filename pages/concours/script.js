        // Création des bulles
        function createBubbles() {
            const bubbles = document.getElementById('bubbles');
            const numberOfBubbles = 100; // Beaucoup plus de bulles

            for(let i = 0; i < numberOfBubbles; i++) {
                const bubble = document.createElement('div');
                bubble.className = 'bubble';
                
                // Position aléatoire en X avec clustering
                const cluster = Math.floor(Math.random() * 3); // 0, 1, ou 2 pour 3 colonnes
                const baseX = (cluster * 33) + Math.random() * 20; // Position de base + variation
                bubble.style.left = `${baseX}%`;

                // Taille variable avec plus de petites bulles
                const size = Math.random() * 15 + 3; // 3px à 18px
                bubble.style.width = `${size}px`;
                bubble.style.height = `${size}px`;

                // Propriétés d'animation personnalisées
                bubble.style.setProperty('--duration', `${Math.random() * 3 + 2}s`); // 2-5s
                bubble.style.setProperty('--delay', `-${Math.random() * 2}s`); // Départ décalé
                bubble.style.setProperty('--drift', `${Math.random() * 40 - 20}px`); // Dérive horizontale
                bubble.style.setProperty('--opacity', `${Math.random() * 0.3 + 0.1}`); // Opacité variable

                bubbles.appendChild(bubble);
            }

            // Renouvellement périodique des bulles
            setInterval(() => {
                bubbles.innerHTML = '';
                createBubbles();
            }, 3000);
        }

        // Système de numéro de téléphone
        const numbers = Array.from({length: 10}, (_, i) => i);
        const phoneDisplay = document.getElementById('phoneDisplay');
        const numpad = document.getElementById('numpad');
        const validateBtn = document.getElementById('validateBtn');
        const taskDisplay = document.getElementById('currentTask');

        let currentNumber = '';
        let activeNumber = null;
        let colorInterval = null;

        numbers.forEach(num => {
            const button = document.createElement('button');
            button.textContent = num;
            button.dataset.number = num;
            numpad.appendChild(button);
        });

        function shuffleButtons() {
            const buttons = Array.from(numpad.children);
            buttons.forEach(button => {
                button.style.order = Math.floor(Math.random() * 10);
            });
        }

        function startColorChange() {
            clearInterval(colorInterval);
            activeNumber = Math.floor(Math.random() * 10);
            
            colorInterval = setInterval(() => {
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
            if(!e.target.matches('button')) return;
            
            const clickedNumber = parseInt(e.target.dataset.number);
            const buttonColor = window.getComputedStyle(e.target).backgroundColor;
            
            if(buttonColor === 'rgb(33, 150, 243)') { // Bleu
                currentNumber += clickedNumber;
                phoneDisplay.textContent = currentNumber.replace(/(\d{2})/g, '$1 ').trim();
                
                if(currentNumber.length === 10) {
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
            document.querySelector('.phone-input-section').style.display = 'none';
            document.getElementById('successMessage').style.display = 'block';
        });

        // Initialisation
        createBubbles();
        startColorChange();
        shuffleButtons();