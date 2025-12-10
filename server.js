const express = require('express');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Stockage en mémoire
const db = {
  config: {
    paymentNumbers: [
      { operator: 'Orange Money', number: '+225 07 00 00 00 00', name: 'MOTOSU AGENCIES' },
      { operator: 'MTN Mobile Money', number: '+225 05 00 00 00 00', name: 'MOTOSU AGENCIES' },
      { operator: 'Wave', number: '+225 01 00 00 00 00', name: 'MOTOSU AGENCIES' },
      { operator: 'Moov Money', number: '+225 01 00 00 00 00', name: 'MOTOSU AGENCIES' }
    ],
    subscriptionAmount: 4000,
    minReferralsForWithdraw: 4
  },
  users: [{
    id: 'admin-001',
    name: 'Administrateur',
    email: 'admin@motosu.com',
    phone: '+225000000000',
    password: crypto.createHash('sha256').update('admin123').digest('hex'),
    status: 'validated',
    isAdmin: true,
    balance: 0,
    earnings: 0,
    referralCode: 'ADMIN001',
    referredBy: null,
    createdAt: new Date().toISOString(),
    tasksCompletedToday: [],
    lastTaskDate: null,
    completedTasks: [],
    watchedVideos: [],
    subscriptionDate: null,
    paymentProof: null
  }],
  videos: [
    {
      id: 'video-1',
      platform: 'youtube',
      title: 'Comment réussir dans le marketing digital en Afrique',
      url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      videoId: 'dQw4w9WgXcQ',
      duration: 3,
      reward: 15,
      createdAt: new Date().toISOString()
    },
    {
      id: 'video-2',
      platform: 'youtube',
      title: 'Les secrets de l\'entrepreneuriat africain',
      url: 'https://www.youtube.com/embed/3JZ_D3ELwOQ',
      videoId: '3JZ_D3ELwOQ',
      duration: 4,
      reward: 20,
      createdAt: new Date().toISOString()
    },
    {
      id: 'video-3',
      platform: 'tiktok',
      title: 'Astuce business du jour',
      url: 'https://www.tiktok.com/embed/v2/7234567890123456789',
      videoId: '7234567890123456789',
      duration: 1,
      reward: 5,
      createdAt: new Date().toISOString()
    }
  ],
  tasks: [
    { 
      id: 'task-1', 
      type: 'sondage', 
      title: 'Enquête sur les habitudes de paiement mobile', 
      reward: 25, 
      description: 'Répondez à 6 questions sur votre utilisation de Mobile Money',
      content: {
        questions: [
          { 
            question: 'Quel service Mobile Money utilisez-vous le plus ?', 
            options: ['Orange Money', 'MTN Mobile Money', 'Wave', 'Moov Money', 'Autre'] 
          },
          { 
            question: 'Combien de transactions faites-vous par semaine ?', 
            options: ['1-5', '6-10', '11-20', 'Plus de 20'] 
          },
          { 
            question: 'Quel montant moyen par transaction ?', 
            options: ['Moins de 5000 FCFA', '5000-20000 FCFA', '20000-50000 FCFA', 'Plus de 50000 FCFA'] 
          },
          { 
            question: 'Utilisez-vous le paiement mobile pour les achats en ligne ?', 
            options: ['Oui souvent', 'Parfois', 'Rarement', 'Jamais'] 
          },
          { 
            question: 'Avez-vous confiance dans les services Mobile Money ?', 
            options: ['Totalement', 'Plutôt oui', 'Plutôt non', 'Pas du tout'] 
          },
          { 
            question: 'Quelle amélioration souhaitez-vous ?', 
            options: ['Moins de frais', 'Plus de points de retrait', 'Meilleure sécurité', 'Interface plus simple'] 
          }
        ]
      }
    },
    { 
      id: 'task-2', 
      type: 'sondage', 
      title: 'Étude sur l\'utilisation des réseaux sociaux', 
      reward: 35, 
      description: 'Partagez vos habitudes sur les réseaux sociaux (8 questions)',
      content: {
        questions: [
          { 
            question: 'Quel réseau social utilisez-vous le plus ?', 
            options: ['Facebook', 'WhatsApp', 'TikTok', 'Instagram', 'Twitter/X', 'YouTube'] 
          },
          { 
            question: 'Combien d\'heures par jour passez-vous sur les réseaux ?', 
            options: ['Moins d\'1h', '1-3h', '3-5h', 'Plus de 5h'] 
          },
          { 
            question: 'Suivez-vous des influenceurs africains ?', 
            options: ['Oui beaucoup', 'Quelques-uns', 'Très peu', 'Aucun'] 
          },
          { 
            question: 'Achetez-vous des produits vus sur les réseaux ?', 
            options: ['Souvent', 'Parfois', 'Rarement', 'Jamais'] 
          },
          { 
            question: 'Créez-vous du contenu vous-même ?', 
            options: ['Oui régulièrement', 'De temps en temps', 'Très rarement', 'Jamais'] 
          },
          { 
            question: 'Les réseaux sociaux vous aident-ils professionnellement ?', 
            options: ['Oui beaucoup', 'Un peu', 'Pas vraiment', 'Pas du tout'] 
          },
          { 
            question: 'Utilisez-vous les réseaux pour vous informer ?', 
            options: ['C\'est ma source principale', 'Une source parmi d\'autres', 'Rarement', 'Jamais'] 
          },
          { 
            question: 'Êtes-vous préoccupé par votre vie privée en ligne ?', 
            options: ['Très préoccupé', 'Assez préoccupé', 'Peu préoccupé', 'Pas du tout'] 
          }
        ]
      }
    },
    { 
      id: 'task-3', 
      type: 'verification', 
      title: 'Vérification d\'adresses email professionnelles', 
      reward: 15, 
      description: 'Identifiez les 5 adresses email valides parmi la liste',
      content: {
        instruction: 'Sélectionnez uniquement les adresses email qui ont un format valide (exemple: nom@domaine.com)',
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
      id: 'task-4', 
      type: 'classification', 
      title: 'Classification de produits e-commerce', 
      reward: 20, 
      description: 'Classez 8 produits dans leurs catégories respectives',
      content: {
        instruction: 'Associez chaque produit à sa catégorie appropriée',
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
      id: 'task-5', 
      type: 'transcription', 
      title: 'Transcription d\'un message vocal professionnel', 
      reward: 40, 
      description: 'Recopiez exactement le texte affiché sans fautes',
      content: {
        textToTranscribe: 'Bonjour et bienvenue chez Motosu Agencies. Nous sommes heureux de vous accompagner dans votre parcours entrepreneurial. Notre équipe reste à votre disposition pour toute question. Merci de votre confiance.',
        minAccuracy: 85
      }
    },
    { 
      id: 'task-6', 
      type: 'sondage', 
      title: 'Enquête sur les services bancaires mobiles', 
      reward: 45, 
      description: 'Donnez votre avis sur les banques et services financiers (10 questions)',
      content: {
        questions: [
          { 
            question: 'Avez-vous un compte bancaire traditionnel ?', 
            options: ['Oui, dans une banque locale', 'Oui, dans une banque internationale', 'Non', 'En cours d\'ouverture'] 
          },
          { 
            question: 'Utilisez-vous l\'application mobile de votre banque ?', 
            options: ['Oui quotidiennement', 'Oui parfois', 'Rarement', 'Je n\'en ai pas'] 
          },
          { 
            question: 'Faites-vous des virements internationaux ?', 
            options: ['Souvent', 'Parfois', 'Rarement', 'Jamais'] 
          },
          { 
            question: 'Quel est votre principal obstacle bancaire ?', 
            options: ['Frais trop élevés', 'Accès difficile', 'Manque de confiance', 'Complexité des procédures'] 
          },
          { 
            question: 'Seriez-vous intéressé par des microcrédits mobiles ?', 
            options: ['Très intéressé', 'Assez intéressé', 'Peu intéressé', 'Pas du tout intéressé'] 
          },
          { 
            question: 'Épargnez-vous régulièrement ?', 
            options: ['Oui chaque mois', 'Quand je peux', 'Rarement', 'Jamais'] 
          },
          { 
            question: 'Quel service de transfert utilisez-vous ?', 
            options: ['Western Union', 'MoneyGram', 'Wave', 'WorldRemit', 'Aucun'] 
          },
          { 
            question: 'Préférez-vous le cash ou le digital ?', 
            options: ['100% digital', 'Plutôt digital', 'Plutôt cash', '100% cash'] 
          },
          { 
            question: 'Faites-vous confiance aux fintechs africaines ?', 
            options: ['Totalement', 'Assez confiance', 'Peu confiance', 'Pas du tout'] 
          },
          { 
            question: 'Quel service financier vous manque le plus ?', 
            options: ['Crédit accessible', 'Assurance mobile', 'Plateforme d\'investissement', 'Épargne rémunérée'] 
          }
        ]
      }
    },
    { 
      id: 'task-7', 
      type: 'verification', 
      title: 'Vérification de numéros de téléphone', 
      reward: 15, 
      description: 'Identifiez les numéros au format international correct',
      content: {
        instruction: 'Sélectionnez les numéros qui respectent le format international (+225 XX XX XX XX XX)',
        items: [
          { text: '+225 07 08 09 10 11', isValid: true },
          { text: '225070809101', isValid: false },
          { text: '+225 05 04 03 02 01', isValid: true },
          { text: '+22 507 080 910', isValid: false },
          { text: '+225 01 02 03 04 05', isValid: true },
          { text: '07 08 09 10 11', isValid: false },
          { text: '+225 07 77 88 99 00', isValid: true }
        ]
      }
    },
    { 
      id: 'task-8', 
      type: 'classification', 
      title: 'Classification de contenus digitaux', 
      reward: 20, 
      description: 'Classez 8 types de contenus par catégorie',
      content: {
        instruction: 'Associez chaque contenu à sa catégorie appropriée',
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
      id: 'task-9', 
      type: 'sondage', 
      title: 'Étude sur les habitudes alimentaires', 
      reward: 30, 
      description: 'Partagez vos habitudes de consommation alimentaire (6 questions)',
      content: {
        questions: [
          { 
            question: 'Combien de repas prenez-vous par jour ?', 
            options: ['1 repas', '2 repas', '3 repas', 'Plus de 3 repas'] 
          },
          { 
            question: 'Cuisinez-vous à la maison ?', 
            options: ['Toujours', 'Souvent', 'Parfois', 'Rarement'] 
          },
          { 
            question: 'Achetez-vous des plats préparés ?', 
            options: ['Quotidiennement', 'Plusieurs fois par semaine', 'Occasionnellement', 'Jamais'] 
          },
          { 
            question: 'Consommez-vous des produits locaux ?', 
            options: ['Exclusivement local', 'Principalement local', 'Mixte local/importé', 'Principalement importé'] 
          },
          { 
            question: 'Utilisez-vous des apps de livraison de repas ?', 
            options: ['Régulièrement', 'Parfois', 'Rarement', 'Jamais'] 
          },
          { 
            question: 'Quel est votre budget alimentaire mensuel ?', 
            options: ['Moins de 30 000 FCFA', '30 000 - 60 000 FCFA', '60 000 - 100 000 FCFA', 'Plus de 100 000 FCFA'] 
          }
        ]
      }
    },
    { 
      id: 'task-10', 
      type: 'transcription', 
      title: 'Transcription d\'un slogan commercial', 
      reward: 25, 
      description: 'Recopiez le message publicitaire sans erreur',
      content: {
        textToTranscribe: 'Motosu Agencies, votre partenaire de confiance pour réussir en Afrique. Rejoignez notre communauté et développez votre activité dès aujourd\'hui.',
        minAccuracy: 85
      }
    }
  ],
  withdrawals: [],
  payments: []
};

// Utilitaires
const hashPassword = (pwd) => crypto.createHash('sha256').update(pwd).digest('hex');
const generateId = () => crypto.randomBytes(8).toString('hex');
const generateReferralCode = (name) => {
  const cleanName = name.replace(/[^a-zA-Z]/g, '').substring(0, 4).toUpperCase();
  return cleanName + generateId().substring(0, 4).toUpperCase();
};

// Servir index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Routes de paiement (pour compatibilité)
app.get('/api/payment/return', (req, res) => res.redirect('/'));
app.get('/api/payment/cancel', (req, res) => res.redirect('/'));
app.get('/api/payment/notify', (req, res) => res.json({ success: true }));
app.post('/api/payment/notify', (req, res) => res.json({ success: true }));

// API: Configuration
app.get('/api/config', (req, res) => {
  res.json({
    paymentNumbers: db.config.paymentNumbers,
    subscriptionAmount: db.config.subscriptionAmount
  });
});

// API: Inscription
app.post('/api/register', (req, res) => {
  const { name, email, phone, password, referralCode } = req.body;
  
  if (!name || !email || !phone || !password) {
    return res.status(400).json({ error: 'Tous les champs sont obligatoires' });
  }
  
  if (db.users.find(u => u.email === email)) {
    return res.status(400).json({ error: 'Cet email existe déjà' });
  }
  
  let referredBy = null;
  if (referralCode) {
    const referrer = db.users.find(u => u.referralCode === referralCode);
    if (referrer) referredBy = referrer.id;
  }
  
  const user = {
    id: generateId(),
    name,
    email,
    phone,
    password: hashPassword(password),
    status: 'pending',
    isAdmin: false,
    balance: 0,
    earnings: 0,
    referralCode: generateReferralCode(name),
    referredBy,
    createdAt: new Date().toISOString(),
    tasksCompletedToday: [],
    lastTaskDate: null,
    completedTasks: [],
    watchedVideos: [],
    subscriptionDate: null,
    paymentProof: null
  };
  
  db.users.push(user);
  res.json({ success: true, user: { ...user, password: undefined } });
});

// API: Connexion
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const user = db.users.find(u => u.email === email && u.password === hashPassword(password));
  
  if (!user) {
    return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
  }
  
  res.json({ success: true, user: { ...user, password: undefined } });
});

// API: Récupérer utilisateur
app.get('/api/user/:userId', (req, res) => {
  const user = db.users.find(u => u.id === req.params.userId);
  if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });
  res.json({ ...user, password: undefined });
});

