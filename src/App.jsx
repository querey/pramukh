import { useState, useEffect, useRef, useCallback } from "react";


// ─── Theme & Config ─────────────────────────────────────────
const theme = {
  bg: "#06080d",
  bgAlt: "#0c1018",
  surface: "#111722",
  surfaceHover: "#161e2d",
  gold: "#d4a853",
  goldDim: "rgba(212,168,83,0.12)",
  goldGlow: "rgba(212,168,83,0.25)",
  text: "#e8e4dc",
  textMuted: "#8a9ab5",
  textDim: "#4a5568",
  border: "rgba(212,168,83,0.08)",
  borderHover: "rgba(212,168,83,0.25)",
};

const NAV_ITEMS = ["About", "Experience", "Skills", "Testimonials", "Insights", "Contact"];

const SKILLS = [
  { icon: "⚡", title: "Outbound Prospecting", desc: "Cold email, cold call, multi-touch sequences. Hyper-personalized and signal-driven — zero filler, zero fluff." },
  { icon: "🧠", title: "Pipeline Architecture", desc: "Building pipeline from scratch — target account lists, ICP development, territory mapping, and repeatable systems." },
  { icon: "👥", title: "BDR Leadership", desc: "Coaching reps through structured 1:1s, call reviews, ramp plans, and performance frameworks that scale." },
  { icon: "🔍", title: "Account Intelligence", desc: "Tech stack analysis, closed-lost re-engagement, competitive signals — turning data into personalized angles." },
  { icon: "🤖", title: "AI-Powered Sales", desc: "Leveraging AI for pipeline generation, enrichment, sequencing, and CRM workflows that multiply output." },
  { icon: "📈", title: "B2B SaaS Mastery", desc: "HR tech, finance stack, ARR multiples, ESOPs, startup comp — deep fluency in the SaaS ecosystem." },
];

const TESTIMONIALS = [
  {
    text: "Pramukh is an outstanding colleague. His sense of urgency and attention to detail is off the charts. He moved up the ladder quickly at Rippling — from Inbound to Outbound to spearheading Special Projects. I'm excited to watch his career progress.",
    author: "Colleague at Rippling",
    role: "LinkedIn Recommendation",
  },
  {
    text: "Pramukh did a great job growing within Rippling. He's a fast learner, great at networking and hunting leads, a team player, and never shies away from asking questions. He will be a great asset to any team.",
    author: "Former Manager",
    role: "LinkedIn Recommendation",
  },
];

const INSIGHTS = [
  { tag: "Sales Hiring", title: "Why big-logo hires fail at startups", desc: "No brand recognition, no inbound, no SDR team. What you need is someone who can build — not just follow a process.", icon: "🎯" },
  { tag: "Buying Signals", title: "Most SDRs get buying signals wrong", desc: "Hiring ≠ Buying. Raising a round ≠ Ready to spend. These signals rarely reflect real intent to purchase.", icon: "📡" },
  { tag: "Outbound", title: "Building pipeline from zero", desc: "No backup. Just a list and a phone. The playbook for selling when nobody knows your name yet.", icon: "🚀" },
];

const TIMELINE = [
  {
    period: "2022 — Present",
    role: "BDR Manager",
    company: "Rippling",
    location: "Bengaluru, India",
    current: true,
    bullets: [
      "Managing BDR reps across outbound pipeline generation",
      "Running account-based sales motions with AE partners",
      "Promoted: Inbound SDR → Outbound → Special Projects → BDR Manager",
      "Built outreach frameworks grounded in HR & finance tech stack signals",
    ],
  },
  {
    period: "Earlier Career",
    role: "Business Development",
    company: "BYJU'S & other ventures",
    location: "India",
    current: false,
    bullets: [
      "Foundational B2B sales skills in high-volume environments",
      "Learned the discipline of hunting without brand recognition or inbound support",
    ],
  },
];

// ─── Hooks ──────────────────────────────────────────────────
function useInView(options = {}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setIsVisible(true); obs.unobserve(el); }
    }, { threshold: 0.15, ...options });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, isVisible];
}

function useScrollY() {
  const [y, setY] = useState(0);
  useEffect(() => {
    const h = () => setY(window.scrollY);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);
  return y;
}

function useMouseParallax(factor = 0.02) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const h = (e) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      setOffset({ x: (e.clientX - cx) * factor, y: (e.clientY - cy) * factor });
    };
    window.addEventListener("mousemove", h, { passive: true });
    return () => window.removeEventListener("mousemove", h);
  }, [factor]);
  return offset;
}

