/* ============================================
   CHHAPARWAL BANDHU – ADMIN PANEL JS
   ============================================ */

// ============ CREDENTIALS ============
const ADMIN_USER = 'admin';
const ADMIN_PASS = 'admin123';
const SESSION_KEY = 'cb_admin_session';

// ============ DEFAULT PRODUCTS ============
const DEFAULT_PRODUCTS = [
  { id: 1, name: "Royal Kundan Necklace Set", category: "necklaces", price: 899, oldPrice: 1299, image: "necklaces_collection.png", rating: 4.9, reviews: 128, tag: "popular" },
  { id: 2, name: "Peacock Jhumka Earrings", category: "earrings", price: 349, oldPrice: 499, image: "earrings_collection.png", rating: 4.8, reviews: 95, tag: "new" },
  { id: 3, name: "Navratri Bangle Set (12pc)", category: "bangles", price: 499, oldPrice: 699, image: "bangles_collection.png", rating: 4.7, reviews: 74, tag: "sale" },
  { id: 4, name: "Bridal Complete Set", category: "bridal", price: 2499, oldPrice: 3299, image: "bridal_sets.png", rating: 5.0, reviews: 56, tag: "popular" },
  { id: 5, name: "Chandbali Drop Earrings", category: "earrings", price: 279, oldPrice: 399, image: "earrings_collection.png", rating: 4.6, reviews: 88, tag: "new" },
  { id: 6, name: "Layered Gold Necklace", category: "necklaces", price: 649, oldPrice: 899, image: "necklaces_collection.png", rating: 4.8, reviews: 112, tag: "popular" },
  { id: 7, name: "Kundan Cocktail Ring", category: "rings", price: 199, oldPrice: 299, image: "rings_collection.png", rating: 4.5, reviews: 63, tag: "new" },
  { id: 8, name: "Diamond-Cut Bangles (Set of 6)", category: "bangles", price: 399, oldPrice: 599, image: "bangles_collection.png", rating: 4.7, reviews: 47, tag: "sale" },
  { id: 9, name: "Emerald Choker Set", category: "necklaces", price: 1099, oldPrice: 1499, image: "necklaces_collection.png", rating: 4.9, reviews: 39, tag: "new" },
  { id: 10, name: "Maang Tikka Set", category: "bridal", price: 799, oldPrice: 1099, image: "bridal_sets.png", rating: 4.8, reviews: 82, tag: "popular" },
  { id: 11, name: "Pearl Studs Earrings", category: "earrings", price: 149, oldPrice: 249, image: "earrings_collection.png", rating: 4.6, reviews: 143, tag: "sale" },
  { id: 12, name: "Stone Embellished Ring", category: "rings", price: 149, oldPrice: 229, image: "rings_collection.png", rating: 4.4, reviews: 57, tag: null }
];

// ============ STATE ============
let products = [];
let adminFilter = 'all';
let adminSearchQuery = '';
let toastTimer = null;

// ============ INIT ============
document.addEventListener('DOMContentLoaded', () => {
  // Check session
  if (sessionStorage.getItem(SESSION_KEY) === 'true') {
    showDashboard();
  }

  // Load products from localStorage or use defaults
  const stored = localStorage.getItem('cb_products');
  if (stored) {
    try { products = JSON.parse(stored); } catch(e) { products = [...DEFAULT_PRODUCTS]; }
  } else {
    products = [...DEFAULT_PRODUCTS];
    saveProducts();
  }

  // Live price preview in modal
  document.getElementById('pPrice').addEventListener('input', updatePricePreview);
  document.getElementById('pOldPrice').addEventListener('input', updatePricePreview);
  document.getElementById('pTag').addEventListener('change', updatePricePreview);
});

