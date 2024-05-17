import {displayResult} from "./displayResult.js";

// // fonction pour récuper l'api 
export function recupApi(){
    const cityName = document.getElementById("input-city").value;
    const apiKey = "314b05dedcf168f888186a0791c643ce";
    // if (!cityName) {
    //     alert('Please enter a name.');
    //     return;
    // } https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric 
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=metric`)
    .then((response) => response.json())
    .then((data) => {
        displayResult(data);
        console.log(data);
    })
    .catch((error) => {
         // afficher dans la console s'il y a un erreur
        console.log("Error loading: ", error);
    })
}

const divResultat = document.querySelector('#display-result');
console.log(divResultat);
// ajout d'un évenement pour le bouton
const btnSearch = document.getElementById('btn-search');
btnSearch.addEventListener('click', ()=> {
    recupApi();
    displayResult();
    divResultat.style.display = "block";
    // tempJourSuivants();
});
// ajout d'un évenement pour la touche 'enter'
document.getElementById('input-city').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
      recupApi();
      displayResult(); 
      divResultat.style.display = "block";
    //   tempJourSuivants();
    }
});


