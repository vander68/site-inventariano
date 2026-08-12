"use client";
import { useState, useMemo } from "react";
import LeadForm from "@/app/components/LeadForm";

const NAVY = "#1B2A41";
const NAVY_SOFT = "#2A3D57";
const PAPER = "#FAF9F5";
const PAPER_LINE = "#DDD8CC";
const BRASS = "#A9834B";
const INK_SECOND = "#5C6B7A";

function formatBRL(v) {
  if (!isFinite(v)) return "R$ 0,00";
  return v.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
}

function calcularCenario({ avaliacao, pracaPct, comissaoPct, itbiPct, registroPct, itbiModo, valorReferencia, desocupacao, debitos, reforma, valorMercado }) {
  const lance = (avaliacao * pracaPct) / 100;
  const comissao = (lance * comissaoPct) / 100;
  const baseItbi = itbiModo === "referencia" ? valorReferencia : lance;
  const itbi = (baseItbi * itbiPct) / 100;
  const registro = (lance * registroPct) / 100;
  const outros = desocupacao + debitos + reforma;
  const total = lance + comissao + itbi + registro + outros;
  const descontoReais = valorMercado - total;
  const descontoPct = valorMercado > 0 ? (descontoReais / valorMercado) * 100 : 0;
  return { lance, comissao, itbi, registro, outros, total, descontoReais, descontoPct };
}

const FAQ = [
  {
    q: "O que é preço vil na 2ª praça?",
    a: "É o lance considerado tão baixo que a lei não admite (em regra, abaixo de 50% da avaliação, conforme o art. 891 do CPC e o que o edital fixar). A calculadora deixa você ajustar o percentual da 2ª praça para simular o piso do edital.",
  },
  {
    q: "A comissão do leiloeiro entra além do lance?",
    a: "Sim. A comissão (em regra 5%) é paga pelo arrematante por cima do valor do lance, junto com ITBI e custos de registro. Por isso o desconto real é sempre menor do que o desconto aparente do lance.",
  },
  {
    q: "Quem arremata assume as dívidas do imóvel?",
    a: "Depende do edital e da natureza da dívida. Em leilão judicial, tributos costumam sub-rogar no preço (o arrematante recebe o imóvel livre), mas dívidas de condomínio podem acompanhar o bem. Lance o valor de débitos que você assumirá no campo próprio.",
  },
  {
    q: "Vale a pena arrematar imóvel ocupado?",
    a: "Pode valer, mas há custo e tempo de desocupação (imissão na posse). Inclua uma estimativa desses custos para ver o impacto no desconto real antes de decidir.",
  },
];

const RELACIONADAS = [
  ["Calculadora de ITCMD", "/calculadora-de-itcmd"],
  ["Custos de Inventário", "/custos-de-inventario"],
  ["Vender imóvel herdado vs. espólio", "/vender-imovel-herdado"],
  ["Calculadora de Usucapião", "/calculadora-usucapiao"],
];

