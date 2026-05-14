const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

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

// --- ROUTES ---

// 1. Inscription
router.post('/register', (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }

    try {
      const {
        firstName, lastName, email, phone, password, confirmPassword,
        userType, address, age, cin, experience, education,
        currentPosition, currentCompany, desiredPositions = [],
        preferredZones = [], trainingInstitutions = [],
        companyName, companyType, position, establishmentCategory
      } = req.body;

      if (password !== confirmPassword) {
        return res.status(400).json({ success: false, message: 'Les mots de passe ne correspondent pas' });
      }

      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'Un utilisateur avec cet email existe déjà' });
      }

      const userData = {
        firstName, lastName, email: email.toLowerCase(), phone, password,
        userType, address, age,
        subscription: { type: 'free', isActive: false },
        isEmailVerified: false
      };

      if (req.files) {
        if (req.files['photo']) userData.photo = `/uploads/users/${req.files['photo'][0].filename}`;
        if (req.files['cv']) userData.cv = `/uploads/users/${req.files['cv'][0].filename}`;
      }

      if (userType === 'candidate') {
        userData.cin = cin;
        userData.experience = experience;
        userData.education = Array.isArray(education) ? education : [education];
        userData.currentPosition = currentPosition || '';
        userData.currentCompany = currentCompany || '';
        userData.desiredPositions = Array.isArray(desiredPositions) ? desiredPositions : desiredPositions.split(',');
        userData.preferredZones = Array.isArray(preferredZones) ? preferredZones : preferredZones.split(',');
        userData.trainingInstitutions = Array.isArray(trainingInstitutions) ? trainingInstitutions : trainingInstitutions.split(',');
      } else if (userType === 'employer') {
        userData.companyName = companyName;
        userData.companyType = companyType;
        userData.position = position || '';
        userData.establishmentCategory = establishmentCategory;
      }

      const user = await User.create(userData);
      const verificationToken = user.createEmailVerificationToken();
      await user.save({ validateBeforeSave: false });

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });

      const frontendURL = process.env.FRONTEND_URL || 'http://localhost:5173';
      const verificationURL = `${frontendURL}/verify-email/${verificationToken}`;

      const verificationMessage = `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"><style>body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; } .container { max-width: 600px; margin: 0 auto; padding: 20px; } .header { background-color: #007bff; color: white; padding: 20px; text-align: center; } .content { background-color: #f9f9f9; padding: 30px; } .button { display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; } .footer { margin-top: 20px; padding: 20px; background-color: #f1f1f1; text-align: center; font-size: 12px; color: #666; }</style></head>
        <body>
          <div class="container">
            <div class="header"><h1>YALLA EXTRA</h1><h2>Vérification de votre email</h2></div>
            <div class="content">
              <p>Bonjour ${user.firstName},</p>
              <p>Merci de vous être inscrit sur Yalla Extra ! Veuillez vérifier votre adresse email en cliquant sur le bouton ci-dessous :</p>
              <div style="text-align: center;"><a href="${verificationURL}" class="button">Vérifier mon email</a></div>
              <p>Ou copiez-collez ce lien dans votre navigateur :</p>
              <p style="word-break: break-all; color: #007bff;">${verificationURL}</p>
              <p><strong>Ce lien expirera dans 24 heures.</strong></p>
            </div>
            <div class="footer"><p>© 2024 Yalla Extra. Tous droits réservés.</p></div>
          </div>
        </body>
        </html>
      `;

      await transporter.sendMail({
        from: process.env.SMTP_FROM || '"Yalla Extra" <noreply@yallaextra.com>',
        to: user.email,
        subject: 'Vérification de votre email Yalla Extra',
        html: verificationMessage
      });

      user.password = undefined;
      res.status(201).json({ success: true, message: 'Inscription réussie ! Un email de vérification a été envoyé.', token, user });
    } catch (error) {
      console.error('Erreur inscription:', error);
      res.status(500).json({ success: false, message: 'Erreur lors de l\'inscription', error: process.env.NODE_ENV === 'development' ? error.message : undefined });
    }
  });
});

// 2. Connexion
router.post('/login', async (req, res) => {
  try {
    const { email, password, userType } = req.body;
    const user = await User.findOne({ email: email.toLowerCase(), userType }).select('+password');

    if (!user || !(await user.correctPassword(password))) {
      return res.status(401).json({ success: false, message: 'Email ou mot de passe incorrect' });
    }

    if (!user.isEmailVerified) {
      return res.status(401).json({ success: false, message: 'Veuillez vérifier votre email avant de vous connecter', needsVerification: true });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });
    user.password = undefined;

    res.json({ success: true, message: 'Connexion réussie', token, user });
  } catch (error) {
    console.error('Erreur connexion:', error);
    res.status(500).json({ success: false, message: 'Erreur lors de la connexion', error: process.env.NODE_ENV === 'development' ? error.message : undefined });
  }
});

