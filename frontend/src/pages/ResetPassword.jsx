import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import { API_URL } from '../api/config';
import './Login.css';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [tokenValid, setTokenValid] = useState(null);
  
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Vérifier la validité du token au chargement
    const verifyToken = async () => {
      try {
        const response = await fetch(`${API_URL}/auth/verify-reset-token/${token}`);
        const data = await response.json();
        
        if (response.ok) {
          setTokenValid(true);
        } else {
          setTokenValid(false);
          setError(data.message || 'Token invalide ou expiré');
        }
      } catch (error) {
        console.error('Token verification error:', error);
        setTokenValid(false);
        setError('Erreur de vérification du token');
      }
    };

    if (token) {
      verifyToken();
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      setIsSubmitting(false);
      return;
    }

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/auth/reset-password/${token}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password, confirmPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage('Mot de passe réinitialisé avec succès !');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(data.message || 'Erreur lors de la réinitialisation');
      }
    } catch (error) {
      console.error('Reset password error:', error);
      setError('Erreur de connexion au serveur');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (tokenValid === null) {
    return (
      <div className="login-container">
        <div className="login-card">
          <div className="loading-spinner">Vérification du lien...</div>
        </div>
      </div>
    );
  }

  if (tokenValid === false) {
    return (
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="login-logo">YALLA EXTRA</div>
            <h2 className="login-title">Lien invalide</h2>
          </div>

          <div className="alert alert-error">
            <AlertCircle className="w-5 h-5" />
            <span>{error || 'Ce lien de réinitialisation est invalide ou a expiré'}</span>
          </div>

          <div className="reset-password-actions">
            <Link to="/forgot-password" className="btn-primary">
              Demander un nouveau lien
            </Link>
            <Link to="/login" className="btn-secondary">
              Retour à la connexion
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">YALLA EXTRA</div>
          <h2 className="login-title">Nouveau mot de passe</h2>
          <p className="login-subtitle">Entrez votre nouveau mot de passe</p>
        </div>

        {successMessage && (
          <div className="alert alert-success">
            <CheckCircle className="w-5 h-5" />
            <span>{successMessage}</span>
          </div>
        )}

        {error && (
          <div className="alert alert-error">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Nouveau mot de passe
            </label>
            <div className="input-with-icon">
              <Lock className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input password-input"
                placeholder="Votre nouveau mot de passe"
                minLength={6}
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

          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              Confirmer le mot de passe
            </label>
            <div className="input-with-icon">
              <Lock className="input-icon" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="form-input password-input"
                placeholder="Confirmez votre mot de passe"
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="password-toggle"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`btn-primary ${isSubmitting ? 'loading' : ''}`}
          >
            {isSubmitting ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'}
          </button>
        </form>

        <div className="back-home">
          <Link to="/">← Retour à l'accueil</Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;