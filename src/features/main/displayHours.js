
export class displayHours {
    constructor() {
    }

    init(){
        // Récupère la réponse du stockage local
        const response = JSON.parse(localStorage.getItem('loginResponse'));
        console.log("Response from Login class:", response);
    }
}