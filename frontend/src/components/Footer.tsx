import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-primary-500 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="text-2xl font-bold text-white">
              YALLA EXTRA
            </div>
            <p className="text-primary-100 text-sm leading-relaxed">
              Plateforme dédiée au secteur HORECA pour la mise en relation des professionnels 
              de manière souple, rapide, flexible et efficiente.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-primary-200 hover:text-accent-500 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-primary-200 hover:text-accent-500 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-primary-200 hover:text-accent-500 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Liens Rapides</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/concept" className="text-primary-100 hover:text-accent-500 transition-colors text-sm">
                  Le Concept
                </Link>
              </li>
              <li>
                <Link to="/professionals" className="text-primary-100 hover:text-accent-500 transition-colors text-sm">
                  Pour les Professionnels
                </Link>
              </li>
              <li>
                <Link to="/candidates" className="text-primary-100 hover:text-accent-500 transition-colors text-sm">
                  Pour les Candidats
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-primary-100 hover:text-accent-500 transition-colors text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Nos Services</h3>
            <ul className="space-y-2 text-sm text-primary-100">
              <li>Missions Extra</li>
              <li>Recrutement CDI/CDD</li>
              <li>Formations Métiers</li>
              <li>Conseil & Consulting</li>
              <li>Évaluations</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-accent-500" />
                <span className="text-primary-100 text-sm">contact@yallaextra.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-accent-500" />
                <span className="text-primary-100 text-sm">+216 XX XXX XXX</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-accent-500" />
                <span className="text-primary-100 text-sm">Tunis, Tunisie</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-400 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-primary-200 text-sm">
            © 2024 Yalla Extra. Tous droits réservés.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-primary-200 hover:text-accent-500 text-sm transition-colors">
              Politique de confidentialité
            </a>
            <a href="#" className="text-primary-200 hover:text-accent-500 text-sm transition-colors">
              Conditions d'utilisation
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;