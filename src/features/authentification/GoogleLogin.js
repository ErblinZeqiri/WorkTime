export class Login{
    constructor(loginButton){
        this.button = loginButton;
        
        this.init();
    }

    init(){
        this.button.addEventListener("click", () => {
            alert("asdad")
        })
    }
}