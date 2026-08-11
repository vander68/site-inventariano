
import Link from "next/link";

const services = [
  ["⚖️", "Inventário Judicial", "Atuação em inventários judiciais e situações que exigem intervenção do Judiciário.", "/inventario.html"],
  ["📋", "Inventário Extrajudicial", "Orientação completa para inventários realizados em cartório.", "/inventario.html"],
  ["🏠", "Regularização de Imóveis", "Escritura, registro, usucapião e outras soluções para regularizar seu imóvel.", "/regularizacao.html"],
  ["🔑", "Usucapião", "Análise do caso e orientação para reconhecimento da propriedade.", "/regularizacao.html"],
  ["📜", "Testamento e Doação", "Planejamento da transmissão patrimonial e proteção da família.", "/inventario.html"],
  ["🤝", "Partilha e Herança", "Simulações, informações e orientação para divisão do patrimônio.", "/inventario.html"],
];

const calculators = [
  ["Calculadora de Herança", "Estime a divisão da herança entre os herdeiros.", "/calculadora-de-heranca"],
  ["Calculadora de ITCMD", "Faça uma estimativa do imposto sobre a transmissão de bens.", "/calculadora-de-itcmd"],
  ["Calculadora de Meação", "Entenda a parcela patrimonial do meeiro conforme o regime de bens.", "/calculadora-de-meacao"],
  ["Calculadora de Partilha", "Simule a distribuição do patrimônio entre os interessados.", "/calculadora-de-partilha"],
  ["Custos de Inventário", "Tenha uma visão inicial dos principais custos envolvidos.", "/custos-de-inventario"],
  ["Prazo de Inventário", "Consulte informações e referências sobre prazos.", "/prazo-inventario"],
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f5f0e8] text-[#252525]">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0e0e0e]/95 backdrop-blur">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 lg:px-10">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded bg-[#c9a84c] font-serif text-xl font-bold text-[#0e0e0e]">I</span>
            <span className="font-serif text-xl font-bold text-[#c9a84c]">
              Inventariano <span className="font-normal text-white">| Informação e ferramentas</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            <Link href="/inventario.html" className="text-sm uppercase tracking-wider text-white/75 hover:text-[#c9a84c]">Inventário</Link>
            <Link href="/regularizacao.html" className="text-sm uppercase tracking-wider text-white/75 hover:text-[#c9a84c]">Regularização</Link>
            <Link href="/blog.html" className="text-sm uppercase tracking-wider text-white/75 hover:text-[#c9a84c]">Blog</Link>
            <a href="#servicos" className="text-sm uppercase tracking-wider text-white/75 hover:text-[#c9a84c]">Serviços</a>
            <a href="#contato" className="rounded bg-[#c9a84c] px-5 py-2.5 text-sm font-bold text-[#0e0e0e] hover:bg-[#e8c97a]">Falar com especialista</a>
          </nav>
        </div>
      </header>

      <section className="relative overflow-hidden bg-[#0e0e0e]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_70%_at_75%_40%,rgba(201,168,76,.12),transparent_70%)]" />
        <div className="relative mx-auto grid min-h-[680px] max-w-7xl items-center gap-12 px-5 py-24 lg:grid-cols-2 lg:px-10">
          <div>
            <p className="mb-6 text-xs uppercase tracking-[.25em] text-[#c9a84c]">Escritório especializado</p>
            <h1 className="font-serif text-5xl font-black leading-tight text-white md:text-6xl">
              Inventário e <span className="text-[#c9a84c]">Regularização</span> de Imóveis
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-white/60">
              Resolvemos sua herança com segurança, agilidade e transparência. Do inventário judicial ao extrajudicial — cuidamos de cada etapa por você.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <a href="https://wa.me/5511993233066?text=Ol%C3%A1!%20Gostaria%20de%20uma%20consulta%20sobre%20invent%C3%A1rio." target="_blank" rel="noreferrer" className="rounded bg-[#c9a84c] px-7 py-4 font-bold text-[#0e0e0e] hover:bg-[#e8c97a]">💬 Falar no WhatsApp</a>
              <Link href="/blog.html" className="rounded border border-[#c9a84c]/50 px-7 py-4 text-[#c9a84c] hover:bg-[#c9a84c]/10">Ler artigos</Link>
            </div>

            <div className="mt-12 flex flex-wrap gap-10 border-t border-white/10 pt-8">
              <div><strong className="font-serif text-3xl text-[#c9a84c]">500+</strong><p className="mt-1 text-xs uppercase tracking-wider text-white/40">Casos concluídos</p></div>
              <div><strong className="font-serif text-3xl text-[#c9a84c]">20+</strong><p className="mt-1 text-xs uppercase tracking-wider text-white/40">Anos de atuação</p></div>
              <div><strong className="font-serif text-3xl text-[#c9a84c]">Brasil</strong><p className="mt-1 text-xs uppercase tracking-wider text-white/40">Atendimento nacional</p></div>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="rounded border border-[#c9a84c]/20 bg-white/[.04] p-8 shadow-2xl backdrop-blur">
              <p className="mb-6 font-serif text-xl text-[#c9a84c]">Acesse diretamente</p>
              <div className="space-y-3">
                <Link href="/inventario.html" className="block rounded border border-white/10 bg-white/[.04] p-5 hover:border-[#c9a84c]/50">
                  <strong className="text-white">📋 Inventário e Herança</strong>
                  <span className="mt-1 block text-sm text-white/45">Informações, orientação e ferramentas.</span>
                </Link>
                <Link href="/regularizacao.html" className="block rounded border border-white/10 bg-white/[.04] p-5 hover:border-[#c9a84c]/50">
                  <strong className="text-white">🏠 Regularização de Imóveis</strong>
                  <span className="mt-1 block text-sm text-white/45">Soluções para documentação e propriedade.</span>
                </Link>
                <Link href="/blog.html" className="block rounded border border-white/10 bg-white/[.04] p-5 hover:border-[#c9a84c]/50">
                  <strong className="text-white">📚 Blog Inventariano</strong>
                  <span className="mt-1 block text-sm text-white/45">Dúvidas, artigos e explicações sem juridiquês.</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="servicos" className="mx-auto max-w-7xl px-5 py-20 lg:px-10">
        <p className="text-xs uppercase tracking-[.25em] text-[#c9a84c]">O que fazemos</p>
        <h2 className="mt-3 max-w-2xl font-serif text-4xl font-bold md:text-5xl">Soluções jurídicas completas para sua família</h2>
        <p className="mt-5 max-w-2xl leading-7 text-[#6b6560]">Cada caso é único. Encontre rapidamente o caminho que mais se aproxima da sua necessidade.</p>

        <div className="mt-10 grid gap-px overflow-hidden border border-[#ede5d3] bg-[#ede5d3] sm:grid-cols-2 lg:grid-cols-3">
          {services.map(([icon, title, description, href]) => (
            <Link key={title} href={href} className="group bg-white p-8 transition hover:bg-[#f5f0e8]">
              <div className="text-3xl">{icon}</div>
              <h3 className="mt-5 font-serif text-xl font-bold">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-[#6b6560]">{description}</p>
              <span className="mt-5 inline-block text-sm font-bold text-[#a28232] group-hover:text-[#c9a84c]">Saiba mais →</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-[#0e0e0e] px-5 py-20 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs uppercase tracking-[.25em] text-[#c9a84c]">Ferramentas gratuitas</p>
          <h2 className="mt-3 font-serif text-4xl font-bold text-white">Calculadoras jurídicas</h2>
          <p className="mt-4 max-w-2xl leading-7 text-white/50">Acesse as ferramentas do Inventariano para obter estimativas e entender melhor sua situação.</p>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {calculators.map(([title, description, href]) => (
              <Link key={title} href={href} className="rounded border border-white/10 bg-white/[.03] p-6 hover:border-[#c9a84c]/50">
                <h3 className="font-serif text-lg font-bold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/45">{description}</p>
                <span className="mt-4 inline-block text-sm font-bold text-[#c9a84c]">Abrir calculadora →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#ede5d3] px-5 py-20 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-3">
          <div>
            <p className="text-xs uppercase tracking-[.25em] text-[#a28232]">Conteúdo</p>
            <h2 className="mt-3 font-serif text-4xl font-bold">Informação para tomar decisões melhores</h2>
          </div>
          <Link href="/inventario.html" className="rounded bg-white p-7 shadow-sm hover:shadow-md">
            <span className="text-xs font-bold uppercase tracking-wider text-[#c9a84c]">Inventário & Herança</span>
            <h3 className="mt-3 font-serif text-2xl font-bold">Entenda seus direitos e os próximos passos.</h3>
            <span className="mt-5 inline-block font-bold text-[#a28232]">Conhecer →</span>
          </Link>
          <Link href="/regularizacao.html" className="rounded bg-white p-7 shadow-sm hover:shadow-md">
            <span className="text-xs font-bold uppercase tracking-wider text-[#c9a84c]">Regularização</span>
            <h3 className="mt-3 font-serif text-2xl font-bold">Descubra como regularizar seu imóvel.</h3>
            <span className="mt-5 inline-block font-bold text-[#a28232]">Conhecer →</span>
          </Link>
        </div>
      </section>

      <section className="bg-[#c9a84c] px-5 py-16 text-center" id="contato">
        <h2 className="font-serif text-4xl font-bold text-[#0e0e0e]">Resolva hoje o que você adiou por anos</h2>
        <p className="mx-auto mt-4 max-w-xl text-[#0e0e0e]/70">Fale com um especialista sobre inventário, herança ou regularização de imóveis.</p>
        <a href="https://wa.me/5511993233066?text=Ol%C3%A1!%20Gostaria%20de%20uma%20consulta." target="_blank" rel="noreferrer" className="mt-7 inline-block rounded bg-[#0e0e0e] px-8 py-4 font-bold text-white">💬 Falar com especialista</a>
      </section>

      <footer className="bg-[#0e0e0e] px-5 py-12 text-white lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="font-serif text-2xl font-bold text-[#c9a84c]">Inventariano</div>
            <p className="mt-3 max-w-md text-sm leading-7 text-white/40">Informação, ferramentas e orientação sobre inventários, herança e regularização de imóveis.</p>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#c9a84c]">Navegação</h4>
            <div className="mt-4 space-y-2 text-sm text-white/50">
              <Link className="block hover:text-[#c9a84c]" href="/inventario.html">Inventário</Link>
              <Link className="block hover:text-[#c9a84c]" href="/regularizacao.html">Regularização</Link>
              <Link className="block hover:text-[#c9a84c]" href="/blog.html">Blog</Link>
            </div>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#c9a84c]">Contato</h4>
            <p className="mt-4 text-sm leading-7 text-white/50">Motta Alves Sociedade de Advogados<br/>São Paulo/SP<br/>(11) 99323-3066</p>
          </div>
        </div>
        <div className="mx-auto mt-10 max-w-7xl border-t border-white/10 pt-6 text-xs text-white/25">© {new Date().getFullYear()} Inventariano. Todos os direitos reservados.</div>
      </footer>
    </main>
  );
}
