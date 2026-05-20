'use client';
import Link from 'next/link';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import BCNav from './BCNav';

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

const DISCIPLINES = [
  {
    code: 'WRK-01',
    name: 'Water Infrastructure & Hydraulics',
    desc: 'Pipeline hydraulic analysis, system sizing, and regulatory compliance for water utilities and civil infrastructure. EPANET modelling, Hazen-Williams and Darcy-Weisbach calculations, EN 805:2025 and Uisce Éireann standards.',
    tags: ['EPANET', 'EN 805:2025', 'Pipeline Design', 'Hydraulic Analysis'],
  },
  {
    code: 'WRK-02',
    name: 'Process & Chemical Engineering',
    desc: 'P&ID design, process flow diagrams, and pressure system documentation for industrial and chemical process facilities. ISA-5.1 standard deliverables in PDF, DXF, and SVG formats compatible with AutoCAD and leading CAD platforms.',
    tags: ['P&ID Design', 'ISA-5.1', 'Process Systems', 'Pressure Systems'],
  },
  {
    code: 'WRK-03',
    name: 'Instrumentation & Metering Engineering',
    desc: 'Flow meter calibration, polynomial algorithm development, and accuracy analysis for industrial metering applications. Systematic error diagnosis, trim factor derivation, and installation effect correction for electromagnetic and Woltmann flow meter systems.',
    tags: ['Flow Meter Calibration', 'AQ Formula Development', 'Error Analysis', 'T-piece Correction'],
  },
  {
    code: 'WRK-04',
    name: 'Technical Documentation & Regulatory Submissions',
    desc: 'Professionally prepared technical appendices, engineering reports, and standards-compliance submissions for planning authorities, water utilities, and regulatory bodies. Defensible documentation built on cited calculations.',
    tags: ['Technical Reports', 'Standards Compliance', 'Regulatory Submissions', 'Expert Reports'],
  },
];

const PROJECTS = [
  {
    ref: 'BALENG-003',
    client: 'Aqualink',
    sector: 'Industrial Instrumentation',
    country: 'Europe',
    title: 'Multi-Unit Flow Meter Calibration & Algorithm Recovery',
    summary: 'Systematic analysis and correction of flow measurement errors across a fleet of FE-series electromagnetic flow meters. We identified a product-line calibration defect in 300FE units — a systematic 3.91× over-read consistent with a polynomial area term error — and derived trim factors for four customer-site installations ranging from DN100 to DN300. Post-trim RMSE across all units: <1%. All units recovered to within Aqualink\'s 3–5% DMA acceptance threshold without hardware replacement.',
    outcomes: ['Sub-1% RMSE across 4 units after trim', 'Product-line defect identified in 300FE series', 'T-piece installation effects characterised and corrected', 'Copy-paste AQ formulas delivered for direct device upload'],
    tags: ['Flow Calibration', 'Algorithm Development', 'Error Analysis', 'Metering'],
    year: '2025',
  },
  {
    ref: 'BALENG-005',
    client: 'Francis Beland',
    sector: 'Chemical / Process Engineering',
    country: 'Canada',
    title: 'P&ID Package Design — Multi-Zone Process Plant',
    summary: 'Complete 7-sheet Piping and Instrumentation Diagram package for a multi-zone process facility. Delivered to ISA-5.1 standards across equipment zones A and B, incorporating pressure safety valves, recycle streams, vapor overhead routing, and full utility distribution. Package delivered as print-ready PDF (Rev C) plus AutoCAD-compatible DXF files with named layers (EQUIPMENT, PIPING, RECYCLE, PURGE, UTILITY, INSTRUMENT, STREAM_TAG) and SVG for further design iteration.',
    outcomes: ['7-sheet P&ID package, ISA-5.1 compliant', 'DXF + SVG CAD files with layered entities', 'PSV sizing and placement validated', 'Revision-controlled PDF submission package'],
    tags: ['P&ID', 'ISA-5.1', 'Process Design', 'AutoCAD DXF'],
    year: '2025',
  },
  {
    ref: 'BALENG-007',
    client: 'Barth O\'Neill',
    sector: 'Water Infrastructure',
    country: 'Ireland',
    title: 'Hydraulic Analysis & Uisce Éireann Technical Submission — Kilcummin',
    summary: 'Technical challenge to a DN300 pipe upgrade specification issued by Uisce Éireann (Irish Water) for a 178-house residential development in County Kerry. Using EPANET 2.2 modelling (KILCUMMIN 2 After.net) and EN 805:2025 §4.1.4 / §7.3.4 compliance analysis, we demonstrated that DN300 fails the velocity criterion under all realistic operating conditions (0.114 m/s at peak vs. 0.3 m/s minimum) while DN150 passes both headloss and velocity criteria at €95,000 lower capital cost. We also identified that Uisce Éireann\'s calculations appear to use C ≈ 130 (appropriate for aged cast iron), whereas the installed PVC pipe warrants C = 150 per published laboratory and field data — materially reducing the calculated headloss.',
    outcomes: ['EPANET model validated against field data (C=150 back-calculated)', 'DN300 shown non-compliant under EN 805:2025 §4.1.4 and §7.3.4', 'DN150 confirmed as correct specification at 30× better cost-effectiveness per m of headloss recovered', 'EN 805:2025 first-party licence citations integrated throughout'],
    tags: ['EPANET', 'EN 805:2025', 'Pipeline Hydraulics', 'Regulatory Submission'],
    year: '2026',
  },
];

