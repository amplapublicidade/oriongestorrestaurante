// Script para debugar integração Frontend-Backend
console.log('🔍 DEBUG: Testando integração Frontend-Backend\n');

// 1. Verificar URLs configuradas
console.log('📍 URLs configuradas:');
console.log('Frontend env.js:', 'https://orion-backend.onrender.com/api');
console.log('Axios baseURL:', process.env.REACT_APP_API_URL || 'http://localhost:3001/api');

// 2. Testar endpoints do backend
const endpoints = [
  'https://orion-backend.onrender.com',
  'https://orion-backend.onrender.com/health',
  'https://orion-backend.onrender.com/api',
  'https://orion-backend.onrender.com/api/auth',
];

const testEndpoint = async (url) => {
  try {
    console.log(`\n🔗 Testando: ${url}`);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log(`✅ Status: ${response.status}`);
    
    if (response.ok) {
      const data = await response.text();
      console.log(`📄 Resposta: ${data.substring(0, 100)}...`);
    } else {
      console.log(`❌ Erro HTTP: ${response.statusText}`);
    }
  } catch (error) {
    console.log(`❌ Erro: ${error.message}`);
  }
};

// 3. Verificar CORS
const testCORS = async () => {
  console.log('\n🌐 Testando CORS...');
  try {
    const response = await fetch('https://orion-backend.onrender.com/health', {
      method: 'OPTIONS',
      headers: {
        'Origin': 'https://orion-gestor-restaurante.netlify.app',
        'Access-Control-Request-Method': 'GET',
      },
    });
    
    console.log(`CORS Status: ${response.status}`);
    console.log(`CORS Headers:`, Object.fromEntries(response.headers.entries()));
  } catch (error) {
    console.log(`❌ CORS Error: ${error.message}`);
  }
};

// 4. Executar testes
const runTests = async () => {
  console.log('🚀 Iniciando testes...\n');
  
  for (const endpoint of endpoints) {
    await testEndpoint(endpoint);
  }
  
  await testCORS();
  
  console.log('\n✅ Testes concluídos!');
  console.log('\n📋 Checklist de verificação:');
  console.log('1. ✓ Backend deve responder em https://orion-backend.onrender.com/health');
  console.log('2. ✓ CORS deve permitir origem do Netlify');
  console.log('3. ✓ Modo demo deve estar desabilitado');
  console.log('4. ✓ URLs devem estar corretas no frontend');
};

// Executar se for chamado diretamente
if (typeof window !== 'undefined') {
  // Executar no browser
  runTests();
} else if (typeof module !== 'undefined' && module.exports) {
  // Executar no Node.js
  const fetch = require('node-fetch');
  runTests();
}