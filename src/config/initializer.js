/**
 * Initialisation des données par défaut
 * Gère la migration SHA256 → bcrypt
 */

const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Task = require('../models/Task');
const Video = require('../models/Video');
const Config = require('../models/Config');
const SystemConfig = require('../models/SystemConfig');
const { DEFAULT_PAYMENT_NUMBERS, SUBSCRIPTION_AMOUNT } = require('./constants');

const defaultTasks = [
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
];

const defaultVideos = [
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
];

async function initializeData() {
  try {
    // Gérer l'admin - créer OU mettre à jour le mot de passe (migration SHA256 → bcrypt)
    const adminExists = await User.findOne({ email: 'admin@motosu.com' });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await User.create({
        name: 'Administrateur',
        email: 'admin@motosu.com',
        phone: '+225000000000',
        password: hashedPassword,
        status: 'validated',
        isAdmin: true,
        referralCode: 'ADMIN001'
      });
      console.log('✅ Admin créé: admin@motosu.com / admin123');
    } else {
      // Vérifier si le mot de passe est en bcrypt (commence par $2a$ ou $2b$)
      const isBcrypt = adminExists.password && adminExists.password.startsWith('$2');
      if (!isBcrypt) {
        // Migration : ancien hash SHA256 → nouveau hash bcrypt
        const hashedPassword = await bcrypt.hash('admin123', 10);
        adminExists.password = hashedPassword;
        adminExists.status = 'validated';
        adminExists.isAdmin = true;
        await adminExists.save();
        console.log('✅ Admin migré vers bcrypt: admin@motosu.com / admin123');
      }
    }

    // Migrer TOUS les utilisateurs avec hash SHA256 vers bcrypt
    const allUsers = await User.find({});
    for (const user of allUsers) {
      if (user.password && !user.password.startsWith('$2')) {
        // C'est un hash SHA256, on ne peut pas le convertir
        // L'utilisateur devra se réinscrire ou demander un reset
        console.log(`⚠️ Utilisateur ${user.email} a un ancien hash, reset nécessaire`);
      }
    }

    // Créer config par défaut
    const configExists = await Config.findOne({ key: 'paymentNumbers' });
    if (!configExists) {
      await Config.create({ key: 'paymentNumbers', value: DEFAULT_PAYMENT_NUMBERS });
      await Config.create({ key: 'subscriptionAmount', value: SUBSCRIPTION_AMOUNT });
      await Config.create({ key: 'minReferralsForWithdraw', value: 0 });
      console.log('✅ Configuration par défaut créée');
    }

    // Créer cycle des tâches par défaut
    const cycleExists = await SystemConfig.findOne({ key: 'taskCycle' });
    if (!cycleExists) {
      await SystemConfig.create({
        key: 'taskCycle',
        value: {
          startDate: new Date().toISOString(),
          activeDays: 2,
          pauseDays: 3
        }
      });
      console.log('✅ Cycle des tâches configuré');
    }

    // Créer vidéos par défaut
    const videosCount = await Video.countDocuments();
    if (videosCount === 0) {
      await Video.insertMany(defaultVideos);
      console.log('✅ Vidéos par défaut créées');
    }

    // Créer tâches par défaut
    const tasksCount = await Task.countDocuments();
    if (tasksCount === 0) {
      await Task.insertMany(defaultTasks);
      console.log('✅ Tâches par défaut créées');
    }

    console.log('✅ Initialisation des données terminée');
  } catch (error) {
    console.error('❌ Erreur initialisation:', error.message);
  }
}

module.exports = { initializeData };
