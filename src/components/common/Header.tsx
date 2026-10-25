import React from 'react';
import { Sparkles, Calendar, PlusCircle, CheckCircle2, Compass } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface HeaderProps {
  title: string;
  subtitle: string;
  onOpenLogModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle, onOpenLogModal }) => {
  const { user, getTodayLog, isDemoMode, exitDemoMode, setActiveTab } = useApp();
  const todayLog = getTodayLog();

  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div style={{ marginBottom: '24px' }}>
      {/* Demo Mode Notice */}
      {isDemoMode && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 16px',
          background: 'var(--accent-amber-subtle)',
          border: '1px solid rgba(198, 128, 25, 0.25)',
          borderRadius: 'var(--radius-md)',
          marginBottom: '16px',
          color: 'var(--accent-amber)',
          fontSize: '0.84rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Compass size={16} />
            <span>
              <strong>Demo Sandbox:</strong> Sample records active. Changes are local to the demo session.
            </span>
          </div>
          <button
            onClick={exitDemoMode}
            className="btn btn-secondary btn-sm"
            style={{
              padding: '3px 10px',
              fontSize: '0.75rem',
              color: 'var(--accent-amber)',
              borderColor: 'rgba(198, 128, 25, 0.3)'
            }}
          >
            Exit Demo
          </button>
        </div>
      )}

      <header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '14px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 style={{ fontSize: '1.65rem', fontWeight: 700, color: 'var(--text-main)' }}>{title}</h1>
            {user.chronotypeProfile && (
              <span className="badge badge-sage" style={{ textTransform: 'capitalize' }}>
                {user.chronotypeProfile.chronotype} Chronotype
              </span>
            )}
            {user.onboardingPreferences?.preferredLanguage && (
              <span className="badge badge-teal" style={{ textTransform: 'capitalize' }}>
                {user.onboardingPreferences.preferredLanguage}
              </span>
            )}
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '2px' }}>
            {subtitle}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Calendar Display */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '7px 12px',
            borderRadius: 'var(--radius-md)',
            background: '#FFFFFF',
            border: '1px solid var(--border-subtle)',
            fontSize: '0.84rem',
            color: 'var(--text-secondary)'
          }}>
            <Calendar size={14} color="var(--primary)" />
            <span>{formattedDate}</span>
          </div>

          {/* AI Coach Interactive Button */}
          <button 
            onClick={() => setActiveTab('coach')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 13px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--primary-subtle)',
              border: '1px solid rgba(40, 84, 67, 0.25)',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: 'var(--primary)',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            className="hover-subtle"
            title="Open SMRITARA AI Life Coach"
          >
            <Sparkles size={13} />
            <span>AI Coach Ready</span>
          </button>

          {/* Quick Check-In Button */}
          {onOpenLogModal && (
            <button 
              onClick={onOpenLogModal}
              className={`btn ${todayLog ? 'btn-secondary' : 'btn-primary'} btn-sm`}
            >
              {todayLog ? (
                <>
                  <CheckCircle2 size={15} color="#2E7D32" />
                  <span>Check-In Recorded</span>
                </>
              ) : (
                <>
                  <PlusCircle size={15} />
                  <span>Daily Check-In</span>
                </>
              )}
            </button>
          )}
        </div>
      </header>
    </div>
  );
};
