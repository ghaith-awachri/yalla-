import React, { useState, useEffect } from 'react';
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

import { 
  Users, Building2, FileText, BarChart3, Settings, Shield,
  TrendingUp, AlertCircle, CheckCircle, Search, Filter,
  Download, Eye, Edit, Trash2, UserCheck, UserX, Plus,
  RefreshCw, ChevronLeft, ChevronRight, X, Loader2 // Add Loader2 here
} from 'lucide-react';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [loadingJobs, setLoadingJobs] = useState(false);
  const [jobsError, setJobsError] = useState('');
  const [jobs, setJobs] = useState([]);
  const [jobPagination, setJobPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1
  });
// Ajouter l'état des filtres
const [jobFilters, setJobFilters] = useState({
  status: '',
  type: '',
  search: '',
  minSalary: '',
  maxSalary: '',
  location: '',
  dateFrom: '',
  dateTo: ''
});

// Mettre à jour la fonction fetchJobs
const fetchJobs = async (page = 1) => {
  setLoadingJobs(true);
  setJobsError('');
  
  try {
    const userStr = localStorage.getItem('user');
    if (!userStr) throw new Error('Utilisateur non connecté');
    
    const userData = JSON.parse(userStr);
    if (!userData?._id) throw new Error('ID utilisateur manquant');

    const url = new URL(`http://localhost:5000/api/jobs`);
    
    // Paramètres de base
    url.searchParams.append('page', page.toString());
    url.searchParams.append('limit', jobPagination.limit.toString());
    
    
    // Ajouter tous les filtres
    Object.entries(jobFilters).forEach(([key, value]) => {
      if (value) url.searchParams.append(key, value);
    });

    const response = await fetch(url.toString(), {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    setJobs(data.jobs);
    setJobPagination(prev => ({
      ...prev,
      page,
      total: data.total,
      pages: Math.ceil(data.total / jobPagination.limit)
    }));
  } catch (err) {
    setJobsError('Failed to load jobs');
    console.error('Fetch error:', err);
  } finally {
    setLoadingJobs(false);
  }
};

// Gestionnaire de changement de filtre
const handleFilterChange = (e) => {
  const { name, value } = e.target;
  setJobFilters(prev => ({
    ...prev,
    [name]: value
  }));
};

// Réinitialiser les filtres
const resetFilters = () => {
  setJobFilters({
    status: '',
    type: '',
    search: '',
    minSalary: '',
    maxSalary: '',
    location: '',
    dateFrom: '',
    dateTo: ''
  });
};

  // Handle job actions (moved to top level)
const handleJobAction = async (jobId, action) => {
  try {
    let response;
    
    if (action === 'delete') {
      // Ajout d'une confirmation avant suppression
      const confirmDelete = window.confirm('Êtes-vous sûr de vouloir supprimer cette offre ? Cette action est irréversible.');
      
      if (!confirmDelete) {
        return; // Annuler si l'utilisateur ne confirme pas
      }

      response = await fetch(`http://localhost:5000/api/jobs/${jobId}`, {
        method: 'DELETE'
      });
    } else if (action === 'edit') {
      // Pré-remplir le formulaire avec les données de l'offre
      const jobToEdit = jobs.find(job => job._id === jobId);
      if (jobToEdit) {
        setFormData({
          title: jobToEdit.title,
          description: jobToEdit.description,
          type: jobToEdit.type,
          location: jobToEdit.location,
          salary: jobToEdit.salary,
          requirements: jobToEdit.requirements,
          dates: jobToEdit.dates,
          employer: jobToEdit.employer?._id || null
        });
        setShowJobForm(true);
      }
      return;
    } else {
      // Pour activer/désactiver
      const newStatus = action === 'active' ? 'active' : 'inactive';
      const confirmMessage = newStatus === 'active' 
        ? 'Êtes-vous sûr de vouloir activer cette offre ?' 
        : 'Êtes-vous sûr de vouloir désactiver cette offre ?';
      
      if (window.confirm(confirmMessage)) {
        response = await fetch(`http://localhost:5000/api/jobs/${jobId}/status`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ status: newStatus })
        });
      } else {
        return; // Annuler si l'utilisateur ne confirme pas
      }
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Action failed');
    }

    // Messages de succès plus détaillés
    let successMessage;
    switch (action) {
      case 'delete':
        successMessage = 'Offre supprimée avec succès';
        break;
      case 'active':
        successMessage = 'Offre activée avec succès';
        break;
      case 'inactive':
        successMessage = 'Offre désactivée avec succès';
        break;
      default:
        successMessage = 'Action effectuée avec succès';
    }

    toast.success(successMessage, {
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

    // Rafraîchir la liste des jobs
    fetchJobs(jobPagination.page);

  } catch (error) {
    console.error('Error:', error);
    toast.error(error.message || 'Erreur lors de l\'action', {
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  }
};

  // Get job status color (can stay inside renderJobs as it's not a hook)
  const getJobStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  // Get job status text (can stay inside renderJobs as it's not a hook)
  const getJobStatusText = (status) => {
    switch (status) {
      case 'active': return 'Active';
      case 'inactive': return 'Inactive';
      case 'pending': return 'Pending';
      case 'accepted': return 'accepted';
      default: return status;
    }
  };

  // Load jobs on component mount or when filters change
    const [activeTab, setActiveTab] = useState('users');
  useEffect(() => {
    if (activeTab === 'jobs') {
      fetchJobs();
    }
  }, [activeTab, jobFilters]);


    const getPhotoUrl = (user) => {
  if (user.photo) {
    if (typeof user.photo === 'string') {
      return user.photo.startsWith('http') ? user.photo : `${import.meta.env.VITE_API_URL}/${user.photo}`;
    }
    return URL.createObjectURL(user.photo);
  }
  return null;
};
  const [viewModalOpen, setViewModalOpen] = useState(false);
const [viewedUser, setViewedUser] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    users: { total: 0, candidates: 0, employers: 0, activeCandidates: 0, activeEmployers: 0 },
    jobs: { total: 0, active: 0, filled: 0 },
    applications: { total: 0, pending: 0 }
  });

  
    useEffect(() => {
    setStats({
      users: { total: 1247, candidates: 854, employers: 393, activeCandidates: 742, activeEmployers: 298 },
      jobs: { total: 2156, active: 1834, filled: 322 },
      applications: { total: 5432, pending: 234 }
    });

 


  }, []);
  
  // Pagination and filters
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [dateFromFilter, setDateFromFilter] = useState<string>('');
const [dateToFilter, setDateToFilter] = useState<string>('');
  const [userTypeFilter, setUserTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [emailFilter, setEmailFilter] = useState('');
const [educationFilter, setEducationFilter] = useState('');
const [ageFilter, setAgeFilter] = useState('');
const [desiredPositionFilter, setDesiredPositionFilter] = useState('');
const [preferredZoneFilter, setPreferredZoneFilter] = useState('');
const [createdAtFilter, setCreatedAtFilter] = useState('');

  // Edit modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    userType: '',
    isActive: true
  });
  // Types pour les filtres utilisateurs