// API: Dashboard
app.get('/api/dashboard/:userId', (req, res) => {
  const user = db.users.find(u => u.id === req.params.userId);
  if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });
  
  const referrals = db.users.filter(u => u.referredBy === user.id);
  const level2 = db.users.filter(u => referrals.some(r => r.id === u.referredBy));
  const level3 = db.users.filter(u => level2.some(r => r.id === u.referredBy));
  
  res.json({
    user: { ...user, password: undefined },
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
});

// API: Soumettre preuve de paiement
app.post('/api/payment/proof', (req, res) => {
  const { userId, screenshot, transactionId, phoneUsed } = req.body;
  
  const user = db.users.find(u => u.id === userId);
  if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });
  
  if (!screenshot) {
    return res.status(400).json({ error: 'Capture d\'écran obligatoire' });
  }
  
  user.paymentProof = {
    screenshot,
    transactionId: transactionId || '',
    phoneUsed: phoneUsed || user.phone,
    submittedAt: new Date().toISOString()
  };
  user.status = 'pending_payment';
  
  db.payments.push({
    id: generateId(),
    userId: userId,
    userName: user.name,
    userEmail: user.email,
    userPhone: user.phone,
    amount: db.config.subscriptionAmount,
    screenshot,
    transactionId: transactionId || '',
    phoneUsed: phoneUsed || user.phone,
    status: 'pending',
    createdAt: new Date().toISOString()
  });
  
  res.json({ success: true, message: 'Preuve de paiement soumise. En attente de validation.' });
});

