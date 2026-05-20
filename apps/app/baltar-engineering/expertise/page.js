'use client';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import BCNav from '../BCNav';

const LIME = '#C8F135';
const EASE = [0.16, 1, 0.3, 1];
const BG = '#0A0A0E';

function FadeUp({ children, delay = 0, style = {} }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-6% 0px' });
  return (
    <motion.div ref={ref} style={style}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

const TECHNICAL_AREAS = [
  {
    area: 'Hydraulic Modelling & Pipeline Analysis',
    depth: 'Deep',
    tools: ['EPANET 2.2', 'Hazen-Williams', 'Darcy-Weisbach', 'Swamee-Jain / Colebrook-White'],
    detail: 'We build and validate EPANET hydraulic models from first principles, back-calculating friction coefficients from field data and cross-validating against manual Hazen-Williams calculations. We model steady-state demand scenarios, pump-system curve interactions, pressure distribution analysis, and water quality (residence time) implications. Our models are documented to a standard where every assumption is explicit and auditable.',
    evidence: 'BALENG-007: EPANET model validation for Kilcummin DN300 rebuttal — back-calculated C = 150.0 for installed PVC pipe, confirmed against two independent pipes (C = 149.8 and 150.2). All calculations published with explicit equations and node/link data.',
  },
  {
    area: 'P&ID Design (ISA-5.1)',
    depth: 'Deep',
    tools: ['ISA-5.1 symbology', 'DXF (AutoCAD R12 ASCII)', 'SVG', 'PDF revision packages'],
    detail: 'We design Piping and Instrumentation Diagrams conforming to ISA-5.1 symbology, from single-sheet concept layouts through multi-sheet, multi-zone issue-for-construction packages. Deliverables include print-ready PDF, named-layer DXF for AutoCAD/BricsCAD/DraftSight, and SVG source for further design work. We handle revision management, title block control, and PSV/pressure system documentation.',
    evidence: 'BALENG-005: 7-sheet P&ID package for multi-zone process facility, delivered through Rev C. Named layer structure (12 layers) maps to AutoCAD Plant 3D standard. PSV placement and vapor overhead routing corrected through revision cycle.',
  },
  {
    area: 'Flow Meter Calibration & AQ Formula Engineering',
    depth: 'Deep',
    tools: ['AQ polynomial analysis', 'Gravimetric test data', 'Trim factor derivation', 'RMSE / CV analysis'],
    detail: 'We analyse flow meter calibration data at the algorithm level — examining the AQ polynomial formula architecture, identifying error signatures from gravimetric test point ratios, and deriving corrected formulas. We can distinguish between per-unit manufacturing spread, product-line systematic defects, and installation effects (T-piece branch fraction, profile distortion). All corrected formulas are delivered as copy-paste-ready single-line expressions with audit trails.',
    evidence: 'BALENG-003: 4-unit FE-series fleet recovered from errors of 2%–292% to sub-1% RMSE using scalar trim methodology. Product-line defect in 300FE series identified (probable missing /4 in area term). CV of ratio < 1% per unit confirmed scalar trim as complete fix — no curve refit required.',
  },
  {
    area: 'Engineering Standards Interpretation',
    depth: 'Deep',
    tools: ['EN 805:2025 (EVS)', 'Uisce Éireann CDS-5020-03', 'S.I. No. 122 of 2014', 'ISA-5.1', 'OIML R 49 / ISO 4064'],
    detail: 'We interpret and apply engineering standards in a way that is technically precise and legally defensible. This means citing specific clauses by number, distinguishing normative from informative provisions, and building compliance matrices that show exactly which requirements apply, which are met, and where non-compliance exists. We have worked with EN 805:2025 (water infrastructure), ISA-5.1 (P&ID), and OIML/ISO metering standards.',
    evidence: 'BALENG-007: EN 805:2025 §4.1.4 (stagnation — normative) and §7.3.4 (acceptable velocities — normative) cited in technical appendix to demonstrate DN300 non-compliance. First-party licence (Order No. 10097343) means citations are from the authoritative purchased standard, not secondary sources.',
  },
  {
    area: 'Technical Documentation & Regulatory Writing',
    depth: 'Deep',
    tools: ['Word/PDF deliverables', 'Revision control', 'Calculation notebooks', 'Compliance matrices'],
    detail: 'We produce engineering documentation that will be read by regulators, utilities, and planning bodies. Structure, precision, and citeability are non-negotiable. Every calculation is shown explicitly. Every standard cited is identified by clause and version. Every conclusion is tied to specific data. Our documents are designed to stand as standalone engineering submissions — not as supporting appendices to be summarised away.',
    evidence: 'BALENG-007: Technical Appendix Rev 2 — 12-section document covering EPANET model validation, headloss calculations (both H-W and D-W), velocity and HRT analysis, pump-system curve interaction, capital cost analysis, surge considerations, and a consolidated comparison table. Cited EN 805:2025 by first-party licence.',
  },
  {
    area: 'Numerical Analysis & Engineering Computation',
    depth: 'Strong',
    tools: ['Python (pandas, numpy, scipy)', 'Excel VBA', 'Statistical validation', 'Polynomial regression'],
    detail: 'We compute. Whether it is deriving a trim factor from 12 gravimetric test points, fitting a Hazen-Williams friction coefficient from field data, or building a complete hydraulic model from first principles, we do the maths explicitly and show every step. We use Python for numerical work, Excel for audit-friendly calculation deliverables, and we validate results by cross-checking with independent methods.',
    evidence: 'BALENG-003: AQ/observed ratio CV calculated for 12 test points per unit to confirm scalar offset signature. Trim factor derived as 1/mean(ratio). Post-trim RMSE predicted and reported per unit. All calculations reproducible.',
  },
];

const STANDARDS_LIBRARY = [
  { std: 'EN 805:2025 (EVS)', domain: 'Water Infrastructure', note: 'First-party licence (Order 10097343, 17.05.2026)' },
  { std: 'Uisce Éireann CDS-5020-03 Rev 03', domain: 'Water Infrastructure', note: 'Code of Practice for Water Infrastructure (Ireland)' },
  { std: 'S.I. No. 122 of 2014', domain: 'Water Quality', note: 'European Union (Drinking Water) Regulations 2014 (Ireland)' },
  { std: 'ISA-5.1', domain: 'P&ID Design', note: 'Instrumentation symbols and identification' },
  { std: 'AutoCAD DXF R12 (ASCII)', domain: 'CAD', note: 'Interoperable format for CAD deliverables' },
  { std: 'OIML R 49', domain: 'Flow Metering', note: 'Water meters for cold potable water and hot water' },
  { std: 'ISO 4064 Series', domain: 'Flow Metering', note: 'Meters for cold potable water and hot water' },
  { std: 'WHO Drinking Water Quality Guidelines, 4th Ed.', domain: 'Water Quality', note: 'Velocity and stagnation risk reference' },
  { std: 'Barfuss et al. (2023)', domain: 'Hydraulics', note: 'Utah State University: PVC pipe H-W C-value laboratory and field confirmation' },
  { std: 'AWWA Manual M58', domain: 'Water Quality', note: 'Internal corrosion and biofilm reference for stagnation arguments' },
  { std: 'EN 805:2000 (superseded)', domain: 'Water Infrastructure', note: 'Predecessor standard, referenced in older submissions' },
  { std: 'EPANET 2.2', domain: 'Hydraulic Modelling', note: 'US EPA open-source hydraulic and water quality model' },
];

const WHAT_SETS_US_APART = [
  {
    point: 'We show our work.',
    detail: 'Every deliverable includes the explicit calculation, not just the conclusion. If we calculate that DN300 fails the velocity criterion, we show the velocity calculation — at each flow condition, with the threshold cited by clause number. This makes our work auditable, defensible, and impossible to dismiss.',
  },
  {
    point: 'We hold first-party standards licences.',
    detail: 'When we cite EN 805:2025, we cite the purchased, authoritative document — not a paraphrase from a secondary source. This matters in regulatory and legal contexts. Our standards library is current.',
  },
  {
    point: 'We validate with independent methods.',
    detail: 'We routinely cross-check results using independent approaches. On BALENG-007, we computed headloss using both Hazen-Williams and Darcy-Weisbach, and validated the friction coefficient against two independent pipes from the EPANET model — getting C = 149.8 and 150.2 respectively. Consistency across methods builds confidence that the number is right.',
  },
  {
    point: 'We distinguish product-line defects from unit-level problems.',
    detail: 'On BALENG-003, we identified that two separate 300FE flow meters showed the same 3.91× ratio. That is not per-unit variation — it is a product-line systematic error. We flagged this as a manufacturer engineering recommendation, not just as two individual trim jobs. This kind of pattern recognition is what separates engineering analysis from data processing.',
  },
  {
    point: 'Our documentation is built for how it will be used.',
    detail: 'A technical appendix for a planning submission is not the same document as an internal analysis note. We write for the audience — regulator, utility, legal team — with the appropriate level of technical detail, citation rigour, and professional structure.',
  },
];

export default function BCExpertisePage() {
  return (
    <div style={{ background: BG, minHeight: '100vh', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>
      <BCNav />

      {/* Hero */}
      <section style={{ padding: '140px 6vw 80px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <FadeUp>
          <p style={{ fontFamily: 'Courier New, monospace', fontSize: '0.62rem', letterSpacing: '0.18em', color: LIME, textTransform: 'uppercase', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ display: 'inline-block', width: 24, height: 1, background: LIME }} />
            Technical Expertise
          </p>
          <h1 style={{ fontSize: 'clamp(2.6rem, 7vw, 5.5rem)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.035em', marginBottom: 24, maxWidth: 900 }}>
            What we know.<br /><span style={{ color: LIME }}>Proved by what we&apos;ve done.</span>
          </h1>
          <p style={{ fontSize: 'clamp(1rem, 2vw, 1.2rem)', color: 'rgba(255,255,255,0.5)', maxWidth: 600, lineHeight: 1.7 }}>
            This page documents our technical depth across each discipline. Every capability listed here is backed by completed project work — not claimed credentials.
          </p>
        </FadeUp>
      </section>

      {/* Technical depth */}
      <section style={{ padding: '80px 6vw', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <FadeUp>
          <p style={{ fontFamily: 'Courier New, monospace', fontSize: '0.62rem', letterSpacing: '0.16em', color: LIME, textTransform: 'uppercase', marginBottom: 12 }}>// technical depth by area</p>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 64 }}>Capabilities with evidence</h2>
        </FadeUp>
        {TECHNICAL_AREAS.map((t, i) => (
          <FadeUp key={t.area} delay={i * 0.04}>
            <div style={{
              borderTop: '1px solid rgba(255,255,255,0.06)',
              padding: '48px 0',
              display: 'grid',
              gridTemplateColumns: '260px 1fr',
              gap: '3rem',
              alignItems: 'start',
            }} className="bc-expertise-row">
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 16, padding: '4px 10px', border: `1px solid ${t.depth === 'Deep' ? LIME : 'rgba(255,255,255,0.2)'}`, borderRadius: 2 }}>
                  <span style={{ width: 6, height: 6, background: t.depth === 'Deep' ? LIME : 'rgba(255,255,255,0.4)', borderRadius: '50%', flexShrink: 0 }} />
                  <span style={{ fontFamily: 'Courier New, monospace', fontSize: '0.55rem', letterSpacing: '0.12em', color: t.depth === 'Deep' ? LIME : 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>{t.depth}</span>
                </div>
                <h3 style={{ fontSize: 'clamp(0.9rem, 1.8vw, 1.15rem)', fontWeight: 700, letterSpacing: '-0.01em', marginBottom: 16, lineHeight: 1.4 }}>{t.area}</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {t.tools.map(tool => (
                    <span key={tool} style={{ fontSize: '0.65rem', fontFamily: 'Courier New, monospace', letterSpacing: '0.08em', color: 'rgba(200,241,53,0.55)' }}>→ {tool}</span>
                  ))}
                </div>
              </div>
              <div>
                <p style={{ fontSize: '0.92rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.8, marginBottom: 20 }}>{t.detail}</p>
                <div style={{ padding: '16px 20px', background: 'rgba(200,241,53,0.04)', border: '1px solid rgba(200,241,53,0.12)', borderRadius: 2 }}>
                  <p style={{ fontFamily: 'Courier New, monospace', fontSize: '0.55rem', letterSpacing: '0.14em', color: LIME, marginBottom: 6, textTransform: 'uppercase' }}>Project evidence</p>
                  <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, fontFamily: 'Courier New, monospace' }}>{t.evidence}</p>
                </div>
              </div>
            </div>
          </FadeUp>
        ))}
      </section>

      {/* What sets us apart */}
      <section style={{ padding: '80px 6vw', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <FadeUp>
          <p style={{ fontFamily: 'Courier New, monospace', fontSize: '0.62rem', letterSpacing: '0.16em', color: LIME, textTransform: 'uppercase', marginBottom: 12 }}>// engineering philosophy</p>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 64 }}>Why clients choose Baltar Consulting</h2>
        </FadeUp>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }} className="bc-apart-grid">
          {WHAT_SETS_US_APART.map((w, i) => (
            <FadeUp key={w.point} delay={i * 0.07}>
              <div style={{ padding: '36px 32px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', height: '100%' }}>
                <h3 style={{ fontSize: 'clamp(1rem, 2vw, 1.2rem)', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 14, color: '#fff' }}>{w.point}</h3>
                <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.75 }}>{w.detail}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* Standards library */}
      <section style={{ padding: '80px 6vw', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <FadeUp>
          <p style={{ fontFamily: 'Courier New, monospace', fontSize: '0.62rem', letterSpacing: '0.16em', color: LIME, textTransform: 'uppercase', marginBottom: 12 }}>// standards & references</p>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 48 }}>
            We work from primary sources.
          </h2>
        </FadeUp>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1 }} className="bc-standards-grid">
          {STANDARDS_LIBRARY.map((s, i) => (
            <FadeUp key={s.std} delay={i * 0.04}>
              <div style={{ padding: '20px 24px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', height: '100%' }}>
                <p style={{ fontSize: '0.78rem', fontWeight: 700, marginBottom: 4, letterSpacing: '-0.01em' }}>{s.std}</p>
                <p style={{ fontFamily: 'Courier New, monospace', fontSize: '0.55rem', letterSpacing: '0.1em', color: LIME, marginBottom: 6, textTransform: 'uppercase' }}>{s.domain}</p>
                <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', lineHeight: 1.5 }}>{s.note}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 6vw 96px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 32 }}>
        <div>
          <p style={{ fontFamily: 'Courier New, monospace', fontSize: '0.62rem', letterSpacing: '0.16em', color: LIME, marginBottom: 12 }}>// start an engagement</p>
          <h2 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.8rem)', fontWeight: 800, letterSpacing: '-0.03em', maxWidth: 600 }}>Technical depth you can verify. Confidence you can cite.</h2>
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <a href="mailto:admin@baltar.ca" style={{
            display: 'inline-block', padding: '16px 32px',
            background: LIME, color: '#0a0a0e',
            fontFamily: 'Courier New, monospace', fontSize: '0.65rem',
            letterSpacing: '0.14em', textTransform: 'uppercase',
            fontWeight: 700, textDecoration: 'none', borderRadius: 2, whiteSpace: 'nowrap',
          }}>
            Engage Us →
          </a>
          <Link href="/baltar-engineering/projects" style={{
            display: 'inline-block', padding: '16px 32px',
            background: 'transparent', color: LIME,
            fontFamily: 'Courier New, monospace', fontSize: '0.65rem',
            letterSpacing: '0.14em', textTransform: 'uppercase',
            fontWeight: 700, textDecoration: 'none', borderRadius: 2,
            border: `1px solid rgba(200,241,53,0.4)`, whiteSpace: 'nowrap',
          }}>
            View Projects
          </Link>
        </div>
      </section>

      <style>{`
        @media (max-width: 1024px) {
          .bc-standards-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .bc-apart-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 768px) {
          .bc-expertise-row { grid-template-columns: 1fr !important; gap: 1.5rem !important; }
          .bc-standards-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
