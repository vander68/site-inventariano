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

function calcularDivisao({ valorImovel, herdeiros, ficaComQuem }) {
  const valor = Math.max(0, valorImovel || 0);
  if (valor <= 0 || herdeiros.length === 0) return null;

  const quinhao = valor / herdeiros.length;

  if (ficaComQuem === "" || ficaComQuem === "vender") {
    return {
      modo: "vender",
      quinhao,
      linhas: herdeiros.map((h) => ({ nome: h.nome, valor: quinhao })),
    };
  }

  const indice = herdeiros.findIndex((h) => h.nome === ficaComQuem);
  if (indice === -1) {
    return {
      modo: "vender",
      quinhao,
      linhas: herdeiros.map((h) => ({ nome: h.nome, valor: quinhao })),
    };
  }

  const tornaTotal = valor - quinhao;
  const linhas = herdeiros.map((h, i) => {
    if (i === indice) {
      return { nome: h.nome, fica: true, paga: tornaTotal, recebeImovel: valor, liquido: quinhao };
    }
    return { nome: h.nome, fica: false, recebe: quinhao };
  });

  return { modo: "torna", quinhao, tornaTotal, ficaComQuem, linhas };
}

export default function CalculadoraDivisaoImovel() {
  const [valorImovel, setValorImovel] = useState("700000");
  const [herdeiros, setHerdeiros] = useState([{ nome: "Herdeiro 1" }, { nome: "Herdeiro 2" }]);
  const [ficaComQuem, setFicaComQuem] = useState("vender");

  const resultado = useMemo(
    () =>
      calcularDivisao({
        valorImovel: parseFloat(valorImovel.replace(/\./g, "").replace(",", ".")) || 0,
        herdeiros,
        ficaComQuem,
      }),
    [valorImovel, herdeiros, ficaComQuem]
  );

  function atualizarNome(i, nome) {
    const novos = [...herdeiros];
    novos[i] = { nome };
    setHerdeiros(novos);
  }

  function adicionarHerdeiro() {
    setHerdeiros([...herdeiros, { nome: `Herdeiro ${herdeiros.length + 1}` }]);
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
          Divisão de imóvel entre herdeiros
        </h1>
        <p className="font-sans text-base mb-10 max-w-xl" style={{ color: INK_SECOND }}>
          Veja o quinhão de cada herdeiro se o imóvel for vendido, ou o valor
          da torna se um herdeiro ficar com o imóvel e pagar os demais.
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
              Valor do imóvel
            </label>
            <input
              type="text"
              inputMode="decimal"
              value={valorImovel}
              onChange={(e) => setValorImovel(e.target.value)}
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
              Herdeiros
            </label>
            <div className="space-y-2 mb-3">
              {herdeiros.map((h, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={h.nome}
                    onChange={(e) => atualizarNome(i, e.target.value)}
                    className="flex-1 px-3 py-2 font-sans text-sm"
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
              className="font-sans text-sm px-3 py-2 mb-5"
              style={{ border: `0.5px solid ${PAPER_LINE}`, borderRadius: "4px", color: NAVY, background: "#fff" }}
            >
              + Adicionar herdeiro
            </button>

            <label
              className="block font-sans text-xs uppercase tracking-wide mb-2"
              style={{ color: INK_SECOND }}
            >
              O que fazer com o imóvel
            </label>
            <select
              value={ficaComQuem}
              onChange={(e) => setFicaComQuem(e.target.value)}
              className="w-full px-3 py-2 font-sans text-sm"
              style={{
                border: `0.5px solid ${PAPER_LINE}`,
                borderRadius: "4px",
                color: NAVY,
                background: "#fff",
              }}
            >
              <option value="vender">Vender e dividir o valor</option>
              {herdeiros.map((h, i) => (
                <option key={i} value={h.nome}>
                  {h.nome || `Herdeiro ${i + 1}`} fica com o imóvel
                </option>
              ))}
            </select>
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
                Informe o valor e ao menos um herdeiro para ver a divisão.
              </p>
            )}

            {resultado && resultado.modo === "vender" && (
              <div>
                <p
                  className="font-sans text-xs uppercase tracking-wide mb-2"
                  style={{ color: "#8FA0B3" }}
                >
                  Quinhão de cada herdeiro (venda)
                </p>
                <div className="space-y-2">
                  {resultado.linhas.map((l, i) => (
                    <div key={i} className="flex justify-between font-sans text-sm">
                      <span style={{ color: "#DDE3E9" }}>{l.nome}</span>
                      <span style={{ color: PAPER }}>{formatBRL(l.valor)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {resultado && resultado.modo === "torna" && (
              <div>
                <p
                  className="font-sans text-xs uppercase tracking-wide mb-1"
                  style={{ color: "#8FA0B3" }}
                >
                  Torna total a pagar
                </p>
                <p className="font-serif text-2xl mb-4" style={{ color: PAPER }}>
                  {formatBRL(resultado.tornaTotal)}
                </p>
                <div className="pt-3 space-y-2" style={{ borderTop: `0.5px solid ${NAVY_SOFT}` }}>
                  {resultado.linhas.map((l, i) => (
                    <div key={i} className="flex justify-between font-sans text-sm">
                      <span style={{ color: "#DDE3E9" }}>
                        {l.nome}
                        {l.fica ? " (fica com o imóvel)" : ""}
                      </span>
                      <span style={{ color: PAPER }}>
                        {l.fica ? `paga ${formatBRL(l.paga)}` : `recebe ${formatBRL(l.recebe)}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <p className="font-sans text-xs mb-16" style={{ color: INK_SECOND }}>
          Simulação educativa. Não inclui ITBI/ITCMD, custos de venda
          (corretagem, cartório), nem eventuais benfeitorias que um herdeiro
          tenha feito no imóvel — esses fatores podem alterar o valor justo
          da torna no caso concreto.
        </p>

        <div className="mb-16">
          <h2 className="font-serif text-2xl mb-4" style={{ color: NAVY }}>
            Vender ou ficar com o imóvel: como funciona a torna
          </h2>
          <div className="font-sans text-sm leading-relaxed space-y-3" style={{ color: "#3A4552" }}>
            <p>
              Quando um imóvel não pode ou não deve ser dividido fisicamente
              (a maioria dos casos), os herdeiros têm duas saídas: vender e
              dividir o dinheiro, ou um herdeiro ficar com o imóvel e pagar
              aos demais o valor correspondente ao quinhão deles — isso se
              chama torna.
            </p>
            <p>
              A torna existe justamente para manter a divisão justa: quem
              fica com o imóvel recebe mais valor em bem do que o seu
              quinhão, então precisa compensar os outros herdeiros em
              dinheiro pela diferença.
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
                q: "A torna paga entre herdeiros tem imposto?",
                a: "Pode incidir ITBI sobre a parte que corresponde à compra do quinhão dos outros herdeiros, dependendo do município e de como a operação é estruturada — vale confirmar com um advogado antes de fechar o acordo.",
              },
              {
                q: "E se ninguém quiser ficar com o imóvel?",
                a: "Nesse caso, o caminho mais comum é vender e dividir o valor entre os herdeiros, na proporção do quinhão de cada um.",
              },
              {
                q: "Todos os herdeiros precisam concordar com quem fica com o imóvel?",
                a: "No inventário extrajudicial sim. Havendo desacordo, o inventário precisa ser judicial, e o juiz pode determinar a venda judicial do bem (leilão) se não houver consenso.",
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
            {["Calculadora de partilha", "Calculadora de herança", "Calculadora de ITCMD", "Custos de inventário"].map(
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
              Tem um imóvel para dividir no inventário?
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
