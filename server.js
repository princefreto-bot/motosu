const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const helmet = require('helmet');
const cors = require('cors');
const { body, validationResult } = require('express-validator');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'motosu-agencies-secret-key-2024';

// ============================================
// MIDDLEWARE DE SÉCURITÉ
// ============================================
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// ============================================
// CONNEXION MONGODB ATLAS
// ============================================
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('❌ MONGO_URI non définie! Ajoutez-la dans les variables d\'environnement.');
  process.exit(1);
}

console.log('🔄 Connexion à MongoDB Atlas...');

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Connecté à MongoDB Atlas'))
.catch(err => {
  console.error('❌ Erreur connexion MongoDB:', err.message);
  process.exit(1);
});

// ============================================
// MODÈLES MONGOOSE
// ============================================

// Schéma Utilisateur
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, required: true, trim: true },
  password: { type: String, required: true },
  status: { type: String, enum: ['pending', 'pending_payment', 'validated', 'rejected'], default: 'pending' },
  isAdmin: { type: Boolean, default: false },
  balance: { type: Number, default: 0 },
  earnings: { type: Number, default: 0 },
  referralCode: { type: String, unique: true },
  referredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  completedTasks: [{ type: String }],
  watchedVideos: [{ type: String }],
  tasksCompletedToday: [{ type: String }],
  lastTaskDate: { type: String, default: null },
  subscriptionDate: { type: Date, default: null },
  paymentProof: {
    screenshot: String,
    transactionId: String,
    phoneUsed: String,
    submittedAt: Date
  }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

// Schéma Vidéo
const videoSchema = new mongoose.Schema({
  platform: { type: String, enum: ['youtube', 'tiktok'], required: true },
  title: { type: String, required: true },
  url: { type: String, required: true },
  videoId: { type: String },
  duration: { type: Number, required: true }, // en minutes
  reward: { type: Number, required: true }
}, { timestamps: true });

const Video = mongoose.model('Video', videoSchema);

// Schéma Tâche
const taskSchema = new mongoose.Schema({
  type: { type: String, enum: ['sondage', 'verification', 'classification', 'transcription'], required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  reward: { type: Number, required: true },
  content: { type: mongoose.Schema.Types.Mixed, required: true }
}, { timestamps: true });

const Task = mongoose.model('Task', taskSchema);

// Schéma Retrait
const withdrawalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: String,
  userPhone: String,
  amount: { type: Number, required: true },
  method: { type: String, enum: ['moov', 'mix'], required: true },
  accountNumber: { type: String, required: true },
  accountName: String,
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  approvedAt: Date
}, { timestamps: true });

const Withdrawal = mongoose.model('Withdrawal', withdrawalSchema);

// Schéma Paiement
const paymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: String,
  userEmail: String,
  userPhone: String,
  amount: { type: Number, required: true },
  screenshot: String,
  transactionId: String,
  phoneUsed: String,
  status: { type: String, enum: ['pending', 'validated', 'rejected'], default: 'pending' }
}, { timestamps: true });

const Payment = mongoose.model('Payment', paymentSchema);

// Schéma Configuration
const configSchema = new mongoose.Schema({
  key: { type: String, unique: true, required: true },
  value: mongoose.Schema.Types.Mixed
});

const Config = mongoose.model('Config', configSchema);

