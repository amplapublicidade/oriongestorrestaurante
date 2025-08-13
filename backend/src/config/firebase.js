const admin = require('firebase-admin');
const path = require('path');

// Inicializar Firebase Admin SDK
// Preferência: GOOGLE_APPLICATION_CREDENTIALS (ADC). Se não houver, usar variáveis FIREBASE_*.
const preferADC = Boolean(process.env.GOOGLE_APPLICATION_CREDENTIALS);
const useEnvCredentials = Boolean(process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PROJECT_ID);

const normalizePrivateKey = (key) => {
  if (!key) return key;
  let normalized = key;
  // Remover aspas envolventes acidentais
  if ((normalized.startsWith('"') && normalized.endsWith('"')) || (normalized.startsWith("'") && normalized.endsWith("'"))) {
    normalized = normalized.slice(1, -1);
  }
  // Converter \n em quebras reais
  normalized = normalized.replace(/\\n/g, '\n');
  return normalized;
};

if (preferADC) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: process.env.FIREBASE_DATABASE_URL || 'https://orion-gestor.firebaseio.com'
  });
} else if (useEnvCredentials) {
  const serviceAccountLike = {
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: normalizePrivateKey(process.env.FIREBASE_PRIVATE_KEY),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI || 'https://accounts.google.com/o/oauth2/auth',
    token_uri: process.env.FIREBASE_TOKEN_URI || 'https://oauth2.googleapis.com/token',
    auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL || 'https://www.googleapis.com/oauth2/v1/certs',
    client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL
  };
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccountLike),
    databaseURL: process.env.FIREBASE_DATABASE_URL || 'https://orion-gestor.firebaseio.com'
  });
} else {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: process.env.FIREBASE_DATABASE_URL || 'https://orion-gestor.firebaseio.com'
  });
}

console.log('✅ Firebase Admin SDK inicializado com sucesso');

// Exportar instâncias do Firebase
const db = admin.firestore();
const auth = admin.auth();

module.exports = {
  admin,
  db,
  auth
}; 