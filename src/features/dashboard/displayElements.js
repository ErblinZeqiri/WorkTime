import imgUrl from "../../assets/images/qrcode.png";
import { getDatabase, child, ref, get } from "firebase/database";
import { qrCodeScanner } from "../../components/qrScanner";
import { UserDatabaseManager } from "../data/userDatabaseManager";

export class DisplayElements {
    constructor(user, app){
        this.user = user
        this.app = app
        this.database = getDatabase(this.app);
        this.imgUrl = imgUrl
        this.init();
    }

    init(){
        const uid = this.user.uid;
        const name = this.user.displayName.split(" ")[0];
        const firstname = this.user.displayName.split(" ")[1];
        const collection = child(ref(this.database), "Users");

        const capitalizedName =
          name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
        const capitalizedFirstName =
          firstname.charAt(0).toUpperCase() + firstname.slice(1).toLowerCase();
        const div = document.querySelector("div");

        div.innerHTML = `<h1 class="text-center">${capitalizedName} ${capitalizedFirstName}</h1> 
        <button type="button" class="addQr btn btn-outline-success">+</button>
        <button type="button" class="minimize btn btn-outline-success">-</button>
        <video></video>
        <img id="qrCodeImg" src="" style="display:block;"/>

        <label for="avatar">Choose a profile picture:</label>

        <input type="file" id="avatar" name="avatar" accept="image/png, image/jpeg, image/jpg" />
        `;

        const qr = document.querySelector(".addQr");
        const qrMin = document.querySelector(".minimize");
        const video = document.querySelector("video");
        const imageInput = document.querySelector("#qrCodeImg");
        const Input = document.querySelector("#avatar");

        const QrCodeScanner = new qrCodeScanner(video, imageInput, uid);
        video.style.display = "block";

        Input.addEventListener('change', async (event) => {
          const file = event.target.files[0];
          
          if (file) {
              const imageUrl = URL.createObjectURL(file);
              imageInput.src = imageUrl;
              const { formattedDate, 
                timestamp } = await QrCodeScanner.scanImage();
              const UserDatabase = new UserDatabaseManager(this.database, uid, formattedDate, timestamp);
              const resultDatabase = UserDatabase.updateUserEntry()

          }
      });

/*         qr.addEventListener("click", () => {
          QrCodeScanner.scanImage()
              .then(result => {
                  const userData = result.Users[uid];
                  const UserDatabase = new UserDatabaseManager(getDatabase);
                  
              })
              .catch(error => {
                  console.error("Erreur lors de la numérisation du QR code :", error);
              });
        });
      
      qrMin.addEventListener("click", () => {
        video.style.display = "none";
        QrCodeScanner.stopScan();
      }); */

      get(collection)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            for (const userId in data) {
              const userDates = data[userId];
              for (const date in userDates) {
                
                const entry = userDates[date][1];
                const exit = userDates[date][2];
                
                console.log("Heure d'entrée:", entry);
                console.log("Heure de sortie:", exit);
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
    }
}