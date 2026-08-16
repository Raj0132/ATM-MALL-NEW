import { useEffect, useRef, useState, useCallback } from 'react';
import { AnimatePresence, motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import { ArrowRight, MapPin, Phone, Mail, X, ChevronDown, Star, Menu, FileText, Download, CheckCircle2 } from 'lucide-react';

/* ─────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────── */
const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Amenities', href: '#amenities' },
  { label: 'Hotel', href: '#hotel' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Contact', href: '#contact' },
];

const highlights = [
  { value: '2', suffix: '', label: 'Luxury Hotels', description: 'Dual five-star hospitality towers with executive suites and banquet floors.' },
  { value: '1.2', suffix: 'M+', label: 'Sq. Ft. Built-up', description: 'Premium mixed-use scale with a grand retail and hospitality footprint.' },
  { value: '44', suffix: 'K', label: 'Fine Dining Area', description: 'Multiple destination restaurants with indoor and terrace seating.' },
  { value: '41', suffix: 'K', label: 'Entertainment Zone', description: 'Luxury leisure experiences designed for families and business travelers.' },
  { value: '24', suffix: 'x7', label: 'Hospitality', description: 'Concierge-led services, security and premium guest care.' },
  { value: '150', suffix: '+', label: 'Premium Brands', description: 'Global luxury boutiques and aspirational lifestyle retailers.' },
];

const amenities = [
  { image: '/pool-top.jpg',        title: 'Infinity Pool',      tag: 'Resort Living',    description: 'Resort-style poolside cabanas and cinematic water features.', detail: 'Temperature-controlled pool, luxury cabanas, poolside bar' },
  { image: '/development-view.jpg',title: 'Landscape Gardens',  tag: 'Nature & Calm',    description: 'Immersive outdoor gardens, promenades and curated green courts.', detail: 'Zen paths, water pavilions, botanical walk, outdoor firepits' },
  { image: '/hotel-entry.jpg',     title: 'Grand Hotel',        tag: 'Hospitality',      description: 'A reception experience designed for refined arrivals and exclusive hospitality.', detail: 'Double-height lobby, executive desk, private entry ports' },
  { image: '/hyatt-view.jpg',      title: 'Luxury Arrival',     tag: 'Premium Entry',    description: 'Valet courts, arrival lounges and elevated guest entry sequences.', detail: 'Valet parking court, smart security, lounge seating' },
  { image: '/food-market.jpg',     title: 'Fine Dining',        tag: 'Gastronomy',       description: 'Destination restaurants with premium menus, elegant atmosphere and view terraces.', detail: 'Al fresco terraces, global cuisine, private dining rooms' },
  { image: '/skyline-view.jpg',    title: 'Business Lounge',    tag: 'Executive',        description: 'Executive lounges curated for meetings, work and hospitality comfort.', detail: 'High-speed fiber, meeting suites, video ports, concierge desk' },
  { image: '/hero-lawn.jpg',       title: 'Outdoor Terraces',   tag: 'Al Fresco',        description: 'Private outdoor terraces, dining courts and lounge decks in landscaped settings.', detail: 'Roof decks, firepits, cocktail seating, al fresco bar' },
  { image: '/play-area.jpg',       title: 'Family Spaces',      tag: 'Family',           description: 'A luxury family destination featuring thoughtfully designed play zones.', detail: 'Kids club, activity courts, shaded playgrounds, parent lounges' },
];

const galleryItems = [
  { src: '/hero-lawn.jpg',        cls: 'g-tall',  label: 'The Grounds',    category: 'Exterior',  desc: 'Lush manicured lawns and al fresco exhibition areas.' },
  { src: '/pool-top.jpg',         cls: '',         label: 'Infinity Pool',  category: 'Amenities', desc: 'Rooftop water feature with cabana service.' },
  { src: '/mall-entry.jpg',       cls: '',         label: 'Grand Entry',    category: 'Exterior',  desc: 'Premium entrance portico with water cascade.' },
  { src: '/hotel-entry.jpg',      cls: 'g-tall',  label: 'Hotel Portal',   category: 'Interior',  desc: 'Five-star reception arrival lobby and concierge.' },
  { src: '/development-view.jpg', cls: 'g-wide',  label: 'Aerial View',    category: 'Exterior',  desc: 'Panoramic layout of the integrated hotel & retail complex.' },
  { src: '/food-market.jpg',      cls: '',         label: 'Fine Dining',    category: 'Amenities', desc: 'Al fresco food galleries and destination restaurants.' },
  { src: '/skyline-view.jpg',     cls: '',         label: 'Skyline',        category: 'Exterior',  desc: 'Panoramic rooftop sky lounge views of the city.' },
  { src: '/hyatt-view.jpg',       cls: '',         label: 'Hyatt Wing',     category: 'Interior',  desc: 'Dual five-star luxury suites and hospitality tower.' },
];

const whyChooseUs = [
  { icon: '✦', title: 'Premium Architecture',   detail: 'A landmark form and sculptural identity shaped for world-class appeal.' },
  { icon: '✦', title: 'Luxury Hospitality',     detail: 'Hospitality levels and suites designed for discerning guests.' },
  { icon: '✦', title: 'Smart Security',         detail: 'Advanced access systems and a concierge-led guest experience.' },
  { icon: '✦', title: 'Landscape Design',       detail: 'Curated gardens, terraces and outdoor courts for quiet luxury.' },
  { icon: '✦', title: 'Prime Connectivity',     detail: 'Direct access to highways, metro, airport and business districts.' },
  { icon: '✦', title: 'Premium Amenities',      detail: 'Pool, dining, lounge, retail and entertainment in one address.' },
  { icon: '✦', title: 'Business Friendly',      detail: 'Executive spaces, meeting suites and hospitality infrastructure.' },
  { icon: '✦', title: 'Resort Lifestyle',       detail: 'A lifestyle environment that feels calm, cinematic and exclusive.' },
];

/* ─────────────────────────────────────────────────────
   ANIMATED COUNTER
───────────────────────────────────────────────────── */
function AnimatedCounter({ value, suffix }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '0px' });
  const [display, setDisplay] = useState(0);
  const num = parseFloat(value);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 1800;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(+(num * eased).toFixed(num % 1 !== 0 ? 1 : 0));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      }
    };
    rafRef.current = requestAnimationFrame(step);
    // Cancel animation frame on unmount to prevent memory leak
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [isInView, num]);

  return (
    <span ref={ref} className="stat-number text-5xl sm:text-6xl font-bold leading-none">
      {display}{suffix}
    </span>
  );
}

/* ─────────────────────────────────────────────────────
   GOLD PARTICLES (hero background)
───────────────────────────────────────────────────── */
const particles = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  x: `${Math.random() * 100}%`,
  duration: `${6 + Math.random() * 10}s`,
  delay: `${Math.random() * 8}s`,
  size: `${2 + Math.random() * 3}px`,
  drift: `${(Math.random() - 0.5) * 120}px`,
}));

/* ─────────────────────────────────────────────────────
   LUXURY CURSOR
───────────────────────────────────────────────────── */
function LuxuryCursor() {
  const dotRef  = useRef(null);
  const ringRef = useRef(null);
  const pos = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });
  const [isTouch, setIsTouch] = useState(false);
  const [cursorType, setCursorType] = useState('normal'); // 'normal' | 'expanded' | 'shrunk'

  useEffect(() => {
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    setIsTouch(isTouchDevice);
    if (isTouchDevice) return;

    const onMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      }
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      if (!target) return;

      const isClickable = target.closest('a, button, [role="button"], input[type="submit"], input[type="button"], .btn-luxury-primary, .btn-luxury-ghost, .btn-luxury-gold, .btn-luxury-subtle');
      const isText = target.closest('p, span, h1, h2, h3, h4, h5, h6, li, label, input, textarea');

      if (isClickable) {
        setCursorType('expanded');
      } else if (isText) {
        setCursorType('shrunk');
      } else {
        setCursorType('normal');
      }
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseover', handleMouseOver);

    let raf;
    const animate = () => {
      ring.current.x += (pos.current.x - ring.current.x) * 0.12;
      ring.current.y += (pos.current.y - ring.current.y) * 0.12;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.current.x}px, ${ring.current.y}px, 0) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', handleMouseOver);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (isTouch) return null;

  return (
    <>
      <div ref={dotRef}  className={`cursor-dot cursor-dot--${cursorType}`}  />
      <div ref={ringRef} className={`cursor-ring cursor-ring--${cursorType}`} />
    </>
  );
}

/* ─────────────────────────────────────────────────────
   SECTION WRAPPER — fade + slide up on scroll
───────────────────────────────────────────────────── */
function RevealSection({ children, className = '', delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────
/* ─────────────────────────────────────────────────────
   AMBIENT BACKGROUND (Floating particles + slow gold orbs)
───────────────────────────────────────────────────── */
const AMBIENT_PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  x:     `${7 + (i * 53 + 13) % 86}%`,
  size:  `${1.5 + (i * 17 + 5) % 2.5}px`,
  dur:   `${10 + (i * 7 + 3) % 12}s`,
  delay: `${(i * 4.3) % 14}s`,
}));

const AMBIENT_ORBS = [
  { top: '12%',  left: '8%',   w: 320, h: 260, delay: '0s',   dur: '26s', pulse: '10s' },
  { top: '55%',  left: '78%',  w: 280, h: 220, delay: '8s',   dur: '30s', pulse: '13s' },
  { top: '80%',  left: '20%',  w: 200, h: 180, delay: '4s',   dur: '22s', pulse: '9s'  },
  { top: '30%',  left: '92%',  w: 180, h: 160, delay: '14s',  dur: '28s', pulse: '12s' },
];

function AmbientBackground() {
  const isTouchDevice = typeof window !== 'undefined' &&
    window.matchMedia('(pointer: coarse)').matches;
  // Skip on touch (mobile) to save battery
  if (isTouchDevice) return null;

  return (
    <div aria-hidden className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {/* Tiny drifting particles */}
      {AMBIENT_PARTICLES.map((p) => (
        <div
          key={p.id}
          className="ambient-particle"
          style={{
            '--amb-x':     p.x,
            '--amb-size':  p.size,
            '--amb-dur':   p.dur,
            '--amb-delay': p.delay,
          }}
        />
      ))}

      {/* Slow drifting gold orbs */}
      {AMBIENT_ORBS.map((o, i) => (
        <div
          key={i}
          className="ambient-orb"
          style={{
            top:          o.top,
            left:         o.left,
            width:        o.w,
            height:       o.h,
            background:   'radial-gradient(ellipse, rgba(201,168,76,0.10) 0%, rgba(201,168,76,0.03) 55%, transparent 100%)',
            '--orb-dur':   o.dur,
            '--orb-delay': o.delay,
            '--orb-pulse': o.pulse,
          }}
        />
      ))}

      {/* Static soft gradient vignette — bottom centre glow */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2"
        style={{
          width: '60vw',
          height: '35vh',
          background: 'radial-gradient(ellipse at 50% 100%, rgba(201,168,76,0.05) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   ORNAMENTAL DIVIDER
───────────────────────────────────────────────────── */
function GoldDivider() {
  return (
    <div className="ornament-divider">
      <div className="ornament-diamond" />
      <div className="ornament-diamond opacity-40 scale-75" />
      <div className="ornament-diamond" />
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   LUXURY TIMELINE
───────────────────────────────────────────────────── */
const TIMELINE_STEPS = [
  {
    word:   'Arrival',
    sub:    'Your journey begins',
    desc:   'A grand entrance awaits — valet service, curated welcome, and a first impression that sets the tone for everything that follows.',
    icon:   '✦',
    accent: 'Your gateway to luxury.',
  },
  {
    word:   'Relax',
    sub:    'Unwind in style',
    desc:   'Drift into calm at our infinity pool deck, spa lounges and curated garden retreats designed for total sensory restoration.',
    icon:   '◎',
    accent: 'Peace, elevated.',
  },
  {
    word:   'Dine',
    sub:    'Culinary excellence',
    desc:   'From rooftop fine-dining to artisan cafés — every meal is a performance crafted by master chefs with the finest seasonal ingredients.',
    icon:   '◈',
    accent: 'A feast for all senses.',
  },
  {
    word:   'Stay',
    sub:    'Sanctuary awaits',
    desc:   'Retire to a suite where every detail — light, texture, temperature — has been orchestrated for your absolute comfort and privacy.',
    icon:   '⬡',
    accent: 'Rest like never before.',
  },
  {
    word:   'Experience',
    sub:    'Culture & celebration',
    desc:   'Attend world-class events, gallery openings and curated lifestyle moments that transform each visit into a cherished memory.',
    icon:   '✧',
    accent: 'Every moment, extraordinary.',
  },
  {
    word:   'Return',
    sub:    'Until we meet again',
    desc:   'Depart with a promise: that the finest chapter is always the next one. ATM Mall is not a destination — it is a way of life.',
    icon:   '◇',
    accent: 'Always welcome back.',
  },
];

function TimelineStep({ step, index, total, isHovered, onHover, onLeave, onClick }) {
  const isLast = index === total - 1;

  return (
    <motion.div
      onHoverStart={onHover}
      onHoverEnd={onLeave}
      onClick={onClick}
      className="relative flex items-stretch cursor-default select-none"
    >
      {/* ── Spine ── */}
      <div className="relative flex flex-col items-center flex-shrink-0" style={{ width: 56 }}>
        {/* Top connector */}
        {index > 0 && (
          <div
            className="w-px flex-shrink-0"
            style={{
              height: 20,
              background: 'linear-gradient(to bottom, rgba(201,168,76,0.35), rgba(201,168,76,0.10))',
            }}
          />
        )}

        {/* Node */}
        <motion.div
          animate={{
            borderColor: isHovered ? 'rgba(201,168,76,0.85)' : 'rgba(201,168,76,0.20)',
            boxShadow: isHovered
              ? '0 0 18px rgba(201,168,76,0.35), 0 0 6px rgba(201,168,76,0.5)'
              : '0 0 0px rgba(201,168,76,0)',
            backgroundColor: isHovered ? 'rgba(201,168,76,0.12)' : 'rgba(8,8,14,1)',
          }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-center rounded-full border flex-shrink-0"
          style={{ width: 40, height: 40 }}
        >
          <motion.span
            animate={{ color: isHovered ? '#C9A84C' : 'rgba(201,168,76,0.35)' }}
            transition={{ duration: 0.3 }}
            className="text-xs"
          >
            {step.icon}
          </motion.span>
        </motion.div>

        {/* Bottom connector */}
        {!isLast && (
          <div
            className="w-px flex-1"
            style={{
              minHeight: 20,
              background: 'linear-gradient(to bottom, rgba(201,168,76,0.10), rgba(201,168,76,0.04))',
            }}
          />
        )}
      </div>

      {/* ── Content ── */}
      <div className="flex-1 pl-6 py-3 overflow-hidden">

        {/* Always-visible collapsed row */}
        <div className="flex items-center gap-4">
          <span
            className="text-[9px] font-semibold tracking-[0.4em] flex-shrink-0 transition-colors duration-300"
            style={{
              fontFamily: "'Cinzel', serif",
              color: isHovered ? 'rgba(201,168,76,0.7)' : 'rgba(201,168,76,0.25)',
            }}
          >
            {String(index + 1).padStart(2, '0')}
          </span>

          <motion.h3
            animate={{
              color: isHovered ? 'rgba(245,240,232,0.95)' : 'rgba(245,240,232,0.30)',
              x: isHovered ? 4 : 0,
            }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="text-2xl sm:text-3xl font-bold tracking-tight leading-none flex-1"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            {step.word}
          </motion.h3>

          {/* Sub-label pill — visible only collapsed */}
          <motion.span
            animate={{ opacity: isHovered ? 0 : 0.45 }}
            transition={{ duration: 0.25 }}
            className="hidden sm:block text-[9px] uppercase tracking-[0.3em] text-[#C9A84C] flex-shrink-0"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            {step.sub}
          </motion.span>

          {/* Arrow indicator */}
          <motion.span
            animate={{
              opacity: isHovered ? 1 : 0,
              x: isHovered ? 0 : -6,
            }}
            transition={{ duration: 0.3 }}
            className="text-[#C9A84C] text-sm flex-shrink-0"
          >
            →
          </motion.span>
        </div>

        {/* Expanded detail — height animates open/closed */}
        <motion.div
          animate={{
            height: isHovered ? 'auto' : 0,
            opacity: isHovered ? 1 : 0,
          }}
          initial={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          style={{ overflow: 'hidden' }}
        >
          <div className="pt-4 pb-2">
            {/* Gold micro-line */}
            <motion.div
              animate={{ scaleX: isHovered ? 1 : 0 }}
              transition={{ duration: 0.4, delay: 0.05 }}
              className="h-px w-14 mb-4 bg-gradient-to-r from-[#C9A84C] to-transparent"
              style={{ transformOrigin: 'left' }}
            />

            {/* Description */}
            <p
              className="text-sm leading-relaxed text-[#F5F0E8]/45 max-w-xl mb-3"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic' }}
            >
              {step.desc}
            </p>

            {/* Accent */}
            <span
              className="text-[10px] uppercase tracking-[0.3em] text-[#C9A84C]/55"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              {step.accent}
            </span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

function LuxuryTimeline() {
  const [hoveredStep,  setHoveredStep]  = useState(null);
  const [isOpen,       setIsOpen]       = useState(false);

  return (
    <section className="relative overflow-hidden bg-[#08080E] py-16 px-6 sm:px-12 lg:px-16">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 w-[400px] h-[500px]"
          style={{ background: 'radial-gradient(ellipse at 0% 50%, rgba(201,168,76,0.05) 0%, transparent 70%)' }}
        />
      </div>

      <div className="mx-auto max-w-7xl">

        {/* ── Clickable header row ── */}
        <RevealSection>
          <button
            onClick={() => setIsOpen((v) => !v)}
            className="group w-full text-left focus:outline-none"
            aria-expanded={isOpen}
          >
            <div className="flex items-end justify-between gap-6">
              {/* Left: label + title */}
              <div>
                <span className="section-label">The Journey</span>
                <h2
                  className="mt-4 text-3xl sm:text-5xl font-bold tracking-tight text-[#F5F0E8]/90 sm:text-6xl lg:text-7xl leading-none"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  A day at<br />
                  <span className="text-gold-shimmer">ATM Mall.</span>
                </h2>
              </div>

              {/* Right: toggle arrow */}
              <div className="flex-shrink-0 mb-2">
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="flex h-14 w-14 items-center justify-center rounded-full border border-[#C9A84C]/25 bg-[#C9A84C]/5 text-[#C9A84C] transition-all duration-300 group-hover:border-[#C9A84C]/60 group-hover:bg-[#C9A84C]/12 group-hover:shadow-[0_0_24px_rgba(201,168,76,0.2)]"
                >
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M3 6L9 12L15 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </motion.div>
              </div>
            </div>

            {/* Hint line */}
            <motion.p
              animate={{ opacity: isOpen ? 0 : 1, height: isOpen ? 0 : 'auto' }}
              transition={{ duration: 0.3 }}
              className="mt-5 text-sm text-[#F5F0E8]/25 overflow-hidden"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic' }}
            >
              Tap to explore the guest journey ↓
            </motion.p>
          </button>
        </RevealSection>

        {/* ── Collapsible steps ── */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              key="timeline-steps"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              style={{ overflow: 'hidden' }}
            >
              <div className="max-w-3xl mt-12">

                {/* Sub-heading */}
                <p
                  className="text-base leading-relaxed text-[#F5F0E8]/35 mb-10 max-w-lg"
                  style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic' }}
                >
                  Every visit tells a story. Hover each moment to explore what awaits.
                </p>

                {/* Top border */}
                <div className="h-px w-full bg-gradient-to-r from-[#C9A84C]/20 via-[#C9A84C]/10 to-transparent" />

                {TIMELINE_STEPS.map((step, i) => (
                  <motion.div
                    key={step.word}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.07 }}
                    className="border-b border-[#C9A84C]/10"
                  >
                    <TimelineStep
                      step={step}
                      index={i}
                      total={TIMELINE_STEPS.length}
                      isHovered={hoveredStep === i}
                      onHover={() => setHoveredStep(i)}
                      onLeave={() => setHoveredStep(null)}
                      onClick={() => setHoveredStep(hoveredStep === i ? null : i)}
                    />
                  </motion.div>
                ))}

                {/* Skip / close */}
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  onClick={() => setIsOpen(false)}
                  className="mt-10 flex items-center gap-3 text-[9px] uppercase tracking-[0.4em] text-[#F5F0E8]/25 hover:text-[#C9A84C] transition-colors duration-300 group"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  <span className="h-px w-8 bg-current transition-all duration-300 group-hover:w-12" />
                  Collapse Journey
                  <motion.span
                    animate={{ rotate: 180 }}
                    className="text-current"
                  >
                    ↓
                  </motion.span>
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}



/* ─────────────────────────────────────────────────────
   SECTION DIVIDER (Thin animated gold accent line)
───────────────────────────────────────────────────── */
function SectionDivider() {
  return (
    <div className="relative flex items-center justify-center py-0 px-6 sm:px-16 overflow-hidden">
      {/* Left arm */}
      <motion.div
        initial={{ scaleX: 0, originX: 1 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="flex-1 h-px"
        style={{
          background: "linear-gradient(90deg, transparent 0%, rgba(201,168,76,0.08) 20%, rgba(201,168,76,0.45) 100%)",
          transformOrigin: "right center",
        }}
      />

      {/* Centre diamond */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5, delay: 0.6, ease: "backOut" }}
        className="mx-3 flex-shrink-0"
      >
        <div className="w-[7px] h-[7px] rotate-45 bg-[#C9A84C] shadow-[0_0_10px_rgba(201,168,76,0.7),0_0_24px_rgba(201,168,76,0.3)]" />
      </motion.div>

      {/* Right arm */}
      <motion.div
        initial={{ scaleX: 0, originX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="flex-1 h-px"
        style={{
          background: "linear-gradient(270deg, transparent 0%, rgba(201,168,76,0.08) 20%, rgba(201,168,76,0.45) 100%)",
          transformOrigin: "left center",
        }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   BREATHING SPACE SECTION (Immersive full-width image breaks)
───────────────────────────────────────────────────── */
function BreathingSpace({ image, title, subtitle }) {
  const localRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: localRef,
    offset: ["start end", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);

  return (
    <section ref={localRef} className="relative h-[55vh] sm:h-[65vh] overflow-hidden bg-[#08080E] flex items-center justify-center border-y border-[#C9A84C]/5">
      {/* Parallax Image */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.img
          style={{ y }}
          src={image}
          alt="Breathing space view"
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-[130%] w-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#08080E] via-[#08080E]/40 to-[#08080E]" />
        <div className="absolute inset-0 bg-[#08080E]/15" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#F5F0E8] mb-4"
          style={{ fontFamily: "'Cinzel', serif" }}
        >
          {title}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 1.2, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="text-xs sm:text-sm text-[#C9A84C]/80 tracking-[0.2em] uppercase font-semibold"
          style={{ fontFamily: "'Cinzel', serif" }}
        >
          {subtitle}
        </motion.p>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────
   REVEAL IMAGE COMPONENT (Mask wipe, scale, blur & light sweep reveal)
───────────────────────────────────────────────────── */
function RevealImage({ src, alt, className = "", parallaxY, heightClass = "h-full" }) {
  const [hasRevealed, setHasRevealed] = useState(false);

  return (
    <div className={`relative overflow-hidden w-full ${heightClass} ${className}`}>
      {/* Light sweep sheen */}
      <motion.div
        initial={{ left: "-150%" }}
        animate={hasRevealed ? { left: "150%" } : {}}
        transition={{ duration: 1.5, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="absolute inset-y-0 w-full bg-gradient-to-r from-transparent via-[#C9A84C]/15 to-transparent z-10 pointer-events-none transform -skew-x-12"
      />

      {/* Main Image with scale and opacity fade-in reveal — blur removed (GPU memory) */}
      <motion.img
        style={parallaxY ? { y: parallaxY } : {}}
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className={`absolute inset-0 w-full ${parallaxY ? 'h-[125%]' : 'h-full'} object-cover`}
        initial={{ 
          opacity: 0,
          scale: 1.15,
        }}
        whileInView={{ 
          opacity: 1,
          scale: 1.0,
        }}
        viewport={{ once: true, margin: "-40px" }}
        onAnimationComplete={() => {
          setHasRevealed(true);
        }}
        transition={{ 
          opacity: { duration: 0.8, ease: "easeOut" },
          scale: { duration: 1.5, ease: [0.16, 1, 0.3, 1] },
        }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   CINEMATIC TITLE COMPONENT (Animate words independently)
───────────────────────────────────────────────────── */
function CinematicTitle({ text, className = "", delay = 0, align = "center", style = {} }) {
  const words = text.split(" ");
  
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.12,
        delayChildren: delay,
      }
    }
  };

  const wordVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8, 
        ease: [0.16, 1, 0.3, 1] 
      }
    }
  };

  const justifyClass = align === "left" ? "justify-start" : "justify-center";

  return (
    <motion.h2
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      className={`flex flex-wrap ${justifyClass} gap-x-[0.25em] gap-y-[0.05em] ${className}`}
      style={style}
    >
      {words.map((word, idx) => (
        <span key={idx} className="inline-block overflow-hidden py-0.5">
          <motion.span
            variants={wordVariants}
            className="inline-block"
          >
            {word}
          </motion.span>
        </span>
      ))}
    </motion.h2>
  );
}

/* ─────────────────────────────────────────────────────
   CINEMATIC TRANSITION OVERLAY
───────────────────────────────────────────────────── */
function CinematicTransitionOverlay({ stage }) {
  if (stage === 'idle') return null;

  return (
    <div
      className="fixed inset-0 pointer-events-auto overflow-hidden"
      style={{ zIndex: 99999 }}
    >
      {/* Black curtain */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: stage === 'covering' || stage === 'solid' ? 1 : 0,
        }}
        transition={{ duration: 0.45, ease: 'easeInOut' }}
        className="absolute inset-0 bg-[#06060A]"
      />

      {/* Sweep Gold line */}
      <motion.div
        initial={{ scaleX: 0, originX: 0 }}
        animate={{
          scaleX: stage === 'covering' ? [0, 1] : stage === 'solid' ? 1 : 1,
          originX: stage === 'uncovering' ? 1 : 0,
          scaleX: stage === 'uncovering' ? [1, 0] : undefined,
        }}
        transition={{
          duration: 0.55,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[2px] bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent shadow-[0_0_24px_rgba(201,168,76,0.85)]"
      />

      {/* Center diamond logo reveal */}
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{
          scale: stage === 'solid' ? 1.05 : 0.85,
          opacity: stage === 'solid' ? 1 : 0,
        }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="absolute inset-0 flex flex-col items-center justify-center gap-4"
      >
        <div className="w-16 h-16 rotate-45 border border-[#C9A84C]/45 flex items-center justify-center bg-[#08080E] shadow-[0_0_36px_rgba(201,168,76,0.22)]">
          <span className="text-[#C9A84C] text-2xl -rotate-45 font-semibold" style={{ fontFamily: "'Cinzel', serif" }}>✦</span>
        </div>
        <span className="text-[10px] tracking-[0.45em] uppercase text-[#C9A84C]" style={{ fontFamily: "'Cinzel', serif" }}>
          ATM MALL
        </span>
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   BROCHURE REQUEST MODAL
───────────────────────────────────────────────────── */
function BrochureModal({ isOpen, onClose }) {
  const [form, setForm] = useState({ fullName: '', email: '', phone: '' });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 700);
  };

  const handleResetAndClose = () => {
    onClose();
    setTimeout(() => {
      setSubmitted(false);
      setForm({ fullName: '', email: '', phone: '' });
    }, 300);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={handleResetAndClose}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-[#08080E]/90 backdrop-blur-xl p-4 sm:p-6 overflow-y-auto"
        >
          <motion.div
            initial={{ scale: 0.93, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.93, opacity: 0, y: 15 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-[#C9A84C]/25 bg-[#0D0D18] p-6 sm:p-10 shadow-[0_25px_80px_rgba(0,0,0,0.9),0_0_50px_rgba(201,168,76,0.12)] my-auto"
          >
            {/* Close button */}
            <button
              onClick={handleResetAndClose}
              className="absolute right-5 top-5 sm:right-6 sm:top-6 flex h-9 w-9 items-center justify-center rounded-full border border-[#C9A84C]/20 bg-[#C9A84C]/5 text-[#C9A84C] transition-all duration-300 hover:border-[#C9A84C]/60 hover:bg-[#C9A84C]/15 hover:rotate-90"
              aria-label="Close modal"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Subtle radial gold glow inside modal */}
            <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-48 w-48 rounded-full bg-[#C9A84C]/10 blur-3xl" />

            {submitted ? (
              <div className="py-4 sm:py-6 text-center">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-[#C9A84C]/40 bg-[#C9A84C]/10 shadow-[0_0_30px_rgba(201,168,76,0.25)]">
                  <CheckCircle2 className="h-8 w-8 text-[#C9A84C]" />
                </div>
                <h3
                  className="text-2xl font-bold tracking-tight text-[#F5F0E8] sm:text-3xl"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  Brochure Unlocked
                </h3>
                <p
                  className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-[#F5F0E8]/70"
                  style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: '17px' }}
                >
                  Thank you, <span className="text-[#C9A84C] font-semibold">{form.fullName || 'Valued Guest'}</span>. The official ATM MALL masterplan brochure and investment dossier is ready.
                </p>

                <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                  <a
                    href="#download"
                    onClick={(e) => {
                      e.preventDefault();
                      alert('Download initiated. The complete project dossier PDF will begin downloading.');
                    }}
                    className="btn-luxury-gold inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.25em] shadow-[0_0_30px_rgba(201,168,76,0.25)]"
                    style={{ fontFamily: "'Cinzel', serif" }}
                  >
                    <Download className="h-4 w-4" />
                    Download PDF
                  </a>
                  <button
                    onClick={handleResetAndClose}
                    className="inline-flex items-center justify-center rounded-full border border-[#C9A84C]/30 bg-transparent px-6 py-3.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.25em] text-[#F5F0E8]/70 hover:text-[#F5F0E8] hover:border-[#C9A84C]/60 transition-all duration-300"
                    style={{ fontFamily: "'Cinzel', serif" }}
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="mb-6 sm:mb-8 text-center sm:text-left">
                  <span
                    className="inline-block text-[9px] font-bold tracking-[0.35em] text-[#C9A84C] uppercase mb-2 border-b border-[#C9A84C]/30 pb-0.5"
                    style={{ fontFamily: "'Cinzel', serif" }}
                  >
                    Exclusive Project Dossier
                  </span>
                  <h3
                    className="text-2xl font-bold tracking-tight text-[#F5F0E8] sm:text-3xl"
                    style={{ fontFamily: "'Cinzel', serif" }}
                  >
                    Download Brochure
                  </h3>
                  <p
                    className="mt-2 text-xs sm:text-sm text-[#F5F0E8]/60 leading-relaxed"
                    style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: '15px' }}
                  >
                    Enter your contact details to receive floor plans, retail specifications, hospitality details, and investment highlights.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <label className="block">
                    <span
                      className="mb-1.5 block text-[9px] font-semibold uppercase tracking-[0.28em] text-[#C9A84C]/80"
                      style={{ fontFamily: "'Cinzel', serif" }}
                    >
                      Full Name *
                    </span>
                    <input
                      required
                      type="text"
                      value={form.fullName}
                      onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                      placeholder="e.g. Raj Patel"
                      className="luxury-input"
                    />
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label className="block">
                      <span
                        className="mb-1.5 block text-[9px] font-semibold uppercase tracking-[0.28em] text-[#C9A84C]/80"
                        style={{ fontFamily: "'Cinzel', serif" }}
                      >
                        Email Address *
                      </span>
                      <input
                        required
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="mail@domain.com"
                        className="luxury-input"
                      />
                    </label>

                    <label className="block">
                      <span
                        className="mb-1.5 block text-[9px] font-semibold uppercase tracking-[0.28em] text-[#C9A84C]/80"
                        style={{ fontFamily: "'Cinzel', serif" }}
                      >
                        Phone Number *
                      </span>
                      <input
                        required
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="luxury-input"
                      />
                    </label>
                  </div>

                  <div className="pt-3">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-luxury-gold w-full rounded-full py-3.5 sm:py-4 text-[10px] font-bold uppercase tracking-[0.3em] shadow-[0_0_40px_rgba(201,168,76,0.25)] justify-center disabled:opacity-50"
                      style={{ fontFamily: "'Cinzel', serif" }}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#08080E] border-t-transparent" />
                          Processing...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2.5">
                          <Download className="h-4 w-4" />
                          Get Instant Access
                        </span>
                      )}
                    </button>
                  </div>

                  <p className="text-center text-[9px] tracking-wider text-[#F5F0E8]/40 pt-1">
                    🔒 Confidential. Your information will never be shared.
                  </p>
                </form>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─────────────────────────────────────────────────────
   PERSISTENT FLOATING CTA (BOTTOM-RIGHT)
───────────────────────────────────────────────────── */
function FloatingBrochureCTA({ onOpen }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.8, ease: 'easeOut' }}
      className="fixed bottom-5 right-5 sm:bottom-8 sm:right-8 z-40 flex items-center pointer-events-auto"
    >
      <motion.button
        onClick={onOpen}
        whileHover={{ y: -3, scale: 1.03 }}
        whileTap={{ scale: 0.96 }}
        className="group relative flex items-center rounded-full border border-[#C9A84C]/45 bg-[#090912]/92 backdrop-blur-xl shadow-[0_10px_35px_rgba(0,0,0,0.85),0_0_30px_rgba(201,168,76,0.18)] transition-all duration-300 hover:border-[#C9A84C] hover:bg-[#121222] hover:shadow-[0_12px_45px_rgba(0,0,0,0.9),0_0_40px_rgba(201,168,76,0.35)] px-3.5 py-2.5 sm:px-6 sm:py-3.5 gap-2.5 sm:gap-3"
        style={{ fontFamily: "'Cinzel', serif" }}
        aria-label="Download Project Brochure"
      >
        {/* Subtle glowing animated ring */}
        <span className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-[#C9A84C]/30 via-[#E8D8A0]/40 to-[#C9A84C]/30 opacity-40 blur-[4px] transition-opacity duration-300 group-hover:opacity-100 -z-10" />

        {/* Icon with circular gold backdrop */}
        <div className="flex h-7 w-7 sm:h-8 sm:w-8 flex-shrink-0 items-center justify-center rounded-full border border-[#C9A84C]/40 bg-[#C9A84C]/15 text-[#C9A84C] transition-all duration-300 group-hover:scale-110 group-hover:bg-[#C9A84C] group-hover:text-[#08080E]">
          <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </div>

        {/* Desktop full text */}
        <span className="hidden sm:inline-block text-[11px] font-bold uppercase tracking-[0.25em] text-[#F5F0E8] group-hover:text-[#C9A84C] transition-colors duration-300 whitespace-nowrap">
          Download Brochure
        </span>

        {/* Mobile short label */}
        <span className="inline-block sm:hidden text-[9px] font-bold uppercase tracking-[0.18em] text-[#F5F0E8] group-hover:text-[#C9A84C] transition-colors duration-300 whitespace-nowrap">
          Brochure
        </span>
      </motion.button>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────
   MAIN APP
───────────────────────────────────────────────────── */
export default function App() {
  const [menuOpen,          setMenuOpen]          = useState(false);
  const [selectedImage,     setSelectedImage]     = useState(null);
  const [brochureModalOpen, setBrochureModalOpen] = useState(false);
  const [formSubmitted,     setFormSubmitted]     = useState(false);
  const [formValues,        setFormValues]        = useState({ fullName: '', phone: '', email: '', message: '' });
  const [scrolled,          setScrolled]          = useState(false);
  const [isLoading,         setIsLoading]         = useState(true);
  const [activeFilter,       setActiveFilter]       = useState('All');
  const [hoveredAmenity,     setHoveredAmenity]     = useState(null);
  const [activeMobileAmenity, setActiveMobileAmenity] = useState(0);
  const [transitionStage,   setTransitionStage]   = useState('idle');

  const handleNavClick = useCallback((e, href) => {
    e.preventDefault();
    if (transitionStage !== 'idle') return;

    const targetId = href.startsWith('#') ? href.substring(1) : href;
    const targetElement = document.getElementById(targetId);

    setTransitionStage('covering');

    // 1. Cover transition stage duration
    setTimeout(() => {
      setTransitionStage('solid');
      if (targetElement) {
        // Jump without smooth scroll animation to avoid stuttering behind the black transition overlay
        targetElement.scrollIntoView({ behavior: 'auto' });
      }

      // 2. Hold solid curtain briefly, then lift
      setTimeout(() => {
        setTransitionStage('uncovering');

        // 3. Complete transition overlay lift
        setTimeout(() => {
          setTransitionStage('idle');
        }, 550);
      }, 250);
    }, 450);
  }, [transitionStage]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY     = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const aboutRef = useRef(null);
  const { scrollYProgress: aboutScroll } = useScroll({ target: aboutRef, offset: ['start end', 'end start'] });
  const aboutY = useTransform(aboutScroll, [0, 1], ['-12%', '12%']);

  const poolRef = useRef(null);
  const { scrollYProgress: poolScroll } = useScroll({ target: poolRef, offset: ['start end', 'end start'] });
  const poolY = useTransform(poolScroll, [0, 1], ['-12%', '12%']);

  const hotelRef = useRef(null);
  const { scrollYProgress: hotelScroll } = useScroll({ target: hotelRef, offset: ['start end', 'end start'] });
  const hotelY = useTransform(hotelScroll, [0, 1], ['-10%', '10%']);

  const ctaRef = useRef(null);
  const { scrollYProgress: ctaScroll } = useScroll({ target: ctaRef, offset: ['start end', 'end start'] });
  const ctaY = useTransform(ctaScroll, [0, 1], ['-10%', '10%']);

  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const sections = document.querySelectorAll('section[id]');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.25, rootMargin: '-20% 0px -55% 0px' }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    setFormValues({ fullName: '', phone: '', email: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-[#08080E] text-[#F5F0E8] overflow-x-hidden">
      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#08080E]"
          >
            <div className="text-center flex flex-col items-center">
              <motion.img
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.0, delay: 0.1, ease: "easeOut" }}
                src="/logo.jpg"
                alt="ATM Mall Logo"
                className="h-16 w-16 rounded-full object-cover border border-[#C9A84C]/30 shadow-[0_0_30px_rgba(201,168,76,0.25)] mb-6"
              />
              <motion.span
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.0, delay: 0.3, ease: "easeOut" }}
                className="font-display text-2xl sm:text-3xl font-semibold tracking-[0.4em] text-[#C9A84C] uppercase"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                ATM MALL
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.0, delay: 0.5, ease: "easeOut" }}
                className="text-[10px] tracking-[0.3em] text-[#F5F0E8]/40 uppercase mt-2"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                Luxury Destination
              </motion.span>
              
              {/* Animating Gold Progress Line */}
              <div className="mt-8 h-[1px] w-48 overflow-hidden bg-[#C9A84C]/10 rounded-full relative">
                <motion.div
                  initial={{ left: "-100%" }}
                  animate={{ left: "100%" }}
                  transition={{ duration: 1.8, ease: "easeInOut" }}
                  className="absolute inset-y-0 w-full bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: 1.0, ease: "easeInOut" }}
      >
        <LuxuryCursor />
        <AmbientBackground />
        <CinematicTransitionOverlay stage={transitionStage} />
        <div className="noise-overlay" />

      {/* ══════════════ NAVBAR ══════════════ */}
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-700 ${
          scrolled
            ? 'bg-[#08080E]/70 backdrop-blur-[40px] border-b border-[#C9A84C]/12 shadow-[0_12px_60px_rgba(0,0,0,0.7)]'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 sm:py-5 lg:px-12">
          {/* Logo */}
          <a
            href="#home"
            onClick={(e) => handleNavClick(e, '#home')}
            className="flex items-center gap-4 group"
          >
            <div className="relative">
              <img
                src="/logo.jpg"
                alt="ATM Mall"
                className="h-10 w-10 rounded-full object-cover border border-[#C9A84C]/30 shadow-[0_0_20px_rgba(201,168,76,0.2)] transition-all duration-500 group-hover:border-[#C9A84C]/70 group-hover:shadow-[0_0_30px_rgba(201,168,76,0.4)]"
              />
              <div className="absolute inset-0 rounded-full bg-[#C9A84C]/10 scale-0 group-hover:scale-150 opacity-0 group-hover:opacity-100 transition-all duration-500 blur-md" />
            </div>
            <div className="flex flex-col leading-none">
              <span
                className="font-display text-xs font-semibold tracking-[0.4em] text-[#C9A84C] uppercase"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                ATM MALL
              </span>
              <span className="text-[9px] tracking-[0.25em] text-[#F5F0E8]/40 uppercase mt-0.5">
                Luxury Destination
              </span>
            </div>
          </a>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.substring(1);
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`relative text-[10px] font-semibold uppercase tracking-[0.3em] transition-colors duration-300 py-1 ${
                    isActive ? 'text-[#C9A84C]' : 'text-[#F5F0E8]/60 hover:text-[#C9A84C]'
                  } group`}
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  {link.label}
                  {/* Underline scale-out on hover */}
                  <span className="absolute -bottom-1 left-0 h-[1px] w-full bg-gradient-to-r from-transparent via-[#C9A84C]/60 to-transparent scale-x-0 transition-transform duration-500 origin-center group-hover:scale-x-100" />
                  
                  {/* Smooth Active Indicator */}
                  {isActive && (
                    <motion.span
                      layoutId="activeNavIndicator"
                      className="absolute -bottom-1 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </a>
              );
            })}
          </nav>

          <div className="flex items-center gap-4">
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, '#contact')}
              className="btn-luxury-primary hidden lg:inline-flex items-center gap-3 rounded-full px-6 py-2.5 text-[10px] font-semibold uppercase tracking-[0.3em] shadow-[0_0_30px_rgba(201,168,76,0.15)]"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              Book Visit
              <ArrowRight className="h-3.5 w-3.5" />
            </a>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="relative z-[60] flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-full border border-[#C9A84C]/20 bg-[#C9A84C]/5 transition-all duration-300 hover:border-[#C9A84C]/50 hover:bg-[#C9A84C]/10 lg:hidden"
            >
              <span className={`block h-px w-5 bg-[#C9A84C] transition-all duration-300 ${menuOpen ? 'translate-y-[5px] rotate-45' : ''}`} />
              <span className={`block h-px w-5 bg-[#C9A84C] transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`block h-px w-5 bg-[#C9A84C] transition-all duration-300 ${menuOpen ? '-translate-y-[5px] -rotate-45' : ''}`} />
            </button>
          </div>
        </div>

      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.97 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed inset-0 z-50 bg-[#08080E]/98 backdrop-blur-[30px] border-b border-[#C9A84C]/15 p-8 shadow-[0_40px_120px_rgba(0,0,0,0.9)] lg:hidden flex flex-col justify-center items-center gap-6 sm:inset-x-4 sm:top-20 sm:bottom-auto sm:h-auto sm:rounded-2xl sm:py-8 sm:px-12 sm:items-start sm:border sm:border-[#C9A84C]/15"
          >
            <div className="flex flex-col gap-5 items-center sm:items-start w-full">
              {navLinks.map((link, i) => {
                const isActive = activeSection === link.href.substring(1);
                return (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => {
                      setMenuOpen(false);
                      handleNavClick(e, link.href);
                    }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`text-xl sm:text-base font-semibold uppercase tracking-[0.2em] transition ${
                      isActive ? 'text-[#C9A84C]' : 'text-[#F5F0E8]/70 hover:text-[#C9A84C]'
                    }`}
                    style={{ fontFamily: "'Cinzel', serif" }}
                  >
                    {link.label}
                  </motion.a>
                );
              })}
              <div className="h-px w-12 bg-gradient-to-r from-transparent via-[#C9A84C]/40 to-transparent my-1 sm:my-2 w-16" />
              <a
                href="#contact"
                onClick={(e) => {
                  setMenuOpen(false);
                  handleNavClick(e, '#contact');
                }}
                className="btn-luxury-gold inline-flex items-center justify-center rounded-full px-6 py-3 text-xs font-semibold uppercase tracking-[0.25em]"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                Book a Visit
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main>
        {/* ══════════════ HERO ══════════════ */}
        <section id="home" ref={heroRef} className="relative min-h-screen overflow-hidden bg-[#08080E]">
          {/* Parallax image */}
          <motion.div style={{ y: heroY }} className="absolute inset-0 will-change-transform">
            <img
              src="/hero-lawn.jpg"
              alt="ATM Mall"
              loading="eager"
              decoding="sync"
              fetchPriority="high"
              className="absolute inset-0 h-[115%] w-full object-cover hero-image"
            />
            {/* Subtle moving light rays overlay */}
            <div className="light-rays" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#08080E]/30 via-[#08080E]/20 to-[#08080E]" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#08080E]/40 via-transparent to-[#08080E]/40" />
          </motion.div>

          {/* Gold particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {particles.map((p) => (
              <div
                key={p.id}
                className="hero-particle"
                style={{
                  left: p.x,
                  width: p.size,
                  height: p.size,
                  '--duration': p.duration,
                  '--delay': p.delay,
                  '--drift': p.drift,
                }}
              />
            ))}
          </div>

          {/* Content */}
          <motion.div
            style={{ opacity: heroOpacity }}
            className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-4 py-20 sm:px-5 sm:py-28 text-center"
          >
            <div>
              {/* Pre-label */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="mb-6 sm:mb-8 inline-flex items-center gap-2 sm:gap-3 rounded-full border border-[#C9A84C]/25 bg-[#C9A84C]/5 px-3 py-1.5 sm:px-5 sm:py-2 backdrop-blur-xl"
              >
                <Star className="h-3 w-3 text-[#C9A84C] fill-current" />
                <span
                  className="text-[7px] sm:text-[9px] font-semibold uppercase tracking-[0.2em] sm:tracking-[0.4em] text-[#C9A84C]"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  Luxury Hotel · Retail Mall · Resort Living
                </span>
                <Star className="h-3 w-3 text-[#C9A84C] fill-current" />
              </motion.div>

              {/* Main headline - Line 1 */}
              <div className="overflow-hidden mb-4">
                <motion.h1
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="text-3xl font-bold leading-[1.05] tracking-tight text-[#F5F0E8] sm:text-6xl md:text-7xl lg:text-[5.5rem]"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  Experience
                </motion.h1>
              </div>

              {/* Main headline - Line 2 */}
              <div className="overflow-hidden mb-6">
                <motion.h1
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1.2, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="text-3xl font-bold leading-[1.05] tracking-tight sm:text-6xl md:text-6xl lg:text-[5rem]"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  <span className="text-gold-shimmer">Luxury</span>
                </motion.h1>
              </div>

              {/* Main headline - Line 3 */}
              <div className="overflow-hidden mb-8">
                <motion.h1
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1.2, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="text-3xl font-bold leading-[1.05] tracking-tight text-[#F5F0E8] sm:text-6xl md:text-7xl lg:text-[5.5rem]"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  Beyond Limits
                </motion.h1>
              </div>

              {/* Ornamental divider */}
              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.75 }}
                className="mx-auto mb-6 sm:mb-8 w-40 sm:w-64"
              >
                <GoldDivider />
              </motion.div>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 0.9, ease: "easeOut" }}
                className="mx-auto mb-8 sm:mb-12 max-w-2xl text-sm leading-relaxed text-[#F5F0E8]/55 sm:text-lg"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic' }}
              >
                A destination where premium hospitality, luxury shopping, resort living and world-class amenities converge in a cinematic, museum-quality experience.
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 1.05, ease: "easeOut" }}
                className="flex flex-col items-center justify-center gap-3 sm:gap-4 sm:flex-row w-full sm:w-auto"
              >
                <a
                  href="#amenities"
                  onClick={(e) => handleNavClick(e, '#amenities')}
                  className="btn-luxury-primary inline-flex items-center gap-3 rounded-full px-6 py-3 sm:px-8 sm:py-3.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.25em] sm:tracking-[0.35em] shadow-[0_0_40px_rgba(201,168,76,0.2)] w-full sm:w-auto justify-center"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  Explore the Project
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
                <a
                  href="#contact"
                  onClick={(e) => handleNavClick(e, '#contact')}
                  className="btn-luxury-ghost inline-flex items-center gap-3 rounded-full border border-[#C9A84C]/30 px-6 py-3 sm:px-8 sm:py-3.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.25em] sm:tracking-[0.35em] text-[#F5F0E8] w-full sm:w-auto justify-center"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  Book Site Visit
                </a>
              </motion.div>
            </div>

            {/* Scroll indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4 }}
              className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
            >
              <span
                className="text-[8px] tracking-[0.3em] text-[#C9A84C]/60 uppercase whitespace-nowrap"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                Scroll to Explore
              </span>
              <div className="h-10 w-px overflow-hidden rounded-full bg-[#C9A84C]/15">
                <div className="h-5 w-full bg-gradient-to-b from-[#C9A84C] to-transparent scroll-dot" />
              </div>
            </motion.div>
          </motion.div>
        </section>

        <SectionDivider />

        {/* ══════════════ ABOUT ══════════════ */}
        <section id="about" className="relative overflow-hidden bg-[#0D0D18] py-16 sm:py-28 px-4 sm:px-8 lg:px-16">
          {/* BG accent */}
          <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-[#C9A84C]/5 blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-[#C9A84C]/4 blur-[100px] pointer-events-none" />

          <div className="mx-auto grid max-w-7xl gap-10 sm:gap-16 lg:grid-cols-2 items-center">
            {/* Image */}
            <div ref={aboutRef} className="relative rounded-2xl overflow-hidden glow-gold group h-[320px] sm:h-[500px]">
              <RevealImage
                src="/hotel-entry.jpg"
                alt="Hotel architecture"
                parallaxY={aboutY}
                heightClass="h-full"
              />
              <div className="absolute inset-0 img-overlay-luxury z-10" />
              {/* Corner ornament */}
              <div className="absolute top-5 right-5 flex h-14 w-14 items-center justify-center rounded-full border border-[#C9A84C]/30 bg-[#08080E]/60 backdrop-blur-xl z-20">
                <Star className="h-5 w-5 text-[#C9A84C] fill-current" />
              </div>
              <div className="absolute bottom-8 left-8 right-8 z-20">
                <p
                  className="text-2xl font-medium text-[#F5F0E8] leading-snug"
                  style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic' }}
                >
                  "Where every arrival feels like a premiere."
                </p>
              </div>
            </div>

            {/* Text */}
            <RevealSection delay={0.15}>
              <div className="space-y-8">
                <span className="section-label">Where Luxury Meets Modern Architecture</span>
                <CinematicTitle
                  text="A premium mixed-use destination designed for a world-class lifestyle."
                  align="left"
                  className="mt-6 sm:mt-8 text-3xl font-bold tracking-tight leading-[0.9] text-[#F5F0E8] sm:text-6xl lg:text-7xl"
                  style={{ fontFamily: "'Cinzel', serif" }}
                />
                <GoldDivider />
                <p
                  className="text-lg leading-relaxed text-[#F5F0E8]/55"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  ATM Mall is conceived to feel cinematic, minimal and luxurious — blending hotel hospitality, premium retail, landscaped gardens and resort-style outdoor amenities into one iconic Ahmedabad address.
                </p>

                <div className="grid gap-4 sm:grid-cols-2">
                  {['Luxury Hospitality', 'Fine Dining', 'Premium Outdoor Spaces', 'Business Facilities'].map((item, i) => (
                    <motion.div
                      key={item}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.08 }}
                      className="glass-dark rounded-xl p-5 glow-gold-hover"
                    >
                      <div className="mb-3 text-[#C9A84C]">✦</div>
                      <h3
                        className="text-sm font-semibold text-[#F5F0E8] mb-2 tracking-wide"
                        style={{ fontFamily: "'Cinzel', serif" }}
                      >
                        {item}
                      </h3>
                      <p className="text-xs leading-relaxed text-[#F5F0E8]/40">
                        A refined experience designed for the discerning guest and premium investor.
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </RevealSection>
          </div>
        </section>

        <SectionDivider />

        {/* Breathing Space 1 */}
        <BreathingSpace
          image="/back-elevation.jpg"
          title="Experience Tranquility."
          subtitle="Designed to inspire."
        />

        <SectionDivider />

        {/* ══════════════ STATS ══════════════ */}
        <section className="relative overflow-hidden bg-[#08080E] py-16 sm:py-28 px-4 sm:px-8 lg:px-16">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,168,76,0.06)_0%,transparent_70%)] pointer-events-none" />

          <div className="mx-auto max-w-7xl">
            <RevealSection className="text-center mb-24">
              <span className="section-label">Project Highlights</span>
              <CinematicTitle
                text="Scale meets luxury at every corner."
                align="center"
                className="mt-6 sm:mt-8 text-3xl font-bold tracking-tight leading-[0.92] text-[#F5F0E8] sm:text-6xl lg:text-7xl"
                style={{ fontFamily: "'Cinzel', serif" }}
              />
              <GoldDivider />
            </RevealSection>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {highlights.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.7, delay: i * 0.08 }}
                  className="luxury-card p-5 sm:p-8 glow-gold-hover"
                >
                  <div className="mb-6 flex items-end gap-1">
                    <AnimatedCounter value={item.value} suffix={item.suffix} />
                  </div>
                  <h3
                    className="mb-3 text-base font-semibold tracking-wider text-[#F5F0E8]/80 uppercase"
                    style={{ fontFamily: "'Cinzel', serif" }}
                  >
                    {item.label}
                  </h3>
                  <div className="mb-4 h-px w-12 bg-gradient-to-r from-[#C9A84C] to-transparent" />
                  <p className="text-sm leading-relaxed text-[#F5F0E8]/40">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════ AMENITIES ══════════════ */}
        <section id="amenities" className="relative overflow-hidden bg-[#08080E]" style={{ minHeight: '100vh' }}>

          {/* ── Full-bleed background images (one per amenity) ── */}
          {amenities.map((item, i) => (
            <motion.div
              key={item.title + '-bg'}
              animate={{ opacity: hoveredAmenity === i ? 1 : 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 pointer-events-none"
              style={{ zIndex: 1 }}
            >
              <img
                src={item.image}
                alt={item.title}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#08080E] via-[#08080E]/75 to-[#08080E]/30" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#08080E]/60 via-transparent to-[#08080E]/40" />
            </motion.div>
          ))}

          {/* Default dark gradient when nothing hovered */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ zIndex: 0, background: 'radial-gradient(ellipse at 70% 50%, rgba(201,168,76,0.04) 0%, transparent 60%)' }}
          />

          {/* ── Content ── */}
          <div className="relative px-4 sm:px-12 lg:px-16 py-16 sm:py-28" style={{ zIndex: 10 }}>
            <div className="mx-auto max-w-7xl">

              {/* Header */}
              <RevealSection className="mb-20">
                <span className="section-label">Amenities</span>
                <CinematicTitle
                  text="Curated luxury experiences for every visit."
                  align="left"
                  className="mt-6 sm:mt-8 text-3xl font-bold tracking-tight leading-[0.9] text-[#F5F0E8] sm:text-6xl lg:text-7xl"
                  style={{ fontFamily: "'Cinzel', serif" }}
                />
                <GoldDivider />
              </RevealSection>

              {/* Amenity list — card grid (Desktop) */}
              <div className="hidden sm:grid grid-cols-3 gap-4">
                {amenities.map((item, i) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-30px' }}
                    transition={{ duration: 0.55, delay: i * 0.07 }}
                    className="relative group rounded-2xl overflow-hidden cursor-default"
                    style={{
                      border: '1px solid rgba(201,168,76,0.12)',
                      minHeight: '88px',
                    }}
                  >
                    {/* Background image — always present, revealed on hover */}
                    <img
                      src={item.image}
                      alt={item.title}
                      className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 scale-105 group-hover:scale-100 transition-all duration-700 ease-out"
                      loading="lazy"
                    />

                    {/* Dark base — fades out on hover to reveal image */}
                    <div className="absolute inset-0 bg-[#0C0C14] group-hover:bg-transparent transition-colors duration-500" />

                    {/* Gradient overlay on top of image */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#08080E]/85 via-[#08080E]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Card content */}
                    <div className="relative flex items-center gap-4 px-5 py-5">
                      {/* Star icon box */}
                      <div
                        className="flex-shrink-0 h-9 w-9 rounded-lg flex items-center justify-center transition-all duration-300"
                        style={{ background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.22)' }}
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                      </div>

                      {/* Text */}
                      <div className="flex flex-col gap-0.5">
                        <h3
                          className="text-sm font-bold tracking-wide leading-tight text-[#F5F0E8] group-hover:text-[#C9A84C] transition-colors duration-300"
                          style={{ fontFamily: "'Cinzel', serif" }}
                        >
                          {item.title}
                        </h3>
                        <p
                          className="text-[10px] tracking-[0.15em] uppercase text-[#F5F0E8]/50 group-hover:text-[#F5F0E8]/70 transition-colors duration-300"
                          style={{ fontFamily: "'Cinzel', serif" }}
                        >
                          {item.tag}
                        </p>
                      </div>
                    </div>

                    {/* Gold border glow on hover */}
                    <div className="absolute inset-0 rounded-2xl border border-[#C9A84C]/0 group-hover:border-[#C9A84C]/40 transition-all duration-400 pointer-events-none" />
                  </motion.div>
                ))}
              </div>

              {/* Amenity list — interactive accordion (Mobile) */}
              <div className="flex sm:hidden flex-col gap-4">
                {amenities.map((item, i) => {
                  const isActive = activeMobileAmenity === i;
                  return (
                    <motion.div
                      key={item.title + '-mobile'}
                      layout
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.05 }}
                      onClick={() => setActiveMobileAmenity(isActive ? null : i)}
                      className={`relative rounded-2xl border transition-all duration-500 overflow-hidden cursor-pointer ${
                        isActive
                          ? 'border-[#C9A84C]/40 bg-gradient-to-b from-[#111120] to-[#0A0A12] shadow-[0_12px_40px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(201,168,76,0.1)]'
                          : 'border-[#C9A84C]/10 bg-[#0C0C14]/50'
                      }`}
                    >
                      {/* Main Header Item */}
                      <div className="flex items-center justify-between p-5">
                        <div className="flex items-center gap-4">
                          <span
                            className={`text-xs font-bold tracking-widest transition-colors duration-300 ${
                              isActive ? 'text-[#C9A84C]' : 'text-[#C9A84C]/45'
                            }`}
                            style={{ fontFamily: "'Cinzel', serif" }}
                          >
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <h3
                            className={`text-sm font-semibold tracking-wider transition-colors duration-300 ${
                              isActive ? 'text-[#F5F0E8]' : 'text-[#F5F0E8]/50'
                            }`}
                            style={{ fontFamily: "'Cinzel', serif" }}
                          >
                            {item.title}
                          </h3>
                        </div>

                        <div className="flex items-center gap-3">
                          <span
                            className={`rounded-full border px-3 py-1 text-[8px] font-semibold uppercase tracking-wider transition-all duration-300 ${
                              isActive
                                ? 'border-[#C9A84C]/40 bg-[#C9A84C]/15 text-[#C9A84C] opacity-100'
                                : 'border-[#C9A84C]/15 bg-transparent text-[#C9A84C]/40 opacity-70'
                            }`}
                            style={{ fontFamily: "'Cinzel', serif" }}
                          >
                            {item.tag}
                          </span>
                          <motion.span
                            animate={{ rotate: isActive ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                            className="text-[#C9A84C]/60 text-[10px]"
                          >
                            ▼
                          </motion.span>
                        </div>
                      </div>

                      {/* Expandable Panel */}
                      <AnimatePresence initial={false}>
                        {isActive && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            className="overflow-hidden"
                          >
                            <div className="px-5 pb-6 border-t border-[#C9A84C]/10 pt-4 flex flex-col gap-4">
                              {/* Amenity Image */}
                              <div className="relative h-48 w-full overflow-hidden rounded-xl border border-[#C9A84C]/15 shadow-inner">
                                <motion.img
                                  initial={{ scale: 1.1 }}
                                  animate={{ scale: 1 }}
                                  transition={{ duration: 0.6 }}
                                  src={item.image}
                                  alt={item.title}
                                  className="h-full w-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#08080E]/80 via-transparent to-transparent pointer-events-none" />
                              </div>

                              {/* Details Info */}
                              <div className="flex flex-col gap-2">
                                <p
                                  className="text-sm leading-relaxed text-[#F5F0E8]/70 font-medium"
                                  style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: '15px' }}
                                >
                                  {item.description}
                                </p>
                                
                                <div className="h-px w-8 bg-gradient-to-r from-[#C9A84C]/50 to-transparent my-1" />

                                <div className="flex items-center gap-2">
                                  <span className="h-1 w-1 rounded-full bg-[#C9A84C]" />
                                  <p
                                    className="text-[9px] tracking-[0.2em] text-[#C9A84C] uppercase font-semibold"
                                    style={{ fontFamily: "'Cinzel', serif" }}
                                  >
                                    {item.detail}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>

              {/* Download Brochure Button */}
              <div className="mt-8 sm:mt-12 flex justify-end">
                <button
                  type="button"
                  onClick={() => setBrochureModalOpen(true)}
                  className="inline-flex items-center gap-3 rounded-full border border-[#C9A84C]/35 bg-[#0A0A10]/90 px-6 py-3 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.25em] text-[#F5F0E8] shadow-[0_8px_30px_rgba(0,0,0,0.6)] backdrop-blur-md transition-all duration-300 hover:border-[#C9A84C] hover:bg-[#C9A84C]/10 hover:shadow-[0_0_25px_rgba(201,168,76,0.2)] group cursor-pointer"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  <FileText className="h-3.5 w-3.5 text-[#C9A84C] transition-transform duration-300 group-hover:scale-110" />
                  <span>Download Brochure</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        <SectionDivider />

        {/* Breathing Space 2 */}
        <BreathingSpace
          image="/skyline-view.jpg"
          title="A New Horizon."
          subtitle="Shaped for modern legacy."
        />

        {/* ══════════════ HOTEL ══════════════ */}
        <section id="hotel" className="relative overflow-hidden bg-[#08080E] py-16 sm:py-28 px-4 sm:px-8 lg:px-16">
          {/* Full-bleed background */}
          <div ref={hotelRef} className="absolute inset-0 overflow-hidden">
            <motion.img
              style={{ y: hotelY }}
              src="/hyatt-view.jpg"
              alt="Hotel experience"
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-[120%] w-full object-cover opacity-15"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#08080E] via-[#08080E]/85 to-[#08080E]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(201,168,76,0.08)_0%,transparent_60%)]" />
          </div>

          <div className="relative mx-auto max-w-7xl">
            <div className="grid gap-8 sm:gap-14 lg:grid-cols-[1.3fr_0.9fr] items-center">
              <RevealSection>
                <span className="section-label">Hotel Experience</span>
                <h2
                  className="mt-4 sm:mt-6 text-3xl font-bold tracking-tight leading-[0.9] sm:text-6xl lg:text-7xl"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  Stay. Relax.<br />
                  <span className="text-gold-shimmer">Celebrate.</span><br />
                  Work. Experience.
                </h2>
                <GoldDivider />
                <p
                  className="mt-4 max-w-xl text-lg leading-relaxed text-[#F5F0E8]/50"
                  style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic' }}
                >
                  A hospitality proposition built for discerning guests, featuring private pool retreats, elegant suites and seamless white-glove service.
                </p>
                <a
                  href="#contact"
                  onClick={(e) => handleNavClick(e, '#contact')}
                  className="btn-luxury-gold mt-8 sm:mt-10 inline-flex items-center gap-3 rounded-full px-6 py-3 sm:px-8 sm:py-4 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.25em] sm:tracking-[0.3em] shadow-[0_0_40px_rgba(201,168,76,0.25)] w-full sm:w-auto justify-center"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  Experience It
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </RevealSection>

              <RevealSection delay={0.2}>
                <div className="space-y-4">
                  {[
                    { word: 'Stay',       desc: 'Luxury suites with premium finishes, comfort and curated service.' },
                    { word: 'Relax',      desc: 'Pool and lounge spaces designed for calm, indulgent downtime.' },
                    { word: 'Celebrate',  desc: 'Grand event spaces for corporate and private moments.' },
                    { word: 'Work',       desc: 'Executive boardrooms, business suites and hospitality workflows.' },
                    { word: 'Experience', desc: 'A thoughtfully crafted hospitality journey from arrival to departure.' },
                  ].map((item, i) => (
                    <motion.div
                      key={item.word}
                      initial={{ opacity: 0, x: 30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.08 }}
                      whileHover={{ x: 6 }}
                      className="glass-dark rounded-xl p-5 border border-[#C9A84C]/10 transition-colors duration-300 hover:border-[#C9A84C]/30"
                    >
                      <p
                        className="text-[9px] font-semibold uppercase tracking-[0.4em] text-[#C9A84C] mb-2"
                        style={{ fontFamily: "'Cinzel', serif" }}
                      >
                        {item.word}
                      </p>
                      <p className="text-sm leading-relaxed text-[#F5F0E8]/50">{item.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </RevealSection>
            </div>
          </div>
        </section>

        <SectionDivider />

        {/* ══════════════ POOL FEATURE ══════════════ */}
        <section className="relative overflow-hidden bg-[#0D0D18] py-16 sm:py-28 px-4 sm:px-8 lg:px-16">
          <div className="mx-auto max-w-7xl grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-center">
            {/* Image */}
            <div ref={poolRef} className="relative rounded-2xl overflow-hidden group glow-gold h-[300px] sm:h-[500px]">
              <RevealImage
                src="/pool-hero.jpg"
                alt="Pool experience"
                parallaxY={poolY}
                heightClass="h-full"
              />
              <div className="absolute inset-0 img-overlay-luxury z-10" />
              {/* Floating badge */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-8 left-8 rounded-2xl border border-[#C9A84C]/25 bg-[#08080E]/70 px-5 py-3 backdrop-blur-xl z-20"
              >
                <p
                  className="text-[8px] font-semibold uppercase tracking-[0.3em] text-[#C9A84C]"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  Resort Living
                </p>
                <p className="mt-1 text-base font-semibold text-[#F5F0E8]" style={{ fontFamily: "'Cinzel', serif" }}>Infinity Pool</p>
              </motion.div>
            </div>

            <RevealSection delay={0.15}>
              <div className="space-y-6">
                <span className="section-label">Pool Experience</span>
                <CinematicTitle
                  text="A resort-style pool with floating luxury."
                  align="left"
                  className="mt-6 sm:mt-8 text-3xl font-bold tracking-tight leading-[0.9] text-[#F5F0E8] sm:text-6xl lg:text-7xl"
                  style={{ fontFamily: "'Cinzel', serif" }}
                />
                <GoldDivider />
                <p
                  className="text-lg leading-relaxed text-[#F5F0E8]/50"
                  style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic' }}
                >
                  A shimmering pool deck and landscape composition that feels like a luxury resort within the city. Cabanas, water features and curated poolside hospitality.
                </p>

                {['Private Cabanas', 'Cinematic Water Features', 'Poolside Dining', 'Resort Vibe'].map((feat, i) => (
                  <motion.div
                    key={feat}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.07 }}
                    className="flex items-center gap-4"
                  >
                    <div className="flex-shrink-0 h-5 w-5 flex items-center justify-center rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/30">
                      <div className="h-1.5 w-1.5 rounded-full bg-[#C9A84C]" />
                    </div>
                    <span
                      className="text-xs font-semibold uppercase tracking-[0.25em] text-[#F5F0E8]/60"
                      style={{ fontFamily: "'Cinzel', serif" }}
                    >
                      {feat}
                    </span>
                  </motion.div>
                ))}

                <a
                  href="#amenities"
                  onClick={(e) => handleNavClick(e, '#amenities')}
                  className="mt-4 inline-flex items-center gap-3 rounded-full border border-[#C9A84C]/25 bg-[#C9A84C]/5 px-6 py-2.5.5 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#C9A84C] transition-all duration-300 hover:border-[#C9A84C]/60 hover:bg-[#C9A84C]/10"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  View All Amenities
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </RevealSection>
          </div>
        </section>

        <SectionDivider />

        {/* ══════════════ GALLERY ══════════════ */}
        <section id="gallery" className="relative overflow-hidden bg-[#08080E] py-16 sm:py-28 px-4 sm:px-8 lg:px-16">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-2/3 bg-gradient-to-r from-transparent via-[#C9A84C]/30 to-transparent" />

          <div className="mx-auto max-w-7xl">
            <RevealSection className="text-center mb-12 sm:mb-24">
              <span className="section-label">Gallery</span>
              <CinematicTitle
                text="A premium visual story in every frame."
                align="center"
                className="mt-6 sm:mt-8 text-3xl sm:text-5xl font-bold tracking-tight leading-[0.92] text-[#F5F0E8] sm:text-6xl lg:text-7xl"
                style={{ fontFamily: "'Cinzel', serif" }}
              />
              <GoldDivider />
            </RevealSection>

            {/* Category Filters */}
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-8 sm:mb-12">
              {['All', 'Exterior', 'Interior', 'Amenities'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`relative px-4 py-2 sm:px-6 sm:py-2.5 rounded-full text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.2em] sm:tracking-[0.25em] transition-all duration-300 ${
                    activeFilter === cat
                      ? 'text-[#08080E] bg-[#C9A84C] shadow-[0_0_20px_rgba(201,168,76,0.3)] border border-[#C9A84C]'
                      : 'text-[#F5F0E8]/60 bg-[#C9A84C]/5 border border-[#C9A84C]/15 hover:border-[#C9A84C]/45 hover:text-[#C9A84C]'
                  }`}
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Masonry-style grid with animate presence layouts */}
            <motion.div layout className="gallery-grid">
              <AnimatePresence mode="popLayout">
                {galleryItems
                  .filter((item) => activeFilter === 'All' || item.category === activeFilter)
                  .map((item, i) => (
                    <motion.button
                      layout
                      key={item.src}
                      onClick={() => setSelectedImage(item.src)}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.5 }}
                      whileHover={{ scale: 1.02 }}
                      className={`group relative overflow-hidden rounded-xl border border-[#C9A84C]/10 focus:outline-none transition-colors duration-500 hover:border-[#C9A84C]/40 hover:shadow-[0_0_40px_rgba(201,168,76,0.2)] ${item.cls}`}
                    >
                      <RevealImage
                        src={item.src}
                        alt={item.label}
                        heightClass="h-full"
                        className="absolute inset-0"
                      />
                      <div className="absolute inset-0 img-overlay-luxury opacity-60 group-hover:opacity-85 transition-opacity duration-500 z-10" />
                      {/* Label & Description */}
                      <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 translate-y-0 sm:translate-y-2 opacity-100 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100 transition-all duration-400 z-20">
                        <p
                          className="text-[9px] font-semibold uppercase tracking-[0.35em] text-[#C9A84C] mb-1"
                          style={{ fontFamily: "'Cinzel', serif" }}
                        >
                          View Full
                        </p>
                        <p className="text-sm font-semibold text-[#F5F0E8] mb-1" style={{ fontFamily: "'Cinzel', serif" }}>
                          {item.label}
                        </p>
                        <p className="text-[10px] text-[#F5F0E8]/50 line-clamp-2" style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic' }}>
                          {item.desc}
                        </p>
                      </div>
                      {/* Corner icon */}
                      <div className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full border border-[#C9A84C]/30 bg-[#08080E]/60 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-xl z-20">
                        <span className="text-[#C9A84C] text-xs">↗</span>
                      </div>
                    </motion.button>
                  ))}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Lightbox */}
          <AnimatePresence>
            {selectedImage && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedImage(null)}
                className="fixed inset-0 z-50 flex items-center justify-center bg-[#08080E]/95 backdrop-blur-2xl p-6"
              >
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/10 text-[#C9A84C] transition hover:bg-[#C9A84C]/20"
                >
                  <X className="h-4 w-4" />
                </button>
                <motion.img
                  src={selectedImage}
                  alt="Gallery enlarged"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                  onClick={(e) => e.stopPropagation()}
                  className="max-h-[88vh] max-w-full rounded-2xl object-cover shadow-[0_60px_160px_rgba(0,0,0,0.9)] border border-[#C9A84C]/15"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        <SectionDivider />

        {/* ══════════════ TIMELINE ══════════════ */}
        <LuxuryTimeline />

        <SectionDivider />

        {/* ══════════════ WHY CHOOSE US ══════════════ */}
        <section className="relative overflow-hidden bg-[#0D0D18] py-16 sm:py-28 px-4 sm:px-8 lg:px-16">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(201,168,76,0.05)_0%,transparent_60%)] pointer-events-none" />

          <div className="mx-auto max-w-7xl">
            <RevealSection className="text-center mb-12 sm:mb-24">
              <span className="section-label">Why Choose Us</span>
              <CinematicTitle
                text="A destination of unmatched luxury & connectivity."
                align="center"
                className="mt-6 sm:mt-8 text-3xl sm:text-5xl font-bold tracking-tight leading-[0.92] text-[#F5F0E8] sm:text-6xl lg:text-7xl"
                style={{ fontFamily: "'Cinzel', serif" }}
              />
              <GoldDivider />
            </RevealSection>

            <div className="grid gap-3 sm:gap-5 md:grid-cols-2 xl:grid-cols-4">
              {whyChooseUs.map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.07 }}
                  className="luxury-card p-5 sm:p-7 group"
                >
                  <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-full border border-[#C9A84C]/25 bg-[#C9A84C]/8 text-[#C9A84C] text-xs transition-all duration-300 group-hover:border-[#C9A84C]/60 group-hover:bg-[#C9A84C]/15">
                    ✦
                  </div>
                  <h3
                    className="mb-3 text-sm font-semibold tracking-wide text-[#F5F0E8]/90"
                    style={{ fontFamily: "'Cinzel', serif" }}
                  >
                    {item.title}
                  </h3>
                  <div className="mb-3 h-px w-8 bg-gradient-to-r from-[#C9A84C] to-transparent" />
                  <p className="text-xs leading-relaxed text-[#F5F0E8]/40">{item.detail}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════ CTA BANNER ══════════════ */}
        <section ref={ctaRef} className="relative overflow-hidden bg-[#08080E] py-16 sm:py-28 px-4 sm:px-8 lg:px-16">
          <div className="absolute inset-0 overflow-hidden">
            <motion.img
              style={{ y: ctaY }}
              src="/skyline-view.jpg"
              alt="Skyline"
              className="absolute inset-0 h-[120%] w-full object-cover opacity-10"
            />
            <div className="absolute inset-0 bg-[#08080E]/85" />
          </div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,168,76,0.1)_0%,transparent_65%)] pointer-events-none" />

          <RevealSection className="relative mx-auto max-w-5xl text-center">
            <Star className="mx-auto mb-6 h-6 w-6 text-[#C9A84C] fill-current" />
            <span className="section-label">Ready to Experience Luxury?</span>
            <h2
              className="mt-4 sm:mt-6 text-2xl sm:text-4xl font-bold tracking-tight leading-[1.1] text-[#F5F0E8] sm:text-5xl lg:text-6xl"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              Book a Site Visit and witness the next level of{' '}
              <span className="text-gold-shimmer">premium delivery.</span>
            </h2>
            <GoldDivider />
            <p
              className="mx-auto mt-3 sm:mt-4 max-w-2xl text-sm sm:text-lg leading-relaxed text-[#F5F0E8]/45"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic' }}
            >
              This is not a standard property website. It is a world-class luxury destination built for premium hospitality and retail experiences.
            </p>
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, '#contact')}
              className="btn-luxury-gold mt-8 sm:mt-10 inline-flex items-center gap-3 rounded-full px-8 py-3.5 sm:px-12 sm:py-4 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.25em] sm:tracking-[0.35em] shadow-[0_0_60px_rgba(201,168,76,0.3)] pulse-ring w-full sm:w-auto justify-center"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              Book a Site Visit
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </RevealSection>
        </section>

        {/* ══════════════ CONTACT ══════════════ */}
        <section id="contact" className="relative overflow-hidden bg-[#0D0D18] py-16 sm:py-28 px-4 sm:px-8 lg:px-16">
          <div className="absolute top-0 left-0 h-96 w-96 rounded-full bg-[#C9A84C]/4 blur-[140px] pointer-events-none" />

          <div className="mx-auto max-w-7xl grid gap-10 sm:gap-14 lg:grid-cols-[1fr_1.1fr] items-start">
            {/* Info side */}
            <RevealSection>
              <span className="section-label">Contact</span>
              <CinematicTitle
                text="Connect with our concierge & booking team."
                align="left"
                className="mt-4 sm:mt-6 text-2xl sm:text-4xl font-bold tracking-tight text-[#F5F0E8] sm:text-5xl leading-[1.1]"
                style={{ fontFamily: "'Cinzel', serif" }}
              />
              <GoldDivider />
              <p
                className="mt-3 sm:mt-4 max-w-xl text-sm sm:text-lg leading-relaxed text-[#F5F0E8]/50"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic' }}
              >
                Share your requirements and our team will contact you with premium project details, layouts and site visit availability.
              </p>

              <div className="mt-6 sm:mt-10 space-y-3 sm:space-y-4">
                {[
                  { icon: Phone, label: 'Telephone', values: ['+91 95123 00392', '+91 95123 00397'] },
                  { icon: Mail,  label: 'Email',     values: ['contact@atmmall.in'] },
                  { icon: MapPin,label: 'Address',   values: ['Chandkheda Commonwealth Zone, Ahmedabad'] },
                ].map(({ icon: Icon, label, values }) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="glass-dark rounded-xl p-4 sm:p-5 border border-[#C9A84C]/10 hover:border-[#C9A84C]/25 transition-colors duration-300"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/25">
                        <Icon className="h-3.5 w-3.5 text-[#C9A84C]" />
                      </div>
                      <div>
                        <p
                          className="text-[8px] font-semibold uppercase tracking-[0.35em] text-[#C9A84C]/70 mb-1.5"
                          style={{ fontFamily: "'Cinzel', serif" }}
                        >
                          {label}
                        </p>
                        {values.map((v) => (
                          <p key={v} className="text-sm font-medium text-[#F5F0E8]/80">{v}</p>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </RevealSection>

            {/* Form */}
            <RevealSection delay={0.15}>
              <div className="glass-dark rounded-2xl p-5 sm:p-8 border border-[#C9A84C]/15 glow-gold">
                {formSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-16 text-center space-y-6"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                      className="flex h-20 w-20 items-center justify-center rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/10 pulse-ring"
                    >
                      <span className="text-2xl text-[#C9A84C]">✦</span>
                    </motion.div>
                    <h3
                      className="text-2xl font-bold text-[#F5F0E8]"
                      style={{ fontFamily: "'Cinzel', serif" }}
                    >
                      Inquiry Received
                    </h3>
                    <p
                      className="max-w-sm text-base leading-relaxed text-[#F5F0E8]/50"
                      style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic' }}
                    >
                      Thank you for your interest. Our concierge team will reach out with project details, availability and site visit options.
                    </p>
                    <button
                      onClick={() => setFormSubmitted(false)}
                      className="btn-luxury-subtle rounded-full border border-[#C9A84C]/20 px-8 py-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#F5F0E8]/60"
                      style={{ fontFamily: "'Cinzel', serif" }}
                    >
                      Submit Another Inquiry
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="mb-5 sm:mb-7">
                      <h3
                        className="text-xl font-bold text-[#F5F0E8]"
                        style={{ fontFamily: "'Cinzel', serif" }}
                      >
                        Send an Inquiry
                      </h3>
                      <div className="mt-2 h-px w-16 bg-gradient-to-r from-[#C9A84C] to-transparent" />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="block">
                        <span
                          className="mb-2 block text-[9px] font-semibold uppercase tracking-[0.3em] text-[#C9A84C]/70"
                          style={{ fontFamily: "'Cinzel', serif" }}
                        >
                          Full Name
                        </span>
                        <input
                          value={formValues.fullName}
                          onChange={(e) => setFormValues({ ...formValues, fullName: e.target.value })}
                          required
                          className="luxury-input"
                          placeholder="Raj Patel"
                        />
                      </label>
                      <label className="block">
                        <span
                          className="mb-2 block text-[9px] font-semibold uppercase tracking-[0.3em] text-[#C9A84C]/70"
                          style={{ fontFamily: "'Cinzel', serif" }}
                        >
                          Phone Number
                        </span>
                        <input
                          value={formValues.phone}
                          onChange={(e) => setFormValues({ ...formValues, phone: e.target.value })}
                          required
                          type="tel"
                          className="luxury-input"
                          placeholder="+91 95123 00392"
                        />
                      </label>
                    </div>
                    <label className="block">
                      <span
                        className="mb-2 block text-[9px] font-semibold uppercase tracking-[0.3em] text-[#C9A84C]/70"
                        style={{ fontFamily: "'Cinzel', serif" }}
                      >
                        Email Address
                      </span>
                      <input
                        value={formValues.email}
                        onChange={(e) => setFormValues({ ...formValues, email: e.target.value })}
                        required
                        type="email"
                        className="luxury-input"
                        placeholder="mail@atmmall.in"
                      />
                    </label>
                    <label className="block">
                      <span
                        className="mb-2 block text-[9px] font-semibold uppercase tracking-[0.3em] text-[#C9A84C]/70"
                        style={{ fontFamily: "'Cinzel', serif" }}
                      >
                        Message
                      </span>
                      <textarea
                        value={formValues.message}
                        onChange={(e) => setFormValues({ ...formValues, message: e.target.value })}
                        rows={4}
                        required
                        className="luxury-input resize-none"
                        placeholder="Tell us about your luxury retail or hotel requirements."
                      />
                    </label>
                    <button
                      type="submit"
                      className="btn-luxury-gold w-full rounded-full px-6 py-3.5 sm:py-4 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.25em] sm:tracking-[0.3em] shadow-[0_0_40px_rgba(201,168,76,0.2)] justify-center"
                      style={{ fontFamily: "'Cinzel', serif" }}
                    >
                      Submit Inquiry
                    </button>
                  </form>
                )}
              </div>
            </RevealSection>
          </div>
        </section>
      </main>

      {/* ══════════════ FOOTER ══════════════ */}
      <footer className="relative overflow-hidden bg-[#06060C]">

        {/* Ambient glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[70vw] h-[40vh]"
            style={{ background: 'radial-gradient(ellipse at 50% 100%, rgba(201,168,76,0.07) 0%, transparent 70%)' }} />
          <div className="absolute top-0 left-0 w-[400px] h-[300px]"
            style={{ background: 'radial-gradient(ellipse at 0% 0%, rgba(201,168,76,0.04) 0%, transparent 70%)' }} />
        </div>

        {/* Top gold sweep divider */}
        <SectionDivider />

        {/* Hero statement block */}
        <div className="relative mx-auto max-w-7xl px-4 sm:px-12 lg:px-16 pt-16 sm:pt-24 pb-12 sm:pb-20">

          {/* Large logo + wordmark */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mb-10 sm:mb-16"
          >
            <img
              src="/logo.jpg"
              alt="ATM Mall"
              className="h-20 w-20 rounded-2xl object-cover border border-[#C9A84C]/30 shadow-[0_0_40px_rgba(201,168,76,0.18)]"
            />
            <div className="flex flex-col leading-none gap-2">
              <span className="text-3xl font-bold uppercase tracking-[0.35em] text-[#F5F0E8]" style={{ fontFamily: "'Cinzel', serif" }}>
                ATM MALL
              </span>
              <span className="text-[10px] tracking-[0.35em] text-[#C9A84C]/70 uppercase" style={{ fontFamily: "'Cinzel', serif" }}>
                Luxury Destination · Ahmedabad
              </span>
            </div>
          </motion.div>

          {/* Huge cinematic heading */}
          <motion.h2
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-7xl lg:text-[7rem] font-bold tracking-tight leading-[0.88] text-[#F5F0E8]/90 mb-6 sm:mb-8"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            Luxury<br />
            <span className="text-gold-shimmer">Destination.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.25 }}
            className="max-w-lg text-sm sm:text-lg leading-relaxed text-[#F5F0E8]/35 mb-10 sm:mb-16"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic' }}
          >
            A world-class mixed-use address blending retail, hospitality, gardens
            and resort lifestyle at Ahmedabad's most distinguished location.
          </motion.p>

          {/* Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mb-12 sm:mb-24"
          >
            <p className="text-[9px] uppercase tracking-[0.4em] text-[#C9A84C] mb-4" style={{ fontFamily: "'Cinzel', serif" }}>
              Stay Informed
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row gap-3 max-w-md">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 bg-[#F5F0E8]/5 border border-[#C9A84C]/15 rounded-full px-6 py-3.5 text-sm text-[#F5F0E8]/70 placeholder-[#F5F0E8]/20 focus:outline-none focus:border-[#C9A84C]/50 transition-colors duration-300"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              />
              <button
                type="submit"
                className="btn-luxury-gold rounded-full px-6 py-3 sm:px-8 sm:py-3.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] sm:tracking-[0.25em] flex-shrink-0 w-full sm:w-auto justify-center"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                Subscribe
              </button>
            </form>
          </motion.div>

          {/* Elegant mid divider */}
          <div className="gold-line mb-10 sm:mb-16" />

          {/* 4-col footer grid */}
          <div className="grid gap-10 sm:gap-14 sm:grid-cols-2 xl:grid-cols-4">

            {/* Navigate */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.05 }}
            >
              <h3 className="text-[9px] font-semibold uppercase tracking-[0.45em] text-[#C9A84C] mb-7" style={{ fontFamily: "'Cinzel', serif" }}>
                Navigate
              </h3>
              <ul className="space-y-3.5">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link.href)}
                      className="text-sm text-[#F5F0E8]/30 transition-all duration-300 hover:text-[#C9A84C] flex items-center gap-3 group"
                    >
                      <span className="h-px w-4 bg-[#C9A84C]/20 transition-all duration-300 group-hover:w-7 group-hover:bg-[#C9A84C]" />
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Contact */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.12 }}
            >
              <h3 className="text-[9px] font-semibold uppercase tracking-[0.45em] text-[#C9A84C] mb-7" style={{ fontFamily: "'Cinzel', serif" }}>
                Contact
              </h3>
              <ul className="space-y-5">
                <li>
                  <p className="text-[9px] uppercase tracking-[0.25em] text-[#C9A84C]/40 mb-1" style={{ fontFamily: "'Cinzel', serif" }}>Phone</p>
                  <a href="tel:+919512300392" className="text-sm text-[#F5F0E8]/35 hover:text-[#C9A84C] transition-colors duration-300">+91 95123 00392</a>
                </li>
                <li>
                  <p className="text-[9px] uppercase tracking-[0.25em] text-[#C9A84C]/40 mb-1" style={{ fontFamily: "'Cinzel', serif" }}>Alternate</p>
                  <a href="tel:+919512300397" className="text-sm text-[#F5F0E8]/35 hover:text-[#C9A84C] transition-colors duration-300">+91 95123 00397</a>
                </li>
                <li>
                  <p className="text-[9px] uppercase tracking-[0.25em] text-[#C9A84C]/40 mb-1" style={{ fontFamily: "'Cinzel', serif" }}>Email</p>
                  <a href="mailto:contact@atmmall.in" className="text-sm text-[#F5F0E8]/35 hover:text-[#C9A84C] transition-colors duration-300">contact@atmmall.in</a>
                </li>
              </ul>
            </motion.div>

            {/* Location */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.19 }}
            >
              <h3 className="text-[9px] font-semibold uppercase tracking-[0.45em] text-[#C9A84C] mb-7" style={{ fontFamily: "'Cinzel', serif" }}>
                Location
              </h3>
              <p className="text-sm leading-relaxed text-[#F5F0E8]/30 mb-6">
                Chandkheda Commonwealth Zone,<br />
                near Sardar Patel Ring Road,<br />
                Ahmedabad, Gujarat — India.
              </p>
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.3em] text-[#C9A84C] hover:text-[#F0CC6E] transition-colors duration-300 group"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                <span className="h-px w-5 bg-[#C9A84C] transition-all duration-300 group-hover:w-8" />
                View on Map
              </a>
            </motion.div>

            {/* Social */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.26 }}
            >
              <h3 className="text-[9px] font-semibold uppercase tracking-[0.45em] text-[#C9A84C] mb-7" style={{ fontFamily: "'Cinzel', serif" }}>
                Follow Us
              </h3>
              <div className="flex flex-col gap-5">
                {[
                  { label: 'Instagram', handle: '@atm.mall',         href: '#' },
                  { label: 'Facebook',  handle: 'ATM Mall Official', href: '#' },
                  { label: 'YouTube',   handle: 'ATM Mall Channel',  href: '#' },
                  { label: 'LinkedIn',  handle: 'ATM ILYF LLP',      href: '#' },
                ].map((s) => (
                  <a key={s.label} href={s.href} className="flex items-center gap-3 group">
                    <span
                      className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-[#C9A84C]/20 bg-[#C9A84C]/5 text-[#C9A84C]/50 text-[11px] font-bold transition-all duration-300 group-hover:border-[#C9A84C]/60 group-hover:bg-[#C9A84C]/15 group-hover:text-[#C9A84C] group-hover:shadow-[0_0_16px_rgba(201,168,76,0.2)]"
                      style={{ fontFamily: "'Cinzel', serif" }}
                    >
                      {s.label[0]}
                    </span>
                    <div className="flex flex-col leading-none gap-1">
                      <span className="text-[9px] uppercase tracking-[0.25em] text-[#C9A84C]/40 group-hover:text-[#C9A84C]/75 transition-colors duration-300" style={{ fontFamily: "'Cinzel', serif" }}>
                        {s.label}
                      </span>
                      <span className="text-xs text-[#F5F0E8]/25 group-hover:text-[#F5F0E8]/55 transition-colors duration-300">
                        {s.handle}
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="relative border-t border-[#C9A84C]/8 px-4 sm:px-12 lg:px-16 py-6 sm:py-8">
          <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-center sm:text-left">
            <p className="text-[10px] text-[#F5F0E8]/18 tracking-widest uppercase" style={{ fontFamily: "'Cinzel', serif" }}>
              © 2026 ATM ILYF LLP. All rights reserved.
            </p>
            <div className="flex items-center gap-3">
              <div className="ornament-diamond scale-50 opacity-25" />
              <span className="text-[9px] text-[#C9A84C]/35 tracking-[0.35em] uppercase" style={{ fontFamily: "'Cinzel', serif" }}>
                Ahmedabad · Gujarat · India
              </span>
              <div className="ornament-diamond scale-50 opacity-25" />
            </div>
            <p className="text-[10px] text-[#F5F0E8]/15 tracking-widest uppercase" style={{ fontFamily: "'Cinzel', serif" }}>
              Redefining Luxury Living
            </p>
          </div>
        </div>
      </footer>

      {/* Persistent Floating Brochure CTA */}
      <FloatingBrochureCTA onOpen={() => setBrochureModalOpen(true)} />

      {/* Brochure Request Modal */}
      <BrochureModal isOpen={brochureModalOpen} onClose={() => setBrochureModalOpen(false)} />
      </motion.div>
    </div>
  );
}
