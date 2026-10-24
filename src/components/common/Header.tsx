import React from 'react';
import { Sparkles, Calendar, PlusCircle, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface HeaderProps {
  title: string;
  subtitle: string;
  onOpenLogModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle, onOpenLogModal }) => {
  const { user, getTodayLog, setActiveTab } = useApp();
  const todayLog = getTodayLog();

  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  const hasApiKey = Boolean(user.geminiApiKey || import.meta.env.VITE_GEMINI_API_KEY);

  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '28px',
      flexWrap: 'wrap',
      gap: '16px'
    }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <h2 style={{ fontSize: '1.85rem', fontWeight: 800 }}>{title}</h2>
          {user.chronotypeProfile && (
            <span className="badge badge-purple" style={{ textTransform: 'capitalize' }}>
              {user.chronotypeProfile.chronotype} Chronotype
            </span>
          )}
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginTop: '2px' }}>
          {subtitle}
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Date Display */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 14px',
          borderRadius: 'var(--radius-md)',
          background: 'var(--bg-card-inner)',
          border: '1px solid var(--border-subtle)',
          fontSize: '0.85rem',
          color: 'var(--text-secondary)'
        }}>
          <Calendar size={15} color="var(--primary-light)" />
          <span>{formattedDate}</span>
        </div>

        {/* AI Status Badge */}
        <div 
          onClick={() => setActiveTab('settings')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 12px',
            borderRadius: 'var(--radius-md)',
            background: hasApiKey ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
            border: `1px solid ${hasApiKey ? 'rgba(16, 185, 129, 0.25)' : 'rgba(245, 158, 11, 0.25)'}`,
            fontSize: '0.78rem',
            fontWeight: 600,
            color: hasApiKey ? '#34d399' : '#fbbf24',
            cursor: 'pointer'
          }}
          title={hasApiKey ? 'Connected to live Gemini 2.5 Flash' : 'Running in offline grounded engine. Click to add key.'}
        >
          <Sparkles size={14} />
          <span>{hasApiKey ? 'Gemini 2.5' : 'Offline Engine'}</span>
        </div>

        {/* Quick Log Button */}
        {onOpenLogModal && (
          <button 
            onClick={onOpenLogModal}
            className={`btn ${todayLog ? 'btn-secondary' : 'btn-primary'}`}
          >
            {todayLog ? (
              <>
                <CheckCircle2 size={16} color="#10b981" />
                <span>Today Logged ({todayLog.disciplineScore} pts)</span>
              </>
            ) : (
              <>
                <PlusCircle size={16} />
                <span>Log Today</span>
              </>
            )}
          </button>
        )}
      </div>
    </header>
  );
};
