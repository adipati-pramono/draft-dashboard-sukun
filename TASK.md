# TASK.md — Breakdown Development Dashboard Report & Customer Management

> **Produk:** Dashboard Report (Business Intelligence) & Dashboard Customer Management — Sukun Group
> **Sumber analisis:** `draft-dashboard-sukun/`, `dashboard-bi-cust/`, `dashboard-admin/`
> **Versi dokumen:** 1.2 · **Tanggal:** 25 Nov 2026
> **Status awal seluruh task:** `Todo`

---

## 1. Ringkasan & Tujuan

Membangun aplikasi dashboard terpadu yang terdiri dari dua area:

1. **Dashboard Report (BI)** — ringkasan KPI, analisis penjualan, keuangan, operasional, performa cabang, insight, action plan, serta halaman drill-down per metrik.
2. **Dashboard Customer Management** — master data customer/toko, pencarian, filter cabang, CRUD, mapping cabang, import/export, dan sinkronisasi ke dashboard BI.

Dokumen ini menjadi backlog pengembangan yang dapat langsung dipecah ke sprint atau diimpor ke tools manajemen task.

---

## 2. Konteks Teknis Saat Ini

| Aspek | Kondisi Draft |
|---|---|
| Frontend | HTML + CSS + JavaScript vanilla, Chart.js (UMD) |
| Data | Dummy/hardcoded di `data.js` dan `customers.js` |
| Persistensi admin | `localStorage` (`sukun-admin-customers-v1`) |
| Navigasi | Multi-page + hash (`#pov=...`, `#metrik=...`) |
| Filter | Periode (Jan–Des/H1/H2/Q4) & cabang, belum tersimpan di URL secara penuh |
| Customer management | Sudah ada list, search, filter, pagination, mapping, delete, reset; **belum ada create/edit/detail/import/export** |
| Autentikasi | Belum ada (hanya tampilan user) |
| Backend/API | Belum ada |

**Implikasi:** task di bawah mencakup pembangunan backend, database, API, autentikasi, dan penguatan frontend agar siap produksi.

---

## 3. Template & Konvensi Task

### 3.1 Template Inti

Setiap task menggunakan header inti berikut secara berurutan, kemudian diikuti header pendukung:

| Urutan | Header | Wajib | Keterangan |
|---:|---|---|---|
| 1 | `title` | Ya | Nama task yang ringkas dan actionable |
| 2 | `description` | Ya | Penjelasan singkat hasil yang ingin dicapai |
| 3 | `status` | Ya | `Todo` / `In Progress` / `Review` / `Blocked` / `Done` |
| 4 | `priority` | Ya | `Urgent` / `High` / `Medium` / `Low` |
| 5 | `epic` | Ya | Workstream/epic induk task |
| 6 | `estimatedHours` | Ya | Estimasi dalam jam (1 hari-orang = 8 jam) |
| 7 | `id` | Ya | ID unik task |
| 8 | `feature` | Ya | Fitur yang dikerjakan |
| 9 | `module` | Ya | Modul aplikasi |
| 10 | `dependencies` | Ya | ID task yang harus selesai lebih dulu (`—` bila tidak ada) |
| 11 | `acceptanceCriteria` | Ya | Kriteria selesai yang dapat diverifikasi |

### 3.2 Prioritas

| Label | Arti | Prioritas Lama |
|---|---|---|
| **Urgent** | Blocker MVP — harus selesai sebelum rilis pertama atau menghambat workstream lain | P0 |
| **High** | Penting — masuk rilis pertama bila memungkinkan, atau rilis minor berikutnya | P1 |
| **Medium** | Nice-to-have / optimasi yang dapat ditunda | P2 |
| **Low** | Opsional/backlog — belum ada task pada backlog saat ini | — |

### 3.3 Epic Mapping

| Epic | Workstream | Prefix |
|---|---|---|
| Foundation | Fondasi & App Shell | FND |
| Backend & Data | Backend, database, API | BE |
| Dashboard Report | Modul overview & analitik BI | BI |
| Detail Report | Halaman drill-down | DTL |
| Customer Management | Master data & pengelolaan customer | CM |
| QA & Release | Testing, UAT, rilis | QA |

### 3.4 Estimasi

- `estimatedHours` dihitung dengan konversi **1 hari-orang = 8 jam**.
- Estimasi mencakup implementasi + self-test, belum termasuk UAT.
- Estimasi bersifat indikatif dan dapat diparalelisasi antar workstream.

---

## 4. Ringkasan Workstream & Milestone