// ============================================
// INITIALISATION DES DONNÉES PAR DÉFAUT
// ============================================
async function initializeDefaultData() {
  try {
    // Créer admin si n'existe pas
    const adminExists = await User.findOne({ email: 'admin@motosu.com' });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const admin = new User({
        name: 'Administrateur',
        email: 'admin@motosu.com',
        phone: '+225000000000',
        password: hashedPassword,
        status: 'validated',
        isAdmin: true,
        referralCode: 'ADMIN001'
      });
      await admin.save();
      console.log('✅ Admin créé: admin@motosu.com / admin123');
    }

    // Créer config par défaut
    const configExists = await Config.findOne({ key: 'paymentNumbers' });
    if (!configExists) {
      await Config.create({
        key: 'paymentNumbers',
        value: [
          { operator: 'Moov Money', number: '+225 01 00 00 00 00', name: 'MOTOSU AGENCIES' },
          { operator: 'Mix by Yas', number: '+225 07 00 00 00 00', name: 'MOTOSU AGENCIES' }
        ]
      });
      
      await Config.create({
        key: 'subscriptionAmount',
        value: 4000
      });
      
      await Config.create({
        key: 'minReferralsForWithdraw',
        value: 4
      });
      
      console.log('✅ Configuration par défaut créée');
    }

    // Créer vidéos par défaut
    const videosCount = await Video.countDocuments();
    if (videosCount === 0) {
      await Video.insertMany([
        {
          platform: 'youtube',
          title: 'Comment réussir dans le marketing digital en Afrique',
          url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          videoId: 'dQw4w9WgXcQ',
          duration: 3,
          reward: 15
        },
        {
          platform: 'youtube',
          title: 'Les secrets de l\'entrepreneuriat africain',
          url: 'https://www.youtube.com/embed/jNQXAC9IVRw',
          videoId: 'jNQXAC9IVRw',
          duration: 2,
          reward: 10
        }
      ]);
      console.log('✅ Vidéos par défaut créées');
    }

    // Créer tâches par défaut
    const tasksCount = await Task.countDocuments();
    if (tasksCount === 0) {
      await Task.insertMany([
        { 
          type: 'sondage', 
          title: 'Enquête sur les habitudes de paiement mobile', 
          reward: 25, 
          description: 'Répondez à 6 questions sur votre utilisation de Mobile Money',
          content: {
            questions: [
              { question: 'Quel service Mobile Money utilisez-vous le plus ?', options: ['Orange Money', 'MTN Mobile Money', 'Wave', 'Moov Money', 'Autre'] },
              { question: 'Combien de transactions faites-vous par semaine ?', options: ['1-5', '6-10', '11-20', 'Plus de 20'] },
              { question: 'Quel montant moyen par transaction ?', options: ['Moins de 5000 FCFA', '5000-20000 FCFA', '20000-50000 FCFA', 'Plus de 50000 FCFA'] },
              { question: 'Utilisez-vous le paiement mobile pour les achats en ligne ?', options: ['Oui souvent', 'Parfois', 'Rarement', 'Jamais'] },
              { question: 'Avez-vous confiance dans les services Mobile Money ?', options: ['Totalement', 'Plutôt oui', 'Plutôt non', 'Pas du tout'] },
              { question: 'Quelle amélioration souhaitez-vous ?', options: ['Moins de frais', 'Plus de points de retrait', 'Meilleure sécurité', 'Interface plus simple'] }
            ]
          }
        },
        { 
          type: 'sondage', 
          title: 'Étude sur l\'utilisation des réseaux sociaux', 
          reward: 35, 
          description: 'Partagez vos habitudes sur les réseaux sociaux (8 questions)',
          content: {
            questions: [
              { question: 'Quel réseau social utilisez-vous le plus ?', options: ['Facebook', 'WhatsApp', 'TikTok', 'Instagram', 'Twitter/X', 'YouTube'] },
              { question: 'Combien d\'heures par jour passez-vous sur les réseaux ?', options: ['Moins d\'1h', '1-3h', '3-5h', 'Plus de 5h'] },
              { question: 'Suivez-vous des influenceurs africains ?', options: ['Oui beaucoup', 'Quelques-uns', 'Très peu', 'Aucun'] },
              { question: 'Achetez-vous des produits vus sur les réseaux ?', options: ['Souvent', 'Parfois', 'Rarement', 'Jamais'] },
              { question: 'Créez-vous du contenu vous-même ?', options: ['Oui régulièrement', 'De temps en temps', 'Très rarement', 'Jamais'] },
              { question: 'Les réseaux sociaux vous aident-ils professionnellement ?', options: ['Oui beaucoup', 'Un peu', 'Pas vraiment', 'Pas du tout'] },
              { question: 'Utilisez-vous les réseaux pour vous informer ?', options: ['C\'est ma source principale', 'Une source parmi d\'autres', 'Rarement', 'Jamais'] },
              { question: 'Êtes-vous préoccupé par votre vie privée en ligne ?', options: ['Très préoccupé', 'Assez préoccupé', 'Peu préoccupé', 'Pas du tout'] }
            ]
          }
        },
        { 
          type: 'verification', 
          title: 'Vérification d\'adresses email professionnelles', 
          reward: 15, 
          description: 'Identifiez les adresses email valides parmi la liste',
          content: {
            instruction: 'Cochez uniquement les adresses email qui ont un format valide.',
            items: [
              { text: 'contact@entreprise-africa.com', isValid: true },
              { text: 'jean.dupont@@gmail.com', isValid: false },
              { text: 'service.client@banque-ci.net', isValid: true },
              { text: 'info@shop', isValid: false },
              { text: 'support@motosu-agencies.com', isValid: true },
              { text: 'test@test@mail.com', isValid: false },
              { text: 'commercial@orange.ci', isValid: true }
            ]
          }
        },
        { 
          type: 'classification', 
          title: 'Classification de produits e-commerce', 
          reward: 20, 
          description: 'Classez 8 produits dans leurs catégories respectives',
          content: {
            instruction: 'Pour chaque produit, sélectionnez la catégorie qui lui correspond.',
            categories: ['Électronique', 'Mode', 'Maison', 'Alimentation'],
            items: [
              { name: 'Smartphone Samsung Galaxy', correctCategory: 'Électronique' },
              { name: 'Robe en wax africain', correctCategory: 'Mode' },
              { name: 'Ventilateur de table 40W', correctCategory: 'Maison' },
              { name: 'Riz parfumé 5kg', correctCategory: 'Alimentation' },
              { name: 'Écouteurs Bluetooth sans fil', correctCategory: 'Électronique' },
              { name: 'Chaussures en cuir homme', correctCategory: 'Mode' },
              { name: 'Casserole antiadhésive 24cm', correctCategory: 'Maison' },
              { name: 'Huile de palme rouge 1L', correctCategory: 'Alimentation' }
            ]
          }
        },
        { 
          type: 'transcription', 
          title: 'Transcription d\'un message vocal professionnel', 
          reward: 40, 
          description: 'Recopiez exactement le texte affiché sans fautes',
          content: {
            textToTranscribe: 'Bonjour et bienvenue chez Motosu Agencies. Nous sommes heureux de vous accompagner dans votre parcours entrepreneurial. Notre équipe reste à votre disposition.',
            minAccuracy: 80
          }
        },
        { 
          type: 'sondage', 
          title: 'Enquête sur les services bancaires mobiles', 
          reward: 45, 
          description: 'Donnez votre avis sur les services financiers (10 questions)',
          content: {
            questions: [
              { question: 'Avez-vous un compte bancaire traditionnel ?', options: ['Oui, banque locale', 'Oui, banque internationale', 'Non', 'En cours d\'ouverture'] },
              { question: 'Utilisez-vous l\'application mobile de votre banque ?', options: ['Oui quotidiennement', 'Oui parfois', 'Rarement', 'Je n\'en ai pas'] },
              { question: 'Faites-vous des virements internationaux ?', options: ['Souvent', 'Parfois', 'Rarement', 'Jamais'] },
              { question: 'Quel est votre principal obstacle bancaire ?', options: ['Frais trop élevés', 'Accès difficile', 'Manque de confiance', 'Complexité'] },
              { question: 'Seriez-vous intéressé par des microcrédits mobiles ?', options: ['Très intéressé', 'Assez intéressé', 'Peu intéressé', 'Pas du tout'] },
              { question: 'Épargnez-vous régulièrement ?', options: ['Oui chaque mois', 'Quand je peux', 'Rarement', 'Jamais'] },
              { question: 'Quel service de transfert utilisez-vous ?', options: ['Western Union', 'MoneyGram', 'Wave', 'WorldRemit', 'Aucun'] },
              { question: 'Préférez-vous le cash ou le digital ?', options: ['100% digital', 'Plutôt digital', 'Plutôt cash', '100% cash'] },
              { question: 'Faites-vous confiance aux fintechs africaines ?', options: ['Totalement', 'Assez confiance', 'Peu confiance', 'Pas du tout'] },
              { question: 'Quel service financier vous manque le plus ?', options: ['Crédit accessible', 'Assurance mobile', 'Plateforme d\'investissement', 'Épargne rémunérée'] }
            ]
          }
        },
        { 
          type: 'verification', 
          title: 'Vérification de numéros de téléphone', 
          reward: 15, 
          description: 'Identifiez les numéros au format correct',
          content: {
            instruction: 'Cochez les numéros qui respectent le format international (+225 XX XX XX XX XX).',
            items: [
              { text: '+225 07 08 09 10 11', isValid: true },
              { text: '225070809101', isValid: false },
              { text: '+225 05 04 03 02 01', isValid: true },
              { text: '+22 507 080 910', isValid: false },
              { text: '+225 01 02 03 04 05', isValid: true }
            ]
          }
        },
        { 
          type: 'classification', 
          title: 'Classification de contenus digitaux', 
          reward: 20, 
          description: 'Classez 8 types de contenus par catégorie',
          content: {
            instruction: 'Associez chaque contenu à sa catégorie appropriée.',
            categories: ['Éducatif', 'Divertissement', 'Commercial', 'Informatif'],
            items: [
              { name: 'Tutoriel Excel pour débutants', correctCategory: 'Éducatif' },
              { name: 'Clip musical Afrobeat 2024', correctCategory: 'Divertissement' },
              { name: 'Publicité iPhone 15 Pro', correctCategory: 'Commercial' },
              { name: 'Journal télévisé RTI', correctCategory: 'Informatif' },
              { name: 'Cours de programmation Python', correctCategory: 'Éducatif' },
              { name: 'Série télévisée ivoirienne', correctCategory: 'Divertissement' },
              { name: 'Promotion Black Friday Jumia', correctCategory: 'Commercial' },
              { name: 'Bulletin météo Afrique de l\'Ouest', correctCategory: 'Informatif' }
            ]
          }
        },
        { 
          type: 'sondage', 
          title: 'Étude sur les habitudes alimentaires', 
          reward: 30, 
          description: 'Partagez vos habitudes de consommation (6 questions)',
          content: {
            questions: [
              { question: 'Combien de repas prenez-vous par jour ?', options: ['1 repas', '2 repas', '3 repas', 'Plus de 3 repas'] },
              { question: 'Cuisinez-vous à la maison ?', options: ['Toujours', 'Souvent', 'Parfois', 'Rarement'] },
              { question: 'Achetez-vous des plats préparés ?', options: ['Quotidiennement', 'Plusieurs fois/semaine', 'Occasionnellement', 'Jamais'] },
              { question: 'Consommez-vous des produits locaux ?', options: ['Exclusivement local', 'Principalement local', 'Mixte', 'Principalement importé'] },
              { question: 'Utilisez-vous des apps de livraison ?', options: ['Régulièrement', 'Parfois', 'Rarement', 'Jamais'] },
              { question: 'Quel est votre budget alimentaire mensuel ?', options: ['Moins de 30 000 FCFA', '30 000 - 60 000 FCFA', '60 000 - 100 000 FCFA', 'Plus de 100 000 FCFA'] }
            ]
          }
        },
        { 
          type: 'transcription', 
          title: 'Transcription d\'un slogan commercial', 
          reward: 25, 
          description: 'Recopiez le message publicitaire sans erreur',
          content: {
            textToTranscribe: 'Motosu Agencies, votre partenaire de confiance pour réussir en Afrique. Rejoignez notre communauté et développez votre activité dès aujourd\'hui.',
            minAccuracy: 80
          }
        }
      ]);
      console.log('✅ Tâches par défaut créées');
    }
  } catch (error) {
    console.error('❌ Erreur initialisation données:', error);
  }
}

// ============================================
// MIDDLEWARE D'AUTHENTIFICATION JWT
// ============================================
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token manquant' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token invalide' });
    req.user = user;
    next();
  });
};

const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (!err) req.user = user;
    });
  }
  next();
};

// Générer un code de parrainage unique
function generateReferralCode(name) {
  const cleanName = name.replace(/[^a-zA-Z]/g, '').substring(0, 4).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return cleanName + random;
}

// ============================================
// ROUTES STATIQUES
// ============================================
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/api/payment/return', (req, res) => res.redirect('/'));
app.get('/api/payment/cancel', (req, res) => res.redirect('/'));
app.get('/api/payment/notify', (req, res) => res.json({ success: true }));
app.post('/api/payment/notify', (req, res) => res.json({ success: true }));

// ============================================
// API: CONFIGURATION
// ============================================
app.get('/api/config', async (req, res) => {
  try {
    const paymentNumbers = await Config.findOne({ key: 'paymentNumbers' });
    const subscriptionAmount = await Config.findOne({ key: 'subscriptionAmount' });
    
    res.json({
      paymentNumbers: paymentNumbers?.value || [],
      withdrawMethods: [
        { id: 'moov', name: 'Moov Money', min: 1000 },
        { id: 'mix', name: 'Mix by Yas', min: 1000 }
      ],
      subscriptionAmount: subscriptionAmount?.value || 4000
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// API: INSCRIPTION
// ============================================
app.post('/api/register', [
  body('name').trim().isLength({ min: 2 }).withMessage('Nom trop court'),
  body('email').isEmail().normalizeEmail().withMessage('Email invalide'),
  body('phone').trim().isLength({ min: 8 }).withMessage('Téléphone invalide'),
  body('password').isLength({ min: 6 }).withMessage('Mot de passe trop court')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    const { name, email, phone, password, referralCode } = req.body;

    // Vérifier si l'email existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Cet email existe déjà' });
    }

    // Trouver le parrain
    let referredBy = null;
    if (referralCode) {
      const referrer = await User.findOne({ referralCode: referralCode.toUpperCase() });
      if (referrer) referredBy = referrer._id;
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'utilisateur
    const user = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      referralCode: generateReferralCode(name),
      referredBy
    });

    await user.save();

    // Générer le token
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '30d' });

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        status: user.status,
        isAdmin: user.isAdmin,
        balance: user.balance,
        earnings: user.earnings,
        referralCode: user.referralCode,
        completedTasks: user.completedTasks,
        watchedVideos: user.watchedVideos
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// API: CONNEXION
// ============================================
app.post('/api/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').exists()
], async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '30d' });

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        status: user.status,
        isAdmin: user.isAdmin,
        balance: user.balance,
        earnings: user.earnings,
        referralCode: user.referralCode,
        completedTasks: user.completedTasks,
        watchedVideos: user.watchedVideos,
        tasksCompletedToday: user.tasksCompletedToday,
        lastTaskDate: user.lastTaskDate
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// API: RÉCUPÉRER UTILISATEUR
// ============================================
app.get('/api/user/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');
    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });
    
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      status: user.status,
      isAdmin: user.isAdmin,
      balance: user.balance,
      earnings: user.earnings,
      referralCode: user.referralCode,
      completedTasks: user.completedTasks,
      watchedVideos: user.watchedVideos,
      tasksCompletedToday: user.tasksCompletedToday,
      lastTaskDate: user.lastTaskDate
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// API: DASHBOARD
// ============================================
app.get('/api/dashboard/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');
    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });

    const referrals = await User.find({ referredBy: user._id });
    const level2Ids = referrals.map(r => r._id);
    const level2 = await User.find({ referredBy: { $in: level2Ids } });
    const level3Ids = level2.map(r => r._id);
    const level3 = await User.find({ referredBy: { $in: level3Ids } });

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        status: user.status,
        balance: user.balance,
        earnings: user.earnings,
        referralCode: user.referralCode,
        completedTasks: user.completedTasks,
        watchedVideos: user.watchedVideos
      },
      stats: {
        solde: 4000,
        earnings: user.earnings,
        referralsCount: referrals.length,
        level2Count: level2.length,
        level3Count: level3.length,
        tasksCompleted: user.completedTasks.length,
        videosWatched: user.watchedVideos.length
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// API: PREUVE DE PAIEMENT
// ============================================
app.post('/api/payment/proof', async (req, res) => {
  try {
    const { userId, screenshot, transactionId, phoneUsed } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });

    if (!screenshot) {
      return res.status(400).json({ error: 'Capture d\'écran obligatoire' });
    }

    user.paymentProof = {
      screenshot,
      transactionId: transactionId || '',
      phoneUsed: phoneUsed || user.phone,
      submittedAt: new Date()
    };
    user.status = 'pending_payment';
    await user.save();

    // Créer un enregistrement de paiement
    const subscriptionAmount = await Config.findOne({ key: 'subscriptionAmount' });
    await Payment.create({
      userId: user._id,
      userName: user.name,
      userEmail: user.email,
      userPhone: user.phone,
      amount: subscriptionAmount?.value || 4000,
      screenshot,
      transactionId: transactionId || '',
      phoneUsed: phoneUsed || user.phone
    });

    res.json({ success: true, message: 'Preuve de paiement soumise. En attente de validation.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// API: VIDÉOS
// ============================================
app.get('/api/videos', async (req, res) => {
  try {
    const videos = await Video.find().sort({ createdAt: -1 });
    res.json(videos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/videos/:videoId/watch', async (req, res) => {
  try {
    const { userId, watchTime } = req.body;
    const { videoId } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });

    if (user.status !== 'validated') {
      return res.status(403).json({ error: 'Compte non validé' });
    }

    const video = await Video.findById(videoId);
    if (!video) return res.status(404).json({ error: 'Vidéo non trouvée' });

    if (user.watchedVideos.includes(videoId)) {
      return res.status(400).json({ error: 'Vous avez déjà regardé cette vidéo' });
    }

    const requiredTime = video.duration * 60 * 0.8;
    if (watchTime < requiredTime) {
      return res.status(400).json({ error: `Regardez au moins ${Math.ceil(requiredTime)} secondes` });
    }

    user.watchedVideos.push(videoId);
    user.earnings += video.reward;
    await user.save();

    res.json({
      success: true,
      reward: video.reward,
      totalEarnings: user.earnings,
      message: `Bravo! +${video.reward} FCFA gagnés`
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// API: TÂCHES
// ============================================
app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/tasks/:taskId/complete', async (req, res) => {
  try {
    const { userId, answers } = req.body;
    const { taskId } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });

    if (user.status !== 'validated') {
      return res.status(403).json({ error: 'Compte non validé' });
    }

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ error: 'Tâche non trouvée' });

    if (user.completedTasks.includes(taskId)) {
      return res.status(400).json({ error: 'Vous avez déjà complété cette tâche' });
    }

    // Vérifier limite journalière
    const today = new Date().toDateString();
    if (user.lastTaskDate !== today) {
      user.tasksCompletedToday = [];
      user.lastTaskDate = today;
    }

    if (user.tasksCompletedToday.length >= 10) {
      return res.status(400).json({ error: 'Limite de 10 tâches par jour atteinte. Revenez demain!' });
    }

    // Validation selon le type de tâche
    let isValid = false;
    let score = 0;

    if (task.type === 'sondage') {
      if (answers && typeof answers === 'object') {
        const answersArray = Object.values(answers);
        const allAnswered = answersArray.length === task.content.questions.length &&
                            answersArray.every(a => a !== null && a !== undefined && a !== '');
        if (allAnswered) {
          isValid = true;
          score = 100;
        } else {
          return res.status(400).json({ error: `Veuillez répondre aux ${task.content.questions.length} questions.` });
        }
      }
    } else if (task.type === 'verification') {
      if (answers && Array.isArray(answers)) {
        const correctItems = task.content.items.filter(item => item.isValid);
        let correctSelected = 0;
        let incorrectSelected = 0;

        answers.forEach(idx => {
          if (task.content.items[idx]?.isValid) correctSelected++;
          else incorrectSelected++;
        });

        score = Math.max(0, ((correctSelected - incorrectSelected) / correctItems.length) * 100);
        isValid = score >= 50 && correctSelected >= Math.floor(correctItems.length / 2);

        if (!isValid) {
          return res.status(400).json({ error: 'Score insuffisant. Vérifiez vos réponses.' });
        }
      }
    } else if (task.type === 'classification') {
      if (answers && typeof answers === 'object') {
        let correct = 0;
        task.content.items.forEach((item, idx) => {
          if (answers[idx] === item.correctCategory) correct++;
        });
        score = (correct / task.content.items.length) * 100;
        isValid = score >= 60;

        if (!isValid) {
          return res.status(400).json({ error: `Score: ${Math.round(score)}%. Minimum 60% requis.` });
        }
      }
    } else if (task.type === 'transcription') {
      if (answers && typeof answers === 'string' && answers.trim().length > 10) {
        const normalize = (str) => str.toLowerCase()
          .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ').trim();

        const original = normalize(task.content.textToTranscribe);
        const submitted = normalize(answers);

        const words1 = original.split(' ');
        const words2 = submitted.split(' ');

        let matches = 0;
        const tempWords2 = [...words2];
        words1.forEach(w => {
          const idx = tempWords2.indexOf(w);
          if (idx !== -1) {
            matches++;
            tempWords2.splice(idx, 1);
          }
        });

        score = (matches / words1.length) * 100;
        isValid = score >= task.content.minAccuracy;

        if (!isValid) {
          return res.status(400).json({ error: `Précision: ${Math.round(score)}%. Minimum ${task.content.minAccuracy}% requis.` });
        }
      }
    }

    if (isValid) {
      user.completedTasks.push(taskId);
      user.tasksCompletedToday.push(taskId);
      user.earnings += task.reward;
      await user.save();

      res.json({
        success: true,
        reward: task.reward,
        score: Math.round(score),
        totalEarnings: user.earnings,
        message: `Bravo! +${task.reward} FCFA gagnés`
      });
    } else {
      res.status(400).json({ error: 'Tâche non validée' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// API: PARRAINAGES
// ============================================
app.get('/api/referrals/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });

    const level1 = await User.find({ referredBy: user._id }).select('-password');
    const level1Ids = level1.map(u => u._id);
    const level2 = await User.find({ referredBy: { $in: level1Ids } }).select('-password');
    const level2Ids = level2.map(u => u._id);
    const level3 = await User.find({ referredBy: { $in: level2Ids } }).select('-password');

    const validatedLevel1 = level1.filter(u => u.status === 'validated').length;
    const minReferrals = await Config.findOne({ key: 'minReferralsForWithdraw' });

    res.json({
      referralCode: user.referralCode,
      referralLink: `https://motosu.onrender.com?ref=${user.referralCode}`,
      level1: { 
        users: level1.map(u => ({ id: u._id, name: u.name, status: u.status, createdAt: u.createdAt })), 
        commission: 500, 
        total: level1.filter(u => u.status === 'validated').length * 500 
      },
      level2: { 
        users: level2.map(u => ({ id: u._id, name: u.name, status: u.status })), 
        commission: 200, 
        total: level2.filter(u => u.status === 'validated').length * 200 
      },
      level3: { 
        users: level3.map(u => ({ id: u._id, name: u.name, status: u.status })), 
        commission: 100, 
        total: level3.filter(u => u.status === 'validated').length * 100 
      },
      canWithdraw: validatedLevel1 >= (minReferrals?.value || 4),
      validatedReferrals: validatedLevel1,
      requiredReferrals: minReferrals?.value || 4
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// API: RETRAITS
// ============================================
app.post('/api/withdraw', async (req, res) => {
  try {
    const { userId, amount, method, accountNumber, accountName } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });

    if (user.status !== 'validated') {
      return res.status(403).json({ error: 'Compte non validé' });
    }

    if (amount < 15000) {
      return res.status(400).json({ error: 'Minimum 15 000 FCFA pour les retraits' });
    }

    if (amount > user.earnings) {
      return res.status(400).json({ error: 'Solde insuffisant' });
    }

    if (!accountNumber) {
      return res.status(400).json({ error: 'Numéro de compte obligatoire' });
    }

    const withdrawal = await Withdrawal.create({
      userId: user._id,
      userName: user.name,
      userPhone: user.phone,
      amount,
      method,
      accountNumber,
      accountName: accountName || user.name
    });

    user.earnings -= amount;
    await user.save();

    res.json({ success: true, withdrawal, message: 'Demande de retrait envoyée. Traitement sous 24-48h.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/withdrawals/user/:userId', async (req, res) => {
  try {
    const withdrawals = await Withdrawal.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(withdrawals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// API ADMIN
// ============================================
app.post('/api/admin/config/payment-numbers', async (req, res) => {
  try {
    const { paymentNumbers } = req.body;
    if (paymentNumbers && Array.isArray(paymentNumbers)) {
      await Config.findOneAndUpdate(
        { key: 'paymentNumbers' },
        { value: paymentNumbers },
        { upsert: true }
      );
      res.json({ success: true, paymentNumbers });
    } else {
      res.status(400).json({ error: 'Format invalide' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/admin/config', async (req, res) => {
  try {
    const paymentNumbers = await Config.findOne({ key: 'paymentNumbers' });
    const subscriptionAmount = await Config.findOne({ key: 'subscriptionAmount' });
    const minReferrals = await Config.findOne({ key: 'minReferralsForWithdraw' });
    
    res.json({
      paymentNumbers: paymentNumbers?.value || [],
      subscriptionAmount: subscriptionAmount?.value || 4000,
      minReferralsForWithdraw: minReferrals?.value || 4
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/admin/pending', async (req, res) => {
  try {
    const pending = await User.find({ 
      status: { $in: ['pending', 'pending_payment'] } 
    }).select('-password').sort({ createdAt: -1 });
    res.json(pending);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/admin/users', async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/admin/validate/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });

    user.status = 'validated';
    user.balance = 4000;
    user.subscriptionDate = new Date();
    await user.save();

    // Commissions de parrainage
    if (user.referredBy) {
      const level1 = await User.findById(user.referredBy);
      if (level1) {
        level1.earnings += 2000;
        await level1.save();

        if (level1.referredBy) {
          const level2 = await User.findById(level1.referredBy);
          if (level2) {
            level2.earnings += 800;
            await level2.save();

            if (level2.referredBy) {
              const level3 = await User.findById(level2.referredBy);
              if (level3) {
                level3.earnings += 400;
                await level3.save();
              }
            }
          }
        }
      }
    }

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/admin/reject/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });

    user.status = 'rejected';
    user.paymentProof = undefined;
    await user.save();

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/admin/withdrawals', async (req, res) => {
  try {
    const withdrawals = await Withdrawal.find().sort({ createdAt: -1 });
    res.json(withdrawals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/admin/withdraw/approve/:withdrawId', async (req, res) => {
  try {
    const withdrawal = await Withdrawal.findById(req.params.withdrawId);
    if (!withdrawal) return res.status(404).json({ error: 'Retrait non trouvé' });

    withdrawal.status = 'approved';
    withdrawal.approvedAt = new Date();
    await withdrawal.save();

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/admin/withdraw/reject/:withdrawId', async (req, res) => {
  try {
    const withdrawal = await Withdrawal.findById(req.params.withdrawId);
    if (!withdrawal) return res.status(404).json({ error: 'Retrait non trouvé' });

    withdrawal.status = 'rejected';
    await withdrawal.save();

    // Rembourser l'utilisateur
    const user = await User.findById(withdrawal.userId);
    if (user) {
      user.earnings += withdrawal.amount;
      await user.save();
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Vidéos
app.get('/api/admin/videos', async (req, res) => {
  try {
    const videos = await Video.find().sort({ createdAt: -1 });
    res.json(videos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/admin/videos', async (req, res) => {
  try {
    const { platform, title, url, duration, reward } = req.body;

    if (!platform || !title || !url || !duration || !reward) {
      return res.status(400).json({ error: 'Tous les champs sont obligatoires' });
    }

    let videoId = '';
    let embedUrl = url;

    if (platform === 'youtube') {
      const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
      if (match) {
        videoId = match[1];
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
      }
    } else if (platform === 'tiktok') {
      const match = url.match(/(?:video\/)?(\d{15,25})/);
      if (match) {
        videoId = match[1];
        embedUrl = `https://www.tiktok.com/embed/v2/${videoId}`;
      }
    }

    const video = await Video.create({
      platform,
      title,
      url: embedUrl,
      videoId,
      duration: parseInt(duration),
      reward: parseInt(reward)
    });

    res.json({ success: true, video });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/admin/videos/:videoId', async (req, res) => {
  try {
    const result = await Video.findByIdAndDelete(req.params.videoId);
    if (!result) return res.status(404).json({ error: 'Vidéo non trouvée' });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Tâches
app.get('/api/admin/tasks', async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/admin/tasks', async (req, res) => {
  try {
    const { type, title, reward, description, content } = req.body;
    const task = await Task.create({
      type,
      title,
      reward: parseInt(reward),
      description,
      content: content || {}
    });
    res.json({ success: true, task });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/admin/tasks/:taskId', async (req, res) => {
  try {
    const result = await Task.findByIdAndDelete(req.params.taskId);
    if (!result) return res.status(404).json({ error: 'Tâche non trouvée' });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/admin/payments', async (req, res) => {
  try {
    const payments = await Payment.find().sort({ createdAt: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/admin/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ isAdmin: false });
    const validatedUsers = await User.countDocuments({ status: 'validated', isAdmin: false });
    const pendingUsers = await User.countDocuments({ status: { $in: ['pending', 'pending_payment'] } });
    const users = await User.find();
    const totalEarnings = users.reduce((sum, u) => sum + u.earnings, 0);
    const approvedWithdrawals = await Withdrawal.find({ status: 'approved' });
    const totalWithdrawals = approvedWithdrawals.reduce((sum, w) => sum + w.amount, 0);
    const pendingWithdrawals = await Withdrawal.countDocuments({ status: 'pending' });
    const tasksCount = await Task.countDocuments();
    const videosCount = await Video.countDocuments();

    res.json({
      totalUsers,
      validatedUsers,
      pendingUsers,
      totalEarnings,
      totalWithdrawals,
      pendingWithdrawals,
      tasksCount,
      videosCount
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// DÉMARRAGE DU SERVEUR
// ============================================
mongoose.connection.once('open', async () => {
  await initializeDefaultData();
  
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Motosu Agencies server running on port ${PORT}`);
  });
});