// API: Vidéos
app.get('/api/videos', (req, res) => {
  res.json(db.videos);
});

// API: Regarder une vidéo
app.post('/api/videos/:videoId/watch', (req, res) => {
  const { userId, watchTime } = req.body;
  const { videoId } = req.params;
  
  const user = db.users.find(u => u.id === userId);
  if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });
  
  if (user.status !== 'validated') {
    return res.status(403).json({ error: 'Compte non validé' });
  }
  
  const video = db.videos.find(v => v.id === videoId);
  if (!video) return res.status(404).json({ error: 'Vidéo non trouvée' });
  
  // Vérifier si déjà regardée
  if (user.watchedVideos.includes(videoId)) {
    return res.status(400).json({ error: 'Vous avez déjà regardé cette vidéo' });
  }
  
  // Vérifier que le temps de visionnage est suffisant (au moins 80% de la durée)
  const requiredTime = video.duration * 60 * 0.8; // 80% en secondes
  if (watchTime < requiredTime) {
    return res.status(400).json({ error: `Regardez au moins ${Math.ceil(requiredTime)} secondes pour valider` });
  }
  
  user.watchedVideos.push(videoId);
  user.earnings += video.reward;
  
  res.json({ 
    success: true, 
    reward: video.reward, 
    totalEarnings: user.earnings,
    message: `Bravo! +${video.reward} FCFA gagnés`
  });
});

