import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, AlertCircle, Mail, Loader } from 'lucide-react';
import { API_URL } from '../api/config';
import './Login.css';

const VerifyEmail = () => {
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Récupérer l'email depuis le localStorage
    const savedEmail = localStorage.getItem('pendingVerificationEmail');
    if (savedEmail) {
      setEmail(savedEmail);
    }

    const verifyEmail = async () => {
      try {
        const response = await fetch(`${API_URL}/auth/verify-email/${token}`);
        const data = await response.json();

        if (response.ok) {
          setStatus('success');
          setMessage(data.message || 'Email vérifié avec succès !');
          // Nettoyer le localStorage après vérification réussie
          localStorage.removeItem('pendingVerificationEmail');
          
          // Redirection automatique après 2 secondes
          setTimeout(() => {
            navigate('/login');
          }, 2000);
        } else {
          setStatus('error');
          setMessage(data.message || 'Erreur lors de la vérification');
        }
      } catch (error) {
        console.error('Email verification error:', error);
        setStatus('error');
        setMessage('Erreur de connexion au serveur');
      }
    };

    if (token) {
      verifyEmail();
    }
  }, [token, navigate]);

  const handleResendVerification = async () => {
    if (!email) {
      setMessage('Veuillez entrer votre email pour renvoyer le lien de vérification');
      return;
    }

    // Validation basique de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage('Veuillez entrer une adresse email valide');
      return;
    }

    try {
      setStatus('loading');
      setMessage('Envoi en cours...');
      
      const response = await fetch(`${API_URL}/auth/resend-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage('Email de vérification envoyé ! Vérifiez votre boîte mail.');
        // Sauvegarder l'email dans localStorage pour les futurs tentatives
        localStorage.setItem('pendingVerificationEmail', email);
      } else {
        setStatus('error');
        setMessage(data.message || 'Erreur lors de l\'envoi');
      }
    } catch (error) {
      console.error('Resend verification error:', error);
      setStatus('error');
      setMessage('Erreur de connexion au serveur');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">YALLA EXTRA</div>
          <h2 className="login-title">Vérification d'email</h2>
        </div>

        <div className="verification-content">
          {status === 'loading' && (
            <div className="alert alert-info">
              <Loader className="animate-spin" size={20} />
              <span>Vérification en cours...</span>
            </div>
          )}

          {status === 'success' && (
            <>
              <div className="alert alert-success">
                <CheckCircle size={20} />
                <span>{message}</span>
              </div>
              <div className="verify-actions">
                <p>Redirection automatique vers la page de connexion...</p>
                <button
                  onClick={() => navigate('/login')}
                  className="btn-primary"
                >
                  Se connecter maintenant
                </button>
              </div>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="alert alert-error">
                <AlertCircle size={20} />
                <span>{message}</span>
              </div>
              
              <div className="resend-verification">
                <h3>Renvoyer l'email de vérification</h3>
                <div className="input-group">
                  <input
                    type="email"
                    placeholder="Votre email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field"
                    disabled={status === 'loading'}
                  />
                </div>
                <button
                  onClick={handleResendVerification}
                  className="btn-secondary"
                  disabled={status === 'loading'}
                >
                  {status === 'loading' ? (
                    <Loader className="animate-spin" size={16} />
                  ) : (
                    <Mail size={16} />
                  )}
                  Renvoyer l'email de vérification
                </button>
              </div>
              
              <div className="verify-actions">
                <Link to="/login" className="btn-primary">
                  Retour à la connexion
                </Link>
              </div>
            </>
          )}
        </div>

        <div className="back-home">
          <Link to="/">← Retour à l'accueil</Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;