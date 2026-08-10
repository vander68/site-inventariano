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

function calcularPartilha({ valorTotal, temMeacao, herdeiros }) {
  const total = Math.max(0, valorTotal || 0);
  if (total <= 0 || herdeiros.length === 0) return null;

  const massaHereditaria = temMeacao ? total / 2 : total;
  const meacao = temMeacao ? total / 2 : 0;

  const somaQuotas = herdeiros.reduce((acc, h) => acc + (h.quota || 1), 0);
  const linhas = herdeiros.map((h) => ({
    nome: h.nome,
    valor: (massaHereditaria * (h.quota || 1)) / somaQuotas,
    percentual: (((h.quota || 1) / somaQuotas) * 100),
  }));

  return { massaHereditaria, meacao, linhas };
}

export default function CalculadoraPartilha() {
  const [valorTotal, setValorTotal] = useState("600000");
  const [temMeacao, setTemMeacao] = useState(true);
  const [herdeiros, setHerdeiros] = useState([
    { nome: "Herdeiro 1", quota: 1 },
    { nome: "Herdeiro 2", quota: 1 },
  ]);

  const resultado = useMemo(
    () =>
      calcularPartilha({
        valorTotal: parseFloat(valorTotal.replace(/\./g, "").replace(",", ".")) || 0,
        temMeacao,
        herdeiros,
      }),
    [valorTotal, temMeacao, herdeiros]
  );

  function atualizarHerdeiro(i, campo, valor) {
    const novos = [...herdeiros];
    novos[i] = { ...novos[i], [campo]: valor };
    setHerdeiros(novos);
  }

  function adicionarHerdeiro() {
    setHerdeiros([...herdeiros, { nome: `Herdeiro ${herdeiros.length + 1}`, quota: 1 }]);
  }

  function removerHerdeiro(i) {
    setHerdeiros(herdeiros.filter((_, idx) => idx !== i));
  }

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
          Calculadora de partilha
        </h1>
        <p className="font-sans text-base mb-10 max-w-xl" style={{ color: INK_SECOND }}>
          Divida o valor da herança entre os herdeiros, com quotas iguais ou
          proporções diferentes, e veja a meação separada se houver.
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
              Valor total do patrimônio do casal (ou só do falecido)
            </label>
            <input
              type="text"
              inputMode="decimal"
              value={valorTotal}
              onChange={(e) => setValorTotal(e.target.value)}
              placeholder="600.000"
              className="w-full mb-5 px-3 py-2 font-sans text-lg"
              style={{
                border: `0.5px solid ${PAPER_LINE}`,
                borderRadius: "4px",
                color: NAVY,
                background: "#fff",
              }}
            />

            <label
              className="flex items-center gap-2 mb-5 font-sans text-sm cursor-pointer"
              style={{ color: NAVY }}
            >
              <input
                type="checkbox"
                checked={temMeacao}
                onChange={(e) => setTemMeacao(e.target.checked)}
              />
              O valor acima inclui a meação do cônjuge (metade não entra na herança)
            </label>

            <label
              className="block font-sans text-xs uppercase tracking-wide mb-2"
              style={{ color: INK_SECOND }}
            >
              Herdeiros e suas quotas
            </label>
            <div className="space-y-2 mb-3">
              {herdeiros.map((h, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={h.nome}
                    onChange={(e) => atualizarHerdeiro(i, "nome", e.target.value)}
                    className="flex-1 px-3 py-2 font-sans text-sm"
                    style={{
                      border: `0.5px solid ${PAPER_LINE}`,
                      borderRadius: "4px",
                      color: NAVY,
                      background: "#fff",
                    }}
                  />
                  <input
                    type="number"
                    min="1"
                    value={h.quota}
                    onChange={(e) => atualizarHerdeiro(i, "quota", parseFloat(e.target.value) || 1)}
                    className="w-20 px-3 py-2 font-sans text-sm"
                    style={{
                      border: `0.5px solid ${PAPER_LINE}`,
                      borderRadius: "4px",
                      color: NAVY,
                      background: "#fff",
                    }}
                  />
                  {herdeiros.length > 1 && (
                    <button
                      onClick={() => removerHerdeiro(i)}
                      className="font-sans text-xs px-2 py-2"
                      style={{ color: INK_SECOND, border: "none", background: "transparent" }}
                    >
                      remover
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              onClick={adicionarHerdeiro}
              className="font-sans text-sm px-3 py-2"
              style={{ border: `0.5px solid ${PAPER_LINE}`, borderRadius: "4px", color: NAVY, background: "#fff" }}
            >
              + Adicionar herdeiro
            </button>
            <p className="font-sans text-xs mt-3" style={{ color: INK_SECOND }}>
              Use quota 1 para todos se a divisão for igual entre todos os
              herdeiros. Quotas diferentes servem para casos com proporções
              específicas (ex: testamento parcial).
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
                Informe o valor e ao menos um herdeiro para ver a partilha.
              </p>
            )}

            {resultado && (
              <div>
                {temMeacao && (
                  <div className="mb-4 pb-4" style={{ borderBottom: `0.5px solid ${NAVY_SOFT}` }}>
                    <p
                      className="font-sans text-xs uppercase tracking-wide mb-1"
                      style={{ color: "#8FA0B3" }}
                    >
                      Meação do cônjuge (não é herança)
                    </p>
                    <p className="font-serif text-2xl" style={{ color: PAPER }}>
                      {formatBRL(resultado.meacao)}
                    </p>
                  </div>
                )}
                <p
                  className="font-sans text-xs uppercase tracking-wide mb-2"
                  style={{ color: "#8FA0B3" }}
                >
                  Massa hereditária: {formatBRL(resultado.massaHereditaria)}
                </p>
                <div className="space-y-2">
                  {resultado.linhas.map((l, i) => (
                    <div key={i} className="flex justify-between font-sans text-sm">
                      <span style={{ color: "#DDE3E9" }}>{l.nome}</span>
                      <span style={{ color: PAPER }}>
                        {formatBRL(l.valor)} <span style={{ color: "#8FA0B3" }}>({l.percentual.toFixed(0)}%)</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <p className="font-sans text-xs mb-16" style={{ color: INK_SECOND }}>
          Simulação educativa. Não considera ITCMD, dívidas do espólio,
          colação de doações em vida, nem disputas sobre bens específicos —
          ela divide o valor total informado nas proporções que você definir.
        </p>

        <div className="mb-16">
          <h2 className="font-serif text-2xl mb-4" style={{ color: NAVY }}>
            O que é a partilha
          </h2>
          <div className="font-sans text-sm leading-relaxed space-y-3" style={{ color: "#3A4552" }}>
            <p>
              A partilha é o ato final do inventário: depois de apurado o
              valor do patrimônio, pago o ITCMD e quitadas as dívidas do
              espólio, os bens são formalmente divididos entre os herdeiros —
              seja em dinheiro, seja atribuindo bens específicos a cada um
              (o que exige acerto de valores para manter a proporção justa).
            </p>
            <p>
              Se o falecido era casado em regime de comunhão, a meação do
              cônjuge sobrevivente sai primeiro, porque metade dos bens
              comuns já era dele — só a outra metade (mais os bens
              particulares do falecido) forma a massa hereditária a ser
              partilhada entre os herdeiros.
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
                q: "Todo herdeiro precisa concordar com a partilha?",
                a: "No inventário extrajudicial sim — todos precisam estar de acordo. Havendo discordância, o inventário precisa ser judicial, e um juiz decide a partilha.",
              },
              {
                q: "Dá para dividir bens específicos em vez de dinheiro?",
                a: "Sim, e é o mais comum — um herdeiro fica com o imóvel, outro com o carro e aplicações, por exemplo — desde que o valor de cada quinhão fique equilibrado, ou que a diferença seja compensada em dinheiro (torna).",
              },
              {
                q: "As dívidas do falecido entram na partilha?",
                a: "As dívidas são pagas pelo espólio antes da partilha, na medida do patrimônio disponível — os herdeiros não herdam dívida além do valor que receberem.",
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
            {["Calculadora de herança", "Calculadora de ITCMD", "Calculadora de meação", "Custos de inventário"].map(
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
              Precisa formalizar essa partilha?
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
