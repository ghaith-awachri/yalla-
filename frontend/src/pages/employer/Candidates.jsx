import React from 'react';
import { 
  Star, 
  MapPin, 
  MessageSquare, 
  Search, 
  Filter, 
  User, 
  ChevronRight, 
  Clock, 
  Award,
  Zap
} from 'lucide-react';

const Candidates = ({ candidates, getPhotoUrl }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Search & Talent Pool Header */}
      <div className="bg-white/80 backdrop-blur-md p-8 rounded-[2.5rem] border border-slate-200/60 shadow-sm space-y-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Talent Pool</h1>
            <p className="text-slate-500 font-medium">Découvrez les meilleurs professionnels du secteur HORECA</p>
          </div>
          
          <div className="flex items-center space-x-3 w-full lg:w-auto">
            <div className="relative flex-1 lg:w-80 group">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-blue-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Rechercher un profil..."
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-transparent focus:border-blue-500 focus:bg-white rounded-2xl text-sm font-medium transition-all outline-none"
              />
            </div>
            <button className="p-3.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl transition-all">
              <Filter className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Candidates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {candidates.map((candidate) => (
          <div key={candidate._id} className="group bg-white rounded-[2.5rem] border border-slate-200/60 shadow-sm hover:shadow-2xl hover:shadow-blue-900/5 hover:-translate-y-2 transition-all duration-500 overflow-hidden flex flex-col">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl overflow-hidden flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-500">
                    {candidate.photo ? (
                      <img src={getPhotoUrl(candidate.photo)} alt={`${candidate.firstName} ${candidate.lastName}`} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-10 h-10 text-slate-400" />
                    )}
                  </div>
                  <div className="absolute -top-2 -right-2 px-2 py-1 bg-blue-600 text-white text-[10px] font-black rounded-lg shadow-lg flex items-center">
                    <Zap className="w-3 h-3 mr-1 fill-current" />
                    DISPO
                  </div>
                </div>
                
                <div className="flex items-center space-x-1 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-100">
                  <Star className="w-4 h-4 text-amber-500 fill-current" />
                  <span className="text-sm font-black text-amber-700">{candidate.rating || 0}</span>
                </div>
              </div>

              <h3 className="text-xl font-black text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                {candidate.firstName} {candidate.lastName}
              </h3>
              <div className="flex items-center text-slate-500 text-sm font-bold mb-6">
                <Award className="w-4 h-4 mr-2 text-blue-500" />
                {candidate.experience === 'less_than_1' ? '< 1 an' : 
                 candidate.experience === '1_to_3' ? '1-3 ans' :
                 candidate.experience === '3_to_5' ? '3-5 ans' :
                 candidate.experience === '5_to_10' ? '5-10 ans' :
                 candidate.experience === 'more_than_10' ? '10+ ans' : 'N/A'} d'expérience
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center text-slate-600 text-sm font-medium">
                  <MapPin className="w-4 h-4 mr-3 text-slate-400" />
                  {candidate.address || 'Localisation non spécifiée'}
                </div>
                <div className="flex items-center text-slate-600 text-sm font-medium">
                  <Clock className="w-4 h-4 mr-3 text-slate-400" />
                  Inscrit le {new Date(candidate.createdAt).toLocaleDateString()}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-8">
                {(candidate.skills || []).map((skill, i) => (
                  <span key={i} className="px-3 py-1.5 bg-blue-50/50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-xl border border-blue-100/30">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="px-8 py-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between mt-auto">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Poste: <span className="text-slate-900">{candidate.currentPosition || 'Candidat'}</span>
              </span>
              
              <div className="flex items-center space-x-2">
                <button className="w-10 h-10 bg-white border border-slate-200 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl flex items-center justify-center transition-all shadow-sm">
                  <MessageSquare className="w-5 h-5" />
                </button>
                <button className="px-5 py-2.5 bg-blue-600 text-white text-xs font-black uppercase tracking-widest rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all flex items-center">
                  Profil
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Candidates;