import { useState, useEffect } from 'react';
import { 
  User,
  FileText,
  Clock,
  X,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Send,
  CheckCircle,
  Star,
  Search,
  MapPin,
  DollarSign,
  Calendar,
  Building2,
} from 'lucide-react';
import { API_URL, getAuthHeaders } from '../../api/config';
import { useLanguage } from '../../context/LanguageContext';
import './CandidateDashboard.css';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  photo?: string;
  userType?: string;
  companyName?: string;
  companyType?: string;
}

interface Job {
  _id: string;
  title: string;
  description: string;
  type: string;
  location: any;
  salary: any;
  requirements?: string[];
  dates: any;
  employer: any;
  status: string;
  publishDate: string;
}

const CandidateDashboard = () => {
  const { t } = useLanguage();
  const [user, setUser] = useState<User>({
    firstName: '',
    lastName: '',
    photo: '',
    companyName: '',
    companyType: '',
    _id: '',
    email: '',
    phone: ''
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
  const [jobs, setJobs] = useState<Job[]>([]);
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
    const url = new URL(`${API_URL}/jobs`);
    
    // Pour les candidats, on ne veut voir que les offres actives par défaut
    if (!jobFilters.status) {
      url.searchParams.append('status', 'active');
    }
    // Paramètres de base
    url.searchParams.append('page', page.toString());
    url.searchParams.append('limit', jobPagination.limit.toString());
    
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

const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

  const [activeTab, setActiveTab] = useState('overview');
  useEffect(() => {
    if (activeTab === 'jobs') {
      fetchJobs();
    }
  }, [activeTab, jobFilters]);

  const [stats] = useState({
    applications: 12,
    activeMissions: 2,
    completedMissions: 8,
    rating: 4.8
  });

  const renderOverview = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 p-6 rounded-2xl border border-blue-100 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600/80 mb-1">{t('stats.applications')}</p>
              <p className="text-3xl font-bold text-blue-900">{stats.applications}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-500 text-white flex items-center justify-center shadow-inner">
              <Send className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 p-6 rounded-2xl border border-purple-100 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600/80 mb-1">{t('stats.inProgress')}</p>
              <p className="text-3xl font-bold text-purple-900">{stats.activeMissions}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-500 text-white flex items-center justify-center shadow-inner">
              <Clock className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 p-6 rounded-2xl border border-emerald-100 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-emerald-600/80 mb-1">{t('stats.completed')}</p>
              <p className="text-3xl font-bold text-emerald-900">{stats.completedMissions}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-inner">
              <CheckCircle className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 p-6 rounded-2xl border border-amber-100 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-amber-600/80 mb-1">{t('stats.averageRating')}</p>
              <p className="text-3xl font-bold text-amber-900">{stats.rating}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-inner">
              <Star className="w-6 h-6" />
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

     
<div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
    {/* Filtre de recherche */}
    <div className="md:col-span-4">
      <label className="block text-xs font-semibold tracking-wider text-gray-500 uppercase mb-2">Recherche</label>
      <div className="relative">
        <input
          type="text"
          name="search"
          placeholder="Titre, mots-clés..."
          className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
          value={jobFilters.search}
          onChange={handleFilterChange}
        />
        <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
      </div>
    </div>
    
    {/* Filtre localisation */}
    <div className="md:col-span-3">
      <label className="block text-xs font-semibold tracking-wider text-gray-500 uppercase mb-2">Localisation</label>
      <div className="relative">
        <input
          type="text"
          name="location"
          placeholder="Ville ou région"
          className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
          value={jobFilters.location}
          onChange={handleFilterChange}
        />
        <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
      </div>
    </div>
    
    {/* Filtre type de contrat */}
    <div className="md:col-span-3">
      <label className="block text-xs font-semibold tracking-wider text-gray-500 uppercase mb-2">Contrat</label>
      <select
        name="type"
        className="w-full px-4 py-2.5 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 appearance-none"
        value={jobFilters.type}
        onChange={handleFilterChange}
      >
        <option value="">Tous</option>
        <option value="CDI">CDI</option>
        <option value="CDD">CDD</option>
        <option value="Extra">Extra</option>
      </select>
    </div>
    
    {/* Boutons d'action */}
    <div className="md:col-span-2 flex space-x-2 h-[46px]">
      <button
        onClick={resetFilters}
        className="flex-1 px-2 py-2 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center font-medium"
        title="Réinitialiser"
      >
        <X className="w-5 h-5" />
      </button>
      <button
        onClick={() => fetchJobs(1)}
        className="flex-[2] px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center font-medium"
      >
        Filtrer
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
                  <div key={job._id} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100 group">
                    <div className="p-6 md:p-8">
                      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{job.title}</h3>
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                              {job.type}
                            </span>
                            {job.publishDate && new Date(job.publishDate) > new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) && (
                              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
                                Nouveau
                              </span>
                            )}
                          </div>
                          
                          {job.employer && (
                            <p className="text-gray-600 font-medium mb-4 flex items-center">
                              <Building2 className="w-4 h-4 mr-2 text-gray-400" />
                              {job.employer.companyName || `${job.employer.firstName} ${job.employer.lastName}`}
                            </p>
                          )}
                          
                          <div className="flex flex-wrap gap-4 text-sm mb-5">
                            <div className="flex items-center text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                              <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                              {job.location?.city || job.location?.address}
                            </div>
                            <div className="flex items-center text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                              <DollarSign className="w-4 h-4 mr-1 text-gray-400" />
                              <span className="font-semibold text-gray-700">{job.salary?.amount}</span> DT <span className="text-gray-400 mx-1">/</span> {job.salary?.period}
                            </div>
                            <div className="flex items-center text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                              <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                              Dès le {new Date(job.dates.start).toLocaleDateString()}
                            </div>
                          </div>
                          
                          <p className="text-gray-600 leading-relaxed line-clamp-2">{job.description}</p>
                        </div>
                        
                        <div className="flex flex-col items-end shrink-0 gap-3 w-full md:w-auto">
                          <button
                            onClick={() => alert('Fonctionnalité Postuler à venir !')}
                            className="w-full md:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all duration-200 shadow-sm shadow-blue-600/20 hover:shadow-md hover:shadow-blue-600/30 flex items-center justify-center group/btn"
                          >
                            <span>Postuler</span>
                            <Send className="w-4 h-4 ml-2 transform group-hover/btn:translate-x-1 transition-transform" />
                          </button>
                          
                          <span className="text-xs text-gray-400">
                            Publié le {new Date(job.publishDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-8 text-text-secondary">
                  {t('dashboard.noJobs')}
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
            <div className="bg-white rounded-2xl shadow-lg p-8 sticky top-8 border border-gray-100">
              <div className="flex flex-col items-center text-center pb-8 border-b border-gray-100">
                <div className="w-28 h-28 rounded-full bg-blue-50 flex items-center justify-center overflow-hidden mb-4 border-4 border-white shadow-md">
                  {user.photo ? (
                    <img 
                      src={user.photo} 
                      alt={`${user.firstName} ${user.lastName}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '';
                        target.parentElement!.innerHTML = '<div class="w-full h-full flex items-center justify-center text-blue-500 font-bold text-3xl bg-blue-50">' + (user.firstName?.charAt(0) || '') + (user.lastName?.charAt(0) || '') + '</div>';
                      }}
                    />
                  ) : (
                    <User className="w-12 h-12 text-blue-400" />
                  )}
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {user?.firstName} {user?.lastName}
                </h3>
                <p className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full mb-3">{t('candidate')}</p>
                <div className="text-sm text-gray-500 w-full truncate px-2">{user?.email}</div>
                {user?.phone && <div className="text-sm text-gray-500 mt-1">{user?.phone}</div>}
              </div>

              <nav className="space-y-2 mt-6">
                {[
                  { id: 'overview', label: t('dashboard.overview'), icon: FileText },
                  { id: 'jobs', label: t('dashboard.jobs'), icon: Search },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center space-x-3 px-5 py-3.5 rounded-xl text-left transition-all duration-200 font-medium ${
                      activeTab === item.id
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-blue-100' : 'text-gray-400'}`} />
                    <span>{item.label}</span>
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