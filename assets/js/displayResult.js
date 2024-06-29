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














// CODE CHATGPT 
export function getDBdebug() {
    const apiUrl = 'http://localhost:3000/api/events';
    const divEvent = document.querySelector('.events');
    
    fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        console.log(data);

        // Clear previous events
        divEvent.innerHTML = '';

        // Collect all unique dates
        const allDates = new Set();
        data.forEach(event => {
            event.dates.forEach(dateInfo => {
                allDates.add(dateInfo.date);
            });
        });

        // Convert Set to Array and sort the dates
        const sortedDates = Array.from(allDates).sort();

        // Create table for each event
        data.forEach(element => {
            // Create section for the event
            const sectionEvent = document.createElement('section');
            divEvent.appendChild(sectionEvent);

            // Create and append event title
            const eventName = document.createElement('h3');
            eventName.textContent = element.name;
            sectionEvent.appendChild(eventName);

            // Create and append event author
            const eventAuthor = document.createElement('h4');
            eventAuthor.textContent = element.author;
            sectionEvent.appendChild(eventAuthor);

            // Create and append event description
            const eventDescription = document.createElement('p');
            eventDescription.textContent = element.description;
            sectionEvent.appendChild(eventDescription);

            // Create table
            const table = document.createElement('table');
            sectionEvent.appendChild(table);

            // Create header row
            const headerRow = document.createElement('tr');
            table.appendChild(headerRow);

            // Add 'Nom / Dates' header
            const nameHeader = document.createElement('th');
            nameHeader.textContent = 'Nom / Dates';
            headerRow.appendChild(nameHeader);

            // Add date headers
            sortedDates.forEach(date => {
                const dateHeader = document.createElement('th');
                dateHeader.textContent = date;
                headerRow.appendChild(dateHeader);
            });

            // Add 'modif' and 'supp' headers
            const modifHeader = document.createElement('th');
            modifHeader.textContent = 'modif';
            headerRow.appendChild(modifHeader);
            
            const suppHeader = document.createElement('th');
            suppHeader.textContent = 'supp';
            headerRow.appendChild(suppHeader);

            // Create a map to track attendees for each date
            const attendeesMap = new Map();

            // Populate the map
            element.dates.forEach(dateInfo => {
                dateInfo.attendees.forEach(attendee => {
                    if (!attendeesMap.has(attendee.name)) {
                        attendeesMap.set(attendee.name, {});
                    }
                    attendeesMap.get(attendee.name)[dateInfo.date] = attendee.available;
                });
            });

            // Create rows for each attendee
            attendeesMap.forEach((dates, attendeeName) => {
                const row = document.createElement('tr');

                // Add attendee name
                const nameCell = document.createElement('td');
                nameCell.textContent = attendeeName;
                row.appendChild(nameCell);

                // Add availability for each date
                sortedDates.forEach(date => {
                    const dateCell = document.createElement('td');
                    dateCell.textContent = dates[date] !== undefined ? dates[date] : '';
                    row.appendChild(dateCell);
                });

                // Add 'modif' and 'supp' cells
                const modifCell = document.createElement('td');
                modifCell.textContent = 'modif';
                row.appendChild(modifCell);

                const suppCell = document.createElement('td');
                suppCell.textContent = 'supp';
                row.appendChild(suppCell);

                table.appendChild(row);
            });
        });
    })
    .catch(error => {
        console.log("Error loading: ", error);
    });
}
 















// Code Ilies 
import { formatDate } from "./formatDate.js";
import { modifEvent } from "./patch_event.js";
// Fetches all existing events.
export const getEvents = async () => {
  const endpoint = "http://localhost:3000/api/events/";
  const response = await fetch(endpoint);
  const result = await response.json();

  // display the events to the page
  displayEvents(result);
};

const getAttendantsList = (dateList) => {
  let attendeesSet = new Set();
  for (let date of dateList) {
    date.attendees.forEach((attendee) => attendeesSet.add(attendee.name));
  }
  return [...attendeesSet];
};

