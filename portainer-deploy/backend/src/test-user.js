const User = require('./models/User');

async function testUserCreation() {
  try {
    console.log('🧪 Testando criação de usuário...');
    
    const userData = {
      name: 'Usuário Teste',
      email: 'teste@teste.com',
      password: '123456'
    };
    
    const user = await User.createUser(userData);
    console.log('✅ Usuário criado com sucesso:', user);
    
    // Testar autenticação
    console.log('🧪 Testando autenticação...');
    const authenticatedUser = await User.authenticateUser('teste@teste.com', '123456');
    console.log('✅ Autenticação bem-sucedida:', authenticatedUser);
    
  } catch (error) {
    console.error('❌ Erro no teste:', error.message);
  }
}

testUserCreation(); 