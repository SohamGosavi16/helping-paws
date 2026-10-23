/* =====================================================
   Balaji Pet Hostel – Shared Navigation & Footer
   Injected by app.js into every page
   ===================================================== */

const HEADER_HTML = `
<header class="site-header" id="siteHeader">
  <!-- Top Announcement / CEP Notice Bar -->
  <div class="notice-bar" id="noticeBar">
    <div class="container">
      <div class="notice-inner">
        <div class="notice-left">
          <span class="notice-badge">🎓 CEP Demo</span>
          <span class="notice-text">Digital Pet Hostel Management System — Demonstration showcase with sample records</span>
        </div>
        <button class="notice-close" id="noticeClose" aria-label="Dismiss banner" onclick="dismissNotice(event)">✕</button>
      </div>
    </div>
  </div>

  <!-- Main Navbar -->
  <nav class="navbar" id="mainNavbar">
    <div class="container">
      <div class="navbar-inner">
        <!-- Brand / Logo -->
        <a href="index.html" class="nav-brand" aria-label="Balaji Pet Hostel Home">
          <div class="nav-logo">🐾</div>
          <div class="nav-name">
            <span class="brand-title">Balaji Pet Hostel</span>
            <small class="brand-tagline">Care & Hostel Management</small>
          </div>
        </a>

        <!-- Desktop Navigation Links -->
        <div class="nav-links" id="desktopNavLinks">
          <a href="index.html" class="nav-link">Home</a>
          <a href="index.html#services" class="nav-link">Services</a>

          <!-- Pets & Stays Dropdown -->
          <div class="nav-item-dropdown" id="petsDropdown">
            <button type="button" class="nav-link dropdown-toggle" id="petsDropdownBtn" aria-haspopup="true" aria-expanded="false" onclick="toggleDropdown(event)">
              <span>Pets & Stays</span>
              <svg class="dropdown-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="m6 9 6 6 6-6"/>
              </svg>
            </button>
            <div class="dropdown-menu" id="petsDropdownMenu">
              <a href="pets.html" class="dropdown-item">
                <div class="dropdown-icon orange">📝</div>
                <div class="dropdown-content">
                  <div class="dropdown-title">Pet Registration</div>
                  <div class="dropdown-desc">Register new pets for safe boarding</div>
                </div>
              </a>
              <a href="pets.html#records" class="dropdown-item">
                <div class="dropdown-icon green">📋</div>
                <div class="dropdown-content">
                  <div class="dropdown-title">Pet Records & Directory</div>
                  <div class="dropdown-desc">Search medical profiles & history</div>
                </div>
              </a>
              <a href="pets.html#stays" class="dropdown-item">
                <div class="dropdown-icon blue">🏠</div>
                <div class="dropdown-content">
                  <div class="dropdown-title">Stay Management</div>
                  <div class="dropdown-desc">Check-in, room assignments & checkout</div>
                </div>
              </a>
            </div>
          </div>

          <a href="volunteer.html" class="nav-link">Volunteer</a>
          <a href="consent.html" class="nav-link">Consent</a>
          <a href="feedback.html" class="nav-link">Feedback</a>
          <a href="index.html#contact" class="nav-link">Contact</a>
        </div>

        <!-- Right Action Buttons -->
        <div class="nav-actions">
          <a href="pets.html" class="nav-cta-btn">
            <span>🐾</span>
            <span>Book Stay</span>
          </a>
          <a href="admin.html" class="nav-admin-btn" id="adminBtn" title="Admin Portal">
            <span class="admin-icon">🔒</span>
            <span class="admin-label">Admin</span>
          </a>
          <button type="button" class="nav-hamburger" id="hamburger" aria-label="Toggle navigation menu" onclick="toggleMobileMenu()">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Drawer Menu -->
    <div class="mobile-menu" id="mobileMenu">
      <div class="mobile-menu-inner">
        <div class="mobile-menu-header">
          <div class="mobile-brand">
            <div class="nav-logo sm">🐾</div>
            <span>Balaji Pet Hostel</span>
          </div>
          <button type="button" class="mobile-close-btn" onclick="toggleMobileMenu()" aria-label="Close menu">✕</button>
        </div>

        <div class="mobile-quick-actions">
          <a href="pets.html" class="btn btn-sm btn-primary btn-block">🐾 Register Pet</a>
          <a href="admin.html" class="btn btn-sm btn-secondary btn-block">🔒 Admin Portal</a>
        </div>

        <div class="mobile-nav-group">
          <div class="mobile-group-title">Main Navigation</div>
          <a href="index.html" class="mobile-link"><span>🏠</span> Home</a>
          <a href="index.html#services" class="mobile-link"><span>✨</span> Services</a>
          <a href="volunteer.html" class="mobile-link"><span>🤝</span> Volunteer Program</a>
          <a href="consent.html" class="mobile-link"><span>📋</span> Consent & Agreement</a>
          <a href="feedback.html" class="mobile-link"><span>⭐</span> Feedback & Reviews</a>
          <a href="index.html#contact" class="mobile-link"><span>📞</span> Contact Us</a>
        </div>

        <div class="mobile-nav-group">
          <div class="mobile-group-title">Pet Management</div>
          <a href="pets.html" class="mobile-link sub"><span>📝</span> Pet Registration</a>
          <a href="pets.html#records" class="mobile-link sub"><span>📋</span> Pet Records Directory</a>
          <a href="pets.html#stays" class="mobile-link sub"><span>🏠</span> Stay Management</a>
        </div>
      </div>
    </div>
  </nav>
</header>
<div class="mobile-overlay" id="mobileOverlay" onclick="toggleMobileMenu()"></div>
`;

