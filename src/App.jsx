import { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';

// ═══════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════

const ACCENT = '#FF7A1A';
const CARD   = '#121212';
const BG     = '#000000';
const MUTED  = '#888888';
const GREEN  = '#4ade80';
const YELLOW = '#eab308';
const BLUE   = '#60a5fa';
const RED    = '#ef4444';

const I_COLORS   = { full: GREEN, reduced: YELLOW, deload: BLUE };
const DAY_COLORS = { strength: ACCENT, hypertrophy: '#a78bfa', cardio: '#22d3ee', hiit: '#f43f5e' };

const REST_SECS = { strength: 90, hypertrophy: 60 };

const PROGRAM = [
  {
    id: 'D1', type: 'strength', icon: '🏋️',
    ar: 'قوة — Full Body A', en: 'Strength — Full Body A',
    exercises: [
      { name: 'Squat / Leg Press', sets: 4, reps: 5 },
      { name: 'Bench Press',       sets: 4, reps: 5 },
      { name: 'Row',               sets: 4, reps: 6 },
      { name: 'RDL',               sets: 3, reps: 8 },
      { name: 'Shoulder Press',    sets: 3, reps: 8 },
      { name: 'Calf Raise',        sets: 3, reps: 15 },
      { name: 'Plank',             sets: 3, hold: 30 },
    ],
  },
  {
    id: 'D2', type: 'cardio', icon: '🚶',
    ar: 'كارديو — Zone 2', en: 'Cardio — Zone 2',
    descAr: 'مشي مائل · دراجة · رواحة',
    descEn: 'Incline Walk · Bike · Elliptical',
    range: [40, 60],
  },
  {
    id: 'D3', type: 'hypertrophy', icon: '💪',
    ar: 'تضخيم — Full Body B', en: 'Hypertrophy — Full Body B',
    exercises: [
      { name: 'Leg Press',             sets: 4, reps: 10 },
      { name: 'Incline Press',         sets: 4, reps: 10 },
      { name: 'Lat Pulldown',          sets: 4, reps: 10 },
      { name: 'Bulgarian Split Squat', sets: 3, reps: 10, perSide: true },
      { name: 'Lateral Raise',         sets: 3, reps: 15 },
      { name: 'Face Pull',             sets: 3, reps: 15 },
      { name: 'Curl',                  sets: 3, reps: 12 },
      { name: 'Pushdown',              sets: 3, reps: 12 },
      { name: 'Pallof Press',          sets: 3, reps: 12, perSide: true },
    ],
  },
  {
    id: 'D4', type: 'hiit', icon: '🏃',
    ar: 'VO2 Max — انترفال', en: 'VO2 Max Intervals',
    descAr: 'جري سريع / مشي متقطع',
    descEn: 'Fast Run / Walk Intervals',
    range: [20, 30],
  },
];

const STR = {
  ar: {
    app: 'Hybrid Athletic',
    today: 'اليوم', start: 'ابدأ الجلسة', skip: 'تخطّ',
    history: 'السجل', back: 'رجوع',
    checkIn: 'الحال قبل الجلسة',
    checkInSub: 'بناءً على إجاباتك نحدد شدة الجلسة تلقائياً',
    energy: 'الطاقة',
    eLow: 'منخفض', eMed: 'متوسط', eHigh: 'مرتفع',
    soreness: 'ألم عضلي',
    sNone: 'ما في', sMed: 'معقول', sHigh: 'كثير',
    injury: 'إصابة أو وجع حاد؟', where: 'وين الوجع؟',
    yes: 'نعم', no: 'لا',
    intensityLabel: 'شدة الجلسة',
    full: 'كامل', reduced: 'مخفف', deload: 'خفيف',
    startNow: 'ابدأ الآن',
    kg: 'كغ', prev: 'آخر مرة', hold: 'ث ثبّت', perSide: 'لكل جانب',
    finishSession: 'إنهِ الجلسة',
    cardioTarget: 'الهدف', finish: 'خلصت',
    great: '🔥 عاش!', sessionDone: 'انتهت الجلسة',
    nextUp: 'الجلسة الجاية', home: 'الرئيسية',
    total: 'مجموع الجلسات', notes: 'ملاحظات', ph: 'أضف ملاحظة...',
    noHist: 'ما في جلسات بعد',
    skipped: 'متخطية', completed: 'مكتملة',
    min: 'دقيقة', timer: 'المؤقت', sessions: 'جلسة',
    restDay: 'يوم راحة',
    sets: 'سيتات', reps: 'تكرار',
    intensityFull:    'الشدة كاملة — الجلسة كاملة بالسيتات والأوزان',
    intensityReduced: 'الشدة مخففة — سيت أقل لكل تمرين',
    intensityDeload:  'شدة خفيفة — سيتين فقط بأوزان أقل',
    restTimer: 'راحة', skipRest: 'تخطّ',
    progress: 'التقدم', pr: 'الرقم القياسي', noData: 'ما في بيانات بعد',
    noDataSub: 'أكمل جلسة واحدة على الأقل لترى الرسم البياني',
    lastWeight: 'آخر وزن', change: 'التغيير', navHome: 'الرئيسية',
    navProgress: 'التقدم', navHistory: 'السجل', recent: 'آخر الجلسات',
  },
  en: {
    app: 'Hybrid Athletic',
    today: 'Today', start: 'Start Session', skip: 'Skip',
    history: 'History', back: 'Back',
    checkIn: 'Pre-Workout Check-in',
    checkInSub: 'Session intensity is automatically set based on your answers',
    energy: 'Energy',
    eLow: 'Low', eMed: 'Medium', eHigh: 'High',
    soreness: 'Muscle Soreness',
    sNone: 'None', sMed: 'Moderate', sHigh: 'High',
    injury: 'Any injury or sharp pain?', where: 'Where is the pain?',
    yes: 'Yes', no: 'No',
    intensityLabel: 'Session Intensity',
    full: 'Full', reduced: 'Reduced', deload: 'Deload',
    startNow: 'Start Now',
    kg: 'kg', prev: 'Last', hold: 's hold', perSide: 'per side',
    finishSession: 'Complete Session',
    cardioTarget: 'Target', finish: 'Finish',
    great: '🔥 Great Work!', sessionDone: 'Session Complete',
    nextUp: 'Next Up', home: 'Home',
    total: 'Total Sessions', notes: 'Notes', ph: 'Add a note...',
    noHist: 'No sessions yet',
    skipped: 'Skipped', completed: 'Completed',
    min: 'min', timer: 'Timer', sessions: 'sessions',
    restDay: 'Rest Day',
    sets: 'Sets', reps: 'Reps',
    intensityFull:    'Full intensity — complete program as written',
    intensityReduced: 'Reduced — one fewer set per exercise',
    intensityDeload:  'Deload — 2 sets per exercise at lower weight',
    restTimer: 'Rest', skipRest: 'Skip',
    progress: 'Progress', pr: 'PR', noData: 'No data yet',
    noDataSub: 'Complete at least one session to see your chart',
    lastWeight: 'Last Weight', change: 'Change', navHome: 'Home',
    navProgress: 'Progress', navHistory: 'History', recent: 'Recent Sessions',
  },
};

// ═══════════════════════════════════════════════════════════════
// UTILS
// ═══════════════════════════════════════════════════════════════

const uid      = () => Math.random().toString(36).slice(2) + Date.now().toString(36).slice(-4);
const todayStr = () => new Date().toISOString().split('T')[0];
const fmtSecs  = n  => `${String(Math.floor(n / 60)).padStart(2, '0')}:${String(n % 60).padStart(2, '0')}`;

function calcIntensity(energy, soreness, injury) {
  if (injury) return 'deload';
  const base = ['deload', 'reduced', 'full'][energy - 1];
  if (soreness === 3 && base === 'full')    return 'reduced';
  if (soreness === 3 && base === 'reduced') return 'deload';
  return base;
}

function applyIntensity(exercises, intensity) {
  return exercises.map(ex => ({
    ...ex,
    sets: intensity === 'deload'  ? 2
        : intensity === 'reduced' ? Math.max(2, ex.sets - 1)
        : ex.sets,
  }));
}

function loadData() {
  try { return JSON.parse(localStorage.getItem('ha_v1')); } catch { return null; }
}

function saveData(d) {
  localStorage.setItem('ha_v1', JSON.stringify(d));
}

function buildWeightHistory(sessions) {
  // returns { exerciseName: [{date, weight}] } oldest→newest
  const map = {};
  const sorted = [...sessions].filter(s => s.status === 'completed' && s.exercises).reverse();
  sorted.forEach(s => {
    s.exercises.forEach(ex => {
      const w = Number(ex.weight);
      if (!ex.hold && w > 0) {
        if (!map[ex.name]) map[ex.name] = [];
        // avoid duplicate date
        const last = map[ex.name][map[ex.name].length - 1];
        if (!last || last.date !== s.date) {
          map[ex.name].push({ date: s.date, weight: w });
        }
      }
    });
  });
  return map;
}

const INIT_DATA = { di: 0, sessions: [], weights: {} };

// ═══════════════════════════════════════════════════════════════
// LINE CHART (SVG, no external libs)
// ═══════════════════════════════════════════════════════════════

function LineChart({ points, color = ACCENT }) {
  if (!points || points.length < 2) return null;
  const W = 300, H = 130;
  const PL = 42, PR = 12, PT = 20, PB = 28;
  const iW = W - PL - PR;
  const iH = H - PT - PB;

  const weights = points.map(p => p.weight);
  const minW = Math.min(...weights);
  const maxW = Math.max(...weights);
  const range = maxW - minW || 1;

  const cx = (i) => PL + (i / (points.length - 1)) * iW;
  const cy = (w) => PT + (1 - (w - minW) / range) * iH;

  const polyline = points.map((p, i) => `${cx(i)},${cy(p.weight)}`).join(' ');

  // area fill path
  const area = `M${cx(0)},${cy(points[0].weight)} ` +
    points.slice(1).map((p, i) => `L${cx(i + 1)},${cy(p.weight)}`).join(' ') +
    ` L${cx(points.length - 1)},${PT + iH} L${cx(0)},${PT + iH} Z`;

  // Y-axis labels (3 ticks)
  const yTicks = [minW, (minW + maxW) / 2, maxW].map(v => Math.round(v));

  // X-axis: show first, last, and mid if 3+ points
  const xIdxs = points.length >= 3
    ? [0, Math.floor((points.length - 1) / 2), points.length - 1]
    : [0, points.length - 1];
  const uniqueX = [...new Set(xIdxs)];

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Grid lines */}
      {[0, 0.5, 1].map(t => (
        <line key={t}
          x1={PL} x2={PL + iW}
          y1={PT + t * iH} y2={PT + t * iH}
          stroke="#222" strokeWidth="1"
        />
      ))}

      {/* Y labels */}
      {yTicks.map((v, i) => (
        <text key={i}
          x={PL - 6} y={PT + (1 - i * 0.5) * iH + 4}
          textAnchor="end" fill={MUTED} fontSize="10"
        >{v}</text>
      ))}

      {/* Area fill */}
      <path d={area} fill="url(#areaGrad)" />

      {/* Line */}
      <polyline points={polyline} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" />

      {/* Dots + weight labels */}
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={cx(i)} cy={cy(p.weight)} r="4" fill={color} />
          <text x={cx(i)} y={cy(p.weight) - 8} textAnchor="middle" fill="#fff" fontSize="9">
            {p.weight}
          </text>
        </g>
      ))}

      {/* X-axis date labels */}
      {uniqueX.map(i => (
        <text key={i}
          x={cx(i)} y={H - 4}
          textAnchor={i === 0 ? 'start' : i === points.length - 1 ? 'end' : 'middle'}
          fill={MUTED} fontSize="9"
        >{points[i].date.slice(5)}</text>
      ))}
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════
// PROGRESS SCREEN
// ═══════════════════════════════════════════════════════════════

function ProgressScreen({ data, t, dir, lang, onBack, setLang }) {
  const history = buildWeightHistory(data.sessions);
  const exercises = Object.keys(history).filter(k => history[k].length > 0);
  const [sel, setSel] = useState(exercises[0] ?? null);

  const points = sel ? history[sel] : [];
  const weights = points.map(p => p.weight);
  const pr     = weights.length ? Math.max(...weights) : null;
  const last   = weights.length ? weights[weights.length - 1] : null;
  const first  = weights.length ? weights[0] : null;
  const change = (last != null && first != null) ? last - first : null;

  return (
    <div style={{ minHeight: '100vh', background: BG, color: '#fff', fontFamily: "'Tajawal', sans-serif", direction: dir }}>
      <Header title={t.progress} onBack={onBack} lang={lang} setLang={setLang} />
      <div style={{ padding: '16px 16px 100px' }}>

        {exercises.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📊</div>
            <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>{t.noData}</div>
            <div style={{ fontSize: 13, color: MUTED }}>{t.noDataSub}</div>
          </div>
        ) : (
          <>
            {/* Exercise chip selector */}
            <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4, marginBottom: 16 }}>
              {exercises.map(ex => {
                const active = ex === sel;
                return (
                  <button key={ex} onClick={() => setSel(ex)} style={{
                    flexShrink: 0, padding: '8px 14px', borderRadius: 20,
                    border: `2px solid ${active ? ACCENT : '#2a2a2a'}`,
                    background: active ? ACCENT + '22' : '#111',
                    color: active ? ACCENT : MUTED,
                    fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                    whiteSpace: 'nowrap',
                  }}>{ex}</button>
                );
              })}
            </div>

            {sel && (
              <>
                {/* Stats row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 14 }}>
                  {[
                    { label: t.pr,         val: pr,     unit: 'kg', color: ACCENT },
                    { label: t.lastWeight,  val: last,   unit: 'kg', color: '#fff' },
                    {
                      label: t.change,
                      val: change != null ? (change > 0 ? `+${change}` : change) : '—',
                      unit: change != null ? 'kg' : '',
                      color: change == null ? MUTED : change > 0 ? GREEN : change < 0 ? RED : MUTED,
                    },
                  ].map(({ label, val, unit, color }) => (
                    <div key={label} style={{ background: CARD, borderRadius: 12, padding: '12px 8px', textAlign: 'center' }}>
                      <div style={{ fontSize: 20, fontWeight: 800, color }} dir="ltr">
                        {val ?? '—'}{val != null && unit ? ` ${unit}` : ''}
                      </div>
                      <div style={{ fontSize: 11, color: MUTED, marginTop: 2 }}>{label}</div>
                    </div>
                  ))}
                </div>

                {/* Chart */}
                <div style={{ background: CARD, borderRadius: 16, padding: '16px 12px 12px', marginBottom: 14 }}>
                  {points.length >= 2
                    ? <LineChart points={points} color={ACCENT} />
                    : <div style={{ textAlign: 'center', color: MUTED, fontSize: 13, padding: '24px 0' }}>
                        {t.noDataSub}
                      </div>
                  }
                </div>

                {/* Per-session list */}
                <div style={{ fontSize: 13, fontWeight: 700, color: MUTED, marginBottom: 8 }}>{t.recent}</div>
                {[...points].reverse().map((p, i) => {
                  const isPR = p.weight === pr;
                  return (
                    <div key={i} style={{
                      background: CARD, borderRadius: 12, padding: '12px 14px', marginBottom: 8,
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    }}>
                      <div style={{ fontSize: 12, color: MUTED }} dir="ltr">{p.date}</div>
                      <div style={{ fontSize: 15, fontWeight: 700 }} dir="ltr">
                        {isPR && <span style={{ color: ACCENT, marginInlineEnd: 6 }}>🏆</span>}
                        {p.weight} kg
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// REST TIMER BANNER
// ═══════════════════════════════════════════════════════════════

function RestTimerBanner({ secs, total, onSkip, t, dir }) {
  const urgent   = secs <= 10 && secs > 0;
  const pct      = total > 0 ? secs / total : 0;

  return (
    <div style={{
      position: 'fixed', bottom: 68, left: 0, right: 0, zIndex: 50,
      background: '#0e0e0e',
      border: `1px solid ${urgent ? ACCENT : '#2a2a2a'}`,
      borderRadius: '16px 16px 0 0',
      padding: '12px 16px 14px',
      transition: 'border-color .3s',
      direction: dir,
    }}>
      {/* Progress bar */}
      <div style={{ height: 3, background: '#222', borderRadius: 4, marginBottom: 10, overflow: 'hidden' }}>
        <div style={{
          height: '100%', borderRadius: 4,
          background: urgent ? RED : ACCENT,
          width: `${pct * 100}%`,
          transition: 'width 1s linear, background .3s',
        }} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 11, color: MUTED, marginBottom: 2 }}>{t.restTimer}</div>
          <div style={{
            fontSize: 28, fontWeight: 800,
            color: urgent ? RED : '#fff',
            fontVariantNumeric: 'tabular-nums',
            letterSpacing: -1,
            transition: 'color .3s',
          }} dir="ltr">
            {fmtSecs(secs)}
          </div>
        </div>
        <button onClick={onSkip} style={{
          background: '#1e1e1e', border: '1px solid #333',
          borderRadius: 10, padding: '8px 18px',
          color: MUTED, fontSize: 14, fontWeight: 700,
          cursor: 'pointer', fontFamily: 'inherit',
        }}>
          {t.skipRest}
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// BOTTOM NAV
// ═══════════════════════════════════════════════════════════════

const NAV_TABS = [
  { key: 'home',     icon: '🏠', labelKey: 'navHome' },
  { key: 'progress', icon: '📊', labelKey: 'navProgress' },
  { key: 'history',  icon: '📋', labelKey: 'navHistory' },
];

function BottomNav({ screen, onGo, t }) {
  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      height: 60, background: '#0a0a0a',
      borderTop: '1px solid #1a1a1a',
      display: 'flex', alignItems: 'center',
      zIndex: 40,
    }}>
      {NAV_TABS.map(tab => {
        const active = screen === tab.key;
        return (
          <button key={tab.key} onClick={() => onGo(tab.key)} style={{
            flex: 1, height: '100%', background: 'none', border: 'none',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', gap: 2,
            color: active ? ACCENT : MUTED,
          }}>
            <span style={{ fontSize: 20 }}>{tab.icon}</span>
            <span style={{ fontSize: 10, fontWeight: 700, fontFamily: "'Tajawal', sans-serif" }}>
              {t[tab.labelKey]}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SHARED UI
// ═══════════════════════════════════════════════════════════════

function Tag({ text, color = ACCENT }) {
  return (
    <span style={{
      display: 'inline-block', padding: '3px 10px', borderRadius: 20,
      fontSize: 12, fontWeight: 700,
      background: color + '28', color,
    }}>{text}</span>
  );
}

function Btn({ children, onClick, variant = 'primary', disabled, style: st }) {
  const bg  = variant === 'primary' ? ACCENT : variant === 'ghost' ? 'transparent' : '#1e1e1e';
  const clr = variant === 'primary' ? '#000'  : variant === 'danger' ? RED : '#fff';
  return (
    <button onClick={onClick} disabled={disabled} style={{
      display: 'block', width: '100%', padding: '15px 20px', borderRadius: 12, border: 'none',
      fontSize: 16, fontWeight: 700, cursor: disabled ? 'default' : 'pointer',
      fontFamily: 'inherit', marginBottom: 8, background: bg, color: clr,
      opacity: disabled ? 0.45 : 1, transition: 'opacity .15s',
      ...st,
    }}>{children}</button>
  );
}

function Header({ title, onBack, lang, setLang }) {
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  return (
    <div style={{
      padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 10,
      borderBottom: '1px solid #1a1a1a', position: 'sticky', top: 0,
      background: BG, zIndex: 10,
    }}>
      {onBack && (
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: MUTED, fontSize: 22, cursor: 'pointer', padding: '2px 6px', lineHeight: 1 }}>
          {dir === 'rtl' ? '→' : '←'}
        </button>
      )}
      <span style={{ fontWeight: 700, fontSize: 17, flex: 1 }}>{title}</span>
      <button onClick={() => setLang(l => l === 'ar' ? 'en' : 'ar')} style={{
        background: '#1a1a1a', border: 'none', color: MUTED, padding: '5px 11px',
        borderRadius: 8, cursor: 'pointer', fontSize: 12, fontFamily: 'inherit', fontWeight: 700,
      }}>
        {lang === 'ar' ? 'EN' : 'ع'}
      </button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// CARDIO SCREEN
// ═══════════════════════════════════════════════════════════════

function CardioScreen({ t, dir, dayDef, lang, onFinish, onBack, setLang }) {
  const [secs, setSecs]       = useState(0);
  const [running, setRunning] = useState(false);
  const timerRef              = useRef(null);

  useEffect(() => {
    if (running) {
      timerRef.current = setInterval(() => setSecs(s => s + 1), 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [running]);

  const elapsedMin = Math.floor(secs / 60);
  const target     = dayDef.range?.[0] ?? 20;
  const reached    = elapsedMin >= target;

  return (
    <div style={{ minHeight: '100vh', background: BG, color: '#fff', fontFamily: "'Tajawal', sans-serif", direction: dir }}>
      <Header title={lang === 'ar' ? dayDef.ar : dayDef.en} onBack={onBack} lang={lang} setLang={setLang} />
      <div style={{ padding: '32px 24px 80px', textAlign: 'center' }}>
        <div style={{ fontSize: 15, color: MUTED, marginBottom: 6 }}>
          {lang === 'ar' ? dayDef.descAr : dayDef.descEn}
        </div>
        {dayDef.range && (
          <div style={{ fontSize: 13, color: MUTED, marginBottom: 40 }}>
            {t.cardioTarget}: {dayDef.range[0]}–{dayDef.range[1]} {t.min}
          </div>
        )}
        <div style={{
          fontSize: 72, fontWeight: 800, letterSpacing: -2,
          color: reached ? GREEN : '#fff',
          marginBottom: 8, fontVariantNumeric: 'tabular-nums',
          transition: 'color .4s',
        }} dir="ltr">
          {fmtSecs(secs)}
        </div>
        <div style={{ fontSize: 13, color: MUTED, marginBottom: 48 }}>{t.timer}</div>
        <button onClick={() => setRunning(r => !r)} style={{
          width: 88, height: 88, borderRadius: '50%',
          border: `3px solid ${running ? RED : ACCENT}`,
          background: running ? RED + '22' : ACCENT + '22',
          color: running ? RED : ACCENT,
          fontSize: 30, cursor: 'pointer', marginBottom: 48,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {running ? '⏸' : '▶'}
        </button>
        <Btn onClick={onFinish} style={{ background: reached ? ACCENT : '#1e1e1e', color: reached ? '#000' : '#fff' }}>
          {t.finish}
        </Btn>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════

export default function App() {
  const [lang, setLang]     = useState('ar');
  const [screen, setScreen] = useState('home');
  const [data, setData]     = useState(() => loadData() || INIT_DATA);
  const [ci, setCi]         = useState({ e: null, s: null, inj: false, injNote: '' });
  const [session, setSession] = useState(null);
  const [notes, setNotes]   = useState('');

  // Rest timer state
  const [restSecs, setRestSecs]   = useState(0);
  const [restTotal, setRestTotal] = useState(0);
  const [restOn, setRestOn]       = useState(false);
  const restRef                   = useRef(null);

  const t      = STR[lang];
  const dir    = lang === 'ar' ? 'rtl' : 'ltr';
  const dayDef = PROGRAM[data.di % 4];
  const isCardioDay = dayDef.type === 'cardio' || dayDef.type === 'hiit';

  useEffect(() => { saveData(data); }, [data]);
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir  = dir;
  }, [lang, dir]);

  // clear rest timer when leaving workout
  useEffect(() => {
    if (screen !== 'workout') stopRest();
  }, [screen]);

  const go = s => setScreen(s);

  // ─── rest timer ───

  function startRest(secs) {
    clearInterval(restRef.current);
    setRestSecs(secs);
    setRestTotal(secs);
    setRestOn(true);
    restRef.current = setInterval(() => {
      setRestSecs(s => {
        if (s <= 1) {
          clearInterval(restRef.current);
          setRestOn(false);
          navigator.vibrate?.([200, 100, 200]);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  }

  function stopRest() {
    clearInterval(restRef.current);
    setRestOn(false);
  }

  // ─── actions ───

  function doSkip() {
    const s = { id: uid(), date: todayStr(), dayId: dayDef.id, di: data.di % 4, status: 'skipped', ts: Date.now() };
    setData(d => ({ ...d, di: d.di + 1, sessions: [s, ...d.sessions] }));
  }

  function doStartSession() {
    const intensity = calcIntensity(ci.e, ci.s, ci.inj);
    const exercises = dayDef.exercises
      ? applyIntensity(dayDef.exercises, intensity).map(ex => ({
          ...ex,
          weight: data.weights[ex.name] ?? '',
          done: 0,
        }))
      : null;
    setSession({
      id: uid(), date: todayStr(),
      dayId: dayDef.id, di: data.di % 4,
      ci, intensity, exercises, ts: Date.now(),
    });
    setNotes('');
    go(isCardioDay ? 'cardio' : 'workout');
  }

  function doComplete(extra = {}) {
    const ws = { ...data.weights };
    session.exercises?.forEach(ex => {
      if (ex.weight !== '') ws[ex.name] = Number(ex.weight);
    });
    const done = { ...session, ...extra, status: 'completed', notes, endTs: Date.now() };
    setData(d => ({ ...d, di: d.di + 1, sessions: [done, ...d.sessions], weights: ws }));
    setSession(null);
    stopRest();
    go('done');
  }

  function patchEx(i, patch) {
    setSession(s => ({ ...s, exercises: s.exercises.map((e, j) => j === i ? { ...e, ...patch } : e) }));
  }

  function tapSet(exIdx, si) {
    const ex = session.exercises[exIdx];
    if (si < ex.done) {
      // un-tap last completed set
      if (si === ex.done - 1) { patchEx(exIdx, { done: si }); stopRest(); }
    } else {
      patchEx(exIdx, { done: si + 1 });
      // start rest if more sets remain and not a hold exercise
      if (si + 1 < ex.sets && !ex.hold) {
        startRest(REST_SECS[dayDef.type] ?? 60);
      }
    }
  }

  // ─── HOME ───

  if (screen === 'home') {
    const todayDone = data.sessions.some(s => s.date === todayStr());
    const nextDef   = PROGRAM[(data.di + 1) % 4];
    const completed = data.sessions.filter(s => s.status === 'completed');

    return (
      <div style={{ minHeight: '100vh', background: BG, color: '#fff', fontFamily: "'Tajawal', sans-serif", direction: dir }}>
        <Header title={t.app} lang={lang} setLang={setLang} />
        <div style={{ padding: '20px 16px 100px' }}>

          {/* Today card */}
          <div style={{
            background: CARD, borderRadius: 20, padding: 20, marginBottom: 16,
            border: `1px solid ${DAY_COLORS[dayDef.type]}44`,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 12, color: MUTED, marginBottom: 4 }}>{t.today}</div>
                <div style={{ fontSize: 20, fontWeight: 800 }}>
                  {dayDef.icon} {lang === 'ar' ? dayDef.ar : dayDef.en}
                </div>
              </div>
              <Tag text={dayDef.id} color={DAY_COLORS[dayDef.type]} />
            </div>
            <div style={{ fontSize: 13, color: MUTED, lineHeight: 1.7 }}>
              {dayDef.exercises
                ? dayDef.exercises.map(e => e.name).join(' · ')
                : (lang === 'ar' ? dayDef.descAr : dayDef.descEn)}
            </div>
          </div>

          {!todayDone ? (
            <>
              <Btn onClick={() => go('checkin')}>{t.start}</Btn>
              <Btn variant="secondary" onClick={doSkip}>{t.skip}</Btn>
            </>
          ) : (
            <div style={{
              background: GREEN + '18', border: `1px solid ${GREEN}44`,
              borderRadius: 12, padding: '14px 16px',
              textAlign: 'center', color: GREEN, fontWeight: 700, marginBottom: 8, fontSize: 15,
            }}>
              ✓ {t.completed}
            </div>
          )}

          {/* Stats row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, margin: '16px 0' }}>
            {[
              { label: t.total,    val: completed.length },
              { label: t.sessions, val: data.sessions.length },
            ].map(({ label, val }) => (
              <div key={label} style={{ background: CARD, borderRadius: 12, padding: '14px 12px', textAlign: 'center' }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: ACCENT }} dir="ltr">{val}</div>
                <div style={{ fontSize: 12, color: MUTED }}>{label}</div>
              </div>
            ))}
          </div>

          {/* Next up */}
          <div style={{ background: CARD, borderRadius: 12, padding: '12px 16px', marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 11, color: MUTED, marginBottom: 2 }}>{t.nextUp}</div>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{nextDef.icon} {lang === 'ar' ? nextDef.ar : nextDef.en}</div>
            </div>
            <Tag text={nextDef.id} color={DAY_COLORS[nextDef.type]} />
          </div>

          {/* Recent sessions */}
          {data.sessions.length > 0 && (
            <>
              <div style={{ fontSize: 13, fontWeight: 700, color: MUTED, marginBottom: 10 }}>{t.recent}</div>
              {data.sessions.slice(0, 4).map(s => {
                const def    = PROGRAM[s.di];
                const isSkip = s.status === 'skipped';
                return (
                  <div key={s.id} style={{
                    background: CARD, borderRadius: 12, padding: '12px 14px', marginBottom: 8,
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{def?.icon} {lang === 'ar' ? def?.ar : def?.en}</div>
                      <div style={{ fontSize: 11, color: MUTED, marginTop: 2 }} dir="ltr">{s.date}</div>
                    </div>
                    <Tag text={isSkip ? t.skipped : t.completed} color={isSkip ? MUTED : GREEN} />
                  </div>
                );
              })}
            </>
          )}
        </div>
        <BottomNav screen="home" onGo={go} t={t} />
      </div>
    );
  }

  // ─── CHECK-IN ───

  if (screen === 'checkin') {
    const ready     = ci.e !== null && ci.s !== null && ci.inj !== null;
    const intensity = ready ? calcIntensity(ci.e, ci.s, ci.inj) : null;

    const ChoiceRow = ({ label, options, value, onSelect }) => (
      <div style={{ marginBottom: 22 }}>
        <div style={{ fontSize: 13, color: MUTED, fontWeight: 700, marginBottom: 8 }}>{label}</div>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${options.length}, 1fr)`, gap: 8 }}>
          {options.map(({ val, label: lbl, color }) => {
            const sel = value === val;
            return (
              <button key={String(val)} onClick={() => onSelect(val)} style={{
                padding: '13px 6px', borderRadius: 10,
                border: `2px solid ${sel ? (color || ACCENT) : '#2a2a2a'}`,
                background: sel ? (color || ACCENT) + '22' : '#111',
                color: sel ? (color || ACCENT) : '#fff',
                fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit',
                transition: 'all .15s',
              }}>{lbl}</button>
            );
          })}
        </div>
      </div>
    );

    return (
      <div style={{ minHeight: '100vh', background: BG, color: '#fff', fontFamily: "'Tajawal', sans-serif", direction: dir }}>
        <Header title={t.checkIn} onBack={() => go('home')} lang={lang} setLang={setLang} />
        <div style={{ padding: '20px 16px 100px' }}>
          <div style={{ fontSize: 13, color: MUTED, marginBottom: 24, lineHeight: 1.6 }}>{t.checkInSub}</div>

          <ChoiceRow
            label={t.energy} value={ci.e}
            onSelect={e => setCi(c => ({ ...c, e }))}
            options={[
              { val: 1, label: t.eLow, color: RED },
              { val: 2, label: t.eMed, color: YELLOW },
              { val: 3, label: t.eHigh, color: GREEN },
            ]}
          />
          <ChoiceRow
            label={t.soreness} value={ci.s}
            onSelect={s => setCi(c => ({ ...c, s }))}
            options={[
              { val: 1, label: t.sNone, color: GREEN },
              { val: 2, label: t.sMed,  color: YELLOW },
              { val: 3, label: t.sHigh, color: RED },
            ]}
          />

          <div style={{ marginBottom: 22 }}>
            <div style={{ fontSize: 13, color: MUTED, fontWeight: 700, marginBottom: 8 }}>{t.injury}</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {[{ val: false, label: t.no, color: GREEN }, { val: true, label: t.yes, color: RED }].map(({ val, label: lbl, color }) => {
                const sel = ci.inj === val;
                return (
                  <button key={String(val)} onClick={() => setCi(c => ({ ...c, inj: val }))} style={{
                    padding: '13px', borderRadius: 10,
                    border: `2px solid ${sel ? color : '#2a2a2a'}`,
                    background: sel ? color + '22' : '#111',
                    color: sel ? color : '#fff',
                    fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit',
                  }}>{lbl}</button>
                );
              })}
            </div>
            {ci.inj && (
              <input
                placeholder={t.where} value={ci.injNote}
                onChange={e => setCi(c => ({ ...c, injNote: e.target.value }))}
                style={{
                  marginTop: 8, background: '#1a1a1a', border: '1px solid #333',
                  borderRadius: 10, padding: '11px 14px', color: '#fff',
                  fontSize: 14, width: '100%', fontFamily: 'inherit',
                }}
              />
            )}
          </div>

          {intensity && (
            <div style={{
              background: CARD, borderRadius: 14, padding: '14px 16px',
              marginBottom: 20, border: `1px solid ${I_COLORS[intensity]}44`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 14, color: MUTED }}>{t.intensityLabel}</span>
                <Tag text={t[intensity]} color={I_COLORS[intensity]} />
              </div>
              <div style={{ fontSize: 13, color: MUTED }}>
                {t[`intensity${intensity.charAt(0).toUpperCase() + intensity.slice(1)}`]}
              </div>
            </div>
          )}

          {ready && <Btn onClick={doStartSession}>{t.startNow}</Btn>}
        </div>
      </div>
    );
  }

  // ─── WORKOUT (strength / hypertrophy) ───

  if (screen === 'workout' && session?.exercises) {
    const allDone  = session.exercises.every(ex => ex.done >= ex.sets);
    const doneCount = session.exercises.filter(ex => ex.done >= ex.sets).length;
    const pb = restOn ? 148 : 88;   // account for rest banner height + bottom nav

    return (
      <div style={{ minHeight: '100vh', background: BG, color: '#fff', fontFamily: "'Tajawal', sans-serif", direction: dir }}>
        <Header title={lang === 'ar' ? dayDef.ar : dayDef.en} onBack={() => go('home')} lang={lang} setLang={setLang} />
        <div style={{ padding: `16px 16px ${pb}px` }}>

          {/* Tags row */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
            <Tag text={t[session.intensity]} color={I_COLORS[session.intensity]} />
            <Tag text={dayDef.id} color={DAY_COLORS[dayDef.type]} />
            <span style={{ fontSize: 12, color: MUTED, marginInlineStart: 'auto', alignSelf: 'center' }} dir="ltr">
              {doneCount}/{session.exercises.length}
            </span>
          </div>

          {/* Progress bar */}
          <div style={{ height: 3, background: '#1e1e1e', borderRadius: 4, marginBottom: 20 }}>
            <div style={{
              height: '100%', background: ACCENT, borderRadius: 4,
              width: `${(doneCount / session.exercises.length) * 100}%`,
              transition: 'width .3s',
            }} />
          </div>

          {/* Exercise cards */}
          {session.exercises.map((ex, i) => {
            const isHold = !!ex.hold;
            const prevW  = data.weights[ex.name];
            const exDone = ex.done >= ex.sets;

            return (
              <div key={ex.name} style={{
                background: CARD, borderRadius: 16, padding: 16, marginBottom: 10,
                border: `1px solid ${exDone ? GREEN + '44' : '#1e1e1e'}`,
                transition: 'border-color .2s',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 2 }}>{ex.name}</div>
                    <div style={{ fontSize: 12, color: MUTED }} dir="ltr">
                      {ex.sets} × {isHold ? `${ex.hold}${t.hold}` : ex.reps}
                      {ex.perSide ? ` (${t.perSide})` : ''}
                    </div>
                  </div>
                  {exDone && <span style={{ color: GREEN, fontSize: 18 }}>✓</span>}
                </div>

                {!isHold && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <input
                      type="number" inputMode="decimal"
                      value={ex.weight}
                      onChange={e => patchEx(i, { weight: e.target.value })}
                      placeholder="0"
                      style={{
                        background: '#1e1e1e', border: '1px solid #333', borderRadius: 8,
                        padding: '9px 0', color: '#fff', fontSize: 18, fontWeight: 700,
                        width: 72, fontFamily: 'inherit', textAlign: 'center',
                      }}
                      dir="ltr"
                    />
                    <span style={{ fontSize: 13, color: MUTED }}>{t.kg}</span>
                    {prevW != null && (
                      <span style={{ fontSize: 12, color: MUTED, marginInlineStart: 4 }}>
                        {t.prev}: <span dir="ltr">{prevW}</span>{t.kg}
                      </span>
                    )}
                  </div>
                )}

                {/* Set buttons */}
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {Array.from({ length: ex.sets }).map((_, si) => {
                    const isDone = si < ex.done;
                    return (
                      <button key={si} onClick={() => tapSet(i, si)} style={{
                        width: 46, height: 46, borderRadius: 10,
                        border: `2px solid ${isDone ? GREEN : '#333'}`,
                        background: isDone ? GREEN + '22' : '#1a1a1a',
                        color: isDone ? GREEN : MUTED,
                        fontWeight: 800, fontSize: 15, cursor: 'pointer',
                        transition: 'all .15s',
                      }} dir="ltr">{si + 1}</button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          <textarea
            rows={2} placeholder={t.ph} value={notes}
            onChange={e => setNotes(e.target.value)}
            style={{
              background: CARD, border: '1px solid #1e1e1e', borderRadius: 12,
              padding: '12px 14px', color: '#fff', fontSize: 14,
              width: '100%', fontFamily: 'inherit', resize: 'none', marginBottom: 12,
            }}
          />

          <Btn onClick={() => doComplete()} variant={allDone ? 'primary' : 'secondary'}>
            {t.finishSession}
          </Btn>
        </div>

        {/* Rest timer banner */}
        {restOn && (
          <RestTimerBanner secs={restSecs} total={restTotal} onSkip={stopRest} t={t} dir={dir} />
        )}
      </div>
    );
  }

  // ─── CARDIO ───

  if (screen === 'cardio') {
    return (
      <CardioScreen
        t={t} dir={dir} dayDef={dayDef} lang={lang}
        setLang={setLang}
        onBack={() => go('home')}
        onFinish={() => doComplete()}
      />
    );
  }

  // ─── DONE ───

  if (screen === 'done') {
    const nextDef   = PROGRAM[data.di % 4];
    const completed = data.sessions.filter(s => s.status === 'completed');
    const lastS     = data.sessions[0];

    return (
      <div style={{ minHeight: '100vh', background: BG, color: '#fff', fontFamily: "'Tajawal', sans-serif", direction: dir }}>
        <Header title={t.sessionDone} lang={lang} setLang={setLang} />
        <div style={{ padding: '40px 20px 80px', textAlign: 'center' }}>
          <div style={{ fontSize: 56, marginBottom: 12 }}>🎯</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: ACCENT, marginBottom: 6 }}>{t.great}</div>
          <div style={{ fontSize: 14, color: MUTED, marginBottom: 36 }}>{t.sessionDone}</div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
            {[
              { label: t.total,    val: completed.length },
              { label: t.sessions, val: data.sessions.length },
            ].map(({ label, val }) => (
              <div key={label} style={{ background: CARD, borderRadius: 14, padding: '16px 10px', textAlign: 'center' }}>
                <div style={{ fontSize: 30, fontWeight: 800, color: ACCENT }} dir="ltr">{val}</div>
                <div style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </div>

          <div style={{ background: CARD, borderRadius: 14, padding: '14px 18px', marginBottom: 16, textAlign: 'start' }}>
            <div style={{ fontSize: 11, color: MUTED, marginBottom: 6 }}>{t.nextUp}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: 15, fontWeight: 700 }}>{nextDef.icon} {lang === 'ar' ? nextDef.ar : nextDef.en}</div>
              <Tag text={nextDef.id} color={DAY_COLORS[nextDef.type]} />
            </div>
          </div>

          {lastS?.notes && (
            <div style={{ background: CARD, borderRadius: 14, padding: '14px 18px', marginBottom: 16, textAlign: 'start' }}>
              <div style={{ fontSize: 11, color: MUTED, marginBottom: 4 }}>{t.notes}</div>
              <div style={{ fontSize: 14 }}>{lastS.notes}</div>
            </div>
          )}

          <Btn onClick={() => go('home')} style={{ marginTop: 8 }}>{t.home}</Btn>
        </div>
      </div>
    );
  }

  // ─── PROGRESS ───

  if (screen === 'progress') {
    return (
      <ProgressScreen
        data={data} t={t} dir={dir} lang={lang}
        onBack={() => go('home')}
        setLang={setLang}
      />
    );
  }

  // ─── HISTORY ───

  if (screen === 'history') {
    return (
      <div style={{ minHeight: '100vh', background: BG, color: '#fff', fontFamily: "'Tajawal', sans-serif", direction: dir }}>
        <Header title={t.history} onBack={() => go('home')} lang={lang} setLang={setLang} />
        <div style={{ padding: '16px 16px 80px' }}>
          {data.sessions.length === 0 ? (
            <div style={{ textAlign: 'center', color: MUTED, padding: '60px 20px', fontSize: 15 }}>{t.noHist}</div>
          ) : (
            data.sessions.map(s => {
              const def    = PROGRAM[s.di];
              const isSkip = s.status === 'skipped';
              return (
                <div key={s.id} style={{ background: CARD, borderRadius: 14, padding: '14px 16px', marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 2 }}>
                        {def?.icon} {lang === 'ar' ? def?.ar : def?.en}
                      </div>
                      <div style={{ fontSize: 12, color: MUTED }} dir="ltr">{s.date}</div>
                      {s.intensity && (
                        <div style={{ marginTop: 6 }}>
                          <Tag text={t[s.intensity]} color={I_COLORS[s.intensity]} />
                        </div>
                      )}
                    </div>
                    <Tag text={isSkip ? t.skipped : t.completed} color={isSkip ? MUTED : GREEN} />
                  </div>
                  {s.notes && (
                    <div style={{ fontSize: 13, color: MUTED, marginTop: 10, paddingTop: 10, borderTop: '1px solid #1e1e1e' }}>
                      {s.notes}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
        <BottomNav screen="history" onGo={go} t={t} />
      </div>
    );
  }

  return null;
}

// ═══════════════════════════════════════════════════════════════
// ENTRY POINT
// ═══════════════════════════════════════════════════════════════

createRoot(document.getElementById('root')).render(<App />);
