import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Building2, 

  CheckCircle, 
  ArrowRight, 
  Clock,
  Award,
  Globe
} from 'lucide-react';
import './Home.css';

const Home = () => {
  const stats = [
    { number: '125', label: 'CV actifs', icon: Users },
    { number: '154', label: 'Candidats', icon: Users },
    { number: '65', label: 'Professionnels', icon: Building2 },
    { number: '89', label: 'Missions réalisées', icon: CheckCircle }
  ];

  const features = [
    {
      icon: Clock,
      title: 'Rapidité',
      description: 'Trouvez des talents ou des missions en quelques clics'
    },
    {
      icon: CheckCircle,
      title: 'Fiabilité',
      description: 'Profils vérifiés et évaluations authentiques'
    },
    {
      icon: Globe,
      title: 'Couverture',
      description: 'Tunisie, Côte d\'Ivoire et Libye'
    },
    {
      icon: Award,
      title: 'Qualité',
      description: 'Formations et accompagnement personnalisé'
    }
  ];

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container mx-auto px-4">
          <div className="hero-content">
            <div className="hero-grid">
              <div className="hero-text">
                <div>
                  <h1 className="hero-title">
                    Votre passerelle vers l'excellence 
                    <span className="highlight"> HORECA</span>
                  </h1>
                  <p className="hero-description">
                    Recherchez des emplois, établissez des relations, trouvez des missions en extra, 
                    profitez des formations dans le secteur de l'hôtellerie et de la restauration.
                  </p>
                </div>

                <div className="hero-buttons">
                  <Link to="/candidates" className="btn-hero-primary">
                    Je cherche un emploi
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                  <Link to="/professionals" className="btn-hero-secondary">
                    Je recrute
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </div>
              </div>

              <div className="hero-image">
                <div className="hero-image-container">
                  <img
                    src="https://images.pexels.com/photos/3184460/pexels-photo-3184460.jpeg"
                    alt="Équipe HORECA professionnelle"
                  />
                </div>
               
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container mx-auto px-4">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card">
                <div className="stat-icon">
                  <stat.icon className="w-8 h-8 text-primary-500" />
                </div>
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container mx-auto px-4">
          <div className="features-header">
            <h2 className="features-title">
              Pourquoi choisir Yalla Extra ?
            </h2>
            <p className="features-description">
              Une plateforme innovante qui révolutionne le recrutement dans le secteur HORECA
            </p>
          </div>

          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">
                  <feature.icon className="w-6 h-6 text-primary-500" />
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="how-it-works-section">
        <div className="container mx-auto px-4">
          <div className="how-it-works-header">
            <h2 className="how-it-works-title">
              Comment ça marche ?
            </h2>
            <p className="how-it-works-description">
              Un processus simple et efficace en 3 étapes
            </p>
          </div>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">
                <span>1</span>
              </div>
              <h3 className="step-title">Inscription</h3>
              <p className="step-description">Créez votre profil en quelques minutes</p>
            </div>

            <div className="step-card">
              <div className="step-number">
                <span>2</span>
              </div>
              <h3 className="step-title">Matching</h3>
              <p className="step-description">Notre algorithme vous met en relation</p>
            </div>

            <div className="step-card">
              <div className="step-number">
                <span>3</span>
              </div>
              <h3 className="step-title">Mission</h3>
              <p className="step-description">Commencez votre collaboration</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container mx-auto px-4">
          <div className="cta-content">
            <h2 className="cta-title">
              Prêt à rejoindre la communauté Yalla Extra ?
            </h2>
            <p className="cta-description">
              Que vous soyez professionnel ou candidat, commencez votre aventure HORECA dès aujourd'hui
            </p>
            <div className="cta-buttons">
              <Link to="/register" className="btn-cta-primary">
                Commencer maintenant
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link to="/concept" className="btn-cta-secondary">
                En savoir plus
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;