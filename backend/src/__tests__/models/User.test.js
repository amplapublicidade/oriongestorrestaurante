const User = require('../../models/User');
const { db } = require('../../config/firebase');

describe('User Model', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create a new user successfully', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@test.com',
        password: '123456'
      };

      const mockDoc = {
        id: 'user123',
        data: () => ({
          ...userData,
          id: 'user123',
          role: 'user',
          createdAt: new Date(),
          updatedAt: new Date()
        })
      };

      const mockAdd = jest.fn().mockResolvedValue({
        id: 'user123',
        get: jest.fn().mockResolvedValue(mockDoc)
      });

      db.collection.mockReturnValue({
        add: mockAdd
      });

      const result = await User.createUser(userData);

      expect(result).toBeDefined();
      expect(result.id).toBe('user123');
      expect(result.name).toBe(userData.name);
      expect(result.email).toBe(userData.email);
      expect(result.role).toBe('user');
    });

    it('should throw error if user already exists', async () => {
      const userData = {
        name: 'Test User',
        email: 'existing@test.com',
        password: '123456'
      };

      const mockSnapshot = {
        empty: false,
        docs: [{
          id: 'existing123',
          data: () => ({ email: 'existing@test.com' })
        }]
      };

      db.collection.mockReturnValue({
        where: jest.fn().mockReturnValue({
          get: jest.fn().mockResolvedValue(mockSnapshot)
        })
      });

      await expect(User.createUser(userData)).rejects.toThrow('Usuário já existe');
    });
  });

  describe('authenticateUser', () => {
    it('should authenticate user with correct credentials', async () => {
      const email = 'test@test.com';
      const password = '123456';

      const mockSnapshot = {
        empty: false,
        docs: [{
          id: 'user123',
          data: () => ({
            name: 'Test User',
            email: 'test@test.com',
            password: '$2a$10$hashedpassword',
            role: 'user'
          })
        }]
      };

      db.collection.mockReturnValue({
        where: jest.fn().mockReturnValue({
          get: jest.fn().mockResolvedValue(mockSnapshot)
        })
      });

      // Mock bcrypt.compare
      const bcrypt = require('bcryptjs');
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      const result = await User.authenticateUser(email, password);

      expect(result).toBeDefined();
      expect(result.email).toBe(email);
    });

    it('should throw error for invalid credentials', async () => {
      const email = 'test@test.com';
      const password = 'wrongpassword';

      const mockSnapshot = {
        empty: true,
        docs: []
      };

      db.collection.mockReturnValue({
        where: jest.fn().mockReturnValue({
          get: jest.fn().mockResolvedValue(mockSnapshot)
        })
      });

      await expect(User.authenticateUser(email, password)).rejects.toThrow('Credenciais inválidas');
    });
  });
}); 