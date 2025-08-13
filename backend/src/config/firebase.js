const admin = require('firebase-admin');
const path = require('path');

// Inicializar Firebase Admin SDK usando credenciais padrão do ambiente
// Configure GOOGLE_APPLICATION_CREDENTIALS apontando para o JSON da conta de serviço
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
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