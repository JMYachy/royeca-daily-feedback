const SUPABASE_URL = 'https://qjsvsfrqfnrwzdxtrebb.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFqc3ZzZnJxZm5yd3pkeHRyZWJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwODQ4MzgsImV4cCI6MjA4ODY2MDgzOH0.elMyC9DBlbqkMyojlus019irQwgHI4ma3IklyAOM1vg'; // ← paste your anon key here

// ─── DEPARTMENTS ──────────────────────────────────────────────────────────────
// 'id' must EXACTLY match the branch_name values stored in your Supabase table.
// Your sample data uses 'Admin' (capital A), so it's listed here as 'Admin'.
const DEPTS = [
  //ASS
  { id: "HRMU", label: "Human Resource Management Unit", icon: "👥" },
  { id: "PSU", label: "Property & Supply Unit", icon: "💻" },
  { id: "PU", label: "Procurement Unit", icon: "📈" },
  { id: "SU", label: "Security Unit", icon: "📈" },

  //CD
  { id: "APU", label: "Acute Psychiatry Unit", icon: "📈" },
  { id: "CPU", label: "Child Protection Unit", icon: "📈" },
  { id: "DA", label: "Department of Anesthesia", icon: "📈" },
  { id: "DM", label: "Department of Medicine", icon: "📈" },
  { id: "DO", label: "Department of OB-GYNE", icon: "📈" },
  { id: "DP", label: "Department of Pediatrics", icon: "📈" },
  { id: "DS", label: "Department of Surgery", icon: "📈" },
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
function changeDept(dir) {
  slideDir = dir > 0 ? "r" : "l";
  deptIdx = (deptIdx + dir + DEPTS.length) % DEPTS.length;
  updateDeptChip();
  render(true);
}

function updateDeptChip() {
  const d = DEPTS[deptIdx];
  document.getElementById("d-icon").textContent = d.icon;
  document.getElementById("d-name").textContent = d.label;
  document.getElementById("d-idx").textContent = `${deptIdx + 1} / ${DEPTS.length}`;

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
  const wrap = document.createElement("div");
  wrap.className = "panels";
  wrap.appendChild(buildPanel("emp", "👤 Employee", emp, "col-green"));
  wrap.appendChild(buildPanel("cli", "🤝 Client", cli, "col-gold"));
  return wrap;
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