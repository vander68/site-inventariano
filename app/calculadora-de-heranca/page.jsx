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

function calcularHeranca({ valor, temConjuge, regime, numFilhos }) {
  const v = Math.max(0, valor || 0);
  const filhos = Math.max(0, Math.floor(numFilhos || 0));

  if (v <= 0) return null;

  if (filhos === 0 && !temConjuge) {
    return {
      tipo: "sem_filhos_sem_conjuge",
      linhas: [],
      aviso:
        "Sem filhos e sem cônjuge, a herança vai para os pais, outros ascendentes ou colaterais (irmãos, sobrinhos), conforme a ordem de vocação hereditária. Esse cenário não é coberto por esta calculadora — recomendamos falar com um advogado.",
    };
  }

  if (filhos === 0 && temConjuge) {
    return {
      tipo: "so_conjuge",
      linhas: [{ label: "Cônjuge sobrevivente", valor: v, percentual: 100 }],
      aviso:
        "Estimativa considera que não há pais ou outros ascendentes vivos do falecido. Se houver, o cônjuge concorre com eles e o cálculo muda.",
    };
  }

  if (filhos > 0 && !temConjuge) {
    const cada = v / filhos;
    return {
      tipo: "so_filhos",
      linhas: [
        {
          label: `${filhos} ${filhos === 1 ? "filho(a)" : "filhos(as)"} (partes iguais)`,
          valor: v,
          percentual: 100,
          detalhe: `${formatBRL(cada)} por filho(a)`,
        },
      ],
    };
  }

  // filhos > 0 && temConjuge
  if (regime === "comunhao_universal" || regime === "separacao_obrigatoria") {
    const cada = v / filhos;
    return {
      tipo: "filhos_sem_conjuge_concorrendo",
      linhas: [
        {
          label: `${filhos} ${filhos === 1 ? "filho(a)" : "filhos(as)"} (partes iguais)`,
          valor: v,
          percentual: 100,
          detalhe: `${formatBRL(cada)} por filho(a)`,
        },
      ],
      aviso:
        "Nesse regime de bens, o cônjuge não concorre com os filhos na herança — mas pode já ter direito à meação sobre os bens comuns do casal, calculada separadamente, antes da partilha da herança.",
    };
  }

  const partesIguais = v / (filhos + 1);
  const minimoConjuge = v * 0.25;
  let parteConjuge, parteFilho;
  let usouMinimo = false;

  if (partesIguais < minimoConjuge) {
    parteConjuge = minimoConjuge;
    parteFilho = (v - parteConjuge) / filhos;
    usouMinimo = true;
  } else {
    parteConjuge = partesIguais;
    parteFilho = partesIguais;
  }

  return {
    tipo: "filhos_com_conjuge",
    linhas: [
      {
        label: "Cônjuge sobrevivente",
        valor: parteConjuge,
        percentual: (parteConjuge / v) * 100,
      },
      {
        label: `${filhos} ${filhos === 1 ? "filho(a)" : "filhos(as)"} (partes iguais)`,
        valor: v - parteConjuge,
        percentual: ((v - parteConjuge) / v) * 100,
        detalhe: `${formatBRL(parteFilho)} por filho(a)`,
      },
    ],
    aviso: usouMinimo
      ? "Aplicada a reserva mínima de 1/4 da herança para o cônjuge, válida quando todos os filhos também são filhos do cônjuge sobrevivente. Se houver filhos exclusivos do falecido, essa reserva não se aplica e a divisão muda."
      : undefined,
  };
}

