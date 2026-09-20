import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DemoBadge } from './components/common/DemoBadge';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { SimulationModal } from './components/dashboard/SimulationModal';
import { OverviewPage } from './pages/OverviewPage';
import { LiveAlertsPage } from './pages/LiveAlertsPage';
import { AlertDetailPage } from './pages/AlertDetailPage';
import { NodesPage } from './pages/NodesPage';
import { SoundAnalysisPage } from './pages/SoundAnalysisPage';
import { ArchitecturePage } from './pages/ArchitecturePage';
import { ImpactPage } from './pages/ImpactPage';
import { ProjectInfoPage } from './pages/ProjectInfoPage';
import { LoginPage } from './pages/LoginPage';
import { api } from './services/api';
import { SensorNode } from './types';

export const AppContent: React.FC = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSimulationOpen, setIsSimulationOpen] = useState(false);
  const [nodes, setNodes] = useState<SensorNode[]>([]);
  const [pendingAlertCount, setPendingAlertCount] = useState(0);

  const fetchGlobalStats = async () => {
    try {
      const [nodesData, alertsData] = await Promise.all([
        api.getNodes(),
        api.getAlerts({ status: 'pending' }),
      ]);
      setNodes(nodesData);
      setPendingAlertCount(alertsData.length);
    } catch (e) {
      console.warn('Initial data poll error:', e);
    }
  };

  useEffect(() => {
    fetchGlobalStats();
    const timer = setInterval(fetchGlobalStats, 20000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* 1. Persistent Mandatory Prototype Demo Banner */}
      <DemoBadge />

      {/* 2. Top Header Navbar */}
      <Navbar
        onOpenSimulation={() => setIsSimulationOpen(true)}
        onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        isMobileSidebarOpen={isMobileSidebarOpen}
      />

      {/* 3. Main Body: Sidebar + Page Container */}
      <div className="flex flex-1">
        <Sidebar
          pendingAlertCount={pendingAlertCount}
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
          <Routes>
            <Route path="/" element={<OverviewPage />} />
            <Route path="/alerts" element={<LiveAlertsPage />} />
            <Route path="/alerts/:id" element={<AlertDetailPage />} />
            <Route path="/nodes" element={<NodesPage />} />
            <Route path="/sound-analysis" element={<SoundAnalysisPage />} />
            <Route path="/architecture" element={<ArchitecturePage />} />
            <Route path="/impact" element={<ImpactPage />} />
            <Route path="/project-info" element={<ProjectInfoPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>

      {/* Global Simulation Modal */}
      <SimulationModal
        isOpen={isSimulationOpen}
        onClose={() => setIsSimulationOpen(false)}
        nodes={nodes}
        onSimulationComplete={fetchGlobalStats}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}
