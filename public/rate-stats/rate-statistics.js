const SUPABASE_URL = 'https://qjsvsfrqfnrwzdxtrebb.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFqc3ZzZnJxZm5yd3pkeHRyZWJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwODQ4MzgsImV4cCI6MjA4ODY2MDgzOH0.elMyC9DBlbqkMyojlus019irQwgHI4ma3IklyAOM1vg';

const DEPTS = [
  { id: "HRMU", label: "Human Resource Management Unit", icon: "👥" },
  { id: "PSU", label: "Property & Supply Unit", icon: "💻" },
  { id: "PU", label: "Procurement Unit", icon: "📈" },
  { id: "SU", label: "Security Unit", icon: "📈" },
  { id: "APU", label: "Acute Psychiatry Unit", icon: "📈" },
  { id: "CPU", label: "Child Protection Unit", icon: "📈" },
  { id: "DA", label: "Department of Anesthesia", icon: "📈" },
  { id: "DM", label: "Department of Medicine", icon: "📈" },
  { id: "DO", label: "Department of OB-GYNE", icon: "📈" },
  { id: "DP", label: "Department of Pediatrics", icon: "📈" },
  { id: "DoS", label: "Department of Surgery", icon: "📈" },
  { id: "RCRU", label: "Renal Care Respiratory Unit", icon: "📈" },
  { id: "RCU", label: "Rehabilitation Care Unit", icon: "📈" },
  { id: "DRLRU", label: "Delivery Room & Labor Room Unit", icon: "📈" },
  { id: "MWU", label: "Medical Ward Unit", icon: "📈" },
  { id: "OBWU", label: "OB-Gyne Ward Unit", icon: "📈" },
  { id: "ORU", label: "Operating Room Unit", icon: "📈" },
  { id: "PayU", label: "Payward Unit", icon: "📈" },
  { id: "PWU", label: "Pediatric Ward Unit", icon: "📈" },
  { id: "SWU", label: "Surgery Ward Unit", icon: "📈" },
  { id: "ACLU", label: "Anatomic & Clinical Laboratory Unit", icon: "📈" },
  { id: "BBU", label: "Blood Bank Unit", icon: "📈" },
  { id: "DS", label: "Dental Section", icon: "📈" },
  { id: "HKLU", label: "House Keeping & Laundry Unit", icon: "📈" },
  { id: "JOMU", label: "Janitorial/Orderlies Management Unit", icon: "📈" },
  { id: "MMU", label: "Materials Management Unit", icon: "📈" },
  { id: "EMD", label: "Emergency Medicine Department", icon: "📈" },
  { id: "ABCU", label: "Accounting, Billing & Claims Unit", icon: "📈" },
  { id: "COU", label: "Cash Operations Unit", icon: "📈" },
  { id: "HIMS", label: "Health Information Management Section", icon: "📈" },
  { id: "IHOMPU", label: "Integrated Hospital Operations & Management Program Unit", icon: "📈" },
  { id: "MSW", label: "Medical Social Work", icon: "📈" },
  { id: "NDS", label: "Nutrition & Dietetics Section", icon: "📈" },
  { id: "NSOO", label: "NSO Office", icon: "📈" },
  { id: "ODFM", label: "Outpatient Department/Family Medicine", icon: "📈" },
  { id: "PS", label: "Pharmacy Section", icon: "📈" },
  { id: "QAS", label: "Quality Assurance Section", icon: "📈" },
  { id: "RDS", label: "Radiology & Diagnostic Section", icon: "📈" },
  { id: "AMSU", label: "Anti-Microbial Stewardship Unit", icon: "📈" },
  { id: "CTU", label: "Center for Teens Unit", icon: "📈" },
  { id: "HACU", label: "HIV & AIDS Core Unit", icon: "📈" },
  { id: "HEMU", label: "Health & Environment Management Unit", icon: "📈" },
  { id: "HRPU", label: "High Risk Pregnancy Unit", icon: "📈" },
  { id: "NBSU", label: "New Born Screening Unit", icon: "📈" },
  { id: "RHFPU", label: "Reproductive Health & Family Planning Unit", icon: "📈" },
  { id: "TBDU", label: "TB-Dots Unit", icon: "📈" },
  { id: "WCAK", label: "Wellness Center APE & Konsulta", icon: "📈" },
  { id: "CSRSU", label: "Central Supply Room & Sterilization Unit", icon: "📈" },
  { id: "ICU", label: "Intensive Care Unit", icon: "📈" },
  { id: "IPCU", label: "Infection Prevention & Control Unit", icon: "📈" },
  { id: "NICU", label: "Neonatal Intensive Care Unit", icon: "📈" },
  { id: "PACU", label: "Post Anesthesia Care Unit", icon: "📈" },
  { id: "PRU", label: "Pulmonary/Respiratory Unit", icon: "📈" },
];

const ROLE_EMP_KEYWORD = "employee";
const ROLE_CLI_KEYWORD = "client";

const EMOJIS = ["😭", "😢", "😟", "😕", "😐", "🙂", "😊", "😄", "🤩", "🥳"];
const FC = ["fc-1", "fc-2", "fc-3", "fc-4", "fc-5", "fc-6", "fc-7", "fc-8", "fc-9", "fc-10"];

let sbClient = null;
let allReports = [];
let deptIdx = 0;
let period = "daily";
let slideDir = "r";

// ─── SUPABASE ────────────────────────────────────────────────────────────────
function initSupabase() {
  try { sbClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON); return true; }
  catch (e) { console.error("Supabase init error:", e); return false; }
}

async function loadData() {
  renderStatus("⏳ Loading…", "Fetching ratings from Supabase.");
  if (!sbClient && !initSupabase()) {
    renderStatus("⚠️ Supabase Error", "Supabase could not be initialized. Check your ANON key.");
    return;
  }
  const { data, error } = await sbClient
    .from("table_reports")
    .select("report_id, branch_name, role, rating, created_at")
    .order("report_id", { ascending: false });
  if (error) { console.error("Supabase query error:", error); renderStatus("⚠️ Query Error", error.message); return; }
  allReports = data || [];
  console.log(`Loaded ${allReports.length} report(s):`, allReports);
  render();
}

async function doRefresh() {
  const btn = document.getElementById("refresh-btn");
  if (btn) btn.classList.add("spinning");
  await loadData();
  if (btn) btn.classList.remove("spinning");
}

// ─── FILTER BAR ──────────────────────────────────────────────────────────────
function setFilter(p, btn) {
  period = p;
  document.querySelectorAll(".f-btn").forEach(b => b.classList.remove("active"));
  if (btn) btn.classList.add("active");
  render(false);
}

// ─── DATE HELPERS ────────────────────────────────────────────────────────────
function parseDate(str) {
  if (!str) return new Date(0);
  const d = new Date(str);
  return isNaN(d.getTime()) ? new Date(0) : d;
}

function windowStart(forPeriod) {
  const p = forPeriod || period;
  const now = new Date();
  if (p === "daily") { const d = new Date(now); d.setHours(0, 0, 0, 0); return d; }
  if (p === "monthly") return new Date(now.getFullYear(), now.getMonth(), 1);
  if (p === "yearly") return new Date(now.getFullYear(), 0, 1);
  return new Date(0);
}

function filterByPeriod(rows, forPeriod) {
  const start = windowStart(forPeriod).getTime();
  return rows.filter(r => parseDate(r.created_at).getTime() >= start);
}

// ─── DEPT AUTOCOMPLETE ───────────────────────────────────────────────────────
let filteredDepts = DEPTS.slice();
let acHighlight = 0;
const AC_MAX = 8;

function matchDepts(q) {
  if (!q) return DEPTS.slice();
  const lq = q.toLowerCase();
  return DEPTS.filter(d => d.label.toLowerCase().includes(lq) || d.id.toLowerCase().includes(lq));
}

function highlightMatch(text, query) {
  if (!query) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return text.slice(0, idx) + `<mark>${text.slice(idx, idx + query.length)}</mark>` + text.slice(idx + query.length);
}

function openAC() { }

function closeAC() {
  document.getElementById("ac-dropdown").classList.remove("open");
  const s = document.getElementById("dept-search");
  if (s) s.value = "";
}

function renderAC(query) {
  const drop = document.getElementById("ac-dropdown");
  const results = matchDepts(query);
  acHighlight = 0;
  drop.innerHTML = "";
  if (results.length === 0) { drop.innerHTML = `<div class="ac-more">No departments match "${query}"</div>`; return; }
  results.slice(0, AC_MAX).forEach((d, i) => {
    const item = document.createElement("div");
    item.className = "ac-item" + (i === 0 ? " ac-active" : "");
    item.innerHTML = `<span class="ac-label">${highlightMatch(d.label, query)}</span><span class="ac-id">${d.id}</span>`;
    item.onmousedown = () => selectFromAC(d);
    drop.appendChild(item);
  });
  if (results.length > AC_MAX) {
    const more = document.createElement("div");
    more.className = "ac-more";
    more.textContent = `+${results.length - AC_MAX} more — keep typing to narrow`;
    drop.appendChild(more);
  }
}

