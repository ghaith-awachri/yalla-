const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
const auth = require('../models/User'); // <== Ajoute cette ligne
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// Configuration du transporteur email
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Vérification de la connexion SMTP
transporter.verify(function(error, success) {
  if (error) {
    console.log('Erreur configuration SMTP:', error);
  } else {
    console.log('Serveur SMTP prêt pour envoyer des emails');
  }
});

// Route pour mot de passe oublié
// Route pour mot de passe oublié
// Route pour mot de passe oublié
router.post('/forgot-password', async (req, res) => {
  let user;
  
  try {
    const { email } = req.body;

    // Vérifier si l'utilisateur existe
    user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      // Pour des raisons de sécurité, on ne révèle pas si l'email existe
      return res.json({
        success: true,
        message: 'Si cet email existe, un lien de réinitialisation a été envoyé'
      });
    }

    // Générer un token de réinitialisation
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // Créer l'URL de réinitialisation
    const resetURL = `${'http://localhost:5173'}/reset-password/${resetToken}`;

    // Configurer l'email
const message = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <style>
      body { 
        font-family: Arial, sans-serif; 
        line-height: 1.6; 
        color: #333; 
        margin: 0; 
        padding: 0; 
        background-color: #f4f6f8;
      }
      .container { 
        max-width: 600px; 
        margin: 30px auto; 
        padding: 20px; 
        background: #ffffff; 
        border-radius: 8px; 
        box-shadow: 0 4px 12px rgba(0,0,0,0.05);
      }
      .header { 
        background: linear-gradient(90deg, #007bff, #0056d2); 
        color: white; 
        padding: 25px; 
        text-align: center; 
        border-radius: 8px 8px 0 0;
      }
      .header h1 { margin: 0; font-size: 24px; letter-spacing: 1px; }
      .header h2 { margin: 5px 0 0; font-weight: normal; font-size: 18px; }
      
      .content { padding: 30px; background-color: #fafafa; }
      .content p { margin: 15px 0; font-size: 15px; }
      
      .button { 
        display: inline-block; 
        padding: 14px 28px; 
        background: #007bff; 
        color: white; 
        text-decoration: none; 
        border-radius: 6px; 
        margin: 25px 0; 
        font-weight: bold;
        transition: background 0.3s ease;
      }
      .button:hover { background: #0056d2; }
      
      .footer { 
        margin-top: 20px; 
        padding: 20px; 
        background-color: #f1f1f1; 
        text-align: center; 
        font-size: 12px; 
        color: #666; 
        border-radius: 0 0 8px 8px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>YALLA EXTRA</h1>
        <h2>Réinitialisation de mot de passe</h2>
      </div>
      
      <div class="content">
        <p>Bonjour <strong>${user.firstName}</strong>,</p>
        <p>Vous avez demandé la réinitialisation de votre mot de passe Yalla Extra.</p>
        <p>Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe :</p>
        
        <div style="text-align: center;">
          <a href="${resetURL}" class="button">🔑 Réinitialiser mon mot de passe</a>
        </div>
        
        <p>Ou copiez-collez ce lien dans votre navigateur :</p>
        <p style="word-break: break-all; color: #007bff; font-size: 14px;">${resetURL}</p>
        
        <p><strong>⚠️ Ce lien expirera dans 10 minutes.</strong></p>
        
        <p>Si vous n'avez pas demandé cette réinitialisation, veuillez ignorer cet email.</p>
      </div>
      
      <div class="footer">
        <p>© 2024 Yalla Extra. Tous droits réservés.</p>
        <p>Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
      </div>
    </div>
  </body>
  </html>
`;


    // Envoyer l'email
    const mailOptions = {
      from: process.env.SMTP_FROM || '"Yalla Extra" <noreply@yallaextra.com>',
      to: user.email,
      subject: 'Réinitialisation de votre mot de passe Yalla Extra',
      html: message,
      text: `Réinitialisation de votre mot de passe Yalla Extra\n\n
             Cliquez sur ce lien pour réinitialiser votre mot de passe : ${resetURL}\n\n
             Ce lien expirera dans 10 minutes.\n
             Si vous n'avez pas demandé cette réinitialisation, veuillez ignorer cet email.`
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email de réinitialisation envoyé à: ${user.email}`);
    res.json({
      success: true,
      message: 'Un email de réinitialisation a été envoyé à votre adresse email'
    });

  } catch (error) {
    console.error('Erreur mot de passe oublié:', error);
    
    // Réinitialiser les tokens en cas d'erreur
    if (user) {
      await User.findByIdAndUpdate(user._id, {
        passwordResetToken: undefined,
        passwordResetExpires: undefined
      });
    }

    res.status(500).json({
      success: false,
      message: "Erreur lors de l'envoi de l'email",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Route pour réinitialiser le mot de passe
router.patch('/reset-password/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    // Vérifier que les mots de passe correspondent
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Les mots de passe ne correspondent pas'
      });
    }

    // Hasher le token pour le comparer avec celui en base
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Trouver l'utilisateur avec un token valide
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Token invalide ou expiré'
      });
    }

    // Mettre à jour le mot de passe
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // Envoyer un email de confirmation
    const message = `
      <h2>Mot de passe modifié avec succès</h2>
      <p>Votre mot de passe a été réinitialisé avec succès.</p>
      <p>Si vous n'êtes pas à l'origine de cette modification, veuillez contacter immédiatement le support.</p>
    `;

    await transporter.sendMail({
      from: process.env.SMTP_FROM || '"Yalla Extra" <noreply@yallaextra.com>',
      to: user.email,
      subject: 'Confirmation de réinitialisation de mot de passe',
      html: message
    });

    res.json({
      success: true,
      message: 'Mot de passe réinitialisé avec succès'
    });

  } catch (error) {
    console.error('Erreur réinitialisation mot de passe:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la réinitialisation du mot de passe',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Route pour vérifier la validité d'un token
router.get('/verify-reset-token/:token', async (req, res) => {
  try {
    const { token } = req.params;

    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Token invalide ou expiré'
      });
    }

    res.json({
      success: true,
      message: 'Token valide'
    });

  } catch (error) {
    console.error('Erreur vérification token:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la vérification du token',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Configuration de Multer pour le stockage des fichiers
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const uploadDir = path.join(__dirname, '../../public/uploads/users');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'photo' && !file.mimetype.startsWith('image/')) {
    return cb(new Error('Seules les images sont autorisées pour la photo'), false);
  }
  cb(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
}).fields([
  { name: 'photo', maxCount: 1 },
  { name: 'cv', maxCount: 1 }
]);

// Route d'inscription
// Route d'inscription
router.post('/register', (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }

    try {
      // Extraction des données du formulaire
      const {
        firstName,
        lastName,
        email,
        phone,
        password,
        confirmPassword,
        userType,
        address,
        age,
        cin,
        experience,
        education,
        currentPosition,
        currentCompany,
        desiredPositions = [],
        preferredZones = [],
        trainingInstitutions = [],
        companyName,
        companyType,
        position,
        establishmentCategory
      } = req.body;

      // Validation des données
      if (password !== confirmPassword) {
        return res.status(400).json({
          success: false,
          message: 'Les mots de passe ne correspondent pas'
        });
      }

      // Vérification de l'existence de l'utilisateur
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Un utilisateur avec cet email existe déjà'
        });
      }

      // Préparation des données utilisateur
      const userData = {
        firstName,
        lastName,
        email: email.toLowerCase(),
        phone,
        password,
        userType,
        address,
        age,
        subscription: {
          type: 'free',
          isActive: false
        },
        isEmailVerified: false // Email non vérifié par défaut
      };

      // Gestion des fichiers
      if (req.files) {
        if (req.files['photo']) {
          userData.photo = `/uploads/users/${req.files['photo'][0].filename}`;
        }
        if (req.files['cv']) {
          userData.cv = `/uploads/users/${req.files['cv'][0].filename}`;
        }
      }

      // Champs spécifiques au candidat
      if (userType === 'candidate') {
        userData.cin = cin;
        userData.experience = experience;
        userData.education = Array.isArray(education) ? education : [education];
        userData.currentPosition = currentPosition || '';
        userData.currentCompany = currentCompany || '';
        userData.desiredPositions = Array.isArray(desiredPositions) ? desiredPositions : desiredPositions.split(',');
        userData.preferredZones = Array.isArray(preferredZones) ? preferredZones : preferredZones.split(',');
        userData.trainingInstitutions = Array.isArray(trainingInstitutions) ? trainingInstitutions : trainingInstitutions.split(',');
      } 
      // Champs spécifiques à l'employeur
      else if (userType === 'employer') {
        userData.companyName = companyName;
        userData.companyType = companyType;
        userData.position = position || '';
        userData.establishmentCategory = establishmentCategory;
      }

      // Création de l'utilisateur
      const user = await User.create(userData);

      // Générer un token de vérification d'email
      const verificationToken = user.createEmailVerificationToken();
      await user.save({ validateBeforeSave: false });

      // Génération du token JWT
      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || '7d' }
      );

      // Envoyer l'email de vérification
      const verificationURL = `${'http://localhost:5173'}/verify-email/${verificationToken}`;

      const verificationMessage = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #007bff; color: white; padding: 20px; text-align: center; }
            .content { background-color: #f9f9f9; padding: 30px; }
            .button { 
              display: inline-block; 
              padding: 12px 24px; 
              background-color: #007bff; 
              color: white; 
              text-decoration: none; 
              border-radius: 5px; 
              margin: 20px 0; 
            }
            .footer { 
              margin-top: 20px; 
              padding: 20px; 
              background-color: #f1f1f1; 
              text-align: center; 
              font-size: 12px; 
              color: #666; 
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>YALLA EXTRA</h1>
              <h2>Vérification de votre email</h2>
            </div>
            
            <div class="content">
              <p>Bonjour ${user.firstName},</p>
              <p>Merci de vous être inscrit sur Yalla Extra !</p>
              <p>Pour compléter votre inscription, veuillez vérifier votre adresse email en cliquant sur le bouton ci-dessous :</p>
              
              <div style="text-align: center;">
                <a href="${verificationURL}" class="button">Vérifier mon email</a>
              </div>
              
              <p>Ou copiez-collez ce lien dans votre navigateur :</p>
              <p style="word-break: break-all; color: #007bff;">${verificationURL}</p>
              
              <p><strong>Ce lien expirera dans 24 heures.</strong></p>
              
              <p>Si vous ne vous êtes pas inscrit sur Yalla Extra, veuillez ignorer cet email.</p>
            </div>
            
            <div class="footer">
              <p>© 2024 Yalla Extra. Tous droits réservés.</p>
              <p>Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
            </div>
          </div>
        </body>
        </html>
      `;

      const mailOptions = {
        from: process.env.SMTP_FROM || '"Yalla Extra" <noreply@yallaextra.com>',
        to: user.email,
        subject: 'Vérification de votre email Yalla Extra',
        html: verificationMessage
      };

      await transporter.sendMail(mailOptions);
      console.log(`Email de vérification envoyé à: ${user.email}`);

      // Ne pas renvoyer le mot de passe dans la réponse
      user.password = undefined;

      res.status(201).json({
        success: true,
        message: 'Inscription réussie ! Un email de vérification a été envoyé.',
        token,
        user
      });

    } catch (error) {
      console.error('Erreur inscription:', error);
      
      let message = 'Erreur lors de l\'inscription';
      if (error.name === 'ValidationError') {
        message = 'Données de formulaire invalides';
      } else if (error.code === 11000) {
        message = 'Cet email est déjà utilisé';
      }

      res.status(500).json({
        success: false,
        message: message,
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  });
});
// Route de connexion
// Route de connexion
router.post('/login', async (req, res) => {
  try {
    const { email, password, userType } = req.body;

    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ email: email.toLowerCase(), userType }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
    }

    // Vérifier le mot de passe
    const isPasswordCorrect = await user.correctPassword(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
    }

    // Vérifier si l'email est confirmé
    if (!user.isEmailVerified) {
      return res.status(401).json({
        success: false,
        message: 'Veuillez vérifier votre email avant de vous connecter',
        needsVerification: true
      });
    }

    // Mettre à jour la dernière connexion
    user.lastLogin = new Date();
    await user.save();

    // Générer le token JWT
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    // Réponse sans le mot de passe
    user.password = undefined;

    res.json({
      success: true,
      message: 'Connexion réussie',
      token,
      user
    });

  } catch (error) {
    console.error('Erreur connexion:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la connexion',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;
// ✅ Route de connexion
router.post('/login', async (req, res) => {
  try {
    const { email, password, userType } = req.body;

    const user = await User.findOne({ email, userType }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
    }

    const isPasswordCorrect = await user.correctPassword(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.json({
      success: true,
      message: 'Connexion réussie',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        userType: user.userType,
        subscription: user.subscription,
        companyName: user.companyName
      }
    });

  } catch (error) {
    console.error('Erreur connexion:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la connexion',
      error: error.message
    });
  }
});


// ✅ Route pour récupérer les infos de l'utilisateur connecté
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        userType: user.userType,
        companyName: user.companyName,
        // Ajoutez d'autres champs si nécessaire
      }
    });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});
