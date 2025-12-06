/**
 * API Tasks Otimizada
 * GET /api/tasks/optimized - Com filtros, busca, paginação e stats
 * 
 * Query Parameters:
 * - status: "pending" | "completed"
 * - category: "Trabalho" | "Pessoal" | "Compras" | "Saúde" | "Outros"
 * - search: termo de busca
 * - page: número da página (padrão: 1)
 * - limit: itens por página (padrão: 10, máx: 100)
 * - sort: "createdAt" | "title" | "completed" (padrão: "createdAt")
 * - order: 1 (asc) | -1 (desc) (padrão: -1)
 * - stats: true/false - incluir estatísticas
 */

import connectToDB from "@/lib/mongodb";
import { getTasksWithFilters, getTasksStats } from "@/lib/dbOptimization";
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

    // Extrair query parameters
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const page = Math.max(1, parseInt(searchParams.get("page")) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit")) || 10));
    const sort = searchParams.get("sort") || "createdAt";
    const order = parseInt(searchParams.get("order")) || -1;
    const includeStats = searchParams.get("stats") === "true";

    // Validar sort
    const validSorts = ["createdAt", "title", "completed"];
    const sortBy = validSorts.includes(sort) ? sort : "createdAt";

    // Buscar tarefas com filtros usando aggregation pipeline
    const tasksData = await getTasksWithFilters(session.user.id, {
      status,
      category,
      search,
      page,
      limit,
      sortBy,
      sortOrder: order
    });

    // Incluir estatísticas se solicitado
    let stats = null;
    if (includeStats) {
      stats = await getTasksStats(session.user.id);
    }

    const response = {
      data: tasksData.data || [],
      pagination: {
        page: tasksData.page || page,
        limit: tasksData.limit || limit,
        total: tasksData.total || 0,
        totalPages: tasksData.totalPages || 0,
        hasNextPage: page < (tasksData.totalPages || 1),
        hasPrevPage: page > 1
      },
      filters: {
        status: status || "all",
        category: category || "all",
        search: search || null
      },
      ...(stats && { stats })
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("❌ Erro ao buscar tarefas:", error);
    return new Response(
      JSON.stringify({ error: "Erro ao buscar tarefas" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
