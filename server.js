const express = require('express');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Stockage en mémoire
const db = {
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
    subscriptionDate: null
  }],
  tasks: [
    { 
      id: 'task-1', 
      type: 'sondage', 
      title: 'Enquête sur les habitudes de paiement mobile', 
      reward: 85, 
      description: 'Répondez à des questions sur votre utilisation de Mobile Money',
      content: {
        questions: [
          { q: 'Quel service Mobile Money utilisez-vous le plus ?', options: ['Orange Money', 'MTN Mobile Money', 'Wave', 'Moov Money', 'Autre'] },
          { q: 'Combien de transactions faites-vous par semaine ?', options: ['1-5', '6-10', '11-20', 'Plus de 20'] },
          { q: 'Quel montant moyen par transaction ?', options: ['Moins de 5000 FCFA', '5000-20000 FCFA', '20000-50000 FCFA', 'Plus de 50000 FCFA'] },
          { q: 'Utilisez-vous le paiement mobile pour les achats en ligne ?', options: ['Oui souvent', 'Parfois', 'Rarement', 'Jamais'] },
          { q: 'Avez-vous confiance dans les services Mobile Money ?', options: ['Totalement', 'Plutôt oui', 'Plutôt non', 'Pas du tout'] },
          { q: 'Quelle amélioration souhaitez-vous ?', options: ['Moins de frais', 'Plus de points de retrait', 'Meilleure sécurité', 'Interface plus simple'] }
        ]
      }
    },
    { 
      id: 'task-2', 
      type: 'sondage', 
      title: 'Étude sur l\'utilisation des réseaux sociaux', 
      reward: 100, 
      description: 'Partagez vos habitudes sur les réseaux sociaux',
      content: {
        questions: [
          { q: 'Quel réseau social utilisez-vous le plus ?', options: ['Facebook', 'WhatsApp', 'TikTok', 'Instagram', 'Twitter/X', 'YouTube'] },
          { q: 'Combien d\'heures par jour passez-vous sur les réseaux ?', options: ['Moins d\'1h', '1-3h', '3-5h', 'Plus de 5h'] },
          { q: 'Suivez-vous des influenceurs africains ?', options: ['Oui beaucoup', 'Quelques-uns', 'Très peu', 'Aucun'] },
          { q: 'Achetez-vous des produits vus sur les réseaux ?', options: ['Souvent', 'Parfois', 'Rarement', 'Jamais'] },
          { q: 'Créez-vous du contenu vous-même ?', options: ['Oui régulièrement', 'De temps en temps', 'Très rarement', 'Jamais'] },
          { q: 'Les réseaux sociaux vous aident-ils professionnellement ?', options: ['Oui beaucoup', 'Un peu', 'Pas vraiment', 'Pas du tout'] },
          { q: 'Utilisez-vous les réseaux pour vous informer ?', options: ['C\'est ma source principale', 'Une source parmi d\'autres', 'Rarement', 'Jamais'] },
          { q: 'Êtes-vous préoccupé par votre vie privée en ligne ?', options: ['Très préoccupé', 'Assez préoccupé', 'Peu préoccupé', 'Pas du tout'] }
        ]
      }
    },
    { 
      id: 'task-3', 
      type: 'verification', 
      title: 'Vérification d\'adresses email professionnelles', 
      reward: 35, 
      description: 'Identifiez les adresses email valides parmi la liste',
      content: {
        instruction: 'Cochez les adresses email qui semblent valides et professionnelles',
        items: [
          { email: 'contact@entreprise-africa.com', valid: true },
          { email: 'jean.dupont@@gmail.com', valid: false },
          { email: 'service.client@banque-ci.net', valid: true },
          { email: 'info@shop', valid: false },
          { email: 'support@motosu-agencies.com', valid: true }
        ]
      }
    },
    { 
      id: 'task-4', 
      type: 'classification', 
      title: 'Classification de produits e-commerce', 
      reward: 45, 
      description: 'Classez ces produits dans la bonne catégorie',
      content: {
        categories: ['Électronique', 'Mode', 'Maison', 'Alimentation'],
        items: [
          { name: 'Smartphone Samsung Galaxy', category: 'Électronique' },
          { name: 'Robe en wax', category: 'Mode' },
          { name: 'Ventilateur de table', category: 'Maison' },
          { name: 'Riz parfumé 5kg', category: 'Alimentation' },
          { name: 'Écouteurs Bluetooth', category: 'Électronique' },
          { name: 'Chaussures en cuir', category: 'Mode' },
          { name: 'Casserole antiadhésive', category: 'Maison' },
          { name: 'Huile de palme 1L', category: 'Alimentation' }
        ]
      }
    },
    { 
      id: 'task-5', 
      type: 'transcription', 
      title: 'Transcription d\'un message vocal professionnel', 
      reward: 110, 
      description: 'Recopiez exactement le texte affiché',
      content: {
        text: 'Bonjour et bienvenue chez Motosu Agencies. Nous sommes heureux de vous accompagner dans votre parcours entrepreneurial. Notre équipe reste à votre disposition pour toute question. Merci de votre confiance.',
        minLength: 150
      }
    },
    { 
      id: 'task-6', 
      type: 'sondage', 
      title: 'Enquête sur les services bancaires mobiles', 
      reward: 120, 
      description: 'Donnez votre avis sur les banques et services financiers',
      content: {
        questions: [
          { q: 'Avez-vous un compte bancaire traditionnel ?', options: ['Oui', 'Non', 'En cours d\'ouverture'] },
          { q: 'Utilisez-vous l\'application mobile de votre banque ?', options: ['Oui quotidiennement', 'Parfois', 'Rarement', 'Je n\'en ai pas'] },
          { q: 'Faites-vous des virements internationaux ?', options: ['Souvent', 'Parfois', 'Rarement', 'Jamais'] },
          { q: 'Quel est votre principal obstacle bancaire ?', options: ['Frais élevés', 'Accès difficile', 'Manque de confiance', 'Complexité'] },
          { q: 'Seriez-vous intéressé par des microcrédits mobiles ?', options: ['Très intéressé', 'Assez intéressé', 'Peu intéressé', 'Pas du tout'] },
          { q: 'Épargnez-vous régulièrement ?', options: ['Oui chaque mois', 'Quand je peux', 'Rarement', 'Jamais'] },
          { q: 'Utilisez-vous des services de transfert d\'argent ?', options: ['Western Union', 'MoneyGram', 'Wave', 'Autres', 'Aucun'] },
          { q: 'Préférez-vous le cash ou le digital ?', options: ['100% digital', 'Plutôt digital', 'Plutôt cash', '100% cash'] },
          { q: 'Faites-vous confiance aux fintechs africaines ?', options: ['Totalement', 'Assez', 'Peu', 'Pas du tout'] },
          { q: 'Quel service financier vous manque le plus ?', options: ['Crédit accessible', 'Assurance mobile', 'Investissement', 'Épargne rémunérée'] }
        ]
      }
    },
    { 
      id: 'task-7', 
      type: 'verification', 
      title: 'Vérification de numéros de téléphone', 
      reward: 40, 
      description: 'Identifiez les numéros de téléphone au format correct',
      content: {
        instruction: 'Cochez les numéros qui respectent le format international (+225 XX XX XX XX XX)',
        items: [
          { phone: '+225 07 08 09 10 11', valid: true },
          { phone: '225070809101', valid: false },
          { phone: '+225 05 04 03 02 01', valid: true },
          { phone: '+22 507 080 910', valid: false },
          { phone: '+225 01 02 03 04 05', valid: true }
        ]
      }
    },
    { 
      id: 'task-8', 
      type: 'classification', 
      title: 'Classification de contenus digitaux', 
      reward: 50, 
      description: 'Classez ces contenus par type',
      content: {
        categories: ['Éducatif', 'Divertissement', 'Commercial', 'Informatif'],
        items: [
          { name: 'Tutoriel Excel pour débutants', category: 'Éducatif' },
          { name: 'Clip musical Afrobeat', category: 'Divertissement' },
          { name: 'Publicité pour téléphone', category: 'Commercial' },
          { name: 'Actualités économiques Afrique', category: 'Informatif' },
          { name: 'Cours de français en ligne', category: 'Éducatif' },
          { name: 'Série télévisée ivoirienne', category: 'Divertissement' },
          { name: 'Promotion boutique en ligne', category: 'Commercial' },
          { name: 'Météo quotidienne', category: 'Informatif' }
        ]
      }
    },
    { 
      id: 'task-9', 
      type: 'sondage', 
      title: 'Étude sur les habitudes alimentaires', 
      reward: 90, 
      description: 'Partagez vos habitudes de consommation alimentaire',
      content: {
        questions: [
          { q: 'Combien de repas prenez-vous par jour ?', options: ['1 repas', '2 repas', '3 repas', 'Plus de 3'] },
          { q: 'Cuisinez-vous à la maison ?', options: ['Toujours', 'Souvent', 'Parfois', 'Rarement'] },
          { q: 'Achetez-vous des plats préparés ?', options: ['Quotidiennement', 'Plusieurs fois/semaine', 'Occasionnellement', 'Jamais'] },
          { q: 'Consommez-vous des produits locaux ?', options: ['Exclusivement', 'Principalement', 'Parfois', 'Rarement'] },
          { q: 'Utilisez-vous des apps de livraison de repas ?', options: ['Régulièrement', 'Parfois', 'Rarement', 'Jamais'] },
          { q: 'Quel est votre budget alimentaire mensuel ?', options: ['Moins de 30000 FCFA', '30000-60000 FCFA', '60000-100000 FCFA', 'Plus de 100000 FCFA'] }
        ]
      }
    },
    { 
      id: 'task-10', 
      type: 'transcription', 
      title: 'Transcription d\'un slogan commercial', 
      reward: 80, 
      description: 'Recopiez exactement le message publicitaire',
      content: {
        text: 'Motosu Agencies, votre partenaire de confiance pour réussir en Afrique. Rejoignez notre communauté de plus de 10 000 entrepreneurs et développez votre activité dès aujourd\'hui.',
        minLength: 100
      }
    }
  ],
  withdrawals: [],
  payments: [],
  subscriptions: []
};

// Utilitaires
const hashPassword = (pwd) => crypto.createHash('sha256').update(pwd).digest('hex');
const generateId = () => crypto.randomBytes(8).toString('hex');
const generateReferralCode = (name) => name.substring(0, 4).toUpperCase() + generateId().substring(0, 4).toUpperCase();

// Servir index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
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
    subscriptionDate: null
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
      tasksCompleted: user.completedTasks.length
    }
  });
});

// API: Tâches
app.get('/api/tasks', (req, res) => {
  res.json(db.tasks);
});

// API: Récupérer une tâche spécifique
app.get('/api/tasks/:taskId', (req, res) => {
  const task = db.tasks.find(t => t.id === req.params.taskId);
  if (!task) return res.status(404).json({ error: 'Tâche non trouvée' });
  res.json(task);
});

// API: Compléter tâche avec validation des réponses
app.post('/api/tasks/:taskId/complete', (req, res) => {
  const { userId, answers } = req.body;
  const { taskId } = req.params;
  
  const user = db.users.find(u => u.id === userId);
  if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });
  
  const task = db.tasks.find(t => t.id === taskId);
  if (!task) return res.status(404).json({ error: 'Tâche non trouvée' });
  
  if (user.completedTasks.includes(taskId)) {
    return res.status(400).json({ error: 'Tâche déjà complétée' });
  }
  
  const today = new Date().toDateString();
  if (user.lastTaskDate !== today) {
    user.tasksCompletedToday = [];
    user.lastTaskDate = today;
  }
  
  if (user.tasksCompletedToday.length >= 10) {
    return res.status(400).json({ error: 'Limite de 10 tâches/jour atteinte' });
  }
  
  // Validation basique selon le type de tâche
  if (task.type === 'sondage' && (!answers || answers.length < task.content.questions.length)) {
    return res.status(400).json({ error: 'Veuillez répondre à toutes les questions' });
  }
  
  if (task.type === 'transcription' && (!answers || answers.length < task.content.minLength)) {
    return res.status(400).json({ error: 'Le texte transcrit est trop court' });
  }
  
  user.completedTasks.push(taskId);
  user.tasksCompletedToday.push(taskId);
  user.earnings += task.reward;
  
  res.json({ success: true, reward: task.reward, totalEarnings: user.earnings });
});

// API: Parrainages
app.get('/api/referrals/:userId', (req, res) => {
  const user = db.users.find(u => u.id === req.params.userId);
  if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });
  
  const level1 = db.users.filter(u => u.referredBy === user.id).map(u => ({ ...u, password: undefined }));
  const level2 = db.users.filter(u => level1.some(r => r.id === u.referredBy)).map(u => ({ ...u, password: undefined }));
  const level3 = db.users.filter(u => level2.some(r => r.id === u.referredBy)).map(u => ({ ...u, password: undefined }));
  
  res.json({
    referralCode: user.referralCode,
    level1: { users: level1, commission: 500, total: level1.filter(u => u.status === 'validated').length * 500 },
    level2: { users: level2, commission: 200, total: level2.filter(u => u.status === 'validated').length * 200 },
    level3: { users: level3, commission: 100, total: level3.filter(u => u.status === 'validated').length * 100 }
  });
});

// API: Demande de retrait
app.post('/api/withdraw', (req, res) => {
  const { userId, amount, method, details, screenshot } = req.body;
  
  const user = db.users.find(u => u.id === userId);
  if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });
  
  const minAmount = method === 'crypto' ? 10000 : 1000;
  if (amount < minAmount) {
    return res.status(400).json({ error: `Minimum ${minAmount} FCFA pour ${method}` });
  }
  
  if (amount > user.earnings) {
    return res.status(400).json({ error: 'Solde insuffisant' });
  }
  
  if (!screenshot) {
    return res.status(400).json({ error: 'Capture d\'écran obligatoire' });
  }
  
  const withdrawal = {
    id: generateId(),
    userId,
    userName: user.name,
    amount,
    method,
    details,
    screenshot,
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  
  db.withdrawals.push(withdrawal);
  user.earnings -= amount;
  
  res.json({ success: true, withdrawal });
});