// API: Tâches
app.get('/api/tasks', (req, res) => {
  res.json(db.tasks);
});

// API: Compléter tâche
app.post('/api/tasks/:taskId/complete', (req, res) => {
  const { userId, answers } = req.body;
  const { taskId } = req.params;
  
  const user = db.users.find(u => u.id === userId);
  if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });
  
  if (user.status !== 'validated') {
    return res.status(403).json({ error: 'Compte non validé' });
  }
  
  const task = db.tasks.find(t => t.id === taskId);
  if (!task) return res.status(404).json({ error: 'Tâche non trouvée' });
  
  if (user.completedTasks.includes(taskId)) {
    return res.status(400).json({ error: 'Vous avez déjà complété cette tâche' });
  }
  
  const today = new Date().toDateString();
  if (user.lastTaskDate !== today) {
    user.tasksCompletedToday = [];
    user.lastTaskDate = today;
  }
  
  if (user.tasksCompletedToday.length >= 10) {
    return res.status(400).json({ error: 'Limite de 10 tâches par jour atteinte. Revenez demain!' });
  }
  
  let isValid = false;
  let score = 0;
  
  if (task.type === 'sondage') {
    if (answers && Array.isArray(answers) && answers.length === task.content.questions.length) {
      const allAnswered = answers.every(a => a !== null && a !== undefined && a !== '');
      if (allAnswered) {
        isValid = true;
        score = 100;
      } else {
        return res.status(400).json({ error: 'Veuillez répondre à toutes les questions' });
      }
    } else {
      return res.status(400).json({ error: `Vous devez répondre aux ${task.content.questions.length} questions` });
    }
  } else if (task.type === 'verification') {
    if (answers && Array.isArray(answers)) {
      const correctItems = task.content.items.filter(item => item.isValid);
      const incorrectItems = task.content.items.filter(item => !item.isValid);
      
      let correctSelected = 0;
      let incorrectSelected = 0;
      
      answers.forEach(idx => {
        if (task.content.items[idx]?.isValid) {
          correctSelected++;
        } else {
          incorrectSelected++;
        }
      });
      
      // Score basé sur les bonnes sélections moins les mauvaises
      const maxScore = correctItems.length;
      score = Math.max(0, ((correctSelected - incorrectSelected) / maxScore) * 100);
      isValid = score >= 50 && correctSelected >= Math.floor(correctItems.length / 2);
      
      if (!isValid) {
        return res.status(400).json({ error: 'Trop d\'erreurs. Identifiez correctement les éléments valides.' });
      }
    } else {
      return res.status(400).json({ error: 'Veuillez sélectionner les éléments valides' });
    }
  } else if (task.type === 'classification') {
    if (answers && typeof answers === 'object') {
      let correct = 0;
      const totalItems = task.content.items.length;
      
      task.content.items.forEach((item, idx) => {
        if (answers[idx] === item.correctCategory) correct++;
      });
      
      score = (correct / totalItems) * 100;
      isValid = score >= 60;
      
      if (!isValid) {
        return res.status(400).json({ error: `Score insuffisant (${Math.round(score)}%). Minimum 60% requis. Vous avez ${correct}/${totalItems} correct.` });
      }
    } else {
      return res.status(400).json({ error: 'Veuillez classifier tous les éléments' });
    }
  } else if (task.type === 'transcription') {
    if (answers && typeof answers === 'string' && answers.trim().length > 10) {
      const normalize = (str) => str.toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
      
      const original = normalize(task.content.textToTranscribe);
      const submitted = normalize(answers);
      
      // Calcul de similarité par mots
      const words1 = original.split(' ');
      const words2 = submitted.split(' ');
      
      let matches = 0;
      words1.forEach(w => {
        const idx = words2.indexOf(w);
        if (idx !== -1) {
          matches++;
          words2.splice(idx, 1);
        }
      });
      
      score = (matches / words1.length) * 100;
      isValid = score >= task.content.minAccuracy;
      
      if (!isValid) {
        return res.status(400).json({ error: `Précision insuffisante (${Math.round(score)}%). Minimum ${task.content.minAccuracy}% requis. Vérifiez l'orthographe.` });
      }
    } else {
      return res.status(400).json({ error: 'Veuillez saisir la transcription complète (minimum 10 caractères)' });
    }
  }
  
  if (isValid) {
    user.completedTasks.push(taskId);
    user.tasksCompletedToday.push(taskId);
    user.earnings += task.reward;
    
    res.json({ 
      success: true, 
      reward: task.reward, 
      score: Math.round(score),
      totalEarnings: user.earnings,
      message: `Bravo! +${task.reward} FCFA gagnés (Score: ${Math.round(score)}%)`
    });
  } else {
    res.status(400).json({ error: 'Tâche non validée' });
  }
});

