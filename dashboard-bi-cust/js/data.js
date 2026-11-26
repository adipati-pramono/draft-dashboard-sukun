/* =========================================================
   Sukun Group — Business Intelligence dataset
   All figures are consistent with the draft dashboard and
   expressed in millions of rupiah (jt) unless noted.
   ========================================================= */

const DATA = {
  meta: {
    company: 'Sukun Group',
    asOf: '22 Nov 2026',
    period: 'Jan – Des 2026',
    fiscalYear: 2026
  },

  periods: {
    all: { label: 'Jan–Des 2026', short: '12 bulan', full: 'Januari–Desember 2026', start: 0, end: 12 },
    h1: { label: 'Jan–Jun 2026', short: 'H1 2026', full: 'Januari–Juni 2026', start: 0, end: 6 },
    h2: { label: 'Jul–Des 2026', short: 'H2 2026', full: 'Juli–Desember 2026', start: 6, end: 12 },
    q4: { label: 'Okt–Des 2026', short: 'Q4 2026', full: 'Oktober–Desember 2026', start: 9, end: 12 }
  },

  monthly: {
    omzet: [312, 335, 328, 356, 372, 390, 405, 412, 408, 421, 433, 449],
    target: [330, 340, 350, 360, 370, 380, 390, 400, 410, 420, 430, 440],
    qty: [86727, 93120, 91174, 98957, 103405, 108408, 112578, 114524, 113412, 117025, 120361, 124809],
    kasMasuk: [310, 348, 322, 375, 360, 402, 388, 415, 398, 430, 445, 468],
    kasKeluar: [245, 260, 255, 288, 272, 310, 298, 315, 305, 330, 342, 355],
    customerBaru: [48, 52, 45, 60, 55, 63, 58, 66, 61, 70, 64, 72],
    customerRepeat: [210, 218, 225, 232, 228, 240, 246, 252, 249, 258, 262, 271]
  },

  products: [
    { name: 'Sukun Original', short: 'Original', color: '#92400e', omzet: 1420, qty: 380000, growth: 14.2, stock: 1840, min: 1200 },
    { name: 'Sukun Mild', short: 'Mild', color: '#b45309', omzet: 1265, qty: 342000, growth: 9.8, stock: 1465, min: 1000 },
    { name: 'Sukun Menthol', short: 'Menthol', color: '#d97706', omzet: 742, qty: 198000, growth: -2.4, stock: 620, min: 750 },
    { name: 'Sukun Filter', short: 'Filter', color: '#f59e0b', omzet: 654, qty: 214000, growth: 5.1, stock: 980, min: 900 },
    { name: 'Sukun Kretek', short: 'Kretek', color: '#fbbf24', omzet: 540, qty: 150500, growth: -6.3, stock: 310, min: 500 }
  ],

  branches: [
    {
      name: 'Cabang Jakarta', short: 'Jakarta', color: '#92400e',
      omzet: 1245, target: 1260, qty: 335000, growth: 12.8,
      lancar: 170, b30: 72, b60: 32, b90: 12.4,
      kasMasuk: 1280, kasKeluar: 980,
      visitsTarget: 160, visitsReal: 168,
      transaksi: 1884, customersAktif: 118, customersBaru: 248
    },
    {
      name: 'Cabang Surabaya', short: 'Surabaya', color: '#b45309',
      omzet: 1010, target: 1000, qty: 282000, growth: 8.4,
      lancar: 120, b30: 52, b60: 30, b90: 12.8,
      kasMasuk: 1020, kasKeluar: 770,
      visitsTarget: 140, visitsReal: 142,
      transaksi: 1432, customersAktif: 82, customersBaru: 172
    },
    {
      name: 'Cabang Semarang', short: 'Semarang', color: '#d97706',
      omzet: 864, target: 840, qty: 241000, growth: 6.9,
      lancar: 90, b30: 36, b60: 18, b90: 8.6,
      kasMasuk: 860, kasKeluar: 660,
      visitsTarget: 120, visitsReal: 118,
      transaksi: 1106, customersAktif: 61, customersBaru: 126
    },
    {
      name: 'Cabang Bandung', short: 'Bandung', color: '#f59e0b',
      omzet: 742, target: 760, qty: 207000, growth: 10.1,
      lancar: 58, b30: 24, b60: 12, b90: 7.2,
      kasMasuk: 710, kasKeluar: 545,
      visitsTarget: 100, visitsReal: 96,
      transaksi: 862, customersAktif: 44, customersBaru: 92
    },
    {
      name: 'Cabang Medan', short: 'Medan', color: '#fbbf24',
      omzet: 468, target: 500, qty: 133000, growth: -3.6,
      lancar: 30, b30: 18, b60: 14, b90: 6.4,
      kasMasuk: 512, kasKeluar: 402,
      visitsTarget: 50, visitsReal: 48,
      transaksi: 458, customersAktif: 25, customersBaru: 48
    },
    {
      name: 'Cabang Makassar', short: 'Makassar', color: '#a8a29e',
      omzet: 292, target: 260, qty: 86500, growth: 4.7,
      lancar: 12, b30: 8, b60: 6, b90: 13,
      kasMasuk: 279, kasKeluar: 218,
      visitsTarget: 30, visitsReal: 29,
      transaksi: 237, customersAktif: 13, customersBaru: 28
    }
  ],

  customers: [
    { name: 'PT Sumber Rejeki', branch: 'Cabang Jakarta', segmen: 'Grosir', omzet: 812, qty: 224000, growth: 15.6, lancar: 110, b30: 46, b60: 20, b90: 10.4 },
    { name: 'UD Makmur Abadi', branch: 'Cabang Surabaya', segmen: 'Grosir', omzet: 748, qty: 208000, growth: 7.2, lancar: 88, b30: 34, b60: 14, b90: 6.8 },
    { name: 'CV Tiga Bintang', branch: 'Cabang Semarang', segmen: 'Toko Ritel', omzet: 665, qty: 186000, growth: 4.9, lancar: 50, b30: 28, b60: 12, b90: 8.6 },
    { name: 'PT Anugerah Jaya', branch: 'Cabang Jakarta', segmen: 'Ritel Modern', omzet: 598, qty: 168000, growth: 11.3, lancar: 80, b30: 26, b60: 12, b90: 6.6 },
    { name: 'Toko Sinar Jaya', branch: 'Cabang Bandung', segmen: 'Toko Ritel', omzet: 512, qty: 142000, growth: -1.8, lancar: 58, b30: 22, b60: 10, b90: 6.2 },
    { name: 'UD Berkah Sentosa', branch: 'Cabang Surabaya', segmen: 'Toko Ritel', omzet: 468, qty: 131000, growth: 6.4, lancar: 54, b30: 20, b60: 10, b90: 4.4 },
    { name: 'PT Mitra Niaga', branch: 'Cabang Medan', segmen: 'Horeka', omzet: 438, qty: 122000, growth: 2.7, lancar: 30, b30: 20, b60: 16, b90: 6.6 },
    { name: 'CV Karya Mandiri', branch: 'Cabang Makassar', segmen: 'Toko Ritel', omzet: 380, qty: 103500, growth: -4.2, lancar: 10, b30: 14, b60: 18, b90: 10.8 }
  ],

  sales: [
    { name: 'Citra M.', branch: 'Cabang Jakarta', omzet: 1145, qty: 318000, growth: 13.9, visitsTarget: 120, visitsReal: 136, lancar: 140, b30: 56, b60: 26, b90: 16.6 },
    { name: 'Andi P.', branch: 'Cabang Surabaya', omzet: 1060, qty: 294000, growth: 8.7, visitsTarget: 120, visitsReal: 128, lancar: 120, b30: 50, b60: 22, b90: 12.8 },
    { name: 'Eka R.', branch: 'Cabang Semarang', omzet: 945, qty: 262000, growth: 6.1, visitsTarget: 120, visitsReal: 121, lancar: 100, b30: 44, b60: 22, b90: 10.2 },
    { name: 'Budi S.', branch: 'Cabang Bandung', omzet: 812, qty: 225000, growth: 3.4, visitsTarget: 120, visitsReal: 114, lancar: 80, b30: 36, b60: 22, b90: 10.4 },
    { name: 'Dedi K.', branch: 'Cabang Medan', omzet: 659, qty: 185500, growth: -5.8, visitsTarget: 120, visitsReal: 102, lancar: 40, b30: 24, b60: 20, b90: 10.4 }
  ],

  aging: [
    { key: 'lancar', label: 'Lancar', color: '#0f766e' },
    { key: 'b30', label: '1–30 hari', color: '#d97706' },
    { key: 'b60', label: '31–60 hari', color: '#f59e0b' },
    { key: 'b90', label: '> 60 hari', color: '#dc2626' }
  ],

  cashCategories: [
    { name: 'Penjualan Tunai', type: 'Masuk', value: 2240 },
    { name: 'Pelunasan Piutang', type: 'Masuk', value: 1860 },
    { name: 'Pendapatan Lain', type: 'Masuk', value: 561 },
    { name: 'Pembelian Bahan Baku', type: 'Keluar', value: 1850 },
    { name: 'Gaji & Tunjangan', type: 'Keluar', value: 720 },
    { name: 'Operasional', type: 'Keluar', value: 560 },
    { name: 'Pajak & Retribusi', type: 'Keluar', value: 285 },
    { name: 'Pengeluaran Lain', type: 'Keluar', value: 160 }
  ],

  visitWeekly: [
    { name: 'Minggu 1', target: 150, realisasi: 142 },
    { name: 'Minggu 2', target: 150, realisasi: 151 },
    { name: 'Minggu 3', target: 150, realisasi: 158 },
    { name: 'Minggu 4', target: 150, realisasi: 150 }
  ],

  transactions: {
    daily: [
      142, 156, 149, 168, 175, 158, 133,
      162, 178, 184, 171, 190, 205, 188,
      176, 199, 214, 226, 208, 196, 221,
      238, 229, 217, 244, 252, 236, 248,
      261, 255
    ],
    channels: [
      { name: 'Toko Ritel', transaksi: 2764, color: '#d97706' },
      { name: 'Grosir', transaksi: 1985, color: '#0f766e' },
      { name: 'Ritel Modern', transaksi: 1230, color: '#4338ca' }
    ]
  },

  customerSegments: [
    { name: 'Toko Ritel', aktif: 168, baru: 320, color: '#d97706' },
    { name: 'Grosir', aktif: 96, baru: 196, color: '#0f766e' },
    { name: 'Ritel Modern', aktif: 54, baru: 128, color: '#4338ca' },
    { name: 'Horeka', aktif: 25, baru: 70, color: '#be123c' }
  ],

  warehouses: [
    { name: 'Gudang Pusat', stok: 2260, sku: 5 },
    { name: 'Gudang Jakarta', stok: 1180, sku: 4 },
    { name: 'Gudang Surabaya', stok: 980, sku: 4 },
    { name: 'Gudang Medan', stok: 510, sku: 3 },
    { name: 'Gudang Makassar', stok: 285, sku: 2 }
  ],

  balanceSheet: {
    asOf: '31 Des 2026',
    assets: {
      total: 9602.4,
      prev: 9195,
      current: 3592.4,
      nonCurrent: 6010,
      components: [
        { name: 'Kas & Bank', value: 1250, color: '#0f766e' },
        { name: 'Piutang Usaha', value: 862.4, color: '#d97706' },
        { name: 'Persediaan', value: 1480, color: '#4338ca' },
        { name: 'Aset Tetap Neto', value: 6010, color: '#be123c' }
      ]
    },
    liabilities: {
      total: 2890.4,
      prev: 3005,
      current: 990.4,
      nonCurrent: 1900,
      components: [
        { name: 'Utang Bank', value: 1900, color: '#be123c' },
        { name: 'Utang Usaha', value: 780, color: '#d97706' },
        { name: 'Utang Pajak', value: 210.4, color: '#f59e0b' }
      ]
    },
    equity: {
      total: 6712,
      prev: 6190,
      components: [
        { name: 'Modal Disetor', value: 4000, color: '#4338ca' },
        { name: 'Laba Ditahan', value: 2712, color: '#0f766e' }
      ]
    }
  }
};

