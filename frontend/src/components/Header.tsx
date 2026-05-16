import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Menu, 
  X, 
  User, 
  LogIn, 
  LogOut, 
  Settings, 
  Eye, 
  FileText, 
  Users,
  Globe,
  Briefcase,
  Building2,
  Check,
  Image,
  Save,
  MapPin
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { useLanguage } from '../context/LanguageContext';
import html2canvas from 'html2canvas';
import { FormDropdown } from './ui/FormDropdown';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  userType: 'candidate' | 'employer' | 'admin';
  isActive: boolean;
  photo?: string;
  cv?: string;
  age?: number;
  cin?: string;
  experience?: string;
  education?: string[];
  currentPosition?: string;
  currentCompany?: string;
  desiredPositions?: string[];
  preferredZones?: string[];
  trainingInstitutions?: string[];
  lastLogin?: string;
  createdAt: string;
  companyName?: string;
  companyType?: string;
  position?: string;
  establishmentCategory?: string;
}

export const generateCV = (userData: any) => {
  const cvElement = document.createElement('div');
  cvElement.style.width = '210mm';
  cvElement.style.padding = '0';
  cvElement.style.background = '#ffffff';
  cvElement.style.fontFamily = "'Segoe UI', Helvetica, Arial, sans-serif";
  cvElement.style.color = '#333';

  cvElement.innerHTML = `
    <div style="display: flex; border: 1px solid #ddd; min-height: 297mm;">
      <!-- Colonne gauche -->
      <div style="background: #2c3e50; color: #fff; width: 35%; padding: 25px; display: flex; flex-direction: column; align-items: center;">
        
        <!-- Photo -->
        ${userData.photo ? 
          `<img src="${userData.photo}" style="width: 100px; height: 100px; border-radius: 50%; object-fit: cover; border: 3px solid #fff; margin-bottom: 15px;" />` :
          `<div style="width: 100px; height: 100px; border-radius: 50%; background: #444; display: flex; align-items: center; justify-content: center; margin-bottom: 15px;">
            <span style="color: #ccc;">Photo</span>
          </div>`
        }

        <!-- Nom et âge -->
        <h1 style="margin: 0; font-size: 20px; text-align: center;">${userData.firstName} ${userData.lastName}</h1>
        ${userData.age ? `<p style="margin: 0; font-size: 14px; color: #bdc3c7;">Âge : ${userData.age}</p>` : ''}

        <!-- CIN -->
        ${userData.cin ? `<p style="margin: 5px 0 15px; font-size: 14px; color: #bdc3c7;">CIN : ${userData.cin}</p>` : ''}

        <!-- Contact -->
        <h2 style="font-size: 16px; border-bottom: 1px solid #bdc3c7; padding-bottom: 5px; width: 100%;">Contact</h2>
        <p style="font-size: 13px; word-break: break-all;">${userData.email || ''}</p>
        ${userData.phone ? `<p style="font-size: 13px;">${userData.phone}</p>` : ''}
        ${userData.address ? `<p style="font-size: 13px;">${userData.address}</p>` : ''}

        <!-- Formation -->
        ${userData.education?.length > 0 ? `
          <h2 style="font-size: 16px; border-bottom: 1px solid #bdc3c7; margin-top: 20px; padding-bottom: 5px; width: 100%;">Formation</h2>
          <ul style="padding-left: 15px; margin-top: 5px; font-size: 13px;">
            ${userData.education.map((edu: string) => `<li style="margin-bottom: 5px;">${edu}</li>`).join('')}
          </ul>
        ` : ''}

        <!-- Établissements de formation -->
        ${userData.trainingInstitutions?.length > 0 ? `
          <h2 style="font-size: 16px; border-bottom: 1px solid #bdc3c7; margin-top: 20px; padding-bottom: 5px; width: 100%;">Établissements</h2>
          <ul style="padding-left: 15px; margin-top: 5px; font-size: 13px;">
            ${userData.trainingInstitutions.map((inst: string) => `<li style="margin-bottom: 5px;">${inst}</li>`).join('')}
          </ul>
        ` : ''}
      </div>

      <!-- Colonne droite -->
      <div style="width: 65%; padding: 40px; background: #fff;">
        <div style="margin-bottom: 30px; border-bottom: 2px solid #2c3e50; padding-bottom: 10px;">
          <h2 style="margin: 0; color: #2c3e50; text-transform: uppercase; letter-spacing: 2px;">Profil Professionnel</h2>
        </div>

        <div style="margin-bottom: 25px;">
          <h3 style="color: #2c3e50; font-size: 18px; margin-bottom: 10px;">Expérience Globale</h3>
          <p style="font-size: 15px; line-height: 1.6;">${userData.experience || 'Non spécifiée'}</p>
        </div>

        ${userData.currentPosition || userData.currentCompany ? `
          <div style="margin-bottom: 25px;">
            <h3 style="color: #2c3e50; font-size: 18px; margin-bottom: 10px;">Poste Actuel</h3>
            <p style="font-size: 15px; margin: 0;"><strong>${userData.currentPosition || ''}</strong></p>
            <p style="font-size: 14px; color: #7f8c8d; margin: 5px 0 0;">${userData.currentCompany || ''}</p>
          </div>
        ` : ''}

        ${userData.desiredPositions?.length > 0 ? `
          <div style="margin-bottom: 25px;">
            <h3 style="color: #2c3e50; font-size: 18px; margin-bottom: 10px;">Postes Recherchés</h3>
            <div style="display: flex; flex-wrap: wrap; gap: 10px;">
              ${userData.desiredPositions.map((pos: string) => `
                <span style="background: #ecf0f1; padding: 5px 12px; border-radius: 15px; font-size: 13px; color: #34495e;">${pos}</span>
              `).join('')}
            </div>
          </div>
        ` : ''}

        ${userData.preferredZones?.length > 0 ? `
          <div style="margin-bottom: 25px;">
            <h3 style="color: #2c3e50; font-size: 18px; margin-bottom: 10px;">Zones de Mobilité</h3>
            <p style="font-size: 15px; color: #34495e;">${userData.preferredZones.join(', ')}</p>
          </div>
        ` : ''}

        <div style="margin-top: auto; padding-top: 50px; border-top: 1px solid #eee; font-size: 12px; color: #95a5a6; text-align: center;">
          Document généré via Yalla Extra - Plateforme de recrutement HORECA
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(cvElement);

  html2canvas(cvElement, { scale: 2 }).then(canvas => {
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210;
    const pageHeight = 297;
    const imgHeight = canvas.height * imgWidth / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`CV_${userData.firstName}_${userData.lastName}.pdf`);
    document.body.removeChild(cvElement);
  });
};

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  t: (key: string) => string;
  setUser: (user: User | null) => void;
  getPhotoUrl: (user: any) => string | null;
}

const EditUserModal: React.FC<EditUserModalProps> = ({ isOpen, onClose, currentUser, t, setUser, getPhotoUrl }) => {
  const [localFormData, setLocalFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    userType: 'candidate',
    address: '',
    age: '',
    cin: '',
    experience: '',
    education: [] as string[],
    currentPosition: '',
    currentCompany: '',
    desiredPositions: [] as string[],
    preferredZones: [] as string[],
    trainingInstitutions: [] as string[],
    companyName: '',
    companyType: '',
    position: '',
    establishmentCategory: '',
    photo: null as File | null,
    cv: null as File | null,
    isActive: true
  });

  const educationOptions = ['BAC', 'BTS', 'BTP', 'CAP', 'Maitrise', 'Licence', 'Master', 'Sans diplôme'];
  const experienceOptions = [
    { value: 'less_than_1', label: 'Moins d\'une année' },
    { value: '1_to_3', label: 'Entre 1 an et 3 ans' },
    { value: '3_to_5', label: 'Entre 3 ans et 5 ans' },
    { value: '5_to_10', label: 'Entre 5 ans et 10 ans' },
    { value: 'more_than_10', label: 'Plus de 10 ans' },
    { value: 'other', label: 'Autres' }
  ];
  const companyTypes = ['Restaurant', 'Hôtel', 'Café', 'Boulangerie-Pâtisserie', 'Salon de thé', 'Traiteur', 'Bar', 'Fast-food', 'Autre'];
  const establishmentCategories = ['Restaurant touristique', 'Restaurant', 'Café', 'Salon de thé', 'Pizzeria', 'Sandwicherie', 'Chaine de restauration', 'Chaine de café', 'Catering', 'Hôtel (1 étoile)', 'Hôtel (2 étoiles)', 'Hôtel (3 étoiles)', 'Hôtel (4 étoiles)', 'Hôtel (5 étoiles)', 'Maison d\'hôtes', 'Pâtisserie', 'Boulangerie-Pâtisserie', 'Boulangerie', 'Bar', 'Cafétéria', 'Kiosque', 'Autres'];

  const positionOptions = [
    'Acheteur', 'Commercial', 'Chef de cuisine', 'Chef pâtissier', 'Chef de partie', 'Chef de salle', 'Chef de rang', 
    'Pizzaiolo', 'Cuisinier', 'Pâtissier', 'Croissantier', 'Boulanger', 'Comptoiriste', 'Barista', 'Barman', 
    'Maitre d\'hôtel', 'Glacier', 'Food and beverage', 'Caissier', 'Gérant', 'Serveur(se)', 'Commis', 
    'Commis de cuisine', 'Préparateur de Chicha', 'Plongeur', 'Responsable de restauration', 'Livreur', 'Chauffeur', 'Autres'
  ];

  const zoneOptions = [
    'Banlieue nord (Marsa, Lac, kram…)', 'Soukra- Charguia-Aouina', 'Centre-ville Tunis', 'Menzah Nasr, Ariana', 
    'Mannouba – Bardo', 'Mnihla, Ettadhamen', 'Ben Arous', 'Nabeul', 'Hammamet', 'Bizerte', 'Sousse', 'Sfax', 
    'Djerba', 'Zaghouane', 'Tabarka', 'Monastir', 'Mahdi', 'Kairouan', 'Gabes', 'Medenine', 'Gafsa', 'Kasserine', 
    'Tozeur', 'Kebili', 'Tataouine', 'Sebitla', 'Jendouba', 'Beja', 'Kef', 'Sidi Bouzid', 'Autres'
  ];

  const trainingInstitutionOptions = [
    'Ecole hôtelière (Kerkouane, Hammamet, Monastir Sousse, Djerba, etc)', 'Institut Sidi Dhrif', 
    'Centre de formation professionnelle (Ezzouhour, Tabarka, Nabeul, etc)', 'Institut Pascal-Tunis', 
    'Institut Maghrébin de Management et de Tourisme-Tunis', 'Centre de Formation Arts et Métiers – Tunis', 
    'Centre de Formation pâtisserie moderne Tunisie- Tunis', 'Vatel', 'ISET', 'FSEG (Tunis, Sfax, Nabeul, etc)', 
    'Ecole centrale', 'Centre de formation professionnelle Borj Cedria', 'Master Class Academy', 
    'Centre de Formation et d\'Apprentissage d\'Ezzouhour', 'Centre Sectoriel de Formation en Techniques Hôtelières de Tabarka', 
    'Centre Sectoriel de Formation en Techniques Hôtelières de Hammamet Sud', 'Centre de Formation et de Promotion du Travail Indépendant de Tozeur', 
    'Centre de Formation et d\'Apprentissage de Sidi Achour Nabeul', 'Centre de Formation et d\'Apprentissage de Menzel Bourguiba', 
    'Centre de Formation et de Promotion du Travail Indépendant de Hammam Sousse', 'Centre de Formation et d\'Apprentissage de Monastir', 
    'Centre de Formation et d\'Apprentissage de Djerba', 'Centre de Formation Touristique de Nabeul'
  ];

  const [activeEditTab, setActiveEditTab] = useState('general');

  useEffect(() => {
    if (currentUser) {
      setLocalFormData({
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        userType: currentUser.userType || 'candidate',
        address: currentUser.address || '',
        age: currentUser.age ? String(currentUser.age) : '',
        cin: currentUser.cin || '',
        experience: currentUser.experience || '',
        education: currentUser.education || [],
        currentPosition: currentUser.currentPosition || '',
        currentCompany: currentUser.currentCompany || '',
        desiredPositions: currentUser.desiredPositions || [],
        preferredZones: currentUser.preferredZones || [],
        trainingInstitutions: currentUser.trainingInstitutions || [],
        companyName: currentUser.companyName || '',
        companyType: currentUser.companyType || '',
        position: currentUser.position || '',
        establishmentCategory: currentUser.establishmentCategory || '',
        photo: null,
        cv: null,
        isActive: currentUser.isActive !== false
      });
    }
  }, [currentUser]);

  const handleLocalChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const isChecked = (e.target as HTMLInputElement).checked;
      let updatedArray = [...(localFormData[name as keyof typeof localFormData] as string[])];
      if (isChecked) updatedArray.push(value);
      else updatedArray = updatedArray.filter(item => item !== value);
      setLocalFormData({ ...localFormData, [name]: updatedArray });
    } else if (type === 'file') {
      const fileInput = e.target as HTMLInputElement;
      setLocalFormData({ ...localFormData, [name]: fileInput.files ? fileInput.files[0] : null });
    } else {
      setLocalFormData({ ...localFormData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const baseUrl = import.meta.env.VITE_API_URL;
      const formDataToSend = new FormData();
      formDataToSend.append('firstName', localFormData.firstName);
      formDataToSend.append('lastName', localFormData.lastName);
      formDataToSend.append('email', localFormData.email);
      formDataToSend.append('phone', localFormData.phone);
      formDataToSend.append('address', localFormData.address);
      formDataToSend.append('age', localFormData.age);
      formDataToSend.append('isActive', localFormData.isActive.toString());

      if (localFormData.userType === 'candidate') {
        formDataToSend.append('cin', localFormData.cin);
        formDataToSend.append('experience', localFormData.experience);
        localFormData.education.forEach(edu => formDataToSend.append('education', edu));
        formDataToSend.append('currentPosition', localFormData.currentPosition);
        formDataToSend.append('currentCompany', localFormData.currentCompany);
        localFormData.desiredPositions.forEach(pos => formDataToSend.append('desiredPositions', pos));
        localFormData.preferredZones.forEach(zone => formDataToSend.append('preferredZones', zone));
        localFormData.trainingInstitutions.forEach(inst => formDataToSend.append('trainingInstitutions', inst));
        if (localFormData.photo) formDataToSend.append('photo', localFormData.photo);
        if (localFormData.cv) formDataToSend.append('cv', localFormData.cv);
      } else {
        formDataToSend.append('companyName', localFormData.companyName);
        formDataToSend.append('companyType', localFormData.companyType);
        formDataToSend.append('establishmentCategory', localFormData.establishmentCategory);
        formDataToSend.append('position', localFormData.position);
      }

      const response = await fetch(`${baseUrl}/users/${currentUser?._id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: formDataToSend
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update user');
      }

      const data = await response.json();
      if (data.success) {
        // Update local state and storage
        const updatedUser = data.data || data.user;
        if (updatedUser) {
          localStorage.setItem('user', JSON.stringify(updatedUser));
          setUser(updatedUser);
        }
        onClose();
        alert('Profil mis à jour avec succès');
      }
    } catch (error: any) {
      console.error('Error updating user:', error);
      alert(`Erreur: ${error.message}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-md flex items-center justify-center z-[100] p-4 transition-all duration-300">
      <div className="bg-white/95 backdrop-blur-xl rounded-[2.5rem] shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col transform transition-all animate-in fade-in zoom-in-95 duration-300 border border-white/20">
        <div className="relative px-8 pt-8 pb-6 bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{t('profile.settings')}</h2>
                <p className="text-blue-100 text-sm">{localFormData.userType === 'candidate' ? 'Optimisez votre profil candidat' : 'Gérez vos informations établissement'}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors group">
              <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
            </button>
          </div>
          <div className="flex space-x-1 p-1 bg-white/10 rounded-2xl backdrop-blur-md">
            <button onClick={() => setActiveEditTab('general')} className={`flex-1 flex items-center justify-center py-2 px-4 rounded-xl text-sm font-semibold transition-all duration-200 ${activeEditTab === 'general' ? 'bg-white text-blue-600 shadow-lg' : 'text-white hover:bg-white/10'}`}>
              <User className="w-4 h-4 mr-2" /> Informations Générales
            </button>
            {localFormData.userType === 'candidate' ? (
              <button onClick={() => setActiveEditTab('professional')} className={`flex-1 flex items-center justify-center py-2 px-4 rounded-xl text-sm font-semibold transition-all duration-200 ${activeEditTab === 'professional' ? 'bg-white text-blue-600 shadow-lg' : 'text-white hover:bg-white/10'}`}>
                <Briefcase className="w-4 h-4 mr-2" /> Expérience & Formation
              </button>
            ) : (
              <button onClick={() => setActiveEditTab('company')} className={`flex-1 flex items-center justify-center py-2 px-4 rounded-xl text-sm font-semibold transition-all duration-200 ${activeEditTab === 'company' ? 'bg-white text-blue-600 shadow-lg' : 'text-white hover:bg-white/10'}`}>
                <Building2 className="w-4 h-4 mr-2" /> Établissement
              </button>
            )}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <form onSubmit={handleSubmit} id="edit-user-form" className="space-y-8">
            {activeEditTab === 'general' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-bottom-4 duration-300">
                <div className="space-y-4">
                  <div className="form-group">
                    <label className="text-sm font-semibold text-gray-700 ml-1 mb-1.5 block">Prénom *</label>
                    <input type="text" name="firstName" value={localFormData.firstName} onChange={handleLocalChange} className="w-full pl-4 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none" required />
                  </div>
                  <div className="form-group">
                    <label className="text-sm font-semibold text-gray-700 ml-1 mb-1.5 block">Nom *</label>
                    <input type="text" name="lastName" value={localFormData.lastName} onChange={handleLocalChange} className="w-full pl-4 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none" required />
                  </div>
                  <div className="form-group">
                    <label className="text-sm font-semibold text-gray-700 ml-1 mb-1.5 block">Email *</label>
                    <input type="email" name="email" value={localFormData.email} onChange={handleLocalChange} className="w-full pl-4 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none" required />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="form-group">
                    <label className="text-sm font-semibold text-gray-700 ml-1 mb-1.5 block">Téléphone *</label>
                    <input type="tel" name="phone" value={localFormData.phone} onChange={handleLocalChange} className="w-full pl-4 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none" required />
                  </div>
                  <div className="form-group">
                    <label className="text-sm font-semibold text-gray-700 ml-1 mb-1.5 block">Adresse *</label>
                    <input type="text" name="address" value={localFormData.address} onChange={handleLocalChange} className="w-full pl-4 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none" required />
                  </div>
                  <div className="form-group">
                    <label className="text-sm font-semibold text-gray-700 ml-1 mb-1.5 block">Âge *</label>
                    <input type="number" name="age" value={localFormData.age} onChange={handleLocalChange} className="w-full pl-4 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none" required min="16" />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-center space-x-4">
                    <div className="relative inline-block">
                      <input type="checkbox" name="isActive" checked={localFormData.isActive} onChange={(e) => setLocalFormData({...localFormData, isActive: e.target.checked})} className="peer appearance-none w-12 h-6 bg-gray-200 rounded-full checked:bg-blue-600 transition-all cursor-pointer outline-none" />
                      <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-6 cursor-pointer pointer-events-none shadow-sm"></div>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-blue-900">Compte visible par les employeurs</p>
                      <p className="text-xs text-blue-600">Désactivez pour mettre votre profil en pause temporairement.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {activeEditTab === 'professional' && localFormData.userType === 'candidate' && (
              <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-group">
                    <label className="text-sm font-semibold text-gray-700 ml-1 mb-1.5 block">CIN *</label>
                    <input type="text" name="cin" value={localFormData.cin} onChange={handleLocalChange} className="w-full pl-4 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none" required />
                  </div>
                  <div className="form-group">
                    <label className="text-sm font-semibold text-gray-700 ml-1 mb-1.5 block">Expérience globale *</label>
                    <FormDropdown 
                      value={localFormData.experience}
                      onValueChange={(val) => handleLocalChange({ target: { name: 'experience', value: val } } as any)}
                      placeholder="Sélectionnez votre expérience"
                      options={experienceOptions}
                      className="py-3 px-4"
                    />
                  </div>
                </div>
                <div>
                  <h3 className="text-md font-bold text-gray-900 mb-4 flex items-center"><FileText className="w-5 h-5 mr-2 text-blue-500" /> Formation & Diplômes</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {educationOptions.map(option => (
                      <label key={option} className="group relative flex items-center p-4 bg-gray-50 border border-gray-200 rounded-2xl cursor-pointer hover:bg-white hover:shadow-md hover:border-blue-200 transition-all">
                        <input type="checkbox" name="education" value={option} checked={localFormData.education.includes(option)} onChange={handleLocalChange} className="hidden peer" />
                        <div className="w-5 h-5 border-2 border-gray-300 rounded-md peer-checked:bg-blue-500 peer-checked:border-blue-500 transition-all mr-3 flex items-center justify-center"><Check className="w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity" /></div>
                        <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-group">
                    <label className="text-sm font-semibold text-gray-700 ml-1 mb-1.5 block">Photo de profil</label>
                    <div className="mt-1 flex items-center space-x-6">
                      <div className="w-20 h-20 rounded-2xl bg-gray-100 overflow-hidden border-2 border-gray-200 flex items-center justify-center relative group">
                        {localFormData.photo ? (
                          <img 
                            src={typeof localFormData.photo === 'string' ? localFormData.photo : URL.createObjectURL(localFormData.photo)} 
                            className="w-full h-full object-cover" 
                            alt="Preview"
                          />
                        ) : currentUser?.photo ? (
                          <img 
                            src={getPhotoUrl(currentUser)!} 
                            className="w-full h-full object-cover" 
                            alt="Current"
                          />
                        ) : (
                          <Image className="w-8 h-8 text-gray-400" />
                        )}
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Image className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-2xl hover:border-blue-400 transition-colors bg-gray-50">
                          <div className="space-y-1 text-center">
                            <div className="flex text-sm text-gray-600">
                              <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                                <span>Télécharger une nouvelle photo</span>
                                <input name="photo" type="file" className="sr-only" onChange={handleLocalChange} accept="image/*" />
                              </label>
                            </div>
                            <p className="text-xs text-gray-500">PNG, JPG jusqu'à 10MB</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="text-sm font-semibold text-gray-700 ml-1 mb-1.5 block">CV (PDF)</label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-2xl hover:border-blue-400 transition-colors bg-gray-50">
                      <div className="space-y-1 text-center"><FileText className="mx-auto h-12 w-12 text-gray-400" /><div className="flex text-sm text-gray-600"><label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"><span>Télécharger un fichier</span><input name="cv" type="file" className="sr-only" onChange={handleLocalChange} accept=".pdf" /></label></div><p className="text-xs text-gray-500">PDF jusqu'à 10MB</p></div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-group">
                    <label className="text-sm font-semibold text-gray-700 ml-1 mb-1.5 block">Poste actuel / Métier</label>
                    <input
                      type="text"
                      name="currentPosition"
                      value={localFormData.currentPosition}
                      onChange={handleLocalChange}
                      className="w-full pl-4 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none"
                      placeholder="Votre poste actuel ou métier"
                    />
                  </div>

                  <div className="form-group">
                    <label className="text-sm font-semibold text-gray-700 ml-1 mb-1.5 block">Nom de l'enseigne actuelle</label>
                    <input
                      type="text"
                      name="currentCompany"
                      value={localFormData.currentCompany}
                      onChange={handleLocalChange}
                      className="w-full pl-4 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none"
                      placeholder="Nom de votre établissement actuel"
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-md font-bold text-gray-900 mb-4 flex items-center">
                    <Briefcase className="w-5 h-5 mr-2 text-blue-500" />
                    Poste(s) désiré(s)
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {positionOptions.map(option => (
                      <label key={option} className="group relative flex items-center p-4 bg-gray-50 border border-gray-200 rounded-2xl cursor-pointer hover:bg-white hover:shadow-md hover:border-blue-200 transition-all">
                        <input
                          type="checkbox"
                          name="desiredPositions"
                          value={option}
                          checked={localFormData.desiredPositions.includes(option)}
                          onChange={handleLocalChange}
                          className="hidden peer"
                        />
                        <div className="w-5 h-5 border-2 border-gray-300 rounded-md peer-checked:bg-blue-500 peer-checked:border-blue-500 transition-all mr-3 flex items-center justify-center">
                          <Check className="w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                        </div>
                        <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-md font-bold text-gray-900 mb-4 flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-blue-500" />
                    Zone(s) de travail préférée(s)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {zoneOptions.map(option => (
                      <label key={option} className="group relative flex items-center p-3 bg-gray-50 border border-gray-200 rounded-2xl cursor-pointer hover:bg-white hover:shadow-md hover:border-blue-200 transition-all">
                        <input
                          type="checkbox"
                          name="preferredZones"
                          value={option}
                          checked={localFormData.preferredZones.includes(option)}
                          onChange={handleLocalChange}
                          className="hidden peer"
                        />
                        <div className="w-5 h-5 border-2 border-gray-300 rounded-md peer-checked:bg-blue-500 peer-checked:border-blue-500 transition-all mr-3 flex items-center justify-center">
                          <Check className="w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                        </div>
                        <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-md font-bold text-gray-900 mb-4 flex items-center">
                    <Building2 className="w-5 h-5 mr-2 text-blue-500" />
                    Établissements de formation
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {trainingInstitutionOptions.map(option => (
                      <label key={option} className="group relative flex items-center p-3 bg-gray-50 border border-gray-200 rounded-2xl cursor-pointer hover:bg-white hover:shadow-md hover:border-blue-200 transition-all">
                        <input
                          type="checkbox"
                          name="trainingInstitutions"
                          value={option}
                          checked={localFormData.trainingInstitutions.includes(option)}
                          onChange={handleLocalChange}
                          className="hidden peer"
                        />
                        <div className="w-5 h-5 border-2 border-gray-300 rounded-md peer-checked:bg-blue-500 peer-checked:border-blue-500 transition-all mr-3 flex items-center justify-center">
                          <Check className="w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                        </div>
                        <span className="text-xs font-medium text-gray-700 group-hover:text-blue-600 transition-colors">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {activeEditTab === 'company' && localFormData.userType === 'employer' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-bottom-4 duration-300">
                <div className="form-group">
                  <label className="text-sm font-semibold text-gray-700 ml-1 mb-1.5 block">Nom de l'établissement *</label>
                  <input type="text" name="companyName" value={localFormData.companyName} onChange={handleLocalChange} className="w-full pl-4 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none" required />
                </div>
                <div className="form-group">
                  <label className="text-sm font-semibold text-gray-700 ml-1 mb-1.5 block">Catégorie *</label>
                  <FormDropdown 
                    value={localFormData.companyType}
                    onValueChange={(val) => handleLocalChange({ target: { name: 'companyType', value: val } } as any)}
                    placeholder="Sélectionnez une catégorie"
                    options={companyTypes.map(t => ({ value: t, label: t }))}
                    className="py-3 px-4"
                  />
                </div>
                <div className="form-group">
                  <label className="text-sm font-semibold text-gray-700 ml-1 mb-1.5 block">Type d'établissement *</label>
                  <FormDropdown 
                    value={localFormData.establishmentCategory}
                    onValueChange={(val) => handleLocalChange({ target: { name: 'establishmentCategory', value: val } } as any)}
                    placeholder="Sélectionnez un type"
                    options={establishmentCategories.map(c => ({ value: c, label: c }))}
                    className="py-3 px-4"
                  />
                </div>
                <div className="form-group">
                  <label className="text-sm font-semibold text-gray-700 ml-1 mb-1.5 block">Votre poste</label>
                  <input type="text" name="position" value={localFormData.position} onChange={handleLocalChange} className="w-full pl-4 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none" />
                </div>
              </div>
            )}
          </form>
        </div>
        <div className="p-8 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row justify-end gap-4">
          <button type="button" onClick={onClose} className="px-8 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-[1.25rem] hover:bg-gray-50 transition-all hover:shadow-md active:scale-95">Annuler</button>
          <button type="submit" form="edit-user-form" className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-[1.25rem] shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 transition-all active:scale-95 flex items-center justify-center"><Save className="w-5 h-5 mr-2" /> Enregistrer les modifications</button>
        </div>
      </div>
    </div>
  );
};

interface ViewUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  viewedUser: User | null;
  t: (key: string) => string;
  getPhotoUrl: (user: User) => string | null;
  generateCV: (user: User) => void;
}

const ViewUserModal: React.FC<ViewUserModalProps> = ({ isOpen, onClose, viewedUser, getPhotoUrl, generateCV }) => {
  if (!isOpen || !viewedUser) return null;
  const photoUrl = getPhotoUrl(viewedUser);
  return (
    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-[100] transition-opacity">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto transform transition-all animate-in zoom-in-95 duration-300">
        <div className="relative">
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-t-3xl"></div>
          <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 text-white rounded-full backdrop-blur-md transition-colors z-10"><X className="w-5 h-5" /></button>
          <div className="pt-16 px-6 md:px-10 pb-8 relative">
            <div className="flex flex-col md:flex-row gap-8 mb-8 items-center md:items-start text-center md:text-left">
              <div className="flex-shrink-0 flex flex-col items-center">
                <div className="w-32 h-32 rounded-full bg-white p-1.5 shadow-xl relative z-10">
                  <div className="w-full h-full rounded-full bg-blue-50 overflow-hidden flex items-center justify-center">
                    {photoUrl ? <img src={photoUrl} alt={`${viewedUser.firstName} ${viewedUser.lastName}`} className="w-full h-full object-cover" onError={(e) => {(e.target as HTMLImageElement).src = 'default-profile.png';}} /> : <Users className="w-12 h-12 text-blue-300" />}
                  </div>
                </div>
                {viewedUser.userType === 'candidate' && (
                  <button onClick={() => generateCV(viewedUser)} className="mt-6 flex items-center justify-center w-full px-4 py-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700 font-medium rounded-xl transition-colors"><FileText className="w-4 h-4 mr-2" /><span>Générer CV PDF</span></button>
                )}
              </div>
              <div className="flex-1 pt-4 md:pt-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{viewedUser.firstName} {viewedUser.lastName}</h2>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full capitalize">{viewedUser.userType === 'candidate' ? 'Candidat' : viewedUser.userType === 'employer' ? 'Employeur' : 'Admin'}</span>
                  <span className={`px-3 py-1 text-sm font-semibold rounded-full flex items-center ${viewedUser.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}><span className={`w-2 h-2 rounded-full mr-2 ${viewedUser.isActive ? 'bg-emerald-500' : 'bg-red-500'}`}></span>{viewedUser.isActive ? 'Actif' : 'Inactif'}</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div><h3 className="text-sm font-medium text-gray-500">Nom complet</h3><p className="mt-1 text-sm text-gray-900">{viewedUser.firstName} {viewedUser.lastName}</p></div>
                <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Contact</h3>
                  <div className="space-y-4">
                    <div><p className="text-xs text-gray-500 font-medium">Email</p><p className="text-sm font-medium text-gray-900 truncate">{viewedUser.email}</p></div>
                    {viewedUser.phone && <div><p className="text-xs text-gray-500 font-medium">Téléphone</p><p className="text-sm font-medium text-gray-900">{viewedUser.phone}</p></div>}
                    {viewedUser.address && <div><p className="text-xs text-gray-500 font-medium">Adresse</p><p className="text-sm font-medium text-gray-900">{viewedUser.address}</p></div>}
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Activité</h3>
                  <div className="space-y-4">
                    <div><p className="text-xs text-gray-500 font-medium">Inscription</p><p className="text-sm font-medium text-gray-900">{new Date(viewedUser.createdAt).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</p></div>
                    <div><p className="text-xs text-gray-500 font-medium">Dernière connexion</p><p className="text-sm font-medium text-gray-900">{viewedUser.lastLogin ? new Intl.DateTimeFormat('fr-FR', {year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'}).format(new Date(viewedUser.lastLogin)) : 'Inconnue'}</p></div>
                  </div>
                </div>
              </div>
            </div>
            {viewedUser.userType === 'candidate' && (
              <div className="mt-6 border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Informations du candidat</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {viewedUser.cin && <div><h3 className="text-sm font-medium text-gray-500">CIN</h3><p className="mt-1 text-sm text-gray-900">{viewedUser.cin}</p></div>}
                  {viewedUser.age && <div><h3 className="text-sm font-medium text-gray-500">Âge</h3><p className="mt-1 text-sm text-gray-900">{viewedUser.age} ans</p></div>}
                  {viewedUser.experience && <div><h3 className="text-sm font-medium text-gray-500">Expérience</h3><p className="mt-1 text-sm text-gray-900">{viewedUser.experience}</p></div>}
                  {viewedUser.education && viewedUser.education.length > 0 && <div><h3 className="text-sm font-medium text-gray-500">Formation</h3><div className="mt-1 text-sm text-gray-900">{viewedUser.education.join(', ')}</div></div>}
                  {viewedUser.currentPosition && <div><h3 className="text-sm font-medium text-gray-500">Poste actuel</h3><p className="mt-1 text-sm text-gray-900">{viewedUser.currentPosition}</p></div>}
                  {viewedUser.currentCompany && <div><h3 className="text-sm font-medium text-gray-500">Entreprise actuelle</h3><p className="mt-1 text-sm text-gray-900">{viewedUser.currentCompany}</p></div>}
                  {viewedUser.desiredPositions && viewedUser.desiredPositions.length > 0 && <div><h3 className="text-sm font-medium text-gray-500">Postes recherchés</h3><div className="mt-1 text-sm text-gray-900">{viewedUser.desiredPositions.join(', ')}</div></div>}
                  {viewedUser.preferredZones && viewedUser.preferredZones.length > 0 && <div><h3 className="text-sm font-medium text-gray-500">Zones préférées</h3><div className="mt-1 text-sm text-gray-900">{viewedUser.preferredZones.join(', ')}</div></div>}
                  {viewedUser.trainingInstitutions && viewedUser.trainingInstitutions.length > 0 && <div><h3 className="text-sm font-medium text-gray-500">Établissements de formation</h3><div className="mt-1 text-sm text-gray-900">{viewedUser.trainingInstitutions.join(', ')}</div></div>}
                </div>
              </div>
            )}
            {viewedUser.userType === 'employer' && (
              <div className="mt-6 border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Informations de l'employeur</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {viewedUser.companyName && <div><h3 className="text-sm font-medium text-gray-500">Nom de l'entreprise</h3><p className="mt-1 text-sm text-gray-900">{viewedUser.companyName}</p></div>}
                  {viewedUser.companyType && <div><h3 className="text-sm font-medium text-gray-500">Type d'entreprise</h3><p className="mt-1 text-sm text-gray-900">{viewedUser.companyType}</p></div>}
                  {viewedUser.establishmentCategory && <div><h3 className="text-sm font-medium text-gray-500">Catégorie d'établissement</h3><p className="mt-1 text-sm text-gray-900">{viewedUser.establishmentCategory}</p></div>}
                  {viewedUser.position && <div><h3 className="text-sm font-medium text-gray-500">Poste dans l'entreprise</h3><p className="mt-1 text-sm text-gray-900">{viewedUser.position}</p></div>}
                </div>
              </div>
            )}
            <div className="mt-8 flex justify-end border-t border-gray-100 pt-6">
              <button onClick={onClose} className="px-6 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors">Fermer</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Header = () => {
  const { t, language, setLanguage } = useLanguage();
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewedUser, setViewedUser] = useState<User | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  const handleViewUser = (userData: User) => {
    setViewedUser(userData);
    setViewModalOpen(true);
  };

  const handleEditUser = (userData: User) => {
    setCurrentUser(userData);
    setEditModalOpen(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsDropdownOpen(false);
    navigate('/');
  };

  const getDashboardLink = () => {
    if (!user) return '/login';
    switch (user.userType) {
      case 'admin': return '/admin/dashboard';
      case 'candidate': return '/candidate/dashboard';
      case 'employer': return '/employer/dashboard';
      default: return '/dashboard';
    }
  };

  const getUserTypeLabel = () => {
    switch (user?.userType) {
      case 'admin': return t('admin');
      case 'candidate': return t('candidate');
      case 'employer': return t('employer');
      default: return '';
    }
  };

  const getPhotoUrl = (userData: User) => {
    if (userData.photo) {
      if (typeof userData.photo === 'string') {
        if (userData.photo.startsWith('http') || userData.photo.startsWith('data:')) {
          return userData.photo;
        }
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        // Normalize backslashes (Windows) to forward slashes
        const normalizedPath = userData.photo.replace(/\\/g, '/');
        // If it's a relative path to uploads, serve it from the root (public folder)
        if (normalizedPath.includes('uploads')) {
          return normalizedPath.startsWith('/') ? normalizedPath : `/${normalizedPath}`;
        }
        // Fallback for other cases
        const photoPath = normalizedPath.startsWith('/') ? normalizedPath.slice(1) : normalizedPath;
        return `${apiUrl.replace('/api', '')}/${photoPath}`;
      }
      try {
        return URL.createObjectURL(userData.photo as any);
      } catch {
        return null;
      }
    }
    return null;
  };

  const navigation = [
    { name: t('nav.home'), href: '/' },
    { name: t('nav.concept'), href: '/concept' },
    { name: t('nav.professionals'), href: '/professionals' },
    { name: t('nav.candidates'), href: '/candidates' },
    { name: t('nav.contact'), href: '/contact' },
  ];

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (token && userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, [location]);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center group">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <span className="text-white font-black text-xl">Y</span>
              </div>
              <span className="ml-3 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 hidden sm:block">
                Yalla Extra
              </span>
            </Link>

            <nav className="hidden md:ml-10 md:flex md:space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`font-medium transition-colors duration-200 ${
                    isActive(item.href)
                      ? 'text-blue-600 border-b-2 border-blue-600 pb-1'
                      : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden lg:flex items-center space-x-2 mr-4">
              <button 
                onClick={() => setLanguage('fr')} 
                className={`px-2 py-1 text-xs font-bold rounded transition-colors ${language === 'fr' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-100'}`}
              >
                FR
              </button>
              <button 
                onClick={() => setLanguage('ar')} 
                className={`px-2 py-1 text-xs font-bold rounded transition-colors ${language === 'ar' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-100'}`}
              >
                AR
              </button>
            </div>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-3 p-1.5 rounded-full hover:bg-gray-100 transition-all border border-transparent hover:border-gray-200 group"
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
                    {getPhotoUrl(user) ? (
                      <img src={getPhotoUrl(user)!} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-5 h-5 text-blue-600" />
                    )}
                  </div>
                  <div className="hidden md:block text-left pr-2">
                    <p className="text-sm font-bold text-gray-900 leading-none mb-0.5">{user.firstName}</p>
                    <p className="text-[10px] font-semibold text-blue-600 uppercase tracking-wider leading-none">
                      {getUserTypeLabel()}
                    </p>
                  </div>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-3 border-b border-gray-50 mb-2">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{t('auth.account')}</p>
                    </div>
                    
                    <Link
                      to={getDashboardLink()}
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 transition-colors group"
                    >
                      <Globe className="w-4 h-4 mr-3 text-gray-400 group-hover:text-blue-600" />
                      <span className="font-medium">{t('profile.dashboard')}</span>
                    </Link>

                    <button
                      onClick={() => {
                        handleViewUser(user);
                        setIsDropdownOpen(false);
                      }}
                      className="w-full flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 transition-colors group"
                    >
                      <Eye className="w-4 h-4 mr-3 text-gray-400 group-hover:text-blue-600" />
                      <span className="font-medium">{t('profile.publicView')}</span>
                    </button>

                    <button
                      onClick={() => {
                        handleEditUser(user);
                        setIsDropdownOpen(false);
                      }}
                      className="w-full flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 transition-colors group"
                    >
                      <Settings className="w-4 h-4 mr-3 text-gray-400 group-hover:text-blue-600" />
                      <span className="font-medium">{t('profile.settings')}</span>
                    </button>

                    <div className="border-t border-gray-50 mt-2 pt-2">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors group"
                      >
                        <LogOut className="w-4 h-4 mr-3 text-red-400 group-hover:text-red-600" />
                        <span className="font-bold">{t('auth.logout')}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="hidden sm:flex items-center px-4 py-2 text-sm font-bold text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  {t('auth.login')}
                </Link>
                <Link
                  to="/register"
                  className="flex items-center px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-sm font-bold rounded-full shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 hover:-translate-y-0.5 transition-all"
                >
                  {t('auth.register')}
                </Link>
              </div>
            )}

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 p-4 animate-in slide-in-from-top duration-300">
          <nav className="flex flex-col space-y-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={`text-lg font-bold px-4 py-2 rounded-xl ${
                  isActive(item.href) ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {item.name}
              </Link>
            ))}
            {!user && (
              <div className="pt-4 border-t border-gray-100 space-y-3">
                <Link to="/login" onClick={() => setIsMenuOpen(false)} className="flex items-center px-4 py-2 font-bold text-gray-700">
                  <LogIn className="w-5 h-5 mr-3" /> {t('auth.login')}
                </Link>
                <Link to="/register" onClick={() => setIsMenuOpen(false)} className="flex items-center px-4 py-2 font-bold text-blue-600 bg-blue-50 rounded-xl">
                  {t('auth.register')}
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}

      {editModalOpen && (
        <EditUserModal 
          isOpen={editModalOpen} 
          onClose={() => setEditModalOpen(false)} 
          currentUser={currentUser} 
          t={t} 
          setUser={setUser}
          getPhotoUrl={getPhotoUrl}
        />
      )}
      {viewModalOpen && (
        <ViewUserModal 
          isOpen={viewModalOpen} 
          onClose={() => setViewModalOpen(false)} 
          viewedUser={viewedUser} 
          t={t} 
          getPhotoUrl={getPhotoUrl}
          generateCV={generateCV}
        />
      )}
    </header>
  );
};

export default Header;