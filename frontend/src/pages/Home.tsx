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
import { useLanguage } from '../context/LanguageContext';
import './Home.css';

const Home = () => {
  const { t } = useLanguage();
  
  const stats = [
    { number: '125', label: t('home.stats.cv'), icon: Users },
    { number: '154', label: t('home.stats.candidates'), icon: Users },
    { number: '65', label: t('home.stats.pros'), icon: Building2 },
    { number: '89', label: t('home.stats.missions'), icon: CheckCircle }
  ];

  const features = [
    {
      icon: Clock,
      title: t('home.features.speed.title'),
      description: t('home.features.speed.desc')
    },
    {
      icon: CheckCircle,
      title: t('home.features.reliability.title'),
      description: t('home.features.reliability.desc')
    },
    {
      icon: Globe,
      title: t('home.features.coverage.title'),
      description: t('home.features.coverage.desc')
    },
    {
      icon: Award,
      title: t('home.features.quality.title'),
      description: t('home.features.quality.desc')
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
                    {t('home.hero.title')}
                    <span className="highlight">{t('home.hero.highlight')}</span>
                  </h1>
                  <p className="hero-description">
                    {t('home.hero.desc')}
                  </p>
                </div>

                <div className="hero-buttons">
                  <Link to="/candidates" className="btn-hero-primary">
                    {t('home.hero.btn.candidate')}
                    <ArrowRight className="w-5 h-5 ml-2 rtl:mr-2 rtl:ml-0" />
                  </Link>
                  <Link to="/professionals" className="btn-hero-secondary">
                    {t('home.hero.btn.employer')}
                    <ArrowRight className="w-5 h-5 ml-2 rtl:mr-2 rtl:ml-0" />
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
              {t('home.why.title')}
            </h2>
            <p className="features-description">
              {t('home.why.desc')}
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
              {t('home.how.title')}
            </h2>
            <p className="how-it-works-description">
              {t('home.how.desc')}
            </p>
          </div>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">
                <span>1</span>
              </div>
              <h3 className="step-title">{t('home.how.step1.title')}</h3>
              <p className="step-description">{t('home.how.step1.desc')}</p>
            </div>

            <div className="step-card">
              <div className="step-number">
                <span>2</span>
              </div>
              <h3 className="step-title">{t('home.how.step2.title')}</h3>
              <p className="step-description">{t('home.how.step2.desc')}</p>
            </div>

            <div className="step-card">
              <div className="step-number">
                <span>3</span>
              </div>
              <h3 className="step-title">{t('home.how.step3.title')}</h3>
              <p className="step-description">{t('home.how.step3.desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container mx-auto px-4">
          <div className="cta-content">
            <h2 className="cta-title">
              {t('home.cta.title')}
            </h2>
            <p className="cta-description">
              {t('home.cta.desc')}
            </p>
            <div className="cta-buttons">
              <Link to="/register" className="btn-cta-primary">
                {t('home.cta.btn1')}
                <ArrowRight className="w-5 h-5 ml-2 rtl:mr-2 rtl:ml-0" />
              </Link>
              <Link to="/concept" className="btn-cta-secondary">
                {t('home.cta.btn2')}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;