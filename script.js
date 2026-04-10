/* ============================================
   CHHAPARWAL BANDHU – JAVASCRIPT
   ============================================ */

// ============= PRODUCT DATA =============
// Default products (fallback if no admin data saved)
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

// Load products from admin localStorage, or fall back to defaults
let products = DEFAULT_PRODUCTS;
try {
  const stored = localStorage.getItem('cb_products');
  if (stored) products = JSON.parse(stored);
} catch(e) { products = DEFAULT_PRODUCTS; }

// ============= CART STATE =============
let cart = JSON.parse(localStorage.getItem('cb_cart') || '[]');
let wishlist = JSON.parse(localStorage.getItem('cb_wishlist') || '[]');
let currentFilter = 'all';
let carouselIndex = 0;

// ============= INIT =============
document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initNavbar();
  initHamburger();
  renderProducts('all');
  initCarousel();
  animateCounters();
  initBackToTop();
  updateCartUI();
});

// ============= PARTICLES =============
function initParticles() {
  const container = document.getElementById('heroParticles');
  if (!container) return;

  for (let i = 0; i < 30; i++) {
    const p = document.createElement('div');
    p.classList.add('particle');
    const size = Math.random() * 5 + 2;
    const left = Math.random() * 100;
    const delay = Math.random() * 12;
    const duration = Math.random() * 9 + 8;
    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${left}%;
      animation-delay: ${delay}s;
      animation-duration: ${duration}s;
    `;
    container.appendChild(p);
  }
}

// ============= NAVBAR =============
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Sticky/scrolled class
    if (scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active link highlight
    sections.forEach(section => {
      const top = section.offsetTop - 100;
      const bottom = top + section.offsetHeight;
      if (scrollY >= top && scrollY < bottom) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + section.id) {
            link.classList.add('active');
          }
        });
      }
    });
  });

  // Smooth close menu on link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      const linksMenu = document.getElementById('navLinks');
      linksMenu.classList.remove('open');
      document.getElementById('hamburger').classList.remove('active');
    });
  });

  // Cart button
  document.getElementById('navCartBtn').addEventListener('click', openCart);

  // Search button
  document.getElementById('navSearchBtn').addEventListener('click', openSearch);

  // Keyboard shortcut: Ctrl+K or Cmd+K opens search
  document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      openSearch();
    }
  });
}

// ============= HAMBURGER =============
function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const linksMenu = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    linksMenu.classList.toggle('open');
  });
}

// ============= PRODUCTS RENDER =============
function renderProducts(filter) {
  const grid = document.getElementById('productsGrid');
  const filtered = filter === 'all'
    ? products
    : products.filter(p => p.category === filter);

  // Animate out
  grid.style.opacity = '0';
  grid.style.transform = 'translateY(12px)';

  setTimeout(() => {
    grid.innerHTML = filtered.map(p => createProductCard(p)).join('');
    grid.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
    grid.style.opacity = '1';
    grid.style.transform = 'translateY(0)';
  }, 200);
}

function createProductCard(p) {
  const inWishlist = wishlist.includes(p.id);
  const starHtml = Array.from({ length: 5 }, (_, i) =>
    `<span style="color:${i < Math.floor(p.rating) ? '#c9a84c' : 'rgba(255,255,255,0.2)'}">★</span>`
  ).join('');

  const tagHtml = p.tag
    ? `<span class="product-tag-label ${p.tag}">${p.tag.charAt(0).toUpperCase() + p.tag.slice(1)}</span>`
    : '';

  return `
    <div class="product-card" id="product-${p.id}">
      <div class="product-img-wrap">
        <img src="${p.image}" alt="${p.name}" class="product-img" loading="lazy" />
        ${tagHtml}
        <button
          class="product-wishlist ${inWishlist ? 'active' : ''}"
          id="wishlist-${p.id}"
          onclick="toggleWishlist(${p.id})"
          aria-label="Add to wishlist"
        >${inWishlist ? '♥' : '♡'}</button>
      </div>
      <div class="product-info">
        <div class="product-category">${getCategoryLabel(p.category)}</div>
        <h3 class="product-name">${p.name}</h3>
        <div class="product-rating">
          <span class="stars-small">${starHtml}</span>
          <span class="rating-count">(${p.reviews})</span>
        </div>
        <div class="product-footer">
          <div class="product-price-block">
            <span class="product-price">₹${p.price.toLocaleString('en-IN')}</span>
            ${p.oldPrice ? `<span class="product-price-old">₹${p.oldPrice.toLocaleString('en-IN')}</span>` : ''}
          </div>
          <button
            class="product-add-btn"
            id="addcart-${p.id}"
            onclick="addToCart(${p.id})"
          >Add to Cart</button>
        </div>
      </div>
    </div>
  `;
}

function getCategoryLabel(cat) {
  const map = {
    necklaces: 'Necklaces',
    earrings: 'Earrings',
    bangles: 'Bangles & Bracelets',
    rings: 'Rings',
    bridal: 'Bridal Sets'
  };
  return map[cat] || cat;
}

// ============= FILTER =============
function filterProducts(filter) {
  currentFilter = filter;

  // Update active button
  document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
  const activeBtn = document.getElementById('filter-' + filter);
  if (activeBtn) activeBtn.classList.add('active');

  renderProducts(filter);
}

// ============= WISHLIST =============
function toggleWishlist(id) {
  const idx = wishlist.indexOf(id);
  if (idx === -1) {
    wishlist.push(id);
    showToast('♥ Added to wishlist!');
  } else {
    wishlist.splice(idx, 1);
    showToast('♡ Removed from wishlist');
  }
  localStorage.setItem('cb_wishlist', JSON.stringify(wishlist));

  // Update button
  const btn = document.getElementById('wishlist-' + id);
  if (btn) {
    btn.classList.toggle('active', wishlist.includes(id));
    btn.textContent = wishlist.includes(id) ? '♥' : '♡';
  }
}

// ============= CART =============
function addToCart(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;

  const existing = cart.find(c => c.id === id);
  if (existing) {
    existing.qty = (existing.qty || 1) + 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  localStorage.setItem('cb_cart', JSON.stringify(cart));
  updateCartUI();
  showToast(`🛍️ ${product.name} added to cart!`);

  // Animate button
  const btn = document.getElementById('addcart-' + id);
  if (btn) {
    btn.textContent = '✓ Added!';
    btn.style.background = '#22c55e';
    setTimeout(() => {
      btn.textContent = 'Add to Cart';
      btn.style.background = '';
    }, 1500);
  }
}

function updateCartUI() {
  const totalItems = cart.reduce((sum, c) => sum + (c.qty || 1), 0);
  document.getElementById('cartCount').textContent = totalItems;

  renderCartItems();
}

function renderCartItems() {
  const cartItemsEl = document.getElementById('cartItems');
  const cartFooterEl = document.getElementById('cartFooter');

  if (cart.length === 0) {
    cartItemsEl.innerHTML = `
      <div class="cart-empty">
        <div class="cart-empty-icon">🛍️</div>
        <p>Your cart is empty</p>
        <a href="#collections" onclick="closeCart()" class="btn btn-primary btn-sm">Start Shopping</a>
      </div>`;
    cartFooterEl.style.display = 'none';
    return;
  }

  const totalItems = cart.reduce((s, c) => s + (c.qty || 1), 0);
  const totalPrice = cart.reduce((sum, c) => sum + c.price * (c.qty || 1), 0);
  const savings = cart.reduce((s, c) => s + ((c.oldPrice || c.price) - c.price) * (c.qty || 1), 0);

  cartItemsEl.innerHTML = cart.map(c => `
    <div class="cart-item" id="cart-item-${c.id}">
      <img src="${c.image}" alt="${c.name}" class="cart-item-img" />
      <div class="cart-item-info">
        <div class="cart-item-name">${c.name}</div>
        <div class="cart-item-price">₹${c.price.toLocaleString('en-IN')} <span class="cart-item-unit">each</span></div>
        <div class="cart-qty-controls">
          <button class="cart-qty-btn" onclick="decreaseQty(${c.id})" aria-label="Decrease">−</button>
          <span class="cart-qty-val">${c.qty || 1}</span>
          <button class="cart-qty-btn" onclick="increaseQty(${c.id})" aria-label="Increase">+</button>
        </div>
      </div>
      <div class="cart-item-right">
        <div class="cart-item-subtotal">₹${(c.price * (c.qty || 1)).toLocaleString('en-IN')}</div>
        <button class="cart-item-remove" onclick="removeFromCart(${c.id})" aria-label="Remove item">🗑</button>
      </div>
    </div>
  `).join('');

  const savingsHtml = savings > 0
    ? `<div class="cart-savings">🎉 You save ₹${savings.toLocaleString('en-IN')}!</div>`
    : '';

  document.getElementById('cartTotal').innerHTML = `
    <div class="cart-total-row">
      <span>Subtotal (${totalItems} item${totalItems !== 1 ? 's' : ''})</span>
      <span class="cart-total-price">₹${totalPrice.toLocaleString('en-IN')}</span>
    </div>
    ${savingsHtml}
  `;
  cartFooterEl.style.display = 'block';
}

function increaseQty(id) {
  const item = cart.find(c => c.id === id);
  if (item) { item.qty = (item.qty || 1) + 1; }
  localStorage.setItem('cb_cart', JSON.stringify(cart));
  updateCartUI();
}

function decreaseQty(id) {
  const item = cart.find(c => c.id === id);
  if (!item) return;
  if ((item.qty || 1) <= 1) {
    removeFromCart(id);
  } else {
    item.qty -= 1;
    localStorage.setItem('cb_cart', JSON.stringify(cart));
    updateCartUI();
  }
}

function removeFromCart(id) {
  cart = cart.filter(c => c.id !== id);
  localStorage.setItem('cb_cart', JSON.stringify(cart));
  updateCartUI();
}

function openCart() {
  document.getElementById('cartSidebar').classList.add('active');
  document.getElementById('cartOverlay').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  document.getElementById('cartSidebar').classList.remove('active');
  document.getElementById('cartOverlay').classList.remove('active');
  document.body.style.overflow = '';
}

function checkout() {
  if (cart.length === 0) return;

  const phone = '919352570105'; // WhatsApp number (no + or spaces)
  const lines = cart.map(c =>
    `• ${c.name} (Qty: ${c.qty || 1}) — ₹${(c.price * (c.qty || 1)).toLocaleString('en-IN')}`
  );
  const total = cart.reduce((s, c) => s + c.price * (c.qty || 1), 0);
  const savings = cart.reduce((s, c) => s + ((c.oldPrice || c.price) - c.price) * (c.qty || 1), 0);

  let msg = `🛍️ *New Order – Chhaparwal Bandhu*\n\n`;
  msg += lines.join('\n');
  msg += `\n\n💰 *Total: ₹${total.toLocaleString('en-IN')}*`;
  if (savings > 0) msg += `\n🎉 *Savings: ₹${savings.toLocaleString('en-IN')}*`;
  msg += `\n\nPlease confirm my order and let me know the delivery details. Thank you!`;

  const url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
  showToast('📱 Opening WhatsApp to complete your order!');
}

// ============= MODAL =============
const modalData = {
  necklaces: {
    title: "Necklaces Collection",
    image: "necklaces_collection.png",
    desc: "Discover our stunning range of artificial necklaces — from traditional kundan and polki sets to modern layered chains and chokers. Perfect for every occasion, from daily wear to grand celebrations.",
    priceRange: "₹299 – ₹2,499"
  },
  earrings: {
    title: "Earrings Collection",
    image: "earrings_collection.png",
    desc: "From classic jhumkas and elegant chandbalis to modern drop earrings and studs — our earrings collection has something for every style and occasion.",
    priceRange: "₹149 – ₹999"
  },
  bangles: {
    title: "Bangles & Bracelets",
    image: "bangles_collection.png",
    desc: "A vibrant collection of colorful glass bangles, gold-toned bracelets, and ornate kadas. Stack them up or wear them solo — each set is a celebration of color and tradition.",
    priceRange: "₹199 – ₹1,299"
  },
  rings: {
    title: "Rings Collection",
    image: "rings_collection.png",
    desc: "Exquisite artificial rings for every finger — from elegant kundan rings to bold cocktail pieces with colorful stones. Adjustable designs for a perfect fit.",
    priceRange: "₹99 – ₹599"
  },
  bridal: {
    title: "Bridal Sets",
    image: "bridal_sets.png",
    desc: "Complete bridal jewellery sets crafted to make your special day truly unforgettable. Includes matching necklace, earrings, maang tikka, nose ring, bangles, and rings — all in stunning coordinated designs.",
    priceRange: "₹999 – ₹5,999"
  }
};

function openModal(type) {
  const data = modalData[type];
  if (!data) return;

  // Get products in this category
  const catProducts = products.filter(p => p.category === type);

  const productsHtml = catProducts.length > 0 ? `
    <div class="modal-products-grid">
      ${catProducts.map(p => {
        const inCart = cart.find(c => c.id === p.id);
        const inWishlist = wishlist.includes(p.id);
        return `
          <div class="modal-product-card" id="modal-prod-${p.id}">
            <div class="modal-prod-img-wrap">
              <img src="${p.image}" alt="${p.name}" class="modal-prod-img" loading="lazy" />
              ${p.tag ? `<span class="product-tag-label ${p.tag}">${p.tag.charAt(0).toUpperCase()+p.tag.slice(1)}</span>` : ''}
            </div>
            <div class="modal-prod-info">
              <div class="modal-prod-name">${p.name}</div>
              <div class="modal-prod-pricing">
                <span class="modal-prod-price">₹${p.price.toLocaleString('en-IN')}</span>
                ${p.oldPrice ? `<span class="modal-prod-old">₹${p.oldPrice.toLocaleString('en-IN')}</span>` : ''}
              </div>
              <div class="modal-prod-actions">
                <button
                  class="modal-add-btn ${inCart ? 'in-cart' : ''}"
                  id="modal-add-${p.id}"
                  onclick="modalAddToCart(${p.id})"
                >🛍️ ${inCart ? `In Cart (${inCart.qty || 1})` : 'Add to Cart'}</button>
                <button
                  class="modal-wish-btn ${inWishlist ? 'active' : ''}"
                  onclick="toggleWishlist(${p.id}); refreshModalButton(${p.id})"
                  aria-label="Wishlist"
                >${inWishlist ? '♥' : '♡'}</button>
              </div>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  ` : `<p style="color:rgba(255,255,255,0.45);text-align:center;padding:24px 0">No products found in this category yet.</p>`;

  const modalContent = document.getElementById('modalContent');
  modalContent.innerHTML = `
    <img src="${data.image}" alt="${data.title}" class="modal-img" />
    <h2 class="modal-title">${data.title}</h2>
    <p class="modal-desc">${data.desc}</p>
    <div class="modal-price-range">
      <span class="modal-price-label">Price Range:</span>
      <span class="modal-price-value">${data.priceRange}</span>
    </div>
    <div class="modal-products-header">
      <span>Products in this collection</span>
      <span class="modal-products-count">${catProducts.length} items</span>
    </div>
    ${productsHtml}
    <a href="#contact" onclick="closeModal()" class="btn btn-primary modal-action-btn" style="width:100%;justify-content:center;margin-top:16px">📩 Enquire / Custom Order</a>
  `;

  document.getElementById('modalOverlay').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function modalAddToCart(id) {
  addToCart(id);
  // Refresh the button inside modal
  refreshModalButton(id);
}

function refreshModalButton(id) {
  const btn = document.getElementById(`modal-add-${id}`);
  const wishBtn = document.querySelector(`#modal-prod-${id} .modal-wish-btn`);
  if (btn) {
    const inCart = cart.find(c => c.id === id);
    btn.textContent = inCart ? `🛍️ In Cart (${inCart.qty || 1})` : '🛍️ Add to Cart';
    btn.classList.toggle('in-cart', !!inCart);
  }
  if (wishBtn) {
    const inWl = wishlist.includes(id);
    wishBtn.textContent = inWl ? '♥' : '♡';
    wishBtn.classList.toggle('active', inWl);
  }
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('active');
  document.body.style.overflow = '';
}

// Close modal on escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeModal();
    closeCart();
  }
});

// ============= TESTIMONIALS CAROUSEL =============
function initCarousel() {
  const track = document.getElementById('testimonialsTrack');
  const dotsContainer = document.getElementById('carouselDots');
  if (!track) return;

  const cards = track.querySelectorAll('.testimonial-card');
  const visibleCount = getVisibleCount();
  const total = Math.ceil(cards.length / visibleCount);

  carouselIndex = 0;

  // Create dots
  dotsContainer.innerHTML = '';
  for (let i = 0; i < total; i++) {
    const dot = document.createElement('button');
    dot.classList.add('carousel-dot');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(i));
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    dotsContainer.appendChild(dot);
  }

  document.getElementById('carouselPrev').addEventListener('click', () => {
    const newIndex = (carouselIndex - 1 + total) % total;
    goToSlide(newIndex);
  });

  document.getElementById('carouselNext').addEventListener('click', () => {
    const newIndex = (carouselIndex + 1) % total;
    goToSlide(newIndex);
  });

  // Auto-play
  setInterval(() => {
    const t = Math.ceil(cards.length / getVisibleCount());
    goToSlide((carouselIndex + 1) % t);
  }, 5000);
}

function getVisibleCount() {
  if (window.innerWidth <= 768) return 1;
  if (window.innerWidth <= 1024) return 2;
  return 3;
}

function goToSlide(index) {
  carouselIndex = index;
  const track = document.getElementById('testimonialsTrack');
  const cards = track.querySelectorAll('.testimonial-card');
  const visibleCount = getVisibleCount();
  const cardWidth = track.parentElement.offsetWidth / visibleCount;
  const gap = 24;

  track.style.transform = `translateX(-${index * visibleCount * (cardWidth + gap)}px)`;

  document.querySelectorAll('.carousel-dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === index);
  });
}