// ============ AUTH ============
function handleLogin(e) {
  e.preventDefault();
  const user = document.getElementById('loginUsername').value.trim();
  const pass = document.getElementById('loginPassword').value;
  const errorEl = document.getElementById('loginError');
  const btn = document.getElementById('loginBtn');

  btn.textContent = 'Signing in...';
  btn.disabled = true;

  setTimeout(() => {
    if (user === ADMIN_USER && pass === ADMIN_PASS) {
      sessionStorage.setItem(SESSION_KEY, 'true');
      errorEl.textContent = '';
      showDashboard();
    } else {
      errorEl.textContent = '❌ Invalid username or password.';
      btn.textContent = 'Sign In';
      btn.disabled = false;
    }
  }, 600);
}

function showDashboard() {
  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('adminApp').style.display = 'grid';
  renderTable();
  updateStats();
}

function logout() {
  sessionStorage.removeItem(SESSION_KEY);
  document.getElementById('adminApp').style.display = 'none';
  document.getElementById('loginScreen').style.display = 'flex';
  document.getElementById('loginUsername').value = '';
  document.getElementById('loginPassword').value = '';
  document.getElementById('loginError').textContent = '';
}

function togglePw() {
  const input = document.getElementById('loginPassword');
  input.type = input.type === 'password' ? 'text' : 'password';
}

// ============ PRODUCTS PERSISTENCE ============
function saveProducts() {
  localStorage.setItem('cb_products', JSON.stringify(products));
}

function getNextId() {
  return products.length === 0 ? 1 : Math.max(...products.map(p => p.id)) + 1;
}

// ============ FILTER / SEARCH ============
function setAdminTab(filter, el) {
  adminFilter = filter;
  document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  renderTable();
}

function filterAdminProducts(query) {
  adminSearchQuery = query.toLowerCase();
  renderTable();
}

function getFilteredProducts() {
  return products.filter(p => {
    const matchCat = adminFilter === 'all' || p.category === adminFilter;
    const matchSearch = !adminSearchQuery ||
      p.name.toLowerCase().includes(adminSearchQuery) ||
      p.category.toLowerCase().includes(adminSearchQuery);
    return matchCat && matchSearch;
  });
}

