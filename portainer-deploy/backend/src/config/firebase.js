const admin = require('firebase-admin');
require('dotenv').config({ path: '/home/magogue/oriongestorrestaurante/.env' });

console.log('🔍 Debug Firebase: Configurando Firebase...');

try {
  // O SDK do Firebase Admin irá procurar automaticamente a variável de ambiente
  // GOOGLE_APPLICATION_CREDENTIALS, que aponta para o caminho do arquivo de credenciais.
  // Esta é a forma padrão e mais robusta para desenvolvimento local (Docker) e produção.
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  });
  console.log('✅ Firebase Admin SDK inicializado com sucesso via Application Default Credentials.');
} catch (error) {
  console.error('❌ Falha ao inicializar o Firebase Admin SDK:', error.message);
  console.error('---');
  console.error('💡 DICA: Verifique se a variável de ambiente GOOGLE_APPLICATION_CREDENTIALS está configurada corretamente no seu arquivo .env');
  console.error('   - Ela deve apontar para o caminho do arquivo DENTRO do container (ex: /app/config/firebase-credentials.json).');
  console.error('   - O arquivo de credenciais JSON deve ser montado como um volume no docker-compose.yml.');
  console.error('---');
  process.exit(1);
}

// Exportar instâncias do Firebase
const db = admin.firestore();
module.exports = {
  admin,
  db
};

console.log('🚀 Firebase Admin SDK configurado com sucesso');