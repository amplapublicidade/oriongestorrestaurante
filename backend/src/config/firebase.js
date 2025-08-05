const admin = require('firebase-admin');
const path = require('path');

// Configuração do Firebase Admin SDK usando arquivo JSON
const serviceAccount = require('../../orion-gestor-firebase-adminsdk-fbsvc-ac432ef525.json');

// Inicializar Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://orion-gestor.firebaseio.com'
});

console.log('✅ Firebase Admin SDK inicializado com sucesso');

// Exportar instâncias do Firebase
const db = admin.firestore();
const auth = admin.auth();

module.exports = {
  admin,
  db,
  auth
}; 