| Epic | Prefix | Jumlah Task | Urgent | High | Medium | Low | Total estimatedHours | Ekuivalen Hari |
|---|---|---:|---:|---:|---:|---:|---:|---:|
| Foundation | FND | 10 | 7 | 3 | 0 | 0 | 136 | ±17 |
| Backend & Data | BE | 13 | 6 | 6 | 1 | 0 | 280 | ±35 |
| Dashboard Report | BI | 18 | 4 | 11 | 3 | 0 | 232 | ±29 |
| Detail Report | DTL | 9 | 0 | 6 | 3 | 0 | 152 | ±19 |
| Customer Management | CM | 15 | 7 | 6 | 2 | 0 | 232 | ±29 |
| QA & Release | QA | 8 | 3 | 5 | 0 | 0 | 160 | ±20 |
| **Total** | | **73** | **27** | **37** | **9** | **0** | **1192** | **±149** |

### Milestone

| Milestone | Cakupan | Kriteria Keluar |
|---|---|---|
| **M1 — Foundation** | FND-01 s/d FND-09, BE-01, BE-03, BE-05, BI-01 | App shell berjalan, auth aktif, KPI overview tampil dari API |
| **M2 — Sales & Finance** | BI-03 s/d BI-09, BE-06, BE-07 | Modul penjualan & keuangan konsisten dengan filter global |
| **M3 — Ops, Analytics & Drill-down** | BI-10 s/d BI-18, DTL-01 s/d DTL-09, BE-08, BE-09, BE-11 | Semua modul & halaman detail dapat diakses dan konsisten |
| **M4 — Customer Management** | CM-01 s/d CM-15, BE-04, BE-10 | CRUD, mapping, import/export, sinkronisasi BI berjalan |
| **M5 — Release** | QA-01 s/d QA-08, BE-12, BE-13 | UAT sign-off, security review lolos, deploy produksi |

---

## 5. Breakdown Task

### 5.1 Epic FND — Foundation

| title | description | status | priority | epic | estimatedHours | id | feature | module | dependencies | acceptanceCriteria |
|---|---|---|---|---|---:|---|---|---|---|---|
| Setup project, struktur folder, tooling, dan environment | Menyiapkan repositori, build tooling, lint/format, konfigurasi environment, dan struktur direktori frontend-backend. | Todo | Urgent | Foundation | 8 | FND-01 | Project setup | Fondasi | — | Repo/build/lint/format berjalan; struktur frontend-backend jelas; README setup tersedia. |
| Implementasi design system & komponen UI reusable | Membangun token desain dan komponen UI reusable (card, KPI, badge, table, modal, toast, form, chart wrapper). | Todo | Urgent | Foundation | 24 | FND-02 | Design system | Fondasi | FND-01 | Token warna/typography/spacing; komponen inti terdokumentasi dan dipakai lintas halaman. |
| Bangun app shell: sidebar, topbar, content layout, responsive drawer | Membuat kerangka aplikasi dengan sidebar, topbar, area konten, dan drawer responsif untuk kedua dashboard. | Todo | Urgent | Foundation | 16 | FND-03 | App shell | Fondasi | FND-02 | Shell konsisten di semua halaman; mobile drawer berfungsi; navigasi aktif mengikuti halaman/scroll. |
| Implementasi routing & deep link state (hash/query) | Menerapkan routing dan deep link agar halaman, POV, periode, dan cabang dapat dibagikan serta dipulihkan. | Todo | High | Foundation | 8 | FND-04 | Routing | Fondasi | FND-03 | URL menyimpan halaman, POV, periode, cabang; refresh/back/forward mempertahankan state. |
| Susun kamus metrik & formula bisnis | Mendefinisikan omzet, target, qty, aging, repeat rate, rasio keuangan, dan formula lain sebagai acuan tunggal. | Todo | Urgent | Foundation | 16 | FND-05 | Metric dictionary | Fondasi | — | Definisi metrik disepakati stakeholder; dokumen formula menjadi acuan implementasi dan test. |
| Utility format angka, mata uang, persen, tanggal, dan helper data | Menyediakan helper format rupiah, angka, persen, tanggal Indonesia, serta fungsi agregasi lintas halaman. | Todo | Urgent | Foundation | 8 | FND-06 | Shared utilities | Fondasi | FND-05 | Format konsisten di seluruh UI; unit test helper lulus. |
| Implementasi autentikasi, session, dan role-based access | Membangun login/logout, manajemen sesi, dan otorisasi role Admin/Viewer pada halaman dan API. | Todo | Urgent | Foundation | 16 | FND-07 | Auth & RBAC | Fondasi | FND-01 | Login/logout berjalan; role Admin vs Viewer diterapkan; unauthorized ditangani dengan benar. |
| Implementasi state management & filter global | Membangun state filter periode/cabang, reset, dan focus chip yang memengaruhi seluruh modul dashboard. | Todo | Urgent | Foundation | 16 | FND-08 | Global filter | Fondasi | FND-04, FND-06 | Filter mengubah KPI/chart/tabel secara konsisten; reset mengembalikan default; state dapat dibagikan via URL. |
| Standarkan pola loading, empty, error, modal, dan toast | Menyeragamkan pola loading, empty state, error state, modal, dan toast di seluruh aplikasi. | Todo | High | Foundation | 16 | FND-09 | UX states | Fondasi | FND-02 | Setiap halaman punya skeleton/loading, empty, dan error state dengan retry; modal/toast accessible. |
| Fondasi export & print laporan | Menyiapkan mekanisme ekspor dan cetak laporan yang membawa filter aktif serta tanggal data. | Todo | High | Foundation | 8 | FND-10 | Export foundation | Fondasi | FND-06 | Tombol Unduh/Print konsisten; output memuat filter aktif dan tanggal data. |

