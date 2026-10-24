import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Check, 
  X, 
  Info, 
  Calendar, 
  Target, 
  Brain, 
  Wind,
  ShieldCheck,
  Flame
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AICoachView: React.FC = () => {
  const { 
    chatMessages, 
    sendMessageToCoach, 
    applyAction, 
    dismissAction, 
    user, 
    dailyLogs, 
    habits 
  } = useApp();

  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isSending) return;

    const query = inputMessage;
    setInputMessage('');
    setIsSending(true);

    try {
      await sendMessageToCoach(query);
    } finally {
      setIsSending(false);
    }
  };

  const quickPrompts = [
    'Analyze my last 7 days of sleep and discipline.',
    'Align my daily schedule with my Chronotype.',
    'Recommend a memory exercise to sharpen my focus.',
    'Suggest realistic habit adjustments to raise my score.',
  ];

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto' }}>
      {/* Grounded AI Transparency Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'rgba(139, 92, 246, 0.1)',
        border: '1px solid rgba(139, 92, 246, 0.25)',
        borderRadius: 'var(--radius-md)',
        padding: '14px 20px',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ShieldCheck size={20} color="var(--primary-light)" />
          <div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#ffffff' }}>
              Data-Grounded AI Architecture
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Synthesizing: {dailyLogs.length} logs • {habits.length} habits • {user.chronotypeProfile ? user.chronotypeProfile.label : 'No chronotype'} • Streak {user.currentStreak}d
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <Sparkles size={14} color="#10b981" />
          <span>Active Approvals Mode</span>
        </div>
      </div>

      {/* Main Chat Container */}
      <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', height: '620px' }}>
        {/* Messages List */}
        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '8px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {chatMessages.map(msg => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: isUser ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  alignSelf: isUser ? 'flex-end' : 'flex-start'
                }}
              >
                {/* Sender badge */}
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {isUser ? user.username : 'SMRITARA Life Coach'}
                  <span>• {msg.timestamp}</span>
                </div>

                {/* Message Bubble */}
                <div style={{
                  background: isUser ? 'linear-gradient(135deg, var(--primary) 0%, #7c3aed 100%)' : 'var(--bg-card-inner)',
                  border: `1px solid ${isUser ? 'transparent' : 'var(--border-subtle)'}`,
                  color: '#ffffff',
                  padding: '14px 18px',
                  borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  fontSize: '0.92rem',
                  lineHeight: 1.6,
                  whiteSpace: 'pre-wrap'
                }}>
                  {msg.text}
                </div>

                {/* Interactive Action Proposal Cards (User Approval Loop) */}
                {msg.proposedActions && msg.proposedActions.length > 0 && (
                  <div style={{ width: '100%', marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {msg.proposedActions.map(action => (
                      <div
                        key={action.id}
                        style={{
                          background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%)',
                          border: '1px solid rgba(20, 184, 166, 0.35)',
                          borderRadius: 'var(--radius-md)',
                          padding: '14px 18px'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Sparkles size={16} color="#2dd4bf" />
                            <strong style={{ fontSize: '0.92rem', color: '#ffffff' }}>{action.title}</strong>
                          </div>
                          <span className="badge badge-teal" style={{ fontSize: '0.68rem' }}>
                            {action.status.toUpperCase()}
                          </span>
                        </div>

                        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                          {action.description}
                        </p>

                        {action.status === 'pending' ? (
                          <div style={{ display: 'flex', gap: '10px' }}>
                            <button
                              onClick={() => applyAction(action.id)}
                              className="btn btn-teal btn-sm"
                            >
                              <Check size={14} />
                              <span>Approve & Apply to App</span>
                            </button>
                            <button
                              onClick={() => dismissAction(action.id)}
                              className="btn btn-secondary btn-sm"
                            >
                              <X size={14} />
                              <span>Dismiss</span>
                            </button>
                          </div>
                        ) : action.status === 'applied' ? (
                          <div style={{ fontSize: '0.8rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Check size={14} />
                            <span>Approved and successfully applied to your platform records!</span>
                          </div>
                        ) : (
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            Action dismissed.
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          {isSending && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-light)', fontSize: '0.85rem' }}>
              <Sparkles size={16} className="animate-spin" />
              <span>Synthesizing observations & recommendations...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', padding: '12px 0 8px 0', borderTop: '1px solid var(--border-subtle)' }}>
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => {
                setInputMessage(prompt);
              }}
              className="btn btn-secondary btn-sm"
              style={{ whiteSpace: 'nowrap', fontSize: '0.78rem' }}
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Chat Input Bar */}
        <form onSubmit={handleSend} style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
          <input
            type="text"
            className="input-field"
            placeholder="Ask your life coach about habits, focus windows, or memory training..."
            value={inputMessage}
            onChange={e => setInputMessage(e.target.value)}
            disabled={isSending}
          />
          <button
            type="submit"
            className="btn btn-primary"
            disabled={!inputMessage.trim() || isSending}
            style={{ padding: '0 24px' }}
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};
