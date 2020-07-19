/****************************************** Canvas **********************************************/

class Canvas {
    constructor() {
        this.form = document.getElementById("form"); // Formulaire DOM
        this.nom = document.getElementById("nom"); // Input nom DOM
        this.prenom = document.getElementById("prenom"); // Input prénom DOM
        this.boutonForm = document.getElementById("bouton_form"); // Bouton réservation formulaire
        this.blockSignature = document.getElementById("block_signature"); // Panneau signature DOM

        this.canvas = document.getElementById("canvas"); // Canvas DOM
        this.ctx = this.canvas.getContext("2d"); // Récupération du 2d
        this.boutonReservation = document.getElementById("reservation"); // Bouton réservation canvas
        this.eraseCanvas = document.getElementById("effacer"); // Bouton effacer

        this.canvas.width = 302; // Largeur du canvas
        this.canvas.height = 152; // Hauteur du canvas

        this.paint = false; // Etat dessin sur false

        this.initEvents(); // Méthode évènements souris et tactile

    };

    // Affichage du bloc signature après vérif nom et prénom
    signature() {
        this.boutonForm.addEventListener("click", () => { // Au clic bouton réservation formulaire

            // Sauvegarde nom et prénom dans le navigateur sans limite durée de vie
            localStorage.setItem('nom', this.nom.value.trim()); // Nom retenu et sans espaces blanc géré par trim()
            localStorage.setItem('prénom', this.prenom.value.trim()); // Prénom retenu et sans espaces blanc géré par trim()

            if ((localStorage.getItem('nom') !== "") && (localStorage.getItem('prénom') !== "")) { // Si les champs nom et prénom du formulaire sont renseignés 
                // Données ok
                this.blockSignature.style.display = "block"; // Panneau canvas affiché
                this.form.style.color = "black"; // Formulaire ok champs de couleur noire
                this.erase(); // Reset Canvas si réservation sur réservation
            } else {
                // Données non renseignées
                this.blockSignature.classList.add("ghost"); // Panneau canvas masqué
                alert("Veuillez renseigner tous les champs pour réserver votre Bicycle."); //  Boîte d'alerte utilisateur
                this.form.style.color = "red"; // Formulaire non ok champs de couleur rouge
            }
        });
    }

    /************************************ CANVAS ***************************************/

    /* Récupération coordonnées points Souris */
    mouse(e) {
        this.pointX = e.offsetX; // calcul décalage entre évènement sur axe x et la bordure du canvas
        this.pointY = e.offsetY; // calcul décalage entre évènement sur axe Y et la bordure du canvas
        this.putPoint(e); // Méthode de création du dessin
    };

    /* Récupération coordonnées points Tactile */
    touch(e) {
        e.preventDefault(); // e.preventDefault() pour supprimer comportements par défaut (déplacements) évènements tactiles du navigateur
        this.pointX = e.changedTouches[0].clientX - this.canvas.getBoundingClientRect().left; // TouchObjet horizontale de la TouchList par rapport à la fenêtre - position du canvas coin gauche
        this.pointY = e.changedTouches[0].clientY - this.canvas.getBoundingClientRect().top; // TouchObjet verticale de la TouchList par rapport à la fenêtre - position du canvas coin gauche
        this.putPoint(e); // Méthode de création du dessin
    };

    // Création du dessin
    putPoint(e) {
        if (this.paint) { // Si le dessin est déclenché

            // Fonctions du context 2D
            this.ctx.lineWidth = 6; // Taille de la ligne
            this.ctx.lineCap = "round"; // Extrémités de ligne arrondies
            this.ctx.strokeStyle = "#df4b26"; // Couleur orange

            this.ctx.lineTo(this.pointX, this.pointY); // Relie dernier point du chemin aux points X,Y spécifiés par une ligne 
            this.ctx.stroke(); // Affiche le dessin du chemin
            this.ctx.beginPath(); // Initialise un tracé
            this.ctx.moveTo(this.pointX, this.pointY); // Déplace le point de départ nouveau chemin vers les positions X,Y
        }
    };

    // Comportement Dessin enclenché
    engage(e) {
        this.paint = true; // Activation du dessin 
        this.ctx.beginPath(); // Initialise un tracé
        this.putPoint(e); // Méthode de création du dessin

        this.boutonReservation.style.display = "block"; // Bouton réservation affiché
    };

    // Comportement Dessin désactivé
    disengage() {
        this.paint = false; // Désactivation du dessin
    }

    // Effacer Canvas 
    erase() {
        this.paint = false; // Désactivation du dessin
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // Rend transparent tous les pixels du rectangle du point de départ 0 (horizontal-vertical) et par la taille (hauteur-largeur) et supprime le contenu
        this.boutonReservation.style.display = "none"; // Bouton de réservation masqué
        this.eraseCanvas.style.display = "block"; // Bouton effacer affiché
    }

    // Tous les évènements souris et tactile 
    initEvents() {
        this.canvas.addEventListener("mousedown", (event) => this.engage(event)); // Au clic de la souris -> Dessin activé
        this.canvas.addEventListener("mousemove", (event) => this.mouse(event)); // Au déplacement de la souris : méthode coordonnées souris
        this.canvas.addEventListener("mouseup", () => this.disengage()); // Au relâchement de la souris  -> Dessin désactivé

        this.canvas.addEventListener("touchstart", (event) => this.engage(event)); // Au toucher -> Dessin activé
        this.canvas.addEventListener("touchmove", (event) => this.touch(event)); // Au déplacement du toucher : méthode coordonnées tactile
        this.canvas.addEventListener("touchend", () => this.disengage()); // Fin de contact -> Dessin désacivé

        /* Effacer */
        this.eraseCanvas.addEventListener("click", () => this.erase()); // Au clic sur le bouton effacer
    };
};