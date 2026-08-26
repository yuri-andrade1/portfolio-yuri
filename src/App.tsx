import { useEffect, useRef, useState } from "react";

// ── Scroll animation hook ──────────────────────────────────────────────
function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll(".fade-up, .fade-left, .fade-right").forEach((el) => {
      observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);
}

// ── Stars background ────────────────────────────────────────────────────
function Stars() {
  const stars = Array.from({ length: 45 }, (_, i) => ({
    id: i,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    duration: `${3 + Math.random() * 4}s`,
    delay: `${Math.random() * 4}s`,
    size: Math.random() > 0.8 ? 3 : 2,
  }));
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {stars.map((s) => (
        <div
          key={s.id}
          className="star"
          style={{
            top: s.top,
            left: s.left,
            "--duration": s.duration,
            "--delay": s.delay,
            width: s.size,
            height: s.size,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

// ── 3D tilt card ────────────────────────────────────────────────────────
function TiltCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el || window.innerWidth < 768) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(600px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateZ(6px)`;
  };

  const handleMouseLeave = () => {
    if (ref.current) ref.current.style.transform = "";
  };

  return (
    <div
      ref={ref}
      className={`card-3d pixel-border transition-all duration-300 ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
}

// ── Skill bar ───────────────────────────────────────────────────────────
function SkillBar({ label, value, delay = 0 }: { label: string; value: number; delay?: number }) {
  const [width, setWidth] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setWidth(value), delay);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value, delay]);

  return (
    <div ref={ref} className="mb-4">
      <div className="flex justify-between mb-1.5 items-center">
        <span className="font-mono text-xs sm:text-sm text-slate-300">{label}</span>
        <span className="font-mono text-xs text-indigo-400">{value}%</span>
      </div>
      <div className="pixel-progress">
        <div className="pixel-progress-fill" style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}

// ── Nav ─────────────────────────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const links = ["inicio", "sobre", "experiencia", "habilidades", "projetos", "contato"];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0b0c10]/85 backdrop-blur-md border-b border-indigo-900/40 py-3 shadow-lg shadow-black/40"
          : "py-4"
      }`}
    >
      <div className="max-w-6xl mx-auto px-5 md:px-8 flex items-center justify-between">
        <a
          href="#inicio"
          className="font-pixel text-indigo-400 text-xs sm:text-sm crt-glow-sm hover:text-indigo-300 transition-colors tracking-wide"
        >
          YURI.dev
        </a>

        {/* desktop */}
        <ul className="hidden md:flex gap-6 lg:gap-8">
          {links.map((l) => (
            <li key={l}>
              <a
                href={`#${l}`}
                className="font-mono text-xs lg:text-sm text-slate-300 hover:text-indigo-300 transition-colors uppercase tracking-widest"
              >
                {l}
              </a>
            </li>
          ))}
        </ul>

        {/* mobile toggle */}
        <button
          className="md:hidden font-pixel text-indigo-400 text-xs p-2 border border-indigo-900/60 bg-[#141522]"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle Navigation"
        >
          {menuOpen ? "[X]" : "[=]"}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-[#0b0c10]/95 backdrop-blur-md border-b border-indigo-900/50 px-6 py-5 space-y-3">
          {links.map((l) => (
            <a
              key={l}
              href={`#${l}`}
              onClick={() => setMenuOpen(false)}
              className="block font-mono text-sm text-slate-300 hover:text-indigo-300 py-1.5 uppercase tracking-widest border-b border-indigo-950/60"
            >
              {`> ${l}`}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}

// ── Hero ────────────────────────────────────────────────────────────────
function Hero() {
  const [typed, setTyped] = useState("");
  const full = "Analise e Desenvolvimento de Sistemas (6º Semestre)";

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      setTyped(full.slice(0, i + 1));
      i++;
      if (i >= full.length) clearInterval(timer);
    }, 45);
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      id="inicio"
      className="relative min-h-screen flex flex-col items-center justify-center text-center pixel-grid-bg px-5 pt-24 pb-12"
    >
      {/* decorative corner pixels */}
      <div className="hidden sm:block absolute top-28 left-8 w-3 h-3 bg-indigo-600 float-anim" style={{ animationDelay: "0s" }} />
      <div className="hidden sm:block absolute top-44 left-16 w-2 h-2 bg-indigo-400" />
      <div className="hidden sm:block absolute top-36 right-12 w-3 h-3 bg-indigo-500 float-anim" style={{ animationDelay: "1s" }} />
      <div className="hidden sm:block absolute bottom-36 right-8 w-2 h-2 bg-indigo-600 float-anim" style={{ animationDelay: "0.5s" }} />

      {/* avatar pixel art */}
      <div className="relative mb-6 sm:mb-8 float-anim">
        <div
          className="w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 mx-auto"
          style={{
            background: "linear-gradient(135deg, #18192a 0%, #252840 100%)",
            border: "3px solid #6366f1",
            boxShadow: "6px 6px 0 #1e1b4b, 0 0 25px rgba(99, 102, 241, 0.25)",
            imageRendering: "pixelated",
          }}
        >
          <svg viewBox="0 0 16 16" width="100%" height="100%" style={{ imageRendering: "pixelated" }}>
            <rect x="3" y="1" width="10" height="3" fill="#4338ca" />
            <rect x="2" y="2" width="12" height="2" fill="#4f46e5" />
            <rect x="3" y="4" width="10" height="6" fill="#ddd6fe" />
            <rect x="5" y="5" width="2" height="2" fill="#1e1b4b" />
            <rect x="9" y="5" width="2" height="2" fill="#1e1b4b" />
            <rect x="4" y="5" width="4" height="3" fill="none" stroke="#6366f1" strokeWidth="0.5" />
            <rect x="8" y="5" width="4" height="3" fill="none" stroke="#6366f1" strokeWidth="0.5" />
            <rect x="6" y="8" width="4" height="1" fill="#6366f1" />
            <rect x="4" y="10" width="8" height="5" fill="#312e81" />
            <rect x="5" y="11" width="6" height="1" fill="#4338ca" />
            <rect x="2" y="10" width="2" height="4" fill="#252840" />
            <rect x="12" y="10" width="2" height="4" fill="#252840" />
          </svg>
        </div>
        <div
          className="absolute -bottom-2 -right-2 bg-indigo-900 border border-indigo-400 px-2 py-0.5"
          style={{ boxShadow: "2px 2px 0 #1e1b4b" }}
        >
          <span className="font-pixel text-slate-100 text-[8px]">LV.6 (ADS)</span>
        </div>
      </div>

      <p className="font-pixel text-indigo-400 text-[10px] sm:text-xs mb-3 tracking-widest crt-glow-sm uppercase">
        DEV FULL STACK & MOBILE · FORTALEZA, CE
      </p>
      <h1 className="font-pixel text-2xl sm:text-4xl md:text-5xl text-slate-100 mb-4 crt-glow leading-tight">
        YURI DE LIMA
        <span className="text-indigo-400"> ANDRADE</span>
      </h1>

      <div className="font-mono text-indigo-300 text-xs sm:text-sm md:text-base mb-3 max-w-xl mx-auto px-2 min-h-[1.5rem]">
        <span className="text-indigo-500">$ </span>
        <span>{typed}</span>
        <span className="cursor-blink text-indigo-400">█</span>
      </div>

      <p className="font-mono text-slate-400 text-xs sm:text-sm mb-8 max-w-lg mx-auto">
        // Desenvolvendo soluções Web, Mobile e Infraestrutura de TI
      </p>

      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center px-4">
        <a href="#projetos" className="neon-btn justify-center">
          VER PROJETOS
        </a>
        <a href="#contato" className="neon-btn justify-center">
          CONTATO
        </a>
      </div>

      {/* scroll hint */}
      <div className="hidden sm:flex absolute bottom-6 left-1/2 -translate-x-1/2 flex-col items-center gap-1.5">
        <span className="font-pixel text-indigo-400 text-[8px]">SCROLL</span>
        <div className="w-px h-6 bg-gradient-to-b from-indigo-500 to-transparent" />
      </div>
    </section>
  );
}

