import { RunRecord } from "./runRecord.js";
import { RunRecordDAO } from "./runRecordDAO.js";

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
function submit() {
    const date = document.querySelector("#date").value;
    const distance = document.querySelector("#distance").value;
    const duration = document.querySelector("#duration").value;
    const runType = document.querySelector("#run-type").value;
    const notes = document.querySelector("#notes").value;
    const location = document.querySelector("#location").value;
    const title = document.querySelector("#title").value;
    const username = localStorage.getItem("username")

    const record_submit = new RunRecord(date, distance, duration, runType, notes, username, title, location);

    const runRecordDAO = new RunRecordDAO;
    runRecordDAO.addRecord(record_submit);
    return true;
}