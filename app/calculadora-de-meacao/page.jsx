"use client";
import { useState, useMemo } from "react";

const NAVY = "#1B2A41";
const NAVY_SOFT = "#2A3D57";
const PAPER = "#FAF9F5";
const PAPER_LINE = "#DDD8CC";
const BRASS = "#A9834B";
const INK_SECOND = "#5C6B7A";

function formatBRL(v) {
  if (!isFinite(v)) return "R$ 0,00";
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// Regras simplificadas de meacao por regime de bens - considera so o
// patrimonio adquirido na constancia do casamento como "comum" nos regimes
// que dividem por regra geral; nao trata excecoes especificas (doacao com
// clausula de incomunicabilidade, sub-rogacao de bens particulares, etc.)
function calcularMeacao({ regime, bensComuns, bensParticularesFalecido, bensParticularesConjuge }) {
  const comuns = Math.max(0, bensComuns || 0);
  const particularesFalecido = Math.max(0, bensParticularesFalecido || 0);
  const particularesConjuge = Math.max(0, bensParticularesConjuge || 0);

  if (regime === "comunhao_universal") {
    // Tudo se comunica, inclusive bens particulares anteriores ao casamento
    const totalComunicavel = comuns + particularesFalecido + particularesConjuge;
    return {
      meacaoConjuge: totalComunicavel / 2,
      massaHereditaria: totalComunicavel / 2,
      explicacao:
        "Na comunhão universal, todo o patrimônio do casal se comunica, inclusive bens anteriores ao casamento — a meação do cônjuge é metade de tudo.",
    };
  }

  if (regime === "separacao_total" || regime === "separacao_obrigatoria") {
    // Nao ha comunicacao - cada um so tem o que e seu (bens particulares)
    return {
      meacaoConjuge: 0,
      massaHereditaria: particularesFalecido,
      explicacao:
        "Na separação de bens, não há meação — cada cônjuge é dono exclusivo do que está em seu nome. Só os bens do falecido entram na herança.",
    };
  }

  // comunhao_parcial (regra geral desde 1977) ou participacao_final
  return {
    meacaoConjuge: comuns / 2,
    massaHereditaria: comuns / 2 + particularesFalecido,
    explicacao:
      "Na comunhão parcial, só os bens adquiridos durante o casamento se comunicam — bens particulares de antes do casamento ou recebidos por herança/doação continuam exclusivos de cada um.",
  };
}

export default function CalculadoraMeacao() {
  const [regime, setRegime] = useState("comunhao_parcial");
  const [bensComuns, setBensComuns] = useState("400000");
  const [bensParticularesFalecido, setBensParticularesFalecido] = useState("100000");
  const [bensParticularesConjuge, setBensParticularesConjuge] = useState("50000");

  const resultado = useMemo(
    () =>
      calcularMeacao({
        regime,
        bensComuns: parseFloat(bensComuns.replace(/\./g, "").replace(",", ".")) || 0,
        bensParticularesFalecido:
          parseFloat(bensParticularesFalecido.replace(/\./g, "").replace(",", ".")) || 0,
        bensParticularesConjuge:
          parseFloat(bensParticularesConjuge.replace(/\./g, "").replace(",", ".")) || 0,
      }),
    [regime, bensComuns, bensParticularesFalecido, bensParticularesConjuge]
  );

  const mostraComuns = regime === "comunhao_parcial" || regime === "participacao_final" || regime === "comunhao_universal";
  const mostraParticularFalecido = true;
  const mostraParticularConjuge = regime === "comunhao_universal";

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
          Calculadora de meação
        </h1>
        <p className="font-sans text-base mb-10 max-w-xl" style={{ color: INK_SECOND }}>
          Separe o que já pertence ao cônjuge sobrevivente (meação) do que
          forma a herança, conforme o regime de bens do casamento.
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
              Regime de bens do casamento
            </label>
            <select
              value={regime}
              onChange={(e) => setRegime(e.target.value)}
              className="w-full mb-5 px-3 py-2 font-sans text-sm"
              style={{
                border: `0.5px solid ${PAPER_LINE}`,
                borderRadius: "4px",
                color: NAVY,
                background: "#fff",
              }}
            >
              <option value="comunhao_parcial">Comunhão parcial de bens</option>
              <option value="comunhao_universal">Comunhão universal de bens</option>
              <option value="separacao_total">Separação total (convencional)</option>
              <option value="separacao_obrigatoria">Separação obrigatória</option>
              <option value="participacao_final">Participação final nos aquestos</option>
            </select>

            {mostraComuns && (
              <>
                <label
                  className="block font-sans text-xs uppercase tracking-wide mb-2"
                  style={{ color: INK_SECOND }}
                >
                  Bens adquiridos durante o casamento (em nome de qualquer um dos dois)
                </label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={bensComuns}
                  onChange={(e) => setBensComuns(e.target.value)}
                  className="w-full mb-5 px-3 py-2 font-sans text-lg"
                  style={{
                    border: `0.5px solid ${PAPER_LINE}`,
                    borderRadius: "4px",
                    color: NAVY,
                    background: "#fff",
                  }}
                />
              </>
            )}

            {mostraParticularFalecido && (
              <>
                <label
                  className="block font-sans text-xs uppercase tracking-wide mb-2"
                  style={{ color: INK_SECOND }}
                >
                  Bens particulares do falecido (antes do casamento, herança ou doação recebida)
                </label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={bensParticularesFalecido}
                  onChange={(e) => setBensParticularesFalecido(e.target.value)}
                  className="w-full mb-5 px-3 py-2 font-sans text-lg"
                  style={{
                    border: `0.5px solid ${PAPER_LINE}`,
                    borderRadius: "4px",
                    color: NAVY,
                    background: "#fff",
                  }}
                />
              </>
            )}

            {mostraParticularConjuge && (
              <>
                <label
                  className="block font-sans text-xs uppercase tracking-wide mb-2"
                  style={{ color: INK_SECOND }}
                >
                  Bens particulares do cônjuge sobrevivente
                </label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={bensParticularesConjuge}
                  onChange={(e) => setBensParticularesConjuge(e.target.value)}
                  className="w-full mb-5 px-3 py-2 font-sans text-lg"
                  style={{
                    border: `0.5px solid ${PAPER_LINE}`,
                    borderRadius: "4px",
                    color: NAVY,
                    background: "#fff",
                  }}
                />
              </>
            )}
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

            <div>
              <div className="mb-4 pb-4" style={{ borderBottom: `0.5px solid ${NAVY_SOFT}` }}>
                <p
                  className="font-sans text-xs uppercase tracking-wide mb-1"
                  style={{ color: "#8FA0B3" }}
                >
                  Meação do cônjuge sobrevivente (não é herança)
                </p>
                <p className="font-serif text-3xl" style={{ color: PAPER }}>
                  {formatBRL(resultado.meacaoConjuge)}
                </p>
              </div>
              <div>
                <p
                  className="font-sans text-xs uppercase tracking-wide mb-1"
                  style={{ color: "#8FA0B3" }}
                >
                  Massa hereditária (a ser partilhada)
                </p>
                <p className="font-serif text-3xl" style={{ color: PAPER }}>
                  {formatBRL(resultado.massaHereditaria)}
                </p>
              </div>
              <p className="font-sans text-xs mt-4 pt-4" style={{ color: "#8FA0B3", borderTop: `0.5px solid ${NAVY_SOFT}` }}>
                {resultado.explicacao}
              </p>
            </div>
          </div>
        </div>

        <p className="font-sans text-xs mb-16" style={{ color: INK_SECOND }}>
          Simulação educativa. Não considera cláusulas específicas
          (incomunicabilidade, sub-rogação de bens particulares), nem
          disputas sobre a origem de um bem. Casos assim exigem análise
          documental de um advogado.
        </p>

        <div className="mb-16">
          <h2 className="font-serif text-2xl mb-4" style={{ color: NAVY }}>
            Meação não é herança
          </h2>
          <div className="font-sans text-sm leading-relaxed space-y-3" style={{ color: "#3A4552" }}>
            <p>
              É um erro comum confundir os dois. A meação é a parte do
              patrimônio que já pertencia ao cônjuge sobrevivente antes da
              morte, por força do regime de bens do casamento — ela nunca foi
              do falecido, então não é herança, e sobre ela não incide ITCMD.
            </p>
            <p>
              A herança é só a parte que era do falecido, e é o que se
              divide entre os herdeiros (cônjuge, se tiver direito, e
              filhos). Por isso, num casamento em comunhão parcial, o
              patrimônio do casal costuma se dividir em três blocos: a
              meação do cônjuge, os bens particulares do falecido, e os bens
              comuns que cabiam ao falecido — os dois últimos formam a
              herança.
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
                q: "União estável tem meação?",
                a: "Sim. A jurisprudência do STF equipara os direitos patrimoniais de cônjuge e companheiro(a) em união estável, incluindo a meação — mas comprovar a união estável costuma exigir documentação adicional no inventário.",
              },
              {
                q: "A meação precisa passar pelo inventário?",
                a: "Sim, formalmente ela é reconhecida dentro do processo de inventário, mesmo não sendo herança — é assim que fica documentado o que pertence a cada um antes da partilha.",
              },
              {
                q: "Bens recebidos de herança durante o casamento entram na meação?",
                a: "Na comunhão parcial, não — bens recebidos por herança ou doação continuam particulares de quem recebeu, mesmo durante o casamento, salvo cláusula em contrário.",
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
            {["Calculadora de herança", "Calculadora de partilha", "Calculadora de ITCMD", "Custos de inventário"].map(
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
              Precisa formalizar a meação no inventário?
            </p>
            <p className="font-sans text-sm" style={{ color: "#B9C2CE" }}>
              Conte brevemente sua situação e um advogado entra em contato.
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
