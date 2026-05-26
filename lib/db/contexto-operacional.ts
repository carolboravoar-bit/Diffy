import { createAdminClient } from "@/lib/supabase/admin";

export async function buscarContextoOperacional(inedita_id: string): Promise<string> {
  const admin = createAdminClient();

  const [clientesResult, lancamentosResult, agendamentosResult, conteudosResult] = await Promise.all([
    // Clientes ativas (limit 8)
    admin
      .from("clientes")
      .select("nome, profissao, sessoes_realizadas, total_sessoes")
      .eq("inedita_id", inedita_id)
      .eq("status", "ativa")
      .order("created_at", { ascending: false })
      .limit(8),

    // Financeiro mês atual
    admin
      .from("lancamentos")
      .select("tipo, valor")
      .eq("inedita_id", inedita_id)
      .gte("data", new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split("T")[0])
      .lt("data", new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString().split("T")[0]),

    // Próximos compromissos 7 dias
    admin
      .from("agendamentos")
      .select("titulo, data, hora")
      .eq("inedita_id", inedita_id)
      .eq("feito", false)
      .gte("data", new Date().toISOString().split("T")[0])
      .lte(
        "data",
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
      )
      .order("data", { ascending: true })
      .order("hora", { ascending: true })
      .limit(10),

    // Conteúdos pendentes
    admin
      .from("conteudos")
      .select("titulo, formato, status")
      .eq("inedita_id", inedita_id)
      .in("status", ["ideia", "rascunho"])
      .limit(5),
  ]);

  const partes: string[] = [];

  // Clientes ativas
  const clientes = clientesResult.data ?? [];
  if (clientes.length > 0) {
    const linhas = clientes.map((c) => {
      const progresso =
        c.total_sessoes && c.total_sessoes > 0
          ? ` (${c.sessoes_realizadas ?? 0}/${c.total_sessoes} sessões)`
          : "";
      const profissao = c.profissao ? ` — ${c.profissao}` : "";
      return `- ${c.nome}${profissao}${progresso}`;
    });
    partes.push(`## Clientes ativas\n\n${linhas.join("\n")}`);
  } else {
    partes.push("## Clientes ativas\n\nSem registros.");
  }

  // Financeiro mês atual
  const lancamentos = lancamentosResult.data ?? [];
  if (lancamentos.length > 0) {
    const totais: Record<string, number> = {};
    for (const l of lancamentos) {
      totais[l.tipo] = (totais[l.tipo] ?? 0) + Number(l.valor);
    }
    const receita = totais["receita"] ?? 0;
    const despesa = totais["despesa"] ?? 0;
    const saldo = receita - despesa;
    partes.push(
      `## Financeiro — mês atual\n\n- Receita: R$ ${receita.toFixed(2)}\n- Despesa: R$ ${despesa.toFixed(2)}\n- Saldo: R$ ${saldo.toFixed(2)}`
    );
  } else {
    partes.push("## Financeiro — mês atual\n\nSem registros.");
  }

  // Próximos compromissos
  const agendamentos = agendamentosResult.data ?? [];
  if (agendamentos.length > 0) {
    const linhas = agendamentos.map((a) => {
      const hora = a.hora ? ` às ${a.hora}` : "";
      return `- ${a.data}${hora}: ${a.titulo}`;
    });
    partes.push(`## Próximos compromissos (7 dias)\n\n${linhas.join("\n")}`);
  } else {
    partes.push("## Próximos compromissos (7 dias)\n\nSem registros.");
  }

  // Conteúdos pendentes
  const conteudos = conteudosResult.data ?? [];
  if (conteudos.length > 0) {
    const linhas = conteudos.map((c) => {
      const formato = c.formato ? ` [${c.formato}]` : "";
      return `- ${c.titulo}${formato} — ${c.status}`;
    });
    partes.push(`## Conteúdos pendentes\n\n${linhas.join("\n")}`);
  } else {
    partes.push("## Conteúdos pendentes\n\nSem registros.");
  }

  return partes.join("\n\n---\n\n");
}
