// App.jsx
import React from 'react';
import AppRoutes from './routes';
import { UserDataProvider } from './UserDataContext';
import { AuthProvider } from './AuthContext';
import { ChallengesProvider } from './ChallengesContext';
import { MarketplaceProvider } from './MarketplaceContext';
import { HabitsProvider } from './HabitsContext';
import './styles/index.css';

function App() {
  return (
    <AuthProvider>
      <UserDataProvider>
        <HabitsProvider>
          <ChallengesProvider>
            <MarketplaceProvider>
              <AppRoutes />
            </MarketplaceProvider>
          </ChallengesProvider>
        </HabitsProvider>
      </UserDataProvider>
    </AuthProvider>
  );
}

export default App;