---

### 5.2 Epic BE — Backend & Data

| title | description | status | priority | epic | estimatedHours | id | feature | module | dependencies | acceptanceCriteria |
|---|---|---|---|---|---:|---|---|---|---|---|
| Rancang skema database & migration | Merancang tabel, relasi, index, dan migration untuk seluruh entitas dashboard report dan customer management. | Todo | Urgent | Backend & Data | 24 | BE-01 | Database schema | Backend & Data | FND-05 | Tabel branches, segments, customers, products, monthly_metrics, transactions, receivables, cash_flows, stock, visits, sales, balance_sheet, audit_logs tersedia; migration berjalan. |
| Seed & migrasi dataset konsisten dari draft | Memindahkan data dummy draft menjadi seed data yang konsisten dan dapat diulang. | Todo | High | Backend & Data | 16 | BE-02 | Seed data | Backend & Data | BE-01 | Data cabang, customer, produk, metrik bulanan, aging, kas, neraca, kunjungan, stok, sales tersedia dan total antar-modul konsisten. |
| API master customer: list, detail, create, update, delete | Membangun API CRUD customer dengan pencarian, filter, pagination, validasi, dan soft delete. | Todo | Urgent | Backend & Data | 32 | BE-03 | Customer CRUD API | Backend & Data | BE-01, FND-07 | Endpoint CRUD/search/filter/pagination berjalan; kode unik; soft delete; RBAC diterapkan. |
| API mapping customer per cabang (single & bulk) + audit | Membangun API mapping customer ke cabang untuk aksi single/bulk dengan pencatatan audit. | Todo | Urgent | Backend & Data | 16 | BE-04 | Mapping API | Backend & Data | BE-03 | Mapping atomik; customer dapat unassigned; perubahan tercatat di audit log; respons berisi jumlah berhasil/gagal. |
| API overview: KPI, health strip, filter periode/cabang | Membangun endpoint overview yang mengembalikan KPI, health metrics, dan agregat sesuai filter. | Todo | Urgent | Backend & Data | 24 | BE-05 | Overview API | Backend & Data | BE-01, FND-05 | Satu endpoint mengembalikan KPI + health metrics; formula sesuai kamus metrik; angka = agregasi dataset. |
| API modul penjualan: omzet, target, qty, mix produk, transaksi, customer trend | Membangun endpoint penjualan untuk chart dan ringkasan per periode/cabang. | Todo | Urgent | Backend & Data | 24 | BE-06 | Sales API | Backend & Data | BE-01, FND-05 | Endpoint omzet/target/qty/mix/transaksi/customer trend tersedia; data siap line/bar/donut; total konsisten. |
| API modul keuangan: piutang aging, kas, neraca & rasio | Membangun endpoint aging piutang, arus kas, neraca, dan rasio keuangan. | Todo | Urgent | Backend & Data | 24 | BE-07 | Finance API | Backend & Data | BE-01, FND-05 | Aging buckets, kas masuk/keluar/net, neraca + rasio tersedia; aset = kewajiban + ekuitas tervalidasi. |
| API operasional & analitik: kunjungan, stok, performa cabang, top customer, performa sales | Membangun endpoint kunjungan, stok, performa cabang, top customer, dan leaderboard sales. | Todo | High | Backend & Data | 24 | BE-08 | Ops & analytics API | Backend & Data | BE-01 | Semua endpoint operasional/analitik tersedia dengan filter yang relevan. |
| API detail report per POV | Membangun endpoint detail per POV berisi baris tabel, agregat KPI, dan seri chart dengan sort/filter/search. | Todo | High | Backend & Data | 24 | BE-09 | Detail report API | Backend & Data | BE-06, BE-07, BE-08 | Setiap POV mengembalikan tabel + KPI + chart; sort/filter/search berfungsi. |
| API import/export customer (CSV/Excel) | Membangun endpoint import/export dengan template, validasi, preview, dan ringkasan error. | Todo | High | Backend & Data | 16 | BE-10 | Import/export API | Backend & Data | BE-03 | Template import tersedia; validasi per baris; export mengikuti filter aktif. |
| Rules engine untuk insight & action plan | Membangun aturan otomatis yang menghasilkan insight dan action plan dari ambang batas metrik. | Todo | Medium | Backend & Data | 24 | BE-11 | Rules engine | Backend & Data | BE-05, BE-06, BE-07, BE-08 | Insight/action plan dihasilkan dari aturan threshold; ambang batas dapat dikonfigurasi dan diuji. |
| Pagination, caching, dan optimasi query dashboard | Mengoptimalkan query agregasi, pagination, dan caching API dashboard. | Todo | High | Backend & Data | 16 | BE-12 | Performance | Backend & Data | BE-05 s/d BE-09 | P95 respons API dashboard < 500 ms pada data uji; tidak ada query N+1; cache invalidation benar. |
| Standar validasi, error contract, logging, dan audit trail | Menetapkan format error, validasi input, logging, dan audit trail untuk aksi mutasi. | Todo | High | Backend & Data | 16 | BE-13 | Reliability & audit | Backend & Data | BE-03 | Error konsisten; input tervalidasi; mutasi tercatat (siapa, kapan, sebelum/sesudah); log tidak memuat data sensitif. |

