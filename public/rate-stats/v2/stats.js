const SUPABASE_URL = 'https://qjsvsfrqfnrwzdxtrebb.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFqc3ZzZnJxZm5yd3pkeHRyZWJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwODQ4MzgsImV4cCI6MjA4ODY2MDgzOH0.elMyC9DBlbqkMyojlus019irQwgHI4ma3IklyAOM1vg'; // ← paste your anon key here

// ─── DEPARTMENTS ──────────────────────────────────────────────────────────────
// 'id' must EXACTLY match the branch_name values stored in your Supabase table.
// Your sample data uses 'Admin' (capital A), so it's listed here as 'Admin'.
const DEPTS = [
  //ASS
  { id: "HRMU", label: "Human Resource Management Unit", icon: "👥" },
  { id: "PSU", label: "Property & Supply Unit", icon: "💻" },
  { id: "PrU", label: "Procurement Unit", icon: "📈" },
  { id: "SU", label: "Security Unit", icon: "📈" },

  //CD
  { id: "APU", label: "Acute Psychiatry Unit", icon: "📈" },
  { id: "CPU", label: "Child Protection Unit", icon: "📈" },
  { id: "DA", label: "Department of Anesthesia", icon: "📈" },
  { id: "DM", label: "Department of Medicine", icon: "📈" },
  { id: "DO", label: "Department of OB-GYNE", icon: "📈" },
  { id: "DP", label: "Department of Pediatrics", icon: "📈" },
  { id: "DoS", label: "Department of Surgery", icon: "📈" },
  { id: "RCRU", label: "Renal Care Respiratory Unit", icon: "📈" },
  { id: "RCU", label: "Rehabilitation Care Unit", icon: "📈" },

  //CNAS
  { id: "DRLRU", label: "Delivery Room & Labor Room Unit", icon: "📈" },
  { id: "MWU", label: "Medical Ward Unit", icon: "📈" },
  { id: "OBWU", label: "OB-Gyne Ward Unit", icon: "📈" },
  { id: "ORU", label: "Operating Room Unit", icon: "📈" },
  { id: "PU", label: "Payward Unit", icon: "📈" },
  { id: "PWU", label: "Pediatric Ward Unit", icon: "📈" },
  { id: "SWU", label: "Surgery Ward Unit", icon: "📈" },

  //DPS
  { id: "ACLU", label: "Anatomic & Clinical Laboratory Unit", icon: "📈" },
  { id: "BBU", label: "Blood Bank Unit", icon: "📈" },

  //DS
  { id: "DS", label: "Dental Section", icon: "📈" },

  //EFMS
  { id: "HKLU", label: "House Keeping & Laundry Unit", icon: "📈" },
  { id: "JOMU", label: "Janitorial/Orderlies Management Unit", icon: "📈" },
  { id: "MMU", label: "Materials Management Unit", icon: "📈" },

  //EMD
  { id: "EMD", label: "Emergency Medicine Department", icon: "📈" },

  //FMSS
  { id: "ABCU", label: "Accounting, Billing & Claims Unit", icon: "📈" },
  { id: "COU", label: "Cash Operations Unit", icon: "📈" },

  //HIMS
  { id: "HIMS", label: "Health Information Management Section", icon: "📈" },

  //IHOMPU
  { id: "IHOMPU", label: "Integrated Hospital Operations & Management Program Unit", icon: "📈" },

  //MSW
  { id: "MSW", label: "Medical Social Work", icon: "📈" },

  //NDS
  { id: "NDS", label: "Nutrition & Dietetics Section", icon: "📈" },

  //NSOO
  { id: "NSOO", label: "NSO Office", icon: "📈" },

  //ODFM
  { id: "ODFM", label: "Outpatient Department/Family Medicine", icon: "📈" },

  //PS
  { id: "PS", label: "Pharmacy Section", icon: "📈" },

  //QAS
  { id: "QAS", label: "Quality Assurance Section", icon: "📈" },

  //RDS
  { id: "RDS", label: "Radiology & Diagnostic Section", icon: "📈" },

  //SCA
  { id: "AMSU", label: "Anti-Microbial Stewardship Unit", icon: "📈" },
  { id: "CTU", label: "Center for Teens Unit", icon: "📈" },
  { id: "HACU", label: "HIV & AIDS Core Unit", icon: "📈" },
  { id: "HEMU", label: "Health & Environment Management Unit", icon: "📈" },
  { id: "HRPU", label: "High Risk Pregnancy Unit", icon: "📈" },
  { id: "NBSU", label: "New Born Screening Unit", icon: "📈" },
  { id: "RHFPU", label: "Reproductive Health & Family Planning Unit", icon: "📈" },
  { id: "TBDU", label: "TB-Dots Unit", icon: "📈" },
  { id: "WCAK", label: "Wellness Center APE & Konsulta", icon: "📈" },

  //SCAS
  { id: "CSRSU", label: "Central Supply Room & Sterilization Unit", icon: "📈" },
  { id: "ICU", label: "Intensive Care Unit", icon: "📈" },
  { id: "IPCU", label: "Infection Prevention & Control Unit", icon: "📈" },
  { id: "NICU", label: "Neonatal Intensive Care Unit", icon: "📈" },
  { id: "PACU", label: "Post Anesthesia Care Unit", icon: "📈" },
  { id: "PRU", label: "Pulmonary/Respiratory Unit", icon: "📈" },

];

