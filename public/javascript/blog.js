

import { RunRecordDAO } from "./runRecordDAO.js"

const PREVIOUS = -1;
const NEXT = 1;
const loggedInUser = localStorage.getItem("username");
const currentMonth = new Date().getMonth();
const currentYear = new Date().getFullYear();
let monthInfo = [currentMonth, currentYear];
const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];



let allRunRecords;
try {
    allRunRecords = await sendGetRequest("/api/runs");
    console.log("Runs loaded sucessfully")
} catch (error) {
    console.error("Couldn't load runs", error.message);
}

async function sendGetRequest(url) {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Sorry! Couldn't get runs: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
}




const userRunRecords = allRunRecords.filter(record => record.username === loggedInUser);

const blogContent = document.querySelector(".blog-content")
const nextWeek = document.querySelector("#next-month");
const prevWeek = document.querySelector("#prev-month");
const monthDisplay = document.querySelector("#month-display");

loadEntriesCurrentMonth();



nextWeek.addEventListener("click", () => {
    updateMonthInfo(NEXT);
    loadEntriesCurrentMonth();
});
prevWeek.addEventListener("click", () => {
    updateMonthInfo(PREVIOUS)
    loadEntriesCurrentMonth();
});

function updateMonthInfo(increment) {
    const [currentMonth, currentYear] = monthInfo;
    let newMonth = (currentMonth + increment) % 12;
    newMonth = (newMonth + 12) % 12;
    monthInfo[0] = newMonth; 

    if (increment === 1 && newMonth === 0) {
        monthInfo[1]++;
    } 
    if (increment === -1 && newMonth === 11) {
        monthInfo[1]--;
    }
}


function loadEntriesCurrentMonth() {
    //clean house
    blogContent.innerHTML = "";
    //load up relevant posts
    const monthRecords = restrictRecordsToCurrentMonth(userRunRecords);
    monthRecords.forEach(record => {
        const entry = generateBlogEntry(record);
        blogContent.appendChild(entry);
    })
    monthDisplay.textContent = months[monthInfo[0]] + " " + monthInfo[1];
}



function restrictRecordsToCurrentMonth(records) {
    return records.filter(record => {
        const month = new Date(record.date).getUTCMonth();
        
        const year = new Date(record.date).getFullYear();
        return month === monthInfo[0]
            && year === monthInfo[1];
    });
}

function generateBlogEntry(record) {
    const entry = document.createElement("div");
    entry.classList.add("blog-entry");

    //date and location
    const entryDateLocation = document.createElement("div");
    entryDateLocation.classList.add("entry-date-location");

    const dateData = document.createElement("p");
    dateData.innerText = record.date;
    const locationData = document.createElement("p");
    locationData.innerText = record.location; 

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