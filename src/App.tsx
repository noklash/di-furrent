import { useEffect, useMemo, useState } from "react";

type Theme = "light" | "dark" | "system";
type Article = { title: string; slug: string; excerpt: string; date: string; category: string; readingTime: number };

const articles: Article[] = [
  ["Hostcheck: A Defensible Health Assessment Tool", "hostcheck-a-defensible-health-assessment-tool", "Hostcheck turns Linux system observations into explainable health assessments, with explicit policies, structured output, and a distinction between unhealthy resources and missing evidence.", "2026-10-12", "Infrastructure", 9],
  ["The Hostcheck Build, Part 2: Understanding Linux Processes", "the-hostcheck-build-part-2-understanding-linux-processes", "Turning Linux process state exposed through /proc into a structured model, deriving CPU utilisation and handling the realities of a live system.", "2026-10-05", "Software Engineering", 8],
  ["The Hostcheck Build, Part 1: Reading a Linux Host", "the-hostcheck-build-part-1-reading-a-linux-host", "What it takes to turn Linux kernel-exposed state into a useful host health and reliability tool.", "2026-09-28", "Infrastructure", 7],
  ["When a Working Website Wasn’t Good Enough", "when-a-working-website-wasnt-good-enough", "Inspecting the request path and moving from client-rendered content to server-rendered HTML with clean URLs and caching.", "2026-09-21", "Software Engineering", 7],
  ["Inspecting Filesystem Identity in C: What fswatch Revealed About Paths, Inodes, and Links", "inspecting-filesystem-identity-in-c-fswatch", "A practical investigation into pathnames, inodes, hard links, symbolic links, stat(), lstat(), and reproducible systems experiments.", "2026-09-19", "Infrastructure", 8],
  ["ProcWatch: Reconstructing Linux Process Monitoring from /proc", "procwatch-reconstructing-linux-process-monitoring-from-proc", "A C systems project that rebuilds process monitoring by reading Linux /proc directly and handling races, virtual memory, and kernel interfaces.", "2026-09-08", "Software Engineering", 8],
  ["memmap: Inspecting Linux Process Virtual Memory Through /proc", "memmap-inspecting-linux-process-virtual-memory-through-proc", "A C-based systems tool that parses /proc maps and smaps to expose process virtual address space structure, residency, and demand-paging behavior.", "2026-09-05", "Software Engineering", 8],
].map(([title, slug, excerpt, date, category, readingTime]) => ({ title, slug, excerpt, date, category, readingTime }) as Article);

const dateLabel = (date: string) => new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(`${date}T12:00:00`));
const Arrow = () => <span className="arrow" aria-hidden="true">↗</span>;
const Label = ({ index, children }: { index: string; children: React.ReactNode }) => <div className="section-label"><span>{index}</span><span>{children}</span></div>;

function ThemeControl({ theme, setTheme }: { theme: Theme; setTheme: (theme: Theme) => void }) {
  return <div className="theme-control" aria-label="Appearance">
    {(["light", "dark", "system"] as Theme[]).map((item) => <button key={item} className={theme === item ? "active" : ""} aria-pressed={theme === item} onClick={() => setTheme(item)}><i className={item} />{item}</button>)}
  </div>;
}

function Header({ theme, setTheme, navigate }: { theme: Theme; setTheme: (theme: Theme) => void; navigate: (path: string) => void }) {
  const [open, setOpen] = useState(false);
  const go = (path: string) => { navigate(path); setOpen(false); };
  return <header className="site-header"><div className="shell header-inner">
    <button className="wordmark" onClick={() => go("/")}>DIFURRENT<span>.</span></button>
    <nav className={open ? "open" : ""} aria-label="Primary navigation">
      <button onClick={() => go("/#work")}>Work</button><button onClick={() => go("/#about")}>About</button><button onClick={() => go("/writing")}>Writing</button><button onClick={() => go("/#contact")}>Contact</button>
    </nav>
    <div className="header-actions"><ThemeControl theme={theme} setTheme={setTheme} /><button className="menu" aria-label="Toggle navigation" aria-expanded={open} onClick={() => setOpen(!open)}><i /><i /></button></div>
  </div></header>;
}

function SystemMap() {
  const [active, setActive] = useState("runtime");
  const nodes = [["interface", 12, 18], ["runtime", 43, 18], ["service", 73, 18], ["network", 26, 53], ["compute", 58, 53], ["kernel", 35, 82], ["storage", 78, 82]] as const;
  return <div className="system-map">
    <div className="map-meta"><span>SYS / 001</span><span>DEPENDENCY STRUCTURE</span></div>
    <svg viewBox="0 0 100 100" aria-hidden="true"><path d="M12 18H43L73 18M43 18L26 53M43 18L58 53M73 18L58 53M26 53L35 82M58 53L35 82M58 53L78 82" /><circle className="signal" r="1.1"><animateMotion dur="5s" repeatCount="indefinite" path="M12 18H43L58 53L35 82" /></circle></svg>
    {nodes.map(([id, x, y]) => <button key={id} className={`map-node ${active === id ? "active" : ""}`} style={{ left: `${x}%`, top: `${y}%` }} onMouseEnter={() => setActive(id)} onFocus={() => setActive(id)}><i />{id}</button>)}
    <div className="map-readout"><span>SELECTED LAYER</span><strong>{active}</strong><span>Relationships, not isolation.</span></div>
  </div>;
}

