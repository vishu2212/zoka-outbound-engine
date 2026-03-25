import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';
import Campaigns from './pages/Campaigns';
import AIEngine from './pages/AIEngine';
import EmailEngine from './pages/EmailEngine';
import Analytics from './pages/Analytics';
import Optimization from './pages/Optimization';
import Settings from './pages/Settings';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="leads" element={<Leads />} />
          <Route path="campaigns" element={<Campaigns />} />
          <Route path="ai-engine" element={<AIEngine />} />
          <Route path="email-engine" element={<EmailEngine />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="optimization" element={<Optimization />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
