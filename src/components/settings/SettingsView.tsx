import React, { useState, useRef } from 'react';
import { 
  Settings, 
  Moon, 
  Smartphone, 
  Shield, 
  RotateCcw, 
  Check, 
  Download, 
  Upload, 
  AlertTriangle,
  User,
  Globe,
  LogOut,
  Compass,
  Volume2,
  VolumeX,
  Sparkles,
  MessageSquare,
  Trash2,
  Lock
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { InterfaceLanguage } from '../../types';

export const SettingsView: React.FC = () => {
  const { 
    user, 
    updateUserTargets, 
    updateUserSettings,
    setInterfaceLanguage,
    soundEnabled,
    setSoundEnabled,
    speechRate,
    setSpeechRate,
    celebrationsEnabled,
    setCelebrationsEnabled,
    ambientEnabled,
    toggleAmbient,
    clearCoachChat,
    resetAllData, 
    exportData, 
    importData,
    logout,
    deleteAccount,
    setIsPasswordRecovery,
    isDemoMode,
    exitDemoMode
  } = useApp();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [confirmDeleteInput, setConfirmDeleteInput] = useState('');
  const [confirmDeleteCheckbox, setConfirmDeleteCheckbox] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    setDeleteError(null);
    try {
      const res = await deleteAccount();
      if (!res.success) {
        setDeleteError(res.error || 'Failed to delete account. Please try again.');
        setIsDeleting(false);
      } else {
        setShowDeleteModal(false);
      }
    } catch (err: any) {
      setDeleteError(err.message || 'An unexpected error occurred while deleting your account.');
      setIsDeleting(false);
    }
  };

  const [sleepTarget, setSleepTarget] = useState(user.targetSleep || 8.0);
  const [screenLimit, setScreenLimit] = useState(user.targetScreenTime || 4.0);
  const [selectedLanguage, setSelectedLanguage] = useState<InterfaceLanguage>(
    (user.onboardingPreferences?.preferredLanguage as InterfaceLanguage) || 'english'
  );
  const [largerText, setLargerText] = useState(user.onboardingPreferences?.accessibility?.largerText || false);
  const [reducedMotion, setReducedMotion] = useState(user.onboardingPreferences?.accessibility?.reducedMotion || false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [chatClearedSuccess, setChatClearedSuccess] = useState(false);
  const [importFeedback, setImportFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSavePreferences = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateUserSettings({
      targetSleep: sleepTarget,
      targetScreenTime: screenLimit,
      interfaceLanguage: selectedLanguage,
      speechRate: speechRate,
      soundEnabled: soundEnabled,
      celebrationsEnabled: celebrationsEnabled,
      accessibility: {
        largerText,
        reducedMotion,
        soundEnabled
      }
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleClearHistory = () => {
    if (window.confirm('Clear conversation history with your AI Life Coach? This will reset the chat to the initial greeting.')) {
      clearCoachChat();
      setChatClearedSuccess(true);
      setTimeout(() => setChatClearedSuccess(false), 3000);
    }
  };

  const handleExport = () => {
    const backupPkg = exportData();
    const jsonStr = JSON.stringify(backupPkg, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const today = new Date().toISOString().split('T')[0];
    link.href = url;
    link.download = `smritara-backup-${today}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const rawContent = event.target?.result as string;
        const parsed = JSON.parse(rawContent);

        if (!parsed || typeof parsed !== 'object' || parsed.appName !== 'SMRITARA') {
          setImportFeedback({
            type: 'error',
            message: 'Validation failed: File is not a valid SMRITARA backup package.'
          });
          return;
        }

        const habitCount = parsed.payload?.habits?.length || 0;
        const logCount = parsed.payload?.dailyLogs?.length || 0;

        const confirmRestore = window.confirm(
          `Restore Backup Confirmation:\n\n` +
          `This backup was created on ${parsed.exportedAt || 'unknown date'}.\n` +
          `It contains ${habitCount} habit(s) and ${logCount} daily log(s).\n\n` +
          `Proceeding will replace your current active records with this backup. Do you want to continue?`
        );

        if (!confirmRestore) {
          if (fileInputRef.current) fileInputRef.current.value = '';
          return;
        }

        const result = importData(parsed);
        if (result.success) {
          setImportFeedback({
            type: 'success',
            message: `Success! Restored ${result.counts?.habits} habits, ${result.counts?.logs} daily logs, and ${result.counts?.sessions} session records.`
          });
          setTimeout(() => setImportFeedback(null), 5000);
        } else {
          setImportFeedback({
            type: 'error',
            message: result.message
          });
        }
      } catch (err: any) {
        setImportFeedback({
          type: 'error',
          message: `Malformed JSON: ${err.message || 'Unable to parse file'}`
        });
      } finally {
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsText(file);
  };

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* 1. Account Profile Card */}
      <div className="clean-card" style={{ padding: '24px 28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <User size={20} color="var(--primary)" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)' }}>Account & Identity</h3>
          </div>

          {isDemoMode ? (
            <button
              onClick={exitDemoMode}
              className="btn btn-secondary btn-sm"
              style={{ color: 'var(--accent-amber)', borderColor: 'rgba(198, 128, 25, 0.4)' }}
            >
              <Compass size={14} />
              <span>Exit Demo Mode</span>
            </button>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => setIsPasswordRecovery(true)}
                className="btn btn-secondary btn-sm"
                style={{ color: 'var(--text-main)', borderColor: 'var(--border-subtle)' }}
                data-testid="change-password-btn"
                title="Set a new password for this account"
              >
                <Lock size={14} />
                <span>Change Password</span>
              </button>
              <button
                type="button"
                onClick={logout}
                className="btn btn-secondary btn-sm"
                style={{ color: 'var(--text-secondary)' }}
              >
                <LogOut size={14} />
                <span>Sign Out</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setConfirmDeleteInput('');
                  setConfirmDeleteCheckbox(false);
                  setDeleteError(null);
                  setShowDeleteModal(true);
                }}
                className="btn btn-secondary btn-sm"
                style={{
                  color: '#dc2626',
                  borderColor: 'rgba(220, 38, 38, 0.3)',
                  background: 'rgba(220, 38, 38, 0.04)'
                }}
                data-testid="header-delete-account-btn"
                title="Permanently delete account and all records"
              >
                <Trash2 size={14} />
                <span>Delete Account</span>
              </button>
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
          <div style={{ padding: '12px 14px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-card-inner)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Active User</div>
            <div style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '2px' }}>{user.username || 'Personal Guest'}</div>
          </div>

          <div style={{ padding: '12px 14px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-card-inner)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Account Email</div>
            <div style={{ fontSize: '0.92rem', fontWeight: 500, color: 'var(--text-secondary)', marginTop: '2px' }}>
              {user.email || 'local-guest@smritara.internal'}
            </div>
          </div>

          <div style={{ padding: '12px 14px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-card-inner)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Data Environment</div>
            <div style={{ fontSize: '0.92rem', fontWeight: 700, color: isDemoMode ? 'var(--accent-amber)' : 'var(--primary)', marginTop: '2px' }}>
              {isDemoMode ? 'Demo Sandbox' : 'Local Storage (Protected)'}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Platform Preferences & Benchmarks Form */}
      <div className="clean-card" style={{ padding: '24px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
          <Settings size={20} color="var(--primary)" />
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)' }}>Preferences & Benchmarks</h3>
        </div>

        <form onSubmit={handleSavePreferences}>
          {/* Interface Language */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <Globe size={16} color="var(--primary)" />
              <label style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>
                Interface Language
              </label>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
              Primary language for navigation, practice descriptions, and daily tips. Sanskrit mantras remain available in the Cultural Library.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
              {[
                { id: 'english', label: 'English', desc: 'Standard UI labels & guides' },
                { id: 'telugu', label: 'తెలుగు (Telugu)', desc: 'Telugu navigation & context' },
                { id: 'hindi', label: 'हिन्दी (Hindi)', desc: 'Hindi navigation & context' },
              ].map(opt => {
                const isSelected = selectedLanguage === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSelectedLanguage(opt.id as InterfaceLanguage)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      padding: '12px 14px',
                      borderRadius: 'var(--radius-sm)',
                      border: `1.5px solid ${isSelected ? 'var(--primary)' : 'var(--border-subtle)'}`,
                      background: isSelected ? 'var(--primary-subtle)' : '#FFFFFF',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                      <strong style={{ fontSize: '0.9rem', color: isSelected ? 'var(--primary)' : 'var(--text-main)' }}>
                        {opt.label}
                      </strong>
                      {isSelected && <Check size={14} color="var(--primary)" />}
                    </div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {opt.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Audio & Interaction Sound Preferences */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <Volume2 size={16} color="var(--primary)" />
              <label style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>
                Audio & Interaction Feedback
              </label>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
              Independent controls for interaction chimes, soothing ambient drone, and voice recitation pacing.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
              {/* Interaction Sounds Toggle */}
              <div style={{ padding: '14px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-card-inner)', border: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-main)' }}>
                    Subtle Audio Feedback
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    Gentle start chimes and singing bowls
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`btn btn-sm ${soundEnabled ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.74rem' }}
                >
                  {soundEnabled ? <Volume2 size={13} /> : <VolumeX size={13} />}
                  <span>{soundEnabled ? 'On' : 'Muted'}</span>
                </button>
              </div>

              {/* Ambient Audio Toggle */}
              <div style={{ padding: '14px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-card-inner)', border: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-main)' }}>
                    432Hz Ambient Drone
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    Calming background acoustic resonance
                  </div>
                </div>
                <button
                  type="button"
                  onClick={toggleAmbient}
                  className={`btn btn-sm ${ambientEnabled ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.74rem' }}
                >
                  {ambientEnabled ? <Volume2 size={13} /> : <VolumeX size={13} />}
                  <span>{ambientEnabled ? 'Active' : 'Off'}</span>
                </button>
              </div>

              {/* Speech Recitation Speed */}
              <div style={{ padding: '14px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-card-inner)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-main)' }}>
                    Recitation Speed
                  </span>
                  <span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.82rem' }}>
                    {speechRate}×
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                  {[
                    { rate: 0.85, label: '0.85×' },
                    { rate: 1.0, label: '1.0×' },
                    { rate: 1.2, label: '1.2×' }
                  ].map(r => (
                    <button
                      key={r.rate}
                      type="button"
                      onClick={() => setSpeechRate(r.rate)}
                      className={`btn btn-sm ${speechRate === r.rate ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ flex: 1, fontSize: '0.72rem', padding: '4px 6px' }}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '8px', lineHeight: 1.4 }}>
                  Engine Note: Web Speech synthesis speed is governed by your local browser speech synthesizer. Chromium and WebKit apply exact rate multipliers; unsupported voice engines default gracefully to 1.0×.
                </div>
              </div>

              {/* Celebratory Effects Toggle */}
              <div style={{ padding: '14px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-card-inner)', border: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-main)' }}>
                    Celebratory Effects
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    Gentle confetti on practice completion
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setCelebrationsEnabled(!celebrationsEnabled)}
                  className={`btn btn-sm ${celebrationsEnabled ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.74rem' }}
                >
                  <Sparkles size={13} />
                  <span>{celebrationsEnabled ? 'Enabled' : 'Disabled'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Self-Reported Benchmarks */}
          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '6px', color: 'var(--text-main)' }}>
              Self-Reported Routine Targets
            </h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
              Personal benchmark targets for your daily routine. SMRITARA does not connect to invasive device screen-time APIs or medical sensors.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
              <div style={{ padding: '14px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-card-inner)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.84rem', fontWeight: 600 }}>
                    <Moon size={15} color="var(--primary)" />
                    <span>Target Sleep (Self-Reported)</span>
                  </div>
                  <span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem' }}>
                    {sleepTarget}h
                  </span>
                </div>
                <input
                  type="range"
                  min="4.0"
                  max="12.0"
                  step="0.5"
                  value={sleepTarget}
                  onChange={e => setSleepTarget(parseFloat(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--primary)' }}
                />
              </div>

              <div style={{ padding: '14px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-card-inner)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.84rem', fontWeight: 600 }}>
                    <Smartphone size={15} color="var(--accent-amber)" />
                    <span>Target Screen Limit (Self-Reported)</span>
                  </div>
                  <span style={{ color: 'var(--accent-amber)', fontWeight: 700, fontSize: '0.85rem' }}>
                    {screenLimit}h
                  </span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="12.0"
                  step="0.5"
                  value={screenLimit}
                  onChange={e => setScreenLimit(parseFloat(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--accent-amber)' }}
                />
              </div>
            </div>
          </div>

          {/* Accessibility Settings */}
          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '10px', color: 'var(--text-main)' }}>
              Accessibility & Motion
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
              <div style={{ padding: '12px 14px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-card-inner)', border: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-main)' }}>High-Legibility Text</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Scale typography for readability</div>
                </div>
                <button
                  type="button"
                  onClick={() => setLargerText(!largerText)}
                  className={`btn btn-sm ${largerText ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ fontSize: '0.74rem' }}
                >
                  {largerText ? 'Active' : 'Standard'}
                </button>
              </div>

              <div style={{ padding: '12px 14px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-card-inner)', border: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-main)' }}>Reduced Motion</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Mute breathwork pulsing transitions</div>
                </div>
                <button
                  type="button"
                  onClick={() => setReducedMotion(!reducedMotion)}
                  className={`btn btn-sm ${reducedMotion ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ fontSize: '0.74rem' }}
                >
                  {reducedMotion ? 'Active' : 'Standard'}
                </button>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn btn-primary" style={{ padding: '10px 24px', fontSize: '0.88rem' }}>
              {savedSuccess ? (
                <>
                  <Check size={16} />
                  <span>Preferences Saved</span>
                </>
              ) : (
                <span>Save Preferences</span>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* 3. AI Coach History Reset */}
      <div className="clean-card" style={{ padding: '24px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
          <MessageSquare size={18} color="var(--primary)" />
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)' }}>AI Coach Memory</h3>
        </div>

        <p style={{ color: 'var(--text-secondary)', fontSize: '0.84rem', marginBottom: '16px', lineHeight: 1.5 }}>
          Your AI Life Coach synthesizes guidance using your verified local practice records. The API key is securely managed on your local server. You can reset conversation history at any time without deleting your practice records.
        </p>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Reset conversation memory to start fresh
          </span>
          <button
            onClick={handleClearHistory}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <RotateCcw size={14} />
            <span>{chatClearedSuccess ? 'History Cleared' : 'Clear Chat History'}</span>
          </button>
        </div>
      </div>

      {/* 4. Data Portability: Export & Import */}
      <div className="clean-card" style={{ padding: '24px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
          <Download size={18} color="var(--primary)" />
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)' }}>Data Portability & Backup</h3>
        </div>

        <p style={{ color: 'var(--text-secondary)', fontSize: '0.84rem', marginBottom: '16px', lineHeight: 1.5 }}>
          Export your complete SMRITARA records (habits, daily logs, practice sessions, milestones, and points) as an encrypted or plain JSON archive. Restore anytime to retain your verified history.
        </p>

        {importFeedback && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 14px',
            borderRadius: 'var(--radius-sm)',
            marginBottom: '16px',
            background: importFeedback.type === 'success' ? 'var(--primary-subtle)' : 'var(--accent-amber-subtle)',
            border: `1px solid ${importFeedback.type === 'success' ? 'var(--primary-light)' : 'rgba(198, 128, 25, 0.4)'}`,
            color: importFeedback.type === 'success' ? 'var(--primary)' : 'var(--accent-amber)',
            fontSize: '0.82rem'
          }}>
            {importFeedback.type === 'success' ? <Check size={16} /> : <AlertTriangle size={16} />}
            <span>{importFeedback.message}</span>
          </div>
        )}

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button onClick={handleExport} className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Download size={15} />
            <span>Export Data (JSON)</span>
          </button>

          <button onClick={() => fileInputRef.current?.click()} className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Upload size={15} />
            <span>Import from Backup</span>
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            style={{ display: 'none' }}
            onChange={handleImportFile}
          />
        </div>
      </div>

      {/* 5. Privacy & Clean Slate */}
      <div className="clean-card" style={{ padding: '24px 28px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px',
          background: 'var(--primary-subtle)',
          border: '1px solid var(--primary-light)',
          borderRadius: 'var(--radius-sm)',
          padding: '12px 16px',
          marginBottom: '16px'
        }}>
          <Shield size={18} color="var(--primary)" style={{ marginTop: '2px', flexShrink: 0 }} />
          <div style={{ fontSize: '0.8rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
            <strong>Privacy & Architecture Disclosure: </strong> All personal metrics, assessment answers, and session records are stored locally in your browser storage. SMRITARA does not track background phone sensors or read device telemetry.
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Need to reset local demo sandbox records?
          </span>
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Reset local practice records and clear demo data?')) {
                resetAllData();
              }
            }}
            className="btn btn-secondary btn-sm"
            style={{ color: '#dc2626' }}
          >
            <RotateCcw size={14} />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>

      {/* 6. Danger Zone: Delete Account */}
      <div 
        className="clean-card" 
        style={{ 
          padding: '24px 28px',
          border: '1px solid rgba(220, 38, 38, 0.25)',
          background: 'linear-gradient(180deg, #FFFFFF 0%, rgba(254, 242, 242, 0.35) 100%)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
          <AlertTriangle size={18} color="#dc2626" />
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#dc2626' }}>Danger Zone</h3>
        </div>

        <p style={{ color: 'var(--text-secondary)', fontSize: '0.84rem', marginBottom: '16px', lineHeight: 1.5 }}>
          Permanently delete your SMRITARA account and all associated records. This will irrevocably erase your practice history, cognitive memory gym scores, circadian logs, custom habits, and cloud synchronization data.
        </p>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          padding: '14px 18px',
          borderRadius: 'var(--radius-sm)',
          background: '#FFFFFF',
          border: '1px solid rgba(220, 38, 38, 0.2)'
        }}>
          <div>
            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>
              Permanently Delete Account
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Irreversible purge of {user.email || user.username || 'active user'} credentials and all stored records
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setConfirmDeleteInput('');
              setConfirmDeleteCheckbox(false);
              setDeleteError(null);
              setShowDeleteModal(true);
            }}
            className="btn btn-sm"
            style={{
              backgroundColor: '#dc2626',
              color: '#FFFFFF',
              border: 'none',
              padding: '8px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontWeight: 600,
              cursor: 'pointer',
              borderRadius: 'var(--radius-sm)',
              boxShadow: '0 1px 2px rgba(220, 38, 38, 0.2)'
            }}
            data-testid="danger-zone-delete-btn"
          >
            <Trash2 size={14} />
            <span>Delete Account</span>
          </button>
        </div>
      </div>

      {/* Delete Account Confirmation Modal */}
      {showDeleteModal && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.55)',
            backdropFilter: 'blur(4px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget && !isDeleting) setShowDeleteModal(false);
          }}
        >
          <div 
            className="clean-card"
            style={{
              maxWidth: '480px',
              width: '100%',
              padding: '28px',
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-md)',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.05)',
              border: '1px solid rgba(220, 38, 38, 0.3)'
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-account-modal-title"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                backgroundColor: 'rgba(220, 38, 38, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#dc2626',
                flexShrink: 0
              }}>
                <Trash2 size={22} />
              </div>
              <div>
                <h3 id="delete-account-modal-title" style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                  Delete Account
                </h3>
                <span style={{ fontSize: '0.78rem', color: '#dc2626', fontWeight: 600 }}>
                  Warning: This action is permanent and irreversible
                </span>
              </div>
            </div>

            <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '14px' }}>
              Are you sure you want to permanently delete your account (<strong>{user.email || user.username || 'active user'}</strong>)?
            </p>

            <div style={{
              background: 'var(--bg-card-inner)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              padding: '12px 14px',
              marginBottom: '16px'
            }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                The following data will be permanently wiped:
              </div>
              <ul style={{
                margin: 0,
                paddingLeft: '18px',
                fontSize: '0.78rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.6
              }}>
                <li>Cognitive memory gym scores & chanting session history</li>
                <li>Daily circadian logs, sleep, screen time, and discipline streaks</li>
                <li>Custom good and bad habits and personalized schedules</li>
                <li>Cloud synchronization profile and authentication credentials</li>
                <li>Local storage caches and preferences</li>
              </ul>
            </div>

            {deleteError && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 12px',
                borderRadius: 'var(--radius-sm)',
                marginBottom: '14px',
                background: 'rgba(220, 38, 38, 0.08)',
                border: '1px solid rgba(220, 38, 38, 0.3)',
                color: '#dc2626',
                fontSize: '0.8rem'
              }}>
                <AlertTriangle size={15} />
                <span>{deleteError}</span>
              </div>
            )}

            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                fontSize: '0.82rem',
                color: 'var(--text-main)',
                cursor: 'pointer',
                userSelect: 'none'
              }}>
                <input
                  type="checkbox"
                  checked={confirmDeleteCheckbox}
                  onChange={(e) => setConfirmDeleteCheckbox(e.target.checked)}
                  disabled={isDeleting}
                  style={{ marginTop: '2px', accentColor: '#dc2626' }}
                  data-testid="delete-confirm-checkbox"
                />
                <span>I understand that this action is irreversible and all my data will be permanently erased.</span>
              </label>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                Or type <strong>DELETE</strong> below to confirm:
              </div>
              <input
                type="text"
                placeholder='Type "DELETE" to confirm'
                value={confirmDeleteInput}
                onChange={(e) => setConfirmDeleteInput(e.target.value)}
                disabled={isDeleting}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1.5px solid var(--border-subtle)',
                  fontSize: '0.88rem',
                  boxSizing: 'border-box'
                }}
                data-testid="delete-confirm-input"
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false);
                  setConfirmDeleteInput('');
                  setConfirmDeleteCheckbox(false);
                  setDeleteError(null);
                }}
                disabled={isDeleting}
                className="btn btn-secondary btn-sm"
                style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                data-testid="cancel-delete-account-btn"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={(!confirmDeleteCheckbox && confirmDeleteInput.trim().toUpperCase() !== 'DELETE') || isDeleting}
                className="btn btn-sm"
                style={{
                  backgroundColor: (confirmDeleteCheckbox || confirmDeleteInput.trim().toUpperCase() === 'DELETE') && !isDeleting
                    ? '#dc2626'
                    : '#fca5a5',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '8px 18px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: (confirmDeleteCheckbox || confirmDeleteInput.trim().toUpperCase() === 'DELETE') && !isDeleting
                    ? 'pointer'
                    : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
                data-testid="confirm-delete-account-btn"
              >
                <Trash2 size={14} />
                <span>{isDeleting ? 'Deleting Account...' : 'Permanently Delete'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
