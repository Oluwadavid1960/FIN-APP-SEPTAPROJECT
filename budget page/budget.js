/*const openBtn = document.getElementById("openformbtn");
const modal = document.getElementById("budgetform");
const modalCenter = document.querySelector(".modal-center");
const closeBtn = document.getElementById("closebtn");

openBtn.onclick = () => modal.style.display = "block";
closeBtn.onclick = () => modal.style.display = "none";

// Close modal if user clicks outside the modal
window.onclick = (e) => {
  if (e.target === modalCenter) {
    modal.style.display = "none";
  }
};*/
/* ---------- Utilities & state ---------- */
const LS_KEY = 'fintrackr_budgets_v1';
let budgets = JSON.parse(localStorage.getItem(LS_KEY) || '[]'); // each: {id,name,amount,currency,category,recurrence,date,expenses: [{id,amt,date,note}], createdAt}
let editingId = null;
let selectedRecurrence = '';
const categoryIcons = {
  "All Categories":"🗂️",
  "Food":"🍔",
  "Transport":"🚌",
  "Shopping":"🛍️",
  "Bills":"💡"
};
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));

/* ---------- Helpers ---------- */
function saveState(){
  localStorage.setItem(LS_KEY, JSON.stringify(budgets));
}
function uid(prefix='id'){ return prefix + '_' + Math.random().toString(36).slice(2,9); }
function formatCurrency(cur, amt){
  // simple formatting
  return cur + ' ' + Number(amt).toLocaleString();
}
function totalAllocated(){ return budgets.reduce((s,b)=>s + Number(b.amount || 0), 0); }
function totalSpent(){ return budgets.reduce((s,b)=> s + b.expenses.reduce((x,e)=> x + Number(e.amt||0),0),0); }

/* ---------- Rendering ---------- */
function renderList(){
  const panel = $('#listPanel');
  panel.innerHTML = '';
  const search = $('#searchInput').value.trim().toLowerCase();
  const catFilter = $('#filterCategory').value;
  const recFilter = $('#filterRecurrence').value;
  const sortBy = $('#sortBy').value;

  let list = budgets.slice();

  if (search) list = list.filter(b => b.name.toLowerCase().includes(search));
  if (catFilter) list = list.filter(b => b.category === catFilter);
  if (recFilter) list = list.filter(b => b.recurrence === recFilter);

  // compute progress
  list = list.map(b => {
    const spent = b.expenses.reduce((s,e)=> s + Number(e.amt||0), 0);
    const progress = b.amount ? Math.min(100, Math.round((spent / b.amount) * 100)) : 0;
    return {...b, spent, progress};
  });

  // sort
  if (sortBy === 'amount-asc') list.sort((a,b)=> a.amount - b.amount);
  else if (sortBy === 'amount-desc') list.sort((a,b)=> b.amount - a.amount);
  else if (sortBy === 'oldest') list.sort((a,b)=> new Date(a.createdAt) - new Date(b.createdAt));
  else if (sortBy === 'progress-desc') list.sort((a,b)=> b.progress - a.progress);
  else list.sort((a,b)=> new Date(b.createdAt) - new Date(a.createdAt));

  if (list.length === 0){
    panel.innerHTML = '<div class="muted" style="padding:18px; text-align:center">No budgets yet — create one to get started.</div>';
    renderSummary();
    renderDashboard();
    return;
  }

  list.forEach(b => {
    const card = document.createElement('div');
    card.className = 'list-item budget-card panel';
    card.innerHTML = `
      <div style="display:flex; gap:12px; align-items:center; flex:1;">
        <div class="cat-badge" style="background:linear-gradient(135deg, rgba(0,0,0,0.03), transparent);">
          <div style="font-size:20px">${categoryIcons[b.category] || '📁'}</div>
        </div>
        <div class="meta" style="flex:1">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <div>
              <strong>${escapeHtml(b.name)}</strong>
              <div class="tiny">${b.category} • ${b.recurrence} • starts ${b.date}</div>
            </div>
            <div style="text-align:right">
              <div style="font-weight:700">${b.currency} ${Number(b.amount).toLocaleString()}</div>
              <div class="tiny">Allocated</div>
            </div>
          </div>

          <div style="margin-top:8px">
            <div style="display:flex; justify-content:space-between; align-items:center; gap:10px">
              <div style="flex:1; margin-right:12px;">
                <div class="progress-wrap" aria-hidden="true">
                  <div class="progress-bar" style="width:${b.progress}%"></div>
                </div>
                <div class="tiny" style="margin-top:6px">${b.progress}% used — ${b.currency} ${Number(b.spent).toLocaleString()} spent</div>
              </div>
              <div style="min-width:120px; display:flex; flex-direction:column; gap:6px;">
                <div style="display:flex; gap:8px;">
                  <button class="action-btn edit-btn" data-id="${b.id}">Edit</button>
                  <button class="action-btn expense-btn" data-id="${b.id}">Add Expense</button>
                </div>
                <div><button class="action-btn del-btn" data-id="${b.id}">Delete</button></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    panel.appendChild(card);
  });

  // attach listeners
  $$('.edit-btn').forEach(btn => btn.onclick = ()=> openModal('edit', btn.dataset.id));
  $$('.del-btn').forEach(btn => btn.onclick = ()=> {
    if (!confirm('Delete this budget?')) return;
    deleteBudget(btn.dataset.id);
  });
  $$('.expense-btn').forEach(btn => btn.onclick = ()=> openModal('expense', btn.dataset.id));

  renderSummary();
  renderDashboard();
}

function renderSummary(){
  $('#summaryCount').innerText = budgets.length;
  $('#summaryTotal').innerText = formatCurrency('', totalAllocated());
  $('#summarySpent').innerText = formatCurrency('', totalSpent());
}

function renderDashboard(){
  const grid = $('#dashboardGrid');
  grid.innerHTML = '';
  if (budgets.length === 0){
    grid.innerHTML = '<div class="muted" style="padding:10px">No dashboard data yet.</div>';
    return;
  }
  // show up to 9 cards
  budgets.slice(0,9).forEach(b => {
    const spent = b.expenses.reduce((s,e)=> s + Number(e.amt||0), 0);
    const percent = b.amount ? Math.min(100, Math.round((spent / b.amount)*100)) : 0;
    const card = document.createElement('div');
    card.className = 'panel budget-card';
    card.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <div style="display:flex; gap:12px; align-items:center">
          <div class="cat-badge">${categoryIcons[b.category]||'📁'}</div>
          <div>
            <strong>${escapeHtml(b.name)}</strong>
            <div class="tiny">${b.category}</div>
          </div>
        </div>
        <div style="text-align:right">
          <div style="font-weight:700">${b.currency} ${Number(b.amount).toLocaleString()}</div>
          <div class="tiny">Allocated</div>
        </div>
      </div>
      <div style="margin-top:10px">
        <div class="progress-wrap"><div class="progress-bar" style="width:${percent}%"></div></div>
        <div class="tiny" style="margin-top:8px">${percent}% • Spent ${b.currency} ${Number(spent).toLocaleString()}</div>
      </div>
    `;
    grid.appendChild(card);
  });
}

