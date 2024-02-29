import { RunRecordDAO } from "./runRecordDAO.js"
import { RunRecord } from "./runRecord.js"

document.addEventListener("DOMContentLoaded", function () {
    const username = localStorage.getItem("username");
  
    const navBar = document.querySelector(".menu-bar");
  
    if (username && username.trim() !== "") {
      // If username exists, render the full navigation bar
      navBar.innerHTML = `
        <ul class="menu-bar">
          <li id="home"><a href="logged-in.html">Home</a></li>
          <li id="my-blog"><a href="blog.html">My Blog</a></li>
          <li id="leaderboard"><a href="leaderboard.html">Leaderboard</a></li>
          <li id="about"><a href="about.html">About</a></li>
          <li id="record"><a href="record.html">Record</a></li>
        </ul>`;
    } else {
      // If username doesn't exist, render the simplified navigation bar
      navBar.innerHTML = `
        <ul class="menu-bar">
          <li id="home"><a href="index.html">Home</a></li>
          <li id="leaderboard"><a href="leaderboard.html">Leaderboard</a></li>
          <li id="about"><a href="about.html">About</a></li>
        </ul>`;
    }
  });

const PREVIOUS = -1;
const NEXT = 1;
const currentMonth = new Date().getMonth();
const currentYear = new Date().getFullYear();
let monthInfo = [currentMonth, currentYear];
const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const nextWeek = document.querySelector("#next-week");
const prevWeek = document.querySelector("#prev-week");
const monthDisplay = document.querySelector("#month-display");
const TDBody = document.querySelector("#total-distance-data");
const LRBody = document.querySelector("#longest-run-data");


const runRecordDAO = new RunRecordDAO;
const allRunRecords = runRecordDAO.getAllRecords();

loadEntriesCurrentMonth();

function loadEntriesCurrentMonth() {
  //clean house
  TDBody.innerHTML = "";
  LRBody.innerHTML = "";
  
  const monthRecords = restrictRecordsToCurrentMonth(allRunRecords);
  const sortedLongest = sortLongestRun(monthRecords);
  
  sortedLongest.forEach((record, index) => {
    const entry = generateTableEntry(record, index);
    LRBody.appendChild(entry);

    if (index + 1 === 10) return;
    // only display the top ten
  });

  monthDisplay.textContent = months[monthInfo[0]] + " " + monthInfo[1];
}
function generateTableEntry(record, index) {
  const entry = document.createElement('tr');
  const rank = document.createElement('td');
  const name = document.createElement('td');
  const runMiles = document.createElement('td');

  rank.textContent = index;
  name.textContent = record.username;
  runMiles.textContent = record.distance;

  entry.appendChild(rank);
  entry.appendChild(name);
  entry.appendChild(runMiles);

  return entry;
}




function sortLongestRun(records) {
  return records.sort((a, b) => {
    const durationA = parseInt(a.duration, 10);
    const durationB = parseInt(b.duration, 10);

    return durationA - durationB;
  });
}

function restrictRecordsToCurrentMonth(records) {
  return records.filter(record => {
      const month = new Date(record.date).getMonth();
      const year = new Date(record.date).getFullYear();
      return month === monthInfo[0]
          && year === monthInfo[1];
  });
}
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