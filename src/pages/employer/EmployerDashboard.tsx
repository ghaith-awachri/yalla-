import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import {
  FileText,
  Users,
  Clock,
  Star,
  PlusCircle,
  Search,
  BarChart3,
  Building2,
  Calendar,
  Settings,
  Award,
  
} from 'lucide-react';
import './EmployerDashboard.css';

import Overview from './Overview';
import MyJobs from './MyJobs';
import Applications from './Applications';
import Candidates from './Candidates';

const EmployerDashboard = () => {
    const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    photo: '',
    companyName:'',
    companyType:'',

    // other default properties
  });


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
  const [activeTab, setActiveTab] = useState('overview');
  const [showJobForm, setShowJobForm] = useState(false);

  const [stats, setStats] = useState({
    activeJobs: 5,
    applications: 24,
    activeMissions: 3,
    favorites: 7,
  });

  const [myJobs, setMyJobs] = useState([
    {
      id: 1,
      title: 'Serveur(se) expérimenté(e)',
      type: 'Extra',
      location: 'Tunis Centre',
      salary: '45 DT/jour',
      applications: 8,
      status: 'active',
      publishDate: '2024-01-15',
      views: 45,
      description: 'Recherche serveur expérimenté pour service en salle...'
    },
 
    
  ]);

  const [recentApplications, setRecentApplications] = useState([
    {
      id: 1,
      candidateName: 'Ahmed Ben Ali',
      jobTitle: 'Serveur expérimenté',
      experience: '5 ans',
      rating: 4.8,
      appliedDate: '2024-01-15',
      status: 'pending',
      skills: ['Service client', 'Français', 'Anglais'],
      message: 'Très motivé pour rejoindre votre équipe...'
    },
    {
      id: 2,
      candidateName: 'Fatma Trabelsi',
      jobTitle: 'Chef de partie',
      experience: '3 ans',
      rating: 4.5,
      appliedDate: '2024-01-14',
      status: 'reviewed',
      skills: ['Cuisine française', 'Management', 'Créativité'],
      message: 'Passionnée de cuisine gastronomique...'
    },
    {
      id: 3,
      candidateName: 'Mohamed Sassi',
      jobTitle: 'Commis de cuisine',
      experience: '2 ans',
      rating: 4.2,
      appliedDate: '2024-01-13',
      status: 'accepted',
      skills: ['Cuisine de base', 'Rapidité', 'Apprentissage'],
      message: 'Prêt à apprendre et évoluer...'
    }
  ]);

  const [candidates, setCandidates] = useState([
    {
      id: 1,
      name: 'Sarah Mansouri',
      experience: '4 ans',
      rating: 4.9,
      location: 'Tunis',
      skills: ['Service VIP', 'Langues', 'Management'],
      availability: 'Immédiate',
      lastActive: '2h'
    },
    {
      id: 2,
      name: 'Karim Bouazizi',
      experience: '6 ans',
      rating: 4.7,
      location: 'Sousse',
      skills: ['Chef cuisinier', 'Pâtisserie', 'Innovation'],
      availability: '1 semaine',
      lastActive: '1d'
    }
  ]);

  const getJobStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-success-100 text-success-700';
      case 'paused': return 'bg-yellow-100 text-yellow-700';
      case 'filled': return 'bg-primary-100 text-primary-700';
      case 'closed': return 'bg-secondary-100 text-secondary-700';
      default: return 'bg-secondary-100 text-secondary-700';
    }
  };

  const getJobStatusText = (status) => {
    switch (status) {
      case 'active': return 'Active';
      case 'paused': return 'En pause';
      case 'filled': return 'Pourvue';
      case 'closed': return 'Fermée';
      default: return status;
    }
  };

  const getApplicationStatusColor = (status) => {
    switch (status) {
      case 'accepted': return 'bg-success-100 text-success-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'reviewed': return 'bg-primary-100 text-primary-700';
      case 'rejected': return 'bg-danger-100 text-danger-700';
      default: return 'bg-secondary-100 text-secondary-700';
    }
  };

  const getApplicationStatusText = (status) => {
    switch (status) {
      case 'accepted': return 'Acceptée';
      case 'pending': return 'En attente';
      case 'reviewed': return 'Examinée';
      case 'rejected': return 'Refusée';
      default: return status;
    }
  };

  const handleApplicationAction = (applicationId, action) => {
    setRecentApplications(applications =>
      applications.map(app =>
        app.id === applicationId
          ? { ...app, status: action }
          : app
      )
    );
  };

  const handleJobAction = (jobId, action) => {
    if (action === 'delete') {
      if (window.confirm('Êtes-vous sûr de vouloir supprimer cette offre ?')) {
        setMyJobs(jobs => jobs.filter(job => job.id !== jobId));
      }
    } else {
      setMyJobs(jobs =>
        jobs.map(job =>
          job.id === jobId
            ? { ...job, status: action }
            : job
        )
      );
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <Overview stats={stats} setShowJobForm={setShowJobForm} setActiveTab={setActiveTab} />;
  case 'jobs':
  return <MyJobs 
    myJobs={myJobs} 
    handleJobAction={handleJobAction} 
    getJobStatusColor={getJobStatusColor} 
    getJobStatusText={getJobStatusText}
    showJobForm={showJobForm}
    setShowJobForm={setShowJobForm}
  />;
      case 'applications':
        return <Applications 
          recentApplications={recentApplications} 
          handleApplicationAction={handleApplicationAction} 
          getApplicationStatusColor={getApplicationStatusColor} 
          getApplicationStatusText={getApplicationStatusText} 
        />;
      case 'candidates':
        return <Candidates candidates={candidates} />;
      default:
        return <Overview stats={stats} setShowJobForm={setShowJobForm} setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
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
    <p className="employer-status">{user?.companyName}</p>
    <div className="employer-rating">

      <span className="rating-value">{user?.companyType}</span>
    </div>
  </div>
</div>

              <nav className="space-y-2">
                {[
                  { id: '', label: 'Vue d\'ensemble', icon: FileText },
                  { id: 'jobs', label: 'Mes annonces', icon: FileText },
                  { id: 'applications', label: 'Candidatures', icon: Users },
                  { id: 'candidates', label: 'Rechercher candidats', icon: Search },
                  { id: 'calendar', label: 'Planning', icon: Calendar },
                  { id: 'favorites', label: 'Talents favoris', icon: Star },
                  { id: 'company', label: 'Mon entreprise', icon: Building2 },
                  { id: 'settings', label: 'Paramètres', icon: Settings }
                ].map(item => (
                  <Link
                    key={item.id}
                    to={`/employer/${item.id}`}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === item.id
                        ? 'bg-primary-50 text-primary-500 border-r-2 border-primary-500'
                        : 'text-text-secondary hover:bg-secondary-50'
                    }`}
                    onClick={() => setActiveTab(item.id)}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                ))}
              </nav>

              <div className="mt-8 p-4 bg-gradient-to-br from-accent-50 to-accent-100 rounded-lg">
                <div className="text-center">
                  <Award className="w-8 h-8 text-accent-500 mx-auto mb-2" />
                  <p className="text-sm font-medium text-accent-900">Pack Recruteur Actif</p>
                  <p className="text-xs text-accent-700 mt-1">Publications illimitées</p>
                  <button className="mt-3 text-xs bg-accent-500 text-white px-3 py-1 rounded-full hover:bg-accent-600 transition-colors">
                    Améliorer
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            <div className="min-h-screen bg-secondary-50">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard;