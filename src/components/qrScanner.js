// Importez la bibliothèque QR Scanner
import QrScanner from 'qr-scanner';

export class qrCodeScanner {
    constructor(videoElement, onDecode, image) {
        this.videoElement = videoElement;
        this.onDecode = onDecode;
        this.image = image
        this.qrScanner = new QrScanner(
            this.videoElement
/*             this.handleQRCodeDecoded.bind(this),
            { 
                highlightScanRegion: true,
                highlightCodeOutline: true,
                maxScansPerSecond: 0.5
            }, */
        );
    }

    startScan() {
        this.videoElement.style.display = 'block';
        this.videoElement.style.width = "100vh"
        this.videoElement.style.height = "100vh"
        this.qrScanner.start();
    }

    stopScan() {
        this.videoElement.style.display = 'none';
        this.qrScanner.stop();
    }
    
/*     async handleQRCodeDecoded(result) {
        const jsonData = JSON.parse(result.data);
        const userId = Object.keys(jsonData)[0]; // Obtenez l'ID de l'utilisateur à partir du code QR
        const date = "2024-05-05"; // Exemple de date
        const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Obtenez l'heure actuelle
        await this.dashboardPage.updateUserEntry(date, currentTime); // Mettez à jour les données de l'utilisateur
    } */

    scanImage() {
        return QrScanner.scanImage(this.image, {})
        .then(result => {
            const jsonData = JSON.parse(result);
            return jsonData;
        })
        .catch(error => {
            console.error(error || 'No QR code found.');
            throw error;
        });
    }
    

}
