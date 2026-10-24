import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/common/Sidebar';
import { Header } from './components/common/Header';
import { DashboardView } from './components/dashboard/DashboardView';
import { BodyClockView } from './components/bodyclock/BodyClockView';
import { DisciplineView } from './components/discipline/DisciplineView';
import { MemoryGymView } from './components/memory/MemoryGymView';
import { MindfulnessView } from './components/mindfulness/MindfulnessView';
import { AICoachView } from './components/aicoach/AICoachView';
import { PersonalPatternsView } from './components/patterns/PersonalPatternsView';
import { SettingsView } from './components/settings/SettingsView';
import { DailyLogModal } from './components/discipline/DailyLogModal';

const AppContent: React.FC = () => {
  const { activeTab } = useApp();
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  const getHeaderMeta = () => {
    switch (activeTab) {
      case 'bodyclock':
        return {
          title: 'Body Clock & Circadian Rhythm',
          subtitle: 'Assess your morningness-eveningness chronotype and align your daily schedule with your biology.'
        };
      case 'discipline':
        return {
          title: 'Discipline OS',
          subtitle: 'Execute daily routines, track constructive habits, and run timed deep work focus sprints.'
        };
      case 'memory':
        return {
          title: 'Memory Gym',
          subtitle: 'Cognitive engagement exercises inspired by Smriti Veda: spatial matrix, sequence chimes, and cultural passages.'
        };
      case 'mindfulness':
        return {
          title: 'Mindfulness Studio',
          subtitle: 'Interactive respiratory regulation, heart coherence pacing, and mindful self-reflection.'
        };
      case 'coach':
        return {
          title: 'AI Life Coach',
          subtitle: 'Intelligent synthesis connecting your habits, circadian rhythms, and focus data with action proposals.'
        };
      case 'patterns':
        return {
          title: 'Personal Pattern Engine',
          subtitle: 'Transparent, grounded statistical insights uncovering relationships between sleep, habits, and mood.'
        };
      case 'settings':
        return {
          title: 'Settings & Benchmarks',
          subtitle: 'Customize target sleep, screen limits, Gemini API key, and data privacy controls.'
        };
      case 'dashboard':
      default:
        return {
          title: 'Command Center',
          subtitle: 'Unified overview of your circadian schedule, discipline score, cognitive memory, and mindfulness.'
        };
    }
  };

  const { title, subtitle } = getHeaderMeta();

  return (
    <div className="app-container">
      <Sidebar />
      <main className="app-content">
        <Header
          title={title}
          subtitle={subtitle}
          onOpenLogModal={() => setIsLogModalOpen(true)}
        />

        {activeTab === 'dashboard' && <DashboardView onOpenLogModal={() => setIsLogModalOpen(true)} />}
        {activeTab === 'bodyclock' && <BodyClockView />}
        {activeTab === 'discipline' && <DisciplineView onOpenLogModal={() => setIsLogModalOpen(true)} />}
        {activeTab === 'memory' && <MemoryGymView />}
        {activeTab === 'mindfulness' && <MindfulnessView />}
        {activeTab === 'coach' && <AICoachView />}
        {activeTab === 'patterns' && <PersonalPatternsView />}
        {activeTab === 'settings' && <SettingsView />}

        <DailyLogModal
          isOpen={isLogModalOpen}
          onClose={() => setIsLogModalOpen(false)}
        />
      </main>
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
