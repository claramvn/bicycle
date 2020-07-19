/********************************* Slider ****************************************/

class Slider {
    constructor(tabImages, tabTextes, ms) {
        this.gauche = document.querySelector(".prev"); // Bouton gauche
        this.droite = document.querySelector(".next"); // bouton droit
        this.pause = document.getElementById("pause"); // Bouton pause
        this.play = document.getElementById("play"); // Bouton play

        this.imageArray = tabImages; // Tableau des images
        this.image = document.getElementById("mainImage"); // 1ère image
        this.imageIndex = 0; // Index image

        this.textArray = tabTextes; // Tableau des textes
        this.paraText = document.getElementById("mainTexte"); // 1er texte

        this.dots = document.querySelectorAll(".dots"); // Indicateurs

        this.diapoAuto = null; // Pas d'intervalles

        this.init(ms); // Méthode des évènements

    }

    // Affichage général
    diapo() {
        this.image.setAttribute("src", this.imageArray[this.imageIndex]); // Attribution chemin source correspondant à index d'une image du tableau
        this.paraText.textContent = this.textArray[this.imageIndex]; // Insertion du texte en fonction de l'image
        this.pause.style.display = "block"; // Bouton pause visible
        this.play.style.display = "none"; // Bouton play masqué


        // Pour chaque indicateurs
        for (let i = 0; i < this.dots.length; i++) {
            this.dots[i].style.backgroundColor = "black"; // Indicateurs en noir
        };

        this.dots[this.imageIndex].style.backgroundColor = "#E06517"; // Indicateur coorespondant à l'image en orange

    };


    // Passage Image suivante
    nextBlock() {
        this.diapo(); // Méthode affichage général
        this.imageIndex++; // Incrémentation index image
        if (this.imageIndex > this.imageArray.length - 1) { // Si l'index image est supérieur à totalité images 
            this.imageIndex = 0; // Reprise à la première image
        }
    };

    // Passage Image précédente
    prevBlock() {
        this.diapo(); // Méthode affichage général
        this.imageIndex--; // Décrémentation index image
        if (this.imageIndex < 0) { // Si l'index  est plus petit que 0
            this.imageIndex = this.imageArray.length - 1; // Retour à la dernière image
        }
    };

    // Déclencher le slider automatique
    playDiapo(ms) {
        this.diapoAuto = setInterval(() => this.nextBlock(), ms); // Intervalles de 5s avc comportement passage vers la gauche
        this.play.style.display = "none"; // Bouton play masqué
        this.pause.style.display = "block"; // Bouton pause affiché
    };

    // Interruption du slider automatique
    pauseDiapo() {
        clearInterval(this.diapoAuto); // Arrêt intervalles
        this.pause.style.display = "none"; // Bouton pause masqué
        this.play.style.display = "block"; // Bouton play affiché
    };

    // Passage par les flèches clavier
    clavierDiapo(event) {
        let key = event.keyCode; // valeur unicode touche clavier enfoncée
        if (key === 37) { // Si Code flèche gauche
            this.prevBlock();
        } else if (key === 39) { // Code flèche droite
            this.nextBlock();
        }
    };

    // Regrouprement des évènements
    init(ms) {
        this.droite.addEventListener("click", () => this.nextBlock()); // Clic flèche droite
        this.gauche.addEventListener("click", () => this.prevBlock()); // Clic flèche gauche
        this.play.addEventListener("click", () => this.playDiapo(ms)); // Clic bouton play
        this.pause.addEventListener("click", () => this.pauseDiapo()); // Clic bouton pause
        document.addEventListener("keydown", () => this.clavierDiapo(event)); // Clavier flèches gauche et droite
        this.diapoAuto = setInterval(() => this.nextBlock(), ms); // Défilement/ intervalles
    };


};