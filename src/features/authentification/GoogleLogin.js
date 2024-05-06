import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from "firebase/auth"
import { firebaseConfig } from "../../providers/firebaseConfig"

export class Login{
    constructor(loginButton){
        this.button = loginButton;
        this.init();
    }

    init(){
        const firebaseConf = new firebaseConfig();
        const app = firebaseConf.getApp()
        const auth = getAuth(app);
        const provider = new GoogleAuthProvider();

        this.button.addEventListener("click", () => {
            signInWithPopup(auth, provider)
            .then((response) => {
                console.log(response);
                location.href = "main.html";
            })
            .catch((error) => {
                console.log('error: ', error);
            });
        })
    }
}