// Route pour vérifier l'email
router.get('/verify-email/:token', async (req, res) => {
  try {
    const { token } = req.params;

    // Hasher le token
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Trouver l'utilisateur avec token valide
    const user = await User.findOne({
      emailVerificationToken: hashedToken
    });
    // Vérifier si l'email est déjà vérifié
    if (user.isEmailVerified) {
      return res.json({
        success: true,
        message: 'Email déjà vérifié avec succès !'
      });
    }
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Token invalide'
      });
    }
    // Mettre à jour l'utilisateur
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    
    await user.save({ validateBeforeSave: false });

    res.json({
      success: true,
      message: 'Email vérifié avec succès !'
    });

  } catch (error) {
    console.error('Erreur vérification email:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la vérification de l\'email'
    });
  }
});

// Route pour renvoyer l'email de vérification
router.post('/resend-verification', async (req, res) => {
  try {
    const { email } = req.body;

    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Aucun utilisateur trouvé avec cet email'
      });
    }

    // Vérifier si l'email est déjà vérifié
    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Cet email est déjà vérifié'
      });
    }

    // Générer un nouveau token de vérification
    const verificationToken = user.createEmailVerificationToken();
    await user.save({ validateBeforeSave: false });

    // Envoyer l'email de vérification
    const verificationURL = `${'http://localhost:5173'}/verify-email/${verificationToken}`;

    const verificationMessage = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #007bff; color: white; padding: 20px; text-align: center; }
          .content { background-color: #f9f9f9; padding: 30px; }
          .button { 
            display: inline-block; 
            padding: 12px 24px; 
            background-color: #007bff; 
            color: white; 
            text-decoration: none; 
            border-radius: 5px; 
            margin: 20px 0; 
          }
          .footer { 
            margin-top: 20px; 
            padding: 20px; 
            background-color: #f1f1f1; 
            text-align: center; 
            font-size: 12px; 
            color: #666; 
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>YALLA EXTRA</h1>
            <h2>Vérification de votre email</h2>
          </div>
          
          <div class="content">
            <p>Bonjour ${user.firstName},</p>
            <p>Vous avez demandé un nouvel email de vérification pour votre compte Yalla Extra.</p>
            <p>Pour vérifier votre adresse email, cliquez sur le bouton ci-dessous :</p>
            
            <div style="text-align: center;">
              <a href="${verificationURL}" class="button">Vérifier mon email</a>
            </div>
            
            <p>Ou copiez-collez ce lien dans votre navigateur :</p>
            <p style="word-break: break-all; color: #007bff;">${verificationURL}</p>
            
            <p><strong>Ce lien expirera dans 24 heures.</strong></p>
          </div>
          
          <div class="footer">
            <p>© 2024 Yalla Extra. Tous droits réservés.</p>
            <p>Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: process.env.SMTP_FROM || '"Yalla Extra" <noreply@yallaextra.com>',
      to: user.email,
      subject: 'Vérification de votre email Yalla Extra',
      html: verificationMessage
    };

    await transporter.sendMail(mailOptions);

    res.json({
      success: true,
      message: 'Email de vérification envoyé !'
    });

  } catch (error) {
    console.error('Erreur renvoi vérification email:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'envoi de l\'email de vérification'
    });
  }
});
module.exports = router;