// Script de debug para testar integração Frontend-Backend
console.log('🔍 DEBUG: Testando integração Frontend-Backend\n');

// 1. Verificar variável de ambiente
console.log('📍 Variável de ambiente:');
console.log('REACT_APP_API_URL:', process.env.REACT_APP_API_URL);

// 2. Testar conectividade com backend
const testBackend = async () => {
  try {
    console.log('\n🔗 Testando conectividade com backend...');
    
    const response = await fetch('https://orion-backend-6naz.onrender.com/health');
    const data = await response.json();
    
    console.log('✅ Backend responde:', data);
    return true;
  } catch (error) {
    console.error('❌ Erro ao conectar com backend:', error);
    return false;
  }
};

// 3. Testar registro
const testRegister = async () => {
  try {
    console.log('\n📝 Testando registro...');
    
    const response = await fetch('https://orion-backend-6naz.onrender.com/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User',
        email: `test${Date.now()}@example.com`,
        password: '123456'
      })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Registro funcionando:', data);
      return true;
    } else {
      console.error('❌ Erro no registro:', data);
      return false;
    }
  } catch (error) {
    console.error('❌ Erro ao testar registro:', error);
    return false;
  }
};

// 4. Testar login
const testLogin = async () => {
  try {
    console.log('\n🔐 Testando login...');
    
    const response = await fetch('https://orion-backend-6naz.onrender.com/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: '123456'
      })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Login funcionando:', data);
      return true;
    } else {
      console.error('❌ Erro no login:', data);
      return false;
    }
  } catch (error) {
    console.error('❌ Erro ao testar login:', error);
    return false;
  }
};

// 5. Executar todos os testes
const runTests = async () => {
  console.log('🚀 Iniciando testes...\n');
  
  const backendOk = await testBackend();
  const registerOk = await testRegister();
  const loginOk = await testLogin();
  
  console.log('\n📊 RESULTADO DOS TESTES:');
  console.log('Backend:', backendOk ? '✅' : '❌');
  console.log('Registro:', registerOk ? '✅' : '❌');
  console.log('Login:', loginOk ? '✅' : '❌');
  
  if (backendOk && registerOk && loginOk) {
    console.log('\n🎉 TODOS OS TESTES PASSARAM! A integração está funcionando!');
  } else {
    console.log('\n🚨 ALGUNS TESTES FALHARAM. Verifique os logs acima.');
  }
};

// Executar se for chamado diretamente
if (typeof window !== 'undefined') {
  // Executar no browser
  runTests();
} else {
  console.log('Execute este script no console do browser (F12 → Console)');
} 