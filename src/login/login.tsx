import React from 'react';

import { Unauthenticated } from './unauthenticated';
import { AuthState } from './authState';
import { Authenticated } from './authenticated';


type OnAuthChangeType = (newState: AuthState) => void;
interface LoginProps {
    authState: AuthState;
    onAuthChange: OnAuthChangeType;
}

export function Login({ authState, onAuthChange } : LoginProps) {
  return (
      <>
        {authState === AuthState.Authenticated && (
          <Authenticated onLogout={() => onAuthChange(AuthState.Unauthenticated)} />
        )}
        {authState === AuthState.Unauthenticated && (
          <Unauthenticated
            onLogin={() => {
              onAuthChange(AuthState.Authenticated);
            }}
          />
        )}
      </>
  );
}
