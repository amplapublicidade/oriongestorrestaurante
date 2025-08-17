const BaseModel = require('./BaseModel');

class Supplier extends BaseModel {
  constructor() {
    super('suppliers');
  }

  // Criar fornecedor
  async createSupplier(supplierData) {
    try {
      // Verificar se fornecedor com mesmo CNPJ já existe
      if (supplierData.cnpj) {
        const existingSuppliers = await this.findWhere('cnpj', '==', supplierData.cnpj);
        if (existingSuppliers.length > 0) {
          throw new Error('Fornecedor com este CNPJ já existe');
        }
      }

      const supplier = await this.create({
        name: supplierData.name,
        cnpj: supplierData.cnpj || '',
        contact: {
          phone: supplierData.phone || '',
          email: supplierData.email || '',
          address: supplierData.address || ''
        },
        category: supplierData.category || 'Geral',
        isActive: true,
        rating: 0,
        notes: supplierData.notes || ''
      });

      return supplier;
    } catch (error) {
      throw error;
    }
  }

  // Buscar fornecedores ativos
  async findActive() {
    try {
      return await this.findWhere('isActive', '==', true);
    } catch (error) {
      throw error;
    }
  }

  // Buscar por categoria
  async findByCategory(category) {
    try {
      return await this.findWhere('category', '==', category);
    } catch (error) {
      throw error;
    }
  }

  // Buscar por CNPJ
  async findByCNPJ(cnpj) {
    try {
      const suppliers = await this.findWhere('cnpj', '==', cnpj);
      return suppliers.length > 0 ? suppliers[0] : null;
    } catch (error) {
      throw error;
    }
  }

  // Atualizar rating do fornecedor
  async updateRating(supplierId, newRating) {
    try {
      const supplier = await this.findById(supplierId);
      if (!supplier) {
        throw new Error('Fornecedor não encontrado');
      }

      await this.update(supplierId, { 
        rating: parseFloat(newRating),
        updatedAt: new Date()
      });

      return await this.findById(supplierId);
    } catch (error) {
      throw error;
    }
  }

  // Buscar fornecedores com filtros
  async findWithFilters(filters = {}) {
    try {
      let query = this.collection;

      // Aplicar filtros
      if (filters.category) {
        query = query.where('category', '==', filters.category);
      }
      if (filters.isActive !== undefined) {
        query = query.where('isActive', '==', filters.isActive);
      }
      if (filters.minRating !== undefined) {
        query = query.where('rating', '>=', parseFloat(filters.minRating));
      }

      // Ordenar e limitar
      query = query.orderBy('name', 'asc');
      if (filters.limit) {
        query = query.limit(parseInt(filters.limit));
      }

      const snapshot = await query.get();
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new Supplier(); 