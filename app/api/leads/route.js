// Rota de captação de lead das calculadoras.
// Envia um e-mail para os advogados via Resend (https://resend.com).
//
// IMPORTANTE — hospedagem: esta rota é um Route Handler do Next e só roda em
// deploy com servidor (Vercel, Node, etc.). Em deploy 100% estático
// (ex.: GitHub Pages), ela NÃO executa — nesse caso o formulário cai no
// fallback de WhatsApp (ver app/components/LeadForm.jsx).
//
// Configuração necessária (variáveis de ambiente, ex. em .env.local):
//   RESEND_API_KEY   -> chave da API do Resend
//   LEADS_FROM       -> remetente verificado, ex.: "Inventariano <leads@inventariano.com.br>"
// Sem RESEND_API_KEY a rota responde 501 e o front usa o WhatsApp.

export const runtime = "nodejs";

const DESTINATARIOS = [
  "dra.mariaantonia@gmail.com",
  "dr.vanderlei.alves@hotmail.com",
];

function emailValido(e) {
  return typeof e === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}

function escapar(v) {
  return String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export async function POST(request) {
  let dados;
  try {
    dados = await request.json();
  } catch {
    return Response.json({ error: "JSON inválido." }, { status: 400 });
  }

  const nome = (dados?.nome || "").toString().trim();
  const email = (dados?.email || "").toString().trim();
  const telefone = (dados?.telefone || "").toString().trim();
  const origem = (dados?.origem || "Calculadora").toString().trim();
  const resumo = (dados?.resumo || "").toString().trim();

  if (!nome) return Response.json({ error: "Nome obrigatório." }, { status: 400 });
  if (!emailValido(email))
    return Response.json({ error: "E-mail inválido." }, { status: 400 });

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.LEADS_FROM || "Inventariano <onboarding@resend.dev>";

  // Sem chave configurada: não falha silenciosamente — informa o front,
  // que então direciona o usuário para o WhatsApp.
  if (!apiKey) {
    return Response.json(
      { error: "Envio de e-mail não configurado (RESEND_API_KEY ausente)." },
      { status: 501 }
    );
  }

  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;color:#1B2A41;line-height:1.6">
      <h2 style="margin:0 0 4px">Novo lead — ${escapar(origem)}</h2>
      <p style="margin:0 0 16px;color:#5C6B7A">Enviado pelo site inventariano.com.br</p>
      <table style="border-collapse:collapse">
        <tr><td style="padding:4px 12px 4px 0;color:#5C6B7A">Nome</td><td style="padding:4px 0"><strong>${escapar(nome)}</strong></td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#5C6B7A">E-mail</td><td style="padding:4px 0">${escapar(email)}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#5C6B7A">WhatsApp</td><td style="padding:4px 0">${escapar(telefone) || "—"}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#5C6B7A">Origem</td><td style="padding:4px 0">${escapar(origem)}</td></tr>
      </table>
      ${resumo ? `<p style="margin:16px 0 4px;color:#5C6B7A">Resultado da calculadora:</p><p style="margin:0;padding:12px;background:#FAF9F5;border-left:3px solid #A9834B">${escapar(resumo)}</p>` : ""}
    </div>`;

  try {
    const resp = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: DESTINATARIOS,
        reply_to: email,
        subject: `Novo lead — ${origem}`,
        html,
      }),
    });

    if (!resp.ok) {
      const detalhe = await resp.text().catch(() => "");
      return Response.json(
        { error: "Falha no envio do e-mail.", detalhe },
        { status: 502 }
      );
    }

    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Erro ao contatar o serviço de e-mail." }, { status: 502 });
  }
}
