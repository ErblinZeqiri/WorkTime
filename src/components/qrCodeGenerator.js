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
