import {displayResult} from "./displayResult.js";

// fonction pour récuper l'api 
export function recupApi(){
    const cityName = document.getElementById("input-city").value;
    const apiKey = "314b05dedcf168f888186a0791c643ce";
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=metric`;
    // if (!cityName) {
    //     alert('Please enter a name.');
    //     return;
    // } https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric 
    fetch(apiUrl)
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
// ajout d'un évenement pour le bouton
const btnSearch = document.getElementById('btn-search');
btnSearch.addEventListener('click', ()=> {
    recupApi();
    divResultat.style.display = "block";
});
// ajout d'un évenement pour la touche 'enter'
document.getElementById('input-city').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
      recupApi();
      divResultat.style.display = "block";
    }
});


