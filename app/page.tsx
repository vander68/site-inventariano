import Link from "next/link";

const WA_VANDERLEI = "5511993233066";
const WA_MARIA = "5511991818762";
const WA_MAIN = `https://wa.me/${WA_VANDERLEI}?text=Ol%C3%A1!%20Gostaria%20de%20uma%20consulta%20sobre%20invent%C3%A1rio.`;
const WA_CTA = `https://wa.me/${WA_VANDERLEI}?text=Ol%C3%A1!%20Gostaria%20de%20uma%20consulta%20gratuita.`;

const especialidade = [
  ["⚖️", "Inventário Judicial", "Para casos com litígio ou herdeiros menores"],
  ["📋", "Inventário Extrajudicial", "Rápido, via cartório, sem processo judicial"],
  ["🏠", "Regularização de Imóveis", "Escritura, registro e usucapião"],
  ["📜", "Planejamento Sucessório", "Doação em vida e testamento"],
];

const servicos = [
  ["⚖️", "Inventário Judicial", "Quando há conflito entre herdeiros, menores de idade ou testamento contestado, atuamos com expertise para resolver com eficiência perante o juiz."],
  ["📋", "Inventário Extrajudicial", "A forma mais rápida e econômica para partilhar bens quando não há litígio. Realizamos todo o processo via cartório em tempo recorde."],
  ["🏠", "Regularização de Imóveis", "Imóvel sem escritura, registro ou documentação irregular? Cuidamos de toda a regularização para garantir sua segurança jurídica."],
  ["🔑", "Usucapião", "Você mora há anos em um imóvel sem documentação? A usucapião garante seu direito de propriedade. Analisamos seu caso sem custo inicial."],
  ["📜", "Testamento e Doação", "Planeje com antecedência a transmissão do seu patrimônio, protegendo sua família e reduzindo custos futuros de inventário."],
  ["🤝", "Partilha Amigável", "Mediamos acordos entre herdeiros para uma partilha justa e harmoniosa, evitando conflitos e processos judiciais desnecessários."],
];

const calculadoras = [
  ["Calculadora de Herança", "Estime a divisão da herança entre os herdeiros.", "/calculadora-de-heranca"],
  ["Calculadora de ITCMD", "Faça uma estimativa do imposto sobre a transmissão de bens.", "/calculadora-de-itcmd"],
  ["Calculadora de Meação", "Entenda a parcela patrimonial do meeiro conforme o regime de bens.", "/calculadora-de-meacao"],
  ["Calculadora de Partilha", "Simule a distribuição do patrimônio entre os interessados.", "/calculadora-de-partilha"],
  ["Custos de Inventário", "Tenha uma visão inicial dos principais custos envolvidos.", "/custos-de-inventario"],
  ["Prazo de Inventário", "Consulte informações e referências sobre prazos.", "/prazo-inventario"],
  ["Lance Mínimo em Leilão", "Calcule o desconto real da 2ª praça somando comissão, ITBI e custos.", "/calculadora-lance-leilao"],
  ["Usucapião — Prazo Restante", "Veja se você já completou o tempo de posse exigido e quanto falta.", "/calculadora-usucapiao"],
  ["Vender Imóvel Herdado vs. Espólio", "Compare vender agora ou aguardar a partilha, com impostos e custos.", "/vender-imovel-herdado"],
];

const passos = [
  ["01", "Consulta Gratuita", "Entre em contato pelo WhatsApp ou formulário. Analisamos seu caso sem custo e sem compromisso.", true],
  ["02", "Análise Documental", "Levantamos todos os documentos necessários e mapeamos o caminho mais rápido para o seu caso.", false],
  ["03", "Proposta Clara", "Apresentamos os honorários e prazo estimado com total transparência, sem cobranças surpresa.", false],
  ["04", "Execução e Resultado", "Cuidamos de tudo. Você acompanha o progresso e recebe os documentos finais sem burocracia.", false],
];

