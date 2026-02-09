/**
 * Gestionnaire de réponses standardisées
 */

const success = (res, data = {}, message = 'Succès', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    ...data
  });
};

const error = (res, message = 'Erreur', statusCode = 400) => {
  return res.status(statusCode).json({
    success: false,
    error: message
  });
};

const notFound = (res, message = 'Ressource non trouvée') => {
  return res.status(404).json({
    success: false,
    error: message
  });
};

const unauthorized = (res, message = 'Non autorisé') => {
  return res.status(401).json({
    success: false,
    error: message
  });
};

const forbidden = (res, message = 'Accès refusé') => {
  return res.status(403).json({
    success: false,
    error: message
  });
};

const serverError = (res, message = 'Erreur serveur') => {
  return res.status(500).json({
    success: false,
    error: message
  });
};

module.exports = {
  success,
  error,
  notFound,
  unauthorized,
  forbidden,
  serverError
};
