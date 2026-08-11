import { useCallback, useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronRight,
  CircleAlert,
  Code2,
  Command,
  Copy,
  Mail,
  MapPin,
  Menu,
  RotateCcw,
  ShieldCheck,
  Terminal,
  Wifi,
  X,
} from "lucide-react";

const portrait = "./jashwanth-raj-avatar.jpg";

const capabilities = [
  {
    id: "01",
    title: "Diagnose",
    copy: "Isolate hardware, OS, and network faults without losing sight of the person affected.",
    tools: "Windows / Hardware / SLA",
  },
  {
    id: "02",
    title: "Secure",
    copy: "Identify weak points, validate risk, and disclose vulnerabilities with responsibility.",
    tools: "Linux / Scanning / Hardening",
  },
  {
    id: "03",
    title: "Connect",
    copy: "Make TCP/IP, routing, and system behavior understandable, stable, and useful.",
    tools: "Networks / DNS / DHCP",
  },
  {
    id: "04",
    title: "Support",
    copy: "Own the issue, communicate clearly, and restore confidence along with the system.",
    tools: "90% / Customer Support",
  },
];

const experience = [
  {
    date: "FEB 2026 / PRESENT",
    company: "LENOVO",
    role: "Technical Support L1",
    copy: "Diagnosing hardware and software issues across Lenovo systems, working within SLA-driven support flows, and guiding customers from uncertainty to a reliable outcome.",
    signal: "CURRENT NODE",
  },
  {
    date: "JAN 2025 / FEB 2025",
    company: "INFIDATA TECHNOLOGIES",
    role: "Technology Intern",
    copy: "Built practical fluency inside enterprise software environments and learned how professional technology operations move from request to resolution.",
    signal: "FIELD TRAINING",
  },
  {
    date: "JAN 2023 / AUG 2023",
    company: "KARNATAKA SLUM DEVELOPMENT BOARD",
    role: "Computer Operator",
    copy: "Maintained digital records, daily computer operations, and the dependable flow of administrative information for a public-sector organization.",
    signal: "FOUNDATION",
  },
];

const recognitions = [
  ["2024", "State-level hackathon winner", "Led Shadow Squad to the first win of its kind for the college."],
  ["2023", "Router vulnerability discovery", "Responsibly disclosed critical weaknesses across three government institutions."],
  ["2023", "Best Team Leader, NSS", "Recognized for leadership, coordination, and calm execution under pressure."],
];

type Choice = {
  label: string;
  command: string;
  correct: boolean;
  output: string;
  note: string;
};

type Mission = {
  eyebrow: string;
  prompt: string;
  telemetry: string[];
  choices: Choice[];
};