// ── About ────────────────────────────────────────────────────────────────
function About() {
  return (
    <section id="sobre" className="relative py-16 sm:py-24 px-5">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10 sm:mb-12 fade-up">
          <h2 className="font-pixel text-xl sm:text-2xl md:text-3xl text-slate-100 section-title crt-glow-sm">
            SOBRE MIM
          </h2>
          <div className="w-36 sm:w-48 h-px bg-indigo-800 mt-3" />
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* info card */}
          <div className="fade-left">
            <TiltCard className="p-5 sm:p-6 bg-[#141522]">
              <div className="flex items-center gap-3 mb-5 border-b border-indigo-900/40 pb-3">
                <div className="w-2.5 h-2.5 bg-indigo-500" />
                <span className="font-pixel text-indigo-300 text-[9px] sm:text-[10px]">
                  DADOS DO PERSONAGEM
                </span>
              </div>
              <div className="space-y-3">
                {[
                  ["NOME", "Yuri de Lima Andrade"],
                  ["CURSO", "ADS (6º Semestre)"],
                  ["INSTITUIÇÃO", "Estácio (02/24 - 07/27)"],
                  ["LOCALIDADE", "Fortaleza - CE"],
                  ["ATUAÇÃO", "Presencial / Híbrido / Remoto"],
                  ["CNH", "Categoria AB"],
                  ["IDIOMAS", "Inglês (Intermediário)"],
                ].map(([key, val]) => (
                  <div key={key} className="flex gap-3 font-mono text-xs sm:text-sm border-b border-indigo-950 pb-2">
                    <span className="text-indigo-400 w-24 shrink-0 font-medium">{key}:</span>
                    <span className="text-slate-200">{val}</span>
                  </div>
                ))}
              </div>
            </TiltCard>
          </div>

          {/* bio */}
          <div className="fade-right space-y-4 sm:space-y-5">
            <div
              className="border-l-4 border-indigo-500 pl-4 py-2"
              style={{ background: "linear-gradient(90deg, rgba(99,102,241,0.06) 0%, transparent 100%)" }}
            >
              <p className="font-mono text-slate-200 text-xs sm:text-sm leading-relaxed">
                Estudante de Análise e Desenvolvimento de Sistemas (6º semestre pela Estácio), com experiência em suporte técnico, infraestrutura de TI e desenvolvimento de aplicações web e mobile.
              </p>
            </div>
            <p className="font-mono text-slate-300 text-xs sm:text-sm leading-relaxed">
              Possuo conhecimentos em JavaScript, TypeScript, React, React Native, Python, SQL, Git/GitHub e infraestrutura de redes/manutenção. Sou proativo, adaptável a novas tecnologias e focado em resolver problemas e trabalhar em equipe.
            </p>
            <p className="font-mono text-slate-400 text-xs sm:text-sm leading-relaxed">
              Interesse contínuo em Desenvolvimento Full Stack, Inteligência Artificial e Automação de Processos.
            </p>

            {/* certification badge */}
            <div className="p-3.5 border border-indigo-900/60 bg-[#141522] mt-4" style={{ boxShadow: "3px 3px 0 #1e1b4b" }}>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 bg-indigo-400" />
                <span className="font-pixel text-indigo-300 text-[9px]">CERTIFICAÇÃO (2025)</span>
              </div>
              <p className="font-mono text-slate-300 text-xs">
                Inteligência Artificial para Educação Potencializando Métodos e Ferramentas — <span className="text-indigo-400">UECE & Dell Tecnologia</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Experience & Education ───────────────────────────────────────────────
function Experience() {
  const experiences = [
    {
      role: "Estágio em TI",
      company: "Hit Saúde",
      period: "02/2026 - 04/2026",
      desc: "Assistência técnica de equipamentos médicos e odontológicos, além de atuação direta na infraestrutura de TI da empresa, configuração e manutenção de equipamentos.",
      type: "Estágio",
    },
    {
      role: "Estágio em TI Assistência Técnica",
      company: "Famelo Informática",
      period: "01/2024 - 12/2024",
      desc: "Manutenção preventiva e corretiva, montagem e assistência técnica em equipamentos desktop.",
      type: "Estágio",
    },
  ];

  return (
    <section id="experiencia" className="relative py-16 sm:py-24 px-5 pixel-grid-bg">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10 sm:mb-12 fade-up">
          <h2 className="font-pixel text-xl sm:text-2xl md:text-3xl text-slate-100 section-title crt-glow-sm">
            EXPERIÊNCIA & FORMAÇÃO
          </h2>
          <div className="w-36 sm:w-48 h-px bg-indigo-800 mt-3" />
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Work experience */}
          <div className="fade-left space-y-4">
            <p className="font-pixel text-indigo-400 text-[10px] sm:text-xs mb-4 uppercase tracking-wider">HISTÓRICO PROFISSIONAL</p>
            {experiences.map((exp) => (
              <div
                key={exp.role + exp.company}
                className="p-5 border border-indigo-900/60 bg-[#141522]"
                style={{ boxShadow: "3px 3px 0 #1e1b4b" }}
              >
                <div className="flex justify-between items-start mb-2 flex-wrap gap-1">
                  <div>
                    <h3 className="font-pixel text-slate-100 text-xs sm:text-sm text-indigo-300">{exp.role}</h3>
                    <p className="font-mono text-indigo-400 text-xs mt-0.5">{exp.company}</p>
                  </div>
                  <span className="font-mono text-[10px] text-slate-400 bg-indigo-950 px-2 py-1 border border-indigo-900/50">
                    {exp.period}
                  </span>
                </div>
                <p className="font-mono text-slate-300 text-xs leading-relaxed mt-2">
                  {exp.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Education & Agile */}
          <div className="fade-right space-y-4">
            <p className="font-pixel text-indigo-400 text-[10px] sm:text-xs mb-4 uppercase tracking-wider">FORMAÇÃO ACADÊMICA</p>
            <div
              className="p-5 border border-indigo-900/60 bg-[#141522]"
              style={{ boxShadow: "3px 3px 0 #1e1b4b" }}
            >
              <span className="font-pixel text-indigo-400 text-[8px] bg-indigo-950 px-2 py-0.5">GRADUAÇÃO</span>
              <h3 className="font-pixel text-slate-100 text-xs sm:text-sm mt-2">Análise e Desenvolvimento de Sistemas</h3>
              <p className="font-mono text-indigo-300 text-xs mt-1">Estácio | 6º Semestre</p>
              <p className="font-mono text-slate-400 text-xs mt-2">Previsão de Conclusão: 07/2027</p>
            </div>

            <div
              className="p-5 border border-indigo-900/60 bg-[#141522] mt-4"
              style={{ boxShadow: "3px 3px 0 #1e1b4b" }}
            >
              <p className="font-pixel text-indigo-400 text-[9px] mb-2 uppercase">METODOLOGIAS ÁGEIS & PRÁTICAS</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {["Scrum", "Kanban", "Git & GitHub", "Offline-First", "Full Stack", "Suporte TI"].map((m) => (
                  <span key={m} className="pixel-tag">{m}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Skills ────────────────────────────────────────────────────────────────
function Skills() {
  const skills = [
    { label: "JavaScript & TypeScript", value: 80 },
    { label: "React & React Native", value: 75 },
    { label: "Python", value: 70 },
    { label: "SQL & Bancos de Dados", value: 70 },
    { label: "HTML5 & CSS3 / Tailwind", value: 85 },
    { label: "C & Java", value: 60 },
  ];

  const tools = [
    "Git", "GitHub", "VSCode", "Firebase", "Supabase", 
    "SQL Server", "MongoDB", "Postman", "Figma", "Android Studio"
  ];

  return (
    <section id="habilidades" className="relative py-16 sm:py-24 px-5">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10 sm:mb-12 fade-up">
          <h2 className="font-pixel text-xl sm:text-2xl md:text-3xl text-slate-100 section-title crt-glow-sm">
            HABILIDADES
          </h2>
          <div className="w-36 sm:w-48 h-px bg-indigo-800 mt-3" />
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          <div className="fade-left">
            <p className="font-pixel text-indigo-400 text-[10px] sm:text-xs mb-5 uppercase tracking-wider">LIMGUAGENS & FRAMEWORKS</p>
            {skills.map((s, i) => (
              <SkillBar key={s.label} label={s.label} value={s.value} delay={i * 100} />
            ))}
          </div>

          <div className="fade-right">
            <p className="font-pixel text-indigo-400 text-[10px] sm:text-xs mb-5 uppercase tracking-wider">FERRAMENTAS & AMBIENTES</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {tools.map((t) => (
                <div
                  key={t}
                  className="flex items-center gap-2 p-2.5 border border-indigo-900/60 bg-[#141522] hover:border-indigo-500 hover:bg-indigo-950/40 transition-all cursor-default group"
                  style={{ boxShadow: "3px 3px 0 #1e1b4b" }}
                >
                  <div className="w-2 h-2 bg-indigo-500 group-hover:bg-indigo-300 transition-colors shrink-0" />
                  <span className="font-mono text-xs text-slate-200 group-hover:text-white transition-colors truncate">
                    {t}
                  </span>
                </div>
              ))}
            </div>

            {/* currently learning */}
            <div className="mt-6 p-4 border border-indigo-900/50 bg-[#141522]">
              <p className="font-pixel text-indigo-400 text-[9px] sm:text-[10px] mb-3 uppercase">INTERESSES & FOCO ATUAL</p>
              <div className="flex flex-wrap gap-2">
                {["Desenvolvimento Full Stack", "Inteligência Artificial", "Automação de Processos", "Sistemas Distribuídos"].map((t) => (
                  <span key={t} className="pixel-tag">{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Projects ─────────────────────────────────────────────────────────────
const projects = [
  {
    id: 1,
    title: "BerroPro",
    desc: "Aplicativo web instalável (PWA) offline-first para gestão de rebanhos caprinos e ovinos no campo. Combina gestão zootécnica, controle financeiro, manejo e comunidade técnica.",
    tags: ["React", "PWA", "TypeScript", "Offline-First"],
    status: "COMPLETO",
    link: "https://github.com/yuri-andrade1/berropro",
  },
  {
    id: 2,
    title: "Oficina LindoAutos",
    desc: "Aplicativo mobile para gestão de oficinas automotivas. Inclui controle de ordens de serviço, gerenciamento de clientes e sincronização de banco de dados em tempo real.",
    tags: ["React Native", "Firebase", "Realtime DB", "Mobile"],
    status: "COMPLETO",
    link: "https://github.com/anavitoria-s/Oficina-LindoAutos-",
  },
];

const statusColor: Record<string, string> = {
  "COMPLETO": "#10b981",
  "EM DESENVOLVIMENTO": "#f59e0b",
  "EM PAUSA": "#f43f5e",
};

function Projects() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section id="projetos" className="relative py-16 sm:py-24 px-5 pixel-grid-bg">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10 sm:mb-12 fade-up">
          <h2 className="font-pixel text-xl sm:text-2xl md:text-3xl text-slate-100 section-title crt-glow-sm">
            PROJETOS EM DESTAQUE
          </h2>
          <div className="w-36 sm:w-48 h-px bg-indigo-800 mt-3" />
          <p className="font-mono text-slate-400 text-xs sm:text-sm mt-3">
            // Clique no projeto para ver a descrição detalhada e o código fonte no GitHub
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((p, i) => (
            <div
              key={p.id}
              className="fade-up cursor-pointer"
              style={{ transitionDelay: `${i * 80}ms` }}
              onClick={() => setActive(active === p.id ? null : p.id)}
            >
              <TiltCard className={`p-5 bg-[#141522] transition-all duration-300 ${active === p.id ? "border-indigo-400 shadow-indigo-900/30" : ""}`}>
                <div className="flex items-start justify-between mb-3 gap-2">
                  <div>
                    <span className="font-pixel text-indigo-400 text-[8px]">
                      #{String(p.id).padStart(3, "0")}
                    </span>
                    <h3 className="font-pixel text-slate-100 text-xs sm:text-sm mt-1 crt-glow-sm">
                      {p.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 bg-slate-900/80 px-2 py-1 rounded border border-slate-800">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{
                        background: statusColor[p.status],
                      }}
                    />
                    <span className="font-mono text-[10px]" style={{ color: statusColor[p.status] }}>
                      {p.status}
                    </span>
                  </div>
                </div>

                <p className="font-mono text-slate-300 text-xs leading-relaxed mb-3">
                  {p.desc}
                </p>

                <div className="mt-3 mb-3">
                  <a
                    href={p.link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 font-pixel text-indigo-300 hover:text-indigo-200 text-[9px] bg-indigo-950 px-3 py-1.5 border border-indigo-800 transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    [ACESSAR NO GITHUB →]
                  </a>
                </div>

                <div className="flex flex-wrap gap-1.5 mt-3">
                  {p.tags.map((t) => (
                    <span key={t} className="pixel-tag">{t}</span>
                  ))}
                </div>
              </TiltCard>
            </div>
          ))}
        </div>

        {/* add project hint */}
        <div className="fade-up mt-8 border border-dashed border-indigo-900/80 p-6 text-center bg-[#141522]/50">
          <p className="font-pixel text-indigo-400 text-[9px] sm:text-xs">
            + NOVOS PROJETOS EM DESENVOLVIMENTO...
          </p>
          <div className="mt-2 flex justify-center">
            <span className="cursor-blink font-pixel text-indigo-400 text-lg">█</span>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Contact ───────────────────────────────────────────────────────────────
function Contact() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  const contacts = [
    { label: "GitHub", value: "github.com/yuri-andrade1", icon: "GH", link: "https://github.com/yuri-andrade1" },
    { label: "LinkedIn", value: "yuri-andrade-4620712a8", icon: "LI", link: "https://www.linkedin.com/in/yuri-andrade-4620712a8" },
    { label: "Email", value: "yuridelimaandrade34@gmail.com", icon: "✉", link: "mailto:yuridelimaandrade34@gmail.com" },
    { label: "Telefone / WhatsApp", value: "(85) 99137-6674", icon: "📱", link: "https://wa.me/5585991376674" },
    { label: "Localização", value: "Fortaleza, CE - Brasil", icon: "📍", link: "#" },
  ];

  return (
    <section id="contato" className="relative py-16 sm:py-24 px-5">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10 sm:mb-12 fade-up">
          <h2 className="font-pixel text-xl sm:text-2xl md:text-3xl text-slate-100 section-title crt-glow-sm">
            CONTATO
          </h2>
          <div className="w-36 sm:w-48 h-px bg-indigo-800 mt-3" />
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* social links */}
          <div className="fade-left space-y-3.5">
            <p className="font-pixel text-indigo-400 text-[10px] sm:text-xs mb-4 uppercase tracking-wider">CANAIS DE COMUNICAÇÃO</p>
            {contacts.map((c) => (
              <a
                key={c.label}
                href={c.link}
                target={c.link.startsWith("http") ? "_blank" : "_self"}
                rel="noreferrer"
                className="flex items-center gap-3.5 p-3.5 border border-indigo-900/60 bg-[#141522] hover:border-indigo-500 hover:bg-indigo-950/40 transition-all group block"
                style={{ boxShadow: "3px 3px 0 #1e1b4b" }}
              >
                <div
                  className="w-9 h-9 flex items-center justify-center border border-indigo-700/60 bg-indigo-950/60 font-pixel text-indigo-300 group-hover:border-indigo-400 transition-colors shrink-0 text-xs"
                >
                  {c.icon}
                </div>
                <div className="min-w-0">
                  <p className="font-pixel text-slate-200 group-hover:text-indigo-300 transition-colors text-[9px] sm:text-[10px]">
                    {c.label}
                  </p>
                  <p className="font-mono text-slate-400 text-xs mt-0.5 truncate">{c.value}</p>
                </div>
                <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="font-pixel text-indigo-400 text-xs">[→]</span>
                </div>
              </a>
            ))}
          </div>

          {/* form */}
          <div className="fade-right">
            <p className="font-pixel text-indigo-400 text-[10px] sm:text-xs mb-4 uppercase tracking-wider">ENVIAR MENSAGEM DIRECTA</p>
            {sent ? (
              <div className="border-2 border-emerald-500/40 bg-emerald-950/20 p-6 sm:p-8 text-center" style={{ boxShadow: "4px 4px 0 #064e3b" }}>
                <p className="font-pixel text-emerald-400 text-xs sm:text-sm crt-glow-sm mb-2">MENSAGEM ENVIADA!</p>
                <p className="font-mono text-slate-300 text-xs">// Retornarei o contato em breve...</p>
                <button
                  onClick={() => setSent(false)}
                  className="mt-5 neon-btn"
                  style={{ borderColor: "#10b981", color: "#34d399" }}
                >
                  NOVA MENSAGEM
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block font-pixel text-indigo-300 mb-1.5 text-[8px] uppercase">
                    SEU NOME
                  </label>
                  <input
                    type="text"
                    placeholder="Seu nome..."
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-[#141522] border border-indigo-900/60 text-slate-100 font-mono text-xs sm:text-sm px-3.5 py-2.5 focus:outline-none focus:border-indigo-500 placeholder:text-slate-600 transition-colors"
                  />
                </div>
                <div>
                  <label className="block font-pixel text-indigo-300 mb-1.5 text-[8px] uppercase">
                    SEU EMAIL
                  </label>
                  <input
                    type="email"
                    placeholder="seu@email.com"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-[#141522] border border-indigo-900/60 text-slate-100 font-mono text-xs sm:text-sm px-3.5 py-2.5 focus:outline-none focus:border-indigo-500 placeholder:text-slate-600 transition-colors"
                  />
                </div>
                <div>
                  <label className="block font-pixel text-indigo-300 mb-1.5 text-[8px] uppercase">
                    MENSAGEM
                  </label>
                  <textarea
                    placeholder="Sua mensagem aqui..."
                    rows={4}
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full bg-[#141522] border border-indigo-900/60 text-slate-100 font-mono text-xs sm:text-sm px-3.5 py-2.5 focus:outline-none focus:border-indigo-500 placeholder:text-slate-600 resize-none transition-colors"
                  />
                </div>
                <button type="submit" className="neon-btn w-full justify-center">
                  ENVIAR MENSAGEM
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="border-t border-indigo-900/40 py-8 px-5 text-center bg-[#0b0c10]">
      <p className="font-pixel text-indigo-400 text-[8px] sm:text-[9px]">
        © 2026 YURI DE LIMA ANDRADE · FORTALEZA, CE
      </p>
      <p className="font-mono text-slate-500 text-xs mt-2">
        // Desenvolvido com React 19, TypeScript e Tailwind CSS
      </p>
    </footer>
  );
}

// ── App ───────────────────────────────────────────────────────────────────
export default function App() {
  useScrollReveal();

  return (
    <div className="relative min-h-screen bg-[#0b0c10] text-slate-200">
      <div className="scanlines" />
      <div className="noise-overlay" />
      <Stars />
      <div className="relative z-10">
        <Nav />
        <Hero />
        <About />
        <Experience />
        <Skills />
        <Projects />
        <Contact />
        <Footer />
      </div>
    </div>
  );
}