// ─── ROLE KEYWORDS ────────────────────────────────────────────────────────────
// Your sample data uses role = 'Admin/Clients'.
// The employee panel catches rows whose role contains "employee" (case-insensitive).
// The client panel catches rows whose role contains "client" (case-insensitive).
// 'Admin/Clients' → contains "client" → goes into the Client panel. ✓
// If you also have rows like 'Admin/Employees', those will hit the Employee panel.
const ROLE_EMP_KEYWORD = "employee";
const ROLE_CLI_KEYWORD = "client";

const EMOJIS = ["😭", "😢", "😟", "😕", "😐", "🙂", "😊", "😄", "🤩", "🥳"];
const FC = ["fc-1", "fc-2", "fc-3", "fc-4", "fc-5", "fc-6", "fc-7", "fc-8", "fc-9", "fc-10"];

let sbClient = null;
let allReports = [];
let deptIdx = 0;
let period = "daily";
let slideDir = "r";

// ─── SUPABASE INIT ────────────────────────────────────────────────────────────
function initSupabase() {
  try {
    sbClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON);
    return true;
  } catch (e) {
    console.error("Supabase init error:", e);
    return false;
  }
}

// ─── DATA LOAD ────────────────────────────────────────────────────────────────
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

  if (error) {
    console.error("Supabase query error:", error);
    renderStatus("⚠️ Query Error", error.message);
    return;
  }

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

// ─── FILTER BAR ───────────────────────────────────────────────────────────────
function setFilter(p, btn) {
  period = p;
  document.querySelectorAll(".f-btn").forEach(b => b.classList.remove("active"));
  if (btn) btn.classList.add("active");
  render(false);
}

// ─── DATE HELPERS ─────────────────────────────────────────────────────────────
function parseDate(str) {
  if (!str) return new Date(0);
  const d = new Date(str);
  return isNaN(d.getTime()) ? new Date(0) : d;
}

function windowStart() {
  const now = new Date();
  if (period === "daily") {
    const d = new Date(now);
    d.setHours(0, 0, 0, 0);
    return d;
  }
  if (period === "monthly") return new Date(now.getFullYear(), now.getMonth(), 1);
  if (period === "yearly") return new Date(now.getFullYear(), 0, 1);
  return new Date(0);
}

function filterByPeriod(rows) {
  const start = windowStart().getTime();
  return rows.filter(r => parseDate(r.created_at).getTime() >= start);
}

// ─── DEPT SWITCHER ────────────────────────────────────────────────────────────
let filteredDepts = DEPTS.slice();
let acHighlight = 0;
const AC_MAX = 8;

function matchDepts(q) {
  if (!q) return DEPTS.slice();
  const lq = q.toLowerCase();
  return DEPTS.filter(d =>
    d.label.toLowerCase().includes(lq) || d.id.toLowerCase().includes(lq)
  );
}

function highlightMatch(text, query) {
  if (!query) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return text.slice(0, idx)
    + `<mark>${text.slice(idx, idx + query.length)}</mark>`
    + text.slice(idx + query.length);
}

