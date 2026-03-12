const SUPABASE_URL = 'https://qjsvsfrqfnrwzdxtrebb.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFqc3ZzZnJxZm5yd3pkeHRyZWJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwODQ4MzgsImV4cCI6MjA4ODY2MDgzOH0.elMyC9DBlbqkMyojlus019irQwgHI4ma3IklyAOM1vg';

const DEPTS = [
  { id: 'Human Resources', icon: '👥' },
  { id: 'Information Technology', icon: '💻' },
  { id: 'Sales', icon: '📈' },
  { id: 'Customer Support', icon: '🎧' },
  { id: 'Finance', icon: '💰' },
];

const ROLE_EMP = 'employee';
const ROLE_CLI = 'client';

const EMOJIS = ['😭', '😢', '😟', '😕', '😐', '🙂', '😊', '😄', '🤩', '🥳'];
const FC = ['fc-1', 'fc-2', 'fc-3', 'fc-4', 'fc-5', 'fc-6', 'fc-7', 'fc-8', 'fc-9', 'fc-10'];

let supabase = null;
let allReports = [];
let deptIdx = 0;
let period = 'daily';
let slideDir = 'r';

function checkLogin() {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const loggedInUser = localStorage.getItem("loggedInUser");

  if (isLoggedIn !== "true" || !loggedInUser) {
    window.location.href = "../login/login.html";
    return false;
  }

  return true;
}

function initSupabase() {
  try {
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON);
    return true;
  } catch (e) {
    console.error('Supabase init error:', e);
    return false;
  }
}

async function loadData() {
  setSpin(true);

  if (!supabase && !initSupabase()) {
    renderStatus(
      'Supabase Not Configured',
      'Set your SUPABASE_URL and SUPABASE_ANON key at the top of this file.'
    );
    setSpin(false);
    return;
  }

  const { data, error } = await supabase
    .from('table_reports')
    .select('report_id, branch_name, role, rating, created_at')
    .order('report_id', { ascending: false });

  setSpin(false);

  if (error) {
    console.error('Supabase query error:', error);
    renderStatus('Query Error', `Could not fetch data: ${error.message}`);
    return;
  }

  allReports = data || [];
  render();
}

async function doRefresh() {
  await loadData();
}

function setSpin(on) {
  const btn = document.getElementById('refresh-btn');
  if (btn) btn.classList.toggle('spinning', on);
}

function setFilter(p, btn) {
  period = p;
  document.querySelectorAll('.f-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  render(false);
}

function parseDate(str) {
  if (!str) return new Date(0);
  return new Date(str);
}

function windowStart() {
  const now = new Date();

  if (period === 'daily') {
    const d = new Date(now);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  if (period === 'monthly') {
    return new Date(now.getFullYear(), now.getMonth(), 1);
  }

  if (period === 'yearly') {
    return new Date(now.getFullYear(), 0, 1);
  }

  return new Date(0);
}

function filterByPeriod(rows) {
  const start = windowStart().getTime();
  return rows.filter(r => parseDate(r.created_at).getTime() >= start);
}

function changeDept(dir) {
  slideDir = dir > 0 ? 'r' : 'l';
  deptIdx = (deptIdx + dir + DEPTS.length) % DEPTS.length;
  updateDeptChip();
  render(true);
}

function updateDeptChip() {
  const d = DEPTS[deptIdx];
  document.getElementById('d-icon').textContent = d.icon;
  document.getElementById('d-name').textContent = d.id;
  document.getElementById('d-idx').textContent = `${deptIdx + 1} / ${DEPTS.length}`;

  const chip = document.getElementById('dept-chip');
  chip.classList.remove('slide-r', 'slide-l');
  void chip.offsetWidth;
  chip.classList.add(slideDir === 'r' ? 'slide-r' : 'slide-l');
}

function render(slide = false) {
  const dept = DEPTS[deptIdx];
  const inWindow = filterByPeriod(allReports);
  const forDept = inWindow.filter(r => r.branch_name === dept.id);
  const emp = forDept.filter(r => r.role === ROLE_EMP);
  const cli = forDept.filter(r => r.role === ROLE_CLI);

  const main = document.getElementById('main');

  if (slide) {
    main.classList.remove('slide-r', 'slide-l');
    void main.offsetWidth;
    main.classList.add(slideDir === 'r' ? 'slide-r' : 'slide-l');
  }

  main.innerHTML = '';
  main.appendChild(buildStrip(emp, cli));
  main.appendChild(buildPanels(emp, cli));
}

function buildStrip(emp, cli) {
  const all = [...emp, ...cli];
  const total = all.length;
  const avg = total ? (all.reduce((s, r) => s + Number(r.rating), 0) / total).toFixed(1) : '—';
  const eAvg = emp.length ? (emp.reduce((s, r) => s + Number(r.rating), 0) / emp.length).toFixed(1) : '—';
  const cAvg = cli.length ? (cli.reduce((s, r) => s + Number(r.rating), 0) / cli.length).toFixed(1) : '—';

  const freq = Array(10).fill(0);
  all.forEach(r => {
    const rating = Number(r.rating);
    if (rating >= 1 && rating <= 10) freq[rating - 1]++;
  });

  const domI = freq.indexOf(Math.max(...freq));
  const topLbl = freq[domI] > 0 ? `${domI + 1}/10 ${EMOJIS[domI]}` : '—';

  const strip = document.createElement('div');
  strip.className = 'summary-strip fade-in';

  [
    { e: '📊', n: total || '0', l: 'Total' },
    { e: '⭐', n: avg, l: 'Overall Avg' },
    { e: '👤', n: eAvg, l: 'Employee Avg' },
    { e: '🤝', n: cAvg, l: 'Client Avg' },
    { e: '🏆', n: topLbl, l: 'Top Score' },
  ].forEach(c => {
    const el = document.createElement('div');
    el.className = 's-chip';
    el.innerHTML = `
      <span class="s-chip-emoji">${c.e}</span>
      <div>
        <div class="s-chip-n">${c.n}</div>
        <div class="s-chip-l">${c.l}</div>
      </div>
    `;
    strip.appendChild(el);
  });

  return strip;
}

function buildPanels(emp, cli) {
  const wrap = document.createElement('div');
  wrap.className = 'panels';
  wrap.appendChild(buildPanel('emp', '👤 Employee', emp, 'col-green'));
  wrap.appendChild(buildPanel('cli', '🤝 Client', cli, 'col-gold'));
  return wrap;
}

function buildPanel(type, label, rows, numColorClass) {
  const total = rows.length;
  const avg = total ? (rows.reduce((s, r) => s + Number(r.rating), 0) / total).toFixed(1) : '—';
  const sorted = rows.map(r => Number(r.rating)).sort((a, b) => a - b);
  const median = sorted.length ? sorted[Math.floor(sorted.length / 2)] : '—';

  const freq = Array(10).fill(0);
  rows.forEach(r => {
    const rating = Number(r.rating);
    if (rating >= 1 && rating <= 10) freq[rating - 1]++;
  });

  const maxF = Math.max(...freq, 1);
  const domI = freq.indexOf(Math.max(...freq));
  const hasDom = freq[domI] > 0;

  const panel = document.createElement('div');
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
    <div class="dom-badge ${type}" id="db-${type}"></div>
  `;

  const ca = panel.querySelector(`#ca-${type}`);

  if (total === 0) {
    ca.innerHTML = `
      <div class="chart-empty">
        <span class="chart-empty-icon">📭</span>
        No data for this period
      </div>
    `;
  } else {
    freq.forEach((count, i) => {
      const score = i + 1;
      const pct = (count / maxF) * 100;
      const isDom = i === domI && count > 0;
      const trackH = Math.max(pct, count > 0 ? 5 : 0);

      const col = document.createElement('div');
      col.className = 'bar-col';
      col.innerHTML = `
        <div class="bar-track" style="height:${trackH}%;background:rgba(155,236,0,0.05);">
          <div class="bar-fill ${FC[i]}${isDom ? ' dom' : ''}" style="height:0%;"></div>
          <div class="bar-tip">${count}× ${EMOJIS[i]} · ${score}/10</div>
        </div>
        <div class="bar-emoji">${EMOJIS[i]}</div>
        <div class="bar-num">${score}</div>
      `;
      ca.appendChild(col);
    });

    requestAnimationFrame(() => requestAnimationFrame(() => {
      ca.querySelectorAll('.bar-fill').forEach((fill, i) => {
        const pct = (freq[i] / maxF) * 100;
        setTimeout(() => {
          fill.style.height = Math.max(pct, freq[i] > 0 ? 5 : 0) + '%';
        }, i * 50);
      });
    }));
  }

  const db = panel.querySelector(`#db-${type}`);
  if (hasDom) {
    db.innerHTML = `
      <span>${EMOJIS[domI]}</span>
      <span>Most submitted:
        <strong>${domI + 1}/10</strong>
        — ${freq[domI]} time${freq[domI] !== 1 ? 's' : ''}
      </span>
    `;
  } else {
    db.innerHTML = `<span style="color:var(--muted);font-size:12px">No submissions for this period</span>`;
  }

  return panel;
}

function renderStatus(title, msg) {
  document.getElementById('main').innerHTML = `
    <div class="status-box">
      <h3>⚠️ ${title}</h3>
      <p>${msg}</p>
    </div>
  `;
}

if (checkLogin()) {
  updateDeptChip();
  loadData();
}

window.doRefresh = doRefresh;
window.setFilter = setFilter;
window.changeDept = changeDept;