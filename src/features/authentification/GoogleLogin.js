import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth"
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
                location.href = "main.html";
                this.onResponse(response); 
                localStorage.setItem('loginResponse', JSON.stringify(response)); // Stocke la réponse dans le stockage local
                hoursDisplay.init();
                return response
            })
            .catch((error) => {
                console.log('error: ', error);
            });
        })
    }
}
