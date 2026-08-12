"use client";
import { useState, useMemo } from "react";
import LeadForm from "@/app/components/LeadForm";

const NAVY = "#1B2A41";
const NAVY_SOFT = "#2A3D57";
const PAPER = "#FAF9F5";
const PAPER_LINE = "#DDD8CC";
const BRASS = "#A9834B";
const INK_SECOND = "#5C6B7A";

const MODALIDADES = [
  { id: "extraordinaria", nome: "Extraordinária", artigo: "art. 1.238 CC", prazo: 15, prazoReduzido: 10, reducaoLabel: "Moradia habitual OU obras/serviços produtivos → 10 anos", requisitos: ["Posse mansa, pacífica e ininterrupta, sem oposição", "Dispensa justo título e boa-fé"] },
  { id: "ordinaria", nome: "Ordinária", artigo: "art. 1.242 CC", prazo: 10, prazoReduzido: 5, reducaoLabel: "Aquisição onerosa com registro cancelado + moradia/obra → 5 anos", requisitos: ["Exige justo título e boa-fé", "Posse contínua e sem oposição"] },
  { id: "especial_urbana", nome: "Especial Urbana", artigo: "art. 1.240 CC / 183 CF", prazo: 5, prazoReduzido: null, requisitos: ["Área urbana de até 250 m²", "Uso para moradia própria ou da família", "Não pode ser proprietário de outro imóvel", "Admitida uma única vez"] },
  { id: "especial_rural", nome: "Especial Rural (pro labore)", artigo: "art. 1.239 CC / 191 CF", prazo: 5, prazoReduzido: null, requisitos: ["Área rural de até 50 hectares", "Tornar a terra produtiva + moradia ou trabalho", "Não pode ser proprietário de outro imóvel"] },
  { id: "familiar", nome: "Familiar", artigo: "art. 1.240-A CC", prazo: 2, prazoReduzido: null, requisitos: ["Imóvel urbano de até 250 m²", "Abandono do lar pelo ex-cônjuge/companheiro", "Copropriedade do casal", "Não pode ser proprietário de outro imóvel"] },
  { id: "coletiva", nome: "Coletiva Urbana", artigo: "art. 10 Estatuto da Cidade", prazo: 5, prazoReduzido: null, requisitos: ["Área urbana com mais de 250 m²", "Posse conjunta por população de baixa renda", "Impossível individualizar os lotes"] },
];

const MESES = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
const fmtData = (d) => `${d.getDate()} de ${MESES[d.getMonth()]} de ${d.getFullYear()}`;

function difYMD(de, ate) {
  let y = ate.getFullYear() - de.getFullYear();
  let m = ate.getMonth() - de.getMonth();
  let d = ate.getDate() - de.getDate();
  if (d < 0) { m -= 1; d += new Date(ate.getFullYear(), ate.getMonth(), 0).getDate(); }
  if (m < 0) { y -= 1; m += 12; }
  return { y, m, d };
}
function duracao(de, ate) {
  const { y, m, d } = difYMD(de, ate);
  const p = [];
  if (y > 0) p.push(`${y} ${y === 1 ? "ano" : "anos"}`);
  if (m > 0) p.push(`${m} ${m === 1 ? "mês" : "meses"}`);
  if (y === 0 && d > 0) p.push(`${d} ${d === 1 ? "dia" : "dias"}`);
  return p.length ? p.join(" e ") : "menos de um dia";
}

const FAQ = [
  { q: "O que conta como início da posse?", a: "É quando você passou a ocupar o imóvel como dono — morando, cuidando, pagando contas e impostos — de forma mansa, pacífica e sem oposição. Documentos antigos (contas, IPTU, contratos) ajudam a provar essa data." },
  { q: "Posso somar o tempo de quem morou antes de mim?", a: "Sim. A soma de posses (art. 1.243 do CC) permite acrescentar o tempo do antecessor quando você recebeu a posse por herança ou compra da posse. Informe esses meses no campo próprio para adiantar o prazo." },
  { q: "Cumprir o prazo já garante a propriedade?", a: "Não automaticamente. O prazo é uma das condições; é preciso ainda preencher os demais requisitos da modalidade e formalizar o reconhecimento pela via extrajudicial (cartório) ou judicial." },
  { q: "Qual a diferença entre a via extrajudicial e a judicial?", a: "A extrajudicial corre no Cartório de Registro de Imóveis e costuma ser mais rápida quando não há conflito e o proprietário e confrontantes são localizáveis. A judicial é indicada quando há litígio, proprietário desaparecido ou prova de posse mais frágil." },
];

const RELACIONADAS = [
  ["Regularização de imóveis", "/"],
  ["Calculadora de Lance em Leilão", "/calculadora-lance-leilao"],
  ["Vender imóvel herdado vs. espólio", "/vender-imovel-herdado"],
];

