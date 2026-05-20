'use client';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import styles from './TorontoMedia.module.css';

const EASE = [0.16, 1, 0.3, 1];
const LIME = '#C8F135';
const DIM  = 'rgba(255,255,255,0.38)';
const RULE = 'rgba(255,255,255,0.08)';

/* ── fade-up helper ── */
function FadeUp({ children, delay = 0, className = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-6% 0px' });
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/* ── Tag pill ── */
function Tag({ label }) {
  return <span className={styles.tag}>{label}</span>;
}

/* ── Code eyebrow ── */
function CodeEyebrow({ children }) {
  return <p className={styles.codeEyebrow}><span className={styles.codePunct}>//</span> {children}</p>;
}

/* ── Section number ── */
function SectionNum({ n }) {
  return <span className={styles.sectionNum}>{n}</span>;
}

/* ── Marquee ── */
const MARQUEE = [
  'Web Design', '·', 'SEO Optimization', '·', 'AI-Powered Traffic', '·', 'UX Research', '·',
  'Brand Identity', '·', 'Lead Generation', '·', 'React / Next.js', '·', 'Toronto & GTA', '·',
  'Small Business', '·', 'Retail Websites', '·', 'Tourism Digital', '·', 'Conversion Rate Optimization', '·',
];
function Marquee() {
  const items = [...MARQUEE, ...MARQUEE];
  return (
    <div className={styles.marqueeWrap}>
      <motion.div className={styles.marqueeTrack}
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 28, ease: 'linear', repeat: Infinity }}
      >
        {items.map((t, i) => (
          <span key={i} className={t === '·' ? styles.marqueeDot : styles.marqueeItem}>{t}</span>
        ))}
      </motion.div>
    </div>
  );
}

/* ── Data ── */
const services = [
  {
    num: '01',
    title: 'AI-Powered Web Design & Development',
    desc: 'Custom websites engineered for speed, conversion, and search visibility. Every build is paired with our AI content engine — continuously optimising meta data, schema markup, and on-page SEO as search algorithms evolve.',
    tags: ['React', 'Next.js', 'SEO', 'AI Content', 'CRO'],
  },
  {
    num: '02',
    title: 'UX Research & Experience Design',
    desc: 'We run focus groups, pain-point interviews, ideation workshops, and storyboarding sessions before a single pixel is drawn. The result is a digital product people actually use.',
    tags: ['Focus Groups', 'User Interviews', 'Storyboarding', 'Wireframing', 'Usability Testing'],
  },
  {
    num: '03',
    title: 'SEO & AI Traffic Generation',
    desc: 'Proprietary AI models analyse search intent, cluster keywords, and generate topical authority content that compounds over time. Clients see measurable organic growth within 90 days.',
    tags: ['Semantic SEO', 'AI Content', 'Schema Markup', 'Link Strategy', 'Analytics'],
  },
  {
    num: '04',
    title: 'Brand Identity & Creative Direction',
    desc: 'Logo systems, type hierarchies, colour strategy, and brand guidelines — built to flex across digital, print, and environmental applications for businesses at every scale.',
    tags: ['Identity', 'Typography', 'Colour Systems', 'Figma', 'Brand Guidelines'],
  },
  {
    num: '05',
    title: 'E-Commerce & Retail Digital',
    desc: 'Shopify and custom storefronts optimised for the GTA\'s retail and tourism markets. Mobile-first, fast-loading, and connected to the Google ecosystem from day one.',
    tags: ['Shopify', 'WooCommerce', 'Google Shopping', 'Local SEO', 'Retail Analytics'],
  },
  {
    num: '06',
    title: 'Local SEO & Google Business Optimisation',
    desc: 'Dominate "near me" searches in your neighbourhood, borough, and across the GTA. We optimise your full local digital footprint — Google Business Profile, citations, reviews, and geo-targeted content.',
    tags: ['Google Business', 'Local Citations', 'Review Strategy', 'Geo Content', 'Maps SEO'],
  },
];

const stats = [
  { value: '120+', label: 'Websites Launched' },
  { value: '94%', label: 'Client Retention Rate' },
  { value: '3.2×', label: 'Avg. Traffic Increase' },
  { value: '11', label: 'Industries Served' },
];

