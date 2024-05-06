import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from "firebase/auth"

export class Login{
    constructor(loginButton, firebaseConf){
        this.button = loginButton;
        this.app = firebaseConf
        this.init();
    }

    init(){
        const auth = getAuth(this.app);
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