/**
 * MOTOSU AGENCIES - Pages Module
 * Tous les templates de pages
 */

const pages = {

  // ==================== AUTH ====================
  login: () => `
    <div class="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-500 to-purple-600">
      <div class="card w-full max-w-md">
        <div class="text-center mb-6">
          <div class="flex justify-center mb-4">${renderLogo('lg')}</div>
          <p class="slogan text-lg mt-2">"Partagez, Gagnez, Grandissez ensemble"</p>
          <p class="text-gray-500 mt-1">Plateforme de gains en ligne</p>
        </div>
        <form id="loginForm">
          <input type="email" class="input" placeholder="Email" id="loginEmail" required>
          <input type="password" class="input" placeholder="Mot de passe" id="loginPassword" required>
          <button type="submit" class="btn-primary w-full">Se connecter</button>
        </form>
        <p class="text-center mt-4 text-gray-600">
          Pas de compte ? <a href="#" onclick="navigate('register')" class="text-blue-600 font-semibold">S'inscrire</a>
        </p>
        <hr class="my-4">
        <button onclick="navigate('subscription')" class="w-full btn-orange mb-3">💳 Voir les offres d'abonnement</button>
        <button onclick="navigate('about')" class="w-full text-gray-500 border border-gray-300 rounded-lg py-3 mb-4">À propos de nous</button>
        <div class="border-t pt-4">
          <div class="flex flex-wrap justify-center gap-2 text-xs text-gray-400">
            <a href="#" onclick="navigate('terms')" class="hover:text-blue-500">Conditions d'utilisation</a><span>•</span>
            <a href="#" onclick="navigate('privacy')" class="hover:text-blue-500">Confidentialité</a><span>•</span>
            <a href="#" onclick="navigate('legal')" class="hover:text-blue-500">Mentions légales</a><span>•</span>
            <a href="#" onclick="navigate('refund')" class="hover:text-blue-500">Remboursement</a><span>•</span>
            <a href="#" onclick="navigate('security')" class="hover:text-blue-500">Sécurité</a><span>•</span>
            <a href="#" onclick="navigate('contact')" class="hover:text-blue-500">Contact</a>
          </div>
          <div class="flex justify-center mt-3 opacity-50">${renderLogo()}</div>
          <p class="text-center text-xs text-gray-300 mt-3">© 2024 Motosu Agencies. Tous droits réservés.</p>
        </div>
      </div>
    </div>
  `,

  register: () => `
    <div class="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-green-500 to-blue-600">
      <div class="card w-full max-w-md">
        <div class="flex justify-center mb-4">${renderLogo('lg')}</div>
        <h1 class="text-2xl font-bold text-center mb-2 text-blue-600">Créer un compte</h1>
        <p class="text-center text-sm text-gray-500 mb-6 slogan">"Partagez, Gagnez, Grandissez ensemble"</p>
        <form id="registerForm">
          <input type="text" class="input" placeholder="Nom complet" id="regName" required>
          <input type="email" class="input" placeholder="Email" id="regEmail" required>
          <input type="tel" class="input" placeholder="Téléphone (+225 XX XX XX XX XX)" id="regPhone" required>
          <input type="password" class="input" placeholder="Mot de passe (min. 6 caractères)" id="regPassword" minlength="6" required>
          <input type="text" class="input" placeholder="Code parrain (optionnel)" id="regReferral" value="${localStorage.getItem('referralCode') || ''}">
          <button type="submit" class="btn-success w-full">S'inscrire gratuitement</button>
        </form>
        <p class="text-center mt-4 text-gray-600">
          Déjà un compte ? <a href="#" onclick="navigate('login')" class="text-blue-600 font-semibold">Se connecter</a>
        </p>
      </div>
    </div>
  `,

  // ==================== INFO PAGES ====================
  subscription: () => `
    <div class="min-h-screen p-4 bg-gray-100">
      <div class="card max-w-2xl mx-auto">
        <button onclick="navigate('login')" class="text-gray-500 mb-4">← Retour</button>
        <div class="flex justify-center mb-4">${renderLogo('lg')}</div>
        <h1 class="text-2xl font-bold mb-2 text-center text-blue-600">💳 Abonnement Motosu</h1>
        <p class="text-center slogan mb-4">"Partagez, Gagnez, Grandissez ensemble"</p>
        <div class="stat-orange rounded-xl p-6 text-center mb-6">
          <p class="text-lg opacity-90">Frais d'abonnement unique</p>
          <p class="text-4xl font-bold">${state.config.subscriptionAmount || 4000} FCFA</p>
        </div>
        <div class="mb-6">
          <h2 class="font-bold text-lg mb-3">✅ Ce que vous obtenez :</h2>
          <ul class="space-y-3">
            <li class="flex items-start gap-3 p-3 bg-green-50 rounded-lg"><span class="text-green-500 text-xl">✓</span><div><p class="font-semibold">Accès aux micro-tâches rémunérées</p><p class="text-sm text-gray-500">Sondages, vérifications, classifications...</p></div></li>
            <li class="flex items-start gap-3 p-3 bg-purple-50 rounded-lg"><span class="text-purple-500 text-xl">✓</span><div><p class="font-semibold">Vidéos à regarder = Argent gagné</p><p class="text-sm text-gray-500">YouTube et TikTok rémunérés</p></div></li>
            <li class="flex items-start gap-3 p-3 bg-blue-50 rounded-lg"><span class="text-blue-500 text-xl">✓</span><div><p class="font-semibold">Programme de parrainage 3 niveaux</p><p class="text-sm text-gray-500">2 000 FCFA (N1) + 800 FCFA (N2) + 400 FCFA (N3) par filleul</p></div></li>
            <li class="flex items-start gap-3 p-3 bg-orange-50 rounded-lg"><span class="text-orange-500 text-xl">✓</span><div><p class="font-semibold">Retraits faciles</p><p class="text-sm text-gray-500">Mobile Money via PayDunya dès 8 000 FCFA</p></div></li>
          </ul>
        </div>
        <div class="bg-blue-50 p-4 rounded-lg mb-6">
          <h3 class="font-bold text-blue-600 mb-2">💡 Comment s'abonner ?</h3>
          <ol class="text-sm text-gray-700 space-y-2">
            <li>1. Inscrivez-vous gratuitement</li>
            <li>2. Effectuez le dépôt de ${state.config.subscriptionAmount || 4000} FCFA via Mobile Money</li>
            <li>3. Envoyez la capture d'écran du paiement</li>
            <li>4. Votre compte est activé sous 24h</li>
          </ol>
        </div>
        <button onclick="navigate('register')" class="btn-primary w-full mb-3">Créer un compte maintenant</button>
      </div>
    </div>
  `,

  about: () => `
    <div class="min-h-screen p-4 bg-gray-100">
      <div class="card max-w-2xl mx-auto">
        <button onclick="navigate('login')" class="text-gray-500 mb-4">← Retour</button>
        <div class="flex justify-center mb-4">${renderLogo('lg')}</div>
        <h1 class="text-2xl font-bold mb-2 text-blue-600">À propos de Motosu Agencies</h1>
        <p class="slogan mb-4">"Partagez, Gagnez, Grandissez ensemble"</p>
        <p class="text-gray-700 leading-relaxed mb-4">Motosu Agencies est une plateforme innovante dédiée à l'accompagnement des jeunes entrepreneurs et professionnels francophones en Afrique. Notre mission est de créer un environnement sécurisé et accessible où chacun peut développer son réseau, apprendre à travers des contenus interactifs et bénéficier d'opportunités de croissance progressive.</p>
        <p class="text-gray-700 leading-relaxed mb-4">Nous croyons à l'importance de l'engagement et de la persévérance : chaque action sur notre plateforme contribue à la progression personnelle et professionnelle de nos utilisateurs.</p>
        <p class="text-gray-700 leading-relaxed mb-6">Notre équipe, basée en Afrique et en Europe, veille à ce que l'expérience utilisateur soit simple, sécurisée et adaptée aux besoins d'une communauté mobile-first. Rejoignez-nous et découvrez comment votre engagement peut vous permettre de progresser.</p>
      </div>
    </div>
  `,

  terms: () => `
    <div class="min-h-screen p-4 bg-gray-100">
      <div class="card max-w-2xl mx-auto">
        <button onclick="navigate('login')" class="text-gray-500 mb-4">← Retour</button>
        <h1 class="text-2xl font-bold mb-4 text-blue-600">📜 Conditions Générales d'Utilisation</h1>
        <p class="text-xs text-gray-400 mb-6">Dernière mise à jour : Janvier 2024</p>
        <div class="space-y-4 text-sm text-gray-700 leading-relaxed">
          <div><h3 class="font-bold text-gray-800 mb-2">1. Objet</h3><p>Les présentes CGU régissent l'accès et l'utilisation de la plateforme Motosu Agencies. En vous inscrivant, vous acceptez sans réserve l'intégralité de ces conditions.</p></div>
          <div><h3 class="font-bold text-gray-800 mb-2">2. Inscription et Compte</h3><p>L'inscription est ouverte à toute personne majeure. Vous devez fournir des informations exactes. Un frais d'activation unique de 4 000 FCFA est requis pour accéder aux fonctionnalités premium.</p></div>
          <div><h3 class="font-bold text-gray-800 mb-2">3. Services Proposés</h3><p>Micro-tâches rémunérées (sondages, vérifications, classifications, transcriptions), programme de parrainage à 3 niveaux, visionnage de vidéos rémunéré, et formations gratuites.</p></div>
          <div><h3 class="font-bold text-gray-800 mb-2">4. Rémunération et Retraits</h3><p>Gains crédités après validation. Retraits possibles à partir de 8 000 FCFA via Mobile Money (PayDunya). Traitement sous 24 à 48 heures ouvrées.</p></div>
          <div><h3 class="font-bold text-gray-800 mb-2">5. Programme de Parrainage</h3><p>Code unique par utilisateur. Niveau 1 : 2 000 FCFA, Niveau 2 : 800 FCFA, Niveau 3 : 400 FCFA. Commissions versées après validation du filleul.</p></div>
          <div><h3 class="font-bold text-gray-800 mb-2">6. Responsabilités</h3><p>Tout comportement abusif (multi-comptes, triche, spam) entraînera la suspension immédiate sans remboursement.</p></div>
          <div><h3 class="font-bold text-gray-800 mb-2">7. Modification</h3><p>Motosu Agencies se réserve le droit de modifier ces CGU. Les utilisateurs seront informés par notification.</p></div>
          <div><h3 class="font-bold text-gray-800 mb-2">8. Droit Applicable</h3><p>CGU soumises au droit ivoirien. Litiges devant les juridictions d'Abidjan, Côte d'Ivoire.</p></div>
        </div>
      </div>
    </div>
  `,

  privacy: () => `
    <div class="min-h-screen p-4 bg-gray-100">
      <div class="card max-w-2xl mx-auto">
        <button onclick="navigate('login')" class="text-gray-500 mb-4">← Retour</button>
        <h1 class="text-2xl font-bold mb-4 text-blue-600">🔒 Politique de Confidentialité</h1>
        <div class="space-y-4 text-sm text-gray-700 leading-relaxed">
          <div><h3 class="font-bold text-gray-800 mb-2">1. Données Collectées</h3><p>Nom complet, adresse email, numéro de téléphone. Nécessaires pour le fonctionnement du compte et les paiements.</p></div>
          <div><h3 class="font-bold text-gray-800 mb-2">2. Utilisation</h3><p>Gestion du compte, traitement des paiements et retraits, communication, amélioration de la plateforme.</p></div>
          <div><h3 class="font-bold text-gray-800 mb-2">3. Protection</h3><p>Chiffrement bcrypt, connexions HTTPS, protection rate limiting et helmet.</p></div>
          <div><h3 class="font-bold text-gray-800 mb-2">4. Partage</h3><p>Nous ne vendons, ne louons et ne partageons jamais vos données avec des tiers.</p></div>
          <div><h3 class="font-bold text-gray-800 mb-2">5. Vos Droits</h3><p>Droit d'accès, rectification et suppression. Contact : support@motosu-agencies.com.</p></div>
          <div><h3 class="font-bold text-gray-800 mb-2">6. Cookies</h3><p>Uniquement localStorage pour la session. Aucun cookie de suivi tiers.</p></div>
        </div>
      </div>
    </div>
  `,

  legal: () => `
    <div class="min-h-screen p-4 bg-gray-100">
      <div class="card max-w-2xl mx-auto">
        <button onclick="navigate('login')" class="text-gray-500 mb-4">← Retour</button>
        <h1 class="text-2xl font-bold mb-4 text-blue-600">⚖️ Mentions Légales</h1>
        <div class="space-y-4 text-sm text-gray-700 leading-relaxed">
          <div><h3 class="font-bold text-gray-800 mb-2">Éditeur</h3><p><strong>Motosu Agencies</strong><br>Abidjan, Côte d'Ivoire<br>contact@motosu-agencies.com</p></div>
          <div><h3 class="font-bold text-gray-800 mb-2">Hébergement</h3><p><strong>Render Inc.</strong> — San Francisco, CA, USA — www.render.com</p></div>
          <div><h3 class="font-bold text-gray-800 mb-2">Base de données</h3><p><strong>MongoDB Atlas</strong> — Serveurs en Europe, chiffrement au repos et en transit.</p></div>
          <div><h3 class="font-bold text-gray-800 mb-2">Propriété intellectuelle</h3><p>Tout le contenu est protégé. Reproduction non autorisée interdite.</p></div>
        </div>
      </div>
    </div>
  `,

  refund: () => `
    <div class="min-h-screen p-4 bg-gray-100">
      <div class="card max-w-2xl mx-auto">
        <button onclick="navigate('login')" class="text-gray-500 mb-4">← Retour</button>
        <h1 class="text-2xl font-bold mb-4 text-blue-600">💰 Politique de Remboursement</h1>
        <div class="space-y-4 text-sm text-gray-700 leading-relaxed">
          <div><h3 class="font-bold text-gray-800 mb-2">Frais d'activation</h3><p>Non remboursables une fois le compte activé.</p></div>
          <div><h3 class="font-bold text-gray-800 mb-2">Cas de remboursement</h3><ul class="list-disc pl-5 mt-2 space-y-1"><li>Double paiement involontaire</li><li>Compte non activé après 7 jours malgré paiement</li><li>Erreur technique empêchant l'utilisation</li></ul></div>
          <div><h3 class="font-bold text-gray-800 mb-2">Procédure</h3><p>Contactez le support avec : nom, email, preuve de paiement, motif. Traitement 5-10 jours ouvrés.</p></div>
          <div><h3 class="font-bold text-gray-800 mb-2">Retraits</h3><p>Gains retirables à partir de 15 000 FCFA via Moov Money ou Mix by Yas. Traitement 24-48h ouvrées.</p></div>
        </div>
      </div>
    </div>
  `,

  security: () => `
    <div class="min-h-screen p-4 bg-gray-100">
      <div class="card max-w-2xl mx-auto">
        <button onclick="navigate('login')" class="text-gray-500 mb-4">← Retour</button>
        <h1 class="text-2xl font-bold mb-4 text-blue-600">🛡️ Sécurité & Paiements</h1>
        <div class="space-y-4 text-sm text-gray-700 leading-relaxed">
          <div class="bg-green-50 p-4 rounded-lg border border-green-200"><h3 class="font-bold text-green-700 mb-2">✅ Vos données sont protégées</h3><p>Technologies avancées pour sécuriser vos informations.</p></div>
          <div><h3 class="font-bold text-gray-800 mb-2">Chiffrement</h3><p>Mots de passe chiffrés avec <strong>bcrypt</strong>.</p></div>
          <div><h3 class="font-bold text-gray-800 mb-2">Authentification</h3><p>Tokens <strong>JWT</strong> avec expiration 30 jours.</p></div>
          <div><h3 class="font-bold text-gray-800 mb-2">Protections</h3><ul class="list-disc pl-5 space-y-1"><li><strong>Rate Limiting</strong> : Anti-spam et brute force</li><li><strong>Helmet</strong> : Headers HTTP sécurisés</li><li><strong>CORS</strong> : Requêtes autorisées uniquement</li><li><strong>Validation</strong> : Entrées validées et nettoyées</li></ul></div>
          <div><h3 class="font-bold text-gray-800 mb-2">Paiements</h3><p>Via <strong>Mobile Money</strong> (Moov, Mix by Yas). Chaque transaction vérifiée manuellement.</p></div>
          <div><h3 class="font-bold text-gray-800 mb-2">Hébergement</h3><p><strong>Render</strong> (HTTPS) + <strong>MongoDB Atlas</strong> (chiffrement).</p></div>
        </div>
      </div>
    </div>
  `,

  contact: () => `
    <div class="min-h-screen p-4 bg-gray-100">
      <div class="card max-w-2xl mx-auto">
        <button onclick="navigate('login')" class="text-gray-500 mb-4">← Retour</button>
        <h1 class="text-2xl font-bold mb-4 text-blue-600">📞 Contact & Support</h1>
        <div class="space-y-4">
          <div class="bg-blue-50 p-4 rounded-lg border border-blue-200"><h3 class="font-bold text-blue-700 mb-2">💬 Besoin d'aide ?</h3><p class="text-sm text-gray-700">Réponse sous 24 heures.</p></div>
          <div class="grid gap-3">
            <div class="flex items-center gap-3 p-4 bg-white rounded-lg border"><span class="text-2xl">📧</span><div><p class="font-semibold">Email</p><p class="text-sm text-blue-600">support@motosu-agencies.com</p></div></div>
            <div class="flex items-center gap-3 p-4 bg-white rounded-lg border"><span class="text-2xl">📱</span><div><p class="font-semibold">WhatsApp</p><p class="text-sm text-green-600">+225 XX XX XX XX XX</p></div></div>
            <div class="flex items-center gap-3 p-4 bg-white rounded-lg border"><span class="text-2xl">🕐</span><div><p class="font-semibold">Horaires</p><p class="text-sm text-gray-600">Lundi - Samedi : 8h - 20h (GMT)</p></div></div>
            <div class="flex items-center gap-3 p-4 bg-white rounded-lg border"><span class="text-2xl">📍</span><div><p class="font-semibold">Adresse</p><p class="text-sm text-gray-600">Abidjan, Côte d'Ivoire</p></div></div>
          </div>
          <div class="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <h3 class="font-bold text-orange-700 mb-2">⚡ FAQ</h3>
            <div class="space-y-3 text-sm">
              <div><p class="font-semibold">Comment activer mon compte ?</p><p class="text-gray-600">Dépôt de 4 000 FCFA, envoi de capture, activation sous 24h.</p></div>
              <div><p class="font-semibold">Quand retirer mes gains ?</p><p class="text-gray-600">Dès 15 000 FCFA via Moov Money ou Mix by Yas.</p></div>
              <div><p class="font-semibold">Combien avec le parrainage ?</p><p class="text-gray-600">2 000 FCFA (N1), 800 FCFA (N2), 400 FCFA (N3).</p></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,

  // ==================== APP PAGES ====================
  pending: () => `
    <div class="min-h-screen p-4 bg-gray-100">
      <div class="card max-w-lg mx-auto">
        <div class="text-center mb-6">
          <div class="flex justify-center mb-4">${renderLogo('lg')}</div>
          <h1 class="text-xl font-bold text-orange-600">Compte de recharge - Compte inactif</h1>
          <p class="text-gray-600 mt-2">Veuillez vous abonner pour activer votre compte.</p>
        </div>
        <div class="bg-orange-50 border border-orange-200 p-4 rounded-lg mb-4">
          <p class="font-bold text-orange-800 text-center text-lg">${state.config.subscriptionAmount || 4000} FCFA</p>
          <p class="text-xs text-orange-700 text-center mt-1">Paiement sécurisé via PayDunya</p>
        </div>

        <button onclick="payWithPayDunya()" class="btn-orange w-full mb-3">🔒 Payer et activer mon compte</button>

        <div class="bg-blue-50 p-4 rounded-lg mb-6">
          <h3 class="font-bold text-blue-600 mb-2">ℹ️ Info</h3>
          <p class="text-sm text-gray-700">Après paiement, votre compte sera activé automatiquement.</p>
        </div>

        <button onclick="logout()" class="w-full text-red-500 py-2">Déconnexion</button>
      </div>
    </div>
  `,

  dashboard: () => {
    if(state.currentUser?.earnings) checkMilestone(state.currentUser.earnings);
    return `
    <div class="min-h-screen bg-gray-100">
      ${renderNav()}
      <div class="p-4 max-w-4xl mx-auto">
        <div class="flex items-center gap-3 mb-1">
          <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">${(state.currentUser?.name || 'U')[0].toUpperCase()}</div>
          <div><h1 class="text-xl font-bold">Bonjour, ${state.currentUser?.name?.split(' ')[0]} 👋</h1><p class="text-xs slogan">"Partagez, Gagnez, Grandissez ensemble"</p></div>
        </div>
        <div class="grid grid-cols-2 gap-4 mb-6">
          <div class="stat-blue rounded-xl p-4 text-center"><p class="text-sm opacity-80">Solde Mis</p><p class="text-2xl font-bold">4 000 FCFA</p></div>
          <div class="stat-orange rounded-xl p-4 text-center"><p class="text-sm opacity-80">Gains Accumulés</p><p class="text-2xl font-bold">${state.currentUser?.earnings || 0} FCFA</p></div>
        </div>
        <div class="card mb-4">
          <h2 class="font-bold mb-3">📊 Vos statistiques</h2>
          <div class="grid grid-cols-4 gap-2 text-center">
            <div class="bg-blue-50 p-3 rounded-lg"><p class="text-xl font-bold text-blue-600">${state.referrals?.level1?.users?.length || 0}</p><p class="text-xs text-gray-500">Filleuls N1</p></div>
            <div class="bg-green-50 p-3 rounded-lg"><p class="text-xl font-bold text-green-600">${state.referrals?.level2?.users?.length || 0}</p><p class="text-xs text-gray-500">Filleuls N2</p></div>
            <div class="bg-purple-50 p-3 rounded-lg"><p class="text-xl font-bold text-purple-600">${state.currentUser?.completedTasks?.length || 0}</p><p class="text-xs text-gray-500">Tâches</p></div>
            <div class="bg-orange-50 p-3 rounded-lg"><p class="text-xl font-bold text-orange-600">${state.currentUser?.watchedVideos?.length || 0}</p><p class="text-xs text-gray-500">Vidéos</p></div>
          </div>
        </div>
        <div class="card mb-4 bg-gradient-to-r from-orange-100 to-yellow-100 border-2 border-orange-300">
          <h2 class="font-bold mb-2 text-orange-700">🔥 Invitez vos amis!</h2>
          <p class="text-sm text-gray-700 mb-3">Plus vous partagez, plus vous gagnez!</p>
          <div class="bg-white p-3 rounded-lg">
            <p class="text-xs text-gray-500 mb-1">Votre code :</p>
            <div class="flex items-center justify-between">
              <code class="text-lg font-bold text-blue-600">${state.currentUser?.referralCode}</code>
              <button onclick="copyReferral()" class="btn-orange text-sm py-2 px-4">📋 Copier le lien</button>
            </div>
          </div>
        </div>
        <div class="card">
          <h2 class="font-bold mb-3">💡 Actions rapides</h2>
          <div class="grid grid-cols-4 gap-3">
            <button onclick="navigate('tasks')" class="bg-green-100 text-green-700 p-4 rounded-lg text-center hover:bg-green-200 transition"><p class="text-2xl mb-1">📋</p><p class="font-semibold text-xs">Tâches</p></button>
            <button onclick="navigate('videos')" class="bg-purple-100 text-purple-700 p-4 rounded-lg text-center hover:bg-purple-200 transition"><p class="text-2xl mb-1">🎬</p><p class="font-semibold text-xs">Vidéos</p></button>
            <button onclick="navigate('referrals')" class="bg-blue-100 text-blue-700 p-4 rounded-lg text-center hover:bg-blue-200 transition"><p class="text-2xl mb-1">👥</p><p class="font-semibold text-xs">Parrainer</p></button>
            <button onclick="navigate('withdraw')" class="bg-orange-100 text-orange-700 p-4 rounded-lg text-center hover:bg-orange-200 transition"><p class="text-2xl mb-1">💰</p><p class="font-semibold text-xs">Retrait</p></button>
          </div>
        </div>
      </div>
    </div>
  `},

  tasks: () => {
    const completedToday = state.currentUser?.tasksCompletedToday?.length || 0;
    const availableTasks = state.tasks.filter(t => !state.currentUser?.tasksCompletedToday?.includes(getId(t)));
    const isPaused = state.taskStatus?.paused;
    return `
      <div class="min-h-screen bg-gray-100">
        ${renderNav()}
        <div class="p-4 max-w-4xl mx-auto">
          <h1 class="text-xl font-bold mb-2">📋 Micro-Tâches</h1>
          <p class="text-sm text-gray-500 mb-4">Complétez des tâches et gagnez de l'argent!</p>
          ${isPaused ? `
            <div class="bg-orange-50 border-2 border-orange-300 rounded-xl p-6 mb-4 text-center">
              <p class="text-4xl mb-3">⏸️</p>
              <h3 class="font-bold text-orange-700 text-lg">Pause en cours</h3>
              <p class="text-orange-600 mt-2">${state.taskStatus.message}</p>
              <p class="text-sm text-gray-500 mt-3">Profitez-en pour regarder des vidéos ou inviter des amis!</p>
              <div class="flex gap-3 justify-center mt-4">
                <button onclick="navigate('videos')" class="bg-purple-500 text-white px-4 py-2 rounded-lg text-sm font-semibold">🎬 Vidéos</button>
                <button onclick="navigate('referrals')" class="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold">👥 Parrainer</button>
              </div>
            </div>
          ` : `
            <div class="bg-white rounded-lg p-4 mb-4 shadow-sm">
              <div class="flex justify-between items-center mb-2"><span class="font-semibold">Aujourd'hui</span><span class="text-blue-600 font-bold">${completedToday}/10 tâches</span></div>
              <div class="progress-bar"><div class="progress-fill" style="width: ${completedToday * 10}%"></div></div>
              <p class="text-xs text-gray-500 mt-2">${10 - completedToday} tâches restantes aujourd'hui</p>
            </div>
          `}
          ${availableTasks.length === 0 && !isPaused ? `
            <div class="card text-center py-8"><p class="text-4xl mb-3">🎉</p><p class="font-bold text-green-600">Toutes les tâches complétées!</p><p class="text-gray-500 text-sm">Revenez plus tard.</p></div>
          ` : !isPaused ? `
            <div class="space-y-3">
              ${availableTasks.map(task => `
                <div class="card hover:shadow-lg transition">
                  <div class="flex items-start justify-between">
                    <div class="flex-1">
                      <span class="text-xs px-2 py-1 rounded-full ${getTaskTypeColor(task.type)}">${getTaskTypeLabel(task.type)}</span>
                      <h3 class="font-semibold mt-2">${task.title}</h3>
                      <p class="text-sm text-gray-500 mt-1">${task.description}</p>
                    </div>
                    <div class="text-right ml-4"><p class="font-bold text-green-600 text-lg">+${task.reward} FCFA</p></div>
                  </div>
                  <button onclick="openTask('${getId(task)}')" class="btn-success w-full mt-4 text-sm py-3">Commencer cette tâche</button>
                </div>
              `).join('')}
            </div>
          ` : ''}
          <div class="mt-6">
            <h3 class="font-bold mb-3 text-gray-600">✓ Complétées (${state.currentUser?.completedTasks?.length || 0})</h3>
            <div class="space-y-2">
              ${state.tasks.filter(t => state.currentUser?.completedTasks?.includes(getId(t))).map(task => `
                <div class="bg-green-50 border border-green-200 rounded-lg p-3 flex justify-between items-center">
                  <div><p class="font-semibold text-green-700">${task.title}</p><p class="text-xs text-green-600">+${task.reward} FCFA</p></div>
                  <span class="text-green-500 text-xl">✓</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  },

  videos: () => {
    const watchedVideos = state.currentUser?.watchedVideos || [];
    const availableVideos = state.videos.filter(v => !watchedVideos.includes(getId(v)));
    return `
      <div class="min-h-screen bg-gray-100">
        ${renderNav()}
        <div class="p-4 max-w-4xl mx-auto">
          <h1 class="text-xl font-bold mb-2">🎬 Vidéos à regarder</h1>
          <p class="text-sm text-gray-500 mb-4">Regardez des vidéos et gagnez!</p>
          <div class="bg-purple-50 border border-purple-200 p-3 rounded-lg mb-4"><p class="text-sm text-purple-800"><strong>💡</strong> Regardez jusqu'à la fin pour valider vos gains!</p></div>
          ${availableVideos.length === 0 ? `
            <div class="card text-center py-8"><p class="text-4xl mb-3">🎉</p><p class="font-bold text-green-600">Toutes les vidéos regardées!</p><p class="text-gray-500 text-sm">Nouvelles vidéos bientôt.</p></div>
          ` : `
            <div class="space-y-4">
              ${availableVideos.map(video => `
                <div class="video-card">
                  <div class="p-4">
                    <div class="flex items-center gap-2 mb-2">
                      <span class="text-xs px-2 py-1 rounded-full ${video.platform === 'youtube' ? 'bg-red-100 text-red-600' : 'bg-pink-100 text-pink-600'}">${video.platform === 'youtube' ? '▶️ YouTube' : '🎵 TikTok'}</span>
                      <span class="text-xs text-gray-500">${video.duration} min</span>
                    </div>
                    <h3 class="font-semibold">${video.title}</h3>
                    <div class="flex justify-between items-center mt-3">
                      <p class="font-bold text-green-600">+${video.reward} FCFA</p>
                      <button onclick="openVideo('${getId(video)}')" class="btn-primary text-sm py-2 px-4">Regarder & Gagner</button>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          `}
          <div class="mt-6">
            <h3 class="font-bold mb-3 text-gray-600">✓ Regardées (${watchedVideos.length})</h3>
            <div class="space-y-2">
              ${state.videos.filter(v => watchedVideos.includes(getId(v))).map(video => `
                <div class="bg-green-50 border border-green-200 rounded-lg p-3 flex justify-between items-center">
                  <div><p class="font-semibold text-green-700">${video.title}</p><p class="text-xs text-green-600">+${video.reward} FCFA</p></div>
                  <span class="text-green-500 text-xl">✓</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  },

  formations: () => `
    <div class="min-h-screen bg-gray-100">
      ${renderNav()}
      <div class="p-4 max-w-4xl mx-auto">
        <h1 class="text-xl font-bold mb-2">📚 Formations</h1>
        <p class="text-sm text-gray-500 mb-4">Développez vos compétences!</p>
        ${state.formations.length === 0 ? `
          <div class="card text-center py-12"><p class="text-5xl mb-4">📖</p><p class="font-bold text-gray-600 text-lg">Aucune formation disponible</p><p class="text-gray-500 text-sm mt-2">Nouvelles formations bientôt!</p></div>
        ` : `
          <div class="grid gap-4">
            ${state.formations.map(f => `
              <div class="card hover:shadow-lg transition">
                <div class="flex gap-4">
                  ${f.image ? `<div class="w-24 h-24 flex-shrink-0"><img src="${f.image}" alt="${f.title}" class="w-full h-full object-cover rounded-lg" onerror="this.style.display='none'"></div>` : `<div class="w-24 h-24 flex-shrink-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center"><span class="text-3xl">📚</span></div>`}
                  <div class="flex-1">
                    <span class="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-600">${f.category || 'Général'}</span>
                    <h3 class="font-bold mt-1">${f.title}</h3>
                    <p class="text-sm text-gray-500 mt-1 line-clamp-2">${f.description}</p>
                    <a href="${f.link}" target="_blank" rel="noopener noreferrer" class="inline-block mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition">🎓 Accéder</a>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        `}
      </div>
    </div>
  `,

  referrals: () => `
    <div class="min-h-screen bg-gray-100">
      ${renderNav()}
      <div class="p-4 max-w-4xl mx-auto">
        <h1 class="text-xl font-bold mb-2">👥 Programme Parrainage</h1>
        <p class="slogan text-sm mb-4">"Partagez, Gagnez, Grandissez ensemble"</p>
        <div class="card mb-4">
          <h2 class="font-bold mb-3">🔗 Votre lien</h2>
          <div class="bg-gradient-to-r from-orange-500 to-pink-500 p-4 rounded-lg text-white text-center">
            <p class="text-sm opacity-80 mb-1">Code unique</p>
            <p class="text-2xl font-bold mb-3">${state.currentUser?.referralCode}</p>
            <button onclick="copyReferral()" class="bg-white text-orange-600 px-6 py-2 rounded-full font-semibold text-sm">📋 Copier le lien</button>
          </div>
        </div>
        <div class="bg-gradient-to-r from-yellow-100 to-orange-100 border-2 border-orange-300 p-4 rounded-lg mb-4">
          <p class="text-sm text-orange-800"><strong>🔥 Partagez sur WhatsApp, Facebook, TikTok!</strong></p>
        </div>
        <div class="grid gap-4">
          <div class="card border-l-4 border-green-500">
            <div class="flex justify-between items-center">
              <div><h3 class="font-bold text-green-600">🥇 Niveau 1</h3><p class="text-sm text-gray-500">2 000 FCFA par filleul</p></div>
              <div class="text-right"><p class="text-3xl font-bold">${state.referrals?.level1?.users?.length || 0}</p><p class="text-green-600 font-bold">${state.referrals?.level1?.total || 0} FCFA</p></div>
            </div>
            ${(state.referrals?.level1?.users?.length > 0) ? `<div class="mt-3 pt-3 border-t"><div class="flex flex-wrap gap-2">${state.referrals.level1.users.map(u => `<span class="text-xs px-2 py-1 rounded-full ${u.status === 'validated' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}">${u.name} ${u.status === 'validated' ? '✓' : '⏳'}</span>`).join('')}</div></div>` : ''}
          </div>
          <div class="card border-l-4 border-blue-500">
            <div class="flex justify-between items-center">
              <div><h3 class="font-bold text-blue-600">🥈 Niveau 2</h3><p class="text-sm text-gray-500">800 FCFA par filleul</p></div>
              <div class="text-right"><p class="text-3xl font-bold">${state.referrals?.level2?.users?.length || 0}</p><p class="text-blue-600 font-bold">${state.referrals?.level2?.total || 0} FCFA</p></div>
            </div>
          </div>
          <div class="card border-l-4 border-purple-500">
            <div class="flex justify-between items-center">
              <div><h3 class="font-bold text-purple-600">🥉 Niveau 3</h3><p class="text-sm text-gray-500">400 FCFA par filleul</p></div>
              <div class="text-right"><p class="text-3xl font-bold">${state.referrals?.level3?.users?.length || 0}</p><p class="text-purple-600 font-bold">${state.referrals?.level3?.total || 0} FCFA</p></div>
            </div>
          </div>
        </div>
        <div class="card mt-4 stat-orange">
          <div class="text-center"><p class="text-sm opacity-80">Total gains parrainage</p><p class="text-3xl font-bold">${(state.referrals?.level1?.total || 0) + (state.referrals?.level2?.total || 0) + (state.referrals?.level3?.total || 0)} FCFA</p></div>
        </div>
      </div>
    </div>
  `,

  withdraw: () => `
    <div class="min-h-screen bg-gray-100">
      ${renderNav()}
      <div class="p-4 max-w-4xl mx-auto">
        <h1 class="text-xl font-bold mb-4">💰 Retraits</h1>
        <div class="card mb-4">
          <div class="stat-orange rounded-lg p-4 text-center mb-4"><p class="text-sm opacity-80">Solde disponible</p><p class="text-3xl font-bold">${state.currentUser?.earnings || 0} FCFA</p></div>
          <form id="withdrawForm">
            <label class="block text-sm font-medium text-gray-700 mb-2">Méthode</label>
            <select id="withdrawMethod" class="input">
              <option value="moov">Moov Money (min 15 000 FCFA)</option>
              <option value="mix">Mix by Yas (min 15 000 FCFA)</option>
            </select>
            <label class="block text-sm font-medium text-gray-700 mb-2">Montant</label>
            <input type="number" id="withdrawAmount" class="input" placeholder="Montant (min 15 000)" min="15000" required>
            <label class="block text-sm font-medium text-gray-700 mb-2">Numéro de réception</label>
            <input type="text" id="withdrawAccount" class="input" placeholder="+225 XX XX XX XX XX" required>
            <label class="block text-sm font-medium text-gray-700 mb-2">Nom du titulaire</label>
            <input type="text" id="withdrawName" class="input" placeholder="Nom complet" value="${state.currentUser?.name || ''}">
            <button type="submit" class="btn-orange w-full">Demander le retrait</button>
          </form>
          <p class="text-xs text-gray-500 text-center mt-3">⏱️ Traitement sous 24-48h ouvrées</p>
        </div>
        <div class="card">
          <h2 class="font-bold mb-3">📜 Historique</h2>
          ${state.withdrawals.length === 0 ? '<p class="text-gray-500 text-sm text-center py-4">Aucun retrait</p>' : `
            <div class="space-y-2">
              ${state.withdrawals.map(w => `
                <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div><p class="font-semibold">${w.amount} FCFA</p><p class="text-xs text-gray-500">${w.method === 'moov' ? 'Moov Money' : 'Mix by Yas'} • ${new Date(w.createdAt).toLocaleDateString('fr-FR')}</p></div>
                  <span class="px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(w.status)}">${getStatusLabel(w.status)}</span>
                </div>
              `).join('')}
            </div>
          `}
        </div>
      </div>
    </div>
  `,

  admin: () => `
    <div class="min-h-screen bg-gray-100">
      <div class="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
        <div class="max-w-4xl mx-auto flex justify-between items-center">
          <h1 class="text-xl font-bold">⚙️ Admin Panel</h1>
          <button onclick="logout()" class="bg-white/20 px-4 py-2 rounded-lg text-sm">Déconnexion</button>
        </div>
      </div>
      <div class="p-4 max-w-4xl mx-auto">
        <div class="flex gap-2 overflow-x-auto mb-4 pb-2">
          <button onclick="setAdminTab('stats')" class="admin-tab px-4 py-2 bg-white rounded-lg text-sm whitespace-nowrap" id="tab-stats">📊 Stats</button>
          <button onclick="setAdminTab('pending')" class="admin-tab px-4 py-2 bg-white rounded-lg text-sm whitespace-nowrap" id="tab-pending">⏳ En attente</button>
          <button onclick="setAdminTab('users')" class="admin-tab px-4 py-2 bg-white rounded-lg text-sm whitespace-nowrap" id="tab-users">👥 Utilisateurs</button>
          <button onclick="setAdminTab('withdrawals')" class="admin-tab px-4 py-2 bg-white rounded-lg text-sm whitespace-nowrap" id="tab-withdrawals">💸 Retraits</button>
          <button onclick="setAdminTab('videos')" class="admin-tab px-4 py-2 bg-white rounded-lg text-sm whitespace-nowrap" id="tab-videos">🎬 Vidéos</button>
          <button onclick="setAdminTab('formations')" class="admin-tab px-4 py-2 bg-white rounded-lg text-sm whitespace-nowrap" id="tab-formations">📚 Formations</button>
          <button onclick="setAdminTab('tasks')" class="admin-tab px-4 py-2 bg-white rounded-lg text-sm whitespace-nowrap" id="tab-tasks">📋 Tâches</button>
          <button onclick="setAdminTab('config')" class="admin-tab px-4 py-2 bg-white rounded-lg text-sm whitespace-nowrap" id="tab-config">⚙️ Config</button>
        </div>
        <div id="adminContent"></div>
      </div>
    </div>
  `
};