export default function CalculadoraHeranca() {
  const [valor, setValor] = useState("500000");
  const [temConjuge, setTemConjuge] = useState(true);
  const [regime, setRegime] = useState("comunhao_parcial");
  const [numFilhos, setNumFilhos] = useState("2");
  const [temTestamento, setTemTestamento] = useState(false);

  const resultado = useMemo(
    () =>
      calcularHeranca({
        valor: parseFloat(valor.replace(/\./g, "").replace(",", ".")) || 0,
        temConjuge,
        regime,
        numFilhos: parseInt(numFilhos, 10) || 0,
      }),
    [valor, temConjuge, regime, numFilhos]
  );

  return (
    <div style={{ background: PAPER, minHeight: "100%" }} className="w-full">
      <div className="max-w-3xl mx-auto px-6 py-14">
        {/* Eyebrow */}
        <p
          className="text-xs font-sans tracking-widest uppercase mb-3"
          style={{ color: BRASS, letterSpacing: "0.15em" }}
        >
          Inventariando · Calculadora
        </p>

        {/* H1 */}
        <h1
          className="font-serif text-4xl mb-3 leading-tight"
          style={{ color: NAVY }}
        >
          Calculadora de herança
        </h1>
        <p
          className="font-sans text-base mb-10 max-w-xl"
          style={{ color: INK_SECOND }}
        >
          Estime como o patrimônio seria dividido entre cônjuge e filhos pela
          sucessão legítima, conforme o Código Civil brasileiro.
        </p>

        {/* Calculator card */}
        <div
          className="grid md:grid-cols-2 gap-0 mb-4"
          style={{ border: `0.5px solid ${PAPER_LINE}`, borderRadius: "4px" }}
        >
          {/* Inputs */}
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
              Número de filhos(as)
            </label>
            <input
              type="number"
              min="0"
              value={numFilhos}
              onChange={(e) => setNumFilhos(e.target.value)}
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
                checked={temConjuge}
                onChange={(e) => setTemConjuge(e.target.checked)}
              />
              Existe cônjuge sobrevivente
            </label>

            {temConjuge && (
              <>
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
              </>
            )}

            <label
              className="flex items-center gap-2 font-sans text-sm cursor-pointer"
              style={{ color: NAVY }}
            >
              <input
                type="checkbox"
                checked={temTestamento}
                onChange={(e) => setTemTestamento(e.target.checked)}
              />
              Existe testamento
            </label>
          </div>

          {/* Result */}
          <div
            className="p-6 relative flex flex-col justify-center"
            style={{ background: NAVY, color: PAPER, borderRadius: "0 4px 4px 0" }}
          >
            {/* stamp */}
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

            {resultado && resultado.linhas.length === 0 && (
              <p className="font-sans text-sm" style={{ color: "#DDE3E9" }}>
                {resultado.aviso}
              </p>
            )}

            {resultado && resultado.linhas.length > 0 && (
              <div>
                {resultado.linhas.map((linha, i) => (
                  <div key={i} className="mb-5">
                    <p
                      className="font-sans text-xs uppercase tracking-wide mb-1"
                      style={{ color: "#8FA0B3" }}
                    >
                      {linha.label}
                    </p>
                    <p className="font-serif text-2xl mb-1" style={{ color: PAPER }}>
                      {formatBRL(linha.valor)}
                    </p>
                    <p className="font-sans text-xs" style={{ color: "#8FA0B3" }}>
                      {linha.percentual.toFixed(0)}% do total
                      {linha.detalhe ? ` · ${linha.detalhe}` : ""}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {resultado && resultado.aviso && resultado.linhas.length > 0 && (
              <p
                className="font-sans text-xs mt-2 pt-4"
                style={{ color: "#8FA0B3", borderTop: `0.5px solid ${NAVY_SOFT}` }}
              >
                {resultado.aviso}
              </p>
            )}

            {temTestamento && (
              <p
                className="font-sans text-xs mt-4 pt-4"
                style={{ color: BRASS, borderTop: `0.5px solid ${NAVY_SOFT}` }}
              >
                Havendo testamento, até 50% do patrimônio (a parte disponível)
                pode ser destinado de forma diferente da sucessão legítima. O
                cálculo acima considera apenas a legítima.
              </p>
            )}
          </div>
        </div>

        <p className="font-sans text-xs mb-16" style={{ color: INK_SECOND }}>
          Simulação educativa e não substitui orientação jurídica. Não
          considera ascendentes, colaterais, filhos exclusivos de um dos
          cônjuges nem particularidades do caso concreto.
        </p>

        {/* Explanation */}
        <div className="mb-16">
          <h2
            className="font-serif text-2xl mb-4"
            style={{ color: NAVY }}
          >
            Como funciona a divisão da herança
          </h2>
          <div className="font-sans text-sm leading-relaxed space-y-3" style={{ color: "#3A4552" }}>
            <p>
              Quando alguém morre sem testamento, o patrimônio é dividido pela
              chamada sucessão legítima, seguindo a ordem prevista no Código
              Civil: primeiro os descendentes (filhos, netos), depois os
              ascendentes (pais, avós) e o cônjuge, e por último os colaterais
              (irmãos, sobrinhos).
            </p>
            <p>
              Quando há filhos e cônjuge sobrevivente, o cônjuge pode
              concorrer com os filhos na herança — o resultado depende do
              regime de bens do casamento. Em comunhão universal ou
              separação obrigatória, o cônjuge geralmente não concorre na
              herança, mas mantém seus direitos sobre a meação dos bens do
              casal. Nos demais regimes, cônjuge e filhos costumam dividir em
              partes iguais, com uma reserva mínima de 1/4 para o cônjuge
              quando todos os filhos também são dele.
            </p>
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-16">
          <h2 className="font-serif text-2xl mb-4" style={{ color: NAVY }}>
            Perguntas frequentes
          </h2>
          <div style={{ borderTop: `0.5px solid ${PAPER_LINE}` }}>
            {[
              {
                q: "Essa calculadora substitui um advogado?",
                a: "Não. Ela dá uma estimativa educativa para você entender a lógica da divisão. Cada inventário tem particularidades que só um advogado avaliando o caso concreto pode considerar.",
              },
              {
                q: "O testamento muda esse cálculo?",
                a: "Sim. Quem tem herdeiros necessários (filhos, cônjuge, pais) só pode dispor livremente de até 50% do patrimônio em testamento — a outra metade (legítima) segue as regras calculadas aqui.",
              },
              {
                q: "União estável tem o mesmo tratamento que casamento?",
                a: "Hoje a jurisprudência do STF equipara os direitos sucessórios de cônjuge e companheiro(a) em união estável. Ainda assim, comprovar a união estável no inventário pode exigir documentação adicional.",
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

        {/* Related tools */}
        <div className="mb-16">
          <h2 className="font-serif text-2xl mb-4" style={{ color: NAVY }}>
            Ferramentas relacionadas
          </h2>
          <div className="flex flex-wrap gap-2 font-sans text-sm">
            {[
              "Calculadora de ITCMD",
              "Simulador de custos de inventário",
              "Calculadora de partilha",
              "Calculadora de meação",
            ].map((label, i) => (
              <span
                key={i}
                className="px-3 py-2"
                style={{
                  border: `0.5px solid ${PAPER_LINE}`,
                  borderRadius: "4px",
                  color: NAVY,
                }}
              >
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* Lead CTA */}
        <div
          className="p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          style={{ background: NAVY, borderRadius: "4px" }}
        >
          <div>
            <p className="font-serif text-xl mb-1" style={{ color: PAPER }}>
              Precisa de orientação para o seu inventário?
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
