export function displayResult(data) { 
    const nameOfCity = document.querySelector('#city-name');
    const temperature = document.querySelector('#temperature');
    const temperatureMinimum = document.querySelector('#temperature-minimum');
    const temperatureMaximum = document.querySelector('#temperature-maximum');
    
    if (data) {
        nameOfCity.textContent = `${data.city.name}, ${data.city.country}`;
        const currentTemp = data.list[0].main.temp;
        // pour avoir la temperature en chiffre entier utilisation de Math.floor
        temperature.textContent = `${Math.floor(currentTemp)}°C`;
        // affichage des icones du météo
        const iconWeather = data.list[0].weather[0].icon;
        console.log(iconWeather);
        const altImg = data.list[0].weather[0].description;
        console.log(altImg);
        const imgWeather = document.querySelector('#img-weather');
        imgWeather.setAttribute('src', `http://openweathermap.org/img/w/${iconWeather}.png`);
        imgWeather.setAttribute('alt', `icon of ${altImg}`);

    // Filtrer les données pour exclure celles du jour actuel
    // split => divise la chaine de caractère en sous chaines qui sont placés dans un tableau
    const dateJour = new Date(data.list[0].dt_txt.split(' ')[0]);
    const futureData = data.list.filter(item => {
        const itemDate = new Date(item.dt_txt.split(' ')[0]);
        return itemDate > dateJour;
    });
    
    // calcule de la temperature minimum est maximum
    // opérateur de décomposition (...)=> utilisé pour passer les températures minimales comme arguments à Math.min(), renvoie la température minimale du jour
    const minTemp = Math.min(...futureData.map(item => item.main.temp_min));
    const maxTemp = Math.max(...futureData.map(item => item.main.temp_max));
    temperatureMinimum.textContent = `Min: ${Math.floor(minTemp)}°C`;
    temperatureMaximum.textContent = `Max: ${Math.floor(maxTemp)}°C`;
    
    const tempJourSuivants = document.querySelector('#temp-jours-suivant');
    // Vider le contenu des prévisions des jours suivants
    tempJourSuivants.innerHTML = '';
    
    // Afficher les prévisions pour les jours suivants
    const dateDuJour = {};
    futureData.forEach(item => {
        const date = item.dt_txt.split(' ')[0];
        if (!dateDuJour[date]) {
            dateDuJour[date] = [];
        }
        dateDuJour[date].push(item.main.temp);
    });

        for (const [date, temps] of Object.entries(dateDuJour)) {
            const jourMinTemp = Math.min(...temps);
            const jourMaxTemp = Math.max(...temps);
            const detailsTempJourSuivant = document.createElement('section');
            detailsTempJourSuivant.classList.add('details-temp-jour-suivant');
            detailsTempJourSuivant.innerHTML = `
                <h3>${new Date(date).toLocaleDateString('fr-FR', { weekday: 'long' })}</h3>
                <p>Min: ${Math.floor(jourMinTemp)}°C</p>
                <p>Max: ${Math.floor(jourMaxTemp)}°C</p>`;
            tempJourSuivants.appendChild(detailsTempJourSuivant);
        }
        
    } 
}