// API: Parrainages
app.get('/api/referrals/:userId', (req, res) => {
  const user = db.users.find(u => u.id === req.params.userId);
  if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });
  
  const level1 = db.users.filter(u => u.referredBy === user.id).map(u => ({ ...u, password: undefined }));
  const level2 = db.users.filter(u => level1.some(r => r.id === u.referredBy)).map(u => ({ ...u, password: undefined }));
  const level3 = db.users.filter(u => level2.some(r => r.id === u.referredBy)).map(u => ({ ...u, password: undefined }));
  
  const validatedLevel1 = level1.filter(u => u.status === 'validated').length;
  
  res.json({
    referralCode: user.referralCode,
    referralLink: `https://motosu.onrender.com?ref=${user.referralCode}`,
    level1: { users: level1, commission: 500, total: level1.filter(u => u.status === 'validated').length * 500 },
    level2: { users: level2, commission: 200, total: level2.filter(u => u.status === 'validated').length * 200 },
    level3: { users: level3, commission: 100, total: level3.filter(u => u.status === 'validated').length * 100 },
    canWithdraw: validatedLevel1 >= db.config.minReferralsForWithdraw,
    validatedReferrals: validatedLevel1,
    requiredReferrals: db.config.minReferralsForWithdraw
  });
});

// API: Demande de retrait
app.post('/api/withdraw', (req, res) => {
  const { userId, amount, method, accountNumber, accountName } = req.body;
  
  const user = db.users.find(u => u.id === userId);
  if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });
  
  if (user.status !== 'validated') {
    return res.status(403).json({ error: 'Compte non validé' });
  }
  
  // Vérifier le nombre de parrainages
  const referrals = db.users.filter(u => u.referredBy === user.id && u.status === 'validated');
  if (referrals.length < db.config.minReferralsForWithdraw) {
    return res.status(400).json({ 
      error: `Invitez plus d'amis pour débloquer les retraits! Partagez votre lien et grandissez ensemble.`,
      needMoreReferrals: true,
      current: referrals.length,
      required: db.config.minReferralsForWithdraw
    });
  }
  
  const minAmount = method === 'crypto' ? 10000 : 1000;
  if (amount < minAmount) {
    return res.status(400).json({ error: `Minimum ${minAmount} FCFA pour ${method}` });
  }
  
  if (amount > user.earnings) {
    return res.status(400).json({ error: 'Solde insuffisant' });
  }
  
  if (!accountNumber) {
    return res.status(400).json({ error: 'Numéro de compte obligatoire' });
  }
  
  const withdrawal = {
    id: generateId(),
    userId: userId,
    userName: user.name,
    userPhone: user.phone,
    amount,
    method,
    accountNumber,
    accountName: accountName || user.name,
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  
  db.withdrawals.push(withdrawal);
  user.earnings -= amount;
  
  res.json({ success: true, withdrawal, message: 'Demande de retrait envoyée. Traitement sous 24-48h.' });
});

