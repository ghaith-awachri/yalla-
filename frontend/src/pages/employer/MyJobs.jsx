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
  MapPin, DollarSign, Briefcase, Clock, Award, User, Eye, Edit, Trash2, PlusCircle,
  Calendar, Search, Building2, Star, Loader2, ChevronLeft, ChevronRight, Users, Download, X,
  FileText , CheckCircle 
} from 'lucide-react';
import { API_URL, getAuthHeaders } from '../../api/config';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import { DatePicker } from '@/components/ui/DatePicker';
import { FormDropdown } from '@/components/ui/FormDropdown';

const MyJobs = ({ myJobs: initialJobs, showJobForm, setShowJobForm }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        setCurrentUser(userData);
        // Pre-fill employer field with current user if they are an employer
        if (userData._id) {
          setFormData(prev => ({
            ...prev,
            employer: userData._id,
            owner: userData._id
          }));
        }
      } catch (e) {
        console.error("Error parsing user from localStorage", e);
      }
    }
  }, []);

  const getPhotoUrl = (user) => {
    if (!user.photo) return null;
    if (user.photo.startsWith('http') || user.photo.startsWith('data:')) return user.photo;
    const normalizedPath = user.photo.replace(/\\/g, '/');
    if (normalizedPath.includes('uploads')) {
      return normalizedPath.startsWith('/') ? normalizedPath : `/${normalizedPath}`;
    }
    return `${import.meta.env.VITE_API_URL}/${normalizedPath}`;
  };

  const [viewModalOpen, setViewModalOpen] = useState(false);