---

### 5.3 Epic BI — Dashboard Report

| title | description | status | priority | epic | estimatedHours | id | feature | module | dependencies | acceptanceCriteria |
|---|---|---|---|---|---:|---|---|---|---|---|
| Implementasi kartu KPI overview | Menampilkan KPI omzet, pencapaian target, piutang, dan kas bersih yang mengikuti filter global. | Todo | Urgent | Dashboard Report | 16 | BI-01 | KPI cards | Dashboard Report | FND-08, BE-05 | 4 KPI tampil sesuai filter; delta & note benar; angka konsisten dengan modul terkait. |
| Implementasi health strip | Menampilkan metrik pendukung quantity, transaksi, customer aktif, dan kebutuhan restock. | Todo | High | Dashboard Report | 8 | BI-02 | Health metrics | Dashboard Report | BE-05 | 4 metrik pendukung tampil; responsif; konsisten dengan dataset. |
| Implementasi modul Omzet Penjualan | Menampilkan grafik omzet realisasi vs target, metric strip, dan tautan ke halaman detail. | Todo | Urgent | Dashboard Report | 16 | BI-03 | Omzet penjualan | Dashboard Report | BE-06, FND-02 | Chart realisasi vs target per bulan; metric strip realisasi/target/selisih; link detail membawa POV benar. |
| Implementasi Mix Produk dengan toggle Omzet/Qty | Menampilkan komposisi produk dalam donut chart dengan toggle metrik omzet/quantity. | Todo | High | Dashboard Report | 16 | BI-04 | Mix produk | Dashboard Report | BE-06 | Donut & legend berubah saat toggle; center total benar; warna konsisten. |
| Implementasi modul Jumlah Transaksi | Menampilkan grafik transaksi harian November beserta total periode. | Todo | High | Dashboard Report | 8 | BI-05 | Jumlah transaksi | Dashboard Report | BE-06 | Chart transaksi harian; badge total; loading/empty state. |
| Implementasi modul Customer Trend | Menampilkan tren pelanggan baru vs repeat beserta chips loyalitas. | Todo | High | Dashboard Report | 16 | BI-06 | Customer trend | Dashboard Report | BE-06 | Chart baru vs repeat; chips aktif/baru/repeat rate; sinkron dengan filter. |
| Implementasi modul Piutang | Menampilkan aging piutang dalam donut chart dan daftar piutang terbesar. | Todo | Urgent | Dashboard Report | 16 | BI-07 | Piutang | Dashboard Report | BE-07 | Donut aging 4 bucket; total & overdue benar; daftar debtor terurut nilai; link detail POV cabang. |
| Implementasi modul Kas Masuk/Keluar | Menampilkan grafik kas masuk/keluar dan metric strip kas bersih. | Todo | Urgent | Dashboard Report | 16 | BI-08 | Kas | Dashboard Report | BE-07 | Chart masuk/keluar per bulan; metric masuk/keluar/net; net = masuk − keluar. |
| Implementasi Neraca Ringkas + rasio keuangan | Menampilkan neraca ringkas (aset, kewajiban, ekuitas) dan empat rasio keuangan. | Todo | High | Dashboard Report | 16 | BI-09 | Neraca | Dashboard Report | BE-07 | Kolom aset/kewajiban/ekuitas + progress; 4 rasio; aset = kewajiban + ekuitas. |
| Implementasi modul Kunjungan Sales | Menampilkan ringkasan target vs realisasi kunjungan per cabang. | Todo | High | Dashboard Report | 8 | BI-10 | Kunjungan sales | Dashboard Report | BE-08 | Chips total/pencapaian/cabang terbaik; chart target vs realisasi; link detail POV cabang. |
| Implementasi tabel Stok Produk + status | Menampilkan tabel stok dengan level, minimum, dan status restock. | Todo | High | Dashboard Report | 8 | BI-11 | Stok produk | Dashboard Report | BE-08 | Tabel stok, level bar, minimum, badge status; jumlah restock benar. |
| Implementasi tabel Top Customer + pencarian | Menampilkan top customer berdasarkan omzet, share, piutang, dan pertumbuhan dengan pencarian. | Todo | High | Dashboard Report | 8 | BI-12 | Top customer | Dashboard Report | BE-08 | Tabel omzet/share/piutang/pertumbuhan; search berfungsi; empty state; link detail POV segmen. |
| Implementasi leaderboard Performa Sales | Menampilkan peringkat sales berdasarkan kontribusi omzet dan kunjungan. | Todo | Medium | Dashboard Report | 8 | BI-13 | Performa sales | Dashboard Report | BE-08 | Daftar sales dengan omzet/kunjungan; urut kontribusi; link detail POV sales. |
| Implementasi tabel Performa Cabang | Menampilkan tabel performa cabang dengan search, sort, dan klik untuk fokus cabang. | Todo | High | Dashboard Report | 16 | BI-14 | Performa cabang | Dashboard Report | BE-08, FND-08 | Sort semua kolom; search cabang; klik baris menetapkan fokus global; footer jumlah baris benar. |
| Implementasi panel Insight otomatis | Menampilkan insight yang berubah sesuai filter periode/cabang. | Todo | Medium | Dashboard Report | 16 | BI-15 | Insight | Dashboard Report | BE-11 | Insight mencakup target, cabang, piutang, stok, loyalitas; link ke action plan. |
| Implementasi Action Plan 3 horizon | Menampilkan rekomendasi action plan jangka pendek, menengah, dan panjang. | Todo | Medium | Dashboard Report | 16 | BI-16 | Action plan | Dashboard Report | BE-11 | Tiga kolom horizon; owner, tenggat, dampak; jumlah aksi benar; responsif. |
| Implementasi export/print laporan dashboard | Menyediakan ekspor/cetak dashboard dengan filter aktif dan tanggal data. | Todo | High | Dashboard Report | 8 | BI-17 | Export laporan | Dashboard Report | FND-10, FND-08 | Export memuat filter aktif, tanggal data, dan seluruh modul; hasil print terbaca. |
| Responsive & mobile behavior seluruh dashboard | Memastikan seluruh modul dashboard responsif pada layar mobile hingga desktop. | Todo | High | Dashboard Report | 16 | BI-18 | Responsive dashboard | Dashboard Report | BI-01 s/d BI-17 | Layout 360px–1440px tanpa overflow; chart menyesuaikan; tabel dapat discroll. |

---

### 5.4 Epic DTL — Detail Report

| title | description | status | priority | epic | estimatedHours | id | feature | module | dependencies | acceptanceCriteria |
|---|---|---|---|---|---:|---|---|---|---|---|
| Halaman Detail Omzet | Membangun detail omzet dengan POV produk, cabang, customer, dan sales. | Todo | High | Detail Report | 24 | DTL-01 | Detail omzet | Detail Report | BE-09, FND-04 | Tab POV berfungsi; KPI, chart peringkat, tabel berubah sesuai POV; state POV di URL. |
| Halaman Detail Transaksi | Membangun detail transaksi dengan POV harian, cabang, dan channel. | Todo | High | Detail Report | 16 | DTL-02 | Detail transaksi | Detail Report | BE-09, FND-04 | Chart & tabel sesuai POV; total, rata-rata, puncak benar; search/sort berfungsi. |
| Halaman Detail Customer Trend | Membangun detail customer trend dengan POV bulanan, segmen, dan cabang. | Todo | High | Detail Report | 16 | DTL-03 | Detail customer | Detail Report | BE-09, FND-04 | Chart & tabel baru/repeat/rate per POV; KPI konsisten; sort & search berfungsi. |
| Halaman Detail Piutang | Membangun detail piutang dengan POV cabang, customer, dan sales. | Todo | High | Detail Report | 24 | DTL-04 | Detail piutang | Detail Report | BE-09, FND-04 | Aging chart & tabel per POV; total, jatuh tempo, >60 hari benar; filter cabang diterapkan. |
| Halaman Detail Kas | Membangun detail kas dengan POV cabang, kategori, dan bulanan. | Todo | High | Detail Report | 16 | DTL-05 | Detail kas | Detail Report | BE-09, FND-04 | Chart & tabel sesuai POV; rasio kas benar; kategori masuk/keluar terpisah. |
| Halaman Detail Neraca | Membangun detail neraca dengan POV aset, kewajiban, dan ekuitas. | Todo | Medium | Detail Report | 16 | DTL-06 | Detail neraca | Detail Report | BE-09, FND-04 | Komposisi chart & tabel per POV; perbandingan tahun lalu; total seimbang. |
| Halaman Detail Kunjungan | Membangun detail kunjungan dengan POV sales, cabang, dan mingguan. | Todo | Medium | Detail Report | 16 | DTL-07 | Detail kunjungan | Detail Report | BE-09, FND-04 | Target vs realisasi per POV; pencapaian benar; chart & tabel sinkron. |
| Halaman Detail Stok | Membangun detail stok dengan POV produk dan gudang. | Todo | High | Detail Report | 16 | DTL-08 | Detail stok | Detail Report | BE-09, FND-04 | Stok vs minimum per produk/gudang; status & komposisi benar; tabel dapat disort. |
| Konsistensi navigasi drill-down & back-link | Menyelaraskan navigasi antar dashboard dan halaman detail agar state kembali dengan benar. | Todo | Medium | Detail Report | 8 | DTL-09 | Drill-down navigation | Detail Report | DTL-01 s/d DTL-08 | Semua link Detail membawa POV/filter sesuai; back-link mengembalikan state dashboard; deep link dapat dibuka langsung. |

