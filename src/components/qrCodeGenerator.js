import QRCode from "qrcode";

export class QRCodeGen {
  constructor() {
    // Données JSON
    this.jsonData = {
      Users: {
        SbXtmXZeApPlq0lqtkjGfHjLWgY2: {
          "2024-05-05": {
            Entrée: "08:00",
            Sortie: "12:00",
          },
        },
      },
    };
  }

  async init() {
    // Convertir les données JSON en chaîne JSON
    const jsonString = JSON.stringify(this.jsonData);

    try {
      // Générer le QR code à partir de la chaîne JSON
      const qrDataURL = await QRCode.toDataURL(jsonString, {
        width: 600,
        color: {
          dark: "#000",
          light: "#fff"
        }
      });

      return qrDataURL;
    } catch (err) {
      console.error("Error generating QR code:", err);
      throw err;
    }
  }
}

/* // Créer une instance de QRCodeGen
const qrCodeGen = new QRCodeGen();

// Générer le QR code
const qrDataURL = await qrCodeGen.init();

// Sélectionner l'élément img où vous voulez afficher le QR code
const qrCodeImg = document.querySelector('#qrCodeImg');

// Définir l'URL de l'image générée comme source de l'élément img
qrCodeImg.src = qrDataURL;*/
