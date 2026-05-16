import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn, AlertCircle, CheckCircle } from 'lucide-react';
import { API_URL } from '../api/config';
import { useLanguage } from '../context/LanguageContext';
import './Login.css';
import { FormDropdown } from '../components/ui/FormDropdown';

const Login = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    userType: 'candidate'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordStatus, setForgotPasswordStatus] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        setSuccessMessage('Connexion réussie ! Redirection...');

        setTimeout(() => {
          switch (data.user.userType) {
            case 'admin':
              navigate('/admin/dashboard');
              break;
            case 'candidate':
              navigate('/candidate/dashboard');
              break;
            case 'employer':
              navigate('/employer/dashboard');
              break;
            default:
              navigate('/dashboard');
          }
        }, 1500);
      } else {
        setError(data.message || 'Erreur lors de la connexion');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setError('Erreur de connexion au serveur');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotPasswordStatus('');

    if (!forgotPasswordEmail) {
      setForgotPasswordStatus('Veuillez entrer votre adresse email');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: forgotPasswordEmail }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.success) {
          setForgotPasswordStatus('success');

          // En mode développement, afficher le lien
          if (data.resetToken) {
            setSuccessMessage(`Lien de réinitialisation: http://localhost:3000/reset-password/${data.resetToken}`);
          } else {
            setSuccessMessage('Un email de réinitialisation a été envoyé');
          }
        } else {
          setForgotPasswordStatus(data.message || 'Erreur lors de la demande');
        }
      } else {
        setForgotPasswordStatus(data.message || 'Erreur lors de la demande');
      }
    } catch (error: any) {
      console.error('Forgot password error:', error);

      if (error.message && (error.message.includes('Failed to fetch') || error.message.includes('Connection refused'))) {
        setForgotPasswordStatus('Serveur indisponible. Veuillez vérifier que le serveur backend est démarré.');
      } else {
        setForgotPasswordStatus('Erreur de connexion au serveur');
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

    if (error) {
      setError('');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Header */}
        <div className="login-header">
          <div className="login-logo">YALLA EXTRA</div>
          <h2 className="login-title">
            {showForgotPassword ? t('login.forgotPassword') : t('login.title')}
          </h2>
          <p className="login-subtitle">
            {showForgotPassword
              ? t('login.forgotPassword.subtitle')
              : t('login.subtitle')
            }
          </p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="alert alert-success">
            <CheckCircle className="w-5 h-5" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="alert alert-error">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        {showForgotPassword ? (
          /* Forgot Password Form */
          <form onSubmit={handleForgotPassword} className="login-form">
            <div className="form-group">
              <label htmlFor="forgotEmail" className="form-label">
                {t('login.form.email')}
              </label>
              <div className="input-with-icon">
                <Mail className="input-icon" />
                <input
                  type="email"
                  id="forgotEmail"
                  required
                  value={forgotPasswordEmail}
                  onChange={(e) => setForgotPasswordEmail(e.target.value)}
                  className="form-input"
                  placeholder={t('login.form.emailPlaceholder')}
                />
              </div>
            </div>

            {forgotPasswordStatus && forgotPasswordStatus !== 'success' && (
              <div className="alert alert-error">
                <AlertCircle className="w-5 h-5" />
                <span>{forgotPasswordStatus}</span>
              </div>
            )}

            <button
              type="submit"
              className="btn-primary"
            >
              {t('login.forgotPassword.btn')}
            </button>

            <div className="back-to-login">
              <button
                type="button"
                onClick={() => setShowForgotPassword(false)}
                className="text-link"
              >
                {t('login.forgotPassword.back')}
              </button>
            </div>
          </form>
        ) : (
          /* Login Form */
          <>
            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="userType" className="form-label">
                  {t('login.form.userType')}
                </label>
                <FormDropdown
                  value={formData.userType}
                  onValueChange={(val: string) => handleChange({ target: { name: 'userType', value: val } } as any)}
                  options={[
                    { value: 'candidate', label: t('candidate') },
                    { value: 'employer', label: t('employer') },
                    { value: 'admin', label: t('admin') }
                  ]}
                />
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  {t('login.form.email')}
                </label>
                <div className="input-with-icon">
                  <Mail className="input-icon" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="form-input"
                    placeholder={t('login.form.emailPlaceholder')}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  {t('login.form.password')}
                </label>
                <div className="input-with-icon">
                  <Lock className="input-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="form-input password-input"
                    placeholder={t('login.form.passwordPlaceholder')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="password-toggle"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="form-options">
                <div className="checkbox-group">
                  <input
                    id="remember"
                    name="remember"
                    type="checkbox"
                    className="form-checkbox"
                  />
                  <label htmlFor="remember" className="checkbox-label">
                    {t('login.form.remember')}
                  </label>
                </div>
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="forgot-password-btn"
                >
                  {t('login.forgotPassword')}
                </button>
              </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className={`btn-primary ${isSubmitting ? 'loading' : ''} ${formData.email && formData.password ? 'btn-active' : ''}`}
              >
                {isSubmitting ? (
                  <>
                    <div className="spinner"></div>
                    <span>{t('login.form.submitting')}</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    <span>{t('login.form.submit')}</span>
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="divider">
              <span>{t('login.form.new')}</span>
            </div>

            {/* Register Link */}
            <div className="register-section">
              <Link to="/register" className="btn-secondary">
                {t('login.form.createAccount')}
              </Link>
            </div>
          </>
        )}

        {/* Back to Home */}
        <div className="back-home">
          <Link to="/">{t('login.form.backHome')}</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;