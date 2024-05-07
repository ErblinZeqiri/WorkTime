import { getAuth, onAuthStateChanged } from "firebase/auth";
import { firebaseConfig } from "../../providers/firebaseConfig";
import {
  getDatabase,
  set,
  ref,
  push,
  get,
  onValue,
  child,
} from "firebase/database";

export class DashboardPage {
  constructor() {
    this.init();
  }

  init() {
    const firebase = new firebaseConfig();
    const app = firebase.getApp();
    onAuthStateChanged(getAuth(app), (user) => {
      if (user) {
        const uid = user.uid;
        const name = user.displayName.split(" ")[0];
        const firstname = user.displayName.split(" ")[1];

        const capitalizedName =
          name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
        const capitalizedFirstName =
          firstname.charAt(0).toUpperCase() + firstname.slice(1).toLowerCase();

        document.querySelector(
          "div"
        ).innerHTML = `<h1 class="text-center">${capitalizedName} ${capitalizedFirstName}</h1> 
        <button type="button" class="btn btn-outline-success">+</button>
        `;

        const database = getDatabase(app);
        const collection = child(ref(database), "Users");

        get(collection)
          .then((snapshot) => {
            if (snapshot.exists()) {
              const data = snapshot.val();
              for (const userId in data) {
                const userDates = data[userId];
                for (const date in userDates) {
                  const entry = userDates[date].Entrée;
                  const exit = userDates[date].Sortie;
                  document.querySelector("div").innerHTML += `
                    <div class="dropdown">
                        <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            ${date}
                        </button>
                        <ul class="dropdown-menu dropdown-menu-up">
                            <li><a class="dropdown-item" href="#">Entrée: ${entry}</a></li>
                            <li><a class="dropdown-item" href="#">Sortie: ${exit}</a></li>
                        </ul>
                    </div>
                    `;
                }
              }
            } else {
              document.querySelector(
                "div"
              ).innerHTML += `<h2 class="text-center">Pas d'heures enregistré</h2>`;
            }
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        window.location.href = "/index.html";
      }
    });
  }
}
