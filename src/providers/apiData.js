export class ApiConnexion {
  // Définit la méthode pour établir une connexion à l'API
  ApiConnexion() {
    // Définit l'URL de l'API
    const apiUrl =
      "https://vector.sitg.ge.ch/arcgis/rest/services/Hosted/REG_ENTREPRISE_ETABLISSEMENT/FeatureServer/0/query";

    // Définit les paramètres de la requête
    const params = {
      where: "1=1",
      outFields: "*",
      f: "json",
    };

    // Construit l'URL avec les paramètres
    const url = new URL(apiUrl);
    url.search = new URLSearchParams(params).toString();

    // Effectue la requête Fetch
    return fetch(url).then((response) => {
      if (!response.ok) {
        throw new Error(
          "Erreur lors de la récupération des données : " + response.statusText
        );
      }
      return response.json();
    });
  }
}

export class fillOption {
  // Initialise la classe avec le champ de recherche et les données
  constructor(searchInput, data) {
    this.searchInput = searchInput;
    this.data = data;
  }

  // Remplit les options du dropdown avec les données
  fillOption() {
    // Vérifie si les données sont au format attendu
    if (
      !this.data ||
      !this.data.features ||
      !Array.isArray(this.data.features)
    ) {
      throw new Error("Format de données inattendu.");
    }

    // Trie les données par ordre alphabétique
    this.data.features.sort((a, b) => {
      const textA = a.attributes.raison_sociale.toUpperCase();
      const textB = b.attributes.raison_sociale.toUpperCase();
      if (textA < textB) return -1;
      if (textA > textB) return 1;
      return 0;
    });

    // Sélectionne le conteneur des options du dropdown
    const dropdownInput = document.querySelector(".dropdown-content");
    const dropdown = document.querySelector(".dropdown");

    // Crée une option pour chaque entité dans les données
    this.data.features.forEach((feature) => {
      const option = document.createElement("a");
      option.href = "#";
      option.textContent = feature.attributes.raison_sociale;

      // Ajoute une classe à l'option
      option.classList.add("dropdown-option");

      // Ajoute un gestionnaire d'événement au clic sur l'option
      option.addEventListener("click", () => {
        const selectedOption = option.textContent;
        // Met à jour la valeur du champ de recherche avec l'option sélectionnée
        this.searchInput.value = selectedOption;
        // Ferme le dropdown
        new dropdownClose(dropdown).dropdownClose();
      });

      // Ajoute l'option au dropdown
      dropdownInput.appendChild(option);
    });
  }
}

export class dropdownClose {
  // Initialise la classe avec le dropdown à fermer
  constructor(dropdown) {
    this.dropdown = dropdown;
  }

  // Ferme le dropdown en supprimant la classe 'show'
  dropdownClose() {
    this.dropdown.classList.remove("show");
  }
}

export class eventHandler {
  // Initialise la classe avec les éléments nécessaires pour gérer les événements
  constructor(searchInput, dropdown, dropdownOptions, inputs) {
    this.searchInput = searchInput;
    this.dropdown = dropdown;
    this.dropdownOptions = dropdownOptions;
    this.inputs = inputs;
  }

  // Initialise les gestionnaires d'événements
  initEvents() {
    document.addEventListener("DOMContentLoaded", () => {
      // Vide les champs
      this.searchInput.value = "";
      this.inputs.forEach((e) => (e.value = ""));

      // Ajoute un gestionnaire d'événement pour ouvrir le dropdown
      this.searchInput.addEventListener("click", (event) => {
        this.dropdown.classList.add("show");
        event.stopPropagation();
      });

      // Empêche la propagation des événements du dropdown
      this.dropdown.addEventListener("click", (event) => {
        event.stopPropagation();
      });

      // Ajoute un gestionnaire d'événement pour fermer le dropdown lorsque l'utilisateur clique à l'extérieur
      document.addEventListener("click", () => {
        // Utilise une fonction fléchée pour conserver la portée de 'this'
        new dropdownClose(this.dropdown).dropdownClose();
      });

      // Ajoute un gestionnaire d'événement pour chaque option du dropdown
      this.dropdownOptions.forEach((option) => {
        option.addEventListener("click", () => {
          const selectedOption = option.textContent;
          // Met à jour la valeur du champ de recherche avec l'option sélectionnée
          this.searchInput.value = selectedOption;
          // Supprime la classe 'show' pour fermer le dropdown
          new dropdownClose(this.dropdown).dropdownClose();
        });
      });
    });
  }
}
