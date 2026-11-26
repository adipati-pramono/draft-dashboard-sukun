/* =========================================================
   Sukun Group — BI dashboard behaviour
   ========================================================= */

window.__biSearchHandled = true;

const $ = id => document.getElementById(id);
const chartInstances = {};

const state = {
  period: 'all',
  branch: 'all',
  mix: 'omzet',
  branchQuery: '',
  customerQuery: '',
  productQuery: '',
  branchSort: { key: 'omzet', dir: -1 }
};

const AVATAR_COLORS = [
  { bg: '#fef3c7', fg: '#92400e' },
  { bg: '#ccfbf1', fg: '#0f766e' },
  { bg: '#e0e7ff', fg: '#4338ca' },
  { bg: '#ffe4e6', fg: '#be123c' },
  { bg: '#ede9fe', fg: '#6d28d9' },
  { bg: '#dcfce7', fg: '#15803d' }
];

const round1 = value => Math.round(value * 10) / 10;
const rpValue = value => value >= 1
  ? rpJt(round1(value))
  : 'Rp ' + idr.format(Math.round(value * 1000)) + ' rb';
const num = (value, digits = 1) => value.toLocaleString('id-ID', {
  minimumFractionDigits: digits,
  maximumFractionDigits: digits
});
const rpM = value => 'Rp ' + num(value / 1000, 2) + ' M';
const signedRpJt = value => {
  const sign = value > 0 ? '+ ' : value < 0 ? '- ' : '';
  return sign + 'Rp ' + idr.format(Math.round(Math.abs(value))) + ' jt';
};
const ratioText = (value, digits = 2) => num(value, digits) + 'x';

const initials = name => String(name)
  .replace(/^(PT|CV|UD|Toko)\s+/i, '')
  .replace(/[^A-Za-z0-9 .]/g, '')
  .split(' ')
  .filter(Boolean)
  .slice(0, 2)
  .map(part => part[0])
  .join('')
  .toUpperCase();

const avatarOf = index => AVATAR_COLORS[index % AVATAR_COLORS.length];

const growthHtml = value => `
  <span class="growth ${value >= 0 ? 'up' : 'down'}">
    <svg class="icon" style="width:11px;height:11px" aria-hidden="true"><use href="#i-arrow-${value >= 0 ? 'up' : 'down'}-right"/></svg>
    ${fmtPct(value)}
  </span>`;

const statusBadge = (label, cls) => `<span class="badge ${cls}">${label}</span>`;

const setDelta = (id, tone, arrow, text) => {
  const el = $(id);
  if (!el) return;
  el.className = 'delta ' + tone;
  el.innerHTML = (arrow
    ? `<svg class="icon" aria-hidden="true"><use href="#i-arrow-${arrow}-right"/></svg>`
    : '') + escapeHtml(text);
};

const setBadge = (id, cls, text) => {
  const el = $(id);
  if (!el) return;
  el.className = 'badge ' + cls;
  el.textContent = text;
};

const mountChart = (key, canvas, config) => {
  if (typeof Chart === 'undefined' || !canvas) return;
  if (chartInstances[key]) chartInstances[key].destroy();
  chartInstances[key] = new Chart(canvas, config);
};

/* ---------- Context ---------- */

const buildContext = () => {
  const period = DATA.periods[state.period] || DATA.periods.all;
  const branch = state.branch === 'all'
    ? null
    : DATA.branches.find(item => item.name === state.branch) || null;

  const start = period.start;
  const end = period.end;
  const slice = values => values.slice(start, end);
  const months = MONTHS.slice(start, end);

  const periodOmzetNat = sum(slice(DATA.monthly.omzet));
  const periodTargetNat = sum(slice(DATA.monthly.target));
  const periodQtyNat = sum(slice(DATA.monthly.qty));
  const periodKasMasukNat = sum(slice(DATA.monthly.kasMasuk));
  const periodKasKeluarNat = sum(slice(DATA.monthly.kasKeluar));
  const periodNewNat = sum(slice(DATA.monthly.customerBaru));

  const omzetFactor = branch ? branch.omzet / BI.annualOmzet : 1;
  const qtyFactor = branch ? branch.qty / BI.annualQty : 1;
  const masukFactor = branch ? branch.kasMasuk / BI.annualKasMasuk : 1;
  const keluarFactor = branch ? branch.kasKeluar / BI.annualKasKeluar : 1;

  const omzet = periodOmzetNat * omzetFactor;
  const qty = periodQtyNat * qtyFactor;
  const target = branch
    ? branch.target * (periodTargetNat / BI.annualTarget)
    : periodTargetNat;
  const kasMasuk = periodKasMasukNat * masukFactor;
  const kasKeluar = periodKasKeluarNat * keluarFactor;
  const kasNet = kasMasuk - kasKeluar;
  const achievement = sharePct(omzet, target);

  const piutang = {};
  DATA.aging.forEach(item => {
    piutang[item.key] = branch ? branch[item.key] : BI.piutang[item.key];
  });
  piutang.total = DATA.aging.reduce((total, item) => total + piutang[item.key], 0);
  piutang.overdue = piutang.b60 + piutang.b90;
  piutang.overduePct = sharePct(piutang.overdue, piutang.total);

  const lastIdx = end - 1;
  const nationalActive = DATA.monthly.customerBaru[lastIdx] + DATA.monthly.customerRepeat[lastIdx];
  const nationalNewThisMonth = DATA.monthly.customerBaru[lastIdx];
  const activeCustomers = branch ? branch.customersAktif : nationalActive;
  const newThisMonth = branch
    ? Math.round(branch.customersBaru * (nationalNewThisMonth / BI.annualNewCustomers))
    : nationalNewThisMonth;
  const repeatCustomers = Math.max(0, activeCustomers - newThisMonth);
  const repeatRate = sharePct(repeatCustomers, activeCustomers);
  const newCustomers = branch
    ? Math.round(branch.customersBaru * (periodNewNat / BI.annualNewCustomers))
    : periodNewNat;

  const visitsTarget = branch ? branch.visitsTarget : BI.visitsTarget;
  const visitsReal = branch ? branch.visitsReal : BI.visitsReal;
  const visitAchievement = sharePct(visitsReal, visitsTarget);
  const transaksi = branch ? branch.transaksi : BI.totalTransaksi;

  return {
    period,
    start,
    end,
    months,
    branch,
    isBranch: Boolean(branch),
    branchLabel: branch ? branch.short : 'nasional',
    periodOmzetNat,
    periodTargetNat,
    periodQtyNat,
    periodKasMasukNat,
    periodKasKeluarNat,
    periodNewNat,
    omzetFactor,
    qtyFactor,
    masukFactor,
    keluarFactor,
    omzet,
    qty,
    target,
    achievement,
    targetFactor: target / periodTargetNat,
    periodOmzetShare: periodOmzetNat / BI.annualOmzet,
    periodTargetShare: periodTargetNat / BI.annualTarget,
    periodKasMasukShare: periodKasMasukNat / BI.annualKasMasuk,
    periodKasKeluarShare: periodKasKeluarNat / BI.annualKasKeluar,
    kasMasuk,
    kasKeluar,
    kasNet,
    piutang,
    nationalActive,
    nationalNewThisMonth,
    activeCustomers,
    newThisMonth,
    repeatCustomers,
    repeatRate,
    newCustomers,
    visitsTarget,
    visitsReal,
    visitAchievement,
    transaksi
  };
};

/* ---------- KPI & health ---------- */

const renderKpis = ctx => {
  const growth = ctx.branch ? ctx.branch.growth : BI.totalGrowth;

  $('kpiOmzetValue').textContent = rpJuta(ctx.omzet);
  setDelta('kpiOmzetDelta', growth >= 0 ? 'pos' : 'neg', growth >= 0 ? 'up' : 'down', fmtPct(growth));
  $('kpiOmzetNote').textContent = ctx.branch
    ? `${ctx.branch.short} · ${ctx.period.label}`
    : `${ctx.period.label} · vs 2025`;

  $('kpiTargetValue').textContent = pctText(ctx.achievement);
  setDelta('kpiTargetDelta', ctx.achievement >= 100 ? 'pos' : 'neg', null,
    ctx.achievement >= 100 ? 'Tercapai' : ctx.achievement >= 95 ? 'Hampir tercapai' : 'Di bawah target');
  $('kpiTargetNote').textContent = `Realisasi ${rpJuta(ctx.omzet)} dari target ${rpJuta(ctx.target)}`;
  $('kpiTargetBar').style.width = clamp(ctx.achievement, 2, 100) + '%';
  $('kpiTargetBar').style.background = ctx.achievement >= 100
    ? '#15803d'
    : ctx.achievement >= 95 ? '#d97706' : '#dc2626';

  $('kpiPiutangValue').textContent = rpJt(round1(ctx.piutang.total));
  setDelta('kpiPiutangDelta', ctx.piutang.overduePct >= 15 ? 'neg' : 'pos', null,
    pctText(ctx.piutang.overduePct, 2) + ' jatuh tempo');
  $('kpiPiutangNote').textContent = ctx.branch
    ? `${ctx.branch.short} · per 22 Nov 2026`
    : 'Outstanding per 22 Nov 2026';
  $('kpiAgingBar').innerHTML = DATA.aging.map(item => `
    <i style="width:${sharePct(ctx.piutang[item.key], ctx.piutang.total)}%;background:${item.color}"></i>
  `).join('');

  $('kpiKasValue').textContent = rpJuta(ctx.kasNet);
  const kasRatio = ctx.kasKeluar ? ctx.kasMasuk / ctx.kasKeluar * 100 : 0;
  setDelta('kpiKasDelta', ctx.kasNet >= 0 ? 'pos' : 'neg', null, pctText(kasRatio) + ' rasio');
  $('kpiKasNote').textContent = `${ctx.period.label} · ${ctx.branchLabel}`;

  const omzetSeries = ctx.months.map((_, index) =>
    DATA.monthly.omzet[ctx.start + index] * ctx.omzetFactor);
  const kasSeries = ctx.months.map((_, index) =>
    DATA.monthly.kasMasuk[ctx.start + index] * ctx.masukFactor
    - DATA.monthly.kasKeluar[ctx.start + index] * ctx.keluarFactor);

  $('sparkOmzet').setAttribute('points', sparkPoints(omzetSeries));
  $('sparkKas').setAttribute('points', sparkPoints(kasSeries));
};

const renderHealth = ctx => {
  $('healthQty').textContent = idr.format(Math.round(ctx.qty)) + ' btg';
  $('healthQtyNote').textContent = ctx.branch
    ? `${ctx.branch.short} · ${fmtPct(BI.qtyGrowth)} vs 2025`
    : `${fmtPct(BI.qtyGrowth)} vs 2025 · ${ctx.period.label}`;

  $('healthTrx').textContent = idr.format(ctx.transaksi);
  $('healthTrxNote').textContent = `${ctx.branchLabel} · November 2026`;

  $('healthCustomer').textContent = idr.format(ctx.activeCustomers);
  $('healthCustomerNote').textContent = `${idr.format(ctx.newThisMonth)} baru bulan ini`;

  const critical = BI.stockCritical.length;
  const low = BI.stockLow.length;
  $('healthStock').textContent = low + ' SKU';
  $('healthStockNote').textContent = `${critical} kritis · ${low - critical} menipis`;
};

/* ---------- Charts ---------- */

const renderOmzetChart = ctx => {
  const realisasi = ctx.months.map((_, index) =>
    DATA.monthly.omzet[ctx.start + index] * ctx.omzetFactor);
  const target = ctx.months.map((_, index) =>
    DATA.monthly.target[ctx.start + index] * ctx.targetFactor);

  mountChart('omzet', $('chartOmzet'), {
    type: 'bar',
    data: {
      labels: ctx.months,
      datasets: [
        {
          label: 'Realisasi',
          data: realisasi,
          backgroundColor: '#d97706',
          hoverBackgroundColor: '#b45309',
          borderRadius: 5,
          maxBarThickness: 26
        },
        {
          type: 'line',
          label: 'Target',
          data: target,
          borderColor: '#a8a29e',
          borderDash: [5, 4],
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 3,
          tension: 0
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: legendStyle,
        tooltip: {
          callbacks: {
            label: item => ' ' + item.dataset.label + ': ' + rpJuta(item.parsed.y)
          }
        }
      },
      scales: {
        x: gridX,
        y: {
          ...gridY,
          ticks: { ...gridY.ticks, callback: value => value + ' jt' }
        }
      }
    }
  });
};

const renderMixChart = ctx => {
  const metric = state.mix;
  const factor = metric === 'omzet' ? ctx.omzetFactor : ctx.qtyFactor;
  const values = DATA.products.map(product => product[metric] * factor);
  const total = sum(values);

  mountChart('mix', $('chartMix'), {
    type: 'doughnut',
    data: {
      labels: DATA.products.map(product => product.name),
      datasets: [{
        data: values,
        backgroundColor: DATA.products.map(product => product.color),
        borderColor: '#ffffff',
        borderWidth: 3,
        hoverOffset: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '72%',
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: item => {
              const value = metric === 'omzet' ? rpJuta(item.parsed) : idr.format(Math.round(item.parsed)) + ' btg';
              return ' ' + item.label + ': ' + value + ' (' + pctText(sharePct(item.parsed, total)) + ')';
            }
          }
        }
      }
    }
  });

  $('mixCenter').textContent = metric === 'omzet' ? rpJuta(total) : idr.format(Math.round(total)) + ' btg';
  $('mixCenterLabel').textContent = metric === 'omzet' ? 'Total omzet' : 'Total quantity';
  $('mixLegend').innerHTML = DATA.products.map((product, index) => `
    <li>
      <span class="dot" style="background:${product.color}"></span>${escapeHtml(product.short)}
      <b>${metric === 'omzet' ? rpJuta(values[index]) : idr.format(Math.round(values[index])) + ' btg'}</b>
    </li>
  `).join('');
};

const renderPiutangChart = ctx => {
  const values = DATA.aging.map(item => ctx.piutang[item.key]);

  mountChart('piutang', $('chartPiutang'), {
    type: 'doughnut',
    data: {
      labels: DATA.aging.map(item => item.label),
      datasets: [{
        data: values,
        backgroundColor: DATA.aging.map(item => item.color),
        borderColor: '#ffffff',
        borderWidth: 3,
        hoverOffset: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '72%',
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: item => ' ' + item.label + ': ' + rpJt(round1(item.parsed))
          }
        }
      }
    }
  });

  $('piutangCenter').textContent = rpJt(round1(ctx.piutang.total));
  $('agingLegend').innerHTML = DATA.aging.map(item => `
    <li>
      <span class="dot" style="background:${item.color}"></span>${item.label}
      <b>${rpJt(round1(ctx.piutang[item.key]))}</b>
    </li>
  `).join('');

  const debtors = DATA.customers
    .map(customer => ({
      ...customer,
      total: round1(customer.lancar + customer.b30 + customer.b60 + customer.b90)
    }))
    .filter(customer => !ctx.branch || customer.branch === ctx.branch.name)
    .sort((a, b) => b.total - a.total)
    .slice(0, 3);

  $('debtorList').innerHTML = `
    <div class="mini-head"><span>Piutang terbesar</span><span>Nilai</span></div>
    ${debtors.map(customer => `
      <div class="debtor"><span>${escapeHtml(customer.name)}</span><b>${rpJt(customer.total)}</b></div>
    `).join('')}
  `;
};

const renderKasChart = ctx => {
  const masuk = ctx.months.map((_, index) =>
    DATA.monthly.kasMasuk[ctx.start + index] * ctx.masukFactor);
  const keluar = ctx.months.map((_, index) =>
    DATA.monthly.kasKeluar[ctx.start + index] * ctx.keluarFactor);

  mountChart('kas', $('chartKas'), {
    type: 'bar',
    data: {
      labels: ctx.months,
      datasets: [
        {
          label: 'Kas Masuk',
          data: masuk,
          backgroundColor: '#0f766e',
          hoverBackgroundColor: '#115e59',
          borderRadius: 4,
          maxBarThickness: 12
        },
        {
          label: 'Kas Keluar',
          data: keluar,
          backgroundColor: '#f43f5e',
          hoverBackgroundColor: '#e11d48',
          borderRadius: 4,
          maxBarThickness: 12
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: legendStyle,
        tooltip: {
          callbacks: {
            label: item => ' ' + item.dataset.label + ': ' + rpJuta(item.parsed.y)
          }
        }
      },
      scales: {
        x: gridX,
        y: {
          ...gridY,
          ticks: { ...gridY.ticks, callback: value => value + ' jt' }
        }
      }
    }
  });
};

const renderCustomerChart = ctx => {
  const newFactor = ctx.isBranch ? ctx.newCustomers / ctx.periodNewNat : 1;
  const repeatFactor = ctx.isBranch ? ctx.activeCustomers / ctx.nationalActive : 1;
  const baru = ctx.months.map((_, index) =>
    DATA.monthly.customerBaru[ctx.start + index] * newFactor);
  const repeat = ctx.months.map((_, index) =>
    DATA.monthly.customerRepeat[ctx.start + index] * repeatFactor);

  mountChart('customer', $('chartCustomer'), {
    type: 'line',
    data: {
      labels: ctx.months,
      datasets: [
        {
          label: 'Pelanggan Baru',
          data: baru,
          borderColor: '#d97706',
          backgroundColor: 'rgba(217, 119, 6, .06)',
          fill: true,
          tension: .4,
          borderWidth: 2,
          pointRadius: 3,
          pointBackgroundColor: '#ffffff',
          pointBorderColor: '#d97706',
          pointBorderWidth: 2
        },
        {
          label: 'Pelanggan Repeat',
          data: repeat,
          borderColor: '#0f766e',
          backgroundColor: 'transparent',
          fill: false,
          tension: .4,
          borderWidth: 2,
          pointRadius: 3,
          pointBackgroundColor: '#ffffff',
          pointBorderColor: '#0f766e',
          pointBorderWidth: 2
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: {
          ...legendStyle,
          labels: { ...legendStyle.labels, padding: 12 }
        },
        tooltip: {
          callbacks: {
            label: item => ' ' + item.dataset.label + ': ' + idr.format(Math.round(item.parsed.y)) + ' pelanggan'
          }
        }
      },
      scales: { x: gridX, y: gridY }
    }
  });
};

const renderKunjunganChart = ctx => {
  const labels = DATA.branches.map(branch => branch.short);
  const target = DATA.branches.map(branch => branch.visitsTarget);
  const realisasi = DATA.branches.map(branch => branch.visitsReal);
  const colors = DATA.branches.map(branch =>
    ctx.branch && branch.name === ctx.branch.name ? '#b45309' : '#d97706');

  mountChart('kunjungan', $('chartKunjungan'), {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Realisasi',
          data: realisasi,
          backgroundColor: colors,
          borderRadius: 4,
          maxBarThickness: 12
        },
        {
          label: 'Target',
          data: target,
          backgroundColor: '#e7e5e4',
          borderRadius: 4,
          maxBarThickness: 12
        }
      ]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: {
          ...legendStyle,
          labels: { ...legendStyle.labels, padding: 12 }
        },
        tooltip: {
          callbacks: {
            label: item => ' ' + item.dataset.label + ': ' + idr.format(item.parsed.x) + ' kunjungan'
          }
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          border: { display: false },
          grid: { color: '#f1efeb' },
          ticks: { color: '#a8a29e', font: { size: 10.5 } }
        },
        y: {
          border: { display: false },
          grid: { display: false },
          ticks: { color: '#44403c', font: { size: 11 } }
        }
      }
    }
  });
};

const renderTransaksiChart = ctx => {
  const share = ctx.isBranch ? ctx.transaksi / BI.totalTransaksi : 1;
  const daily = DATA.transactions.daily.map(value => Math.round(value * share));

  mountChart('transaksi', $('chartTransaksi'), {
    type: 'line',
    data: {
      labels: Array.from({ length: daily.length }, (_, index) => index + 1),
      datasets: [{
        data: daily,
        borderColor: '#4338ca',
        backgroundColor: 'rgba(67, 56, 202, .08)',
        fill: true,
        tension: .35,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 4,
        pointHoverBackgroundColor: '#4338ca',
        pointHoverBorderColor: '#ffffff',
        pointHoverBorderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            title: items => 'Hari ke-' + items[0].label,
            label: item => ' ' + idr.format(item.parsed.y) + ' transaksi'
          }
        }
      },
      scales: {
        x: {
          ...gridX,
          ticks: { ...gridX.ticks, maxTicksLimit: 8 }
        },
        y: {
          ...gridY,
          beginAtZero: true,
          ticks: {
            ...gridY.ticks,
            callback: value => idr.format(value)
          }
        }
      }
    }
  });
};

const renderCharts = ctx => {
  renderOmzetChart(ctx);
  renderMixChart(ctx);
  renderPiutangChart(ctx);
  renderKasChart(ctx);
  renderCustomerChart(ctx);
  renderKunjunganChart(ctx);
  renderTransaksiChart(ctx);
};

/* ---------- Branch table ---------- */

const branchRows = ctx => DATA.branches.map(branch => {
  const omzet = branch.omzet * ctx.periodOmzetShare;
  const target = branch.target * ctx.periodTargetShare;
  const piutang = branch.lancar + branch.b30 + branch.b60 + branch.b90;
  const overdue = branch.b60 + branch.b90;
  const kasNet = branch.kasMasuk * ctx.periodKasMasukShare
    - branch.kasKeluar * ctx.periodKasKeluarShare;

  return {
    name: branch.name,
    short: branch.short,
    omzet,
    target,
    share: sharePct(omzet, ctx.periodOmzetNat),
    growth: branch.growth,
    piutang,
    overduePct: sharePct(overdue, piutang),
    kasNet,
    achievement: sharePct(omzet, target)
  };
});

const renderBranchTable = ctx => {
  const query = state.branchQuery.toLowerCase();
  const rows = branchRows(ctx)
    .filter(row => row.name.toLowerCase().includes(query))
    .sort((a, b) => {
      const key = state.branchSort.key;
      const direction = state.branchSort.dir;
      if (key === 'name') return a.name.localeCompare(b.name, 'id') * direction;
      return ((a[key] ?? 0) - (b[key] ?? 0)) * direction;
    });

  $('branchBody').innerHTML = rows.length
    ? rows.map(row => {
        const avatar = avatarOf(DATA.branches.findIndex(branch => branch.name === row.name));
        const selected = ctx.branch && ctx.branch.name === row.name;
        const targetCls = row.achievement >= 100 ? 'ok' : row.achievement >= 95 ? 'warn' : 'bad';
        return `
          <tr class="clickable ${selected ? 'is-selected' : ''}" data-branch="${escapeHtml(row.name)}">
            <td>
              <div class="entity">
                <span class="entity-avatar" style="background:${avatar.bg};color:${avatar.fg}">${initials(row.short)}</span>
                <div>
                  <span class="entity-name">${escapeHtml(row.name)}</span>
                  <span class="cell-sub">${ctx.period.label}</span>
                </div>
              </div>
            </td>
            <td class="num">${rpJt(Math.round(row.omzet))}</td>
            <td class="num">${pctText(row.share)}</td>
            <td>${growthHtml(row.growth)}</td>
            <td class="num">${rpJt(round1(row.piutang))}</td>
            <td class="num"><span class="${row.overduePct >= 15 ? 'text-danger' : ''}">${pctText(row.overduePct)}</span></td>
            <td class="num"><span class="${row.kasNet >= 0 ? 'positive' : 'negative'}">${signedRpJt(row.kasNet)}</span></td>
            <td class="num">${statusBadge(pctText(row.achievement), targetCls)}</td>
          </tr>`;
      }).join('')
    : '<tr><td class="empty" colspan="8">Tidak ada cabang yang cocok dengan pencarian.</td></tr>';

  $('branchFoot').textContent = `Menampilkan ${rows.length} dari ${DATA.branches.length} cabang`;

  document.querySelectorAll('#branchTable th.sortable').forEach(th => {
    const indicator = th.querySelector('.sort-ind');
    if (indicator) {
      indicator.textContent = th.dataset.key === state.branchSort.key
        ? (state.branchSort.dir === 1 ? '↑' : '↓')
        : '↕';
    }
  });
};

/* ---------- Customer & sales ---------- */

const renderTopCustomers = ctx => {
  const query = state.customerQuery.toLowerCase();
  const factor = ctx.periodOmzetNat / BI.annualOmzet;

  const rows = DATA.customers
    .filter(customer => !ctx.branch || customer.branch === ctx.branch.name)
    .filter(customer => {
      const haystack = `${customer.name} ${customer.segmen} ${customer.branch}`.toLowerCase();
      return haystack.includes(query);
    })
    .map(customer => {
      const omzet = customer.omzet * factor;
      const piutang = round1(customer.lancar + customer.b30 + customer.b60 + customer.b90);
      return {
        ...customer,
        omzet,
        piutang,
        share: sharePct(omzet, ctx.omzet)
      };
    })
    .sort((a, b) => b.omzet - a.omzet);

  $('topCustomerBody').innerHTML = rows.length
    ? rows.map((customer, index) => {
        const avatar = avatarOf(index);
        return `
          <tr>
            <td>
              <div class="entity">
                <span class="entity-avatar" style="background:${avatar.bg};color:${avatar.fg}">${initials(customer.name)}</span>
                <div>
                  <span class="entity-name">${escapeHtml(customer.name)}</span>
                  <span class="cell-sub">${escapeHtml(customer.segmen)} · ${escapeHtml(customer.branch.replace('Cabang ', ''))}</span>
                </div>
              </div>
            </td>
            <td class="num">${rpJt(Math.round(customer.omzet))}</td>
            <td class="num">
              <div class="contrib">
                <div class="progress"><i style="width:${clamp(customer.share, 0, 100)}%;background:#d97706"></i></div>
                <b>${pctText(customer.share)}</b>
              </div>
            </td>
            <td class="num">${rpJt(customer.piutang)}</td>
            <td>${growthHtml(customer.growth)}</td>
          </tr>`;
      }).join('')
    : '<tr><td class="empty" colspan="5">Tidak ada customer yang cocok dengan pencarian.</td></tr>';

  $('topCustomerBadge').textContent = rows.length + ' customer';
  $('topCustomerFoot').textContent = `Menampilkan ${rows.length} dari ${DATA.customers.filter(customer => !ctx.branch || customer.branch === ctx.branch.name).length} customer`;
};

const renderSales = ctx => {
  const factor = ctx.periodOmzetNat / BI.annualOmzet;
  const rows = DATA.sales
    .map(sales => ({ ...sales, omzet: sales.omzet * factor }))
    .sort((a, b) => b.omzet - a.omzet);
  const total = sum(rows.map(row => row.omzet));

  $('salesList').innerHTML = rows.map((sales, index) => {
    const avatar = avatarOf(index + 1);
    const share = sharePct(sales.omzet, total);
    const visitPct = sharePct(sales.visitsReal, sales.visitsTarget);
    return `
      <div class="leader-item">
        <div class="leader-head">
          <span class="leader-rank">${index + 1}</span>
          <span class="entity-avatar" style="background:${avatar.bg};color:${avatar.fg}">${initials(sales.name)}</span>
          <span class="entity-name">${escapeHtml(sales.name)}</span>
          <b>${rpJuta(sales.omzet)}</b>
        </div>
        <div class="progress"><i style="width:${clamp(share, 0, 100)}%;background:#d97706"></i></div>
        <div class="leader-sub">
          <span>${pctText(share)} kontribusi</span>
          <span>${idr.format(sales.visitsReal)} kunjungan · ${pctText(visitPct)} target</span>
        </div>
      </div>`;
  }).join('');
};

/* ---------- Stock ---------- */

const renderStock = () => {
  const query = state.productQuery.toLowerCase();
  const rows = BI.stock.filter(product => product.name.toLowerCase().includes(query));

  $('stockBody').innerHTML = rows.length
    ? rows.map(product => {
        const badge = product.status === 'Aman' ? 'ok' : product.status === 'Menipis' ? 'warn' : 'bad';
        const color = product.status === 'Aman' ? '#15803d' : product.status === 'Menipis' ? '#d97706' : '#dc2626';
        return `
          <tr>
            <td><div class="prod"><span class="prod-dot" style="background:${product.color}"></span>${escapeHtml(product.name)}</div></td>
            <td class="num">${idr.format(product.stock)}</td>
            <td><div class="progress"><i style="width:${product.level}%;background:${color}"></i></div></td>
            <td class="num">${idr.format(product.min)}</td>
            <td>${statusBadge(product.status, badge)}</td>
          </tr>`;
      }).join('')
    : '<tr><td class="empty" colspan="5">Tidak ada produk yang cocok dengan pencarian.</td></tr>';
};

/* ---------- Balance & insights ---------- */

const renderBalance = () => {
  const bs = DATA.balanceSheet;
  const assetCurrentShare = sharePct(bs.assets.current, bs.assets.total);
  const assetFixedShare = sharePct(bs.assets.nonCurrent, bs.assets.total);
  const liabCurrentShare = sharePct(bs.liabilities.current, bs.liabilities.total);
  const liabLongShare = sharePct(bs.liabilities.nonCurrent, bs.liabilities.total);
  const capital = bs.equity.components[0].value;
  const retained = bs.equity.components[1].value;
  const capitalShare = sharePct(capital, bs.equity.total);
  const retainedShare = sharePct(retained, bs.equity.total);

  $('balAset').textContent = rpM(bs.assets.total);
  $('balAsetCurrent').textContent = `${rpM(bs.assets.current)} · ${pctText(assetCurrentShare)}`;
  $('balAsetFixed').textContent = `${rpM(bs.assets.nonCurrent)} · ${pctText(assetFixedShare)}`;

  $('balKewajiban').textContent = rpM(bs.liabilities.total);
  $('balLiabCurrent').textContent = `${rpM(bs.liabilities.current)} · ${pctText(liabCurrentShare)}`;
  $('balLiabLong').textContent = `${rpM(bs.liabilities.nonCurrent)} · ${pctText(liabLongShare)}`;

  $('balEkuitas').textContent = rpM(bs.equity.total);
  $('balCapital').textContent = `${rpM(capital)} · ${pctText(capitalShare)}`;
  $('balRetained').textContent = `${rpM(retained)} · ${pctText(retainedShare)}`;

  $('ratioCurrent').textContent = ratioText(BI.ratios.current);
  $('ratioCash').textContent = ratioText(BI.ratios.cash);
  $('ratioDer').textContent = pctText(BI.ratios.der * 100);
  $('ratioTurnover').textContent = ratioText(BI.ratios.assetTurnover);
};

const insightHtml = (tone, icon, title, text) => `
  <div class="insight ${tone}">
    <div class="insight-icon"><svg class="icon" aria-hidden="true"><use href="#i-${icon}"/></svg></div>
    <div>
      <b>${escapeHtml(title)}</b>
      <p>${escapeHtml(text)}</p>
    </div>
  </div>`;

