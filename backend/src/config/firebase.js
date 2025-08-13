const admin = require('firebase-admin');

// Inicializar Firebase Admin SDK
// Preferência: GOOGLE_APPLICATION_CREDENTIALS (ADC). Se não houver, usar variáveis FIREBASE_*.
const preferADC = Boolean(process.env.GOOGLE_APPLICATION_CREDENTIALS);
const useEnvCredentials = Boolean(process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PROJECT_ID);

const normalizePrivateKey = (key) => {
  if (!key) return key;
  let normalized = key;
  
  // Log para debug
  console.log('🔑 FIREBASE_PRIVATE_KEY (tamanho):', normalized.length, 'chars');
  console.log('🔑 Início:', normalized.substring(0, 50));
  console.log('🔑 Final:', normalized.substring(normalized.length - 50));
  
  // Remover aspas envolventes acidentais
  if ((normalized.startsWith('"') && normalized.endsWith('"')) || (normalized.startsWith("'") && normalized.endsWith("'"))) {
    normalized = normalized.slice(1, -1);
  }
  
  // Converter \n em quebras reais (múltiplas variações)
  normalized = normalized.replace(/\\n/g, '\n');
  normalized = normalized.replace(/\\\\n/g, '\n');
  
  // Garantir que começa corretamente
  if (!normalized.includes('-----BEGIN PRIVATE KEY-----')) {
    console.log('❌ Chave não tem header BEGIN válido');
    throw new Error('FIREBASE_PRIVATE_KEY deve começar com -----BEGIN PRIVATE KEY-----');
  }
  
  // Se não tem footer, a chave está truncada
  if (!normalized.includes('-----END PRIVATE KEY-----')) {
    console.log('❌ Chave não tem footer END válido - variável truncada no Render');
    console.log('💡 Solução: Use Secret File ou verifique se a chave completa foi colada');
    throw new Error('FIREBASE_PRIVATE_KEY está incompleta - falta -----END PRIVATE KEY-----');
  }
  
  // Limpar espaços e quebras extras
  normalized = normalized.trim();
  
  // Se ainda estiver em uma linha, tentar quebrar manualmente
  if (!normalized.includes('\n')) {
    console.log('🔧 Tentando quebrar chave em linha única...');
    normalized = normalized
      .replace('-----BEGIN PRIVATE KEY-----', '-----BEGIN PRIVATE KEY-----\n')
      .replace('-----END PRIVATE KEY-----', '\n-----END PRIVATE KEY-----');
    
    // Quebrar o conteúdo base64 em linhas de 64 caracteres
    const lines = [];
    const content = normalized.split('\n');
    content.forEach(line => {
      if (line.startsWith('-----')) {
        lines.push(line);
      } else if (line.length > 64) {
        for (let i = 0; i < line.length; i += 64) {
          lines.push(line.substring(i, i + 64));
        }
      } else if (line.length > 0) {
        lines.push(line);
      }
    });
    normalized = lines.join('\n');
  }
  
  console.log('✅ Chave normalizada com', normalized.split('\n').length, 'linhas');
  return normalized;
};

if (preferADC) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: process.env.FIREBASE_DATABASE_URL || 'https://orion-gestor.firebaseio.com'
  });
  console.log('✅ Firebase inicializado via GOOGLE_APPLICATION_CREDENTIALS');
} else if (useEnvCredentials) {
  try {
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
    console.log('✅ Firebase inicializado via variáveis FIREBASE_*');
  } catch (error) {
    console.error('❌ Erro ao inicializar Firebase via variáveis de ambiente:', error.message);
    console.log('💡 Recomendação: Configure Secret File no Render com GOOGLE_APPLICATION_CREDENTIALS');
    throw error;
  }
} else {
  console.log('⚠️ Nenhuma credencial Firebase encontrada, tentando Application Default...');
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