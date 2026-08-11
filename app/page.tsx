import Link from "next/link";

const calculators = [
  {
    title: "Calculadora de Herança",
    description: "Estime a divisão da herança entre herdeiros conforme os dados informados.",
    href: "/calculadora-de-heranca",
    icon: "⚖️",
  },
  {
    title: "Calculadora de ITCMD",
    description: "Faça uma estimativa do ITCMD incidente sobre a transmissão de bens.",
    href: "/calculadora-de-itcmd",
    icon: "🧾",
  },
  {
    title: "Calculadora de Meação",
    description: "Entenda a parcela patrimonial do meeiro conforme o regime de bens.",
    href: "/calculadora-de-meacao",
    icon: "🏠",
  },
  {
    title: "Calculadora de Partilha",
    description: "Simule a distribuição do patrimônio entre os interessados.",
    href: "/calculadora-de-partilha",
    icon: "📊",
  },
  {
    title: "Custos de Inventário",
    description: "Tenha uma visão inicial dos principais custos envolvidos no inventário.",
    href: "/custos-de-inventario",
    icon: "💰",
  },
  {
    title: "Divisão de Imóvel na Herança",
    description: "Simule cenários de divisão de um imóvel entre herdeiros.",
    href: "/divisao-imovel-heranca",
    icon: "🏡",
  },
  {
    title: "Prazo do Inventário",
    description: "Consulte informações e organize as principais etapas e prazos do inventário.",
    href: "/prazo-inventario",
    icon: "⏱️",
  },
];

