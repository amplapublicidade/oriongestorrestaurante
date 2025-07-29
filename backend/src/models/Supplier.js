const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Nome do fornecedor é obrigatório'],
    trim: true,
    maxlength: [100, 'Nome não pode ter mais de 100 caracteres']
  },
  companyName: {
    type: String,
    trim: true,
    maxlength: [150, 'Razão social não pode ter mais de 150 caracteres']
  },
  cnpj: {
    type: String,
    unique: true,
    sparse: true,
    match: [/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, 'CNPJ inválido']
  },
  cpf: {
    type: String,
    unique: true,
    sparse: true,
    match: [/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF inválido']
  },
  contact: {
    phone: {
      type: String,
      required: [true, 'Telefone é obrigatório'],
      match: [/^\(\d{2}\)\s\d{4,5}-\d{4}$/, 'Telefone inválido']
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'E-mail inválido']
    },
    website: {
      type: String,
      trim: true
    },
    whatsapp: {
      type: String,
      match: [/^\(\d{2}\)\s\d{4,5}-\d{4}$/, 'WhatsApp inválido']
    }
  },
  address: {
    street: {
      type: String,
      required: [true, 'Endereço é obrigatório'],
      trim: true
    },
    number: {
      type: String,
      required: [true, 'Número é obrigatório'],
      trim: true
    },
    complement: {
      type: String,
      trim: true
    },
    neighborhood: {
      type: String,
      required: [true, 'Bairro é obrigatório'],
      trim: true
    },
    city: {
      type: String,
      required: [true, 'Cidade é obrigatória'],
      trim: true
    },
    state: {
      type: String,
      required: [true, 'Estado é obrigatório'],
      trim: true,
      maxlength: [2, 'Estado deve ter 2 caracteres']
    },
    zipCode: {
      type: String,
      required: [true, 'CEP é obrigatório'],
      match: [/^\d{5}-\d{3}$/, 'CEP inválido']
    }
  },
  categories: [{
    type: String,
    enum: ['carnes', 'vegetais', 'frutas', 'graos', 'laticinios', 'bebidas', 'temperos', 'outros']
  }],
  paymentTerms: {
    type: String,
    enum: ['à vista', '7 dias', '15 dias', '30 dias', '60 dias', '90 dias'],
    default: 'à vista'
  },
  deliveryDays: [{
    type: String,
    enum: ['segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado', 'domingo']
  }],
  minOrderValue: {
    type: Number,
    default: 0,
    min: [0, 'Valor mínimo não pode ser negativo']
  },
  deliveryRadius: {
    type: Number,
    default: 0,
    min: [0, 'Raio de entrega não pode ser negativo']
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: [0, 'Avaliação não pode ser negativa'],
      max: [5, 'Avaliação máxima é 5']
    },
    count: {
      type: Number,
      default: 0
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  notes: {
    type: String,
    maxlength: [1000, 'Observações não podem ter mais de 1000 caracteres']
  },
  lastOrderDate: {
    type: Date
  },
  totalOrders: {
    type: Number,
    default: 0
  },
  totalSpent: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes
supplierSchema.index({ name: 1 });
supplierSchema.index({ categories: 1 });
supplierSchema.index({ isActive: 1 });
supplierSchema.index({ 'address.city': 1 });
supplierSchema.index({ 'address.state': 1 });

// Virtual para endereço completo
supplierSchema.virtual('fullAddress').get(function() {
  const addr = this.address;
  return `${addr.street}, ${addr.number}${addr.complement ? ` - ${addr.complement}` : ''}, ${addr.neighborhood}, ${addr.city}/${addr.state} - ${addr.zipCode}`;
});

// Virtual para tipo de documento
supplierSchema.virtual('documentType').get(function() {
  return this.cnpj ? 'CNPJ' : (this.cpf ? 'CPF' : 'Não informado');
});

// Método para adicionar avaliação
supplierSchema.methods.addRating = function(newRating) {
  const currentTotal = this.rating.average * this.rating.count;
  this.rating.count += 1;
  this.rating.average = (currentTotal + newRating) / this.rating.count;
  return this.save();
};

// Método para atualizar estatísticas de pedido
supplierSchema.methods.updateOrderStats = function(orderValue) {
  this.totalOrders += 1;
  this.totalSpent += orderValue;
  this.lastOrderDate = new Date();
  return this.save();
};

// Método estático para buscar por categoria
supplierSchema.statics.findByCategory = function(category) {
  return this.find({ 
    categories: category,
    isActive: true 
  });
};

module.exports = mongoose.model('Supplier', supplierSchema); 