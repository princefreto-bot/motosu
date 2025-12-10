const express = require('express');
<<<<<<< HEAD
const path = require('path');
=======
>>>>>>> 4dd5d4922cb45bf59780bf746c774676dd286ab2
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;

<<<<<<< HEAD
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

// API: Notification CinetPay
app.post('/api/payment/notify', (req, res) => {
  console.log('CinetPay notification:', req.body);
  res.json({ success: true });
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
=======
// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Simple password hashing
function hashPassword(password) {
    return crypto.createHash('sha256').update(password + 'motosu_salt_2024').digest('hex');
}

function generateId() {
    return crypto.randomBytes(8).toString('hex');
}

function generateReferralCode() {
    return 'MOT' + crypto.randomBytes(3).toString('hex').toUpperCase();
}

// In-memory database
const db = {
    users: [
        {
            id: 'admin001',
            name: 'Administrateur',
            email: 'admin@motosu.com',
            phone: '+237600000000',
            password: hashPassword('admin123'),
            status: 'validated',
            isAdmin: true,
            referralCode: 'MOTADMIN',
            referredBy: null,
            referralGains: 0,
            videoGains: 0,
            bonusGains: 0,
            watchTime: 0,
            createdAt: new Date().toISOString()
        }
    ],
    videos: [
        {
            id: 'vid001',
            title: 'Comment réussir en ligne - Introduction',
            url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            platform: 'youtube',
            createdAt: new Date().toISOString()
        },
        {
            id: 'vid002',
            title: 'Les secrets du marketing digital',
            url: 'https://www.youtube.com/watch?v=jNQXAC9IVRw',
            platform: 'youtube',
            createdAt: new Date().toISOString()
        }
    ],
    withdrawals: [],
    referrals: [],
    videoActions: [],
    payments: []
};

// Constants
const COMMISSION_RATES = { 1: 500, 2: 200, 3: 100 };
const VIDEO_RATE = 5;
const LIKE_BONUS = 25;
const COMMENT_BONUS = 50;
const SUBSCRIPTION_AMOUNT = 4000;
const MIN_WITHDRAW_DIRECT = 1000;
const MIN_WITHDRAW_CRYPTO = 10000;

// Sanitize input
function sanitize(str) {
    if (typeof str !== 'string') return str;
    return str.replace(/[<>"'&]/g, (char) => {
        const entities = { '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;', '&': '&amp;' };
        return entities[char];
    });
}

// ============================================================
// API Routes
// ============================================================

// Register
app.post('/api/register', (req, res) => {
    try {
        const { name, email, phone, password, referralCode } = req.body;

        if (!name || !email || !phone || !password) {
            return res.json({ success: false, message: 'Tous les champs obligatoires doivent être remplis' });
        }

        if (db.users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
            return res.json({ success: false, message: 'Cet email est déjà utilisé' });
        }

        let referredBy = null;
        if (referralCode) {
            const referrer = db.users.find(u => u.referralCode === referralCode.toUpperCase());
            if (referrer) {
                referredBy = referrer.id;
            }
        }

        const newUser = {
            id: generateId(),
            name: sanitize(name),
            email: sanitize(email.toLowerCase()),
            phone: sanitize(phone),
            password: hashPassword(password),
            status: 'pending',
            isAdmin: false,
            referralCode: generateReferralCode(),
            referredBy,
            referralGains: 0,
            videoGains: 0,
            bonusGains: 0,
            watchTime: 0,
            createdAt: new Date().toISOString()
        };

        db.users.push(newUser);

        // Create referral records
        if (referredBy) {
            let currentReferrer = referredBy;
            for (let level = 1; level <= 3 && currentReferrer; level++) {
                db.referrals.push({
                    id: generateId(),
                    referrerId: currentReferrer,
                    referredId: newUser.id,
                    level,
                    commission: COMMISSION_RATES[level],
                    credited: false,
                    createdAt: new Date().toISOString()
                });
                const referrerUser = db.users.find(u => u.id === currentReferrer);
                currentReferrer = referrerUser ? referrerUser.referredBy : null;
            }
        }

        res.json({
            success: true,
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                phone: newUser.phone,
                status: newUser.status,
                isAdmin: newUser.isAdmin,
                referralCode: newUser.referralCode
            }
        });
    } catch (error) {
        console.error('Register error:', error);
        res.json({ success: false, message: 'Erreur lors de l\'inscription' });
    }
});

// Login
app.post('/api/login', (req, res) => {
    try {
        const { email, password } = req.body;

        const user = db.users.find(u => 
            u.email.toLowerCase() === email.toLowerCase() && 
            u.password === hashPassword(password)
        );

        if (!user) {
            return res.json({ success: false, message: 'Email ou mot de passe incorrect' });
        }

        res.json({
            success: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                status: user.status,
                isAdmin: user.isAdmin,
                referralCode: user.referralCode,
                referralGains: user.referralGains,
                videoGains: user.videoGains,
                bonusGains: user.bonusGains || 0,
                watchTime: user.watchTime
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.json({ success: false, message: 'Erreur de connexion' });
    }
});

// Get user data
app.get('/api/user/:userId', (req, res) => {
    try {
        const user = db.users.find(u => u.id === req.params.userId);
        if (!user) {
            return res.json({ success: false, message: 'Utilisateur non trouvé' });
        }

        res.json({
            success: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                status: user.status,
                isAdmin: user.isAdmin,
                referralCode: user.referralCode,
                referralGains: user.referralGains,
                videoGains: user.videoGains,
                bonusGains: user.bonusGains || 0,
                watchTime: user.watchTime
            }
        });
    } catch (error) {
        res.json({ success: false, message: 'Erreur' });
    }
});

// Get dashboard data
app.get('/api/dashboard/:userId', (req, res) => {
    try {
        const user = db.users.find(u => u.id === req.params.userId);
        if (!user) {
            return res.json({ success: false, message: 'Utilisateur non trouvé' });
        }

        const directReferrals = db.referrals.filter(r => r.referrerId === user.id && r.level === 1);
        const validatedReferrals = directReferrals.filter(r => {
            const referred = db.users.find(u => u.id === r.referredId);
            return referred && referred.status === 'validated';
        });

        const bonusGains = user.bonusGains || 0;

        res.json({
            success: true,
            totalGains: user.referralGains + user.videoGains + bonusGains,
            referralGains: user.referralGains,
            videoGains: user.videoGains,
            bonusGains: bonusGains,
            referralCount: validatedReferrals.length,
            watchTime: user.watchTime,
            referralCode: user.referralCode
        });
    } catch (error) {
        console.error('Dashboard error:', error);
        res.json({ success: false, message: 'Erreur' });
    }
});

// Get videos
app.get('/api/videos', (req, res) => {
    res.json({ success: true, videos: db.videos });
});

// Get video actions for user
app.get('/api/video-actions/:userId', (req, res) => {
    const actions = db.videoActions.filter(a => a.userId === req.params.userId);
    res.json({ success: true, actions });
});

// Record watch time
app.post('/api/watch', (req, res) => {
    try {
        const { userId, videoId, seconds } = req.body;
        
        const user = db.users.find(u => u.id === userId);
        if (!user) {
            return res.json({ success: false, message: 'Utilisateur non trouvé' });
        }

        user.watchTime += seconds;
        const gainsToAdd = Math.floor((seconds / 60) * VIDEO_RATE);
        user.videoGains += gainsToAdd;

        res.json({ success: true, watchTime: user.watchTime, videoGains: user.videoGains });
    } catch (error) {
        console.error('Watch error:', error);
        res.json({ success: false, message: 'Erreur' });
    }
});

// Like video
app.post('/api/video/like', (req, res) => {
    try {
        const { userId, videoId } = req.body;

        const user = db.users.find(u => u.id === userId);
        if (!user) {
            return res.json({ success: false, message: 'Utilisateur non trouvé' });
        }

        const alreadyLiked = db.videoActions.some(a => 
            a.userId === userId && a.videoId === videoId && a.action === 'like'
        );

        if (alreadyLiked) {
            return res.json({ success: false, message: 'Vous avez déjà liké cette vidéo' });
        }

        db.videoActions.push({
            id: generateId(),
            userId,
            videoId,
            action: 'like',
            bonus: LIKE_BONUS,
            createdAt: new Date().toISOString()
        });

        user.bonusGains = (user.bonusGains || 0) + LIKE_BONUS;

        res.json({ success: true, bonus: LIKE_BONUS, totalBonus: user.bonusGains });
    } catch (error) {
        console.error('Like error:', error);
        res.json({ success: false, message: 'Erreur' });
    }
});

// Comment video
app.post('/api/video/comment', (req, res) => {
    try {
        const { userId, videoId } = req.body;

        const user = db.users.find(u => u.id === userId);
        if (!user) {
            return res.json({ success: false, message: 'Utilisateur non trouvé' });
        }

        const alreadyCommented = db.videoActions.some(a => 
            a.userId === userId && a.videoId === videoId && a.action === 'comment'
        );

        if (alreadyCommented) {
            return res.json({ success: false, message: 'Vous avez déjà commenté cette vidéo' });
        }

        db.videoActions.push({
            id: generateId(),
            userId,
            videoId,
            action: 'comment',
            bonus: COMMENT_BONUS,
            createdAt: new Date().toISOString()
        });

        user.bonusGains = (user.bonusGains || 0) + COMMENT_BONUS;

        res.json({ success: true, bonus: COMMENT_BONUS, totalBonus: user.bonusGains });
    } catch (error) {
        console.error('Comment error:', error);
        res.json({ success: false, message: 'Erreur' });
    }
});

// Get referrals for user
app.get('/api/referrals/:userId', (req, res) => {
    try {
        const userReferrals = db.referrals.filter(r => r.referrerId === req.params.userId);
        
        const referralsWithDetails = userReferrals.map(r => {
            const referred = db.users.find(u => u.id === r.referredId);
            return {
                id: r.id,
                name: referred ? referred.name : 'Inconnu',
                level: r.level,
                status: referred ? referred.status : 'unknown',
                commission: r.commission,
                credited: r.credited
            };
        });

        res.json({ success: true, referrals: referralsWithDetails });
    } catch (error) {
        res.json({ success: true, referrals: [] });
    }
});

// Submit withdrawal request
app.post('/api/withdraw', (req, res) => {
    try {
        const { userId, amount, method, cryptoAddress, screenshot } = req.body;

        const user = db.users.find(u => u.id === userId);
        if (!user) {
            return res.json({ success: false, message: 'Utilisateur non trouvé' });
        }

        const totalGains = user.referralGains + user.videoGains + (user.bonusGains || 0);

        if (amount > totalGains) {
            return res.json({ success: false, message: 'Solde insuffisant' });
        }

        if (method === 'direct' && amount < MIN_WITHDRAW_DIRECT) {
            return res.json({ success: false, message: `Minimum ${MIN_WITHDRAW_DIRECT} FCFA pour Mobile Money` });
        }

        if (method === 'crypto' && amount < MIN_WITHDRAW_CRYPTO) {
            return res.json({ success: false, message: `Minimum ${MIN_WITHDRAW_CRYPTO} FCFA pour Crypto` });
        }

        const withdrawal = {
            id: generateId(),
            userId,
            userName: user.name,
            userPhone: user.phone,
            amount,
            method,
            cryptoAddress: method === 'crypto' ? sanitize(cryptoAddress) : null,
            screenshot,
            status: 'pending',
            createdAt: new Date().toISOString()
        };

        db.withdrawals.push(withdrawal);

        res.json({ success: true, withdrawal: { id: withdrawal.id, status: withdrawal.status } });
    } catch (error) {
        console.error('Withdraw error:', error);
        res.json({ success: false, message: 'Erreur' });
    }
});

// Get user's withdrawals
app.get('/api/withdrawals/user/:userId', (req, res) => {
    const userWithdrawals = db.withdrawals.filter(w => w.userId === req.params.userId);
    res.json({ success: true, withdrawals: userWithdrawals });
});

// ============================================================
// CinetPay Payment
// ============================================================

app.post('/api/payment/init', (req, res) => {
    try {
        const { userId } = req.body;
        const user = db.users.find(u => u.id === userId);
        
        if (!user) {
            return res.json({ success: false, message: 'Utilisateur non trouvé' });
        }

        const transactionId = 'MOTOSU' + Date.now() + generateId();

        res.json({
            success: true,
            transactionId,
            amount: SUBSCRIPTION_AMOUNT,
            userId: user.id,
            userName: user.name,
            userEmail: user.email,
            userPhone: user.phone
        });
    } catch (error) {
        console.error('Payment init error:', error);
        res.json({ success: false, message: 'Erreur' });
    }
});

app.post('/api/payment/confirm', (req, res) => {
    try {
        const { userId, transactionId, paymentData } = req.body;
        
        const user = db.users.find(u => u.id === userId);
        if (!user) {
            return res.json({ success: false, message: 'Utilisateur non trouvé' });
        }

        // Save payment
        db.payments.push({
            id: generateId(),
            transactionId,
            userId: user.id,
            userName: user.name,
            userEmail: user.email,
            userPhone: user.phone,
            amount: SUBSCRIPTION_AMOUNT,
            status: 'completed',
            paymentData,
            createdAt: new Date().toISOString()
        });

        // Validate user
        user.status = 'validated';
        user.paidAt = new Date().toISOString();
        user.paymentTransactionId = transactionId;

        // Credit referral commissions
        db.referrals.forEach(r => {
            if (r.referredId === user.id && !r.credited) {
                const referrer = db.users.find(u => u.id === r.referrerId);
                if (referrer && referrer.status === 'validated') {
                    referrer.referralGains += r.commission;
                    r.credited = true;
                }
            }
        });

        res.json({
            success: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                status: user.status,
                isAdmin: user.isAdmin,
                referralCode: user.referralCode,
                referralGains: user.referralGains,
                videoGains: user.videoGains,
                bonusGains: user.bonusGains || 0,
                watchTime: user.watchTime
            }
        });
    } catch (error) {
        console.error('Payment confirm error:', error);
        res.json({ success: false, message: 'Erreur' });
    }
});

// CinetPay Notify URL (webhook)
app.post('/api/payment/notify', (req, res) => {
    console.log('CinetPay Notification:', req.body);
    res.json({ success: true });
});

// ============================================================
// Admin Routes
// ============================================================

// Get pending users
app.get('/api/admin/pending', (req, res) => {
    const pendingUsers = db.users.filter(u => u.status === 'pending' && !u.isAdmin);
    res.json({ 
        success: true,
        users: pendingUsers.map(u => ({
            id: u.id,
            name: u.name,
            email: u.email,
            phone: u.phone,
            createdAt: u.createdAt
        }))
    });
});

// Get all users
app.get('/api/admin/users', (req, res) => {
    const users = db.users.filter(u => !u.isAdmin).map(u => {
        const directReferrals = db.referrals.filter(r => r.referrerId === u.id && r.level === 1);
        return {
            id: u.id,
            name: u.name,
            email: u.email,
            phone: u.phone,
            status: u.status,
            totalGains: u.referralGains + u.videoGains + (u.bonusGains || 0),
            referralCount: directReferrals.length,
            paidAt: u.paidAt,
            createdAt: u.createdAt
        };
    });
    res.json({ success: true, users });
});

// Validate user
app.post('/api/admin/validate/:userId', (req, res) => {
    try {
        const user = db.users.find(u => u.id === req.params.userId);
        if (!user) {
            return res.json({ success: false, message: 'Utilisateur non trouvé' });
        }

        user.status = 'validated';
        user.validatedAt = new Date().toISOString();

        // Credit referral commissions
        db.referrals.forEach(r => {
            if (r.referredId === user.id && !r.credited) {
                const referrer = db.users.find(u => u.id === r.referrerId);
                if (referrer && referrer.status === 'validated') {
                    referrer.referralGains += r.commission;
                    r.credited = true;
                }
            }
        });

        res.json({ success: true });
    } catch (error) {
        res.json({ success: false, message: 'Erreur' });
    }
});

// Reject user
app.post('/api/admin/reject/:userId', (req, res) => {
    try {
        const user = db.users.find(u => u.id === req.params.userId);
        if (!user) {
            return res.json({ success: false, message: 'Utilisateur non trouvé' });
        }

        user.status = 'rejected';
        res.json({ success: true });
    } catch (error) {
        res.json({ success: false, message: 'Erreur' });
    }
});

// Get all withdrawals
app.get('/api/admin/withdrawals', (req, res) => {
    res.json({ success: true, withdrawals: db.withdrawals });
});

// Approve withdrawal
app.post('/api/admin/withdraw/approve/:withdrawId', (req, res) => {
    try {
        const withdrawal = db.withdrawals.find(w => w.id === req.params.withdrawId);
        if (!withdrawal) {
            return res.json({ success: false, message: 'Demande non trouvée' });
        }

        const user = db.users.find(u => u.id === withdrawal.userId);
        if (user) {
            const totalGains = user.referralGains + user.videoGains + (user.bonusGains || 0);
            if (withdrawal.amount <= totalGains) {
                let remaining = withdrawal.amount;
                if (user.bonusGains >= remaining) {
                    user.bonusGains -= remaining;
                    remaining = 0;
                } else {
                    remaining -= user.bonusGains || 0;
                    user.bonusGains = 0;
                }
                if (remaining > 0 && user.videoGains >= remaining) {
                    user.videoGains -= remaining;
                    remaining = 0;
                } else if (remaining > 0) {
                    remaining -= user.videoGains;
                    user.videoGains = 0;
                }
                if (remaining > 0) {
                    user.referralGains -= remaining;
                }
            }
        }

        withdrawal.status = 'approved';
        withdrawal.approvedAt = new Date().toISOString();
        res.json({ success: true });
    } catch (error) {
        res.json({ success: false, message: 'Erreur' });
    }
});

// Reject withdrawal
app.post('/api/admin/withdraw/reject/:withdrawId', (req, res) => {
    try {
        const withdrawal = db.withdrawals.find(w => w.id === req.params.withdrawId);
        if (!withdrawal) {
            return res.json({ success: false, message: 'Demande non trouvée' });
        }

        withdrawal.status = 'rejected';
        res.json({ success: true });
    } catch (error) {
        res.json({ success: false, message: 'Erreur' });
    }
});

// Get all videos (admin)
app.get('/api/admin/videos', (req, res) => {
    res.json({ success: true, videos: db.videos });
});

// Add video
app.post('/api/admin/videos', (req, res) => {
    try {
        const { title, url, platform } = req.body;

        const video = {
            id: generateId(),
            title: sanitize(title),
            url: sanitize(url),
            platform,
            createdAt: new Date().toISOString()
        };

        db.videos.push(video);
        res.json({ success: true, video });
    } catch (error) {
        res.json({ success: false, message: 'Erreur' });
    }
});

// Delete video
app.delete('/api/admin/videos/:videoId', (req, res) => {
    try {
        const index = db.videos.findIndex(v => v.id === req.params.videoId);
        if (index > -1) {
            db.videos.splice(index, 1);
        }
        res.json({ success: true });
    } catch (error) {
        res.json({ success: false, message: 'Erreur' });
    }
});

// Get all payments
app.get('/api/admin/payments', (req, res) => {
    res.json({ success: true, payments: db.payments });
});

// ============================================================
// HTML Frontend - Served directly from server
// ============================================================

const HTML_CONTENT = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Motosu Agencies</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdn.cinetpay.com/seamless/main.js"></script>
    <style>
        * { box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
        .balance-box { background: linear-gradient(135deg, #2563eb, #1d4ed8); }
        .gains-box { background: linear-gradient(135deg, #f97316, #ea580c); }
        .hidden { display: none !important; }
        .video-item { transition: transform 0.2s; }
        .video-item:hover { transform: scale(1.02); }
        .nav-active { border-bottom: 3px solid #2563eb; background-color: #eff6ff; }
        .toast { animation: slideIn 0.3s ease-out; }
        @keyframes slideIn {
            from { transform: translateY(-100%); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        .cinetpay-btn {
            background: linear-gradient(135deg, #ff6b35, #f7931e);
            transition: all 0.3s ease;
        }
        .cinetpay-btn:hover {
            transform: scale(1.02);
            box-shadow: 0 4px 15px rgba(247, 147, 30, 0.4);
        }
    </style>
</head>
<body class="bg-gray-100 min-h-screen">
    <div id="toast" class="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 hidden">
        <div class="toast px-6 py-3 rounded-lg shadow-lg text-white font-medium"></div>
    </div>

    <header class="bg-white shadow-sm sticky top-0 z-40">
        <div class="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
            <h1 class="text-xl font-bold text-blue-600">Motosu Agencies</h1>
            <div id="headerButtons">
                <button onclick="showSection('login')" class="text-sm px-3 py-1 text-blue-600 hover:bg-blue-50 rounded">Connexion</button>
                <button onclick="showSection('register')" class="text-sm px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">Inscription</button>
            </div>
            <div id="userHeaderButtons" class="hidden flex items-center gap-2">
                <span id="userNameHeader" class="text-sm text-gray-600"></span>
                <button onclick="logout()" class="text-sm px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">Déconnexion</button>
            </div>
        </div>
    </header>

    <main class="max-w-6xl mx-auto px-4 py-6">
        <section id="loginSection" class="max-w-md mx-auto">
            <div class="bg-white rounded-lg shadow-md p-6">
                <h2 class="text-2xl font-bold text-center mb-6">Connexion</h2>
                <form id="loginForm" onsubmit="handleLogin(event)">
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input type="email" id="loginEmail" required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    </div>
                    <div class="mb-6">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
                        <input type="password" id="loginPassword" required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    </div>
                    <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 font-medium">Se connecter</button>
                </form>
                <p class="text-center mt-4 text-sm text-gray-600">Pas de compte? <a href="#" onclick="showSection('register')" class="text-blue-600 hover:underline">S'inscrire</a></p>
            </div>
        </section>

        <section id="registerSection" class="max-w-md mx-auto hidden">
            <div class="bg-white rounded-lg shadow-md p-6">
                <h2 class="text-2xl font-bold text-center mb-6">Inscription</h2>
                <form id="registerForm" onsubmit="handleRegister(event)">
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Nom complet *</label>
                        <input type="text" id="regName" required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    </div>
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                        <input type="email" id="regEmail" required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    </div>
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Téléphone *</label>
                        <input type="tel" id="regPhone" required placeholder="+237 6XX XXX XXX" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    </div>
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Mot de passe *</label>
                        <input type="password" id="regPassword" required minlength="6" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    </div>
                    <div class="mb-6">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Code de parrainage (optionnel)</label>
                        <input type="text" id="regReferral" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    </div>
                    <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 font-medium">S'inscrire</button>
                </form>
                <p class="text-center mt-4 text-sm text-gray-600">Déjà inscrit? <a href="#" onclick="showSection('login')" class="text-blue-600 hover:underline">Se connecter</a></p>
            </div>
        </section>

        <section id="pendingSection" class="max-w-md mx-auto hidden">
            <div class="bg-white rounded-lg shadow-md p-6 text-center">
                <div class="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg class="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                </div>
                <h2 class="text-xl font-bold text-gray-800 mb-2">Compte en attente</h2>
                <p class="text-gray-600 mb-4">Votre compte est en cours de validation.</p>
                
                <div class="bg-gradient-to-r from-orange-50 to-yellow-50 border-2 border-orange-200 rounded-lg p-5 mb-4">
                    <div class="flex items-center justify-center gap-2 mb-3">
                        <svg class="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                        </svg>
                        <h3 class="font-bold text-orange-800 text-lg">Activation rapide</h3>
                    </div>
                    <p class="text-orange-700 text-sm mb-4">Payez <strong class="text-xl">4 000 FCFA</strong> via Mobile Money pour activer instantanément votre compte.</p>
                    <button onclick="payWithCinetPay()" id="cinetpayBtn" class="cinetpay-btn w-full py-3 px-6 text-white font-bold rounded-lg text-lg flex items-center justify-center gap-2">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                        </svg>
                        Payer avec Mobile Money
                    </button>
                    <p class="text-xs text-orange-600 mt-2">Orange Money, MTN Mobile Money, Moov Money...</p>
                </div>

                <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-left">
                    <h3 class="font-semibold text-yellow-800 mb-2">Compte de recharge</h3>
                    <p class="text-yellow-700 text-sm mb-2"><strong>Compte inactif</strong></p>
                    <p class="text-yellow-700 text-sm">Veuillez vous abonner pour accéder à votre compte.</p>
                    <p class="text-yellow-700 text-sm mt-2">Veuillez suivre la procédure de dépôt. Assurez-vous d'utiliser le numéro <strong id="pendingPhone"></strong> pour effectuer le dépôt.</p>
                </div>
            </div>
        </section>

        <section id="rejectedSection" class="max-w-md mx-auto hidden">
            <div class="bg-white rounded-lg shadow-md p-6 text-center">
                <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </div>
                <h2 class="text-xl font-bold text-gray-800 mb-2">Compte refusé</h2>
                <p class="text-gray-600">Votre demande d'inscription a été refusée. Veuillez contacter le support.</p>
            </div>
        </section>

        <section id="dashboardSection" class="hidden">
            <nav class="bg-white rounded-lg shadow-md mb-6 overflow-x-auto">
                <div class="flex">
                    <button onclick="showDashTab('overview')" id="tabOverview" class="flex-1 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 nav-active whitespace-nowrap">Aperçu</button>
                    <button onclick="showDashTab('videos')" id="tabVideos" class="flex-1 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 whitespace-nowrap">Vidéos</button>
                    <button onclick="showDashTab('referral')" id="tabReferral" class="flex-1 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 whitespace-nowrap">Megatrend</button>
                    <button onclick="showDashTab('withdraw')" id="tabWithdraw" class="flex-1 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 whitespace-nowrap">Retrait</button>
                </div>
            </nav>

            <div id="overviewTab">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div class="balance-box rounded-lg p-6 text-white">
                        <h3 class="text-sm font-medium opacity-90 mb-1">Solde Mis</h3>
                        <p class="text-3xl font-bold">4 000 FCFA</p>
                        <p class="text-xs opacity-75 mt-2">Montant fixe de départ</p>
                    </div>
                    <div class="gains-box rounded-lg p-6 text-white">
                        <h3 class="text-sm font-medium opacity-90 mb-1">Gains Accumulés</h3>
                        <p class="text-3xl font-bold" id="totalGains">0 FCFA</p>
                        <p class="text-xs opacity-75 mt-2">Parrainages + Vidéos + Bonus</p>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div class="bg-white rounded-lg p-4 shadow-sm">
                        <h4 class="text-sm font-medium text-gray-500 mb-1">Gains Parrainage</h4>
                        <p class="text-xl font-bold text-gray-800" id="referralGains">0 FCFA</p>
                    </div>
                    <div class="bg-white rounded-lg p-4 shadow-sm">
                        <h4 class="text-sm font-medium text-gray-500 mb-1">Gains Vidéos</h4>
                        <p class="text-xl font-bold text-gray-800" id="videoGains">0 FCFA</p>
                    </div>
                    <div class="bg-white rounded-lg p-4 shadow-sm">
                        <h4 class="text-sm font-medium text-gray-500 mb-1">Bonus Actions</h4>
                        <p class="text-xl font-bold text-purple-600" id="bonusGains">0 FCFA</p>
                    </div>
                    <div class="bg-white rounded-lg p-4 shadow-sm">
                        <h4 class="text-sm font-medium text-gray-500 mb-1">Filleuls Actifs</h4>
                        <p class="text-xl font-bold text-gray-800" id="referralCount">0</p>
                    </div>
                </div>

                <div class="bg-white rounded-lg p-4 shadow-sm">
                    <h4 class="text-sm font-medium text-gray-500 mb-2">Temps de visionnage total</h4>
                    <p class="text-lg font-semibold text-gray-800" id="watchTime">0 minutes</p>
                </div>
            </div>

            <div id="videosTab" class="hidden">
                <div class="bg-white rounded-lg shadow-md p-4 mb-4">
                    <h3 class="text-lg font-semibold mb-2">Activités Vidéo</h3>
                    <p class="text-sm text-gray-600 mb-4">Regardez les vidéos, likez et commentez pour gagner des bonus!</p>
                    <div class="grid grid-cols-3 gap-2 text-center">
                        <div class="bg-green-50 rounded p-2">
                            <p class="text-xs text-green-600 font-medium">Visionnage</p>
                            <p class="text-sm font-bold text-green-700">+5 FCFA/min</p>
                        </div>
                        <div class="bg-red-50 rounded p-2">
                            <p class="text-xs text-red-600 font-medium">Like</p>
                            <p class="text-sm font-bold text-red-700">+25 FCFA</p>
                        </div>
                        <div class="bg-purple-50 rounded p-2">
                            <p class="text-xs text-purple-600 font-medium">Commentaire</p>
                            <p class="text-sm font-bold text-purple-700">+50 FCFA</p>
                        </div>
                    </div>
                </div>
                <div id="videoList" class="space-y-4"></div>
            </div>

            <div id="referralTab" class="hidden">
                <div class="bg-white rounded-lg shadow-md p-6">
                    <h3 class="text-lg font-semibold mb-4">Programme Megatrend</h3>
                    <p class="text-sm text-gray-600 mb-6">Parrainez vos amis et gagnez des commissions sur 3 niveaux!</p>
                    
                    <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <h4 class="text-sm font-medium text-blue-800 mb-2">Votre code de parrainage</h4>
                        <div class="flex items-center gap-2">
                            <input type="text" id="referralCode" readonly class="flex-1 px-3 py-2 bg-white border border-blue-300 rounded text-center font-mono font-bold text-blue-600">
                            <button onclick="copyReferralCode()" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">Copier</button>
                        </div>
                    </div>

                    <div class="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                        <h4 class="text-sm font-medium text-gray-800 mb-2">Votre lien de parrainage</h4>
                        <div class="flex items-center gap-2">
                            <input type="text" id="referralLink" readonly class="flex-1 px-3 py-2 bg-white border border-gray-300 rounded text-xs">
                            <button onclick="copyReferralLink()" class="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm">Copier</button>
                        </div>
                    </div>

                    <div class="space-y-3">
                        <h4 class="text-sm font-medium text-gray-800">Commissions par niveau</h4>
                        <div class="flex items-center justify-between p-3 bg-green-50 rounded">
                            <span class="text-sm">Niveau 1 (direct)</span>
                            <span class="font-bold text-green-600">500 FCFA</span>
                        </div>
                        <div class="flex items-center justify-between p-3 bg-yellow-50 rounded">
                            <span class="text-sm">Niveau 2</span>
                            <span class="font-bold text-yellow-600">200 FCFA</span>
                        </div>
                        <div class="flex items-center justify-between p-3 bg-orange-50 rounded">
                            <span class="text-sm">Niveau 3</span>
                            <span class="font-bold text-orange-600">100 FCFA</span>
                        </div>
                    </div>

                    <div class="mt-6">
                        <h4 class="text-sm font-medium text-gray-800 mb-3">Vos filleuls</h4>
                        <div id="referralsList" class="space-y-2">
                            <p class="text-sm text-gray-500 text-center py-4">Aucun filleul pour le moment</p>
                        </div>
                    </div>
                </div>
            </div>

            <div id="withdrawTab" class="hidden">
                <div class="bg-white rounded-lg shadow-md p-6 mb-4">
                    <h3 class="text-lg font-semibold mb-4">Demande de Retrait</h3>
                    
                    <div class="flex gap-2 mb-4">
                        <button onclick="setWithdrawMethod('direct')" id="btnDirect" class="flex-1 py-2 px-4 bg-blue-600 text-white rounded font-medium">Mobile Money</button>
                        <button onclick="setWithdrawMethod('crypto')" id="btnCrypto" class="flex-1 py-2 px-4 bg-gray-200 text-gray-700 rounded font-medium">Crypto</button>
                    </div>

                    <div id="withdrawMinInfo" class="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p class="text-sm text-blue-800"><strong>Minimum Mobile Money:</strong> 1 000 FCFA</p>
                    </div>

                    <form id="withdrawForm" onsubmit="handleWithdraw(event)">
                        <div class="mb-4">
                            <label class="block text-sm font-medium text-gray-700 mb-1">Montant (FCFA)</label>
                            <input type="number" id="withdrawAmount" required min="1000" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        </div>

                        <div id="cryptoFields" class="hidden mb-4">
                            <label class="block text-sm font-medium text-gray-700 mb-1">Adresse Crypto (USDT TRC20)</label>
                            <input type="text" id="cryptoAddress" placeholder="TXxxxxxxxxxxxxxxxxxxxxxxxxxx" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        </div>

                        <div class="mb-4">
                            <label class="block text-sm font-medium text-gray-700 mb-1">Capture d'écran du tableau de bord</label>
                            <input type="file" id="screenshot" accept="image/*" required class="w-full px-3 py-2 border border-gray-300 rounded-md">
                        </div>

                        <button type="submit" class="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 font-medium">Soumettre la demande</button>
                    </form>
                </div>

                <div class="bg-white rounded-lg shadow-md p-6">
                    <h4 class="text-sm font-medium text-gray-800 mb-3">Historique des retraits</h4>
                    <div id="withdrawHistory" class="space-y-2">
                        <p class="text-sm text-gray-500 text-center py-4">Aucune demande de retrait</p>
                    </div>
                </div>
            </div>
        </section>

        <section id="adminSection" class="hidden">
            <div class="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg p-4 mb-6">
                <h2 class="text-xl font-bold">Panel Administrateur</h2>
                <p class="text-sm opacity-90">Gestion complète de la plateforme</p>
            </div>

            <nav class="bg-white rounded-lg shadow-md mb-6 overflow-x-auto">
                <div class="flex">
                    <button onclick="showAdminTab('pending')" id="adminTabPending" class="flex-1 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 nav-active whitespace-nowrap">En attente</button>
                    <button onclick="showAdminTab('users')" id="adminTabUsers" class="flex-1 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 whitespace-nowrap">Utilisateurs</button>
                    <button onclick="showAdminTab('withdrawals')" id="adminTabWithdrawals" class="flex-1 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 whitespace-nowrap">Retraits</button>
                    <button onclick="showAdminTab('videos')" id="adminTabVideos" class="flex-1 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 whitespace-nowrap">Vidéos</button>
                    <button onclick="showAdminTab('payments')" id="adminTabPayments" class="flex-1 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 whitespace-nowrap">Paiements</button>
                </div>
            </nav>

            <div id="adminPendingTab">
                <div class="bg-white rounded-lg shadow-md p-4">
                    <h3 class="text-lg font-semibold mb-4">Comptes en attente de validation</h3>
                    <div id="pendingUsersList" class="space-y-3"></div>
                </div>
            </div>

            <div id="adminUsersTab" class="hidden">
                <div class="bg-white rounded-lg shadow-md p-4">
                    <h3 class="text-lg font-semibold mb-4">Tous les utilisateurs</h3>
                    <div id="allUsersList" class="space-y-3"></div>
                </div>
            </div>

            <div id="adminWithdrawalsTab" class="hidden">
                <div class="bg-white rounded-lg shadow-md p-4">
                    <h3 class="text-lg font-semibold mb-4">Demandes de retrait</h3>
                    <div id="withdrawalsList" class="space-y-3"></div>
                </div>
            </div>

            <div id="adminVideosTab" class="hidden">
                <div class="bg-white rounded-lg shadow-md p-4 mb-4">
                    <h3 class="text-lg font-semibold mb-4">Ajouter une vidéo</h3>
                    <form id="addVideoForm" onsubmit="handleAddVideo(event)">
                        <div class="mb-3">
                            <input type="text" id="videoTitle" required placeholder="Titre de la vidéo" class="w-full px-3 py-2 border border-gray-300 rounded-md">
                        </div>
                        <div class="mb-3">
                            <input type="url" id="videoUrl" required placeholder="URL de la vidéo (YouTube/TikTok)" class="w-full px-3 py-2 border border-gray-300 rounded-md">
                        </div>
                        <div class="mb-3">
                            <select id="videoPlatform" class="w-full px-3 py-2 border border-gray-300 rounded-md">
                                <option value="youtube">YouTube</option>
                                <option value="tiktok">TikTok</option>
                            </select>
                        </div>
                        <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">Ajouter</button>
                    </form>
                </div>
                <div class="bg-white rounded-lg shadow-md p-4">
                    <h4 class="text-sm font-medium text-gray-800 mb-3">Vidéos actuelles</h4>
                    <div id="adminVideosList" class="space-y-2"></div>
                </div>
            </div>

            <div id="adminPaymentsTab" class="hidden">
                <div class="bg-white rounded-lg shadow-md p-4">
                    <h3 class="text-lg font-semibold mb-4">Paiements CinetPay</h3>
                    <div id="paymentsList" class="space-y-3"></div>
                </div>
            </div>
        </section>
    </main>

    <section class="bg-gray-800 text-white py-12 mt-12">
        <div class="max-w-4xl mx-auto px-4">
            <h2 class="text-2xl font-bold mb-6 text-center">À propos de Motosu Agencies</h2>
            <div class="space-y-4 text-gray-300 text-sm leading-relaxed">
                <p>Motosu Agencies est une plateforme innovante dédiée à l'accompagnement des jeunes entrepreneurs et professionnels francophones en Afrique.</p>
                <p>Nous croyons à l'importance de l'engagement et de la persévérance : chaque action sur notre plateforme contribue à la progression personnelle et professionnelle de nos utilisateurs.</p>
                <p class="text-white font-medium">Rejoignez-nous et découvrez comment votre engagement peut vous permettre de progresser!</p>
            </div>
        </div>
    </section>

    <footer class="bg-gray-900 text-gray-400 py-6">
        <div class="max-w-4xl mx-auto px-4 text-center text-sm">
            <p>© 2024 Motosu Agencies. Tous droits réservés.</p>
        </div>
    </footer>

    <div id="videoModal" class="fixed inset-0 bg-black bg-opacity-75 hidden items-center justify-center z-50 p-4">
        <div class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div class="p-4 border-b flex justify-between items-center">
                <h3 id="modalVideoTitle" class="font-semibold"></h3>
                <button onclick="closeVideoModal()" class="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
            </div>
            <div class="p-4">
                <div id="videoContainer" class="aspect-video bg-gray-100 rounded mb-4"></div>
                <div class="flex items-center justify-between mb-4">
                    <div>
                        <p class="text-sm text-gray-600">Temps: <span id="currentWatchTime" class="font-bold">0</span>s</p>
                        <p class="text-sm text-green-600">Gains: +<span id="currentVideoGains" class="font-bold">0</span> FCFA</p>
                    </div>
                    <a id="externalVideoLink" href="#" target="_blank" class="px-4 py-2 bg-blue-600 text-white rounded text-sm">Ouvrir</a>
                </div>
                
                <div class="border-t pt-4">
                    <p class="text-sm font-medium text-gray-700 mb-3">Actions bonus :</p>
                    <div class="grid grid-cols-2 gap-3">
                        <button id="likeBtn" onclick="handleVideoLike()" class="py-3 bg-red-500 text-white rounded-lg hover:bg-red-600">❤️ J'ai liké (+25 FCFA)</button>
                        <button id="commentBtn" onclick="handleVideoComment()" class="py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600">💬 J'ai commenté (+50 FCFA)</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div id="screenshotModal" class="fixed inset-0 bg-black bg-opacity-75 hidden items-center justify-center z-50 p-4">
        <div class="bg-white rounded-lg max-w-3xl w-full">
            <div class="p-4 border-b flex justify-between items-center">
                <h3 class="font-semibold">Capture d'écran</h3>
                <button onclick="closeScreenshotModal()" class="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
            </div>
            <div class="p-4">
                <img id="screenshotImage" src="" alt="Screenshot" class="w-full rounded">
            </div>
        </div>
    </div>

    <script>
        const CINETPAY_CONFIG = {
            apikey: '1998578076686c3f77308a92.08703757',
            site_id: '105901112',
            notify_url: window.location.origin + '/api/payment/notify',
            mode: 'PRODUCTION'
        };
        const SUBSCRIPTION_AMOUNT = 4000;

        let currentUser = null;
        let withdrawMethod = 'direct';
        let videoWatchInterval = null;
        let currentVideoId = null;
        let watchedSeconds = 0;
        let videoActions = [];

        function showToast(message, type = 'info') {
            const toast = document.getElementById('toast');
            const content = toast.querySelector('div');
            const colors = { success: 'bg-green-600', error: 'bg-red-600', info: 'bg-blue-600', warning: 'bg-yellow-600' };
            content.className = 'toast px-6 py-3 rounded-lg shadow-lg text-white font-medium ' + colors[type];
            content.textContent = message;
            toast.classList.remove('hidden');
            setTimeout(() => toast.classList.add('hidden'), 3000);
        }

        async function api(endpoint, method = 'GET', data = null) {
            try {
                const options = { method, headers: { 'Content-Type': 'application/json' } };
                if (data) options.body = JSON.stringify(data);
                const response = await fetch(endpoint, options);
                return await response.json();
            } catch (error) {
                console.error('API Error:', error);
                return { success: false, message: 'Erreur de connexion' };
            }
        }

        function sanitize(str) {
            if (typeof str !== 'string') return str;
            const div = document.createElement('div');
            div.textContent = str;
            return div.innerHTML;
        }

        document.addEventListener('DOMContentLoaded', async () => {
            const savedUser = localStorage.getItem('motosu_user');
            if (savedUser) {
                currentUser = JSON.parse(savedUser);
                const result = await api('/api/user/' + currentUser.id);
                if (result.success) {
                    currentUser = result.user;
                    localStorage.setItem('motosu_user', JSON.stringify(currentUser));
                    checkUserStatus();
                } else {
                    logout();
                }
            }

            const urlParams = new URLSearchParams(window.location.search);
            const refCode = urlParams.get('ref');
            if (refCode) {
                document.getElementById('regReferral').value = refCode;
                showSection('register');
            }
        });

        function showSection(section) {
            const sections = ['loginSection', 'registerSection', 'pendingSection', 'rejectedSection', 'dashboardSection', 'adminSection'];
            sections.forEach(s => document.getElementById(s).classList.add('hidden'));

            document.getElementById('headerButtons').classList.add('hidden');
            document.getElementById('userHeaderButtons').classList.add('hidden');

            if (section === 'login') {
                document.getElementById('loginSection').classList.remove('hidden');
                document.getElementById('headerButtons').classList.remove('hidden');
            } else if (section === 'register') {
                document.getElementById('registerSection').classList.remove('hidden');
                document.getElementById('headerButtons').classList.remove('hidden');
            } else if (section === 'pending') {
                document.getElementById('pendingSection').classList.remove('hidden');
                document.getElementById('pendingPhone').textContent = currentUser.phone;
                document.getElementById('userHeaderButtons').classList.remove('hidden');
                document.getElementById('userNameHeader').textContent = currentUser.name;
            } else if (section === 'rejected') {
                document.getElementById('rejectedSection').classList.remove('hidden');
                document.getElementById('userHeaderButtons').classList.remove('hidden');
                document.getElementById('userNameHeader').textContent = currentUser.name;
            } else if (section === 'dashboard') {
                document.getElementById('dashboardSection').classList.remove('hidden');
                document.getElementById('userHeaderButtons').classList.remove('hidden');
                document.getElementById('userNameHeader').textContent = currentUser.name;
                loadDashboard();
            } else if (section === 'admin') {
                document.getElementById('adminSection').classList.remove('hidden');
                document.getElementById('userHeaderButtons').classList.remove('hidden');
                document.getElementById('userNameHeader').textContent = 'Admin';
                loadAdminData();
            }
        }

        function showDashTab(tab) {
            ['overview', 'videos', 'referral', 'withdraw'].forEach(t => {
                document.getElementById(t + 'Tab').classList.add('hidden');
                document.getElementById('tab' + t.charAt(0).toUpperCase() + t.slice(1)).classList.remove('nav-active');
            });
            document.getElementById(tab + 'Tab').classList.remove('hidden');
            document.getElementById('tab' + tab.charAt(0).toUpperCase() + tab.slice(1)).classList.add('nav-active');
            if (tab === 'videos') loadVideos();
            if (tab === 'referral') loadReferrals();
            if (tab === 'withdraw') loadWithdrawHistory();
        }

        function showAdminTab(tab) {
            ['pending', 'users', 'withdrawals', 'videos', 'payments'].forEach(t => {
                document.getElementById('admin' + t.charAt(0).toUpperCase() + t.slice(1) + 'Tab').classList.add('hidden');
                document.getElementById('adminTab' + t.charAt(0).toUpperCase() + t.slice(1)).classList.remove('nav-active');
            });
            document.getElementById('admin' + tab.charAt(0).toUpperCase() + tab.slice(1) + 'Tab').classList.remove('hidden');
            document.getElementById('adminTab' + tab.charAt(0).toUpperCase() + tab.slice(1)).classList.add('nav-active');
            if (tab === 'pending') loadPendingUsers();
            if (tab === 'users') loadAllUsers();
            if (tab === 'withdrawals') loadWithdrawals();
            if (tab === 'videos') loadAdminVideos();
            if (tab === 'payments') loadPayments();
        }

        async function handleLogin(e) {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value.toLowerCase().trim();
            const password = document.getElementById('loginPassword').value;

            const result = await api('/api/login', 'POST', { email, password });
            if (result.success) {
                currentUser = result.user;
                localStorage.setItem('motosu_user', JSON.stringify(currentUser));
                showToast('Connexion réussie!', 'success');
                checkUserStatus();
            } else {
                showToast(result.message || 'Erreur de connexion', 'error');
            }
        }

        async function handleRegister(e) {
            e.preventDefault();
            const name = document.getElementById('regName').value.trim();
            const email = document.getElementById('regEmail').value.toLowerCase().trim();
            const phone = document.getElementById('regPhone').value.trim();
            const password = document.getElementById('regPassword').value;
            const referralCode = document.getElementById('regReferral').value.toUpperCase().trim();

            const result = await api('/api/register', 'POST', { name, email, phone, password, referralCode });
            if (result.success) {
                currentUser = result.user;
                localStorage.setItem('motosu_user', JSON.stringify(currentUser));
                showToast('Inscription réussie!', 'success');
                showSection('pending');
            } else {
                showToast(result.message || 'Erreur', 'error');
            }
        }

        function checkUserStatus() {
            if (!currentUser) return showSection('login');
            if (currentUser.isAdmin) return showSection('admin');
            if (currentUser.status === 'validated') return showSection('dashboard');
            if (currentUser.status === 'rejected') return showSection('rejected');
            showSection('pending');
        }

        function logout() {
            localStorage.removeItem('motosu_user');
            currentUser = null;
            showToast('Déconnexion réussie', 'info');
            showSection('login');
        }

        async function payWithCinetPay() {
            if (!currentUser) return showToast('Veuillez vous connecter', 'error');

            const initResult = await api('/api/payment/init', 'POST', { userId: currentUser.id });
            if (!initResult.success) return showToast(initResult.message || 'Erreur', 'error');

            const transactionId = initResult.transactionId;

            if (typeof CinetPay === 'undefined') {
                console.error('CinetPay SDK non chargé');
                if (confirm('Mode test: Simuler le paiement?')) {
                    await confirmPayment(transactionId, { simulated: true });
                }
                return;
            }

            try {
                CinetPay.setConfig({
                    apikey: CINETPAY_CONFIG.apikey,
                    site_id: CINETPAY_CONFIG.site_id,
                    notify_url: CINETPAY_CONFIG.notify_url,
                    mode: CINETPAY_CONFIG.mode
                });

                CinetPay.getCheckout({
                    transaction_id: transactionId,
                    amount: SUBSCRIPTION_AMOUNT,
                    currency: 'XAF',
                    channels: 'ALL',
                    description: 'Abonnement Motosu Agencies',
                    customer_name: currentUser.name.split(' ')[0] || 'Client',
                    customer_surname: currentUser.name.split(' ').slice(1).join(' ') || 'Motosu',
                    customer_email: currentUser.email,
                    customer_phone_number: currentUser.phone.replace(/\\s+/g, '').replace(/^\\+/, ''),
                    customer_address: 'Cameroun',
                    customer_city: 'Douala',
                    customer_country: 'CM',
                    customer_state: 'LT',
                    customer_zip_code: '00237'
                });

                CinetPay.waitResponse(async function(data) {
                    if (data.status === "ACCEPTED") {
                        await confirmPayment(transactionId, data);
                    } else {
                        showToast('Paiement refusé', 'error');
                    }
                });

                CinetPay.onError(function(data) {
                    console.error('CinetPay Error:', data);
                    if (confirm('Erreur de paiement. Simuler le paiement pour tester?')) {
                        confirmPayment(transactionId, { simulated: true });
                    }
                });
            } catch (error) {
                console.error('CinetPay Exception:', error);
                if (confirm('Erreur technique. Simuler le paiement?')) {
                    await confirmPayment(transactionId, { simulated: true });
                }
            }
        }

        async function confirmPayment(transactionId, paymentData) {
            showToast('Validation...', 'info');
            const result = await api('/api/payment/confirm', 'POST', {
                userId: currentUser.id,
                transactionId,
                paymentData
            });

            if (result.success) {
                currentUser = result.user;
                localStorage.setItem('motosu_user', JSON.stringify(currentUser));
                showToast('Paiement réussi! Compte activé.', 'success');
                setTimeout(() => showSection('dashboard'), 1000);
            } else {
                showToast(result.message || 'Erreur', 'error');
            }
        }

        async function loadDashboard() {
            const result = await api('/api/dashboard/' + currentUser.id);
            if (result.success) {
                document.getElementById('totalGains').textContent = result.totalGains.toLocaleString() + ' FCFA';
                document.getElementById('referralGains').textContent = result.referralGains.toLocaleString() + ' FCFA';
                document.getElementById('videoGains').textContent = result.videoGains.toLocaleString() + ' FCFA';
                document.getElementById('bonusGains').textContent = (result.bonusGains || 0).toLocaleString() + ' FCFA';
                document.getElementById('referralCount').textContent = result.referralCount;
                document.getElementById('watchTime').textContent = Math.floor(result.watchTime / 60) + ' minutes';
                document.getElementById('referralCode').value = result.referralCode;
                document.getElementById('referralLink').value = window.location.origin + '?ref=' + result.referralCode;
            }
        }

        async function loadVideos() {
            const [videosResult, actionsResult] = await Promise.all([
                api('/api/videos'),
                api('/api/video-actions/' + currentUser.id)
            ]);

            if (actionsResult.success) videoActions = actionsResult.actions;

            const container = document.getElementById('videoList');
            if (videosResult.success && videosResult.videos.length > 0) {
                container.innerHTML = videosResult.videos.map(v => {
                    const hasLiked = videoActions.some(a => a.videoId === v.id && a.action === 'like');
                    const hasCommented = videoActions.some(a => a.videoId === v.id && a.action === 'comment');
                    return '<div class="video-item bg-white rounded-lg shadow-sm p-4 cursor-pointer" onclick="openVideo(\\'' + v.id + '\\')">' +
                        '<div class="flex items-center gap-3">' +
                        '<div class="w-12 h-12 flex items-center justify-center rounded-lg ' + (v.platform === 'youtube' ? 'bg-red-100' : 'bg-black') + '">' +
                        '<span class="text-2xl">' + (v.platform === 'youtube' ? '▶️' : '🎵') + '</span></div>' +
                        '<div class="flex-1"><h4 class="font-medium text-gray-800">' + sanitize(v.title) + '</h4>' +
                        '<p class="text-xs text-gray-500">' + (v.platform === 'youtube' ? 'YouTube' : 'TikTok') + '</p></div></div>' +
                        '<div class="flex gap-2 mt-3 pt-3 border-t">' +
                        '<span class="text-xs px-2 py-1 rounded ' + (hasLiked ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-500') + '">' + (hasLiked ? '❤️ Liké' : '🤍 Non liké') + '</span>' +
                        '<span class="text-xs px-2 py-1 rounded ' + (hasCommented ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-500') + '">' + (hasCommented ? '💬 Commenté' : '💬 Non commenté') + '</span></div></div>';
                }).join('');
            } else {
                container.innerHTML = '<p class="text-sm text-gray-500 text-center py-4 bg-white rounded-lg">Aucune vidéo disponible</p>';
            }
        }

        async function openVideo(videoId) {
            const result = await api('/api/videos');
            if (!result.success) return;
            const video = result.videos.find(v => v.id === videoId);
            if (!video) return;

            currentVideoId = videoId;
            watchedSeconds = 0;

            document.getElementById('modalVideoTitle').textContent = video.title;
            document.getElementById('externalVideoLink').href = video.url;
            document.getElementById('currentWatchTime').textContent = '0';
            document.getElementById('currentVideoGains').textContent = '0';

            const hasLiked = videoActions.some(a => a.videoId === videoId && a.action === 'like');
            const hasCommented = videoActions.some(a => a.videoId === videoId && a.action === 'comment');

            const likeBtn = document.getElementById('likeBtn');
            const commentBtn = document.getElementById('commentBtn');

            likeBtn.disabled = hasLiked;
            likeBtn.className = hasLiked ? 'py-3 bg-gray-400 text-white rounded-lg cursor-not-allowed' : 'py-3 bg-red-500 text-white rounded-lg hover:bg-red-600';
            likeBtn.textContent = hasLiked ? '✅ Déjà liké' : '❤️ J\\'ai liké (+25 FCFA)';

            commentBtn.disabled = hasCommented;
            commentBtn.className = hasCommented ? 'py-3 bg-gray-400 text-white rounded-lg cursor-not-allowed' : 'py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600';
            commentBtn.textContent = hasCommented ? '✅ Déjà commenté' : '💬 J\\'ai commenté (+50 FCFA)';

            let embedUrl = video.url;
            if (video.platform === 'youtube') {
                const match = video.url.match(/(?:youtube\\.com\\/watch\\?v=|youtu\\.be\\/)([^&]+)/);
                if (match) embedUrl = 'https://www.youtube.com/embed/' + match[1] + '?autoplay=1';
            }

            document.getElementById('videoContainer').innerHTML = '<iframe src="' + embedUrl + '" class="w-full h-full rounded" allowfullscreen allow="autoplay"></iframe>';
            document.getElementById('videoModal').classList.remove('hidden');
            document.getElementById('videoModal').classList.add('flex');

            videoWatchInterval = setInterval(() => {
                watchedSeconds++;
                document.getElementById('currentWatchTime').textContent = watchedSeconds;
                document.getElementById('currentVideoGains').textContent = Math.floor(watchedSeconds / 12);
            }, 1000);
        }

        async function handleVideoLike() {
            if (!currentVideoId || !currentUser) return;
            const result = await api('/api/video/like', 'POST', { userId: currentUser.id, videoId: currentVideoId });
            if (result.success) {
                videoActions.push({ videoId: currentVideoId, action: 'like' });
                document.getElementById('likeBtn').disabled = true;
                document.getElementById('likeBtn').className = 'py-3 bg-gray-400 text-white rounded-lg cursor-not-allowed';
                document.getElementById('likeBtn').textContent = '✅ Déjà liké';
                showToast('+25 FCFA bonus!', 'success');
                loadDashboard();
            } else {
                showToast(result.message || 'Erreur', 'error');
            }
        }

        async function handleVideoComment() {
            if (!currentVideoId || !currentUser) return;
            const result = await api('/api/video/comment', 'POST', { userId: currentUser.id, videoId: currentVideoId });
            if (result.success) {
                videoActions.push({ videoId: currentVideoId, action: 'comment' });
                document.getElementById('commentBtn').disabled = true;
                document.getElementById('commentBtn').className = 'py-3 bg-gray-400 text-white rounded-lg cursor-not-allowed';
                document.getElementById('commentBtn').textContent = '✅ Déjà commenté';
                showToast('+50 FCFA bonus!', 'success');
                loadDashboard();
            } else {
                showToast(result.message || 'Erreur', 'error');
            }
        }

        async function closeVideoModal() {
            if (videoWatchInterval) clearInterval(videoWatchInterval);
            if (currentVideoId && watchedSeconds > 0) {
                await api('/api/watch', 'POST', { userId: currentUser.id, videoId: currentVideoId, seconds: watchedSeconds });
                loadDashboard();
            }
            document.getElementById('videoModal').classList.add('hidden');
            document.getElementById('videoModal').classList.remove('flex');
            document.getElementById('videoContainer').innerHTML = '';
            currentVideoId = null;
            watchedSeconds = 0;
            loadVideos();
        }

        async function loadReferrals() {
            const result = await api('/api/referrals/' + currentUser.id);
            const container = document.getElementById('referralsList');
            if (result.success && result.referrals.length > 0) {
                container.innerHTML = result.referrals.map(r => {
                    const statusClass = r.status === 'validated' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
                    const statusText = r.status === 'validated' ? 'Actif' : 'En attente';
                    return '<div class="flex items-center justify-between p-3 bg-gray-50 rounded">' +
                        '<div><p class="font-medium text-sm">' + sanitize(r.name) + '</p>' +
                        '<p class="text-xs text-gray-500">Niveau ' + r.level + '</p></div>' +
                        '<div class="text-right"><span class="text-xs px-2 py-1 rounded ' + statusClass + '">' + statusText + '</span>' +
                        '<p class="text-sm font-bold ' + (r.status === 'validated' ? 'text-green-600' : 'text-gray-400') + '">' +
                        (r.status === 'validated' ? '+' + r.commission + ' FCFA' : 'En attente') + '</p></div></div>';
                }).join('');
            } else {
                container.innerHTML = '<p class="text-sm text-gray-500 text-center py-4">Aucun filleul</p>';
            }
        }

        function copyReferralCode() {
            navigator.clipboard.writeText(document.getElementById('referralCode').value);
            showToast('Code copié!', 'success');
        }

        function copyReferralLink() {
            navigator.clipboard.writeText(document.getElementById('referralLink').value);
            showToast('Lien copié!', 'success');
        }

        function setWithdrawMethod(method) {
            withdrawMethod = method;
            document.getElementById('btnDirect').className = method === 'direct' ? 'flex-1 py-2 px-4 bg-blue-600 text-white rounded font-medium' : 'flex-1 py-2 px-4 bg-gray-200 text-gray-700 rounded font-medium';
            document.getElementById('btnCrypto').className = method === 'crypto' ? 'flex-1 py-2 px-4 bg-blue-600 text-white rounded font-medium' : 'flex-1 py-2 px-4 bg-gray-200 text-gray-700 rounded font-medium';
            document.getElementById('cryptoFields').classList.toggle('hidden', method !== 'crypto');
            
            if (method === 'crypto') {
                document.getElementById('withdrawMinInfo').innerHTML = '<p class="text-sm text-blue-800"><strong>Minimum Crypto:</strong> 10 000 FCFA</p>';
                document.getElementById('withdrawAmount').min = 10000;
            } else {
                document.getElementById('withdrawMinInfo').innerHTML = '<p class="text-sm text-blue-800"><strong>Minimum Mobile Money:</strong> 1 000 FCFA</p>';
                document.getElementById('withdrawAmount').min = 1000;
            }
        }

        async function handleWithdraw(e) {
            e.preventDefault();
            const amount = parseInt(document.getElementById('withdrawAmount').value);
            const cryptoAddress = document.getElementById('cryptoAddress').value.trim();
            const screenshotInput = document.getElementById('screenshot');

            if (withdrawMethod === 'crypto' && !cryptoAddress) return showToast('Entrez votre adresse crypto', 'error');
            if (!screenshotInput.files[0]) return showToast('Joignez une capture d\\'écran', 'error');

            const reader = new FileReader();
            reader.onload = async function(event) {
                const result = await api('/api/withdraw', 'POST', {
                    userId: currentUser.id,
                    amount,
                    method: withdrawMethod,
                    cryptoAddress: withdrawMethod === 'crypto' ? cryptoAddress : null,
                    screenshot: event.target.result
                });
                if (result.success) {
                    document.getElementById('withdrawForm').reset();
                    setWithdrawMethod('direct');
                    showToast('Demande soumise!', 'success');
                    loadWithdrawHistory();
                } else {
                    showToast(result.message || 'Erreur', 'error');
                }
            };
            reader.readAsDataURL(screenshotInput.files[0]);
        }

        async function loadWithdrawHistory() {
            const result = await api('/api/withdrawals/user/' + currentUser.id);
            const container = document.getElementById('withdrawHistory');
            if (result.success && result.withdrawals.length > 0) {
                container.innerHTML = result.withdrawals.map(w => {
                    const statusClass = w.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : w.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
                    const statusText = w.status === 'pending' ? 'En attente' : w.status === 'approved' ? 'Approuvé' : 'Refusé';
                    return '<div class="flex items-center justify-between p-3 bg-gray-50 rounded">' +
                        '<div><p class="font-medium text-sm">' + w.amount.toLocaleString() + ' FCFA</p>' +
                        '<p class="text-xs text-gray-500">' + (w.method === 'crypto' ? 'Crypto' : 'Mobile Money') + '</p></div>' +
                        '<span class="text-xs px-2 py-1 rounded ' + statusClass + '">' + statusText + '</span></div>';
                }).join('');
            } else {
                container.innerHTML = '<p class="text-sm text-gray-500 text-center py-4">Aucune demande</p>';
            }
        }

        function loadAdminData() { loadPendingUsers(); }

        async function loadPendingUsers() {
            const result = await api('/api/admin/pending');
            const container = document.getElementById('pendingUsersList');
            if (result.success && result.users.length > 0) {
                container.innerHTML = result.users.map(u => 
                    '<div class="p-4 border rounded-lg">' +
                    '<p class="font-medium">' + sanitize(u.name) + '</p>' +
                    '<p class="text-sm text-gray-500">' + sanitize(u.email) + '</p>' +
                    '<p class="text-sm text-gray-500">' + sanitize(u.phone) + '</p>' +
                    '<div class="flex gap-2 mt-3">' +
                    '<button onclick="validateUser(\\'' + u.id + '\\')" class="flex-1 py-2 bg-green-600 text-white rounded text-sm">Valider</button>' +
                    '<button onclick="rejectUser(\\'' + u.id + '\\')" class="flex-1 py-2 bg-red-600 text-white rounded text-sm">Refuser</button></div></div>'
                ).join('');
            } else {
                container.innerHTML = '<p class="text-sm text-gray-500 text-center py-4">Aucun compte en attente</p>';
            }
        }

        async function loadAllUsers() {
            const result = await api('/api/admin/users');
            const container = document.getElementById('allUsersList');
            if (result.success && result.users.length > 0) {
                container.innerHTML = result.users.map(u => {
                    const statusClass = u.status === 'validated' ? 'bg-green-100 text-green-800' : u.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800';
                    return '<div class="p-4 border rounded-lg">' +
                        '<div class="flex justify-between items-start">' +
                        '<div><p class="font-medium">' + sanitize(u.name) + '</p>' +
                        '<p class="text-sm text-gray-500">' + sanitize(u.email) + '</p>' +
                        '<p class="text-xs text-gray-400">Gains: ' + u.totalGains.toLocaleString() + ' FCFA | Filleuls: ' + u.referralCount + '</p></div>' +
                        '<span class="text-xs px-2 py-1 rounded ' + statusClass + '">' + u.status + '</span></div></div>';
                }).join('');
            } else {
                container.innerHTML = '<p class="text-sm text-gray-500 text-center py-4">Aucun utilisateur</p>';
            }
        }

        async function validateUser(userId) {
            const result = await api('/api/admin/validate/' + userId, 'POST');
            if (result.success) { showToast('Compte validé!', 'success'); loadPendingUsers(); loadAllUsers(); }
            else showToast(result.message || 'Erreur', 'error');
        }

        async function rejectUser(userId) {
            const result = await api('/api/admin/reject/' + userId, 'POST');
            if (result.success) { showToast('Compte refusé', 'info'); loadPendingUsers(); loadAllUsers(); }
            else showToast(result.message || 'Erreur', 'error');
        }

        async function loadWithdrawals() {
            const result = await api('/api/admin/withdrawals');
            const container = document.getElementById('withdrawalsList');
            if (result.success && result.withdrawals.length > 0) {
                container.innerHTML = result.withdrawals.map(w => {
                    const statusClass = w.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : w.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
                    return '<div class="p-4 border rounded-lg">' +
                        '<div class="flex justify-between items-start mb-2">' +
                        '<div><p class="font-medium">' + sanitize(w.userName) + '</p>' +
                        '<p class="text-sm text-gray-500">' + sanitize(w.userPhone) + '</p>' +
                        '<p class="text-lg font-bold text-blue-600">' + w.amount.toLocaleString() + ' FCFA</p>' +
                        '<p class="text-sm text-gray-500">' + (w.method === 'crypto' ? 'Crypto: ' + (w.cryptoAddress || 'N/A') : 'Mobile Money') + '</p></div>' +
                        '<span class="text-xs px-2 py-1 rounded ' + statusClass + '">' + w.status + '</span></div>' +
                        (w.screenshot ? '<img src="' + w.screenshot + '" class="w-full h-32 object-cover rounded cursor-pointer mb-3" onclick="openScreenshot(\\'' + w.screenshot.replace(/'/g, "\\\\'") + '\\')">' : '') +
                        (w.status === 'pending' ? '<div class="flex gap-2">' +
                        '<button onclick="approveWithdraw(\\'' + w.id + '\\')" class="flex-1 py-2 bg-green-600 text-white rounded text-sm">Approuver</button>' +
                        '<button onclick="rejectWithdraw(\\'' + w.id + '\\')" class="flex-1 py-2 bg-red-600 text-white rounded text-sm">Refuser</button></div>' : '') + '</div>';
                }).join('');
            } else {
                container.innerHTML = '<p class="text-sm text-gray-500 text-center py-4">Aucune demande</p>';
            }
        }

        function openScreenshot(src) {
            document.getElementById('screenshotImage').src = src;
            document.getElementById('screenshotModal').classList.remove('hidden');
            document.getElementById('screenshotModal').classList.add('flex');
        }

        function closeScreenshotModal() {
            document.getElementById('screenshotModal').classList.add('hidden');
            document.getElementById('screenshotModal').classList.remove('flex');
        }

        async function approveWithdraw(withdrawId) {
            const result = await api('/api/admin/withdraw/approve/' + withdrawId, 'POST');
            if (result.success) { showToast('Retrait approuvé!', 'success'); loadWithdrawals(); }
            else showToast(result.message || 'Erreur', 'error');
        }

        async function rejectWithdraw(withdrawId) {
            const result = await api('/api/admin/withdraw/reject/' + withdrawId, 'POST');
            if (result.success) { showToast('Retrait refusé', 'info'); loadWithdrawals(); }
            else showToast(result.message || 'Erreur', 'error');
        }

        async function loadAdminVideos() {
            const result = await api('/api/admin/videos');
            const container = document.getElementById('adminVideosList');
            if (result.success && result.videos.length > 0) {
                container.innerHTML = result.videos.map(v =>
                    '<div class="flex items-center justify-between p-3 bg-gray-50 rounded">' +
                    '<div><p class="font-medium text-sm">' + sanitize(v.title) + '</p>' +
                    '<p class="text-xs text-gray-500">' + v.platform + '</p></div>' +
                    '<button onclick="deleteVideo(\\'' + v.id + '\\')" class="text-red-600 hover:text-red-800">🗑️</button></div>'
                ).join('');
            } else {
                container.innerHTML = '<p class="text-sm text-gray-500 text-center py-4">Aucune vidéo</p>';
            }
        }

        async function handleAddVideo(e) {
            e.preventDefault();
            const result = await api('/api/admin/videos', 'POST', {
                title: document.getElementById('videoTitle').value.trim(),
                url: document.getElementById('videoUrl').value.trim(),
                platform: document.getElementById('videoPlatform').value
            });
            if (result.success) {
                document.getElementById('addVideoForm').reset();
                showToast('Vidéo ajoutée!', 'success');
                loadAdminVideos();
            } else {
                showToast(result.message || 'Erreur', 'error');
            }
        }

        async function deleteVideo(videoId) {
            if (confirm('Supprimer cette vidéo?')) {
                const result = await api('/api/admin/videos/' + videoId, 'DELETE');
                if (result.success) { showToast('Vidéo supprimée', 'info'); loadAdminVideos(); }
            }
        }

        async function loadPayments() {
            const result = await api('/api/admin/payments');
            const container = document.getElementById('paymentsList');
            if (result.success && result.payments.length > 0) {
                container.innerHTML = result.payments.map(p =>
                    '<div class="p-4 border rounded-lg bg-green-50">' +
                    '<p class="font-medium">' + sanitize(p.userName) + '</p>' +
                    '<p class="text-sm text-gray-500">' + sanitize(p.userEmail) + '</p>' +
                    '<p class="text-lg font-bold text-green-600">' + p.amount.toLocaleString() + ' FCFA</p>' +
                    '<p class="text-xs text-gray-400">ID: ' + p.transactionId + '</p></div>'
                ).join('');
            } else {
                container.innerHTML = '<p class="text-sm text-gray-500 text-center py-4">Aucun paiement</p>';
            }
        }
    </script>
</body>
</html>`;

// Serve HTML
app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.send(HTML_CONTENT);
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log('');
    console.log('========================================');
    console.log('   MOTOSU AGENCIES SERVER STARTED');
    console.log('========================================');
    console.log('Port: ' + PORT);
    console.log('Admin: admin@motosu.com / admin123');
    console.log('========================================');
    console.log('');
});

module.exports = app;
>>>>>>> 4dd5d4922cb45bf59780bf746c774676dd286ab2
