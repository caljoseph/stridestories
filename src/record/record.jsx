import React from 'react';
import './record.css';


export function Record() {
  return (
    <main>
  
        <div className="run-form">
          <h2>Record a New Run</h2>
            <form>
              <div className="columns">
                <div className="left-column">
                  <div className="form-group">
                    <label for="title">Title:</label>
                    <input type="text" className="form-control" id="title" required placeholder="Title"/>
                  </div>
                  <div className="form-group">
                    <label for="date">Date:</label>
                    <input type="date" className="form-control" id="date" required/>
                  </div>
                <div className="form-group">
                    <label for="distance">Distance (miles):</label>
                    <input type="number" className="form-control" id="distance" step="0.1" required placeholder="Miles"/>
                </div>
                <div className="form-group">
                  <label for="duration">Duration (minutes):</label>
                  <input type="number" className="form-control" id="duration" required placeholder="Minutes"/>
              </div>
  
                </div>
                <div className="right-column">
                  <div className="form-group" id="location-group">
                    <label for="location">Location:</label>
                    <input type="text" className="form-control" id="location" required placeholder="Location"/>
                  </div>
                  <div className="form-group" id="type-group">
                      <label for="run-type">Type of Run:</label>
                      <select className="form-control" id="run-type">
                          <option>Jog</option>
                          <option>Interval</option>
                          <option>Trail</option>
                      </select>
                  </div>
                  <div className="form-group" id="notes-group">
                    <label for="notes">Notes:</label>
                    <textarea className="form-control" id="notes" ></textarea>
                  </div>
                </div>
              </div>
                <button type="submit" className="btn btn-primary" id="submit">Submit</button>
            </form>
        </div>

      </main>
  );
}