const missions: Mission[] = [
  {
    eyebrow: "INTAKE / LAYER 01",
    prompt: "The laptop joins Wi-Fi, but websites and VPN remain unreachable. Where do you begin?",
    telemetry: ["LINK ........ UP", "IPV4 ........ 169.254.18.4", "GATEWAY ..... NONE"],
    choices: [
      {
        label: "Inspect the full IP configuration",
        command: "ipconfig /all",
        correct: true,
        output: "APIPA address detected. DHCP lease was not acquired.",
        note: "Start with evidence. A 169.254 address isolates the fault before unnecessary changes.",
      },
      {
        label: "Clear the browser cache",
        command: "clear browser --all",
        correct: false,
        output: "No change. The device still has no route beyond the local link.",
        note: "Browser state cannot explain a missing gateway across every network service.",
      },
      {
        label: "Disable endpoint protection",
        command: "security --disable",
        correct: false,
        output: "Action blocked. Security controls should not be removed without evidence.",
        note: "Avoid increasing risk before the network layer has been diagnosed.",
      },
    ],
  },
  {
    eyebrow: "ISOLATE / LAYER 02",
    prompt: "The device has assigned itself an APIPA address. What is the safest next action?",
    telemetry: ["DHCP ........ NO LEASE", "ADAPTER ..... ENABLED", "RADIO ........ HEALTHY"],
    choices: [
      {
        label: "Release and renew the DHCP lease",
        command: "ipconfig /release && ipconfig /renew",
        correct: true,
        output: "Lease acquired: 10.42.7.118 / Gateway: 10.42.7.1",
        note: "The least destructive action restores valid network configuration and tests DHCP directly.",
      },
      {
        label: "Factory-reset the laptop",
        command: "systemreset --factory",
        correct: false,
        output: "Aborted. Data-destructive action is not proportional to the evidence.",
        note: "Good support protects user data and escalates intervention only when justified.",
      },
      {
        label: "Replace the wireless card",
        command: "hardware.swap wlan0",
        correct: false,
        output: "Unnecessary. Radio association and link status are healthy.",
        note: "The adapter is working; the issue is configuration, not physical connectivity.",
      },
    ],
  },
  {
    eyebrow: "VERIFY / LAYER 03",
    prompt: "Gateway and external IPs now respond, but domain names still fail. Which test proves the cause?",
    telemetry: ["GATEWAY ..... 12ms", "1.1.1.1 ..... 28ms", "DOMAINS ...... FAILED"],
    choices: [
      {
        label: "Query the configured DNS service",
        command: "nslookup intranet.local",
        correct: true,
        output: "DNS request timed out. Server 10.42.0.53 is unavailable.",
        note: "IP reachability with failed name resolution points directly to DNS.",
      },
      {
        label: "Reinstall the Wi-Fi driver",
        command: "driver.reinstall wlan0",
        correct: false,
        output: "Driver healthy. IP packets continue to pass normally.",
        note: "A working gateway and external ping already prove the adapter and driver path.",
      },
      {
        label: "Increase the display timeout",
        command: "power.display 30m",
        correct: false,
        output: "No network state changed.",
        note: "A setting unrelated to the failed layer adds delay without diagnostic value.",
      },
    ],
  },
  {
    eyebrow: "RESTORE / LAYER 04",
    prompt: "The approved DNS server is unavailable. Finish the recovery without masking the root cause.",
    telemetry: ["ROOT CAUSE ... DNS SERVICE", "USER IMPACT .. HIGH", "CHANGE PATH .. APPROVED"],
    choices: [
      {
        label: "Apply fallback DNS, flush, verify, document",
        command: "dns.fallback && flushdns && verify --all",
        correct: true,
        output: "Resolution restored. VPN connected. Incident notes committed.",
        note: "Restore service, verify the complete user journey, and preserve the evidence for follow-up.",
      },
      {
        label: "Tell the user to try again tomorrow",
        command: "ticket.defer --24h",
        correct: false,
        output: "SLA at risk. A safe approved recovery path is available now.",
        note: "Ownership means acting on a validated recovery path, not transferring uncertainty.",
      },
      {
        label: "Close the ticket after ping succeeds",
        command: "ticket.close --partial",
        correct: false,
        output: "Validation failed. DNS and VPN remain part of the user journey.",
        note: "Technical success is incomplete until the user's actual workflow works again.",
      },
    ],
  },
];

function MiniNetwork({ stage, complete }: { stage: number; complete: boolean }) {
  const active = complete ? 5 : Math.min(stage + 1, 4);
  const nodes = [
    [50, 155, "CLIENT"],
    [150, 75, "WI-FI"],
    [275, 155, "DHCP"],
    [395, 75, "DNS"],
    [510, 155, "WEB"],
  ] as const;

  return (
    <svg className="network-map" viewBox="0 0 560 230" role="img" aria-label="Animated incident network path">
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      {nodes.slice(0, -1).map((node, index) => {
        const next = nodes[index + 1];
        return (
          <line
            key={node[2]}
            x1={node[0]}
            y1={node[1]}
            x2={next[0]}
            y2={next[1]}
            className={index < active - 1 ? "net-line is-on" : "net-line"}
          />
        );
      })}
      {nodes.map((node, index) => (
        <g key={node[2]} className={index < active ? "net-node is-on" : "net-node"}>
          <circle cx={node[0]} cy={node[1]} r="21" />
          <circle className="net-core" cx={node[0]} cy={node[1]} r="5" />
          {index === active - 1 && !complete && <circle className="net-pulse" cx={node[0]} cy={node[1]} r="30" />}
          <text x={node[0]} y={node[1] + 42} textAnchor="middle">{node[2]}</text>
        </g>
      ))}
    </svg>
  );
}

