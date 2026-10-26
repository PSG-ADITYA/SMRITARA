import React, { useState, useEffect } from 'react';
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck, X, Mail } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SmritaraBrand } from '../common/SmritaraBrand';

interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({ isOpen, onClose }) => {
  const { user, currentUser, updateUserNewPassword } = useApp();

  const knownEmail = currentUser?.email || user.email || '';
  const [email, setEmail] = useState(knownEmail);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [urlError, setUrlError] = useState<string | null>(null);

  useEffect(() => {
    if (knownEmail && !email) {
      setEmail(knownEmail);
    }
  }, [knownEmail, email]);

  // Detect if recovery link has error parameters (e.g., token expired or invalid)
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const hash = window.location.hash.replace(/^#/, '');
      const params = new URLSearchParams(hash);
      const errDesc = params.get('error_description');
      const errCode = params.get('error_code');
      if (errDesc || errCode) {
        setUrlError(errDesc ? decodeURIComponent(errDesc.replace(/\+/g, ' ')) : 'Password recovery link has expired or is invalid.');
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const displayEmail = knownEmail || email;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const effectiveEmail = (knownEmail || email).trim();
    if (!effectiveEmail && !currentUser) {
      setError('Please provide your account email address.');
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
      const res = await updateUserNewPassword(password, effectiveEmail);
      setLoading(false);
      if (res.success) {
        setSuccess(true);
        setTimeout(() => {
          handleClose();
        }, 2200);
      } else {
        setError(res.error || 'Failed to update password. Please try again.');
      }
    } catch (err: any) {
      setLoading(false);
      setError(err.message || 'An unexpected error occurred while updating your password.');
    }
  };

  const handleClose = () => {
    setPassword('');
    setConfirmPassword('');
    setError(null);
    setSuccess(false);
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(5px)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        animation: 'fadeIn 0.2s ease-out'
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="reset-password-modal-title"
    >
      <div
        className="clean-card"
        style={{
          maxWidth: '460px',
          width: '100%',
          padding: '32px',
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid var(--border-subtle)',
          position: 'relative'
        }}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '4px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s'
          }}
          aria-label="Close"
          data-testid="close-reset-modal-btn"
        >
          <X size={18} />
        </button>

        {/* Brand & Header */}
        <div style={{ textAlign: 'center', marginBottom: '22px' }}>
          <div style={{ display: 'inline-block', marginBottom: '12px' }}>
            <SmritaraBrand variant="full" size="sm" />
          </div>

          <h2
            id="reset-password-modal-title"
            style={{
              fontSize: '1.35rem',
              fontWeight: 700,
              color: 'var(--text-main)',
              marginBottom: '6px'
            }}
          >
            Set New Password
          </h2>

          <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
            {displayEmail ? (
              <>Choose a secure new password for <strong>{displayEmail}</strong></>
            ) : (
              'Choose a secure new password for your account'
            )}
          </p>
        </div>

        {/* URL Error notification (e.g. expired link) */}
        {urlError && !success && (
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              padding: '12px 14px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(220, 38, 38, 0.08)',
              border: '1px solid rgba(220, 38, 38, 0.25)',
              color: '#dc2626',
              fontSize: '0.82rem',
              marginBottom: '18px',
              lineHeight: 1.45
            }}
          >
            <AlertCircle size={16} style={{ marginTop: '2px', flexShrink: 0 }} />
            <div>
              <strong>Recovery link notice: </strong>
              <span>{urlError}</span>
            </div>
          </div>
        )}

        {/* General Error notice */}
        {error && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 14px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(220, 38, 38, 0.08)',
              border: '1px solid rgba(220, 38, 38, 0.25)',
              color: '#dc2626',
              fontSize: '0.84rem',
              marginBottom: '16px'
            }}
          >
            <AlertCircle size={15} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Success confirmation */}
        {success ? (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'var(--primary-subtle)',
                border: '2px solid var(--primary-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                color: 'var(--primary)'
              }}
            >
              <CheckCircle2 size={30} />
            </div>

            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>
              Password Successfully Updated!
            </h3>

            <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '20px' }}>
              Your new password has been securely stored. You can now use this password on all your devices.
            </p>

            <button
              type="button"
              onClick={handleClose}
              className="btn btn-primary"
              style={{ width: '100%', padding: '10px', fontWeight: 600 }}
              data-testid="continue-after-password-reset-btn"
            >
              <span>Continue to SMRITARA</span>
              <ArrowRight size={15} />
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Account Email input if not authenticated / known */}
            {!knownEmail && (
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>
                  Account Email
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
                  <input
                    type="email"
                    required
                    placeholder="Enter your registered account email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    disabled={loading}
                    style={{
                      width: '100%',
                      padding: '10px 12px 10px 38px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1.5px solid var(--border-subtle)',
                      fontSize: '0.9rem',
                      boxSizing: 'border-box'
                    }}
                    data-testid="recovery-email-input"
                  />
                </div>
              </div>
            )}

            {/* New Password input */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>
                New Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '10px 38px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1.5px solid var(--border-subtle)',
                    fontSize: '0.9rem',
                    boxSizing: 'border-box'
                  }}
                  data-testid="new-password-input"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '11px',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: 0
                  }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm New Password input */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>
                Confirm New Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  placeholder="Re-enter your new password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '10px 38px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1.5px solid var(--border-subtle)',
                    fontSize: '0.9rem',
                    boxSizing: 'border-box'
                  }}
                  data-testid="confirm-new-password-input"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(p => !p)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '11px',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: 0
                  }}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Password match helper */}
            {password.length > 0 && confirmPassword.length > 0 && (
              <div style={{ fontSize: '0.76rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                {password === confirmPassword ? (
                  <span style={{ color: 'var(--primary)', fontWeight: 600 }}>✓ Passwords match</span>
                ) : (
                  <span style={{ color: '#dc2626', fontWeight: 500 }}>Passwords do not match yet</span>
                )}
              </div>
            )}

            {/* Security Notice */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.76rem',
                color: 'var(--text-muted)',
                background: 'var(--bg-card-inner)',
                padding: '8px 12px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <ShieldCheck size={14} color="var(--primary)" />
              <span>Passwords are encrypted using Supabase Auth industry-grade PBKDF2 hashing.</span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || password.length < 6 || password !== confirmPassword || (!knownEmail && !email.trim())}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '11px',
                fontWeight: 600,
                marginTop: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
              data-testid="save-new-password-btn"
            >
              <span>{loading ? 'Updating Password...' : 'Save & Update Password'}</span>
              <ArrowRight size={15} />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