// ============= COUNTER ANIMATION =============
function animateCounters() {
  const counters = document.querySelectorAll('.stat-number[data-count]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-count'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
          current = Math.min(current + step, target);
          el.textContent = Math.floor(current).toLocaleString('en-IN');
          if (current >= target) clearInterval(timer);
        }, 16);

        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

// ============= BACK TO TOP =============
function initBackToTop() {
  const btn = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  });
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============= CONTACT FORM =============
function submitForm(e) {
  e.preventDefault();
  const form = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');

  // Animate form submission
  const btn = document.getElementById('formSubmitBtn');
  btn.textContent = 'Sending...';
  btn.disabled = true;

  setTimeout(() => {
    form.style.display = 'none';
    success.style.display = 'block';
    showToast('✅ Enquiry sent successfully!');
  }, 1200);
}

// ============= TOAST =============
let toastTimer = null;

function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('active');

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('active');
  }, 3000);
}

// ============= INTERSECTION ANIMATIONS =============
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

// Observe cards for fade-in
window.addEventListener('load', () => {
  document.querySelectorAll('.why-card, .collection-card, .contact-info-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    fadeObserver.observe(el);
  });
});

// Close modal/cart/search on escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeModal();
    closeCart();
    closeSearch();
  }
});

// ============= SEARCH =============
function openSearch() {
  const overlay = document.getElementById('searchOverlay');
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';

  // Reset to default suggestions state
  resetSearchUI();

  // Focus input after animation
  setTimeout(() => {
    const input = document.getElementById('searchInput');
    if (input) input.focus();
  }, 200);
}