/* ---------- CRUD ---------- */
function createBudget(payload){
  const b = {
    id: uid('b'),
    name: payload.name,
    amount: Number(payload.amount),
    currency: payload.currency,
    category: payload.category,
    recurrence: payload.recurrence,
    date: payload.date,
    createdAt: new Date().toISOString(),
    expenses: payload.expenses || []
  };
  budgets.unshift(b);
  saveState();
  renderList();
  return b.id;
}
function updateBudget(id, payload){
  const idx = budgets.findIndex(x => x.id === id); if (idx === -1) return;
  budgets[idx] = {...budgets[idx], ...payload};
  saveState(); renderList();
}
function deleteBudget(id){
  budgets = budgets.filter(b => b.id !== id);
  saveState();
  renderList();
}

/* ---------- Modal logic ---------- */
const modal = $('#modalBackdrop');
const recButtons = $$('.rec');

function openModal(mode='create', id=null){
  editingId = id;
  modal.style.display = 'flex';
  modal.setAttribute('aria-hidden','false');

  // reset rec buttons
  recButtons.forEach(btn => btn.style.background='transparent');

  if (mode === 'create'){
    $('#modalTitle').innerText = 'New Budget';
    $('#mName').value = ''; $('#mAmount').value=''; $('#mCurrency').value='USD';
    $('#mCategory').value='All Categories'; $('#mDate').value = new Date().toISOString().slice(0,10);
    selectedRecurrence = 'Once'; setRecButton('Once');
    $('#saveModal').style.display = 'inline-block';
    $('#deleteFromModal').style.display = 'none';
    $('#expenseBlock').style.display = 'none';
  } else {
    const b = budgets.find(x=> x.id === id);
    if (!b) return;
    if (mode === 'edit'){
      $('#modalTitle').innerText = 'Edit Budget';
      $('#mName').value = b.name; $('#mAmount').value = b.amount; $('#mCurrency').value = b.currency;
      $('#mCategory').value = b.category; $('#mDate').value = b.date;
      selectedRecurrence = b.recurrence; setRecButton(b.recurrence);
      $('#saveModal').style.display = 'inline-block';
      $('#deleteFromModal').style.display = 'inline-block';
      $('#expenseBlock').style.display = 'block';
      renderExpenses(b.id);
    } else if (mode === 'expense'){
      $('#modalTitle').innerText = 'Add Expense';
      $('#saveModal').style.display = 'none';
      $('#deleteFromModal').style.display = 'none';
      $('#expenseBlock').style.display = 'block';
      // show budget basic info in modal
      $('#mName').value = b.name; $('#mAmount').value = b.amount; $('#mCurrency').value = b.currency;
      $('#mCategory').value = b.category; $('#mDate').value = b.date;
      selectedRecurrence = b.recurrence; setRecButton(b.recurrence);
      renderExpenses(b.id);
    }
  }
}

