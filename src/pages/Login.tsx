import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn, AlertCircle, CheckCircle } from 'lucide-react';
import './Login.css';

const Login = () => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // URL corrigée - suppression de la duplication /api
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token and user data
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        setSuccessMessage('Connexion réussie ! Redirection...');
        
        // Redirect based on user type
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
    } catch (error) {
      console.error('Login error:', error);
      setError('Erreur de connexion au serveur');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    
    // Clear error when user starts typing
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
          <h2 className="login-title">Connexion</h2>
          <p className="login-subtitle">Accédez à votre espace personnel</p>
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="userType" className="form-label">
              Type de compte
            </label>
            <select
              id="userType"
              name="userType"
              value={formData.userType}
              onChange={handleChange}
              className="form-select"
            >
              <option value="candidate">Candidat</option>
              <option value="employer">Employeur</option>
              <option value="admin">Administrateur</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Adresse email
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
                placeholder="votre.email@exemple.com"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Mot de passe
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
                placeholder="Votre mot de passe"
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
                Se souvenir de moi
              </label>
            </div>
            <a href="#" className="forgot-password">
              Mot de passe oublié ?
            </a>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`btn-primary ${isSubmitting ? 'loading' : ''}`}
          >
            {isSubmitting ? (
              <>
                <div className="spinner"></div>
                <span>Connexion...</span>
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                <span>Se connecter</span>
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="divider">
          <span>Nouveau sur Yalla Extra ?</span>
        </div>

        {/* Register Link */}
        <div className="register-section">
          <Link to="/register" className="btn-secondary">
            Créer un compte
          </Link>
        </div>

        {/* Back to Home */}
        <div className="back-home">
          <Link to="/">← Retour à l'accueil</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;