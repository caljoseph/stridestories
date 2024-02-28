//here's what I'm gonna do:
//I'm going to figure out how to dynamically generate blog entries from a runRecord
//Then I'm going to add a blog post for every runRecord where the username matches
//Whoever is logged in
//Then once I'm getting all my blog post returned to me I'll figure out that pesky 

import { RunRecordDAO } from "./runRecordDAO.js"

const loggedInUser = localStorage.getItem("username");

const runRecordDAO = new RunRecordDAO;
const allRunRecords = runRecordDAO.getAllRecords();
const userRunRecords = allRunRecords.filter(record => record.username === loggedInUser);

const blogContent = document.querySelector(".blog-content")

userRunRecords.forEach(record => {
    const entry = generateBlogEntry(record);
    blogContent.appendChild(entry);
});


function generateBlogEntry(record) {
    const entry = document.createElement("div");
    entry.classList.add("blog-entry");

    //date and location
    const entryDateLocation = document.createElement("div");
    entryDateLocation.classList.add("entry-date-location");

    const dateData = document.createElement("p");
    dateData.innerText = record.date;
    const locationData = document.createElement("p");
    locationData.innerText = "TODO-location"; 

    entryDateLocation.appendChild(dateData);
    entryDateLocation.appendChild(locationData);
    entry.appendChild(entryDateLocation);

    //entry Title
    const entryTitle = document.createElement("div");
    entryTitle.classList.add("entry-title");

    const titleHeading = document.createElement("h3");
    titleHeading.innerText = record.title;

    entryTitle.appendChild(titleHeading);
    entry.appendChild(entryTitle);

    //entry Description
    const entryDescription = document.createElement("div");
    entryDescription.classList.add("entry-description");

    const descriptionParagraph = document.createElement("p");
    descriptionParagraph.innerText = record.notes;

    entryDescription.appendChild(descriptionParagraph);
    entry.appendChild(entryDescription);

    const entryStats = document.createElement("div");
    entryStats.classList.add("entry-stats");

    const statsTable = document.createElement("table");

    const statsThead = document.createElement("thead");
    const statsTrHead = document.createElement("tr");
    statsTrHead.innerHTML = `
        <th id="duration">Duration</th>
        <th id="pace">Pace</th>
        <th id="distance">Distance</th>
    `;
    statsThead.appendChild(statsTrHead);

    const statsTbody = document.createElement("tbody");
    const statsTrBody = document.createElement("tr");
    statsTrBody.innerHTML = `
        <td id="duration-info">${record.duration}</td>
        <td id="pace-info">${calculatePace(record.duration, record.distance)}</td>
        <td id="distance-info">${record.distance}</td>
    `;
    statsTbody.appendChild(statsTrBody);

    statsTable.appendChild(statsThead);
    statsTable.appendChild(statsTbody);
    entryStats.appendChild(statsTable);
    entry.appendChild(entryStats);

    return entry;
}

function calculatePace(duration, distance) {
    //pace in minutes per mile
    const pace = duration / distance;

    //convert to pretty format
    const paceMinutes = Math.floor(pace);
    const paceSeconds = Math.round((pace - paceMinutes) * 60);

    return `${paceMinutes}:${(paceSeconds < 10 ? '0' : '')}${paceSeconds} min/mi`;
}