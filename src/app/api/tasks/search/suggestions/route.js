/**
 * API Search Suggestions Endpoint
 * GET /api/tasks/search/suggestions?q=termo&limit=5
 * 
 * Retorna sugestões de:
 * - Títulos (títulos de tarefas similares)
 * - Categorias (categorias existentes)
 * - Tags (tags mais usadas)
 * 
 * Uso: Autocomplete em barra de busca
 */

import connectToDB from "@/lib/mongodb";
import { searchTasksSuggestions } from "@/lib/dbOptimization";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/options";

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(
      JSON.stringify({ error: "Não autenticado" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    await connectToDB();

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";
    const limit = Math.min(10, Math.max(1, parseInt(searchParams.get("limit")) || 5));

    // Se query vazio, retornar vazio
    if (!query || query.length < 2) {
      return new Response(
        JSON.stringify({ titles: [], categories: [], tags: [] }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    // Buscar sugestões
    const suggestions = await searchTasksSuggestions(
      session.user.id,
      query,
      limit
    );

    return new Response(JSON.stringify(suggestions), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("❌ Erro ao buscar sugestões:", error);
    return new Response(
      JSON.stringify({ error: "Erro ao buscar sugestões" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
