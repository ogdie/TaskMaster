/**
 * API Health Check Endpoint
 * GET /api/health - Verifica saúde do banco de dados e iniciação de índices
 * 
 * Uso:
 * - Monitoramento: Chamar periodicamente para verificar saúde
 * - Inicialização: Primeira requisição cria os índices automaticamente
 */

import { checkDatabaseHealth, initializeDatabase } from "@/lib/dbInit";

export async function GET() {
  try {
    // Verificar se MONGODB_URI está definido antes de tentar conectar
    if (!process.env.MONGODB_URI) {
      return new Response(
        JSON.stringify({
          status: "error",
          error: "MONGODB_URI não está definida nas variáveis de ambiente",
          timestamp: new Date().toISOString()
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    // Na primeira requisição, inicializar índices
    await initializeDatabase();

    // Verificar saúde do banco
    const health = await checkDatabaseHealth();

    return new Response(JSON.stringify(health), {
      status: health.status === "healthy" ? 200 : 503,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("❌ Erro no health check:", error);
    return new Response(
      JSON.stringify({
        status: "error",
        error: error.message,
        timestamp: new Date().toISOString(),
        hint: "Verifique se todas as variáveis de ambiente estão configuradas no painel da Vercel"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}
