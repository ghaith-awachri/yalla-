import React, { useState, useEffect } from 'react';
import { 
  User, 
  Bell, 
  FileText, 
  Star, 
  Settings, 
  Search,
  Calendar,
  MapPin,
  DollarSign,
  Clock,
  CheckCircle,
  Award,
  TrendingUp,
  Bookmark,
  Send,
  Eye,
  Heart,
  Filter,
  Plus,
  X,
  ChevronLeft, 
  ChevronRight, 
  Loader2,
  Edit,  
  Trash2, 
  Briefcase,
} from 'lucide-react';
import './CandidateDashboard.css';

const CandidateDashboard = () => {
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    photo: '',
    companyName: '',
    companyType: '',
    _id: ''
  });

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
  }, []);

  const [loadingJobs, setLoadingJobs] = useState(false);
  const [jobsError, setJobsError] = useState('');
  const [jobs, setJobs] = useState([]);
  const [jobPagination, setJobPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1
  });
// CandidateDashboard.js
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

const fetchJobs = async (page = 1) => {
  setLoadingJobs(true);
  setJobsError('');
  
  try {
    const url = new URL(`http://localhost:5000/api/jobs?employer=${user._id}`);
    
    // Paramètres de base
    url.searchParams.append('page', page.toString());
    url.searchParams.append('limit', jobPagination.limit.toString());
    
    // Ajouter tous les filtres
    Object.entries(jobFilters).forEach(([key, value]) => {
      if (value) url.searchParams.append(key, value);
    });

    const response = await fetch(url.toString(), {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    setJobs(data.jobs);
    setJobPagination({
      page,
      limit: jobPagination.limit,
      total: data.total,
      pages: Math.ceil(data.total / jobPagination.limit)
    });
  } catch (err) {
    setJobsError('Failed to load jobs');
    console.error('Fetch error:', err);
  } finally {
    setLoadingJobs(false);
  }
};

const handleFilterChange = (e) => {
  const { name, value } = e.target;
  setJobFilters(prev => ({
    ...prev,
    [name]: value
  }));
};

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

  const [activeTab, setActiveTab] = useState('overview');
  useEffect(() => {
    if (activeTab === 'jobs') {
      fetchJobs();
    }
  }, [activeTab, jobFilters]);

  const [stats, setStats] = useState({
    applications: 12,
    activeMissions: 2,
    completedMissions: 8,
    rating: 4.8
  });

  const renderOverview = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary mb-1">Candidatures envoyées</p>
              <p className="text-2xl font-bold text-text-primary">{stats.applications}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center">
              <Send className="w-6 h-6 text-primary-500" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary mb-1">Missions en cours</p>
              <p className="text-2xl font-bold text-text-primary">{stats.activeMissions}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-accent-50 flex items-center justify-center">
              <Clock className="w-6 h-6 text-accent-500" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary mb-1">Missions complétées</p>
              <p className="text-2xl font-bold text-text-primary">{stats.completedMissions}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-success-50 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-success-500" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary mb-1">Note moyenne</p>
              <p className="text-2xl font-bold text-text-primary">{stats.rating}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-yellow-50 flex items-center justify-center">
              <Star className="w-6 h-6 text-yellow-500" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <div className="text-center">
            <Search className="w-12 h-12 text-accent-500 mx-auto mb-4" />
            <h3 className="font-semibold text-text-primary mb-2">Rechercher des offres</h3>
            <p className="text-sm text-text-secondary mb-4">Trouvez de nouvelles opportunités</p>
            <button 
              onClick={() => setActiveTab('jobs')}
              className="w-full bg-accent-500 text-white py-2 rounded-lg hover:bg-accent-600 transition-colors"
            >
              Parcourir les offres
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <div className="text-center">
            <FileText className="w-12 h-12 text-primary-500 mx-auto mb-4" />
            <h3 className="font-semibold text-text-primary mb-2">Mettre à jour mon profil</h3>
            <p className="text-sm text-text-secondary mb-4">Améliorez votre visibilité</p>
            <button 
              onClick={() => setActiveTab('profile')}
              className="w-full bg-primary-500 text-white py-2 rounded-lg hover:bg-primary-600 transition-colors"
            >
              Modifier le profil
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderJobs = () => {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-text-primary">Offres d'emploi</h2>
            <p className="text-text-secondary mt-1">Parcourez toutes les offres disponibles</p>
          </div>
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
        <option value="accepted">accepted</option>
        <option value="Refused">Refused</option>
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
        {loadingJobs ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-accent-500" />
          </div>
        ) : jobsError ? (
          <div className="text-red-500 text-center py-6">{jobsError}</div>
        ) : (
          <>
            <div className="grid gap-6">
              {jobs.length > 0 ? (
                jobs.map(job => (
                  <div key={job._id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                    <div className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-bold text-text-primary">Poste: {job.title}</h3>
                          <p className="text-text-secondary mt-1">
                            <MapPin className="inline w-4 h-4 mr-1" />
                            <span className="font-medium">Localisation:</span> {job.location?.address}, {job.location?.city} ({job.location?.region})
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getJobStatusColor(job.status)}`}>
                          Statut: {getJobStatusText(job.status)}
                        </span>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-4">
                        <div className="flex items-center text-text-secondary">
                          <Briefcase className="w-4 h-4 mr-1" />
                          <span className="font-medium">Type:</span> {job.type}
                        </div>
                        <div className="flex items-center text-text-secondary">
                          <DollarSign className="w-4 h-4 mr-1" />
                          <span className="font-medium">Salaire:</span> {job.salary?.amount} DT/{job.salary?.period}
                        </div>
                  
                        <div className="flex items-center text-text-secondary">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span className="font-medium">Début:</span> {new Date(job.dates.start).toLocaleDateString()}
                        </div>
                        {job.dates.end && (
                          <div className="flex items-center text-text-secondary">
                            <Calendar className="w-4 h-4 mr-1" />
                            <span className="font-medium">Fin:</span> {new Date(job.dates.end).toLocaleDateString()}
                          </div>
                        )}
                      </div>

                      <div className="mt-4">
                        <p className="text-text-secondary font-medium">Description:</p>
                        <p className="text-text-secondary mt-1 line-clamp-2">{job.description}</p>
                      </div>

                      <div className="mt-6 flex justify-between items-center">
                        <div className="text-sm text-text-light">
                          <span className="font-medium">Publié le:</span> {new Date(job.publishDate).toLocaleDateString()}
                        </div>
                        
<div className="flex items-center space-x-3">
  {/* Bouton Accepter */}
  <button
    onClick={() => handleJobAction(job._id, 'accepted')}
    className={`p-2 rounded-xl transition-all duration-200 
      ${job.status === 'accepted' 
        ? 'text-green-500 bg-green-100 cursor-not-allowed opacity-60' 
        : 'text-gray-500 hover:text-green-600 hover:bg-green-50'}`}
    title="Accepter"
    disabled={job.status === 'accepted'}
  >
    <CheckCircle className="w-5 h-5" />
  </button>

  {/* Bouton Refuser */}
  <button
    onClick={() => handleJobAction(job._id, 'Refused')}
    className={`p-2 rounded-xl transition-all duration-200 
      ${job.status === 'Refused' 
        ? 'text-red-500 bg-red-100 cursor-not-allowed opacity-60' 
        : 'text-gray-500 hover:text-red-600 hover:bg-red-50'}`}
    title="Refuser"
    disabled={job.status === 'Refused'}
  >
    <X className="w-5 h-5" />
  </button>


</div>

                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-8 text-text-secondary">
                  Aucune offre disponible
                </div>
              )}
            </div>

            {jobs.length > 0 && jobPagination.total > jobPagination.limit && (
              <div className="flex justify-center items-center space-x-4 mt-6">
                <button
                  onClick={() => fetchJobs(jobPagination.page - 1)}
                  disabled={jobPagination.page === 1}
                  className={`p-2 rounded-full ${jobPagination.page === 1 ? 'text-gray-400' : 'text-primary-500 hover:bg-primary-50'}`}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                <span className="text-text-secondary">
                  Page {jobPagination.page} sur {jobPagination.pages}
                </span>
                
                <button
                  onClick={() => fetchJobs(jobPagination.page + 1)}
                  disabled={jobPagination.page === jobPagination.pages}
                  className={`p-2 rounded-full ${jobPagination.page === jobPagination.pages ? 'text-gray-400' : 'text-primary-500 hover:bg-primary-50'}`}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return renderOverview();
      case 'jobs': return renderJobs();
      default: return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
              <div className="employer-profile-card">
                <div className="employer-avatar-container">
                  <div className="employer-avatar-wrapper">
                    <img 
                      src={user.photo} 
                      alt={`${user.firstName} ${user.lastName}`}
                      className="employer-avatar-image"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '';
                        target.className = 'employer-avatar-image employer-avatar-fallback';
                        target.textContent = user.firstName?.charAt(0) + user.lastName?.charAt(0);
                      }}
                    />
                  </div>
                </div>
                <div className="employer-info">
                  <h3 className="employer-name">
                    {user?.firstName} {user?.lastName}
                  </h3>
                  <h3 className="employer-status">{user?.email}</h3>
                  <div className="employer-rating">
                    <span className="rating-value">{user?.phone}</span>
                  </div>
                </div>
              </div>

              <nav className="space-y-2">
                {[
                  { id: 'overview', label: 'Vue d\'ensemble', icon: FileText },
                  { id: 'jobs', label: 'Offres disponibles', icon: Search },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === item.id
                        ? 'bg-primary-50 text-primary-500 border-r-2 border-primary-500'
                        : 'text-text-secondary hover:bg-secondary-50'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-8">


            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateDashboard;