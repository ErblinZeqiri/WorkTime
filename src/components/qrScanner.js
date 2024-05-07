// Importez la bibliothèque QR Scanner
import QrScanner from 'qr-scanner';

export class qrCodeScanner{
    constructor(videoElement) {
        this.videoElement = videoElement        
        this.qrScanner = new QrScanner(this.videoElement, {
            onDecode: result => {
                console.log('Code QR décodé :', result);
            }
        });
    }

    startScan() {
        this.qrScanner.start();
    }

    stopScan() {
        this.qrScanner.stop();
    }

}