// ─── Animated Counter ───────────────────────────────────────
function Counter({ end, suffix = "", duration = 2000 }) {
  const [count, setCount] = useState(0);
  const [ref, isVisible] = useInView();
  useEffect(() => {
    if (!isVisible) return;
    let start = 0;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [isVisible, end, duration]);
  return <span ref={ref}>{count}{suffix}</span>;
}

// ─── Floating Particles (Canvas) ────────────────────────────
function ParticleField() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;
    let particles = [];
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.5,
        dx: (Math.random() - 0.5) * 0.3,
        dy: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.4 + 0.1,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.dx; p.y += p.dy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212,168,83,${p.opacity})`;
        ctx.fill();
      });
      // Draw lines between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(212,168,83,${0.06 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} />;
}

// ─── Reveal Wrapper ─────────────────────────────────────────
function Reveal({ children, delay = 0, direction = "up", style = {} }) {
  const [ref, isVisible] = useInView();
  const transforms = { up: "translateY(40px)", down: "translateY(-40px)", left: "translateX(40px)", right: "translateX(-40px)" };
  return (
    <div ref={ref} style={{
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? "translate(0,0)" : transforms[direction],
      transition: `opacity 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
      ...style,
    }}>
      {children}
    </div>
  );
}

// ─── Magnetic Button ────────────────────────────────────────
function MagneticButton({ children, href, variant = "primary", onClick, style = {} }) {
  const ref = useRef(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const handleMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    setOffset({ x: (e.clientX - cx) * 0.15, y: (e.clientY - cy) * 0.15 });
  };
  const handleLeave = () => setOffset({ x: 0, y: 0 });
  const base = {
    display: "inline-flex", alignItems: "center", gap: "8px",
    padding: "16px 36px", fontFamily: "'Outfit',sans-serif",
    fontSize: "0.82rem", fontWeight: 600, letterSpacing: "0.1em",
    textTransform: "uppercase", border: "none", cursor: "pointer",
    textDecoration: "none", borderRadius: "2px",
    transform: `translate(${offset.x}px, ${offset.y}px)`,
    transition: "background 0.3s, border-color 0.3s, color 0.3s, box-shadow 0.3s, transform 0.15s ease-out",
  };
  const variants = {
    primary: { background: theme.gold, color: theme.bg, boxShadow: `0 0 40px ${theme.goldGlow}` },
    outline: { background: "transparent", color: theme.text, border: `1px solid ${theme.borderHover}` },
  };
  const Tag = href ? "a" : "button";
  return (
    <Tag ref={ref} href={href} onClick={onClick} target={href?.startsWith("http") ? "_blank" : undefined}
      onMouseMove={handleMove} onMouseLeave={handleLeave}
      style={{ ...base, ...variants[variant], ...style }}
      onMouseOver={(e) => {
        if (variant === "outline") { e.currentTarget.style.borderColor = theme.gold; e.currentTarget.style.color = theme.gold; }
        else { e.currentTarget.style.boxShadow = `0 0 60px ${theme.goldGlow}`; }
      }}
      onMouseOut={(e) => {
        if (variant === "outline") { e.currentTarget.style.borderColor = theme.borderHover; e.currentTarget.style.color = theme.text; }
        else { e.currentTarget.style.boxShadow = `0 0 40px ${theme.goldGlow}`; }
      }}
    >
      {children}
    </Tag>
  );
}

