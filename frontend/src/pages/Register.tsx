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
  CheckCircle,
  Calendar,
  Briefcase
} from 'lucide-react';
import { API_URL } from '../api/config';
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
    cin: '',
    age: '',
    photo: null as File | null,
    cv: null as File | null,
    
    // Candidate specific
    experience: '',
    education: [] as string[],
    currentPosition: '',
    currentCompany: '',
    desiredPositions: [] as string[],
    preferredZones: [] as string[],
    trainingInstitutions: [] as string[],
    
    // Employer specific
    companyName: '',
    companyType: '',
    position: '',
    establishmentCategory: ''
  });

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 2) {
      if (!formData.firstName.trim()) newErrors.firstName = 'Le prénom est requis';
      if (!formData.lastName.trim()) newErrors.lastName = 'Le nom est requis';
      if (!formData.email.trim()) newErrors.email = 'L\'email est requis';
      if (!formData.phone.trim()) newErrors.phone = 'Le téléphone est requis';
      if (!formData.address.trim()) newErrors.address = 'L\'adresse est requise';
      if (!formData.age) newErrors.age = 'L\'âge est requis';
      
      if (userType === 'candidate') {
        if (!formData.cin) newErrors.cin = 'Le numéro CIN est requis';
        if (!formData.experience) newErrors.experience = 'L\'expérience est requise';
        if (formData.education.length === 0) newErrors.education = 'La formation est requise';
      }
      
      if (userType === 'employer') {
        if (!formData.companyName.trim()) newErrors.companyName = 'Le nom de l\'établissement est requis';
        if (!formData.companyType) newErrors.companyType = 'La catégorie est requise';
        if (!formData.establishmentCategory) newErrors.establishmentCategory = 'Le type d\'établissement est requis';
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
  setSuccessMessage('');

  try {
    const formDataToSend = new FormData();

    // Ajout des champs communs
    formDataToSend.append('firstName', formData.firstName);
    formDataToSend.append('lastName', formData.lastName);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('phone', formData.phone);
    formDataToSend.append('password', formData.password);
    formDataToSend.append('confirmPassword', formData.confirmPassword);
    formDataToSend.append('address', formData.address);
    formDataToSend.append('userType', userType);
    formDataToSend.append('age', formData.age);
         

    // Ajout des champs spécifiques
    if (userType === 'candidate') {
      formDataToSend.append('cin', formData.cin);
      formDataToSend.append('experience', formData.experience);
      formData.education.forEach(edu => formDataToSend.append('education', edu));
      formDataToSend.append('currentPosition', formData.currentPosition);
      formDataToSend.append('currentCompany', formData.currentCompany);
      formData.desiredPositions.forEach(pos => formDataToSend.append('desiredPositions', pos));
      formData.preferredZones.forEach(zone => formDataToSend.append('preferredZones', zone));
      formData.trainingInstitutions.forEach(inst => formDataToSend.append('trainingInstitutions', inst));
      if (formData.photo) formDataToSend.append('photo', formData.photo);
      if (formData.cv) formDataToSend.append('cv', formData.cv);
    } else {
       if (formData.photo) formDataToSend.append('photo', formData.photo);
      formDataToSend.append('companyName', formData.companyName);
      formDataToSend.append('companyType', formData.companyType);
      formDataToSend.append('establishmentCategory', formData.establishmentCategory);
      formDataToSend.append('position', formData.position || '');
    }

    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      body: formDataToSend,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erreur lors de l\'inscription');
    }

    setSuccessMessage('Inscription réussie ! Redirection vers la connexion...');
    setTimeout(() => navigate('/login'), 2000);

  } catch (error: any) {
    console.error('Registration error:', error);
    setErrors({ general: error.message || 'Une erreur est survenue' });
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
    
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    let updatedArray: string[];
    
    if (checked) {
      updatedArray = [...formData[name as keyof typeof formData] as string[], value];
    } else {
      updatedArray = (formData[name as keyof typeof formData] as string[]).filter(item => item !== value);
    }
    
    setFormData({
      ...formData,
      [name]: updatedArray
    });
  };

  const experienceOptions = [
    { value: 'less_than_1', label: 'Moins d\'une année' },
    { value: '1_to_3', label: 'Entre 1 an et 3 ans' },
    { value: '3_to_5', label: 'Entre 3 ans et 5 ans' },
    { value: '5_to_10', label: 'Entre 5 ans et 10 ans' },
    { value: 'more_than_10', label: 'Plus de 10 ans' },
    { value: 'other', label: 'Autres' }
  ];

  const educationOptions = [
    'BAC',
    'BTS',
    'BTP',
    'CAP',
    'Maitrise',
    'Licence',
    'Master',
    'Sans diplôme'
  ];

  const positionOptions = [
    'Acheteur',
    'Commercial',
    'Chef de cuisine',
    'Chef pâtissier',
    'Chef de partie',
    'Chef de salle',
    'Chef de rang',
    'Pizzaiolo',
    'Cuisinier',
    'Pâtissier',
    'Croissantier',
    'Boulanger',
    'Comptoiriste',
    'Barista',
    'Barman',
    'Maitre d\'hôtel',
    'Glacier',
    'Food and beverage',
    'Caissier',
    'Gérant',
    'Serveur(se)',
    'Commis',
    'Commis de cuisine',
    'Préparateur de Chicha',
    'Plongeur',
    'Responsable de restauration',
    'Livreur',
    'Chauffeur',
    'Autres'
  ];

  const zoneOptions = [
    'Banlieue nord (Marsa, Lac, kram…)',
    'Soukra- Charguia-Aouina',
    'Centre-ville Tunis',
    'Menzah Nasr, Ariana',
    'Mannouba – Bardo',
    'Mnihla, Ettadhamen',
    'Ben Arous',
    'Nabeul',
    'Hammamet',
    'Bizerte',
    'Sousse',
    'Sfax',
    'Djerba',
    'Zaghouane',
    'Tabarka',
    'Monastir',
    'Mahdi',
    'Kairouan',
    'Gabes',
    'Medenine',
    'Gafsa',
    'Kasserine',
    'Tozeur',
    'Kebili',
    'Tataouine',
    'Sebitla',
    'Jendouba',
    'Beja',
    'Kef',
    'Sidi Bouzid',
    'Autres'
  ];

  const trainingInstitutionOptions = [
    'Ecole hôtelière (Kerkouane, Hammamet, Monastir Sousse, Djerba, etc)',
    'Institut Sidi Dhrif',
    'Centre de formation professionnelle (Ezzouhour, Tabarka, Nabeul, etc)',
    'Institut Pascal-Tunis',
    'Institut Maghrébin de Management et de Tourisme-Tunis',
    'Centre de Formation Arts et Métiers – Tunis',
    'Centre de Formation pâtisserie moderne Tunisie- Tunis',
    'Vatel',
    'ISET',
    'FSEG (Tunis, Sfax, Nabeul, etc)',
    'Ecole centrale',
    'Centre de formation professionnelle Borj Cedria',
    'Master Class Academy',
    'Centre de Formation et d\'Apprentissage d\'Ezzouhour',
    'Centre Sectoriel de Formation en Techniques Hôtelières de Tabarka',
    'Centre Sectoriel de Formation en Techniques Hôtelières de Hammamet Sud',
    'Centre de Formation et de Promotion du Travail Indépendant de Tozeur',
    'Centre de Formation et d\'Apprentissage de Sidi Achour Nabeul',
    'Centre de Formation et d\'Apprentissage de Menzel Bourguiba',
    'Centre de Formation et de Promotion du Travail Indépendant de Hammam Sousse',
    'Centre de Formation et d\'Apprentissage de Monastir',
    'Centre de Formation et d\'Apprentissage de Djerba',
    'Centre de Formation Touristique de Nabeul'
  ];

  const establishmentCategories = [
    'Restaurant touristique',
    'Restaurant',
    'Café',
    'Salon de thé',
    'Pizzeria',
    'Sandwicherie',
    'Chaine de restauration',
    'Chaine de café',
    'Catering',
    'Hôtel (1 étoile)',
    'Hôtel (2 étoiles)',
    'Hôtel (3 étoiles)',
    'Hôtel (4 étoiles)',
    'Hôtel (5 étoiles)',
    'Maison d\'hôtes',
    'Pâtisserie',
    'Boulangerie-Pâtisserie',
    'Boulangerie',
    'Bar',
    'Cafétéria',
    'Kiosque',
    'Autres'
  ];

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

                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="age" className="form-label">Âge *</label>
                    <div className="input-with-icon">
                      <Calendar className="input-icon" />
                      <input
                        type="number"
                        id="age"
                        name="age"
                        required
                        value={formData.age}
                        onChange={handleChange}
                        className={`form-input ${errors.age ? 'error' : ''}`}
                        placeholder="Votre âge"
                        min="16"
                        max="99"
                      />
                    </div>
                    {errors.age && <p className="error-message">{errors.age}</p>}
                  </div>

                  {userType === 'candidate' && (
                    <div className="form-group">
                      <label htmlFor="cin" className="form-label">Numéro CIN *</label>
                      <input
                        type="number"
                        id="cin"
                        name="cin"
                        required
                        value={formData.cin}
                        onChange={handleChange}
                        className={`form-input ${errors.cin ? 'error' : ''}`}
                        placeholder="Votre numéro CIN"
                        min=""
                        max="99999999"
                      />
                      {errors.cin && <p className="error-message">{errors.cin}</p>}
                    </div>
                  )}
                </div>

                {userType === 'candidate' && (
                  <>
                    <div className="form-group">
                      <label htmlFor="experience" className="form-label">Expérience professionnelle *</label>
                      <select
                        id="experience"
                        name="experience"
                        required
                        value={formData.experience}
                        onChange={handleChange}
                        className={`form-select ${errors.experience ? 'error' : ''}`}
                      >
                        <option value="">Sélectionnez votre expérience</option>
                        {experienceOptions.map(option => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                      {errors.experience && <p className="error-message">{errors.experience}</p>}
                    </div>

                    <div className="form-group">
                      <label className="form-label">Formation/diplôme *</label>
                      <div className="checkbox-grid">
                        {educationOptions.map(option => (
                          <div key={option} className="checkbox-item">
                            <input
                              type="checkbox"
                              id={`education-${option}`}
                              name="education"
                              value={option}
                              checked={formData.education.includes(option)}
                              onChange={handleCheckboxChange}
                              className="form-checkbox"
                            />
                            <label htmlFor={`education-${option}`}>{option}</label>
                          </div>
                        ))}
                      </div>
                      {errors.education && <p className="error-message">{errors.education}</p>}
                    </div>

                    <div className="form-group">
                      <label htmlFor="currentPosition" className="form-label">Poste actuel / Métier</label>
                      <input
                        type="text"
                        id="currentPosition"
                        name="currentPosition"
                        value={formData.currentPosition}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="Votre poste actuel ou métier"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="currentCompany" className="form-label">Nom de l'enseigne actuelle</label>
                      <input
                        type="text"
                        id="currentCompany"
                        name="currentCompany"
                        value={formData.currentCompany}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="Nom de votre établissement actuel"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Poste(s) désiré(s)</label>
                      <div className="checkbox-grid">
                        {positionOptions.map(option => (
                          <div key={option} className="checkbox-item">
                            <input
                              type="checkbox"
                              id={`desiredPositions-${option}`}
                              name="desiredPositions"
                              value={option}
                              checked={formData.desiredPositions.includes(option)}
                              onChange={handleCheckboxChange}
                              className="form-checkbox"
                            />
                            <label htmlFor={`desiredPositions-${option}`}>{option}</label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Zone(s) de travail préférée(s)</label>
                      <div className="checkbox-grid">
                        {zoneOptions.map(option => (
                          <div key={option} className="checkbox-item">
                            <input
                              type="checkbox"
                              id={`preferredZones-${option}`}
                              name="preferredZones"
                              value={option}
                              checked={formData.preferredZones.includes(option)}
                              onChange={handleCheckboxChange}
                              className="form-checkbox"
                            />
                            <label htmlFor={`preferredZones-${option}`}>{option}</label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Établissements de formation</label>
                      <div className="checkbox-grid">
                        {trainingInstitutionOptions.map(option => (
                          <div key={option} className="checkbox-item">
                            <input
                              type="checkbox"
                              id={`trainingInstitutions-${option}`}
                              name="trainingInstitutions"
                              value={option}
                              checked={formData.trainingInstitutions.includes(option)}
                              onChange={handleCheckboxChange}
                              className="form-checkbox"
                            />
                            <label htmlFor={`trainingInstitutions-${option}`}>{option}</label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

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

                    <div className="form-group">
                      <label htmlFor="establishmentCategory" className="form-label">Type d'établissement *</label>
                      <select
                        id="establishmentCategory"
                        name="establishmentCategory"
                        required
                        value={formData.establishmentCategory}
                        onChange={handleChange}
                        className={`form-select ${errors.establishmentCategory ? 'error' : ''}`}
                      >
                        <option value="">Sélectionnez un type</option>
                        {establishmentCategories.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                      {errors.establishmentCategory && <p className="error-message">{errors.establishmentCategory}</p>}
                    </div>

                    <div className="form-group">
                      <label htmlFor="position" className="form-label">Votre poste</label>
                      <div className="input-with-icon">
                        <Briefcase className="input-icon" />
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
{userType === 'candidate' && (
   <>
      
                  </>
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