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
import { qrCodeScanner } from "../../components/qrScanner";
// import { QRCodeGen } from "../../components/qrCodeGenerator";

export class DashboardPage {
  constructor() {
    const firebase = new firebaseConfig();
    const app = firebase.getApp();
    this.user = getAuth(app).currentUser;
    this.init();
  }

  init() {
    const firebase = new firebaseConfig();
    const app = firebase.getApp();

    onAuthStateChanged(getAuth(app), async (user) => {
      if (user) {
        const uid = user.uid;
        const name = user.displayName.split(" ")[0];
        const firstname = user.displayName.split(" ")[1];

        const capitalizedName =
          name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
        const capitalizedFirstName =
          firstname.charAt(0).toUpperCase() + firstname.slice(1).toLowerCase();
        const div = document.querySelector("div");

        div.innerHTML = `<h1 class="text-center">${capitalizedName} ${capitalizedFirstName}</h1> 
        <button type="button" class="addQr btn btn-outline-success">+</button>
        <button type="button" class="minimize btn btn-outline-success">-</button>
        <video></video>
        <img id="qrCodeImg"></img>

        <label for="avatar">Choose a profile picture:</label>

        <input type="file" id="avatar" name="avatar" accept="image/png, image/jpeg" />
        `;

        const qr = document.querySelector(".addQr");
        const qrMin = document.querySelector(".minimize");
        const video = document.querySelector("video");

        const handleQRCodeDecoded = (result) => {
          const jsonData = JSON.parse(result.data);
          const qrUser = Object.keys(jsonData)[0];
          console.log(qrUser);
          const qrUid = qrUser;
          console.log(qrUid);
          for (let i in jsonData) {
            /*  console.log(jsonData)
            console.log(i) */
          }
        };

        const QrCodeScanner = new qrCodeScanner(video, handleQRCodeDecoded);
        video.style.display = "block";
        
        qr.addEventListener("click", () => {
            QrCodeScanner.startScan();
        });

        qrMin.addEventListener("click", () => {
          video.style.display = "none";
          QrCodeScanner.stopScan();
        });

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
                  div.insertAdjacentHTML(
                    "afterend",
                    `
                 <div class="dropdown">
                     <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                         ${date}
                     </button>
                     <ul class="dropdown-menu dropdown-menu-up">
                         <li><a class="dropdown-item" href="#">Entrée: ${entry}</a></li>
                         <li><a class="dropdown-item" href="#">Sortie: ${exit}</a></li>
                     </ul>
                 </div>
                 `
                  );
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
