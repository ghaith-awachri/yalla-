import React from 'react';
import { 
  Filter, 
  Download, 
  Star, 
  MessageSquare, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Calendar, 
  Briefcase,
  User,
  MoreVertical,
  ChevronRight
} from 'lucide-react';

const Applications = ({ 
  recentApplications, 
  handleApplicationAction, 
  getApplicationStatusColor, 
  getApplicationStatusText,
  getPhotoUrl
}) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header & Filter Section */}
      <div className="bg-white/80 backdrop-blur-md p-8 rounded-[2.5rem] border border-slate-200/60 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Candidatures</h1>
          <p className="text-slate-500 font-medium">Suivez et gérez les candidatures reçues pour vos offres</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-bold transition-all">
            <Filter className="w-5 h-5" />
            <span>Filtrer</span>
          </button>
          <button className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold shadow-lg shadow-blue-200 transition-all">
            <Download className="w-5 h-5" />
            <span>Exporter</span>
          </button>
        </div>
      </div>

      {/* Applications List */}
      <div className="space-y-6">
        {recentApplications.map((app) => (
          <div key={app.id} className="group bg-white rounded-[2.5rem] border border-slate-200/60 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-500 overflow-hidden">
            <div className="p-8 flex flex-col lg:flex-row lg:items-center gap-8">
              {/* Candidate Profile Info */}
              <div className="flex items-center space-x-6 min-w-[300px]">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl overflow-hidden flex items-center justify-center shadow-lg shadow-blue-200 transform group-hover:scale-105 transition-transform duration-500">
                    {app.photo ? (
                      <img src={getPhotoUrl(app.photo)} alt={app.candidateName} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-10 h-10 text-white" />
                    )}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-white border-4 border-white rounded-2xl flex items-center justify-center shadow-sm">
                    <div className="w-full h-full bg-emerald-500 rounded-xl flex items-center justify-center">
                      <Star className="w-3.5 h-3.5 text-white fill-current" />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-black text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">{app.candidateName}</h3>
                  <div className="flex items-center text-slate-500 text-sm font-bold mb-2">
                    <Briefcase className="w-4 h-4 mr-2 text-blue-500" />
                    {app.experience} d'expérience
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {app.skills.map((skill, i) => (
                      <span key={i} className="px-3 py-1 bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-widest rounded-lg border border-slate-100">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Application Details */}
              <div className="flex-1 lg:border-x lg:border-slate-100 lg:px-8">
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Poste visé</p>
                    <p className="text-lg font-bold text-slate-900">{app.jobTitle}</p>
                  </div>
                  <div className="flex items-center text-slate-500 text-sm font-medium">
                    <Calendar className="w-4 h-4 mr-2" />
                    Postulé le {app.appliedDate}
                  </div>
                </div>
              </div>

              {/* Status & Actions */}
              <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between gap-6 min-w-[200px]">
                <div className={`px-5 py-2 rounded-2xl text-[11px] font-black uppercase tracking-widest border shadow-sm ${getApplicationStatusColor(app.status)}`}>
                  {getApplicationStatusText(app.status)}
                </div>
                
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => handleApplicationAction(app.id, 'accepted')}
                    className="w-12 h-12 bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white rounded-2xl flex items-center justify-center transition-all"
                    title="Accepter"
                  >
                    <CheckCircle className="w-6 h-6" />
                  </button>
                  <button 
                    onClick={() => handleApplicationAction(app.id, 'rejected')}
                    className="w-12 h-12 bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white rounded-2xl flex items-center justify-center transition-all"
                    title="Refuser"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                  <button className="w-12 h-12 bg-blue-50 text-blue-600 hover:bg-blue-500 hover:text-white rounded-2xl flex items-center justify-center transition-all">
                    <MessageSquare className="w-6 h-6" />
                  </button>
                  <button className="w-12 h-12 bg-slate-50 text-slate-400 hover:bg-slate-100 rounded-2xl flex items-center justify-center transition-all">
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>
            
            {/* Motivation Message Preview */}
            <div className="px-8 pb-8">
              <div className="bg-slate-50/50 rounded-3xl p-6 border border-slate-100 italic text-slate-500 text-sm font-medium relative">
                <span className="absolute top-0 left-6 -translate-y-1/2 bg-white px-3 py-1 rounded-full text-[10px] font-black text-blue-500 border border-slate-100 uppercase tracking-widest">
                  Message
                </span>
                "{app.message}"
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Applications;