const FOOTER_HTML = `
<footer>
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:8px;">
          <div class="nav-logo" style="width:40px;height:40px;font-size:1.3rem;">🐾</div>
          <span style="font-weight:800;font-family:var(--font-head);font-size:1.1rem;">Balaji Pet Hostel</span>
        </div>
        <p>A digital platform for pet hostel management — improving care, communication, and record-keeping for pets and their owners.</p>
        <p style="font-size:.8rem;color:rgba(255,255,255,.4);font-style:italic;">Happy Pets, Better Care, Smarter Management.</p>
        <div class="footer-social" style="margin-top:16px;">
          <a href="#" aria-label="Facebook">📘</a>
          <a href="#" aria-label="Instagram">📸</a>
          <a href="#" aria-label="Twitter">🐦</a>
          <a href="#" aria-label="YouTube">▶️</a>
        </div>
        <div class="footer-note">🎓 College Community Engagement Project (CEP)</div>
      </div>
      <div>
        <h4>Quick Links</h4>
        <ul>
          <li><a href="index.html">Home</a></li>
          <li><a href="index.html#about">About Us</a></li>
          <li><a href="index.html#services">Our Services</a></li>
          <li><a href="index.html#how-it-works">How It Works</a></li>
          <li><a href="index.html#faq">FAQ</a></li>
        </ul>
      </div>
      <div>
        <h4>Modules</h4>
        <ul>
          <li><a href="pets.html">Pet Registration</a></li>
          <li><a href="pets.html#records">Pet Records & Directory</a></li>
          <li><a href="pets.html#stays">Stay Management</a></li>
          <li><a href="volunteer.html">Volunteer Registration</a></li>
          <li><a href="consent.html">Consent & Agreement</a></li>
          <li><a href="feedback.html">Feedback</a></li>
          <li><a href="admin.html">Admin Dashboard</a></li>
        </ul>
      </div>
      <div>
        <h4>Contact</h4>
        <ul>
          <li><a href="#">📍 [Your Address Here]</a></li>
          <li><a href="#">📞 [Your Phone Here]</a></li>
          <li><a href="#">✉️ [Your Email Here]</a></li>
          <li><a href="#">🕐 Mon–Sun: [Hours Here]</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© 2024 Balaji Pet Hostel. All rights reserved.</span>
      <span>Built for CEP – College IT Project Demo</span>
    </div>
  </div>
</footer>
`;