// ── Autocomplete open/close ──
function openAC() {
  // intentionally disabled — dropdown only opens when typing
}

function closeAC() {
  document.getElementById("ac-dropdown").classList.remove("open");
  const searchEl = document.getElementById("dept-search");
  if (searchEl) searchEl.value = "";
}

function renderAC(query) {
  const drop = document.getElementById("ac-dropdown");
  const results = matchDepts(query);
  acHighlight = 0;
  drop.innerHTML = "";

  if (results.length === 0) {
    drop.innerHTML = `<div class="ac-more">No departments match "${query}"</div>`;
    return;
  }

  results.slice(0, AC_MAX).forEach((d, i) => {
    const item = document.createElement("div");
    item.className = "ac-item" + (i === 0 ? " ac-active" : "");
    item.innerHTML = `
      <span class="ac-label">${highlightMatch(d.label, query)}</span>
      <span class="ac-id">${d.id}</span>`;
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

// ── Keyboard nav in dropdown ──
function handleACKey(e) {
  const drop = document.getElementById("ac-dropdown");
  const items = drop.querySelectorAll(".ac-item");
  if (!drop.classList.contains("open")) {
    if (e.key === "ArrowDown" || e.key === "Enter") openAC();
    return;
  }
  if (e.key === "ArrowDown") {
    e.preventDefault();
    acHighlight = Math.min(acHighlight + 1, items.length - 1);
    items.forEach((el, i) => el.classList.toggle("ac-active", i === acHighlight));
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    acHighlight = Math.max(acHighlight - 1, 0);
    items.forEach((el, i) => el.classList.toggle("ac-active", i === acHighlight));
  } else if (e.key === "Enter") {
    e.preventDefault();
    const active = drop.querySelector(".ac-item.ac-active");
    if (active) active.onmousedown();
  } else if (e.key === "Escape") {
    closeAC();
  }
}

// ── Filter as user types ──
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

// ── Arrow buttons ──
function changeDept(dir) {
  slideDir = dir > 0 ? "r" : "l";
  const searchEl = document.getElementById("dept-search");
  if (searchEl) searchEl.value = "";
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
  const searchEl = document.getElementById("dept-search");

  if (nameEl) nameEl.textContent = d.label;
  if (idxEl) idxEl.textContent = `${deptIdx + 1} of ${DEPTS.length} · ${d.id}`;
  if (searchEl && !searchEl.value) searchEl.placeholder = "Search departments…";

  const chip = document.getElementById("dept-chip");
  if (!chip) return;
  chip.classList.remove("slide-r", "slide-l");
  void chip.offsetWidth;
  chip.classList.add(slideDir === "r" ? "slide-r" : "slide-l");
}

// ─── MAIN RENDER ─────────────────────────────────────────────────────────────
function render(slide = false) {
  const dept = DEPTS[deptIdx];
  const inWindow = filterByPeriod(allReports);

  // Case-insensitive branch_name match so 'Admin' === 'admin' etc.
  const forDept = inWindow.filter(r =>
    String(r.branch_name || "").toLowerCase() === dept.id.toLowerCase()
  );

  // Split by role keyword (case-insensitive)
  const emp = forDept.filter(r =>
    String(r.role || "").toLowerCase().includes(ROLE_EMP_KEYWORD)
  );
  const cli = forDept.filter(r =>
    String(r.role || "").toLowerCase().includes(ROLE_CLI_KEYWORD)
  );

  console.log(`[${dept.id}] period=${period} | inWindow=${inWindow.length} | forDept=${forDept.length} | emp=${emp.length} | cli=${cli.length}`);

  const main = document.getElementById("main");
  if (!main) return;

  if (slide) {
    main.classList.remove("slide-r", "slide-l");
    void main.offsetWidth;
    main.classList.add(slideDir === "r" ? "slide-r" : "slide-l");
  }

  main.innerHTML = "";
  main.appendChild(buildStrip(emp, cli));
  main.appendChild(buildPanels(emp, cli));

  // Animate bars after DOM is painted
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.querySelectorAll(".bar-fill").forEach(bar => {
        bar.style.height = bar.dataset.target || "0%";
      });
    });
  });
}

