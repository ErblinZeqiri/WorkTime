const dropdown = document.querySelector(".dropdown");
const searchInput = document.getElementById("searchInput");

// URL de l'API ArcGIS REST Services
const apiUrl =
  "https://vector.sitg.ge.ch/arcgis/rest/services/Hosted/REG_ENTREPRISE_ETABLISSEMENT/FeatureServer/0/query";

// Paramètres de la requête
const params = {
  where: "1=1", // Condition de filtrage (ici, récupère toutes les entités)
  outFields: "*", // Champs à récupérer (ici, tous les champs)
  f: "json", // Format de réponse (JSON)
};

// Construction de l'URL avec les paramètres
const url = new URL(apiUrl);
url.search = new URLSearchParams(params).toString();

// Requête Fetch
fetch(url)
  .then((response) => {
    if (!response.ok) {
      throw new Error(
        "Erreur lors de la récupération des données : " + response.statusText
      );
    }
    return response.json();
  })
  .then((data) => {
    // Vérifier si les données de l'API sont correctement formatées
    if (!data || !data.features || !Array.isArray(data.features)) {
      throw new Error("Format de données inattendu.");
    }

    // Après avoir récupéré les données et avant de créer les options
    data.features.sort((a, b) => {
      // Tri des options par ordre alphabétique en utilisant le texte des attributs
      const textA = a.attributes.raison_sociale.toUpperCase();
      const textB = b.attributes.raison_sociale.toUpperCase();
      if (textA < textB) return -1;
      if (textA > textB) return 1;
      return 0;
    });

    const dropdownInput = document.querySelector(".dropdown-content");
    data.features.forEach((feature) => {
      // Créer un élément <a> pour chaque option
      const option = document.createElement("a");
      option.href = "#";
      option.textContent = feature.attributes.raison_sociale; // Définir le texte de l'option

      // Ajouter une classe au lien pour le styliser si nécessaire
      option.classList.add("dropdown-option");

      // Ajouter un gestionnaire d'événement au clic sur l'option
      option.addEventListener("click", () => {
        // Récupérer le texte de l'option cliquée
        const selectedOption = option.textContent;
        // Ajout de l'option sélectionné dans le champs
        searchInput.value = selectedOption;
        // Fermer le dropdown
        dropdownClose();
      });

      // Ajouter l'option au conteneur du dropdown
      dropdownInput.appendChild(option);
    });
  })

  .catch((error) => {
    console.error("Une erreur est survenue :", error);
  });

// Fonction pour fermer le dropdown
const dropdownClose = () => {
  dropdown.classList.remove("show");
};

document.addEventListener("DOMContentLoaded", () => {
  const dropdown = document.querySelector(".dropdown");
  const searchInput = document.getElementById("searchInput");
  const dropdownOptions = document.querySelectorAll(".dropdown-content a");
  const inputs = document.querySelectorAll('.input')
  console.log(inputs.forEach(e=>console.log(e.value)))

     // Vide les champs
     searchInput.value = '';
     inputs.forEach(e=> e.value = '');

  searchInput.addEventListener("click", (event) => {
    dropdown.classList.add("show");
    event.stopPropagation();
  });

  // Ajoute un gestionnaire de clic au dropdown pour empêcher sa fermeture lorsqu'on clique dedans
  dropdown.addEventListener("click", (event) => {
    event.stopPropagation();
  });

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