const caseStudies = [
  {
    client: 'Ontario Clean Water Agency',
    type: 'Government / Public Sector',
    year: '2023',
    tags: ['Web Redesign', 'Information Architecture', 'Accessibility', 'WCAG 2.1 AA'],
    headline: "Rebuilding digital infrastructure for one of Ontario’s most critical utilities.",
    body: `The Ontario Clean Water Agency (OCWA) required a full redesign of its public-facing digital presence to serve municipalities, Indigenous communities, and the general public across Ontario. Our engagement began with a full content audit across more than 400 pages, followed by a collaborative information architecture workshop with OCWA's communications, operations, and executive teams.

We restructured the site taxonomy around user intent — separating service offerings, contract management, emergency response, and public education into intuitive pathways. Accessibility was a non-negotiable: the final build met WCAG 2.1 AA standards throughout, including screen reader compatibility, keyboard navigation, sufficient colour contrast, and alt-text protocols for all imagery.

The redesign reduced the average time-to-information from 4.2 clicks to 1.8, and mobile sessions increased by 67% in the first quarter post-launch.`,
    outcomes: ['WCAG 2.1 AA compliant', '67% mobile traffic increase', '4.2 → 1.8 avg. click depth', '400+ pages restructured'],
  },
  {
    client: 'Leslie L. Dan Faculty of Pharmacy',
    type: 'Post-Secondary / UX Research',
    year: '2022',
    tags: ['UX Research', 'Focus Groups', 'Ideation', 'Storyboarding', 'Pain Points'],
    headline: "A research-first digital redesign for one of Canada's top pharmacy programs.",
    body: `This engagement was led entirely by UX research methodology before any design decisions were made. We began with structured focus groups across three user cohorts — undergraduate pharmacy students, graduate researchers, and administrative staff — uncovering fundamentally different mental models of the faculty's digital ecosystem.

Pain points surfaced quickly: students couldn't locate placement scheduling, researchers faced broken links in the grants portal, and staff described the internal CMS as "a filing cabinet that fights back." We ran ideation workshops with mixed cohorts to generate solutions collaboratively, then produced storyboards for each primary user journey to validate the concept with stakeholders before committing to wireframes.

Journey maps revealed 12 distinct pain points across 5 user flows. The redesign consolidated three separate portals into a single authenticated hub, reduced the student support ticket volume by 41%, and earned a 4.7/5 satisfaction score in post-launch usability testing.`,
    outcomes: ['12 pain points identified & resolved', '3 portals → 1 unified hub', '41% reduction in support tickets', '4.7/5 usability score'],
  },
  {
    client: 'Multi-Location Medical Clinics',
    type: 'Healthcare / Medical Practice',
    year: '2022–2024',
    tags: ['Patient Portal', 'Online Booking', 'PHIPA', 'Accessibility', 'Local SEO'],
    headline: 'Bringing modern digital infrastructure to GTA medical practices.',
    body: `Across a series of family medicine and specialist clinic engagements in Toronto, Scarborough, and Mississauga, we developed a repeatable framework for medical practice digital presence that addresses the unique intersection of regulatory compliance, patient accessibility, and local search visibility.

Each project began with a patient journey audit — mapping the digital experience from first Google search to confirmed appointment. We integrated PHIPA-compliant online booking systems, built patient information portals with bilingual support, and redesigned contact flows with accessible design patterns suited for elderly and mobility-impaired users.

Local SEO strategy was central to each deployment: structured data for medical organisations, Google Business Profile optimisation with accurate service areas, and neighbourhood-specific landing pages driving "walk-in clinic near me" and "family doctor [neighbourhood]" traffic. Practices saw an average 55% increase in new patient inquiries from organic search within six months.`,
    outcomes: ['PHIPA-compliant booking systems', '55% avg. organic inquiry growth', 'Bilingual patient portals', 'Top 3 local rankings for target keywords'],
  },
];

const aiFeatures = [
  {
    icon: '⬡',
    title: 'Continuous Learning SEO',
    desc: 'Our AI models ingest live Google Search Console data, keyword volatility signals, and competitor movements — automatically adjusting your content strategy as algorithms shift.',
  },
  {
    icon: '◈',
    title: 'Semantic Content Generation',
    desc: 'We build topical authority clusters using large language models trained on your industry. Search engines recognise your site as an authoritative source, compounding ranking gains over time.',
  },
  {
    icon: '◉',
    title: 'Predictive Lead Scoring',
    desc: 'Machine learning models analyse your incoming traffic to identify high-intent visitors — triggering personalised CTAs and chat prompts at the moments most likely to convert.',
  },
  {
    icon: '◫',
    title: 'Automated Schema & Metadata',
    desc: 'Every page is dynamically enriched with structured data. Product pages, service listings, FAQs, and location pages are all marked up to maximise SERP real estate.',
  },
  {
    icon: '⬟',
    title: 'AI-Powered A/B Testing',
    desc: 'Continuous multivariate testing across headlines, CTAs, and page layouts — with statistical significance tracked automatically and winning variants deployed without manual intervention.',
  },
  {
    icon: '◧',
    title: 'Competitor Gap Analysis',
    desc: 'Real-time monitoring of competing websites in your vertical. We surface gaps in their content coverage and move you into those positions before they close.',
  },
];

const industries = [
  { label: 'Small Business', icon: '◆' },
  { label: 'Medium Enterprise', icon: '◆' },
  { label: 'Retail & E-Commerce', icon: '◆' },
  { label: 'Tourism & Hospitality', icon: '◆' },
  { label: 'Healthcare', icon: '◆' },
  { label: 'Education', icon: '◆' },
  { label: 'Government & Public Sector', icon: '◆' },
  { label: 'Professional Services', icon: '◆' },
];

const workTiles = [
  { img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80', label: 'Web Strategy', type: 'strategy' },
  { img: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=800&q=80', label: 'UX Research', type: 'ux' },
  { img: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80', label: 'Web Development', type: 'dev' },
  { img: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=800&q=80', label: 'Brand Identity', type: 'brand' },
  { img: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=800&q=80', label: 'SEO & Growth', type: 'seo' },
  { img: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80', label: 'Mobile Design', type: 'dev' },
];

const FILTERS = ['All', 'Strategy', 'UX', 'Dev', 'Brand', 'SEO'];

export default function TorontoMediaIncPage() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [activeCaseStudy, setActiveCaseStudy] = useState(0);

  const filteredWork = activeFilter === 'All'
    ? workTiles
    : workTiles.filter(t => t.type === activeFilter.toLowerCase());

  return (
    <div className={styles.page}>

      {/* ─── SEO head content embedded as structured data ─── */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebDesignCompany',
        name: 'Toronto Media Inc.',
        url: 'https://www.baltar.ca/toronto-media-inc',
        description: 'Toronto web design agency specialising in AI-powered websites, SEO, UX research, and digital marketing for small business, retail, and tourism in the GTA.',
        areaServed: ['Toronto', 'Greater Toronto Area', 'Scarborough', 'Etobicoke', 'North York', 'Mississauga', 'Brampton', 'Vaughan', 'Markham'],
        serviceType: ['Web Design', 'SEO', 'UX Research', 'AI Content Marketing', 'Brand Identity'],
      })}} />

      {/* ─── HERO ─── */}
      <section className={styles.hero}>
        <div className={styles.heroGrid} />
        <div className={styles.heroContent}>
          <motion.div className={styles.heroMeta}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: EASE }}
          >
            <span className={styles.heroCursor}>&gt;</span>
            <span className={styles.heroMetaText}>Toronto Media Inc. — Baltar Technologies</span>
          </motion.div>

          <motion.h1 className={styles.heroTitle}
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.3, ease: EASE }}
          >
            Websites that<br /><em className={styles.heroAccent}>rank.</em> Brands that<br /><em className={styles.heroAccent}>convert.</em>
          </motion.h1>

          <motion.p className={styles.heroSub}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease: EASE }}
          >
            Toronto's AI-powered web design studio for small business, retail, and tourism — building digital infrastructure that generates traffic, captures leads, and grows with your business.
          </motion.p>

          <motion.div className={styles.heroCtas}
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.65, ease: EASE }}
          >
            <a href="mailto:admin@baltar.ca" className={styles.ctaPrimary}>Start a Project</a>
            <a href="#ai-engine" className={styles.ctaGhost}>See the AI Advantage ↓</a>
          </motion.div>

          <motion.div className={styles.heroTags}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.85, ease: EASE }}
          >
            {['Web Design Toronto', 'GTA SEO', 'Small Business Websites', 'AI Traffic Growth', 'UX Research'].map(t => (
              <Tag key={t} label={t} />
            ))}
          </motion.div>
        </div>

        <div className={styles.heroBgText} aria-hidden="true">TMI</div>
      </section>

      {/* ─── MARQUEE ─── */}
      <Marquee />

      {/* ─── STATS ─── */}
      <section className={styles.stats}>
        {stats.map((s, i) => (
          <FadeUp key={s.label} delay={i * 0.08} className={styles.statItem}>
            <span className={styles.statValue}>{s.value}</span>
            <span className={styles.statLabel}>{s.label}</span>
          </FadeUp>
        ))}
      </section>

      {/* ─── 01 SERVICES ─── */}
      <section className={styles.services} id="services">
        <FadeUp>
          <CodeEyebrow>01 — What We Do</CodeEyebrow>
          <h2 className={styles.sectionHeading}>
            Full-stack digital services<br />for businesses in the GTA.
          </h2>
        </FadeUp>

        <div className={styles.serviceGrid}>
          {services.map((s, i) => (
            <FadeUp key={s.title} delay={i * 0.07}>
              <div className={styles.serviceCard}>
                <div className={styles.serviceCardTop}>
                  <span className={styles.serviceNum}>{s.num}</span>
                  <h3 className={styles.serviceCardTitle}>{s.title}</h3>
                </div>
                <p className={styles.serviceCardDesc}>{s.desc}</p>
                <div className={styles.tagRow}>
                  {s.tags.map(t => <Tag key={t} label={t} />)}
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ─── 02 AI ENGINE ─── */}
      <section className={styles.aiSection} id="ai-engine">
        <div className={styles.aiInner}>
          <FadeUp>
            <CodeEyebrow>02 — The AI Advantage</CodeEyebrow>
            <h2 className={styles.sectionHeading}>
              Your website learns.<br />Your traffic compounds.
            </h2>
            <p className={styles.aiIntro}>
              Most web agencies build a site and walk away. We deploy a living digital system driven by machine learning models that continuously optimise your search rankings, content strategy, and conversion paths — generating measurable, compounding growth for your GTA business.
            </p>
          </FadeUp>

          <div className={styles.aiGrid}>
            {aiFeatures.map((f, i) => (
              <FadeUp key={f.title} delay={i * 0.06}>
                <div className={styles.aiCard}>
                  <span className={styles.aiIcon}>{f.icon}</span>
                  <h4 className={styles.aiCardTitle}>{f.title}</h4>
                  <p className={styles.aiCardDesc}>{f.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>

          <FadeUp>
            <div className={styles.aiCallout}>
              <span className={styles.aiCalloutStat}>3.2×</span>
              <div>
                <p className={styles.aiCalloutLabel}>Average organic traffic increase across clients within 6 months of AI-powered SEO deployment.</p>
                <p className={styles.aiCalloutSub}>Measured against baseline 90 days pre-engagement. Results vary by industry and competitive landscape.</p>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ─── 03 CASE STUDIES ─── */}
      <section className={styles.caseSection} id="work">
        <FadeUp>
          <CodeEyebrow>03 — Case Studies</CodeEyebrow>
          <h2 className={styles.sectionHeading}>
            Work that moved the needle.
          </h2>
        </FadeUp>

        {/* Tab selector */}
        <div className={styles.caseTabRow}>
          {caseStudies.map((c, i) => (
            <button
              key={c.client}
              className={`${styles.caseTab} ${activeCaseStudy === i ? styles.caseTabActive : ''}`}
              onClick={() => setActiveCaseStudy(i)}
            >
              <span className={styles.caseTabNum}>0{i + 1}</span>
              <span className={styles.caseTabLabel}>{c.client}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {caseStudies.map((c, i) => activeCaseStudy === i && (
            <motion.div key={c.client} className={styles.casePanel}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.45, ease: EASE }}
            >
              <div className={styles.casePanelLeft}>
                <p className={styles.caseMeta}>{c.type} · {c.year}</p>
                <h3 className={styles.caseHeadline}>{c.headline}</h3>
                <div className={styles.caseTags}>
                  {c.tags.map(t => <Tag key={t} label={t} />)}
                </div>
                <div className={styles.caseBody}>
                  {c.body.split('\n\n').map((para, pi) => (
                    <p key={pi}>{para}</p>
                  ))}
                </div>
              </div>
              <div className={styles.casePanelRight}>
                <p className={styles.caseOutcomesLabel}>Outcomes</p>
                {c.outcomes.map(o => (
                  <div key={o} className={styles.caseOutcome}>
                    <span className={styles.caseOutcomeCheck} style={{ color: LIME }}>✓</span>
                    <span>{o}</span>
                  </div>
                ))}
                <a href="mailto:admin@baltar.ca" className={styles.caseEnquire}>
                  Start a Similar Project →
                </a>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </section>

      {/* ─── 04 PORTFOLIO ─── */}
      <section className={styles.work}>
        <FadeUp>
          <CodeEyebrow>04 — Selected Work</CodeEyebrow>
          <div className={styles.workHeader}>
            <h2 className={styles.sectionHeading}>Recent projects.</h2>
            <div className={styles.filterRow}>
              {FILTERS.map(f => (
                <button key={f}
                  className={`${styles.filterBtn} ${activeFilter === f ? styles.filterBtnActive : ''}`}
                  onClick={() => setActiveFilter(f)}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </FadeUp>

        <div className={styles.workGrid}>
          {filteredWork.map((tile, i) => (
            <motion.div key={`${tile.label}-${i}`} className={styles.workTile}
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{ duration: 0.5, delay: i * 0.07, ease: EASE }}
            >
              <img src={tile.img} alt={tile.label} className={styles.workImg} />
              <div className={styles.workOverlay}>
                <span className={styles.workLabel}>{tile.label}</span>
                <span className={styles.workArrow}>↗</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── 05 INDUSTRIES ─── */}
      <section className={styles.industries}>
        <FadeUp>
          <CodeEyebrow>05 — Who We Serve</CodeEyebrow>
          <h2 className={styles.sectionHeading}>Built for GTA businesses<br />at every scale.</h2>
          <p className={styles.industriesSub}>
            From solo practitioners and neighbourhood retailers to multi-location enterprises and Ontario public sector organisations — our systems scale to your context, your budget, and your growth ambitions.
          </p>
        </FadeUp>
        <div className={styles.industriesGrid}>
          {industries.map((ind, i) => (
            <FadeUp key={ind.label} delay={i * 0.05}>
              <div className={styles.industryItem}>
                <span className={styles.industryDot} style={{ color: LIME }}>◆</span>
                <span>{ind.label}</span>
              </div>
            </FadeUp>
          ))}
        </div>
        <FadeUp>
          <p className={styles.industriesNote}>
            Serving Toronto, North York, Scarborough, Etobicoke, Mississauga, Brampton, Vaughan, Markham, and the broader GTA. <strong>Web design for small business in Toronto</strong> is our bread and butter — we know the local market, the competition, and what it takes to rank.
          </p>
        </FadeUp>
      </section>

      {/* ─── 06 ABOUT ─── */}
      <section className={styles.about} id="about">
        <div className={styles.aboutInner}>
          <FadeUp>
            <CodeEyebrow>06 — About</CodeEyebrow>
            <h2 className={styles.sectionHeading}>Research-led.<br />Technology-driven.<br />Results-obsessed.</h2>
          </FadeUp>
          <div className={styles.aboutBody}>
            <FadeUp delay={0.1}>
              <p>Toronto Media Inc. is the digital and technology division of Baltar Inc., operating at the intersection of user experience research, modern web engineering, and AI-powered growth marketing. We serve small businesses, medium enterprises, retailers, and tourism operators across the GTA who need more than a brochure website — they need a digital growth engine.</p>
              <p>Our process is built on the same research methodology we've applied to clients like the Ontario Clean Water Agency and the University of Toronto. Before we write a line of code, we understand who your users are, what they're searching for, and where your competitors are leaving gaps. That intelligence drives every decision — from information architecture to keyword targeting to conversion design.</p>
              <p>We pair that research foundation with a proprietary AI layer that keeps your site performing. Search algorithms change. Consumer behaviour shifts. Competitors enter your space. Our machine learning models monitor those signals continuously and adjust your content strategy, metadata, and ranking targets without you having to think about it.</p>
              <p>The result is a website that doesn't just look great at launch — it gets better every month.</p>
            </FadeUp>
            <FadeUp delay={0.2}>
              <div className={styles.aboutStack}>
                <p className={styles.aboutStackLabel}><span className={styles.codePunct}>//</span> Our Technology Stack</p>
                <div className={styles.tagRow}>
                  {['React', 'Next.js 15', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Vercel', 'Supabase', 'OpenAI API', 'Google Analytics 4', 'Search Console API', 'Figma', 'Framer Motion'].map(t => <Tag key={t} label={t} />)}
                </div>
                <p className={styles.aboutStackLabel} style={{ marginTop: 32 }}><span className={styles.codePunct}>//</span> Research Methods</p>
                <div className={styles.tagRow}>
                  {['User Interviews', 'Focus Groups', 'Affinity Mapping', 'Journey Mapping', 'Storyboarding', 'Usability Testing', 'Heuristic Evaluation', 'Card Sorting', 'A/B Testing', 'Heatmap Analysis'].map(t => <Tag key={t} label={t} />)}
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ─── CTA STRIP ─── */}
      <div className={styles.ctaStrip}>
        <div>
          <p className={styles.ctaStripEyebrow}>// Ready to grow?</p>
          <p className={styles.ctaAccent}>Let's build something<br />Toronto remembers.</p>
        </div>
        <div className={styles.ctaStripRight}>
          <a href="mailto:admin@baltar.ca" className={styles.ctaButton}>Start a Project</a>
          <p className={styles.ctaNote}>GTA web design · AI SEO · UX Research<br />admin@baltar.ca</p>
        </div>
      </div>

    </div>
  );
}