type UserFilters = {
  search?: string;
  userType?: 'candidate' | 'employer' | 'admin';
  isActive?: boolean;
  education?: string;
  age?: number;
  desiredPosition?: string;
  preferredZone?: string;
  dateFrom?: string;
  dateTo?: string;
};

// État des filtres utilisateurs
const [userFilters, setUserFilters] = useState<UserFilters>({});

// Fonction fetchUsers modifiée
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

// Appliquer les filtres
const applyUserFilters = () => {
  fetchUsers(1);
};

// Réinitialiser les filtres
const resetUserFilters = () => {
  setUserFilters({});
  fetchUsers(1);
};


  const handleUserStatusChange = async (userId, isActive) => {
    try {
      const baseUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${baseUrl}/users/${userId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        credentials: 'include',
        body: JSON.stringify({ isActive: !isActive })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update user status');
      }

      const data = await response.json();
      
      if (data.success) {
        fetchUsers();
      }
    } catch (error) {
      console.error('Error updating user status:', error);
      alert(`Error: ${error.message}`);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const baseUrl = import.meta.env.VITE_API_URL;
        const response = await fetch(`${baseUrl}/users/${userId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          credentials: 'include'
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to delete user');
        }

        const data = await response.json();
        
        if (data.success) {
          fetchUsers();
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        alert(`Error: ${error.message}`);
      }
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

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    try {
      const baseUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${baseUrl}/users/${currentUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        credentials: 'include',
        body: JSON.stringify(formData)
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

const handleViewUser = (user) => {
  setViewedUser(user);
  setViewModalOpen(true);
};
  const handleAddUser = () => {
    alert('Add new user - Cette fonctionnalité sera implémentée prochainement');
  };

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    }
  }, [activeTab, currentPage, userTypeFilter, statusFilter, searchQuery]);

  const getStatusColor = (isActive) => {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const getUserTypeColor = (type) => {
    switch (type) {
      case 'candidate': return 'bg-blue-100 text-blue-800';
      case 'employer': return 'bg-purple-100 text-purple-800';
      case 'admin': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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
const renderJobs = () => {
  
  
 
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Job Management</h2>
          <p className="text-text-secondary mt-1">Manage all job postings on the platform</p>
        </div>

      </div>

      {/* Filters */}
<div className="bg-white p-4 rounded-lg shadow">
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
    {/* Filtre de recherche */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Recherche</label>
      <div className="relative">
        <input
          type="text"
          name="search"
          placeholder="Titre ou description..."
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
          value={jobFilters.search}
          onChange={handleFilterChange}
        />
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
      </div>
    </div>
    
    {/* Filtre type de contrat */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Type de contrat</label>
      <select
        name="type"
        className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
        value={jobFilters.type}
        onChange={handleFilterChange}
      >
        <option value="">Tous les types</option>
        <option value="CDI">CDI</option>
        <option value="CDD">CDD</option>
        <option value="Extra">Extra</option>
     
      </select>
    </div>
    
    {/* Filtre statut */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
      <select
        name="status"
        className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
        value={jobFilters.status}
        onChange={handleFilterChange}
      >
        <option value="">Tous les statuts</option>
       
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
        <option value="pending">En attente</option>
        <option value="accepted">accepte</option>
        <option value="Refused">refuse</option>
        
      </select>
    </div>
    
    {/* Filtre localisation */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Localisation</label>
      <input
        type="text"
        name="location"
        placeholder="Ville ou région"
        className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
        value={jobFilters.location}
        onChange={handleFilterChange}
      />
    </div>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
    {/* Filtre salaire minimum */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Salaire min (DT)</label>
      <input
        type="number"
        name="minSalary"
        placeholder="Minimum"
        className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
        value={jobFilters.minSalary}
        onChange={handleFilterChange}
      />
    </div>
    
    {/* Filtre salaire maximum */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Salaire max (DT)</label>
      <input
        type="number"
        name="maxSalary"
        placeholder="Maximum"
        className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
        value={jobFilters.maxSalary}
        onChange={handleFilterChange}
      />
    </div>
    
    {/* Filtre date de début */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">À partir du</label>
      <input
        type="date"
        name="dateFrom"
        className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
        value={jobFilters.dateFrom}
        onChange={handleFilterChange}
      />
    </div>
    
    {/* Boutons d'action */}
    <div className="flex items-end space-x-2">
      <button
        onClick={resetFilters}
         
        className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
      >
        Réinitialiser
      </button>
      <button
        onClick={() => fetchJobs(1)}
        className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        Appliquer
      </button>
    </div>
  </div>
</div>

      {/* Jobs List */}
      {loadingJobs ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-accent-500" />
        </div>
      ) : jobsError ? (
        <div className="text-red-500 text-center py-6">{jobsError}</div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posted</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {jobs.length > 0 ? (
                    jobs.map((job) => (
                      <tr key={job._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{job.title}</div>
                          <div className="text-sm text-gray-500">{job.salary?.amount} DT/{job.salary?.period}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {job.employer?.firstName} {job.employer?.lastName}
                          </div>
                          <div className="text-sm text-gray-500">{job.employer?.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {job.location?.city}, {job.location?.region}
                          </div>
                          <div className="text-sm text-gray-500">{job.location?.address}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                            {job.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getJobStatusColor(job.status)}`}>
                            {getJobStatusText(job.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(job.publishDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                         <button 
                           onClick={async () => {
                             try {
                               // Récupérer les détails complets de l'utilisateur
                               const response = await fetch(`http://localhost:5000/api/users/${job.employer._id}`);
                               if (!response.ok) throw new Error('Failed to fetch user details');
                               
                               const userData = await response.json();
                               setViewedUser(userData.user);
                               setViewModalOpen(true);
                             } catch (error) {
                               console.error('Error fetching user:', error);
                               toast.error("Impossible de charger les détails de l'employeur");
                             }
                           }}
                           className="p-2 text-gray-500 hover:text-blue-500 rounded-lg hover:bg-blue-50"
                           title="Voir les détails de l'employeur"
                         >
                           <Eye className="w-4 h-4" />
                         </button>
                            <button 
                              className="p-2 text-gray-500 hover:text-blue-500 rounded-lg hover:bg-blue-50"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleJobAction(job._id, 'delete')}
                              className="p-2 text-gray-500 hover:text-red-500 rounded-lg hover:bg-red-50"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                        No jobs found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => fetchJobs(jobPagination.page - 1)}
                  disabled={jobPagination.page === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => fetchJobs(jobPagination.page + 1)}
                  disabled={jobs.length < jobPagination.limit || jobPagination.page === jobPagination.pages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{(jobPagination.page - 1) * jobPagination.limit + 1}</span> to{' '}
                    <span className="font-medium">{(jobPagination.page - 1) * jobPagination.limit + jobs.length}</span> of{' '}
                    <span className="font-medium">{jobPagination.total}</span> jobs
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => fetchJobs(jobPagination.page - 1)}
                      disabled={jobPagination.page === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                      <span className="sr-only">Previous</span>
                      <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                    </button>
                    {Array.from({ length: Math.min(5, jobPagination.pages) }, (_, i) => {
                      let pageNum;
                      if (jobPagination.pages <= 5) {
                        pageNum = i + 1;
                      } else if (jobPagination.page <= 3) {
                        pageNum = i + 1;
                      } else if (jobPagination.page >= jobPagination.pages - 2) {
                        pageNum = jobPagination.pages - 4 + i;
                      } else {
                        pageNum = jobPagination.page - 2 + i;
                      }
                      return (
                        <button
                          key={pageNum}
                          onClick={() => fetchJobs(pageNum)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            jobPagination.page === pageNum
                              ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => fetchJobs(jobPagination.page + 1)}
                      disabled={jobs.length < jobPagination.limit || jobPagination.page === jobPagination.pages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                      <span className="sr-only">Next</span>
                      <ChevronRight className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
  const renderOverview = () => (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary mb-1">Utilisateurs totaux</p>
              <p className="text-2xl font-bold text-text-primary">{stats.users.total}</p>
              <p className="text-sm text-success-500 mt-1">+12% ce mois</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center">
              <Users className="w-6 h-6 text-primary-500" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary mb-1">Candidats actifs</p>
              <p className="text-2xl font-bold text-text-primary">{stats.users.activeCandidates}</p>
              <p className="text-sm text-success-500 mt-1">+8% ce mois</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-accent-50 flex items-center justify-center">
              <UserCheck className="w-6 h-6 text-accent-500" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary mb-1">Employeurs</p>
              <p className="text-2xl font-bold text-text-primary">{stats.users.employers}</p>
              <p className="text-sm text-success-500 mt-1">+15% ce mois</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-success-50 flex items-center justify-center">
              <Building2 className="w-6 h-6 text-success-500" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary mb-1">Offres publiées</p>
              <p className="text-2xl font-bold text-text-primary">{stats.jobs.total}</p>
              <p className="text-sm text-success-500 mt-1">+23% ce mois</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center">
              <FileText className="w-6 h-6 text-purple-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-success-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-success-500" />
            </div>
            <div>
              <h3 className="font-semibold text-text-primary">Validations en attente</h3>
              <p className="text-2xl font-bold text-success-500">12</p>
            </div>
          </div>
          <button className="w-full bg-success-500 text-white py-2 rounded-lg hover:bg-success-600 transition-colors">
            Traiter les validations
          </button>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-yellow-500" />
            </div>
            <div>
              <h3 className="font-semibold text-text-primary">Signalements</h3>
              <p className="text-2xl font-bold text-yellow-500">3</p>
            </div>
          </div>
          <button className="w-full bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600 transition-colors">
            Examiner les signalements
          </button>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-primary-500" />
            </div>
            <div>
              <h3 className="font-semibold text-text-primary">Rapport mensuel</h3>
              <p className="text-sm text-text-secondary">Janvier 2024</p>
            </div>
          </div>
          <button className="w-full bg-primary-500 text-white py-2 rounded-lg hover:bg-primary-600 transition-colors">
            Générer le rapport
          </button>
        </div>
      </div>
    </div>
  );
   


  const renderUsers = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">User Management</h2>

      </div>
<div className="bg-white p-4 rounded-lg shadow mb-6">
  {/* Première ligne - Filtres principaux */}
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
    {/* Filtre Texte */}
    <div className="md:col-span-2">
      <label className="block text-sm font-medium text-gray-700 mb-1">Recherche</label>
      <div className="relative">
        <input
          type="text"
          placeholder="Nom, email ....."
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={userFilters.search || ''}
          onChange={(e) => setUserFilters({...userFilters, search: e.target.value})}
        />
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
      </div>
    </div>

    {/* Type d'utilisateur */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
      <select
        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        value={userFilters.userType || ''}
        onChange={(e) => setUserFilters({
          ...userFilters, 
          userType: e.target.value as 'candidate' | 'employer' | 'admin' | undefined
        })}
      >
        <option value="">Tous les types</option>
        <option value="candidate">Candidat</option>
        <option value="employer">Employeur</option>
        <option value="admin">Administrateur</option>
      </select>
    </div>

    {/* Éducation */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Éducation</label>
      <select
        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        value={userFilters.education || ''}
        onChange={(e) => setUserFilters({...userFilters, education: e.target.value || undefined})}
      >
        <option value="">Tous niveaux</option>
        <option value="BAC">BAC</option>
        <option value="BTS">BTS</option>
        <option value="BTP">BTP</option>
        <option value="CAP">CAP</option>
        <option value="Maitrise">Maitrise</option>
        <option value="Licence">Licence</option>
        <option value="Master">Master</option>
        <option value="Sans diplôme">Sans diplôme</option>
      </select>
    </div>
  </div>

  {/* Deuxième ligne - Filtres spécifiques */}
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
    {/* Poste recherché */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Poste recherché</label>
      <select
        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        value={userFilters.desiredPosition || ''}
        onChange={(e) => setUserFilters({
          ...userFilters,
          desiredPosition: e.target.value || undefined
        })}
      >
        <option value="">Tous les postes</option>
        {[
          'Acheteur', 'Commercial', 'Chef de cuisine', 'Chef pâtissier',
          'Chef de partie', 'Chef de salle', 'Chef de rang', 'Pizzaiolo',
          'Cuisinier', 'Pâtissier', 'Croissantier', 'Boulanger',
          'Comptoiriste', 'Barista', 'Barman', 'Maitre d\'hôtel',
          'Glacier', 'Food and beverage', 'Caissier', 'Gérant',
          'Serveur(se)', 'Commis', 'Commis de cuisine', 'Préparateur de Chicha',
          'Plongeur', 'Responsable de restauration', 'Livreur', 'Chauffeur', 'Autres'
        ].map(position => (
          <option key={position} value={position}>{position}</option>
        ))}
      </select>
    </div>

    {/* Zone préférée */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Zone géographique</label>
      <select
        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        value={userFilters.preferredZone || ''}
        onChange={(e) => setUserFilters({
          ...userFilters,
          preferredZone: e.target.value || undefined
        })}
      >
        <option value="">Toutes zones</option>
        {[
          'Banlieue nord (Marsa, Lac, kram…)', 'Soukra- Charguia-Aouina',
          'Centre-ville Tunis', 'Menzah Nasr, Ariana', 'Mannouba – Bardo',
          'Mnihla, Ettadhamen', 'Ben Arous', 'Nabeul', 'Hammamet', 'Bizerte',
          'Sousse', 'Sfax', 'Djerba', 'Zaghouane', 'Tabarka', 'Monastir',
          'Mahdi', 'Kairouan', 'Gabes', 'Medenine', 'Gafsa', 'Kasserine',
          'Tozeur', 'Kebili', 'Tataouine', 'Sebitla', 'Jendouba', 'Beja',
          'Kef', 'Sidi Bouzid', 'Autres'
        ].map(zone => (
          <option key={zone} value={zone}>{zone}</option>
        ))}
      </select>
    </div>

    {/* Âge */}
<div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Âge</label>
      <input
        type="number"
        placeholder="Filtrer par âge"
        className="w-full px-4 py-2 border rounded-lg"
        value={userFilters.age || ''}
        onChange={(e) => setUserFilters({
          ...userFilters,
          age: e.target.value ? Number(e.target.value) : undefined
        })}
        min="16"
        max="99"
      />
    </div>

    {/* Période d'inscription */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Date d'inscription</label>
      <div className="grid grid-cols-2 gap-2">
        <input
          type="date"
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={userFilters.dateFrom || ''}
          onChange={(e) => setUserFilters({...userFilters, dateFrom: e.target.value || undefined})}
        />
        <input
          type="date"
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={userFilters.dateTo || ''}
          onChange={(e) => setUserFilters({...userFilters, dateTo: e.target.value || undefined})}
        />
      </div>
    </div>
  </div>

  {/* Boutons d'action */}
  <div className="flex justify-end space-x-3 pt-2">
    <button
      onClick={resetUserFilters}
      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
    >
      <RefreshCw className="w-4 h-4 mr-2" />
      Réinitialiser
    </button>
    <button
      onClick={applyUserFilters}
      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
    >
      <Filter className="w-4 h-4 mr-2" />
      Appliquer les filtres
    </button>
  </div>
</div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading users...</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LastLogin</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registered</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.length > 0 ? (
                    users.map((user) => (
                      <tr key={user._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <img 
                    src={user.photo} 
                    alt={`${user.firstName} ${user.lastName}`}
                    className="w-8 h-8 rounded-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'default-profile.png';
                    }}
                  />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {user.firstName} {user.lastName}
                              </div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getUserTypeColor(user.userType)}`}>
                            {user.userType === 'candidate' ? 'Candidate' : 
                             user.userType === 'employer' ? 'Employer' : 'Admin'}
                          </span>
                        </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(user.lastLogin).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button 
                                onClick={() => handleViewUser(user)}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                <Eye className="w-5 h-5" />
                              </button>
                          <button 
                              onClick={() => handleEditUser(user)}
                              className="text-yellow-600 hover:text-yellow-900" >
                              <Edit className="w-5 h-5" />
                            </button>
                            <button 
                              onClick={() => handleUserStatusChange(user._id, user.isActive)}
                              className={user.isActive ? "text-red-600 hover:text-red-900" : "text-green-600 hover:text-green-900"}
                            >
                              {user.isActive ? <UserX className="w-5 h-5" /> : <UserCheck className="w-5 h-5" />}
                            </button>
                            <button 
                              onClick={() => handleDeleteUser(user._id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                        No users found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  disabled={users.length < itemsPerPage}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                    <span className="font-medium">{(currentPage - 1) * itemsPerPage + users.length}</span> of{' '}
                    <span className="font-medium">{stats.users.total}</span> users
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                      <span className="sr-only">Previous</span>
                      <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                    </button>
                    {Array.from({ length: Math.min(5, Math.ceil(stats.users.total / itemsPerPage)) }, (_, i) => {
                      let pageNum;
                      if (Math.ceil(stats.users.total / itemsPerPage) <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= Math.ceil(stats.users.total / itemsPerPage) - 2) {
                        pageNum = Math.ceil(stats.users.total / itemsPerPage) - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            currentPage === pageNum
                              ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => setCurrentPage(prev => prev + 1)}
                      disabled={users.length < itemsPerPage || currentPage === Math.ceil(stats.users.total / itemsPerPage)}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                      <span className="sr-only">Next</span>
                      <ChevronRight className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
  
    const renderContent = () => {
    switch (activeTab) {
      case 'overview': return renderOverview();
      case 'users': return renderUsers();
      case 'jobs': return renderJobs();
      default: return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-8">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-10 h-10 text-blue-500" />
                </div>
                <h3 className="font-semibold text-gray-900">Admin Panel</h3>
                <p className="text-sm text-gray-500">Platform Management</p>
              </div>

              <nav className="space-y-1">
                {[
                  { id: 'overview', label: 'Vue d\'ensemble', icon: BarChart3 },
                  { id: 'users', label: 'Utilisateurs', icon: Users },
                  { id: 'jobs', label: 'Offres d\'emploi', icon: FileText },
                 
             
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === item.id
                        ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-500'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Administration Dashboard</h1>
                <p className="text-gray-500 mt-1">Manage and monitor your platform</p>
              </div>
              
            </div>

            {/* Content */}
           {renderContent()}
          </div>
        </div>
      </div>
       {editModalOpen && <EditUserModal />}
       {viewModalOpen && <ViewUserModal />}
    </div>
  );
};

export default AdminDashboard; 