function Home({ navigate }: { navigate: (path: string) => void }) {
  const domains = [
    ["Software", "Products, tools, interfaces, and applications built around real operational problems."],
    ["Infrastructure", "Compute, networking, storage, cloud environments, and the foundations that keep services running."],
    ["AI Systems", "Systems required to develop, deploy, serve, and operate intelligent workloads reliably."],
    ["Research", "Focused investigations that reduce uncertainty and turn understanding into practical direction."],
  ];
  return <main id="main">
    <section className="hero shell">
      <div className="hero-copy"><Label index="01">INDEPENDENT TECHNOLOGY COMPANY</Label><h1>Engineering the systems beneath <em>modern software.</em></h1>
        <div className="hero-bottom"><p>Difurrent builds software and works with the infrastructure, networks, and systems that make it useful and reliable.</p><a className="text-link" href="#work">Explore the work <Arrow /></a></div>
      </div><SystemMap />
    </section>

    <section className="section philosophy" id="about"><div className="shell"><Label index="02">OPERATING PRINCIPLE</Label>
      <div className="two-col"><h2>Technology, built with understanding.</h2><div className="body-copy"><p className="lead">We prefer evidence over assumptions.</p><p>We look closely at how systems actually behave so we can solve real problems rather than symptoms. We build before we speculate. We measure before we optimize.</p><p>The goal is simple: technology that works, can be understood, and can be improved.</p></div></div>
      <div className="method">{[["01", "Understand the system.", "Dependencies · constraints · behaviour"], ["02", "Build the thing.", "Software · infrastructure · tools"], ["03", "Learn from what happens.", "Evidence · outcomes · iteration"]].map(([n,t,d]) => <div key={n}><span>{n}</span><strong>{t}</strong><small>{d}</small></div>)}</div>
    </div></section>

    <section className="section domains"><div className="shell"><Label index="03">CONNECTED AREAS</Label>
      <div className="domains-head"><h2>We build where software meets systems.</h2><p>From the interface people use to the operational foundations beneath it.</p></div>
      <div className="domain-list">{domains.map(([title, copy], i) => <article key={title}><span>0{i + 1}</span><h3>{title}</h3><p>{copy}</p><b>+</b></article>)}</div>
    </div></section>

    <section className="section work" id="work"><div className="shell"><Label index="04">SELECTED WORK</Label>
      <article className="featured-project"><div className="project-copy"><div className="project-meta"><span>LINUX SYSTEMS</span><span>C / PROCFS</span><span>2026</span></div><h2>ProcWatch</h2><p>A Linux process monitoring tool built directly against the <code>/proc</code> interface—without relying on <code>ps</code>, <code>top</code>, or external utilities.</p><a className="text-link" href="https://difurrent.com/articles/procwatch-reconstructing-linux-process-monitoring-from-proc/">Read the field note <Arrow /></a></div>
        <div className="process-visual"><div className="visual-head"><span>PROCWATCH / SNAPSHOT</span><span>STRUCTURE, NOT TELEMETRY</span></div><div className="process-tree">{[["001","init","/sbin/init"],["284","service","system process"],["612","worker","child relationship"],["437","network","open descriptors"],["901","listener","socket mapping"]].map((row,i) => <div key={row[0]} className={`${i === 2 ? "active " : ""}indent-${i === 0 ? 0 : i === 2 || i === 4 ? 2 : 1}`}><span>{row[0]}</span><strong>{row[1]}</strong><small>{row[2]}</small></div>)}</div><div className="visual-foot"><span>/proc/[pid]/stat</span><span>/proc/[pid]/fd</span><span>/proc/[pid]/maps</span></div></div>
      </article>
      <div className="project-list"><article><small>02 / GO</small><div><h3>Hostcheck</h3><p>Explainable Linux host assessment with explicit policy and uncertainty-aware reporting.</p></div><a href="https://difurrent.com/articles/hostcheck-a-defensible-health-assessment-tool/"><Arrow /></a></article><article><small>03 / SYSTEMS</small><div><h3>Systems tooling</h3><p>Experiments in filesystems, memory, networking, and the mechanisms beneath applications.</p></div><a href="https://difurrent.com/articles/"><Arrow /></a></article></div>
    </div></section>

    <section className="section writing-preview"><div className="shell"><div className="writing-head"><div><Label index="05">WRITING</Label><h2>Notes from the current.</h2></div><button className="text-link" onClick={() => navigate("/writing")}>View the archive <Arrow /></button></div>
      <div className="article-list">{articles.slice(0,3).map((article,i) => <a className="article-row" key={article.slug} href={`https://difurrent.com/articles/${article.slug}/`}><span>0{i+1}</span><small>{article.category}</small><h3>{article.title}</h3><time>{dateLabel(article.date)}</time><Arrow /></a>)}</div>
    </div></section>

    <section className="contact" id="contact"><div className="shell contact-grid"><div><Label index="06">START A CONVERSATION</Label><h2>Let’s build something useful.</h2></div><div className="contact-copy"><p>Have a technology problem worth investigating, a system that needs to be built, or an idea worth exploring?</p><a href="mailto:goodluck@difurrent.com"><span>goodluck@difurrent.com</span><Arrow /></a><small>PROJECTS · PARTNERSHIPS · RESEARCH · GENERAL ENQUIRIES</small></div></div></section>
  </main>;
}

