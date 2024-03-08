export class RunRecordDAO {
    static storageKey = "runRecords";

    getAllRecords() {
        const runRecordsJson = localStorage.getItem("runRecords");
        if (runRecordsJson) {
            try {
                //must decode string into array of strings, then each string to a record
                const runRecordsArrayStrings = JSON.parse(runRecordsJson);

                // const runRecordsArrayObjects = runRecordsArrayStrings.map((recordString) => {
                //     return JSON.parse(recordString);
                // });

                return runRecordsArrayStrings;
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

        runRecords.sort((a, b) => new Date(a.date) - new Date(b.date));

        localStorage.setItem("runRecords", JSON.stringify(runRecords));
    }
    clear() {
        localStorage.setItem("runRecords", []);
    }


      async saveScore(score) {
    const userName = this.getPlayerName();
    const date = new Date().toLocaleDateString();
    const newScore = {name: userName, score: score, date: date};

    try {
      const response = await fetch('/api/score', {
        method: 'POST',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify(newScore),
      });

      // Store what the service gave us as the high scores
      const scores = await response.json();
      localStorage.setItem('scores', JSON.stringify(scores));
    } catch {
      // If there was an error then just track scores locally
      this.updateScoresLocal(newScore);
    }
  }


}