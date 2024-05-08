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
import { QRCodeGen } from "../../components/qrCodeGenerator";

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

    onAuthStateChanged(getAuth(app), (user) => {
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
        `;

        const qr = document.querySelector(".addQr");
        const qrMin = document.querySelector(".minimize");
        const video = document.querySelector("video");

        const handleQRCodeDecoded = (result) => {
          console.log(result)
        };

        // Créez une instance de QRCodeGen
        const qrCodeGen = new QRCodeGen();

        // Appelez la méthode init de QRCodeGen
        qrCodeGen.init();

        // Sélectionnez l'élément img où vous voulez afficher le QR code
        const qrCodeImg = document.querySelector('#qrCodeImg');

        // Définir l'URL de l'image générée comme source de l'élément img
        qrCodeImg.src = './qrCode.png';

        const QrCodeScanner = new qrCodeScanner(video, handleQRCodeDecoded);
        video.style.display = 'block';

        qr.addEventListener("click", () => {
          video.style.display = 'block';
          QrCodeScanner.startScan();
        });

        qrMin.addEventListener("click", () => {
          video.style.display = 'none';
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
