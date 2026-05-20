'use client';
import { useRef, useState } from 'react';
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

const PROJECTS = [
  {
    ref: 'BALENG-007',
    year: '2026',
    client: 'Barth O\'Neill',
    country: 'Ireland',
    sector: 'Water Infrastructure',
    discipline: 'Hydraulics',
    title: 'Hydraulic Challenge to Uisce Éireann DN300 Specification — Kilcummin, Kerry',
    brief: 'A 178-house residential development in Kilcummin, County Kerry required a mains upgrade. Uisce Éireann (Irish Water) specified DN300 — a four-fold increase in pipe diameter over the existing DN100 main. Our client engaged Baltar Consulting to independently assess the specification and determine the correct technical answer.',
    methodology: [
      'EPANET 2.2 hydraulic model analysis (KILCUMMIN 2 After.net) — node and link table validation against field conditions',
      'Hazen-Williams and Darcy-Weisbach calculations for Pipes 1+2 (703.87m total, the contended section) across DN100, DN150, and DN300',
      'Back-calculation of Hazen-Williams C coefficient from Uisce Éireann\'s own stated flow and headloss values (found C ≈ 130–133 — consistent with aged cast iron, not PVC)',
      'Velocity compliance analysis vs. EN 805:2025 §7.3.4 at peak flow (8.06 L/s), average daily (3.75 L/s), and overnight minimum (1.0 L/s)',
      'Hydraulic retention time calculation for Pipes 1+2 at all three flow conditions',
      'Pump-system curve interaction (Grundfos CR32-6) for each pipe option',
      'Capital cost differential analysis (indicative Irish market rates)',
      'EN 805:2025 §4.1.4 (stagnation) and §12 (operational requirements) compliance assessment',
    ],
    findings: [
      'DN300 fails the velocity criterion of EN 805:2025 §7.3.4 under all realistic operating conditions: 0.114 m/s at peak design flow, 0.053 m/s at daily mean — both below the 0.3 m/s stagnation threshold',
      'At overnight minimum (1.0 L/s), DN300 produces a hydraulic retention time of 13.82 hours in Pipes 1+2 alone — rising to 46+ hours at extreme night minimum',
      'DN150 satisfies both the headloss criterion (0.96 m/km vs 3 m/km limit) and velocity criterion (0.42 m/s) at design flow',
      'The marginal headloss benefit of DN300 over DN150 is 0.92m over 703.87m — worth €95,000 in additional capital at 30× worse cost-effectiveness per metre of headloss recovered',
      'Uisce Éireann\'s calculation appears to use C = 130–133 — appropriate for aged cast iron — rather than C = 150, the laboratory-confirmed value for PVC pipe. At C = 150 with corrected demand, the existing DN100 may not require upgrade at all',
      'EN 805:2025 §4.1.4 explicitly identifies enlarged diameters for firefighting as a stagnation risk requiring "careful consideration" — the most likely justification for DN300 is directly addressed by the standard as an engineering risk, not a benefit',
    ],
    outcome: 'Comprehensive technical appendix (Rev 2) delivered with EPANET model validation, explicit calculations, and EN 805:2025 citation matrix. DN150 confirmed as the correct engineering specification. Technical submission delivered to the client for use in negotiations with Uisce Éireann.',
    deliverables: 'Technical Appendix Rev 2 (Word + PDF), Excel hydraulic analysis workbook with 8 calculation sheets, EPANET model documentation',
    standards: ['EN 805:2025 (EVS, Order 10097343)', 'Uisce Éireann CDS-5020-03 Rev 03', 'S.I. No. 122 of 2014', 'WHO Drinking Water Quality Guidelines 4th Ed.', 'Barfuss et al. (2023) Utah State University PVC C-value research'],
  },
  {
    ref: 'BALENG-005',
    year: '2025',
    client: 'Francis Beland',
    country: 'Canada',
    sector: 'Process Engineering',
    discipline: 'P&ID Design',
    title: 'P&ID Package Design — Multi-Zone Process Plant (7 Sheets, Rev C)',
    brief: 'Design and deliver a complete Piping and Instrumentation Diagram package for a multi-zone industrial process facility, progressing from initial layout through revision C. The client required print-ready PDF, engineering-revision-controlled documentation, and CAD-exportable files suitable for handoff to a draftsman for AutoCAD Plant 3D development.',
    methodology: [
      'Facility layout and equipment inventory review — zones A and B defined and equipment allocated',
      'ISA-5.1 symbology applied throughout — instrument tags, valve types, line designations, and process connections',
      'Pressure safety valve (PSV) sizing and placement validated against pressure system requirements',
      'Vapor overhead routing, recycle streams, purge lines, and utility distribution mapped across all 7 sheets',
      'Title block, sheet numbering, and revision history management implemented',
      'Revision A → B → C cycle with tracked modifications per sheet',
      'AutoCAD DXF export with named layer structure (EQUIPMENT, PIPING, RECYCLE, PURGE, UTILITY, INSTRUMENT, STREAM_TAG, ANNOTATION, ZONE_A, ZONE_B, SAFETY, TITLE_BLOCK)',
      'SVG source export for downstream design iteration',
    ],
    findings: [
      'PSV placement on Sheet 06 required vertical relief line adjustment to clear title bar — corrected in Rev C',
      'Vapor overhead routing on Sheet 04 required element repositioning to resolve y-axis crowding at title bar boundary',
      'DXF layer structure maps cleanly to AutoCAD Plant 3D and SmartPlant for future detail-design development',
      'All 7 sheets delivered as real CAD entities (LINE / CIRCLE / LWPOLYLINE / TEXT) — text editable, not raster',
    ],
    outcome: 'Rev C PDF package (7 sheets) plus DXF/SVG CAD bundle (all 7 sheets, all formats) delivered. Package is production-ready for ISA-5.1 compliant submission and fully compatible with AutoCAD Plant 3D for further development. Revision history locked; next revision cycle would begin from the DXF source.',
    deliverables: '7-sheet P&ID package PDF (Rev C), DXF + SVG CAD bundle (all 7 sheets), revision record',
    standards: ['ISA-5.1', 'AutoCAD R12 DXF (ASCII format)'],
  },
  {
    ref: 'BALENG-003',
    year: '2025',
    client: 'Aqualink',
    country: 'Europe',
    sector: 'Industrial Instrumentation',
    discipline: 'Flow Meter Calibration',
    title: 'Fleet Flow Meter Calibration Recovery — FE Series (DN100–DN300)',
    brief: 'Aqualink required calibration analysis and corrected AQ formulas for four customer-site flow meters that were producing unacceptable measurement errors. Pre-engagement errors ranged from 2% (near-acceptable) to 292% (systematically wrong). All units needed to be recovered to within the 3–5% DMA acceptance threshold without hardware replacement.',
    methodology: [
      'Gravimetric test data analysis — 12 test points per unit, spanning laminar through turbulent regime and across polynomial-phase boundaries',
      'AQ/observed ratio calculation at each test point to establish error pattern per unit',
      'Coefficient of variation (CV) analysis across test points — flat CV confirms scalar offset signature (not curve distortion)',
      'Trim factor derivation: trim = 1 / mean(AQ/observed ratio)',
      'Post-trim RMSE and maximum |error| prediction for each unit',
      'Root cause classification: per-unit manufacturing tolerance (461/150FE), product-line polynomial defect (617/300FE), T-piece branch fraction effect (626/100FE and 584/200FE)',
      'Identification of probable 300FE product-line defect: missing /4 in area term Pow(0.3,2)*π vs correct π*D²/4 — 4× factor consistent with observed 3.91× error',
      'Corrected AQ formulas built as single-line expressions with trim scalar wrapper preserving original polynomial architecture',
    ],
    findings: [
      '461/150FE (DN150 straight): pre-trim RMSE 2.02%, trim 1.0199, post-trim RMSE 0.51% — normal manufacturing spread, no defect',
      '617/300FE (DN300 straight): pre-trim RMSE 291.81%, ratio 3.918 — same pattern as second 300FE unit in fleet. Consistent with missing /4 in area calculation. Trim 0.2552, post-trim RMSE 0.28%',
      '626/100FE T-piece (DN100): reads 40% of true flow — classic T-piece branch-split under-read. Trim 2.4938, post-trim RMSE 0.29%',
      '584/200FE T-piece (DN200): reads 174% of true flow — opposite T-piece bias from 626. Trim 0.5747, post-trim RMSE 0.99%',
      'CV of AQ/observed ratio across 12 test points: 0.3–1.0% per unit — confirms scalar trim is the correct and complete fix',
      'T-piece trims are site-specific and do not transfer to other T-piece installations of the same model',
    ],
    outcome: 'All four units recovered to within Aqualink\'s 3–5% DMA acceptance threshold. Corrected AQ formulas delivered as copy-paste-ready single-line expressions plus structured plain-text versions for engineering audit. Engineering cover note delivered to client with root cause analysis and recommendation to investigate 300FE polynomial generator for the area-term defect.',
    deliverables: '4 trimmed AQ formula files (copy-paste-only format), 4 plain-text audit versions, engineering cover note (PDF), validation CSV',
    standards: ['OIML R 49', 'ISO 4064', 'Aqualink internal DMA acceptance criteria (3–5%)'],
  },
];