export default function CalculadoraUsucapiao() {
  const [modId, setModId] = useState("extraordinaria");
  const [inicio, setInicio] = useState("");
  const [reduzido, setReduzido] = useState(false);
  const [mesesAnteriores, setMesesAnteriores] = useState(0);

  const mod = MODALIDADES.find((m) => m.id === modId);
  const temReducao = mod.prazoReduzido != null;
  const prazoAnos = temReducao && reduzido ? mod.prazoReduzido : mod.prazo;

  const resultado = useMemo(() => {
    if (!inicio) return null;
    const ini = new Date(inicio + "T00:00:00");
    if (isNaN(ini.getTime())) return null;
    const inicioEfetivo = new Date(ini);
    inicioEfetivo.setMonth(inicioEfetivo.getMonth() - (mesesAnteriores || 0));
    const conclusao = new Date(inicioEfetivo);
    conclusao.setFullYear(conclusao.getFullYear() + prazoAnos);
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const cumprido = hoje.getTime() >= conclusao.getTime();
    const prog = Math.max(0, Math.min(100, ((hoje - inicioEfetivo) / (conclusao - inicioEfetivo)) * 100));
    return {
      inicioEfetivo, conclusao, cumprido, prog,
      faltam: cumprido ? "" : duracao(hoje, conclusao),
      ha: cumprido ? duracao(conclusao, hoje) : "",
    };
  }, [inicio, mesesAnteriores, prazoAnos]);

  const resumoLead = `Modalidade ${mod.nome} (prazo ${prazoAnos} anos). ${resultado ? (resultado.cumprido ? `Prazo cumprido em ${fmtData(resultado.conclusao)}.` : `Faltam ${resultado.faltam}.`) : "Data de posse não informada."}`;

  const label = (t) => (
    <label className="block font-sans text-xs uppercase tracking-wide mb-2" style={{ color: INK_SECOND }}>{t}</label>
  );
  const fieldStyle = { border: `0.5px solid ${PAPER_LINE}`, borderRadius: "4px", color: NAVY, background: "#fff" };

  return (
    <div style={{ background: PAPER, minHeight: "100%" }} className="w-full">
      <div className="max-w-3xl mx-auto px-6 py-14">
        <p className="text-xs font-sans tracking-widest uppercase mb-3" style={{ color: BRASS, letterSpacing: "0.15em" }}>
          Inventariano · Calculadora
        </p>
        <h1 className="font-serif text-4xl mb-3 leading-tight" style={{ color: NAVY }}>
          Calculadora de Usucapião — Prazo Restante
        </h1>
        <p className="font-sans text-base mb-10 max-w-xl" style={{ color: INK_SECOND }}>
          Descubra se você já completou o tempo de posse exigido pela sua modalidade de usucapião — e
          quanto ainda falta.
        </p>

        <div className="grid md:grid-cols-2 gap-0 mb-4" style={{ border: `0.5px solid ${PAPER_LINE}`, borderRadius: "4px" }}>
          {/* Entradas */}
          <div className="p-6 md:border-r" style={{ borderColor: PAPER_LINE }}>
            {label("Modalidade de usucapião")}
            <select
              value={modId}
              onChange={(e) => { setModId(e.target.value); setReduzido(false); }}
              className="w-full mb-4 px-3 py-2 font-sans text-sm"
              style={fieldStyle}
            >
              {MODALIDADES.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nome} — {m.prazo}{m.prazoReduzido ? `/${m.prazoReduzido}` : ""} anos ({m.artigo})
                </option>
              ))}
            </select>

            {temReducao && (
              <label className="flex items-start gap-2 mb-4 p-3 cursor-pointer" style={{ background: "#F3EFE6", borderRadius: "4px" }}>
                <input type="checkbox" checked={reduzido} onChange={(e) => setReduzido(e.target.checked)} className="mt-0.5" />
                <span className="font-sans text-xs" style={{ color: NAVY }}>
                  Aplicar prazo reduzido
                  <span className="block" style={{ color: INK_SECOND }}>{mod.reducaoLabel}</span>
                </span>
              </label>
            )}

            {label("Início da posse")}
            <input
              type="date"
              value={inicio}
              max={new Date().toISOString().slice(0, 10)}
              onChange={(e) => setInicio(e.target.value)}
              className="w-full mb-4 px-3 py-2 font-sans text-base"
              style={fieldStyle}
            />

            {label("Posse anterior somável (meses)")}
            <input
              type="number"
              min={0}
              step={1}
              value={mesesAnteriores}
              onChange={(e) => setMesesAnteriores(parseInt(e.target.value) || 0)}
              className="w-full mb-2 px-3 py-2 font-sans text-base"
              style={fieldStyle}
            />
            <p className="font-sans text-xs" style={{ color: INK_SECOND }}>
              Soma de posses (art. 1.243 CC): meses do antecessor que você pode acrescentar. Deixe 0 se
              não houver.
            </p>
          </div>

          {/* Resultado */}
          <div className="p-6 relative flex flex-col justify-center" style={{ background: NAVY, color: PAPER, borderRadius: "0 4px 4px 0" }}>
            <div style={{ position: "absolute", top: "16px", right: "16px", border: `1px dashed ${BRASS}`, borderRadius: "50%", width: "72px", height: "72px", display: "flex", alignItems: "center", justifyContent: "center", transform: "rotate(-9deg)", textAlign: "center", padding: "4px" }}>
              <span className="font-sans" style={{ color: BRASS, fontSize: "8px", letterSpacing: "0.08em", lineHeight: 1.3 }}>
                ESTIMATIVA EDUCATIVA
              </span>
            </div>

            {!resultado ? (
              <p className="font-sans text-sm" style={{ color: "#B9C2CE" }}>
                Informe a data de início da posse para ver o prazo restante.
              </p>
            ) : (
              <div>
                {resultado.cumprido ? (
                  <>
                    <p className="font-sans text-xs uppercase tracking-wide mb-1" style={{ color: "#9BD1B6" }}>
                      Prazo cumprido
                    </p>
                    <p className="font-serif text-2xl mb-1" style={{ color: PAPER }}>
                      {prazoAnos} anos concluídos
                    </p>
                    <p className="font-sans text-xs mb-4" style={{ color: "#8FA0B3" }}>
                      Cumprido em {fmtData(resultado.conclusao)} — há {resultado.ha}. Já é possível
                      requerer o reconhecimento.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="font-sans text-xs uppercase tracking-wide mb-1" style={{ color: "#8FA0B3" }}>
                      Ainda faltam
                    </p>
                    <p className="font-serif text-3xl mb-1" style={{ color: PAPER }}>
                      {resultado.faltam}
                    </p>
                    <p className="font-sans text-xs mb-4" style={{ color: "#8FA0B3" }}>
                      O prazo de {prazoAnos} anos se completa em {fmtData(resultado.conclusao)}.
                    </p>
                  </>
                )}

                <div style={{ height: "8px", borderRadius: "4px", background: NAVY_SOFT, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${resultado.prog}%`, background: BRASS }} />
                </div>
                <div className="flex justify-between mt-1 font-sans" style={{ fontSize: "11px", color: "#8FA0B3" }}>
                  <span>Início: {fmtData(resultado.inicioEfetivo)}</span>
                  <span>{Math.round(resultado.prog)}%</span>
                </div>

                <div className="mt-4 pt-3" style={{ borderTop: `0.5px solid ${NAVY_SOFT}` }}>
                  <p className="font-sans text-xs uppercase tracking-wide mb-2" style={{ color: "#8FA0B3" }}>
                    Requisitos além do tempo
                  </p>
                  {mod.requisitos.map((r, i) => (
                    <p key={i} className="font-sans text-xs mb-1" style={{ color: "#DDE3E9" }}>• {r}</p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <p className="font-sans text-xs mb-16" style={{ color: INK_SECOND }}>
          Simulação educativa baseada nas regras gerais do Código Civil, da Constituição Federal e do
          Estatuto da Cidade. O cômputo do prazo pode ser afetado por interrupção da posse, oposição do
          proprietário, sucessão e regras de transição — confirme com um advogado antes de agir.
        </p>

        <div className="mb-16">
          <h2 className="font-serif text-2xl mb-4" style={{ color: NAVY }}>
            Como funciona o prazo da usucapião
          </h2>
          <div className="font-sans text-sm leading-relaxed space-y-3" style={{ color: "#3A4552" }}>
            <p>
              A usucapião é a aquisição da propriedade pela posse prolongada. Cada modalidade tem um
              prazo próprio — de 2 anos (familiar) a 15 anos (extraordinária) — e requisitos específicos,
              como área máxima, finalidade de moradia e não ser proprietário de outro imóvel.
            </p>
            <p>
              A calculadora considera a data em que a posse começou, aplica o prazo da modalidade
              escolhida e, se for o caso, a soma de posses do antecessor, mostrando quanto tempo já
              transcorreu e quanto falta. Lembre-se: cumprir o prazo é condição necessária, mas não
              suficiente — os demais requisitos precisam estar presentes e o reconhecimento precisa ser
              formalizado.
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

        <LeadForm origem="Calculadora de Usucapião" resumo={resumoLead} />
      </div>
    </div>
  );
}
