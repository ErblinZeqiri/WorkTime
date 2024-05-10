import { ref, set, get } from "firebase/database";

export class UserDatabaseManager {
    constructor(database) {
        this.database = database;
    }

    async updateUserEntry(userId, date, entryTime) {
        const userRef = ref(child(this.database, "Users", userId, date));
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
            const entry = snapshot.val().Entrée;
            if (entry) {
                // Si une entrée existe déjà, mettez à jour comme sortie
                await set(userRef, { Sortie: entryTime });
            } else {
                // Si pas d'entrée existante, mettez à jour comme entrée
                await set(userRef, { Entrée: entryTime });
            }
        } else {
            // Si la date n'existe pas, créez-la et ajoutez l'entrée
            await set(userRef, { Entrée: entryTime });
        }
    }
}

