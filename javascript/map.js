/********************************* Map ****************************************/

class Map {
    constructor(lat, long, apiKey) {
        this.map = document.getElementById("map"); // Carte DOM
        this.legende = document.getElementById("legende_map"); // Légende map
        this.conteneurBlocks = document.getElementById("conteneur_blocks"); // Conteneur blocks formulaire/signature
        this.station = document.getElementById("station"); // Station DOM
        this.adresse = document.getElementById("adresse"); // Adresse DOM
        this.places = document.getElementById("places"); // Nombre place(s) dispo(s) DOM
        this.velos = document.getElementById("velos"); // Nombre de vélo(s) dispo(s) DOM
        this.form = document.getElementById("form"); // Formulaire DOM
        this.blockSignature = document.getElementById("block_signature"); // Panneau pour signature canvas
        this.regex = /[^(a-zA-ZàâéèêëîïôùûçæœÀÂÉÈÊËÎÏÔÙÛÇÆŒ\s\')$]/g; // Regex pour supprimer caractères spéciaux et chiffres devant nom stations 

        this.lieu = [lat, long]; // Lieu map

        this.mapy = L.map("map").setView(this.lieu, 14); // Objet L leaflet avec un setView pour les coordonnées de Nantes et le zoom

        this.tile = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            maxZoom: 16,
            minZoom: 13,
        }).addTo(this.mapy); // Méthode leaflet pour ajout calque à la carte 

        this.colorIcon = L.Icon.extend({
            options: {
                iconSize: [35, 35],
                shadowSize: [35, 35],
                iconAnchor: [22, 94],
                shadowAnchor: [4, 62],
                popupAnchor: [-3, -76]
            }
        }); // Méthode leaflet pour créer classe de marqueurs

        // Création des marqueurs à partir de colorIcon
        this.greenIcon = new this.colorIcon({
            iconUrl: 'images/green.png'
        });
        this.orangeIcon = new this.colorIcon({
            iconUrl: 'images/orange.png'
        });
        this.redIcon = new this.colorIcon({
            iconUrl: 'images/red.png'
        });

        this.init(apiKey); // Méthode affichage carte/marqueurs/bloc infos
    }

    // Méthode affichage carte/marqueurs/bloc infos
    init(apiKey) {
        // Appel AJAX pour récupération données stations JC Decaux
        ajaxGet(apiKey, (reponse) => {
            let stations = JSON.parse(reponse); // retourne données JSON 

            // Pour chaque station du tableau des stations
            for (let station of stations) {

                this.sessionStorage(station);

                // MARQUEURS 
                if ((sessionStorage.getItem("statut") === "OPEN") && (sessionStorage.getItem("velo") >= 5)) {
                    let stationMarker = L.marker([station.position.lat, station.position.lng], {
                        icon: this.greenIcon
                    }).addTo(this.mapy); // Ajout des marqueurs verts à la map si station ouverte et 5 ou + de vélos dispos

                    stationMarker.addEventListener("click", () => { // Au clic sur un marqueur vert
                        this.designVert(station); // Méthode designVert
                    });
                } else if ((sessionStorage.getItem("statut") === "OPEN") && (sessionStorage.getItem("velo") > 0)) {
                    let stationMarker = L.marker([station.position.lat, station.position.lng], {
                        icon: this.orangeIcon
                    }).addTo(this.mapy); // Ajout des marqueurs oranges à la map pour station ouverte - de 5 vélos disponibles 

                    stationMarker.addEventListener("click", () => { // Au clic sur un marqueur orange
                        this.designOrange(station); // Méthode designOrange
                    });
                } else { //Sinon 
                    let stationMarker = L.marker([station.position.lat, station.position.lng], {
                        icon: this.redIcon
                    }).addTo(this.mapy); // Ajout des markeurs rouges à la map pour vélos indispos/station fermée 
                    stationMarker.addEventListener("click", () => { // Au clic sur un marqueur rouge
                        this.designRouge(station); // Méthode designRouge
                    });

                }
            }
        });

    };

    // Design général marqueurs
    designMarker(station) {
        this.conteneurBlocks.style.display = "block"; // Affichage conteneur des blocks 
        this.legende.style.marginLeft = "5%"; // Marge gauche du bloc légende

        this.sessionStorage(station);
        this.station.innerHTML = sessionStorage.getItem("station"); // Insertion nom station/Méthode replace pour regExp qui retire chiffres/caractères spéciaux précédent nom station
        this.adresse.innerHTML = sessionStorage.getItem("adresse"); // Insertion adresse station en minuscule
        this.places.innerHTML = sessionStorage.getItem("place") + " places disponible(s)"; // Insertion nombre de place(s) dispo(s)
        this.velos.innerHTML = sessionStorage.getItem("velo") + " vélos disponible(s)"; // Insertion nombre de vélo(s) dispo(s)
        this.availablePlace(station);

        // Canvas Masqué pour affichage réservation sur réservation
        this.blockSignature.style.display = "none";
    };

    // Design marqueurs verts
    designVert(station) {
        this.designMarker(station);
        this.velos.style.color = "black"; // Écriture en noire
        this.form.style.display = "block"; // // Affichage du formulaire
    };

    // Design marqueurs oranges
    designOrange(station) {
        this.designMarker(station);
        this.velos.style.color = "#E06517"; // Écriture en orange
        this.form.style.display = "block"; // // Affichage du formulaire
    };

    // Design marqueurs rouges
    designRouge(station) {
        this.designMarker(station);
        this.form.style.display = "none"; // Pas de réservation de vélo possible
        this.velos.style.color = "red"; // Écriture en rouge

        // Si Statut Station fermé
        if (sessionStorage.getItem("statut") !== "OPEN") {
            this.station.innerHTML = sessionStorage.getItem("station") + "<span id='spanStatus'> STATION FERMÉE</span>";
            this.spanStatus = document.getElementById("spanStatus"); // Span statut fermé DOM
            this.spanStatus.style.color = "red"; // Span statut fermé en rouge
            this.spanStatus.style.fontSize = "10px"; // Span statut fermé taille
            this.spanStatus.style.fontWeight = "bold"; // Span statut fermé en gras
        } else {
            this.station.innerHTML = sessionStorage.getItem("station"); // Sinon affichage simple nom station
        }
    };

    // Affichage Place(s) disponible(s)
    availablePlace(station) {
        this.sessionStorage(station);
        if (sessionStorage.getItem("place") >= 5) {
            this.places.style.color = "black"; // Écriture en noire
        } else if (sessionStorage.getItem("place") > 0) {
            this.places.style.color = "#E06517"; // Écriture en orange
        } else {
            this.places.style.color = "red"; // Écriture en rouge
        }
    }

    sessionStorage(station) {
        sessionStorage.setItem("station", station.name.replace(this.regex, "").trim()); // Mémorisation nom station navigateur
        sessionStorage.setItem("statut", station.status); // Mémorisation statut station navigateur
        sessionStorage.setItem("adresse", station.address.toLowerCase()); // Mémorisation adresse station navigateur
        sessionStorage.setItem("velo", station.available_bikes); // Mémorisation nombre vélo dispo navigateur
        sessionStorage.setItem("place", station.available_bike_stands); // Mémorisation nombre de place dispo navigateur
    };

}