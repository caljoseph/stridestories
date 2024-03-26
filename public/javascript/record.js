import { RunRecord } from "./runRecord.js";

const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
const socket = new WebSocket(`${protocol}://${window.location.host}/ws`);


socket.onopen = function(event) {
};

socket.onmessage = function(event) {
  console.log("Message from server: ", event.data);
};

socket.onerror = function(error) {
  console.error("WebSocket error: ", error);
};


document.getElementById("submit").addEventListener("click", function() {
    const date = document.querySelector("#date");
    const distance = document.querySelector("#distance");
    const duration = document.querySelector("#duration");
    const title = document.querySelector("#title");
    const location = document.querySelector("#location");

    if (date.checkValidity() 
            && distance.checkValidity() 
            && duration.checkValidity()
            && title.checkValidity()
            && location.checkValidity()) {
        submit();
    }
});
async function submit() {
    const date = document.querySelector("#date").value;
    const distance = document.querySelector("#distance").value;
    const duration = document.querySelector("#duration").value;
    const runType = document.querySelector("#run-type").value;
    const notes = document.querySelector("#notes").value;
    const location = document.querySelector("#location").value;
    const title = document.querySelector("#title").value;
    const username = localStorage.getItem("username")

    const record = new RunRecord(date, distance, duration, runType, notes, username, title, location);

    try {
        socket.send(JSON.stringify({ type: 'newRunSubmitted' }));
        await sendPostRequest("/api/run", record);
        console.log("Run added successfully!");
    } catch (error) {
        console.error("Couldn't add run", error.message);
    }
}

async function sendPostRequest(url, data) {
    console.log("Sending POST request...");
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const responseData = await response.json();
    return responseData;
}