/* ── Inject nav & footer ─────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  // Inject site header (notice bar + navbar)
  const headerContainer = document.createElement('div');
  headerContainer.innerHTML = HEADER_HTML;
  while (headerContainer.firstChild) {
    document.body.prepend(headerContainer.lastChild);
  }

  // Inject footer
  const footerEl = document.createElement('div');
  footerEl.innerHTML = FOOTER_HTML;
  document.body.appendChild(footerEl.firstElementChild);

  // Check if notice was previously dismissed in this session
  if (sessionStorage.getItem('paws_notice_dismissed') === 'true') {
    const notice = document.getElementById('noticeBar');
    if (notice) notice.style.display = 'none';
  }

  // Highlight active nav link with hash support
  function updateActiveNav() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const currentHash = window.location.hash.toLowerCase();

    document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(a => {
      const href = a.getAttribute('href') || '';
      const [path, hash] = href.split('#');
      const isCurrentPage = (path === currentPage || (currentPage === '' && path === 'index.html'));
      let isActive = false;
      if (isCurrentPage) {
        if (hash) {
          isActive = ('#' + hash.toLowerCase() === currentHash);
        } else {
          isActive = (!currentHash || currentHash === '#register');
        }
      }
      a.classList.toggle('active', isActive);
    });

    // Parent dropdown highlight when on pet pages
    const isPetSection = (currentPage === 'pets.html');
    const petsDropdownBtn = document.getElementById('petsDropdownBtn');
    if (petsDropdownBtn) {
      petsDropdownBtn.classList.toggle('active', isPetSection);
    }
  }

  updateActiveNav();
  window.addEventListener('hashchange', updateActiveNav);

  // Auto-close dropdown on outside click
  document.addEventListener('click', (e) => {
    const dropdown = document.getElementById('petsDropdown');
    if (dropdown && !dropdown.contains(e.target)) {
      dropdown.classList.remove('open');
      dropdown.querySelector('.dropdown-toggle')?.setAttribute('aria-expanded', 'false');
    }
  });

  // Mobile links auto-close mobile drawer
  document.querySelectorAll('.mobile-menu a').forEach(link => {
    link.addEventListener('click', () => {
      toggleMobileMenu(true);
    });
  });

  // Add scroll elevation shadow to navbar
  window.addEventListener('scroll', () => {
    const navbar = document.getElementById('mainNavbar');
    if (!navbar) return;
    if (window.scrollY > 15) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });
});

/* ── Dropdown Toggle ─────────────────────────────────── */
function toggleDropdown(e) {
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }
  const dropdown = document.getElementById('petsDropdown');
  if (!dropdown) return;
  const isOpen = dropdown.classList.toggle('open');
  const btn = dropdown.querySelector('.dropdown-toggle');
  if (btn) btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
}

/* ── Dismiss Notice Bar ──────────────────────────────── */
function dismissNotice(e) {
  if (e) e.stopPropagation();
  const notice = document.getElementById('noticeBar');
  if (notice) {
    notice.classList.add('dismissed');
    setTimeout(() => {
      notice.style.display = 'none';
      sessionStorage.setItem('paws_notice_dismissed', 'true');
    }, 280);
  }
}

/* ── Mobile Menu ─────────────────────────────────────── */
function toggleMobileMenu(forceClose = false) {
  const menu = document.getElementById('mobileMenu');
  const overlay = document.getElementById('mobileOverlay');
  const hamburger = document.getElementById('hamburger');
  const isOpen = forceClose ? true : menu?.classList.contains('open');

  if (isOpen) {
    menu?.classList.remove('open');
    overlay?.classList.remove('open');
    hamburger?.classList.remove('open');
    document.body.style.overflow = '';
  } else {
    menu?.classList.add('open');
    overlay?.classList.add('open');
    hamburger?.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

/* ── FAQ Accordion ───────────────────────────────────── */
function initFaq() {
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });
}

/* ── Tabs with URL Hash Support ─────────────────────── */
function switchTab(group, target) {
  if (!group || !target) return;
  group.querySelectorAll('.tab-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.tab === target);
  });
  group.querySelectorAll('.tab-content').forEach(c => {
    c.classList.toggle('active', c.dataset.tabContent === target);
  });
}

function handleTabHash() {
  const hash = window.location.hash.replace('#', '').trim().toLowerCase();
  if (!hash) return;
  document.querySelectorAll('.tab-group').forEach(group => {
    const btn = group.querySelector(`.tab-btn[data-tab="${hash}"]`);
    if (btn) {
      switchTab(group, hash);
    }
  });
}

function initTabs() {
  document.querySelectorAll('.tab-group').forEach(group => {
    group.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const target = btn.dataset.tab;
        switchTab(group, target);
        if (target) {
          history.replaceState(null, '', `#${target}`);
        }
      });
    });
  });

  handleTabHash();
  window.removeEventListener('hashchange', handleTabHash);
  window.addEventListener('hashchange', handleTabHash);
}

/* ── Form Validation ─────────────────────────────────── */
function validateForm(formEl) {
  let valid = true;
  formEl.querySelectorAll('[required]').forEach(field => {
    field.classList.remove('invalid');
    if (!field.value.trim()) {
      field.classList.add('invalid');
      valid = false;
    }
    // Email check
    if (field.type === 'email' && field.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
      field.classList.add('invalid');
      valid = false;
    }
    // Phone check
    if (field.dataset.type === 'phone' && field.value.trim() && !/^[\d\s\-+()]{7,15}$/.test(field.value)) {
      field.classList.add('invalid');
      valid = false;
    }
  });
  return valid;
}

