/****************************************** RESERVATION **********************************************/

class Reservation {
    constructor(duration) {
        this.boutonResa = document.getElementById("reservation"); // Bouton de réservation canvas
        this.effacerCanvas = document.getElementById("effacer"); // Bouton effacer canvas
        this.places = document.getElementById("places"); // Nombre de place(s) dispo(s) DOM
        this.velos = document.getElementById("velos"); // Nombre de vélo(s) dispo(s) DOM
        this.nom = document.getElementById("nom"); // Input nom DOM
        this.prenom = document.getElementById("prenom"); // Input prénom DOM
        this.conteneurTimer = document.getElementById("conteneur_timer"); // Conteneur résa
        this.paraResa = document.getElementById("paraResa"); // Paragraphe Résa DOM
        this.paraResa2 = document.getElementById("paraResa2"); // Paragraphe Résa DOM
        this.paraResa3 = document.getElementById("paraResa3"); // Paragraphe Résa DOM
        this.stopTimer = document.getElementById("boutonStop"); // Bouton annulation réservation

        this.duration = duration; // Temps de réservation : décompte

    }

    // Affichage selon état réservation
    systemResa() {
        // Condition en cas d'actualisation avec résa active
        if (sessionStorage.getItem("fin")) {
            this.startResa(); // Enclenchement résersation
        }

        // Au clic sur le bouton réserver du canvas
        this.boutonResa.addEventListener("click", () => {
            // Si Il y a déja une resa
            if (sessionStorage.getItem("fin")) {
                // Boîte dialogue avec choix 
                if (confirm("Vous effectuez une nouvelle réservation à la station " + sessionStorage.getItem("station") + ". Après confirmation, la réservation à la station " + sessionStorage.getItem("precStation") + " sera annulée.")) {
                    // Ok -> confirmation
                    clearInterval(this.timeInterval); // Arrêt décompte
                    this.baseResa(); // Méthode base enclenchement réservation
                }
            } else { // Sinon (première Resa)
                this.baseResa(); // Méthode base enclenchement réservation
            }

        });
    };

    // Base Enclenchement résersation
    baseResa() {
        sessionStorage.setItem("precStation", sessionStorage.getItem("station")); // Mémorisation station réservée

        // Obtention et Mémorisation d'un temps final de résa
        this.endTime = new Date(Date.now() + this.duration);
        sessionStorage.setItem("fin", this.endTime);

        this.startResa(); // Enclenchement résersation
    };

    // Enclenchement résersation
    startResa() {
        // Affichage bloc résa
        this.effacerCanvas.style.display = "none"; // Bouton effacer canvas masqué
        this.conteneurTimer.style.display = "block"; // Affichage du bloc réservation
        this.paraResa.style.display = "block"; //  Affichage para : Réservation Bicycle à la station ... au nom de ... ....
        this.paraResa.innerHTML = "Vous avez réservé un <strong>BICYCLE</strong> à la station " + sessionStorage.getItem("precStation") + " au nom de " + localStorage.getItem("nom") + " " + localStorage.getItem("prénom") + ".";
        this.paraResa2.style.display = "block"; // Affichage paragraphe 2 pour le décompte
        this.paraResa3.innerHTML = "<strong>BICYCLE</strong> vous remercie et vous souhaîte un bon trajet !";
        this.stopTimer.style.display = "block"; // Bouton annulation réservation visible

        this.countDownResa(); // Décompte
        this.infosForm(); // Méthode affichage infos place et vélo après résa
    };

    // Décompte
    countDownResa() {
        let timeLeft = new Date(new Date(sessionStorage.getItem("fin")) - new Date()); // Obtention temps restant : heure actuelle - temps final
        this.sec = timeLeft.getSeconds();
        this.min = timeLeft.getMinutes();

        if (this.sec < 10) { // Si les secondes sont inférieurs à 10
            this.sec = "0" + this.sec; // Affichage d'un 0 pour le style du décompte
        }
        if (this.min < 10) { // Si les minutes sont inférieurs à 10
            this.min = "0" + this.min; // Affichage d'un 0 pour le style du décompte
        }

        this.paraResa2.innerHTML = "Temps restant : " + this.min + " minutes " + this.sec + " secondes."; // Affichage du décompte dans le DOM

        this.timeInterval = setInterval(() => this.countDownResa(), 1000); // Lancement décompte

        if ((this.min <= 0) && (this.sec <= 0)) { // Si les minutes et secondes sont inférieures ou égales à 0
            this.endResa(); // Fin Résa
        }
    };

    // Annulation résa 
    stopResa() {
        this.stopTimer.addEventListener("click", () => {
            this.endResa(); // Méthode Fin de réservation
        });
    };

    // Fin de réservation
    endResa() {
        clearInterval(this.timeInterval); // Arrêt décompte
        this.paraResa.style.display = "none"; // Premier paragraphe masqué
        this.paraResa2.style.display = "none"; // Deuxième paragraphe masqué
        this.paraResa3.innerHTML = "Nous vous remercions pour votre visite, à bientôt sur <strong>BICYCLE</strong> Nantes Métropole !";
        this.stopTimer.style.display = "none"; // Bouton annulation résa masqué

        sessionStorage.clear(); // Plus de résa = suppression données sessionStorage
    };

    // Méthode pour affichage changement nombre vélo et place après résa
    infosForm() {

        let numberVelo = parseInt(sessionStorage.getItem("velo")) - 1; // Renvoie un entier du sessionStorage nombre de vélo - 1 
        let numberPlace = parseInt(sessionStorage.getItem("place")) + 1; // Renvoie un entier du sessionStorage nombre de place + 1 

        // Mémorisation modification sessionStorage
        sessionStorage.velo = numberVelo;
        sessionStorage.place = numberPlace;

        // Affichage dans DOM nouveau nombre de vélo et place
        this.velos.innerHTML = numberVelo + " vélo(s) disponible(s)";
        this.places.innerHTML = numberPlace + " place(s) disponible(s)";

        if (sessionStorage.getItem("velo") >= 5) {
            this.velos.style.color = "black"; // Écriture en noire
        } else if (sessionStorage.getItem("velo") > 0) {
            this.velos.style.color = "#E06517"; // Écriture en orange
        } else {
            this.velos.style.color = "red"; // Écriture en rouge
        }

        if (sessionStorage.getItem("place") >= 5) {
            this.places.style.color = "black"; // Écriture en noire
        } else if (sessionStorage.getItem("place") > 0) {
            this.places.style.color = "#E06517"; // Écriture en orange
        } else {
            this.places.style.color = "red"; // Écriture en rouge
        }
    };

    // Pré-remplissage pour pro navigation
    localStorage() {
        if (localStorage.getItem('nom') !== "") { // Si localStorage pour nom strictement différent de vide
            this.nom.value = localStorage.getItem('nom'); // nom localStorage en valeur de l'input nom
        };
        if (localStorage.getItem('prénom') !== "") { // Si localStorage pour prénom strictement différent de vide 
            this.prenom.value = localStorage.getItem('prénom'); // Prénom localStorage en valeur de l'input prénom
        }
    };
};