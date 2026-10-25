import React, { useState } from 'react';
import { X, Eye, EyeOff, Lock, Mail, User, AlertCircle, CheckCircle2, Cloud, ArrowLeft, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SmritaraBrand } from '../common/SmritaraBrand';
import { isSupabaseConfigured } from '../../lib/supabase';

interface AuthModalProps {
  initialMode: 'signin' | 'signup';
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ initialMode, onClose }) => {
  const { registerAccount, loginAccount, resetUserPassword, resendVerification, enterDemoMode } = useApp();
  const [mode, setMode] = useState<'signin' | 'signup' | 'reset' | 'confirm_pending'>(initialMode);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [confirmPendingEmail, setConfirmPendingEmail] = useState('');
  const [resending, setResending] = useState(false);

  const cloudActive = isSupabaseConfigured();

  const handleResendConfirmation = async () => {
    if (!confirmPendingEmail) return;
    setResending(true);
    setError(null);
    setSuccessMsg(null);
    try {
      const res = await resendVerification(confirmPendingEmail);
      setResending(false);
      if (res.success) {
        setSuccessMsg('Confirmation link has been resent to ' + confirmPendingEmail);
      } else {
        setError(res.error || 'Failed to resend confirmation link.');
      }
    } catch (err: any) {
      setResending(false);
      setError(err.message || 'Resend request failed.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (mode === 'reset') {
      if (!email.trim() || !email.includes('@')) {
        setError('Please enter a valid email address.');
        return;
      }
      setLoading(true);
      try {
        const res = await resetUserPassword(email.trim());
        setLoading(false);
        if (res.success) {
          setSuccessMsg('Password reset instructions have been dispatched to your email.');
        } else {
          setError(res.error || 'Failed to dispatch password reset email.');
        }
      } catch (err: any) {
        setLoading(false);
        setError(err.message || 'Password reset request failed.');
      }
      return;
    }

    if (mode === 'signup') {
      if (!name.trim()) {
        setError('Please enter your full name.');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters in length.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match. Please re-enter carefully.');
        return;
      }
      setLoading(true);
      try {
        const res = await registerAccount(name.trim(), email.trim(), password);
        setLoading(false);
        if (!res.success) {
          setError(res.error || 'Registration failed.');
        } else if (res.emailConfirmationRequired) {
          setConfirmPendingEmail(email.trim());
          setMode('confirm_pending');
        } else {
          onClose(); // Automatically opens OnboardingWizard
        }
      } catch (err: any) {
        setLoading(false);
        setError(err.message || 'Registration failed.');
      }
    } else {
      setLoading(true);
      try {
        const res = await loginAccount(email.trim(), password);
        setLoading(false);
        if (!res.success) {
          setError(res.error || 'Sign in failed.');
        } else {
          onClose();
        }
      } catch (err: any) {
        setLoading(false);
        setError(err.message || 'Sign in failed.');
      }
    }
  };

  const handleDemoAccess = () => {
    enterDemoMode();
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(28, 34, 30, 0.45)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div className="clean-card" style={{
        maxWidth: '460px',
        width: '100%',
        padding: '32px',
        position: 'relative',
        background: '#FFFFFF',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-lg)'
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '18px',
            right: '18px',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '4px'
          }}
          aria-label="Close dialog"
        >
          <X size={18} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'center' }}>
            <SmritaraBrand variant="icon" size="lg" />
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-main)' }}>
            {mode === 'signup' 
              ? 'Create Your Account' 
              : mode === 'reset' 
              ? 'Reset Your Password' 
              : 'Welcome Back'}
          </h2>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            {mode === 'signup' 
              ? 'Begin your personalized practice with SMRITARA' 
              : mode === 'reset'
              ? 'Enter your email to receive recovery instructions'
              : 'Resume your personal growth and cognitive routines'}
          </p>

          {/* Cloud vs Demo indicator */}
          <div style={{ marginTop: '8px', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.74rem', color: cloudActive ? 'var(--primary)' : 'var(--accent-teal)', background: cloudActive ? 'var(--primary-subtle)' : 'var(--accent-teal-subtle)', padding: '3px 10px', borderRadius: 'var(--radius-full)' }}>
            <Cloud size={12} />
            <span>{cloudActive ? 'Cloud Authentication & Storage (Supabase)' : 'Local Demo Sandbox Active'}</span>
          </div>
        </div>

        {/* Tab switch (only if not reset or confirm_pending mode) */}
        {mode !== 'reset' && mode !== 'confirm_pending' && (
          <div style={{
            display: 'flex',
            background: 'var(--bg-secondary)',
            padding: '4px',
            borderRadius: 'var(--radius-md)',
            marginBottom: '18px',
            border: '1px solid var(--border-subtle)'
          }}>
            <button
              type="button"
              onClick={() => { setMode('signin'); setError(null); setSuccessMsg(null); }}
              style={{
                flex: 1,
                padding: '8px',
                border: 'none',
                borderRadius: '6px',
                background: mode === 'signin' ? '#FFFFFF' : 'transparent',
                color: mode === 'signin' ? 'var(--primary)' : 'var(--text-secondary)',
                fontWeight: 600,
                fontSize: '0.88rem',
                cursor: 'pointer',
                boxShadow: mode === 'signin' ? 'var(--shadow-sm)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode('signup'); setError(null); setSuccessMsg(null); }}
              style={{
                flex: 1,
                padding: '8px',
                border: 'none',
                borderRadius: '6px',
                background: mode === 'signup' ? '#FFFFFF' : 'transparent',
                color: mode === 'signup' ? 'var(--primary)' : 'var(--text-secondary)',
                fontWeight: 600,
                fontSize: '0.88rem',
                cursor: 'pointer',
                boxShadow: mode === 'signup' ? 'var(--shadow-sm)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              Sign Up
            </button>
          </div>
        )}

        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 14px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--accent-terracotta-subtle)',
            border: '1px solid rgba(192, 92, 60, 0.3)',
            color: 'var(--accent-terracotta)',
            fontSize: '0.85rem',
            marginBottom: '16px'
          }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 14px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--primary-subtle)',
            border: '1px solid var(--primary-light)',
            color: 'var(--primary)',
            fontSize: '0.85rem',
            marginBottom: '16px'
          }}>
            <CheckCircle2 size={16} />
            <span>{successMsg}</span>
          </div>
        )}

        {mode === 'confirm_pending' ? (
          <div style={{ textAlign: 'center', padding: '12px 0' }}>
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              background: 'var(--primary-subtle)',
              border: '2px solid var(--primary-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              color: 'var(--primary)'
            }}>
              <Mail size={24} />
            </div>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>
              Check Your Inbox to Confirm Account
            </h3>

            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '14px' }}>
              We have dispatched a verification link to <strong>{confirmPendingEmail}</strong>.
            </p>

            <div style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '14px',
              fontSize: '0.82rem',
              color: 'var(--text-muted)',
              lineHeight: 1.5,
              marginBottom: '20px',
              textAlign: 'left'
            }}>
              💡 <strong>Note on verification:</strong> Supabase delivers a secure verification link (not a numeric OTP code). Click the link in your email to activate your account, then sign in to begin your calibrated onboarding questionnaire. Check your spam folder if the email does not arrive shortly.
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                type="button"
                disabled={resending}
                onClick={handleResendConfirmation}
                className="btn btn-primary"
                style={{ width: '100%', padding: '10px' }}
              >
                {resending ? 'Sending...' : 'Resend Verification Link'}
              </button>

              <button
                type="button"
                onClick={() => { setMode('signin'); setError(null); setSuccessMsg(null); }}
                className="btn btn-secondary"
                style={{ width: '100%', padding: '10px' }}
              >
                <ArrowLeft size={14} />
                <span>Return to Sign In</span>
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {mode === 'signup' && (
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '5px' }}>
                  Full Name
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={16} style={{ position: 'absolute', left: '12px', top: '11px', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sriraghav"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="input-field"
                    style={{ width: '100%', paddingLeft: '38px' }}
                  />
                </div>
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '5px' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '12px', top: '11px', color: 'var(--text-muted)' }} />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="input-field"
                  style={{ width: '100%', paddingLeft: '38px' }}
                />
              </div>
            </div>

            {mode !== 'reset' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)' }}>
                    Password
                  </label>
                  {mode === 'signin' && (
                    <button
                      type="button"
                      onClick={() => { setMode('reset'); setError(null); setSuccessMsg(null); }}
                      style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.78rem', cursor: 'pointer', padding: 0 }}
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: '12px', top: '11px', color: 'var(--text-muted)' }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="input-field"
                    style={{ width: '100%', paddingLeft: '38px', paddingRight: '38px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(p => !p)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '10px',
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer'
                    }}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            )}

            {mode === 'signup' && (
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '5px' }}>
                  Confirm Password
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: '12px', top: '11px', color: 'var(--text-muted)' }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    className="input-field"
                    style={{ width: '100%', paddingLeft: '38px' }}
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '6px', padding: '11px', fontWeight: 600 }}
            >
              {loading ? 'Authenticating...' : mode === 'signup' ? 'Create Account & Continue' : mode === 'reset' ? 'Send Password Reset Link' : 'Sign In'}
            </button>
          </form>
        )}

        {mode === 'reset' && (
          <div style={{ marginTop: '14px', textAlign: 'center' }}>
            <button
              type="button"
              onClick={() => { setMode('signin'); setError(null); setSuccessMsg(null); }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '0.82rem', cursor: 'pointer' }}
            >
              <ArrowLeft size={14} />
              <span>Back to Sign In</span>
            </button>
          </div>
        )}

        {/* Demo Mode Direct Link */}
        <div style={{ marginTop: '20px', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px', textAlign: 'center' }}>
          <button
            type="button"
            onClick={handleDemoAccess}
            className="btn btn-secondary btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', width: '100%', justifyContent: 'center' }}
          >
            <Sparkles size={14} color="var(--primary)" />
            <span>Or Explore Without Account (Demo Sandbox)</span>
          </button>
          <div style={{ marginTop: '8px', fontSize: '0.74rem', color: 'var(--text-muted)' }}>
            Practice sessions are stored with user isolation and Row Level Security.
          </div>
        </div>
      </div>
    </div>
  );
};