// 3. Mot de passe oublié
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return res.json({ success: true, message: 'Si cet email existe, un lien de réinitialisation a été envoyé' });
    }

    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    const frontendURL = process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetURL = `${frontendURL}/reset-password/${resetToken}`;

    const message = `
      <!DOCTYPE html><html><head><meta charset="utf-8"><style>body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f6f8; } .container { max-width: 600px; margin: 30px auto; padding: 20px; background: #ffffff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); } .header { background: linear-gradient(90deg, #007bff, #0056d2); color: white; padding: 25px; text-align: center; border-radius: 8px 8px 0 0; } .content { padding: 30px; background-color: #fafafa; } .button { display: inline-block; padding: 14px 28px; background: #007bff; color: white; text-decoration: none; border-radius: 6px; margin: 25px 0; font-weight: bold; } .footer { margin-top: 20px; padding: 20px; background-color: #f1f1f1; text-align: center; font-size: 12px; color: #666; }</style></head>
      <body>
        <div class="container">
          <div class="header"><h1>YALLA EXTRA</h1><h2>Réinitialisation de mot de passe</h2></div>
          <div class="content">
            <p>Bonjour <strong>${user.firstName}</strong>,</p>
            <p>Vous avez demandé la réinitialisation de votre mot de passe Yalla Extra. Cliquez sur le bouton ci-dessous :</p>
            <div style="text-align: center;"><a href="${resetURL}" class="button">🔑 Réinitialiser mon mot de passe</a></div>
            <p><strong>⚠️ Ce lien expirera dans 10 minutes.</strong></p>
          </div>
          <div class="footer"><p>© 2024 Yalla Extra. Tous droits réservés.</p></div>
        </div>
      </body></html>
    `;

    await transporter.sendMail({
      from: process.env.SMTP_FROM || '"Yalla Extra" <noreply@yallaextra.com>',
      to: user.email,
      subject: 'Réinitialisation de votre mot de passe Yalla Extra',
      html: message
    });

    res.json({ success: true, message: 'Un email de réinitialisation a été envoyé' });
  } catch (error) {
    console.error('Erreur mot de passe oublié:', error);
    res.status(500).json({ success: false, message: "Erreur lors de l'envoi de l'email" });
  }
});

// 4. Réinitialisation mot de passe
router.patch('/reset-password/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Les mots de passe ne correspondent pas' });
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({ passwordResetToken: hashedToken, passwordResetExpires: { $gt: Date.now() } });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Token invalide ou expiré' });
    }

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    await transporter.sendMail({
      from: process.env.SMTP_FROM || '"Yalla Extra" <noreply@yallaextra.com>',
      to: user.email,
      subject: 'Confirmation de réinitialisation de mot de passe',
      html: '<h2>Mot de passe modifié avec succès</h2><p>Votre mot de passe a été réinitialisé avec succès.</p>'
    });

    res.json({ success: true, message: 'Mot de passe réinitialisé avec succès' });
  } catch (error) {
    console.error('Erreur réinitialisation mot de passe:', error);
    res.status(500).json({ success: false, message: 'Erreur lors de la réinitialisation du mot de passe' });
  }
});

// 5. Vérifier token réinitialisation
router.get('/verify-reset-token/:token', async (req, res) => {
  try {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({ passwordResetToken: hashedToken, passwordResetExpires: { $gt: Date.now() } });

    if (!user) return res.status(400).json({ success: false, message: 'Token invalide ou expiré' });
    res.json({ success: true, message: 'Token valide' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// 6. Vérifier email
router.get('/verify-email/:token', async (req, res) => {
  try {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({ emailVerificationToken: hashedToken });

    if (!user) return res.status(400).json({ success: false, message: 'Token invalide' });
    if (user.isEmailVerified) return res.json({ success: true, message: 'Email déjà vérifié' });

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save({ validateBeforeSave: false });

    res.json({ success: true, message: 'Email vérifié avec succès !' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur lors de la vérification' });
  }
});

// 7. Renvoyer email de vérification
router.post('/resend-verification', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email.toLowerCase().trim() });
    if (!user) return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
    if (user.isEmailVerified) return res.status(400).json({ success: false, message: 'Email déjà vérifié' });

    const verificationToken = user.createEmailVerificationToken();
    await user.save({ validateBeforeSave: false });

    const frontendURL = process.env.FRONTEND_URL || 'http://localhost:5173';
    const verificationURL = `${frontendURL}/verify-email/${verificationToken}`;

    await transporter.sendMail({
      from: process.env.SMTP_FROM || '"Yalla Extra" <noreply@yallaextra.com>',
      to: user.email,
      subject: 'Vérification de votre email Yalla Extra',
      html: `<p>Cliquez ici pour vérifier votre email : <a href="${verificationURL}">${verificationURL}</a></p>`
    });

    res.json({ success: true, message: 'Email de vérification envoyé !' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur lors de l\'envoi' });
  }
});

// 8. Récupérer l'utilisateur connecté
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

module.exports = router;