// ─── SUMMARY STRIP ───────────────────────────────────────────────────────────
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

  [
    { e: "📊", n: total || "0", l: "Total" },
    { e: "⭐", n: avg, l: "Overall Avg" },
    { e: "👤", n: eAvg, l: "Employee Avg" },
    { e: "🤝", n: cAvg, l: "Client Avg" },
    { e: "🏆", n: topLbl, l: "Top Score" },
  ].forEach(c => {
    const el = document.createElement("div");
    el.className = "s-chip";
    el.innerHTML = `
      <span class="s-chip-emoji">${c.e}</span>
      <div>
        <div class="s-chip-n">${c.n}</div>
        <div class="s-chip-l">${c.l}</div>
      </div>`;
    strip.appendChild(el);
  });

  return strip;
}

// ─── PANELS ──────────────────────────────────────────────────────────────────
function buildPanels(emp, cli) {
  const frag = document.createDocumentFragment();

  const row = document.createElement("div");
  row.className = "panels";
  row.appendChild(buildPanel("emp", "👤 Employee", emp, "col-green"));
  row.appendChild(buildPanel("cli", "🤝 Client", cli, "col-gold"));
  frag.appendChild(row);

  const ovrWrap = document.createElement("div");
  ovrWrap.className = "panels-overall";
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

  const panel = document.createElement("div");
  panel.className = `panel ${type} fade-in`;
  panel.innerHTML = `
    <div class="panel-head">
      <div class="panel-label">
        <span class="label-dot dot-${type}"></span>
        <span class="panel-label-text">${label}</span>
      </div>
      <div class="mini-stats">
        <div class="mini-stat">
          <div class="mini-stat-n ${numColorClass}">${avg}</div>
          <div class="mini-stat-l">Avg</div>
        </div>
        <div class="mini-stat">
          <div class="mini-stat-n">${total}</div>
          <div class="mini-stat-l">Total</div>
        </div>
        <div class="mini-stat">
          <div class="mini-stat-n">${median}</div>
          <div class="mini-stat-l">Median</div>
        </div>
      </div>
    </div>
    <div class="chart-area" id="ca-${type}"></div>
    <div class="dom-badge ${type}" id="db-${type}"></div>`;

  const ca = panel.querySelector(`#ca-${type}`);

  if (total === 0) {
    ca.innerHTML = `
      <div class="chart-empty">
        <span class="chart-empty-icon">📭</span>
        No data for this period
      </div>`;
  } else {
    freq.forEach((count, i) => {
      const score = i + 1;
      const pct = (count / maxF) * 100;
      const isDom = (i === domI && count > 0);
      const trackH = Math.max(pct, count > 0 ? 5 : 0);

      const col = document.createElement("div");
      col.className = "bar-col";
      col.innerHTML = `
        <div class="bar-track" style="height:${trackH}%;background:rgba(155,236,0,0.05);">
          <div class="bar-fill ${FC[i]}${isDom ? " dom" : ""}"
               style="height:0%;"
               data-target="${pct}%"></div>
          <div class="bar-tip">${count}× ${EMOJIS[i]} · ${score}/10</div>
        </div>
        <div class="bar-emoji">${EMOJIS[i]}</div>
        <div class="bar-num">${score}</div>`;
      ca.appendChild(col);
    });
  }

  const db = panel.querySelector(`#db-${type}`);
  db.innerHTML = hasDom
    ? `<span>${EMOJIS[domI]}</span>
       <span>Most submitted: <strong>${domI + 1}/10</strong> — ${freq[domI]} time${freq[domI] !== 1 ? "s" : ""}</span>`
    : `<span style="color:var(--muted);font-size:12px">No submissions for this period</span>`;

  return panel;
}

// ─── STATUS BOX ──────────────────────────────────────────────────────────────
function renderStatus(title, msg) {
  const main = document.getElementById("main");
  if (!main) return;
  main.innerHTML = `
    <div class="status-box">
      <h3>${title}</h3>
      <p>${msg}</p>
    </div>`;
}

// ─── BOOT ─────────────────────────────────────────────────────────────────────
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