const CAPABILITIES = [
  { label: 'Hydraulic modelling', detail: 'EPANET 2.2, Hazen-Williams, Darcy-Weisbach' },
  { label: 'P&ID design', detail: 'ISA-5.1, AutoCAD DXF/SVG, multi-sheet packages' },
  { label: 'Flow meter calibration', detail: 'AQ polynomial development, trim derivation, error analysis' },
  { label: 'Standards compliance', detail: 'EN 805:2025, Uisce Éireann CDS-5020-03, S.I. 122/2014' },
  { label: 'Technical reporting', detail: 'Regulatory submissions, planning appendices, expert reports' },
  { label: 'Numerical analysis', detail: 'Python, Excel VBA, statistical validation, regression fitting' },
  { label: 'Engineering documentation', detail: 'ISO-compliant deliverables, revision-controlled packages' },
  { label: 'Dispute support', detail: 'Technical rebuttal reports, standards interpretation, expert analysis' },
];

const STATS = [
  { val: '<1%', label: 'RMSE achieved on flow meter recovery work' },
  { val: '€95K', label: 'capital saved on Kilcummin water infrastructure recommendation' },
  { val: '7-sheet', label: 'P&ID package delivered to ISA-5.1 standard' },
  { val: '3', label: 'countries engaged: Canada, Ireland, Europe' },
];

