/*document.addEventListener("DOMContentLoaded", () => {
  const deleteButtons = document.querySelectorAll(".btn-delete");

  deleteButtons.forEach(btn => {
    btn.addEventListener("click", function () {
      // find the closest parent <li class="categories-item">
      const categoryItem = this.closest(".categories-item");

      // Optional: confirm before deleting
      if (confirm("Are you sure you want to delete this category?")) {
        categoryItem.remove();
      }
    });
  });
});

function formatAmount(input) {
    // Remove all non-digit characters
    let value = input.value.replace(/\D/g, "");

    // Format with commas
    value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    // Update input
    input.value = value;
}*/


/* -------------------------
   INITIAL DATA & STORAGE
   ------------------------- */
const STORAGE_KEY = 'fintracker_categories_v1';
let categories = []; // {id, icon, color, name, type, tx}
let editId = null;
let mergeMode = false;
let selectedForMerge = new Set();

/* sample icon list (50+). Add more if you want */
const ICONS = ["💼","💵","🎁","🏦","💳","🚗","🍔","🎓","👨‍👩‍👧","🏡","🛒","✈️","🚲","📦","💡","🧾","🔧","📚","🍎","🎉","🎮","🏥","🪙","🧑‍🍳","☕","🍺","🎤","⚽","🖥️","📱","🔒","🧰","🛠️","🏖️","🛍️","🧴","💊","📷","🧾","🌱","💼","🧑‍🏫","🪙","🧾","🔑","🪙","💰","🎯","📈","📉","🔋","🧧","🏦","👛","🪪"];

/* DOM refs */
const incomeList = document.getElementById('incomeList');
const expenseList = document.getElementById('expenseList');
const iconGrid = document.getElementById('iconGrid');
const iconsModal = document.getElementById('iconsModal');
const iconSelect = document.getElementById('iconSelect');
const colorInput = document.getElementById('colorInput');
const nameInput = document.getElementById('nameInput');
const typeInput = document.getElementById('typeInput');
const txInput = document.getElementById('txInput');
const previewIcon = document.getElementById('previewIcon');
const previewName = document.getElementById('previewName');
const previewMeta = document.getElementById('previewMeta');
const confirmModal = document.getElementById('confirmModal');
const confirmTitle = document.getElementById('confirmTitle');
const confirmBody = document.getElementById('confirmBody');
const confirmOk = document.getElementById('confirmOk');
const confirmCancel = document.getElementById('confirmCancel');
const saveBtn = document.getElementById('saveBtn');
const confirmSave = document.getElementById('confirmSave');
const resetForm = document.getElementById('resetForm');
const deleteWhileEdit = document.getElementById('deleteWhileEdit');
const search = document.getElementById('search');
const sortSelect = document.getElementById('sortSelect');
const mergeModeBtn = document.getElementById('mergeModeBtn');
const mergeControls = document.getElementById('mergeControls');
const selectedCount = document.getElementById('selectedCount');
const mergeTarget = document.getElementById('mergeTarget');
const doMerge = document.getElementById('doMerge');
const cancelMerge = document.getElementById('cancelMerge');
const loadSample = document.getElementById('loadSample');
const darkToggle = document.getElementById('darkToggle');
const iconsOpenBtn = document.getElementById('iconsOpenBtn');
const openIcons = document.getElementById('openIcons');
const formTitle = document.getElementById('formTitle');
const formMode = document.getElementById('formMode');
const deleteWhileEditBtn = document.getElementById('deleteWhileEdit');

/* util */
function uid(){ return Math.random().toString(36).slice(2,9); }

function saveToStorage(){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
}

function loadFromStorage(){
  const raw = localStorage.getItem(STORAGE_KEY);
  if(raw) {
    try { categories = JSON.parse(raw) } catch(e){ categories = [] }
  } else {
    // initialize with a few defaults
    categories = [
      {id:uid(), icon:'💼', color:'#f59e0b', name:'Business', type:'income', tx:0},
      {id:uid(), icon:'💵', color:'#16a34a', name:'Salary', type:'income', tx:2},
      {id:uid(), icon:'🎁', color:'#8b5cf6', name:'Gifts', type:'income', tx:1},
      {id:uid(), icon:'🏦', color:'#ef4444', name:'Loan', type:'income', tx:0},
      {id:uid(), icon:'🍔', color:'#10b981', name:'Food and Drink', type:'expense', tx:2},
      {id:uid(), icon:'🚗', color:'#3b82f6', name:'Car', type:'expense', tx:3},
      {id:uid(), icon:'🎓', color:'#64748b', name:'Education', type:'expense', tx:0}
    ];
  }
}