const diferenciais = [
  ["Foco total em inventários e imóveis", "não somos escritório genérico. Toda nossa estrutura é voltada para essa área."],
  ["Atendimento em todo o Brasil", "processos extrajudiciais e consultoria online para clientes de qualquer estado."],
  ["Honorários justos e parcelados", "trabalhamos com condições acessíveis para que a burocracia não seja um obstáculo financeiro."],
  ["Prazo cumprido", "nos comprometemos com prazos realistas e mantemos você informado em cada etapa."],
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f5f0e8] font-sans text-[#2a2a2a]">
      {/* NAV */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-[#c9a84c]/20 bg-[#0e0e0e]/95 backdrop-blur">
        <div className="mx-auto flex h-[70px] max-w-7xl items-center justify-between px-5 lg:px-10">
          <Link href="/" className="flex items-center">
            <img src="/logo.png" alt="Inventariano – Direito de Sucessões e Regularização de Imóveis" className="h-12 w-auto" />
          </Link>
          <nav className="hidden items-center gap-8 md:flex">
            <a href="#servicos" className="text-sm uppercase tracking-[0.08em] text-white/75 transition hover:text-[#c9a84c]">Serviços</a>
            <a href="#calculadoras" className="text-sm uppercase tracking-[0.08em] text-white/75 transition hover:text-[#c9a84c]">Calculadoras</a>
            <a href="#como-funciona" className="text-sm uppercase tracking-[0.08em] text-white/75 transition hover:text-[#c9a84c]">Como Funciona</a>
            <a href="#equipe" className="text-sm uppercase tracking-[0.08em] text-white/75 transition hover:text-[#c9a84c]">Equipe</a>
            <a href="#sobre" className="text-sm uppercase tracking-[0.08em] text-white/75 transition hover:text-[#c9a84c]">Sobre</a>
            <a href="#contato" className="rounded-sm bg-[#c9a84c] px-5 py-2.5 text-sm font-bold text-[#0e0e0e] transition hover:bg-[#e8c97a]">Consulta Gratuita</a>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="relative grid min-h-screen overflow-hidden bg-[#0e0e0e] lg:grid-cols-2">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_70%_40%,rgba(201,168,76,0.08),transparent_70%)]" />
        <div className="relative z-[2] flex flex-col justify-center px-6 pb-20 pt-32 sm:px-[8%] lg:pt-40">
          <div className="mb-7 flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-[#c9a84c]">
            <span className="block h-px w-8 bg-[#c9a84c]" /> Escritório Especializado
          </div>
          <h1 className="font-serif text-[clamp(2.6rem,4.5vw,4rem)] font-black leading-[1.12] text-white">
            Inventário e<br />
            <span className="text-[#c9a84c]">Regularização</span>
            <br />de Imóveis
          </h1>
          <p className="mt-6 max-w-[440px] text-[1.05rem] leading-[1.75] text-white/60">
            Resolvemos sua herança com segurança, agilidade e transparência. Do inventário judicial ao extrajudicial — cuidamos de cada etapa por você.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <a href={WA_MAIN} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-sm bg-[#c9a84c] px-8 py-[0.9rem] font-bold text-[#0e0e0e] transition hover:-translate-y-0.5 hover:bg-[#e8c97a]">💬 Falar no WhatsApp</a>
            <a href="#servicos" className="inline-flex items-center gap-2 rounded-sm border border-[#c9a84c]/50 px-8 py-[0.9rem] text-[#c9a84c] transition hover:border-[#c9a84c] hover:bg-[#c9a84c]/10">Conheça nossos serviços</a>
          </div>
          <div className="mt-14 flex flex-wrap gap-10 border-t border-white/10 pt-10">
            <div>
              <div className="font-serif text-[2rem] font-bold text-[#c9a84c]">500+</div>
              <div className="mt-1 text-xs uppercase tracking-[0.06em] text-white/45">Casos concluídos</div>
            </div>
            <div>
              <div className="font-serif text-[2rem] font-bold text-[#c9a84c]">15+</div>
              <div className="mt-1 text-xs uppercase tracking-[0.06em] text-white/45">Anos de experiência</div>
            </div>
            <div>
              <div className="font-serif text-[2rem] font-bold text-[#c9a84c]">98%</div>
              <div className="mt-1 text-xs uppercase tracking-[0.06em] text-white/45">Clientes satisfeitos</div>
            </div>
          </div>
        </div>

        <div className="relative hidden items-center justify-center lg:flex">
          <div className="relative z-[2] w-4/5 max-w-[420px]">
            <div className="rounded border border-[#c9a84c]/20 bg-white/[.04] p-10 backdrop-blur">
              <div className="mb-6 flex justify-center border-b border-[#c9a84c]/20 pb-5">
                <img src="/logo.png" alt="Inventariano" className="h-20 w-auto" />
              </div>
              <div className="mb-6 border-b border-[#c9a84c]/20 pb-4 font-serif text-xl text-[#c9a84c]">Nossa Especialidade</div>
              {especialidade.map(([icon, title, desc], i) => (
                <div key={title} className={`flex items-start gap-4 py-[0.9rem] ${i < especialidade.length - 1 ? "border-b border-white/5" : ""}`}>
                  <div className="flex h-[38px] w-[38px] flex-shrink-0 items-center justify-center rounded-sm bg-[#c9a84c]/10 text-[1.1rem]">{icon}</div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{title}</h4>
                    <p className="mt-0.5 text-[0.78rem] text-white/45">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SERVIÇOS */}
      <section id="servicos" className="bg-[#f5f0e8] px-6 py-24 sm:px-[8%]">
        <div className="mb-4 flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-[#c9a84c]">
          O que fazemos <span className="block h-px w-8 bg-[#c9a84c]" />
        </div>
        <h2 className="max-w-2xl font-serif text-[clamp(1.8rem,3vw,2.8rem)] font-bold leading-[1.2]">
          Soluções jurídicas<br />completas para sua família
        </h2>
        <p className="mt-4 max-w-[500px] leading-[1.7] text-[#6b6560]">
          Cada caso é único. Nossa equipe cuida de toda a parte burocrática para que você possa focar no que realmente importa.
        </p>

        <div className="mt-14 grid gap-px border-[1.5px] border-[#ede5d3] bg-[#ede5d3] sm:grid-cols-2 lg:grid-cols-3">
          {servicos.map(([icon, title, desc]) => (
            <div key={title} className="group relative overflow-hidden bg-white p-8 transition hover:bg-[#f5f0e8]">
              <span className="absolute inset-x-0 bottom-0 h-[3px] origin-left scale-x-0 bg-[#c9a84c] transition-transform duration-300 group-hover:scale-x-100" />
              <div className="text-[2rem]">{icon}</div>
              <h3 className="mt-5 font-serif text-xl font-bold">{title}</h3>
              <p className="mt-3 text-sm leading-[1.7] text-[#6b6560]">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CALCULADORAS */}
      <section id="calculadoras" className="bg-[#0e0e0e] px-6 py-24 sm:px-[8%]">
        <div className="mx-auto max-w-7xl">
          <div className="mb-4 flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-[#c9a84c]">
            Ferramentas gratuitas <span className="block h-px w-8 bg-[#c9a84c]" />
          </div>
          <h2 className="font-serif text-[clamp(1.8rem,3vw,2.8rem)] font-bold text-white">Calculadoras jurídicas</h2>
          <p className="mt-4 max-w-[520px] leading-[1.7] text-white/50">
            Use as ferramentas do Inventariano para obter uma estimativa inicial e entender melhor os números da sua situação.
          </p>
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {calculadoras.map(([title, desc, href]) => (
              <Link key={title} href={href} className="rounded border border-white/10 bg-white/[.03] p-6 transition hover:border-[#c9a84c]/50">
                <h3 className="font-serif text-lg font-bold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/45">{desc}</p>
                <span className="mt-4 inline-block text-sm font-bold text-[#c9a84c]">Abrir calculadora →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section id="como-funciona" className="relative overflow-hidden bg-[#0e0e0e] px-6 py-24 sm:px-[8%]">
        <div className="pointer-events-none absolute -right-24 -top-24 h-[500px] w-[500px] rounded-full border border-[#c9a84c]/[.06]" />
        <div className="relative mb-4 flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-[#c9a84c]">
          Processo <span className="block h-px w-8 bg-[#c9a84c]" />
        </div>
        <h2 className="font-serif text-[clamp(1.8rem,3vw,2.8rem)] font-bold leading-[1.2] text-white">
          Como resolvemos<br />seu caso
        </h2>
        <p className="mt-4 max-w-[500px] leading-[1.7] text-white/50">
          Um processo simples, transparente e sem surpresas do início ao fim.
        </p>

        <div className="mt-14 grid gap-px bg-white/[.06] sm:grid-cols-2 lg:grid-cols-4">
          {passos.map(([num, title, desc, gold]) => (
            <div key={num as string} className={`bg-[#181818] p-8 ${gold ? "border-t-[3px] border-[#c9a84c]" : ""}`}>
              <div className="font-serif text-[4rem] font-black leading-none text-[#c9a84c]/[.12]">{num}</div>
              <h3 className="mt-4 font-serif text-lg text-white">{title}</h3>
              <p className="mt-3 text-[0.88rem] leading-[1.65] text-white/45">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* NOSSA EQUIPE */}
      <section id="equipe" className="bg-[#f5f0e8] px-6 py-24 sm:px-[8%]">
        <div className="mx-auto max-w-6xl">
          <div className="mb-4 flex items-center justify-center gap-3 text-xs uppercase tracking-[0.2em] text-[#c9a84c]">
            <span className="block h-px w-8 bg-[#c9a84c]" /> Quem cuida do seu caso <span className="block h-px w-8 bg-[#c9a84c]" />
          </div>
          <h2 className="text-center font-serif text-[clamp(1.8rem,3vw,2.8rem)] font-bold leading-[1.2]">
            Nossa Equipe
          </h2>
          <p className="mx-auto mt-4 max-w-[560px] text-center leading-[1.7] text-[#6b6560]">
            Advogados especializados em direito sucessório e regularização de imóveis — experiência, ética e compromisso com os seus direitos.
          </p>
          <div className="mt-12 overflow-hidden rounded-lg border border-[#c9a84c]/25 shadow-[0_20px_60px_-15px_rgba(14,14,14,0.4)]">
            <img
              src="/equipe.png"
              alt="Equipe Motta Alves Sociedade de Advogados — Dra. Maria Antônia Motta (OAB/SP 146.857) e Dr. Vanderlei Alves (OAB/SP 270.182)"
              className="h-auto w-full"
            />
          </div>
        </div>
      </section>

      {/* POR QUE NÓS / SOBRE */}
      <section id="sobre" className="grid items-center gap-16 bg-[#ede5d3] px-6 py-24 sm:px-[8%] lg:grid-cols-2">
        <div>
          <div className="mb-4 flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-[#c9a84c]">
            Por que nos escolher <span className="block h-px w-8 bg-[#c9a84c]" />
          </div>
          <h2 className="font-serif text-[clamp(1.8rem,3vw,2.8rem)] font-bold leading-[1.2]">
            Especialistas onde<br />outros generalizam
          </h2>
          <ul className="mt-8 flex flex-col gap-5">
            {diferenciais.map(([strong, rest]) => (
              <li key={strong} className="flex items-start gap-4">
                <span className="mt-0.5 flex h-[22px] w-[22px] flex-shrink-0 items-center justify-center rounded-full bg-[#c9a84c] text-[0.7rem] text-[#0e0e0e]">✓</span>
                <p className="text-[0.95rem] leading-[1.6] text-[#2a2a2a]">
                  <strong>{strong}</strong> — {rest}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative overflow-hidden rounded bg-[#0e0e0e] p-10">
          <span className="pointer-events-none absolute -top-2 left-5 font-serif text-[8rem] leading-none text-[#c9a84c]/[.08]">&ldquo;</span>
          <blockquote className="relative z-[1] mb-6 text-[1rem] italic leading-[1.75] text-white/75">
            Após anos tentando resolver o inventário do meu pai sozinha, o escritório Inventariano resolveu tudo em menos de 4 meses. Foram transparentes, atenciosos e competentes do começo ao fim.
          </blockquote>
          <div className="flex items-center gap-4">
            <div className="flex h-[46px] w-[46px] items-center justify-center rounded-full bg-[#c9a84c] font-serif text-[1.1rem] font-bold text-[#0e0e0e]">M</div>
            <div>
              <div className="text-sm font-bold text-white">Maria Fernanda S.</div>
              <div className="text-[0.8rem] text-white/40">São Paulo – SP</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="contato" className="relative overflow-hidden bg-[#c9a84c] px-6 py-20 text-center sm:px-[8%]">
        <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_19px,rgba(0,0,0,0.04)_20px)]" />
        <h2 className="relative z-[1] font-serif text-[clamp(2rem,4vw,3rem)] font-black text-[#0e0e0e]">
          Resolva hoje o que<br />você adiou por anos
        </h2>
        <p className="relative z-[1] mt-4 text-[1.05rem] text-[#0e0e0e]/70">
          Consulta gratuita, sem compromisso. Fale com um especialista agora.
        </p>
        <a href={WA_CTA} target="_blank" rel="noreferrer" className="relative z-[1] mt-8 inline-flex items-center gap-2 rounded-sm bg-[#0e0e0e] px-10 py-4 font-bold text-[#c9a84c] transition hover:bg-[#111]">
          💬 Iniciar Consulta Gratuita
        </a>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#c9a84c]/15 bg-[#0e0e0e] px-6 py-12 sm:px-[8%]">
        <div className="mx-auto grid max-w-7xl gap-12 border-b border-white/[.06] pb-8 md:grid-cols-[2fr_1fr_1fr]">
          <div>
            <img src="/logo.png" alt="Inventariano" className="mb-2 h-[70px] w-auto" />
            <span className="block text-[0.8rem] font-light uppercase tracking-[0.08em] text-white/45">
              Motta Alves Sociedade de Advogados
            </span>
            <p className="mt-3 max-w-md text-[0.85rem] leading-[1.7] text-white/40">
              Especialistas em inventários judiciais e extrajudiciais, regularização de imóveis e planejamento sucessório.
            </p>
            <p className="mt-4 text-[0.85rem] leading-[1.7] text-white/40">
              📍 Rua Prof. Abraão de Morais, 1919<br />
              Jardim Saúde – São Paulo/SP<br />
              CEP 04123-011
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-[0.8rem] font-bold uppercase tracking-[0.15em] text-[#c9a84c]">Serviços</h4>
            <ul className="space-y-2 text-[0.88rem] text-white/50">
              <li><a href="#servicos" className="transition hover:text-[#c9a84c]">Inventário Judicial</a></li>
              <li><a href="#servicos" className="transition hover:text-[#c9a84c]">Inventário Extrajudicial</a></li>
              <li><a href="#servicos" className="transition hover:text-[#c9a84c]">Regularização de Imóveis</a></li>
              <li><a href="#servicos" className="transition hover:text-[#c9a84c]">Usucapião</a></li>
              <li><a href="#servicos" className="transition hover:text-[#c9a84c]">Testamento e Doação</a></li>
              <li><Link href="/blog.html" className="transition hover:text-[#c9a84c]">Blog</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-[0.8rem] font-bold uppercase tracking-[0.15em] text-[#c9a84c]">Nossa Equipe</h4>
            <ul className="space-y-5 text-[0.88rem] text-white/50">
              <li>
                <span className="block font-bold text-white/75">Dr. Vanderlei Alves</span>
                <span className="text-[0.78rem] text-white/35">OAB/SP 270182</span>
                <a href={`https://wa.me/${WA_VANDERLEI}`} target="_blank" rel="noreferrer" className="mt-1 block transition hover:text-[#c9a84c]">(11) 99323-3066</a>
                <a href="mailto:contato@inventariano.com.br" className="block transition hover:text-[#c9a84c]">contato@inventariano.com.br</a>
              </li>
              <li>
                <span className="block font-bold text-white/75">Dra. Maria Antonia Motta</span>
                <span className="text-[0.78rem] text-white/35">OAB/SP 146857</span>
                <a href={`https://wa.me/${WA_MARIA}`} target="_blank" rel="noreferrer" className="mt-1 block transition hover:text-[#c9a84c]">(11) 99181-8762</a>
                <a href="mailto:contato@inventariano.com.br" className="block transition hover:text-[#c9a84c]">contato@inventariano.com.br</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mx-auto flex max-w-7xl flex-col gap-2 pt-6 text-[0.78rem] text-white/25 sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 Inventariano. Todos os direitos reservados.</span>
          <span>As calculadoras apresentam estimativas e não substituem análise jurídica individualizada.</span>
        </div>
      </footer>
    </main>
  );
}