export default function BaltarConsultingPage() {
  return (
    <div style={{ background: BG, minHeight: '100vh', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>
      <BCNav />

      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'ProfessionalService',
        name: 'Baltar Consulting',
        description: 'Technical engineering consultancy specialising in water infrastructure hydraulics, process P&ID design, and instrumentation & metering engineering.',
        url: 'https://www.baltar.ca/baltar-engineering',
        parentOrganization: { '@type': 'Organization', name: 'Baltar Inc.' },
        serviceType: ['Water Infrastructure Engineering', 'Process Engineering', 'Instrumentation Engineering', 'Technical Documentation'],
        areaServed: ['Canada', 'Ireland', 'European Union'],
      })}} />

      {/* Hero */}
      <section style={{
        minHeight: '100vh', display: 'flex', alignItems: 'flex-end',
        padding: '60px 6vw 96px', position: 'relative', overflow: 'hidden',
        background: BG,
      }}>
        {/* Grid overlay */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0,
          backgroundImage: 'linear-gradient(rgba(200,241,53,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(200,241,53,0.04) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }} />
        {/* Background lettering */}
        <div style={{
          position: 'absolute', right: '-4%', bottom: '-8%',
          fontSize: 'clamp(14rem, 28vw, 24rem)', fontWeight: 900,
          color: 'rgba(255,255,255,0.022)', lineHeight: 1,
          pointerEvents: 'none', letterSpacing: '-0.06em', userSelect: 'none',
          fontFamily: 'system-ui, sans-serif',
        }}>BC</div>

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 1200, width: '100%' }}>
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
          >
            <p style={{
              fontFamily: 'Courier New, monospace', fontSize: '0.62rem',
              letterSpacing: '0.18em', color: LIME, textTransform: 'uppercase',
              marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <span style={{ display: 'inline-block', width: 28, height: 1, background: LIME }} />
              Baltar Consulting · Technical Engineering
            </p>
            <h1 style={{
              fontSize: 'clamp(2.8rem, 8vw, 6.5rem)', fontWeight: 800,
              lineHeight: 1.0, letterSpacing: '-0.035em', marginBottom: 32,
              maxWidth: 860,
            }}>
              Engineering certainty.<br />
              <span style={{ color: LIME }}>Built on data.</span>
            </h1>
            <p style={{
              fontSize: 'clamp(1rem, 2vw, 1.2rem)', color: 'rgba(255,255,255,0.5)',
              maxWidth: 560, lineHeight: 1.75, marginBottom: 48,
            }}>
              Water infrastructure hydraulics. Process P&amp;ID design. Instrumentation and metering engineering. Technical documentation for regulatory and planning submissions.
            </p>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <a href="mailto:admin@baltar.ca" style={{
                display: 'inline-block', padding: '15px 36px',
                background: LIME, color: '#0a0a0e',
                fontFamily: 'Courier New, monospace', fontSize: '0.65rem',
                letterSpacing: '0.14em', textTransform: 'uppercase',
                fontWeight: 700, textDecoration: 'none', borderRadius: 2,
              }}>
                Engage Us →
              </a>
              <Link href="/baltar-engineering/projects" style={{
                display: 'inline-block', padding: '15px 36px',
                background: 'transparent', color: LIME,
                fontFamily: 'Courier New, monospace', fontSize: '0.65rem',
                letterSpacing: '0.14em', textTransform: 'uppercase',
                fontWeight: 700, textDecoration: 'none', borderRadius: 2,
                border: `1px solid ${LIME}`,
              }}>
                View Projects
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats strip */}
      <FadeUp>
        <section style={{
          borderTop: '1px solid rgba(255,255,255,0.06)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          background: 'rgba(255,255,255,0.015)',
        }} className="bc-stats-grid">
          {STATS.map((s, i) => (
            <div key={s.label} style={{
              padding: '40px 32px',
              borderRight: i < 3 ? '1px solid rgba(255,255,255,0.06)' : 'none',
            }}>
              <p style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', fontWeight: 800, color: LIME, letterSpacing: '-0.04em', lineHeight: 1, marginBottom: 8 }}>{s.val}</p>
              <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>{s.label}</p>
            </div>
          ))}
        </section>
      </FadeUp>

      {/* Disciplines */}
      <section style={{ padding: '80px 6vw', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <FadeUp>
          <p style={{ fontFamily: 'Courier New, monospace', fontSize: '0.62rem', letterSpacing: '0.16em', color: LIME, textTransform: 'uppercase', marginBottom: 12 }}>// disciplines</p>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 3.2rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 64, maxWidth: 700 }}>
            Four technical practices. One engineering standard.
          </h2>
        </FadeUp>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1 }} className="bc-disciplines-grid">
          {DISCIPLINES.map((d, i) => (
            <FadeUp key={d.code} delay={i * 0.08}>
              <div style={{
                padding: '40px 36px',
                background: 'rgba(255,255,255,0.025)',
                border: '1px solid rgba(255,255,255,0.06)',
                height: '100%',
              }}>
                <p style={{ fontFamily: 'Courier New, monospace', fontSize: '0.55rem', letterSpacing: '0.14em', color: 'rgba(200,241,53,0.5)', marginBottom: 16 }}>{d.code}</p>
                <h3 style={{ fontSize: 'clamp(1rem, 2vw, 1.3rem)', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 16 }}>{d.name}</h3>
                <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.75, marginBottom: 24 }}>{d.desc}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {d.tags.map(t => (
                    <span key={t} style={{ fontSize: '0.58rem', fontFamily: 'Courier New, monospace', letterSpacing: '0.1em', padding: '4px 10px', border: '1px solid rgba(200,241,53,0.2)', color: 'rgba(200,241,53,0.65)', borderRadius: 2 }}>{t}</span>
                  ))}
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* Featured projects */}
      <section style={{ padding: '80px 6vw', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <FadeUp>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 56, flexWrap: 'wrap', gap: 16 }}>
            <div>
              <p style={{ fontFamily: 'Courier New, monospace', fontSize: '0.62rem', letterSpacing: '0.16em', color: LIME, textTransform: 'uppercase', marginBottom: 12 }}>// selected projects</p>
              <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 3.2rem)', fontWeight: 800, letterSpacing: '-0.03em', maxWidth: 600 }}>Work built on rigorous analysis</h2>
            </div>
            <Link href="/baltar-engineering/projects" style={{ fontFamily: 'Courier New, monospace', fontSize: '0.62rem', letterSpacing: '0.12em', color: LIME, textDecoration: 'none' }}>
              All Projects →
            </Link>
          </div>
        </FadeUp>

        {PROJECTS.map((p, i) => (
          <FadeUp key={p.ref} delay={i * 0.06}>
            <div style={{
              borderTop: '1px solid rgba(255,255,255,0.06)',
              padding: '48px 0',
              display: 'grid',
              gridTemplateColumns: '200px 1fr',
              gap: '3rem',
              alignItems: 'start',
            }} className="bc-project-row">
              {/* Left meta */}
              <div>
                <p style={{ fontFamily: 'Courier New, monospace', fontSize: '0.55rem', letterSpacing: '0.14em', color: 'rgba(200,241,53,0.5)', marginBottom: 8 }}>{p.ref}</p>
                <p style={{ fontFamily: 'Courier New, monospace', fontSize: '0.6rem', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.3)', marginBottom: 4 }}>{p.sector}</p>
                <p style={{ fontFamily: 'Courier New, monospace', fontSize: '0.6rem', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.25)', marginBottom: 16 }}>{p.country} · {p.year}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  {p.tags.map(t => (
                    <span key={t} style={{ fontSize: '0.55rem', fontFamily: 'Courier New, monospace', letterSpacing: '0.1em', padding: '3px 8px', border: '1px solid rgba(200,241,53,0.15)', color: 'rgba(200,241,53,0.5)', borderRadius: 2, display: 'inline-block', width: 'fit-content' }}>{t}</span>
                  ))}
                </div>
              </div>
              {/* Right content */}
              <div>
                <h3 style={{ fontSize: 'clamp(1.1rem, 2.2vw, 1.55rem)', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 16, lineHeight: 1.3 }}>{p.title}</h3>
                <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.8, marginBottom: 28 }}>{p.summary}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {p.outcomes.map(o => (
                    <p key={o} style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                      <span style={{ color: LIME, fontWeight: 700, flexShrink: 0, marginTop: 2 }}>→</span> {o}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </FadeUp>
        ))}
      </section>

      {/* Technical capabilities */}
      <section style={{ padding: '80px 6vw', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <FadeUp>
          <p style={{ fontFamily: 'Courier New, monospace', fontSize: '0.62rem', letterSpacing: '0.16em', color: LIME, textTransform: 'uppercase', marginBottom: 12 }}>// technical capabilities</p>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 3.2rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 56 }}>What we bring to every engagement</h2>
        </FadeUp>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1 }} className="bc-caps-grid">
          {CAPABILITIES.map((c, i) => (
            <FadeUp key={c.label} delay={i * 0.05}>
              <div style={{
                padding: '28px 24px',
                borderTop: '2px solid',
                borderTopColor: i % 4 === 0 ? LIME : 'rgba(255,255,255,0.08)',
                background: 'rgba(255,255,255,0.02)',
              }}>
                <h4 style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: 8, letterSpacing: '-0.01em' }}>{c.label}</h4>
                <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.6, fontFamily: 'Courier New, monospace' }}>{c.detail}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* About strip */}
      <section style={{ padding: '80px 6vw', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <FadeUp>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '5rem', alignItems: 'start' }} className="bc-about-grid">
            <div>
              <p style={{ fontFamily: 'Courier New, monospace', fontSize: '0.62rem', letterSpacing: '0.16em', color: LIME, textTransform: 'uppercase', marginBottom: 16 }}>// about baltar consulting</p>
              <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.4rem)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.2 }}>
                We work where the technical margin is narrow and the cost of error is high.
              </h2>
            </div>
            <div>
              <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.85, marginBottom: 20 }}>
                Baltar Consulting is the engineering practice of Baltar Inc. We engage on technically demanding problems in water infrastructure, process engineering, and industrial instrumentation — the kind of work where the deliverable is a number someone will act on or a document that will be cited in a regulatory submission.
              </p>
              <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.85, marginBottom: 20 }}>
                Our projects have included calibration recovery for industrial flow meter fleets with multi-hundred-percent baseline errors; P&ID design packages delivered to ISA-5.1 standard for process facilities; and hydraulic technical appendices that successfully challenged water utility specifications using first-principles EPANET modelling and EN 805:2025 standards analysis.
              </p>
              <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.85 }}>
                Every deliverable is calculation-backed, reference-cited, and revision-controlled. We don&apos;t produce opinions — we produce defensible engineering analysis.
              </p>
              <div style={{ marginTop: 32, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {['EN 805:2025', 'ISA-5.1', 'EPANET 2.2', 'Hazen-Williams', 'Python', 'AutoCAD DXF', 'AQ Formulas', 'Uisce Éireann CDS-5020-03'].map(t => (
                  <span key={t} style={{ fontSize: '0.6rem', fontFamily: 'Courier New, monospace', letterSpacing: '0.1em', padding: '4px 10px', border: '1px solid rgba(200,241,53,0.2)', color: 'rgba(200,241,53,0.6)', borderRadius: 2 }}>{t}</span>
                ))}
              </div>
            </div>
          </div>
        </FadeUp>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 6vw 96px' }}>
        <FadeUp>
          <p style={{ fontFamily: 'Courier New, monospace', fontSize: '0.62rem', letterSpacing: '0.18em', color: LIME, textTransform: 'uppercase', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ display: 'inline-block', width: 24, height: 1, background: LIME }} />
            Start an engagement
          </p>
          <h2 style={{ fontSize: 'clamp(1.8rem, 5vw, 3.8rem)', fontWeight: 800, letterSpacing: '-0.04em', marginBottom: 24, maxWidth: 700, lineHeight: 1.1 }}>
            Bring us your hardest engineering problem.
          </h2>
          <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.75, maxWidth: 520, marginBottom: 40 }}>
            We work on fixed-scope technical engagements. Contact us with your project brief and we&apos;ll respond with an assessment of scope, methodology, and timeline.
          </p>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <a href="mailto:admin@baltar.ca" style={{
              display: 'inline-block', padding: '16px 40px',
              background: LIME, color: '#0a0a0e',
              fontFamily: 'Courier New, monospace', fontSize: '0.68rem',
              letterSpacing: '0.14em', textTransform: 'uppercase',
              fontWeight: 700, textDecoration: 'none', borderRadius: 2,
            }}>
              Start a Conversation →
            </a>
            <Link href="/baltar-engineering/services" style={{
              display: 'inline-block', padding: '16px 40px',
              background: 'transparent', color: LIME,
              fontFamily: 'Courier New, monospace', fontSize: '0.68rem',
              letterSpacing: '0.14em', textTransform: 'uppercase',
              fontWeight: 700, textDecoration: 'none', borderRadius: 2,
              border: `1px solid rgba(200,241,53,0.4)`,
            }}>
              View Services
            </Link>
          </div>
        </FadeUp>
      </section>

      <style>{`
        @media (max-width: 1024px) {
          .bc-stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .bc-caps-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .bc-about-grid { grid-template-columns: 1fr !important; gap: 2rem !important; }
        }
        @media (max-width: 768px) {
          .bc-disciplines-grid { grid-template-columns: 1fr !important; }
          .bc-stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .bc-caps-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .bc-project-row { grid-template-columns: 1fr !important; gap: 1.5rem !important; }
        }
        @media (max-width: 480px) {
          .bc-stats-grid { grid-template-columns: 1fr !important; }
          .bc-caps-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
