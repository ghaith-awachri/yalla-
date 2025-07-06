import React, { useState } from 'react';
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
  Send
} from 'lucide-react';

const CandidateDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { label: 'Candidatures envoyées', value: '12', icon: FileText, color: 'text-primary-500' },
    { label: 'Missions en cours', value: '2', icon: Clock, color: 'text-accent-500' },
    { label: 'Missions complétées', value: '8', icon: CheckCircle, color: 'text-success-500' },
    { label: 'Note moyenne', value: '4.8', icon: Star, color: 'text-yellow-500' }
  ];

  const availableJobs = [
    {
      id: 1,
      title: 'Serveur(se) expérimenté(e)',
      company: 'Restaurant Le Méditerranéen',
      location: 'Tunis Centre',
      type: 'Extra',
      salary: '45 DT/jour',
      date: '2024-01-15',
      urgent: true
    },
    {
      id: 2,
      title: 'Chef de partie',
      company: 'Hôtel Golden Tulip',
      location: 'Sousse',
      type: 'CDD',
      salary: '1200 DT/mois',
      date: '2024-01-14',
      urgent: false
    },
    {
      id: 3,
      title: 'Barman',
      company: 'Café des Arts',
      location: 'Sidi Bou Saïd',
      type: 'Extra',
      salary: '50 DT/jour',
      date: '2024-01-13',
      urgent: false
    }
  ];

  const myApplications = [
    {
      id: 1,
      title: 'Serveur',
      company: 'Restaurant Dar Zarrouk',
      status: 'pending',
      appliedDate: '2024-01-10',
      type: 'CDD'
    },
    {
      id: 2,
      title: 'Chef cuisinier',
      company: 'Hôtel Laico',
      status: 'accepted',
      appliedDate: '2024-01-08',
      type: 'CDI'
    },
    {
      id: 3,
      title: 'Commis de cuisine',
      company: 'Restaurant Villa Didon',
      status: 'rejected',
      appliedDate: '2024-01-05',
      type: 'Extra'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'text-success-500 bg-success-100';
      case 'pending': return 'text-yellow-500 bg-yellow-100';
      case 'rejected': return 'text-danger-500 bg-danger-100';
      default: return 'text-text-light bg-secondary-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'accepted': return 'Acceptée';
      case 'pending': return 'En attente';
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
                  <User className="w-10 h-10 text-primary-500" />
                </div>
                <h3 className="font-semibold text-text-primary">Ahmed Ben Ali</h3>
                <p className="text-sm text-text-secondary">Serveur professionnel</p>
                <div className="flex items-center justify-center mt-2">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm text-text-secondary ml-1">4.8/5</span>
                </div>
              </div>

              <nav className="space-y-2">
                {[
                  { id: 'overview', label: 'Vue d\'ensemble', icon: FileText },
                  { id: 'jobs', label: 'Offres disponibles', icon: Search },
                  { id: 'applications', label: 'Mes candidatures', icon: Send },
                  { id: 'calendar', label: 'Planning', icon: Calendar },
                  { id: 'favorites', label: 'Favoris', icon: Bookmark },
                  { id: 'notifications', label: 'Notifications', icon: Bell },
                  { id: 'profile', label: 'Mon profil', icon: User },
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
                  <p className="text-sm font-medium text-accent-900">Pack Silver actif</p>
                  <p className="text-xs text-accent-700 mt-1">Expire dans 45 jours</p>
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
                <h1 className="text-3xl font-bold text-text-primary">Espace Candidat</h1>
                <p className="text-text-secondary mt-1">Gérez vos candidatures et trouvez de nouvelles opportunités</p>
              </div>
              <button className="mt-4 sm:mt-0 bg-accent-500 text-white px-6 py-3 rounded-lg hover:bg-accent-600 transition-colors flex items-center space-x-2">
                <Search className="w-5 h-5" />
                <span>Rechercher des offres</span>
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

            {/* Available Jobs */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-6 border-b border-secondary-100">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-text-primary">Offres recommandées</h2>
                  <button className="text-primary-500 hover:text-primary-600 font-medium">
                    Voir toutes →
                  </button>
                </div>
              </div>
              
              <div className="divide-y divide-secondary-100">
                {availableJobs.map((job) => (
                  <div key={job.id} className="p-6 hover:bg-secondary-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-text-primary">{job.title}</h3>
                          {job.urgent && (
                            <span className="px-2 py-1 bg-danger-100 text-danger-700 text-xs font-medium rounded-full">
                              Urgent
                            </span>
                          )}
                          <span className="px-2 py-1 bg-accent-100 text-accent-700 text-xs font-medium rounded-full">
                            {job.type}
                          </span>
                        </div>
                        <p className="text-text-secondary mb-2">{job.company}</p>
                        <div className="flex items-center space-x-4 text-sm text-text-light">
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>{job.location}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <DollarSign className="w-4 h-4" />
                            <span>{job.salary}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{job.date}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button className="px-4 py-2 border border-primary-500 text-primary-500 rounded-lg hover:bg-primary-50 transition-colors">
                          Voir détails
                        </button>
                        <button className="px-4 py-2 bg-accent-500 text-white rounded-lg hover:bg-accent-600 transition-colors">
                          Postuler
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* My Applications */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-6 border-b border-secondary-100">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-text-primary">Mes candidatures récentes</h2>
                  <button className="text-primary-500 hover:text-primary-600 font-medium">
                    Voir toutes →
                  </button>
                </div>
              </div>
              
              <div className="divide-y divide-secondary-100">
                {myApplications.map((application) => (
                  <div key={application.id} className="p-6 hover:bg-secondary-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-text-primary">{application.title}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                            {getStatusText(application.status)}
                          </span>
                          <span className="px-2 py-1 bg-secondary-100 text-text-secondary text-xs font-medium rounded-full">
                            {application.type}
                          </span>
                        </div>
                        <p className="text-text-secondary mb-1">{application.company}</p>
                        <p className="text-sm text-text-light">Candidature envoyée le {application.appliedDate}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button className="px-4 py-2 border border-secondary-300 text-text-secondary rounded-lg hover:bg-secondary-50 transition-colors">
                          Voir détails
                        </button>
                        {application.status === 'pending' && (
                          <button className="px-4 py-2 bg-danger-500 text-white rounded-lg hover:bg-danger-600 transition-colors">
                            Annuler
                          </button>
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

export default CandidateDashboard;