const topics = [
  {
    title: "Inventário",
    text: "Entenda inventário judicial e extrajudicial, documentos, custos, prazos e etapas.",
    href: "/inventario",
  },
  {
    title: "Herança",
    text: "Informações sobre herdeiros, ordem de vocação hereditária, meação e sucessão.",
    href: "/heranca",
  },
  {
    title: "Partilha",
    text: "Conheça as regras e os principais caminhos para organizar a partilha de bens.",
    href: "/partilha",
  },
  {
    title: "Regularização de Imóveis",
    text: "Conteúdos para compreender matrícula, registro, posse, propriedade e regularização.",
    href: "/regularizacao-de-imoveis",
  },
];

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Inventariano",
    url: "https://inventariano.com.br",
    description:
      "Portal de informação e ferramentas sobre inventário, herança, partilha, ITCMD e regularização de imóveis.",
    inLanguage: "pt-BR",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <Link href="/" className="flex items-center gap-3" aria-label="Inventariano - início">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-slate-900 text-lg font-bold text-white">
              I
            </span>
            <span>
              <span className="block text-xl font-bold tracking-tight text-slate-900">
                Inventariano
              </span>
              <span className="hidden text-xs font-medium text-slate-500 sm:block">
                Informação e ferramentas para sucessões e imóveis
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-7 text-sm font-medium text-slate-600 lg:flex">
            <a href="#calculadoras" className="transition hover:text-slate-900">
              Calculadoras
            </a>
            <a href="#temas" className="transition hover:text-slate-900">
              Temas
            </a>
            <a href="#como-funciona" className="transition hover:text-slate-900">
              Como funciona
            </a>
            <Link href="/artigos" className="transition hover:text-slate-900">
              Artigos
            </Link>
          </nav>

          <a
            href="mailto:contato@inventariano.com.br"
            className="rounded-full bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            Fale conosco
          </a>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden bg-slate-950">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(148,163,184,0.18),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(203,213,225,0.10),transparent_30%)]" />
          <div className="relative mx-auto grid max-w-7xl gap-12 px-5 py-20 lg:grid-cols-[1.15fr_0.85fr] lg:px-8 lg:py-28">
            <div className="max-w-3xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Conteúdo jurídico claro e ferramentas práticas
              </div>

              <h1 className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                Inventário, herança e partilha
                <span className="block text-slate-300">sem complicação.</span>
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
                Encontre explicações objetivas, calculadoras e informações para
                compreender melhor inventário, sucessão, ITCMD, partilha e
                regularização de imóveis.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#calculadoras"
                  className="rounded-xl bg-white px-6 py-3.5 text-center font-semibold text-slate-900 transition hover:bg-slate-100"
                >
                  Explorar calculadoras
                </a>
                <Link
                  href="/artigos"
                  className="rounded-xl border border-white/20 px-6 py-3.5 text-center font-semibold text-white transition hover:bg-white/10"
                >
                  Ler artigos
                </Link>
              </div>

              <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-slate-400">
                <span>✓ Conteúdo em português</span>
                <span>✓ Ferramentas gratuitas</span>
                <span>✓ Informação organizada</span>
              </div>
            </div>

            <div className="flex items-center lg:justify-end">
              <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.07] p-7 shadow-2xl backdrop-blur">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Comece por aqui
                </p>
                <h2 className="mt-3 text-2xl font-bold text-white">
                  O que você precisa descobrir?
                </h2>

                <div className="mt-6 space-y-3">
                  {[
                    ["Quanto posso receber de herança?", "/calculadora-de-heranca"],
                    ["Quanto posso pagar de ITCMD?", "/calculadora-de-itcmd"],
                    ["Como funciona a meação?", "/calculadora-de-meacao"],
                    ["Quanto custa um inventário?", "/custos-de-inventario"],
                  ].map(([label, href]) => (
                    <Link
                      key={href}
                      href={href}
                      className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm font-medium text-slate-100 transition hover:bg-white/10"
                    >
                      <span>{label}</span>
                      <span className="text-slate-400">→</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="calculadoras" className="bg-white py-20">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <div className="max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500">
                Ferramentas
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Calculadoras jurídicas
              </h2>
              <p className="mt-4 text-lg leading-8 text-slate-600">
                Ferramentas para obter uma estimativa inicial e entender melhor
                os números envolvidos em uma sucessão.
              </p>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {calculators.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg"
                >
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-slate-100 text-xl">
                    {item.icon}
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-slate-900">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {item.description}
                  </p>
                  <span className="mt-5 inline-flex text-sm font-bold text-slate-900 group-hover:underline">
                    Abrir calculadora →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section id="temas" className="bg-slate-50 py-20">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <div className="max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500">
                Conteúdo
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Encontre o assunto que você procura
              </h2>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {topics.map((topic) => (
                <Link
                  key={topic.href}
                  href={topic.href}
                  className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-md"
                >
                  <h3 className="text-lg font-bold text-slate-900">{topic.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{topic.text}</p>
                  <span className="mt-5 inline-flex text-sm font-semibold text-slate-900">
                    Saiba mais →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section id="como-funciona" className="bg-white py-20">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500">
                  Por onde começar
                </p>
                <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                  Transforme uma dúvida em um próximo passo.
                </h2>
                <p className="mt-5 text-lg leading-8 text-slate-600">
                  O Inventariano organiza informações complexas em páginas
                  objetivas e ferramentas simples. Use as calculadoras como
                  estimativas iniciais e consulte orientação profissional para
                  analisar o seu caso concreto.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  ["01", "Escolha o tema", "Comece por inventário, herança, partilha, ITCMD ou imóveis."],
                  ["02", "Use uma ferramenta", "Faça uma simulação inicial com os dados que você já possui."],
                  ["03", "Aprofunde a pesquisa", "Leia os conteúdos relacionados e organize suas próximas perguntas."],
                ].map(([number, title, text]) => (
                  <div
                    key={number}
                    className="flex gap-5 rounded-2xl border border-slate-200 p-5"
                  >
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-slate-900 text-sm font-bold text-white">
                      {number}
                    </span>
                    <div>
                      <h3 className="font-bold text-slate-900">{title}</h3>
                      <p className="mt-1 text-sm leading-6 text-slate-600">{text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-slate-900 py-16">
          <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 lg:flex-row lg:items-center lg:justify-between lg:px-8">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-slate-400">
                Precisa de orientação?
              </p>
              <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
                Organize suas dúvidas antes de tomar uma decisão.
              </h2>
              <p className="mt-2 max-w-2xl text-slate-300">
                Para análise de um caso concreto, procure um profissional habilitado.
              </p>
            </div>

            <a
              href="mailto:contato@inventariano.com.br"
              className="shrink-0 rounded-xl bg-white px-6 py-3.5 text-center font-semibold text-slate-900 transition hover:bg-slate-100"
            >
              Entrar em contato
            </a>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-10 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <p className="font-bold text-slate-900">Inventariano</p>
            <p className="mt-1 text-sm text-slate-500">
              Informação e ferramentas sobre sucessões e regularização de imóveis.
            </p>
          </div>

          <div className="text-sm text-slate-500">
            <p>© {new Date().getFullYear()} Inventariano. Todos os direitos reservados.</p>
            <p className="mt-1">
              As calculadoras apresentam estimativas e não substituem análise jurídica individualizada.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
