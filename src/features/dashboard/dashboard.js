import { getAuth, onAuthStateChanged } from "firebase/auth";
import { firebaseConfig } from "../../providers/firebaseConfig";
// import { QRCodeGen } from "../../components/qrCodeGenerator";
import { DisplayElements } from "./displayElements";

export class DashboardPage {
  constructor() {
    const firebase = new firebaseConfig();
    this.app = firebase.getApp();
    this.user = getAuth(this.app).currentUser;
    this.init();
  }

  init() {
    onAuthStateChanged(getAuth(this.app), async (user) => {
      if (user) {
      const displayElements = new DisplayElements(user, this.app); 
      } else {
        window.location.href = "/index.html";
      }
    });
  }
}