function closeSearch(e) {
  // If called from overlay click, only close if clicking the backdrop (not the panel)
  if (e && e.target !== document.getElementById('searchOverlay')) return;

  const overlay = document.getElementById('searchOverlay');
  overlay.classList.remove('active');
  document.body.style.overflow = '';
  clearSearch();
}

function resetSearchUI() {
  document.getElementById('searchInput').value = '';
  document.getElementById('searchSuggestions').style.display = 'block';
  document.getElementById('searchResults').style.display = 'none';
  document.getElementById('searchNoResults').style.display = 'none';
  document.getElementById('searchClearBtn').classList.remove('visible');
}

function clearSearch() {
  const input = document.getElementById('searchInput');
  if (input) input.value = '';
  resetSearchUI();
  if (document.getElementById('searchInput')) {
    document.getElementById('searchInput').focus();
  }
}

function quickSearch(term) {
  const input = document.getElementById('searchInput');
  input.value = term;
  handleSearch(term);
}

function handleSearch(query) {
  const q = query.trim().toLowerCase();

  const clearBtn = document.getElementById('searchClearBtn');
  clearBtn.classList.toggle('visible', q.length > 0);

  if (!q) {
    resetSearchUI();
    return;
  }

  // Search across name and category
  const results = products.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q) ||
    getCategoryLabel(p.category).toLowerCase().includes(q)
  );

  // Hide suggestions
  document.getElementById('searchSuggestions').style.display = 'none';

  if (results.length === 0) {
    document.getElementById('searchResults').style.display = 'none';
    document.getElementById('searchNoResults').style.display = 'block';
    return;
  }

  document.getElementById('searchNoResults').style.display = 'none';
  document.getElementById('searchResults').style.display = 'block';

  const count = document.getElementById('searchResultsCount');
  count.innerHTML = `Showing <strong>${results.length}</strong> result${results.length !== 1 ? 's' : ''} for "<strong>${escapeHtml(query.trim())}</strong>"`;

  const grid = document.getElementById('searchResultsGrid');
  grid.innerHTML = results.map(p => createSearchResultCard(p, query.trim())).join('');
}