function selectFromAC(dept) {
  const newIdx = DEPTS.indexOf(dept);
  slideDir = newIdx > deptIdx ? "r" : "l";
  deptIdx = newIdx;
  filteredDepts = DEPTS.slice();
  closeAC();
  updateDeptChip();
  render(true);
}

function handleACKey(e) {
  const drop = document.getElementById("ac-dropdown");
  const items = drop.querySelectorAll(".ac-item");
  if (!drop.classList.contains("open")) { if (e.key === "ArrowDown" || e.key === "Enter") openAC(); return; }
  if (e.key === "ArrowDown") { e.preventDefault(); acHighlight = Math.min(acHighlight + 1, items.length - 1); items.forEach((el, i) => el.classList.toggle("ac-active", i === acHighlight)); }
  else if (e.key === "ArrowUp") { e.preventDefault(); acHighlight = Math.max(acHighlight - 1, 0); items.forEach((el, i) => el.classList.toggle("ac-active", i === acHighlight)); }
  else if (e.key === "Enter") { e.preventDefault(); const a = drop.querySelector(".ac-item.ac-active"); if (a) a.onmousedown(); }
  else if (e.key === "Escape") { closeAC(); }
}

function filterDepts(query) {
  filteredDepts = matchDepts(query);
  acHighlight = 0;
  const drop = document.getElementById("ac-dropdown");
  const nameEl = document.getElementById("d-name");
  const idxEl = document.getElementById("d-idx");
  if (query) {
    renderAC(query);
    drop.classList.add("open");
    if (filteredDepts.length > 0) {
      if (nameEl) nameEl.textContent = filteredDepts[0].label;
      if (idxEl) idxEl.textContent = `${filteredDepts.length} match${filteredDepts.length !== 1 ? "es" : ""}`;
    } else {
      if (nameEl) nameEl.textContent = "No matches";
      if (idxEl) idxEl.textContent = "0 matches";
    }
  } else {
    drop.classList.remove("open");
    filteredDepts = DEPTS.slice();
    const d = DEPTS[deptIdx];
    if (nameEl) nameEl.textContent = d.label;
    if (idxEl) idxEl.textContent = `${deptIdx + 1} of ${DEPTS.length} · ${d.id}`;
  }
}

function changeDept(dir) {
  slideDir = dir > 0 ? "r" : "l";
  const s = document.getElementById("dept-search");
  if (s) s.value = "";
  filteredDepts = DEPTS.slice();
  closeAC();
  deptIdx = (deptIdx + dir + DEPTS.length) % DEPTS.length;
  updateDeptChip();
  render(true);
}

function updateDeptChip() {
  const d = DEPTS[deptIdx];
  const nameEl = document.getElementById("d-name");
  const idxEl = document.getElementById("d-idx");
  const s = document.getElementById("dept-search");
  if (nameEl) nameEl.textContent = d.label;
  if (idxEl) idxEl.textContent = `${deptIdx + 1} of ${DEPTS.length} · ${d.id}`;
  if (s && !s.value) s.placeholder = "Search departments…";
  const chip = document.getElementById("dept-chip");
  if (!chip) return;
  chip.classList.remove("slide-r", "slide-l");
  void chip.offsetWidth;
  chip.classList.add(slideDir === "r" ? "slide-r" : "slide-l");
}

// ─── RENDER ──────────────────────────────────────────────────────────────────
function render(slide = false) {
  const dept = DEPTS[deptIdx];
  const inWindow = filterByPeriod(allReports);
  const forDept = inWindow.filter(r => String(r.branch_name || "").toLowerCase() === dept.id.toLowerCase());
  const emp = forDept.filter(r => String(r.role || "").toLowerCase().includes(ROLE_EMP_KEYWORD));
  const cli = forDept.filter(r => String(r.role || "").toLowerCase().includes(ROLE_CLI_KEYWORD));
  console.log(`[${dept.id}] period=${period} | inWindow=${inWindow.length} | forDept=${forDept.length} | emp=${emp.length} | cli=${cli.length}`);
  const main = document.getElementById("main");
  if (!main) return;
  if (slide) { main.classList.remove("slide-r", "slide-l"); void main.offsetWidth; main.classList.add(slideDir === "r" ? "slide-r" : "slide-l"); }
  main.innerHTML = "";
  main.appendChild(buildStrip(emp, cli));
  main.appendChild(buildPanels(emp, cli));
  requestAnimationFrame(() => { requestAnimationFrame(() => { document.querySelectorAll(".bar-fill").forEach(bar => { bar.style.height = bar.dataset.target || "0%"; }); }); });
}

