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
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
}

function mesesEntre(de, ate) {
  return Math.max(0, (ate.getFullYear() - de.getFullYear()) * 12 + (ate.getMonth() - de.getMonth()));
}
// Fatores de redução do ganho de capital (Lei 11.196/05, art. 40). Mês de aquisição ~ janeiro.
function fatorReducao(anoAquisicao, venda) {
  const aq = new Date(anoAquisicao, 0, 1);
  const nov2005 = new Date(2005, 10, 1);
  const dez2005 = new Date(2005, 11, 1);
  const m1 = aq < nov2005 ? mesesEntre(aq, nov2005) : 0;
  const iniFr2 = aq > dez2005 ? aq : dez2005;
  const m2 = mesesEntre(iniFr2, venda);
  return (1 / Math.pow(1.006, m1)) * (1 / Math.pow(1.0035, m2));
}
function hojeZero() {
  const h = new Date();
  h.setHours(0, 0, 0, 0);
  return h;
}

function calcular(p) {
  const ganho = (preco, venda) => {
    if (p.isencaoGanho) return 0;
    let lucro = Math.max(0, preco - p.baseAquisicao);
    if (p.aplicarRedutor) lucro *= fatorReducao(p.anoAquisicao, venda);
    return (lucro * p.ganhoPct) / 100;
  };

  const itcmd = (p.baseAquisicao * p.itcmdPct) / 100;
  const inventario = (p.valorMercado * p.inventarioPct) / 100;

  // Vender agora
  const precoA = p.valorMercado;
  const cenA = {
    preco: precoA,
    itcmd,
    ganho: ganho(precoA, hojeZero()),
    corretagem: (precoA * p.corretagemPct) / 100,
    inventario,
    manutencao: 0,
  };
  cenA.liquido = cenA.preco - cenA.itcmd - cenA.ganho - cenA.corretagem - cenA.inventario;

  // Aguardar
  const anos = p.mesesEspera / 12;
  const precoB = p.valorMercado * Math.pow(1 + p.valorizacaoAnualPct / 100, anos);
  const vendaFutura = hojeZero();
  vendaFutura.setMonth(vendaFutura.getMonth() + p.mesesEspera);
  const cenB = {
    preco: precoB,
    itcmd,
    ganho: ganho(precoB, vendaFutura),
    corretagem: (precoB * p.corretagemPct) / 100,
    inventario,
    manutencao: p.manutencaoMensal * p.mesesEspera,
  };
  cenB.liquido = cenB.preco - cenB.itcmd - cenB.ganho - cenB.corretagem - cenB.inventario - cenB.manutencao;

  const aFuturo = p.usarOportunidade ? cenA.liquido * Math.pow(1 + p.taxaOportunidadePct / 100, anos) : cenA.liquido;
  const diferenca = cenB.liquido - aFuturo;
  return { cenA, cenB, aFuturo, diferenca, aguardarVantajoso: diferenca > 0 };
}

const FAQ = [
  { q: "Na herança o imposto é ITBI ou ITCMD?", a: "É o ITCMD (imposto estadual sobre transmissão causa mortis), de 2% a 8% conforme o estado. O ITBI é devido pelo comprador nas vendas onerosas, não pelos herdeiros que vendem." },
  { q: "Como funciona o ganho de capital do imóvel herdado?", a: "O IR sobre ganho de capital incide sobre a diferença entre o preço de venda e o valor declarado do imóvel no inventário. Se o imóvel é declarado a valor de mercado e vendido logo em seguida, o ganho tende a zero." },
  { q: "O que é o redutor da Lei 11.196/05?", a: "São fatores (FR1 e FR2) que reduzem a base do ganho de capital conforme o tempo desde a aquisição do imóvel. Quanto mais antigo, maior a redução — por isso incluímos o ano de aquisição como opção." },
  { q: "Vale mais a pena vender rápido ou esperar a valorização?", a: "Depende. Esperar traz valorização, mas custa manutenção do espólio (IPTU, condomínio) e o dinheiro parado deixa de render. A calculadora compara os dois cenários na mesma data, considerando esse custo de oportunidade." },
];

const RELACIONADAS = [
  ["Calculadora de ITCMD", "/calculadora-de-itcmd"],
  ["Custos de Inventário", "/custos-de-inventario"],
  ["Calculadora de Partilha", "/calculadora-de-partilha"],
  ["Calculadora de Lance em Leilão", "/calculadora-lance-leilao"],
];

export default function VenderImovelHerdado() {
  const [valorMercado, setValorMercado] = useState(500000);
  const [baseAquisicao, setBaseAquisicao] = useState(400000);
  const [itcmdPct, setItcmdPct] = useState(4);
  const [isencaoGanho, setIsencaoGanho] = useState(false);
  const [ganhoPct, setGanhoPct] = useState(15);
  const [aplicarRedutor, setAplicarRedutor] = useState(false);
  const [anoAquisicao, setAnoAquisicao] = useState(2010);
  const [corretagemPct, setCorretagemPct] = useState(6);
  const [inventarioPct, setInventarioPct] = useState(6);
  const [manutencaoMensal, setManutencaoMensal] = useState(800);
  const [mesesEspera, setMesesEspera] = useState(18);
  const [valorizacaoAnualPct, setValorizacaoAnualPct] = useState(5);
  const [usarOportunidade, setUsarOportunidade] = useState(true);
  const [taxaOportunidadePct, setTaxaOportunidadePct] = useState(10);

  const r = useMemo(
    () => calcular({ valorMercado, baseAquisicao, itcmdPct, isencaoGanho, ganhoPct, aplicarRedutor, anoAquisicao, corretagemPct, inventarioPct, manutencaoMensal, mesesEspera, valorizacaoAnualPct, usarOportunidade, taxaOportunidadePct }),
    [valorMercado, baseAquisicao, itcmdPct, isencaoGanho, ganhoPct, aplicarRedutor, anoAquisicao, corretagemPct, inventarioPct, manutencaoMensal, mesesEspera, valorizacaoAnualPct, usarOportunidade, taxaOportunidadePct]
  );

  const resumoLead = `${r.aguardarVantajoso ? "Aguardar" : "Vender agora"} tende a render ~${formatBRL(Math.abs(r.diferenca))} a mais. Vender agora: ${formatBRL(r.cenA.liquido)}; aguardar ${mesesEspera} meses: ${formatBRL(r.cenB.liquido)}.`;

  const label = (t) => (
    <label className="block font-sans text-xs uppercase tracking-wide mb-2" style={{ color: INK_SECOND }}>{t}</label>
  );
  const fieldStyle = { border: `0.5px solid ${PAPER_LINE}`, borderRadius: "4px", color: NAVY, background: "#fff" };
  const num = (value, onChange, step = 1000) => (
    <input type="number" min={0} step={step} value={value} onChange={(e) => onChange(parseFloat(e.target.value) || 0)} className="w-full mb-4 px-3 py-2 font-sans text-base" style={fieldStyle} />
  );

  return (
    <div style={{ background: PAPER, minHeight: "100%" }} className="w-full">
      <div className="max-w-3xl mx-auto px-6 py-14">
        <p className="text-xs font-sans tracking-widest uppercase mb-3" style={{ color: BRASS, letterSpacing: "0.15em" }}>
          Inventariano · Calculadora
        </p>
        <h1 className="font-serif text-4xl mb-3 leading-tight" style={{ color: NAVY }}>
          Vender Imóvel Herdado vs. Manter no Espólio
        </h1>
        <p className="font-sans text-base mb-10 max-w-xl" style={{ color: INK_SECOND }}>
          Compare quanto sobra líquido ao vender agora versus aguardar a partilha — já descontando
          ITCMD, ganho de capital, corretagem, inventário e manutenção do espólio.
        </p>

        <div className="grid md:grid-cols-2 gap-0 mb-4" style={{ border: `0.5px solid ${PAPER_LINE}`, borderRadius: "4px" }}>
          {/* Entradas */}
          <div className="p-6 md:border-r" style={{ borderColor: PAPER_LINE }}>
            {label("Valor de mercado atual")}
            {num(valorMercado, setValorMercado)}
            {label("Valor declarado no inventário")}
            {num(baseAquisicao, setBaseAquisicao)}

            <div className="grid grid-cols-2 gap-3">
              <div>{label("ITCMD %")}{num(itcmdPct, setItcmdPct, 0.5)}</div>
              <div>{label("Ganho capital %")}{num(ganhoPct, setGanhoPct, 0.5)}</div>
            </div>

            <label className="flex items-start gap-2 mb-3 p-3 cursor-pointer" style={{ background: "#F3EFE6", borderRadius: "4px" }}>
              <input type="checkbox" checked={isencaoGanho} onChange={(e) => setIsencaoGanho(e.target.checked)} className="mt-0.5" />
              <span className="font-sans text-xs" style={{ color: NAVY }}>
                Isento de ganho de capital
                <span className="block" style={{ color: INK_SECOND }}>Único imóvel até R$ 440 mil, ou reinvestimento em 180 dias.</span>
              </span>
            </label>

            {!isencaoGanho && (
              <label className="flex items-start gap-2 mb-3 p-3 cursor-pointer" style={{ background: "#F3EFE6", borderRadius: "4px" }}>
                <input type="checkbox" checked={aplicarRedutor} onChange={(e) => setAplicarRedutor(e.target.checked)} className="mt-0.5" />
                <span className="font-sans text-xs" style={{ color: NAVY }}>
                  Aplicar redutor por tempo (Lei 11.196/05)
                  <span className="block" style={{ color: INK_SECOND }}>Reduz a base do ganho conforme os anos desde a aquisição.</span>
                </span>
              </label>
            )}
            {!isencaoGanho && aplicarRedutor && (
              <>
                {label("Ano de aquisição do imóvel")}
                {num(anoAquisicao, (n) => setAnoAquisicao(Math.round(n)), 1)}
              </>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>{label("Corretagem %")}{num(corretagemPct, setCorretagemPct, 0.5)}</div>
              <div>{label("Inventário %")}{num(inventarioPct, setInventarioPct, 0.5)}</div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>{label("Meses até vender")}{num(mesesEspera, (n) => setMesesEspera(Math.round(n)), 1)}</div>
              <div>{label("Valorização a.a. %")}{num(valorizacaoAnualPct, setValorizacaoAnualPct, 0.5)}</div>
            </div>

            {label("Manutenção mensal do espólio (R$)")}
            {num(manutencaoMensal, setManutencaoMensal, 100)}

            <label className="flex items-start gap-2 mb-3 p-3 cursor-pointer" style={{ background: "#F3EFE6", borderRadius: "4px" }}>
              <input type="checkbox" checked={usarOportunidade} onChange={(e) => setUsarOportunidade(e.target.checked)} className="mt-0.5" />
              <span className="font-sans text-xs" style={{ color: NAVY }}>
                Considerar custo de oportunidade
                <span className="block" style={{ color: INK_SECOND }}>Rendimento do dinheiro se vender agora e investir.</span>
              </span>
            </label>
            {usarOportunidade && (
              <>
                {label("Rendimento do investimento a.a. %")}
                {num(taxaOportunidadePct, setTaxaOportunidadePct, 0.5)}
              </>
            )}
          </div>

          {/* Resultado */}
          <div className="p-6 relative flex flex-col justify-center" style={{ background: NAVY, color: PAPER, borderRadius: "0 4px 4px 0" }}>
            <div style={{ position: "absolute", top: "16px", right: "16px", border: `1px dashed ${BRASS}`, borderRadius: "50%", width: "72px", height: "72px", display: "flex", alignItems: "center", justifyContent: "center", transform: "rotate(-9deg)", textAlign: "center", padding: "4px" }}>
              <span className="font-sans" style={{ color: BRASS, fontSize: "8px", letterSpacing: "0.08em", lineHeight: 1.3 }}>
                ESTIMATIVA EDUCATIVA
              </span>
            </div>

            <p className="font-sans text-xs uppercase tracking-wide mb-1" style={{ color: "#8FA0B3" }}>
              {r.aguardarVantajoso ? "Aguardar tende a render mais" : "Vender agora tende a compensar"}
            </p>
            <p className="font-serif text-3xl mb-1" style={{ color: PAPER }}>
              +{formatBRL(Math.abs(r.diferenca))}
            </p>
            <p className="font-sans text-xs mb-4" style={{ color: "#8FA0B3" }}>
              diferença a favor de {r.aguardarVantajoso ? `aguardar ${mesesEspera} meses` : "vender agora"}
              {usarOportunidade ? ", já contando o custo de oportunidade" : ""}.
            </p>

            <div className="pt-3" style={{ borderTop: `0.5px solid ${NAVY_SOFT}` }}>
              <p className="font-sans text-xs mb-1 flex justify-between gap-4" style={{ color: "#DDE3E9" }}>
                <span>Vender agora — líquido</span>
                <span>{formatBRL(r.cenA.liquido)}</span>
              </p>
              <p className="font-sans text-xs mb-1 flex justify-between gap-4" style={{ color: "#DDE3E9" }}>
                <span>Aguardar {mesesEspera} meses — líquido</span>
                <span>{formatBRL(r.cenB.liquido)}</span>
              </p>
              {usarOportunidade && (
                <p className="font-sans text-xs mt-2" style={{ color: "#8FA0B3" }}>
                  Vender agora e investir renderia {formatBRL(r.aFuturo)} em {mesesEspera} meses.
                </p>
              )}
            </div>
          </div>
        </div>

        <p className="font-sans text-xs mb-16" style={{ color: INK_SECOND }}>
          Simulação educativa. O ganho de capital tem isenções e redutores específicos (Lei 11.196/05 e
          outras) e o ITCMD varia por estado (2% a 8%). Não confundir o ITCMD, da sucessão, com o ITBI,
          devido pelo comprador. Não substitui a análise contábil e jurídica do caso concreto.
        </p>

        <div className="mb-16">
          <h2 className="font-serif text-2xl mb-4" style={{ color: NAVY }}>
            Vender rápido ou esperar a partilha?
          </h2>
          <div className="font-sans text-sm leading-relaxed space-y-3" style={{ color: "#3A4552" }}>
            <p>
              Muitos herdeiros ficam em dúvida entre vender o imóvel logo — ainda pelo espólio ou assim
              que sai a partilha — ou segurar o bem esperando valorização. A resposta depende de números
              que raramente aparecem juntos: ITCMD, ganho de capital, corretagem, custos do inventário e,
              no caso de esperar, a manutenção mensal do imóvel parado e o rendimento que o dinheiro
              deixaria de render.
            </p>
            <p>
              Esta ferramenta coloca os dois caminhos lado a lado, trazendo o cenário de vender agora para
              a mesma data do cenário de esperar (via custo de oportunidade), para uma comparação justa.
              Um detalhe importante: se o imóvel for declarado no inventário a valor de mercado, vender
              logo em seguida costuma gerar pouco ou nenhum ganho de capital.
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
                <p className="font-sans text-sm font-medium mb-1" style={{ color: NAVY }}>{item.q}</p>
                <p className="font-sans text-sm" style={{ color: INK_SECOND }}>{item.a}</p>
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

        <LeadForm origem="Vender Imóvel Herdado vs. Espólio" resumo={resumoLead} />
      </div>
    </div>
  );
}
