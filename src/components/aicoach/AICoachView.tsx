import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Check, 
  X, 
  Copy, 
  RotateCcw,
  ShieldCheck, 
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  AlertCircle,
  Globe
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAudioService } from '../../hooks/useAudioService';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';

export const AICoachView: React.FC = () => {
  const { 
    chatMessages, 
    sendMessageToCoach, 
    clearCoachChat,
    applyAction, 
    dismissAction, 
    user, 
    dailyLogs, 
    habits,
    memorySessions,
    chantingSessions,
    mindfulnessSessions,
    practiceSessions
  } = useApp();

  const { speak, stop, playbackState, activeId } = useAudioService();

  const {
    isSupported: isSpeechSupported,
    isListening,
    transcript,
    interimTranscript,
    error: speechError,
    recognitionLanguage,
    setRecognitionLanguage,
    startListening,
    stopListening,
    resetTranscript
  } = useSpeechRecognition('en-US');

  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [lastUserQuery, setLastUserQuery] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync speech transcript into input box for review & editing
  useEffect(() => {
    if (transcript) {
      setInputMessage(prev => {
        // Avoid duplicate appends if already matched
        if (prev.endsWith(transcript.trim())) return prev;
        return prev ? `${prev} ${transcript.trim()}` : transcript.trim();
      });
      resetTranscript();
    }
  }, [transcript, resetTranscript]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isSending]);

  const handleSend = async (customText?: string) => {
    if (isListening) {
      stopListening();
    }

    const query = (customText || inputMessage).trim();
    if (!query || isSending) return;

    setInputMessage('');
    setLastUserQuery(query);
    setIsSending(true);

    try {
      await sendMessageToCoach(query);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleToggleVoice = (msgId: string, text: string) => {
    if (activeId === msgId && playbackState === 'playing') {
      stop();
    } else {
      speak(text, { id: msgId, language: 'english' });
    }
  };

  const toggleMic = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const quickPrompts = [
    'Analyze my current habits and suggest an optimal morning rhythm.',
    'I only have 7 minutes today. What should I prioritize?',
    'How does my cognitive practice accuracy compare with prior days?',
    'Recommend a gentle mindfulness or breathing exercise for stress relief.'
  ];

  const handleClearHistory = () => {
    if (window.confirm('Clear AI Life Coach conversation history? This will remove previous messages and start a fresh session with your grounded coach.')) {
      clearCoachChat();
    }
  };

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto' }}>
      {/* Privacy & Grounding Header Banner */}
      <div className="clean-card" style={{
        padding: '16px 20px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        background: '#FFFFFF',
        borderColor: 'var(--border-subtle)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'var(--primary-subtle)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Bot size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.96rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>Conversational AI Life Coach</span>
              <span className="badge badge-teal" style={{ fontSize: '0.68rem', fontWeight: 600 }}>Grounded & Private</span>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Context: {practiceSessions?.length || (memorySessions.length + (chantingSessions?.length || 0))} sessions • {habits.length} habits • {dailyLogs.length} daily logs
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={handleClearHistory}
            className="btn btn-secondary btn-sm"
            style={{ fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '6px' }}
            title="Clear conversation history and start fresh"
          >
            <RotateCcw size={13} />
            <span>Clear History</span>
          </button>
        </div>
      </div>

      {/* Main Chat Container */}
      <div className="clean-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', height: '640px', background: '#FFFFFF' }}>
        {/* Messages List */}
        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '8px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {chatMessages.map(msg => {
            const isUser = msg.sender === 'user';
            const isCopied = copiedId === msg.id;
            const isSpeakingThis = activeId === msg.id && playbackState === 'playing';
            const isUnavailableMessage = msg.text.includes('temporarily unavailable');

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
                {/* Sender badge & action bar */}
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span>{isUser ? (user.username || 'You') : 'SMRITARA Life Coach'} • {msg.timestamp}</span>
                  {!isUser && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button
                        onClick={() => copyToClipboard(msg.text, msg.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: isCopied ? 'var(--primary)' : 'var(--text-muted)',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '3px',
                          fontSize: '0.7rem'
                        }}
                        title="Copy response"
                      >
                        {isCopied ? <Check size={12} /> : <Copy size={12} />}
                        <span>{isCopied ? 'Copied' : 'Copy'}</span>
                      </button>

                      <button
                        onClick={() => handleToggleVoice(msg.id, msg.text)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: isSpeakingThis ? 'var(--primary)' : 'var(--text-muted)',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '3px',
                          fontSize: '0.7rem'
                        }}
                        title={isSpeakingThis ? 'Stop voice readout' : 'Read response aloud'}
                      >
                        {isSpeakingThis ? <VolumeX size={12} /> : <Volume2 size={12} />}
                        <span>{isSpeakingThis ? 'Stop' : 'Listen'}</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Message Bubble */}
                <div style={{
                  background: isUser ? 'var(--primary)' : '#FAF9F6',
                  border: `1px solid ${isUser ? 'transparent' : isUnavailableMessage ? 'rgba(217, 119, 6, 0.3)' : 'var(--border-subtle)'}`,
                  color: isUser ? '#FFFFFF' : 'var(--text-main)',
                  padding: '14px 18px',
                  borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  fontSize: '0.92rem',
                  lineHeight: 1.6,
                  whiteSpace: 'pre-wrap',
                  boxShadow: isUser ? '0 2px 6px rgba(40, 84, 67, 0.15)' : 'none'
                }}>
                  {msg.text}

                  {/* Retry button for unavailable state */}
                  {isUnavailableMessage && lastUserQuery && (
                    <div style={{ marginTop: '12px', borderTop: '1px solid var(--border-subtle)', paddingTop: '10px' }}>
                      <button
                        onClick={() => handleSend(lastUserQuery)}
                        disabled={isSending}
                        className="btn btn-secondary btn-sm"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem' }}
                      >
                        <RotateCcw size={12} />
                        <span>Retry Question</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Interactive Action Proposal Cards */}
                {msg.proposedActions && msg.proposedActions.length > 0 && (
                  <div style={{ width: '100%', marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {msg.proposedActions.map(action => (
                      <div
                        key={action.id}
                        className="clean-card"
                        style={{
                          background: '#FFFFFF',
                          borderColor: 'var(--primary-light)',
                          padding: '14px 18px'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Sparkles size={16} color="var(--primary)" />
                            <strong style={{ fontSize: '0.92rem', color: 'var(--text-main)' }}>{action.title}</strong>
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
                              className="btn btn-primary btn-sm"
                              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                            >
                              <Check size={14} />
                              <span>Apply to Routine</span>
                            </button>
                            <button
                              onClick={() => dismissAction(action.id)}
                              className="btn btn-secondary btn-sm"
                              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                            >
                              <X size={14} />
                              <span>Dismiss</span>
                            </button>
                          </div>
                        ) : action.status === 'applied' ? (
                          <div style={{ fontSize: '0.8rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                            <Check size={14} />
                            <span>Applied to your personalized routine.</span>
                          </div>
                        ) : (
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            Suggestion dismissed.
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontSize: '0.85rem' }}>
              <Sparkles size={16} className="spin-slow" />
              <span>Synthesizing guidance grounded in your practice records...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Speech Recognition Active Indicator / Interim text */}
        {isListening && (
          <div style={{
            background: 'var(--primary-subtle)',
            border: '1px solid var(--primary-light)',
            borderRadius: 'var(--radius-sm)',
            padding: '8px 14px',
            marginTop: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px',
            fontSize: '0.82rem',
            color: 'var(--primary)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#dc2626',
                display: 'inline-block',
                animation: 'pulse 1.5s infinite'
              }} />
              <span><strong>Listening ({recognitionLanguage}):</strong> {interimTranscript || 'Speak clearly into your microphone...'}</span>
            </div>
            <button
              onClick={stopListening}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.72rem', padding: '3px 8px' }}
            >
              Done Speaking
            </button>
          </div>
        )}

        {/* Speech Error Feedback */}
        {speechError && (
          <div style={{
            background: 'var(--accent-amber-subtle)',
            border: '1px solid rgba(198, 128, 25, 0.3)',
            borderRadius: 'var(--radius-sm)',
            padding: '6px 12px',
            marginTop: '6px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.78rem',
            color: 'var(--accent-amber)'
          }}>
            <AlertCircle size={14} />
            <span>{speechError}</span>
          </div>
        )}

        {/* Quick Conversation Starters */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', padding: '10px 0 6px 0', borderTop: '1px solid var(--border-subtle)' }}>
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

        {/* Chat Input Bar with Speech Recognition & Language Selector */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.76rem', color: 'var(--text-muted)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={13} color="var(--primary)" />
              Private: Stored locally. API key remains secured on the local backend.
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Globe size={13} />
              <span>Voice Language:</span>
              <select
                value={recognitionLanguage}
                onChange={e => setRecognitionLanguage(e.target.value)}
                style={{
                  fontSize: '0.76rem',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  border: '1px solid var(--border-subtle)',
                  background: '#FFFFFF',
                  color: 'var(--text-main)',
                  cursor: 'pointer'
                }}
              >
                <option value="en-US">English (US)</option>
                <option value="en-IN">English (India)</option>
                <option value="hi-IN">हिन्दी (Hindi)</option>
                <option value="te-IN">తెలుగు (Telugu)</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <textarea
                className="input-field"
                placeholder="Ask your life coach anything... (Transcribe speech or type directly. Press Enter to send)"
                value={inputMessage}
                onChange={e => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isSending}
                rows={2}
                style={{ resize: 'none', width: '100%', fontFamily: 'inherit', lineHeight: 1.4, paddingRight: '44px' }}
              />
              {/* Voice Input Microphone Button */}
              <button
                type="button"
                onClick={toggleMic}
                disabled={isSending || !isSpeechSupported}
                style={{
                  position: 'absolute',
                  right: '10px',
                  bottom: '12px',
                  background: isListening ? '#fee2e2' : 'transparent',
                  border: `1px solid ${isListening ? '#ef4444' : 'var(--border-subtle)'}`,
                  color: isListening ? '#dc2626' : isSpeechSupported ? 'var(--primary)' : 'var(--text-muted)',
                  borderRadius: '6px',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: isSpeechSupported ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s'
                }}
                title={
                  !isSpeechSupported
                    ? 'Speech recognition not supported in this browser (Text input active)'
                    : isListening
                    ? 'Stop listening and review transcript'
                    : `Start voice input in ${recognitionLanguage}`
                }
              >
                {isListening ? <MicOff size={16} /> : <Mic size={16} />}
              </button>
            </div>

            <button
              onClick={() => handleSend()}
              className="btn btn-primary"
              disabled={!inputMessage.trim() || isSending}
              style={{ padding: '14px 22px', height: '52px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              title="Send message"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
