import React from 'react';
import { 
  LayoutDashboard, 
  Target, 
  Gamepad2, 
  BookOpen, 
  Wind, 
  Bot, 
  BarChart3, 
  Settings, 
  Volume2,
  VolumeX,
  RotateCcw,
  LogOut,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SmritaraBrand } from './SmritaraBrand';

export const Sidebar: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    user, 
    isDemoMode, 
    loadDemoData, 
    resetAllData, 
    logout, 
    exitDemoMode,
    ambientEnabled,
    toggleAmbient,
    practicePoints
  } = useApp();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'practice', label: 'Practice Routine', icon: Target },
    { id: 'games', label: 'Cognitive Games', icon: Gamepad2 },
    { id: 'library', label: 'Cultural Library', icon: BookOpen },
    { id: 'meditation', label: 'Meditation', icon: Wind },
    { id: 'progress', label: 'Progress & Insights', icon: BarChart3 },
    { id: 'coach', label: 'AI Life Coach', icon: Bot },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="app-sidebar" aria-label="Main Navigation">
      {/* Brand Header */}
      <div style={{ padding: '20px 20px', borderBottom: '1px solid var(--border-subtle)' }}>
        <SmritaraBrand variant="full" size="md" />
      </div>

      {/* Navigation List */}
      <nav style={{ flex: 1, padding: '14px 0', overflowY: 'auto' }}>
        {navItems.map(item => {
          const Icon = item.icon;
          // Match tab directly or backward-compatible aliases
          const isActive = activeTab === item.id ||
            (item.id === 'library' && activeTab === 'smritiveda') ||
            (item.id === 'games' && activeTab === 'memory') ||
            (item.id === 'meditation' && activeTab === 'mindfulness') ||
            (item.id === 'practice' && (activeTab === 'discipline' || activeTab === 'bodyclock')) ||
            (item.id === 'progress' && activeTab === 'patterns');

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`nav-item ${isActive ? 'active' : ''}`}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              aria-current={isActive ? 'page' : undefined}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Icon size={18} />
                <span className="nav-label">{item.label}</span>
              </div>
            </button>
          );
        })}
      </nav>

      {/* Ambient Audio Quick Toggle */}
      <div style={{ padding: '0 14px 10px 14px' }}>
        <button
          onClick={toggleAmbient}
          className="btn btn-secondary btn-sm"
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontSize: '0.78rem',
            padding: '6px 10px',
            color: ambientEnabled ? 'var(--primary)' : 'var(--text-muted)',
            borderColor: ambientEnabled ? 'var(--primary-light)' : 'var(--border-subtle)',
            background: ambientEnabled ? 'var(--primary-subtle)' : '#FFFFFF'
          }}
          title={ambientEnabled ? 'Pause soothing ambient drone' : 'Play soothing 432Hz ambient drone'}
        >
          {ambientEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
          <span>{ambientEnabled ? 'Ambient: Active' : 'Ambient: Off'}</span>
        </button>
      </div>

      {/* Bottom User & Mode Controls */}
      <div style={{ padding: '14px', borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-card-inner)' }}>
        {isDemoMode ? (
          <div style={{ marginBottom: '10px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '6px 10px',
              borderRadius: '6px',
              background: 'var(--accent-amber-subtle)',
              border: '1px solid rgba(198, 128, 25, 0.25)',
              fontSize: '0.75rem',
              color: 'var(--accent-amber)',
              marginBottom: '8px',
              fontWeight: 600
            }}>
              <span>Demo Sandbox</span>
              <button
                onClick={exitDemoMode}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--accent-amber)',
                  fontWeight: 700,
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  fontSize: '0.72rem'
                }}
              >
                Exit
              </button>
            </div>
            <button
              onClick={loadDemoData}
              className="btn btn-secondary btn-sm"
              style={{ width: '100%', fontSize: '0.75rem', padding: '6px 8px' }}
            >
              <RotateCcw size={12} color="var(--primary)" />
              <span>Regenerate Demo</span>
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
            <button
              onClick={() => {
                if (window.confirm('Reset all saved practice records to clean slate?')) {
                  resetAllData();
                }
              }}
              className="btn btn-secondary btn-sm"
              style={{ flex: 1, fontSize: '0.75rem', padding: '6px 8px' }}
              title="Reset records to clean slate"
            >
              <RotateCcw size={12} />
              <span>Reset</span>
            </button>
            <button
              onClick={logout}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.75rem', padding: '6px 8px' }}
              title="Sign out of current account"
            >
              <LogOut size={12} color="var(--accent-terracotta)" />
            </button>
          </div>
        )}

        {/* User Card */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#FFFFFF',
          padding: '10px 12px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)'
        }}>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
              {user.username}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Points: <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{practicePoints}</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--accent-amber)', fontSize: '0.85rem', fontWeight: 700 }}>
            <Sparkles size={15} />
            <span>{user.currentStreak}d</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