function createSearchResultCard(p, query) {
  const inWishlist = wishlist.includes(p.id);
  const highlightedName = highlightMatch(p.name, query);

  return `
    <div class="product-card" style="animation: productFadeIn 0.3s ease">
      <div class="product-img-wrap">
        <img src="${p.image}" alt="${p.name}" class="product-img" loading="lazy" />
        <button
          class="product-wishlist ${inWishlist ? 'active' : ''}"
          onclick="toggleWishlist(${p.id})"
          aria-label="Add to wishlist"
        >${inWishlist ? '♥' : '♡'}</button>
      </div>
      <div class="product-info">
        <div class="product-category">${getCategoryLabel(p.category)}</div>
        <h3 class="product-name" title="${p.name}">${highlightedName}</h3>
        <div class="product-footer" style="margin-top:10px">
          <div class="product-price-block">
            <span class="product-price">₹${p.price.toLocaleString('en-IN')}</span>
            ${p.oldPrice ? `<span class="product-price-old">₹${p.oldPrice.toLocaleString('en-IN')}</span>` : ''}
          </div>
          <button class="product-add-btn" onclick="addToCart(${p.id}); showToast('🛍️ Added to cart!')">Add</button>
        </div>
      </div>
    </div>
  `;
}

function highlightMatch(text, query) {
  if (!query) return escapeHtml(text);
  const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
  return escapeHtml(text).replace(regex, '<span class="search-highlight">$1</span>');
}

function escapeHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ============= POLICY MODALS =============
const POLICY_DATA = {
  privacy: {
    icon: '🔒',
    title: 'Privacy Policy',
    lastUpdated: 'April 2026',
    sections: [
      {
        heading: 'Information We Collect',
        content: `When you interact with Chhaparwal Bandhu (via our website, WhatsApp, or in-store), we may collect:
        <ul>
          <li><strong>Personal Details:</strong> Name, phone number, and email address provided through our contact form or order enquiries.</li>
          <li><strong>Order Information:</strong> Details of products you enquire about or purchase, including quantities and prices.</li>
          <li><strong>Usage Data:</strong> Pages visited, time spent on our website, and browser/device type (collected anonymously via standard web analytics).</li>
          <li><strong>Wishlist & Cart Data:</strong> Stored locally in your browser (localStorage) — never sent to our servers.</li>
        </ul>`
      },
      {
        heading: 'How We Use Your Information',
        content: `Your information is used exclusively to:
        <ul>
          <li>Respond to your enquiries and process your orders via WhatsApp.</li>
          <li>Provide personalised recommendations and offers.</li>
          <li>Improve our products and customer experience.</li>
          <li>Send occasional updates about new collections (only if you opt in).</li>
        </ul>`
      },
      {
        heading: 'Data Sharing & Security',
        content: `<ul>
          <li>We <strong>never sell or rent</strong> your personal data to third parties.</li>
          <li>Your data is shared only with trusted delivery partners when processing orders.</li>
          <li>All communication is handled through secure, encrypted channels.</li>
          <li>Your cart and wishlist data remains entirely on your device (localStorage) and is never transmitted to us.</li>
        </ul>`
      },
      {
        heading: 'Cookies',
        content: `Our website uses minimal, essential cookies only to improve your browsing experience. We do not use advertising or tracking cookies. You may disable cookies in your browser settings without affecting core site functionality.`
      },
      {
        heading: 'Your Rights',
        content: `You have the right to:
        <ul>
          <li>Request access to the personal data we hold about you.</li>
          <li>Ask us to correct or delete your personal information.</li>
          <li>Opt out of any marketing communications at any time.</li>
        </ul>
        To exercise any of these rights, contact us at <strong>info@chhaparwalbandhu.com</strong> or call <strong>+91 93525 70105</strong>.`
      },
      {
        heading: 'Contact',
        content: `For privacy-related queries, reach us at:<br><strong>Chhaparwal Bandhu</strong>, Mandir Marg, Nathdwara, Rajasthan.<br>📧 info@chhaparwalbandhu.com &nbsp;|&nbsp; 📞 +91 93525 70105`
      }
    ]
  },

  return: {
    icon: '🔄',
    title: 'Return & Exchange Policy',
    lastUpdated: 'April 2026',
    sections: [
      {
        heading: '7-Day Return Window',
        content: `We want you to love every piece from Chhaparwal Bandhu. If you're not completely satisfied, you may return or exchange eligible items within <strong>7 days</strong> of receiving your order.`
      },
      {
        heading: 'Eligibility for Returns',
        content: `Items are eligible for return if:
        <ul>
          <li>The item is <strong>unused, unworn</strong>, and in its original condition.</li>
          <li>All original packaging, tags, and accessories are intact.</li>
          <li>The return request is initiated within 7 days of delivery.</li>
          <li>The item is <strong>not from our sale/clearance category</strong>.</li>
        </ul>`
      },
      {
        heading: 'Non-Returnable Items',
        content: `The following are <strong>not eligible</strong> for return:
        <ul>
          <li>🚫 Custom or personalised orders.</li>
          <li>🚫 Items purchased during special sale events.</li>
          <li>🚫 Earrings (for hygiene reasons, unless defective).</li>
          <li>🚫 Items that show signs of wear, damage, or alteration.</li>
        </ul>`
      },
      {
        heading: 'Exchange Process',
        content: `We're happy to exchange items for a different size, colour, or design:
        <ol>
          <li>WhatsApp us at <strong>+91 93525 70105</strong> with your order details and reason for exchange.</li>
          <li>We'll confirm eligibility and provide return instructions.</li>
          <li>Ship the item back to our store at <em>Mandir Marg, Nathdwara, Rajasthan</em>.</li>
          <li>Once received and inspected, your replacement will be dispatched within <strong>3–5 working days</strong>.</li>
        </ol>`
      },
      {
        heading: 'Defective or Damaged Items',
        content: `If you receive a damaged or defective item, please contact us within <strong>48 hours</strong> of delivery with photos. We will arrange a free replacement or full refund at no additional cost to you.`
      },
      {
        heading: 'Refund Processing',
        content: `Refunds are processed within <strong>5–7 business days</strong> after we receive and inspect the returned item. Refunds are issued via the original payment method (or bank transfer for WhatsApp/COD orders).`
      }
    ]
  },

  shipping: {
    icon: '🚚',
    title: 'Shipping Policy',
    lastUpdated: 'April 2026',
    sections: [
      {
        heading: 'Delivery Areas',
        content: `We currently deliver across <strong>all major cities and towns in India</strong>. For remote or PIN code–specific availability, please contact us before placing your order.`
      },
      {
        heading: 'Processing Time',
        content: `<ul>
          <li><strong>Standard & In-Stock Items:</strong> Orders are processed and dispatched within <strong>1–2 business days</strong> of confirmation.</li>
          <li><strong>Custom & Bridal Orders:</strong> Please allow <strong>5–10 business days</strong> for preparation, depending on complexity.</li>
          <li>We do not process orders on Sundays and public holidays.</li>
        </ul>`
      },
      {
        heading: 'Delivery Timelines',
        content: `
        <table style="width:100%;border-collapse:collapse;margin-top:8px">
          <thead><tr style="background:rgba(201,168,76,0.15)">
            <th style="padding:10px;text-align:left;border-bottom:1px solid rgba(201,168,76,0.2)">Location</th>
            <th style="padding:10px;text-align:left;border-bottom:1px solid rgba(201,168,76,0.2)">Estimated Delivery</th>
          </tr></thead>
          <tbody>
            <tr><td style="padding:10px;border-bottom:1px solid rgba(255,255,255,0.06)">Metro Cities (Delhi, Mumbai, etc.)</td><td style="padding:10px;border-bottom:1px solid rgba(255,255,255,0.06)">3–5 Business Days</td></tr>
            <tr><td style="padding:10px;border-bottom:1px solid rgba(255,255,255,0.06)">Tier 2 & 3 Cities</td><td style="padding:10px;border-bottom:1px solid rgba(255,255,255,0.06)">5–7 Business Days</td></tr>
            <tr><td style="padding:10px;border-bottom:1px solid rgba(255,255,255,0.06)">Remote / Rural Areas</td><td style="padding:10px;border-bottom:1px solid rgba(255,255,255,0.06)">7–12 Business Days</td></tr>
            <tr><td style="padding:10px">Rajasthan (Local)</td><td style="padding:10px">1–3 Business Days</td></tr>
          </tbody>
        </table>`
      },
      {
        heading: 'Shipping Charges',
        content: `<ul>
          <li><strong>Free Shipping</strong> on all orders above <strong>₹999</strong>.</li>
          <li>Orders below ₹999: Flat shipping charge of <strong>₹60</strong>.</li>
          <li>Bridal & custom orders: Shipping charges will be communicated at the time of order confirmation.</li>
        </ul>`
      },
      {
        heading: 'Order Tracking',
        content: `Once your order is dispatched, we will share the <strong>tracking number and courier details via WhatsApp</strong>. You can track your shipment directly on the courier partner's website.`
      },
      {
        heading: 'Damaged in Transit',
        content: `If your parcel arrives damaged, photograph the packaging and item immediately, and <strong>contact us within 24 hours</strong> via WhatsApp (+91 93525 70105). We will arrange a free replacement at the earliest.`
      }
    ]
  },

  terms: {
    icon: '📜',
    title: 'Terms of Service',
    lastUpdated: 'April 2026',
    sections: [
      {
        heading: 'Acceptance of Terms',
        content: `By accessing or using the Chhaparwal Bandhu website and services, you agree to be bound by these Terms of Service. If you do not agree, please do not use our services.`
      },
      {
        heading: 'Products & Pricing',
        content: `<ul>
          <li>All products are <strong>artificial / imitation jewellery</strong>. We do not sell real gold, silver, or gemstones.</li>
          <li>Prices are listed in <strong>Indian Rupees (₹)</strong> and are inclusive of applicable taxes.</li>
          <li>We reserve the right to change prices, availability, or product details at any time without prior notice.</li>
          <li>Product images are for representational purposes. Slight colour variations may occur due to photography and screen settings.</li>
        </ul>`
      },
      {
        heading: 'Orders & Payment',
        content: `<ul>
          <li>Orders are placed via <strong>WhatsApp</strong> after cart confirmation. Payment methods (UPI, bank transfer, etc.) are confirmed during checkout.</li>
          <li>An order is confirmed only after payment is received and acknowledged by our team.</li>
          <li>We reserve the right to cancel any order due to stock unavailability or pricing errors, with a full refund issued.</li>
        </ul>`
      },
      {
        heading: 'Intellectual Property',
        content: `All content on this website — including images, text, logos, product descriptions, and design — is the exclusive property of <strong>Chhaparwal Bandhu</strong>. Reproduction, distribution, or commercial use of any content without prior written permission is strictly prohibited.`
      },
      {
        heading: 'Limitation of Liability',
        content: `Chhaparwal Bandhu shall not be held liable for:
        <ul>
          <li>Indirect, incidental, or consequential damages arising from product use.</li>
          <li>Delays caused by courier partners or external factors (weather, strikes, etc.).</li>
          <li>Allergic reactions to jewellery materials — please review product materials before purchase if you have known sensitivities.</li>
        </ul>`
      },
      {
        heading: 'Governing Law',
        content: `These Terms are governed by the laws of <strong>India</strong> and the jurisdiction of the courts of <strong>Rajasthan</strong>. Any disputes shall be resolved amicably; failing which, they shall be subject to the courts of Rajsamand, Rajasthan.`
      },
      {
        heading: 'Contact Us',
        content: `For any questions about these Terms, reach us at:<br><strong>Chhaparwal Bandhu</strong>, Mandir Marg, Nathdwara, Rajasthan.<br>📧 info@chhaparwalbandhu.com &nbsp;|&nbsp; 📞 +91 93525 70105`
      }
    ]
  },

  faq: {
    icon: '❓',
    title: 'Frequently Asked Questions',
    lastUpdated: 'April 2026',
    sections: [
      {
        heading: 'Are your jewellery pieces skin-safe?',
        content: `Yes! All our jewellery is crafted from <strong>hypoallergenic, skin-safe materials</strong>. However, if you have extremely sensitive skin or specific metal allergies, we recommend checking the product material description or contacting us before purchase.`
      },
      {
        heading: 'How do I place an order?',
        content: `It's simple! Add items to your cart, then click <strong>"Order via WhatsApp"</strong>. Your full cart details will be sent to our team on WhatsApp, and we'll confirm availability, pricing, and delivery details directly with you.`
      },
      {
        heading: 'Do you accept custom or bulk orders?',
        content: `Absolutely! We specialise in <strong>custom bridal sets</strong> and welcome <strong>wholesale/bulk orders</strong> for events, resellers, and festive seasons. Contact us via the enquiry form or WhatsApp for a personalised quote.`
      },
      {
        heading: 'How long do artificial jewellery pieces last?',
        content: `With proper care, our jewellery can last <strong>1–3 years or longer</strong>. We recommend:
        <ul>
          <li>Storing in a dry, cool place (preferably in the box/pouch provided).</li>
          <li>Avoiding direct contact with water, perfumes, or sweat.</li>
          <li>Wiping gently with a soft, dry cloth after use.</li>
        </ul>`
      },
      {
        heading: 'What payment methods do you accept?',
        content: `We accept:
        <ul>
          <li>💳 UPI (PhonePe, GPay, Paytm, etc.)</li>
          <li>🏦 Bank Transfer / NEFT / IMPS</li>
          <li>📦 Cash on Delivery (COD) – available in select areas</li>
        </ul>
        Payment details are confirmed during WhatsApp order processing.`
      },
      {
        heading: 'Can I visit your store in person?',
        content: `Yes! We warmly welcome you to visit us at:<br><strong>Mandir Marg, Nathdwara, Rajasthan</strong><br>Our store is open Monday–Saturday, 10 AM – 8 PM. Call us ahead at <strong>+91 93525 70105</strong> for special bridal consultations.`
      },
      {
        heading: 'What if I receive a wrong or damaged item?',
        content: `We sincerely apologise if this happens. Please <strong>WhatsApp us within 48 hours</strong> with a photo of the item. We'll arrange a free replacement or refund immediately, no questions asked.`
      },
      {
        heading: 'Do you deliver outside India?',
        content: `Currently, we ship <strong>within India only</strong>. For international orders, please contact us directly via email at <strong>info@chhaparwalbandhu.com</strong> to discuss options.`
      }
    ]
  }
};