// API: Retraits utilisateur
app.get('/api/withdrawals/user/:userId', (req, res) => {
  const withdrawals = db.withdrawals.filter(w => w.userId === req.params.userId);
  res.json(withdrawals);
});

// API: Initialiser paiement CinetPay (Abonnement)
app.post('/api/payment/init', (req, res) => {
  const { userId } = req.body;
  const user = db.users.find(u => u.id === userId);
  if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });
  
  const transactionId = 'CP' + generateId();
  const payment = {
    id: transactionId,
    userId,
    amount: 4000,
    type: 'subscription',
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  
  db.payments.push(payment);
  res.json({ success: true, transactionId, amount: 4000 });
});

// API: Confirmer paiement
app.post('/api/payment/confirm', (req, res) => {
  const { transactionId, userId } = req.body;
  
  const payment = db.payments.find(p => p.id === transactionId);
  if (payment) {
    payment.status = 'completed';
  }
  
  const user = db.users.find(u => u.id === userId);
  if (user) {
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
  }
  
  res.json({ success: true });
});

// API: Notification CinetPay (POST et GET)
app.post('/api/payment/notify', (req, res) => {
  console.log('CinetPay notification:', req.body);
  res.json({ success: true });
});

app.get('/api/payment/notify', (req, res) => {
  res.json({ success: true, message: 'Notification endpoint active' });
});

// API: Retour paiement réussi (GET et POST)
app.get('/api/payment/return', (req, res) => {
  res.redirect('/');
});

app.post('/api/payment/return', (req, res) => {
  res.redirect('/');
});

// API: Annulation paiement (GET et POST)
app.get('/api/payment/cancel', (req, res) => {
  res.redirect('/');
});

app.post('/api/payment/cancel', (req, res) => {
  res.redirect('/');
});

// === ADMIN APIs ===

// Admin: Utilisateurs en attente
app.get('/api/admin/pending', (req, res) => {
  const pending = db.users.filter(u => u.status === 'pending').map(u => ({ ...u, password: undefined }));
  res.json(pending);
});

// Admin: Tous les utilisateurs
app.get('/api/admin/users', (req, res) => {
  res.json(db.users.map(u => ({ ...u, password: undefined })));
});

// Admin: Valider utilisateur
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

// Admin: Rejeter utilisateur
app.post('/api/admin/reject/:userId', (req, res) => {
  const user = db.users.find(u => u.id === req.params.userId);
  if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });
  
  user.status = 'rejected';
  res.json({ success: true });
});

// Admin: Retraits
app.get('/api/admin/withdrawals', (req, res) => {
  res.json(db.withdrawals);
});

// Admin: Approuver retrait
app.post('/api/admin/withdraw/approve/:withdrawId', (req, res) => {
  const withdrawal = db.withdrawals.find(w => w.id === req.params.withdrawId);
  if (!withdrawal) return res.status(404).json({ error: 'Retrait non trouvé' });
  
  withdrawal.status = 'approved';
  res.json({ success: true });
});

// Admin: Rejeter retrait
app.post('/api/admin/withdraw/reject/:withdrawId', (req, res) => {
  const withdrawal = db.withdrawals.find(w => w.id === req.params.withdrawId);
  if (!withdrawal) return res.status(404).json({ error: 'Retrait non trouvé' });
  
  withdrawal.status = 'rejected';
  
  // Rembourser l'utilisateur
  const user = db.users.find(u => u.id === withdrawal.userId);
  if (user) user.earnings += withdrawal.amount;
  
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

// Admin: Paiements
app.get('/api/admin/payments', (req, res) => {
  res.json(db.payments);
});

// Admin: Stats globales
app.get('/api/admin/stats', (req, res) => {
  const totalUsers = db.users.filter(u => !u.isAdmin).length;
  const validatedUsers = db.users.filter(u => u.status === 'validated' && !u.isAdmin).length;
  const pendingUsers = db.users.filter(u => u.status === 'pending').length;
  const totalEarnings = db.users.reduce((sum, u) => sum + u.earnings, 0);
  const totalWithdrawals = db.withdrawals.filter(w => w.status === 'approved').reduce((sum, w) => sum + w.amount, 0);
  const totalPayments = db.payments.filter(p => p.status === 'completed').length * 4000;
  
  res.json({
    totalUsers,
    validatedUsers,
    pendingUsers,
    totalEarnings,
    totalWithdrawals,
    totalPayments,
    tasksCount: db.tasks.length
  });
});

// Démarrer le serveur
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Motosu Agencies server running on port ${PORT}`);
});