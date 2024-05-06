import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { firebaseConfig } from "../../providers/firebaseConfig"

export class GoogleLogin {
    constructor(){
        this.init();
    }

    init(){
        const firebaseConf = new firebaseConfig();
        const app = firebaseConf.getApp()
        const auth = getAuth(app);
        const provider = new GoogleAuthProvider();

        signInWithPopup(auth, provider)
        .then((response) => {
            location.href = "dashboard.html";
            return response
        })
        .catch((error) => {
            console.log('error: ', error);
        });
    }
    
}
