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
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';

const MyJobs = () => {


  const getPhotoUrl = (user) => {
  if (!user.photo) return null;
  return user.photo.startsWith('http') 
    ? user.photo 
    : `${import.meta.env.VITE_API_URL}/${user.photo}`;
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
  const [showJobForm, setShowJobForm] = useState(false);
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
    employer: null
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
    url.searchParams.append('owner', userData._id);
    
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
    const url = new URL(`http://localhost:5000/api/users`);
    url.searchParams.append('page', page.toString());
    url.searchParams.append('limit', '10');
    url.searchParams.append('userType', 'candidate'); // Using append method
    
    if (userFilters.desiredPosition) {
      url.searchParams.append('desiredPosition', userFilters.desiredPosition);
    }
    if (userFilters.preferredZone) {
      url.searchParams.append('preferredZone', userFilters.preferredZone);
    }

    const response = await fetch(url.toString());
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
      response = await fetch(`http://localhost:5000/api/jobs/${jobId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
    } else {
      response = await fetch(`http://localhost:5000/api/jobs/${jobId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
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
    if (!formData.employer) errors.employer = 'Employeur requis';
    
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

      const response = await fetch('http://localhost:5000/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
      });

      const data = await response.json();
      
      if (!response.ok) {
        console.error('Réponse serveur:', data); // Log des détails d'erreur
        throw new Error(data.message || `Erreur ${response.status}`);
      }

       alert('Offre créée avec succès!');
      
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
    // Récupérer l'utilisateur connecté avant de faire les requêtes
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
    
    fetchJobs();
    fetchUsers();
  }, []); // Ne dépend que du montage initial

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Mes Annonces</h1>
          <p className="text-text-secondary mt-1">Gérez vos offres d'emploi publiées</p>
        </div>
        <button 
          onClick={() => setShowJobForm(true)}
          className="mt-4 sm:mt-0 bg-accent-500 text-white px-6 py-3 rounded-lg hover:bg-accent-600 transition-colors flex items-center space-x-2"
        >
          <PlusCircle className="w-5 h-5" />
          <span>Publier une offre</span>
        </button>
      </div>
      
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

      {/* Liste des offres sous forme de tableau */}
      {loadingJobs ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-accent-500" />
        </div>
      ) : jobsError ? (
        <div className="text-red-500 text-center py-6">{jobsError}</div>
      ) : <>
  <div className="bg-white rounded-lg shadow overflow-hidden">
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titre</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employeur</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Localisation</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Publié le</th>
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
                  <div className="flex flex-col">
                    <div className="text-sm text-gray-900">
                      {job.employer?.firstName} {job.employer?.lastName}
                    </div>
                     {job.status === 'accepted'|| job.status === 'active' || job.status === 'inactive' ? (
                      <>
                    <button
                      onClick={async () => {
                        try {
                          const response = await fetch(`http://localhost:5000/api/users/${job.employer._id}`);
                          if (!response.ok) throw new Error('Échec de la récupération des données');
                          const userData = await response.json();
                          setViewedUser(userData.user);
                          setViewModalOpen(true);
                        } catch (error) {
                          console.error('Erreur:', error);
                          toast.error("Impossible de charger les informations de l'employeur");
                        }
                      }}
                      className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800 mt-1 w-fit"
                      title="Voir le profil complet de l'employeur"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Voir profil</span>
                    </button>      </>
                    ) : null}
                  </div>
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
                  {new Date(job.publishDate).toLocaleDateString('fr-FR')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-2">
                    {job.status === 'accepted'|| job.status === 'active' || job.status === 'inactive' ? (
                      <>
                        <button 
                          onClick={() => handleJobAction(job._id, 'active')}
                          className={`p-2 rounded-lg ${job.status === 'active' ? 'bg-green-100 text-green-600' : 'text-gray-500 hover:text-green-500 hover:bg-green-50'}`}
                          title="Activer"
                          disabled={job.status === 'active'}
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleJobAction(job._id, 'inactive')}
                          className={`p-2 rounded-lg ${job.status === 'inactive' ? 'bg-gray-100 text-gray-600' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
                          title="Désactiver"
                          disabled={job.status === 'inactive'}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    ) : null}
                    <button 
                      onClick={() => handleJobAction(job._id, 'delete')}
                      className="p-2 text-gray-500 hover:text-red-500 rounded-lg hover:bg-red-50"
                      title="Supprimer"
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
                Aucune offre trouvée
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
          Précédent
        </button>
        <button
          onClick={() => fetchJobs(jobPagination.page + 1)}
          disabled={jobs.length < jobPagination.limit || jobPagination.page === jobPagination.pages}
          className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          Suivant
        </button>
      </div>
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Affichage <span className="font-medium">{(jobPagination.page - 1) * jobPagination.limit + 1}</span> à{' '}
            <span className="font-medium">{(jobPagination.page - 1) * jobPagination.limit + jobs.length}</span> sur{' '}
            <span className="font-medium">{jobPagination.total}</span> offres
          </p>
        </div>
        <div>
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <button
              onClick={() => fetchJobs(jobPagination.page - 1)}
              disabled={jobPagination.page === 1}
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <span className="sr-only">Précédent</span>
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
              <span className="sr-only">Suivant</span>
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  </div>

  {viewModalOpen && (
    <ViewUserModal
      user={viewedUser}
      onClose={() => setViewModalOpen(false)}
    />
  )}
</>}

      {/* Job Form Modal */}
      {showJobForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-text-primary">Créer une nouvelle offre</h2>
              <button 
                onClick={() => setShowJobForm(false)}
                className="text-text-light hover:text-text-primary"
                disabled={isSubmitting}
              >
                ✕
              </button>
            </div>
            
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Section 1: Informations de base */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-text-primary">Informations de base</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Titre du poste *</label>
                    <input 
                      type="text" 
                      name="title"
                      className={`w-full p-3 border ${formErrors.title ? 'border-red-500' : 'border-secondary-300'} rounded-lg`}
                      placeholder="Ex: Serveur expérimenté"
                      value={formData.title}
                      onChange={handleInputChange}
                    />
                    {formErrors.title && <p className="mt-1 text-sm text-red-500">{formErrors.title}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Type de contrat *</label>
                    <select 
                      name="type"
                      className={`w-full p-3 border ${formErrors.type ? 'border-red-500' : 'border-secondary-300'} rounded-lg`}
                      value={formData.type}
                      onChange={handleInputChange}
                    >
                      <option value="">Sélectionner</option>
                      <option value="CDI">CDI</option>
                      <option value="CDD">CDD</option>
                      <option value="Extra">Extra</option>
                    </select>
                    {formErrors.type && <p className="mt-1 text-sm text-red-500">{formErrors.type}</p>}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Description du poste *</label>
                  <textarea 
                    name="description"
                    className={`w-full p-3 border ${formErrors.description ? 'border-red-500' : 'border-secondary-300'} rounded-lg min-h-[120px]`}
                    placeholder="Décrivez en détail le poste, les missions..."
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                  {formErrors.description && <p className="mt-1 text-sm text-red-500">{formErrors.description}</p>}
                </div>
              </div>
              
              {/* Section 2: Localisation */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-text-primary">Localisation</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Adresse *</label>
                    <input 
                      type="text" 
                      name="location.address"
                      className={`w-full p-3 border ${formErrors['location.address'] ? 'border-red-500' : 'border-secondary-300'} rounded-lg`}
                      placeholder="Ex: 12 Rue de la République"
                      value={formData.location.address}
                      onChange={handleInputChange}
                    />
                    {formErrors['location.address'] && <p className="mt-1 text-sm text-red-500">{formErrors['location.address']}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Ville *</label>
                    <input 
                      type="text" 
                      name="location.city"
                      className={`w-full p-3 border ${formErrors['location.city'] ? 'border-red-500' : 'border-secondary-300'} rounded-lg`}
                      placeholder="Ex: Tunis"
                      value={formData.location.city}
                      onChange={handleInputChange}
                    />
                    {formErrors['location.city'] && <p className="mt-1 text-sm text-red-500">{formErrors['location.city']}</p>}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Région *</label>
                  <select 
                    name="location.region"
                    className={`w-full p-3 border ${formErrors['location.region'] ? 'border-red-500' : 'border-secondary-300'} rounded-lg`}
                    value={formData.location.region}
                    onChange={handleInputChange}
                  >
                    <option value="">Sélectionner une région</option>
                    <option value="Tunis">Tunis</option>
                    <option value="Sousse">Sousse</option>
                    <option value="Sfax">Sfax</option>
                    <option value="Nabeul">Nabeul</option>
                    <option value="Autre">Autre</option>
                  </select>
                  {formErrors['location.region'] && <p className="mt-1 text-sm text-red-500">{formErrors['location.region']}</p>}
                </div>
              </div>
              
              {/* Section 3: Rémunération */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-text-primary">Rémunération</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Montant *</label>
                    <div className="relative">
                      <input 
                        type="number" 
                        name="salary.amount"
                        className={`w-full p-3 border ${formErrors['salary.amount'] ? 'border-red-500' : 'border-secondary-300'} rounded-lg pl-10`}
                        placeholder="Ex: 45"
                        value={formData.salary.amount}
                        onChange={handleInputChange}
                      />
                      <span className="absolute left-3 top-3.5 text-text-light">DT</span>
                    </div>
                    {formErrors['salary.amount'] && <p className="mt-1 text-sm text-red-500">{formErrors['salary.amount']}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Période *</label>
                    <select 
                      name="salary.period"
                      className="w-full p-3 border border-secondary-300 rounded-lg"
                      value={formData.salary.period}
                      onChange={handleInputChange}
                    >
                      <option value="heure">Par heure</option>
                      <option value="jour">Par jour</option>
                      <option value="mois">Par mois</option>
                    </select>
                  </div>
                </div>
              </div>
        
              
              {/* Section 5: Dates */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-text-primary">Dates importantes</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Date de début *</label>
                    <div className="relative">
                      <input 
                        type="date" 
                        name="dates.start"
                        className={`w-full p-3 border ${formErrors['dates.start'] ? 'border-red-500' : 'border-secondary-300'} rounded-lg`}
                        value={formData.dates.start}
                        onChange={handleInputChange}
                      />
                      <Calendar className="absolute right-3 top-3.5 w-5 h-5 text-text-light" />
                    </div>
                    {formErrors['dates.start'] && <p className="mt-1 text-sm text-red-500">{formErrors['dates.start']}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">
                      {formData.type === 'CDI' ? 'Date de fin (optionnel)' : 'Date de fin *'}
                    </label>
                    <div className="relative">
                      <input 
                        type="date" 
                        name="dates.end"
                        className={`w-full p-3 border ${formErrors['dates.end'] ? 'border-red-500' : 'border-secondary-300'} rounded-lg`}
                        value={formData.dates.end}
                        onChange={handleInputChange}
                        disabled={formData.type === 'CDI'}
                      />
                      <Calendar className="absolute right-3 top-3.5 w-5 h-5 text-text-light" />
                    </div>
                    {formErrors['dates.end'] && <p className="mt-1 text-sm text-red-500">{formErrors['dates.end']}</p>}
                  </div>
                </div>
              </div>
              
              {/* Section 6: Employeurs suggérés */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-text-primary">Employeurs suggérés *</h3>
                {formErrors.employer && <p className="text-sm text-red-500">{formErrors.employer}</p>}
                <div className="bg-secondary-50 p-4 rounded-lg">
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
<button 
type="button"

  onClick={applyUserFilters} // Changé de fetchUsers(1) à applyUserFilters
  className="mt-2 w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
>
  Rechercher des employeurs
</button>
    </div>
                  
                  {loadingUsers ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="w-8 h-8 animate-spin text-accent-500" />
                    </div>
                  ) : usersError ? (
                    <div className="text-red-500 text-center py-4">{usersError}</div>
                  ) : (
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {users.map(user => (
                        <div 
                          key={user._id} 
                          className={`flex items-center p-3 rounded-lg border ${formData.employer === user._id ? 'border-accent-500 bg-accent-50' : 'border-secondary-200 bg-white'} hover:border-accent-300 cursor-pointer`}
                          onClick={() => handleSelectEmployer(user)}
                        >
                          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                            {user.photo ? (
                              <img 
                                src={user.photo} 
                                alt={user.firstName} 
                                className="w-full h-full rounded-full object-cover"
                              />
                            ) : (
                              <User className="w-5 h-5 text-primary-500" />
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-text-primary">
                              {user.firstName} {user.lastName}
                            </h4>
                            <p className="text-sm text-text-light">
                              {user.experience || 'Indépendant'} • {user.address || 'Ville non précisée'}
                            </p>
                          </div>
                          {formData.employer === user._id && (
                            <div className="w-5 h-5 bg-accent-500 rounded-full flex items-center justify-center">
                              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowJobForm(false)}
                  className="px-6 py-2 border border-secondary-300 text-text-secondary rounded-lg hover:bg-secondary-50"
                  disabled={isSubmitting}
                >
                  Annuler
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2 bg-accent-500 text-white rounded-lg hover:bg-accent-600 flex items-center justify-center min-w-32"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    'Publier l\'offre'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyJobs;