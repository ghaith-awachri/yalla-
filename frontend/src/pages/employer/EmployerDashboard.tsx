import { useState, useEffect } from 'react';

import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  MessageSquare, 
  Settings,
  Bell,
  Search,
  PlusCircle,
  LogOut
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';
import { API_URL } from '../../api/config';
import './EmployerDashboard.css';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  photo?: string;
  companyName?: string;
  companyType?: string;
  userType: string;
}

// @ts-ignore
import Overview from './Overview';
// @ts-ignore
import MyJobs from './MyJobs';
// @ts-ignore
import Applications from './Applications';
// @ts-ignore
import Candidates from './Candidates';

const EmployerDashboard = () => {
  const [user, setUser] = useState<User>({
    _id: '',
    firstName: '',
    lastName: '',
    photo: '',
    companyName: '',
    companyType: '',
    userType: 'employer'
  });

  const location = useLocation();


    useEffect(() => {
      // Vérifier si l'utilisateur est connecté
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      
      if (token && userStr) {
        try {
          const parsedUser = JSON.parse(userStr);
          setUser(parsedUser);
          fetchDashboardData(parsedUser._id);
        } catch (error) {
          console.error('Error parsing user data:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
    }, [location]);

  const [activeTab, setActiveTab] = useState('overview');
  const [showJobForm, setShowJobForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    activeJobs: 0,
    applications: 0,
    activeMissions: 0,
    favorites: 0,
  });

  const [myJobs, setMyJobs] = useState<any[]>([]);
  const [recentApplications, setRecentApplications] = useState<any[]>([]);
  const [candidates, setCandidates] = useState<any[]>([]);

  const fetchDashboardData = async (userId: string) => {
    setLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      };

      // Fetch Jobs
      const jobsRes = await axios.get(`${API_URL}/jobs?owner=${userId}`, config);
      const jobs = jobsRes.data.jobs || [];
      setMyJobs(jobs);

      // Fetch Applications
      const appsRes = await axios.get(`${API_URL}/applications?employer=${userId}`, config);
      const apps = appsRes.data.applications || [];
      
      // Transform applications for UI if needed
      const transformedApps = apps.map((app: any) => ({
        id: app._id,
        candidateName: `${app.candidate?.firstName} ${app.candidate?.lastName}`,
        jobTitle: app.job?.title,
        experience: app.candidate?.experience || 'N/A',
        rating: app.candidate?.rating || 0,
        appliedDate: new Date(app.createdAt).toLocaleDateString(),
        status: app.status,
        skills: app.candidate?.skills || [],
        message: app.coverLetter || 'Aucun message',
        photo: app.candidate?.photo
      }));
      setRecentApplications(transformedApps);

      // Fetch Candidates
      const candidatesRes = await axios.get(`${API_URL}/users?userType=candidate`, config);
      setCandidates(candidatesRes.data.users || []);

      // Calculate Stats
      setStats({
        activeJobs: jobs.filter((j: any) => j.status === 'active' || j.status === 'pending').length,
        applications: transformedApps.length,
        activeMissions: jobs.filter((j: any) => j.status === 'filled').length,
        favorites: 0, 
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };
  const getPhotoUrl = (photoPath: string | undefined) => {
    if (!photoPath) return null;
    if (photoPath.startsWith('http') || photoPath.startsWith('data:')) return photoPath;
    const normalizedPath = photoPath.replace(/\\/g, '/');
    if (normalizedPath.includes('uploads')) {
      return normalizedPath.startsWith('/') ? normalizedPath : `/${normalizedPath}`;
    }
    return `${import.meta.env.VITE_API_URL}/${normalizedPath}`;
  };

  const getApplicationStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'bg-success-100 text-success-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'reviewed': return 'bg-primary-100 text-primary-700';
      case 'rejected': return 'bg-danger-100 text-danger-700';
      default: return 'bg-secondary-100 text-secondary-700';
    }
  };

  const getApplicationStatusText = (status: string) => {
    switch (status) {
      case 'accepted': return 'Acceptée';
      case 'pending': return 'En attente';
      case 'reviewed': return 'Examinée';
      case 'rejected': return 'Refusée';
      default: return status;
    }
  };

  const handleApplicationAction = (applicationId: number, action: string) => {
    setRecentApplications(applications =>
      applications.map((app: any) =>
        app.id === applicationId
          ? { ...app, status: action }
          : app
      )
    );
  };



  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center py-48 space-y-6">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin shadow-lg shadow-blue-200"></div>
          <div className="text-center space-y-2">
            <h3 className="text-xl font-black text-slate-900">Synchronisation...</h3>
            <p className="text-slate-500 font-medium animate-pulse">Nous récupérons vos dernières données de recrutement</p>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'overview':
        return <Overview stats={stats} recentApplications={recentApplications} setShowJobForm={setShowJobForm} setActiveTab={setActiveTab} />;
      case 'jobs':
        return <MyJobs myJobs={myJobs} showJobForm={showJobForm} setShowJobForm={setShowJobForm} />;
      case 'applications':
        return <Applications 
          recentApplications={recentApplications} 
          handleApplicationAction={handleApplicationAction} 
          getApplicationStatusColor={getApplicationStatusColor} 
          getApplicationStatusText={getApplicationStatusText} 
          getPhotoUrl={getPhotoUrl}
        />;
      case 'candidates':
        return <Candidates candidates={candidates} getPhotoUrl={getPhotoUrl} />;
      case 'messages':
        return (
          <div className="flex flex-col items-center justify-center py-32 space-y-6 animate-in fade-in">
            <div className="w-20 h-20 bg-blue-50 rounded-[2rem] flex items-center justify-center">
              <MessageSquare className="w-10 h-10 text-blue-600" />
            </div>
            <h2 className="text-2xl font-black text-slate-900">Messagerie</h2>
            <p className="text-slate-500 font-medium text-center max-w-md">Votre messagerie sera bientôt disponible. Vous pourrez discuter directement avec vos candidats.</p>
          </div>
        );
      case 'settings':
        return (
          <div className="flex flex-col items-center justify-center py-32 space-y-6 animate-in fade-in">
            <div className="w-20 h-20 bg-slate-100 rounded-[2rem] flex items-center justify-center">
              <Settings className="w-10 h-10 text-slate-600" />
            </div>
            <h2 className="text-2xl font-black text-slate-900">Configuration</h2>
            <p className="text-slate-500 font-medium text-center max-w-md">Gérez vos paramètres de compte et préférences de notification ici.</p>
          </div>
        );
      default:
        return <Overview stats={stats} setShowJobForm={setShowJobForm} setActiveTab={setActiveTab} recentApplications={recentApplications} />;
    }
  };

  return (
    <div className="bg-[#f8fafc] flex flex-col lg:flex-row relative">
      {/* Sidebar Overlay for mobile */}
      <div className="lg:hidden fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 hidden"></div>

      {/* Modern Sidebar - Now Sticky and respects Header */}
      <aside className="lg:sticky lg:top-16 w-full lg:w-80 bg-white border-r border-slate-100 z-40 lg:h-[calc(100vh-64px)] overflow-y-auto no-scrollbar flex flex-col transition-all duration-300">
        <div className="flex flex-col h-full p-8">
          {/* Profile Card - Enhanced */}
          <div className="relative group mb-10">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[2rem] blur opacity-10 group-hover:opacity-20 transition duration-500"></div>
            <div className="relative bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm flex items-center space-x-4">
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 overflow-hidden flex items-center justify-center border-2 border-white shadow-sm">
                  {user?.photo ? (
                    <img src={getPhotoUrl(user.photo) || ''} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <Users className="w-7 h-7 text-slate-400" />
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full"></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-black text-slate-900 truncate">{user?.firstName} {user?.lastName || 'Employeur'}</p>
                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest truncate">{user?.companyName || 'MODE RECRUTEUR'}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2 overflow-y-auto no-scrollbar">
            <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Menu Principal</p>
            {[
              { id: 'overview', label: 'Tableau de bord', icon: LayoutDashboard },
              { id: 'jobs', label: 'Mes annonces', icon: Briefcase },
              { id: 'applications', label: 'Candidatures', icon: Users },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
                  activeTab === item.id
                    ? 'bg-slate-900 text-white shadow-xl shadow-slate-200 translate-x-1'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-blue-600'
                }`}
              >
                <item.icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${activeTab === item.id ? 'text-white' : 'text-slate-400 group-hover:text-blue-500'}`} />
                <span className="text-sm font-bold">{item.label}</span>
                {item.id === 'applications' && stats.applications > 0 && (
                  <span className={`ml-auto px-2 py-0.5 rounded-full text-[10px] font-bold ${activeTab === item.id ? 'bg-white/20 text-white' : 'bg-blue-50 text-blue-600'}`}>
                    {stats.applications}
                  </span>
                )}
              </button>
            ))}

            <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 mt-8">Paramètres</p>
            {[
              { id: 'messages', label: 'Messages', icon: MessageSquare },
              { id: 'settings', label: 'Configuration', icon: Settings },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
                  activeTab === item.id
                    ? 'bg-slate-900 text-white shadow-xl shadow-slate-200 translate-x-1'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-blue-600'
                }`}
              >
                <item.icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${activeTab === item.id ? 'text-white' : 'text-slate-400 group-hover:text-blue-500'}`} />
                <span className="text-sm font-bold">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Logout Section */}
          <div className="mt-auto pt-6 border-t border-slate-100">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3.5 rounded-2xl text-rose-600 hover:bg-rose-50 transition-all duration-300 group"
            >
              <LogOut className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
              <span className="text-sm font-bold">Déconnexion</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-h-screen relative flex flex-col">
        {/* Dashboard Top Header - Sticky below global header */}
        <header className="sticky top-16 bg-white/80 backdrop-blur-md border-b border-slate-100 z-30 px-8 py-5 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="md:flex items-center px-4 py-1.5 bg-blue-50 text-blue-700 rounded-full border border-blue-100 space-x-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
              <span className="text-[10px] font-black uppercase tracking-widest">Espace Recruteur</span>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="relative group hidden sm:block">
              <input 
                type="text" 
                placeholder="Rechercher..." 
                className="pl-11 pr-4 py-2.5 bg-slate-50 border border-transparent focus:border-blue-500 focus:bg-white rounded-xl text-sm font-medium transition-all w-72"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-blue-500 transition-colors" />
            </div>
            
            <button className="p-3 text-slate-500 hover:bg-slate-50 rounded-xl transition-all relative group">
              <Bell className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              <span className="absolute top-3 right-3 w-2 h-2 bg-rose-500 border-2 border-white rounded-full"></span>
            </button>
            
            <button 
              onClick={() => {
                setActiveTab('jobs');
                setShowJobForm(true);
              }}
              className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow-xl shadow-blue-200 transition-all hover:-translate-y-0.5 active:translate-y-0"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="text-sm font-black whitespace-nowrap tracking-tight">Nouvelle Offre</span>
            </button>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="p-8 flex-1">
          <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default EmployerDashboard;