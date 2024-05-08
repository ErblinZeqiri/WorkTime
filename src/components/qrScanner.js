// Importez la bibliothèque QR Scanner
import QrScanner from 'qr-scanner';

export class qrCodeScanner {
    constructor(videoElement, onDecode) {
        this.videoElement = videoElement;
        this.onDecode = onDecode;
        this.qrScanner = new QrScanner(
            this.videoElement,
            this.handleQRCodeDecoded.bind(this),
            { 
                highlightScanRegion: true,
                highlightCodeOutline: true,
                maxScansPerSecond: 0.5
            },
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
    
    handleQRCodeDecoded(result) {
        
        this.onDecode(result);
    }

}
