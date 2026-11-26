/* =========================================================
   Sukun Group — Master data customer (toko)
   Nilai omzet & piutang dalam juta rupiah (jt).
   ========================================================= */

const BRANCHES = [
  { name: 'Cabang Jakarta', short: 'Jakarta', color: '#92400e' },
  { name: 'Cabang Surabaya', short: 'Surabaya', color: '#b45309' },
  { name: 'Cabang Semarang', short: 'Semarang', color: '#d97706' },
  { name: 'Cabang Bandung', short: 'Bandung', color: '#f59e0b' },
  { name: 'Cabang Medan', short: 'Medan', color: '#fbbf24' },
  { name: 'Cabang Makassar', short: 'Makassar', color: '#a8a29e' }
];

const SEGMENTS = [
  { name: 'Toko Ritel', color: '#d97706' },
  { name: 'Grosir', color: '#0f766e' },
  { name: 'Ritel Modern', color: '#4338ca' },
  { name: 'Horeka', color: '#be123c' }
];

const CUSTOMER_SEED = [
  { id: 'CUS-1001', name: 'PT Sumber Rejeki', city: 'Jakarta Pusat', branch: 'Cabang Jakarta', segment: 'Grosir', phone: '021-3501 2201', joined: '2021-03-14', omzet: 812, piutang: 186.4, status: 'Aktif' },
  { id: 'CUS-1002', name: 'UD Makmur Abadi', city: 'Surabaya', branch: 'Cabang Surabaya', segment: 'Grosir', phone: '031-8291 4450', joined: '2021-06-02', omzet: 748, piutang: 142.8, status: 'Aktif' },
  { id: 'CUS-1003', name: 'CV Tiga Bintang', city: 'Semarang', branch: 'Cabang Semarang', segment: 'Toko Ritel', phone: '024-8442 1180', joined: '2021-09-21', omzet: 665, piutang: 98.6, status: 'Aktif' },
  { id: 'CUS-1004', name: 'PT Anugerah Jaya', city: 'Jakarta Selatan', branch: 'Cabang Jakarta', segment: 'Ritel Modern', phone: '021-7274 8830', joined: '2022-01-11', omzet: 598, piutang: 124.6, status: 'Aktif' },
  { id: 'CUS-1005', name: 'Toko Sinar Jaya', city: 'Bandung', branch: 'Cabang Bandung', segment: 'Toko Ritel', phone: '022-4230 7712', joined: '2022-02-08', omzet: 512, piutang: 96.2, status: 'Aktif' },
  { id: 'CUS-1006', name: 'UD Berkah Sentosa', city: 'Sidoarjo', branch: 'Cabang Surabaya', segment: 'Toko Ritel', phone: '031-8946 2205', joined: '2022-04-19', omzet: 468, piutang: 88.4, status: 'Aktif' },
  { id: 'CUS-1007', name: 'PT Mitra Niaga', city: 'Medan', branch: 'Cabang Medan', segment: 'Horeka', phone: '061-4520 3378', joined: '2022-06-27', omzet: 438, piutang: 72.6, status: 'Aktif' },
  { id: 'CUS-1008', name: 'CV Karya Mandiri', city: 'Makassar', branch: 'Cabang Makassar', segment: 'Toko Ritel', phone: '0411-362 8814', joined: '2022-08-15', omzet: 380, piutang: 52.8, status: 'Aktif' },
  { id: 'CUS-1009', name: 'Toko Berkah Jaya', city: 'Bekasi', branch: 'Cabang Jakarta', segment: 'Toko Ritel', phone: '021-8841 6620', joined: '2022-10-04', omzet: 356, piutang: 41.8, status: 'Aktif' },
  { id: 'CUS-1010', name: 'UD Sinar Harapan', city: 'Gresik', branch: 'Cabang Surabaya', segment: 'Grosir', phone: '031-3972 5514', joined: '2022-11-23', omzet: 342, piutang: 64.5, status: 'Aktif' },
  { id: 'CUS-1011', name: 'Toko Cahaya Baru', city: 'Salatiga', branch: 'Cabang Semarang', segment: 'Toko Ritel', phone: '0298-321 776', joined: '2023-01-17', omzet: 318, piutang: 27.6, status: 'Aktif' },
  { id: 'CUS-1012', name: 'CV Sentosa Abadi', city: 'Cimahi', branch: 'Cabang Bandung', segment: 'Grosir', phone: '022-6654 2091', joined: '2023-03-06', omzet: 296, piutang: 44.0, status: 'Aktif' },
  { id: 'CUS-1013', name: 'Toko Amanah', city: 'Binjai', branch: 'Cabang Medan', segment: 'Toko Ritel', phone: '061-8823 4471', joined: '2023-04-12', omzet: 274, piutang: 18.2, status: 'Aktif' },
  { id: 'CUS-1014', name: 'UD Prima Jaya', city: 'Gowa', branch: 'Cabang Makassar', segment: 'Grosir', phone: '0411-883 0921', joined: '2023-05-29', omzet: 258, piutang: 36.5, status: 'Aktif' },
  { id: 'CUS-1015', name: 'Toko Sejahtera', city: 'Depok', branch: 'Cabang Jakarta', segment: 'Toko Ritel', phone: '021-7752 9910', joined: '2023-07-03', omzet: 242, piutang: 22.9, status: 'Aktif' },
  { id: 'CUS-1016', name: 'CV Mitra Sejati', city: 'Surabaya', branch: 'Cabang Surabaya', segment: 'Horeka', phone: '031-5672 1840', joined: '2023-08-21', omzet: 228, piutang: 31.4, status: 'Aktif' },
  { id: 'CUS-1017', name: 'Toko Mawar Indah', city: 'Kudus', branch: 'Cabang Semarang', segment: 'Toko Ritel', phone: '0291-438 562', joined: '2023-09-15', omzet: 214, piutang: 12.8, status: 'Nonaktif' },
  { id: 'CUS-1018', name: 'PT Global Niaga', city: 'Bandung', branch: 'Cabang Bandung', segment: 'Ritel Modern', phone: '022-8720 4416', joined: '2023-11-02', omzet: 206, piutang: 38.6, status: 'Aktif' },
  { id: 'CUS-1019', name: 'Toko Bintang Terang', city: 'Deli Serdang', branch: 'Cabang Medan', segment: 'Toko Ritel', phone: '061-7945 2280', joined: '2024-01-08', omzet: 188, piutang: 14.2, status: 'Aktif' },
  { id: 'CUS-1020', name: 'UD Rejeki Lancar', city: 'Maros', branch: 'Cabang Makassar', segment: 'Toko Ritel', phone: '0411-371 5540', joined: '2024-02-26', omzet: 176, piutang: 9.8, status: 'Aktif' },
  { id: 'CUS-1021', name: 'Toko Pelita', city: 'Tangerang', branch: 'Cabang Jakarta', segment: 'Toko Ritel', phone: '021-5540 8832', joined: '2024-04-09', omzet: 164, piutang: 19.4, status: 'Aktif' },
  { id: 'CUS-1022', name: 'CV Bumi Sentosa', city: 'Mojokerto', branch: 'Cabang Surabaya', segment: 'Grosir', phone: '0321-382 774', joined: '2024-05-30', omzet: 152, piutang: 26.7, status: 'Aktif' },
  { id: 'CUS-1023', name: 'Toko Fajar', city: 'Jepara', branch: 'Cabang Semarang', segment: 'Toko Ritel', phone: '0291-592 1104', joined: '2024-07-14', omzet: 138, piutang: 11.2, status: 'Nonaktif' },
  { id: 'CUS-1024', name: 'UD Karya Utama', city: 'Garut', branch: 'Cabang Bandung', segment: 'Grosir', phone: '0262-540 883', joined: '2024-09-01', omzet: 126, piutang: 21.5, status: 'Aktif' },
  { id: 'CUS-1025', name: 'Toko Melati', city: 'Medan', branch: 'Cabang Medan', segment: 'Toko Ritel', phone: '061-6632 9915', joined: '2024-10-18', omzet: 118, piutang: 7.6, status: 'Aktif' },
  { id: 'CUS-1026', name: 'PT Nusa Niaga', city: 'Malang', branch: 'Cabang Surabaya', segment: 'Ritel Modern', phone: '0341-362 2271', joined: '2024-12-05', omzet: 108, piutang: 18.9, status: 'Aktif' },
  { id: 'CUS-1027', name: 'Toko Sumber Makmur', city: 'Bogor', branch: '', segment: 'Toko Ritel', phone: '0251-832 4409', joined: '2025-02-11', omzet: 96, piutang: 5.4, status: 'Aktif' },
  { id: 'CUS-1028', name: 'UD Harapan Baru', city: 'Klaten', branch: '', segment: 'Grosir', phone: '0272-321 885', joined: '2025-04-24', omzet: 84, piutang: 8.2, status: 'Aktif' },
  { id: 'CUS-1029', name: 'Toko Sinar Pagi', city: 'Palembang', branch: '', segment: 'Toko Ritel', phone: '0711-351 6620', joined: '2025-06-09', omzet: 72, piutang: 3.1, status: 'Aktif' }
];