const [viewedUser, setViewedUser] = useState(null);
 const ViewUserModal = () => {
  if (!viewModalOpen || !viewedUser) return null;

  const photoUrl = getPhotoUrl(viewedUser);

  const handleDownloadCV = (user) => {
    if (!user.cv) {
      toast.error("Aucun CV disponible pour ce candidat");
      return;
    }

    try {
      const cvUrl = user.cv.startsWith('http') 
        ? user.cv 
        : `${import.meta.env.VITE_API_URL}${user.cv}`;
      
      const link = document.createElement('a');
      link.href = cvUrl;
      link.download = `CV_${user.firstName}_${user.lastName}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Erreur lors du téléchargement:", error);
      toast.error("Échec du téléchargement du CV");
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
      e.target.src = 'default-profile.png';
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
  const [userss, setUser] = useState({
    firstName: '',
    // other default properties
  });
  
  // États pour la gestion des offres
  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [jobsError, setJobsError] = useState('');
  
  // États pour la pagination
  const [jobPagination, setJobPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1
  });
  
  // États pour la gestion des employeurs
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [usersError, setUsersError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  // États pour le formulaire
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '',
    location: {
      address: '',
      city: '',
      region: ''
    },
    salary: {
      amount: '',
      period: 'heure'
    },

    dates: {
      start: '',
      end: ''
    },
    employer: '',
    owner: ''
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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
  if (!currentUser) return;
  setLoadingJobs(true);
  try {
    const userStr = localStorage.getItem('user');
    if (!userStr) throw new Error('Utilisateur non connecté');
    
    const userData = JSON.parse(userStr);
    if (!userData?._id) throw new Error('ID utilisateur manquant');

    const url = new URL(`${API_URL}/jobs`);
    
    // Paramètres de base
    url.searchParams.append('page', page.toString());
    url.searchParams.append('limit', jobPagination.limit.toString());
    url.searchParams.append('owner', userData._id);
    
    // Ajouter tous les filtres
    Object.entries(jobFilters).forEach(([key, value]) => {
      if (value) url.searchParams.append(key, value);
    });

    const response = await fetch(url.toString(), {
      headers: getAuthHeaders()
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
// Add this to your existing state declarations
const [userFilters, setUserFilters] = useState({
  desiredPosition: '',
  preferredZone: '',
  // Add other filter fields as needed
});
  // Fonction pour charger les employeurs
const fetchUsers = async (page = 1) => {
  setLoadingUsers(true);
  try {
    const url = new URL(`${API_URL}/users`);
    url.searchParams.append('page', page.toString());
    url.searchParams.append('limit', '10');
    url.searchParams.append('userType', 'candidate'); // Using append method
    
    if (userFilters.desiredPosition) {
      url.searchParams.append('desiredPosition', userFilters.desiredPosition);
    }
    if (userFilters.preferredZone) {
      url.searchParams.append('preferredZone', userFilters.preferredZone);
    }

    const response = await fetch(url.toString(), {
      headers: getAuthHeaders()
    });
    const data = await response.json();

    setUsers(data.users);
  } catch (error) {
    setUsersError('Failed to load users');
    console.error('Fetch error:', error);
  } finally {
    setLoadingUsers(false);
  }
};
  // Gestionnaire de recherche d'employeurs
const applyUserFilters = () => {
  fetchUsers(1);
};

  // Sélection d'un employeur
  const handleSelectEmployer = (user) => {
    setFormData(prev => ({
      ...prev,
      employer: user._id
    }));
    toast.success(`Employeur sélectionné: ${user.firstName} ${user.lastName}`);
  };

  // Gestion des actions sur les offres
const handleJobAction = async (jobId, action) => {
  try {
    let response;
    
    if (action === 'delete') {
      response = await fetch(`${API_URL}/jobs/${jobId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
    } else {
      response = await fetch(`${API_URL}/jobs/${jobId}/status`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: action })
      });
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Action failed');
    }

    fetchJobs(jobPagination.page);
  } catch (error) {
    console.error('Error:', error);
  }
};
  // Gestion des changements de formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  // Validation du formulaire
  const validateForm = () => {
    const errors = {};
    
    if (!formData.title) errors.title = 'Titre requis';
    if (!formData.description) errors.description = 'Description requise';
    if (!formData.type) errors.type = 'Type de contrat requis';
    if (!formData.location.address) errors['location.address'] = 'Adresse requise';
    if (!formData.location.city) errors['location.city'] = 'Ville requise';
    if (!formData.location.region) errors['location.region'] = 'Région requise';
    if (!formData.salary.amount || isNaN(formData.salary.amount)) 
      errors['salary.amount'] = 'Montant invalide';
    
    if (!formData.dates.start) errors['dates.start'] = 'Date de début requise';
    if (formData.type !== 'CDI' && !formData.dates.end) 
      errors['dates.end'] = 'Date de fin requise pour CDD/Extra';
    
    if (Object.keys(errors).length > 0) {
      console.log('Validation errors:', errors);
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Veuillez corriger les erreurs dans le formulaire');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Récupérer l'utilisateur connecté
      const userData = JSON.parse(localStorage.getItem('user'));
      if (!userData) {
        throw new Error('Utilisateur non connecté');
      }

      // Préparer les données avec conversion des types
      const postData = {
        title: formData.title,
        description: formData.description,
        type: formData.type,
        location: {
          address: formData.location.address,
          city: formData.location.city,
          region: formData.location.region
        },
        salary: {
          amount: Number(formData.salary.amount),
          period: formData.salary.period
        },

        dates: {
          start: new Date(formData.dates.start).toISOString(),
          end: formData.dates.end ? new Date(formData.dates.end).toISOString() : null
        },
        employer: formData.employer,
        owner: userData._id // Ajout de l'owner
      };

      console.log('Données envoyées:', postData); // Pour débogage

      const response = await fetch(`${API_URL}/jobs`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(postData)
      });

      const data = await response.json();
      
      if (!response.ok) {
        console.error('Réponse serveur:', data);
        throw new Error(data.message || `Erreur ${response.status}`);
      }

      toast.success('Offre créée avec succès!');
      setShowJobForm(false);
      fetchJobs();
      
    } catch (error) {
      console.error('Erreur complète:', error);
      toast.error(error.message || 'Erreur lors de la création de l\'offre');
    } finally {
      setIsSubmitting(false);
    }
  };

const getJobStatusColor = (status) => {
  switch (status) {
    case 'active': return 'bg-green-100 text-green-800';
    case 'inactive': return 'bg-gray-100 text-gray-800';
    case 'pending': return 'bg-yellow-100 text-yellow-800';
    case 'accepted': return 'bg-blue-100 text-blue-800';
    case 'Refused': return 'bg-red-100 text-red-800';
    default: return 'bg-purple-100 text-purple-800';
  }
};

