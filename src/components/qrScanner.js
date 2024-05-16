// Importez la bibliothèque QR Scanner
import QrScanner from 'qr-scanner';

export class qrCodeScanner {
    constructor(videoElement, image, uid) {
        this.videoElement = videoElement;
        this.image = image
        this.uid = uid
        this.qrScanner = new QrScanner(this.videoElement,
            this.handleScanResult.bind(this),
            {
                highlightScanRegion: true,
                highlightCodeOutline: true,
                maxScansPerSecond: 0.5
            })
    }

    handleScanResult(result) {
        console.log(result)
        const jsonData = JSON.parse(result.data);
        const userUid = Object.keys(jsonData.Users)[0];
        if (userUid === this.uid){
            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, '0'); // Les mois sont indexés à partir de zéro, donc on ajoute 1 et on remplit avec des zéros si nécessaire
            const day = String(today.getDate()).padStart(2, '0'); // On remplit avec des zéros si nécessaire
            const formattedDate = `${year}-${month}-${day}`;
    
            const hours = String(today.getHours()).padStart(2, '0'); // Obtient l'heure actuelle en format 24 heures
            const minutes = String(today.getMinutes()).padStart(2, '0'); // Obtient les minutes actuelles
            const timestamp = `${hours}:${minutes}`;

            return {formattedDate , timestamp}
        } else{
            alert(`Not the same Uid`)
        }
    }

    startScan() {
        this.videoElement.style.display = 'block';
        this.videoElement.style.width = "100vh";
        this.videoElement.style.height = "100vh";
        this.qrScanner.start()
    }


    stopScan() {
        this.videoElement.style.display = 'none';
        this.qrScanner.stop();
    }

    scanImage() {
        return QrScanner.scanImage(this.image, {})
        .then(result => {
            const jsonData = JSON.parse(result);
            const userUid = Object.keys(jsonData.Users)[0];
            if (userUid === this.uid){
                const today = new Date();
                const year = today.getFullYear();
                const month = String(today.getMonth() + 1).padStart(2, '0'); // Les mois sont indexés à partir de zéro, donc on ajoute 1 et on remplit avec des zéros si nécessaire
                const day = String(today.getDate()).padStart(2, '0'); // On remplit avec des zéros si nécessaire
                const formattedDate = `${year}-${month}-${day}`;
        
                const hours = String(today.getHours()).padStart(2, '0'); // Obtient l'heure actuelle en format 24 heures
                const minutes = String(today.getMinutes()).padStart(2, '0'); // Obtient les minutes actuelles
                const timestamp = `${hours}:${minutes}`;

                return {formattedDate , timestamp}
            } else{
                alert(`Not the same Uid`)
            }
        })
        .catch(error => {
            console.error(error || 'No QR code found.');
            throw error;
        });
    }
    

}