function Writing() {
  const [query, setQuery] = useState(""); const [category, setCategory] = useState("All");
  const visible = useMemo(() => articles.filter(a => (category === "All" || a.category === category) && `${a.title} ${a.excerpt}`.toLowerCase().includes(query.toLowerCase())), [category, query]);
  return <main id="main" className="writing-page"><section className="writing-hero shell"><Label index="FIELD NOTES / ARCHIVE">WRITING</Label><h1>Notes from the current.</h1><p>Technical investigations, engineering notes, and observations from building systems.</p></section>
    <section className="archive shell"><div className="archive-tools"><div className="filters">{["All","Infrastructure","Software Engineering"].map(item => <button key={item} className={category === item ? "active" : ""} onClick={() => setCategory(item)}>{item}</button>)}</div><label className="search"><span>SEARCH</span><input type="search" placeholder="Title, topic, or phrase" value={query} onChange={e => setQuery(e.target.value)} /></label></div>
      <div className="archive-count"><span>{String(visible.length).padStart(2,"0")} ENTRIES</span><span>REVERSE CHRONOLOGICAL</span></div>
      <div className="archive-list">{visible.map((a,i) => <a className="archive-row" key={a.slug} href={`https://difurrent.com/articles/${a.slug}/`}><span>{String(i+1).padStart(2,"0")}</span><div><small>{a.category}　/　{a.readingTime} MIN READ</small><h2>{a.title}</h2><p>{a.excerpt}</p></div><time>{dateLabel(a.date)}</time><Arrow /></a>)}{!visible.length && <div className="empty"><span>00</span><div><h2>No matching field notes.</h2><p>Try another phrase or clear the selected category.</p></div><button onClick={() => { setQuery(""); setCategory("All"); }}>Clear filters</button></div>}</div>
    </section></main>;
}

function Footer({ navigate }: { navigate: (path: string) => void }) {
  return <footer><div className="shell footer-grid"><div><strong>DIFURRENT.</strong><p>A different current.</p></div><div className="footer-nav"><button onClick={() => navigate("/#work")}>Work</button><button onClick={() => navigate("/writing")}>Writing</button><button onClick={() => navigate("/#about")}>About</button><button onClick={() => navigate("/#contact")}>Contact</button></div><div className="footer-links"><a href="https://www.linkedin.com/company/difurrent/">LinkedIn <Arrow /></a><a href="https://x.com/difurrent">X / Twitter <Arrow /></a></div><div className="footer-base"><span>© 2026 DIFURRENT LTD.</span><span>ENGINEERED WITH ATTENTION</span></div></div></footer>;
}

export default function App() {
  const [theme, setTheme] = useState<Theme>(() => { const saved = localStorage.getItem("difurrent-theme"); return saved === "light" || saved === "dark" || saved === "system" ? saved : "system"; });
  const [path, setPath] = useState(window.location.pathname);
  useEffect(() => { const media = matchMedia("(prefers-color-scheme: dark)"); const apply = () => { const resolved = theme === "system" ? media.matches ? "dark" : "light" : theme; document.documentElement.dataset.theme = resolved; document.documentElement.style.colorScheme = resolved; }; apply(); media.addEventListener("change", apply); localStorage.setItem("difurrent-theme", theme); return () => media.removeEventListener("change", apply); }, [theme]);
  useEffect(() => { const pop = () => setPath(location.pathname); addEventListener("popstate", pop); return () => removeEventListener("popstate", pop); }, []);
  useEffect(() => {
    document.title = path.startsWith("/writing")
      ? "Writing — Difurrent"
      : "Difurrent — Engineering the systems beneath modern software";
  }, [path]);
  const navigate = (next: string) => { const [pathname, hash] = next.split("#"); if (pathname !== location.pathname) { history.pushState({}, "", next); setPath(pathname); scrollTo({ top: 0, behavior: "smooth" }); if (hash) requestAnimationFrame(() => document.getElementById(hash)?.scrollIntoView()); } else if (hash) document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" }); };
  return <><a className="skip-link" href="#main">Skip to content</a><Header theme={theme} setTheme={setTheme} navigate={navigate} />{path.startsWith("/writing") ? <Writing /> : <Home navigate={navigate} />}<Footer navigate={navigate} /></>;
}
