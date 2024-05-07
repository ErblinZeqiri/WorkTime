// Importez la bibliothèque QR Scanner
import QrScanner from 'qr-scanner';

export class qrCodeScanner{
    constructor(videoElem) {
        this.videoElem = videoElem
        this.init();
    }

    async init() {
        try {
            // Créez une nouvelle instance de QrScanner
            const qrScanner = new QrScanner(
                this.videoElem,
                result => console.log('decoded qr code:', result),
                { /* your options or returnDetailedScanResult: true if you're not specifying any other options */ },
            );
            qrScanner.start();

            // Arrêtez le scan
            //qrScanner.stop();
        } catch (error) {
            console.error('Erreur lors du scan:', error);
        }
    }

}