const renderInsights = ctx => {
  const targetTone = ctx.achievement >= 100 ? 'pos' : ctx.achievement >= 95 ? 'warn' : 'bad';
  const targetText = `Omzet ${ctx.period.label} ${rpJuta(ctx.omzet)} dari target ${rpJuta(ctx.target)}${ctx.branch ? ' — ' + ctx.branch.short : ''}.`;

  const topBranch = [...DATA.branches].sort((a, b) => b.omzet - a.omzet)[0];
  const branchTitle = ctx.branch ? `Fokus ${ctx.branch.short}` : `Cabang teratas: ${topBranch.short}`;
  const branchText = ctx.branch
    ? `Omzet ${rpJuta(ctx.omzet)} (${pctText(ctx.achievement)} target), pertumbuhan ${fmtPct(ctx.branch.growth)}, piutang jatuh tempo ${pctText(ctx.piutang.overduePct)}.`
    : `Kontribusi ${pctText(sharePct(topBranch.omzet, BI.annualOmzet))} omzet nasional; pertumbuhan ${fmtPct(topBranch.growth)}.`;

  const piutangTone = ctx.piutang.overduePct > 20 ? 'bad' : ctx.piutang.overduePct > 15 ? 'warn' : 'pos';
  const piutangText = `${rpJt(round1(ctx.piutang.overdue))} berumur 31+ hari; ${rpJt(round1(ctx.piutang.b90))} sudah di atas 60 hari${ctx.branch ? ' di ' + ctx.branch.short : ''}.`;

  const stockNames = BI.stockLow.map(product => `${product.name} (${product.status.toLowerCase()})`).join(', ');
  const stockText = `${stockNames} berada di bawah batas minimum. Prioritaskan restock ${BI.stockCritical.map(product => product.name).join(', ') || 'yang berstatus menipis'}.`;

  const loyaltyTone = ctx.repeatRate >= 75 ? 'pos' : 'warn';
  const loyaltyText = `Kas bersih ${rpJuta(ctx.kasNet)}; repeat rate ${pctText(ctx.repeatRate)} dari ${idr.format(ctx.activeCustomers)} pelanggan aktif.`;

  $('insightList').innerHTML = [
    insightHtml(targetTone, 'target', `Pencapaian target ${pctText(ctx.achievement)}`, targetText),
    insightHtml('pos', 'map-pin', branchTitle, branchText),
    insightHtml(piutangTone, 'credit-card', `Piutang ${pctText(ctx.piutang.overduePct)} jatuh tempo`, piutangText),
    insightHtml('warn', 'archive', `${BI.stockLow.length} SKU perlu restock`, stockText),
    insightHtml(loyaltyTone, 'shield', 'Arus kas & loyalitas', loyaltyText)
  ].join('');
};

/* ---------- Action plan ---------- */

const actionItem = (index, action) => `
  <div class="action-item">
    <div class="action-top">
      <span class="action-num">${String(index + 1).padStart(2, '0')}</span>
      <div>
        <b>${escapeHtml(action.title)}</b>
        <p>${escapeHtml(action.desc)}</p>
      </div>
    </div>
    <div class="action-meta">
      <span>Owner: ${escapeHtml(action.owner)}</span>
      <span>Tenggat: ${escapeHtml(action.due)}</span>
      <span class="action-impact">Dampak: ${escapeHtml(action.impact)}</span>
    </div>
  </div>`;

const actionColumn = (tone, title, range, badgeCls, items) => `
  <div class="action-col ${tone}">
    <div class="action-head">
      <div>
        <h3>${escapeHtml(title)}</h3>
        <small>${escapeHtml(range)}</small>
      </div>
      <span class="badge ${badgeCls}">${items.length} aksi</span>
    </div>
    ${items.map((action, index) => actionItem(index, action)).join('')}
  </div>`;