const toggleDetails = (id) => {
  const div = document.querySelector(`#details_${id}`);
  const toggleDiv = document.querySelector(`#expend_${id}`);
  if (div.style.display === "none") {
    div.style.display = "flex";
    toggleDiv.innerHTML = `<img src="assets/images/less.svg" id="expend_${id}" alt="Hide details">Hide attendance`;
  } else {
    div.style.display = "none";
    toggleDiv.innerHTML = `<img src="assets/images/more.svg" id="expend_${id}" alt="See details">View attendance`;
  }
};

const displayEvents = (events) => {
  const container = document.querySelector(".events-container");
  container.innerHTML = "";
  for (let event of events) {
    const card = document.createElement("div");
    card.classList.add("card");
    const createdDate = formatDate(event.created_at);
    card.innerHTML = `
        <div class="card-title">
        <h3>${event.name}</h3>
        <div class="controls">
        <img src="assets/images/edit.svg" id="edit_${event.id}" class="edit-button" alt="edit event">  
        <img src="assets/images/delete.svg" id="delete_${event.id}" class="delete-button" alt="delete event">
        </div>
        </div>
        
        <div class="event-info">
            <span class="author">created by ${event.author}</span><span class="creation-date"> on ${createdDate}</span>
        </div>
        <p class="description">${event.description}</p>
        <div style="display: none;" class="attendance-table" id="details_${event.id}">
        </div>
        <div class="toggle-attendance" id="expend_${event.id}"><img id="expend_${event.id}" src="assets/images/more.svg" alt="View attendance">View attendance</div>
    `;

    const attendeesList = getAttendantsList(event.dates);
    const attendeesDiv = document.createElement("div");
    attendeesDiv.classList.add("attendees-list");
    attendeesDiv.innerHTML += `<div class="participant">Participants</div>`;
    for (let participant of attendeesList) {
      attendeesDiv.innerHTML += `<div class="participant">${participant}</div>`;
    }
    container.appendChild(card);
    const attendanceTable = document.querySelector(`#details_${event.id}`);
    attendanceTable.appendChild(attendeesDiv);
    // // Creates dates entries
    for (let eventDate of event.dates) {
      const dateDiv = document.createElement("div");
      dateDiv.classList.add("date-attendance");
      dateDiv.innerHTML = `<span class="date">${eventDate.date}</span>`;
      attendanceTable.appendChild(dateDiv);
      const attendees = document.createElement("div");
      attendees.classList.add("attendees");
      for (let attendant of eventDate.attendees) {
        if (attendant.available === null) {
          attendees.innerHTML += `<div class="attendance">
          <img class="attendance" src="assets/images/question.svg" alt="no data">
          </div>`;
        } else if (!attendant.available) {
          attendees.innerHTML += `<div class="attendance">
          <img class="attendance" src="assets/images/cross.svg" alt="not attending">
          </div>`;
        } else {
          attendees.innerHTML += `<div class="attendance">
          <img class="attendance" src="assets/images/confirm.svg" alt="attending">
          </div>`;
        }
        dateDiv.appendChild(attendees);
      }
    }
  }
  const toggleButtons = document.querySelectorAll(".toggle-attendance");
  for (let toggleBtn of toggleButtons) {
    toggleBtn.addEventListener("click", (e) => {
      toggleDetails(e.target.id.split("_")[1]);
    });
  }
  const editButtons = document.querySelectorAll(".edit-button");
  for (let editBtn of editButtons) {
    editBtn.addEventListener("click", (e) => {
      console.log(e.target.id.split("_")[1]);
    });
  }
  const deleteButtons = document.querySelectorAll(".delete-button");
  for (let deleteBtn of deleteButtons) {
    deleteBtn.addEventListener("click", (e) => {
      console.log(e.target.id.split("_")[1]);
    });
  }
};