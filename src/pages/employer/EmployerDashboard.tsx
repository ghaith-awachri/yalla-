import React, { useState } from 'react';
import { 
  Building2, 
  Users, 
  FileText, 
  Star, 
  Settings, 
  PlusCircle,
  Search,
  Calendar,
  MapPin,
  DollarSign,
  Clock,
  CheckCircle,
  Award,
  TrendingUp,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';

const EmployerDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { label: 'Annonces actives', value: '5', icon: FileText, color: 'text-primary-500' },
    { label: 'Candidatures reçues', value: '24', icon: Users, color: 'text-accent-500' },
    { label: 'Missions en cours', value: '3', icon: Clock, color: 'text-success-500' },
    { label: 'Talents favoris', value: '7', icon: Star, color: 'text-yellow-500' }
  ];

  const myJobs = [
    {
      id: 1,
      title: 'Serveur(se) expérimenté(e)',
      type: 'Extra',
      location: 'Tunis Centre',
      salary: '45 DT/jour',
      applications: 8,
      status: 'active',
      publishDate: '2024-01-15'
    },
    {
      id: 2,
      title: 'Chef de partie',
      type: 'CDD',
      location: 'Sousse',
      salary: '1200 DT/mois',
      applications: 12,
      status: 'paused',
      publishDate: '2024-01-14'
    },
    {
      id: 3,
      title: 'Commis de cuisine',
      type: 'CDI',
      location: 'Tunis',
      salary: '800 DT/mois',
      applications: 15,
      status: 'filled',
      publishDate: '2024-01-10'
    }
  ];

  const recentApplications = [
    {
      id: 1,
      candidateName: 'Ahmed Ben Ali',
      jobTitle: 'Serveur expérimenté',
      experience: '5 ans',
      rating: 4.8,
      appliedDate: '2024-01-15',
      status: 'pending'
    },
    {
      id: 2,
      candidateName: 'Fatma Trabelsi',
      jobTitle: 'Chef de partie',
      experience: '3 ans',
      rating: 4.5,
      appliedDate: '2024-01-14',
      status: 'reviewed'
    },
    {
      id: 3,
      candidateName: 'Mohamed Sassi',
      jobTitle: 'Commis de cuisine',
      experience: '2 ans',
      rating: 4.2,
      appliedDate: '2024-01-13',
      status: 'accepted'
    }
  ];

  const getJobStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-success-500 bg-success-100';
      case 'paused': return 'text-yellow-500 bg-yellow-100';
      case 'filled': return 'text-primary-500 bg-primary-100';
      case 'closed': return 'text-text-light bg-secondary-100';
      default: return 'text-text-light bg-secondary-100';
    }
  };

  const getJobStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Active';
      case 'paused': return 'En pause';
      case 'filled': return 'Pourvue';
      case 'closed': return 'Fermée';
      default: return status;
    }
  };

  const getApplicationStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'text-success-500 bg-success-100';
      case 'pending': return 'text-yellow-500 bg-yellow-100';
      case 'reviewed': return 'text-primary-500 bg-primary-100';
      case 'rejected': return 'text-danger-500 bg-danger-100';
      default: return 'text-text-light bg-secondary-100';
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

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building2 className="w-10 h-10 text-primary-500" />
                </div>
                <h3 className="font-semibold text-text-primary">Restaurant Le Méditerranéen</h3>
                <p className="text-sm text-text-secondary">Employeur Premium</p>
                <div className="flex items-center justify-center mt-2">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm text-text-secondary ml-1">4.6/5</span>
                </div>
              </div>

              <nav className="space-y-2">
                {[
                  { id: 'overview', label: 'Vue d\'ensemble', icon: FileText },
                  { id: 'jobs', label: 'Mes annonces', icon: FileText },
                  { id: 'applications', label: 'Candidatures', icon: Users },
                  { id: 'candidates', label: 'Rechercher candidats', icon: Search },
                  { id: 'favorites', label: 'Talents favoris', icon: Star },
                  { id: 'company', label: 'Mon entreprise', icon: Building2 },
                  { id: 'settings', label: 'Paramètres', icon: Settings }
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
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div>
                <h1 className="text-3xl font-bold text-text-primary">Espace Employeur</h1>
                <p className="text-text-secondary mt-1">Gérez vos recrutements et trouvez les meilleurs talents</p>
              </div>
              <button className="mt-4 sm:mt-0 bg-accent-500 text-white px-6 py-3 rounded-lg hover:bg-accent-600 transition-colors flex items-center space-x-2">
                <PlusCircle className="w-5 h-5" />
                <span>Publier une offre</span>
              </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-text-secondary mb-1">{stat.label}</p>
                      <p className="text-2xl font-bold text-text-primary">{stat.value}</p>
                    </div>
                    <div className={`w-12 h-12 rounded-full bg-secondary-50 flex items-center justify-center ${stat.color}`}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* My Jobs */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-6 border-b border-secondary-100">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-text-primary">Mes annonces</h2>
                  <button className="text-primary-500 hover:text-primary-600 font-medium">
                    Voir toutes →
                  </button>
                </div>
              </div>
              
              <div className="divide-y divide-secondary-100">
                {myJobs.map((job) => (
                  <div key={job.id} className="p-6 hover:bg-secondary-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-text-primary">{job.title}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getJobStatusColor(job.status)}`}>
                            {getJobStatusText(job.status)}
                          </span>
                          <span className="px-2 py-1 bg-accent-100 text-accent-700 text-xs font-medium rounded-full">
                            {job.type}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-text-light mb-2">
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>{job.location}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <DollarSign className="w-4 h-4" />
                            <span>{job.salary}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span>{job.applications} candidatures</span>
                          </div>
                        </div>
                        <p className="text-sm text-text-light">Publié le {job.publishDate}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button className="p-2 text-text-light hover:text-primary-500 rounded-lg hover:bg-primary-50">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-text-light hover:text-accent-500 rounded-lg hover:bg-accent-50">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-text-light hover:text-danger-500 rounded-lg hover:bg-danger-50">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Applications */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-6 border-b border-secondary-100">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-text-primary">Candidatures récentes</h2>
                  <button className="text-primary-500 hover:text-primary-600 font-medium">
                    Voir toutes →
                  </button>
                </div>
              </div>
              
              <div className="divide-y divide-secondary-100">
                {recentApplications.map((application) => (
                  <div key={application.id} className="p-6 hover:bg-secondary-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-text-primary">{application.candidateName}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getApplicationStatusColor(application.status)}`}>
                            {getApplicationStatusText(application.status)}
                          </span>
                        </div>
                        <p className="text-text-secondary mb-1">Candidature pour : {application.jobTitle}</p>
                        <div className="flex items-center space-x-4 text-sm text-text-light">
                          <span>Expérience : {application.experience}</span>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span>{application.rating}/5</span>
                          </div>
                          <span>Candidaté le {application.appliedDate}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button className="px-4 py-2 border border-primary-500 text-primary-500 rounded-lg hover:bg-primary-50 transition-colors">
                          Voir profil
                        </button>
                        {application.status === 'pending' && (
                          <>
                            <button className="px-4 py-2 bg-success-500 text-white rounded-lg hover:bg-success-600 transition-colors">
                              Accepter
                            </button>
                            <button className="px-4 py-2 bg-danger-500 text-white rounded-lg hover:bg-danger-600 transition-colors">
                              Refuser
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard;