'use client';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
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

const SERVICES = [
  {
    code: 'SVC-01',
    name: 'Hydraulic Analysis & Pipeline Engineering',
    tagline: 'From first principles to regulatory submission.',
    desc: 'We perform rigorous hydraulic analysis for water supply and distribution systems using EPANET 2.2 modelling and manual calculations (Hazen-Williams, Darcy-Weisbach). Our work includes pipeline sizing, pressure analysis, velocity compliance verification, and water quality impact assessment. We prepare technical appendices that are defensible before water utilities, planning authorities, and regulatory bodies.',
    deliverables: [
      'EPANET 2.2 hydraulic models with documented assumptions',
      'Hazen-Williams and Darcy-Weisbach headloss calculations (explicit)',
      'Velocity compliance assessment vs. EN 805:2025 §7.3.4',
      'Water age / hydraulic retention time analysis',
      'Pump-system curve interaction analysis',
      'Capital cost-effectiveness comparison across pipe diameter options',
      'Technical appendix in Word/PDF — citation-ready',
      'EN 805:2025 and Uisce Éireann CDS-5020-03 compliance matrices',
    ],
    standards: ['EN 805:2025 (EVS)', 'Uisce Éireann CDS-5020-03 Rev 03', 'S.I. No. 122 of 2014', 'WHO Drinking Water Quality Guidelines'],
    suitable: ['Water utilities', 'Civil engineers', 'Residential developers', 'Planning consultants', 'Legal teams challenging utility specifications'],
  },
  {
    code: 'SVC-02',
    name: 'P&ID Design & Process Engineering',
    tagline: 'ISA-5.1 compliant. CAD-ready. Revision-controlled.',
    desc: 'We design Piping and Instrumentation Diagrams for industrial, chemical, and process facilities. All deliverables conform to ISA-5.1 symbology and are produced as layered, revision-controlled packages. We deliver PDF (print-ready), DXF (AutoCAD-compatible, with named equipment and instrument layers), and SVG (for further design iteration in Inkscape, Illustrator, or Visio). We handle P&ID from initial concept through to final issue-for-construction stage.',
    deliverables: [
      'Multi-sheet P&ID packages (any scale of facility)',
      'ISA-5.1 compliant symbology throughout',
      'AutoCAD DXF files with named layers (EQUIPMENT, PIPING, INSTRUMENT, etc.)',
      'SVG source files for further design iteration',
      'Print-ready PDF packages (all sheets)',
      'Revision history and title block management',
      'PSV sizing and placement documentation',
      'Process flow descriptions and stream tables',
    ],
    standards: ['ISA-5.1', 'ISO 10628-2', 'ASME BPE (for applicable systems)'],
    suitable: ['Chemical process facilities', 'Oil & gas', 'Water treatment plants', 'Industrial manufacturing', 'Engineering firms requiring sub-contract P&ID work'],
  },
  {
    code: 'SVC-03',
    name: 'Flow Meter Calibration & Algorithm Engineering',
    tagline: 'Sub-1% RMSE. No hardware replacement.',
    desc: 'We diagnose and correct flow measurement errors in industrial metering systems. Our methodology begins with gravimetric test data analysis to establish the AQ/observed ratio across the full operating range, identify error patterns (systematic offset, polynomial coefficient error, installation effect), and derive corrected AQ formulas — delivered as copy-paste-ready expressions for direct device upload. We work with electromagnetic flow meters, Woltmann turbine meters, and other pulse-based flow measurement systems using the AQ formula architecture.',
    deliverables: [
      'Ratio analysis across 12+ test points per unit',
      'Error pattern classification (systematic offset, product-line defect, installation effect)',
      'Trim factor derivation with CV validation',
      'Corrected AQ formula (single-line, copy-paste ready)',
      'Post-trim RMSE and maximum error prediction',
      'Engineering cover note with findings for client/manufacturer',
      'Separate plain-text formula files for audit',
      'Recommendations on source defect (for manufacturer action)',
    ],
    standards: ['OIML R 49', 'ISO 4064 (water meters)', 'MID (Measuring Instruments Directive 2014/32/EU)'],
    suitable: ['Flow meter manufacturers', 'Water utilities', 'Industrial process operators', 'Metering calibration laboratories', 'Companies managing DMA (District Metered Area) networks'],
  },
  {
    code: 'SVC-04',
    name: 'Technical Documentation & Regulatory Reports',
    tagline: 'Defensible. Cited. Revision-controlled.',
    desc: 'We produce technically precise documentation for regulatory submissions, planning applications, and engineering disputes. Our reports are structured for professional consumption — explicit calculations, referenced standards, revision-controlled deliverables. We interpret and apply EN, ISO, and national standards (Irish, Canadian, European) and produce appendices that can stand alone as expert engineering evidence.',
    deliverables: [
      'Technical appendices for planning submissions',
      'Standards compliance matrices (EN, ISO, national regulations)',
      'Expert engineering reports for utility disputes',
      'Rebuttal reports challenging third-party specifications',
      'Calculation notebooks (explicit, auditable)',
      'Revision-controlled Word/PDF deliverables',
      'Structured for legal/regulatory use if required',
    ],
    standards: ['EN 805:2025', 'ISO standards (project-specific)', 'National regulations (Ireland, Canada, EU)'],
    suitable: ['Engineering firms', 'Legal teams', 'Planning consultants', 'Developers in dispute with utilities', 'Regulatory bodies requiring independent review'],
  },
];

export default function BCServicesPage() {
  return (
    <div style={{ background: BG, minHeight: '100vh', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>
      <BCNav />

      {/* Hero */}
      <section style={{ padding: '140px 6vw 80px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <FadeUp>
          <p style={{ fontFamily: 'Courier New, monospace', fontSize: '0.62rem', letterSpacing: '0.18em', color: LIME, textTransform: 'uppercase', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ display: 'inline-block', width: 24, height: 1, background: LIME }} />
            Services
          </p>
          <h1 style={{ fontSize: 'clamp(2.6rem, 7vw, 5.5rem)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.035em', marginBottom: 24, maxWidth: 900 }}>
            Technical engineering<br /><span style={{ color: LIME }}>on fixed scope.</span>
          </h1>
          <p style={{ fontSize: 'clamp(1rem, 2vw, 1.2rem)', color: 'rgba(255,255,255,0.5)', maxWidth: 600, lineHeight: 1.7 }}>
            Every engagement begins with a clear scope of work, an explicit methodology, and a deliverable standard. No vague retainers — just rigorous analysis and calculation-backed outputs.
          </p>
        </FadeUp>
      </section>

      {/* Services */}
      <section style={{ padding: '64px 6vw 96px' }}>
        {SERVICES.map((s, i) => (
          <FadeUp key={s.code} delay={i * 0.04}>
            <div style={{
              padding: '56px 0',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '3.5rem', alignItems: 'start' }} className="bc-service-row">
                {/* Left */}
                <div>
                  <p style={{ fontFamily: 'Courier New, monospace', fontSize: '0.55rem', letterSpacing: '0.14em', color: 'rgba(200,241,53,0.5)', marginBottom: 16 }}>{s.code}</p>
                  <h2 style={{ fontSize: 'clamp(1rem, 2vw, 1.3rem)', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 10, lineHeight: 1.3 }}>{s.name}</h2>
                  <p style={{ fontFamily: 'Courier New, monospace', fontSize: '0.65rem', color: LIME, letterSpacing: '0.08em', marginBottom: 20 }}>{s.tagline}</p>
                  <div>
                    <p style={{ fontFamily: 'Courier New, monospace', fontSize: '0.55rem', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: 8 }}>Standards</p>
                    {s.standards.map(st => (
                      <p key={st} style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', marginBottom: 3, lineHeight: 1.4 }}>{st}</p>
                    ))}
                  </div>
                </div>
                {/* Right */}
                <div>
                  <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.8, marginBottom: 28 }}>{s.desc}</p>
                  <p style={{ fontFamily: 'Courier New, monospace', fontSize: '0.58rem', letterSpacing: '0.14em', color: LIME, textTransform: 'uppercase', marginBottom: 16 }}>// deliverables</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 24px', marginBottom: 28 }} className="bc-deliverables-grid">
                    {s.deliverables.map(d => (
                      <p key={d} style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                        <span style={{ color: LIME, flexShrink: 0, marginTop: 3 }}>→</span> {d}
                      </p>
                    ))}
                  </div>
                  <p style={{ fontFamily: 'Courier New, monospace', fontSize: '0.58rem', letterSpacing: '0.14em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: 10 }}>// suitable for</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {s.suitable.map(su => (
                      <span key={su} style={{ fontSize: '0.6rem', fontFamily: 'Courier New, monospace', letterSpacing: '0.08em', padding: '4px 10px', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)', borderRadius: 2 }}>{su}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </FadeUp>
        ))}
      </section>

      {/* How we engage */}
      <section style={{ padding: '64px 6vw', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <FadeUp>
          <p style={{ fontFamily: 'Courier New, monospace', fontSize: '0.62rem', letterSpacing: '0.16em', color: LIME, textTransform: 'uppercase', marginBottom: 40 }}>// how engagements work</p>
        </FadeUp>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1 }} className="bc-process-grid">
          {[
            { step: '01', title: 'Brief', desc: 'You describe the technical problem, regulatory context, and required deliverable format. We assess scope and feasibility.' },
            { step: '02', title: 'Scope Agreement', desc: 'We define a fixed scope of work with explicit methodology, deliverable list, and timeline. No ambiguity.' },
            { step: '03', title: 'Analysis', desc: 'We execute the technical work — calculations, modelling, document preparation — and validate all outputs before delivery.' },
            { step: '04', title: 'Delivery', desc: 'Deliverables are provided in agreed formats with revision control. We remain available for clarification questions.' },
          ].map((p, i) => (
            <FadeUp key={p.step} delay={i * 0.1}>
              <div style={{ padding: '32px 24px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', height: '100%', borderTop: `2px solid ${i === 0 ? LIME : 'rgba(255,255,255,0.08)'}` }}>
                <p style={{ fontFamily: 'Courier New, monospace', fontSize: '0.58rem', letterSpacing: '0.14em', color: LIME, marginBottom: 16 }}>{p.step}.</p>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 12 }}>{p.title}</h3>
                <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.7 }}>{p.desc}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 6vw 96px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 32 }}>
        <div>
          <p style={{ fontFamily: 'Courier New, monospace', fontSize: '0.62rem', letterSpacing: '0.16em', color: LIME, marginBottom: 12 }}>// ready to proceed?</p>
          <h2 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.8rem)', fontWeight: 800, letterSpacing: '-0.03em', maxWidth: 600 }}>Describe your problem. We&apos;ll define the scope.</h2>
        </div>
        <a href="mailto:admin@baltar.ca" style={{
          display: 'inline-block', padding: '18px 40px',
          background: LIME, color: '#0a0a0e',
          fontFamily: 'Courier New, monospace', fontSize: '0.7rem',
          letterSpacing: '0.14em', textTransform: 'uppercase',
          fontWeight: 700, textDecoration: 'none', borderRadius: 2, whiteSpace: 'nowrap',
        }}>
          Start a Conversation →
        </a>
      </section>

      <style>{`
        @media (max-width: 1024px) {
          .bc-process-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 768px) {
          .bc-service-row { grid-template-columns: 1fr !important; gap: 2rem !important; }
          .bc-deliverables-grid { grid-template-columns: 1fr !important; }
          .bc-process-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
