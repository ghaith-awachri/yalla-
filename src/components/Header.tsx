import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Menu, 
  X, 
  User, 
  LogIn, 
  LogOut, 
  Settings, 
  Edit, 
  Eye, 
  Download, 
  FileText, 
  Users 
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export const generateCV = (userData) => {
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
        <p>${userData.email || ''}</p>
        ${userData.phone ? `<p>${userData.phone}</p>` : ''}
        ${userData.address ? `<p>${userData.address}</p>` : ''}

        <!-- Formation -->
        ${userData.education?.length > 0 ? `
          <h2 style="font-size: 16px; border-bottom: 1px solid #bdc3c7; margin-top: 20px; padding-bottom: 5px; width: 100%;">Formation</h2>
          <ul style="padding-left: 15px; margin-top: 5px;">
            ${userData.education.map(edu => `<li style="margin-bottom: 5px;">${edu}</li>`).join('')}
          </ul>
        ` : ''}

        <!-- Établissements de formation -->
        ${userData.trainingInstitutions?.length > 0 ? `
          <h2 style="font-size: 16px; border-bottom: 1px solid #bdc3c7; margin-top: 20px; padding-bottom: 5px; width: 100%;">Établissements</h2>
          <ul style="padding-left: 15px; margin-top: 5px;">
            ${userData.trainingInstitutions.map(inst => `<li style="margin-bottom: 5px;">${inst}</li>`).join('')}
          </ul>
        ` : ''}
      </div>

      <!-- Colonne droite -->
      <div style="flex: 1; padding: 25px;">
        <!-- Entreprise actuelle -->
        ${userData.currentCompany ? `
          <h2 style="color: #2c3e50; border-bottom: 2px solid #2c3e50; padding-bottom: 5px;">Entreprise Actuelle</h2>
          <p><strong>${userData.currentPosition || ''}</strong> chez ${userData.currentCompany}</p>
        ` : ''}

        <!-- Expérience -->
        ${userData.experience ? `
          <h2 style="color: #2c3e50; border-bottom: 2px solid #2c3e50; margin-top: 20px; padding-bottom: 5px;">Expérience</h2>
          <p>${userData.experience}</p>
        ` : ''}

        <!-- Zones préférées -->
        ${userData.preferredZones?.length > 0 ? `
          <h2 style="color: #2c3e50; border-bottom: 2px solid #2c3e50; margin-top: 20px; padding-bottom: 5px;">Zones Préférées</h2>
          <p>${userData.preferredZones.join(', ')}</p>
        ` : ''}

        <!-- Postes recherchés -->
        ${userData.desiredPositions?.length > 0 ? `
          <h2 style="color: #2c3e50; border-bottom: 2px solid #2c3e50; margin-top: 20px; padding-bottom: 5px;">Postes Recherchés</h2>
          <p>${userData.desiredPositions.join(', ')}</p>
        ` : ''}
      </div>
    </div>
  `;

  document.body.appendChild(cvElement);

  html2canvas(cvElement).then(canvas => {
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

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


const Header = () => {
    const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewedUser, setViewedUser] = useState(null);
  const handleViewUser = (user) => {
  setViewedUser(user);
  setViewModalOpen(true);
};
    const [loading, setLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [formData, setFormData] = useState({
      firstName: '',
      lastName: '',
      email: '',
      userType: '',
      isActive: true
    });
    const [itemsPerPage, setItemsPerPage] = useState(10);
const [userFilters, setUserFilters] = useState({
  search: '',
  userType: '',
  isActive: undefined,
  education: '',
  age: '',
  desiredPosition: '',
  preferredZone: '',
  dateFrom: '',
  dateTo: ''
});
const [users, setUsers] = useState([]);
const [stats, setStats] = useState({
  users: {
    total: 0,
    candidates: 0,
    employers: 0
  }
});
    const fetchUsers = async (page = 1) => {
  setLoading(true);
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: itemsPerPage.toString(),
      ...(userFilters.search && { search: userFilters.search }),
      ...(userFilters.userType && { userType: userFilters.userType }),
      ...(userFilters.isActive !== undefined && { isActive: String(userFilters.isActive) }),
      ...(userFilters.education && { education: userFilters.education }),
      ...(userFilters.age && { age: userFilters.age.toString() }),
      ...(userFilters.desiredPosition && { desiredPosition: userFilters.desiredPosition }),
      ...(userFilters.preferredZone && { preferredZone: userFilters.preferredZone }),
      ...(userFilters.dateFrom && { dateFrom: new Date(userFilters.dateFrom).toISOString() }),
      ...(userFilters.dateTo && { dateTo: new Date(userFilters.dateTo).toISOString() }),
    });

    const response = await fetch(`http://localhost:5000/api/users?${params.toString()}`);
    const data = await response.json();

    setUsers(data.users);
    setStats(prev => ({
      ...prev,
      users: {
        ...prev.users,
        total: data.total,
        candidates: data.userTypeCounts?.candidate || 0,
        employers: data.userTypeCounts?.employer || 0,
      }
    }));
  } catch (error) {
    console.error('Error fetching users:', error);
    alert(`Error: ${error.message}`);
  } finally {
    setLoading(false);
  }
};

      const handleEditUser = (user) => {
    setCurrentUser(user);
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      userType: user.userType,
      isActive: user.isActive
    });
    setEditModalOpen(true);
  };
  const EditUserModal = () => {
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
      // Employer fields
      companyName: '',
      companyType: '',
      position: '',
      establishmentCategory: '',
      // Files
      photo: null as File | null,
      cv: null as File | null,
      isActive: true
    });
  
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
  
    const experienceOptions = [
      { value: 'less_than_1', label: 'Moins d\'une année' },
      { value: '1_to_3', label: 'Entre 1 an et 3 ans' },
      { value: '3_to_5', label: 'Entre 3 ans et 5 ans' },
      { value: '5_to_10', label: 'Entre 5 ans et 10 ans' },
      { value: 'more_than_10', label: 'Plus de 10 ans' },
      { value: 'other', label: 'Autres' }
    ];
  
  
  
    useEffect(() => {
      if (currentUser) {
        setLocalFormData({
          firstName: currentUser.firstName || '',
          lastName: currentUser.lastName || '',
          email: currentUser.email || '',
          phone: currentUser.phone || '',
          userType: currentUser.userType || 'candidate',
          address: currentUser.address || '',
          age: currentUser.age || '',
          cin: currentUser.cin || '',
          experience: currentUser.experience || '',
          education: currentUser.education || [],
          currentPosition: currentUser.currentPosition || '',
          currentCompany: currentUser.currentCompany || '',
          desiredPositions: currentUser.desiredPositions || [],
          preferredZones: currentUser.preferredZones || [],
          trainingInstitutions: currentUser.trainingInstitutions || [],
          // Employer fields
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
  
  
    const handleLocalChange = (e) => {
      const { name, value, type, checked } = e.target;
      
      if (type === 'checkbox') {
        const isChecked = checked;
        let updatedArray = [...localFormData[name]];
        
        if (isChecked) {
          updatedArray.push(value);
        } else {
          updatedArray = updatedArray.filter(item => item !== value);
        }
        
        setLocalFormData({
          ...localFormData,
          [name]: updatedArray
        });
      } else if (type === 'file') {
        const fileInput = e.target as HTMLInputElement;
        setLocalFormData({
          ...localFormData,
          [name]: fileInput.files ? fileInput.files[0] : null
        });
      } else {
        setLocalFormData({
          ...localFormData,
          [name]: value
        });
      }
    };
  
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const baseUrl = import.meta.env.VITE_API_URL;
        const formDataToSend = new FormData();
  
        // Common fields
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
  
        const response = await fetch(`${baseUrl}/users/${currentUser._id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: formDataToSend
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to update user');
        }
  
        const data = await response.json();
        
        if (data.success) {
          fetchUsers();
          setEditModalOpen(false);
          alert('User updated successfully');
        }
      } catch (error) {
        console.error('Error updating user:', error);
        alert(`Error: ${error.message}`);
      }
    };
  
    if (!editModalOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {localFormData.userType === 'candidate' ? 'Modifier le candidat' : 'Modifier l\'employeur'}
              </h2>
              <button 
                onClick={() => setEditModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
  
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="form-group">
                  <label className="form-label">Prénom *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={localFormData.firstName}
                    onChange={handleLocalChange}
                    className="form-input"
                    required
                  />
                </div>
  
                <div className="form-group">
                  <label className="form-label">Nom *</label>
                  <input
                    type="text"
                    name="lastName"
                    value={localFormData.lastName}
                    onChange={handleLocalChange}
                    className="form-input"
                    required
                  />
                </div>
  
                <div className="form-group">
                  <label className="form-label">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={localFormData.email}
                    onChange={handleLocalChange}
                    className="form-input"
                    required
                  />
                </div>
  
                <div className="form-group">
                  <label className="form-label">Téléphone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={localFormData.phone}
                    onChange={handleLocalChange}
                    className="form-input"
                    required
                  />
                </div>
  
                <div className="form-group">
                  <label className="form-label">Adresse *</label>
                  <input
                    type="text"
                    name="address"
                    value={localFormData.address}
                    onChange={handleLocalChange}
                    className="form-input"
                    required
                  />
                </div>
  
                <div className="form-group">
                  <label className="form-label">Âge *</label>
                  <input
                    type="number"
                    name="age"
                    value={localFormData.age}
                    onChange={handleLocalChange}
                    className="form-input"
                    required
                    min="16"
                    max="99"
                  />
                </div>
  
                {localFormData.userType === 'candidate' && (
                  <>
                    <div className="form-group">
                      <label className="form-label">CIN *</label>
                      <input
                        type="text"
                        name="cin"
                        value={localFormData.cin}
                        onChange={handleLocalChange}
                        className="form-input"
                        required
                      />
                    </div>
  
                    <div className="form-group">
                      <label className="form-label">Expérience *</label>
                      <select
                        name="experience"
                        value={localFormData.experience}
                        onChange={handleLocalChange}
                        className="form-select"
                        required
                      >
                        <option value="">Sélectionnez votre expérience</option>
                        {experienceOptions.map(option => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>
                  </>
                )}
  
                {localFormData.userType === 'employer' && (
                  <>
                    <div className="form-group">
                      <label className="form-label">Nom de l'établissement *</label>
                      <input
                        type="text"
                        name="companyName"
                        value={localFormData.companyName}
                        onChange={handleLocalChange}
                        className="form-input"
                        required
                      />
                    </div>
  
                    <div className="form-group">
                      <label className="form-label">Catégorie d'établissement *</label>
                      <select
                        name="companyType"
                        value={localFormData.companyType}
                        onChange={handleLocalChange}
                        className="form-select"
                        required
                      >
                        <option value="">Sélectionnez une catégorie</option>
                        {companyTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
  
                    <div className="form-group">
                      <label className="form-label">Type d'établissement *</label>
                      <select
                        name="establishmentCategory"
                        value={localFormData.establishmentCategory}
                        onChange={handleLocalChange}
                        className="form-select"
                        required
                      >
                        <option value="">Sélectionnez un type</option>
                        {establishmentCategories.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
  
                    <div className="form-group">
                      <label className="form-label">Votre poste</label>
                      <input
                        type="text"
                        name="position"
                        value={localFormData.position}
                        onChange={handleLocalChange}
                        className="form-input"
                      />
                    </div>
                  </>
                )}
              </div>
  
              {localFormData.userType === 'candidate' && (
                <>
                  <div className="form-group mb-6">
                    <label className="form-label">Formation/diplôme *</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {educationOptions.map(option => (
                        <div key={option} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`education-${option}`}
                            name="education"
                            value={option}
                            checked={localFormData.education.includes(option)}
                            onChange={handleLocalChange}
                            className="form-checkbox"
                          />
                          <label htmlFor={`education-${option}`} className="ml-2 text-sm">{option}</label>
                        </div>
                      ))}
                    </div>
                  </div>
  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="form-group">
                      <label className="form-label">Poste actuel</label>
                      <input
                        type="text"
                        name="currentPosition"
                        value={localFormData.currentPosition}
                        onChange={handleLocalChange}
                        className="form-input"
                      />
                    </div>
  
                    <div className="form-group">
                      <label className="form-label">Établissement actuel</label>
                      <input
                        type="text"
                        name="currentCompany"
                        value={localFormData.currentCompany}
                        onChange={handleLocalChange}
                        className="form-input"
                      />
                    </div>
                  </div>
  
                  <div className="form-group mb-6">
                    <label className="form-label">Poste(s) désiré(s)</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {positionOptions.map(option => (
                        <div key={option} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`desiredPositions-${option}`}
                            name="desiredPositions"
                            value={option}
                            checked={localFormData.desiredPositions.includes(option)}
                            onChange={handleLocalChange}
                            className="form-checkbox"
                          />
                          <label htmlFor={`desiredPositions-${option}`} className="ml-2 text-sm">{option}</label>
                        </div>
                      ))}
                    </div>
                  </div>
  
                  <div className="form-group mb-6">
                    <label className="form-label">Zone(s) de travail préférée(s)</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {zoneOptions.map(option => (
                        <div key={option} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`preferredZones-${option}`}
                            name="preferredZones"
                            value={option}
                            checked={localFormData.preferredZones.includes(option)}
                            onChange={handleLocalChange}
                            className="form-checkbox"
                          />
                          <label htmlFor={`preferredZones-${option}`} className="ml-2 text-sm">{option}</label>
                        </div>
                      ))}
                    </div>
                  </div>
  
                  <div className="form-group mb-6">
                    <label className="form-label">Établissements de formation</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {trainingInstitutionOptions.map(option => (
                        <div key={option} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`trainingInstitutions-${option}`}
                            name="trainingInstitutions"
                            value={option}
                            checked={localFormData.trainingInstitutions.includes(option)}
                            onChange={handleLocalChange}
                            className="form-checkbox"
                          />
                          <label htmlFor={`trainingInstitutions-${option}`} className="ml-2 text-sm">{option}</label>
                        </div>
                      ))}
                    </div>
                  </div>
  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="form-group">
                      <label className="form-label">Photo de profil</label>
                      <input
                        type="file"
                        name="photo"
                        onChange={handleLocalChange}
                        className="form-input"
                        accept="image/*"
                      />
                    </div>
  
                    <div className="form-group">
                      <label className="form-label">CV</label>
                      <input
                        type="file"
                        name="cv"
                        onChange={handleLocalChange}
                        className="form-input"
                        accept=".pdf,.doc,.docx"
                      />
                    </div>
                  </div>
                </>
              )}
  
              <div className="form-group mb-6">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={localFormData.isActive}
                    onChange={(e) => setLocalFormData({...localFormData, isActive: e.target.checked})}
                    className="form-checkbox"
                  />
                  <label className="ml-2">Compte actif</label>
                </div>
              </div>
  
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Enregistrer les modifications
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };
  

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
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
      case 'admin':
        return '/admin/dashboard';
      case 'candidate':
        return '/candidate/dashboard';
      case 'employer':
        return '/employer/dashboard';
      default:
        return '/dashboard';
    }
  };

  const getUserDisplayName = () => {
    if (!user) return '';
    
    if (user.userType === 'employer' && user.companyName) {
      return user.firstName;
    }
    
    return `${user.firstName} ${user.lastName}`;
  };

  const getUserTypeLabel = () => {
    switch (user?.userType) {
      case 'admin':
        return 'Administrateur';
      case 'candidate':
        return 'Candidat';
      case 'employer':
        return 'Employeur';
      default:
        return '';
    }
  };

  const navigation = [
    { name: 'Accueil', href: '/' },
    { name: 'Le Concept', href: '/concept' },
    { name: 'Pour les Professionnels', href: '/professionals' },
    { name: 'Pour les Candidats', href: '/candidates' },
    { name: 'Contact', href: '/contact' },
  ];
      const getPhotoUrl = (user) => {
  if (user.photo) {
    if (typeof user.photo === 'string') {
      return user.photo.startsWith('http') ? user.photo : `${import.meta.env.VITE_API_URL}/${user.photo}`;
    }
    return URL.createObjectURL(user.photo);
  }
  return null;
};
  const ViewUserModal = () => {
  if (!viewModalOpen || !viewedUser) return null;

  const photoUrl = getPhotoUrl(viewedUser);

const handleDownloadCV = (user: User) => {
  if (!user.cv) {
    console.error("Aucun CV disponible pour ce candidat");
    return;
  }

  try {
    // Créer l'URL du fichier
    const cvUrl = user.cv.startsWith('http') 
      ? user.cv 
      : `${import.meta.env.VITE_API_URL}${user.cv}`;
    
    // Créer un lien temporaire
    const link = document.createElement('a');
    link.href = cvUrl;
    link.download = `CV_${user.firstName}_${user.lastName}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Erreur lors du téléchargement:", error);
    alert("Échec du téléchargement du CV");
  }
};

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Détails de l'utilisateur
            </h2>
            <button 
              onClick={() => setViewModalOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-6 mb-6">
            {/* Photo de profil */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 rounded-full bg-gray-200 overflow-hidden border-2 border-gray-300">
                {photoUrl ? (
                  <img 
                    src={viewedUser.photo} 
                    alt={`${viewedUser.firstName} ${viewedUser.lastName}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'default-profile.png';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <Users className="w-16 h-16" />
                  </div>
                )}
              </div>
                            

              {viewedUser.userType === 'candidate' && (
  <button 
    onClick={() => generateCV(viewedUser)}
    className="mt-2 flex items-center justify-center w-full text-green-600 hover:text-green-900"
  >
    <FileText className="w-5 h-5 mr-1" />
    <span>Générer CV PDF</span>
  </button>
)}
            </div>

            {/* Informations principales */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Nom complet</h3>
                  <p className="mt-1 text-sm text-gray-900">
                    {viewedUser.firstName} {viewedUser.lastName}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Email</h3>
                  <p className="mt-1 text-sm text-gray-900">{viewedUser.email}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Type d'utilisateur</h3>
                  <p className="mt-1 text-sm text-gray-900 capitalize">
                    {viewedUser.userType === 'candidate' ? 'Candidat' : 
                     viewedUser.userType === 'employer' ? 'Employeur' : 'Admin'}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Statut</h3>
                  <p className={`mt-1 text-sm ${viewedUser.isActive ? 'text-green-600' : 'text-red-600'}`}>
                    {viewedUser.isActive ? 'Actif' : 'Inactif'}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Date d'inscription</h3>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(viewedUser.createdAt).toLocaleDateString()}
                  </p>
                </div>
                
             <div>
  <h3 className="text-sm font-medium text-gray-500">Dernière connexion</h3>
  <p className="mt-1 text-sm text-gray-900">
    {viewedUser.lastLogin 
      ? new Intl.DateTimeFormat('fr-FR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }).format(new Date(viewedUser.lastLogin)) 
      : 'Inconnue'}
  </p>
</div>
                
                {viewedUser.phone && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Téléphone</h3>
                    <p className="mt-1 text-sm text-gray-900">{viewedUser.phone}</p>
                  </div>
                )}
                
                {viewedUser.address && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Adresse</h3>
                    <p className="mt-1 text-sm text-gray-900">{viewedUser.address}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {viewedUser.userType === 'candidate' && (
            <div className="mt-6 border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Informations du candidat</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {viewedUser.cin && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">CIN</h3>
                    <p className="mt-1 text-sm text-gray-900">{viewedUser.cin}</p>
                  </div>
                )}
                
                {viewedUser.age && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Âge</h3>
                    <p className="mt-1 text-sm text-gray-900">{viewedUser.age} ans</p>
                  </div>
                )}
                
                {viewedUser.experience && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Expérience</h3>
                    <p className="mt-1 text-sm text-gray-900">{viewedUser.experience}</p>
                  </div>
                )}
                
                {viewedUser.education?.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Formation</h3>
                    <div className="mt-1 text-sm text-gray-900">
                      {viewedUser.education.join(', ')}
                    </div>
                  </div>
                )}
                
                {viewedUser.currentPosition && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Poste actuel</h3>
                    <p className="mt-1 text-sm text-gray-900">{viewedUser.currentPosition}</p>
                  </div>
                )}
                
                {viewedUser.currentCompany && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Entreprise actuelle</h3>
                    <p className="mt-1 text-sm text-gray-900">{viewedUser.currentCompany}</p>
                  </div>
                )}
                
                {viewedUser.desiredPositions?.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Postes recherchés</h3>
                    <div className="mt-1 text-sm text-gray-900">
                      {viewedUser.desiredPositions.join(', ')}
                    </div>
                  </div>
                )}
                
                {viewedUser.preferredZones?.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Zones préférées</h3>
                    <div className="mt-1 text-sm text-gray-900">
                      {viewedUser.preferredZones.join(', ')}
                    </div>
                  </div>
                )}
                
                {viewedUser.trainingInstitutions?.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Établissements de formation</h3>
                    <div className="mt-1 text-sm text-gray-900">
                      {viewedUser.trainingInstitutions.join(', ')}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {viewedUser.userType === 'employer' && (
            <div className="mt-6 border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Informations de l'employeur</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {viewedUser.companyName && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Nom de l'entreprise</h3>
                    <p className="mt-1 text-sm text-gray-900">{viewedUser.companyName}</p>
                  </div>
                )}
                
                {viewedUser.companyType && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Type d'entreprise</h3>
                    <p className="mt-1 text-sm text-gray-900">{viewedUser.companyType}</p>
                  </div>
                )}
                
                {viewedUser.establishmentCategory && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Catégorie d'établissement</h3>
                    <p className="mt-1 text-sm text-gray-900">{viewedUser.establishmentCategory}</p>
                  </div>
                )}
                
                {viewedUser.position && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Poste dans l'entreprise</h3>
                    <p className="mt-1 text-sm text-gray-900">{viewedUser.position}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <button
              onClick={() => setViewModalOpen(false)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <div className="text-2xl font-bold text-primary-600">
              YALLA EXTRA
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`font-medium transition-colors duration-200 ${
                  isActive(item.href)
                    ? 'text-primary-600 border-b-2 border-primary-600 pb-1'
                    : 'text-gray-700 hover:text-primary-600'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Auth Section - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {user.photo ? (
                    <img 
                      src={user.photo} 
                      alt="Photo de profil"
                      className="w-8 h-8 rounded-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '';
                        (e.target as HTMLImageElement).className = 'w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center';
                      }}
                    />
                  ) : (
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-primary-600" />
                    </div>
                  )}
                  <div className="text-left">
                    <div className="text-sm font-medium text-gray-900">{user.firstName}</div>
                    <div className="text-xs text-gray-500">{getUserTypeLabel()}</div>
                  </div>
                </button>

                {isDropdownOpen && (
<div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
  {/* Tableau de bord */}
  <Link
    to={getDashboardLink()}
    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
    onClick={() => setIsDropdownOpen(false)}
  >
    <User className="w-4 h-4 mr-3" />
    Tableau de bord
  </Link>

  {/* Paramètres */}
  <button
    onClick={() => handleEditUser(user)}
    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left"
  >
    <Settings className="w-4 h-4 mr-3" />
    Paramètres
  </button>

  {/* Voir utilisateur */}
  <button
    onClick={() => handleViewUser(user)}
    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left"
  >
    <Eye className="w-4 h-4 mr-3 text-blue-600" />
    Voir profil
  </button>

  <hr className="my-2 border-gray-200" />

  {/* Déconnexion */}
  <button
    onClick={handleLogout}
    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left"
  >
    <LogOut className="w-4 h-4 mr-3" />
    Se déconnecter
  </button>
</div>

                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center px-4 py-2 text-gray-700 hover:text-primary-600 transition-colors duration-200"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className="flex items-center px-6 py-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors duration-200"
                >
                  <User className="w-4 h-4 mr-2" />
                  S'inscrire
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-500 hover:text-primary-600 hover:bg-gray-50"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`font-medium py-2 px-4 rounded-md transition-colors duration-200 ${
                    isActive(item.href)
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              <div className="border-t border-gray-200 pt-4">
                {user ? (
                  <div className="space-y-2">
                    <div className="flex items-center px-4 py-2">
                      {user.photo ? (
                        <img 
                          src={user.photo} 
                          alt="Photo de profil"
                          className="w-8 h-8 rounded-full object-cover mr-3"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '';
                            (e.target as HTMLImageElement).className = 'w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3';
                          }}
                        />
                      ) : (
                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                          <User className="w-4 h-4 text-primary-600" />
                        </div>
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900">{user.firstName}</div>
                        <div className="text-xs text-gray-500">{getUserTypeLabel()}</div>
                      </div>
                    </div>
                    <Link
                      to={getDashboardLink()}
                      className="flex items-center px-4 py-2 text-gray-700 hover:text-primary-600 rounded-md hover:bg-gray-50 transition-colors duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="w-4 h-4 mr-2" />
                      Tableau de bord
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Se déconnecter
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <Link
                      to="/login"
                      className="flex items-center px-4 py-2 text-gray-700 hover:text-primary-600 rounded-md hover:bg-gray-50 transition-colors duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <LogIn className="w-4 h-4 mr-2" />
                      Connexion
                    </Link>
                    <Link
                      to="/register"
                      className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="w-4 h-4 mr-2" />
                      S'inscrire
                    </Link>
                  </div>
                )}
              </div>
          
            </div>
          </div>
        )}
      </div>
      {editModalOpen && <EditUserModal />}
       {viewModalOpen && <ViewUserModal />}
    </header>
  );
};

export default Header;