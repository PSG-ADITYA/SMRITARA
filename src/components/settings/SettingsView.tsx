import React, { useState, useRef } from 'react';
import { 
  Settings, 
  Key, 
  Moon, 
  Smartphone, 
  Shield, 
  RotateCcw, 
  Check, 
  Download, 
  Upload, 
  AlertTriangle,
  Server
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SettingsView: React.FC = () => {
  const { 
    user, 
    updateUserTargets, 
    setGeminiApiKey, 
    resetAllData, 
    exportData, 
    importData 
  } = useApp();

  const [sleepTarget, setSleepTarget] = useState(user.targetSleep);
  const [screenLimit, setScreenLimit] = useState(user.targetScreenTime);
  const [apiKeyInput, setApiKeyInput] = useState(user.geminiApiKey || '');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [importFeedback, setImportFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserTargets(sleepTarget, screenLimit);
    setGeminiApiKey(apiKeyInput);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
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
    <div style={{ maxWidth: '820px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Target Benchmarks & Profile */}
      <div className="glass-card" style={{ padding: '36px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
          <Settings size={22} color="var(--primary-light)" />
          <h3 style={{ fontSize: '1.45rem', fontWeight: 800 }}>Platform Configuration & Targets</h3>
        </div>

        <form onSubmit={handleSave}>
          <div style={{ marginBottom: '28px' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '14px', color: '#ffffff' }}>
              Target Benchmarks (Discipline OS)
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              {/* Sleep Target */}
              <div className="glass-card-inner">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: 600 }}>
                    <Moon size={16} color="#818cf8" />
                    <span>Target Sleep</span>
                  </div>
                  <span className="font-mono" style={{ color: 'var(--primary-light)', fontWeight: 700 }}>
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

              {/* Screen Time Limit */}
              <div className="glass-card-inner">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: 600 }}>
                    <Smartphone size={16} color="#f43f5e" />
                    <span>Screen Time Limit</span>
                  </div>
                  <span className="font-mono" style={{ color: '#fb7185', fontWeight: 700 }}>
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
                  style={{ width: '100%', accentColor: '#f43f5e' }}
                />
              </div>
            </div>
          </div>

          {/* Gemini AI Key Section */}
          <div style={{ marginBottom: '28px' }} className="glass-card-inner">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Key size={16} color="var(--primary-light)" />
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>
                Google Gemini Integration & BYOK
              </h4>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '12px', lineHeight: 1.5 }}>
              SMRITARA operates securely via server proxy or client BYOK (Bring Your Own Key). For local testing, you can input a personal Gemini API key. In deployed environments, credentials remain securely on the server proxy. If unconfigured, SMRITARA runs seamlessly using its offline grounded analytical engine.
            </p>
            <input
              type="password"
              className="input-field"
              placeholder="AIzaSy... (stored only in local browser memory)"
              value={apiKeyInput}
              onChange={e => setApiKeyInput(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn btn-primary">
              {savedSuccess ? (
                <>
                  <Check size={16} />
                  <span>Targets Saved!</span>
                </>
              ) : (
                <span>Save Configuration</span>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Data Portability: Export & Import */}
      <div className="glass-card" style={{ padding: '36px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <Download size={22} color="#14b8a6" />
          <h3 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Data Portability & Backup</h3>
        </div>

        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '24px', lineHeight: 1.5 }}>
          Export your complete SMRITARA dataset (habits, daily logs, focus sprints, chronotype assessment, and memory records) as a validated JSON archive. You can restore your data at any time or transfer it across browsers.
        </p>

        {importFeedback && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            marginBottom: '20px',
            background: importFeedback.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
            border: `1px solid ${importFeedback.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.3)'}`,
            color: importFeedback.type === 'success' ? '#34d399' : '#fb7185',
            fontSize: '0.88rem'
          }}>
            {importFeedback.type === 'success' ? <Check size={18} /> : <AlertTriangle size={18} />}
            <span>{importFeedback.message}</span>
          </div>
        )}

        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
          <button onClick={handleExport} className="btn btn-teal">
            <Download size={16} />
            <span>Export Data (JSON)</span>
          </button>

          <button onClick={() => fileInputRef.current?.click()} className="btn btn-secondary">
            <Upload size={16} />
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

      {/* Privacy & Reset Card */}
      <div className="glass-card" style={{ padding: '28px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px',
          background: 'rgba(20, 184, 166, 0.08)',
          border: '1px solid rgba(20, 184, 166, 0.25)',
          borderRadius: 'var(--radius-md)',
          padding: '14px 18px',
          marginBottom: '20px'
        }}>
          <Shield size={18} color="#2dd4bf" style={{ marginTop: '2px' }} />
          <div style={{ fontSize: '0.82rem', color: '#ccfbf1', lineHeight: 1.5 }}>
            <strong>Privacy Guarantee:</strong> All personal metrics, assessment answers, and habit checklists are persisted in your local browser storage. No invasive wearable, microphone, or camera permissions are required or accessed.
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Need to start fresh for a new demonstration?
          </span>
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Erase all stored logs, habits, and sessions?')) {
                resetAllData();
              }
            }}
            className="btn btn-secondary btn-sm"
            style={{ color: '#fb7185' }}
          >
            <RotateCcw size={14} />
            <span>Reset All Records</span>
          </button>
        </div>
      </div>
    </div>
  );
};
