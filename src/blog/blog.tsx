import React, { useState, useEffect, useRef } from 'react';
import './blog.css';
import { getUserFromAuthCookie } from '../utils/getUserNameFromAuth.ts';
import { RunRecord } from '../runRecord.js';



export function Blog() {
  const [runRecords, setRunRecords] = useState([]);
  const [monthInfo, setMonthInfo] = useState([new Date().getMonth(), new Date().getFullYear()]);
  const [username, setUsername] = useState('');
  const [location, setLocation] = useState('');
  const [bio, setBio] = useState('');
  const [goals, setGoals] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [memberSince, setMemberSince] = useState('');
  // New states for edit mode
  const [originalLocation, setOriginalLocation] = useState('');
  const [originalBio, setOriginalBio] = useState('');
  const [originalGoals, setOriginalGoals] = useState<string[]>([]);

  const goalRefs = useRef<(HTMLTextAreaElement | null)[]>([]);
  const bioRef = useRef<HTMLTextAreaElement | null>(null);
  const locationRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    async function loadUserData() {
      const userData = await getUserFromAuthCookie();
      if (userData && userData.Username) {
        setUsername(userData.Username);
      } else {
        console.error('No authcookie set or no username specified');
      }
    }
    loadUserData();
  }, []);


  useEffect(() => {
    async function fetchRuns() {
      if (!username) return; // Do not fetch runs if username is not set
      try {
        const response = await fetch(`/api/runs/${username}?month=${monthInfo[0] + 1}&year=${monthInfo[1]}`);
        if (!response.ok) {
          throw new Error(`Sorry! Couldn't get runs: ${response.statusText}`);
        }
        const data = await response.json();
        console.log("Runs loaded successfully");
        setRunRecords(data.runsList);
      } catch (error : any) {
        console.error("Couldn't load Runs: " + error.message);
      }
    }
    fetchRuns();
  }, [username, monthInfo]); // Dependency on username

  useEffect(() => {
    async function fetchBlogInfo() {
      if (!username) return; // Do not fetch blog info if username is not set
      try {
        const response = await fetch(`/api/users/${username}`);
        if (response.ok) {
          const data = await response.json();
          setLocation(data.location || '');
          setBio(data.bio || '');
          setGoals(data.goals || []);
          setMemberSince(data.member_since ? new Date(data.member_since).toLocaleDateString() : 'Before this feature was implemented :)');
        }
      } catch (error : any) {
        console.error("Couldn't load blog info: " + error.message);
      }
    }
    fetchBlogInfo();
  }, [username]); // Dependency on username

  const handleEdit = () : void => {
    setOriginalLocation(location);
    setOriginalBio(bio);
    setOriginalGoals([...goals]); 
    setIsEditing(true);
  };

  const handleCancel = () : void => {
    setLocation(originalLocation);
    setBio(originalBio);
    setGoals(originalGoals);
    setIsEditing(false);
  };

  const handleSave = async () => {

    try {
      const response = await fetch('/api/private/users', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ location, bio, goals }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      setIsEditing(false); 
      console.log('Blog info saved successfully');
    } catch (error) {
      console.error('Failed to save blog info', error);
    }
  };

  const addGoal = () : void => setGoals([...goals, '']);
  const updateGoal = (index : number, value : string) : void => {
    const updatedGoals = [...goals];
    updatedGoals[index] = value;
    setGoals(updatedGoals);
  };
  const removeGoal = (index : number) : void => {
    const updatedGoals = [...goals];
    updatedGoals.splice(index, 1);
    setGoals(updatedGoals);
  };


  const updateMonthInfo = (increment : number) : void => {
    setMonthInfo(([month, year]) => {
      let newMonth = (month + increment) % 12;
      newMonth = (newMonth + 12) % 12;
      const newYear = increment === 1 && newMonth === 0 ? year + 1 : increment === -1 && newMonth === 11 ? year - 1 : year;
      return [newMonth, newYear];
    });
  };

  const calculatePace = (duration : number, distance : number) : string => {
    const pace = duration / distance;
    const paceMinutes = Math.floor(pace);
    const paceSeconds = Math.round((pace - paceMinutes) * 60);
    return `${paceMinutes}:${paceSeconds < 10 ? '0' : ''}${paceSeconds} min/mi`;
  };

  const capitalizeUsername = (username : string) => username.charAt(0).toUpperCase() + username.slice(1);

  
  useEffect(() => {
    goalRefs.current.forEach((textArea) => {
      if (textArea) {
        textArea.style.height = "0px";
        textArea.style.height = `${textArea.scrollHeight + 8}px`;
      }
    });
  }, [goals, isEditing]);
  useEffect(() => {
    if (bioRef.current) {
      bioRef.current.style.height = "0px"; 
      bioRef.current.style.height = bioRef.current.scrollHeight + 40 + "px";
    }
  }, [bio, isEditing]);  
  useEffect(() => {
    if (locationRef.current) {
      locationRef.current.style.height = "0px"; 
      locationRef.current.style.height = locationRef.current.scrollHeight + 8 + "px";
    }
  }, [bio, isEditing]); 


  return (
    <main>
    <div className="blog-body">
      <div className="blog-info">
        <div className="blog-title" >
          <h2>{capitalizeUsername(username)}'s Blog</h2>
        </div>
        <div className="blog-member-since">
          <h3>Member since:</h3>
          <p>{memberSince}</p>
        </div>
        <div className="blog-location">
          <h3>Location:</h3>
          <textarea
            ref={locationRef}
            value={location}
            readOnly={!isEditing}
            onChange={(e) => setLocation(e.target.value)}
            className={!isEditing ? "readonly" : "editable"}
          />
        </div>
        <div className="blog-bio">
          <h3>Bio:</h3>
          <textarea
            ref={bioRef}
            value={bio}
            readOnly={!isEditing}
            onChange={(e) => setBio(e.target.value)}
            className={!isEditing ? "readonly" : "editable"}
          />
        </div>
        <div className="blog-goals">
          <h3>Goals:</h3>
          <div id='goal-list'>
            {goals.map((goal, index) => (
              <div className='goal-container' key={index}>
                {isEditing ? (
                  <textarea
                    ref={el => goalRefs.current[index] = el}
                    value={goal}
                    onChange={(e) => updateGoal(index, e.target.value)}
                    className="editable"
                    style={{ overflow: 'hidden', resize: 'none' }}
                  />
                ) : (
                  <textarea
                    ref={el => goalRefs.current[index] = el}
                    value={goal}
                    readOnly
                    className="readonly"
                    onChange={(e) => updateGoal(index, e.target.value)}
                    style={{ overflow: 'hidden', resize: 'none' }}
                  />
                )}
                {isEditing && <button className='remove-goal' onClick={() => removeGoal(index)}>X</button>}
              </div>
            ))}          
            {isEditing && <button className='add-goal' onClick={addGoal}>New Goal</button>}
            {!isEditing ? (
          <button className='edit-button' onClick={handleEdit}>Edit</button>
        ) : (
          <div className='edit-options'>
            <button className='save-button' onClick={handleSave}>Save</button>
            <button className='cancel-button' onClick={handleCancel}>Cancel</button>
          </div>
        )}
          </div>
        </div>
        
      </div>
      <div className="blog-and-calendar">
        <div className="calendar">
          <button id="prev-month" onClick={() => updateMonthInfo(-1)}>Previous Month</button>
          <h3>{new Date(monthInfo[1], monthInfo[0]).toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>
          <button id="next-month" onClick={() => updateMonthInfo(1)}>Next Month</button>
        </div>
        <div className="blog-content">
          {Array.isArray(runRecords) && runRecords.map((record : RunRecord, index : number) => (
              <div key={index} className="blog-entry">
                <div className="entry-date-location">
                  <p>{new Date(record.date).toLocaleDateString('en-US', {timeZone: 'UTC'})}</p>
                  <p>{record.location}</p>
                </div>
                <div className="entry-title">
                  <h3>{record.title}</h3>
                </div>
                <div className="entry-description">
                  <p>{record.notes}</p>
                </div>
                <div className="entry-stats">
                  <table>
                    <thead>
                    <tr>
                      <th id="duration">Duration</th>
                      <th id="pace">Pace</th>
                      <th id="distance">Distance</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                      <td id="duration-info">{record.duration} mins</td>
                      <td id="pace-info">{calculatePace(record.duration, record.distance)}</td>
                      <td id="distance-info">{record.distance} miles</td>
                    </tr>
                    </tbody>
                  </table>
                </div>
              </div>
          ))}
        </div>
      </div>
    </div>
</main>

  );
}