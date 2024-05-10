import React, {useEffect, useRef, useState} from 'react';
import {RunRecord} from '../runRecord.js';
import Toast from '../toast/toast.js';
import './record.css';


export function Record() {

  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [distance, setDistance] = useState();
  const [duration, setDuration] = useState();
  const [runType, setRunType] = useState('Jog'); 
  const [notes, setNotes] = useState('');
  const [location, setLocation] = useState('');
  const [showToast, setShowToast] = useState(false);

  const socketRef = useRef(null);

  useEffect(() => {
    const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
    socketRef.current = new WebSocket(`${protocol}://${window.location.host}/ws`);
  
    socketRef.current.onopen = function(event) {
      console.log("Websocket opened");
    };
  
    socketRef.current.onmessage = function(event) {
      console.log("Message from server: ", event.data);
    };
  
    socketRef.current.onerror = function(error) {
      console.error("WebSocket error: ", error);
    };

    return () => {
      if(socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []); 
  
  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleDateChange = (e) => setDate(e.target.value);
  const handleDistanceChange = (e) => {
    setDistance(e.target.value ? parseFloat(e.target.value) : undefined);
  };
  const handleDurationChange = (e) => {
    setDuration(e.target.value ? parseInt(e.target.value, 10) : undefined);
  }
  const handleRunTypeChange = (e) => setRunType(e.target.value);
  const handleNotesChange = (e) => setNotes(e.target.value);
  const handleLocationChange = (e) => setLocation(e.target.value);

  async function submit(event) {
    event.preventDefault(); 

    const username = localStorage.getItem("username");
    const record = new RunRecord(new Date(date).toISOString(), distance, duration, runType, notes, username, title, location);

    try {
      if(socketRef.current) {
        socketRef.current.send(JSON.stringify({ type: 'newRunSubmitted' }));
      }
      await postRun("/api/private/runs", record);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 10000); 

      setTitle('');
      setDate('');
      setDistance("");
      setDuration("");
      setRunType('Jog'); 
      setNotes('');
      setLocation('');
    } catch (error) {
      console.error("Couldn't add run", error.message);
    }
  }
  
  async function postRun(url, data) {
      console.log("Sending POST request...");
      const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
      });
      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }
    return await response.json();
  }


  return (
    <main>
      <div className="run-form">
        <form onSubmit={submit}>
          <div className="columns">
            <div className="left-column">
              <div className="form-group">
                <label htmlFor="title">Title:</label>
                <input type="text" className="form-control" id="title" value={title} onChange={handleTitleChange} required placeholder="Title"/>
              </div>
              <div className="form-group">
                <label htmlFor="date">Date:</label>
                <input type="date" className="form-control" id="date" value={date} onChange={handleDateChange} required/>
              </div>
              <div className="form-group">
                <label htmlFor="distance">Distance (miles):</label>
                <input type="number" className="form-control" value={distance || ""} onChange={handleDistanceChange} step="0.1" required placeholder="Miles"/>
              </div>
              <div className="form-group">
                <label htmlFor="duration">Duration (minutes):</label>
                <input type="number" className="form-control" value={duration || ""} onChange={handleDurationChange} required placeholder="Minutes"/>
              </div>
            </div>
            <div className="right-column">
              <div className="form-group">
                <label htmlFor="location">Location:</label>
                <input type="text" className="form-control" value={location} onChange={handleLocationChange} required placeholder="Location"/>
              </div>
              <div className="form-group">
                <label htmlFor="run-type">Type of Run:</label>
                <select className="form-control" id="run-type" value={runType} onChange={handleRunTypeChange}>
                  <option>Jog</option>
                  <option>Interval</option>
                  <option>Trail</option>
                </select>
              </div>
              <div className="form-group" id='notes-group'>
                <label htmlFor="notes">Notes:</label>
                <textarea className="form-control" id="notes" value={notes} onChange={handleNotesChange}></textarea>
              </div>
            </div>
          </div>
          <button type="submit" className="btn btn-primary" id="submit">Submit</button>
        </form>
      </div>
      <Toast show={showToast} message="Run added!" onClose={() => setShowToast(false)} />
    </main>
  );
}