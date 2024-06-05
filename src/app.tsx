import React, {useEffect, useState} from 'react';
import { AuthState } from './login/authState.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';

import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { Login } from './login/login';
import { Blog } from './blog/blog';
import { Leaderboard } from './leaderboard/leaderboard';
import { Record } from './record/record';
import { About } from './about/about';


export default function App() {
    const [authState, setAuthState] = useState(AuthState.Unauthenticated);

    useEffect(() => {
         console.log("useEffect triggered");

        checkAuthStatus()
    }, []);

    async function checkAuthStatus() {
        try {
            const response = await fetch('api/private/users/auth', {
                method: 'GET',
                credentials: 'include',  // Necessary to send the cookie
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
            if (!response.ok) throw new Error('Failed to validate auth');
            const data = await response.json();
            setAuthState(data ? AuthState.Authenticated : AuthState.Unauthenticated);
        } catch (error) {
            console.error('Error checking auth status:', error);
        }
    }

    return (
        <BrowserRouter>
            <div className='body'>
                <header>
                    <h1>Stridestories</h1>
                    <nav>
                    <ul className="menu-bar">
                        { authState === AuthState.Authenticated && (
                        <li id="login">
                            < NavLink to='/'>Home</NavLink>
                        </li>
                        )}
                        { authState === AuthState.Unauthenticated && (
                        <li id="login">
                            < NavLink to='/'>Login</NavLink>
                        </li>
                        )}

                        { authState === AuthState.Authenticated && (
                        <li id="my-blog">
                            <NavLink to='blog'>My Blog</NavLink>
                        </li>
                        )}

                        { authState === AuthState.Authenticated && (
                        <li id="record">
                            <NavLink to='record'>Record</NavLink>
                        </li>
                        )}

                        <li id="leaderboard">
                            <NavLink to='leaderboard'>Leaderboard</NavLink>
                        </li>
                        <li id="about">
                            <NavLink to='about'>About</NavLink>
                        </li>

                    </ul>
                    </nav>
                </header>
                <Routes>
                    <Route
                    path='/'
                    element={
                         <Login
                            authState={authState}
                            onAuthChange={(authState) => {
                                setAuthState(authState);
                            }}
                        />
                        }
                    />
                    <Route path='/blog' element={<Blog />} />
                    <Route path='/leaderboard' element={<Leaderboard />} />
                    <Route path='/record' element={<Record />} />
                    <Route path='/about' element={<About />} />
                    <Route path='*' element={<NotFound />} />
                </Routes>
                <footer>
                    <span className="text-reset">Caleb Bradshaw</span>
                    <br />
                    <a href="https://github.com/caljoseph/startup">GitHub</a>
                </footer>
            </div>
        </BrowserRouter>
  );
}
function NotFound() {
    return <main>404: Return to sender. Address unknown.</main>;
  }