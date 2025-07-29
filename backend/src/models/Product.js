const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Nome do produto é obrigatório'],
    trim: true,
    maxlength: [100, 'Nome não pode ter mais de 100 caracteres']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Descrição não pode ter mais de 500 caracteres']
  },
  category: {
    type: String,
    required: [true, 'Categoria é obrigatória'],
    enum: ['carnes', 'vegetais', 'frutas', 'graos', 'laticinios', 'bebidas', 'temperos', 'outros']
  },
  unit: {
    type: String,
    required: [true, 'Unidade é obrigatória'],
    enum: ['kg', 'g', 'L', 'ml', 'unidade', 'caixa', 'pacote']
  },
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier',
    required: [true, 'Fornecedor é obrigatório']
  },
  price: {
    type: Number,
    required: [true, 'Preço é obrigatório'],
    min: [0, 'Preço não pode ser negativo']
  },
  cost: {
    type: Number,
    min: [0, 'Custo não pode ser negativo']
  },
  minStock: {
    type: Number,
    default: 0,
    min: [0, 'Estoque mínimo não pode ser negativo']
  },
  maxStock: {
    type: Number,
    min: [0, 'Estoque máximo não pode ser negativo']
  },
  currentStock: {
    type: Number,
    default: 0,
    min: [0, 'Estoque atual não pode ser negativo']
  },
  barcode: {
    type: String,
    unique: true,
    sparse: true
  },
  sku: {
    type: String,
    unique: true,
    sparse: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  nutritionalInfo: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number,
    fiber: Number
  },
  allergens: [{
    type: String,
    enum: ['gluten', 'lactose', 'nuts', 'shellfish', 'eggs', 'soy']
  }],
  storageConditions: {
    temperature: {
      min: Number,
      max: Number
    },
    humidity: {
      min: Number,
      max: Number
    },
    location: String
  },
  expirationDays: {
    type: Number,
    min: [1, 'Dias para expiração deve ser pelo menos 1']
  }
}, {
  timestamps: true
});

// Indexes
productSchema.index({ name: 1 });
productSchema.index({ category: 1 });
productSchema.index({ supplier: 1 });
productSchema.index({ isActive: 1 });
productSchema.index({ currentStock: 1 });

// Virtual para status do estoque
productSchema.virtual('stockStatus').get(function() {
  if (this.currentStock <= this.minStock) return 'low';
  if (this.currentStock >= this.maxStock) return 'high';
  return 'normal';
});

// Método para adicionar estoque
productSchema.methods.addStock = function(quantity, reason = 'manual') {
  this.currentStock += quantity;
  return this.save();
};

// Método para remover estoque
productSchema.methods.removeStock = function(quantity, reason = 'manual') {
  if (this.currentStock < quantity) {
    throw new Error('Estoque insuficiente');
  }
  this.currentStock -= quantity;
  return this.save();
};

// Middleware para popular supplier automaticamente
productSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'supplier',
    select: 'name contact.phone contact.email'
  });
  next();
});

module.exports = mongoose.model('Product', productSchema); 