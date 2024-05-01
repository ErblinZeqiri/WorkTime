const branche = [
    "Autres commerces de détail de quincaillerie, de peintures, de matériaux de construction et de bricolage",
    "Activités des entreprises générales de construction",
    "Construction générale de bâtiments",
    "Bureaux d'ingénieurs en construction",
    "Construction de routes et autoroutes",
    "Autres travaux spécialisés de construction de bâtiments et d'ouvrages de génie civil n.c.a.",
    "Construction générale de bâtiments et d'ouvrages de génie civil sans prédominance",
    "Commerce de gros de matériaux de construction"
];

// URL de l'API ArcGIS REST Services
const apiUrl = 'https://vector.sitg.ge.ch/arcgis/rest/services/Hosted/REG_ENTREPRISE_ETABLISSEMENT/FeatureServer/0/query';

// Paramètres de la requête
const params = {
    where: '1=1',  // Condition de filtrage (ici, récupère toutes les entités)
    outFields: '*',  // Champs à récupérer (ici, tous les champs)
    f: 'json'  // Format de réponse (JSON)
};

// Construction de l'URL avec les paramètres
const url = new URL(apiUrl);
url.search = new URLSearchParams(params).toString();

// Requête Fetch
fetch(url)
    .then(response => {
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des données : ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        // Vérifier si les données de l'API sont correctement formatées
        if (!data || !data.features || !Array.isArray(data.features)) {
            throw new Error('Format de données inattendu.');
        }

        // Parcourir chaque entité
        data.features.forEach(feature => {
            // Vérifier si l'entité a l'attribut "branche"
            if (!feature.attributes || !feature.attributes.branche) {
                console.warn('L\'entreprise ne possède pas d\'attribut de branche.');
                return;
            }

            // Récupérer la branche de l'entreprise
            const brancheEntreprise = feature.attributes.branche;
            const listEntreprise = []
            // Vérifier si la branche de l'entreprise est dans la liste des branches souhaitées
            if (branche.includes(brancheEntreprise)) {
                // Récupérer le nom de l'entreprise
                const nomEntreprise = feature.attributes.raison_sociale;
                // Afficher le nom de l'entreprise dans la console
                console.log(nomEntreprise);
                listEntreprise.push(nomEntreprise);
            }
        });
    })
    .catch(error => {
        console.error('Une erreur est survenue :', error);
    });


    document.addEventListener("DOMContentLoaded", () => {
        const dropdown = document.querySelector(".dropdown");
        const searchInput = document.getElementById("searchInput");
        const dropdownOptions = document.querySelectorAll(".dropdown-content a");
      
        searchInput.addEventListener("click", (event) => {
          dropdown.classList.add("show");
          event.stopPropagation();
        });
      
        // Ajoute un gestionnaire de clic au dropdown pour empêcher sa fermeture lorsqu'on clique dedans
        dropdown.addEventListener("click", (event) => {
          event.stopPropagation();
        });
      
        // Fonction pour fermer le dropdown
        const dropdownClose = () => {
            dropdown.classList.remove("show");
        };

        // Ajoute un gestionnaire d'événement au document pour masquer le dropdown lorsque l'utilisateur clique à l'extérieur de celui-ci
        document.addEventListener("click", dropdownClose);

        // Ajoute un gestionnaire d'événement pour chaque option du dropdown
        dropdownOptions.forEach((option) => {
            option.addEventListener("click", () => {
                // Récupére le texte de l'option cliquée
                const selectedOption = option.textContent;
                // Fait quelque chose avec l'option sélectionnée, par exemple affichez-la dans la console
                searchInput.value = selectedOption;
                searchInput.classList.remove("dropdown-content");
                // Ferme le dropdown
                dropdownClose();
            });
        });

      });
      