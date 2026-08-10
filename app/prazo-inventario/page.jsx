"use client";
import { useState, useMemo } from "react";

const NAVY = "#1B2A41";
const NAVY_SOFT = "#2A3D57";
const PAPER = "#FAF9F5";
const PAPER_LINE = "#DDD8CC";
const BRASS = "#A9834B";
const INK_SECOND = "#5C6B7A";
const RED = "#B3543F";

function formatDate(d) {
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
}

function calcularPrazo(dataObito) {
  if (!dataObito) return null;
  const obito = new Date(dataObito + "T00:00:00");
  if (isNaN(obito.getTime())) return null;

  const prazoLimite = new Date(obito);
  prazoLimite.setDate(prazoLimite.getDate() + 60);

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const diasDesdeObito = Math.floor((hoje - obito) / (1000 * 60 * 60 * 24));
  const diasParaPrazo = Math.floor((prazoLimite - hoje) / (1000 * 60 * 60 * 24));
  const atrasado = hoje > prazoLimite;
  const mesesAtraso = atrasado ? Math.ceil((hoje - prazoLimite) / (1000 * 60 * 60 * 24 * 30)) : 0;

  return { obito, prazoLimite, diasDesdeObito, diasParaPrazo, atrasado, mesesAtraso };
}

export default function CalculadoraPrazoInventario() {
  const [dataObito, setDataObito] = useState("");

  const resultado = useMemo(() => calcularPrazo(dataObito), [dataObito]);

  return (
    <div style={{ background: PAPER, minHeight: "100%" }} className="w-full">
      <div className="max-w-3xl mx-auto px-6 py-14">
        <p
          className="text-xs font-sans tracking-widest uppercase mb-3"
          style={{ color: BRASS, letterSpacing: "0.15em" }}
        >
          Inventariando · Calculadora
        </p>

        <h1 className="font-serif text-4xl mb-3 leading-tight" style={{ color: NAVY }}>
          Calculadora de prazo do inventário
        </h1>
        <p className="font-sans text-base mb-10 max-w-xl" style={{ color: INK_SECOND }}>
          Veja o prazo legal para abrir o inventário a partir da data do
          óbito, e se esse prazo já passou.
        </p>

        <div
          className="grid md:grid-cols-2 gap-0 mb-4"
          style={{ border: `0.5px solid ${PAPER_LINE}`, borderRadius: "4px" }}
        >
          <div className="p-6 md:border-r" style={{ borderColor: PAPER_LINE }}>
            <label
              className="block font-sans text-xs uppercase tracking-wide mb-2"
              style={{ color: INK_SECOND }}
            >
              Data do óbito
            </label>
            <input
              type="date"
              value={dataObito}
              onChange={(e) => setDataObito(e.target.value)}
              className="w-full mb-5 px-3 py-2 font-sans text-lg"
              style={{
                border: `0.5px solid ${PAPER_LINE}`,
                borderRadius: "4px",
                color: NAVY,
                background: "#fff",
              }}
            />
            <p className="font-sans text-xs" style={{ color: INK_SECOND }}>
              O prazo legal para abertura do inventário é de 60 dias a
              partir do óbito (art. 611 do Código de Processo Civil).
            </p>
          </div>

          <div
            className="p-6 relative flex flex-col justify-center"
            style={{ background: NAVY, color: PAPER, borderRadius: "0 4px 4px 0" }}
          >
            <div
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                border: `1px dashed ${BRASS}`,
                borderRadius: "50%",
                width: "72px",
                height: "72px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transform: "rotate(-9deg)",
                textAlign: "center",
                padding: "4px",
              }}
            >
              <span
                className="font-sans"
                style={{ color: BRASS, fontSize: "8px", letterSpacing: "0.08em", lineHeight: 1.3 }}
              >
                ESTIMATIVA EDUCATIVA
              </span>
            </div>

            {!resultado && (
              <p className="font-sans text-sm" style={{ color: "#B9C2CE" }}>
                Informe a data do óbito para ver o prazo.
              </p>
            )}

            {resultado && (
              <div>
                <p
                  className="font-sans text-xs uppercase tracking-wide mb-1"
                  style={{ color: "#8FA0B3" }}
                >
                  Prazo limite para abrir o inventário
                </p>
                <p className="font-serif text-2xl mb-4" style={{ color: PAPER }}>
                  {formatDate(resultado.prazoLimite)}
                </p>

                {resultado.atrasado ? (
                  <div className="pt-4" style={{ borderTop: `0.5px solid ${NAVY_SOFT}` }}>
                    <p className="font-sans text-sm font-medium mb-1" style={{ color: "#E8A48D" }}>
                      Prazo já ultrapassado
                    </p>
                    <p className="font-sans text-xs" style={{ color: "#DDE3E9" }}>
                      Já se passaram {resultado.diasDesdeObito} dias desde o
                      óbito — cerca de {resultado.mesesAtraso}{" "}
                      {resultado.mesesAtraso === 1 ? "mês" : "meses"} além do
                      prazo legal. Isso geralmente gera multa sobre o ITCMD,
                      cujo percentual varia por estado.
                    </p>
                  </div>
                ) : (
                  <div className="pt-4" style={{ borderTop: `0.5px solid ${NAVY_SOFT}` }}>
                    <p className="font-sans text-sm font-medium mb-1" style={{ color: "#8FD9B5" }}>
                      Dentro do prazo
                    </p>
                    <p className="font-sans text-xs" style={{ color: "#DDE3E9" }}>
                      Faltam {resultado.diasParaPrazo}{" "}
                      {resultado.diasParaPrazo === 1 ? "dia" : "dias"} para o
                      prazo legal se encerrar.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <p className="font-sans text-xs mb-16" style={{ color: INK_SECOND }}>
          Simulação educativa. O prazo de 60 dias é o previsto no CPC; alguns
          estados podem ter regras próprias de multa por atraso no ITCMD
          (geralmente entre 10% e 20% do imposto, dependendo do tempo de
          atraso). Consulte um advogado para confirmar prazos e eventuais
          suspensões aplicáveis ao seu caso.
        </p>

        <div className="mb-16">
          <h2 className="font-serif text-2xl mb-4" style={{ color: NAVY }}>
            Por que o prazo importa
          </h2>
          <div className="font-sans text-sm leading-relaxed space-y-3" style={{ color: "#3A4552" }}>
            <p>
              O Código de Processo Civil prevê 60 dias, contados do óbito,
              para dar início ao processo de inventário — seja extrajudicial
              (em cartório) ou judicial. O objetivo é evitar que o
              patrimônio fique indefinido por muito tempo, o que pode
              complicar o pagamento de contas, a administração de bens e o
              acesso dos herdeiros ao que lhes cabe.
            </p>
            <p>
              Perder esse prazo não impede o inventário de ser aberto depois
              — mas costuma gerar multa sobre o ITCMD, cujo percentual e
              forma de cálculo variam por estado. Em alguns casos, atrasos
              muito longos também podem gerar juros adicionais sobre o
              imposto devido.
            </p>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="font-serif text-2xl mb-4" style={{ color: NAVY }}>
            Perguntas frequentes
          </h2>
          <div style={{ borderTop: `0.5px solid ${PAPER_LINE}` }}>
            {[
              {
                q: "O prazo pode ser prorrogado?",
                a: "Em alguns casos sim, mediante pedido justificado ao juiz (no inventário judicial) — mas isso não é automático e depende de análise caso a caso.",
              },
              {
                q: "Existe diferença de prazo entre inventário judicial e extrajudicial?",
                a: "O prazo de 60 dias para abertura é o mesmo — a diferença está na forma como o processo corre depois de aberto, não no prazo inicial.",
              },
              {
                q: "O que conta como 'abrir' o inventário dentro do prazo?",
                a: "Geralmente é o protocolo do pedido em cartório (extrajudicial) ou a distribuição da petição inicial (judicial) — não é preciso concluir o processo inteiro dentro dos 60 dias, só iniciá-lo.",
              },
            ].map((item, i) => (
              <div key={i} className="py-4" style={{ borderBottom: `0.5px solid ${PAPER_LINE}` }}>
                <p className="font-sans text-sm font-medium mb-1" style={{ color: NAVY }}>
                  {item.q}
                </p>
                <p className="font-sans text-sm" style={{ color: INK_SECOND }}>
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-16">
          <h2 className="font-serif text-2xl mb-4" style={{ color: NAVY }}>
            Ferramentas relacionadas
          </h2>
          <div className="flex flex-wrap gap-2 font-sans text-sm">
            {["Calculadora de ITCMD", "Custos de inventário", "Calculadora de herança", "Calculadora de partilha"].map(
              (label, i) => (
                <span
                  key={i}
                  className="px-3 py-2"
                  style={{ border: `0.5px solid ${PAPER_LINE}`, borderRadius: "4px", color: NAVY }}
                >
                  {label}
                </span>
              )
            )}
          </div>
        </div>

        <div
          className="p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          style={{ background: NAVY, borderRadius: "4px" }}
        >
          <div>
            <p className="font-serif text-xl mb-1" style={{ color: PAPER }}>
              Está no prazo ou já atrasou?
            </p>
            <p className="font-sans text-sm" style={{ color: "#B9C2CE" }}>
              Fale com um advogado para agir rápido e evitar multa desnecessária.
            </p>
          </div>
          <button
            className="font-sans text-sm px-5 py-3 whitespace-nowrap"
            style={{ background: BRASS, color: NAVY, borderRadius: "4px", border: "none" }}
          >
            Falar com um advogado
          </button>
        </div>
      </div>
    </div>
  );
}
