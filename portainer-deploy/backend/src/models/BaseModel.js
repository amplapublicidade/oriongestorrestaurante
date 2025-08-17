const { db } = require('../config/firebase');

class BaseModel {
  constructor(collectionName) {
    this.collection = db.collection(collectionName);
  }

  // Criar documento
  async create(data) {
    try {
      const docRef = await this.collection.add({
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      const doc = await docRef.get();
      return {
        id: doc.id,
        ...doc.data()
      };
    } catch (error) {
      throw new Error(`Erro ao criar documento: ${error.message}`);
    }
  }

  // Buscar por ID
  async findById(id) {
    try {
      const doc = await this.collection.doc(id).get();
      if (!doc.exists) {
        return null;
      }
      return {
        id: doc.id,
        ...doc.data()
      };
    } catch (error) {
      throw new Error(`Erro ao buscar documento: ${error.message}`);
    }
  }

  // Buscar todos
  async findAll(limit = 100) {
    try {
      const snapshot = await this.collection
        .orderBy('createdAt', 'desc')
        .limit(limit)
        .get();
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      throw new Error(`Erro ao buscar documentos: ${error.message}`);
    }
  }

  // Atualizar documento
  async update(id, data) {
    try {
      await this.collection.doc(id).update({
        ...data,
        updatedAt: new Date()
      });
      
      return await this.findById(id);
    } catch (error) {
      throw new Error(`Erro ao atualizar documento: ${error.message}`);
    }
  }

  // Deletar documento
  async delete(id) {
    try {
      await this.collection.doc(id).delete();
      return { success: true };
    } catch (error) {
      throw new Error(`Erro ao deletar documento: ${error.message}`);
    }
  }

  // Buscar com filtros
  async findWhere(field, operator, value) {
    try {
      const snapshot = await this.collection
        .where(field, operator, value)
        .get();
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      throw new Error(`Erro ao buscar com filtros: ${error.message}`);
    }
  }

  // Buscar por email (específico para usuários)
  async findByEmail(email) {
    try {
      const snapshot = await this.collection
        .where('email', '==', email)
        .limit(1)
        .get();
      
      if (snapshot.empty) {
        return null;
      }
      
      const doc = snapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data()
      };
    } catch (error) {
      throw new Error(`Erro ao buscar por email: ${error.message}`);
    }
  }
}

module.exports = BaseModel; 