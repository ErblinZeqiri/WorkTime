import QRCode from 'qrcode';

export class QRCodeGen{
    constructor(){
        // Données JSON
        this.jsonData = {
            "Users": {
            "SbXtmXZeApPlq0lqtkjGfHjLWgY2": {
                "2024-05-05": {
                "Entrée": "08:00",
                "Sortie": "12:00"
                }
            }
            }
        };
    }
    
    init(){
        // Convertir les données JSON en chaîne JSON
        const jsonString = JSON.stringify(this.jsonData);

        // Générer le QR code à partir de la chaîne JSON
        QRCode.toFile('qrCode.png', jsonString, function (err) {
            if (err) {
                console.error('Error generating QR code:', err);
            } else {
                console.log('QR code saved as qrCode.png');
            }
        });
    }
}