/* -------------------------
   RENDER ICON GRID
   ------------------------- */
function renderIconGrid(){
  iconGrid.innerHTML = '';
  for(const ic of ICONS){
    const el = document.createElement('div');
    el.className = 'icon-tile';
    el.textContent = ic;
    el.title = ic;
    el.onclick = ()=>{
      iconSelect.value = ic;
      closeIconsModal();
      updatePreview();
    };
    iconGrid.appendChild(el);
  }
  // also fill select dropdown with icons (no labels)
  iconSelect.innerHTML = ICONS.map(i=>`<option value="${i}">${i}</option>`).join('');
}

/* -------------------------
   RENDER LISTS
   ------------------------- */
function renderLists(){
  const q = search.value.trim().toLowerCase();
  const sort = sortSelect.value;

  let filtered = categories.filter(c => c.name.toLowerCase().includes(q));
  // sort
  if(sort === 'alpha') filtered.sort((a,b)=>a.name.localeCompare(b.name));
  else if(sort === 'alpha-desc') filtered.sort((a,b)=>b.name.localeCompare(a.name));
  else if(sort === 'type') filtered.sort((a,b)=>a.type.localeCompare(b.type) || b.tx - a.tx);
  else if(sort === 'txdesc') filtered.sort((a,b)=>b.tx - a.tx);

  incomeList.innerHTML = '';
  expenseList.innerHTML = '';

  for(const cat of filtered){
    const wrapper = document.createElement('div');
    wrapper.className = 'category fade-in';
    // left
    const left = document.createElement('div'); left.className = 'left';
    const chk = document.createElement('input'); chk.type='checkbox'; chk.className='checkbox';
    chk.dataset.id = cat.id;
    chk.onchange = onSelectForMerge;
    left.appendChild(chk);

    const icon = document.createElement('div'); icon.className='cat-icon';
    icon.style.background = cat.color; icon.textContent = cat.icon;
    left.appendChild(icon);

    const meta = document.createElement('div'); meta.className='cat-meta';
    const title = document.createElement('div'); title.className='cat-title'; title.textContent = cat.name;
    const sub = document.createElement('div'); sub.className='cat-sub'; sub.innerHTML = `${cat.type.charAt(0).toUpperCase()+cat.type.slice(1)} • <span class="muted-small">${cat.tx} transaction${cat.tx===1?'':'s'}</span>`;
    meta.appendChild(title); meta.appendChild(sub);
    left.appendChild(meta);

    // actions
    const actions = document.createElement('div'); actions.className='cat-actions';
    const edit = document.createElement('button'); edit.className='icon-btn'; edit.title='Edit'; edit.innerHTML='⚙️';
    edit.onclick = ()=> startEdit(cat.id);
    const del = document.createElement('button'); del.className='icon-btn'; del.title='Delete'; del.innerHTML='🗑️';
    del.onclick = ()=> confirmAction(`Delete "${cat.name}"?`, `This will permanently remove "${cat.name}".`, ()=>{
      categories = categories.filter(x=>x.id!==cat.id);
      saveToStorage(); renderLists();
    });

    actions.appendChild(edit); actions.appendChild(del);

    wrapper.appendChild(left);
    wrapper.appendChild(actions);

    if(cat.type === 'income') incomeList.appendChild(wrapper);
    else expenseList.appendChild(wrapper);
  }

  updateMergeTargetOptions();
}

/* -------------------------
   FORM / PREVIEW / CRUD
   ------------------------- */
function updatePreview(){
  const ic = iconSelect.value;
  const col = colorInput.value;
  const nm = nameInput.value || 'New category';
  const tp = typeInput.value;
  const tx = +txInput.value || 0;
  previewIcon.textContent = ic;
  previewIcon.style.background = col;
  previewName.textContent = nm;
  previewMeta.textContent = `${tp.charAt(0).toUpperCase()+tp.slice(1)} • ${tx} transaction${tx===1?'':'s'}`;
}