// API: Retraits utilisateur
app.get('/api/withdrawals/user/:userId', (req, res) => {
  const withdrawals = db.withdrawals.filter(w => w.userId === req.params.userId);
  res.json(withdrawals);
});

// === ADMIN APIs ===

app.post('/api/admin/config/payment-numbers', (req, res) => {
  const { paymentNumbers } = req.body;
  if (paymentNumbers && Array.isArray(paymentNumbers)) {
    db.config.paymentNumbers = paymentNumbers;
    res.json({ success: true, paymentNumbers: db.config.paymentNumbers });
  } else {
    res.status(400).json({ error: 'Format invalide' });
  }
});

app.get('/api/admin/config', (req, res) => {
  res.json(db.config);
});

app.get('/api/admin/pending', (req, res) => {
  const pending = db.users.filter(u => u.status === 'pending' || u.status === 'pending_payment').map(u => ({ ...u, password: undefined }));
  res.json(pending);
});

app.get('/api/admin/users', (req, res) => {
  res.json(db.users.map(u => ({ ...u, password: undefined })));
});

app.post('/api/admin/validate/:userId', (req, res) => {
  const user = db.users.find(u => u.id === req.params.userId);
  if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });
  
  user.status = 'validated';
  user.balance = 4000;
  user.subscriptionDate = new Date().toISOString();
  
  // Commissions parrainage
  if (user.referredBy) {
    const level1 = db.users.find(u => u.id === user.referredBy);
    if (level1) {
      level1.earnings += 500;
      if (level1.referredBy) {
        const level2 = db.users.find(u => u.id === level1.referredBy);
        if (level2) {
          level2.earnings += 200;
          if (level2.referredBy) {
            const level3 = db.users.find(u => u.id === level2.referredBy);
            if (level3) level3.earnings += 100;
          }
        }
      }
    }
  }
  
  res.json({ success: true, user: { ...user, password: undefined } });
});

