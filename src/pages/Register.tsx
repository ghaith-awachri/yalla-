import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Lock, 
  Phone, 
  MapPin, 
  Building2,
  Eye,
  EyeOff,
  UserPlus,
  Upload,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState<'candidate' | 'employer'>('candidate');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');
  
  const [formData, setFormData] = useState({
    // Common fields
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    address: '',
    
    // Candidate specific
    experience: '',
    education: '',
    photo: null as File | null,
    
    // Employer specific
    companyName: '',
    companyType: '',
    position: ''
  });

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 2) {
      if (!formData.firstName.trim()) newErrors.firstName = 'Le prénom est requis';
      if (!formData.lastName.trim()) newErrors.lastName = 'Le nom est requis';
      if (!formData.email.trim()) newErrors.email = 'L\'email est requis';
      if (!formData.phone.trim()) newErrors.phone = 'Le téléphone est requis';
      if (!formData.address.trim()) newErrors.address = 'L\'adresse est requise';
      
      if (userType === 'employer') {
        if (!formData.companyName.trim()) newErrors.companyName = 'Le nom de l\'établissement est requis';
        if (!formData.companyType) newErrors.companyType = 'La catégorie est requise';
      }
    }

    if (currentStep === 3) {
      if (!formData.password) newErrors.password = 'Le mot de passe est requis';
      if (formData.password.length < 6) newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (step < 3) {
      if (validateStep(step)) {
        setStep(step + 1);
      }
      return;
    }

    if (!validateStep(step)) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      const submissionData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        address: formData.address,
        userType: userType,
        ...(userType === 'candidate' ? {
          experience: formData.experience,
          education: formData.education
        } : {
          companyName: formData.companyName,
          companyType: formData.companyType,
          position: formData.position
        })
      };

      // URL corrigée
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage('Inscription réussie ! Redirection vers la connexion...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setErrors({ general: data.message || 'Erreur lors de l\'inscription' });
      }
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ general: 'Erreur de connexion au serveur' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (e.target.type === 'file') {
      const fileInput = e.target as HTMLInputElement;
      setFormData({
        ...formData,
        [e.target.name]: fileInput.files ? fileInput.files[0] : null
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    }
    
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const companyTypes = [
    'Restaurant',
    'Hôtel',
    'Café',
    'Boulangerie-Pâtisserie',
    'Salon de thé',
    'Traiteur',
    'Bar',
    'Fast-food',
    'Autre'
  ];

  return (
    <div className="register-container">
      <div className="register-card">
        {/* Header */}
        <div className="register-header">
          <div className="register-logo">YALLA EXTRA</div>
          <h2 className="register-title">Créer votre compte</h2>
          <p className="register-subtitle">Rejoignez la communauté HORECA</p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="alert alert-success">
            <CheckCircle className="w-5 h-5" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Error Message */}
        {errors.general && (
          <div className="alert alert-error">
            <AlertCircle className="w-5 h-5" />
            <span>{errors.general}</span>
          </div>
        )}

        {/* Progress Bar */}
        <div className="progress-section">
          <div className="progress-bar">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="progress-item">
                <div className={`progress-circle ${step >= stepNumber ? 'active' : ''}`}>
                  {stepNumber}
                </div>
                {stepNumber < 3 && (
                  <div className={`progress-line ${step > stepNumber ? 'active' : ''}`} />
                )}
              </div>
            ))}
          </div>
          <div className="progress-labels">
            <span className={step >= 1 ? 'active' : ''}>Type de compte</span>
            <span className={step >= 2 ? 'active' : ''}>Informations</span>
            <span className={step >= 3 ? 'active' : ''}>Finalisation</span>
          </div>
        </div>

        <div className="register-content">
          <form onSubmit={handleSubmit} className="register-form">
            {/* Step 1: Account Type */}
            {step === 1 && (
              <div className="step-content">
                <div className="step-header">
                  <h3>Quel type de compte souhaitez-vous créer ?</h3>
                  <p>Choisissez le profil qui vous correspond le mieux</p>
                </div>

                <div className="account-type-grid">
                  <button
                    type="button"
                    onClick={() => setUserType('candidate')}
                    className={`account-type-card ${userType === 'candidate' ? 'selected candidate' : ''}`}
                  >
                    <div className="account-type-content">
                      <div className={`account-type-icon ${userType === 'candidate' ? 'selected' : ''}`}>
                        <User className="w-6 h-6" />
                      </div>
                      <div>
                        <h4>Je cherche du travail</h4>
                        <p>Candidat, professionnel HORECA</p>
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setUserType('employer')}
                    className={`account-type-card ${userType === 'employer' ? 'selected employer' : ''}`}
                  >
                    <div className="account-type-content">
                      <div className={`account-type-icon ${userType === 'employer' ? 'selected' : ''}`}>
                        <Building2 className="w-6 h-6" />
                      </div>
                      <div>
                        <h4>Je recrute</h4>
                        <p>Employeur, établissement HORECA</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Basic Information */}
            {step === 2 && (
              <div className="step-content">
                <div className="step-header">
                  <h3>Vos informations personnelles</h3>
                  <p>Renseignez vos coordonnées de base</p>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="firstName" className="form-label">Prénom *</label>
                    <div className="input-with-icon">
                      <User className="input-icon" />
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        required
                        value={formData.firstName}
                        onChange={handleChange}
                        className={`form-input ${errors.firstName ? 'error' : ''}`}
                        placeholder="Votre prénom"
                      />
                    </div>
                    {errors.firstName && <p className="error-message">{errors.firstName}</p>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="lastName" className="form-label">Nom *</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                      className={`form-input ${errors.lastName ? 'error' : ''}`}
                      placeholder="Votre nom"
                    />
                    {errors.lastName && <p className="error-message">{errors.lastName}</p>}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="email" className="form-label">Adresse email *</label>
                  <div className="input-with-icon">
                    <Mail className="input-icon" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className={`form-input ${errors.email ? 'error' : ''}`}
                      placeholder="votre.email@exemple.com"
                    />
                  </div>
                  {errors.email && <p className="error-message">{errors.email}</p>}
                </div>

                <div className="form-group">
                  <label htmlFor="phone" className="form-label">Numéro de téléphone *</label>
                  <div className="input-with-icon">
                    <Phone className="input-icon" />
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className={`form-input ${errors.phone ? 'error' : ''}`}
                      placeholder="+216 XX XXX XXX"
                    />
                  </div>
                  {errors.phone && <p className="error-message">{errors.phone}</p>}
                </div>

                <div className="form-group">
                  <label htmlFor="address" className="form-label">Adresse *</label>
                  <div className="input-with-icon">
                    <MapPin className="input-icon" />
                    <input
                      type="text"
                      id="address"
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleChange}
                      className={`form-input ${errors.address ? 'error' : ''}`}
                      placeholder="Votre adresse complète"
                    />
                  </div>
                  {errors.address && <p className="error-message">{errors.address}</p>}
                </div>

                {userType === 'employer' && (
                  <>
                    <div className="form-group">
                      <label htmlFor="companyName" className="form-label">Nom de l'établissement *</label>
                      <div className="input-with-icon">
                        <Building2 className="input-icon" />
                        <input
                          type="text"
                          id="companyName"
                          name="companyName"
                          required
                          value={formData.companyName}
                          onChange={handleChange}
                          className={`form-input ${errors.companyName ? 'error' : ''}`}
                          placeholder="Nom de votre établissement"
                        />
                      </div>
                      {errors.companyName && <p className="error-message">{errors.companyName}</p>}
                    </div>

                    <div className="form-group">
                      <label htmlFor="companyType" className="form-label">Catégorie d'établissement *</label>
                      <select
                        id="companyType"
                        name="companyType"
                        required
                        value={formData.companyType}
                        onChange={handleChange}
                        className={`form-select ${errors.companyType ? 'error' : ''}`}
                      >
                        <option value="">Sélectionnez une catégorie</option>
                        {companyTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                      {errors.companyType && <p className="error-message">{errors.companyType}</p>}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Step 3: Additional Information & Security */}
            {step === 3 && (
              <div className="step-content">
                <div className="step-header">
                  <h3>Finalisez votre profil</h3>
                  <p>Dernières informations pour compléter votre inscription</p>
                </div>

                {userType === 'candidate' && (
                  <>
                    <div className="form-group">
                      <label htmlFor="experience" className="form-label">Expérience professionnelle</label>
                      <textarea
                        id="experience"
                        name="experience"
                        rows={3}
                        value={formData.experience}
                        onChange={handleChange}
                        className="form-textarea"
                        placeholder="Décrivez votre expérience dans le secteur HORECA..."
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="education" className="form-label">Formation</label>
                      <input
                        type="text"
                        id="education"
                        name="education"
                        value={formData.education}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="Vos diplômes et formations"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="photo" className="form-label">Photo de profil</label>
                      <div className="input-with-icon">
                        <Upload className="input-icon" />
                        <input
                          type="file"
                          id="photo"
                          name="photo"
                          accept="image/*"
                          onChange={handleChange}
                          className="form-input file-input"
                        />
                      </div>
                    </div>
                  </>
                )}

                {userType === 'employer' && (
                  <div className="form-group">
                    <label htmlFor="position" className="form-label">Votre poste</label>
                    <input
                      type="text"
                      id="position"
                      name="position"
                      value={formData.position}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="Ex: Gérant, Directeur, Chef..."
                    />
                  </div>
                )}

                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="password" className="form-label">Mot de passe *</label>
                    <div className="input-with-icon">
                      <Lock className="input-icon" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        name="password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className={`form-input password-input ${errors.password ? 'error' : ''}`}
                        placeholder="Mot de passe sécurisé"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="password-toggle"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.password && <p className="error-message">{errors.password}</p>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="confirmPassword" className="form-label">Confirmer le mot de passe *</label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                      placeholder="Confirmez votre mot de passe"
                    />
                    {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}
                  </div>
                </div>

                <div className="terms-group">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    required
                    className="form-checkbox"
                  />
                  <label htmlFor="terms" className="terms-label">
                    J'accepte les{' '}
                    <a href="#" className="terms-link">conditions d'utilisation</a>{' '}
                    et la{' '}
                    <a href="#" className="terms-link">politique de confidentialité</a>
                  </label>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="form-navigation">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="btn-secondary"
                  disabled={isSubmitting}
                >
                  Précédent
                </button>
              )}
              
              <button
                type="submit"
                disabled={isSubmitting}
                className={`btn-primary ${step === 1 ? 'full-width' : ''} ${isSubmitting ? 'loading' : ''}`}
              >
                {isSubmitting ? (
                  <>
                    <div className="spinner"></div>
                    <span>Inscription...</span>
                  </>
                ) : step < 3 ? (
                  <span>Continuer</span>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5" />
                    <span>Créer mon compte</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Login Link */}
          <div className="login-link">
            <p>
              Vous avez déjà un compte ?{' '}
              <Link to="/login">Se connecter</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;