import { ApiConnexion, fillOption, eventHandler } from './providers/apiData';
import { Login } from './features/authentification/GoogleLogin';
import {  } from './features/index/indexPage'

const dropdown = document.querySelector(".dropdown");
const searchInput = document.getElementById("searchInput");
const dropdownOptions = document.querySelectorAll(".dropdown-content a");
const inputs = document.querySelectorAll('.input')
const googleBtn = document.querySelector(".google-login-button");

const pathname = window.location.pathname;

if(pathname === "/"){
  const apiConnection = new ApiConnexion();
  const eventHandl = new eventHandler(searchInput, dropdown, dropdownOptions, inputs);

  apiConnection.ApiConnexion().then(data => {
    const fillOp = new fillOption(searchInput,data);

    // Ecout de l'événement de la saisie dans le champ de recherche
    fillOp.fillOption();
  }).catch(error => {
    console.error("Une erreur s'est produite lors de la récupération des données :", error);
  });

  eventHandl.initEvents();

  const loginWithGoogle = new Login(googleBtn);
}

if(pathname === "/main.html"){
  
}