const renderActionPlan = ctx => {
  const rows = branchRows(ctx);
  const focus = ctx.branch
    ? rows.find(row => row.name === ctx.branch.name)
    : [...rows].sort((a, b) => a.achievement - b.achievement)[0];
  const weakestVisit = [...DATA.branches]
    .sort((a, b) => sharePct(a.visitsReal, a.visitsTarget) - sharePct(b.visitsReal, b.visitsTarget))[0];
  const visitFocus = ctx.branch || weakestVisit;
  const visitRate = sharePct(visitFocus.visitsReal, visitFocus.visitsTarget);
  const negativeBranch = [...DATA.branches].sort((a, b) => a.growth - b.growth)[0];
  const negativeProducts = DATA.products.filter(product => product.growth < 0);
  const topProducts = [...DATA.products].sort((a, b) => b.omzet - a.omzet).slice(0, 2);

  const overdueCustomers = DATA.customers.filter(customer =>
    (!ctx.branch || customer.branch === ctx.branch.name)
    && customer.b60 + customer.b90 > 0);
  const suffix = ctx.isBranch ? ` di ${ctx.branch.short}` : '';
  const targetGap = Math.max(0, focus.target - focus.omzet);
  const lowStock = BI.stockLow;
  const stockText = lowStock.map(product =>
    `${product.name} (${idr.format(product.stock)} vs min ${idr.format(product.min)}, ${product.status.toLowerCase()})`).join('; ');

  const short = [
    {
      title: 'Tuntaskan piutang jatuh tempo',
      desc: `Prioritaskan ${overdueCustomers.length} pelanggan dengan aging 31+ hari senilai ${rpJt(round1(ctx.piutang.overdue))}${suffix}. Kirim reminder dan jadwalkan kunjungan penagihan.`,
      owner: 'Finance',
      due: '7 hari',
      impact: `Kas +${rpJt(round1(ctx.piutang.overdue))}`
    },
    {
      title: lowStock.length ? `Restock ${lowStock.length} SKU di bawah minimum` : 'Jaga level stok minimum',
      desc: lowStock.length
        ? `${stockText}. Terbitkan PO prioritas${BI.stockCritical.length ? `, mulai dari ${BI.stockCritical.map(product => product.name).join(', ')} yang berstatus kritis` : ''} agar penjualan tidak terganggu.`
        : 'Semua SKU di atas minimum; pertahankan buffer stok untuk produk dengan permintaan tertinggi.',
      owner: 'Supply Chain',
      due: '14 hari',
      impact: 'Cegah lost sales'
    },
    {
      title: focus.achievement >= 100
        ? `Pertahankan momentum ${focus.short}`
        : `Kejar target ${focus.short}`,
      desc: focus.achievement >= 100
        ? `${focus.short} sudah mencapai ${pctText(focus.achievement)} dari target periode; dokumentasikan praktik terbaik untuk direplikasi.`
        : `${focus.short} baru ${pctText(focus.achievement)} dari target periode; tambah kunjungan aktif dan push sales senilai ${rpValue(targetGap)}.`,
      owner: 'Sales',
      due: '30 hari',
      impact: targetGap > 0 ? '+' + rpValue(targetGap) : 'Jaga pertumbuhan'
    }
  ];

  const medium = [
    {
      title: 'Evaluasi produk bertumbuh negatif',
      desc: `Tinjau harga, distribusi, dan bundling ${negativeProducts.map(product => `${product.name} (${fmtPct(product.growth)})`).join(', ')} bersama produk juara; tetapkan target pemulihan dalam 90 hari.`,
      owner: 'Marketing',
      due: '60–90 hari',
      impact: 'Perbaiki product mix'
    },
    {
      title: visitRate >= 100
        ? `Pertahankan kunjungan ${visitFocus.short}`
        : `Naikkan kunjungan ${visitFocus.short}`,
      desc: visitRate >= 100
        ? `${visitFocus.short} sudah ${pctText(visitRate)} dari target kunjungan; replikasi ritme kunjungan ke cabang dengan capaian terendah.`
        : `${visitFocus.short} baru ${pctText(visitRate)} dari target kunjungan; terapkan coaching rute dan evaluasi hasil per sales.`,
      owner: 'Sales Ops',
      due: '60 hari',
      impact: visitRate >= 100
        ? 'Jaga produktivitas'
        : `+${idr.format(Math.max(0, visitFocus.visitsTarget - visitFocus.visitsReal))} kunjungan`
    },
    {
      title: 'Perketat kebijakan kredit',
      desc: `Terapkan credit limit dan termin bertingkat bagi ${overdueCustomers.length} pelanggan berisiko${suffix}; target overdue di bawah 15% dari total piutang.`,
      owner: 'Finance',
      due: '90 hari',
      impact: 'Turunkan overdue'
    }
  ];

  const long = [
    {
      title: `Perluas distribusi ${negativeBranch.short}`,
      desc: `${negativeBranch.name} tumbuh ${fmtPct(negativeBranch.growth)}; buka kanal distribusi baru dan evaluasi cakupan area untuk memulihkan volume.`,
      owner: 'Business Dev',
      due: '6–12 bulan',
      impact: 'Pulihkan pertumbuhan'
    },
    {
      title: 'Rasionalisasi portofolio produk',
      desc: `Prioritaskan ${topProducts.map(product => product.name).join(' & ')} sebagai produk penggerak dan evaluasi kelayakan produk dengan tren negatif; targetkan top-2 menyumbang minimal 60% omzet.`,
      owner: 'Product',
      due: '6–12 bulan',
      impact: 'Margin mix +'
    },
    {
      title: 'Digitalisasi penagihan & stok',
      desc: 'Integrasikan data aging, penjualan, dan stok untuk credit scoring otomatis serta demand forecasting; target overdue di bawah 10% dan stockout nol.',
      owner: 'IT & Finance',
      due: '12 bulan',
      impact: 'Efisiensi kas'
    }
  ];

  $('actionPlanGrid').innerHTML = [
    actionColumn('short', 'Jangka Pendek', '0–30 hari · eksekusi cepat', 'bad', short),
    actionColumn('mid', 'Jangka Menengah', '1–3 bulan · perbaikan proses', 'warn', medium),
    actionColumn('long', 'Jangka Panjang', '3–12 bulan · transformasi', 'info', long)
  ].join('');

  $('actionPlanSub').textContent = `Prioritas ${ctx.period.label} · ${ctx.isBranch ? ctx.branch.short : 'semua cabang'}`;
  $('actionPlanBadge').textContent = `${short.length + medium.length + long.length} aksi`;
};

/* ---------- Labels & controls ---------- */

const renderLabels = ctx => {
  $('omzetSub').textContent = `Realisasi vs target bulanan (juta rupiah) — ${ctx.branchLabel}, ${ctx.period.label}`;
  $('mixSub').textContent = `${ctx.isBranch ? 'Estimasi kontribusi' : 'Kontribusi'} ${state.mix === 'omzet' ? 'omzet' : 'quantity'} produk — ${ctx.period.label}`;
  $('piutangSub').textContent = ctx.branch
    ? `Umur piutang ${ctx.branch.short} per 22 Nov 2026`
    : 'Analisis umur piutang usaha (aging)';
  $('kasSub').textContent = `Arus kas bulanan (juta rupiah) — ${ctx.branchLabel}, ${ctx.period.label}`;
  $('cabangSub').textContent = `Omzet, pertumbuhan, piutang, dan arus kas per cabang — ${ctx.period.label}`;
  $('customerSub').textContent = `Pelanggan baru vs repeat per bulan — ${ctx.isBranch ? 'estimasi ' + ctx.branch.short : 'nasional'}`;
  $('kunjunganSub').textContent = `Target dan realisasi kunjungan per cabang — ${ctx.isBranch ? 'fokus ' + ctx.branch.short : 'semua cabang'}, November 2026`;
  $('transaksiSub').textContent = `Volume transaksi harian — ${ctx.branchLabel}, November 2026`;
  $('topCustomerSub').textContent = `Pelanggan dengan kontribusi omzet terbesar — ${ctx.isBranch ? 'di ' + ctx.branch.short : 'nasional'}`;
  $('insightSub').textContent = `Filter: ${ctx.period.label} · ${ctx.isBranch ? ctx.branch.short : 'semua cabang'}`;

  $('omzetBadge').textContent = rpJuta(ctx.omzet);
  $('omzetMetricReal').textContent = rpJuta(ctx.omzet);
  $('omzetMetricTarget').textContent = rpJuta(ctx.target);
  $('omzetMetricGap').textContent = signedRpJt(ctx.omzet - ctx.target);
  $('omzetMetricGap').className = ctx.omzet >= ctx.target ? 'positive' : 'negative';

  $('piutangBadge').textContent = 'Total ' + rpJt(round1(ctx.piutang.total));

  const kasBadge = $('kasBadge');
  kasBadge.textContent = 'Net ' + rpJuta(ctx.kasNet);
  kasBadge.className = 'badge ' + (ctx.kasNet >= 0 ? 'ok' : 'bad');
  $('kasMasuk').textContent = rpJuta(ctx.kasMasuk);
  $('kasKeluar').textContent = rpJuta(ctx.kasKeluar);
  $('kasNet').textContent = rpJuta(ctx.kasNet);

  $('customerBadge').textContent = idr.format(ctx.activeCustomers) + ' aktif';
  $('customerActive').textContent = idr.format(ctx.activeCustomers);
  $('customerNew').textContent = idr.format(ctx.newThisMonth);
  $('customerRepeat').textContent = pctText(ctx.repeatRate);

  $('visitBadge').textContent = pctText(ctx.visitAchievement) + ' target';
  $('visitTotal').textContent = idr.format(ctx.visitsReal);
  $('visitRate').textContent = pctText(ctx.visitAchievement);
  const bestBranch = [...DATA.branches]
    .sort((a, b) => sharePct(b.visitsReal, b.visitsTarget) - sharePct(a.visitsReal, a.visitsTarget))[0];
  $('visitBest').textContent = bestBranch.short;

  const stockBadge = $('stockBadge');
  stockBadge.textContent = `${BI.stockLow.length} perlu restock`;
  stockBadge.className = 'badge ' + (BI.stockCritical.length ? 'bad' : BI.stockLow.length ? 'warn' : 'ok');

  $('trxBadge').textContent = idr.format(ctx.transaksi) + ' transaksi';
  $('cabangBadge').textContent = DATA.branches.length + ' cabang';

  document.querySelectorAll('#periodSeg button').forEach(button => {
    button.classList.toggle('active', button.dataset.period === state.period);
  });

  document.querySelectorAll('#mixToggle button').forEach(button => {
    button.classList.toggle('active', button.dataset.mix === state.mix);
  });

  const focusChip = $('focusChip');
  focusChip.hidden = !ctx.branch;
  if (ctx.branch) $('focusLabel').textContent = `${ctx.branch.short} · ${ctx.period.label}`;

  $('branchSelect').value = state.branch;
};

