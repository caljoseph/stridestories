import React from 'react';

import { Unauthenticated } from './unauthenticated';
import { AuthState } from './authState';
import { Authenticated
 } from './authenticated';
export function Login({ username, authState, onAuthChange }) {
  return (
      <>
        {authState === AuthState.Authenticated && (
          <Authenticated username={username} onLogout={() => onAuthChange(username, AuthState.Unauthenticated)} />
        )}
        {authState === AuthState.Unauthenticated && (
          <Unauthenticated
            username={username}
            onLogin={(loginUserName) => {
              onAuthChange(loginUserName, AuthState.Authenticated);
            }}
          />
        )}
      </>
  );
}
