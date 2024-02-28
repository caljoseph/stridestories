export class RunRecordDAO {
    static storageKey = "runRecords";

    getAllRecords() {
        const runRecordsJson = localStorage.getItem("runRecords");
        if (runRecordsJson) {
            try {
                //must decode string into array of strings, then each string to a record
                const runRecordsArrayStrings = JSON.parse(runRecordsJson);

                const runRecordsArrayObjects = runRecordsArrayStrings.map((recordString) => {
                    return JSON.parse(recordString);
                });

                return runRecordsArrayObjects;
            } catch (error) {
                console.error("Error parsing JSON:", error);
                return []; 
            }
        } else {
            //no records in db
            console.error("No runRecords found in localStorage");
            return []; 
        }
    }
    addRecord(record) {
        const runRecords = this.getAllRecords();
        runRecords.push(record);
        localStorage.setItem("runRecords", JSON.stringify(runRecords));
    }
    clear() {
        localStorage.setItem("runRecords", []);
    }
    //TODO 
    // updateRecord(record) {

    // }
    // deleteRecord(record) {

    // }


}