function DiagnosticGame() {
  const [status, setStatus] = useState<"idle" | "playing" | "complete">("idle");
  const [stage, setStage] = useState(0);
  const [score, setScore] = useState(100);
  const [elapsed, setElapsed] = useState(0);
  const [feedback, setFeedback] = useState<Choice | null>(null);
  const [logs, setLogs] = useState<string[]>(["> INCIDENT QUEUED", "> Awaiting operator acceptance..."]);
  const current = missions[stage];

  useEffect(() => {
    if (status !== "playing") return;
    const timer = window.setInterval(() => setElapsed((time) => time + 1), 1000);
    return () => window.clearInterval(timer);
  }, [status]);

  const start = () => {
    setStatus("playing");
    setStage(0);
    setScore(100);
    setElapsed(0);
    setFeedback(null);
    setLogs(["> INCIDENT JR-042 ACCEPTED", "> Establishing secure diagnostic session...", "> Session ready."]);
  };

  const choose = useCallback((choice: Choice) => {
    if (status !== "playing" || feedback) return;
    setFeedback(choice);
    setLogs((items) => [...items.slice(-3), `$ ${choice.command}`, `> ${choice.output}`]);
    if (!choice.correct) setScore((value) => Math.max(40, value - 12));
  }, [feedback, status]);

  const advance = () => {
    if (!feedback?.correct) {
      setFeedback(null);
      return;
    }
    if (stage === missions.length - 1) {
      setStatus("complete");
      setLogs((items) => [...items.slice(-3), "> INCIDENT RESOLVED", "> User journey verified. SLA protected."]);
      return;
    }
    setStage((value) => value + 1);
    setFeedback(null);
  };

  useEffect(() => {
    const keyHandler = (event: KeyboardEvent) => {
      if (status !== "playing" || feedback || event.metaKey || event.ctrlKey) return;
      const index = Number(event.key) - 1;
      if (index >= 0 && index < 3) choose(missions[stage].choices[index]);
    };
    window.addEventListener("keydown", keyHandler);
    return () => window.removeEventListener("keydown", keyHandler);
  }, [choose, feedback, stage, status]);

  const time = `${String(Math.floor(elapsed / 60)).padStart(2, "0")}:${String(elapsed % 60).padStart(2, "0")}`;

  return (
    <div className={`game-shell game-${status}`}>
      <div className="game-topbar">
        <div><span className="game-live" /> LIVE INCIDENT LAB</div>
        <div className="game-meta"><span>JR-042</span><span>{time}</span><span>{score} PTS</span></div>
      </div>

      <div className="game-body">
        <div className="game-main">
          <AnimatePresence mode="wait">
            {status === "idle" && (
              <motion.div className="game-intro" key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -20 }}>
                <span className="micro-label">CASE FILE / NETWORK LOCKOUT</span>
                <h3>Can you think like support?</h3>
                <p>A four-layer incident is waiting. Diagnose from evidence, protect the user, and resolve without destructive shortcuts.</p>
                <button type="button" onClick={start} className="game-start">
                  Accept incident <ArrowRight size={18} />
                </button>
                <span className="game-duration">Average run: 60 seconds</span>
              </motion.div>
            )}

            {status === "playing" && (
              <motion.div className="mission" key={`mission-${stage}`} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                <div className="mission-progress">
                  {missions.map((_, index) => <span key={index} className={index <= stage ? "is-active" : ""} />)}
                </div>
                <span className="micro-label">{current.eyebrow}</span>
                <h3>{current.prompt}</h3>
                <div className="telemetry">
                  {current.telemetry.map((line) => <span key={line}>{line}</span>)}
                </div>
                <div className="choices" aria-label="Diagnostic options">
                  {current.choices.map((choice, index) => {
                    const selected = feedback === choice;
                    return (
                      <button
                        type="button"
                        key={choice.command}
                        className={`${selected ? "is-selected " : ""}${selected && choice.correct ? "is-correct" : ""}${selected && !choice.correct ? "is-wrong" : ""}`}
                        onClick={() => choose(choice)}
                        disabled={Boolean(feedback)}
                      >
                        <span>0{index + 1}</span>
                        <div><strong>{choice.label}</strong><code>{choice.command}</code></div>
                        <ChevronRight size={18} />
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {status === "complete" && (
              <motion.div className="game-result" key="result" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}>
                <div className="result-mark"><ShieldCheck /></div>
                <span className="micro-label">INCIDENT CLOSED / USER RESTORED</span>
                <h3>{score >= 88 ? "Resolution grade: A" : score >= 70 ? "Resolution grade: B" : "Resolution grade: C"}</h3>
                <p>You isolated the failed layer, used proportional actions, verified the real user journey, and documented the outcome.</p>
                <div className="result-stats">
                  <div><span>Score</span><strong>{score}</strong></div>
                  <div><span>Time</span><strong>{time}</strong></div>
                  <div><span>Layers</span><strong>04</strong></div>
                </div>
                <button type="button" onClick={start} className="game-restart"><RotateCcw size={16} /> Run it again</button>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {feedback && (
              <motion.div className={`feedback ${feedback.correct ? "feedback-good" : "feedback-bad"}`} initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}>
                <div>{feedback.correct ? <Check /> : <CircleAlert />}</div>
                <p><strong>{feedback.correct ? "Signal confirmed." : "Dead end."}</strong>{feedback.note}</p>
                <button type="button" onClick={advance}>{feedback.correct ? "Continue" : "Try another path"}<ArrowRight size={16} /></button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <aside className="game-side">
          <div className="map-title"><span>PATH TRACE</span><span>{status === "complete" ? "RESTORED" : "SCANNING"}</span></div>
          <MiniNetwork stage={stage} complete={status === "complete"} />
          <div className="terminal-log" aria-live="polite">
            <div><Terminal size={14} /> OPERATOR CONSOLE</div>
            {logs.map((line, index) => <p key={`${line}-${index}`}>{line}</p>)}
          </div>
        </aside>
      </div>
    </div>
  );
}

function ContactPalette({ close }: { close: () => void }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText("iamjashuraj@gmail.com");
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };
  return (
    <motion.div className="palette-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={close}>
      <motion.div className="command-palette" initial={{ opacity: 0, y: -20, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -20 }} onMouseDown={(event) => event.stopPropagation()} role="dialog" aria-modal="true" aria-label="Connect with Jashwanth">
        <div className="palette-search"><Command size={16} /><span>Connect with Jashwanth</span><button onClick={close}>ESC</button></div>
        <div className="palette-options">
          <a href="mailto:iamjashuraj@gmail.com"><Mail /><span><strong>Start a conversation</strong><small>Open your email client</small></span><ArrowUpRight /></a>
          <a href="https://www.linkedin.com/in/iamjashwanthraj/" target="_blank" rel="noreferrer"><Wifi /><span><strong>Connect on LinkedIn</strong><small>Professional profile</small></span><ArrowUpRight /></a>
          <a href="https://github.com/Jashuraj" target="_blank" rel="noreferrer"><Code2 /><span><strong>Explore GitHub</strong><small>Code and experiments</small></span><ArrowUpRight /></a>
          <button type="button" onClick={copy}><Copy /><span><strong>{copied ? "Email copied" : "Copy email address"}</strong><small>iamjashuraj@gmail.com</small></span>{copied ? <Check /> : <ChevronRight />}</button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const statementRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollY, scrollYProgress } = useScroll();
  const { scrollYProgress: heroProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const { scrollYProgress: statementProgress } = useScroll({ target: statementRef, offset: ["start end", "end start"] });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 });
  const portraitY = useTransform(heroProgress, [0, 1], [0, reduceMotion ? 0 : 150]);
  const titleY = useTransform(heroProgress, [0, 1], [0, reduceMotion ? 0 : -120]);
  const titleOpacity = useTransform(heroProgress, [0, 0.72], [1, 0]);
  const statementX = useTransform(statementProgress, [0, 1], [reduceMotion ? "0%" : "18%", reduceMotion ? "0%" : "-18%"]);

  useMotionValueEvent(scrollY, "change", (latest) => setScrolled(latest > 60));

  useEffect(() => {
    const keys = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setPaletteOpen((open) => !open);
      }
      if (event.key === "Escape") {
        setMenuOpen(false);
        setPaletteOpen(false);
      }
    };
    window.addEventListener("keydown", keys);
    return () => window.removeEventListener("keydown", keys);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen || paletteOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen, paletteOpen]);

  const pointerGlow = (event: React.PointerEvent<HTMLElement>) => {
    event.currentTarget.style.setProperty("--pointer-x", `${event.clientX}px`);
    event.currentTarget.style.setProperty("--pointer-y", `${event.clientY}px`);
  };

  return (
    <main onPointerMove={pointerGlow}>
      <motion.div className="page-progress" style={{ scaleX: smoothProgress }} />

      <header className={`site-nav ${scrolled ? "nav-solid" : ""}`}>
        <a href="#home" className="brand" aria-label="Jashwanth Raj home"><span>JR</span><i>OS</i></a>
        <nav aria-label="Main navigation">
          <a href="#profile">Profile</a>
          <a href="#lab">Incident Lab</a>
          <a href="#experience">Journey</a>
          <a href="#proof">Proof</a>
        </nav>
        <button className="command-button" onClick={() => setPaletteOpen(true)}><Command size={14} /> Connect <kbd>Ctrl K</kbd></button>
        <button className="mobile-toggle" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-label={menuOpen ? "Close menu" : "Open menu"}>{menuOpen ? <X /> : <Menu />}</button>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div className="mobile-nav" initial={{ clipPath: "inset(0 0 100% 0)" }} animate={{ clipPath: "inset(0 0 0% 0)" }} exit={{ clipPath: "inset(0 0 100% 0)" }} transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}>
            <nav>
              {[["01", "Profile", "#profile"], ["02", "Incident Lab", "#lab"], ["03", "Journey", "#experience"], ["04", "Proof", "#proof"]].map(([id, label, href]) => <a href={href} key={href} onClick={() => setMenuOpen(false)}><small>{id}</small>{label}<ArrowUpRight /></a>)}
            </nav>
            <button onClick={() => { setMenuOpen(false); setPaletteOpen(true); }}>Open contact console <ArrowRight /></button>
          </motion.div>
        )}
        {paletteOpen && <ContactPalette close={() => setPaletteOpen(false)} />}
      </AnimatePresence>

      <section className="hero" id="home" ref={heroRef}>
        <div className="hero-ambient" />
        <motion.div className="hero-code" style={{ y: portraitY }} aria-hidden="true">
          <span>01 // DIAGNOSE</span><span>02 // SECURE</span><span>03 // SUPPORT</span>
        </motion.div>
        <motion.div className="portrait-plane" style={{ y: portraitY }}>
          <img src={portrait} loading="eager" fetchPriority="high" alt="Jashwanth Raj, Technical Support professional at Lenovo" />
          <div className="portrait-scan" />
        </motion.div>
        <div className="hero-vignette" />
        <motion.div className="hero-title" style={{ y: titleY, opacity: titleOpacity }}>
          <div className="hero-topline"><span><i /> Available for opportunities</span><span>Bengaluru / India</span></div>
          <h1><span>JASHWANTH</span><span>RAJ<span className="title-dot">.</span></span></h1>
          <div className="hero-footer">
            <p><strong>Technical Support L1</strong><span>Lenovo</span></p>
            <p className="hero-thesis">I find the signal inside the noise, then turn technical complexity into human confidence.</p>
            <a href="#lab">Enter incident lab <span><ArrowDown /></span></a>
          </div>
        </motion.div>
        <div className="hero-rail"><span>SCROLL TO TRACE</span><i /></div>
      </section>

      <section className="statement" id="profile" ref={statementRef}>
        <motion.div className="statement-marquee" style={{ x: statementX }} aria-hidden="true">HUMAN FIRST / SYSTEMS DEEP /</motion.div>
        <div className="content-wrap statement-grid">
          <div className="section-index"><span>00</span><p>Operating principle</p></div>
          <motion.div className="statement-copy" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.35 }} transition={{ duration: 0.9 }}>
            <h2>Technology fails.<br /><em>Trust should not.</em></h2>
            <div><p>I work where people, systems, and security meet. The method is simple: listen closely, isolate the real fault, act proportionally, and own the outcome.</p><span>Technical depth. Human clarity.</span></div>
          </motion.div>
        </div>
        <div className="signal-strip content-wrap">
          <div><strong>9.0</strong><span>BCA CGPA</span></div><div><strong>03+</strong><span>Years in tech</span></div><div><strong>04</strong><span>Languages</span></div><div><strong>03</strong><span>Major awards</span></div>
        </div>
      </section>

      <section className="capability-section">
        <div className="content-wrap">
          <div className="section-intro"><div className="section-index"><span>01</span><p>Core protocols</p></div><h2>Four ways I move<br />a problem <em>forward.</em></h2></div>
          <div className="capability-list">
            {capabilities.map((item) => (
              <motion.article key={item.id} initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.45 }}>
                <span>{item.id}</span><h3>{item.title}</h3><p>{item.copy}</p><code>{item.tools}</code><ArrowUpRight />
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="lab-section" id="lab">
        <div className="content-wrap lab-heading">
          <div className="section-index light"><span>02</span><p>Interactive proof</p></div>
          <div><span className="micro-label">NOT A QUIZ. A DECISION SYSTEM.</span><h2>Enter the<br /><em>Incident Lab.</em></h2><p>Great support is visible in the order of decisions. Take the console and resolve a realistic network failure.</p></div>
        </div>
        <div className="game-wrap"><DiagnosticGame /></div>
      </section>

      <section className="experience-section" id="experience">
        <div className="content-wrap section-intro experience-heading"><div className="section-index"><span>03</span><p>Career trace</p></div><h2>Built in the field,<br /><em>not in theory.</em></h2></div>
        <div className="experience-list content-wrap">
          {experience.map((item, index) => (
            <motion.article key={item.company} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.4 }}>
              <div className="exp-order">0{index + 1}</div><div className="exp-date">{item.date}</div><div className="exp-main"><span>{item.signal}</span><h3>{item.company}</h3><h4>{item.role}</h4><p>{item.copy}</p></div><div className="exp-cross" aria-hidden="true">+</div>
            </motion.article>
          ))}
        </div>
        <div className="education-ribbon">
          <motion.div initial={{ x: "0%" }} whileInView={{ x: "-8%" }} transition={{ duration: 1.2 }}><span>ACADEMIC FOUNDATION</span><strong>BCA / 9.0 CGPA / DISTINCTION</strong><span>GFGC CHIKKABALLAPUR</span></motion.div>
        </div>
      </section>

      <section className="proof-section" id="proof">
        <div className="content-wrap section-intro proof-heading"><div className="section-index light"><span>04</span><p>Evidence</p></div><h2>Impact leaves<br /><em>a trace.</em></h2></div>
        <div className="recognition-list content-wrap">
          {recognitions.map(([year, title, copy], index) => (
            <motion.article key={title} initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ delay: index * 0.08 }}><span>{year}</span><h3>{title}</h3><p>{copy}</p><i>0{index + 1}</i></motion.article>
          ))}
        </div>
      </section>

      <section className="final-section">
        <div className="final-photo"><img src={portrait} loading="lazy" alt="" /></div><div className="final-wash" />
        <motion.div className="content-wrap final-content" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.35 }}>
          <span className="micro-label">SYSTEM READY / CHANNEL OPEN</span><h2>Bring me the<br /><em>hard problem.</em></h2>
          <div><p>For support roles, security conversations, and teams that care about getting the details right.</p><button onClick={() => setPaletteOpen(true)}>Start a conversation <ArrowUpRight /></button></div>
        </motion.div>
      </section>

      <footer className="footer content-wrap">
        <div className="brand"><span>JR</span><i>OS</i></div><p><MapPin /> Bengaluru, Karnataka, India</p><div><a href="mailto:iamjashuraj@gmail.com">Email</a><a href="https://www.linkedin.com/in/iamjashwanthraj/" target="_blank" rel="noreferrer">LinkedIn</a><a href="https://github.com/Jashuraj" target="_blank" rel="noreferrer">GitHub</a></div><span>© {new Date().getFullYear()} Jashwanth Raj</span>
      </footer>
    </main>
  );
}

export default App;