---

### 5.5 Epic CM — Customer Management

| title | description | status | priority | epic | estimatedHours | id | feature | module | dependencies | acceptanceCriteria |
|---|---|---|---|---|---:|---|---|---|---|---|
| Halaman master data & kartu KPI customer | Membangun halaman utama customer management dengan KPI total, aktif, piutang, dan belum ter-mapping. | Todo | Urgent | Customer Management | 16 | CM-01 | Customer overview | Customer Management | FND-03, BE-03 | KPI dihitung dari data terfilter; loading/empty state tersedia. |
| Tabel customer: search, filter cabang, pagination | Membangun tabel customer dengan pencarian, filter cabang, dan pagination. | Todo | Urgent | Customer Management | 24 | CM-02 | Customer list | Customer Management | CM-01, BE-03 | Search kode/nama/kota/telepon; filter cabang & unassigned; pagination dan range benar. |
| Halaman Detail Customer 360 | Membangun detail customer berisi profil, ringkasan omzet/piutang, dan aktivitas. | Todo | High | Customer Management | 24 | CM-03 | Customer detail | Customer Management | BE-03 | Profil, status, segmen, cabang, kontak; ringkasan omzet/piutang; riwayat transaksi/kunjungan; tautan ke BI. |
| Form tambah customer (create) | Membangun form create customer dengan validasi, kode unik, dan feedback sukses. | Todo | Urgent | Customer Management | 16 | CM-04 | Create customer | Customer Management | BE-03, FND-09 | Field wajib tervalidasi; kode unik; toast sukses; baris baru muncul; cegah double submit. |
| Form edit customer (update) | Membangun form edit customer dengan validasi dan konfirmasi perubahan penting. | Todo | Urgent | Customer Management | 16 | CM-05 | Edit customer | Customer Management | BE-03, FND-09 | Data terisi; perubahan tersimpan; validasi sama dengan create; konfirmasi saat ubah cabang/status. |
| Hapus customer single & bulk + konfirmasi + soft delete | Membangun aksi hapus customer single/bulk dengan konfirmasi dan soft delete. | Todo | Urgent | Customer Management | 16 | CM-06 | Delete customer | Customer Management | BE-03, FND-09 | Konfirmasi menyebut jumlah/nama; bulk untuk baris terpilih; soft delete dapat dipulihkan; audit tercatat. |
| Mapping cabang single & bulk (termasuk unassign) | Membangun aksi mapping customer ke cabang untuk single/bulk termasuk unassign. | Todo | Urgent | Customer Management | 16 | CM-07 | Mapping customer | Customer Management | BE-04, CM-02 | Pilih customer → pindah cabang; validasi tujuan; jumlah unmapped ter-update; toast hasil. |
| Kartu ringkasan per cabang & daftar belum ter-mapping | Menampilkan kartu jumlah/share customer per cabang dan daftar customer belum ter-mapping. | Todo | High | Customer Management | 8 | CM-08 | Branch mapping summary | Customer Management | CM-07 | Kartu menampilkan jumlah & share; klik memfilter tabel; badge unmapped benar. |
| Import customer CSV/Excel dengan preview & validasi | Membangun import customer dengan template, preview, validasi per baris, dan laporan hasil. | Todo | High | Customer Management | 24 | CM-09 | Import customer | Customer Management | BE-10, CM-04 | Template tersedia; upload & preview; error per baris; import atomik atau laporan gagal. |
| Export customer sesuai filter | Membangun export customer yang mengikuti filter dan kolom yang dibutuhkan. | Todo | High | Customer Management | 8 | CM-10 | Export customer | Customer Management | BE-10, CM-02 | Export CSV/Excel mengikuti filter aktif; kolom lengkap; nama file menyertakan tanggal. |
| Validasi data & deteksi duplikat customer | Menerapkan validasi data dan deteksi duplikat customer. | Todo | High | Customer Management | 16 | CM-11 | Data validation | Customer Management | CM-04 | Cegah kode duplikat dan nama+kota+telepon identik; normalisasi telepon; pesan error jelas. |
| Pengelolaan status aktif/nonaktif & segmen customer | Mengelola status dan segmen customer beserta filternya. | Todo | Medium | Customer Management | 8 | CM-12 | Status & segment | Customer Management | BE-03 | Status/segmen dapat diubah; filter tersedia; customer nonaktif tidak masuk metrik aktif BI. |
| Riwayat perubahan customer & mapping (audit UI) | Menampilkan riwayat create/update/mapping/delete customer dari audit log. | Todo | Medium | Customer Management | 16 | CM-13 | Audit history | Customer Management | BE-13 | Detail customer menampilkan riwayat; pelaku & waktu terlihat; hanya admin. |
| Sinkronisasi customer management ke dashboard BI | Memastikan perubahan customer/cabang langsung memengaruhi metrik dashboard BI. | Todo | High | Customer Management | 16 | CM-14 | Data sync | Customer Management | CM-04, CM-07, BE-05 | Perubahan memengaruhi KPI & top customer BI; tidak ada data ganda; cache invalidated. |
| Hak akses & guard aksi admin | Menerapkan guard role Admin pada seluruh aksi master data. | Todo | Urgent | Customer Management | 8 | CM-15 | Admin RBAC | Customer Management | FND-07 | Hanya Admin dapat create/edit/delete/mapping/import; Viewer read-only; aksi ilegal ditolak UI & API. |