function buildStrip(emp, cli) {
  const all = [...emp, ...cli];
  const total = all.length;
  const avg = total ? (all.reduce((s, r) => s + Number(r.rating), 0) / total).toFixed(1) : "—";
  const eAvg = emp.length ? (emp.reduce((s, r) => s + Number(r.rating), 0) / emp.length).toFixed(1) : "—";
  const cAvg = cli.length ? (cli.reduce((s, r) => s + Number(r.rating), 0) / cli.length).toFixed(1) : "—";
  const freq = Array(10).fill(0);
  all.forEach(r => { const v = Number(r.rating); if (v >= 1 && v <= 10) freq[v - 1]++; });
  const domI = freq.indexOf(Math.max(...freq));
  const topLbl = freq[domI] > 0 ? `${domI + 1}/10 ${EMOJIS[domI]}` : "—";
  const strip = document.createElement("div");
  strip.className = "summary-strip fade-in";
  [{ e: "📊", n: total || "0", l: "Total" }, { e: "⭐", n: avg, l: "Overall Avg" }, { e: "👤", n: eAvg, l: "Employee Avg" }, { e: "🤝", n: cAvg, l: "Client Avg" }, { e: "🏆", n: topLbl, l: "Top Score" }].forEach(c => {
    const el = document.createElement("div"); el.className = "s-chip";
    el.innerHTML = `<span class="s-chip-emoji">${c.e}</span><div><div class="s-chip-n">${c.n}</div><div class="s-chip-l">${c.l}</div></div>`;
    strip.appendChild(el);
  });
  return strip;
}

function buildPanels(emp, cli) {
  const frag = document.createDocumentFragment();
  const row = document.createElement("div"); row.className = "panels";
  row.appendChild(buildPanel("emp", "👤 Employee", emp, "col-green"));
  row.appendChild(buildPanel("cli", "🤝 Client", cli, "col-gold"));
  frag.appendChild(row);
  const ovrWrap = document.createElement("div"); ovrWrap.className = "panels-overall";
  ovrWrap.appendChild(buildPanel("ovr", "📊 Overall", [...emp, ...cli], ""));
  frag.appendChild(ovrWrap);
  return frag;
}

function buildPanel(type, label, rows, numColorClass) {
  const total = rows.length;
  const avg = total ? (rows.reduce((s, r) => s + Number(r.rating), 0) / total).toFixed(1) : "—";
  const sorted = rows.map(r => Number(r.rating)).sort((a, b) => a - b);
  const median = sorted.length ? sorted[Math.floor(sorted.length / 2)] : "—";
  const freq = Array(10).fill(0);
  rows.forEach(r => { const v = Number(r.rating); if (v >= 1 && v <= 10) freq[v - 1]++; });
  const maxF = Math.max(...freq, 1);
  const domI = freq.indexOf(Math.max(...freq));
  const hasDom = freq[domI] > 0;
  const panel = document.createElement("div"); panel.className = `panel ${type} fade-in`;
  panel.innerHTML = `
    <div class="panel-head">
      <div class="panel-label"><span class="label-dot dot-${type}"></span><span class="panel-label-text">${label}</span></div>
      <div class="mini-stats">
        <div class="mini-stat"><div class="mini-stat-n ${numColorClass}">${avg}</div><div class="mini-stat-l">Avg</div></div>
        <div class="mini-stat"><div class="mini-stat-n">${total}</div><div class="mini-stat-l">Total</div></div>
        <div class="mini-stat"><div class="mini-stat-n">${median}</div><div class="mini-stat-l">Median</div></div>
      </div>
    </div>
    <div class="chart-area" id="ca-${type}"></div>
    <div class="dom-badge ${type}" id="db-${type}"></div>`;
  const ca = panel.querySelector(`#ca-${type}`);
  if (total === 0) { ca.innerHTML = `<div class="chart-empty"><span class="chart-empty-icon">📭</span>No data for this period</div>`; }
  else {
    freq.forEach((count, i) => {
      const score = i + 1, pct = (count / maxF) * 100, isDom = (i === domI && count > 0), trackH = Math.max(pct, count > 0 ? 5 : 0);
      const col = document.createElement("div"); col.className = "bar-col";
      col.innerHTML = `
        <div class="bar-track" style="height:${trackH}%;background:rgba(155,236,0,0.05);">
          <div class="bar-fill ${FC[i]}${isDom ? " dom" : ""}" style="height:0%;" data-target="${pct}%"></div>
          <div class="bar-tip">${count}× ${EMOJIS[i]} · ${score}/10</div>
        </div>
        <div class="bar-emoji">${EMOJIS[i]}</div>
        <div class="bar-num">${score}</div>`;
      ca.appendChild(col);
    });
  }
  const db = panel.querySelector(`#db-${type}`);
  db.innerHTML = hasDom
    ? `<span>${EMOJIS[domI]}</span><span>Most submitted: <strong>${domI + 1}/10</strong> — ${freq[domI]} time${freq[domI] !== 1 ? "s" : ""}</span>`
    : `<span style="color:var(--muted);font-size:12px">No submissions for this period</span>`;
  return panel;
}

function renderStatus(title, msg) {
  const main = document.getElementById("main");
  if (!main) return;
  main.innerHTML = `<div class="status-box"><h3>${title}</h3><p>${msg}</p></div>`;
}

initSupabase();
updateDeptChip();
loadData();

window.doRefresh = doRefresh;
window.setFilter = setFilter;
window.changeDept = changeDept;
window.filterDepts = filterDepts;
window.openAC = openAC;
window.closeAC = closeAC;
window.handleACKey = handleACKey;
window.exportToExcel = exportToExcel;

// ═══════════════════════════════════════════════════════════════════════════════
// EXCEL EXPORT
// ─────────────────────────────────────────────────────────────────────────────
// One sheet per department (same as before), each containing:
//
//   [Title + subtitle]
//
//   ┌─ RATING TOTALS ──────────────────────────────────────────────────────┐
//   │ Score │  TODAY        │  THIS MONTH   │  THIS YEAR    │             │
//   │       │ Emp  Cli  All │ Emp  Cli  All │ Emp  Cli  All │             │
//   │  1/10 │  …   …    …  │  …   …    …  │  …   …    …  │             │
//   │  …                                                                   │
//   │ TOTAL │  …   …    …  │  …   …    …  │  …   …    …  │             │
//   │  AVG  │  …   …    …  │  …   …    …  │  …   …    …  │             │
//   └──────────────────────────────────────────────────────────────────────┘
//
//   [spacer]
//
//   Raw records table (period = #export-period-select or active dashboard period)
//
// ═══════════════════════════════════════════════════════════════════════════════
function exportToExcel() {
  const btn = document.getElementById('export-btn');
  const depts = DEPTS || [];

  // Which period to show in the raw-records table
  const sel = document.getElementById('export-period-select');
  const exportPeriod = (sel ? sel.value : null) || period || 'all';
  const PERIOD_LABEL = { daily: 'Today', monthly: 'This Month', yearly: 'This Year', all: 'All-time' };
  const periodLabel = PERIOD_LABEL[exportPeriod] || 'All-time';

  // Pre-filter the three fixed windows (always shown in the totals table)
  const rowsD = filterByPeriod(allReports || [], 'daily');
  const rowsM = filterByPeriod(allReports || [], 'monthly');
  const rowsY = filterByPeriod(allReports || [], 'yearly');
  const rowsA = allReports || [];

  const rowsForRaw = exportPeriod === 'all' ? rowsA
    : exportPeriod === 'daily' ? rowsD
      : exportPeriod === 'monthly' ? rowsM
        : rowsY;

  if (!rowsA.length) {
    alert('No data loaded yet — please wait for the page to finish loading, then try again.');
    return;
  }

  btn.innerHTML = `
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none"
         style="flex-shrink:0;animation:spin .7s linear infinite">
      <path d="M11 6.5A4.5 4.5 0 112.5 4" stroke="currentColor" stroke-width="1.35" stroke-linecap="round"/>
      <path d="M2.5 1.5v2.5H5" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    Preparing…`;
  btn.disabled = true;

  try {
    const wb = XLSX.utils.book_new();
    const now = new Date();
    const dateStamp = now.toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' });

    const isEmp = r => String(r.role || '').toLowerCase().includes('employee');
    const isCli = r => String(r.role || '').toLowerCase().includes('client');

    // ── Styles ────────────────────────────────────────────────────────────
    const styleTitle = {
      font: { bold: true, sz: 13, name: 'Arial', color: { rgb: '253900' } },
      alignment: { horizontal: 'center', vertical: 'center' }
    };
    const styleSub = {
      font: { sz: 9, name: 'Arial', italic: true, color: { rgb: '6b7c5e' } },
      alignment: { horizontal: 'center' }
    };
    // Period group header (Today / This Month / This Year)
    const stylePeriodHdr = rgb => ({
      font: { bold: true, sz: 9, name: 'Arial', color: { rgb: 'FFFFFF' } },
      fill: { patternType: 'solid', fgColor: { rgb } },
      alignment: { horizontal: 'center', vertical: 'center' }
    });
    // Column sub-header (Emp / Cli / All)
    const styleColHdr = {
      font: { bold: true, sz: 8, name: 'Arial', color: { rgb: 'FFFFFF' } },
      fill: { patternType: 'solid', fgColor: { rgb: '253900' } },
      alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
      border: { bottom: { style: 'thin', color: { rgb: '9a7a1f' } } }
    };
    const styleScoreHdr = {  // "Score" label cell
      font: { bold: true, sz: 9, name: 'Arial', color: { rgb: 'FFFFFF' } },
      fill: { patternType: 'solid', fgColor: { rgb: '253900' } },
      alignment: { horizontal: 'center', vertical: 'center' },
      border: { bottom: { style: 'thin', color: { rgb: '9a7a1f' } } }
    };
    // Normal data cell
    const styleData = alt => ({
      font: { sz: 9, name: 'Arial' },
      fill: alt ? { patternType: 'solid', fgColor: { rgb: 'f0f4eb' } } : {},
      alignment: { horizontal: 'center', vertical: 'center' }
    });
    const styleDataL = alt => ({
      font: { sz: 9, name: 'Arial' },
      fill: alt ? { patternType: 'solid', fgColor: { rgb: 'f0f4eb' } } : {},
      alignment: { horizontal: 'left', vertical: 'center' }
    });
    // Dominant score highlight (highest count in that period)
    const styleDom = {
      font: { bold: true, sz: 9, name: 'Arial', color: { rgb: '1a3d00' } },
      fill: { patternType: 'solid', fgColor: { rgb: 'c8f06e' } },
      alignment: { horizontal: 'center', vertical: 'center' }
    };
    // Totals / avg footer row
    const styleTotals = {
      font: { bold: true, sz: 9, name: 'Arial', color: { rgb: '253900' } },
      fill: { patternType: 'solid', fgColor: { rgb: 'e8f5d0' } },
      alignment: { horizontal: 'center', vertical: 'center' },
      border: { top: { style: 'thin', color: { rgb: '7cb518' } } }
    };
    const styleTotalsL = { ...styleTotals, alignment: { horizontal: 'left', vertical: 'center' }, border: { top: { style: 'thin', color: { rgb: '7cb518' } } } };
    // Raw records table
    const styleRawHdr = {
      font: { bold: true, name: 'Arial', sz: 10, color: { rgb: 'FFFFFF' } },
      fill: { patternType: 'solid', fgColor: { rgb: '253900' } },
      alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
      border: { bottom: { style: 'thin', color: { rgb: '9a7a1f' } } }
    };
    const styleRawAlt = { fill: { patternType: 'solid', fgColor: { rgb: 'F0F4EB' } } };
    const styleRawCell = (left, wrap) => ({
      font: { name: 'Arial', sz: 10 },
      alignment: { horizontal: left ? 'left' : 'center', vertical: 'center', wrapText: !!wrap }
    });

    // ── Helpers ───────────────────────────────────────────────────────────
    function setCell(ws, r, c, v, s) {
      const addr = XLSX.utils.encode_cell({ r, c });
      ws[addr] = { v, t: typeof v === 'number' ? 'n' : 's' };
      if (s) ws[addr].s = s;
      const ref = ws['!ref'] ? XLSX.utils.decode_range(ws['!ref']) : { s: { r: 0, c: 0 }, e: { r: 0, c: 0 } };
      if (r > ref.e.r) ref.e.r = r;
      if (c > ref.e.c) ref.e.c = c;
      ws['!ref'] = XLSX.utils.encode_range(ref);
    }
    function addMerge(ws, r1, c1, r2, c2) {
      if (!ws['!merges']) ws['!merges'] = [];
      ws['!merges'].push({ s: { r: r1, c: c1 }, e: { r: r2, c: c2 } });
    }
    function ratingFreq(rows) {
      const f = Array(10).fill(0);
      rows.forEach(r => { const v = Number(r.rating); if (v >= 1 && v <= 10) f[v - 1]++; });
      return f;
    }
    function avgOf(rows) {
      return rows.length
        ? (rows.reduce((s, r) => s + Number(r.rating), 0) / rows.length).toFixed(2)
        : '—';
    }

    // ── Column layout for rating-totals table ─────────────────────────────
    // A(0)   = Score label
    // B(1)   = Daily-Emp    C(2) = Daily-Cli    D(3) = Daily-All
    // E(4)   = [spacer]
    // F(5)   = Monthly-Emp  G(6) = Monthly-Cli  H(7) = Monthly-All
    // I(8)   = [spacer]
    // J(9)   = Yearly-Emp   K(10)= Yearly-Cli   L(11)= Yearly-All
    // Total columns used: 12  (indices 0-11)

    const sortedDepts = [...depts].sort((a, b) => a.label.localeCompare(b.label));

    sortedDepts.forEach(dept => {
      const dId = dept.id.toLowerCase();

      // Dept-specific rows for each period
      const dD = rowsD.filter(r => String(r.branch_name || '').toLowerCase() === dId);
      const dM = rowsM.filter(r => String(r.branch_name || '').toLowerCase() === dId);
      const dY = rowsY.filter(r => String(r.branch_name || '').toLowerCase() === dId);

      // Raw records for the chosen period
      const rawRows = rowsForRaw
        .filter(r => String(r.branch_name || '').toLowerCase() === dId)
        .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));

      const ws = {};
      ws['!ref'] = 'A1:A1';
      ws['!rows'] = [];
      // Columns: A=Score, B=Emp, C=Cli, D=Combined  (4 cols only)
      ws['!cols'] = [
        { wch: 20 }, // A  Score
        { wch: 12 }, // B  Employee
        { wch: 12 }, // C  Client
        { wch: 12 }, // D  Combined
      ];

      let row = 0;

      // ── Title ──────────────────────────────────────────────────────────
      for (let c = 0; c < 4; c++) setCell(ws, row, c, c === 0 ? `${dept.label}  (${dept.id})` : '', styleTitle);
      addMerge(ws, row, 0, row, 3);
      ws['!rows'][row] = { hpt: 26 }; row++;

      for (let c = 0; c < 4; c++) setCell(ws, row, c, c === 0 ? `Generated: ${dateStamp}   ·   Records in raw table: ${rawRows.length}` : '', styleSub);
      addMerge(ws, row, 0, row, 3);
      ws['!rows'][row] = { hpt: 14 }; row++;

      ws['!rows'][row] = { hpt: 8 }; row++; // spacer

      // ── Rating Totals Table (single period matching export selection) ───
      // Pick only the rows for the selected period
      const periodRows = exportPeriod === 'monthly' ? dM
        : exportPeriod === 'yearly' ? dY
          : dD; // daily is default (also covers 'all' → use daily window for totals)

      const periodRgb = exportPeriod === 'monthly' ? '1565c0'
        : exportPeriod === 'yearly' ? '6a1e76'
          : '2e7d32'; // daily / all → green

      // Period header row (merged A:D)
      for (let c = 0; c < 4; c++) setCell(ws, row, c, c === 0 ? periodLabel.toUpperCase() : '', stylePeriodHdr(periodRgb));
      addMerge(ws, row, 0, row, 3);
      ws['!rows'][row] = { hpt: 20 }; row++;

      // Column sub-headers
      setCell(ws, row, 0, 'Score', styleScoreHdr);
      setCell(ws, row, 1, 'Employee', styleColHdr);
      setCell(ws, row, 2, 'Client', styleColHdr);
      setCell(ws, row, 3, 'Combined', styleColHdr);
      ws['!rows'][row] = { hpt: 20 }; row++;

      // Freq arrays for the selected period
      const fE = ratingFreq(periodRows.filter(isEmp));
      const fC = ratingFreq(periodRows.filter(isCli));
      const fA = ratingFreq(periodRows);
      const dom = fA.indexOf(Math.max(...fA));

      // One row per score 1-10
      for (let i = 0; i < 10; i++) {
        const alt = i % 2 === 0;
        const isDom = fA[i] > 0 && i === dom;
        setCell(ws, row, 0, `${i + 1}/10  ${EMOJIS[i]}`, isDom ? { ...styleDom, alignment: { horizontal: 'left', vertical: 'center' } } : styleDataL(alt));
        setCell(ws, row, 1, fE[i], isDom ? styleDom : styleData(alt));
        setCell(ws, row, 2, fC[i], isDom ? styleDom : styleData(alt));
        setCell(ws, row, 3, fA[i], isDom ? styleDom : styleData(alt));
        ws['!rows'][row] = { hpt: 16 }; row++;
      }

      // TOTAL row
      const tE = periodRows.filter(isEmp).length;
      const tC = periodRows.filter(isCli).length;
      setCell(ws, row, 0, 'TOTAL', styleTotalsL);
      setCell(ws, row, 1, tE, styleTotals);
      setCell(ws, row, 2, tC, styleTotals);
      setCell(ws, row, 3, tE + tC, styleTotals);
      ws['!rows'][row] = { hpt: 18 }; row++;

      // AVG SCORE row
      setCell(ws, row, 0, 'AVG SCORE', styleTotalsL);
      setCell(ws, row, 1, avgOf(periodRows.filter(isEmp)), styleTotals);
      setCell(ws, row, 2, avgOf(periodRows.filter(isCli)), styleTotals);
      setCell(ws, row, 3, avgOf(periodRows), styleTotals);
      ws['!rows'][row] = { hpt: 18 }; row++;

      // ── Spacer ─────────────────────────────────────────────────────────
      ws['!rows'][row] = { hpt: 10 }; row++;

      // ── Raw Records Table ──────────────────────────────────────────────
      ws['!cols'] = [
        { wch: 5 }, // #
        { wch: 22 }, // Date & Time
        { wch: 11 }, // Type
        { wch: 7 }, // Score
        { wch: 54 }, // Remarks
      ];

      // Section label
      for (let c = 0; c < 5; c++) {
        setCell(ws, row, c, c === 0
          ? `Records — ${periodLabel}  (${rawRows.length} record${rawRows.length !== 1 ? 's' : ''})`
          : '', {
          font: { bold: true, sz: 10, name: 'Arial', color: { rgb: 'FFFFFF' } },
          fill: { patternType: 'solid', fgColor: { rgb: '37474f' } },
          alignment: { horizontal: c === 0 ? 'left' : 'center', vertical: 'center' }
        });
      }
      addMerge(ws, row, 0, row, 4);
      ws['!rows'][row] = { hpt: 20 }; row++;

      // Column headers
      ['#', 'Date & Time', 'Type', 'Score', 'Remarks'].forEach((h, c) => setCell(ws, row, c, h, styleRawHdr));
      ws['!rows'][row] = { hpt: 28 }; row++;

      if (!rawRows.length) {
        for (let c = 0; c < 5; c++) setCell(ws, row, c, c === 0 ? 'No records for this period.' : '', styleSub);
        addMerge(ws, row, 0, row, 4);
        ws['!rows'][row] = { hpt: 16 }; row++;
      } else {
        rawRows.forEach((r, i) => {
          const typeStr = isEmp(r) ? 'Employee' : isCli(r) ? 'Client' : (r.role || '—');
          const dtStr = r.created_at
            ? new Date(r.created_at).toLocaleString('en-PH', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
            : '—';
          const alt = i % 2 === 0;
          setCell(ws, row, 0, i + 1, { ...styleRawCell(false, false), ...(alt ? styleRawAlt : {}) });
          setCell(ws, row, 1, dtStr, { ...styleRawCell(false, false), ...(alt ? styleRawAlt : {}) });
          setCell(ws, row, 2, typeStr, { ...styleRawCell(false, false), ...(alt ? styleRawAlt : {}) });
          setCell(ws, row, 3, Number(r.rating) || 0, { ...styleRawCell(false, false), ...(alt ? styleRawAlt : {}) });
          setCell(ws, row, 4, r.remarks || r.comment || '', { ...styleRawCell(true, true), ...(alt ? styleRawAlt : {}) });
          ws['!rows'][row] = { hpt: 16 }; row++;
        });
      }

      const sheetName = dept.id.replace(/[:\\\/\?\*\[\]]/g, '').slice(0, 31);
      XLSX.utils.book_append_sheet(wb, ws, sheetName);
    });

    XLSX.writeFile(wb, `DRJPRH_Export_${exportPeriod}_${now.toISOString().slice(0, 10)}.xlsx`);

  } catch (err) {
    console.error('Export error:', err);
    alert('Export failed: ' + err.message);
  } finally {
    btn.innerHTML = `
      <svg width="13" height="13" viewBox="0 0 13 13" fill="none" style="flex-shrink:0">
        <path d="M6.5 1.5v6M3.5 5l3 3 3-3M1.5 9.5v1a1 1 0 001 1h8a1 1 0 001-1v-1"
          stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      Save a Copy`;
    btn.disabled = false;
  }
} ats