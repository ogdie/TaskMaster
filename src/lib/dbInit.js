/**
 * Database Initialization Script
 * Executa índices e otimizações na primeira conexão
 * 
 * Adicionar em: src/app/layout.js ou src/app/api/health/route.js
 * Será executado UMA VEZ quando o servidor inicia
 */

import connectToDB from "@/lib/mongodb";
import { createIndexes } from "@/lib/dbOptimization";

let indexesCreated = false;

/**
 * Função para inicializar banco de dados
 * Deve ser chamada na primeira requisição após servidor ligar
 */
export async function initializeDatabase() {
  if (indexesCreated) return; // Evitar re-executar

  try {
    console.log("🚀 Inicializando banco de dados...");
    
    // Conectar ao MongoDB
    await connectToDB();
    console.log("✅ Conectado ao MongoDB");

    // Criar índices
    await createIndexes();
    console.log("✅ Índices criados");

    indexesCreated = true;
    console.log("✨ Banco de dados inicializado com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao inicializar banco de dados:", error);
    // Não jogar erro, permitir que app continue rodando
  }
}

/**
 * Health check endpoint
 * GET /api/health retorna status do banco de dados
 */
export async function checkDatabaseHealth() {
  try {
    const db = await connectToDB();

    // Teste simples: listar collections
    const collections = await db.connection.db.listCollections().toArray();
    const stats = await db.connection.db.stats();

    return {
      status: "healthy",
      timestamp: new Date().toISOString(),
      database: {
        name: stats.db,
        collections: collections.length,
        sizeOnDisk: stats.dataSize,
        indexes: stats.indexes
      }
    };
  } catch (error) {
    return {
      status: "unhealthy",
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}
