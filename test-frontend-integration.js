// Teste específico para verificar integração frontend-backend
console.log('🔍 TESTE ESPECÍFICO: Verificando integração frontend-backend\n');

// 1. Verificar URL da API
console.log('📍 URL da API configurada:');
console.log('REACT_APP_API_URL:', process.env.REACT_APP_API_URL);

// 2. Simular dados que o frontend deveria enviar
const testData = {
  name: 'Test User',
  email: `test${Date.now()}@example.com`,
  password: '123456'
};

console.log('\n📝 Dados que serão enviados:');
console.log(JSON.stringify(testData, null, 2));

// 3. Testar envio com a URL configurada
const testWithConfiguredURL = async () => {
  try {
    console.log('\n🔗 Testando com URL configurada...');
    
    const apiUrl = process.env.REACT_APP_API_URL;
    if (!apiUrl) {
      console.error('❌ REACT_APP_API_URL não está definida!');
      return false;
    }
    
    console.log('URL completa:', `${apiUrl}/auth/register`);
    
    const response = await fetch(`${apiUrl}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });
    
    const data = await response.json();
    
    console.log('Status:', response.status);
    console.log('Resposta:', data);
    
    if (response.ok) {
      console.log('✅ Registro funcionando com URL configurada!');
      return true;
    } else {
      console.log('❌ Erro com URL configurada:', data);
      return false;
    }
  } catch (error) {
    console.error('❌ Erro ao testar com URL configurada:', error);
    return false;
  }
};

// 4. Testar envio com URL direta
const testWithDirectURL = async () => {
  try {
    console.log('\n🔗 Testando com URL direta...');
    
    const response = await fetch('https://orion-backend-6naz.onrender.com/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });
    
    const data = await response.json();
    
    console.log('Status:', response.status);
    console.log('Resposta:', data);
    
    if (response.ok) {
      console.log('✅ Registro funcionando com URL direta!');
      return true;
    } else {
      console.log('❌ Erro com URL direta:', data);
      return false;
    }
  } catch (error) {
    console.error('❌ Erro ao testar com URL direta:', error);
    return false;
  }
};

// 5. Executar testes
const runTests = async () => {
  console.log('🚀 Iniciando testes de integração...\n');
  
  const configuredOk = await testWithConfiguredURL();
  const directOk = await testWithDirectURL();
  
  console.log('\n📊 RESULTADO DOS TESTES:');
  console.log('URL Configurada:', configuredOk ? '✅' : '❌');
  console.log('URL Direta:', directOk ? '✅' : '❌');
  
  if (configuredOk) {
    console.log('\n🎉 A integração está funcionando! O problema pode ser:');
    console.log('- Dados do formulário vazios');
    console.log('- Validação do frontend');
    console.log('- Cache do browser');
  } else if (directOk) {
    console.log('\n🚨 Problema identificado:');
    console.log('- A variável REACT_APP_API_URL não está correta');
    console.log('- Verifique se está configurada como: https://orion-backend-6naz.onrender.com/api');
  } else {
    console.log('\n🚨 Problema no backend ou rede');
  }
};

// Executar se for chamado diretamente
if (typeof window !== 'undefined') {
  // Executar no browser
  runTests();
} else {
  console.log('Execute este script no console do browser (F12 → Console)');
} 