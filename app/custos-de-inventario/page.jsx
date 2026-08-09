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

// ITCMD fixo dos estados ja confirmados nesta calculadora (mesma fonte da
// Calculadora de ITCMD). RJ e RS sao progressivos - aqui usamos a aliquota
// media aproximada de referencia so para a simulacao de custo total, com
// aviso de que o valor exato depende da tabela por faixa.
const ITCMD_REFERENCIA = {
  SP: { valor: 4, exata: true },
  MG: { valor: 5, exata: true },
  PR: { valor: 4, exata: true },
  RJ: { valor: 5, exata: false },
  RS: { valor: 4, exata: false },
  OUTRO: { valor: 4, exata: false },
};

const NOMES_UF = {
  SP: "São Paulo",
  MG: "Minas Gerais",
  PR: "Paraná",
  RJ: "Rio de Janeiro",
  RS: "Rio Grande do Sul",
  OUTRO: "Outro estado",
};

// Custas de cartorio/judiciais como percentual de referencia sobre o
// patrimonio - varia por estado e tribunal, tratado aqui como estimativa
// ampla para dar ordem de grandeza, nao valor de tabela de custas.
function estimarCustasCartorioJudicial(valor, temImovel) {
  const percentualBase = temImovel ? 0.02 : 0.012;
  return valor * percentualBase;
}

function estimarHonorarios(valor) {
  // Faixa de referencia usual de mercado para inventario extrajudicial
  // simples: 4% a 6% do patrimonio. Mostrado como intervalo, nao numero
  // fechado, porque honorarios sao negociados caso a caso.
  return { min: valor * 0.04, max: valor * 0.06 };
}

