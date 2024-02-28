import { RunRecord } from "./runRecord.js";
import { RunRecordDAO } from "./runRecordDAO.js";

document.getElementById("submit").addEventListener("click", function() {
    const date = document.querySelector("#date");
    const distance = document.querySelector("#distance");
    const duration = document.querySelector("#duration");

    if (date.checkValidity() && distance.checkValidity() && duration.checkValidity()) {
        submit();
    }
});
function submit() {
    const date = document.querySelector("#date").value;
    const distance = document.querySelector("#distance").value;
    const duration = document.querySelector("#duration").value;
    const runType = document.querySelector("#run-type").value;
    const notes = document.querySelector("#notes").value;
    const username = localStorage.getItem("username")

    const record_submit = new RunRecord(date, distance, duration, runType, notes, username);
    const record_submit_json = JSON.stringify(record_submit);

    const runRecordDAO = new RunRecordDAO;
    runRecordDAO.addRecord(record_submit_json);
    return true;
}