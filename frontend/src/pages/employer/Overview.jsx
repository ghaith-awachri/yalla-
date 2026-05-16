import React from 'react';
import { FileText, Users, Clock, Star, PlusCircle, Search, BarChart3, ArrowUpRight, TrendingUp } from 'lucide-react';

const Overview = ({ stats, setShowJobForm, setActiveTab, recentApplications }) => {
  const statItems = [
    { 
      label: 'Annonces actives', 
      value: stats.activeJobs, 
      icon: FileText, 
      color: 'blue', 
      trend: '+2 ce mois',
      gradient: 'from-blue-500 to-indigo-600'
    },
    { 
      label: 'Candidatures reçues', 
      value: stats.applications, 
      icon: Users, 
      color: 'purple', 
      trend: '+12% vs mois dernier',
      gradient: 'from-purple-500 to-pink-600'
    },
    { 
      label: 'Missions en cours', 
      value: stats.activeMissions, 
      icon: Clock, 
      color: 'emerald', 
      trend: '3 à finaliser',
      gradient: 'from-emerald-500 to-teal-600'
    },
    { 
      label: 'Talents favoris', 
      value: stats.favorites, 
      icon: Star, 
      color: 'amber', 
      trend: 'Top 5% talents',
      gradient: 'from-amber-400 to-orange-500'
    },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statItems.map((item, index) => (
          <div key={index} className="group relative bg-white p-6 rounded-[2rem] border border-slate-200/60 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-full -mr-12 -mt-12 group-hover:scale-110 transition-transform duration-500 opacity-50"></div>
            
            <div className="relative z-10">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-4 shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform`}>
                <item.icon className="w-6 h-6 text-white" />
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">{item.label}</p>
                <div className="flex items-baseline space-x-2">
                  <p className="text-3xl font-black text-slate-900">{item.value}</p>
                  <div className="flex items-center text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {item.trend}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions Container */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-black text-slate-900 ml-2">Actions Rapides</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button 
              onClick={() => {
                setActiveTab('jobs');
                setShowJobForm(true);
              }}
              className="relative group bg-gradient-to-br from-blue-600 to-indigo-700 p-10 rounded-[3rem] text-left shadow-2xl shadow-blue-200 hover:-translate-y-2 transition-all duration-500 overflow-hidden col-span-1 md:col-span-2"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 group-hover:scale-125 transition-transform duration-1000"></div>
              <PlusCircle className="w-16 h-16 text-white/90 mb-8 group-hover:rotate-90 transition-transform duration-700" />
              <div className="max-w-md">
                <h3 className="text-3xl font-black text-white mb-3">Publier une nouvelle offre</h3>
                <p className="text-blue-100/80 font-medium text-lg mb-8 leading-relaxed">Trouvez instantanément les meilleurs talents pour votre établissement en quelques clics.</p>
                <div className="flex items-center text-white font-black text-base">
                  Commencer maintenant
                  <ArrowUpRight className="w-5 h-5 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Insights/Activity Placeholder */}
        <div className="space-y-6">
          <h2 className="text-xl font-black text-slate-900 ml-2">Insights</h2>
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200/60 shadow-sm h-full">
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-2">Analyse de Performance</h3>
              <p className="text-slate-500 text-sm font-medium leading-relaxed">
                Vos annonces ont attiré 24% de visibilité en plus cette semaine. Continuez ainsi !
              </p>
              <button className="mt-8 w-full py-4 bg-slate-50 hover:bg-slate-100 text-slate-600 font-black rounded-2xl transition-all">
                Voir le rapport complet
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;