app.post('/api/admin/reject/:userId', (req, res) => {
  const user = db.users.find(u => u.id === req.params.userId);
  if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });
  
  user.status = 'rejected';
  user.paymentProof = null;
  res.json({ success: true });
});

app.get('/api/admin/withdrawals', (req, res) => {
  res.json(db.withdrawals);
});

app.post('/api/admin/withdraw/approve/:withdrawId', (req, res) => {
  const withdrawal = db.withdrawals.find(w => w.id === req.params.withdrawId);
  if (!withdrawal) return res.status(404).json({ error: 'Retrait non trouvé' });
  
  withdrawal.status = 'approved';
  withdrawal.approvedAt = new Date().toISOString();
  res.json({ success: true });
});

app.post('/api/admin/withdraw/reject/:withdrawId', (req, res) => {
  const withdrawal = db.withdrawals.find(w => w.id === req.params.withdrawId);
  if (!withdrawal) return res.status(404).json({ error: 'Retrait non trouvé' });
  
  withdrawal.status = 'rejected';
  const user = db.users.find(u => u.id === withdrawal.userId);
  if (user) user.earnings += withdrawal.amount;
  
  res.json({ success: true });
});

// Admin: Vidéos
app.get('/api/admin/videos', (req, res) => {
  res.json(db.videos);
});