/* start editing */
function startEdit(id){
  const cat = categories.find(c=>c.id===id);
  if(!cat) return;
  editId = id;
  iconSelect.value = cat.icon;
  colorInput.value = cat.color || '#2563eb';
  nameInput.value = cat.name;
  typeInput.value = cat.type;
  txInput.value = cat.tx;
  formTitle.textContent = 'Edit category';
  formMode.textContent = '(Edit)';
  deleteWhileEdit.style.display = 'inline-block';
  scrollToTop();
  updatePreview();
}

/* reset to add new */
function resetFormFields(){
  editId = null;
  iconSelect.value = ICONS[0];
  colorInput.value = '#2563eb';
  nameInput.value = '';
  typeInput.value = 'income';
  txInput.value = 0;
  formTitle.textContent = 'Create a new category';
  formMode.textContent = '(Add)';
  deleteWhileEdit.style.display = 'none';
  updatePreview();
}

/* confirm before saving edit */
function onConfirmSave(){
  const name = nameInput.value.trim();
  if(name === '') return alert('Enter a name');
  // confirm before applying changes (as user requested Confirm Edit Popup)
  confirmAction(editId ? `Save changes to "${name}"?` : `Create category "${name}"?`,
    editId ? 'Save changes to this category?' : 'Create new category with your settings?',
    ()=>{
      if(editId){
        const idx = categories.findIndex(c=>c.id===editId);
        if(idx>=0){
          categories[idx] = {
            ...categories[idx],
            icon: iconSelect.value,
            color: colorInput.value,
            name: name,
            type: typeInput.value,
            tx: Math.max(0, parseInt(txInput.value)||0)
          };
        }
      } else {
        categories.push({
          id: uid(),
          icon: iconSelect.value,
          color: colorInput.value,
          name: name,
          type: typeInput.value,
          tx: Math.max(0, parseInt(txInput.value)||0)
        });
      }
      saveToStorage();
      resetFormFields();
      renderLists();
    }
  );
}

/* delete while editing */
function onDeleteWhileEditing(){
  if(!editId) return;
  const cat = categories.find(c=>c.id===editId);
  if(!cat) return;
  confirmAction(`Delete "${cat.name}"?`, 'This will permanently delete this category.', ()=>{
    categories = categories.filter(c=>c.id!==editId);
    saveToStorage();
    resetFormFields();
    renderLists();
  });
}

/* -------------------------
   MERGE LOGIC
   ------------------------- */
function toggleMergeMode(){
  mergeMode = !mergeMode;
  selectedForMerge.clear();
  mergeControls.hidden = !mergeMode;
  mergeModeBtn.textContent = mergeMode ? 'Merging...' : 'Merge categories';
  renderLists();
}

function onSelectForMerge(e){
  const id = e.target.dataset.id;
  if(e.target.checked) selectedForMerge.add(id);
  else selectedForMerge.delete(id);
  selectedCount.textContent = selectedForMerge.size;
}

function updateMergeTargetOptions(){
  // fill merge target with all categories except selected ones (or all if none selected)
  mergeTarget.innerHTML = '';
  for(const c of categories){
    const opt = document.createElement('option');
    opt.value = c.id;
    opt.textContent = `${c.name} (${c.type}, ${c.tx})`;
    mergeTarget.appendChild(opt);
  }
}

function doMergeAction(){
  const toId = mergeTarget.value;
  if(!toId) return alert('Select a target');
  if(selectedForMerge.size === 0) return alert('Select at least one category to merge');
  if(selectedForMerge.has(toId)) return alert('Cannot merge target into itself');

  const target = categories.find(c=>c.id===toId);
  if(!target) return;

  confirmAction(`Merge categories into "${target.name}"?`,
    `This will move transactions from ${selectedForMerge.size} selected categories into "${target.name}" and delete the source categories.`,
    ()=>{
      // combine tx counts + delete selected
      let moved = 0;
      for(const id of Array.from(selectedForMerge)){
        const src = categories.find(c=>c.id===id);
        if(!src || src.id===toId) continue;
        moved += src.tx;
        categories = categories.filter(x=>x.id!==id);
      }
      // add moved transactions to target
      target.tx = (target.tx || 0) + moved;
      saveToStorage();
      selectedForMerge.clear();
      toggleMergeMode(); // disable merge mode
      renderLists();
    }
  );
}

