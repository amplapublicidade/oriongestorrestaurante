#!/usr/bin/env node

/**
 * Script para inicializar contadores de metadados
 * Execute com: node backend/scripts/init-counters.js
 */

require('dotenv').config();
const { initializeCounters } = require('../src/utils/initializeCounters');

async function run() {
  try {
    console.log('🚀 Iniciando script de inicialização de contadores...');
    const counters = await initializeCounters();
    console.log('✅ Script executado com sucesso!');
    console.log('📊 Contadores criados:', counters);
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro na execução do script:', error);
    process.exit(1);
  }
}

run();