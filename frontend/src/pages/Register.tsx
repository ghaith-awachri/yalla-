import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FormDropdown } from '../components/ui/FormDropdown';
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

    const isStepReady = () => {
    if (step === 1) return true;
    if (step === 2) {
      const commonReady = formData.firstName && formData.lastName && formData.email && formData.phone && formData.address && formData.age;
      if (userType === 'candidate') {
        return commonReady && formData.cin && formData.experience && formData.education.length > 0;
      }
      return commonReady && formData.companyName && formData.companyType && formData.establishmentCategory;
    }
    if (step === 3) {
      return formData.password && formData.confirmPassword && formData.password === formData.confirmPassword;
    }
    return false;
  };

  return (
    <div className="register-container">
      <div className="register-card">
        {/* Header */}
        <div className="register-header">
          <div className="register-logo">
            <span className="text-blue-600">YALLA</span>
            <span className="text-slate-900">EXTRA</span>
          </div>
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
            <span className={step >= 1 ? 'active' : ''}>Type</span>
            <span className={step >= 2 ? 'active' : ''}>Infos</span>
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
                  <h3>Informations Personnelles</h3>
                  <p>Renseignez vos coordonnées pour continuer</p>
                </div>

                <div className="form-sections-container">
                  {/* Common Personal Info Section */}
                  <div className="form-section-block">
                    <h4 className="section-title">Coordonnées de base</h4>
                    <div className="form-grid-2">
                      <div className="form-group">
                        <label htmlFor="firstName" className="form-label">Prénom *</label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          required
                          value={formData.firstName}
                          onChange={handleChange}
                          className={`form-input ${errors.firstName ? 'error' : ''}`}
                          placeholder="Ex: Ahmed"
                        />
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
                          placeholder="Ex: Trabelsi"
                        />
                      </div>
                    </div>

                    <div className="form-grid-2">
                      <div className="form-group">
                        <label htmlFor="email" className="form-label">Email *</label>
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
                            placeholder="exemple@email.com"
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label htmlFor="phone" className="form-label">Téléphone *</label>
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
                            placeholder="XX XXX XXX"
                          />
                        </div>
                      </div>
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
                    </div>

                    <div className="form-grid-2">
                      <div className="form-group">
                        <label htmlFor="age" className="form-label">Âge *</label>
                        <input
                          type="number"
                          id="age"
                          name="age"
                          required
                          value={formData.age}
                          onChange={handleChange}
                          className={`form-input ${errors.age ? 'error' : ''}`}
                          placeholder="Ex: 25"
                        />
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
                            placeholder="8 chiffres"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Candidate Specific Experience Section */}
                  {userType === 'candidate' && (
                    <>
                      <div className="form-section-block">
                        <h4 className="section-title">Expérience & Formation</h4>
                        <div className="form-group">
                          <label className="form-label">Expérience professionnelle *</label>
                          <FormDropdown 
                            value={formData.experience}
                            onValueChange={(val) => handleChange({ target: { name: 'experience', value: val } } as any)}
                            placeholder="Votre niveau d'expérience"
                            options={experienceOptions}
                          />
                        </div>

                        <div className="form-group">
                          <label className="form-label">Diplômes / Certifications *</label>
                          <div className="checkbox-grid-3">
                            {educationOptions.map(option => (
                              <div key={option} className="checkbox-item-premium">
                                <input
                                  type="checkbox"
                                  id={`education-${option}`}
                                  name="education"
                                  value={option}
                                  checked={formData.education.includes(option)}
                                  onChange={handleCheckboxChange}
                                />
                                <label htmlFor={`education-${option}`}>{option}</label>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="form-grid-2">
                          <div className="form-group">
                            <label className="form-label">Poste actuel</label>
                            <input
                              type="text"
                              name="currentPosition"
                              value={formData.currentPosition}
                              onChange={handleChange}
                              className="form-input"
                              placeholder="Ex: Serveur"
                            />
                          </div>
                          <div className="form-group">
                            <label className="form-label">Établissement actuel</label>
                            <input
                              type="text"
                              name="currentCompany"
                              value={formData.currentCompany}
                              onChange={handleChange}
                              className="form-input"
                              placeholder="Nom du restaurant/hôtel"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="form-section-block">
                        <h4 className="section-title">Souhaits & Préférences</h4>
                        <div className="form-group">
                          <label className="form-label">Postes recherchés</label>
                          <div className="scroll-checkbox-list">
                            {positionOptions.map(option => (
                              <div key={option} className="checkbox-item-premium">
                                <input
                                  type="checkbox"
                                  id={`desired-${option}`}
                                  name="desiredPositions"
                                  value={option}
                                  checked={formData.desiredPositions.includes(option)}
                                  onChange={handleCheckboxChange}
                                />
                                <label htmlFor={`desired-${option}`}>{option}</label>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="form-group">
                          <label className="form-label">Zones géographiques préférées</label>
                          <div className="scroll-checkbox-list">
                            {zoneOptions.map(option => (
                              <div key={option} className="checkbox-item-premium">
                                <input
                                  type="checkbox"
                                  id={`zone-${option}`}
                                  name="preferredZones"
                                  value={option}
                                  checked={formData.preferredZones.includes(option)}
                                  onChange={handleCheckboxChange}
                                />
                                <label htmlFor={`zone-${option}`}>{option}</label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Employer Specific Section */}
                  {userType === 'employer' && (
                    <div className="form-section-block">
                      <h4 className="section-title">Détails de l'établissement</h4>
                      <div className="form-group">
                        <label className="form-label">Nom de l'établissement *</label>
                        <div className="input-with-icon">
                          <Building2 className="input-icon" />
                          <input
                            type="text"
                            name="companyName"
                            required
                            value={formData.companyName}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="Nom officiel"
                          />
                        </div>
                      </div>

                      <div className="form-grid-2">
                        <div className="form-group">
                          <label className="form-label">Catégorie *</label>
                          <FormDropdown 
                            value={formData.companyType}
                            onValueChange={(val) => handleChange({ target: { name: 'companyType', value: val } } as any)}
                            options={companyTypes.map(t => ({ value: t, label: t }))}
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Type d'établissement *</label>
                          <FormDropdown 
                            value={formData.establishmentCategory}
                            onValueChange={(val) => handleChange({ target: { name: 'establishmentCategory', value: val } } as any)}
                            options={establishmentCategories.map(c => ({ value: c, label: c }))}
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Votre poste au sein de l'établissement</label>
                        <input
                          type="text"
                          name="position"
                          value={formData.position}
                          onChange={handleChange}
                          className="form-input"
                          placeholder="Ex: Gérant"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Security */}
            {step === 3 && (
              <div className="step-content">
                <div className="step-header">
                  <h3>Sécurité du compte</h3>
                  <p>Définissez vos identifiants de connexion</p>
                </div>

                <div className="form-section-block">
                  <div className="form-group">
                    <label className="form-label">Photo de profil</label>
                    <div className="file-upload-zone">
                      <Upload className="w-8 h-8 text-slate-300 mb-2" />
                      <input
                        type="file"
                        name="photo"
                        accept="image/*"
                        onChange={handleChange}
                        className="file-input-hidden"
                        id="photo-upload"
                      />
                      <label htmlFor="photo-upload" className="file-upload-label">
                        {formData.photo ? formData.photo.name : 'Cliquez pour uploader une photo'}
                      </label>
                    </div>
                  </div>

                  <div className="form-grid-2">
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
                          className="form-input"
                          placeholder="Min. 6 caractères"
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
                      <label htmlFor="confirmPassword" className="form-label">Confirmation *</label>
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        required
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="Répétez le mot de passe"
                      />
                    </div>
                  </div>
                </div>

                <div className="terms-group">
                  <input id="terms" type="checkbox" required className="form-checkbox" />
                  <label htmlFor="terms" className="terms-label">
                    J'accepte les <a href="#">conditions d'utilisation</a>
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
                className={`btn-primary ${step === 1 ? 'full-width' : ''} ${isSubmitting ? 'loading' : ''} ${isStepReady() ? 'btn-active' : ''}`}
              >
                {isSubmitting ? (
                  <>
                    <div className="spinner"></div>
                    <span>Chargement...</span>
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