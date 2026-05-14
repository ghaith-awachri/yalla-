import { Link } from 'react-router-dom';
import { 
  Users,
  Clock,
  CheckCircle,
  ArrowRight,
  Search,
  Heart,
  BarChart3,
  Lightbulb,
  Shield
} from 'lucide-react';
import './ForProfessionals.css';

const ForProfessionals = () => {
  const services = [
    {
      icon: Search,
      title: 'Création de demande en 3 clics',
      description: 'Depuis votre mobile ou ordinateur, créez vos demandes d\'extra ou de recrutement en quelques secondes. Choisissez les compétences, la zone et la période.'
    },
    {
      icon: Users,
      title: 'Mise en relation instantanée',
      description: 'Votre demande est automatiquement proposée aux travailleurs qualifiés autour de vous. Recevez des notifications dès qu\'un candidat répond favorablement.'
    },
    {
      icon: Heart,
      title: 'Gestion des favoris',
      description: 'Retravaillez en priorité avec vos talents préférés. Ajoutez-les à votre liste de favoris et notez les candidats pour futures collaborations.'
    },
    {
      icon: Lightbulb,
      title: 'Services de conseil',
      description: 'Profitez de nos services de consulting, formation et études d\'investissement pour améliorer votre personnel et développer votre activité.'
    }
  ];

  const packs = [
    {
      name: 'PACK Recruteur',
      price: 'Gratuit',
      color: 'bg-secondary-50 border-secondary-200',
      features: [
        '10 publications gratuites',
        '10 notifications d\'emploi gratuites',
        'Support client de base',
        'Accès aux profils candidats'
      ]
    },
    {
      name: 'PACK Recruteur Actif',
      price: '500 DT/an',
      color: 'bg-accent-50 border-accent-200',
      popular: true,
      features: [
        'Publications illimitées pendant 1 an',
        'Notifications illimitées',
        'Remise 50% sur formation personnalisée (5 personnes)',
        'Remise 30% sur consultation personnalisée',
        'Support client prioritaire'
      ]
    },
    {
      name: 'PACK Recruteur Expert',
      price: '900 DT/an',
      color: 'bg-primary-50 border-primary-200',
      features: [
        'Publications illimitées pendant 1 an',
        'Notifications illimitées',
        'Formation personnalisée gratuite (5 personnes)',
        'Remise 50% sur consultation personnalisée',
        'Gestion des favoris',
        'Notation des postulants',
        'Support client VIP'
      ]
    }
  ];

  const advantages = [
    {
      icon: Clock,
      title: 'Gain de temps',
      description: 'Réduction drastique du temps de recherche de candidats'
    },
    {
      icon: BarChart3,
      title: 'Optimisation',
      description: 'Algorithme intelligent pour un matching parfait'
    },
    {
      icon: CheckCircle,
      title: 'Rapidité',
      description: 'Réponses et mise en relation en temps réel'
    },
    {
      icon: Shield,
      title: 'Flexibilité',
      description: 'Adaptez vos besoins selon votre activité'
    }
  ];

  return (
    <div className="professionals-container">
      {/* Hero Section */}
      <section className="professionals-hero">
        <div className="container mx-auto px-4">
          <div className="professionals-hero-grid">
            <div className="professionals-hero-text">
              <div>
                <h1 className="professionals-hero-title">
                  Solutions pour les
                  <span className="highlight"> Professionnels</span>
                </h1>
                <p className="professionals-hero-description">
                  Trouvez instantanément les meilleurs talents HORECA pour vos missions 
                  ponctuelles ou de longue durée. Simplifiez votre recrutement avec notre plateforme intelligente.
                </p>
              </div>

              <div className="professionals-hero-buttons">
                <Link to="/register" className="btn-professionals-primary">
                  Commencer maintenant
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
                <Link to="/contact" className="btn-professionals-secondary">
                  Nous contacter
                </Link>
              </div>
            </div>

            <div className="professionals-hero-image">
              <div className="professionals-image-container">
                <img
                  src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg"
                  alt="Professionnel HORECA"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="professionals-services">
        <div className="container mx-auto px-4">
          <div className="professionals-services-header">
            <h2 className="professionals-services-title">
              Nos Services pour les Entreprises
            </h2>
            <p className="professionals-services-subtitle">
              Une suite complète d'outils pour optimiser votre recrutement et développer votre activité
            </p>
          </div>

          <div className="professionals-services-grid">
            {services.map((service, index) => (
              <div key={index} className="professionals-service-card">
                <div className="professionals-service-icon">
                  <service.icon className="w-6 h-6 text-primary-500" />
                </div>
                <h3 className="professionals-service-title">{service.title}</h3>
                <p className="professionals-service-description">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Advantages Section */}
      <section className="professionals-advantages">
        <div className="container mx-auto px-4">
          <div className="professionals-advantages-header">
            <h2 className="professionals-advantages-title">
              Avantages pour les Entreprises
            </h2>
            <p className="professionals-advantages-subtitle">
              Découvrez pourquoi plus de 65 professionnels nous font confiance
            </p>
          </div>

          <div className="professionals-advantages-grid">
            {advantages.map((advantage, index) => (
              <div key={index} className="professionals-advantage-card">
                <div className="professionals-advantage-icon">
                  <advantage.icon className="w-8 h-8 text-accent-500" />
                </div>
                <h3 className="professionals-advantage-title">{advantage.title}</h3>
                <p className="professionals-advantage-description">{advantage.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="professionals-pricing">
        <div className="container mx-auto px-4">
          <div className="professionals-pricing-header">
            <h2 className="professionals-pricing-title">
              Choisissez votre Pack
            </h2>
            <p className="professionals-pricing-subtitle">
              Des solutions adaptées à tous les besoins d'entreprise
            </p>
          </div>

          <div className="professionals-pricing-grid">
            {packs.map((pack, index) => (
              <div key={index} className={`professionals-pricing-card ${pack.popular ? 'popular' : ''}`}>
                {pack.popular && (
                  <div className="professionals-pricing-badge">
                    Plus Populaire
                  </div>
                )}

                <div className="professionals-pricing-header-card">
                  <h3 className="professionals-pricing-name">{pack.name}</h3>
                  <div className="professionals-pricing-price">{pack.price}</div>
                </div>

                <ul className="professionals-pricing-features">
                  {pack.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="professionals-pricing-feature">
                      <CheckCircle className="professionals-pricing-feature-icon" />
                      <span className="professionals-pricing-feature-text">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link to="/register" className="professionals-pricing-button">
                  Choisir ce pack
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="professionals-cta">
        <div className="container mx-auto px-4">
          <div className="professionals-cta-content">
            <h2 className="professionals-cta-title">
              Prêt à révolutionner votre recrutement ?
            </h2>
            <p className="professionals-cta-description">
              Rejoignez les professionnels qui ont déjà optimisé leur recherche de talents avec Yalla Extra
            </p>
            <Link to="/register" className="professionals-cta-button">
              Démarrer gratuitement
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ForProfessionals;