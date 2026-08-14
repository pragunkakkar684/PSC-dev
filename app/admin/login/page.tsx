'use client';

import { useActionState } from 'react';
import { loginAction, type LoginState } from './actions';

const initialState: LoginState = {};

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, initialState);

  return (
    <div className="login-page">
      <div className="login-card">
        {/* Brand */}
        <div className="login-brand">
          <div className="login-logo">PSC</div>
          <p className="login-subtitle">Content Management System</p>
        </div>

        {/* Error */}
        {state?.error && (
          <div className="login-error" role="alert">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="8" cy="8" r="7.5" stroke="currentColor" />
              <path d="M8 4.5V8.5" stroke="currentColor" strokeLinecap="round" />
              <circle cx="8" cy="11" r="0.75" fill="currentColor" />
            </svg>
            {state.error}
          </div>
        )}

        {/* Form */}
        <form action={formAction} className="login-form" noValidate>
          <div className="form-field">
            <label htmlFor="email" className="form-label">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="form-input"
              placeholder="admin@pscglobal.com"
            />
          </div>

          <div className="form-field">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="form-input"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="login-btn"
          >
            {isPending ? (
              <span className="login-btn-loading">
                <svg className="spin" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="6" stroke="currentColor" strokeOpacity="0.3" strokeWidth="2" />
                  <path d="M14 8A6 6 0 0 0 8 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                Signing in…
              </span>
            ) : (
              'Sign in'
            )}
          </button>
        </form>

        <p className="login-footer">
          PSC Global CMS · Access restricted to authorised users
        </p>
      </div>

      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #0f1117;
          background-image:
            radial-gradient(ellipse 80% 50% at 50% -20%, rgba(59, 130, 246, 0.08), transparent),
            radial-gradient(ellipse 40% 40% at 80% 80%, rgba(99, 102, 241, 0.06), transparent);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
          padding: 24px;
        }

        .login-card {
          width: 100%;
          max-width: 400px;
          background: #1a1d27;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          padding: 40px;
          box-shadow:
            0 0 0 1px rgba(0,0,0,0.5),
            0 24px 48px rgba(0,0,0,0.4);
        }

        .login-brand {
          text-align: center;
          margin-bottom: 32px;
        }

        .login-logo {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 56px;
          height: 56px;
          background: linear-gradient(135deg, #3b82f6, #6366f1);
          border-radius: 12px;
          color: white;
          font-size: 18px;
          font-weight: 700;
          letter-spacing: 0.05em;
          margin-bottom: 16px;
        }

        .login-subtitle {
          color: #6b7280;
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .login-error {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          border-radius: 8px;
          padding: 12px 14px;
          color: #f87171;
          font-size: 14px;
          margin-bottom: 24px;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-label {
          font-size: 13px;
          font-weight: 500;
          color: #d1d5db;
          letter-spacing: 0.01em;
        }

        .form-input {
          width: 100%;
          padding: 10px 14px;
          background: #111318;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          color: #f9fafb;
          font-size: 14px;
          line-height: 1.5;
          outline: none;
          transition: border-color 0.15s;
        }

        .form-input::placeholder {
          color: #4b5563;
        }

        .form-input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
        }

        .login-btn {
          width: 100%;
          padding: 11px;
          background: linear-gradient(135deg, #3b82f6, #6366f1);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.15s, transform 0.1s;
          margin-top: 4px;
        }

        .login-btn:hover:not(:disabled) {
          opacity: 0.9;
        }

        .login-btn:active:not(:disabled) {
          transform: scale(0.99);
        }

        .login-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .login-btn-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .spin {
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .login-footer {
          margin-top: 28px;
          text-align: center;
          font-size: 12px;
          color: #374151;
        }
      `}</style>
    </div>
  );
}
