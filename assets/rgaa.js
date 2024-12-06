document.addEventListener("DOMContentLoaded", function () {
    const button = document.querySelector(".button");
    const dropdownLinks = document.querySelectorAll(".dropdown a");
    const arrow = document.querySelector(".arrow");
    const dropdown = document.querySelector(".dropdown");
    const resetButton = document.getElementById("reset");
    const zoomInButton = document.getElementById("zoom-in");
    const zoomOutButton = document.getElementById("zoom-out");
    const dyslexiqueButton = document.getElementById("dyslexique"); // Bouton dyslexique
    const protanopiaButton = document.getElementById("protanopie"); // Bouton Protanopie
    const deuteranopiaButton = document.getElementById("deuteranopie"); // Bouton Deuteranopie
    const tritanopiaButton = document.getElementById("tritanopie"); // Bouton Tritanopie
    const primaryButton = document.getElementById("primary"); // Bouton Couleur primaire

    const minFontSize = 10; // Taille de police minimale
    const maxFontSize = 30; // Taille de police maximale

    let count = 0; // Compteur pour suivre les changements de taille de la police
    const initialFontSizes = new Map(); // Pour stocker la taille de police initiale de chaque élément

    let selectedModes = new Set(); // Utiliser un Set pour garder trace des modes sélectionnés (Dyslexie, Daltonisme, etc.)

    // Fonction pour mémoriser la taille de police initiale
    document.querySelectorAll('*').forEach(el => {
        const computedStyle = window.getComputedStyle(el);
        initialFontSizes.set(el, parseFloat(computedStyle.fontSize));
    });

    // Définir la taille de la police initiale de base du body
    document.body.style.fontSize = `18px`;

    // Appliquer la police dyslexique à tous les éléments lorsqu'elle est activée
    function toggleDyslexicMode() {
        if (document.body.classList.contains('dyslexique')) {
            // Appliquer la police dyslexique à tous les éléments
            document.body.style.fontFamily = '"OpenDyslexic", Arial, sans-serif'; // Exemple de police dyslexique
            // Appliquer également aux boutons, liens et autres éléments interactifs de la page
            document.querySelectorAll("button, a").forEach(el => {
                el.style.fontFamily = '"Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif';
            });
        } else {
            // Rétablir la police normale
            document.body.style.fontFamily = 'Arial, sans-serif';
            document.querySelectorAll("button, a").forEach(el => {
                el.style.fontFamily = 'Arial, sans-serif';
            });
        }
    }

    // Bouton pour ouvrir/fermer le menu
    button.addEventListener("click", function () {
        dropdownLinks.forEach(link => {
            const isSelected = selectedModes.has(link.id); // Vérifier si l'élément est sélectionné
            if (isSelected) {
                link.classList.add("clicked");
                link.querySelector("span").classList.add("clicked");
            } else {
                link.classList.remove("clicked");
                link.querySelector("span").classList.remove("clicked");
            }
        });
        arrow.classList.toggle("open");
        dropdown.classList.toggle("open");
    });

    // Fermer le menu déroulant lorsqu'on clique en dehors
    document.addEventListener("click", function (event) {
        if (!dropdown.contains(event.target) && !button.contains(event.target)) {
            dropdown.classList.remove("open");
            arrow.classList.remove("open");
        }
    });

    // Liens du menu déroulant
    dropdownLinks.forEach(link => {
        link.addEventListener("click", function () {
            if (link.id === "dyslexique") {
                this.classList.toggle("clicked");
                this.querySelector("span").classList.toggle("clicked");
                if (this.classList.contains("clicked")) {
                    selectedModes.add("dyslexique");
                } else {
                    selectedModes.delete("dyslexique");
                }
            } else {
                dropdownLinks.forEach(link => {
                    if (link.id !== "dyslexique") {
                        link.classList.remove("clicked");
                        link.querySelector("span").classList.remove("clicked");
                    }
                });
                this.classList.toggle("clicked");
                this.querySelector("span").classList.toggle("clicked");
                selectedModes.clear();
                selectedModes.add(link.id); // Enregistrer l'état du bouton sélectionné
            }
        });
    });

    // Reset des paramètres (taille de police et couleurs)
    resetButton.addEventListener("click", function () {
        dropdownLinks.forEach(link => {
            link.classList.remove("clicked");
            link.querySelector("span").classList.remove("clicked");
        });

        // Réinitialiser la taille de la police pour chaque élément
        document.querySelectorAll('*').forEach(el => {
            const initialSize = initialFontSizes.get(el);
            el.style.fontSize = `${initialSize}px`; // Rétablir la taille initiale
        });

        // Retirer la classe dyslexique si elle est appliquée
        document.body.classList.remove('dyslexique');
        toggleDyslexicMode(); // Rétablir la police

        // Remettre la couleur primaire à sa valeur de base (normal)
        document.body.classList.remove('protanopia', 'deuteranopia', 'tritanopia');

        // Réinitialiser l'état des modes
        selectedModes.clear();
    });

    // Zoom avant
    zoomInButton.addEventListener("click", function () {
        document.querySelectorAll('*').forEach(el => {
            const currentSize = parseFloat(window.getComputedStyle(el).fontSize);
            if (currentSize + 1 <= maxFontSize) {
                el.style.fontSize = `${currentSize + 1}px`;
            }
        });
        count++;
    });

    // Zoom arrière
    zoomOutButton.addEventListener("click", function () {
        document.querySelectorAll('*').forEach(el => {
            const currentSize = parseFloat(window.getComputedStyle(el).fontSize);
            if (currentSize - 1 >= minFontSize) {
                el.style.fontSize = `${currentSize - 1}px`;
            }
        });
        count--;
    });

    // Lorsque l'on clique sur le bouton dyslexique, on applique ou retire la police dyslexique
    dyslexiqueButton.addEventListener("click", function () {
        document.body.classList.toggle('dyslexique');
        toggleDyslexicMode(); // Mettre à jour la police des éléments
        if (document.body.classList.contains('dyslexique')) {
            selectedModes.add('dyslexique');
        } else {
            selectedModes.delete('dyslexique');
        }
    });

    // Sélectionner le mode Protanopie
    protanopiaButton.addEventListener("click", function () {
        document.body.classList.add('protanopia');
        document.body.classList.remove('deuteranopia', 'tritanopia', 'primary');
        selectedModes.add('protanopie');
        selectedModes.delete('deuteranopia');
        selectedModes.delete('tritanopia');
        selectedModes.delete('primary');
    });

    // Sélectionner le mode Deuteranopie
    deuteranopiaButton.addEventListener("click", function () {
        document.body.classList.add('deuteranopia');
        document.body.classList.remove('protanopia', 'tritanopia', 'primary');
        selectedModes.add('deuteranopie');
        selectedModes.delete('protanopia');
        selectedModes.delete('tritanopia');
        selectedModes.delete('primary');
    });

    // Sélectionner le mode Tritanopie
    tritanopiaButton.addEventListener("click", function () {
        document.body.classList.add('tritanopia');
        document.body.classList.remove('protanopia', 'deuteranopia', 'primary');
        selectedModes.add('tritanopia');
        selectedModes.delete('protanopia');
        selectedModes.delete('deuteranopia');
        selectedModes.delete('primary');
    });

    // Sélectionner le mode Couleur primaire
    primaryButton.addEventListener("click", function () {
        document.body.classList.remove('protanopia', 'deuteranopia', 'tritanopia');
        selectedModes.add('primary');
        selectedModes.delete('protanopia');
        selectedModes.delete('deuteranopia');
        selectedModes.delete('tritanopia');
    });
});