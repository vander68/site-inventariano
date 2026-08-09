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

// Aliquotas de referencia por estado (ultima revisao: fase de MVP - validar
// e manter atualizado periodicamente, ja que legislacao estadual muda).
// Progressiva = array de faixas; fixa = numero unico.
// Fontes: SP (Lei 10.705/2000, art. 16), MG e PR (aliquota fixa vigente),
// RJ (Lei 7.174/2015, art. 26, UFIR-RJ 2026 = R$4,9604), RS (Lei 8.821/89,
// art. 18/19, tabela vigente desde 01/01/2016, UPF-RS 2026 = R$28,3264,
// fonte: Receita Estadual do RS). Confirmado em fontes primarias na
// criacao desta calculadora. SC, BA e DF marcados como "pendente" por
// falta de fonte primaria confiavel no momento - SC mudou de lei em 2024
// (revogou a faixa de 8%, passou a variar de 1% a 7%) mas as faixas
// atualizadas nao foram confirmadas ainda. A LC 227/2026 tornou a
// progressividade obrigatoria em todo o pais e varios estados estao
// mudando de lei, entao isso pode mudar rapido - revisar periodicamente.
const ALIQUOTAS_UF = {
  SP: { tipo: "fixa", valor: 4 },
  RJ: {
    tipo: "progressiva",
    faixas: [
      { ate: 347228, aliquota: 4 },
      { ate: 496040, aliquota: 4.5 },
      { ate: 992080, aliquota: 5 },
      { ate: 1488120, aliquota: 6 },
      { ate: 1984160, aliquota: 7 },
      { ate: Infinity, aliquota: 8 },
    ],
  },
  MG: { tipo: "fixa", valor: 5 },
  PR: { tipo: "fixa", valor: 4 },
  RS: {
    tipo: "progressiva",
    faixasPorTipo: {
      heranca: [
        { ate: 56653, aliquota: 0 },
        { ate: 283264, aliquota: 3 },
        { ate: 849792, aliquota: 4 },
        { ate: 1416320, aliquota: 5 },
        { ate: Infinity, aliquota: 6 },
      ],
      doacao: [
        { ate: 283264, aliquota: 3 },
        { ate: Infinity, aliquota: 4 },
      ],
    },
  },
  SC: { tipo: "pendente" },
  BA: { tipo: "pendente" },
  DF: { tipo: "pendente" },
  OUTRO: { tipo: "pendente" },
};

const NOMES_UF = {
  SP: "São Paulo",
  RJ: "Rio de Janeiro",
  MG: "Minas Gerais",
  PR: "Paraná",
  RS: "Rio Grande do Sul",
  SC: "Santa Catarina",
  BA: "Bahia",
  DF: "Distrito Federal",
  OUTRO: "Outro estado",
};

function calcularITCMD({ valor, uf, tipo }) {
  const v = Math.max(0, valor || 0);
  if (v <= 0) return null;

  const regra = ALIQUOTAS_UF[uf] || ALIQUOTAS_UF.OUTRO;

  if (regra.tipo === "pendente") {
    return { pendente: true };
  }

  if (regra.tipo === "fixa") {
    const imposto = v * (regra.valor / 100);
    return { imposto, aliquotaEfetiva: regra.valor, faixas: null };
  }

  if (regra.tipo === "progressiva") {
    const faixas = regra.faixasPorTipo ? regra.faixasPorTipo[tipo] : regra.faixas;
    let restante = v;
    let anterior = 0;
    let imposto = 0;
    const detalhePorFaixa = [];

    for (const faixa of faixas) {
      if (restante <= 0) break;
      const larguraFaixa = Math.min(faixa.ate, v) - anterior;
      if (larguraFaixa <= 0) {
        anterior = faixa.ate;
        continue;
      }
      const valorNaFaixa = Math.min(larguraFaixa, restante);
      const impostoNaFaixa = valorNaFaixa * (faixa.aliquota / 100);
      imposto += impostoNaFaixa;
      if (faixa.aliquota > 0) {
        detalhePorFaixa.push({ aliquota: faixa.aliquota, valorNaFaixa });
      }
      restante -= valorNaFaixa;
      anterior = faixa.ate;
    }

    return {
      imposto,
      aliquotaEfetiva: (imposto / v) * 100,
      faixas: detalhePorFaixa,
    };
  }
}

