export class RunRecord {
    constructor(date, distance, duration, runType, notes = "", username) {
      this.date = date;
      this.distance = distance;
      this.duration = duration;
      this.runType = runType;
      this.notes = notes;
      this.username = username;
    }
}