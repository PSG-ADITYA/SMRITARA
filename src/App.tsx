import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/common/Sidebar';
import { Header } from './components/common/Header';
import { WelcomeView } from './components/onboarding/WelcomeView';
import { OnboardingWizard } from './components/onboarding/OnboardingWizard';
import { DashboardView } from './components/dashboard/DashboardView';
import { PracticeView } from './components/practice/PracticeView';
import { MemoryGymView } from './components/memory/MemoryGymView';
import { SmritiVedaView } from './components/smritiveda/SmritiVedaView';
import { MindfulnessView } from './components/mindfulness/MindfulnessView';
import { ProgressView } from './components/progress/ProgressView';
import { AICoachView } from './components/aicoach/AICoachView';
import { SettingsView } from './components/settings/SettingsView';
import { DailyLogModal } from './components/discipline/DailyLogModal';
import { SpokenGuideBar } from './components/guide/SpokenGuideBar';
import { GuidedTourModal } from './components/guide/GuidedTourModal';
import { ResetPasswordModal } from './components/onboarding/ResetPasswordModal';

const AppContent: React.FC = () => {
  const { user, isAuthenticated, isDemoMode, isOnboarding, activeTab, isPasswordRecovery, setIsPasswordRecovery } = useApp();
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isTourOpen, setIsTourOpen] = useState(false);

  const getHeaderMeta = () => {
    switch (activeTab) {
      case 'practice':
      case 'discipline':
      case 'bodyclock':
        return {
          title: 'Daily Practice Routine',
          subtitle: 'Circadian energy alignment, constructive habit tracking, and focused deep work intervals.'
        };
      case 'games':
      case 'memory':
        return {
          title: 'Cognitive Memory Gym',
          subtitle: 'Spatial matrix patterns, sequence sound memory, and classical passage retention.'
        };
      case 'library':
      case 'smritiveda':
        return {
          title: 'Cultural Wisdom & Chanting',
          subtitle: 'Classical literature, philosophical reflections, and rhythm-paced chanting studio.'
        };
      case 'meditation':
      case 'mindfulness':
        return {
          title: 'Meditation & Breathwork',
          subtitle: 'Guided respiratory regulation, synchronized breath pacing, and mindful grounding.'
        };
      case 'progress':
      case 'patterns':
        return {
          title: 'Progress & Session Insights',
          subtitle: 'Factual session comparisons, consistency milestones, and verified practice history.'
        };
      case 'coach':
        return {
          title: 'AI Life Coach',
          subtitle: 'Conversational reflection and guidance with voice input, powered by private Gemini AI.'
        };
      case 'settings':
        return {
          title: 'Settings & Benchmarks',
          subtitle: 'Customize interface language, audio pacing, accessibility, and local data portability.'
        };
      case 'dashboard':
      default:
        return {
          title: 'Personal Command Center',
          subtitle: 'Your daily practice focus, rotating wisdom tip, and factual session baseline.'
        };
    }
  };

  const { title, subtitle } = getHeaderMeta();

  return (
    <>
      <ResetPasswordModal
        isOpen={isPasswordRecovery}
        onClose={() => setIsPasswordRecovery(false)}
      />

      {!isAuthenticated && !isOnboarding ? (
        <WelcomeView />
      ) : isOnboarding || (isAuthenticated && !isDemoMode && !user.onboardingCompleted) ? (
        <OnboardingWizard />
      ) : (
        <div className="app-container">
          <Sidebar />
          <main className="app-content">
            <Header
              title={title}
              subtitle={subtitle}
              onOpenLogModal={() => setIsLogModalOpen(true)}
            />

            {activeTab === 'dashboard' && <DashboardView onOpenLogModal={() => setIsLogModalOpen(true)} />}
            {(activeTab === 'practice' || activeTab === 'discipline' || activeTab === 'bodyclock') && (
              <PracticeView onOpenLogModal={() => setIsLogModalOpen(true)} />
            )}
            {(activeTab === 'games' || activeTab === 'memory') && <MemoryGymView />}
            {(activeTab === 'library' || activeTab === 'smritiveda') && <SmritiVedaView />}
            {(activeTab === 'meditation' || activeTab === 'mindfulness') && <MindfulnessView />}
            {(activeTab === 'progress' || activeTab === 'patterns') && <ProgressView />}
            {activeTab === 'coach' && <AICoachView />}
            {activeTab === 'settings' && <SettingsView />}

            <DailyLogModal
              isOpen={isLogModalOpen}
              onClose={() => setIsLogModalOpen(false)}
            />

            {/* Spoken AI Website Guide & Captions */}
            <SpokenGuideBar onStartTour={() => setIsTourOpen(true)} />

            {/* First-Run Interactive Guided Tour Modal */}
            <GuidedTourModal
              isOpen={isTourOpen}
              onClose={() => setIsTourOpen(false)}
            />
          </main>
        </div>
      )}
    </>
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
