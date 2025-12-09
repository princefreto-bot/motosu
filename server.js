const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static(path.join(__dirname, 'public')));

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

// In-memory storage
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
                referralCode: newUser.referralCode,
                referredBy: newUser.referredBy,
                referralGains: newUser.referralGains,
                videoGains: newUser.videoGains,
                bonusGains: newUser.bonusGains,
                watchTime: newUser.watchTime
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
                referredBy: user.referredBy,
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
                referredBy: user.referredBy,
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
        res.json({ success: false, message: 'Erreur lors du chargement du tableau de bord' });
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

        res.json({ 
            success: true, 
            watchTime: user.watchTime,
            videoGains: user.videoGains,
            gainsAdded: gainsToAdd
        });
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

        // Check if already liked
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

        // Check if already commented
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
        console.error('Referrals error:', error);
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

        const bonusGains = user.bonusGains || 0;
        const totalGains = user.referralGains + user.videoGains + bonusGains;

        if (amount > totalGains) {
            return res.json({ success: false, message: 'Solde insuffisant' });
        }

        if (method === 'direct' && amount < MIN_WITHDRAW_DIRECT) {
            return res.json({ success: false, message: `Le montant minimum pour Mobile Money est de ${MIN_WITHDRAW_DIRECT} FCFA` });
        }

        if (method === 'crypto' && amount < MIN_WITHDRAW_CRYPTO) {
            return res.json({ success: false, message: `Le montant minimum pour Crypto est de ${MIN_WITHDRAW_CRYPTO} FCFA` });
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
        res.json({ success: false, message: 'Erreur lors de la demande de retrait' });
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

        const transactionId = 'MOTOSU' + Date.now();

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
                referredBy: user.referredBy,
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
    // Handle CinetPay webhook notification
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

// Validate user (manual)
app.post('/api/admin/validate/:userId', (req, res) => {
    try {
        const user = db.users.find(u => u.id === req.params.userId);
        if (!user) {
            return res.json({ success: false, message: 'Utilisateur non trouvé' });
        }

        user.status = 'validated';
        user.validatedManually = true;
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
        console.error('Validate error:', error);
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
        console.error('Reject error:', error);
        res.json({ success: false, message: 'Erreur' });
    }
});

// Get all withdrawals
app.get('/api/admin/withdrawals', (req, res) => {
    res.json({ 
        success: true,
        withdrawals: db.withdrawals.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) 
    });
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
            let remaining = withdrawal.amount;
            
            // First from bonus gains
            const bonusGains = user.bonusGains || 0;
            if (bonusGains >= remaining) {
                user.bonusGains = bonusGains - remaining;
                remaining = 0;
            } else {
                user.bonusGains = 0;
                remaining -= bonusGains;
            }
            
            // Then from video gains
            if (remaining > 0 && user.videoGains >= remaining) {
                user.videoGains -= remaining;
                remaining = 0;
            } else if (remaining > 0) {
                remaining -= user.videoGains;
                user.videoGains = 0;
            }
            
            // Finally from referral gains
            if (remaining > 0) {
                user.referralGains -= remaining;
            }
        }

        withdrawal.status = 'approved';
        withdrawal.approvedAt = new Date().toISOString();
        res.json({ success: true });
    } catch (error) {
        console.error('Approve withdrawal error:', error);
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
        withdrawal.rejectedAt = new Date().toISOString();
        res.json({ success: true });
    } catch (error) {
        console.error('Reject withdrawal error:', error);
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
        console.error('Add video error:', error);
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
        console.error('Delete video error:', error);
        res.json({ success: false, message: 'Erreur' });
    }
});

// Get all payments
app.get('/api/admin/payments', (req, res) => {
    res.json({ 
        success: true,
        payments: db.payments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) 
    });
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve frontend for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`
╔══════════════════════════════════════════════════════════════╗
║                    MOTOSU AGENCIES SERVER                     ║
╠══════════════════════════════════════════════════════════════╣
║  Serveur démarré sur le port ${PORT}                            ║
║                                                              ║
║  Compte Admin par défaut:                                    ║
║  - Email: admin@motosu.com                                   ║
║  - Mot de passe: admin123                                    ║
╚══════════════════════════════════════════════════════════════╝
    `);
});

module.exports = app;