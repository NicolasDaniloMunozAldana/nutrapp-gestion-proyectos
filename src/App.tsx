import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Dashboard as TeamBoard } from './pages/Dashboard';
import { NotFound } from './pages/NotFound';
import { DashboardPage } from './features/tracking/pages/DashboardPage';
import { MyViewPage } from './features/tracking/pages/MyViewPage';
import './assets/styles/global.scss';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/mi-vista" element={<MyViewPage />} />
        <Route path="/mi-vista/:accountId" element={<MyViewPage />} />
        <Route path="/teamboard" element={<TeamBoard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