// ─── EXCEL EXPORT ─────────────────────────────────────────────────────────────
// Save a Copy — exports ALL data from the database, sorted by department.
// Reads globals: allReports, DEPTS
// Requires: xlsx library (cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js)
function exportToExcel() {
  const btn     = document.getElementById('export-btn');
  const reports = allReports || [];
  const depts   = DEPTS      || [];

  if (!reports.length) {
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
    const wb        = XLSX.utils.book_new();
    const now       = new Date();
    const dateStamp = now.toLocaleDateString('en-PH', { year:'numeric', month:'long', day:'numeric' });

    const allData = [...reports];

    const isEmp = r => String(r.role||'').toLowerCase().includes('employee');
    const isCli = r => String(r.role||'').toLowerCase().includes('client');

    const styleHdr = {
      font:      { bold:true, name:'Arial', sz:10, color:{ rgb:'FFFFFF' } },
      fill:      { patternType:'solid', fgColor:{ rgb:'253900' } },
      alignment: { horizontal:'center', vertical:'center', wrapText:true },
      border:    { bottom:{ style:'thin', color:{ rgb:'9a7a1f' } } }
    };
    const styleTitle = {
      font:      { bold:true, sz:13, name:'Arial', color:{ rgb:'253900' } },
      alignment: { horizontal:'center', vertical:'center' }
    };
    const styleSub = {
      font:      { sz:9, name:'Arial', italic:true, color:{ rgb:'6b7c5e' } },
      alignment: { horizontal:'center' }
    };
    const styleAlt  = { fill:{ patternType:'solid', fgColor:{ rgb:'F0F4EB' } } };
    const styleCell = (leftAlign, wrap) => ({
      font:      { name:'Arial', sz:10 },
      alignment: { horizontal: leftAlign?'left':'center', vertical:'center', wrapText:!!wrap }
    });

    const hdr  = ['#', 'Date & Time', 'Type', 'Score', 'Remarks'];
    const cols = [{wch:5},{wch:22},{wch:11},{wch:7},{wch:54}];

    const sortedDepts = [...depts].sort((a,b) => a.label.localeCompare(b.label));

    sortedDepts.forEach(dept => {
      const dRows = allData
        .filter(r => String(r.branch_name||'').toLowerCase() === dept.id.toLowerCase())
        .sort((a,b) => new Date(b.created_at||0) - new Date(a.created_at||0));

      const sheetRows = dRows.map((r, i) => {
        const typeStr = isEmp(r) ? 'Employee' : isCli(r) ? 'Client' : (r.role || '—');
        const dtStr   = r.created_at
          ? new Date(r.created_at).toLocaleString('en-PH',{
              year:'numeric', month:'short', day:'numeric',
              hour:'2-digit', minute:'2-digit'})
          : '—';
        return [i+1, dtStr, typeStr, Number(r.rating) || '—', r.remarks || r.comment || ''];
      });

      const ws = XLSX.utils.aoa_to_sheet([
        [`${dept.label}  (${dept.id})`],
        [`All-time data   ·   Generated: ${dateStamp}   ·   ${dRows.length} record(s)`],
        [],
        hdr,
        ...sheetRows
      ]);
      ws['!cols']   = cols;
      ws['!merges'] = [{s:{r:0,c:0},e:{r:0,c:4}},{s:{r:1,c:0},e:{r:1,c:4}}];
      ws['!rows']   = [{hpt:26},{hpt:16},{hpt:6},{hpt:32}];
      if (ws['A1']) ws['A1'].s = styleTitle;
      if (ws['A2']) ws['A2'].s = styleSub;

      // header row styles
      for (let c=0; c<5; c++) {
        const a = XLSX.utils.encode_cell({r:3, c});
        if (ws[a]) ws[a].s = styleHdr;
      }
      // data row styles
      sheetRows.forEach((_, i) => {
        const row = 4 + i;
        for (let c=0; c<5; c++) {
          const a = XLSX.utils.encode_cell({r:row, c});
          if (!ws[a]) return;
          ws[a].s = {
            ...(i%2===0 ? styleAlt : {}),
            ...styleCell([1,2,4].includes(c), c===4)
          };
        }
      });

      const sheetName = dept.id.replace(/[:\\\/\?\*\[\]]/g, '').slice(0, 31);
      XLSX.utils.book_append_sheet(wb, ws, sheetName);
    });

    /* ── download ── */
    XLSX.writeFile(wb, `DRJPRH_FullExport_AllDepts_${now.toISOString().slice(0,10)}.xlsx`);

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
}