// ─── Navigation ─────────────────────────────────────────────
function Nav() {
  const scrollY = useScrollY();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState("");
  
  useEffect(() => {
    const sections = NAV_ITEMS.map(n => document.getElementById(n.toLowerCase()));
    const h = () => {
      for (let i = sections.length - 1; i >= 0; i--) {
        if (sections[i] && sections[i].getBoundingClientRect().top < 200) {
          setActive(NAV_ITEMS[i].toLowerCase()); return;
        }
      }
    };
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const scrolled = scrollY > 60;
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: scrolled ? "rgba(6,8,13,0.95)" : "transparent",
      backdropFilter: scrolled ? "blur(20px) saturate(1.4)" : "none",
      borderBottom: scrolled ? `1px solid ${theme.border}` : "1px solid transparent",
      transition: "all 0.5s cubic-bezier(0.16,1,0.3,1)",
    }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", padding: scrolled ? "14px 40px" : "24px 40px", transition: "padding 0.5s" }}>
        <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
          style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.5rem", color: theme.text, textDecoration: "none", letterSpacing: "-0.03em" }}>
          Pramukh<span style={{ color: theme.gold }}>.</span>
        </a>
        <div style={{ display: "flex", gap: 32, alignItems: "center" }} className="nav-desktop">
          {NAV_ITEMS.map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`}
              style={{
                color: active === item.toLowerCase() ? theme.gold : theme.textMuted,
                textDecoration: "none", fontSize: "0.78rem", fontWeight: 500,
                letterSpacing: "0.12em", textTransform: "uppercase",
                transition: "color 0.3s", position: "relative",
              }}
              onMouseOver={(e) => e.currentTarget.style.color = theme.gold}
              onMouseOut={(e) => e.currentTarget.style.color = active === item.toLowerCase() ? theme.gold : theme.textMuted}
            >
              {item}
              {active === item.toLowerCase() && (
                <span style={{ position: "absolute", bottom: -6, left: 0, right: 0, height: 2, background: theme.gold, borderRadius: 1 }} />
              )}
            </a>
          ))}
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="nav-hamburger"
          style={{ display: "none", background: "none", border: "none", cursor: "pointer", flexDirection: "column", gap: 5, padding: 4 }}>
          <span style={{ display: "block", width: 24, height: 2, background: theme.text, transition: "all 0.3s", transform: mobileOpen ? "rotate(45deg) translate(5px,5px)" : "none" }} />
          <span style={{ display: "block", width: 24, height: 2, background: theme.text, transition: "all 0.3s", opacity: mobileOpen ? 0 : 1 }} />
          <span style={{ display: "block", width: 24, height: 2, background: theme.text, transition: "all 0.3s", transform: mobileOpen ? "rotate(-45deg) translate(5px,-5px)" : "none" }} />
        </button>
      </div>
      {mobileOpen && (
        <div style={{ background: "rgba(6,8,13,0.98)", padding: "20px 40px", display: "flex", flexDirection: "column", gap: 16 }}>
          {NAV_ITEMS.map(item => (
            <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setMobileOpen(false)}
              style={{ color: theme.textMuted, textDecoration: "none", fontSize: "0.85rem", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              {item}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}

// ─── Hero ───────────────────────────────────────────────────
function Hero() {
  const mouse = useMouseParallax(0.015);
  const scrollY = useScrollY();
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setTimeout(() => setLoaded(true), 100); }, []);

  return (
    <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", position: "relative", overflow: "hidden", background: theme.bg }}>
      <ParticleField />
      {/* Radial glows */}
      <div style={{ position: "absolute", top: "10%", right: "15%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(212,168,83,0.06) 0%, transparent 70%)", filter: "blur(40px)", transform: `translate(${mouse.x * 2}px, ${mouse.y * 2}px)`, transition: "transform 0.3s ease-out" }} />
      <div style={{ position: "absolute", bottom: "20%", left: "10%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(212,168,83,0.03) 0%, transparent 70%)", filter: "blur(60px)" }} />

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "160px 40px 120px", display: "grid", gridTemplateColumns: "1fr 360px", gap: 80, alignItems: "center", position: "relative", zIndex: 2, width: "100%" }}>
        <div>
          <div style={{
            opacity: loaded ? 1 : 0, transform: loaded ? "none" : "translateY(30px)",
            transition: "all 1s cubic-bezier(0.16,1,0.3,1) 0.1s"
          }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
              <span style={{ width: 36, height: 2, background: theme.gold }} />
              <span style={{ fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: theme.gold }}>
                Sales Leader · B2B SaaS
              </span>
            </div>
          </div>
          <h1 style={{
            fontFamily: "'Playfair Display',serif", fontSize: "clamp(3rem, 5.5vw, 4.6rem)",
            color: theme.text, lineHeight: 1.08, letterSpacing: "-0.03em", marginBottom: 28,
            opacity: loaded ? 1 : 0, transform: loaded ? "none" : "translateY(40px)",
            transition: "all 1s cubic-bezier(0.16,1,0.3,1) 0.25s"
          }}>
            Building pipeline<br /><span style={{ color: theme.gold, fontStyle: "italic" }}>from zero.</span>
          </h1>
          <p style={{
            fontSize: "1.08rem", color: theme.textMuted, maxWidth: 540, lineHeight: 1.8, marginBottom: 44,
            opacity: loaded ? 1 : 0, transform: loaded ? "none" : "translateY(30px)",
            transition: "all 1s cubic-bezier(0.16,1,0.3,1) 0.4s"
          }}>
            BDR Manager at Rippling, specializing in outbound pipeline generation, account-based sales, and building high-performance sales development teams across global markets.
          </p>

          {/* Stats */}
          <div style={{
            display: "flex", gap: 48, marginBottom: 48,
            opacity: loaded ? 1 : 0, transform: loaded ? "none" : "translateY(20px)",
            transition: "all 1s cubic-bezier(0.16,1,0.3,1) 0.55s"
          }}>
            {[
              { num: 4, suffix: "+", label: "Years at Rippling" },
              { num: 4, suffix: "x", label: "Promotions" },
              { num: 500, suffix: "+", label: "Network" },
            ].map((s, i) => (
              <div key={i}>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "2.2rem", color: theme.gold, lineHeight: 1 }}>
                  <Counter end={s.num} suffix={s.suffix} />
                </div>
                <div style={{ fontSize: "0.7rem", color: theme.textDim, textTransform: "uppercase", letterSpacing: "0.12em", marginTop: 6 }}>{s.label}</div>
              </div>
            ))}
          </div>

          <div style={{
            display: "flex", gap: 16, flexWrap: "wrap",
            opacity: loaded ? 1 : 0, transform: loaded ? "none" : "translateY(20px)",
            transition: "all 1s cubic-bezier(0.16,1,0.3,1) 0.65s"
          }}>
            <MagneticButton href="#contact">Get in Touch</MagneticButton>
            <MagneticButton href="https://www.linkedin.com/in/pramukh-g-8128b449/" variant="outline">LinkedIn ↗</MagneticButton>
          </div>
        </div>

        {/* Photo */}
        <div style={{
          position: "relative",
          opacity: loaded ? 1 : 0, transform: loaded ? `translate(${mouse.x}px, ${mouse.y}px)` : "translateY(50px) scale(0.95)",
          transition: loaded ? "transform 0.3s ease-out" : "all 1.2s cubic-bezier(0.16,1,0.3,1) 0.4s",
        }}>
          <img src={HEADSHOT_URL} alt="Pramukh G"
            style={{ width: "100%", aspectRatio: "3/4", objectFit: "cover", borderRadius: 4, position: "relative", zIndex: 2, boxShadow: `0 40px 80px rgba(0,0,0,0.5), 0 0 80px ${theme.goldDim}`, filter: "contrast(1.05) brightness(1.02)" }} />
          <div style={{ position: "absolute", top: 20, left: 20, right: -20, bottom: -20, border: `1.5px solid ${theme.gold}`, borderRadius: 4, opacity: 0.3, zIndex: 1 }} />
          <div style={{ position: "absolute", top: -30, right: -30, width: 80, height: 80, border: `2px solid ${theme.gold}`, opacity: 0.15, transform: "rotate(45deg)" }} />
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)", zIndex: 10,
        display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
        opacity: scrollY > 100 ? 0 : 0.5, transition: "opacity 0.5s",
      }}>
        <span style={{ fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: theme.textDim }}>Scroll</span>
        <div style={{ width: 1, height: 40, background: `linear-gradient(to bottom, ${theme.gold}, transparent)` }}>
          <div style={{ width: 3, height: 8, background: theme.gold, borderRadius: 2, marginLeft: -1, animation: "scrollPulse 2s infinite" }} />
        </div>
      </div>
    </section>
  );
}

// ─── About ──────────────────────────────────────────────────
function About() {
  return (
    <section id="about" style={{ padding: "120px 40px", background: theme.bgAlt, position: "relative" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${theme.border}, transparent)` }} />
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <Reveal>
          <SectionHeader label="About" title="The operator who builds" subtitle="Not a process follower — a pipeline architect." />
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 64, alignItems: "start", marginTop: 64 }}>
          <div>
            <Reveal delay={0.1}>
              <p style={{ fontSize: "1.05rem", color: theme.textMuted, lineHeight: 1.85, marginBottom: 24 }}>
                <span style={{ fontFamily: "'Playfair Display',serif", fontSize: "3.2rem", float: "left", lineHeight: 0.8, marginRight: 10, marginTop: 8, color: theme.gold }}>S</span>
                tarting at Rippling as an inbound SDR, I quickly transitioned to outbound prospecting and then to managing BDR teams, earning multiple promotions along the way. My approach is execution-first: relentless outbound activity, hyper-personalized messaging grounded in real tech-stack signals, and repeatable systems that scale.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <p style={{ fontSize: "1.02rem", color: theme.textMuted, lineHeight: 1.85, marginBottom: 24 }}>
                I've led account-based sales motions across geographically diverse territories, coached reps on pipeline discipline, and developed outreach frameworks that cut through noise. I care about the craft of selling — the research, the angle, the follow-up.
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <p style={{ fontSize: "1.02rem", color: theme.textMuted, lineHeight: 1.85 }}>
                My trajectory is pointed toward VP Sales, with a strong bias toward startup environments where equity upside and builder-stage ownership matter. I'm not looking for a seat — I'm looking for something to build.
              </p>
            </Reveal>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            {[
              { icon: "🎯", title: "Outbound First", desc: "Cold pipeline, cold prospects, cold start. No inbound crutch." },
              { icon: "📊", title: "Account-Based", desc: "Signal-driven targeting using tech stack data." },
              { icon: "🏗️", title: "Builder Mentality", desc: "From zero to system. Playbooks, sequences, frameworks." },
              { icon: "🌏", title: "Global Reach", desc: "Managed books across geographies with cultural fluency." },
            ].map((card, i) => (
              <Reveal key={i} delay={0.15 + i * 0.1}>
                <HoverCard>
                  <div style={{ fontSize: "1.8rem", marginBottom: 14 }}>{card.icon}</div>
                  <h4 style={{ fontSize: "0.92rem", fontWeight: 600, color: theme.text, marginBottom: 8 }}>{card.title}</h4>
                  <p style={{ fontSize: "0.82rem", color: theme.textMuted, lineHeight: 1.6 }}>{card.desc}</p>
                </HoverCard>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Reusable Card with hover ───────────────────────────────
function HoverCard({ children, style = {} }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: theme.surface, padding: 28, borderRadius: 4,
        border: `1px solid ${hovered ? theme.borderHover : theme.border}`,
        transform: hovered ? "translateY(-6px)" : "none",
        boxShadow: hovered ? `0 20px 50px rgba(0,0,0,0.2), 0 0 30px ${theme.goldDim}` : "none",
        transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
        position: "relative", overflow: "hidden", ...style,
      }}
    >
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 3,
        background: theme.gold, transform: hovered ? "scaleX(1)" : "scaleX(0)",
        transformOrigin: "left", transition: "transform 0.4s ease",
      }} />
      {children}
    </div>
  );
}