---

### 5.6 Epic QA — QA & Release

| title | description | status | priority | epic | estimatedHours | id | feature | module | dependencies | acceptanceCriteria |
|---|---|---|---|---|---:|---|---|---|---|---|
| Unit test formula metrik & helper | Menulis unit test untuk formula metrik dan helper bersama. | Todo | Urgent | QA & Release | 24 | QA-01 | Unit testing | QA & Rilis | FND-05, FND-06, BE-05 s/d BE-09 | Coverage formula kritis ≥ 80%; kasus aging, repeat rate, rasio, agregasi periode/cabang lulus. |
| Integration test API & database | Menulis integration test untuk API dan interaksi database. | Todo | High | QA & Release | 24 | QA-02 | Integration testing | QA & Rilis | BE-03 s/d BE-10 | CRUD, mapping, filter, import/export, error contract teruji; data uji terisolasi. |
| E2E test alur utama | Menulis E2E test untuk alur utama dashboard dan customer management. | Todo | Urgent | QA & Release | 24 | QA-03 | E2E testing | QA & Rilis | BI-01 s/d BI-18, CM-01 s/d CM-15 | Login → dashboard → filter → detail → CRUD/mapping → export berjalan otomatis dan stabil. |
| UAT bersama stakeholder & sign-off | Menjalankan UAT dengan stakeholder dan mencatat sign-off. | Todo | Urgent | QA & Release | 24 | QA-04 | UAT | QA & Rilis | QA-01 s/d QA-03 | Skenario UAT disetujui; defect Urgent/High = 0; sign-off tercatat. |
| Audit performa & aksesibilitas | Mengaudit performa dan aksesibilitas seluruh halaman. | Todo | High | QA & Release | 16 | QA-05 | Performance & a11y | QA & Rilis | BI-18, CM-02 | Lighthouse performa ≥ 85; WCAG AA untuk kontras, fokus, label form, navigasi keyboard. |
| Review keamanan (authz, validasi input, XSS/SQLi) | Melakukan review keamanan pada otorisasi, validasi input, XSS, dan SQLi. | Todo | High | QA & Release | 16 | QA-06 | Security review | QA & Rilis | FND-07, BE-13 | Semua endpoint terotorisasi; input tersanitasi; tidak ada celah XSS/SQLi pada form/search/import. |
| Dokumentasi teknis, user guide, & handover | Menyusun dokumentasi API, skema DB, alur bisnis, panduan admin, dan runbook deploy. | Todo | High | QA & Release | 16 | QA-07 | Documentation | QA & Rilis | QA-04 | Dokumentasi API, DB, alur bisnis, panduan admin, runbook tersedia. |
| Deployment, monitoring, & stabilization | Melakukan deployment staging→produksi, monitoring, dan stabilisasi pasca-rilis. | Todo | High | QA & Release | 16 | QA-08 | Release | QA & Rilis | QA-04, QA-06 | Deploy berhasil; health check & alert aktif; bug stabilization pasca-rilis terjadwal. |