/* -------------------------
   CONFIRM MODAL UTIL
   ------------------------- */
function confirmAction(title, body, onOk){
  confirmTitle.textContent = title;
  confirmBody.textContent = body;
  confirmModal.style.display = 'flex';
  confirmOk.onclick = ()=>{
    confirmModal.style.display = 'none';
    onOk && onOk();
  };
  confirmCancel.onclick = ()=> confirmModal.style.display = 'none';
}

/* -------------------------
   ICONS MODAL
   ------------------------- */
function openIconsModal(){
  iconsModal.style.display = 'flex';
}
function closeIconsModal(){ iconsModal.style.display = 'none' }

/* -------------------------
   EVENTS
   ------------------------- */
document.addEventListener('click', (ev)=>{
  if(ev.target === iconsModal) closeIconsModal();
  if(ev.target === confirmModal) confirmModal.style.display = 'none';
});

openIcons.onclick = openIconsModal;
iconsOpenBtn.onclick = openIconsModal;
document.getElementById('closeIcons').onclick = closeIconsModal;

iconSelect.onchange = updatePreview;
colorInput.oninput = updatePreview;
nameInput.oninput = updatePreview;
typeInput.onchange = updatePreview;
txInput.oninput = updatePreview;

search.oninput = renderLists;
sortSelect.onchange = renderLists;

confirmSave.onclick = onConfirmSave;
saveBtn.onclick = ()=>{ /* scroll to form */ document.getElementById('formCard').scrollIntoView({behavior:'smooth'}) };
resetForm.onclick = resetFormFields;
deleteWhileEdit.onclick = onDeleteWhileEditing;

mergeModeBtn.onclick = toggleMergeMode;
doMerge.onclick = doMergeAction;
cancelMerge.onclick = ()=>{ selectedForMerge.clear(); toggleMergeMode(); }

loadSample.onclick = ()=>{
  // add some sample categories
  categories.push({id:uid(), icon:'🧾', color:'#8b5cf6', name:'Freelance', type:'income', tx:4});
  categories.push({id:uid(), icon:'🛍️', color:'#ef4444', name:'Shopping', type:'expense', tx:5});
  saveToStorage(); renderLists();
};

document.getElementById('clearAllBtn').onclick = ()=>{
  confirmAction('Clear ALL categories?', 'This will remove all categories and reset to empty.', ()=>{
    categories = [];
    saveToStorage(); renderLists(); resetFormFields();
  });
};

/* delete while editing button */
deleteWhileEditBtn.onclick = onDeleteWhileEditing;

/* keyboard: Enter on search does nothing special; Enter in form saves */
document.getElementById('app').addEventListener('keydown', (e)=>{
  if(e.key === 'Enter' && (document.activeElement === nameInput || document.activeElement === txInput)){
    onConfirmSave();
  }
});

/* dark mode */
(function(){
  const saved = localStorage.getItem('fintracker_theme');
  if(saved) document.documentElement.setAttribute('data-theme', saved);
  darkToggle.onclick = ()=>{
    const cur = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light':'dark';
    document.documentElement.setAttribute('data-theme', cur==='dark'?'dark':'');
    localStorage.setItem('fintracker_theme', cur==='dark'?'dark':'');
  }
})();

/* icons modal populate */
renderIconGrid();

/* initial load */
loadFromStorage();
renderLists();
resetFormFields();
updatePreview();

/* update preview on load too */
updatePreview();

/* expose save to Save button in header: scroll to form */
saveBtn.addEventListener('click', ()=> window.scrollTo({top:0,behavior:'smooth'}));

/* to make checkboxes work during merge mode: intercept list render checkboxes */
incomeList.addEventListener('change', (e)=>{ if(e.target.matches('.checkbox')) onSelectForMerge(e) });
expenseList.addEventListener('change', (e)=>{ if(e.target.matches('.checkbox')) onSelectForMerge(e) });
