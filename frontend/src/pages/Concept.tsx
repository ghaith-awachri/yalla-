import { Target, Eye, Heart, Users, Lightbulb, Globe } from 'lucide-react';
import './Concept.css';

const Concept = () => {
  const missions = [
    {
      icon: Users,
      title: 'Mise en relation professionnelle',
      description: 'Connecter les entreprises HORECA avec les talents qualifiés pour des missions courtes, moyennes et longues durées (CDI, CDD, Extra).'
    },
    {
      icon: Lightbulb,
      title: 'Formation et développement',
      description: 'Proposer des formations accélérées aux travailleurs et des services de conseil aux entreprises du secteur.'
    },
    {
      icon: Globe,
      title: 'Expansion régionale',
      description: 'Développer notre présence en Tunisie, Côte d\'Ivoire et Libye pour créer un réseau HORECA panafricain.'
    }
  ];

  const visionPoints = [
    'Accompagner les professionnels HORECA vers plus de flexibilité',
    'Aider les établissements à trouver instantanément les meilleurs profils',
    'Soutenir un secteur fortement impacté par les crises',
    'Améliorer la qualité de service pour redorer l\'image touristique',
    'Sauver des milliers d\'emplois grâce au numérique',
    'Proposer formation et mise à niveau pour les employés vulnérables'
  ];

  return (
    <div className="concept-container">
      {/* Hero Section */}
      <section className="concept-hero">
        <div className="container mx-auto px-4">
          <div className="concept-hero-content">
            <h1 className="concept-hero-title">
              Notre Concept
            </h1>
            <p className="concept-hero-description">
              Yalla Extra est une plateforme dédiée au secteur HORECA pour la mise en relation 
              des professionnels de manière souple, rapide, flexible et efficiente.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission-section">
        <div className="container mx-auto px-4">
          <div className="mission-content">
            <div className="mission-header">
              <div className="mission-icon">
                <Target className="w-8 h-8 text-accent-500" />
              </div>
              <h2 className="mission-title">Notre Mission</h2>
              <p className="mission-subtitle">
                Révolutionner le secteur HORECA en créant des connexions durables entre talents et entreprises
              </p>
            </div>

            <div className="mission-grid">
              {missions.map((mission, index) => (
                <div key={index} className="mission-card">
                  <div className="mission-card-icon">
                    <mission.icon className="w-6 h-6 text-accent-500" />
                  </div>
                  <h3 className="mission-card-title">{mission.title}</h3>
                  <p className="mission-card-description">{mission.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="vision-section">
        <div className="container mx-auto px-4">
          <div className="vision-content">
            <div className="vision-grid">
              <div className="vision-text">
                <div className="vision-icon">
                  <Eye className="w-8 h-8 text-primary-500" />
                </div>
                <h2 className="vision-title">Notre Vision</h2>
                <p className="vision-description">
                  Nous aspirons à être la référence en matière de solutions digitales pour le secteur HORECA, 
                  en offrant un écosystème complet qui favorise l'emploi, la formation et l'excellence.
                </p>
                
                <div className="vision-points">
                  {visionPoints.map((point, index) => (
                    <div key={index} className="vision-point">
                      <div className="vision-point-icon">
                        <Heart className="w-3 h-3 text-success-500" />
                      </div>
                      <p className="vision-point-text">{point}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="vision-image">
                <div className="vision-image-container">
                  <img
                    src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg"
                    alt="Vision Yalla Extra"
                  />
                </div>
                <div className="vision-badge">
                  <div className="vision-badge-number">3</div>
                  <div className="vision-badge-text">Pays ciblés</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Challenge Section */}
      <section className="challenge-section">
        <div className="container mx-auto px-4">
          <div className="challenge-content">
            <h2 className="challenge-title">Le Grand Défi</h2>
            <div className="challenge-quote">
              <p className="challenge-quote-text">
                "Sauver des milliers d'emplois et soutenir les employés vulnérables en leur offrant 
                des possibilités de formation et de mise à niveau."
              </p>
              <p className="challenge-quote-author">
                Nous croyons que l'amélioration de la qualité de service sera la locomotive de la reprise 
                du secteur touristique et le rehaussement de l'image de nos destinations dans les années à venir.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="impact-section">
        <div className="container mx-auto px-4">
          <div className="impact-content">
            <div className="impact-header">
              <h2 className="impact-title">Notre Impact</h2>
              <p className="impact-subtitle">
                Ensemble, construisons l'avenir du secteur HORECA
              </p>
            </div>

            <div className="impact-grid">
              <div className="impact-card">
                <div className="impact-number">1000+</div>
                <div className="impact-label">Emplois sauvés</div>
              </div>
              <div className="impact-card">
                <div className="impact-number">500+</div>
                <div className="impact-label">Formations dispensées</div>
              </div>
              <div className="impact-card">
                <div className="impact-number">200+</div>
                <div className="impact-label">Entreprises partenaires</div>
              </div>
              <div className="impact-card">
                <div className="impact-number">98%</div>
                <div className="impact-label">Satisfaction client</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Concept;