---

## 6. Matriks Ketergantungan Utama

```
FND-01 → FND-02 → FND-03 → FND-04 ─┐
FND-05 → FND-06 ───────────────────┼→ FND-08 → BI-01..BI-18 → DTL-01..DTL-09
FND-07 ────────────────────────────┘
BE-01 → BE-03 → BE-04 → CM-04..CM-15
     ├→ BE-05 → BI-01..BI-02
     ├→ BE-06 → BI-03..BI-06, DTL-01..DTL-03
     ├→ BE-07 → BI-07..BI-09, DTL-04..DTL-06
     ├→ BE-08 → BI-10..BI-14, DTL-07..DTL-08
     └→ BE-11 → BI-15..BI-16
BE-09 → DTL-01..DTL-08
QA-01..QA-08 setelah workstream terkait selesai
```

**Catatan:** BE-05 s/d BE-09 dapat dikerjakan paralel dengan BI/DTL menggunakan kontrak API + mock response.

---

## 7. Asumsi & Catatan

1. **Satu sumber kebenaran data:** customer, cabang, dan metrik harus berasal dari database/API yang sama; draft saat ini memakai data dummy terpisah.
2. **Definisi metrik wajib disepakati lebih dulu** (FND-05) agar angka KPI, chart, tabel, dan halaman detail tidak berbeda.
3. **Periode vs snapshot:** metrik penjualan/kas mengikuti filter periode (Jan–Des/H1/H2/Q4), sedangkan piutang, stok, dan neraca adalah snapshot per tanggal data (mis. 22 Nov 2026). Perbedaan ini harus diberi label di UI.
4. **Mapping cabang** adalah data master; perubahan dari admin harus langsung memengaruhi dashboard BI.
5. **Role:** minimal `Admin` (master data & semua aksi) dan `Viewer`/`Manajemen` (read-only). Perlu konfirmasi bila ada role Sales/Finance tersendiri.
6. **Import/export** memakai CSV sebagai format minimum; Excel opsional.
7. **Draft admin saat ini belum memiliki create/edit/detail**, sehingga task CM-03 s/d CM-05 adalah fitur baru, bukan sekadar penyempurnaan.
8. **Estimasi** belum termasuk integrasi dengan sistem ERP/akuntansi eksternal. Bila diperlukan, tambahkan task integrasi tersendiri.
9. **Di luar cakupan awal:** mobile app native, real-time streaming, payment gateway, dan mesin akuntansi double-entry penuh.

---

## 8. Definition of Done (DoD)

Sebuah task dianggap **Done** apabila:

- [ ] Implementasi sesuai `acceptanceCriteria` dan telah di-review.
- [ ] Lolos lint/type-check/build (bila relevan).
- [ ] Unit/integration test terkait lulus; tidak menurunkan coverage.
- [ ] Tidak ada error konsol, broken link, atau layout rusak pada desktop & mobile.
- [ ] Loading, empty, dan error state tersedia.
- [ ] Aksesibilitas dasar terpenuhi (label, fokus, kontras, keyboard).
- [ ] Dokumentasi/API contract diperbarui bila mengubah kontrak.
- [ ] Diverifikasi di staging oleh QA/Product Owner.
