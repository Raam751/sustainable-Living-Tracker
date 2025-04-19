// routes.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import CarbonCalculatorPage from './pages/CarbonCalculatorPage';
import HabitTrackerPage from './pages/HabitTrackerPage';
import ChallengeBoardPage from './pages/ChallengeBoardPage';
import MarketplacePage from './pages/MarketplacePage';
import ProfilePage from './pages/ProfilePage';
import Layout from './components/layout/Layout';

const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="calculator" element={<CarbonCalculatorPage />} />
        <Route path="habits" element={<HabitTrackerPage />} />
        <Route path="challenges" element={<ChallengeBoardPage />} />
        <Route path="marketplace" element={<MarketplacePage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;