import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Não autenticada" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const tipo = searchParams.get("tipo");
    const month = searchParams.get("month"); // formato: "2026-05"

    let query = supabase
      .from("lancamentos")
      .select("*")
      .eq("inedita_id", user.id)
      .order("data", { ascending: false })
      .order("created_at", { ascending: false });

    if (tipo && (tipo === "receita" || tipo === "despesa")) {
      query = query.eq("tipo", tipo);
    }

    if (month) {
      const [year, mon] = month.split("-");
      const start = `${year}-${mon}-01`;
      const endDate = new Date(Number(year), Number(mon), 0);
      const end = `${year}-${mon}-${String(endDate.getDate()).padStart(2, "0")}`;
      query = query.gte("data", start).lte("data", end);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Erro ao buscar lançamentos:", error);
      return NextResponse.json({ error: "Erro ao buscar lançamentos" }, { status: 500 });
    }

    return NextResponse.json({ lancamentos: data ?? [] });
  } catch (error) {
    console.error("Erro na rota GET /api/lancamentos:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Não autenticada" }, { status: 401 });
    }

    const body = await request.json();
    const { tipo, descricao, valor, data, categoria, cliente_id } = body;

    if (!tipo || !descricao || !valor || !data) {
      return NextResponse.json({ error: "Campos obrigatórios: tipo, descricao, valor, data" }, { status: 400 });
    }

    if (tipo !== "receita" && tipo !== "despesa") {
      return NextResponse.json({ error: "tipo deve ser receita ou despesa" }, { status: 400 });
    }

    const { data: lancamento, error } = await supabase
      .from("lancamentos")
      .insert({
        inedita_id: user.id,
        tipo,
        descricao: descricao.trim(),
        valor: Number(valor),
        data,
        categoria: categoria?.trim() ?? null,
        cliente_id: cliente_id ?? null,
      })
      .select()
      .single();

    if (error) {
      console.error("Erro ao criar lançamento:", error);
      return NextResponse.json({ error: "Erro ao criar lançamento" }, { status: 500 });
    }

    return NextResponse.json({ lancamento }, { status: 201 });
  } catch (error) {
    console.error("Erro na rota POST /api/lancamentos:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
