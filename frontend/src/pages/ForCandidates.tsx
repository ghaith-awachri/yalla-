import { Link } from 'react-router-dom';
import { 
  User, 
  Bell, 
  Gift, 
  Star, 
  ArrowRight, 
  CheckCircle,
  MapPin,
  Clock,
  Award,
  Smartphone
} from 'lucide-react';
import './ForCandidates.css';

const ForCandidates = () => {
  const services = [
    {
      icon: User,
      title: 'Profil professionnel',
      description: 'Créez votre CV en quelques secondes. Une fois validé, recevez des propositions de missions et offres d\'emploi directement sur votre portable.'
    },
    {
      icon: Bell,
      title: 'Notifications géolocalisées',
      description: 'Recevez par SMS et email les offres qui correspondent à vos compétences et votre zone géographique en temps réel.'
    },
    {
      icon: Gift,
      title: 'Programme de fidélité',
      description: 'Gagnez des points de fidélité et accédez à des cadeaux exclusifs comme des tenues de travail professionnelles.'
    },
    {
      icon: Award,
      title: 'Formations métiers',
      description: 'Accédez à des sessions de formation sur les métiers du tourisme pour faire évoluer vos compétences et booster votre carrière.'
    }
  ];

  const packs = [
    {
      name: 'PACK SILVER',
      duration: '3 mois',
      price: '60 DT',
      color: 'bg-secondary-50 border-secondary-200',
      features: [
        'Accès à toutes les fonctionnalités',
        'Publication de demandes',
        'Demandes de formation',
        'Accès aux offres d\'emploi et extra',
        'Points de fidélité et parrainage',
        'Accès aux cadeaux'
      ]
    },
    {
      name: 'PACK GOLD',
      duration: '6 mois',
      price: '100 DT',
      color: 'bg-yellow-50 border-yellow-200',
      popular: true,
      features: [
        'Toutes les fonctionnalités Silver',
        'Remise 50% sur une formation métier',
        'Support client prioritaire',
        'Notifications premium',
        'Accès anticipé aux nouvelles offres'
      ]
    },
    {
      name: 'PACK PLATINE',
      duration: '12 mois',
      price: '160 DT',
      color: 'bg-purple-50 border-purple-200',
      features: [
        'Toutes les fonctionnalités Gold',
        'Notation des recruteurs',
        'Journée de formation métier gratuite',
        'Support client VIP',
        'Visibilité premium du profil',
        'Accès aux missions exclusives'
      ]
    }
  ];

  const advantages = [
    {
      icon: Clock,
      title: 'Flexibilité totale',
      description: 'Choisissez vos missions selon vos disponibilités'
    },
    {
      icon: MapPin,
      title: 'Opportunités locales',
      description: 'Trouvez des missions près de chez vous'
    },
    {
      icon: Star,
      title: 'Évaluation positive',
      description: 'Construisez votre réputation professionnelle'
    },
    {
      icon: Smartphone,
      title: 'Mobile-first',
      description: 'Gérez tout depuis votre smartphone'
    }
  ];

  return (
    <div className="candidates-container">
      {/* Hero Section */}
      <section className="candidates-hero">
        <div className="container mx-auto px-4">
          <div className="candidates-hero-grid">
            <div className="candidates-hero-text">
              <div>
                <h1 className="candidates-hero-title">
                  Votre carrière
                  <span className="highlight"> HORECA</span> commence ici
                </h1>
                <p className="candidates-hero-description">
                  Accédez aux meilleures opportunités d'emploi et missions extra dans l'hôtellerie 
                  et la restauration. Développez vos compétences avec nos formations spécialisées.
                </p>
              </div>

              <div className="candidates-hero-buttons">
                <Link to="/register" className="btn-candidates-primary">
                  Créer mon profil
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
                <Link to="/login" className="btn-candidates-secondary">
                  Se connecter
                </Link>
              </div>

              {/* Free Trial Banner */}
              <div className="candidates-trial-banner">
                <div className="candidates-trial-content">
                  <Gift className="candidates-trial-icon" />
                  <div className="candidates-trial-text">
                    <h3>Phase d'essai gratuite</h3>
                    <p>5 notifications SMS + 1 publication gratuite</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="candidates-hero-image">
              <div className="candidates-image-container">
                <img
                  src="https://images.pexels.com/photos/3184287/pexels-photo-3184287.jpeg"
                  alt="Candidat HORECA"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="candidates-services">
        <div className="container mx-auto px-4">
          <div className="candidates-services-header">
            <h2 className="candidates-services-title">
              Services pour les Candidats
            </h2>
            <p className="candidates-services-subtitle">
              Une plateforme complète pour booster votre carrière dans le secteur HORECA
            </p>
          </div>

          <div className="candidates-services-grid">
            {services.map((service, index) => (
              <div key={index} className="candidates-service-card">
                <div className="candidates-service-icon">
                  <service.icon className="w-6 h-6 text-accent-500" />
                </div>
                <h3 className="candidates-service-title">{service.title}</h3>
                <p className="candidates-service-description">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Advantages Section */}
      <section className="candidates-advantages">
        <div className="container mx-auto px-4">
          <div className="candidates-advantages-header">
            <h2 className="candidates-advantages-title">
              Avantages pour les Candidats
            </h2>
            <p className="candidates-advantages-subtitle">
              Découvrez tous les bénéfices de rejoindre notre communauté
            </p>
          </div>

          <div className="candidates-advantages-grid">
            {advantages.map((advantage, index) => (
              <div key={index} className="candidates-advantage-card">
                <div className="candidates-advantage-icon">
                  <advantage.icon className="w-8 h-8 text-primary-500" />
                </div>
                <h3 className="candidates-advantage-title">{advantage.title}</h3>
                <p className="candidates-advantage-description">{advantage.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Formation Section */}
      <section className="candidates-formation">
        <div className="container mx-auto px-4">
          <div className="candidates-formation-content">
            <div className="candidates-formation-grid">
              <div className="candidates-formation-image">
                <div className="candidates-formation-image-container">
                  <img
                    src="https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg"
                    alt="Formation HORECA"
                  />
                </div>
              </div>

              <div className="candidates-formation-text">
                <h2 className="candidates-formation-title">Formations Métiers</h2>
                <p className="candidates-formation-description">
                  Développez vos compétences avec nos formations spécialisées dans les métiers du tourisme. 
                  Des cycles courts (1-3 jours) aux formations moyennes (6 mois), adaptez votre apprentissage à vos besoins.
                </p>
                
                <div className="candidates-formation-features">
                  <div className="candidates-formation-feature">
                    <CheckCircle className="candidates-formation-feature-icon" />
                    <div className="candidates-formation-feature-content">
                      <h4>Formations techniques</h4>
                      <p>Maîtrisez les aspects techniques de votre métier</p>
                    </div>
                  </div>
                  <div className="candidates-formation-feature">
                    <CheckCircle className="candidates-formation-feature-icon" />
                    <div className="candidates-formation-feature-content">
                      <h4>Formations académiques</h4>
                      <p>Approfondissez vos connaissances théoriques</p>
                    </div>
                  </div>
                  <div className="candidates-formation-feature">
                    <CheckCircle className="candidates-formation-feature-icon" />
                    <div className="candidates-formation-feature-content">
                      <h4>Cycles flexibles</h4>
                      <p>Formations courtes et moyennes adaptées à votre agenda</p>
                    </div>
                  </div>
                </div>

                <Link to="/register" className="candidates-formation-button">
                  Découvrir les formations
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="candidates-pricing">
        <div className="container mx-auto px-4">
          <div className="candidates-pricing-header">
            <h2 className="candidates-pricing-title">
              Packs Emploi Yalla
            </h2>
            <p className="candidates-pricing-subtitle">
              Choisissez le pack qui correspond à vos ambitions professionnelles
            </p>
          </div>

          <div className="candidates-pricing-grid">
            {packs.map((pack, index) => (
              <div key={index} className={`candidates-pricing-card ${pack.popular ? 'popular' : ''}`}>
                {pack.popular && (
                  <div className="candidates-pricing-badge">
                    Recommandé
                  </div>
                )}

                <div className="candidates-pricing-header-card">
                  <h3 className="candidates-pricing-name">{pack.name}</h3>
                  <div className="candidates-pricing-duration">{pack.duration}</div>
                  <div className="candidates-pricing-price">{pack.price}</div>
                </div>

                <ul className="candidates-pricing-features">
                  {pack.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="candidates-pricing-feature">
                      <CheckCircle className="candidates-pricing-feature-icon" />
                      <span className="candidates-pricing-feature-text">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link to="/register" className="candidates-pricing-button">
                  Choisir ce pack
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="candidates-cta">
        <div className="container mx-auto px-4">
          <div className="candidates-cta-content">
            <h2 className="candidates-cta-title">
              Prêt à booster votre carrière HORECA ?
            </h2>
            <p className="candidates-cta-description">
              Rejoignez notre communauté de professionnels et accédez aux meilleures opportunités du secteur
            </p>
            <Link to="/register" className="candidates-cta-button">
              Commencer gratuitement
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ForCandidates;