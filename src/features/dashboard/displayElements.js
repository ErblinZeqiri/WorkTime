import imgUrl from "../../assets/images/qrcode.png";
import { getDatabase, child, ref, get } from "firebase/database";
import { qrCodeScanner } from "../../components/qrScanner";
import { UserDatabaseManager } from "../data/userDatabaseManager";

export class DisplayElements {
  constructor(user, app) {
    this.user = user;
    this.app = app;
    this.database = getDatabase(this.app);
    this.imgUrl = imgUrl;
    this.init();
  }

  init() {
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

    Input.addEventListener("change", async (event) => {
      const file = event.target.files[0];

      if (file) {
        const imageUrl = URL.createObjectURL(file);
        imageInput.src = imageUrl;
        const { formattedDate, timestamp } = await QrCodeScanner.scanImage();
        const UserDatabase = new UserDatabaseManager(
          this.database,
          uid,
          formattedDate,
          timestamp
        );
        const resultDatabase = UserDatabase.updateUserEntry();
      }
    });

    qr.addEventListener("click", async  () => {
      try {
        const { formattedDate, timestamp } = await QrCodeScanner.startScan();
          const UserDatabase = new UserDatabaseManager(
              this.database,
              uid,
              formattedDate,
              timestamp
          );
          const resultDatabase = UserDatabase.updateUserEntry();
      } catch (error) {
          console.error("Erreur lors de la numérisation QR :", error);
      }
  });

    qrMin.addEventListener("click", () => {
      video.style.display = "none";
      QrCodeScanner.stopScan();
    });

    get(collection)
      .then((snapshot) => {
        const userObject = snapshot.val();
        let userHasData = false;
        for (const key in userObject) {
          if (key === uid) {
            userHasData = true;
            break;
          }
        }
        if (userHasData) {
          Object.keys(userObject).forEach((userId) => {
            const userDates = userObject[userId];
            Object.keys(userDates).forEach((datesKey) => {
              const datesObject = userDates[datesKey];
              Object.keys(datesObject).forEach((dates) => {
                const dropdownHTML = `
                    <div class="dropdown">
                        <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            ${dates}
                        </button>
                        <ul class="dropdown-menu dropdown-menu-up">
                        
                        </ul>
                    </div>
                  `;
                div.insertAdjacentHTML("afterend", dropdownHTML);
                const menuDropdown =
                  div.nextElementSibling.querySelector(".dropdown-menu");

                const hoursObject = datesObject[dates];
                Object.keys(hoursObject).forEach((hour) => {
                  const entryObject = hoursObject[hour];
                  let entreeSortie = "";

                  if (hour % 2 === 0) {
                    entreeSortie = "Sortie";
                  } else {
                    entreeSortie = "Entrée";
                  }

                  menuDropdown.insertAdjacentHTML(
                    "beforeend",
                    `<li><a class="dropdown-item" href="#">${entreeSortie}: ${entryObject}</a></li>`
                  );
                });
              });
            });
          });
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
