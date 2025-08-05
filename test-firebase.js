const admin = require('firebase-admin');

// Configuração do Firebase Admin SDK
const serviceAccount = require('./orion-gestor-firebase-adminsdk-fbsvc-ac432ef525.json');

try {
  // Inicializar Firebase Admin SDK
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://orion-gestor.firebaseio.com'
  });
  
  console.log('✅ Firebase Admin SDK inicializado com sucesso');
  
  // Testar conexão com Firestore
  const db = admin.firestore();
  
  // Testar uma operação simples
  db.collection('test').doc('test').set({
    message: 'Teste de conexão',
    timestamp: new Date()
  }).then(() => {
    console.log('✅ Conexão com Firestore funcionando!');
    process.exit(0);
  }).catch((error) => {
    console.error('❌ Erro ao conectar com Firestore:', error);
    process.exit(1);
  });
  
} catch (error) {
  console.error('❌ Erro ao inicializar Firebase:', error);
  process.exit(1);
} 