// ============ RENDER TABLE ============
function renderTable() {
  const tbody = document.getElementById('productTableBody');
  const empty = document.getElementById('tableEmpty');
  const countEl = document.getElementById('productCount');
  const filtered = getFilteredProducts();

  countEl.textContent = `${products.length} product${products.length !== 1 ? 's' : ''}`;

  if (filtered.length === 0) {
    tbody.innerHTML = '';
    empty.style.display = 'block';
    return;
  }

  empty.style.display = 'none';

  tbody.innerHTML = filtered.map(p => {
    const tagHtml = p.tag
      ? `<span class="badge badge-${p.tag}">${p.tag.charAt(0).toUpperCase() + p.tag.slice(1)}</span>`
      : `<span class="badge badge-none">None</span>`;

    const priceHtml = p.oldPrice
      ? `<span class="price-current">₹${p.price.toLocaleString('en-IN')}</span>`
      : `<span class="price-current">₹${p.price.toLocaleString('en-IN')}</span>`;

    const oldPriceHtml = p.oldPrice
      ? `₹${p.oldPrice.toLocaleString('en-IN')}`
      : `<span class="price-none">—</span>`;

    const categoryLabel = getCategoryLabel(p.category);
    const stars = '★'.repeat(Math.floor(p.rating)) + (p.rating % 1 >= 0.5 ? '½' : '');

    return `
      <tr id="row-${p.id}">
        <td><img src="${p.image}" alt="${p.name}" class="product-thumb" /></td>
        <td><div class="product-name-cell" title="${p.name}">${p.name}</div></td>
        <td><span class="category-chip">${categoryLabel}</span></td>
        <td>${priceHtml}</td>
        <td>${oldPriceHtml}</td>
        <td>${tagHtml}</td>
        <td class="rating-cell">⭐ ${p.rating} <span style="color:var(--text-muted);font-size:0.75rem">(${p.reviews})</span></td>
        <td>
          <div class="action-btns">
            <button class="btn-edit" onclick="openProductModal(${p.id})">✏️ Edit</button>
            <button class="btn-delete" onclick="deleteProduct(${p.id})">🗑 Delete</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  updateStats();
}

// ============ STATS ============
function updateStats() {
  document.getElementById('statTotal').textContent = products.length;
  document.getElementById('statSale').textContent = products.filter(p => p.tag === 'sale' || p.oldPrice).length;
  document.getElementById('statPopular').textContent = products.filter(p => p.tag === 'popular').length;
  document.getElementById('statNew').textContent = products.filter(p => p.tag === 'new').length;
}

// ============ CATEGORY LABEL ============
function getCategoryLabel(cat) {
  const map = { necklaces: 'Necklaces', earrings: 'Earrings', bangles: 'Bangles', rings: 'Rings', bridal: 'Bridal Sets' };
  return map[cat] || cat;
}

// ============ PRODUCT MODAL ============
let currentUploadedImageBase64 = null;

// The input element is available synchronously since script is at end of body.
// Wait until DOMContentLoaded just in case it runs earlier though.
document.addEventListener("DOMContentLoaded", () => {
  const fileInput = document.getElementById("pImageUpload");
  if (fileInput) {
    fileInput.addEventListener("change", function(e) {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(evt) {
          currentUploadedImageBase64 = evt.target.result;
          document.getElementById('pImagePreview').src = currentUploadedImageBase64;
          document.getElementById('pImagePreviewContainer').style.display = 'block';
        };
        reader.readAsDataURL(file);
      } else {
        currentUploadedImageBase64 = null;
      }
    });
  }
});

function openProductModal(id = null) {
  const modalTitle = document.getElementById('modalTitle');
  const saveBtn = document.getElementById('saveBtn');
  const form = document.getElementById('productForm');

  form.reset();
  document.getElementById('editProductId').value = '';
  document.getElementById('pExistingImage').value = '';
  document.getElementById('pImagePreviewContainer').style.display = 'none';
  document.getElementById('pImagePreview').src = '';
  currentUploadedImageBase64 = null;

  if (id !== null) {
    // Edit mode
    const p = products.find(prod => prod.id === id);
    if (!p) return;

    modalTitle.textContent = 'Edit Product';
    saveBtn.textContent = 'Save Changes';
    document.getElementById('editProductId').value = p.id;
    document.getElementById('pName').value = p.name;
    document.getElementById('pCategory').value = p.category;
    document.getElementById('pPrice').value = p.price;
    document.getElementById('pOldPrice').value = p.oldPrice || '';
    document.getElementById('pTag').value = p.tag || '';
    document.getElementById('pExistingImage').value = p.image || '';
    if (p.image) {
      document.getElementById('pImagePreview').src = p.image;
      document.getElementById('pImagePreviewContainer').style.display = 'block';
    }
    document.getElementById('pRating').value = p.rating;
    document.getElementById('pReviews').value = p.reviews;
  } else {
    // Add mode
    modalTitle.textContent = 'Add New Product';
    saveBtn.textContent = 'Add Product';
    document.getElementById('pRating').value = '4.5';
    document.getElementById('pReviews').value = '24';
  }

  updatePricePreview();
  document.getElementById('productModalBackdrop').classList.add('active');
  setTimeout(() => document.getElementById('pName').focus(), 200);
}

function closeProductModal(e) {
  if (e && e.target !== document.getElementById('productModalBackdrop')) return;
  document.getElementById('productModalBackdrop').classList.remove('active');
}

// ============ LIVE PRICE PREVIEW ============
function updatePricePreview() {
  const price = document.getElementById('pPrice').value;
  const oldPrice = document.getElementById('pOldPrice').value;
  const tag = document.getElementById('pTag').value;

  const previewNew = document.getElementById('previewNewPrice');
  const previewOld = document.getElementById('previewOldPrice');
  const previewBadge = document.getElementById('previewBadge');

  previewNew.textContent = price ? `₹${parseInt(price).toLocaleString('en-IN')}` : '₹—';

  if (oldPrice && parseInt(oldPrice) > parseInt(price || 0)) {
    previewOld.textContent = `₹${parseInt(oldPrice).toLocaleString('en-IN')}`;
    const disc = Math.round((1 - parseInt(price) / parseInt(oldPrice)) * 100);
    previewOld.textContent += `  (${disc}% off)`;
  } else {
    previewOld.textContent = '';
  }

  if (tag) {
    const labels = { new: '✨ New', popular: '⭐ Popular', sale: '🏷️ Sale' };
    const colors = { new: '#4ade80', popular: '#e2c97e', sale: '#f87171' };
    const bgs = { new: 'rgba(34,197,94,0.15)', popular: 'rgba(201,168,76,0.15)', sale: 'rgba(239,68,68,0.15)' };
    previewBadge.textContent = labels[tag] || '';
    previewBadge.style.color = colors[tag] || '';
    previewBadge.style.background = bgs[tag] || '';
    previewBadge.style.border = `1px solid ${colors[tag]}44`;
  } else {
    previewBadge.textContent = '';
    previewBadge.style.cssText = '';
  }
}

// ============ SAVE PRODUCT ============
function saveProduct(e) {
  e.preventDefault();

  const editId = document.getElementById('editProductId').value;
  const name = document.getElementById('pName').value.trim();
  const category = document.getElementById('pCategory').value;
  const price = parseInt(document.getElementById('pPrice').value);
  const oldPriceRaw = document.getElementById('pOldPrice').value;
  const oldPrice = oldPriceRaw ? parseInt(oldPriceRaw) : null;
  const tag = document.getElementById('pTag').value || null;
  const existingImage = document.getElementById('pExistingImage').value;
  const image = currentUploadedImageBase64 || existingImage || 'necklaces_collection.png';
  const rating = parseFloat(document.getElementById('pRating').value) || 4.5;
  const reviews = parseInt(document.getElementById('pReviews').value) || 24;

  // Validation
  if (!name || !category || !price) {
    showAdminToast('❌ Please fill all required fields.', true);
    return;
  }
  if (oldPrice && oldPrice <= price) {
    showAdminToast('⚠️ Original price must be higher than sale price.', true);
    return;
  }

  if (editId) {
    // Update existing
    const idx = products.findIndex(p => p.id === parseInt(editId));
    if (idx !== -1) {
      products[idx] = { ...products[idx], name, category, price, oldPrice, tag, image, rating, reviews };
      showAdminToast('✅ Product updated successfully!');
    }
  } else {
    // Add new
    const newProduct = { id: getNextId(), name, category, price, oldPrice, tag, image, rating, reviews };
    products.push(newProduct);
    showAdminToast('✅ Product added successfully!');
  }

  saveProducts();
  renderTable();
  document.getElementById('productModalBackdrop').classList.remove('active');
}

// ============ DELETE PRODUCT ============
function deleteProduct(id) {
  const p = products.find(prod => prod.id === id);
  if (!p) return;

  if (!confirm(`Delete "${p.name}"? This cannot be undone.`)) return;

  products = products.filter(prod => prod.id !== id);
  saveProducts();
  renderTable();
  showAdminToast(`🗑 "${p.name}" deleted.`);
}

// ============ TOAST ============
function showAdminToast(msg, isError = false) {
  const toast = document.getElementById('adminToast');
  toast.textContent = msg;
  toast.className = 'admin-toast' + (isError ? ' error' : '');
  toast.classList.add('active');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('active'), 3200);
}

// ============ KEYBOARD SHORTCUTS ============
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.getElementById('productModalBackdrop').classList.remove('active');
  }
});
