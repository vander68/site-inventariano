"use client";
import { useState } from "react";

// Paleta do sistema de calculadoras (igual às páginas de calculadora).
const NAVY = "#1B2A41";
const NAVY_SOFT = "#2A3D57";
const PAPER = "#FAF9F5";
const BRASS = "#A9834B";

// WhatsApp do escritório (fallback que funciona em qualquer hospedagem).
const WA_VANDERLEI = "5511993233066";

function emailValido(e) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}

/**
 * Bloco de captação de lead das calculadoras.
 *
 * Envia o lead para /api/leads (rota Resend) e oferece um botão de WhatsApp
 * como alternativa — o WhatsApp funciona mesmo em deploy estático.
 *
 * Props:
 *  - origem: string  (qual calculadora gerou o lead)
 *  - resumo: string  (resultado calculado, vai junto no e-mail e no WhatsApp)
 */
export default function LeadForm({ origem, resumo }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [consentimento, setConsentimento] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [erro, setErro] = useState("");

  const textoWhats = encodeURIComponent(
    `Olá! Usei a ${origem} no site e gostaria de falar com um advogado.` +
      (resumo ? `\n\nResultado: ${resumo}` : "") +
      (nome ? `\n\nMeu nome: ${nome}` : "")
  );
  const waHref = `https://wa.me/${WA_VANDERLEI}?text=${textoWhats}`;

  async function enviar(e) {
    e.preventDefault();
    setErro("");
    if (!nome.trim()) return setErro("Informe seu nome.");
    if (!emailValido(email)) return setErro("Informe um e-mail válido.");
    if (!consentimento) return setErro("É preciso autorizar o contato para enviar.");

    setStatus("loading");
    try {
      const resp = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: nome.trim(),
          email: email.trim(),
          telefone: telefone.trim(),
          origem,
          resumo,
          criadoEm: new Date().toISOString(),
        }),
      });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      setStatus("success");
    } catch {
      setStatus("error");
      setErro(
        "Não foi possível enviar por aqui agora. Fale com a gente pelo WhatsApp abaixo."
      );
    }
  }

  const inputStyle = {
    border: `0.5px solid ${NAVY_SOFT}`,
    borderRadius: "4px",
    background: "#fff",
    color: NAVY,
  };

  return (
    <div className="p-8" style={{ background: NAVY, borderRadius: "4px" }}>
      {status === "success" ? (
        <div className="text-center py-4">
          <p className="font-serif text-xl mb-2" style={{ color: PAPER }}>
            Contato enviado!
          </p>
          <p className="font-sans text-sm" style={{ color: "#B9C2CE" }}>
            Um advogado do Inventariano falará com você em breve. Obrigado.
          </p>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <p className="font-serif text-xl mb-1" style={{ color: PAPER }}>
              Quer confirmar esses números com um advogado?
            </p>
            <p className="font-sans text-sm" style={{ color: "#B9C2CE" }}>
              Conte brevemente sua situação e um especialista do Inventariano entra em contato.
            </p>
          </div>

          <form onSubmit={enviar} noValidate className="flex flex-col gap-3">
            <div className="grid sm:grid-cols-2 gap-3">
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Seu nome"
                autoComplete="name"
                className="w-full px-3 py-2 font-sans text-sm"
                style={inputStyle}
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Seu e-mail"
                autoComplete="email"
                className="w-full px-3 py-2 font-sans text-sm"
                style={inputStyle}
              />
            </div>
            <input
              type="tel"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              placeholder="WhatsApp (opcional)"
              autoComplete="tel"
              className="w-full px-3 py-2 font-sans text-sm"
              style={inputStyle}
            />

            <label
              className="flex items-start gap-2 font-sans text-xs cursor-pointer"
              style={{ color: "#B9C2CE" }}
            >
              <input
                type="checkbox"
                checked={consentimento}
                onChange={(e) => setConsentimento(e.target.checked)}
                className="mt-0.5"
              />
              <span>
                Autorizo o contato e o tratamento dos meus dados conforme a LGPD.
              </span>
            </label>

            {erro ? (
              <p
                className="font-sans text-xs px-3 py-2"
                style={{ background: NAVY_SOFT, color: "#F2D6C9", borderRadius: "4px" }}
              >
                {erro}
              </p>
            ) : null}

            <div className="flex flex-col sm:flex-row gap-3 mt-1">
              <button
                type="submit"
                disabled={status === "loading"}
                className="font-sans text-sm px-5 py-3 whitespace-nowrap"
                style={{
                  background: BRASS,
                  color: NAVY,
                  borderRadius: "4px",
                  border: "none",
                  opacity: status === "loading" ? 0.7 : 1,
                  cursor: status === "loading" ? "default" : "pointer",
                }}
              >
                {status === "loading" ? "Enviando..." : "Falar com um advogado"}
              </button>
              <a
                href={waHref}
                target="_blank"
                rel="noreferrer"
                className="font-sans text-sm px-5 py-3 whitespace-nowrap text-center"
                style={{
                  border: `0.5px solid ${BRASS}`,
                  color: BRASS,
                  borderRadius: "4px",
                }}
              >
                💬 Chamar no WhatsApp
              </a>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