const FILTERS = ['All', 'Hydraulics', 'P&ID Design', 'Flow Meter Calibration'];

export default function BCProjectsPage() {
  const [active, setActive] = useState('All');
  const [expanded, setExpanded] = useState(null);
  const filtered = active === 'All' ? PROJECTS : PROJECTS.filter(p => p.discipline === active);

  return (
    <div style={{ background: BG, minHeight: '100vh', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>
      <BCNav />

      {/* Hero */}
      <section style={{ padding: '140px 6vw 80px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <FadeUp>
          <p style={{ fontFamily: 'Courier New, monospace', fontSize: '0.62rem', letterSpacing: '0.18em', color: LIME, textTransform: 'uppercase', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ display: 'inline-block', width: 24, height: 1, background: LIME }} />
            Selected Projects
          </p>
          <h1 style={{ fontSize: 'clamp(2.6rem, 7vw, 5.5rem)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.035em', marginBottom: 24, maxWidth: 900 }}>
            Rigorous work.<br /><span style={{ color: LIME }}>Verifiable results.</span>
          </h1>
          <p style={{ fontSize: 'clamp(1rem, 2vw, 1.2rem)', color: 'rgba(255,255,255,0.5)', maxWidth: 580, lineHeight: 1.7 }}>
            Every project listed here has a reference number, a documented methodology, and explicit outcome data. Engineering confidence comes from showing your work.
          </p>
        </FadeUp>
      </section>

      {/* Filter */}
      <div style={{ padding: '32px 6vw', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {FILTERS.map(f => (
          <button key={f} onClick={() => setActive(f)} style={{
            padding: '8px 18px', border: '1px solid',
            borderColor: active === f ? LIME : 'rgba(255,255,255,0.12)',
            background: active === f ? LIME : 'transparent',
            color: active === f ? '#0a0a0e' : 'rgba(255,255,255,0.5)',
            fontFamily: 'Courier New, monospace', fontSize: '0.6rem',
            letterSpacing: '0.12em', textTransform: 'uppercase',
            cursor: 'pointer', borderRadius: 2, transition: 'all 0.2s',
          }}>
            {f}
          </button>
        ))}
      </div>

      {/* Projects */}
      <section style={{ padding: '0 6vw 96px' }}>
        {filtered.map((p, i) => (
          <FadeUp key={p.ref} delay={i * 0.05}>
            <div
              style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', cursor: 'pointer' }}
              onClick={() => setExpanded(expanded === p.ref ? null : p.ref)}
            >
              {/* Header row */}
              <div style={{ padding: '40px 0', display: 'grid', gridTemplateColumns: '1fr auto', gap: 24, alignItems: 'start' }}>
                <div>
                  <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap', marginBottom: 14 }}>
                    <span style={{ fontFamily: 'Courier New, monospace', fontSize: '0.58rem', letterSpacing: '0.14em', color: 'rgba(200,241,53,0.6)' }}>{p.ref}</span>
                    <span style={{ fontFamily: 'Courier New, monospace', fontSize: '0.55rem', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.3)' }}>{p.sector}</span>
                    <span style={{ fontFamily: 'Courier New, monospace', fontSize: '0.55rem', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.25)' }}>{p.country} · {p.year}</span>
                  </div>
                  <h2 style={{ fontSize: 'clamp(1.1rem, 2.2vw, 1.6rem)', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 10, lineHeight: 1.3 }}>{p.title}</h2>
                  <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.6, maxWidth: 720 }}>{p.brief}</p>
                </div>
                <span style={{ fontFamily: 'Courier New, monospace', fontSize: '1.1rem', color: LIME, transition: 'transform 0.3s', transform: expanded === p.ref ? 'rotate(45deg)' : 'none', display: 'block', marginTop: 4 }}>+</span>
              </div>

              {/* Expanded */}
              {expanded === p.ref && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: EASE }}
                  style={{ paddingBottom: 48 }}
                >
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', marginBottom: 36 }} className="bc-expand-grid">
                    {/* Methodology */}
                    <div>
                      <p style={{ fontFamily: 'Courier New, monospace', fontSize: '0.58rem', letterSpacing: '0.14em', color: LIME, textTransform: 'uppercase', marginBottom: 16 }}>// methodology</p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {p.methodology.map((m, j) => (
                          <p key={j} style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'flex-start', gap: 10, lineHeight: 1.6 }}>
                            <span style={{ color: LIME, flexShrink: 0, marginTop: 2, fontFamily: 'Courier New, monospace', fontSize: '0.6rem' }}>{String(j+1).padStart(2,'0')}.</span> {m}
                          </p>
                        ))}
                      </div>
                    </div>
                    {/* Findings */}
                    <div>
                      <p style={{ fontFamily: 'Courier New, monospace', fontSize: '0.58rem', letterSpacing: '0.14em', color: LIME, textTransform: 'uppercase', marginBottom: 16 }}>// key findings</p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {p.findings.map((f, j) => (
                          <p key={j} style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.55)', display: 'flex', alignItems: 'flex-start', gap: 10, lineHeight: 1.6 }}>
                            <span style={{ color: LIME, flexShrink: 0, marginTop: 2 }}>→</span> {f}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Outcome + Standards */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', padding: '28px', background: 'rgba(200,241,53,0.03)', border: '1px solid rgba(200,241,53,0.1)', borderRadius: 3 }} className="bc-outcome-grid">
                    <div>
                      <p style={{ fontFamily: 'Courier New, monospace', fontSize: '0.58rem', letterSpacing: '0.14em', color: LIME, textTransform: 'uppercase', marginBottom: 10 }}>// outcome</p>
                      <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, marginBottom: 12 }}>{p.outcome}</p>
                      <p style={{ fontFamily: 'Courier New, monospace', fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', lineHeight: 1.5 }}><span style={{ color: LIME }}>Deliverables: </span>{p.deliverables}</p>
                    </div>
                    <div>
                      <p style={{ fontFamily: 'Courier New, monospace', fontSize: '0.58rem', letterSpacing: '0.14em', color: LIME, textTransform: 'uppercase', marginBottom: 10 }}>// standards cited</p>
                      {p.standards.map(s => (
                        <p key={s} style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginBottom: 4, lineHeight: 1.4, fontFamily: 'Courier New, monospace', letterSpacing: '0.04em' }}>{s}</p>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </FadeUp>
        ))}
      </section>

      {/* CTA */}
      <section style={{ padding: '64px 6vw 96px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <FadeUp>
          <p style={{ fontFamily: 'Courier New, monospace', fontSize: '0.62rem', letterSpacing: '0.16em', color: LIME, marginBottom: 16 }}>// your project next</p>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 32, maxWidth: 600 }}>
            Bring us a problem that needs real engineering.
          </h2>
          <a href="mailto:admin@baltar.ca" style={{
            display: 'inline-block', padding: '16px 36px',
            background: LIME, color: '#0a0a0e',
            fontFamily: 'Courier New, monospace', fontSize: '0.68rem',
            letterSpacing: '0.14em', textTransform: 'uppercase',
            fontWeight: 700, textDecoration: 'none', borderRadius: 2,
          }}>
            Start a Conversation →
          </a>
        </FadeUp>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .bc-expand-grid { grid-template-columns: 1fr !important; }
          .bc-outcome-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