function openPolicy(type) {
  const data = POLICY_DATA[type];
  if (!data) return;

  document.getElementById('policyIcon').textContent = data.icon;
  document.getElementById('policyTitle').textContent = data.title;

  const sectionsHtml = data.sections.map(s => `
    <div class="policy-section">
      <h3 class="policy-section-heading">
        <span class="policy-section-dot"></span>${s.heading}
      </h3>
      <div class="policy-section-content">${s.content}</div>
    </div>
  `).join('');

  document.getElementById('policyBody').innerHTML = `
    <p class="policy-updated">Last updated: ${data.lastUpdated}</p>
    ${sectionsHtml}
    <div class="policy-footer-note">
      <span>📞</span>
      <span>Questions? Call us at <strong>+91 93525 70105</strong> or email <strong>info@chhaparwalbandhu.com</strong></span>
    </div>
  `;

  const overlay = document.getElementById('policyOverlay');
  overlay.classList.add('active');
  document.getElementById('policyModal').scrollTop = 0;
  document.body.style.overflow = 'hidden';
}

function closePolicyModal(e) {
  if (e && e.target !== document.getElementById('policyOverlay')) return;
  document.getElementById('policyOverlay').classList.remove('active');
  document.body.style.overflow = '';
}

// Also close on Escape (extend existing keydown listener)
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closePolicyModal();
  }
});
