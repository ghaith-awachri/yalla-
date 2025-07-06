import React, { useState } from 'react';
import { 
  Users, 
  Building2, 
  FileText, 
  BarChart3, 
  Settings, 
  Shield,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { label: 'Utilisateurs totaux', value: '1,247', change: '+12%', icon: Users, color: 'text-primary-500' },
    { label: 'Candidats actifs', value: '854', change: '+8%', icon: Users, color: 'text-accent-500' },
    { label: 'Employeurs', value: '393', change: '+15%', icon: Building2, color: 'text-success-500' },
    { label: 'Missions publiées', value: '2,156', change: '+23%', icon: FileText, color: 'text-purple-500' }
  ];

  const recentUsers = [
    {
      id: 1,
      name: 'Ahmed Ben Ali',
      email: 'ahmed@example.com',
      type: 'candidate',
      status: 'active',
      joinDate: '2024-01-15',
      lastLogin: '2h'
    },
    {
      id: 2,
      name: 'Restaurant Le Méditerranéen',
      email: 'contact@restaurant.com',
      type: 'employer',
      status: 'pending',
      joinDate: '2024-01-14',
      lastLogin: '1d'
    },
    {
      id: 3,
      name: 'Fatma Trabelsi',
      email: 'fatma@hotel.com',
      type: 'candidate',
      status: 'active',
      joinDate: '2024-01-13',
      lastLogin: '3h'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-success-500 bg-success-100';
      case 'pending': return 'text-yellow-500 bg-yellow-100';
      case 'suspended': return 'text-danger-500 bg-danger-100';
      default: return 'text-text-light bg-secondary-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Actif';
      case 'pending': return 'En attente';
      case 'suspended': return 'Suspendu';
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
                  <Shield className="w-10 h-10 text-primary-500" />
                </div>
                <h3 className="font-semibold text-text-primary">Admin Panel</h3>
                <p className="text-sm text-text-secondary">Gestion de la plateforme</p>
              </div>

              <nav className="space-y-2">
                {[
                  { id: 'overview', label: 'Vue d\'ensemble', icon: BarChart3 },
                  { id: 'users', label: 'Utilisateurs', icon: Users },
                  { id: 'jobs', label: 'Offres d\'emploi', icon: FileText },
                  { id: 'applications', label: 'Candidatures', icon: FileText },
                  { id: 'subscriptions', label: 'Abonnements', icon: TrendingUp },
                  { id: 'reports', label: 'Rapports', icon: BarChart3 },
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
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div>
                <h1 className="text-3xl font-bold text-text-primary">Administration</h1>
                <p className="text-text-secondary mt-1">Gestion et supervision de la plateforme Yalla Extra</p>
              </div>
              <div className="flex space-x-3 mt-4 sm:mt-0">
                <button className="bg-accent-500 text-white px-4 py-2 rounded-lg hover:bg-accent-600 transition-colors flex items-center space-x-2">
                  <Download className="w-4 h-4" />
                  <span>Exporter</span>
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-text-secondary mb-1">{stat.label}</p>
                      <p className="text-2xl font-bold text-text-primary">{stat.value}</p>
                      <p className="text-sm text-success-500 mt-1">{stat.change}</p>
                    </div>
                    <div className={`w-12 h-12 rounded-full bg-secondary-50 flex items-center justify-center ${stat.color}`}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-6 border-b border-secondary-100">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-text-primary">Utilisateurs récents</h2>
                  <div className="flex space-x-2">
                    <button className="p-2 text-text-light hover:text-text-primary rounded-lg hover:bg-secondary-50">
                      <Search className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-text-light hover:text-text-primary rounded-lg hover:bg-secondary-50">
                      <Filter className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-secondary-50">
                    <tr>
                      <th className="text-left py-3 px-6 font-medium text-text-secondary">Utilisateur</th>
                      <th className="text-left py-3 px-6 font-medium text-text-secondary">Type</th>
                      <th className="text-left py-3 px-6 font-medium text-text-secondary">Statut</th>
                      <th className="text-left py-3 px-6 font-medium text-text-secondary">Inscription</th>
                      <th className="text-left py-3 px-6 font-medium text-text-secondary">Dernière connexion</th>
                      <th className="text-left py-3 px-6 font-medium text-text-secondary">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-secondary-100">
                    {recentUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-secondary-50">
                        <td className="py-4 px-6">
                          <div>
                            <div className="font-medium text-text-primary">{user.name}</div>
                            <div className="text-sm text-text-secondary">{user.email}</div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.type === 'candidate' ? 'bg-accent-100 text-accent-700' : 'bg-primary-100 text-primary-700'
                          }`}>
                            {user.type === 'candidate' ? 'Candidat' : 'Employeur'}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                            {getStatusText(user.status)}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-text-secondary">{user.joinDate}</td>
                        <td className="py-4 px-6 text-text-secondary">{user.lastLogin}</td>
                        <td className="py-4 px-6">
                          <div className="flex space-x-2">
                            <button className="p-1 text-text-light hover:text-primary-500 rounded">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-1 text-text-light hover:text-accent-500 rounded">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="p-1 text-text-light hover:text-danger-500 rounded">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;