export default function CalculadoraLanceLeilao() {
  const [avaliacao, setAvaliacao] = useState(300000);
  const [valorMercado, setValorMercado] = useState(300000);
  const [p1, setP1] = useState(100);
  const [p2, setP2] = useState(50);
  const [comissaoPct, setComissaoPct] = useState(5);
  const [itbiPct, setItbiPct] = useState(3);
  const [itbiModo, setItbiModo] = useState("lance");
  const [valorReferencia, setValorReferencia] = useState(300000);
  const [registroPct, setRegistroPct] = useState(1.5);
  const [desocupacao, setDesocupacao] = useState(0);
  const [debitos, setDebitos] = useState(0);
  const [reforma, setReforma] = useState(0);

  const base = useMemo(
    () => ({ avaliacao, comissaoPct, itbiPct, registroPct, itbiModo, valorReferencia, desocupacao, debitos, reforma, valorMercado }),
    [avaliacao, comissaoPct, itbiPct, registroPct, itbiModo, valorReferencia, desocupacao, debitos, reforma, valorMercado]
  );

  const primeira = useMemo(() => calcularCenario({ ...base, pracaPct: p1 }), [base, p1]);
  const segunda = useMemo(() => calcularCenario({ ...base, pracaPct: p2 }), [base, p2]);

  const economia = primeira.total - segunda.total;
  const resumoLead = `2ª praça (${p2}%): custo total ${formatBRL(segunda.total)}, desconto real ${segunda.descontoPct.toFixed(1)}% sobre avaliação de ${formatBRL(avaliacao)}.`;

  const numInput = (value, onChange, step = 1000) => (
    <input
      type="number"
      min={0}
      step={step}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
      className="w-full mb-4 px-3 py-2 font-sans text-base"
      style={{ border: `0.5px solid ${PAPER_LINE}`, borderRadius: "4px", color: NAVY, background: "#fff" }}
    />
  );

  const label = (t) => (
    <label className="block font-sans text-xs uppercase tracking-wide mb-2" style={{ color: INK_SECOND }}>
      {t}
    </label>
  );

  return (
    <div style={{ background: PAPER, minHeight: "100%" }} className="w-full">
      <div className="max-w-3xl mx-auto px-6 py-14">
        <p className="text-xs font-sans tracking-widest uppercase mb-3" style={{ color: BRASS, letterSpacing: "0.15em" }}>
          Inventariano · Calculadora
        </p>
        <h1 className="font-serif text-4xl mb-3 leading-tight" style={{ color: NAVY }}>
          Calculadora de Lance Mínimo em Leilão
        </h1>
        <p className="font-sans text-base mb-10 max-w-xl" style={{ color: INK_SECOND }}>
          Descubra o desconto real de arrematar um imóvel na 2ª praça — depois de somar comissão do
          leiloeiro, ITBI, registro, desocupação e débitos ao valor do lance.
        </p>

        <div className="grid md:grid-cols-2 gap-0 mb-4" style={{ border: `0.5px solid ${PAPER_LINE}`, borderRadius: "4px" }}>
          {/* Entradas */}
          <div className="p-6 md:border-r" style={{ borderColor: PAPER_LINE }}>
            {label("Valor de avaliação (edital)")}
            {numInput(avaliacao, setAvaliacao)}

            {label("Valor de mercado real")}
            {numInput(valorMercado, setValorMercado)}

            <div className="grid grid-cols-2 gap-3">
              <div>{label("% 1ª praça")}{numInput(p1, setP1, 1)}</div>
              <div>{label("% 2ª praça")}{numInput(p2, setP2, 1)}</div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>{label("Comissão leiloeiro %")}{numInput(comissaoPct, setComissaoPct, 0.5)}</div>
              <div>{label("ITBI %")}{numInput(itbiPct, setItbiPct, 0.5)}</div>
            </div>

            {label("Base de cálculo do ITBI")}
            <select
              value={itbiModo}
              onChange={(e) => setItbiModo(e.target.value)}
              className="w-full mb-4 px-3 py-2 font-sans text-sm"
              style={{ border: `0.5px solid ${PAPER_LINE}`, borderRadius: "4px", color: NAVY, background: "#fff" }}
            >
              <option value="lance">Sobre o valor do lance</option>
              <option value="referencia">Sobre o valor venal de referência</option>
            </select>
            {itbiModo === "referencia" && (
              <>
                {label("Valor venal de referência")}
                {numInput(valorReferencia, setValorReferencia)}
              </>
            )}

            {label("Registro / emolumentos %")}
            {numInput(registroPct, setRegistroPct, 0.5)}

            {label("Desocupação (R$)")}
            {numInput(desocupacao, setDesocupacao)}
            {label("Débitos IPTU / condomínio (R$)")}
            {numInput(debitos, setDebitos)}
            {label("Reforma (R$)")}
            {numInput(reforma, setReforma)}
          </div>

          {/* Resultado */}
          <div className="p-6 relative flex flex-col justify-center" style={{ background: NAVY, color: PAPER, borderRadius: "0 4px 4px 0" }}>
            <div style={{ position: "absolute", top: "16px", right: "16px", border: `1px dashed ${BRASS}`, borderRadius: "50%", width: "72px", height: "72px", display: "flex", alignItems: "center", justifyContent: "center", transform: "rotate(-9deg)", textAlign: "center", padding: "4px" }}>
              <span className="font-sans" style={{ color: BRASS, fontSize: "8px", letterSpacing: "0.08em", lineHeight: 1.3 }}>
                ESTIMATIVA EDUCATIVA
              </span>
            </div>

            <p className="font-sans text-xs uppercase tracking-wide mb-1" style={{ color: "#8FA0B3" }}>
              2ª praça — custo total de aquisição
            </p>
            <p className="font-serif text-3xl mb-1" style={{ color: PAPER }}>
              {formatBRL(segunda.total)}
            </p>
            <p className="font-sans text-sm mb-4" style={{ color: segunda.descontoReais >= 0 ? "#9BD1B6" : "#E3A79A" }}>
              {segunda.descontoReais >= 0 ? "Desconto real de " : "Acima do mercado em "}
              {Math.abs(segunda.descontoPct).toFixed(1)}%
              {" · "}
              {segunda.descontoReais >= 0 ? "economia de " : "prejuízo de "}
              {formatBRL(Math.abs(segunda.descontoReais))}
            </p>

            <div className="pt-3" style={{ borderTop: `0.5px solid ${NAVY_SOFT}` }}>
              {[
                ["Lance mínimo", segunda.lance],
                ["Comissão do leiloeiro", segunda.comissao],
                ["ITBI", segunda.itbi],
                ["Registro / carta de arrematação", segunda.registro],
                ["Desocupação + débitos + reforma", segunda.outros],
              ].map(([k, v]) => (
                <p key={k} className="font-sans text-xs mb-1 flex justify-between gap-4" style={{ color: "#DDE3E9" }}>
                  <span>{k}</span>
                  <span>{formatBRL(v)}</span>
                </p>
              ))}
            </div>

            <div className="mt-4 pt-3" style={{ borderTop: `0.5px solid ${NAVY_SOFT}` }}>
              <p className="font-sans text-xs" style={{ color: "#8FA0B3" }}>
                1ª praça ({p1}%): custo total {formatBRL(primeira.total)}
              </p>
              {economia > 0 && (
                <p className="font-sans text-xs mt-1" style={{ color: "#9BD1B6" }}>
                  A 2ª praça economiza {formatBRL(economia)} frente à 1ª.
                </p>
              )}
            </div>
          </div>
        </div>

        <p className="font-sans text-xs mb-16" style={{ color: INK_SECOND }}>
          Simulação educativa. Confira sempre o edital: o percentual mínimo da 2ª praça, a
          responsabilidade por débitos e as condições de desocupação variam caso a caso e não
          substituem a análise jurídica do processo de leilão.
        </p>

        <div className="mb-16">
          <h2 className="font-serif text-2xl mb-4" style={{ color: NAVY }}>
            Como funciona o lance mínimo
          </h2>
          <div className="font-sans text-sm leading-relaxed space-y-3" style={{ color: "#3A4552" }}>
            <p>
              Em regra, na 1ª praça o lance mínimo é o valor da avaliação (100%). Se ninguém arremata,
              abre-se a 2ª praça, com um piso menor definido no edital — normalmente entre 50% e 60% da
              avaliação, respeitado o limite do preço vil.
            </p>
            <p>
              O erro comum é confundir o desconto do lance com o desconto real. Arrematar a 50% da
              avaliação não significa 50% de economia: sobre o lance ainda incidem a comissão do
              leiloeiro (em regra 5%), o ITBI, os emolumentos de registro e, quando houver, os custos de
              desocupação e as dívidas que ficarão com você. Esta calculadora soma tudo e compara com o
              valor de mercado para revelar o desconto que realmente sobra.
            </p>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="font-serif text-2xl mb-4" style={{ color: NAVY }}>
            Perguntas frequentes
          </h2>
          <div style={{ borderTop: `0.5px solid ${PAPER_LINE}` }}>
            {FAQ.map((item, i) => (
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
            {RELACIONADAS.map(([label, href]) => (
              <a key={label} href={href} className="px-3 py-2" style={{ border: `0.5px solid ${PAPER_LINE}`, borderRadius: "4px", color: NAVY }}>
                {label}
              </a>
            ))}
          </div>
        </div>

        <LeadForm origem="Calculadora de Lance em Leilão" resumo={resumoLead} />
      </div>
    </div>
  );
}
