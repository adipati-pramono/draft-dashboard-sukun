/* Shared utilities & app shell — generated from draft template */
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
const idr = new Intl.NumberFormat('id-ID');

const rpJuta = v => v >= 1000
  ? 'Rp ' + (v / 1000).toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' M'
  : 'Rp ' + idr.format(Math.round(v)) + ' jt';

const rpJt = v => 'Rp ' + idr.format(v) + ' jt';
const rpFull = v => 'Rp ' + idr.format(v);
const pctText = (v, digits = 1) => v.toLocaleString('id-ID', {
  minimumFractionDigits: digits,
  maximumFractionDigits: digits
}) + '%';
const fmtPct = (v, digits = 1) => (v > 0 ? '+' : '') + pctText(v, digits);

const escapeHtml = value => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

const legendStyle = {
  display: true,
  position: 'top',
  align: 'end',
  labels: {
    boxWidth: 8,
    boxHeight: 8,
    usePointStyle: true,
    pointStyle: 'circle',
    padding: 14,
    font: { size: 11 }
  }
};

const gridY = {
  beginAtZero: true,
  border: { display: false },
  grid: { color: '#f1efeb' },
  ticks: { maxTicksLimit: 5, color: '#a8a29e', font: { size: 10.5 } }
};

const gridX = {
  border: { display: false },
  grid: { display: false },
  ticks: { color: '#a8a29e', font: { size: 10.5 } }
};

if (typeof Chart !== 'undefined') {
  Chart.defaults.font.family = "'Inter', ui-sans-serif, system-ui, sans-serif";
  Chart.defaults.font.size = 11;
  Chart.defaults.color = '#78716c';
  Chart.defaults.borderColor = '#eceae6';
  Chart.defaults.plugins.tooltip.backgroundColor = '#1c1917';
  Chart.defaults.plugins.tooltip.padding = 10;
  Chart.defaults.plugins.tooltip.cornerRadius = 8;
  Chart.defaults.plugins.tooltip.boxPadding = 4;
  Chart.defaults.plugins.tooltip.titleFont = { weight: '600' };
}

const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');
const menuBtn = document.getElementById('menuBtn');

const closeSidebar = () => {
  if (sidebar) sidebar.classList.remove('open');
  if (overlay) overlay.classList.remove('show');
};

if (sidebar && overlay && menuBtn) {
  menuBtn.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    overlay.classList.toggle('show');
  });
  overlay.addEventListener('click', closeSidebar);
}

const exportBtn = document.getElementById('btnExport');
if (exportBtn) exportBtn.addEventListener('click', () => window.print());

const setSidebarActive = key => {
  document.querySelectorAll('.nav-link[data-nav]').forEach(link => {
    link.classList.toggle('active', link.dataset.nav === key);
  });
};

const sum = values => values.reduce((total, value) => total + value, 0);
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const sharePct = (part, total) => total ? (part / total * 100) : 0;

const sparkPoints = (values, width = 100, height = 36) => {
  if (!values || values.length < 2) return '';
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  return values.map((value, index) => {
    const x = (index / (values.length - 1)) * width;
    const y = height - 4 - ((value - min) / span) * (height - 8);
    return (Math.round(x * 10) / 10) + ',' + (Math.round(y * 10) / 10);
  }).join(' ');
};

const topSearch = document.querySelector('.search input');
const pageTableSearch = document.getElementById('tableSearch');

if (topSearch) {
  topSearch.addEventListener('input', event => {
    const query = event.target.value.trim();

    if (pageTableSearch && pageTableSearch !== event.target) {
      pageTableSearch.value = query;
      pageTableSearch.dispatchEvent(new Event('input', { bubbles: true }));
    } else if (!window.__biSearchHandled) {
      const needle = query.toLowerCase();
      document.querySelectorAll('.table tbody tr').forEach(row => {
        if (row.classList.contains('empty')) return;
        row.style.display = row.textContent.toLowerCase().includes(needle) ? '' : 'none';
      });
    }

    window.dispatchEvent(new CustomEvent('app:search', { detail: { query } }));
  });
}
