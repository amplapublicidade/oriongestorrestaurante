const BaseModel = require('./BaseModel');

class Product extends BaseModel {
  constructor() {
    super('products');
  }

  // Criar produto
  async createProduct(productData) {
    try {
      // Verificar se produto com mesmo nome já existe
      const existingProducts = await this.findWhere('name', '==', productData.name);
      if (existingProducts.length > 0) {
        throw new Error('Produto com este nome já existe');
      }

      const product = await this.create({
        name: productData.name,
        description: productData.description || '',
        price: parseFloat(productData.price) || 0,
        cost: parseFloat(productData.cost) || 0,
        category: productData.category || 'Geral',
        stock: parseInt(productData.stock) || 0,
        minStock: parseInt(productData.minStock) || 0,
        unit: productData.unit || 'un',
        barcode: productData.barcode || '',
        isActive: true,
        supplierId: productData.supplierId || null,
        image: productData.image || ''
      });

      return product;
    } catch (error) {
      throw error;
    }
  }

  // Atualizar estoque
  async updateStock(productId, newStock) {
    try {
      const product = await this.findById(productId);
      if (!product) {
        throw new Error('Produto não encontrado');
      }

      await this.update(productId, { 
        stock: parseInt(newStock),
        updatedAt: new Date()
      });

      return await this.findById(productId);
    } catch (error) {
      throw error;
    }
  }

  // Buscar produtos por categoria
  async findByCategory(category) {
    try {
      return await this.findWhere('category', '==', category);
    } catch (error) {
      throw error;
    }
  }

  // Buscar produtos com estoque baixo
  async findLowStock() {
    try {
      const products = await this.findAll();
      return products.filter(product => product.stock <= product.minStock);
    } catch (error) {
      throw error;
    }
  }

  // Buscar produtos ativos
  async findActive() {
    try {
      return await this.findWhere('isActive', '==', true);
    } catch (error) {
      throw error;
    }
  }

  // Buscar por fornecedor
  async findBySupplier(supplierId) {
    try {
      return await this.findWhere('supplierId', '==', supplierId);
    } catch (error) {
      throw error;
    }
  }

  // Buscar por código de barras
  async findByBarcode(barcode) {
    try {
      const products = await this.findWhere('barcode', '==', barcode);
      return products.length > 0 ? products[0] : null;
    } catch (error) {
      throw error;
    }
  }

  // Buscar produtos com filtros avançados
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
      if (filters.supplierId) {
        query = query.where('supplierId', '==', filters.supplierId);
      }
      if (filters.minPrice !== undefined) {
        query = query.where('price', '>=', parseFloat(filters.minPrice));
      }
      if (filters.maxPrice !== undefined) {
        query = query.where('price', '<=', parseFloat(filters.maxPrice));
      }

      // Ordenar e limitar
      query = query.orderBy('createdAt', 'desc');
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

module.exports = new Product(); 