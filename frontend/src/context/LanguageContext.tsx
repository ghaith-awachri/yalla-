import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'fr' | 'ar';

interface Translations {
  [key: string]: {
    fr: string;
    ar: string;
  };
}

const translations: Translations = {
  // Header
  "nav.home": { fr: "Accueil", ar: "الرئيسية" },
  "nav.concept": { fr: "Le Concept", ar: "المفهوم" },
  "nav.professionals": { fr: "Pour les Professionnels", ar: "للمحترفين" },
  "nav.candidates": { fr: "Pour les Candidats", ar: "للمرشحين" },
  "nav.contact": { fr: "Contact", ar: "اتصل بنا" },
  "auth.login": { fr: "Connexion", ar: "تسجيل الدخول" },
  "auth.register": { fr: "S'inscrire", ar: "إنشاء حساب" },
  "auth.logout": { fr: "Se déconnecter", ar: "تسجيل الخروج" },
  "auth.account": { fr: "Compte", ar: "حساب" },
  "profile.dashboard": { fr: "Tableau de bord", ar: "لوحة القيادة" },
  "profile.settings": { fr: "Paramètres du compte", ar: "إعدادات الحساب" },
  "profile.publicView": { fr: "Aperçu public", ar: "نظرة عامة عامة" },
  "profile.close": { fr: "Fermer", ar: "إغلاق" },
  "profile.generateCV": { fr: "Générer CV PDF", ar: "إنشاء سيرة ذاتية PDF" },
  "profile.details": { fr: "Détails de l'utilisateur", ar: "تفاصيل المستخدم" },

  // Candidate Dashboard
  "dashboard.overview": { fr: "Vue d'ensemble", ar: "نظرة عامة" },
  "dashboard.jobs": { fr: "Offres disponibles", ar: "الوظائف المتاحة" },
  "dashboard.editProfile": { fr: "Modifier le profil", ar: "تعديل الملف الشخصي" },
  "dashboard.new": { fr: "Nouveau", ar: "جديد" },
  "dashboard.apply": { fr: "Postuler", ar: "تقديم طلب" },
  "dashboard.search": { fr: "Rechercher...", ar: "ابحث..." },
  "dashboard.location": { fr: "Localisation...", ar: "الموقع..." },
  "dashboard.filter": { fr: "Filtrer", ar: "تصفية" },
  "dashboard.noJobs": { fr: "Aucune offre disponible", ar: "لا توجد عروض متاحة" },

  // Stats
  "stats.views": { fr: "Vues du profil", ar: "مشاهدات الملف الشخصي" },
  "stats.thisWeek": { fr: "+12 cette semaine", ar: "+12 هذا الأسبوع" },
  "stats.applications": { fr: "Candidatures", ar: "الطلبات" },
  "stats.inProgress": { fr: "En cours", ar: "قيد التقدم" },
  "stats.match": { fr: "Taux de match", ar: "معدل التطابق" },
  "stats.high": { fr: "Excellent", ar: "ممتاز" },
  "stats.messages": { fr: "Messages", ar: "الرسائل" },
  "stats.unread": { fr: "1 non lu", ar: "1 غير مقروء" },
  "stats.completed": { fr: "Complétées", ar: "مكتملة" },
  "stats.averageRating": { fr: "Note moyenne", ar: "متوسط التقييم" },
  
  // Generic
  "candidate": { fr: "Candidat", ar: "مرشح" },
  "employer": { fr: "Employeur", ar: "صاحب عمل" },
  "admin": { fr: "Admin", ar: "مسؤول" },
  "active": { fr: "Actif", ar: "نشط" },
  "inactive": { fr: "Inactif", ar: "غير نشط" },
  "contact": { fr: "Contact", ar: "اتصال" },
  "email": { fr: "Email", ar: "البريد الإلكتروني" },
  "phone": { fr: "Téléphone", ar: "الهاتف" },
  "address": { fr: "Adresse", ar: "العنوان" },
  "activity": { fr: "Activité", ar: "نشاط" },
  "registration": { fr: "Inscription", ar: "التسجيل" },
  "lastLogin": { fr: "Dernière connexion", ar: "آخر تسجيل دخول" },
  "unknown": { fr: "Inconnue", ar: "غير معروف" },

  // Login Page
  "login.title": { fr: "Connexion", ar: "تسجيل الدخول" },
  "login.subtitle": { fr: "Accédez à votre espace personnel", ar: "الوصول إلى مساحتك الشخصية" },
  "login.forgotPassword": { fr: "Mot de passe oublié", ar: "هل نسيت كلمة المرور؟" },
  "login.forgotPassword.subtitle": { fr: "Entrez votre email pour réinitialiser votre mot de passe", ar: "أدخل بريدك الإلكتروني لإعادة تعيين كلمة المرور" },
  "login.forgotPassword.btn": { fr: "Envoyer le lien de réinitialisation", ar: "إرسال رابط إعادة التعيين" },
  "login.forgotPassword.back": { fr: "← Retour à la connexion", ar: "← العودة لتسجيل الدخول" },
  "login.form.email": { fr: "Adresse email", ar: "البريد الإلكتروني" },
  "login.form.emailPlaceholder": { fr: "votre.email@exemple.com", ar: "بريدك@مثال.com" },
  "login.form.password": { fr: "Mot de passe", ar: "كلمة المرور" },
  "login.form.passwordPlaceholder": { fr: "Votre mot de passe", ar: "كلمة المرور الخاصة بك" },
  "login.form.userType": { fr: "Type de compte", ar: "نوع الحساب" },
  "login.form.remember": { fr: "Se souvenir de moi", ar: "تذكرني" },
  "login.form.submit": { fr: "Se connecter", ar: "تسجيل الدخول" },
  "login.form.submitting": { fr: "Connexion...", ar: "جاري تسجيل الدخول..." },
  "login.form.new": { fr: "Nouveau sur Yalla Extra ?", ar: "جديد في يلا إكسترا؟" },
  "login.form.createAccount": { fr: "Créer un compte", ar: "إنشاء حساب" },
  "login.form.backHome": { fr: "← Retour à l'accueil", ar: "← العودة للرئيسية" },

  // Home Page
  "home.hero.title": { fr: "Votre passerelle vers l'excellence", ar: "بوابتك نحو التميز" },
  "home.hero.highlight": { fr: " HORECA", ar: " هوريكا" },
  "home.hero.desc": { fr: "Recherchez des emplois, établissez des relations, trouvez des missions en extra, profitez des formations dans le secteur de l'hôtellerie et de la restauration.", ar: "ابحث عن وظائف، ابنِ علاقات، ابحث عن مهمات إضافية، واستفد من التدريبات في قطاع الفندقة والمطاعم." },
  "home.hero.btn.candidate": { fr: "Je cherche un emploi", ar: "أبحث عن عمل" },
  "home.hero.btn.employer": { fr: "Je recrute", ar: "أنا أوظف" },
  
  "home.stats.cv": { fr: "CV actifs", ar: "سير ذاتية نشطة" },
  "home.stats.candidates": { fr: "Candidats", ar: "مرشحين" },
  "home.stats.pros": { fr: "Professionnels", ar: "محترفين" },
  "home.stats.missions": { fr: "Missions réalisées", ar: "مهمات منجزة" },

  "home.features.speed.title": { fr: "Rapidité", ar: "سرعة" },
  "home.features.speed.desc": { fr: "Trouvez des talents ou des missions en quelques clics", ar: "ابحث عن مواهب أو مهمات في نقرات قليلة" },
  "home.features.reliability.title": { fr: "Fiabilité", ar: "موثوقية" },
  "home.features.reliability.desc": { fr: "Profils vérifiés et évaluations authentiques", ar: "ملفات شخصية موثقة وتقييمات حقيقية" },
  "home.features.coverage.title": { fr: "Couverture", ar: "تغطية" },
  "home.features.coverage.desc": { fr: "Tunisie, Côte d'Ivoire et Libye", ar: "تونس، ساحل العاج، وليبيا" },
  "home.features.quality.title": { fr: "Qualité", ar: "جودة" },
  "home.features.quality.desc": { fr: "Formations et accompagnement personnalisé", ar: "تدريبات ودعم مخصص" },

  "home.why.title": { fr: "Pourquoi choisir Yalla Extra ?", ar: "لماذا تختار يلا إكسترا؟" },
  "home.why.desc": { fr: "Une plateforme innovante qui révolutionne le recrutement dans le secteur HORECA", ar: "منصة مبتكرة تحدث ثورة في التوظيف في قطاع هوريكا" },

  "home.how.title": { fr: "Comment ça marche ?", ar: "كيف يعمل؟" },
  "home.how.desc": { fr: "Un processus simple et efficace en 3 étapes", ar: "عملية بسيطة وفعالة في 3 خطوات" },
  "home.how.step1.title": { fr: "Inscription", ar: "تسجيل" },
  "home.how.step1.desc": { fr: "Créez votre profil en quelques minutes", ar: "أنشئ ملفك الشخصي في بضع دقائق" },
  "home.how.step2.title": { fr: "Matching", ar: "تطابق" },
  "home.how.step2.desc": { fr: "Notre algorithme vous met en relation", ar: "خوارزميتنا تقوم بالتوصيل" },
  "home.how.step3.title": { fr: "Mission", ar: "مهمة" },
  "home.how.step3.desc": { fr: "Commencez votre collaboration", ar: "ابدأ تعاونك" },

  "home.cta.title": { fr: "Prêt à rejoindre la communauté Yalla Extra ?", ar: "هل أنت مستعد للانضمام إلى مجتمع يلا إكسترا؟" },
  "home.cta.desc": { fr: "Que vous soyez professionnel ou candidat, commencez votre aventure HORECA dès aujourd'hui", ar: "سواء كنت محترفًا أو مرشحًا، ابدأ مغامرتك اليوم" },
  "home.cta.btn1": { fr: "Commencer maintenant", ar: "ابدأ الآن" },
  "home.cta.btn2": { fr: "En savoir plus", ar: "اعرف المزيد" }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'fr';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
    // Invert DOM direction and lang attribute
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    
    // Add a class to body for custom Tailwind RTL overrides if necessary
    if (language === 'ar') {
      document.body.classList.add('rtl');
      document.body.classList.remove('ltr');
    } else {
      document.body.classList.add('ltr');
      document.body.classList.remove('rtl');
    }
  }, [language]);

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