function closeModal(){
  modal.style.display = 'none';
  editingId = null;
  $('#expAmount').value=''; $('#expNote').value=''; $('#expDate').value='';
}

$$('.rec').forEach(btn => {
  btn.addEventListener('click', e => {
    const v = btn.dataset.val;
    selectedRecurrence = v;
    setRecButton(v);
  });
});
function setRecButton(v){
  recButtons.forEach(btn => btn.style.background = (btn.dataset.val === v) ? 'var(--accent)' : 'transparent');
  recButtons.forEach(btn => btn.style.color = (btn.dataset.val === v) ? '#fff' : '');
}

/* Save and Delete from modal */
$('#saveModal').addEventListener('click', ()=>{
  const payload = {
    name: $('#mName').value.trim(),
    amount: Number($('#mAmount').value || 0),
    currency: $('#mCurrency').value,
    category: $('#mCategory').value,
    recurrence: selectedRecurrence || 'Once',
    date: $('#mDate').value || new Date().toISOString().slice(0,10)
  };
  if (!payload.name || !payload.amount){ alert('Please enter name and amount'); return; }

  if (editingId){
    updateBudget(editingId, payload);
  } else {
    createBudget(payload);
  }
  closeModal();
});

$('#deleteFromModal').addEventListener('click', ()=>{
  if (!editingId) return;
  if (!confirm('Delete this budget (and its expenses)?')) return;
  deleteBudget(editingId);
  closeModal();
});

/* Expenses */
function renderExpenses(bid){
  const target = $('#expensesList');
  target.innerHTML = '';
  const b = budgets.find(x => x.id === bid);
  if (!b) return;
  if (!b.expenses) b.expenses = [];
  b.expenses.slice().reverse().forEach(e => {
    const row = document.createElement('div');
    row.style.display='flex'; row.style.justifyContent='space-between'; row.style.alignItems='center';
    row.style.padding='8px'; row.style.borderRadius='8px'; row.style.background='rgba(0,0,0,0.03)';
    row.innerHTML = `<div><strong>${b.currency} ${Number(e.amt).toLocaleString()}</strong><div class="tiny">${e.date} • ${escapeHtml(e.note||'')}</div></div>
      <div style="display:flex; gap:8px">
        <button class="btn ghost" data-b="${bid}" data-e="${e.id}">Edit</button>
        <button class="btn del-btn" data-b="${bid}" data-e="${e.id}">Delete</button>
      </div>`;
    target.appendChild(row);
  });

  // attach expense edit/delete listeners
  target.querySelectorAll('button[data-e]').forEach(btn=>{
    btn.onclick = (ev)=>{
      const bId = btn.dataset.b, eId = btn.dataset.e;
      if (btn.innerText.toLowerCase().includes('edit')){
        // populate exp inputs for edit
        const bObj = budgets.find(x=>x.id===bId);
        const eObj = bObj.expenses.find(x=>x.id===eId);
        $('#expAmount').value = eObj.amt; $('#expDate').value = eObj.date; $('#expNote').value = eObj.note || '';
        $('#addExpenseBtn').dataset.edit = JSON.stringify({bId,eId});
      } else {
        if (!confirm('Delete this expense?')) return;
        removeExpense(bId, eId);
        renderExpenses(bId);
        renderList();
      }
    };
  });
}

