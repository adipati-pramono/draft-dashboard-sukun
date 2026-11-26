/* =========================================================
   Admin panel — master data customer
   State changes (mapping & delete) persist to localStorage.
   ========================================================= */
(() => {
  const STORAGE_KEY = 'sukun-admin-customers-v1';
  const PAGE_SIZE = 8;
  const NONE = '__none__';

  const state = { query: '', branch: 'all', page: 1, selected: new Set() };
  let customers = loadCustomers();
  let currentPageIds = [];
  let mapIds = [];
  let confirmHandler = null;
  let lastFocus = null;
  let scrollQueued = false;

  const $ = selector => document.querySelector(selector);
  const branchMap = new Map(BRANCHES.map(branch => [branch.name, branch]));

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function loadCustomers() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.every(item => item && item.id && item.name)) return parsed;
      }
    } catch (err) {
      /* fall back to seed data */
    }
    return clone(CUSTOMER_SEED);
  }

  function persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(customers));
      return true;
    } catch (err) {
      toast('Perubahan tidak dapat disimpan di browser ini.', 'bad');
      return false;
    }
  }

  function initials(name) {
    return name
      .replace(/^(PT|CV|UD|Toko)\s+/i, '')
      .split(/\s+/)
      .slice(0, 2)
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase();
  }

  function filteredCustomers() {
    const needle = state.query.toLowerCase();
    return customers.filter(customer => {
      if (state.branch === NONE) {
        if (customer.branch) return false;
      } else if (state.branch !== 'all' && customer.branch !== state.branch) {
        return false;
      }
      if (!needle) return true;
      return [customer.name, customer.id, customer.city, customer.branch, customer.segment, customer.phone, customer.joined]
        .join(' ')
        .toLowerCase()
        .includes(needle);
    });
  }

  /* ---------- Rendering ---------- */

  function render() {
    const list = filteredCustomers();
    const pages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
    state.page = clamp(state.page, 1, pages);
    const start = (state.page - 1) * PAGE_SIZE;
    const pageRows = list.slice(start, start + PAGE_SIZE);
    currentPageIds = pageRows.map(customer => customer.id);

    renderKpis(list);
    renderRows(pageRows);
    renderPagination(pages);
    renderBranchCards();
    renderTableMeta(list, start, pageRows.length);
    syncSelectionUI();
  }

  function renderKpis(list) {
    const active = list.filter(customer => customer.status === 'Aktif');
    const piutang = sum(list.map(customer => customer.piutang));
    const withPiutang = list.filter(customer => customer.piutang > 0).length;
    const unmapped = list.filter(customer => !customer.branch).length;

    $('#kpiTotal').textContent = idr.format(list.length);
    $('#kpiTotalNote').textContent = `${active.length} aktif · ${list.length - active.length} nonaktif`;

    $('#kpiAktif').textContent = idr.format(active.length);
    $('#kpiAktifNote').textContent = list.length
      ? `${pctText(sharePct(active.length, list.length), 0)} dari toko terfilter`
      : 'Tidak ada toko pada filter ini';

    $('#kpiPiutang').textContent = rpJuta(piutang);
    $('#kpiPiutangNote').textContent = `${withPiutang} toko memiliki saldo`;

    $('#kpiUnmapped').textContent = idr.format(unmapped);
    $('#kpiUnmappedNote').textContent = unmapped
      ? 'Perlu penugasan cabang'
      : 'Semua customer ter-mapping';
    const badge = $('#kpiUnmappedBadge');
    badge.textContent = unmapped ? 'Perlu mapping' : 'Ter-mapping';
    badge.className = 'badge ' + (unmapped ? 'warn' : 'ok');
  }

  function renderRows(rows) {
    const tbody = $('#customerRows');

    if (!rows.length) {
      tbody.innerHTML = `
        <tr>
          <td colspan="9">
            <div class="empty-state">
              <svg class="icon" aria-hidden="true"><use href="#i-inbox"/></svg>
              <b>Tidak ada customer</b>
              <p>Tidak ada toko yang cocok dengan pencarian atau filter cabang.</p>
              <button type="button" class="btn ghost sm" data-act="clear-filters">Bersihkan filter</button>
            </div>
          </td>
        </tr>`;
      return;
    }

    tbody.innerHTML = rows.map(customer => {
      const branch = branchMap.get(customer.branch);
      const color = branch ? branch.color : '#78716c';
      const branchCell = branch
        ? `<span class="branch-tag"><i class="branch-dot" style="background:${branch.color}"></i>${escapeHtml(branch.short)}</span>`
        : '<span class="badge warn">Belum ter-mapping</span>';
      const statusCell = customer.status === 'Aktif'
        ? '<span class="badge ok">Aktif</span>'
        : '<span class="badge neutral">Nonaktif</span>';
      const checked = state.selected.has(customer.id) ? 'checked' : '';

      return `
        <tr data-id="${escapeHtml(customer.id)}" class="${checked ? 'is-selected' : ''}">
          <td>
            <input type="checkbox" class="row-check" data-id="${escapeHtml(customer.id)}" ${checked}
              aria-label="Pilih ${escapeHtml(customer.name)}" />
          </td>
          <td><span class="code">${escapeHtml(customer.id)}</span></td>
          <td>
            <div class="cell-store">
              <span class="entity-avatar" style="background:${color}22;color:${color}">${escapeHtml(initials(customer.name))}</span>
              <div>
                <b>${escapeHtml(customer.name)}</b>
                <small>${escapeHtml(customer.city)} · ${escapeHtml(customer.phone)}</small>
              </div>
            </div>
          </td>
          <td>${branchCell}</td>
          <td><span class="seg-badge">${escapeHtml(customer.segment)}</span></td>
          <td class="num">${rpJuta(customer.omzet)}</td>
          <td class="num">${rpJuta(customer.piutang)}</td>
          <td>${statusCell}</td>
          <td>
            <div class="row-actions">
              <button type="button" class="icon-btn xs accent" data-act="map" data-id="${escapeHtml(customer.id)}"
                title="Pindahkan cabang" aria-label="Pindahkan ${escapeHtml(customer.name)} ke cabang lain">
                <svg class="icon" aria-hidden="true"><use href="#i-arrow-right-left"/></svg>
              </button>
              <button type="button" class="icon-btn xs danger" data-act="delete" data-id="${escapeHtml(customer.id)}"
                title="Hapus customer" aria-label="Hapus ${escapeHtml(customer.name)}">
                <svg class="icon" aria-hidden="true"><use href="#i-trash"/></svg>
              </button>
            </div>
          </td>
        </tr>`;
    }).join('');
  }

  function renderTableMeta(list, start, count) {
    $('#tableRange').textContent = list.length
      ? `Menampilkan ${start + 1}–${start + count} dari ${list.length} toko`
      : 'Tidak ada toko pada filter ini';
    $('#tableCountBadge').textContent = list.length === customers.length
      ? `${customers.length} toko`
      : `${list.length} dari ${customers.length} toko`;
  }

  function renderPagination(pages) {
    const current = state.page;
    const parts = [`<button type="button" class="page-btn" data-page="${current - 1}" ${current <= 1 ? 'disabled' : ''} aria-label="Halaman sebelumnya">‹</button>`];

    pageWindow(current, pages).forEach(item => {
      if (item === '…') {
        parts.push('<span class="page-ellipsis">…</span>');
        return;
      }
      parts.push(`<button type="button" class="page-btn ${item === current ? 'active' : ''}" data-page="${item}" ${item === current ? 'aria-current="page"' : ''}>${item}</button>`);
    });

    parts.push(`<button type="button" class="page-btn" data-page="${current + 1}" ${current >= pages ? 'disabled' : ''} aria-label="Halaman berikutnya">›</button>`);
    $('#pagination').innerHTML = parts.join('');
  }

  function pageWindow(current, pages) {
    if (pages <= 5) return Array.from({ length: pages }, (_, index) => index + 1);
    const wanted = [...new Set([1, current - 1, current, current + 1, pages])]
      .filter(page => page >= 1 && page <= pages)
      .sort((a, b) => a - b);
    const output = [];
    wanted.forEach((page, index) => {
      if (index && page - wanted[index - 1] > 1) output.push('…');
      output.push(page);
    });
    return output;
  }

  function renderBranchCards() {
    const total = customers.length || 1;
    const items = BRANCHES.map(branch => {
      const count = customers.filter(customer => customer.branch === branch.name).length;
      return { key: branch.name, label: branch.short, count, color: branch.color, share: sharePct(count, total) };
    });
    const unmapped = customers.filter(customer => !customer.branch).length;
    items.push({
      key: NONE,
      label: 'Belum ter-mapping',
      count: unmapped,
      color: '#a8a29e',
      share: sharePct(unmapped, total),
      unmapped: true
    });

    $('#branchGrid').innerHTML = items.map(item => `
      <button type="button" class="branch-card ${item.unmapped ? 'unmapped' : ''} ${state.branch === item.key ? 'active' : ''}"
        data-branch="${escapeHtml(item.key)}" aria-pressed="${state.branch === item.key}">
        <span class="branch-card-head">
          <i class="branch-dot" style="background:${item.color}"></i>
          <b>${escapeHtml(item.label)}</b>
          <span class="branch-count">${item.count}</span>
        </span>
        <span class="progress"><i style="width:${item.share.toFixed(1)}%;background:${item.color}"></i></span>
        <span class="branch-card-foot">
          <span>${pctText(item.share, 0)} dari total</span>
          <span class="card-filter">${state.branch === item.key ? 'Aktif' : 'Filter'}
            <svg class="icon" aria-hidden="true"><use href="#i-chevron-right"/></svg>
          </span>
        </span>
      </button>`).join('');

    $('#mappingBadge').textContent = unmapped
      ? `${BRANCHES.length} cabang · ${unmapped} belum ter-mapping`
      : `${BRANCHES.length} cabang · semua ter-mapping`;
  }

  function syncSelectionUI() {
    const count = state.selected.size;
    $('#bulkCount').textContent = count;
    $('#bulkBar').hidden = count === 0;

    document.querySelectorAll('.row-check').forEach(check => {
      const selected = state.selected.has(check.dataset.id);
      check.checked = selected;
      const row = check.closest('tr');
      if (row) row.classList.toggle('is-selected', selected);
    });

    const total = currentPageIds.length;
    const onPage = currentPageIds.filter(id => state.selected.has(id)).length;
    const checkAll = $('#checkAll');
    checkAll.disabled = total === 0;
    checkAll.checked = total > 0 && onPage === total;
    checkAll.indeterminate = onPage > 0 && onPage < total;
  }

  /* ---------- Filters ---------- */

  function resetFilters() {
    state.query = '';
    state.branch = 'all';
    state.page = 1;
    state.selected.clear();
    $('#tableSearch').value = '';
    $('#branchFilter').value = 'all';
    render();
  }

  function applyBranch(branch) {
    state.branch = branch;
    state.page = 1;
    state.selected.clear();
    $('#branchFilter').value = branch;
    render();
  }

  /* ---------- Mapping ---------- */

  function openMap(ids) {
    mapIds = ids.filter(id => customers.some(customer => customer.id === id));
    if (!mapIds.length) return;

    const targets = customers.filter(customer => mapIds.includes(customer.id));
    const names = targets.map(customer => customer.name);
    const commonBranch = targets.every(customer => customer.branch === targets[0].branch) ? targets[0].branch : '';

    $('#mapSubtitle').textContent = targets.length === 1
      ? `${targets[0].name} · saat ini ${targets[0].branch || 'belum ter-mapping'}`
      : `${targets.length} customer terpilih akan dipindahkan ke cabang yang sama.`;
    $('#mapSelection').innerHTML = `
      <b>${targets.length} customer</b>
      <p>${names.slice(0, 4).map(escapeHtml).join(', ')}${names.length > 4 ? `, +${names.length - 4} lainnya` : ''}</p>`;
    $('#mapBranch').value = commonBranch || '';
    $('#mapConfirm').disabled = !commonBranch;

    openModal($('#mapModal'));
    requestAnimationFrame(() => $('#mapBranch').focus());
  }

  function confirmMap() {
    const branch = $('#mapBranch').value;
    if (!branch || !mapIds.length) return;

    const count = mapIds.length;
    customers = customers.map(customer =>
      mapIds.includes(customer.id) ? { ...customer, branch } : customer
    );
    persist();
    closeModal($('#mapModal'));
    state.selected.clear();
    const moved = count;
    mapIds = [];
    render();
    toast(`${moved} customer dipindahkan ke ${branch}.`, 'ok');
  }

  /* ---------- Delete & reset ---------- */

  function openDelete(ids) {
    const targets = customers.filter(customer => ids.includes(customer.id));
    if (!targets.length) return;

    openConfirm({
      title: targets.length === 1 ? 'Hapus customer?' : `Hapus ${targets.length} customer?`,
      message: targets.length === 1
        ? `“${targets[0].name}” akan dihapus dari master data. Tindakan ini tidak dapat dibatalkan.`
        : `${targets.length} customer akan dihapus dari master data. Tindakan ini tidak dapat dibatalkan.`,
      label: 'Hapus',
      danger: true,
      onConfirm: () => {
        customers = customers.filter(customer => !ids.includes(customer.id));
        persist();
        state.selected.clear();
        render();
        toast(`${targets.length} customer dihapus.`, 'ok');
      }
    });
  }

  function openReset() {
    openConfirm({
      title: 'Reset data demo?',
      message: 'Semua perubahan mapping dan penghapusan akan dikembalikan ke data awal.',
      label: 'Reset Data',
      danger: false,
      onConfirm: () => {
        try { localStorage.removeItem(STORAGE_KEY); } catch (err) { /* ignore */ }
        customers = clone(CUSTOMER_SEED);
        resetFilters();
        toast('Data demo dikembalikan ke kondisi awal.', 'ok');
      }
    });
  }

  function openConfirm({ title, message, label, danger, onConfirm }) {
    $('#confirmTitle').textContent = title;
    $('#confirmMessage').textContent = message;
    const action = $('#confirmAction');
    action.textContent = label;
    action.className = 'btn ' + (danger ? 'danger' : '');
    confirmHandler = onConfirm;
    openModal($('#confirmModal'));
    requestAnimationFrame(() => action.focus());
  }

  /* ---------- Modals & toast ---------- */

  function openModal(modal) {
    lastFocus = document.activeElement;
    modal.hidden = false;
    document.body.classList.add('modal-open');
  }

  function closeModal(modal) {
    modal.hidden = true;
    if (!document.querySelector('.modal-backdrop:not([hidden])')) {
      document.body.classList.remove('modal-open');
    }
    if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
  }

  function toast(message, tone = 'ok') {
    const region = $('#toasts');
    const item = document.createElement('div');
    item.className = `toast ${tone}`;
    item.innerHTML = `<svg class="icon" aria-hidden="true"><use href="#i-${tone === 'bad' ? 'alert' : 'check'}"/></svg><span></span>`;
    item.querySelector('span').textContent = message;
    region.appendChild(item);
    requestAnimationFrame(() => item.classList.add('show'));
    setTimeout(() => {
      item.classList.remove('show');
      setTimeout(() => item.remove(), 250);
    }, 3200);
  }

  /* ---------- Navigation ---------- */

  function setNavActive(key) {
    document.querySelectorAll('.nav-link[data-nav]').forEach(link => {
      link.classList.toggle('active', link.dataset.nav === key);
    });
  }

  function updateNavOnScroll() {
    const threshold = window.scrollY + 140;
    let active = 'overview';
    ['overview', 'customers', 'mapping'].forEach(id => {
      const section = document.getElementById(id);
      if (section && section.getBoundingClientRect().top + window.scrollY <= threshold) active = id;
    });
    setNavActive(active);
  }

  /* ---------- Init & events ---------- */

  function fillBranchOptions() {
    BRANCHES.forEach(branch => {
      $('#branchFilter').insertAdjacentHTML('beforeend',
        `<option value="${escapeHtml(branch.name)}">${escapeHtml(branch.name)}</option>`);
      $('#mapBranch').insertAdjacentHTML('beforeend',
        `<option value="${escapeHtml(branch.name)}">${escapeHtml(branch.name)}</option>`);
    });
    $('#branchFilter').insertAdjacentHTML('beforeend', `<option value="${NONE}">Belum ter-mapping</option>`);
  }

  $('#tableSearch').addEventListener('input', event => {
    state.query = event.target.value.trim();
    state.page = 1;
    state.selected.clear();
    render();
  });

  $('#branchFilter').addEventListener('change', event => applyBranch(event.target.value));

  $('#checkAll').addEventListener('change', event => {
    currentPageIds.forEach(id => {
      if (event.target.checked) state.selected.add(id);
      else state.selected.delete(id);
    });
    syncSelectionUI();
  });

  $('#customerRows').addEventListener('change', event => {
    const check = event.target.closest('.row-check');
    if (!check) return;
    if (check.checked) state.selected.add(check.dataset.id);
    else state.selected.delete(check.dataset.id);
    syncSelectionUI();
  });

  $('#customerRows').addEventListener('click', event => {
    if (event.target.closest('[data-act="clear-filters"]')) {
      resetFilters();
      return;
    }
    const button = event.target.closest('button[data-act]');
    if (!button) return;
    if (button.dataset.act === 'map') openMap([button.dataset.id]);
    if (button.dataset.act === 'delete') openDelete([button.dataset.id]);
  });

  $('#branchGrid').addEventListener('click', event => {
    const card = event.target.closest('[data-branch]');
    if (!card) return;
    const branch = card.dataset.branch;
    applyBranch(state.branch === branch ? 'all' : branch);
    $('#customers').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  $('#pagination').addEventListener('click', event => {
    const button = event.target.closest('[data-page]');
    if (!button || button.disabled) return;
    state.page = Number(button.dataset.page);
    render();
    $('#customers').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  $('#bulkMap').addEventListener('click', () => openMap([...state.selected]));
  $('#bulkDelete').addEventListener('click', () => openDelete([...state.selected]));
  $('#btnReset').addEventListener('click', openReset);

  $('#mapBranch').addEventListener('change', event => {
    $('#mapConfirm').disabled = !event.target.value;
  });
  $('#mapConfirm').addEventListener('click', confirmMap);

  $('#confirmAction').addEventListener('click', () => {
    const handler = confirmHandler;
    confirmHandler = null;
    closeModal($('#confirmModal'));
    if (handler) handler();
  });

  document.querySelectorAll('[data-close]').forEach(button => {
    button.addEventListener('click', () => closeModal(document.getElementById(button.dataset.close)));
  });

  document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
    backdrop.addEventListener('click', event => {
      if (event.target === backdrop) closeModal(backdrop);
    });
  });

  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    const open = [...document.querySelectorAll('.modal-backdrop')].find(modal => !modal.hidden);
    if (open) closeModal(open);
  });

  window.addEventListener('scroll', () => {
    if (scrollQueued) return;
    scrollQueued = true;
    requestAnimationFrame(() => {
      updateNavOnScroll();
      scrollQueued = false;
    });
  }, { passive: true });

  document.querySelectorAll('.nav-link[data-nav]').forEach(link => {
    link.addEventListener('click', () => setNavActive(link.dataset.nav));
  });

  fillBranchOptions();
  render();
  updateNavOnScroll();
})();
