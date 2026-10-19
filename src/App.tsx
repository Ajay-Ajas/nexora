
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowRight,
  CheckCircle2,
  Heart,
  LockKeyhole,
  Mail,
  Nfc,
  ShieldCheck,
  Sparkles,
  UserRound,
  Zap,
} from "lucide-react";
import "./index.css";

type Page = "intro" | "about" | "pair" | "account";

export default function App() {
  const [page, setPage] = useState<Page>("intro");
  const [paired, setPaired] = useState(false);
  const [demoMode, setDemoMode] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [notice, setNotice] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => setPage("about"), 2800);
    return () => window.clearTimeout(timer);
  }, []);

  async function connectNfc() {
    type NFCReader = {
      scan: () => Promise<void>;
      onreading: (() => void) | null;
      onreadingerror: (() => void) | null;
    };

    const NFCReaderConstructor = (
      window as Window & { NDEFReader?: new () => NFCReader }
    ).NDEFReader;

    if (!NFCReaderConstructor) {
      setNotice(
        "NFC is not supported by this browser. Use a compatible device, or select preview mode to explore the app."
      );
      return;
    }

    try {
      setScanning(true);
      setNotice("Hold your phone close to the NFC tag…");

      const reader = new NFCReaderConstructor();

      reader.onreading = () => {
        setScanning(false);
        setPaired(true);
        setDemoMode(false);
        setNotice(
          "NFC tag detected. Collectible ownership still needs server-side verification."
        );
      };

      reader.onreadingerror = () => {
        setScanning(false);
        setNotice("Couldn't read the tag. Hold your phone closer and try again.");
      };

      await reader.scan();
      setNotice("Listening for your collectible…");
    } catch {
      setScanning(false);
      setNotice("NFC access wasn't started. Check browser permissions and try again.");
    }
  }

  function enableDemoMode() {
    setPaired(true);
    setDemoMode(true);
    setScanning(false);
    setNotice("Preview mode enabled. No physical collectible has been verified.");
  }

  function openAccount() {
    setNotice("");
    setPage("account");
  }

  function submitAccount(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice(
      "Your form is ready. Connect an authentication service to create your real account."
    );
  }

  return (
    <main className="app-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <div className="starfield" aria-hidden="true" />

      <AnimatePresence mode="wait">
        {page === "intro" && (
          <motion.section
            key="intro"
            className="intro-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.6 }}
            aria-label="NEXORA introduction"
          >
            <div className="intro-center">
              <motion.div
                className="intro-mark"
                initial={{ opacity: 0, scale: 0.75, rotate: -12 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Zap size={29} strokeWidth={1.8} />
              </motion.div>

              <motion.h1
                className="intro-logo"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.7 }}
              >
                NEXORA<span>®</span>
              </motion.h1>

              <motion.p
                className="intro-brand"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.55 }}
              >
                A PRODUCT BY AQUA&apos;S
              </motion.p>

              <motion.div
                className="intro-rule"
                initial={{ width: 0 }}
                animate={{ width: 92 }}
                transition={{ delay: 0.65, duration: 0.7 }}
              />

              <motion.p
                className="intro-subtitle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                Your world. Your companion.
              </motion.p>
            </div>

            <div className="intro-loader">
              <div className="loader-track">
                <motion.div
                  className="loader-progress"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2.7, ease: "linear" }}
                />
              </div>
              <span>PREPARING YOUR WORLD</span>
            </div>
          </motion.section>
        )}

        {page === "about" && (
          <motion.section
            key="about"
            className="page"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4 }}
          >
            <Header step="YOUR WORLD. YOUR COMPANION." onHome={() => setPage("intro")} />

            <div className="about-layout">
              <div className="about-copy">
                <p className="eyebrow">MEET A NEW KIND OF COMPANION</p>

                <h1>
                  A little magic.
                  <br />
                  <span className="green-text">A real</span>
                  <br />
                  <span className="gradient-text">connection.</span>
                </h1>

                <p className="body-copy">
                  More than a collectible. Meet a companion that connects your
                  physical world to a digital adventure, growing with every
                  touch, every step, and every little moment.
                </p>

                <div className="feature-list">
                  <Feature
                    icon={<Heart size={18} />}
                    title="Friendship that grows"
                    text="Build a bond with every interaction."
                  />
                  <Feature
                    icon={<Sparkles size={18} />}
                    title="Your own adventure"
                    text="Discover new moments as you explore."
                  />
                  <Feature
                    icon={<Zap size={18} />}
                    title="Physical meets digital"
                    text="Bring your collectible into your app."
                  />
                </div>

                <button
                  className="primary-button"
                  onClick={() => {
                    setNotice("");
                    setPage("pair");
                  }}
                >
                  Begin your journey <ArrowRight size={19} />
                </button>

                <p className="small-note">
                  Your next adventure is one connection away.
                </p>
              </div>

              <div className="toy-stage">
                <div className="toy-orbit toy-orbit-one" />
                <div className="toy-orbit toy-orbit-two" />

                <motion.div
                  className="toy-figure"
                  animate={{ y: [0, -12, 0], rotate: [-1, 1, -1] }}
                  transition={{
                    duration: 3.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  role="img"
                  aria-label="Emberling dragon companion"
                >
                  🐉
                </motion.div>

                <motion.span
                  className="toy-star star-one"
                  animate={{ opacity: [0.4, 1, 0.4], scale: [0.9, 1.15, 0.9] }}
                  transition={{ duration: 2.2, repeat: Infinity }}
                >
                  ✦
                </motion.span>
                <motion.span
                  className="toy-star star-two"
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 2.8, repeat: Infinity }}
                >
                  ✧
                </motion.span>

                <div className="toy-card friendship-card">
                  <Heart size={16} fill="currentColor" />
                  <div>
                    <strong>Friendship</strong>
                    <span>Something magical is growing</span>
                  </div>
                  <b>+7</b>
                </div>

                <div className="toy-card companion-card">
                  <Zap size={17} />
                  <div>
                    <strong>EMBERLING</strong>
                    <span>Your first companion</span>
                  </div>
                  <span className="lime-dot" />
                </div>
              </div>
            </div>

            <Footer />
          </motion.section>
        )}

        {page === "pair" && (
          <motion.section
            key="pair"
            className="page"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4 }}
          >
            <Header
              step="STEP 01 · CONNECT YOUR COLLECTIBLE"
              onHome={() => setPage("about")}
            />

            <div className="pair-layout">
              <div className="pair-copy">
                <div className="step-icon"><Zap size={28} /></div>
                <p className="eyebrow">YOUR WORLD. YOUR COMPANION.</p>

                <h1>
                  Bring your worlds
                  <br />
                  <span className="gradient-text">together.</span>
                </h1>

                <p className="body-copy">
                  Hold your phone near the NFC tag on your physical collectible
                  to begin. We&apos;ll verify ownership securely before linking
                  it to your NEXORA account.
                </p>

                <div className="info-note">
                  <ShieldCheck size={18} />
                  <span>
                    NFC reading is only the first step. Secure ownership
                    verification will be handled by the backend.
                  </span>
                </div>

                <button
                  className="primary-button"
                  onClick={connectNfc}
                  disabled={scanning}
                >
                  <Nfc size={19} />
                  {scanning ? "Listening for NFC…" : "Connect collectible"}
                  <ArrowRight size={19} />
                </button>

                <button className="text-button" onClick={enableDemoMode}>
                  Preview without a collectible
                </button>

                {notice && (
                  <p className="notice" role="status">{notice}</p>
                )}

                {paired && (
                  <div className="paired-panel">
                    <CheckCircle2 size={19} />
                    <span>
                      {demoMode ? "Preview mode is ready." : "NFC tag detected."}
                    </span>
                    <button onClick={openAccount}>
                      Continue to account <ArrowRight size={16} />
                    </button>
                  </div>
                )}
              </div>

              <div className="pair-art" aria-hidden="true">
                <div className="nfc-orbit orbit-a" />
                <div className="nfc-orbit orbit-b" />
                <motion.div
                  className={`nfc-symbol ${scanning ? "scanning" : ""}`}
                  animate={scanning ? { scale: [1, 1.06, 1] } : { y: [0, -5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Nfc size={68} strokeWidth={1.2} />
                </motion.div>
                <div className="floating-chip chip-top">
                  <ShieldCheck size={16} /> Secure pairing
                </div>
                <div className="floating-chip chip-bottom">
                  <span className="lime-dot" /> NFC connection
                </div>
              </div>
            </div>

            <Footer />
          </motion.section>
        )}

        {page === "account" && (
          <motion.section
            key="account"
            className="page account-page"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4 }}
          >
            <Header
              step="STEP 02 · YOUR NEXORA ACCOUNT"
              onHome={() => setPage("pair")}
            />

            <div className="account-wrap">
              <div className="account-heading">
                <div className="step-icon"><Sparkles size={25} /></div>
                <p className="eyebrow">YOUR ADVENTURE STARTS HERE</p>
                <h1>
                  Make it <span className="gradient-text">yours.</span>
                </h1>
                <p className="body-copy">
                  Create your account and keep your companion&apos;s journey
                  connected to you.
                </p>
              </div>

              <form className="account-form" onSubmit={submitAccount}>
                <label>
                  Your name
                  <span className="input-wrap">
                    <UserRound size={17} />
                    <input
                      required
                      autoComplete="name"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="Enter your name"
                    />
                  </span>
                </label>

                <label>
                  Email address
                  <span className="input-wrap">
                    <Mail size={17} />
                    <input
                      required
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="you@example.com"
                    />
                  </span>
                </label>

                <label>
                  Password
                  <span className="input-wrap">
                    <LockKeyhole size={17} />
                    <input
                      required
                      minLength={8}
                      type="password"
                      autoComplete="new-password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="At least 8 characters"
                    />
                  </span>
                </label>

                <button className="primary-button form-submit" type="submit">
                  Create account <ArrowRight size={18} />
                </button>

                <p className="form-terms">
                  By continuing, you agree to our Terms of Service and Privacy
                  Policy. Add your published policy links before launch.
                </p>

                {notice && <p className="notice" role="status">{notice}</p>}
              </form>

              <button
                className="text-button"
                onClick={() => {
                  setNotice("");
                  setPage("pair");
                }}
              >
                Back to NFC pairing
              </button>
            </div>

            <Footer />
          </motion.section>
        )}
      </AnimatePresence>
    </main>
  );
}

function Header({
  step,
  onHome,
}: {
  step: string;
  onHome: () => void;
}) {
  return (
    <header className="header">
      <button className="mini-logo" onClick={onHome} aria-label="Go back">
        <Zap size={20} />
        <span>NEXORA</span>
      </button>
      <span className="header-step"><i />{step}</span>
    </header>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <span>A PRODUCT BY AQUA&apos;S</span>
      <span>MADE FOR LITTLE MOMENTS</span>
    </footer>
  );
}

function Feature({
  icon,
  title,
  text,
}: {
  icon: ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="feature">
      <div className="feature-icon">{icon}</div>
      <div className="feature-copy">
        <strong>{title}</strong>
        <p>{text}</p>
      </div>
      <CheckCircle2 className="feature-check" size={17} />
    </div>
  );
}
