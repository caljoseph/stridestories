import React from 'react';
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
    const [username, setUserName] = React.useState(localStorage.getItem('username') || '');
    const currentAuthState = username ? AuthState.Authenticated : AuthState.Unauthenticated;
    const [authState, setAuthState] = React.useState(currentAuthState);

    return (
        <BrowserRouter>
            <div className='body'>
                <header>
                    <h1>Stridestories</h1>
                    <nav>
                    <ul className="menu-bar">
                        <li id="login">
                            < NavLink to=''>Login</NavLink>
                        </li>

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
                            username={username}
                            authState={authState}
                            onAuthChange={(username, authState) => {
                                setAuthState(authState);
                                setUserName(username);
                            }}
                        />
                        }
                        exact
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