const getJobStatusText = (status) => {
  switch (status) {
    case 'active': return 'Active';
    case 'inactive': return 'Inactive';
    case 'pending': return 'En attente';
    case 'accepted': return 'Acceptée';
    case 'Refused': return 'Refusée';
    default: return status;
  }
};

  // Charger les données au montage
  useEffect(() => {
    if (currentUser) {
      fetchJobs();
    }
  }, [currentUser]);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header & Premium Filter Section */}
      <div className="bg-white/80 backdrop-blur-md p-8 rounded-[2.5rem] border border-slate-200/60 shadow-sm space-y-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Mes Annonces</h1>
            <p className="text-slate-500 font-medium">Gérez vos offres et suivez les candidatures en temps réel</p>
          </div>
          <button 
            onClick={() => setShowJobForm(true)}
            className="group flex items-center space-x-3 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow-xl shadow-blue-200 transition-all hover:-translate-y-1 active:translate-y-0"
          >
            <PlusCircle className="w-5 h-5 transition-transform group-hover:rotate-90" />
            <span className="font-bold">Publier une offre</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <div className="relative group">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-blue-500 transition-colors" />
            <input
              type="text"
              name="search"
              placeholder="Titre, description..."
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-transparent focus:border-blue-500 focus:bg-white rounded-2xl text-sm font-medium transition-all outline-none"
              value={jobFilters.search}
              onChange={handleFilterChange}
            />
          </div>
          <FormDropdown 
            value={jobFilters.status}
            onValueChange={(val) => handleFilterChange({ target: { name: 'status', value: val } })}
            placeholder="Tous les statuts"
            options={[
              { value: '', label: 'Tous les statuts' },
              { value: 'active', label: 'Actives' },
              { value: 'inactive', label: 'Inactives' },
              { value: 'pending', label: 'En attente' }
            ]}
          />
          <FormDropdown 
            value={jobFilters.type}
            onValueChange={(val) => handleFilterChange({ target: { name: 'type', value: val } })}
            placeholder="Tous les contrats"
            options={[
              { value: '', label: 'Tous les contrats' },
              { value: 'CDI', label: 'CDI' },
              { value: 'CDD', label: 'CDD' },
              { value: 'Extra', label: 'Extra' }
            ]}
          />
          <button
            onClick={resetFilters}
            className="w-full py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-2xl transition-all"
          >
            Réinitialiser
          </button>
        </div>
      </div>

      {/* Jobs Content Grid */}
      {loadingJobs ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-6">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-slate-500 font-bold animate-pulse italic">Récupération de vos annonces...</p>
        </div>
      ) : jobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {jobs.map((job) => (
            <div key={job._id} className="group bg-white rounded-[2.5rem] border border-slate-200/60 shadow-sm hover:shadow-2xl hover:shadow-blue-900/5 hover:-translate-y-2 transition-all duration-500 overflow-hidden flex flex-col">
              <div className="p-8 flex-1">
                <div className="flex justify-between items-start mb-6">
                  <div className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border shadow-sm ${getJobStatusColor(job.status)}`}>
                    {getJobStatusText(job.status)}
                  </div>
                  <div className="flex items-center text-slate-400 text-[11px] font-bold bg-slate-50 px-3 py-1 rounded-lg">
                    <Calendar className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                    {new Date(job.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <h3 className="text-xl font-black text-slate-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-1">{job.title}</h3>
                
                <div className="flex items-center text-slate-500 text-sm font-medium mb-6">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center mr-3">
                    <MapPin className="w-4 h-4 text-blue-600" />
                  </div>
                  {job.location.city}, {job.location.region}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-slate-50/50 p-4 rounded-3xl border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Salaire</p>
                    <p className="text-base font-black text-slate-900">{job.salary.amount} DT <span className="text-xs text-slate-500">/{job.salary.period}</span></p>
                  </div>
                  <div className="bg-slate-50/50 p-4 rounded-3xl border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Contrat</p>
                    <p className="text-base font-black text-slate-900">{job.type}</p>
                  </div>
                </div>
              </div>

              <div className="px-8 py-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-900">{job.applicationCount || 0}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Candidats</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => handleJobAction(job._id, job.status === 'active' ? 'inactive' : 'active')}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${job.status === 'active' ? 'bg-amber-100 text-amber-600 hover:bg-amber-200' : 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200'}`}
                    title={job.status === 'active' ? 'Mettre en pause' : 'Réactiver'}
                  >
                    {job.status === 'active' ? <Clock className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
                  </button>
                  <button 
                    onClick={() => handleJobAction(job._id, 'delete')}
                    className="w-10 h-10 bg-rose-100 text-rose-600 hover:bg-rose-200 rounded-xl flex items-center justify-center transition-all"
                    title="Supprimer"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-[3rem] border-2 border-slate-100 border-dashed p-24 text-center">
          <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
            <Briefcase className="w-10 h-10 text-slate-300" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 mb-3">Aucune annonce trouvée</h3>
          <p className="text-slate-500 font-medium max-w-sm mx-auto mb-10 text-lg">Prêt à recruter ? Publiez votre première offre en quelques clics.</p>
          <button 
            onClick={() => setShowJobForm(true)}
            className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-black shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all hover:-translate-y-1"
          >
            Créer ma première annonce
          </button>
        </div>
      )}

      {/* Pagination Container */}
      {jobPagination.pages > 1 && (
        <div className="flex items-center justify-center space-x-4 pt-12 pb-8">
          <button
            onClick={() => fetchJobs(jobPagination.page - 1)}
            disabled={jobPagination.page === 1}
            className="w-12 h-12 flex items-center justify-center bg-white border border-slate-200 rounded-2xl text-slate-600 disabled:opacity-40 hover:border-blue-500 hover:text-blue-600 transition-all shadow-sm"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <div className="flex items-center bg-white border border-slate-200 rounded-[1.25rem] p-1.5 shadow-sm">
            {Array.from({ length: jobPagination.pages }, (_, i) => i + 1).map(pageNum => (
              <button
                key={pageNum}
                onClick={() => fetchJobs(pageNum)}
                className={`w-10 h-10 rounded-xl text-sm font-black transition-all ${
                  jobPagination.page === pageNum
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-blue-600'
                }`}
              >
                {pageNum}
              </button>
            ))}
          </div>

          <button
            onClick={() => fetchJobs(jobPagination.page + 1)}
            disabled={jobPagination.page === jobPagination.pages}
            className="w-12 h-12 flex items-center justify-center bg-white border border-slate-200 rounded-2xl text-slate-600 disabled:opacity-40 hover:border-blue-500 hover:text-blue-600 transition-all shadow-sm"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* Job Form Modal */}
      {showJobForm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[100] p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col transform animate-in zoom-in-95 duration-500">
            <div className="px-10 py-8 bg-gradient-to-r from-blue-600 to-indigo-700 flex justify-between items-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full -mr-40 -mt-40 animate-pulse"></div>
              <div className="relative z-10">
                <h2 className="text-3xl font-black text-white mb-1 tracking-tight">Nouvelle Offre</h2>
                <p className="text-blue-100 font-bold opacity-80">Remplissez les détails pour attirer les candidats</p>
              </div>
              <button 
                onClick={() => setShowJobForm(false)}
                className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl text-white transition-all relative z-10 hover:rotate-90 duration-300"
                disabled={isSubmitting}
              >
                <X className="w-7 h-7" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
              <form className="space-y-10" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  {/* Left Column: Basic Info */}
                  <div className="space-y-8">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center">
                        <FileText className="w-4 h-4 text-blue-600" />
                      </div>
                      <h3 className="text-lg font-black text-slate-900">Informations Générales</h3>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Titre du poste *</label>
                        <input 
                          type="text" 
                          name="title"
                          className={`w-full px-5 py-4 bg-slate-50 border ${formErrors.title ? 'border-rose-300' : 'border-transparent'} focus:border-blue-500 focus:bg-white rounded-2xl font-bold transition-all outline-none shadow-sm`}
                          placeholder="Ex: Serveur(se) de Salle"
                          value={formData.title}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Contrat *</label>
                          <FormDropdown 
                            value={formData.type}
                            onValueChange={(val) => handleInputChange({ target: { name: 'type', value: val } })}
                            placeholder="Choisir"
                            options={[
                              { value: 'CDI', label: 'CDI' },
                              { value: 'CDD', label: 'CDD' },
                              { value: 'Extra', label: 'Extra' }
                            ]}
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Rémunération *</label>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="relative">
                              <input 
                                type="number" 
                                name="salary.amount"
                                className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-transparent focus:border-blue-500 focus:bg-white rounded-2xl font-bold transition-all outline-none shadow-sm"
                                placeholder="0"
                                value={formData.salary.amount}
                                onChange={handleInputChange}
                              />
                              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">DT</span>
                            </div>
                            <FormDropdown 
                              value={formData.salary.period}
                              onValueChange={(val) => handleInputChange({ target: { name: 'salary.period', value: val } })}
                              options={[
                                { value: 'heure', label: 'Par Heure' },
                                { value: 'jour', label: 'Par Jour' },
                                { value: 'mois', label: 'Par Mois' }
                              ]}
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Description détaillée *</label>
                        <textarea 
                          name="description"
                          className="w-full px-5 py-4 bg-slate-50 border border-transparent focus:border-blue-500 focus:bg-white rounded-2xl font-bold transition-all outline-none shadow-sm min-h-[160px] resize-none"
                          placeholder="Missions, responsabilités, avantages..."
                          value={formData.description}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Location & Dates */}
                  <div className="space-y-8">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center">
                        <MapPin className="w-4 h-4 text-emerald-600" />
                      </div>
                      <h3 className="text-lg font-black text-slate-900">Localisation & Dates</h3>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Adresse complète *</label>
                        <input 
                          type="text" 
                          name="location.address"
                          className="w-full px-5 py-4 bg-slate-50 border border-transparent focus:border-blue-500 focus:bg-white rounded-2xl font-bold transition-all outline-none shadow-sm"
                          placeholder="Numéro et nom de rue"
                          value={formData.location.address}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Ville *</label>
                          <input 
                            type="text" 
                            name="location.city"
                            className="w-full px-5 py-4 bg-slate-50 border border-transparent focus:border-blue-500 focus:bg-white rounded-2xl font-bold transition-all outline-none shadow-sm"
                            placeholder="Ex: Tunis"
                            value={formData.location.city}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Région *</label>
                          <FormDropdown 
                            value={formData.location.region}
                            onValueChange={(val) => handleInputChange({ target: { name: 'location.region', value: val } })}
                            placeholder="Sélectionner une région"
                            options={[
                              { value: 'Tunis', label: 'Tunis' },
                              { value: 'Sousse', label: 'Sousse' },
                              { value: 'Sfax', label: 'Sfax' },
                              { value: 'Hammamet', label: 'Hammamet' }
                            ]}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-4">
                        <div className="space-y-2">
                          <label className="block text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2 ml-1">Début *</label>
                          <DatePicker 
                            date={formData.dates.start}
                            setDate={(d) => handleInputChange({ target: { name: 'dates.start', value: d } })}
                            placeholder="Date de début"
                            className={formErrors['dates.start'] ? 'border-rose-300' : ''}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2 ml-1">Fin</label>
                          <DatePicker 
                            date={formData.dates.end}
                            setDate={(d) => handleInputChange({ target: { name: 'dates.end', value: d } })}
                            placeholder="Date de fin"
                            className={formErrors['dates.end'] ? 'border-rose-300' : ''}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="flex justify-end items-center space-x-4 pt-10 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowJobForm(false)}
                    className="px-10 py-4 text-slate-500 font-black hover:bg-slate-50 rounded-2xl transition-all"
                    disabled={isSubmitting}
                  >
                    Annuler
                  </button>
                  <button 
                    type="submit"
                    className="group relative px-12 py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-xl shadow-blue-200 transition-all hover:-translate-y-1 overflow-hidden"
                    disabled={isSubmitting}
                  >
                    <div className="relative z-10 flex items-center space-x-3">
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Publication...</span>
                        </>
                      ) : (
                        <>
                          <PlusCircle className="w-5 h-5 transition-transform group-hover:rotate-90" />
                          <span>Confirmer & Publier</span>
                        </>
                      )}
                    </div>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Profile Detail Modal */}
      {viewModalOpen && viewedUser && (
        <ViewUserModal />
      )}
    </div>
  );
};

export default MyJobs;