app.post('/api/admin/videos', (req, res) => {
  const { platform, title, url, duration, reward } = req.body;
  
  if (!platform || !title || !url || !duration || !reward) {
    return res.status(400).json({ error: 'Tous les champs sont obligatoires' });
  }
  
  // Extraire l'ID de la vidéo
  let videoId = '';
  let embedUrl = url;
  
  if (platform === 'youtube') {
    // Formats: youtube.com/watch?v=ID, youtu.be/ID, youtube.com/embed/ID
    const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (match) {
      videoId = match[1];
      embedUrl = `https://www.youtube.com/embed/${videoId}`;
    }
  } else if (platform === 'tiktok') {
    // Format: tiktok.com/@user/video/ID ou juste l'ID
    const match = url.match(/(?:video\/)?(\d{15,25})/);
    if (match) {
      videoId = match[1];
      embedUrl = `https://www.tiktok.com/embed/v2/${videoId}`;
    }
  }
  
  const video = {
    id: 'video-' + generateId(),
    platform,
    title,
    url: embedUrl,
    videoId,
    duration: parseInt(duration),
    reward: parseInt(reward),
    createdAt: new Date().toISOString()
  };
  
  db.videos.push(video);
  res.json({ success: true, video });
});

app.delete('/api/admin/videos/:videoId', (req, res) => {
  const index = db.videos.findIndex(v => v.id === req.params.videoId);
  if (index === -1) return res.status(404).json({ error: 'Vidéo non trouvée' });
  
  db.videos.splice(index, 1);
  res.json({ success: true });
});

// Admin: Tâches
app.get('/api/admin/tasks', (req, res) => {
  res.json(db.tasks);
});

app.post('/api/admin/tasks', (req, res) => {
  const { type, title, reward, description, content } = req.body;
  const task = {
    id: 'task-' + generateId(),
    type,
    title,
    reward: parseInt(reward),
    description,
    content: content || {},
    createdAt: new Date().toISOString()
  };
  db.tasks.push(task);
  res.json({ success: true, task });
});

app.delete('/api/admin/tasks/:taskId', (req, res) => {
  const index = db.tasks.findIndex(t => t.id === req.params.taskId);
  if (index === -1) return res.status(404).json({ error: 'Tâche non trouvée' });
  
  db.tasks.splice(index, 1);
  res.json({ success: true });
});

app.get('/api/admin/payments', (req, res) => {
  res.json(db.payments);
});

app.get('/api/admin/stats', (req, res) => {
  const totalUsers = db.users.filter(u => !u.isAdmin).length;
  const validatedUsers = db.users.filter(u => u.status === 'validated' && !u.isAdmin).length;
  const pendingUsers = db.users.filter(u => u.status === 'pending' || u.status === 'pending_payment').length;
  const totalEarnings = db.users.reduce((sum, u) => sum + u.earnings, 0);
  const totalWithdrawals = db.withdrawals.filter(w => w.status === 'approved').reduce((sum, w) => sum + w.amount, 0);
  const pendingWithdrawals = db.withdrawals.filter(w => w.status === 'pending').length;
  
  res.json({
    totalUsers,
    validatedUsers,
    pendingUsers,
    totalEarnings,
    totalWithdrawals,
    pendingWithdrawals,
    tasksCount: db.tasks.length,
    videosCount: db.videos.length
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Motosu Agencies server running on port ${PORT}`);
});