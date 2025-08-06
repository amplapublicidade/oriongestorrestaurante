const { db } = require('../config/firebase');

/**
 * Inicializa os contadores de metadados para otimização de performance
 * Este script deve ser executado uma vez para criar o documento de contadores
 */
async function initializeCounters() {
  try {
    console.log('🔄 Inicializando contadores de metadados...');

    // Contar documentos existentes
    const [productsSnapshot, suppliersSnapshot, ordersSnapshot, movementsSnapshot] = await Promise.all([
      db.collection('products').get(),
      db.collection('suppliers').get(),
      db.collection('orders').get(),
      db.collection('inventoryMovements').get()
    ]);

    const counters = {
      products: productsSnapshot.size,
      suppliers: suppliersSnapshot.size,
      orders: ordersSnapshot.size,
      inventoryMovements: movementsSnapshot.size,
      lastUpdated: new Date()
    };

    // Criar documento de contadores
    await db.collection('metadata').doc('counters').set(counters);

    console.log('✅ Contadores inicializados com sucesso:', counters);
    return counters;
  } catch (error) {
    console.error('❌ Erro ao inicializar contadores:', error);
    throw error;
  }
}

/**
 * Incrementa um contador específico
 */
async function incrementCounter(counterName) {
  try {
    const counterRef = db.collection('metadata').doc('counters');
    await counterRef.update({
      [counterName]: db.FieldValue.increment(1),
      lastUpdated: new Date()
    });
  } catch (error) {
    console.error(`Erro ao incrementar contador ${counterName}:`, error);
  }
}

/**
 * Decrementa um contador específico
 */
async function decrementCounter(counterName) {
  try {
    const counterRef = db.collection('metadata').doc('counters');
    await counterRef.update({
      [counterName]: db.FieldValue.increment(-1),
      lastUpdated: new Date()
    });
  } catch (error) {
    console.error(`Erro ao decrementar contador ${counterName}:`, error);
  }
}

module.exports = {
  initializeCounters,
  incrementCounter,
  decrementCounter
};