/* =========================================================
   Derived BI metrics
   ========================================================= */

const BI = (() => {
  const annualOmzet = sum(DATA.monthly.omzet);
  const annualTarget = sum(DATA.monthly.target);
  const annualQty = sum(DATA.monthly.qty);
  const annualKasMasuk = sum(DATA.monthly.kasMasuk);
  const annualKasKeluar = sum(DATA.monthly.kasKeluar);
  const annualNewCustomers = sum(DATA.monthly.customerBaru);
  const lastNew = DATA.monthly.customerBaru[DATA.monthly.customerBaru.length - 1];
  const lastRepeat = DATA.monthly.customerRepeat[DATA.monthly.customerRepeat.length - 1];

  const piutang = DATA.aging.reduce((acc, item) => {
    acc[item.key] = DATA.branches.reduce((total, branch) => total + branch[item.key], 0);
    return acc;
  }, {});
  piutang.total = DATA.aging.reduce((total, item) => total + piutang[item.key], 0);
  piutang.overdue = piutang.b60 + piutang.b90;
  piutang.overduePct = sharePct(piutang.overdue, piutang.total);

  const stock = DATA.products.map(product => {
    const ratio = product.stock / product.min;
    const status = ratio < 0.7 ? 'Kritis' : ratio < 1 ? 'Menipis' : 'Aman';
    return { ...product, ratio, status, level: clamp(ratio * 100, 0, 100) };
  });
  const stockTotal = sum(DATA.products.map(product => product.stock));
  const stockMinTotal = sum(DATA.products.map(product => product.min));
  const stockLow = stock.filter(product => product.status !== 'Aman');
  const stockCritical = stock.filter(product => product.status === 'Kritis');

  const visitsTarget = sum(DATA.branches.map(branch => branch.visitsTarget));
  const visitsReal = sum(DATA.branches.map(branch => branch.visitsReal));
  const totalTransaksi = sum(DATA.branches.map(branch => branch.transaksi));
  const activeCustomers = lastNew + lastRepeat;
  const repeatRate = sharePct(lastRepeat, activeCustomers);

  const bs = DATA.balanceSheet;
  const ratios = {
    current: bs.assets.current / bs.liabilities.current,
    cash: bs.assets.components[0].value / bs.liabilities.current,
    der: bs.liabilities.total / bs.equity.total,
    assetTurnover: annualOmzet / bs.assets.total,
    equityRatio: bs.equity.total / bs.assets.total
  };

  return {
    annualOmzet,
    annualTarget,
    annualQty,
    annualKasMasuk,
    annualKasKeluar,
    annualKasNet: annualKasMasuk - annualKasKeluar,
    annualNewCustomers,
    activeCustomers,
    newCustomersThisMonth: lastNew,
    repeatCustomers: lastRepeat,
    repeatRate,
    piutang,
    stock,
    stockTotal,
    stockMinTotal,
    stockLow,
    stockCritical,
    visitsTarget,
    visitsReal,
    visitAchievement: sharePct(visitsReal, visitsTarget),
    totalTransaksi,
    targetAchievement: sharePct(annualOmzet, annualTarget),
    totalGrowth: 12.4,
    kasGrowth: 5.6,
    qtyGrowth: 8.1,
    ratios
  };
})();