// ─── Section Header ─────────────────────────────────────────
function SectionHeader({ label, title, subtitle, light = false }) {
  return (
    <div style={{ textAlign: "center", maxWidth: 640, margin: "0 auto" }}>
      <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <span style={{ width: 24, height: 1, background: theme.gold }} />
        <span style={{ fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: theme.gold }}>{label}</span>
        <span style={{ width: 24, height: 1, background: theme.gold }} />
      </div>
      <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(2rem, 3.5vw, 2.8rem)", color: light ? "#fff" : theme.text, lineHeight: 1.15, letterSpacing: "-0.02em" }}>{title}</h2>
      {subtitle && <p style={{ fontSize: "1rem", color: light ? "rgba(255,255,255,0.45)" : theme.textMuted, marginTop: 14 }}>{subtitle}</p>}
    </div>
  );
}

// ─── Experience ─────────────────────────────────────────────
function Experience() {
  return (
    <section id="experience" style={{ padding: "120px 40px", background: theme.bg }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <Reveal><SectionHeader label="Experience" title="Career trajectory" subtitle="Climbing fast, building faster." /></Reveal>
        <div style={{ marginTop: 64, position: "relative", paddingLeft: 60 }}>
          <div style={{ position: "absolute", left: 23, top: 0, bottom: 0, width: 2, background: `linear-gradient(to bottom, ${theme.gold}, ${theme.border})` }} />
          {TIMELINE.map((item, i) => (
            <Reveal key={i} delay={i * 0.15}>
              <div style={{ marginBottom: 52, position: "relative" }}>
                <div style={{
                  position: "absolute", left: -49, top: 6, width: 24, height: 24, borderRadius: "50%",
                  background: item.current ? theme.gold : theme.bg,
                  border: `3px solid ${theme.gold}`, zIndex: 2,
                  boxShadow: item.current ? `0 0 20px ${theme.goldGlow}` : "none",
                }} />
                <div style={{ fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: theme.gold, marginBottom: 8 }}>{item.period}</div>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.5rem", color: theme.text, marginBottom: 4 }}>{item.role}</div>
                <div style={{ fontSize: "0.88rem", color: theme.textMuted, marginBottom: 16 }}>{item.company} · {item.location}</div>
                {item.bullets.map((b, j) => (
                  <div key={j} style={{ display: "flex", gap: 12, marginBottom: 8, fontSize: "0.9rem", color: theme.textMuted, lineHeight: 1.65 }}>
                    <span style={{ color: theme.gold, fontWeight: 700, flexShrink: 0 }}>—</span>
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Skills ─────────────────────────────────────────────────
function Skills() {
  return (
    <section id="skills" style={{ padding: "120px 40px", background: theme.bgAlt }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${theme.border}, transparent)` }} />
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <Reveal><SectionHeader label="Expertise" title="What I bring to the table" /></Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, marginTop: 64 }}>
          {SKILLS.map((skill, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <HoverCard>
                <div style={{ fontSize: "2rem", marginBottom: 18 }}>{skill.icon}</div>
                <h4 style={{ fontSize: "1rem", fontWeight: 600, color: theme.text, marginBottom: 10 }}>{skill.title}</h4>
                <p style={{ fontSize: "0.86rem", color: theme.textMuted, lineHeight: 1.7 }}>{skill.desc}</p>
              </HoverCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials ───────────────────────────────────────────
function Testimonials() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setActive(a => (a + 1) % TESTIMONIALS.length), 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="testimonials" style={{ padding: "120px 40px", background: `linear-gradient(135deg, ${theme.bg} 0%, #0f1520 50%, ${theme.bg} 100%)`, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 600px 400px at 50% 50%, ${theme.goldDim}, transparent)` }} />
      <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 2 }}>
        <Reveal><SectionHeader label="Testimonials" title="What colleagues say" subtitle="Words from people I've worked alongside." light /></Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, marginTop: 64 }}>
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={i} delay={i * 0.15}>
              <div style={{
                background: "rgba(255,255,255,0.03)", border: `1px solid rgba(255,255,255,0.06)`,
                borderRadius: 4, padding: 44, position: "relative",
                transition: "all 0.4s",
              }}
                onMouseOver={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.borderColor = theme.borderHover; }}
                onMouseOut={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; }}
              >
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "3rem", color: theme.gold, lineHeight: 1, marginBottom: 16, opacity: 0.6 }}>"</div>
                <p style={{ fontSize: "0.95rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.8, fontStyle: "italic", marginBottom: 28 }}>{t.text}</p>
                <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "#fff", textTransform: "uppercase", letterSpacing: "0.08em" }}>{t.author}</div>
                <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.35)", marginTop: 4 }}>{t.role}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Insights ───────────────────────────────────────────────
function Insights() {
  return (
    <section id="insights" style={{ padding: "120px 40px", background: theme.bg }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <Reveal><SectionHeader label="Insights" title="Thought leadership" subtitle="Perspectives on sales, hiring, and building pipeline." /></Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 28, marginTop: 64 }}>
          {INSIGHTS.map((post, i) => (
            <Reveal key={i} delay={i * 0.12}>
              <HoverCard style={{ padding: 0, overflow: "hidden" }}>
                <div style={{
                  height: 140, background: `linear-gradient(135deg, ${theme.bg}, #151d2e)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "3rem", opacity: 0.5,
                }}>
                  {post.icon}
                </div>
                <div style={{ padding: "28px 24px" }}>
                  <div style={{ fontSize: "0.66rem", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: theme.gold, marginBottom: 10 }}>{post.tag}</div>
                  <h4 style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.12rem", color: theme.text, lineHeight: 1.35, marginBottom: 12 }}>{post.title}</h4>
                  <p style={{ fontSize: "0.84rem", color: theme.textMuted, lineHeight: 1.7 }}>{post.desc}</p>
                </div>
              </HoverCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Contact ────────────────────────────────────────────────
function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [focused, setFocused] = useState(null);

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  const inputStyle = (field) => ({
    width: "100%", padding: "16px 20px",
    background: theme.surface, color: theme.text,
    border: `1px solid ${focused === field ? theme.gold : theme.border}`,
    borderRadius: 4, fontFamily: "'Outfit',sans-serif", fontSize: "0.9rem",
    outline: "none", transition: "border-color 0.3s, box-shadow 0.3s",
    boxShadow: focused === field ? `0 0 20px ${theme.goldDim}` : "none",
  });

  return (
    <section id="contact" style={{ padding: "120px 40px", background: theme.bgAlt }}>
      <div style={{ maxWidth: 920, margin: "0 auto" }}>
        <Reveal><SectionHeader label="Contact" title="Let's connect" subtitle="Open to conversations about sales leadership, startup roles, and pipeline strategy." /></Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, marginTop: 64, alignItems: "start" }}>
          <Reveal delay={0.1}>
            <div>
              <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.8rem", color: theme.text, marginBottom: 20 }}>Get in touch</h3>
              <p style={{ color: theme.textMuted, fontSize: "0.95rem", lineHeight: 1.8, marginBottom: 36 }}>
                Whether you're building a sales team from scratch, scaling outbound, or just want to trade notes on B2B SaaS — I'd love to hear from you.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {[
                  { icon: "📍", text: "Bengaluru, India" },
                  { icon: "🔗", text: "linkedin.com/in/pramukh-g", href: "https://www.linkedin.com/in/pramukh-g-8128b449/" },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ width: 44, height: 44, background: theme.surface, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", flexShrink: 0, border: `1px solid ${theme.border}` }}>
                      {item.icon}
                    </div>
                    {item.href ? (
                      <a href={item.href} target="_blank" style={{ color: theme.textMuted, textDecoration: "none", fontSize: "0.9rem", transition: "color 0.3s" }}
                        onMouseOver={(e) => e.currentTarget.style.color = theme.gold}
                        onMouseOut={(e) => e.currentTarget.style.color = theme.textMuted}>
                        {item.text}
                      </a>
                    ) : (
                      <span style={{ color: theme.textMuted, fontSize: "0.9rem" }}>{item.text}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.25}>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your Name"
                style={inputStyle("name")} onFocus={() => setFocused("name")} onBlur={() => setFocused(null)} />
              <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Your Email"
                style={inputStyle("email")} onFocus={() => setFocused("email")} onBlur={() => setFocused(null)} />
              <input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="Subject"
                style={inputStyle("subject")} onFocus={() => setFocused("subject")} onBlur={() => setFocused(null)} />
              <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Your Message" rows={5}
                style={{ ...inputStyle("message"), resize: "vertical", minHeight: 120 }} onFocus={() => setFocused("message")} onBlur={() => setFocused(null)} />
              <MagneticButton onClick={handleSubmit} style={{ alignSelf: "flex-start", marginTop: 8 }}>
                {submitted ? "✓ Sent!" : "Send Message"}
              </MagneticButton>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ─────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ background: theme.bg, padding: "44px 40px", textAlign: "center", borderTop: `1px solid ${theme.border}` }}>
      <p style={{ fontSize: "0.76rem", color: theme.textDim, letterSpacing: "0.05em" }}>
        © 2026 Pramukh G. All rights reserved. &nbsp;|&nbsp;{" "}
        <a href="https://www.linkedin.com/in/pramukh-g-8128b449/" target="_blank" style={{ color: theme.gold, textDecoration: "none" }}>LinkedIn</a>
      </p>
    </footer>
  );
}

// ─── App ────────────────────────────────────────────────────
export default function App() {
  return (
    <div style={{ fontFamily: "'Outfit',sans-serif", background: theme.bg, color: theme.text, lineHeight: 1.7, overflowX: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        ::selection { background: ${theme.goldDim}; color: ${theme.gold}; }
        @keyframes scrollPulse {
          0%, 100% { transform: translateY(0); opacity: 1; }
          50% { transform: translateY(20px); opacity: 0; }
        }
        @media (max-width: 900px) {
          .nav-desktop { display: none !important; }
          .nav-hamburger { display: flex !important; }
        }
      `}</style>
      <Nav />
      <Hero />
      <About />
      <Experience />
      <Skills />
      <Testimonials />
      <Insights />
      <Contact />
      <Footer />
    </div>
  );
}
