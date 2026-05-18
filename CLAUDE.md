@AGENTS.md

# Diffy — Instruções para o Claude Code

## Quem é Carol
Carol Possani é a fundadora da Diffy. Empreendedora, não desenvolvedora. Tem visão clara de produto e marca, mas não domina código. Prefere respostas diretas, sem jargão técnico. Confia no Claude para decisões técnicas e de UX.

## O que é a Diffy
SaaS de R$88/mês para empreendedoras solo ("Inéditas") — coaches, consultoras, mentoras. Uma copilota estratégica que vive no WhatsApp e tem painel web. A personagem se chama Diffy. O processo de entrada se chama Decolagem (nunca "onboarding").

## Onde fica o projeto
`/Users/mac/Documents/Claude/Projects/Carol Possani/diffy/`
Dev server: porta 3001 (porta 3000 = Bitt.Agro, outro projeto da Carol)
Briefing completo: `../Diffy - DOCUMENTO MASTER para Claude Code.md`

## Stack
- Next.js 16, App Router, TypeScript
- Tailwind CSS v4 — config via `@theme inline` em `app/globals.css` (sem tailwind.config.ts)
- Supabase (configurado, não conectado — tudo é mock ainda)
- Claude API: modelo `claude-sonnet-4-6`, rota `/api/diffy/chat`
- Recharts (gráficos), Lucide-react (ícones), Framer Motion (instalado)
- Auth desativada no middleware — reativar antes do deploy

## Design system
**Cores:**
- Fúcsia principal: `#D81B60`
- Verde sucesso: `#2E7D32` / fundo `#E8F5E9`
- Amarelo alerta: `#F9A825` / fundo `#FFF8E1`
- Azul info: `#1565C0` / fundo `#E3F2FD`
- Vermelho urgente: `#C62828` / fundo `#FFEBEE`
- Texto principal: `#2C2C2C`
- Texto secundário: `#9E9E9E`
- Bordas: `#EFEFEF`
- Fundo plataforma: `#F7F7F5`
- Rosa claro (fundo fúcsia): `#FCE4EC`

**Fontes (via CSS variables):**
- `var(--font-playfair)` — títulos, números grandes
- `var(--font-inter)` — corpo, labels, botões
- `var(--font-caveat)` — escrita à mão (uso pontual)

**Padrões de UI:**
- Bordas arredondadas: `rounded-xl` (cards menores) ou `rounded-2xl` (cards principais)
- Botão primário: background `#D81B60`, texto branco, `rounded-xl`
- Tabs ativas: `border-b-2` com `borderColor: #D81B60`
- Status badges: sempre com fundo colorido suave + texto colorido forte, `rounded-full`
- Sempre usar `style={{ fontFamily: "var(--font-inter)" }}` — não classes Tailwind para fontes

## Estrutura de rotas
```
app/
  page.tsx                    — landing page (9 seções)
  (auth)/login                — login
  (auth)/cadastro             — cadastro
  (plataforma)/
    layout.tsx                — Sidebar + CapturaRapida
    conversar/                — chat com Diffy (primeira na nav)
    painel/                   — dashboard
    clientes/                 — lista + pipeline kanban
    clientes/[id]/            — prontuário individual
    marketing/                — calendário + banco de ideias + ideias Diffy
    agenda/                   — compromissos + mini calendário
    contratos/                — lista + modelos
    financeiro/               — lançamentos + relatório
    raiox/                    — upload e extração de contexto
    decolagem/                — onboarding permanente + FAQ
    configuracoes/            — perfil + integrações
  components/
    RocketIcon.tsx            — foguete SVG animável
    plataforma/Sidebar.tsx    — navegação lateral
    plataforma/CapturaRapida.tsx — botão flutuante de captura
    plataforma/Celebracao.tsx — animação confetti + foguete
  api/diffy/chat/route.ts     — endpoint Claude API
```

## O que está pronto vs pendente

### ✅ Pronto (dados mock)
Todas as páginas da plataforma estão construídas com dados mock.

### ⏳ Próximos passos técnicos
1. Conectar Supabase — tabelas: ineditas, clientes, sessoes, pagamentos, notas, conteudos
2. Reativar auth + proteger rotas + cadastro vinculado a pagamento
3. API Diffy com memória 3 camadas: Method + RaioX + Operacional
4. WhatsApp via Twilio — webhook → Claude → resposta
5. Integração pagamento (Stripe ou Abacatepay) R$88/mês
6. ZapSign para contratos
7. RaioX real: upload PDF → extração com Claude → salvar Supabase

## Linguagem da Diffy (para qualquer texto no produto)
- Direta, calorosa, sem enrolação
- Sem "como uma IA" ou "não posso garantir"
- Frases curtas. Vai direto ao ponto.
- Fala "você", nunca "vocês" — sempre singular, íntima
- Usa o universo: Decolagem, Inéditas, RaioX, voo, foguete
- Nunca usa travessão (—) em texto da Diffy
- Nunca começa com "Olá" ou "Oi Carol!" de forma genérica