/* ── Show Toast ──────────────────────────────────────── */
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `alert alert-${type}`;
  toast.style.cssText = `position:fixed;bottom:24px;right:24px;z-index:3000;max-width:360px;box-shadow:var(--shadow-lg);animation:fadeInUp .3s ease;`;
  toast.innerHTML = `${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'} ${message}`;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}

/* ── localStorage & Supabase helpers ─────────────────── */
function storeData(key, data) {
  try {
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    const record = { ...data, id: Date.now(), createdAt: new Date().toISOString() };
    existing.push(record);
    localStorage.setItem(key, JSON.stringify(existing));

    // Also forward asynchronously to Supabase cloud if available
    if (window.pawsDB) {
      if (key === 'pets') window.pawsDB.savePet(data);
      else if (key === 'volunteers') window.pawsDB.saveVolunteer(data);
      else if (key === 'consents') window.pawsDB.saveConsent(data);
      else if (key === 'feedback') window.pawsDB.saveFeedback(data);
      else if (key === 'enquiries') window.pawsDB.saveEnquiry(data);
    }
    return true;
  } catch (e) { return false; }
}

function getData(key) {
  try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; }
}

async function fetchRecords(key) {
  if (window.pawsDB && window.pawsDB.isConfigured()) {
    try {
      if (key === 'pets') return await window.pawsDB.getPets();
      if (key === 'volunteers') return await window.pawsDB.getVolunteers();
      if (key === 'consents') return await window.pawsDB.getConsents();
      if (key === 'feedback') return await window.pawsDB.getFeedback();
      if (key === 'enquiries') return await window.pawsDB.getEnquiries();
    } catch (e) {
      console.warn(`[Supabase] fetch error for ${key}:`, e);
    }
  }
  return getData(key);
}

function clearData(key) {
  localStorage.removeItem(key);
}

/* ── Star Rating Widget ──────────────────────────────── */
function buildStarRating(containerSel) {
  const container = document.querySelector(containerSel);
  if (!container) return;
  container.innerHTML = `
    <div class="star-rating" id="starRatingWidget">
      <input type="radio" name="rating" id="star5" value="5"><label for="star5" title="5 stars">★</label>
      <input type="radio" name="rating" id="star4" value="4"><label for="star4" title="4 stars">★</label>
      <input type="radio" name="rating" id="star3" value="3"><label for="star3" title="3 stars">★</label>
      <input type="radio" name="rating" id="star2" value="2"><label for="star2" title="2 stars">★</label>
      <input type="radio" name="rating" id="star1" value="1"><label for="star1" title="1 star">★</label>
    </div>
  `;
}

/* ── Search filter helper ────────────────────────────── */
function filterTable(inputSel, tableSel) {
  const input = document.querySelector(inputSel);
  const table = document.querySelector(tableSel);
  if (!input || !table) return;
  input.addEventListener('input', () => {
    const q = input.value.toLowerCase();
    table.querySelectorAll('tbody tr').forEach(row => {
      row.style.display = row.textContent.toLowerCase().includes(q) ? '' : 'none';
    });
  });
}

/* ── Admin Auth Guard ────────────────────────────────── */
function requireAdmin() {
  const loggedIn = sessionStorage.getItem('adminLoggedIn');
  if (!loggedIn) {
    document.getElementById('adminLoginSection')?.classList.remove('hidden');
    document.getElementById('adminDashboard')?.classList.add('hidden');
  } else {
    document.getElementById('adminLoginSection')?.classList.add('hidden');
    document.getElementById('adminDashboard')?.classList.remove('hidden');
  }
}

function adminLogin(user, pass) {
  // Demo credentials – replace with real auth in production
  if (user === 'admin' && pass === 'paws2024') {
    sessionStorage.setItem('adminLoggedIn', 'true');
    return true;
  }
  return false;
}

function adminLogout() {
  sessionStorage.removeItem('adminLoggedIn');
  window.location.reload();
}

/* ── Global window exports for module / HTML scripts ─ */
window.toggleMobileMenu = toggleMobileMenu;
window.toggleDropdown = toggleDropdown;
window.dismissNotice = dismissNotice;
window.initFaq = initFaq;
window.initTabs = initTabs;
window.switchTab = switchTab;
window.validateForm = validateForm;
window.showToast = showToast;
window.storeData = storeData;
window.getData = getData;
window.fetchRecords = fetchRecords;
window.clearData = clearData;
window.buildStarRating = buildStarRating;
window.filterTable = filterTable;
window.requireAdmin = requireAdmin;
window.adminLogin = adminLogin;
window.adminLogout = adminLogout;