export default function SimuladorCustosInventario() {
  const [valor, setValor] = useState("500000");
  const [uf, setUf] = useState("SP");
  const [tipoInventario, setTipoInventario] = useState("extrajudicial");
  const [temImovel, setTemImovel] = useState(true);

  const resultado = useMemo(() => {
    const v = parseFloat(valor.replace(/\./g, "").replace(",", ".")) || 0;
    if (v <= 0) return null;

    const itcmdRef = ITCMD_REFERENCIA[uf] || ITCMD_REFERENCIA.OUTRO;
    const itcmd = v * (itcmdRef.valor / 100);
    const custas = estimarCustasCartorioJudicial(v, temImovel);
    const honorarios = estimarHonorarios(v);
    const total = itcmd + custas + honorarios.min;
    const totalMax = itcmd + custas + honorarios.max;

    return { itcmd, itcmdExata: itcmdRef.exata, custas, honorarios, total, totalMax };
  }, [valor, uf, temImovel]);

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
          Simulador de custos de inventário
        </h1>
        <p className="font-sans text-base mb-10 max-w-xl" style={{ color: INK_SECOND }}>
          Some ITCMD, custas de cartório ou judiciais e honorários de
          referência para ter uma ideia do custo total do inventário.
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
              Valor total do patrimônio
            </label>
            <input
              type="text"
              inputMode="decimal"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              placeholder="500.000"
              className="w-full mb-5 px-3 py-2 font-sans text-lg"
              style={{
                border: `0.5px solid ${PAPER_LINE}`,
                borderRadius: "4px",
                color: NAVY,
                background: "#fff",
              }}
            />

            <label
              className="block font-sans text-xs uppercase tracking-wide mb-2"
              style={{ color: INK_SECOND }}
            >
              Estado (UF)
            </label>
            <select
              value={uf}
              onChange={(e) => setUf(e.target.value)}
              className="w-full mb-5 px-3 py-2 font-sans text-sm"
              style={{
                border: `0.5px solid ${PAPER_LINE}`,
                borderRadius: "4px",
                color: NAVY,
                background: "#fff",
              }}
            >
              {Object.keys(NOMES_UF).map((key) => (
                <option key={key} value={key}>
                  {NOMES_UF[key]}
                </option>
              ))}
            </select>

            <label
              className="block font-sans text-xs uppercase tracking-wide mb-2"
              style={{ color: INK_SECOND }}
            >
              Tipo de inventário
            </label>
            <div className="flex gap-4 font-sans text-sm mb-5" style={{ color: NAVY }}>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="tipoInv"
                  checked={tipoInventario === "extrajudicial"}
                  onChange={() => setTipoInventario("extrajudicial")}
                />
                Extrajudicial
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="tipoInv"
                  checked={tipoInventario === "judicial"}
                  onChange={() => setTipoInventario("judicial")}
                />
                Judicial
              </label>
            </div>

            <label
              className="flex items-center gap-2 font-sans text-sm cursor-pointer"
              style={{ color: NAVY }}
            >
              <input
                type="checkbox"
                checked={temImovel}
                onChange={(e) => setTemImovel(e.target.checked)}
              />
              Há imóvel no patrimônio
            </label>
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
                Informe o valor do patrimônio para ver a estimativa.
              </p>
            )}

            {resultado && (
              <div>
                <p
                  className="font-sans text-xs uppercase tracking-wide mb-1"
                  style={{ color: "#8FA0B3" }}
                >
                  Custo total estimado
                </p>
                <p className="font-serif text-3xl mb-1" style={{ color: PAPER }}>
                  {formatBRL(resultado.total)} – {formatBRL(resultado.totalMax)}
                </p>
                <p className="font-sans text-xs mb-4" style={{ color: "#8FA0B3" }}>
                  {((resultado.total / (parseFloat(valor.replace(/\./g, "").replace(",", ".")) || 1)) * 100).toFixed(1)}%
                  {" a "}
                  {((resultado.totalMax / (parseFloat(valor.replace(/\./g, "").replace(",", ".")) || 1)) * 100).toFixed(1)}%
                  {" do patrimônio"}
                </p>

                <div className="pt-3 space-y-2" style={{ borderTop: `0.5px solid ${NAVY_SOFT}` }}>
                  <div className="flex justify-between font-sans text-sm">
                    <span style={{ color: "#DDE3E9" }}>
                      ITCMD{!resultado.itcmdExata ? " (aprox.)" : ""}
                    </span>
                    <span style={{ color: PAPER }}>{formatBRL(resultado.itcmd)}</span>
                  </div>
                  <div className="flex justify-between font-sans text-sm">
                    <span style={{ color: "#DDE3E9" }}>Custas cartório/judiciais (aprox.)</span>
                    <span style={{ color: PAPER }}>{formatBRL(resultado.custas)}</span>
                  </div>
                  <div className="flex justify-between font-sans text-sm">
                    <span style={{ color: "#DDE3E9" }}>Honorários de referência</span>
                    <span style={{ color: PAPER }}>
                      {formatBRL(resultado.honorarios.min)} – {formatBRL(resultado.honorarios.max)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <p className="font-sans text-xs mb-16" style={{ color: INK_SECOND }}>
          Simulação educativa. ITCMD usa alíquota de referência (aproximada
          para estados com tabela progressiva); custas e honorários são
          faixas de mercado, não uma tabela oficial de custas do seu
          tribunal ou um orçamento fechado. Peça um orçamento a um
          advogado para um valor exato do seu caso.
        </p>

        <div className="mb-16">
          <h2 className="font-serif text-2xl mb-4" style={{ color: NAVY }}>
            O que compõe o custo de um inventário
          </h2>
          <div className="font-sans text-sm leading-relaxed space-y-3" style={{ color: "#3A4552" }}>
            <p>
              O custo total de um inventário normalmente tem três partes: o
              ITCMD (imposto estadual sobre a herança), as custas de
              cartório — no inventário extrajudicial — ou custas judiciais —
              no inventário judicial —, e os honorários advocatícios, que a
              lei exige em qualquer um dos dois casos.
            </p>
            <p>
              O inventário extrajudicial, feito em cartório, costuma ser mais
              rápido e um pouco mais barato, mas só é possível quando todos
              os herdeiros são maiores, capazes e estão de acordo, e não há
              testamento. Havendo menores, incapazes, discordância entre
              herdeiros ou testamento, o inventário precisa ser judicial.
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
                q: "O inventário extrajudicial é sempre mais barato?",
                a: "Geralmente sim, por ser mais rápido e ter menos custas processuais, mas a diferença de custo varia por estado e pela complexidade do patrimônio — o mais decisivo costuma ser o tempo, não só o valor.",
              },
              {
                q: "Dá para parcelar o ITCMD?",
                a: "Em vários estados sim, geralmente em até 12 vezes, mediante pedido formal na Secretaria da Fazenda. As condições variam por estado.",
              },
              {
                q: "Os honorários advocatícios têm valor tabelado?",
                a: "A OAB de cada estado publica uma tabela de honorários mínimos de referência, mas o valor final é negociado entre advogado e cliente, considerando a complexidade do caso.",
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
            {["Calculadora de herança", "Calculadora de ITCMD", "Calculadora de partilha", "Calculadora de meação"].map(
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
              Quer um orçamento exato para o seu caso?
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
