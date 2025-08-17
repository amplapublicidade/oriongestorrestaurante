const BaseModel = require('./BaseModel');
const bcrypt = require('bcryptjs');

class User extends BaseModel {
  constructor() {
    super('users');
  }

  // Criar usuário com senha criptografada
  async createUser(userData) {
    try {
      // Verificar se email já existe
      const existingUser = await this.findByEmail(userData.email);
      if (existingUser) {
        throw new Error('Email já está em uso');
      }

      // Criptografar senha
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

      // Criar usuário
      const user = await this.create({
        name: userData.name,
        email: userData.email.toLowerCase(),
        password: hashedPassword,
        role: userData.role || 'funcionario',
        phone: userData.phone || '',
        address: userData.address || '',
        city: userData.city || '',
        state: userData.state || '',
        zipCode: userData.zipCode || '',
        hireDate: userData.hireDate || new Date(),
        salary: userData.salary || 0,
        department: userData.department || 'Geral',
        isActive: true,
        lastLogin: null
      });

      // Remover senha do retorno
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      throw error;
    }
  }

  // Autenticar usuário
  async authenticateUser(email, password) {
    try {
      const user = await this.findByEmail(email.toLowerCase());
      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      if (!user.isActive) {
        throw new Error('Conta desativada');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new Error('Senha incorreta');
      }

      // Atualizar último login
      await this.update(user.id, { lastLogin: new Date() });

      // Remover senha do retorno
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      throw error;
    }
  }

  // Atualizar senha
  async updatePassword(userId, currentPassword, newPassword) {
    try {
      const user = await this.findById(userId);
      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isCurrentPasswordValid) {
        throw new Error('Senha atual incorreta');
      }

      const saltRounds = 12;
      const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

      await this.update(userId, { password: hashedNewPassword });
      return { success: true };
    } catch (error) {
      throw error;
    }
  }

  // Buscar usuário por ID (sem senha)
  async findByIdWithoutPassword(id) {
    try {
      const user = await this.findById(id);
      if (!user) {
        return null;
      }

      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      throw error;
    }
  }

  // Buscar todos os usuários (sem senhas)
  async findAllWithoutPasswords(limit = 100) {
    try {
      const users = await this.findAll(limit);
      return users.map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new User();