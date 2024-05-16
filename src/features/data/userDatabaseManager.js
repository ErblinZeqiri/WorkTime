import { ref, update, get, child } from "firebase/database";

export class UserDatabaseManager {
    constructor(database, userId, date, entryTime) {
        this.database = database;
        this.userId = userId;
        this.date = date;
        this.entryTime = entryTime;
    }

    async updateUserEntry() {
        const userRef = child(ref(this.database), `Users/${this.userId}/Dates/${this.date}`);

        // Vérifie si l'entrée pour cette date existe déjà
        const snapshot = await get(userRef);

        if (snapshot.exists()) {
            const data = snapshot.val();
            let updateData = {};

            // Récupérer les clés existantes
            const keys = Object.keys(data);

            // Trouver l'index maximum parmi les clés existantes
            const maxIndex = keys.length > 0 ? Math.max(...keys.map(key => parseInt(key))) : 0;

            // Déterminer le prochain index
            const nextIndex = maxIndex + 1;

            // Créer la nouvelle clé avec l'index incrémenté
            const newKey = nextIndex.toString();

            // Ajouter la nouvelle clé avec l'heure d'entrée à l'objet de mise à jour
            updateData[newKey] = this.entryTime;

            // Mettre à jour la base de données avec les données générées
            await update(userRef, updateData);
        } else {
            // Si la date n'existe pas, créez-la et ajoutez l'entrée
            await update(userRef, { "1": this.entryTime });
        }
    }
}
