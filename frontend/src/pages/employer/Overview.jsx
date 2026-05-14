import React from 'react';
import { FileText, Users, Clock, Star, PlusCircle, Search, BarChart3 } from 'lucide-react';

const Overview = ({ stats, setShowJobForm, setActiveTab }) => (
  <div className="space-y-8">
        <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary mb-1">Annonces actives</p>
              <p className="text-2xl font-bold text-text-primary">{stats.activeJobs}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center">
              <FileText className="w-6 h-6 text-primary-500" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary mb-1">Candidatures reçues</p>
              <p className="text-2xl font-bold text-text-primary">{stats.applications}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-accent-50 flex items-center justify-center">
              <Users className="w-6 h-6 text-accent-500" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary mb-1">Missions en cours</p>
              <p className="text-2xl font-bold text-text-primary">{stats.activeMissions}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-success-50 flex items-center justify-center">
              <Clock className="w-6 h-6 text-success-500" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary mb-1">Talents favoris</p>
              <p className="text-2xl font-bold text-text-primary">{stats.favorites}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-yellow-50 flex items-center justify-center">
              <Star className="w-6 h-6 text-yellow-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <div className="text-center">
            <PlusCircle className="w-12 h-12 text-accent-500 mx-auto mb-4" />
            <h3 className="font-semibold text-text-primary mb-2">Publier une offre</h3>
            <p className="text-sm text-text-secondary mb-4">Créez une nouvelle annonce</p>
            <button 
              onClick={() => setShowJobForm(true)}
              className="w-full bg-accent-500 text-white py-2 rounded-lg hover:bg-accent-600 transition-colors"
            >
              Créer une offre
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <div className="text-center">
            <Search className="w-12 h-12 text-primary-500 mx-auto mb-4" />
            <h3 className="font-semibold text-text-primary mb-2">Rechercher des candidats</h3>
            <p className="text-sm text-text-secondary mb-4">Trouvez les meilleurs talents</p>
            <button 
              onClick={() => setActiveTab('candidates')}
              className="w-full bg-primary-500 text-white py-2 rounded-lg hover:bg-primary-600 transition-colors"
            >
              Parcourir les profils
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <div className="text-center">
            <BarChart3 className="w-12 h-12 text-success-500 mx-auto mb-4" />
            <h3 className="font-semibold text-text-primary mb-2">Statistiques</h3>
            <p className="text-sm text-text-secondary mb-4">Analysez vos performances</p>
            <button className="w-full bg-success-500 text-white py-2 rounded-lg hover:bg-success-600 transition-colors">
              Voir les rapports
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Overview;