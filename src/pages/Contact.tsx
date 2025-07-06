import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from 'lucide-react';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    type: 'general'
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      details: 'contact@yallaextra.com',
      description: 'Écrivez-nous pour toute question'
    },
    {
      icon: Phone,
      title: 'Téléphone',
      details: '+216 XX XXX XXX',
      description: 'Appelez-nous du lundi au vendredi'
    },
    {
      icon: MapPin,
      title: 'Adresse',
      details: 'Tunis, Tunisie',
      description: 'Notre siège social'
    },
    {
      icon: Clock,
      title: 'Horaires',
      details: '9h00 - 18h00',
      description: 'Lundi au Vendredi'
    }
  ];

  const offices = [
    {
      country: 'Tunisie',
      city: 'Tunis',
      address: 'Avenue Habib Bourguiba, Tunis',
      phone: '+216 XX XXX XXX',
      email: 'tunisie@yallaextra.com'
    },
    {
      country: 'Côte d\'Ivoire',
      city: 'Abidjan',
      address: 'Plateau, Abidjan',
      phone: '+225 XX XXX XXX',
      email: 'ci@yallaextra.com'
    },
    {
      country: 'Libye',
      city: 'Tripoli',
      address: 'Centre-ville, Tripoli',
      phone: '+218 XX XXX XXX',
      email: 'libye@yallaextra.com'
    }
  ];

  return (
    <div className="contact-container">
      {/* Hero Section */}
      <section className="contact-hero">
        <div className="container mx-auto px-4">
          <div className="contact-hero-content">
            <h1 className="contact-hero-title">
              Contactez-Nous
            </h1>
            <p className="contact-hero-description">
              Notre équipe est là pour vous accompagner. N'hésitez pas à nous contacter 
              pour toute question ou demande d'information.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="contact-info-section">
        <div className="container mx-auto px-4">
          <div className="contact-info-grid">
            {contactInfo.map((info, index) => (
              <div key={index} className="contact-info-card">
                <div className="contact-info-icon">
                  <info.icon className="w-8 h-8 text-accent-500" />
                </div>
                <h3 className="contact-info-title">{info.title}</h3>
                <p className="contact-info-details">{info.details}</p>
                <p className="contact-info-description">{info.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="contact-form-section">
        <div className="container mx-auto px-4">
          <div className="contact-form-content">
            <div className="contact-form-grid">
              {/* Form */}
              <div className="contact-form-card">
                <h2 className="contact-form-title">Envoyez-nous un message</h2>
                
                {isSubmitted && (
                  <div className="alert alert-success">
                    <CheckCircle className="w-5 h-5" />
                    <span>Votre message a été envoyé avec succès !</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="contact-form">
                  <div className="contact-form-grid-fields">
                    <div className="contact-form-group">
                      <label htmlFor="name" className="contact-form-label">
                        Nom complet *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="contact-form-input"
                        placeholder="Votre nom"
                      />
                    </div>
                    <div className="contact-form-group">
                      <label htmlFor="email" className="contact-form-label">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="contact-form-input"
                        placeholder="votre.email@exemple.com"
                      />
                    </div>
                  </div>

                  <div className="contact-form-group">
                    <label htmlFor="type" className="contact-form-label">
                      Type de demande
                    </label>
                    <select
                      id="type"
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      className="contact-form-select"
                    >
                      <option value="general">Question générale</option>
                      <option value="candidate">Je suis candidat</option>
                      <option value="employer">Je suis employeur</option>
                      <option value="formation">Demande de formation</option>
                      <option value="conseil">Service de conseil</option>
                      <option value="technique">Support technique</option>
                    </select>
                  </div>

                  <div className="contact-form-group">
                    <label htmlFor="subject" className="contact-form-label">
                      Sujet *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="contact-form-input"
                      placeholder="Objet de votre message"
                    />
                  </div>

                  <div className="contact-form-group">
                    <label htmlFor="message" className="contact-form-label">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      className="contact-form-textarea"
                      placeholder="Décrivez votre demande en détail..."
                    />
                  </div>

                  <button type="submit" className="contact-form-button">
                    <Send className="w-5 h-5" />
                    <span>Envoyer le message</span>
                  </button>
                </form>
              </div>

              {/* Additional Info */}
              <div className="contact-additional-info">
                <div className="contact-help-card">
                  <h3 className="contact-help-title">Besoin d'aide ?</h3>
                  <p className="contact-help-description">
                    Notre équipe support est disponible pour vous accompagner dans votre parcours sur Yalla Extra.
                  </p>
                  <div className="contact-help-features">
                    <div className="contact-help-feature">
                      <div className="contact-help-feature-dot"></div>
                      <span className="contact-help-feature-text">Réponse sous 24h</span>
                    </div>
                    <div className="contact-help-feature">
                      <div className="contact-help-feature-dot"></div>
                      <span className="contact-help-feature-text">Support multilingue</span>
                    </div>
                    <div className="contact-help-feature">
                      <div className="contact-help-feature-dot"></div>
                      <span className="contact-help-feature-text">Accompagnement personnalisé</span>
                    </div>
                  </div>
                </div>

                <div className="contact-faq-card">
                  <h3 className="contact-faq-title">FAQ</h3>
                  <p className="contact-faq-description">
                    Consultez notre foire aux questions pour trouver rapidement des réponses aux questions les plus courantes.
                  </p>
                  <a href="#" className="contact-faq-link">
                    Voir la FAQ →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Offices */}
      <section className="contact-offices-section">
        <div className="container mx-auto px-4">
          <div className="contact-offices-header">
            <h2 className="contact-offices-title">
              Nos Bureaux
            </h2>
            <p className="contact-offices-subtitle">
              Nous sommes présents dans 3 pays pour mieux vous servir
            </p>
          </div>

          <div className="contact-offices-grid">
            {offices.map((office, index) => (
              <div key={index} className="contact-office-card">
                <div className="contact-office-header">
                  <h3 className="contact-office-country">{office.country}</h3>
                  <p className="contact-office-city">{office.city}</p>
                </div>
                
                <div className="contact-office-details">
                  <div className="contact-office-detail">
                    <MapPin className="contact-office-detail-icon" />
                    <span className="contact-office-detail-text">{office.address}</span>
                  </div>
                  <div className="contact-office-detail">
                    <Phone className="contact-office-detail-icon" />
                    <span className="contact-office-detail-text">{office.phone}</span>
                  </div>
                  <div className="contact-office-detail">
                    <Mail className="contact-office-detail-icon" />
                    <span className="contact-office-detail-text">{office.email}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;