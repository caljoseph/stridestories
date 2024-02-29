export class RunRecord {
    constructor(date, distance, duration, runType, notes = "", username, title, location) {
      this.date = date;
      this.distance = distance;
      this.duration = duration;
      this.runType = runType;
      this.notes = notes;
      this.username = username;
      this.location = location;
      this.title = title;
    }
}