$('#addExpenseBtn').addEventListener('click', ()=>{
  const amt = Number($('#expAmount').value || 0);
  const date = $('#expDate').value || new Date().toISOString().slice(0,10);
  const note = $('#expNote').value.trim();
  if (!amt || amt <= 0){ alert('Enter a positive amount'); return; }

  // if editing expense
  if ($('#addExpenseBtn').dataset.edit){
    const ed = JSON.parse($('#addExpenseBtn').dataset.edit);
    editExpense(ed.bId, ed.eId, {amt,date,note});
    $('#addExpenseBtn').removeAttribute('data-edit');
  } else {
    // add expense to currently opened budget (editingId)
    const targetId = editingId || null;
    if (!targetId){ alert('No budget selected'); return; }
    addExpense(targetId, {amt,date,note});
  }

  $('#expAmount').value=''; $('#expDate').value=''; $('#expNote').value='';
  renderExpenses(editingId);
  renderList();
});

/* expense operations */
function addExpense(bid, obj){
  const b = budgets.find(x=> x.id === bid); if (!b) return;
  if (!b.expenses) b.expenses = [];
  b.expenses.push({ id: uid('e'), amt: Number(obj.amt), date: obj.date, note: obj.note });
  saveState();
}
function removeExpense(bid, eid){
  const b = budgets.find(x=> x.id === bid); if (!b) return;
  b.expenses = b.expenses.filter(x=> x.id !== eid);
  saveState();
}
function editExpense(bid, eid, payload){
  const b = budgets.find(x=> x.id === bid); if (!b) return;
  const idx = b.expenses.findIndex(x=> x.id === eid); if (idx===-1) return;
  b.expenses[idx] = {...b.expenses[idx], amt: Number(payload.amt), date: payload.date, note: payload.note};
  saveState();
}

/* ---------- Quick create & top controls ---------- */
$('#btnCreateQuick').addEventListener('click', ()=>{
  const name = $('#quickName').value.trim();
  const amount = Number($('#quickAmount').value || 0);
  const currency = $('#quickCurrency').value;
  const category = $('#quickCategory').value;
  if (!name || !amount){ alert('Please enter name and amount'); return; }
  createBudget({name,amount,currency,category,recurrence:'Monthly',date:new Date().toISOString().slice(0,10)});
  $('#quickName').value=''; $('#quickAmount').value='';
  alert('Budget created');
});

$('#openCreate').addEventListener('click', ()=> openModal('create'));
$('#openCreateTop').addEventListener('click', ()=> openModal('create'));
$('#btnOpenAdvanced').addEventListener('click', ()=> openModal('create'));
$('#closeModal').addEventListener('click', ()=> closeModal());
$('#modalBackdrop').addEventListener('click', (e)=> { if (e.target === modal) closeModal(); });

$('#searchInput').addEventListener('input', renderList);
$('#filterCategory').addEventListener('change', renderList);
$('#filterRecurrence').addEventListener('change', renderList);
$('#sortBy').addEventListener('change', renderList);
$('#btnExpandAll').addEventListener('click', ()=> {
  // simple scroll to top of list
  document.querySelector('#listPanel')?.scrollIntoView({behavior:'smooth'});
});

/* Theme toggle */
const themeToggle = $('#themeToggle');
function applyTheme(t){
  document.documentElement.setAttribute('data-theme', t);
  localStorage.setItem('fin_theme', t);
  themeToggle.innerText = t === 'dark' ? '☀️' : '🌙';
}
themeToggle.addEventListener('click', ()=>{
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  applyTheme(current === 'light' ? 'dark' : 'light');
});
const savedTheme = localStorage.getItem('fin_theme') || 'light';
applyTheme(savedTheme);

/* Escape HTML utility */
function escapeHtml(s=''){ return String(s).replace(/[&<>"']/g, c=> ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

/* ---------- initialize demo / load ---------- */
function initDemoIfEmpty(){
  if (budgets.length > 0) return;
  // sample budgets
  createBudget({name:'Groceries', amount:500, currency:'USD', category:'Food', recurrence:'Weekly', date: new Date().toISOString().slice(0,10), expenses: [{id: uid('e'), amt:120, date: new Date().toISOString().slice(0,10), note:'Walmart'}]});
  createBudget({name:'Transport', amount:200, currency:'USD', category:'Transport', recurrence:'Monthly', date: new Date().toISOString().slice(0,10), expenses: []});
  createBudget({name:'Utilities', amount:150, currency:'USD', category:'Bills', recurrence:'Monthly', date: new Date().toISOString().slice(0,10), expenses: [{id: uid('e'), amt:60, date: new Date().toISOString().slice(0,10), note:'Electric'}]});
}

initDemoIfEmpty();
renderList();

/* ---------- small accessibility: keyboard ESC closes modal ---------- */
document.addEventListener('keydown', (e)=> {
  if (e.key === 'Escape') {
    if (modal.style.display === 'flex') closeModal();
  }
});