/* ---------- Orchestration ---------- */

const renderAll = () => {
  const ctx = buildContext();
  renderLabels(ctx);
  renderKpis(ctx);
  renderHealth(ctx);
  renderCharts(ctx);
  renderBranchTable(ctx);
  renderTopCustomers(ctx);
  renderSales(ctx);
  renderStock();
  renderBalance();
  renderInsights(ctx);
  renderActionPlan(ctx);
};

const resetFilters = () => {
  state.period = 'all';
  state.branch = 'all';
  state.mix = 'omzet';
  state.branchQuery = '';
  state.customerQuery = '';
  state.productQuery = '';
  state.branchSort = { key: 'omzet', dir: -1 };

  if ($('branchSearch')) $('branchSearch').value = '';
  if ($('customerSearch')) $('customerSearch').value = '';
  const globalSearch = document.querySelector('.search input');
  if (globalSearch) globalSearch.value = '';

  renderAll();
};

/* ---------- Scroll spy ---------- */

const initScrollSpy = () => {
  const navLinks = Array.from(document.querySelectorAll('.nav-link[data-nav]'));
  const sections = navLinks
    .map(link => document.querySelector(link.getAttribute('href')))
    .filter(Boolean)
    .sort((a, b) => a.offsetTop - b.offsetTop);

  if (!sections.length) return;

  const setActive = id => {
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + id);
    });
  };

  let lockedId = null;

  const onScroll = () => {
    if (lockedId) return;
    if (window.scrollY < 80) {
      setActive(sections[0].id);
      return;
    }

    const line = 140;
    let current = sections[0];
    let bestTop = -Infinity;
    sections.forEach(section => {
      const top = section.getBoundingClientRect().top;
      if (top <= line && top > bestTop) {
        bestTop = top;
        current = section;
      }
    });

    const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
    if (atBottom) current = sections[sections.length - 1];
    setActive(current.id);
  };

  document.addEventListener('scroll', onScroll, { passive: true });
  ['wheel', 'touchmove', 'keydown'].forEach(eventName => {
    window.addEventListener(eventName, () => { lockedId = null; }, { passive: true });
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      lockedId = link.getAttribute('href').slice(1);
      setActive(lockedId);
      closeSidebar();
    });
  });

  onScroll();
};

/* ---------- Init ---------- */

const init = () => {
  const branchSelect = $('branchSelect');
  DATA.branches.forEach(branch => {
    const option = document.createElement('option');
    option.value = branch.name;
    option.textContent = branch.name;
    branchSelect.appendChild(option);
  });

  document.querySelectorAll('#periodSeg button').forEach(button => {
    button.addEventListener('click', () => {
      if (state.period === button.dataset.period) return;
      state.period = button.dataset.period;
      renderAll();
    });
  });

  branchSelect.addEventListener('change', event => {
    state.branch = event.target.value;
    renderAll();
  });

  $('clearFocus').addEventListener('click', () => {
    state.branch = 'all';
    renderAll();
  });

  $('resetFilters').addEventListener('click', resetFilters);

  document.querySelectorAll('#mixToggle button').forEach(button => {
    button.addEventListener('click', () => {
      if (state.mix === button.dataset.mix) return;
      state.mix = button.dataset.mix;
      const ctx = buildContext();
      renderLabels(ctx);
      renderMixChart(ctx);
    });
  });

  $('branchSearch').addEventListener('input', event => {
    state.branchQuery = event.target.value.trim();
    renderBranchTable(buildContext());
  });

  $('customerSearch').addEventListener('input', event => {
    state.customerQuery = event.target.value.trim();
    renderTopCustomers(buildContext());
  });

  window.addEventListener('app:search', event => {
    const query = event.detail.query || '';
    state.branchQuery = query;
    state.customerQuery = query;
    state.productQuery = query;
    if ($('branchSearch')) $('branchSearch').value = query;
    if ($('customerSearch')) $('customerSearch').value = query;

    const ctx = buildContext();
    renderBranchTable(ctx);
    renderTopCustomers(ctx);
    renderStock();
  });

  document.querySelectorAll('#branchTable th.sortable').forEach(th => {
    th.addEventListener('click', () => {
      const key = th.dataset.key;
      if (state.branchSort.key === key) {
        state.branchSort.dir *= -1;
      } else {
        state.branchSort = { key, dir: key === 'name' ? 1 : -1 };
      }
      renderBranchTable(buildContext());
    });
  });

  $('branchBody').addEventListener('click', event => {
    const row = event.target.closest('tr[data-branch]');
    if (!row) return;
    const branchName = row.dataset.branch;
    state.branch = state.branch === branchName ? 'all' : branchName;
    renderAll();
  });

  renderAll();
  initScrollSpy();
};

init();
