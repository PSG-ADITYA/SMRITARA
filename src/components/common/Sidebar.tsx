import React from 'react';
import { 
  LayoutDashboard, 
  Clock, 
  Target, 
  Brain, 
  Wind, 
  Bot, 
  Sparkles, 
  Settings, 
  Flame, 
  Play,
  RotateCcw
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, user, loadDemoData, resetAllData } = useApp();

  const navItems = [
    { id: 'dashboard', label: 'Command Center', icon: LayoutDashboard },
    { id: 'bodyclock', label: 'Body Clock', icon: Clock },
    { id: 'discipline', label: 'Discipline OS', icon: Target },
    { id: 'memory', label: 'Memory Gym', icon: Brain },
    { id: 'mindfulness', label: 'Mindfulness Studio', icon: Wind },
    { id: 'coach', label: 'AI Life Coach', icon: Bot },
    { id: 'patterns', label: 'Personal Patterns', icon: Sparkles },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="app-sidebar">
      {/* Brand Header */}
      <div style={{ padding: '24px 20px', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #8b5cf6 0%, #14b8a6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(139, 92, 246, 0.4)'
          }}>
            <Sparkles size={20} color="#ffffff" />
          </div>
          <div className="brand-text">
            <h1 style={{ fontSize: '1.25rem', fontWeight: 900, letterSpacing: '0.05em' }}>SMRITARA</h1>
            <p style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Personal Growth OS
            </p>
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <nav style={{ flex: 1, padding: '16px 0', overflowY: 'auto' }}>
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={18} />
              <span className="nav-label">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Hackathon Demo Quick Bar */}
      <div style={{ padding: '14px', borderTop: '1px solid var(--border-subtle)', background: 'rgba(0,0,0,0.2)' }}>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
          <button
            onClick={loadDemoData}
            className="btn btn-secondary btn-sm"
            style={{ flex: 1, fontSize: '0.75rem', padding: '6px 8px' }}
            title="Populate 7 days of realistic habit, sleep, and memory data"
          >
            <Play size={12} color="#10b981" />
            <span className="nav-label">Demo Data</span>
          </button>
          <button
            onClick={() => {
              if (window.confirm('Reset all saved logs and habits to clean slate?')) {
                resetAllData();
              }
            }}
            className="btn btn-secondary btn-sm"
            style={{ fontSize: '0.75rem', padding: '6px 8px' }}
            title="Reset storage"
          >
            <RotateCcw size={12} color="#9ca3af" />
          </button>
        </div>

        {/* User Card */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--bg-card-inner)',
          padding: '10px 12px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)'
        }}>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>
              {user.username}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Score: <span style={{ color: 'var(--primary-light)', fontWeight: 600 }}>{user.disciplineScore}</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#f59e0b', fontSize: '0.85rem', fontWeight: 800 }}>
            <Flame size={16} />
            <span>{user.currentStreak}d</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
