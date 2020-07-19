/***                                     MAIN                                   ***/

/********************************* Slider ****************************************/
let objetSlider = new Slider(["images/img1.png", "images/img2.png", "images/img3.png", "images/img4.png"], ["COMMENT JE RÉSERVE UN BICYCLE ?", "JE SÉLECTIONNE MA STATION", "JE SAISIS MES INFORMATIONS", "MON BICYCLE EST RÉSERVÉ"], 5000); // Instanciation de l'objet Slider, arguments : tableau images, tableau textes, intervalles en ms

/********************************* MAP ****************************************/
let objetMap = new Map(47.2186371, -1.5541362, "apikey"); // Instanciation de l'objet Map, arguments : coordonnées géo et clé d'API contrat Nantes

/********************************* Canvas ****************************************/
let objetCanvas = new Canvas(); // Instanciation de l'objet Canvas
objetCanvas.signature(); // Méthode enclenchement signature

/*********************************  RESA *****************************************/
let objetResa = new Reservation(20 * 60 * 1000); // Instanciation de l'objet Reservation, arguments : temps décompte en ms
objetResa.systemResa(); // Méthode qui déclenche le système de réservation
objetResa.stopResa(); // Méthode annulation réservation
objetResa.localStorage(); // Méthode Pré-remplissage pour pro navigation