export default function CalculadoraITCMD() {
  const [valor, setValor] = useState("500000");
  const [uf, setUf] = useState("SP");
  const [tipo, setTipo] = useState("heranca");

  const resultado = useMemo(
    () =>
      calcularITCMD({
        valor: parseFloat(valor.replace(/\./g, "").replace(",", ".")) || 0,
        uf,
        tipo,
      }),
    [valor, uf, tipo]
  );

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
          Calculadora de ITCMD
        </h1>
        <p className="font-sans text-base mb-10 max-w-xl" style={{ color: INK_SECOND }}>
          Estime o Imposto de Transmissão Causa Mortis e Doação sobre herança
          ou doação, conforme a alíquota do seu estado.
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
              Valor total dos bens transmitidos
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
              Origem
            </label>
            <div className="flex gap-4 font-sans text-sm" style={{ color: NAVY }}>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="tipo"
                  checked={tipo === "heranca"}
                  onChange={() => setTipo("heranca")}
                />
                Herança
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="tipo"
                  checked={tipo === "doacao"}
                  onChange={() => setTipo("doacao")}
                />
                Doação
              </label>
            </div>
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
                Informe o valor dos bens para ver a estimativa.
              </p>
            )}

            {resultado && resultado.pendente && (
              <p className="font-sans text-sm" style={{ color: "#DDE3E9" }}>
                Ainda estamos confirmando a alíquota vigente de{" "}
                {NOMES_UF[uf]} na legislação estadual — várias UFs estão
                ajustando suas leis por causa da LC 227/2026. Fale com um
                advogado para uma estimativa confiável nesse estado por
                enquanto.
              </p>
            )}

            {resultado && !resultado.pendente && (
              <div>
                <p
                  className="font-sans text-xs uppercase tracking-wide mb-1"
                  style={{ color: "#8FA0B3" }}
                >
                  ITCMD estimado ({NOMES_UF[uf]})
                </p>
                <p className="font-serif text-3xl mb-1" style={{ color: PAPER }}>
                  {formatBRL(resultado.imposto)}
                </p>
                <p className="font-sans text-xs mb-4" style={{ color: "#8FA0B3" }}>
                  Alíquota efetiva: {resultado.aliquotaEfetiva.toFixed(2)}%
                </p>

                {resultado.faixas && (
                  <div
                    className="pt-3"
                    style={{ borderTop: `0.5px solid ${NAVY_SOFT}` }}
                  >
                    <p
                      className="font-sans text-xs uppercase tracking-wide mb-2"
                      style={{ color: "#8FA0B3" }}
                    >
                      Cálculo por faixa
                    </p>
                    {resultado.faixas.map((f, i) => (
                      <p key={i} className="font-sans text-xs mb-1" style={{ color: "#DDE3E9" }}>
                        {formatBRL(f.valorNaFaixa)} × {f.aliquota}% ={" "}
                        {formatBRL(f.valorNaFaixa * (f.aliquota / 100))}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <p className="font-sans text-xs mb-16" style={{ color: INK_SECOND }}>
          Simulação educativa com alíquotas de referência — última revisão
          verificada na criação desta calculadora. As alíquotas estaduais
          mudam por legislação própria de cada estado; confirme o valor
          exato com a Secretaria da Fazenda do seu estado ou um advogado
          antes de qualquer pagamento.
        </p>

        <div className="mb-16">
          <h2 className="font-serif text-2xl mb-4" style={{ color: NAVY }}>
            Como funciona o ITCMD
          </h2>
          <div className="font-sans text-sm leading-relaxed space-y-3" style={{ color: "#3A4552" }}>
            <p>
              O ITCMD é um imposto estadual cobrado sobre a transmissão de
              bens por herança (causa mortis) ou doação. Cada estado define
              sua própria alíquota — pode ser um percentual fixo sobre o
              valor total, ou uma alíquota progressiva que aumenta conforme
              o valor do patrimônio, dividida em faixas.
            </p>
            <p>
              No caso de herança, o imposto costuma ser calculado sobre o
              valor total dos bens do espólio na data do óbito, e deve ser
              pago antes da conclusão do inventário — o atraso no pagamento
              geralmente gera multa e juros, o que torna o prazo tão
              importante quanto o valor em si.
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
                q: "O ITCMD é o mesmo valor em todos os estados?",
                a: "Não. Cada estado fixa sua própria alíquota e regras, dentro do limite máximo de 8% definido pelo Senado Federal. Por isso o estado onde corre o inventário muda bastante o valor final.",
              },
              {
                q: "Existe isenção de ITCMD?",
                a: "Vários estados preveem isenção ou alíquota reduzida para imóveis de baixo valor, planos de previdência (PGBL/VGBL, com discussão jurídica sobre incidência) e alguns bens específicos. Vale confirmar as regras do seu estado.",
              },
              {
                q: "Quem paga o ITCMD, o herdeiro ou o espólio?",
                a: "Cada herdeiro ou donatário paga sobre a parte que recebe — não é um valor único pago pelo espólio como um todo.",
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
            {[
              "Calculadora de herança",
              "Simulador de custos de inventário",
              "Calculadora de partilha",
              "Calculadora de meação",
            ].map((label, i) => (
              <span
                key={i}
                className="px-3 py-2"
                style={{ border: `0.5px solid ${PAPER_LINE}`, borderRadius: "4px", color: NAVY }}
              >
                {label}
              </span>
            ))}
          </div>
        </div>

        <div
          className="p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          style={{ background: NAVY, borderRadius: "4px" }}
        >
          <div>
            <p className="font-serif text-xl mb-1" style={{ color: PAPER }}>
              Quer confirmar esse valor com um profissional?
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
