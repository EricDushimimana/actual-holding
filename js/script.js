
/* ===== Merged from js/navigation.js (shared/global module) ===== */
/**
 * ACTUAL HOLDINGS — Navigation & Header
 * Mobile drawer, backdrop, active link and sticky header behavior.
 */

document.addEventListener('DOMContentLoaded', initNavigation);
document.addEventListener('component:loaded', event => {
  if (event.detail?.fileName === 'header.html') initNavigation();
});

function initNavigation() {
  initMobileNavigation();
  initHeaderScrollBehavior();
  initCurrentNavLink();
}

function initMobileNavigation() {
  const mobileToggle = document.querySelector('.mobile-toggle') || document.getElementById('mobile-menu-btn');
  const mainNav = document.querySelector('.main-nav') || document.getElementById('header-main-nav');
  if (!mobileToggle || !mainNav || mobileToggle.dataset.navigationBound === 'true') return;

  mobileToggle.dataset.navigationBound = 'true';

  let backdrop = document.querySelector('.mobile-backdrop');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.className = 'mobile-backdrop';
    backdrop.setAttribute('aria-hidden', 'true');
    document.body.appendChild(backdrop);
  }

  const setMenu = open => {
    mainNav.classList.toggle('active', open);
    backdrop.classList.toggle('active', open);
    backdrop.setAttribute('aria-hidden', String(!open));
    mobileToggle.setAttribute('aria-expanded', String(open));
    mobileToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    mobileToggle.innerHTML = open
      ? '<i class="fa-solid fa-xmark" aria-hidden="true"></i>'
      : '<i class="fa-solid fa-bars" aria-hidden="true"></i>';
    document.body.classList.toggle('mobile-nav-open', open);
  };

  mobileToggle.addEventListener('click', event => {
    event.preventDefault();
    event.stopPropagation();
    setMenu(!mainNav.classList.contains('active'));
  });

  backdrop.addEventListener('click', () => setMenu(false));

  mainNav.addEventListener('click', event => {
    const link = event.target.closest('a');
    if (link) setMenu(false);
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && mainNav.classList.contains('active')) setMenu(false);
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 992 && mainNav.classList.contains('active')) setMenu(false);
  }, { passive: true });
}

function initHeaderScrollBehavior() {
  const header = document.querySelector('.actual-header');
  if (!header || header.dataset.scrollBound === 'true') return;
  header.dataset.scrollBound = 'true';

  const updateHeader = () => header.classList.toggle('scrolled', window.scrollY > 40);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });
}

function initCurrentNavLink() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href') || '';
    const linkFile = href.split('/').pop();
    const isMatch = linkFile === currentPath || (currentPath === '' && linkFile === 'index.html');
    link.classList.toggle('active', isMatch);
  });
}



/* ===== Merged from js/components.js (shared/global module) ===== */
/**
 * ==========================================================================
 * ACTUAL HOLDINGS - Interactive UI Components Module (components.js)
 * Reusable interactive components:
 * - FAQ Accordion
 * - Interactive Service Plan & Retainer Estimator
 * - Analytics Chart Mode Toggles
 * - Service Category Filter Bento
 * - 3D Card Hover Motion & Button Ripples
 * - Animated Stats Counter
 * ==========================================================================
 */
// Header and footer loader
document.addEventListener('DOMContentLoaded', async () => {
  const header = document.getElementById('header');
  const footer = document.getElementById('footer');

  // Pages inside /pages/ are one directory deeper than root pages.
  const rootPrefix = window.location.pathname.includes('/pages/') ? '../' : '';

  async function loadComponent(target, fileName) {
    if (!target) return;

    try {
      const response = await fetch(`${rootPrefix}components/${fileName}`);

      if (!response.ok) {
        throw new Error(`${fileName} could not be loaded (${response.status})`);
      }

      let html = await response.text();

      // Component files are stored in /components, but their links must
      // resolve from the page where the component is inserted.
      html = html.replace(/(href|src)=(["'])((?:pages\/)?(?:images\/)?[^"']+)(["'])/g,
        (match, attr, quote1, value, quote2) => {
          if (/^(?:https?:|mailto:|tel:|#|javascript:|data:)/i.test(value)) {
            return match;
          }
          return `${attr}=${quote1}${rootPrefix}${value}${quote2}`;
        });

      target.innerHTML = html;
      target.dispatchEvent(new CustomEvent('component:loaded', { bubbles: true, detail: { fileName } }));
    } catch (error) {
      console.error(`${fileName} error:`, error);
    }
  }

  await loadComponent(header, 'header.html');
  await loadComponent(footer, 'footer.html');
});
document.addEventListener('DOMContentLoaded', () => {
  initFAQAccordion();
  initFeeEstimator();
  initChartToggle();
  initServiceFilters();
  initButtonRipples();
  initCard3DTilt();
  initAnimatedCounters();
  initScrollReveal();
  initActualAssistant();
  initPasswordToggles();
});

function initPasswordToggles() {
  document.querySelectorAll('[data-password-toggle]').forEach(button => {
    button.addEventListener('click', () => {
      const input = document.getElementById(button.dataset.passwordToggle);
      if (!input) return;
      const show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      button.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
      button.querySelector('i')?.classList.toggle('fa-eye-slash', show);
      button.querySelector('i')?.classList.toggle('fa-eye', !show);
    });
  });
}

/**
 * On-site concierge. It intentionally uses curated answers rather than an
 * external model, so visitors get reliable information without sharing data
 * with a third party or requiring a browser API key.
 */
function initActualAssistant() {
  if (document.getElementById('actual-assistant')) return;

  const rootPrefix = window.location.pathname.includes('/pages/') ? '../' : '';
  const whatsapp = document.createElement('a');
  whatsapp.className = 'whatsapp-float';
  whatsapp.href = 'https://wa.me/250785848534';
  whatsapp.target = '_blank';
  whatsapp.rel = 'noopener noreferrer';
  whatsapp.setAttribute('aria-label', 'Chat with ACTUAL HOLDINGS on WhatsApp');
  whatsapp.title = 'Chat on WhatsApp';
  whatsapp.innerHTML = '<i class="fa-brands fa-whatsapp" aria-hidden="true"></i>';
  document.body.appendChild(whatsapp);

  const assistant = document.createElement('section');
  assistant.id = 'actual-assistant';
  assistant.className = 'actual-assistant';
  assistant.setAttribute('aria-label', 'ACTUAL HOLDINGS virtual assistant');
  assistant.innerHTML = `
    <button class="assistant-launcher" type="button" aria-expanded="false" aria-controls="assistant-panel">
      <i class="fa-solid fa-message"></i><span>Actual AI</span>
    </button>
    <div class="assistant-panel" id="assistant-panel" hidden>
      <div class="assistant-heading">
        <div class="assistant-avatar" aria-hidden="true"><i class="fa-solid fa-sparkles"></i></div>
        <div><strong>Actual Assistant</strong><span><i class="fa-solid fa-circle"></i> Here to help</span></div>
        <button class="assistant-close" type="button" aria-label="Close assistant"><i class="fa-solid fa-xmark"></i></button>
      </div>
      <div class="assistant-messages" aria-live="polite" aria-label="Conversation"></div>
      <div class="assistant-prompts" aria-label="Suggested questions">
        <button type="button" data-assistant-prompt="What services do you offer?">Our services</button>
        <button type="button" data-assistant-prompt="How can I contact you?">Contact us</button>
        <button type="button" data-assistant-prompt="I want to order an item">Order an item</button>
      </div>
      <form class="assistant-form">
        <label class="sr-only" for="assistant-input">Ask ACTUAL HOLDINGS a question</label>
        <input id="assistant-input" type="text" maxlength="300" autocomplete="off" placeholder="Ask about services, orders or contact…" required>
        <button type="submit" aria-label="Send message"><i class="fa-solid fa-paper-plane"></i></button>
      </form>
    </div>`;
  document.body.appendChild(assistant);

  const launcher = assistant.querySelector('.assistant-launcher');
  const panel = assistant.querySelector('.assistant-panel');
  const close = assistant.querySelector('.assistant-close');
  const messages = assistant.querySelector('.assistant-messages');
  const form = assistant.querySelector('.assistant-form');
  const input = assistant.querySelector('#assistant-input');

  const addMessage = (text, sender = 'bot', actions = []) => {
    const message = document.createElement('div');
    message.className = `assistant-message assistant-message-${sender}`;
    const content = document.createElement('p');
    content.textContent = text;
    message.appendChild(content);
    if (actions.length) {
      const links = document.createElement('div'); links.className = 'assistant-actions';
      actions.forEach(({ label, href }) => { const link = document.createElement('a'); link.href = `${rootPrefix}${href}`; link.textContent = label; links.appendChild(link); });
      message.appendChild(links);
    }
    messages.appendChild(message); messages.scrollTop = messages.scrollHeight;
  };

  const reply = question => {
    const q = question.toLowerCase();
    if (/hello|hi\b|good (morning|afternoon|evening)|hey/.test(q)) return ['Hello! I can help you learn about ACTUAL HOLDINGS, find a service, contact our team, or begin an order request.'];
    if (/contact|reach|email|phone|address|location|where/.test(q)) return ['You can reach our team at info@actualaccounting.rw. We are based in Kigali, Rwanda, and operate Monday to Friday, 8:00 AM–5:00 PM CAT.', [{ label: 'Send an inquiry', href: 'contact.html' }]];
    if (/order|buy|shop|product|laptop|phone|electronic|device/.test(q)) return ['Our ACTUAL Trading lists available electronics. Browse the current selection, then send an inquiry with the product name and your preferred contact details so the team can confirm availability and arrange your order.', [{ label: 'Browse ACTUAL Trading', href: 'pages/trading.html' }, { label: 'Request an item', href: 'contact.html' }]];
    if (/book|appointment|consult|meeting|schedule/.test(q)) return ['You can request a focused session with our accounting and business advisory team. Choose a service and a suitable date; we will confirm your booking within 24 hours.', [{ label: 'Book a consultation', href: 'pages/consultation.html' }]];
    if (/service|bookkeeping|tax|rra|payroll|report|audit|business|advis/.test(q)) return ['We provide bookkeeping, tax preparation and RRA compliance, financial reporting, payroll support, risk management, and strategic business advisory services for businesses in Rwanda.', [{ label: 'Explore services', href: 'services.html' }, { label: 'Talk to an advisor', href: 'pages/consultation.html' }]];
    if (/about|actual accounting|company|who are you/.test(q)) return ['ACTUAL HOLDINGS is a trading name of ACTUAL HOLDINGS CO LTD. We help organisations in Rwanda manage their accounting, compliance, reporting, and growth decisions with practical advice.'];
    if (/price|cost|fee|quote/.test(q)) return ['Fees depend on your business size and the support you need. Tell our advisory team about your requirements and they will prepare a suitable proposal.', [{ label: 'Request a consultation', href: 'pages/consultation.html' }]];
    return ['I can help with our services, consultations, contact details, or ordering from ACTUAL Trading. What would you like to know?'];
  };
  const answer = question => { const [text, actions] = reply(question); addMessage(question, 'visitor'); window.setTimeout(() => addMessage(text, 'bot', actions), 180); };
  const setOpen = open => { panel.hidden = !open; launcher.setAttribute('aria-expanded', String(open)); if (open) { if (!messages.children.length) addMessage('Welcome to ACTUAL HOLDINGS. How can I help today?'); input.focus(); } };

  launcher.addEventListener('click', () => { window.location.href = window.location.pathname.includes('/pages/') ? 'actual-ai.html' : 'pages/actual-ai.html'; });
  close.addEventListener('click', () => setOpen(false));
  assistant.querySelectorAll('[data-assistant-prompt]').forEach(button => button.addEventListener('click', () => answer(button.dataset.assistantPrompt)));
  form.addEventListener('submit', event => { event.preventDefault(); const question = input.value.trim(); if (!question) return; input.value = ''; answer(question); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && !panel.hidden) setOpen(false); });
}

/**
 * FAQ Collapsible Accordions
 */
function initFAQAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const header = item.querySelector('.faq-question');
    if (!header) return;

    header.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');
      
      // Close other open accordion items
      faqItems.forEach(other => {
        other.classList.remove('active');
        const content = other.querySelector('.faq-answer');
        if (content) content.style.maxHeight = null;
      });

      if (!isOpen) {
        item.classList.add('active');
        const answer = item.querySelector('.faq-answer');
        if (answer) answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
}

/**
 * Interactive Service Fee & Retainer Estimator (services.html)
 */
function initFeeEstimator() {
  const estimator = document.getElementById('interactive-fee-estimator');
  if (!estimator) return;

  const businessTypeSelect = document.getElementById('calc-type');
  const sizeSelect = document.getElementById('calc-size');
  const serviceCheckboxes = document.querySelectorAll('.calc-service-check');
  const priceDisplay = document.getElementById('calc-price-output');

  if (!businessTypeSelect || !priceDisplay) return;

  function calculateEstimate() {
    let base = 0;
    const typeVal = businessTypeSelect.value;
    const sizeVal = sizeSelect ? sizeSelect.value : 'small';

    if (typeVal === 'sole-proprietor') base = 150000; // Base in RWF
    else if (typeVal === 'sme') base = 350000;
    else if (typeVal === 'corporate') base = 750000;

    let multiplier = 1;
    if (sizeVal === 'medium') multiplier = 1.4;
    else if (sizeVal === 'large') multiplier = 2.0;

    let total = base * multiplier;

    serviceCheckboxes.forEach(chk => {
      if (chk.checked) {
        total += parseFloat(chk.getAttribute('data-fee') || 100000);
      }
    });

    const formatted = Math.round(total).toLocaleString() + ' RWF';
    priceDisplay.textContent = formatted;
  }

  businessTypeSelect.addEventListener('change', calculateEstimate);
  if (sizeSelect) sizeSelect.addEventListener('change', calculateEstimate);
  serviceCheckboxes.forEach(chk => chk.addEventListener('change', calculateEstimate));

  // Initial run
  calculateEstimate();
}

/**
 * Interactive Chart Toggle (Hero Financial Visuals)
 */
function initChartToggle() {
  const toggleBtns = document.querySelectorAll('[data-chart-toggle]');
  const chartBars = document.querySelectorAll('.bar-fill');
  
  if (!toggleBtns.length || !chartBars.length) return;

  const dataset = {
    revenue: [65, 80, 70, 85, 90, 85, 95],
    tax: [45, 55, 60, 65, 70, 75, 82]
  };

  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      toggleBtns.forEach(b => b.classList.remove('btn-primary', 'active'));
      toggleBtns.forEach(b => b.classList.add('btn-secondary'));
      
      btn.classList.remove('btn-secondary');
      btn.classList.add('btn-primary', 'active');

      const mode = btn.getAttribute('data-chart-toggle');
      const heights = dataset[mode] || dataset.revenue;

      chartBars.forEach((bar, index) => {
        if (heights[index] !== undefined) {
          bar.style.height = heights[index] + '%';
        }
      });
    });
  });
}

/**
 * Service Category Filter Bento (services.html)
 */
function initServiceFilters() {
  const filterBtns = document.querySelectorAll('[data-filter]');
  const serviceCards = document.querySelectorAll('[data-category]');

  if (!filterBtns.length || !serviceCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active', 'btn-primary'));
      filterBtns.forEach(b => b.classList.add('btn-secondary'));

      btn.classList.remove('btn-secondary');
      btn.classList.add('btn-primary', 'active');

      const filterVal = btn.getAttribute('data-filter');

      serviceCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filterVal === 'all' || cat === filterVal) {
          card.style.display = 'flex';
          card.style.opacity = '1';
          card.style.transform = 'scale(1)';
        } else {
          card.style.display = 'none';
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
        }
      });
    });
  });
}

/**
 * Button Click Ripple Effect
 */
function initButtonRipples() {
  const buttons = document.querySelectorAll('.btn');

  buttons.forEach(btn => {
    btn.addEventListener('click', function(e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;

      this.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });
}

/**
 * Subtle 3D Card Hover Tilt Motion
 */
function initCard3DTilt() {
  const cards = document.querySelectorAll('.glass-card, .dashboard-mockup, .value-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      if (window.innerWidth < 992) return; // Ignore on touch screens
      
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -3;
      const rotateY = ((x - centerX) / centerX) * 3;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });
}

/**
 * Animated Numbers Counter Increment
 */
function initAnimatedCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseFloat(counter.getAttribute('data-counter'));
        const prefix = counter.getAttribute('data-prefix') || '';
        const suffix = counter.getAttribute('data-suffix') || '';
        const duration = 1400; // ms
        const startTime = performance.now();

        function updateCounter(currentTime) {
          const elapsedTime = currentTime - startTime;
          const progress = Math.min(elapsedTime / duration, 1);
          
          const currentValue = Math.floor(progress * (2 - progress) * target);
          counter.textContent = `${prefix}${currentValue.toLocaleString()}${suffix}`;

          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            counter.textContent = `${prefix}${target.toLocaleString()}${suffix}`;
          }
        }

        requestAnimationFrame(updateCounter);
        obs.unobserve(counter);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

/**
 * Scroll Reveal Animation Observer
 */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if (!revealElements.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -40px 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => observer.observe(el));
}



/* ===== Merged from js/auth.js (shared/global module) ===== */
/* Browser-only demo authentication. Never use this as live-site security. */
const FRONTEND_USERS_KEY = 'actualHoldingsFrontendUsers';
const FRONTEND_SESSION_KEY = 'actualHoldingsFrontendSession';
const staffAccounts = [
  { name: 'Actual Owner', company: 'ACTUAL HOLDINGS', email: 'actualowner@gmail.com', password: 'owner@2026', role: 'owner' },
  { name: 'Actual Admin', company: 'ACTUAL HOLDINGS', email: 'actualadmin@gmail.com', password: 'admin@2026', role: 'admin' }
];
let session = null;
function users() { try { return JSON.parse(localStorage.getItem(FRONTEND_USERS_KEY) || '[]'); } catch (_) { return []; } }
function saveUsers(list) { localStorage.setItem(FRONTEND_USERS_KEY, JSON.stringify(list)); }
function pageTarget(path) { return window.location.pathname.includes('/pages/') ? `../${path}` : path; }
function dashboardUrlForRole(role) { return role === 'owner' ? pageTarget('pages/owner.html') : role === 'admin' ? pageTarget('pages/admin.html') : pageTarget('pages/client.html'); }
function getSession() { try { return JSON.parse(localStorage.getItem(FRONTEND_SESSION_KEY) || 'null'); } catch (_) { return null; } }
function showError(form, message) { let box = form.querySelector('.api-error'); if (!box) { box = document.createElement('p'); box.className = 'api-error'; box.style.color = '#b42318'; form.prepend(box); } box.textContent = message; }
function initLoginForm() {
  const form = document.getElementById('login-form'); if (!form) return;
  form.addEventListener('submit', event => {
    event.preventDefault(); if (!form.checkValidity()) { form.reportValidity(); return; }
    const email = document.getElementById('login-email').value.trim().toLowerCase();
    const password = document.getElementById('password').value;
    const account = [...staffAccounts, ...users()].find(user => user.email.toLowerCase() === email && user.password === password);
    if (!account) { showError(form, 'Incorrect email or password. Please try again.'); return; }
    const activeUser = { name: account.name, company: account.company, email: account.email, phone: account.phone || '', role: account.role || 'client' };
    localStorage.setItem(FRONTEND_SESSION_KEY, JSON.stringify(activeUser)); window.location.assign(dashboardUrlForRole(activeUser.role));
  });
}
function initSignupForm() {
  const form = document.getElementById('signup-form'); if (!form) return;
  form.addEventListener('submit', event => {
    event.preventDefault(); if (!form.checkValidity()) { form.reportValidity(); return; }
    const password = document.getElementById('password').value;
    if (password !== document.getElementById('confirm-password').value) { showError(form, 'Passwords do not match.'); return; }
    const email = document.getElementById('signup-email').value.trim().toLowerCase();
    if ([...staffAccounts, ...users()].some(user => user.email.toLowerCase() === email)) { showError(form, 'An account with this email already exists. Please sign in instead.'); return; }
    saveUsers([...users(), { name: document.getElementById('signup-name').value.trim(), company: document.getElementById('signup-company').value.trim(), email, phone: document.getElementById('signup-phone').value.trim(), password, role: 'client' }]);
    window.location.assign('login.html?signup=success');
  });
}
function initPublicAccountActions() {
  const actions = document.getElementById('header-auth-actions');
  if (!actions) return;

  const menu = actions.querySelector('[data-account-menu]');
  if (!menu) return;

  const trigger = menu.querySelector('.account-menu-trigger');
  const panel = menu.querySelector('.account-menu-panel');
  if (!trigger || !panel) return;

  const closeMenu = () => {
    menu.classList.remove('is-open');
    trigger.setAttribute('aria-expanded', 'false');
    panel.hidden = true;
  };
  const openMenu = () => {
    menu.classList.add('is-open');
    trigger.setAttribute('aria-expanded', 'true');
    panel.hidden = false;
  };

  // Refresh links and options from the current frontend session.
  const dashboardLink = session
    ? `<a href="${dashboardUrlForRole(session.role)}" class="account-menu-item" role="menuitem"><i class="fa-solid fa-gauge-high" aria-hidden="true"></i><span><strong>Dashboard</strong><small>Open your workspace</small></span></a>`
    : '';
  const authLinks = session
    ? `${dashboardLink}<button type="button" class="account-menu-item account-menu-logout" data-logout role="menuitem"><i class="fa-solid fa-arrow-right-from-bracket" aria-hidden="true"></i><span><strong>Log out</strong><small>End this session</small></span></button>`
    : `<a href="${pageTarget('login.html')}" class="account-menu-item" role="menuitem"><i class="fa-solid fa-right-to-bracket" aria-hidden="true"></i><span><strong>Sign in</strong><small>Access your account</small></span></a><a href="${pageTarget('signup.html')}" class="account-menu-item account-menu-item-primary" role="menuitem"><i class="fa-solid fa-user-plus" aria-hidden="true"></i><span><strong>Create account</strong><small>Register as a client</small></span></a>`;
  panel.innerHTML = authLinks;
  trigger.querySelector('.account-trigger-label').textContent = session ? 'My account' : 'Account';
  trigger.querySelector('.account-trigger-icon').innerHTML = session
    ? '<i class="fa-solid fa-user-check" aria-hidden="true"></i>'
    : '<i class="fa-regular fa-user" aria-hidden="true"></i>';

  if (trigger.dataset.accountBound !== 'true') {
    trigger.dataset.accountBound = 'true';
    trigger.addEventListener('click', event => {
      event.preventDefault();
      menu.classList.contains('is-open') ? closeMenu() : openMenu();
    });
    document.addEventListener('click', event => {
      if (!menu.contains(event.target)) closeMenu();
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        closeMenu();
        trigger.focus();
      }
    });
    panel.addEventListener('click', event => {
      if (event.target.closest('[data-logout]')) logoutUser();
    });
  }
}
function logoutUser() { localStorage.removeItem(FRONTEND_SESSION_KEY); window.location.assign(pageTarget('login.html')); }
window.logoutUser = logoutUser;
function enforceDashboardRole(file, currentSession) {
  // FRONTEND DEVELOPMENT MODE: Admin and Owner dashboards are intentionally
  // public while the UI is being built. This is NOT authentication or security.
  // Add server-side authentication and role authorization before production.
  if (file === 'admin.html') {
    const activeAdmin = currentSession && ['admin', 'owner'].includes(String(currentSession.role || '').toLowerCase())
      ? currentSession
      : { name: 'Admin (Frontend Demo)', company: 'ACTUAL HOLDINGS', email: '', phone: '', role: 'admin', demo: true };
    localStorage.setItem(FRONTEND_SESSION_KEY, JSON.stringify(activeAdmin));
    session = activeAdmin;
    return true;
  }
  if (file === 'owner.html') {
    const demoOwner = { name: 'Owner (Frontend Demo)', company: 'ACTUAL HOLDINGS', email: '', phone: '', role: 'owner', demo: true };
    localStorage.setItem(FRONTEND_SESSION_KEY, JSON.stringify(demoOwner));
    session = demoOwner;
    return true;
  }
  const protectedPages = new Set(['client.html', 'admin.html', 'owner.html', 'employee.html']);
  if (!protectedPages.has(file)) return true;
  if (!currentSession) {
    window.location.replace(pageTarget('login.html'));
    return false;
  }

  const role = String(currentSession.role || 'client').toLowerCase();
  const allowed = {
    'client.html': ['client'],
    'admin.html': ['admin', 'owner'],
    'owner.html': ['owner'],
    'employee.html': ['employee']
  };
  if (!(allowed[file] || []).includes(role)) {
    window.location.replace(dashboardUrlForRole(role));
    return false;
  }
  return true;
}

document.addEventListener('DOMContentLoaded', () => {
  session = getSession();
  const file = window.location.pathname.split('/').pop() || 'index.html';
  if (!enforceDashboardRole(file, session)) return;
  if (new URLSearchParams(window.location.search).get('signup') === 'success') {
    const message = document.getElementById('login-message');
    if (message) message.textContent = 'Your account was created successfully. Please sign in with your email and password.';
  }
  initLoginForm();
  initSignupForm();
  initPublicAccountActions();
});
document.addEventListener('component:loaded', initPublicAccountActions);



/* ===== Merged from js/script.js (shared/global module) ===== */
/* Server-backed forms and portals; visual markup remains owned by the existing pages. */
document.addEventListener('DOMContentLoaded', () => { initContactForm(); initConsultationForm(); initShopPayment(); if(document.body.id==='client-container') initClientPortal(); if(document.body.id==='admin-container') initAdminPortal(); });
window.addEventListener('actual:products-ready',()=>{if(typeof initShopPayment==='function')initShopPayment();});
function initShopPayment(){
  const tabs=[...document.querySelectorAll('.filter-tabs [data-filter]')],cards=[...document.querySelectorAll('.product-card')];
  if(!tabs.length||!cards.length)return;
  let cart=[],activeOrder=null;
  const drawer=document.getElementById('shop-cart'),overlay=document.getElementById('shop-cart-overlay'),items=document.getElementById('shop-cart-items'),total=document.getElementById('shop-cart-total'),count=document.getElementById('shop-cart-count'),message=document.getElementById('shop-cart-message'),modal=document.getElementById('shop-payment-modal'),paymentForm=document.getElementById('shop-payment-form'),paymentMessage=document.getElementById('shop-payment-message');
  const money=n=>`${Number(n).toLocaleString()} RWF`;
  const render=()=>{const qty=cart.reduce((sum,x)=>sum+x.quantity,0);count.textContent=qty;items.innerHTML=cart.length?cart.map((x,i)=>`<div class="cart-line"><div><strong>${escapeHtml(x.name)}</strong><br>${money(x.price)}</div><div class="cart-quantity"><button type="button" data-cart-change="${i}" data-change="-1" aria-label="Decrease quantity">−</button><span>${x.quantity}</span><button type="button" data-cart-change="${i}" data-change="1" aria-label="Increase quantity">+</button><button type="button" data-cart-change="${i}" data-change="0" aria-label="Remove item">×</button></div></div>`).join(''):'<p>Your cart is empty.</p>';total.textContent=money(cart.reduce((sum,x)=>sum+x.price*x.quantity,0));};
  const open=()=>{drawer.classList.add('is-open');drawer.setAttribute('aria-hidden','false');overlay.hidden=false;};
  const close=()=>{drawer.classList.remove('is-open');drawer.setAttribute('aria-hidden','true');overlay.hidden=true;};
  const closePayment=()=>{modal.hidden=true;activeOrder=null;paymentForm.reset();};
  const showPayment=order=>{activeOrder=order;const methods=order.payment_options||{};const methodKeys=Object.keys(methods).filter(k=>methods[k].enabled);const selected=order.payment_method&&methods[order.payment_method]?.enabled?order.payment_method:(methodKeys[0]||'momo');const methodBox=document.getElementById('shop-payment-methods');methodBox.innerHTML=methodKeys.map(k=>`<label class=\"payment-method-option\"><input type=\"radio\" name=\"shop-payment-method\" value=\"${escapeHtml(k)}\" ${k===selected?'checked':''}><span>${escapeHtml(methods[k].label)}</span></label>`).join('');const update=()=>{const key=document.querySelector('input[name=shop-payment-method]:checked')?.value||selected;activeOrder.payment_method=key;const cfg=methods[key]||{};document.getElementById('shop-payment-title').textContent=`Pay with ${cfg.label||'selected method'}`;document.getElementById('shop-payment-recipient-label').textContent=key==='momo'?'MTN MoMo number':'Bank of Kigali account';document.getElementById('shop-payment-number').textContent=cfg.receiver||cfg.account||'—';document.getElementById('shop-payment-amount').textContent=money(order.total_amount);document.getElementById('shop-payment-order').textContent=order.order_ref;const phone=document.getElementById('shop-payer-phone');phone.required=key==='momo';phone.disabled=key!=='momo';document.getElementById('shop-payer-phone-note').textContent=key==='momo'?'(required for MoMo)':'(not required for bank transfer)';document.getElementById('shop-payment-instructions').textContent=key==='momo'?'Send the exact amount to the MTN MoMo number, then enter the transaction ID from the confirmation message.':'Transfer the exact amount to the Bank of Kigali account, using your ACTUAL payment/order reference where your banking channel supports a reference.';};methodBox.querySelectorAll('input').forEach(x=>x.addEventListener('change',update));update();paymentMessage.textContent='';modal.hidden=false;if(selected==='momo')document.getElementById('shop-payer-phone').focus();else document.getElementById('shop-payment-reference').focus();};
  async function orders(){try{const d=await api('shop.orders');document.getElementById('shop-orders-list').innerHTML=d.orders.length?d.orders.map(o=>`<div class="shop-order"><strong>${escapeHtml(o.order_ref)}</strong><br><span>${escapeHtml(o.status)} · ${escapeHtml(o.payment_status||'')}</span><br>${o.items.map(i=>`${escapeHtml(i.name)} × ${i.quantity}`).join(', ')}<br><b>${money(o.total_amount)}</b>${o.payment_reference?`<br><small>MoMo ID: ${escapeHtml(o.payment_reference)}</small>`:''}</div>`).join(''):'<p>No orders yet.</p>';}catch(err){document.getElementById('shop-orders-list').textContent=err.message;}}
  tabs.forEach(tab=>{tab.type='button';tab.addEventListener('click',()=>{const category=tab.dataset.filter;tabs.forEach(x=>x.classList.toggle('is-active',x===tab));cards.forEach(card=>card.hidden=category!=='all'&&card.dataset.category!==category);});});
  document.querySelectorAll('.cart-btn').forEach(button=>button.addEventListener('click',()=>{const card=button.closest('.product-card'),name=card.querySelector('h4').textContent.trim(),price=Number(card.querySelector('.price').textContent.replace(/[^0-9]/g,'')),found=cart.find(x=>x.name===name);if(found)found.quantity++;else cart.push({name,price,quantity:1});render();message.textContent=`${name} added to your cart.`;open();}));
  items.addEventListener('click',e=>{const b=e.target.closest('[data-cart-change]');if(!b)return;const i=Number(b.dataset.cartChange),change=Number(b.dataset.change);if(change===0||cart[i].quantity+change<1)cart.splice(i,1);else cart[i].quantity+=change;render();});
  document.getElementById('shop-cart-toggle').addEventListener('click',open);document.getElementById('shop-cart-close').addEventListener('click',close);overlay.addEventListener('click',close);document.getElementById('shop-payment-close').addEventListener('click',closePayment);
  document.getElementById('shop-checkout').addEventListener('click',async()=>{if(!cart.length){message.textContent='Add a product before proceeding to payment.';return;}const button=document.getElementById('shop-checkout');button.disabled=true;try{const selectedMethod=document.querySelector('input[name=shop-payment-method]:checked')?.value||'momo';const order=await api('shop.orders',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({items:cart,payment_method:selectedMethod})});cart=[];render();close();showPayment(order);await orders();}catch(err){message.textContent=err.message;}finally{button.disabled=false;}});
  paymentForm.addEventListener('submit',async e=>{e.preventDefault();if(!activeOrder)return;const button=paymentForm.querySelector('button[type=submit]');button.disabled=true;try{const result=await api('shop.payments.confirm',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({order_ref:activeOrder.order_ref,payment_method:activeOrder.payment_method,payer_phone:document.getElementById('shop-payer-phone').value.trim(),payment_reference:document.getElementById('shop-payment-reference').value.trim()})});paymentMessage.textContent=result.message;await orders();setTimeout(closePayment,1800);}catch(err){paymentMessage.textContent=err.message;button.disabled=false;}});
  render();orders();
}
function success(form,title,message){const box=document.createElement('div');box.className='form-success-box';box.innerHTML=`<i class="fa-solid fa-circle-check"></i><h3 style="margin-bottom:.5rem;color:var(--dark-green)">${escapeHtml(title)}</h3><p style="margin:0">${message}</p>`;form.replaceWith(box);}
function field(id){return document.getElementById(id)?.value?.trim()||'';}
function initContactForm(){const f=document.getElementById('contact-form');if(!f)return;f.addEventListener('submit',async e=>{e.preventDefault();try{await api('contact.create',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:field('contact-name'),email:field('contact-email'),phone:field('contact-phone'),company:field('contact-company'),service:document.getElementById('contact-service')?.value,message:field('contact-message')})});success(f,'Inquiry Submitted Successfully!','Thank you. Our advisory team will respond within 24 business hours.');}catch(err){showError(f,err.message);}});}
function consultationPayload(){return {name:field('full-name'),company:field('company'),email:field('email'),phone:field('phone'),service:document.getElementById('service-needed')?.value,date:field('preferred-date'),notes:field('notes')};}
function initConsultationForm(){const f=document.getElementById('consultation-form');if(!f)return;f.addEventListener('submit',async e=>{e.preventDefault();try{const d=await api('consultations.create',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(consultationPayload())});success(f,'Consultation Booked Successfully!',`Your request is received. Reference: <strong>${escapeHtml(d.booking_ref)}</strong>.`);}catch(err){showError(f,err.message);}});}
function initClientPortal(){setTimeout(async()=>{try{if(!session)await hydrateSession();if(!session)return;const d=await api('portal.data');renderClient(d);bindQuickBooking();bindUpload();bindChat();bindProfile();bindNotifications();bindFeedback();}catch(err){console.error(err);}},0);}
function renderClient(d){const bookings=d.consultations||[], inquiries=d.inquiries||[], docs=d.documents||[], notifications=d.notifications||[];document.getElementById('stat-client-bookings').textContent=bookings.length;document.getElementById('stat-client-inquiries').textContent=inquiries.length;const b=document.getElementById('client-bookings-list');if(b)b.innerHTML=bookings.length?bookings.map(x=>`<div class="glass-card" style="padding:1.25rem 1.5rem;margin-bottom:1rem;border-left:4px solid var(--primary-green)"><strong>${escapeHtml(x.service)}</strong><div style="font-size:.85rem;color:var(--muted)">Ref: <strong>${escapeHtml(x.booking_ref)}</strong> • ${escapeHtml(x.date)}</div><span class="role-badge role-client">${escapeHtml(x.status)}</span>${x.notes?`<p>${escapeHtml(x.notes)}</p>`:''}</div>`).join(''):'<p>No consultations booked yet.</p>';const i=document.getElementById('client-inquiries-list');if(i)i.innerHTML=inquiries.length?inquiries.map(x=>`<div class="glass-card" style="padding:1rem;margin-bottom:.75rem"><strong>${escapeHtml(x.service)}</strong><span style="float:right">${escapeHtml(x.status)}</span><p>${escapeHtml(x.message)}</p></div>`).join(''):'<p>No inquiries yet.</p>';const t=document.getElementById('portal-docs-tbody');if(t)t.innerHTML=docs.map(x=>`<tr><td><strong>${escapeHtml(x.name)}</strong></td><td>${escapeHtml(x.date)}</td><td>✓ ${escapeHtml(x.status)}</td><td><a class="btn btn-secondary btn-sm" href="${apiBase}?action=documents.download&id=${encodeURIComponent(x.id)}">Download</a></td></tr>`).join('');const n=document.getElementById('client-notifications-list');if(n)n.innerHTML=notifications.length?notifications.map(x=>`<div style="padding:.75rem 0;border-bottom:1px solid var(--border);${x.read_at?'':'font-weight:700'}"><strong>${escapeHtml(x.title)}</strong><p style="margin:.25rem 0;font-size:.85rem;">${escapeHtml(x.body)}</p><small style="color:var(--muted)">${escapeHtml(x.created_at)}</small></div>`).join(''):'<p style="color:var(--muted);">You are all caught up.</p>';const select=document.getElementById('feedback-consultation');if(select)select.innerHTML='<option value="">General service feedback</option>'+bookings.filter(x=>x.status==='Completed').map(x=>`<option value="${x.id}">${escapeHtml(x.service)} - ${escapeHtml(x.date)}</option>`).join('');}
function bindQuickBooking(){const f=document.getElementById('client-quick-book-form');if(!f||f.dataset.bound)return;f.dataset.bound='1';f.addEventListener('submit',async e=>{e.preventDefault();try{const d=await api('consultations.create',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({phone:field('qb-phone'),service:document.getElementById('qb-service')?.value,date:field('qb-date'),notes:field('qb-notes')})});alert(`Booking requested: ${d.booking_ref}`);renderClient(await api('portal.data'));f.reset();}catch(err){showError(f,err.message);}});}
function bindUpload(){const input=document.getElementById('portal-file-input');if(!input)return;input.addEventListener('change',async()=>{if(!input.files.length)return;const data=new FormData();[...input.files].forEach(file=>data.append('files[]',file));try{await api('documents.upload',{method:'POST',body:data});alert('Files uploaded for CPA verification.');renderClient(await api('portal.data'));input.value='';}catch(err){alert(err.message);}});}
function bindProfile(){const form=document.getElementById('profile-form');if(!form||form.dataset.bound)return;form.dataset.bound='1';['name','company','email','phone'].forEach(key=>{const el=document.getElementById(`profile-${key}`);if(el)el.value=session[key]||'';});form.addEventListener('submit',async e=>{e.preventDefault();try{const d=await api('profile.update',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:field('profile-name'),company:field('profile-company'),email:field('profile-email'),phone:field('profile-phone')})});session=d.user;alert('Profile updated.');}catch(err){showError(form,err.message);}});}
function bindNotifications(){const button=document.getElementById('mark-notifications-read');if(!button||button.dataset.bound)return;button.dataset.bound='1';button.addEventListener('click',async()=>{try{await api('notifications.read',{method:'POST',headers:{'Content-Type':'application/json'},body:'{}'});renderClient(await api('portal.data'));}catch(err){alert(err.message);}});}
function bindFeedback(){const form=document.getElementById('feedback-form');if(!form||form.dataset.bound)return;form.dataset.bound='1';form.addEventListener('submit',async e=>{e.preventDefault();try{await api('feedback.create',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({consultation_id:document.getElementById('feedback-consultation')?.value,rating:document.getElementById('feedback-rating')?.value,comment:field('feedback-comment')})});success(form,'Feedback received','Thank you for helping us improve your advisory experience.');}catch(err){showError(form,err.message);}});}
async function bindChat(){const form=document.getElementById('portal-chat-form'),box=document.getElementById('portal-chat-box');if(!form||!box)return;const paint=messages=>{box.innerHTML=messages.map(m=>`<div style="align-self:${m.sender_id===session.id?'flex-end':'flex-start'};background:${m.sender_id===session.id?'var(--dark-green)':'var(--light-green)'};color:${m.sender_id===session.id?'#fff':'var(--dark-green)'};padding:8px 12px;border-radius:10px;font-size:.85rem;max-width:85%;margin-bottom:8px">${escapeHtml(m.body)}</div>`).join('');box.scrollTop=box.scrollHeight;};try{paint((await api('portal.messages')).messages);}catch(err){console.error(err);}if(form.dataset.bound)return;form.dataset.bound='1';form.addEventListener('submit',async e=>{e.preventDefault();const input=document.getElementById('portal-chat-input');try{await api('portal.messages',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({body:input.value})});input.value='';paint((await api('portal.messages')).messages);}catch(err){showError(form,err.message);}});}
function initAdminPortal(){setTimeout(async()=>{await loadAdmin();await loadAdminPaymentView();initAdminEnhancements();bindAdminChat();},0);}
async function bindAdminChat(){
  const select=document.getElementById('admin-chat-client'),form=document.getElementById('admin-chat-form'),box=document.getElementById('admin-chat-box'),input=document.getElementById('admin-chat-input'),send=document.getElementById('admin-chat-send'),refresh=document.getElementById('admin-chat-refresh');
  if(!select||!form||!box||form.dataset.bound)return;
  form.dataset.bound='1';
  const paint=messages=>{box.innerHTML=messages.length?messages.map(message=>{const mine=Number(message.sender_id)===Number(session.id);const sender=mine?'You':escapeHtml(message.sender_name||'Client');return `<div style="align-self:${mine?'flex-end':'flex-start'};background:${mine?'var(--dark-green)':'var(--light-green)'};color:${mine?'#fff':'var(--dark-green)'};padding:10px 12px;border-radius:10px;max-width:80%;font-size:.9rem;"><strong style="display:block;font-size:.75rem;margin-bottom:3px;opacity:.82">${sender}</strong>${escapeHtml(message.body)}<small style="display:block;font-size:.7rem;margin-top:5px;opacity:.75">${escapeHtml(message.created_at)}</small></div>`;}).join(''):'<p style="color:var(--muted);">No messages yet. Start the conversation about the client’s services.</p>';box.scrollTop=box.scrollHeight;};
  const loadMessages=async()=>{const userId=select.value;if(!userId){box.innerHTML='<p style="color:var(--muted);">Select a client to start or continue a conversation.</p>';input.disabled=true;send.disabled=true;return;}box.innerHTML='<p style="color:var(--muted);">Loading conversation…</p>';try{const data=await api(`portal.messages&user_id=${encodeURIComponent(userId)}`);paint(data.messages||[]);input.disabled=false;send.disabled=false;}catch(error){box.innerHTML=`<p class="api-error">${escapeHtml(error.message)}</p>`;}};
  try{const data=await api('admin.data');const clients=(data.users||[]).filter(user=>user.role==='client');select.innerHTML='<option value="">Select a client to view the conversation</option>'+clients.map(client=>`<option value="${Number(client.id)}">${escapeHtml(client.name)} — ${escapeHtml(client.company||client.email)}</option>`).join('');}catch(error){box.innerHTML=`<p class="api-error">${escapeHtml(error.message)}</p>`;return;}
  select.addEventListener('change',loadMessages);refresh.addEventListener('click',loadMessages);
  form.addEventListener('submit',async event=>{event.preventDefault();const userId=select.value,body=input.value.trim();if(!userId||!body)return;send.disabled=true;try{await api('portal.messages',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({user_id:Number(userId),body})});input.value='';await loadMessages();}catch(error){showError(form,error.message);}finally{send.disabled=false;}});
}
async function loadAdminPaymentView(){try{if(!session)await hydrateSession();if(!session)return;const d=await api('admin.data');const o=document.getElementById('admin-orders-tbody');if(o)o.innerHTML=(d.orders||[]).map(x=>`<tr><td><strong>${escapeHtml(x.order_ref)}</strong></td><td>${escapeHtml(x.name)}<br>${escapeHtml(x.email)}</td><td>${escapeHtml(x.items)}</td><td>${Number(x.total_amount).toLocaleString()} RWF</td><td><strong>${escapeHtml(x.payment_status||'—')}</strong><br>${x.payment_reference?`ID: ${escapeHtml(x.payment_reference)}<br>${escapeHtml(x.payer_phone||'')}`:'No payment submitted'}</td><td><select onchange="updateOrderStatus(${x.id},this.value)">${['Pending Payment','Payment Review','Confirmed','Processing','Ready','Completed','Cancelled'].map(s=>`<option ${s===x.status?'selected':''}>${s}</option>`).join('')}</select></td><td>${escapeHtml(x.created_at)}</td></tr>`).join('')||'<tr><td colspan="7">No shop orders yet.</td></tr>';}catch(err){console.error(err);}}
function initAdminEnhancements(){
	const refresh=document.getElementById('admin-refresh-btn');
	const updated=document.getElementById('admin-last-updated');
	const setUpdated=()=>{if(updated)updated.textContent=`Updated ${new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}`;};
	refresh?.addEventListener('click',async()=>{refresh.classList.add('is-loading');await loadAdmin();await loadAdminPaymentView();setUpdated();refresh.classList.remove('is-loading');});
	['consultations','inquiries','users'].forEach(type=>{const input=document.getElementById(`admin-${type}-search`);const table=document.getElementById(`admin-${type}-tbody`);if(!input||!table)return;input.addEventListener('input',()=>{const query=input.value.trim().toLowerCase();[...table.rows].forEach(row=>{row.hidden=!!query&&!row.textContent.toLowerCase().includes(query);});});});
	setUpdated();
}
async function loadAdmin(){try{if(!session)await hydrateSession();if(!session)return;const d=await api('admin.data');['clients','consultations','inquiries'].forEach(k=>{const el=document.getElementById(`adm-stat-${k==='clients'?'clients':k==='consultations'?'bookings':'inquiries'}`);if(el)el.textContent=d.metrics[k];});const c=document.getElementById('admin-consultations-tbody');if(c)c.innerHTML=d.consultations.map(x=>`<tr><td>${escapeHtml(x.booking_ref)}</td><td><strong>${escapeHtml(x.client_name)}</strong><br>${escapeHtml(x.company_name)}</td><td>${escapeHtml(x.email)}<br>${escapeHtml(x.phone)}</td><td>${escapeHtml(x.service_requested)}</td><td>${escapeHtml(x.meeting_date)}</td><td><select onchange="updateConsultationStatus(${x.id},this.value)">${['Confirmed','Pending Review','In Progress','Completed','Cancelled'].map(s=>`<option ${s===x.status?'selected':''}>${s}</option>`).join('')}</select></td><td>${escapeHtml(x.created_at)}</td></tr>`).join('');const o=document.getElementById('admin-orders-tbody');if(o)o.innerHTML=(d.orders||[]).map(x=>`<tr><td><strong>${escapeHtml(x.order_ref)}</strong></td><td>${escapeHtml(x.name)}<br>${escapeHtml(x.email)}</td><td>${escapeHtml(x.items)}</td><td>${Number(x.total_amount).toLocaleString()} RWF</td><td><select onchange="updateOrderStatus(${x.id},this.value)">${['Pending','Confirmed','Processing','Ready','Completed','Cancelled'].map(s=>`<option ${s===x.status?'selected':''}>${s}</option>`).join('')}</select></td><td>${escapeHtml(x.created_at)}</td></tr>`).join('')||'<tr><td colspan="6">No shop orders yet.</td></tr>';const i=document.getElementById('admin-inquiries-tbody');if(i)i.innerHTML=d.inquiries.map(x=>`<tr><td>${escapeHtml(x.name)}<br>${escapeHtml(x.company||'')}</td><td>${escapeHtml(x.email)}<br>${escapeHtml(x.phone||'')}</td><td>${escapeHtml(x.service_category)}</td><td>${escapeHtml(x.message)}</td><td>${escapeHtml(x.status)}</td><td>${escapeHtml(x.created_at)}</td></tr>`).join('');const u=document.getElementById('admin-users-tbody');if(u)u.innerHTML=d.users.map(x=>`<tr><td>${escapeHtml(x.name)}</td><td>${escapeHtml(x.company)}</td><td>${escapeHtml(x.email)}</td><td>${escapeHtml(x.role)}</td><td>${escapeHtml(x.last_login_at||'Never')}</td></tr>`).join('');const f=document.getElementById('admin-feedback-tbody');if(f)f.innerHTML=(d.feedback||[]).map(x=>`<tr><td>${escapeHtml(x.name)}<br>${escapeHtml(x.company||'')}</td><td>${escapeHtml(x.rating)}/5</td><td>${escapeHtml(x.comment)}</td><td>${escapeHtml(x.created_at)}</td></tr>`).join('')||'<tr><td colspan="4">No feedback received yet.</td></tr>';}catch(err){console.error(err);}}
window.updateConsultationStatus=async(id,status)=>{try{await api('admin.consultation.status',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({id,status})});}catch(err){alert(err.message);loadAdmin();}};
window.updateOrderStatus=async(id,status)=>{try{await api('admin.order.status',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({id,status})});await loadAdminPaymentView();}catch(err){alert(err.message);await loadAdminPaymentView();}};



/* ===== Merged from js/enhancements.js (shared/global module) ===== */
/* ACTUAL HOLDINGS - small progressive enhancements (safe to fail) */
(function () {
  'use strict';
  function ready(fn) { document.readyState !== 'loading' ? fn() : document.addEventListener('DOMContentLoaded', fn); }
  ready(function () {
    try {
      // Skip link for keyboard / screen-reader users
      var main = document.querySelector('main') || document.querySelector('section');
      if (main && !document.querySelector('.skip-link')) {
        if (!main.id) main.id = 'main-content';
        var skip = document.createElement('a');
        skip.className = 'skip-link'; skip.href = '#' + main.id; skip.textContent = 'Skip to main content';
        document.body.insertBefore(skip, document.body.firstChild);
      }
      // Lazy-load images that are not in the header/logo
      document.querySelectorAll('img:not([loading])').forEach(function (img) {
        if (!img.closest('header') && !img.closest('.auth-brand') && !img.closest('.auth-mobile-brand')) {
          img.setAttribute('loading', 'lazy'); img.setAttribute('decoding', 'async');
        }
      });
      // Safe external links
      document.querySelectorAll('a[href^="http"]').forEach(function (a) {
        if (a.hostname && a.hostname !== location.hostname) {
          a.setAttribute('rel', 'noopener noreferrer');
          if (!a.target) a.setAttribute('target', '_blank');
        }
      });
      // Mark the current page in the main navigation
      var here = location.pathname.split('/').pop() || 'index.html';
      document.querySelectorAll('.nav-link').forEach(function (a) {
        if ((a.getAttribute('href') || '').split('/').pop() === here) a.setAttribute('aria-current', 'page');
      });
      // Back-to-top button
      var btn = document.createElement('button');
      btn.type = 'button'; btn.className = 'back-to-top'; btn.setAttribute('aria-label', 'Back to top'); btn.innerHTML = '&uarr;';
      btn.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
      document.body.appendChild(btn);
      var onScroll = function () { btn.classList.toggle('show', window.scrollY > 600); };
      window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
      // FAQ keyboard + ARIA support (works with the existing accordion)
      document.querySelectorAll('.faq-question').forEach(function (q) {
        q.setAttribute('role', 'button'); q.setAttribute('tabindex', '0');
        q.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); q.click(); } });
      });
    } catch (err) { /* never break the page */ }
  });
})();



/* ===== Merged from js/frontend-dashboard.js; page-scoped to avoid running unrelated UI code ===== */
if (document.body.classList.contains('management-app') || document.body.classList.contains('client-app')) {
/* Shared dashboard presentation helpers. Authentication and role checks live in auth.js. */
(() => {
  'use strict';
  const SESSION_KEY = 'actualHoldingsFrontendSession';
  const getUser = () => {
    try { return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'); }
    catch (_) { return null; }
  };
  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    const inPages = window.location.pathname.includes('/pages/');
    window.location.assign(inPages ? '../login.html' : 'login.html');
  };
  const setText = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  };
  const initials = value => (String(value || 'A').trim()[0] || 'A').toUpperCase();

  document.addEventListener('DOMContentLoaded', () => {
    const user = getUser();
    if (!user) return; // auth.js redirects protected pages to sign-in.
    const page = window.location.pathname.split('/').pop();
    const employeePage = page === 'employee.html';
    const name = user.name || (employeePage ? 'Employee' : 'Account');
    [
      'sidebar-name', 'portal-name', 'user-profile-name', 'admin-name', 'owner-name',
      'hero-name', 'top-owner-name', 'top-name', 'employee-name', 'employee-hero-name'
    ].forEach(id => setText(id, name));
    [
      'sidebar-avatar', 'profile-avatar', 'admin-avatar', 'owner-avatar', 'top-avatar',
      'profile-photo', 'admin-profile-avatar', 'owner-profile-avatar', 'employee-avatar',
      'employee-top-avatar'
    ].forEach(id => {
      const el = document.getElementById(id);
      if (el && el.tagName !== 'IMG') el.textContent = initials(name);
    });
    setText('employee-role', user.position || user.role || 'Staff');
    setText('employee-hero-role', user.position || 'Your assigned work, payroll and employment information.');

    const sectionButtons = [...document.querySelectorAll('.nav-item[data-section], .mg-nav[data-section]')];
    const sectionPanels = [...document.querySelectorAll('.portal-section, .mg-section')];
    const activateSection = section => {
      sectionPanels.forEach(panel => {
        const isEmployeePanel = panel.id.startsWith('employee-section-');
        const expectedId = isEmployeePanel ? `employee-section-${section}` : `section-${section}`;
        panel.classList.toggle('active', panel.id === expectedId);
      });
      sectionButtons.forEach(button => button.classList.toggle('active', button.dataset.section === section));
      const title = sectionButtons.find(button => button.dataset.section === section)?.textContent?.trim() || section;
      setText('section-title', title);
      setText('breadcrumb-current', title);
      setText('employee-section-title', title);
      document.body.classList.remove('mobile-open', 'sidebar-open');
      const menu = document.getElementById('mobile-menu') || document.getElementById('employee-menu');
      if (menu) menu.setAttribute('aria-expanded', 'false');
    };
    sectionButtons.forEach(button => button.addEventListener('click', () => activateSection(button.dataset.section)));

    const closeSidebar = () => {
      document.body.classList.remove('mobile-open', 'sidebar-open');
      const menu = document.getElementById('mobile-menu') || document.getElementById('employee-menu');
      if (menu) menu.setAttribute('aria-expanded', 'false');
    };
    const openSidebar = () => {
      document.body.classList.add(employeePage ? 'mobile-open' : 'sidebar-open');
      const menu = document.getElementById('mobile-menu') || document.getElementById('employee-menu');
      if (menu) menu.setAttribute('aria-expanded', 'true');
    };
    ['sidebar-close', 'employee-sidebar-close'].forEach(id => document.getElementById(id)?.addEventListener('click', closeSidebar));
    ['mobile-menu', 'employee-menu'].forEach(id => document.getElementById(id)?.addEventListener('click', openSidebar));
    ['portal-backdrop', 'employee-backdrop'].forEach(id => document.getElementById(id)?.addEventListener('click', closeSidebar));
    ['logout-btn', 'top-logout-btn', 'employee-logout'].forEach(id => document.getElementById(id)?.addEventListener('click', logout));

    // This package is a frontend-only demo. Replace placeholder loading rows with an honest state,
    // but do not cancel form submissions or interfere with page-specific form handlers.
    document.querySelectorAll('tbody').forEach(body => {
      if (/^\s*<tr[^>]*>\s*<td[^>]*>Loading(?:…|\.\.\.)?<\/td>\s*<\/tr>\s*$/i.test(body.innerHTML)) {
        const cell = body.querySelector('td');
        if (cell) cell.textContent = 'No connected backend data in this frontend package.';
      }
    });
  });
})();

}


/* ===== Actual AI: responsive, fast front-end assistant (no backend/API connected yet) ===== */
if (document.body.classList.contains('ai-ui')) {
(() => {
  'use strict';
  const $ = selector => document.querySelector(selector);
  const conversation = $('#ai-conversation');
  const input = $('#ai-input');
  const form = $('#ai-form');
  if (!conversation || !input || !form) return;
  const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const family = 'ACTUAL ACCOUNTING (trading name: BDA of ACTUAL HOLDINGS CO LTD), ACTUAL PHOTOGRAPHY, ACTUAL DESIGN, and ACTUAL MUSIC';
  const companyAnswers = [
    {re:/\b(actual family|family divisions|actual accounting|actual photography|actual design|actual music)\b/i, text:`The ACTUAL Family includes ${family}. For the current scope, availability, and prices of a division, please confirm with the company directly.`},
    {re:/\b(who (are|is) you|what is actual ai|about actual ai)\b/i, text:'I’m Actual AI, the digital assistant concept for ACTUAL HOLDINGS CO LTD. In this frontend preview I can answer common company questions, explain concepts, help with basic calculations, and assist with writing or coding prompts. I am not yet connected to a live AI model, so my open-ended reasoning is limited.'},
    {re:/\b(actual holdings|company profile|about (the )?company|what does (the )?company do|who owns)\b/i, text:'ACTUAL HOLDINGS CO LTD is presented on this website as a Rwanda-based company operating from Kigali. Its online presence covers business and professional support, RRA and Irembo guidance, electronic devices/products, and the ACTUAL Family. I cannot verify legal registration, ownership, current prices, or operational status from this page alone; use official company records or contact the team for confirmation.'},
    {re:/\b(rra|tax|vat|tin|withholding tax|pay(e|roll)|declaration)\b/i, text:'I can explain general tax and accounting concepts and help prepare a checklist. RRA requirements, tax rates, filing deadlines, and eligibility can change and depend on your situation. Verify the final answer with the Rwanda Revenue Authority (RRA) or a qualified tax professional before acting.'},
    {re:/\b(irembo|permit|certificate|civil registration|government service)\b/i, text:'I can help you understand the general steps for an Irembo service. Exact requirements, fees, processing times, and supporting documents vary by service and can change. Confirm the latest details on the official Irembo platform before submitting an application or payment.'},
    {re:/\b(service|bookkeeping|accounting|financial statement|audit|consultation|business support)\b/i, text:'The website presents business and professional support as part of ACTUAL HOLDINGS CO LTD’s offering. To avoid inventing details, I cannot confirm the exact service scope, fees, turnaround time, or availability here. Review the Services page or contact the team for a confirmed quotation.'},
    {re:/\b(product|shop|laptop|phone|electronic|device|trading|buy|order|stock|warranty)\b/i, text:'For electronic devices and shop enquiries, open the Products & Shop page. I cannot see live inventory or current prices in this frontend preview, so confirm stock, warranty, delivery, and payment details with the team before ordering.'},
    {re:/\b(contact|phone number|email address|office hours|location|reach (the )?team)\b/i, text:'Please use the Contact Us page for the company’s current contact options. I will not guess a phone number, email address, or opening hours that have not been verified in the information available to this page.'},
    {re:/\b(privacy|secure|security|data|password|api key|confidential)\b/i, text:'Security reminder: do not enter passwords, verification codes, API keys, bank credentials, or private identity documents in this chat. This frontend preview does not send messages to a live AI model, but browser storage and device access still matter. A production release needs a secure backend, access controls, retention rules, and clear privacy notices.'}
  ];
  const definitions = {
    'html':'HTML (HyperText Markup Language) structures content on a web page. It defines elements such as headings, paragraphs, links, forms, and buttons.',
    'css':'CSS (Cascading Style Sheets) controls how a web page looks: layout, spacing, colours, typography, responsive behaviour, and animations.',
    'javascript':'JavaScript adds behaviour to websites, such as handling clicks, validating forms, updating content, and communicating with APIs.',
    'php':'PHP is a server-side programming language commonly used to build dynamic websites, process forms, manage sessions, and communicate with databases.',
    'api':'An API is a defined way for software systems to communicate. For an AI website, the browser should call your own secure backend, which then calls the AI provider without exposing secret keys.',
    'ai':'Artificial intelligence (AI) refers to computer systems that perform tasks associated with human intelligence, such as understanding language, recognizing patterns, and generating content. Different AI systems have different capabilities and limitations.',
    'machine learning':'Machine learning is a branch of AI in which a model learns patterns from examples rather than relying only on hand-written rules.',
    'database':'A database stores and organizes information so an application can create, read, update, and delete records in a controlled way.',
    'algorithm':'An algorithm is a finite sequence of clear steps for solving a problem or completing a task.'
  };
  function safeArithmetic(raw) {
    let s = raw.trim().replace(/,/g,'');
    const match = s.match(/(?:what is|calculate|compute|solve|evaluate|how much is)\s+(.+?)\??$/i);
    if (match) s = match[1].trim();
    if (!s || s.length > 100 || !/^[\d\s()+\-*/%.^]+$/.test(s)) return null;
    s=s.replace(/\^/g,'**');
    // Recursive-descent parser: numbers, parentheses, unary signs, + - * / % and exponentiation.
    let i=0;
    const skip=()=>{while(/\s/.test(s[i]||'')&&i<s.length)i++};
    function atom(){skip();if(s[i]==='+'){i++;return atom()}if(s[i]==='-'){i++;return -atom()}if(s[i]==='('){i++;const v=expr();skip();if(s[i]!==')')throw Error();i++;return v}const m=s.slice(i).match(/^(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?/i);if(!m)throw Error();i+=m[0].length;return Number(m[0])}
    function power(){let a=atom();skip();if(s.slice(i,i+2)==='**'){i+=2;const b=unary();a=Math.pow(a,b)}return a}
    function unary(){skip();if(s[i]==='+'){i++;return unary()}if(s[i]==='-'){i++;return -unary()}return power()}
    function term(){let a=unary();while(true){skip();const op=s[i];if(!['*','/','%'].includes(op))break;i++;const b=unary();if((op==='/'||op==='%')&&b===0)throw Error();a=op==='*'?a*b:op==='/'?a/b:a%b}return a}
    function expr(){let a=term();while(true){skip();const op=s[i];if(op!=='+'&&op!=='-')break;i++;const b=term();a=op==='+'?a+b:a-b}return a}
    try {const value=expr();skip();if(i!==s.length||!Number.isFinite(value)||Math.abs(value)>1e15)return null;return Number(value.toPrecision(12));}catch(_){return null}
  }
  function answerFor(question) {
    const q=question.trim(); const lower=q.toLowerCase();
    const calc=safeArithmetic(q);
    if(calc!==null && /\d/.test(q) && /[+*/%^()-]|\b(calculate|compute|what is|solve|evaluate|how much)\b/i.test(q)) return `The result is ${calc.toLocaleString('en-US',{maximumFractionDigits:10})}.\n\nI evaluated this as a basic arithmetic expression. If you intended a different grouping, add parentheses to make it explicit.`;
    const co=companyAnswers.find(x=>x.re.test(q)); if(co)return co.text;
    for(const [term,answer] of Object.entries(definitions)) if(new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}\\b`,'i').test(q) && /what is|define|meaning|explain|tell me about|what does/i.test(q)) return answer;
    if(/\b(hello|hi|hey|good morning|good afternoon|good evening)\b/i.test(q)) return 'Hello! I’m ready to help. Ask me about ACTUAL HOLDINGS CO LTD, a concept, a calculation, writing, or programming. You can also choose one of the suggested prompts above.';
    if(/\b(translate|translation)\b/i.test(q) && /\b(hello|thank you|good morning|how are you)\b/i.test(q)) {
      if(/hello/i.test(q)) return 'Kinyarwanda: “Muraho” (hello).';
      if(/thank you/i.test(q)) return 'Kinyarwanda: “Murakoze” (thank you).';
      if(/good morning/i.test(q)) return 'Kinyarwanda: “Mwaramutse” (good morning).';
      if(/how are you/i.test(q)) return 'Kinyarwanda: “Amakuru?” or “Umeze ute?” (how are you?).';
    }
    if(/\b(word count|count words|how many words)\b/i.test(q)) {const text=q.replace(/.*?(?:word count|count words|how many words)\s*[:\-]?/i,'').trim();return `The text you provided after the instruction contains ${text?text.split(/\s+/).length:0} words. For an accurate count of a longer passage, paste the passage after “word count:”.`}
    if(/\b(write|draft|compose|create)\b/i.test(q) && /\b(email|letter|caption|message|announcement|bio|proposal)\b/i.test(q)) return 'I can help structure that draft, but this preview does not have a full generative writing model connected. To prepare a useful draft, specify the audience, purpose, key details, and preferred tone; I can suggest a practical outline while we build the model connection.';
    if(/\b(code|coding|debug|javascript|html|css|php|python|programming|error)\b/i.test(q)) return 'I can help you narrow down a programming issue. Please share the smallest relevant code snippet, the exact error, what you expected, and what happened—remove passwords, API keys, and private data first. This preview is not connected to a code-generating AI model, so its diagnosis is limited.';
    if(/\b(step by step|explain|teach me|study|learn|definition|meaning)\b/i.test(q)) return 'I can help organize the topic into simple steps, but this preview has no general-purpose AI model connected yet. A useful learning structure is: (1) define the key idea, (2) explain how it works, (3) show a simple example, (4) point out common mistakes, and (5) give you a short practice question. Tell me the exact topic and your current level.';
    if(/\b(research|latest|current|today|news|recent|source|citation)\b/i.test(q)) return 'This page does not have live web search or verified external sources connected, so I cannot confirm current information from here. For reliable research, check primary sources, compare publication dates, and verify important claims against official or expert sources. We can connect trusted search in the backend phase.';
    if(/\b(why|how|what|when|where|who|can you|could you|help me)\b/i.test(q)) return 'I understand your question, but I do not have enough connected knowledge to answer it reliably in this preview. I will not invent an answer. For now, try a company topic, a basic calculation, or a common web-development definition. In the next phase, a secure AI model connection will enable much broader reasoning and natural answers.';
    return 'I do not have a verified answer for that yet. This is the frontend-only phase: I can answer selected company FAQs, a few common definitions, and basic arithmetic, but I am not connected to a general-purpose AI model or live search. I prefer to be transparent rather than make up facts.';
  }
  function scrollToBottom(){conversation.scrollTop=conversation.scrollHeight;}
  function addMessage(text,sender='assistant') {
    const row=document.createElement('article'); row.className=`message ${sender==='user'?'user-message':'assistant-message'}`;
    if(sender==='user'){const avatar=document.createElement('span');avatar.className='profile-dot';avatar.textContent=($('#ai-profile-initial')?.textContent||'C').slice(0,1);row.appendChild(avatar)}
    else {const avatar=document.createElement('div');avatar.className='robot-avatar small';avatar.innerHTML='<i class="fa-solid fa-brain" aria-hidden="true"></i>';row.appendChild(avatar)}
    const bubble=document.createElement('div');bubble.className='bubble';
    // Preserve line breaks while rendering text safely; never interpret user or answer text as HTML.
    String(text).split(/\n{2,}/).forEach(block=>{const p=document.createElement('p');p.textContent=block; bubble.appendChild(p)});
    const time=document.createElement('p');time.className='message-time';time.textContent=new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});bubble.appendChild(time);
    if(sender!=='user'){
      const actions=document.createElement('div');actions.className='ai-message-actions';
      const copy=document.createElement('button');copy.type='button';copy.className='ai-copy-message';copy.innerHTML='<i class="fa-regular fa-copy" aria-hidden="true"></i><span>Copy answer</span>';copy.setAttribute('aria-label','Copy assistant answer');
      copy.addEventListener('click',async()=>{
        const answer=[...bubble.querySelectorAll('p:not(.message-time)')].map(p=>p.textContent).join('\n\n');
        try{
          if(navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(answer);
          else {const temp=document.createElement('textarea');temp.value=answer;temp.style.position='fixed';temp.style.opacity='0';document.body.appendChild(temp);temp.select();const ok=document.execCommand('copy');temp.remove();if(!ok)throw new Error('copy unavailable');}
          copy.innerHTML='<i class="fa-solid fa-check" aria-hidden="true"></i><span>Copied</span>';copy.classList.add('copied');
          window.setTimeout(()=>{copy.innerHTML='<i class="fa-regular fa-copy" aria-hidden="true"></i><span>Copy answer</span>';copy.classList.remove('copied')},1600);
        }catch(_){copy.innerHTML='<i class="fa-solid fa-circle-info" aria-hidden="true"></i><span>Copy unavailable</span>';window.setTimeout(()=>{copy.innerHTML='<i class="fa-regular fa-copy" aria-hidden="true"></i><span>Copy answer</span>'},1800)}
      });actions.appendChild(copy);bubble.appendChild(actions);
    }
    row.appendChild(bubble);conversation.appendChild(row);scrollToBottom();
  }
  let busy=false, pendingAnswerTimer=null;
  function updateCount(){const counter=$('#ai-char-count');if(counter)counter.textContent=`${input.value.length.toLocaleString()} / 5000`;input.style.height='auto';input.style.height=Math.min(input.scrollHeight,150)+'px';}
  function ask(question){const clean=String(question||'').trim();if(!clean||busy)return;busy=true;addMessage(clean,'user');input.value='';updateCount();const send=$('.ai-send');if(send)send.disabled=true;
    const waiting=document.createElement('article');waiting.className='message assistant-message ai-thinking';waiting.innerHTML='<div class="robot-avatar small"><i class="fa-solid fa-brain" aria-hidden="true"></i></div><div class="bubble"><p><span class="ai-typing-dots">● ● ●</span> Thinking…</p></div>';conversation.appendChild(waiting);scrollToBottom();
    // Small delay gives the UI feedback; local rule-based answers are computed immediately afterward.
    pendingAnswerTimer=window.setTimeout(()=>{waiting.remove();addMessage(answerFor(clean));busy=false;pendingAnswerTimer=null;if(send)send.disabled=false;input.focus();},90);
  }
  function newChat(){if(pendingAnswerTimer!==null){window.clearTimeout(pendingAnswerTimer);pendingAnswerTimer=null}conversation.innerHTML='';busy=false;addMessage('New chat started. Ask about ACTUAL HOLDINGS CO LTD, company services, a basic calculation, a common concept, writing, or programming. I will tell you when this preview cannot verify an answer.');input.value='';updateCount();const send=$('.ai-send');if(send)send.disabled=false;input.focus();}
  document.addEventListener('DOMContentLoaded',()=>{
    let user=null;try{user=JSON.parse(localStorage.getItem('actualHoldingsFrontendSession')||'null')}catch(_){user=null}
    if(!user){location.replace('../login.html');return;}
    $('#ai-profile-name').textContent=user.name||'Client';$('#ai-profile-initial').textContent=(user.name||'C').trim().slice(0,1).toUpperCase();
    form.addEventListener('submit',event=>{event.preventDefault();ask(input.value)});
    document.querySelectorAll('[data-prompt]').forEach(button=>button.addEventListener('click',()=>ask(button.dataset.prompt)));
    const menuButton=$('#ai-menu');
    const closeMenu=()=>{document.body.classList.remove('menu-open');menuButton?.setAttribute('aria-expanded','false')};
    menuButton?.setAttribute('aria-expanded','false');
    menuButton?.addEventListener('click',()=>{const open=!document.body.classList.contains('menu-open');document.body.classList.toggle('menu-open',open);menuButton.setAttribute('aria-expanded',String(open));});
    $('#ai-sidebar')?.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));
    $('#ai-new-chat')?.addEventListener('click',()=>{newChat();closeMenu()});
    $('#ai-clear-chat')?.addEventListener('click',newChat);
    $('#ai-logout')?.addEventListener('click',()=>{localStorage.removeItem('actualHoldingsFrontendSession');location.href='../login.html'});
    document.addEventListener('click',event=>{if(document.body.classList.contains('menu-open')&&!event.target.closest('#ai-sidebar')&&!event.target.closest('#ai-menu'))closeMenu()});
    input.addEventListener('input',updateCount);
    input.addEventListener('keydown',event=>{if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();form.requestSubmit()}});
    const search=$('#ai-search-input');
    const promptButtons=[...document.querySelectorAll('[data-prompt]')];
    let emptySearch=$('#ai-no-search-results');
    if(!emptySearch&&search){emptySearch=document.createElement('p');emptySearch.id='ai-no-search-results';emptySearch.className='ai-no-search-results';emptySearch.textContent='No suggested prompts match your search. Try “company”, “RRA”, “learn”, or “coding”.';emptySearch.hidden=true;$('#suggested-questions')?.appendChild(emptySearch)}
    search?.addEventListener('input',event=>{const q=event.target.value.trim().toLowerCase();let visible=0;promptButtons.forEach(button=>{const match=!q||button.dataset.prompt.toLowerCase().includes(q)||button.textContent.toLowerCase().includes(q);button.hidden=!match;if(match)visible++});if(emptySearch)emptySearch.hidden=visible>0;});
    document.addEventListener('keydown',event=>{if(event.key==='Escape')closeMenu();if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='k'){event.preventDefault();input.focus()}});
    updateCount();
  });
})();
}


/* ===== Merged from js/owner-modern.js; page-scoped to avoid running unrelated UI code ===== */
if (document.body.classList.contains('owner-ui')) {
(() => {
  'use strict';
  const KEY = 'actualHoldingsOwnerCompanies';
  const ORDERS_KEY = 'actualTradingOrdersV1';
  const SERVICE_REQUESTS_KEY = 'actualHoldingServiceRequestsV1';
  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const $ = selector => document.querySelector(selector);
  const money = value => `RWF ${Number(value || 0).toLocaleString('en-RW')}`;
  const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const selectedYear = () => String($('#year-filter')?.value || '2026');
  const blankYear = () => ({ months: Object.fromEntries(MONTHS.map(month => [month, 0])), monthlyDeclarations: Object.fromEntries(MONTHS.map(month => [month, 'Not recorded'])), monthlyPayments: Object.fromEntries(MONTHS.map(month => [month, { amount: 0, status: 'Unpaid' }])), monthlyFee: 0, clientTurnover: 0, declaration: 'Pending', quarterDeclarations: { Q1: 'Not recorded', Q2: 'Not recorded', Q3: 'Not recorded', Q4: 'Not recorded' }, status: 'Review', serviceReceipts: 0, outstanding: 0 });
  let companies = [], deleteId = null, filterOpen = false, migrationBlocked = false;
  const numeric = value => Number.isFinite(Number(value)) && Number(value) > 0 ? Number(value) : 0;
  function normaliseYear(record) {
    const value = record && typeof record === 'object' ? record : {};
    const months = { ...Object.fromEntries(MONTHS.map(month => [month, 0])), ...(value.months || {}) };
    MONTHS.forEach(month => months[month] = numeric(months[month]));
    const defaults = blankYear();
    const monthlyDeclarations = { ...defaults.monthlyDeclarations, ...(value.monthlyDeclarations || {}) };
    const monthlyPayments = { ...defaults.monthlyPayments, ...(value.monthlyPayments || {}) };
    MONTHS.forEach(month => { if (typeof monthlyPayments[month] !== 'object' || monthlyPayments[month] === null) monthlyPayments[month] = { amount: numeric(monthlyPayments[month]), status: 'Unpaid' }; monthlyPayments[month] = { amount: numeric(monthlyPayments[month].amount), status: ['Paid','Unpaid','Not Applicable'].includes(monthlyPayments[month].status) ? monthlyPayments[month].status : 'Unpaid' }; });
    return { ...defaults, ...value, months, monthlyDeclarations, monthlyPayments, monthlyFee: numeric(value.monthlyFee), clientTurnover: numeric(value.clientTurnover), quarterDeclarations: { ...defaults.quarterDeclarations, ...(value.quarterDeclarations || {}) }, tax: MONTHS.reduce((sum, month) => sum + numeric(months[month]), 0), serviceReceipts: numeric(value.serviceReceipts), outstanding: numeric(value.outstanding) };
  }
  function load() {
    const originalRaw = localStorage.getItem(KEY) || '[]';
    let parsed;
    try { parsed = JSON.parse(originalRaw); if (!Array.isArray(parsed)) throw new Error('Stored company data is not a list'); companies = parsed; }
    catch (_) { companies = []; parsed = []; migrationBlocked = true; alert('Owner data could not be read as valid JSON. The stored data has not been replaced. Restore a valid backup before continuing.'); return; }
    // Copy-first migration. Confirmed legacy monthly values belong to 2026.
    let changed = false;
    const migrated = companies.map(original => {
      const company = { ...original };
      const legacyTurnover = numeric(company.clientTurnover ?? company.revenue);
      const legacyFee = numeric(company.monthlyFee);
      if (!company.years || typeof company.years !== 'object' || Array.isArray(company.years)) {
        const legacyMonths = company.months && typeof company.months === 'object' ? company.months : {};
        company.years = { '2026': normaliseYear({ months: legacyMonths, declaration: company.declaration || 'Pending', status: company.status || 'Review', tax: company.tax, monthlyFee: legacyFee, clientTurnover: legacyTurnover }) };
        changed = true;
      } else {
        const normalizedYears = {};
        Object.entries(company.years).forEach(([year, rawRecord]) => {
          const record = rawRecord && typeof rawRecord === 'object' ? rawRecord : {};
          if (!Object.prototype.hasOwnProperty.call(record, 'monthlyFee') || !Object.prototype.hasOwnProperty.call(record, 'clientTurnover')) changed = true;
          const fee = Object.prototype.hasOwnProperty.call(record, 'monthlyFee') ? numeric(record.monthlyFee) : legacyFee;
          const turnover = Object.prototype.hasOwnProperty.call(record, 'clientTurnover') ? numeric(record.clientTurnover) : (String(year) === '2026' ? legacyTurnover : 0);
          const normalized = normaliseYear({ ...record, monthlyFee: fee, clientTurnover: turnover });
          // Old versions stored the same global monthly fee in the yearly ledger. Preserve recorded Paid amounts; seed missing unpaid amounts from the best available fee.
          MONTHS.forEach(month => {
            const payment = normalized.monthlyPayments[month];
            if (payment.status === 'Unpaid' && payment.amount === 0 && fee > 0) { normalized.monthlyPayments[month] = { amount: fee, status: 'Unpaid' }; changed = true; }
          });
          normalizedYears[String(year)] = normalized;
        });
        company.years = normalizedYears;
      }
      company.clientTurnover = legacyTurnover; // legacy compatibility only; current values live in company.years[year].clientTurnover
      company.name = String(company.name || ''); company.tin = String(company.tin || ''); company.phone = String(company.phone || ''); company.email = String(company.email || ''); company.address = String(company.address || ''); company.contactPerson = String(company.contactPerson || ''); company.service = String(company.service || ''); company.monthlyFee = legacyFee;
      return company;
    });
    if (changed) {
      let backupKey = `${KEY}_backup_before_year_migration_20261029`;
      try {
        const existingBackup = localStorage.getItem(backupKey);
        if (existingBackup !== null && existingBackup !== originalRaw) backupKey = `${backupKey}_${Date.now()}`;
        if (localStorage.getItem(backupKey) === null) localStorage.setItem(backupKey, originalRaw);
        if (localStorage.getItem(backupKey) !== originalRaw) throw new Error('Backup could not be verified against the original data');
        const migratedRaw = JSON.stringify(migrated);
        localStorage.setItem(KEY, migratedRaw);
        if (localStorage.getItem(KEY) !== migratedRaw) throw new Error('Migrated data could not be verified after writing');
        companies = migrated;
      } catch (error) {
        companies = parsed; migrationBlocked = true;
        alert('The data migration could not be safely completed. The original records are being kept in memory and saving is paused. Download or restore a backup before retrying.');
        console.error('Owner data migration blocked:', error);
      }
    } else companies = migrated;
  }
  function save() {
    if (migrationBlocked) { toast('Saving is paused because the migration backup could not be verified.'); return false; }
    try { const raw = JSON.stringify(companies); localStorage.setItem(KEY, raw); if (localStorage.getItem(KEY) !== raw) throw new Error('Saved data could not be verified'); return true; } catch (error) { console.error('Owner data save failed:', error); toast('Could not save changes to browser storage. Download a backup and check available storage.'); return false; }
  }
  function toast(message) { const item = $('#toast'); if (!item) return; item.textContent = message; item.classList.add('show'); clearTimeout(toast.timer); toast.timer = setTimeout(() => item.classList.remove('show'), 2800); }
  function sessionUser() { try { return JSON.parse(localStorage.getItem('actualHoldingsFrontendSession') || 'null'); } catch (_) { return null; } }
  function getYearRecord(company, year = selectedYear()) { return normaliseYear(company.years?.[String(year)] || blankYear()); }
  function ensureYearRecord(company, year = selectedYear()) { company.years = company.years || {}; if (!company.years[String(year)]) company.years[String(year)] = blankYear(); company.years[String(year)] = normaliseYear(company.years[String(year)]); return company.years[String(year)]; }
  function matchingCompanies() {
    const query = ($('#global-search')?.value || '').trim().toLowerCase();
    if (!query) return companies;
    return companies.filter(company => `${company.name} ${company.tin} ${company.phone}`.toLowerCase().includes(query));
  }
  function statusClass(status) { return status === 'Compliant' ? 'status-compliant' : status === 'Review' ? 'status-review' : 'status-overdue'; }
  function row(company, index) {
    const year = getYearRecord(company);
    const months = MONTHS.map(month => { const value = year.monthlyDeclarations[month] || 'Not recorded'; return `<td><select class="monthly-declaration" data-id="${escape(company.id)}" data-year="${selectedYear()}" data-month="${month}" aria-label="${month} VAT declaration status for ${escape(company.name)}"><option ${value === 'Not recorded' ? 'selected' : ''}>Not recorded</option><option ${value === 'Declared' ? 'selected' : ''}>Declared</option><option ${value === 'Pending' ? 'selected' : ''}>Pending</option><option ${value === 'Not Declared' ? 'selected' : ''}>Not Declared</option></select></td>`; }).join('');
    return `<tr><td>${index + 1}</td><td>${escape(company.tin)}</td><td>${escape(company.name)}</td><td>${escape(company.phone || '—')}</td>${months}<td><select class="declaration-select" data-id="${escape(company.id)}" data-year="${selectedYear()}" aria-label="Annual declaration status for ${escape(company.name)}"><option value="Declared" ${year.declaration === 'Declared' ? 'selected' : ''}>Declared</option><option value="Pending" ${year.declaration === 'Pending' ? 'selected' : ''}>Pending</option><option value="Not Declared" ${year.declaration === 'Not Declared' ? 'selected' : ''}>Not Declared</option></select></td><td><span class="status-pill ${statusClass(year.status)}">${escape(year.status)}</span></td><td><div class="row-actions"><button class="row-edit" data-action="edit" data-id="${escape(company.id)}" title="Edit company"><i class="fa-solid fa-pen"></i></button><button class="row-view" data-action="view" data-id="${escape(company.id)}" title="View company/year"><i class="fa-solid fa-eye"></i></button><button class="row-delete" data-action="delete" data-id="${escape(company.id)}" title="Delete company"><i class="fa-solid fa-trash"></i></button></div></td></tr>`;
  }
  function readOrders() { try { const data = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]'); return Array.isArray(data) ? data : []; } catch (_) { return []; } }
  function orderIsPaid(order) { return /^(paid|completed|payment confirmed|confirmed)$/i.test(String(order.status || '').trim()); }
  function orderIsCancelled(order) { return /cancel|fail|reject|refund/i.test(String(order.status || '').trim()); }
  function orderYear(order) { if (order.year) return String(order.year); const raw = String(order.createdAt || order.date || ''); const dmy = raw.match(/^(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{4})/); if (dmy) return dmy[3]; const date = new Date(raw); return Number.isNaN(date.getTime()) ? '' : String(date.getFullYear()); }
  function financeTotals(year = selectedYear()) {
    const yearRecords = companies.map(company => getYearRecord(company, year));
    const otherServiceReceipts = yearRecords.reduce((sum, record) => sum + numeric(record.serviceReceipts), 0);
    const monthlyFeeReceipts = yearRecords.reduce((sum, record) => sum + MONTHS.reduce((monthSum, month) => { const payment = record.monthlyPayments[month] || {}; return monthSum + (payment.status === 'Paid' ? numeric(payment.amount) : 0); }, 0), 0);
    const serviceReceipts = otherServiceReceipts + monthlyFeeReceipts;
    const shopOrders = readOrders().filter(order => orderYear(order) === year && !orderIsCancelled(order));
    const tradingRevenue = shopOrders.filter(orderIsPaid).reduce((sum, order) => sum + numeric(order.total), 0);
    const serviceRequests = (() => { try { const value = JSON.parse(localStorage.getItem(SERVICE_REQUESTS_KEY) || '[]'); return Array.isArray(value) ? value : []; } catch (_) { return []; } })();
    const yearServiceRequests = serviceRequests.filter(request => String(request.year || orderYear(request)) === String(year));
    const serviceRequestReceipts = yearServiceRequests.reduce((sum, request) => sum + numeric(request.paidAmount), 0);
    const serviceRequestOutstanding = yearServiceRequests.filter(request => !/^(cancelled|rejected)$/i.test(String(request.status || ''))).reduce((sum, request) => sum + Math.max(0, numeric(request.agreedFee) - numeric(request.paidAmount)), 0);
    const orderOutstanding = shopOrders.filter(order => !orderIsPaid(order) && !orderIsCancelled(order)).reduce((sum, order) => sum + Math.max(0, numeric(order.total) - numeric(order.amountPaid)), 0);
    const recordedOutstanding = yearRecords.reduce((sum, record) => sum + numeric(record.outstanding) + MONTHS.reduce((monthSum, month) => { const payment = record.monthlyPayments[month] || {}; return monthSum + (payment.status === 'Unpaid' ? numeric(payment.amount) : 0); }, 0), 0);
    return { serviceReceipts, otherServiceReceipts, monthlyFeeReceipts, serviceRequestReceipts, tradingRevenue, totalRevenue: serviceReceipts + tradingRevenue + serviceRequestReceipts, outstanding: recordedOutstanding + orderOutstanding + serviceRequestOutstanding, taxDue: yearRecords.reduce((sum, record) => sum + record.tax, 0), yearRecords };
  }
  function renderDashboard() {
    const current = matchingCompanies(), year = selectedYear(), totals = financeTotals(year);
    $('#company-rows').innerHTML = current.length ? current.map(row).join('') : '<tr><td colspan="19">No company records match your search.</td></tr>';
    $('#table-summary').textContent = `Showing ${current.length} of ${companies.length} companies · Reporting year ${year}`;
    $('#metric-clients').textContent = companies.length;
    $('#metric-revenue').textContent = money(totals.totalRevenue);
    $('#trading-revenue').textContent = money(totals.tradingRevenue);
    $('#metric-outstanding').textContent = money(totals.outstanding);
    $('#tax-due').textContent = money(totals.taxDue);
    const needsReview = totals.yearRecords.filter(record => record.status !== 'Compliant' || record.declaration !== 'Declared').length;
    $('#reminder-copy').textContent = `${needsReview} ${needsReview === 1 ? 'company requires' : 'companies require'} VAT review for ${year}.`;
    renderClients(); renderFinance(); renderNotifications();
  }
  function renderClients() {
    const target = $('#clients-panel'); if (!target) return;
    target.innerHTML = companies.length ? `<div class="client-management-intro"><div><h2>Client directory</h2><p>Manage company identity, contact details, service fees and each month's payment status for ${selectedYear()}.</p></div><span class="client-count">${companies.length} client${companies.length === 1 ? '' : 's'}</span></div><div class="client-list">${companies.map(company => { const y = getYearRecord(company); const payments = MONTHS.map(month => { const p = y.monthlyPayments[month] || {amount: y.monthlyFee || 0, status:'Unpaid'}; return `<tr><td>${month}</td><td>${money(p.amount)}</td><td><select class="client-payment-status" data-id="${escape(company.id)}" data-year="${selectedYear()}" data-month="${month}" aria-label="${month} payment status for ${escape(company.name)}"><option ${p.status === 'Paid' ? 'selected' : ''}>Paid</option><option ${p.status === 'Unpaid' ? 'selected' : ''}>Unpaid</option><option ${p.status === 'Not Applicable' ? 'selected' : ''}>Not Applicable</option></select></td></tr>`; }).join(''); return `<article class="client-management-card"><div class="client-card-head"><div class="client-avatar">${escape((company.name || 'C').trim().slice(0,1).toUpperCase())}</div><div class="client-identity"><strong>${escape(company.name)}</strong><small>TIN: ${escape(company.tin)} · ${escape(company.service || 'Service not specified')}</small><small>${escape(company.contactPerson || 'Contact person not specified')} · ${escape(company.phone || 'No phone')} · ${escape(company.email || 'No email')}</small><small>${escape(company.address || 'Address not recorded')}</small></div><span class="status-pill ${statusClass(y.status)}">${escape(y.status)}</span><div class="row-actions"><button class="row-edit" data-action="edit" data-id="${escape(company.id)}" title="Edit client details"><i class="fa-solid fa-pen"></i></button><button class="row-delete" data-action="delete" data-id="${escape(company.id)}" title="Delete client"><i class="fa-solid fa-trash"></i></button></div></div><div class="client-finance-strip"><span><small>Monthly service fee · ${selectedYear()}</small><strong>${money(y.monthlyFee)}</strong></span><span><small>Annual company turnover · ${selectedYear()}</small><strong>${money(y.clientTurnover)}</strong></span><span><small>Other service receipts · ${selectedYear()}</small><strong>${money(y.serviceReceipts)}</strong></span><span><small>Other unpaid balance · ${selectedYear()}</small><strong>${money(y.outstanding)}</strong></span><span><small>Annual VAT declaration · ${selectedYear()}</small><strong>${escape(y.declaration)}</strong></span></div><div class="client-quarter-status"><strong>Quarterly VAT declarations · ${selectedYear()}</strong><div>${['Q1','Q2','Q3','Q4'].map(q => `<label>${q}<select class="quarter-declaration" data-id="${escape(company.id)}" data-year="${selectedYear()}" data-quarter="${q}" aria-label="${q} VAT declaration status for ${escape(company.name)}"><option ${y.quarterDeclarations[q] === 'Not recorded' ? 'selected' : ''}>Not recorded</option><option ${y.quarterDeclarations[q] === 'Declared' ? 'selected' : ''}>Declared</option><option ${y.quarterDeclarations[q] === 'Pending' ? 'selected' : ''}>Pending</option><option ${y.quarterDeclarations[q] === 'Not Declared' ? 'selected' : ''}>Not Declared</option></select></label>`).join('')}</div></div><details class="payment-ledger"><summary><i class="fa-solid fa-calendar-check"></i> Monthly payment ledger · ${selectedYear()}</summary><div class="payment-ledger-scroll"><table><thead><tr><th>Month</th><th>Monthly fee</th><th>Payment status</th></tr></thead><tbody>${payments}</tbody></table></div></details></article>`; }).join('')}</div>` : `<div class="client-empty"><i class="fa-solid fa-users"></i><h2>No clients added yet</h2><p>Add your first client to keep their company information, monthly fee and payment status in one place.</p><button class="add-button" type="button" id="empty-add-client"><i class="fa-solid fa-plus"></i> Add your first client</button></div>`;
    $('#empty-add-client')?.addEventListener('click', () => openForm());
  }
  function renderFinance() {
    const totals = financeTotals();
    $('#finance-panel').innerHTML = `<div class="finance-summary"><article><small>Total revenue received · ${selectedYear()}</small><strong>${money(totals.totalRevenue)}</strong><p>Confirmed payments only: client service receipts ${money(totals.serviceReceipts)} (monthly fees paid: ${money(totals.monthlyFeeReceipts)}; other service payments: ${money(totals.otherServiceReceipts)}) plus service-request receipts ${money(totals.serviceRequestReceipts)} and ACTUAL Trading paid orders ${money(totals.tradingRevenue)}. Unpaid amounts are excluded.</p></article><article><small>Client VAT amounts recorded · ${selectedYear()}</small><strong>${money(totals.taxDue)}</strong><p>These are client tax/declaration amounts, not ACTUAL HOLDINGS revenue.</p></article><article><small>Unpaid client fees and shop balances · ${selectedYear()}</small><strong>${money(totals.outstanding)}</strong><p>This is money clients still owe ACTUAL HOLDINGS: unpaid monthly service fees, other recorded client balances, unpaid shop orders, and balances on service requests. It is not revenue received.</p></article><article><small>Declarations not marked submitted</small><strong>${totals.yearRecords.filter(record => record.declaration !== 'Declared').length}</strong><p>Based on the selected reporting year.</p></article></div><p class="finance-note">Frontend-only ledger: receipts and balances are editable records, not verified bank transactions. Shop orders count as revenue only when their status is marked Paid, Completed, Payment Confirmed, or Confirmed.</p>`;
  }
  function renderNotifications() {
    const issues = companies.filter(company => { const y = getYearRecord(company); return y.status !== 'Compliant' || y.declaration !== 'Declared'; });
    const panel = $('#notifications-panel');
    panel.innerHTML = issues.length ? issues.map(company => { const y = getYearRecord(company); return `<article class="notice"><i class="fa-solid fa-triangle-exclamation"></i><div><strong>${escape(company.name)}</strong><p>${escape(selectedYear())}: ${y.declaration === 'Not Declared' ? 'Declaration has not been submitted.' : y.declaration === 'Pending' ? 'Declaration is pending.' : 'Compliance review is required.'}</p></div><span class="status-pill ${statusClass(y.status)}">${escape(y.status)}</span></article>`; }).join('') : '<div class="notice good"><i class="fa-solid fa-circle-check"></i><div><strong>All caught up</strong><p>No compliance actions require attention for this year.</p></div></div>';
    let commerceNotices = []; try { commerceNotices = JSON.parse(localStorage.getItem('actualHoldingOwnerNotificationsV1') || '[]'); if (!Array.isArray(commerceNotices)) commerceNotices = []; } catch (_) { commerceNotices = []; }
    if (commerceNotices.length) { const commerceHtml = commerceNotices.slice(0, 30).map(note => `<article class="notice"><i class="fa-solid fa-bell"></i><div><strong>${escape(note.title || 'Update')}</strong><p>${escape(note.message || '')}</p><small>${escape(note.createdAt ? new Date(note.createdAt).toLocaleString() : '')}</small></div></article>`).join(''); panel.insertAdjacentHTML('afterbegin', commerceHtml); }
    const count = issues.length + commerceNotices.filter(note => !note.read).length; ['message-badge','top-message-badge'].forEach(id => { const item = document.getElementById(id); if (item) item.textContent = 0; }); ['notification-badge','top-notification-badge'].forEach(id => { const item = document.getElementById(id); if (item) item.textContent = count; });
  }
  function openForm(company = null) {
    $('#company-form').reset(); $('#company-id').value = company?.id ?? ''; $('#dialog-title').textContent = company ? 'Edit Company' : 'Add Company'; $('#dialog-eyebrow').textContent = company ? `UPDATE COMPANY · ${selectedYear()}` : `NEW COMPANY · ${selectedYear()}`; $('#quarterly-year-label').textContent = selectedYear();
    const y = company ? getYearRecord(company) : blankYear();
    if (company) { $('#company-name').value = company.name || ''; $('#company-tin').value = company.tin || ''; $('#company-phone').value = company.phone || ''; $('#company-email').value = company.email || ''; $('#company-address').value = company.address || ''; $('#company-contact-person').value = company.contactPerson || ''; $('#company-service').value = company.service || ''; $('#company-monthly-fee').value = numeric(y.monthlyFee ?? company.monthlyFee); $('#company-revenue').value = numeric(y.clientTurnover ?? company.clientTurnover ?? company.revenue); $('#company-declaration').value = y.declaration; $('#company-status').value = y.status; $('#company-service-receipts').value = y.serviceReceipts; $('#company-outstanding').value = y.outstanding; ['Q1','Q2','Q3','Q4'].forEach(q => { const field = $(`#quarter-${q.toLowerCase()}`); if (field) field.value = y.quarterDeclarations[q] || 'Not recorded'; }); }
    else { $('#company-email').value = ''; $('#company-address').value = ''; $('#company-contact-person').value = ''; $('#company-service').value = ''; $('#company-monthly-fee').value = '0'; $('#company-revenue').value = '0'; $('#company-declaration').value = 'Pending'; $('#company-status').value = 'Review'; $('#company-service-receipts').value = '0'; $('#company-outstanding').value = '0'; ['Q1','Q2','Q3','Q4'].forEach(q => { const field = $(`#quarter-${q.toLowerCase()}`); if (field) field.value = 'Not recorded'; }); }
    $('#company-dialog').showModal(); $('#company-name').focus();
  }
  function editCompany(id) { const company = companies.find(item => String(item.id) === String(id)); if (company) openForm(company); }
  function saveCompany(event) {
    event.preventDefault(); const originalCompanies = companies; const rawId = $('#company-id').value; const previous = companies.find(item => String(item.id) === rawId);
    const id = previous ? previous.id : (rawId ? rawId : Date.now());
    const year = selectedYear();
    const company = previous ? { ...previous, years: { ...(previous.years || {}) } } : { id, years: {} };
    company.name = $('#company-name').value.trim(); company.tin = $('#company-tin').value.trim(); company.phone = $('#company-phone').value.trim(); company.email = $('#company-email').value.trim(); company.address = $('#company-address').value.trim(); company.contactPerson = $('#company-contact-person').value.trim(); company.service = $('#company-service').value.trim(); const enteredMonthlyFee = numeric($('#company-monthly-fee').value); const enteredTurnover = numeric($('#company-revenue').value);
    const y = ensureYearRecord(company, year); y.monthlyFee = enteredMonthlyFee; y.clientTurnover = enteredTurnover; company.monthlyFee = enteredMonthlyFee; company.clientTurnover = enteredTurnover; company.revenue = enteredTurnover; y.monthlyPayments = y.monthlyPayments || {}; MONTHS.forEach(month => { const old = y.monthlyPayments[month] || {}; const status = old.status || 'Unpaid'; const oldAmount = numeric(old.amount); y.monthlyPayments[month] = { amount: status === 'Paid' ? oldAmount : status === 'Not Applicable' ? 0 : enteredMonthlyFee, status }; }); y.declaration = $('#company-declaration').value; y.status = $('#company-status').value; y.quarterDeclarations = { ...(y.quarterDeclarations || {}) }; ['Q1','Q2','Q3','Q4'].forEach(q => { const field = $(`#quarter-${q.toLowerCase()}`); if (field) y.quarterDeclarations[q] = field.value; }); y.serviceReceipts = numeric($('#company-service-receipts').value); y.outstanding = numeric($('#company-outstanding').value); y.tax = MONTHS.reduce((sum, month) => sum + numeric(y.months[month]), 0);
    if (companies.some(item => item.tin === company.tin && String(item.id) !== String(id))) { toast('That TIN already exists.'); return; }
    if (previous) { companies = companies.map(item => String(item.id) === String(id) ? company : item); toast(`Company updated for ${year}.`); } else { companies.unshift(company); toast(`Company added. VAT records start in ${year}.`); }
    if (!save()) { companies = originalCompanies; return; } $('#company-dialog').close(); renderDashboard();
  }
  function openView(id) { const company = companies.find(item => String(item.id) === String(id)); if (!company) return; const y = getYearRecord(company); toast(`${company.name} · ${selectedYear()}: ${y.declaration}, ${y.status}, tax ${money(y.tax)}.`); }
  function updateDeclaration(target) { const id = target.dataset.id, year = target.dataset.year, previousCompanies = companies; companies = companies.map(company => { if (String(company.id) !== String(id)) return company; const copy = { ...company, years: { ...(company.years || {}) } }; ensureYearRecord(copy, year).declaration = target.value; return copy; }); if (!save()) { companies = previousCompanies; return; } renderDashboard(); toast(`Declaration status updated for ${year}.`); }
  function updateMonthlyDeclaration(target) { const { id, year, month } = target.dataset, previousCompanies = companies; companies = companies.map(company => { if (String(company.id) !== String(id)) return company; const copy = { ...company, years: { ...(company.years || {}) } }; ensureYearRecord(copy, year).monthlyDeclarations[month] = target.value; return copy; }); if (!save()) { companies = previousCompanies; return; } renderDashboard(); toast(`${month} ${year} VAT declaration set to ${target.value}.`); }
  function updateClientPayment(target) { const { id, year, month } = target.dataset; const previousCompanies = companies; companies = companies.map(company => { if (String(company.id) !== String(id)) return company; const copy = { ...company, years: { ...(company.years || {}) } }; const y = ensureYearRecord(copy, year); y.monthlyPayments[month] = { amount: target.value === 'Not Applicable' ? 0 : numeric(y.monthlyFee ?? copy.monthlyFee), status: target.value }; return copy; }); if (!save()) { companies = previousCompanies; return; } renderDashboard(); toast(`${month} ${year} payment marked ${target.value}.`); }
  function updateQuarterDeclaration(target) { const { id, year, quarter } = target.dataset; const previousCompanies = companies; companies = companies.map(company => { if (String(company.id) !== String(id)) return company; const copy = { ...company, years: { ...(company.years || {}) } }; ensureYearRecord(copy, year).quarterDeclarations[quarter] = target.value; return copy; }); if (!save()) { companies = previousCompanies; return; } renderDashboard(); toast(`${quarter} ${year} VAT declaration set to ${target.value}.`); }
  function askDelete(id) { deleteId = id; $('#confirm-dialog').showModal(); }
  function deleteCompany() { if (deleteId === null) return; const previousCompanies = companies; companies = companies.filter(company => String(company.id) !== String(deleteId)); if (!save()) { companies = previousCompanies; return; } $('#confirm-dialog').close(); deleteId = null; renderDashboard(); toast('Company deleted from all year records.'); }
  function exportCsv() {
    const year = selectedYear();
    const headers = ['Reporting Year','TIN','Company Name','Phone','Email','Contact Person','Address','Service','Monthly Service Fee (RWF)','Annual Client Turnover (RWF)','Other Confirmed Service Receipts (RWF)','Other Outstanding Balance (RWF)','Annual VAT Declaration','Q1 Declaration','Q2 Declaration','Q3 Declaration','Q4 Declaration','Status'];
    MONTHS.forEach(month => headers.push(`${month} VAT Amount (RWF)`, `${month} VAT Declaration`, `${month} Monthly Fee (RWF)`, `${month} Payment Status`));
    headers.push('Annual VAT Amount Total (RWF)');
    const lines = [headers, ...companies.map(company => {
      const y = getYearRecord(company, year);
      const row = [year,company.tin,company.name,company.phone,company.email,company.contactPerson,company.address,company.service,y.monthlyFee,y.clientTurnover,y.serviceReceipts,y.outstanding,y.declaration,y.quarterDeclarations.Q1,y.quarterDeclarations.Q2,y.quarterDeclarations.Q3,y.quarterDeclarations.Q4,y.status];
      MONTHS.forEach(month => { const payment = y.monthlyPayments[month] || { amount: 0, status: 'Unpaid' }; row.push(y.months[month], y.monthlyDeclarations[month], payment.amount, payment.status); });
      row.push(y.tax);
      return row;
    })];
    const csv = lines.map(line => line.map(value => `"${String(value ?? '').replaceAll('"','""')}"`).join(',')).join('\n');
    const link = document.createElement('a'); link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' })); link.download = `actual-holdings-vat-${year}.csv`; link.click(); setTimeout(() => URL.revokeObjectURL(link.href), 1000); toast(`${year} client, VAT and payment report exported.`);
  }
  function downloadBackup() { const rawCompanyStorage = localStorage.getItem(KEY); const backup = { createdAt: new Date().toISOString(), note: 'ACTUAL HOLDINGS frontend browser-data backup. Keep this file private.', rawCompanyStorage, companies: (() => { try { return JSON.parse(rawCompanyStorage || '[]'); } catch (_) { return null; } })(), tradingOrders: readOrders(), tradingProducts: (() => { try { return JSON.parse(localStorage.getItem('actualTradingProductsV1') || '[]'); } catch (_) { return []; } })() }; const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' }); const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = `actual-holdings-browser-backup-${new Date().toISOString().slice(0,10)}.json`; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); toast('Browser data backup downloaded. Store it privately.'); }
  function showView(name) { document.querySelectorAll('.dashboard-view').forEach(view => view.classList.toggle('active', view.id === `view-${name}`)); document.querySelectorAll('.owner-nav-link').forEach(button => button.classList.toggle('active', button.dataset.view === name)); window.scrollTo({ top: 0, behavior: 'smooth' }); document.body.classList.remove('mobile-open'); }
  function bindEvents() {
    document.querySelectorAll('[data-view]').forEach(button => button.addEventListener('click', () => showView(button.dataset.view)));
    $('#add-company').addEventListener('click', () => openForm()); $('#quick-add').addEventListener('click', () => openForm()); document.querySelector('.section-add').addEventListener('click', () => openForm());
    $('#company-form').addEventListener('submit', saveCompany); document.querySelectorAll('[data-close-dialog]').forEach(button => button.addEventListener('click', () => $('#company-dialog').close()));
    $('#company-rows').addEventListener('click', event => { const button = event.target.closest('[data-action]'); if (!button) return; const action = button.dataset.action; if (action === 'edit') editCompany(button.dataset.id); if (action === 'view') openView(button.dataset.id); if (action === 'delete') askDelete(button.dataset.id); });
    $('#clients-panel').addEventListener('click', event => { const button = event.target.closest('[data-action]'); if (!button) return; button.dataset.action === 'edit' ? editCompany(button.dataset.id) : askDelete(button.dataset.id); });
    $('#company-rows').addEventListener('change', event => { if (event.target.matches('.declaration-select')) updateDeclaration(event.target); if (event.target.matches('.monthly-declaration')) updateMonthlyDeclaration(event.target); });
    $('#clients-panel').addEventListener('change', event => { if (event.target.matches('.client-payment-status')) updateClientPayment(event.target); if (event.target.matches('.quarter-declaration')) updateQuarterDeclaration(event.target); });
    $('#confirm-delete').addEventListener('click', deleteCompany); $('#cancel-delete').addEventListener('click', () => $('#confirm-dialog').close());
    $('#global-search').addEventListener('input', renderDashboard); $('#filter-button')?.addEventListener('click', () => { filterOpen = !filterOpen; $('#global-search').focus(); toast(filterOpen ? 'Type a company name or TIN to filter results.' : 'Filter closed.'); }); $('#reset-button')?.addEventListener('click', () => { $('#global-search').value = ''; renderDashboard(); toast('Filters reset.'); }); $('#export-button').addEventListener('click', exportCsv);
    $('#year-filter').addEventListener('change', renderDashboard);
    $('#collapse-sidebar').addEventListener('click', () => document.body.classList.toggle('sidebar-collapsed')); $('#mobile-toggle').addEventListener('click', () => document.body.classList.toggle('mobile-open'));
    $('#profile-action').addEventListener('click', () => { if (confirm('Leave the Owner frontend demo and return to login?')) { localStorage.removeItem('actualHoldingsFrontendSession'); window.location.assign('../login.html'); } });
    $('#owner-backup-download')?.addEventListener('click', downloadBackup);
    $('#clear-demo').addEventListener('click', () => { if (!confirm('Delete all company records from this browser? Export or back up first.')) return; const previousCompanies = companies; companies = []; if (!save()) { companies = previousCompanies; return; } renderDashboard(); toast('All company records cleared.'); });
  }
  function init() {
    load();
    const user = sessionUser() || { role: 'owner' };
    // The ACTUAL HOLDINGS owner display name is fixed by the project owner.
    user.role = 'owner';
    user.name = 'MUGISHA J.D.';
    try { localStorage.setItem('actualHoldingsFrontendSession', JSON.stringify(user)); } catch (_) {}
    $('#profile-name').textContent = 'MUGISHA J.D.';
    $('#welcome-name').textContent = 'MUGISHA J.D.';
    $('#profile-initial').textContent = 'M';
    $('#today-label').textContent = new Intl.DateTimeFormat('en-RW', { weekday:'long', day:'numeric', month:'long', year:'numeric', hour:'2-digit', minute:'2-digit' }).format(new Date());
    bindEvents(); renderDashboard(); window.addEventListener('actual:commerce-updated', renderDashboard);
  }
  document.addEventListener('DOMContentLoaded', init);
})();

}


/* ===== Merged from js/owner-commerce.js; page-scoped to avoid running unrelated UI code ===== */
if (document.body.classList.contains('owner-ui')) {
(() => {
  'use strict';
  const KEYS = { products:'actualTradingProductsV1', orders:'actualTradingOrdersV1', services:'actualHoldingServicesV1', requests:'actualHoldingServiceRequestsV1', notifications:'actualHoldingOwnerNotificationsV1' };
  const $ = (s, root=document) => root.querySelector(s);
  const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const num = v => Number.isFinite(Number(v)) && Number(v) >= 0 ? Number(v) : 0;
  const money = v => `RWF ${num(v).toLocaleString('en-RW')}`;
  const read = (key, fallback=[]) => { try { const v = JSON.parse(localStorage.getItem(key)); return Array.isArray(v) ? v : fallback; } catch (_) { return fallback; } };
  const write = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch (_) { alert('Could not save. Browser storage may be full. Download a backup or use a smaller image, then try again.'); return false; } };
  const id = prefix => `${prefix}-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2,7).toUpperCase()}`;
  let products=[], orders=[], services=[], requests=[], imageData='', editingProduct=null, editingService=null;
  const notify = (title, message) => { const all=read(KEYS.notifications); all.unshift({id:id('NOT'), title, message, createdAt:new Date().toISOString(), read:false}); write(KEYS.notifications, all.slice(0,100)); };
  const activeYear = () => document.querySelector('#year-filter')?.value || String(new Date().getFullYear());
  function addStyle(){ if ($('#owner-commerce-style')) return; const link=document.createElement('link'); link.id='owner-commerce-style'; link.rel='stylesheet'; link.href='../css/owner-commerce.css'; document.head.append(link); }
  function setupMarkup(){
    const shop=$('#view-shop'); if(shop) shop.innerHTML=`<div class="section-heading commerce-heading"><div><span>ACTUAL TRADING</span><h1>Trading & Inventory</h1><p>Manage products, stock, restocking, shop orders and confirmed sales.</p></div><button class="add-button" id="commerce-add-product"><i class="fa-solid fa-plus"></i> Add Product</button></div>
      <div class="commerce-metrics" id="commerce-product-metrics"></div><div class="commerce-tabs" role="tablist"><button class="is-active" data-commerce-tab="products">Products & Stock</button><button data-commerce-tab="orders">Shop Orders</button><button data-commerce-tab="movements">Stock Movements</button></div>
      <div id="commerce-products-panel" class="section-panel commerce-panel"></div><div id="commerce-orders-panel" class="section-panel commerce-panel" hidden></div><div id="commerce-movements-panel" class="section-panel commerce-panel" hidden></div>`;
    const sv=$('#view-services'); if(sv) sv.innerHTML=`<div class="section-heading commerce-heading"><div><span>SERVICE OPERATIONS</span><h1>Services</h1><p>Manage the service catalogue, requests, quotations, assignments and payments.</p></div><button class="add-button" id="commerce-add-service"><i class="fa-solid fa-plus"></i> Add Service</button></div>
      <div class="commerce-metrics" id="commerce-service-metrics"></div><div class="commerce-tabs" role="tablist"><button class="is-active" data-service-tab="catalogue">Service Catalogue</button><button data-service-tab="requests">Service Requests</button></div>
      <div id="commerce-catalogue-panel" class="section-panel commerce-panel"></div><div id="commerce-requests-panel" class="section-panel commerce-panel" hidden></div>`;
    if (!$('#product-dialog')) document.body.insertAdjacentHTML('beforeend', `<dialog class="commerce-dialog" id="product-dialog"><form id="product-form"><div class="dialog-header"><div><span>ACTUAL TRADING</span><h2 id="product-dialog-title">Add Product</h2></div><button type="button" class="dialog-close" data-commerce-close="product-dialog" aria-label="Close"><i class="fa-solid fa-xmark"></i></button></div><div class="commerce-form-grid"><label>Product name *<input id="p-name" required maxlength="120"></label><label>SKU / product code *<input id="p-sku" required maxlength="50"></label><label>Category *<input id="p-category" required maxlength="60" placeholder="Electronics, office supplies…"></label><label>Status<select id="p-status"><option>Active</option><option>Inactive</option><option>Out of Stock</option></select></label><label>Selling price (RWF) *<input id="p-price" type="number" min="0" step="1" required></label><label>Cost price (RWF, optional)<input id="p-cost" type="number" min="0" step="1"></label><label>Quantity in stock *<input id="p-stock" type="number" min="0" step="1" required value="0"></label><label>Low-stock threshold *<input id="p-threshold" type="number" min="0" step="1" required value="5"></label><label class="commerce-full">Description *<textarea id="p-description" rows="3" required maxlength="1000"></textarea></label><label class="commerce-full">Product photo (PNG, JPG or WEBP; max 5 MB)<input id="p-image" type="file" accept="image/png,image/jpeg,image/webp"><small>Leave empty to keep the existing photo.</small></label><div class="commerce-full" id="p-image-preview"></div></div><p class="commerce-form-message" id="p-message" role="status"></p><div class="dialog-actions"><button type="button" class="tool-button" data-commerce-close="product-dialog">Cancel</button><button type="submit" class="add-button">Save Product</button></div></form></dialog>`);
    if (!$('#service-dialog')) document.body.insertAdjacentHTML('beforeend', `<dialog class="commerce-dialog" id="service-dialog"><form id="service-form"><div class="dialog-header"><div><span>SERVICE CATALOGUE</span><h2 id="service-dialog-title">Add Service</h2></div><button type="button" class="dialog-close" data-commerce-close="service-dialog" aria-label="Close"><i class="fa-solid fa-xmark"></i></button></div><div class="commerce-form-grid"><label>Service name *<input id="s-name" required maxlength="120"></label><label>Service code *<input id="s-code" required maxlength="50"></label><label>Family / category *<select id="s-category"><option>ACTUAL ACCOUNTING</option><option>ACTUAL DESIGN</option><option>ACTUAL PHOTOGRAPHY</option><option>ACTUAL MUSIC</option><option>ACTUAL HOLDINGS</option><option>Other</option></select></label><label>Pricing method *<select id="s-pricing"><option value="fixed">Fixed price</option><option value="starting">Starting price</option><option value="quotation">Custom quotation</option></select></label><label id="s-price-wrap">Price (RWF) *<input id="s-price" type="number" min="0" step="1" value="0"></label><label>Estimated delivery time<input id="s-delivery" maxlength="100" placeholder="e.g. 3–5 working days"></label><label class="commerce-full">Description *<textarea id="s-description" rows="3" required maxlength="1500"></textarea></label><label class="commerce-full">Required documents (optional)<input id="s-documents" maxlength="500" placeholder="Separate items with commas"></label><label>Status<select id="s-status"><option>Active</option><option>Inactive</option></select></label></div><p class="commerce-form-message" id="s-message" role="status"></p><div class="dialog-actions"><button type="button" class="tool-button" data-commerce-close="service-dialog">Cancel</button><button type="submit" class="add-button">Save Service</button></div></form></dialog>`);
    if (!$('#request-dialog')) document.body.insertAdjacentHTML('beforeend', `<dialog class="commerce-dialog" id="request-dialog"><form id="request-form"><div class="dialog-header"><div><span>SERVICE WORKFLOW</span><h2 id="request-dialog-title">New Service Request</h2></div><button type="button" class="dialog-close" data-commerce-close="request-dialog" aria-label="Close"><i class="fa-solid fa-xmark"></i></button></div><div class="commerce-form-grid"><label>Client name *<input id="r-client" required maxlength="120"></label><label>Client phone or email<input id="r-contact" maxlength="160"></label><label>Service *<select id="r-service" required></select></label><label>Agreed fee (RWF)<input id="r-fee" type="number" min="0" step="1" value="0"></label><label>Amount received (RWF)<input id="r-paid" type="number" min="0" step="1" value="0"></label><label>Assigned employee<input id="r-assignee" maxlength="120" placeholder="Employee name"></label><label>Priority<select id="r-priority"><option>Normal</option><option>High</option><option>Urgent</option></select></label><label>Target completion date<input id="r-deadline" type="date"></label><label>Status<select id="r-status"><option>Pending Review</option><option>Reviewed</option><option>Awaiting Client</option><option>Awaiting Quotation Approval</option><option>Assigned / In Progress</option><option>Awaiting Approval</option><option>Awaiting Payment</option><option>Ready for Delivery</option><option>Completed</option><option>Cancelled</option><option>Rejected</option></select></label><label class="commerce-full">Request details *<textarea id="r-details" rows="3" required maxlength="2000"></textarea></label><label class="commerce-full">Internal notes<textarea id="r-notes" rows="2" maxlength="1000"></textarea></label></div><p class="commerce-form-message" id="r-message" role="status"></p><div class="dialog-actions"><button type="button" class="tool-button" data-commerce-close="request-dialog">Cancel</button><button type="submit" class="add-button">Save Request</button></div></form></dialog>`);
  }
  function seedProductsIfNeeded(){ if(localStorage.getItem(KEYS.products)!==null) return; const seeds=[['lap-001','ACTUAL Business Laptop','laptops',850000,8,'Reliable performance for office work, study and everyday productivity.'],['lap-002','Student Laptop','laptops',620000,10,'A practical laptop for assignments, browsing and online learning.'],['phone-001','Android Smartphone','smartphones',320000,12,'A dependable smartphone for work and daily use.'],['phone-002','Smartphone — 128 GB','smartphones',410000,6,'A smartphone with additional storage for apps and media.'],['acc-001','Wireless Keyboard & Mouse','accessories',45000,20,'A wireless set for an office or home workspace.'],['acc-002','Wireless Headphones','accessories',38000,15,'Headphones for calls, study and everyday use.'],['acc-003','USB-C Adapter','accessories',18000,25,'An adapter for compatible USB-C devices.'],['print-001','Office Printer','printers',280000,5,'Printing for office documents and small business needs.'],['print-002','Printer Paper — 500 sheets','printers',7500,40,'A4 paper for office and school printing.']]; write(KEYS.products,seeds.map(([sku,name,category,price,stock,description])=>({id:sku,sku,name,category,price,costPrice:null,stock,lowStockThreshold:5,status:'Active',description,image:'',vendor:'ACTUAL Trading',createdAt:new Date().toISOString()}))); }
  function load(){ seedProductsIfNeeded(); products=read(KEYS.products).map(p=>({...p,sku:p.sku||p.code||p.id||id('SKU'),costPrice:p.costPrice??p.cost_price??null,lowStockThreshold:Number.isFinite(Number(p.lowStockThreshold))?Number(p.lowStockThreshold):5,status:p.status||((Number(p.stock)<=0)?'Out of Stock':'Active')})); orders=read(KEYS.orders); services=read(KEYS.services); requests=read(KEYS.requests); }
  function persistProducts(){return write(KEYS.products,products)} function persistOrders(){return write(KEYS.orders,orders)} function persistServices(){return write(KEYS.services,services)} function persistRequests(){return write(KEYS.requests,requests)}
  function productImage(p){return p.image?`<img src="${p.image}" alt="${esc(p.name)}">`:`<div class="commerce-image-placeholder"><i class="fa-solid fa-box-open"></i><span>No photo</span></div>`;}
  function metrics(){const units=products.reduce((a,p)=>a+num(p.stock),0),low=products.filter(p=>p.status==='Active'&&num(p.stock)<=num(p.lowStockThreshold)).length; const yr=activeYear();const paid=orders.filter(o=>orderYear(o)===yr&&isPaid(o)&&!isCancelled(o)).reduce((a,o)=>a+num(o.total)-num(o.refundAmount),0);$('#commerce-product-metrics').innerHTML=`<article><span><i class="fa-solid fa-boxes-stacked"></i></span><div><small>Total Products</small><strong>${products.length}</strong></div></article><article><span><i class="fa-solid fa-boxes-packing"></i></span><div><small>Units in Stock</small><strong>${units.toLocaleString()}</strong></div></article><article class="${low?'commerce-alert':''}"><span><i class="fa-solid fa-triangle-exclamation"></i></span><div><small>Low Stock</small><strong>${low}</strong></div></article><article><span><i class="fa-solid fa-wallet"></i></span><div><small>Trading Revenue · ${esc(yr)}</small><strong>${money(paid)}</strong></div></article>`;
    const yearRequests=requests.filter(r=>String(r.year||new Date(r.createdAt||Date.now()).getFullYear())===yr), paidServices=yearRequests.reduce((a,r)=>a+num(r.paidAmount),0), outstanding=yearRequests.filter(r=>!['Cancelled','Rejected'].includes(r.status)).reduce((a,r)=>a+Math.max(0,num(r.agreedFee)-num(r.paidAmount)),0);$('#commerce-service-metrics').innerHTML=`<article><span><i class="fa-solid fa-briefcase"></i></span><div><small>Active Services</small><strong>${services.filter(s=>s.status==='Active').length}</strong></div></article><article><span><i class="fa-solid fa-clipboard-list"></i></span><div><small>Open Requests</small><strong>${requests.filter(r=>!['Completed','Cancelled','Rejected'].includes(r.status)).length}</strong></div></article><article><span><i class="fa-solid fa-wallet"></i></span><div><small>Service Payments Recorded</small><strong>${money(paidServices)}</strong></div></article><article class="${outstanding?'commerce-alert':''}"><span><i class="fa-solid fa-hourglass-half"></i></span><div><small>Service Balances Due</small><strong>${money(outstanding)}</strong></div></article>`; }
  function renderProducts(){const box=$('#commerce-products-panel'); if(!box)return; const query=($('#commerce-product-search')?.value||'').toLowerCase().trim(); const filtered=products.filter(p=>`${p.name} ${p.sku} ${p.category}`.toLowerCase().includes(query));box.innerHTML=`<div class="commerce-panel-head"><div><h2>Products & Stock</h2><p>Update catalogue information, quantities and restocking.</p></div><label class="commerce-search"><i class="fa-solid fa-magnifying-glass"></i><input id="commerce-product-search" type="search" placeholder="Search product, SKU or category" value="${esc(query)}"></label></div>${filtered.length?`<div class="commerce-product-grid">${filtered.map(p=>`<article class="commerce-product-card"><div class="commerce-product-image">${productImage(p)}<span class="commerce-stock-badge ${p.status==='Inactive'?'is-inactive':num(p.stock)<=num(p.lowStockThreshold)?'is-low':''}">${p.status==='Inactive'?'Inactive':num(p.stock)<=0?'Out of Stock':num(p.stock)<=num(p.lowStockThreshold)?'Low Stock':'In Stock'}</span></div><div class="commerce-product-body"><div class="commerce-product-category">${esc(p.category||'Uncategorised')} · ${esc(p.sku)}</div><h3>${esc(p.name)}</h3><p>${esc(p.description||'No product description added.')}</p><div class="commerce-price-row"><strong>${money(p.price)}</strong><small>${p.costPrice===null||p.costPrice===''?'Cost not set':`Cost ${money(p.costPrice)} · Est. margin ${money(num(p.price)-num(p.costPrice))}`}</small></div><div class="commerce-stock-row"><span><b>${num(p.stock)}</b> units</span><span>Alert at ${num(p.lowStockThreshold)}</span></div><div class="commerce-product-actions"><button type="button" class="tool-button" data-product-edit="${esc(p.id)}"><i class="fa-solid fa-pen"></i> Edit</button><button type="button" class="tool-button" data-stock-add="${esc(p.id)}"><i class="fa-solid fa-boxes-stacked"></i> Restock</button><button type="button" class="commerce-archive" data-product-toggle="${esc(p.id)}">${p.status==='Inactive'?'Activate':'Archive'}</button></div></div></article>`).join('')}</div>`:`<div class="commerce-empty"><i class="fa-solid fa-box-open"></i><h3>${query?'No matching products':'No products yet'}</h3><p>${query?'Try another search.':'Add your first product to start the catalogue.'}</p><button class="add-button" id="commerce-empty-add-product">Add Product</button></div>`}`; $('#commerce-product-search')?.addEventListener('input',renderProducts); }
  function renderOrders(){const box=$('#commerce-orders-panel');if(!box)return; const sorted=[...orders].sort((a,b)=>String(b.createdAt||b.date||'').localeCompare(String(a.createdAt||a.date||'')));box.innerHTML=`<div class="commerce-panel-head"><div><h2>Shop Orders</h2><p>Order status and payment records. A delivery status does not prove payment.</p></div><span class="commerce-count">${orders.length} orders</span></div>${sorted.length?`<div class="commerce-table-wrap"><table class="commerce-table"><thead><tr><th>Order</th><th>Client</th><th>Items</th><th>Order total</th><th>Amount paid</th><th>Balance due</th><th>Payment status</th><th>Fulfilment</th><th>Actions</th></tr></thead><tbody>${sorted.map(o=>{const items=Array.isArray(o.items)?o.items.map(i=>`${esc(i.name||i.productName||i.id)} × ${num(i.quantity)}`).join(', '):'Order items';return `<tr><td><b>${esc(o.reference||o.id||'Order')}</b><small>${esc(o.date||o.createdAt||'')}</small></td><td>${esc(o.name||o.customerName||'Guest')}<small>${esc(o.phone||o.email||'')}</small></td><td>${items}</td><td><b>${money(o.total)}</b></td><td><input class="commerce-order-paid-input" type="number" min="0" max="${num(o.total)}" step="1" value="${num(o.amountPaid ?? (isPaid(o)?o.total:0))}" data-order-amount="${esc(o.reference||o.id)}" aria-label="Amount paid for order ${esc(o.reference||o.id)}"></td><td><b>${money(Math.max(0,num(o.total)-num(o.amountPaid ?? (isPaid(o)?o.total:0))))}</b></td><td><select data-order-payment="${esc(o.reference||o.id)}"><option ${isPaid(o)?'selected':''}>${isPaid(o)?'Paid':'Awaiting payment confirmation'}</option><option ${String(o.status).toLowerCase()==='partially paid'?'selected':''}>Partially Paid</option><option ${String(o.status).toLowerCase()==='failed'?'selected':''}>Failed</option><option ${String(o.status).toLowerCase()==='cancelled'?'selected':''}>Cancelled</option><option ${String(o.status).toLowerCase()==='refunded'?'selected':''}>Refunded</option></select></td><td><select data-order-fulfilment="${esc(o.reference||o.id)}"><option ${o.fulfilmentStatus==='Processing'?'selected':''}>Processing</option><option ${o.fulfilmentStatus==='Ready'?'selected':''}>Ready</option><option ${o.fulfilmentStatus==='Delivered'?'selected':''}>Delivered</option><option ${o.fulfilmentStatus==='Cancelled'?'selected':''}>Cancelled</option></select></td><td><button class="tool-button" data-order-save="${esc(o.reference||o.id)}">Save</button></td></tr>`;}).join('')}</tbody></table></div>`:`<div class="commerce-empty"><i class="fa-solid fa-cart-shopping"></i><h3>No shop orders yet</h3><p>Orders placed through the public Shop will appear here when they are saved in this browser.</p></div>`}`; }
  function renderMovements(){const box=$('#commerce-movements-panel');const rows=[];products.forEach(p=>(p.stockMovements||[]).forEach(m=>rows.push({...m,productName:p.name,sku:p.sku})));rows.sort((a,b)=>String(b.date).localeCompare(String(a.date)));box.innerHTML=`<div class="commerce-panel-head"><div><h2>Stock Movement History</h2><p>Restocks, manual corrections and other recorded changes.</p></div></div>${rows.length?`<div class="commerce-table-wrap"><table class="commerce-table"><thead><tr><th>Date</th><th>Product</th><th>Movement</th><th>Quantity</th><th>Reason</th></tr></thead><tbody>${rows.map(r=>`<tr><td>${esc(new Date(r.date).toLocaleString())}</td><td>${esc(r.productName)}<small>${esc(r.sku)}</small></td><td>${esc(r.type)}</td><td>${r.delta>0?'+':''}${num(Math.abs(r.delta))*(r.delta<0?-1:1)}</td><td>${esc(r.reason||'—')}</td></tr>`).join('')}</tbody></table></div>`:`<div class="commerce-empty compact"><i class="fa-solid fa-boxes-stacked"></i><h3>No stock movements recorded</h3><p>Use Restock or Edit Stock to create an auditable movement entry.</p></div>`}`; }
  function renderServices(){const box=$('#commerce-catalogue-panel');if(!box)return;box.innerHTML=`<div class="commerce-panel-head"><div><h2>Service Catalogue</h2><p>Published service details and pricing rules.</p></div><span class="commerce-count">${services.length} services</span></div>${services.length?`<div class="commerce-service-grid">${services.map(s=>`<article class="commerce-service-card"><div class="commerce-service-icon"><i class="fa-solid fa-briefcase"></i></div><div class="commerce-service-main"><div class="commerce-product-category">${esc(s.category)} · ${esc(s.code)}</div><h3>${esc(s.name)}</h3><p>${esc(s.description)}</p><div class="commerce-price-row"><strong>${s.pricing==='quotation'?'Custom quotation':s.pricing==='starting'?`From ${money(s.price)}`:money(s.price)}</strong><span class="commerce-stock-badge ${s.status==='Inactive'?'is-inactive':''}">${esc(s.status)}</span></div><small>${esc(s.delivery||'Delivery time not specified')}</small></div><div class="commerce-product-actions"><button class="tool-button" data-service-edit="${esc(s.id)}"><i class="fa-solid fa-pen"></i> Edit</button><button class="commerce-archive" data-service-toggle="${esc(s.id)}">${s.status==='Active'?'Deactivate':'Activate'}</button></div></article>`).join('')}</div>`:`<div class="commerce-empty"><i class="fa-solid fa-briefcase"></i><h3>No services in catalogue</h3><p>Add the services offered by ACTUAL HOLDINGS and ACTUAL FAMILY.</p><button class="add-button" id="commerce-empty-add-service">Add Service</button></div>`}`; }
  function paymentStatus(r){return num(r.paidAmount)<=0?'Unpaid':num(r.paidAmount)>=num(r.agreedFee)?'Paid':'Partially Paid';}
  function renderRequests(){const box=$('#commerce-requests-panel');if(!box)return;box.innerHTML=`<div class="commerce-panel-head"><div><h2>Service Requests & Work Progress</h2><p>Review client work, assign employees, manage quotations and track payment balances.</p></div><button class="add-button" id="commerce-add-request"><i class="fa-solid fa-plus"></i> New Request</button></div>${requests.length?`<div class="commerce-request-list">${[...requests].sort((a,b)=>String(b.updatedAt||b.createdAt).localeCompare(String(a.updatedAt||a.createdAt))).map(r=>`<article class="commerce-request-card"><div class="commerce-request-top"><div><span class="commerce-product-category">${esc(r.reference)} · ${esc(r.priority)} priority</span><h3>${esc(r.clientName)} — ${esc(r.serviceName)}</h3><p>${esc(r.details)}</p><small>${esc(r.contact||'No contact recorded')} · Due ${esc(r.deadline||'not set')} · Assigned: ${esc(r.assignee||'Unassigned')}</small></div><span class="commerce-stock-badge ${['Completed'].includes(r.status)?'': ['Cancelled','Rejected'].includes(r.status)?'is-inactive':'is-low'}">${esc(r.status)}</span></div><div class="commerce-request-finance"><span><small>Agreed fee</small><b>${money(r.agreedFee)}</b></span><span><small>Paid</small><b>${money(r.paidAmount)}</b></span><span><small>Balance due</small><b>${money(Math.max(0,num(r.agreedFee)-num(r.paidAmount)))}</b></span><span><small>Payment status</small><b>${paymentStatus(r)}</b></span></div><div class="commerce-request-actions"><button class="tool-button" data-request-edit="${esc(r.id)}"><i class="fa-solid fa-pen"></i> Update request</button><button class="tool-button" data-request-payment="${esc(r.id)}"><i class="fa-solid fa-money-bill-wave"></i> Record payment</button></div></article>`).join('')}</div>`:`<div class="commerce-empty"><i class="fa-solid fa-clipboard-list"></i><h3>No service requests yet</h3><p>Create a demo request here, or connect client submissions when the backend is implemented.</p><button class="add-button" id="commerce-empty-add-request">New Service Request</button></div>`}`; }
  function renderAll(){metrics();renderProducts();renderOrders();renderMovements();renderServices();renderRequests();}
  function openProduct(p=null){editingProduct=p?.id||null;imageData=p?.image||'';$('#product-form').reset();$('#product-dialog-title').textContent=p?'Edit Product':'Add Product';$('#p-name').value=p?.name||'';$('#p-sku').value=p?.sku||p?.id||'';$('#p-category').value=p?.category||'';$('#p-status').value=p?.status||'Active';$('#p-price').value=p?.price??'';$('#p-cost').value=p?.costPrice??'';$('#p-stock').value=p?.stock??0;$('#p-threshold').value=p?.lowStockThreshold??5;$('#p-description').value=p?.description||'';$('#p-image').value='';$('#p-image-preview').innerHTML=imageData?`<div class="commerce-preview">${productImage(p)}<span>Current photo</span></div>`:'';$('#p-message').textContent='';$('#product-dialog').showModal();}
  function fileToData(file){return new Promise((resolve,reject)=>{if(!file)return resolve(null);if(!/^image\/(png|jpeg|webp)$/.test(file.type))return reject(new Error('Choose a PNG, JPG or WEBP image.'));if(file.size>5*1024*1024)return reject(new Error('Image must be 5 MB or smaller.'));const reader=new FileReader();reader.onload=()=>resolve(String(reader.result||''));reader.onerror=()=>reject(new Error('Could not read this image.'));reader.readAsDataURL(file);});}
  async function saveProduct(e){e.preventDefault();const name=$('#p-name').value.trim(),sku=$('#p-sku').value.trim(),category=$('#p-category').value.trim(),price=Number($('#p-price').value),cost=$('#p-cost').value===''?null:Number($('#p-cost').value),stock=Number($('#p-stock').value),threshold=Number($('#p-threshold').value);if(!name||!sku||!category||!$('#p-description').value.trim()||!Number.isFinite(price)||price<0||(cost!==null&&(!Number.isFinite(cost)||cost<0))||!Number.isInteger(stock)||stock<0||!Number.isInteger(threshold)||threshold<0){$('#p-message').textContent='Complete required fields with valid non-negative prices and whole-number quantities.';return;}if(products.some(p=>String(p.sku).toLowerCase()===sku.toLowerCase()&&p.id!==editingProduct)){$('#p-message').textContent='That product code already exists.';return;}try{const chosen=$('#p-image').files?.[0];const newImage=await fileToData(chosen);const old=products.find(p=>p.id===editingProduct);const item={...(old||{}),id:old?.id||id('TRD'),sku,name,category,description:$('#p-description').value.trim(),price,costPrice:cost,stock,lowStockThreshold:threshold,status:stock===0&&$('#p-status').value==='Active'?'Out of Stock':$('#p-status').value,image:newImage||imageData||'',vendor:old?.vendor||'ACTUAL Trading',createdAt:old?.createdAt||new Date().toISOString(),updatedAt:new Date().toISOString(),stockMovements:[...(old?.stockMovements||[])]};if(old&&stock!==num(old.stock)){item.stockMovements.push({date:new Date().toISOString(),type:'Manual adjustment',delta:stock-num(old.stock),reason:'Stock quantity adjusted while editing product'});}const previous=products;products=old?products.map(p=>p.id===old.id?item:p):[item,...products];if(!persistProducts()){products=previous;return;}if(!old)notify('New product added',`${name} was added to Trading.`);else notify('Product updated',`${name} product information was updated.`);$('#product-dialog').close();renderAll();window.dispatchEvent(new CustomEvent('actual:commerce-updated'));}catch(err){$('#p-message').textContent=err.message||'Could not save product.';}}
  function restock(productId){const p=products.find(x=>x.id===productId);if(!p)return;const raw=prompt(`Restock ${p.name}\nCurrent stock: ${p.stock}\nEnter quantity received (whole number):`);if(raw===null)return;const qty=Number(raw);if(!Number.isInteger(qty)||qty<=0){alert('Enter a whole number greater than zero.');return;}const reason=prompt('Supplier or restocking note (optional):','Supplier delivery')||'Restock';const prev=products;p.stock=num(p.stock)+qty;p.status='Active';p.stockMovements=[...(p.stockMovements||[]),{date:new Date().toISOString(),type:'Restock',delta:qty,reason}];if(!persistProducts()){products=prev;return;}notify('Stock restocked',`${p.name}: +${qty} units.`);renderAll();}
  function toggleProduct(productId){const p=products.find(x=>x.id===productId);if(!p)return;const next=p.status==='Inactive'?'Active':'Inactive';if(!confirm(`${next==='Inactive'?'Archive':'Activate'} ${p.name}? Historical orders will be retained.`))return;p.status=next;if(!persistProducts())return;renderAll();}
  function setOrder(ref, payment, fulfilment, amountPaid){const o=orders.find(x=>String(x.reference||x.id)===String(ref));if(!o)return;const previous=JSON.stringify(o);if(!Number.isFinite(amountPaid)||amountPaid<0||amountPaid>num(o.total)){alert('Amount paid must be between zero and the order total.');return;}if(payment==='Paid')amountPaid=num(o.total);if(payment==='Partially Paid'&&(amountPaid<=0||amountPaid>=num(o.total))){alert('For Partially Paid, enter an amount greater than zero and less than the order total.');return;}if(['Awaiting payment confirmation','Failed','Cancelled'].includes(payment))amountPaid=0;o.amountPaid=amountPaid;o.status=payment;o.fulfilmentStatus=fulfilment;o.updatedAt=new Date().toISOString();if(payment==='Refunded'){o.refundAmount=num(o.refundAmount)||num(o.total);o.refundedAt=new Date().toISOString();}if((payment==='Cancelled'||payment==='Failed'||fulfilment==='Cancelled')&&!o.stockRestored){(o.items||[]).forEach(line=>{const p=products.find(x=>x.id===line.id||x.id===line.productId);if(p){p.stock=num(p.stock)+num(line.quantity);p.stockMovements=[...(p.stockMovements||[]),{date:new Date().toISOString(),type:'Cancelled order restock',delta:num(line.quantity),reason:`Order ${ref} cancelled`}];}});o.stockRestored=true;}if(!persistOrders()){Object.assign(o,JSON.parse(previous));return;}if(!persistProducts())return;notify('Shop order updated',`Order ${ref}: payment ${payment}; fulfilment ${fulfilment}.`);renderAll();window.dispatchEvent(new CustomEvent('actual:commerce-updated'));}
  function openService(s=null){editingService=s?.id||null;$('#service-form').reset();$('#service-dialog-title').textContent=s?'Edit Service':'Add Service';$('#s-name').value=s?.name||'';$('#s-code').value=s?.code||'';$('#s-category').value=s?.category||'ACTUAL HOLDINGS';$('#s-pricing').value=s?.pricing||'fixed';$('#s-price').value=s?.price??0;$('#s-delivery').value=s?.delivery||'';$('#s-description').value=s?.description||'';$('#s-documents').value=s?.requiredDocuments||'';$('#s-status').value=s?.status||'Active';$('#s-message').textContent='';updateServicePriceField();$('#service-dialog').showModal();}
  function updateServicePriceField(){const type=$('#s-pricing').value;$('#s-price-wrap').hidden=type==='quotation';$('#s-price').required=type!=='quotation';}
  function saveService(e){e.preventDefault();const name=$('#s-name').value.trim(),code=$('#s-code').value.trim(),price=Number($('#s-price').value),pricing=$('#s-pricing').value;if(!name||!code||!$('#s-description').value.trim()||(pricing!=='quotation'&&(!Number.isFinite(price)||price<0))){$('#s-message').textContent='Complete the required fields and enter a valid price for the selected pricing method.';return;}if(services.some(s=>s.code.toLowerCase()===code.toLowerCase()&&s.id!==editingService)){$('#s-message').textContent='That service code already exists.';return;}const old=services.find(s=>s.id===editingService);const item={...(old||{}),id:old?.id||id('SRV'),name,code,category:$('#s-category').value,pricing,price:pricing==='quotation'?null:price,delivery:$('#s-delivery').value.trim(),description:$('#s-description').value.trim(),requiredDocuments:$('#s-documents').value.trim(),status:$('#s-status').value,updatedAt:new Date().toISOString(),createdAt:old?.createdAt||new Date().toISOString()};const prev=services;services=old?services.map(s=>s.id===old.id?item:s):[item,...services];if(!persistServices()){services=prev;return;}notify(old?'Service updated':'New service added',`${name} — ${pricing==='quotation'?'custom quotation':money(price)}.`);$('#service-dialog').close();renderAll();}
  function openRequest(r=null){$('#request-form').reset();$('#request-dialog-title').textContent=r?'Update Service Request':'New Service Request';$('#r-service').innerHTML=services.map(s=>`<option value="${esc(s.id)}">${esc(s.name)}</option>`).join('');if(r){$('#r-client').value=r.clientName||'';$('#r-contact').value=r.contact||'';$('#r-service').value=r.serviceId||'';$('#r-fee').value=r.agreedFee??0;$('#r-paid').value=r.paidAmount??0;$('#r-assignee').value=r.assignee||'';$('#r-priority').value=r.priority||'Normal';$('#r-deadline').value=r.deadline||'';$('#r-status').value=r.status||'Pending Review';$('#r-details').value=r.details||'';$('#r-notes').value=r.notes||'';}else{$('#r-paid').value='0';$('#r-fee').value=services.find(s=>s.id===$('#r-service').value)?.price||0;}$('#r-message').textContent='';$('#request-dialog').dataset.editId=r?.id||'';$('#request-dialog').showModal();}
  function saveRequest(e){e.preventDefault();const service=services.find(s=>s.id===$('#r-service').value);if(!service){$('#r-message').textContent='Add a service to the catalogue before creating a request.';return;}const fee=Number($('#r-fee').value),paid=Number($('#r-paid').value);if(!Number.isFinite(fee)||fee<0||!Number.isFinite(paid)||paid<0||paid>fee){$('#r-message').textContent='Agreed fee and paid amount must be valid, and paid amount cannot exceed the agreed fee.';return;}const editId=$('#request-dialog').dataset.editId,old=requests.find(r=>r.id===editId);const item={...(old||{}),id:old?.id||id('REQ'),year:old?.year||activeYear(),reference:old?.reference||id('SR'),clientName:$('#r-client').value.trim(),contact:$('#r-contact').value.trim(),serviceId:service.id,serviceName:service.name,agreedFee:fee,paidAmount:paid,assignee:$('#r-assignee').value.trim(),priority:$('#r-priority').value,deadline:$('#r-deadline').value,status:$('#r-status').value,details:$('#r-details').value.trim(),notes:$('#r-notes').value.trim(),createdAt:old?.createdAt||new Date().toISOString(),updatedAt:new Date().toISOString()};const prev=requests;requests=old?requests.map(r=>r.id===old.id?item:r):[item,...requests];if(!persistRequests()){requests=prev;return;}notify(old?'Service request updated':'New service request',`${item.reference}: ${item.clientName} — ${item.serviceName}; status ${item.status}.`);$('#request-dialog').close();renderAll();window.dispatchEvent(new CustomEvent('actual:commerce-updated'));}
  function recordPayment(requestId){const r=requests.find(x=>x.id===requestId);if(!r)return;const remaining=Math.max(0,num(r.agreedFee)-num(r.paidAmount));if(!remaining){alert('This request has no outstanding balance.');return;}const raw=prompt(`Record payment for ${r.reference}\nBalance due: ${money(remaining)}\nAmount received (RWF):`,String(remaining));if(raw===null)return;const amount=Number(raw);if(!Number.isFinite(amount)||amount<=0||amount>remaining){alert('Enter an amount greater than zero and no more than the remaining balance.');return;}const prev=r.paidAmount;r.paidAmount=num(r.paidAmount)+amount;r.updatedAt=new Date().toISOString();if(!persistRequests()){r.paidAmount=prev;return;}notify('Service payment recorded',`${r.reference}: ${money(amount)} received. Balance due ${money(r.agreedFee-r.paidAmount)}.`);renderAll();window.dispatchEvent(new CustomEvent('actual:commerce-updated'));}
  function bind(){document.addEventListener('click',e=>{const el=e.target.closest('button');if(!el)return;if(el.dataset.commerceClose){$('#'+el.dataset.commerceClose).close();return;}if(el.id==='commerce-add-product'||el.id==='commerce-empty-add-product'){openProduct();return;}if(el.id==='commerce-add-service'||el.id==='commerce-empty-add-service'){openService();return;}if(el.id==='commerce-add-request'||el.id==='commerce-empty-add-request'){openRequest();return;}if(el.dataset.productEdit){openProduct(products.find(p=>p.id===el.dataset.productEdit));return;}if(el.dataset.stockAdd){restock(el.dataset.stockAdd);return;}if(el.dataset.productToggle){toggleProduct(el.dataset.productToggle);return;}if(el.dataset.serviceEdit){openService(services.find(s=>s.id===el.dataset.serviceEdit));return;}if(el.dataset.serviceToggle){const s=services.find(x=>x.id===el.dataset.serviceToggle);if(s){s.status=s.status==='Active'?'Inactive':'Active';persistServices();renderAll();}return;}if(el.dataset.orderSave){const ref=el.dataset.orderSave;setOrder(ref,$(`[data-order-payment="${CSS.escape(ref)}"]`).value,$(`[data-order-fulfilment="${CSS.escape(ref)}"]`).value,Number($(`[data-order-amount="${CSS.escape(ref)}"]`).value));return;}if(el.dataset.requestEdit){openRequest(requests.find(r=>r.id===el.dataset.requestEdit));return;}if(el.dataset.requestPayment){recordPayment(el.dataset.requestPayment);return;}if(el.dataset.commerceTab){document.querySelectorAll('[data-commerce-tab]').forEach(b=>b.classList.toggle('is-active',b===el));['products','orders','movements'].forEach(n=>$('#commerce-'+n+'-panel').hidden=n!==el.dataset.commerceTab);return;}if(el.dataset.serviceTab){document.querySelectorAll('[data-service-tab]').forEach(b=>b.classList.toggle('is-active',b===el));['catalogue','requests'].forEach(n=>$('#commerce-'+n+'-panel').hidden=n!==el.dataset.serviceTab);return;}});
    document.addEventListener('change',e=>{if(e.target.id==='p-image'){fileToData(e.target.files?.[0]).then(data=>{if(data){imageData=data;$('#p-image-preview').innerHTML=`<div class="commerce-preview"><img src="${data}" alt="Product photo preview"><span>Preview · save to apply</span></div>`;}}).catch(err=>$('#p-message').textContent=err.message);}if(e.target.id==='s-pricing')updateServicePriceField();if(e.target.id==='r-service'&&!$('#request-dialog').dataset.editId){const s=services.find(x=>x.id===e.target.value);if(s&&s.pricing!=='quotation')$('#r-fee').value=s.price??0;}});
    $('#product-form').addEventListener('submit',saveProduct);$('#service-form').addEventListener('submit',saveService);$('#request-form').addEventListener('submit',saveRequest);
  }
  document.addEventListener('DOMContentLoaded',()=>{addStyle();setupMarkup();load();bind();renderAll();});
})();

}


/* ===== Merged from js/public-services.js; page-scoped to avoid running unrelated UI code ===== */
if (document.querySelector('.public-service-catalogue-section') || location.pathname.endsWith('/services.html')) {
(() => {
  'use strict';
  const SERVICES_KEY='actualHoldingServicesV1', REQUESTS_KEY='actualHoldingServiceRequestsV1', NOTICES_KEY='actualHoldingOwnerNotificationsV1';
  const $=s=>document.querySelector(s); const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const read=(key)=>{try{const v=JSON.parse(localStorage.getItem(key)||'[]');return Array.isArray(v)?v:[]}catch(_){return[]}};
  const money=v=>`RWF ${Number(v||0).toLocaleString('en-RW')}`;
  function render(){const root=$('#public-service-catalogue-grid');if(!root)return;const services=read(SERVICES_KEY).filter(s=>s.status==='Active');if(!services.length){root.innerHTML='<div class="public-service-empty"><i class="fa-solid fa-briefcase"></i><h3>Our services</h3><p>Service listings will appear here as ACTUAL HOLDINGS publishes them.</p><p>Contact our team for assistance with accounting, tax declarations, design, photography and other services.</p></div>';return;}root.innerHTML=services.map(s=>`<article class="public-service-card"><span class="public-service-icon"><i class="fa-solid fa-briefcase"></i></span><small>${esc(s.category||'ACTUAL HOLDINGS')} · ${esc(s.code||'')}</small><h3>${esc(s.name)}</h3><p>${esc(s.description||'Contact us to discuss your requirements.')}</p><div class="public-service-price">${s.pricing==='quotation'?'Custom quotation':s.pricing==='starting'?`From ${money(s.price)}`:money(s.price)}</div>${s.delivery?`<small class="public-service-delivery">Estimated delivery: ${esc(s.delivery)}</small>`:''}<button type="button" class="btn btn-primary public-request-service" data-public-service="${esc(s.id)}">Request this service</button></article>`).join('');}
  function openRequest(serviceId){const services=read(SERVICES_KEY).filter(s=>s.status==='Active'),s=services.find(x=>x.id===serviceId);if(!s)return;const form=$('#public-service-request-form');form.reset();$('#public-request-service-id').value=s.id;$('#public-request-service-name').textContent=s.name;$('#public-request-service-meta').textContent=s.pricing==='quotation'?'A quotation will be prepared after reviewing your request.':s.pricing==='starting'?`Starting price: ${money(s.price)}. Final fee depends on scope.`:`Catalogue price: ${money(s.price)}.`;$('#public-service-request-dialog').showModal();}
  function submit(e){e.preventDefault();const services=read(SERVICES_KEY),service=services.find(s=>s.id===$('#public-request-service-id').value&&s.status==='Active');if(!service){$('#public-request-message').textContent='This service is no longer available. Refresh the page and select another service.';return;}const requests=read(REQUESTS_KEY),now=new Date().toISOString(),fee=service.pricing==='fixed'?Number(service.price||0):0;const reference=`SR-${Date.now().toString(36).toUpperCase()}`;const request={id:`REQ-${Date.now().toString(36).toUpperCase()}`,reference,year:String(new Date().getFullYear()),clientName:$('#public-request-client').value.trim(),contact:$('#public-request-contact').value.trim(),serviceId:service.id,serviceName:service.name,agreedFee:fee,paidAmount:0,assignee:'',priority:'Normal',deadline:'',status:'Pending Review',details:$('#public-request-details').value.trim(),notes:'',pricingMethod:service.pricing,createdAt:now,updatedAt:now,source:'Public service request'};requests.unshift(request);try{localStorage.setItem(REQUESTS_KEY,JSON.stringify(requests));const notes=read(NOTICES_KEY);notes.unshift({id:`NOT-${Date.now()}`,title:'New service request',message:`${reference}: ${request.clientName} requested ${service.name}.`,createdAt:now,read:false});localStorage.setItem(NOTICES_KEY,JSON.stringify(notes.slice(0,100)));$('#public-request-message').textContent=`Request submitted in this browser demo. Reference: ${reference}. Save this reference for follow-up.`;$('#public-request-success').hidden=false;$('#public-request-submit').hidden=true;$('#public-request-done').hidden=false;}catch(_){$('#public-request-message').textContent='Could not save this request in browser storage. Please contact ACTUAL HOLDINGS directly.';}}
  document.addEventListener('DOMContentLoaded',()=>{const section=document.createElement('section');section.className='section-padding public-service-catalogue-section';section.innerHTML=`<div class="container"><div class="section-header"><div class="section-label"><i class="fa-solid fa-briefcase"></i> ACTUAL HOLDINGS SERVICE CATALOGUE</div><h2 class="section-title">Services available to you</h2><p class="section-description">Browse active services and submit a request. Final quotations are confirmed by our team.</p></div><div id="public-service-catalogue-grid" class="public-service-catalogue-grid"></div></div>`;const faq=document.querySelector('.faq-list')?.closest('section');if(faq)faq.parentNode.insertBefore(section,faq);else document.body.append(section);const dialog=document.createElement('dialog');dialog.id='public-service-request-dialog';dialog.className='public-service-request-dialog';dialog.innerHTML=`<form id="public-service-request-form"><button type="button" class="public-request-close" id="public-request-close" aria-label="Close">×</button><span class="section-label">SERVICE REQUEST</span><h2 id="public-request-service-name">Request a service</h2><p id="public-request-service-meta"></p><input type="hidden" id="public-request-service-id"><label>Full name or company name<input id="public-request-client" required maxlength="120" autocomplete="name"></label><label>Phone number or email<input id="public-request-contact" required maxlength="160" autocomplete="email"></label><label>Describe what you need<textarea id="public-request-details" required rows="4" maxlength="2000"></textarea></label><p id="public-request-message" role="status"></p><button type="submit" id="public-request-submit" class="btn btn-primary">Submit Request</button><button type="button" id="public-request-done" class="btn btn-primary" hidden>Done</button></form>`;document.body.append(dialog);render();$('#public-service-catalogue-grid').addEventListener('click',e=>{const b=e.target.closest('[data-public-service]');if(b)openRequest(b.dataset.publicService)});$('#public-service-request-form').addEventListener('submit',submit);$('#public-request-close').addEventListener('click',()=>dialog.close());$('#public-request-done').addEventListener('click',()=>{dialog.close();$('#public-request-success')?.remove();$('#public-request-message').textContent='';$('#public-request-submit').hidden=false;$('#public-request-done').hidden=true;});});
})();

}


/* ===== Merged from js/trading.js; page-scoped to avoid running unrelated UI code ===== */
if (document.body.id === 'trading-page') {
(() => {
  'use strict';
  const PRODUCTS_KEY = 'actualTradingProductsV1';
  const CART_KEY = 'actualTradingCartV1';
  const ORDERS_KEY = 'actualTradingOrdersV1';
  const SESSION_KEY = 'actualHoldingsFrontendSession';
  const $ = (id) => document.getElementById(id);
  const money = (value) => `${Number(value || 0).toLocaleString('en-US')} RWF`;
  const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const read = (key, fallback) => { try { const value = JSON.parse(localStorage.getItem(key)); return value ?? fallback; } catch (_) { return fallback; } };
  const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));
  const makeId = () => `AT-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
  const seedProducts = [
    {id:'lap-001', name:'ACTUAL Business Laptop', description:'Reliable performance for office work, study and everyday productivity.', price:850000, category:'laptops', stock:8, image:'', vendor:'ACTUAL Trading', featured:true},
    {id:'lap-002', name:'Student Laptop', description:'A practical laptop for assignments, browsing and online learning.', price:620000, category:'laptops', stock:10, image:'', vendor:'ACTUAL Trading'},
    {id:'phone-001', name:'Android Smartphone', description:'Stay connected with a dependable smartphone for work and daily use.', price:320000, category:'smartphones', stock:12, image:'', vendor:'ACTUAL Trading', featured:true},
    {id:'phone-002', name:'Smartphone — 128 GB', description:'Extra room for your photos, apps and documents.', price:410000, category:'smartphones', stock:6, image:'', vendor:'ACTUAL Trading'},
    {id:'acc-001', name:'Wireless Keyboard & Mouse', description:'A comfortable wireless set for your office or home workspace.', price:45000, category:'accessories', stock:20, image:'', vendor:'ACTUAL Trading', featured:true},
    {id:'acc-002', name:'Wireless Headphones', description:'Everyday headphones for calls, study and entertainment.', price:38000, category:'accessories', stock:15, image:'', vendor:'ACTUAL Trading'},
    {id:'acc-003', name:'USB-C Adapter', description:'A useful adapter for compatible laptops, phones and peripherals.', price:18000, category:'accessories', stock:25, image:'', vendor:'ACTUAL Trading'},
    {id:'print-001', name:'Office Printer', description:'Dependable printing for documents, forms and small business needs.', price:280000, category:'printers', stock:5, image:'', vendor:'ACTUAL Trading', featured:true},
    {id:'print-002', name:'Printer Paper — 500 sheets', description:'Everyday A4 paper for office and school printing.', price:7500, category:'printers', stock:40, image:'', vendor:'ACTUAL Trading'}
  ];
  let activeFilter = 'all';
  let searchTerm = '';
  let products = [];
  let cart = [];
  let pendingImage = '';
  const session = () => read(SESSION_KEY, null);
  const currentRole = () => String(session()?.role || '').toLowerCase();
  const isStaff = () => ['admin','owner'].includes(currentRole());
  const currentCustomer = () => session() || null;
  const getProducts = () => {
    const saved = read(PRODUCTS_KEY, null);
    if (Array.isArray(saved)) return saved;
    write(PRODUCTS_KEY, seedProducts);
    return seedProducts.map(p => ({...p}));
  };
  const getCart = () => read(CART_KEY, []);
  const setCart = (next) => { cart = next; write(CART_KEY, cart); renderCart(); };
  const getOrders = () => read(ORDERS_KEY, []);
  const productById = (id) => products.find(p => p.id === id);

  function productVisual(product) {
    if (product.image) return `<img src="${product.image}" alt="${escapeHtml(product.name)}" loading="lazy">`;
    const icon = ({laptops:'fa-laptop', smartphones:'fa-mobile-screen-button', accessories:'fa-headphones', printers:'fa-print'})[product.category] || 'fa-box-open';
    return `<div class="trading-product-placeholder"><span class="placeholder-glow"></span><i class="fa-solid ${icon}"></i><small>ACTUAL TRADING</small></div>`;
  }
  function renderProducts() {
    const grid = $('dynamic-product-grid');
    if (!grid) return;
    const visible = products.filter(p => String(p.status || 'Active') !== 'Inactive' && (activeFilter === 'all' || p.category === activeFilter) && `${p.name} ${p.description} ${p.category}`.toLowerCase().includes(searchTerm));
    document.querySelectorAll('.filter-tabs [data-filter]').forEach(button => {
      const active = button.dataset.filter === activeFilter;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    if (!visible.length) {
      grid.innerHTML = `<div class="trading-no-products"><i class="fa-solid fa-magnifying-glass"></i><h3>No products found</h3><p>Try another category or search term.</p></div>`;
      renderAdminList();
      return;
    }
    grid.innerHTML = visible.map(product => {
      const soldOut = Number(product.stock) <= 0;
      return `<article class="product-card trading-product-card" data-category="${escapeHtml(product.category)}">
        <div class="product-media trading-product-media">${product.featured ? '<span class="trading-product-tag">Featured</span>' : ''}${productVisual(product)}</div>
        <div class="product-body trading-product-body"><span class="trading-product-category">${escapeHtml(product.category)}</span><h3>${escapeHtml(product.name)}</h3><p class="spec">${escapeHtml(product.description)}</p>
          <div class="trading-product-meta"><span>${soldOut ? 'Currently unavailable' : `${Number(product.stock)} in stock`}</span><span class="price">${money(product.price)}</span></div>
          <button class="trading-add-cart" type="button" data-add-cart="${escapeHtml(product.id)}" ${soldOut ? 'disabled' : ''}><i class="fa-solid fa-bag-shopping"></i> ${soldOut ? 'Sold out' : 'Add to cart'}</button>
        </div></article>`;
    }).join('');
    renderAdminList();
  }
  function renderCart() {
    const itemsBox = $('shop-cart-items');
    const count = cart.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
    const total = cart.reduce((sum, item) => {
      const p = productById(item.id); return sum + (p ? Number(p.price) * Number(item.quantity) : 0);
    }, 0);
    if ($('shop-cart-count')) $('shop-cart-count').textContent = count;
    if ($('shop-cart-total')) $('shop-cart-total').textContent = money(total);
    if (itemsBox) {
      const valid = cart.filter(item => productById(item.id));
      if (!valid.length) itemsBox.innerHTML = '<div class="shop-cart-empty"><i class="fa-solid fa-bag-shopping"></i><h3>Your cart is empty</h3><p>Add products you would like to order.</p></div>';
      else itemsBox.innerHTML = valid.map(item => {
        const p = productById(item.id);
        return `<article class="shop-cart-item"><div class="shop-cart-item-image">${p.image ? `<img src="${p.image}" alt="">` : '<i class="fa-solid fa-box-open"></i>'}</div><div class="shop-cart-item-info"><b>${escapeHtml(p.name)}</b><span>${money(p.price)}</span><div class="shop-quantity"><button type="button" data-qty="${escapeHtml(p.id)}" data-delta="-1" aria-label="Decrease quantity">−</button><span>${item.quantity}</span><button type="button" data-qty="${escapeHtml(p.id)}" data-delta="1" aria-label="Increase quantity" ${item.quantity >= p.stock ? 'disabled' : ''}>+</button><button type="button" class="shop-remove-item" data-remove-cart="${escapeHtml(p.id)}">Remove</button></div></div><strong>${money(p.price * item.quantity)}</strong></article>`;
      }).join('');
    }
    if ($('shop-checkout')) $('shop-checkout').disabled = !cart.length || total <= 0;
    renderOrders();
  }
  function renderOrders() {
    const box = $('shop-orders-list');
    if (!box) return;
    const user = currentCustomer();
    if (!user) { box.innerHTML = '<p>Sign in to associate orders with your account. You can still submit an order using your contact details.</p>'; return; }
    const orders = getOrders().filter(order => order.email.toLowerCase() === String(user.email || '').toLowerCase()).slice(0, 5);
    box.innerHTML = orders.length ? orders.map(order => `<div class="shop-order-row"><b>${escapeHtml(order.reference)}</b><span>${money(order.total)}</span><small>${escapeHtml(order.status)} · ${escapeHtml(order.date)}</small></div>`).join('') : '<p>No orders saved for this account in this browser yet.</p>';
  }
  function openCart() {
    $('shop-cart')?.classList.add('is-open');
    $('shop-cart')?.setAttribute('aria-hidden','false');
    $('shop-cart-overlay')?.removeAttribute('hidden');
    $('shop-cart-toggle')?.setAttribute('aria-expanded','true');
    document.body.classList.add('shop-cart-open');
  }
  function closeCart() {
    $('shop-cart')?.classList.remove('is-open');
    $('shop-cart')?.setAttribute('aria-hidden','true');
    $('shop-cart-overlay')?.setAttribute('hidden','');
    $('shop-cart-toggle')?.setAttribute('aria-expanded','false');
    document.body.classList.remove('shop-cart-open');
  }
  function addToCart(id) {
    const product = productById(id);
    if (!product || Number(product.stock) < 1) return;
    const existing = cart.find(item => item.id === id);
    if (existing) {
      if (existing.quantity >= product.stock) { announceCart('You have reached the available stock for this product.'); return; }
      existing.quantity += 1;
    } else cart.push({id, quantity:1});
    setCart(cart);
    announceCart(`${product.name} added to your cart.`);
  }
  function announceCart(message) {
    const box = $('shop-cart-message');
    if (box) box.textContent = message;
  }
  function openCheckout() {
    if (!cart.length) { announceCart('Your cart is empty. Add a product before continuing.'); return; }
    const user = currentCustomer();
    const total = cart.reduce((sum,item) => sum + Number(productById(item.id)?.price || 0) * item.quantity, 0);
    if ($('shop-payment-amount')) $('shop-payment-amount').textContent = money(total);
    if ($('shop-payment-order')) $('shop-payment-order').textContent = 'Generated after submission';
    if ($('shop-customer-name')) $('shop-customer-name').value = user?.name || '';
    if ($('shop-customer-email')) $('shop-customer-email').value = user?.email || '';
    if ($('shop-payer-phone')) $('shop-payer-phone').value = user?.phone || '';
    if ($('shop-order-note')) $('shop-order-note').value = '';
    if ($('shop-payment-message')) $('shop-payment-message').textContent = '';
    if ($('shop-payment-result')) { $('shop-payment-result').hidden = true; $('shop-payment-result').innerHTML = ''; }
    $('shop-payment-modal').hidden = false;
    document.body.classList.add('shop-modal-open');
    closeCart();
    $('shop-customer-name')?.focus();
  }
  function closeCheckout() {
    $('shop-payment-modal').hidden = true;
    document.body.classList.remove('shop-modal-open');
  }
  function submitOrder(event) {
    event.preventDefault();
    const form = $('shop-payment-form');
    if (!form.checkValidity()) { form.reportValidity(); return; }
    const customer = {
      name: $('shop-customer-name').value.trim(),
      email: $('shop-customer-email').value.trim().toLowerCase(),
      phone: $('shop-payer-phone').value.trim(),
      method: $('shop-payment-method').value,
      note: $('shop-order-note').value.trim()
    };
    const lines = cart.map(item => {
      const product = productById(item.id);
      if (!product || Number(product.stock) < item.quantity) throw new Error(`Stock changed for ${product?.name || 'one item'}. Please update your cart.`);
      return {id:product.id, name:product.name, quantity:item.quantity, unitPrice:Number(product.price), subtotal:Number(product.price)*item.quantity};
    });
    if (!lines.length) return;
    const total = lines.reduce((sum,line) => sum + line.subtotal, 0);
    const order = {reference:makeId(), date:new Date().toLocaleString(), name:customer.name, email:customer.email, phone:customer.phone, method:customer.method, note:customer.note, items:lines, total, status:'Awaiting payment confirmation', paymentReference:'', userRole:currentRole() || 'guest'};
    const orders = getOrders(); orders.unshift(order); write(ORDERS_KEY, orders);
    const updatedProducts = products.map(p => {
      const line = lines.find(item => item.id === p.id);
      return line ? {...p, stock:Math.max(0, Number(p.stock)-line.quantity), stockMovements:[...(p.stockMovements||[]), {date:new Date().toISOString(), type:'Order stock reserved', delta:-Number(line.quantity), reason:`Order ${order.reference} submitted` }]} : p;
    });
    products = updatedProducts; write(PRODUCTS_KEY, products); setCart([]);
    if ($('shop-payment-order')) $('shop-payment-order').textContent = order.reference;
    if ($('shop-payment-message')) $('shop-payment-message').textContent = '';
    const result = $('shop-payment-result');
    result.innerHTML = `<div class="shop-result-icon"><i class="fa-solid fa-circle-check"></i></div><h3>Order submitted</h3><p>Your order has been recorded in this browser. Keep the reference below and contact ACTUAL HOLDINGS to confirm the current payment instructions.</p><div class="shop-result-reference">${escapeHtml(order.reference)}</div><p><b>Total:</b> ${money(total)}<br><b>Payment method:</b> ${escapeHtml(customer.method)}<br><b>Status:</b> ${escapeHtml(order.status)}</p><p class="shop-result-warning"><i class="fa-solid fa-circle-info"></i> This demo does not charge your account or verify payments automatically. Do not send money until staff confirms official payment details.</p><button type="button" class="trading-primary-button" id="shop-order-done">Done</button>`;
    result.hidden = false;
    form.hidden = true;
    $('shop-payment-title').textContent = 'Thank you for your order';
    $('shop-payment-amount').textContent = money(total);
    result.querySelector('#shop-order-done')?.addEventListener('click', () => { closeCheckout(); form.hidden = false; $('shop-payment-title').textContent = 'Confirm your order'; renderProducts(); });
    renderProducts(); renderCart();
  }
  function resetProductForm() {
    $('shop-product-form')?.reset();
    if ($('shop-edit-id')) $('shop-edit-id').value = '';
    if ($('shop-product-stock')) $('shop-product-stock').value = '10';
    pendingImage = '';
    if ($('shop-product-save-label')) $('shop-product-save-label').textContent = 'Save product';
    if ($('shop-product-admin-message')) $('shop-product-admin-message').textContent = '';
  }
  function renderAdminList() {
    const panel = $('shop-admin-tools');
    if (!panel) return;
    panel.hidden = !isStaff();
    if (!isStaff()) return;
    if ($('shop-admin-role')) $('shop-admin-role').textContent = currentRole() === 'owner' ? 'Owner access' : 'Admin access';
    if ($('shop-admin-product-count')) $('shop-admin-product-count').textContent = `${products.length} product${products.length === 1 ? '' : 's'}`;
    const list = $('shop-admin-product-list');
    if (!list) return;
    list.innerHTML = products.map(p => `<div class="shop-admin-product"><div class="shop-admin-product-thumb">${p.image ? `<img src="${p.image}" alt="">` : '<i class="fa-solid fa-box"></i>'}</div><div class="shop-admin-product-info"><b>${escapeHtml(p.name)}</b><span>${money(p.price)} · Stock: ${Number(p.stock)} · ${escapeHtml(p.category)}</span></div><button type="button" data-edit-product="${escapeHtml(p.id)}"><i class="fa-solid fa-pen"></i> Edit</button><button type="button" class="shop-delete-product" data-delete-product="${escapeHtml(p.id)}"><i class="fa-solid fa-trash"></i> Delete</button></div>`).join('');
  }
  function editProduct(id) {
    if (!isStaff()) return;
    const p = productById(id); if (!p) return;
    $('shop-edit-id').value = p.id; $('shop-product-name').value = p.name; $('shop-product-category').value = p.category;
    $('shop-product-price').value = p.price; $('shop-product-stock').value = p.stock; $('shop-product-description').value = p.description;
    pendingImage = p.image || '';
    $('shop-product-save-label').textContent = 'Update product';
    $('shop-product-admin-message').textContent = `Editing ${p.name}. Choose a new image only if you want to replace the current one.`;
    $('shop-admin-tools').scrollIntoView({behavior:'smooth',block:'start'});
  }
  function saveProduct(event) {
    event.preventDefault();
    if (!isStaff()) return;
    const name = $('shop-product-name').value.trim();
    const price = Number($('shop-product-price').value);
    const stock = Number($('shop-product-stock').value);
    const description = $('shop-product-description').value.trim();
    if (!name || !description || !Number.isFinite(price) || price <= 0 || !Number.isInteger(stock) || stock < 0) {
      $('shop-product-admin-message').textContent = 'Enter a valid name, description, price and stock quantity.'; return;
    }
    const id = $('shop-edit-id').value;
    const previous = id ? productById(id) : null;
    const product = {...(previous || {}), id:id || makeId(), sku:previous?.sku || id || makeId(), name, category:$('shop-product-category').value, price, costPrice:previous?.costPrice ?? null, lowStockThreshold:previous?.lowStockThreshold ?? 5, status:stock <= 0 ? 'Out of Stock' : (previous?.status === 'Inactive' ? 'Inactive' : 'Active'), stock, description, image:pendingImage || previous?.image || '', vendor:'ACTUAL Trading', featured:previous?.featured || false, stockMovements:previous?.stockMovements || [], updatedAt:new Date().toISOString()};
    products = id ? products.map(p => p.id === id ? product : p) : [product, ...products];
    write(PRODUCTS_KEY, products);
    resetProductForm(); $('shop-product-admin-message').textContent = 'Product saved successfully.';
    renderProducts();
  }
  function handleImageFile(file) {
    pendingImage = '';
    if (!file) return;
    if (!/^image\/(png|jpeg|webp)$/.test(file.type)) { $('shop-product-admin-message').textContent = 'Choose a PNG, JPG or WEBP image.'; $('shop-product-image').value=''; return; }
    if (file.size > 5 * 1024 * 1024) { $('shop-product-admin-message').textContent = 'Image must be 5 MB or smaller. Compress it and try again.'; $('shop-product-image').value=''; return; }
    const reader = new FileReader();
    reader.onload = () => { pendingImage = String(reader.result || ''); $('shop-product-admin-message').textContent = 'Image ready. Save the product to apply it.'; };
    reader.onerror = () => { $('shop-product-admin-message').textContent = 'Could not read that image. Try another file.'; };
    reader.readAsDataURL(file);
  }

  document.addEventListener('DOMContentLoaded', () => {
    products = getProducts();
    cart = getCart().filter(item => productById(item.id) && Number(item.quantity) > 0);
    // Add staff controls only for authenticated admin/owner sessions.
    if (isStaff()) {
      const panel = $('shop-admin-tools');
      if (panel) panel.hidden = false;
    }
    renderProducts(); renderCart();
    $('shop-cart-toggle')?.addEventListener('click', () => $('shop-cart')?.classList.contains('is-open') ? closeCart() : openCart());
    $('shop-cart-close')?.addEventListener('click', closeCart);
    $('shop-cart-overlay')?.addEventListener('click', closeCart);
    $('shop-checkout')?.addEventListener('click', openCheckout);
    $('shop-payment-close')?.addEventListener('click', closeCheckout);
    $('shop-payment-modal')?.addEventListener('click', event => { if (event.target === $('shop-payment-modal')) closeCheckout(); });
    $('shop-payment-form')?.addEventListener('submit', submitOrder);
    $('shop-product-form')?.addEventListener('submit', saveProduct);
    $('shop-product-cancel')?.addEventListener('click', resetProductForm);
    $('shop-product-image')?.addEventListener('change', event => handleImageFile(event.target.files?.[0]));
    $('shop-search')?.addEventListener('input', event => { searchTerm = event.target.value.trim().toLowerCase(); renderProducts(); });
    document.querySelectorAll('.filter-tabs [data-filter], .trading-collection-card[data-filter]').forEach(button => button.addEventListener('click', () => {
      activeFilter = button.dataset.filter || 'all';
      document.querySelectorAll('.filter-tabs [data-filter]').forEach(tab => { if (tab.dataset.filter === activeFilter) tab.scrollIntoView({block:'nearest',inline:'nearest',behavior:'smooth'}); });
      renderProducts();
      if (button.classList.contains('trading-collection-card')) $('new-products')?.scrollIntoView({behavior:'smooth'});
    }));
    document.addEventListener('click', event => {
      const add = event.target.closest('[data-add-cart]');
      if (add) { addToCart(add.dataset.addCart); return; }
      const qty = event.target.closest('[data-qty]');
      if (qty) {
        const item = cart.find(row => row.id === qty.dataset.qty), p = productById(qty.dataset.qty);
        if (!item || !p) return;
        const next = item.quantity + Number(qty.dataset.delta);
        if (next <= 0) cart = cart.filter(row => row.id !== item.id);
        else if (next <= Number(p.stock)) item.quantity = next;
        else announceCart('Quantity exceeds current stock.');
        setCart(cart); return;
      }
      const remove = event.target.closest('[data-remove-cart]');
      if (remove) { setCart(cart.filter(row => row.id !== remove.dataset.removeCart)); return; }
      const edit = event.target.closest('[data-edit-product]');
      if (edit) { editProduct(edit.dataset.editProduct); return; }
      const del = event.target.closest('[data-delete-product]');
      if (del) {
        if (!isStaff()) return;
        const p = productById(del.dataset.deleteProduct);
        if (p && window.confirm(`Remove "${p.name}" from the shop?`)) {
          products = products.filter(row => row.id !== p.id);
          cart = cart.filter(row => row.id !== p.id);
          write(PRODUCTS_KEY, products); write(CART_KEY, cart); renderProducts(); renderCart();
          if ($('shop-product-admin-message')) $('shop-product-admin-message').textContent = 'Product removed from the current browser demo.';
        }
      }
    });
    document.addEventListener('keydown', event => { if (event.key === 'Escape') { closeCart(); if (!$('shop-payment-modal')?.hidden) closeCheckout(); } });
  });
})();

}


/* ===== Former inline page behaviors ===== */
document.addEventListener('DOMContentLoaded', () => {
  if (location.pathname.endsWith('/family-detail.html')) {
    const division = new URLSearchParams(location.search).get('slug');
    const divisions = {
      'actual-accounting':['ACTUAL ACCOUNTING','Accounting, tax, compliance and business support.'],
      'actual-design':['ACTUAL DESIGN','Creative design services for clear, professional business communication.'],
      'actual-photography':['ACTUAL PHOTOGRAPHY','Professional visual storytelling and photography services.'],
      'actual-music':['ACTUAL MUSIC','Music and audio production services.']
    };
    if (divisions[division]) { const name=document.getElementById('division-name'); const copy=document.getElementById('division-copy'); if(name)name.textContent=divisions[division][0]; if(copy)copy.textContent=divisions[division][1]; }
  }
  if (location.pathname.endsWith('/login.html') && new URLSearchParams(location.search).get('signup') === 'success') {
    const message=document.getElementById('login-message'); if(message)message.textContent='Your account was created successfully. Please sign in with your email and password.';
  }
  if (location.pathname.endsWith('/owner.html')) {
    document.getElementById('owner-demo-logout')?.addEventListener('click',()=>{localStorage.removeItem('actualHoldingsFrontendSession');window.location.href='../login.html';});
  }
});


/* ===== Owner communication centre, live notifications and shared settings ===== */
if (document.body.classList.contains('owner-ui')) {
(() => {
 'use strict';
 const MESSAGE_KEY='actualHoldingOwnerMessagesV1';
 const NOTICE_KEY='actualHoldingOwnerNotificationsV1';
 const SETTINGS_KEY='actualHoldingOwnerSettingsV1';
 const SEEN_INCOMING_KEY='actualHoldingOwnerSeenIncomingV1';
 const $=id=>document.getElementById(id);
 const safeParse=(raw,fallback)=>{try{const v=JSON.parse(raw);return v??fallback}catch(_){return fallback}};
 const read=(key,fallback=[])=>{const v=safeParse(localStorage.getItem(key),fallback);return Array.isArray(fallback)?(Array.isArray(v)?v:fallback):v};
 const write=(key,value)=>{try{localStorage.setItem(key,JSON.stringify(value));window.dispatchEvent(new CustomEvent('actual:owner-data-changed',{detail:{key}}));return true}catch(error){console.error('Owner frontend storage error',error);return false}};
 const escapeHtml=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const id=prefix=>`${prefix}-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2,7).toUpperCase()}`;
 const fmtDate=value=>{const date=new Date(value);return Number.isNaN(date.getTime())?'':new Intl.DateTimeFormat(undefined,{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'}).format(date)};
 let activeConversation='',messageFilter='all',selectedNotificationFilter='all',lastMessageCount=-1,lastNoticeSignature='';
 let channel=null;
 try{if('BroadcastChannel' in window){channel=new BroadcastChannel('actual-holdings-owner-live');channel.onmessage=()=>refreshAll()}}catch(_){channel=null}
 const broadcast=()=>{try{channel?.postMessage({type:'refresh',at:Date.now()})}catch(_){}window.dispatchEvent(new CustomEvent('actual:owner-data-changed'))};
 function notices(){return read(NOTICE_KEY,[]).map(n=>({...n,read:!!n.read})).sort((a,b)=>new Date(b.createdAt||0)-new Date(a.createdAt||0))}
 function messages(){return read(MESSAGE_KEY,[]).sort((a,b)=>new Date(a.createdAt||0)-new Date(b.createdAt||0))}
 function unreadMessages(){return messages().filter(m=>m.recipientRole==='owner'&&!m.read).length}
 function notificationEnabled(category){const prefs=loadSettings().notifications||{};const key=category==='payments'?'payments':category==='services'?'services':category==='trading'?'trading':category==='messages'?'messages':'system';return prefs[key]!==false}
 function processIncomingMessages(){const seenSet=new Set(read(SEEN_INCOMING_KEY,[]));const incoming=messages().filter(m=>m.recipientRole==='owner'&&!m.read&&!seenSet.has(m.id));if(!incoming.length)return;incoming.forEach(m=>seenSet.add(m.id));write(SEEN_INCOMING_KEY,[...seenSet].slice(-500));if(!notificationEnabled('messages'))return;const all=notices();incoming.reverse().forEach(m=>all.unshift({id:id('NOT'),title:'New message received',message:`${m.senderName||m.senderRole||'A contact'}: ${String(m.body||'').slice(0,180)}`,category:'messages',targetView:'messages',createdAt:m.createdAt||new Date().toISOString(),read:false}));saveNotices(all)}
 function saveNotices(list){return write(NOTICE_KEY,list.slice(0,250))}
 function addNotice(title,message,category='system',targetView='notifications',priority='normal'){
  const list=notices();list.unshift({id:id('NOT'),title,message,category,targetView,priority,createdAt:new Date().toISOString(),read:false});
  if(saveNotices(list)){broadcast();return true}return false;
 }
 function setBadges(){
  const n=notices().filter(x=>!x.read).length;const m=unreadMessages();
  ['notification-badge','top-notification-badge'].forEach(k=>{const el=$(k);if(el)el.textContent=n>99?'99+':String(n)});
  ['message-badge','top-message-badge'].forEach(k=>{const el=$(k);if(el)el.textContent=m>99?'99+':String(m)});
 }
 function categoryFor(n){const c=String(n.category||'').toLowerCase();if(c.includes('payment')||/payment|receipt|refund|invoice/.test((n.title+' '+n.message).toLowerCase()))return'payments';if(c.includes('service')||/service|request|assignment|quotation/.test((n.title+' '+n.message).toLowerCase()))return'services';if(c.includes('trading')||/trading|stock|order|inventory/.test((n.title+' '+n.message).toLowerCase()))return'trading';if(c.includes('message')||/message|reply|conversation/.test((n.title+' '+n.message).toLowerCase()))return'messages';return'system'}
 function iconFor(n){const c=categoryFor(n);return c==='payments'?'fa-money-bill-wave':c==='services'?'fa-briefcase':c==='trading'?'fa-boxes-stacked':c==='messages'?'fa-envelope':n.priority==='critical'?'fa-triangle-exclamation':'fa-bell'}
 function renderNotifications(){
  const panel=$('notifications-panel');if(!panel)return;
  const all=notices().filter(n=>notificationEnabled(categoryFor(n)));const unread=all.filter(n=>!n.read).length;
  const filter=$('notification-filter')?.value||selectedNotificationFilter;
  const filtered=all.filter(n=>filter==='all'||(filter==='unread'?!n.read:categoryFor(n)===filter));
  $('notification-unread-total').textContent=`${unread} unread`;$('notification-total').textContent=`${all.length} total notifications`;
  if(!filtered.length){panel.innerHTML='<div class="notice-empty"><i class="fa-regular fa-circle-check"></i>No notifications match this filter.</div>';setBadges();return}
  panel.innerHTML=filtered.map(n=>{const cat=categoryFor(n);return `<article class="owner-notification ${n.read?'':'is-unread'}" data-notice-id="${escapeHtml(n.id)}"><span class="owner-notification-icon ${cat} ${n.priority==='critical'?'critical':''}"><i class="fa-solid ${iconFor(n)}"></i></span><div class="owner-notification-content"><strong>${escapeHtml(n.title||'Update')}</strong><p>${escapeHtml(n.message||'')}</p><time>${escapeHtml(fmtDate(n.createdAt))}${n.priority==='critical'?' · Critical':''}</time></div><div class="owner-notification-actions">${n.read?'':'<button type="button" data-notice-read="'+escapeHtml(n.id)+'">Mark read</button>'}<button type="button" data-notice-open="${escapeHtml(n.id)}">Open</button></div></article>`}).join('');
  setBadges();
 }
 function threadIdFor(m){return m.conversationId||m.id}
 function conversationGroups(){
  const all=messages();const map=new Map();
  all.forEach(m=>{const cid=threadIdFor(m);if(!map.has(cid))map.set(cid,[]);map.get(cid).push(m)});
  return [...map.entries()].map(([id,items])=>{const latest=items[items.length-1];const incoming=items.filter(m=>m.recipientRole==='owner');const unread=incoming.filter(m=>!m.read).length;return{id,items,latest,unread,role:latest.senderRole==='owner'?latest.recipientRole:latest.senderRole,name:latest.senderRole==='owner'?latest.recipientName:latest.senderName}}).sort((a,b)=>new Date(b.latest.createdAt)-new Date(a.latest.createdAt));
 }
 function visibleGroups(){const query=($('message-search')?.value||'').trim().toLowerCase();return conversationGroups().filter(g=>{const match=!query||`${g.name} ${g.latest.subject||''} ${g.latest.body||''} ${g.role}`.toLowerCase().includes(query);const filter=messageFilter==='all'||(messageFilter==='unread'?g.unread>0:g.items.some(m=>m.senderRole==='owner'));return match&&filter})}
 function renderConversationList(){
  const list=$('message-conversation-list');if(!list)return;const groups=visibleGroups();$('message-inbox-count').textContent=`${conversationGroups().length} conversations`;
  if(!groups.length){list.innerHTML='<div class="message-empty-small">No conversations found. Start a new message.</div>';setBadges();return}
  list.innerHTML=groups.map(g=>`<button type="button" class="message-conversation ${g.id===activeConversation?'is-active':''}" data-conversation-id="${escapeHtml(g.id)}"><span class="message-avatar">${escapeHtml((g.name||'?').trim().slice(0,1).toUpperCase())}</span><span class="message-conversation-main"><span class="message-conversation-top"><strong>${escapeHtml(g.name||'Unknown contact')}</strong><time>${escapeHtml(fmtDate(g.latest.createdAt))}</time></span><p>${escapeHtml(g.latest.body||g.latest.subject||'Attachment')}</p><span class="message-role-tag">${escapeHtml(g.role||'contact')}</span></span>${g.unread?'<span class="message-unread-dot" aria-label="Unread"></span>':''}</button>`).join('');setBadges();
 }
 function markThreadRead(cid){let changed=false;const all=messages().map(m=>{if(threadIdFor(m)===cid&&m.recipientRole==='owner'&&!m.read){changed=true;return{...m,read:true,readAt:new Date().toISOString()}}return m});if(changed)write(MESSAGE_KEY,all)}
 function renderThread(){
  const root=$('message-thread-content'),form=$('message-reply-form');if(!root)return;const group=conversationGroups().find(g=>g.id===activeConversation);
  if(!group){root.className='message-thread-empty';root.innerHTML='<i class="fa-regular fa-comments"></i><h2>Select a conversation</h2><p>Choose a conversation or start a new message.</p><button type="button" class="add-button" id="message-start-first">Compose message</button>';form.hidden=true;return}
  markThreadRead(group.id);root.className='message-thread-view';root.innerHTML=`<header class="message-thread-head"><span class="message-avatar">${escapeHtml((group.name||'?').trim().slice(0,1).toUpperCase())}</span><div><h3>${escapeHtml(group.name||'Contact')}</h3><p>${escapeHtml((group.role||'contact').toUpperCase())} · ${escapeHtml(group.latest.subject||'Conversation')}</p></div></header><div class="message-thread-body">${group.items.map(m=>`<article class="message-bubble ${m.senderRole==='owner'?'is-outgoing':''}"><strong>${escapeHtml(m.senderRole==='owner'?'You':(m.senderName||m.senderRole||'Contact'))}</strong><p>${escapeHtml(m.body||'')}</p><time>${escapeHtml(fmtDate(m.createdAt))}</time></article>`).join('')}</div>`;
  form.hidden=false;form.dataset.conversationId=group.id;const body=root.querySelector('.message-thread-body');if(body)body.scrollTop=body.scrollHeight;setBadges();
 }
 function renderMessages(){renderConversationList();renderThread()}
 function ownerName(){const u=safeParse(localStorage.getItem('actualHoldingsFrontendSession'),'')||{};return u.name||u.fullName||'Owner'}
 function sendMessage({role,name,subject,body,conversationId=''}){
  const now=new Date().toISOString();const all=messages();const cid=conversationId||id('CONV');const msg={id:id('MSG'),conversationId:cid,senderRole:'owner',senderName:ownerName(),recipientRole:role,recipientName:name,subject:subject||'Conversation',body,createdAt:now,read:true};
  all.push(msg);if(!write(MESSAGE_KEY,all))return false;
  addNotice('Message sent',`Your message to ${name} (${role}) was saved in the frontend demo.`,'messages','messages');
  activeConversation=cid;broadcast();renderMessages();return true;
 }
 function loadSettings(){const s=read(SETTINGS_KEY,{businessName:'ACTUAL HOLDINGS',businessEmail:'',businessPhone:'',businessWebsite:'',notifications:{payments:true,services:true,trading:true,messages:true,system:true}});return s&&typeof s==='object'?s:{businessName:'ACTUAL HOLDINGS',notifications:{}}}
 function fillSettings(){const s=loadSettings();const map={'setting-business-name':s.businessName,'setting-business-email':s.businessEmail,'setting-business-phone':s.businessPhone,'setting-business-website':s.businessWebsite};Object.entries(map).forEach(([id,value])=>{if($(id))$(id).value=value||''});['payments','services','trading','messages','system'].forEach(k=>{const el=$(`setting-notify-${k}`);if(el)el.checked=s.notifications?.[k]!==false})}
 function saveSettings(e){e.preventDefault();const s={businessName:$('setting-business-name').value.trim(),businessEmail:$('setting-business-email').value.trim(),businessPhone:$('setting-business-phone').value.trim(),businessWebsite:$('setting-business-website').value.trim(),notifications:Object.fromEntries(['payments','services','trading','messages','system'].map(k=>[k,$(`setting-notify-${k}`).checked])),updatedAt:new Date().toISOString(),updatedBy:ownerName()};if(!write(SETTINGS_KEY,s)){$('owner-settings-status')&&($('owner-settings-status').textContent='Could not save settings in browser storage.');return}const status=$('owner-settings-status');if(status)status.textContent='Settings saved in this browser demo.';const toast=$('toast');if(toast){toast.textContent='Owner settings saved.';toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),2400)}}
 function openCompose(){const d=$('message-compose-dialog');if(!d)return;$('message-compose-form').reset();$('message-compose-status').textContent='';d.showModal()}
 function bind(){
  $('message-compose-new')?.addEventListener('click',openCompose);$('message-start-first')?.addEventListener('click',openCompose);
  $('message-compose-form')?.addEventListener('submit',e=>{e.preventDefault();const role=$('message-recipient-role').value,name=$('message-recipient-name').value.trim(),subject=$('message-subject').value.trim(),body=$('message-body').value.trim();if(!name||!subject||!body)return;if(sendMessage({role,name,subject,body}))$('message-compose-dialog').close();else $('message-compose-status').textContent='Message could not be saved. Check browser storage and try again.'});
  document.addEventListener('click',e=>{
   const close=e.target.closest('[data-owner-dialog-close]');if(close){$(close.dataset.ownerDialogClose)?.close();return}
   const conv=e.target.closest('[data-conversation-id]');if(conv){activeConversation=conv.dataset.conversationId;renderMessages();return}
   const readBtn=e.target.closest('[data-notice-read]');if(readBtn){const id=readBtn.dataset.noticeRead;saveNotices(notices().map(n=>n.id===id?{...n,read:true}:n));renderNotifications();return}
   const openBtn=e.target.closest('[data-notice-open]');if(openBtn){const n=notices().find(x=>x.id===openBtn.dataset.noticeOpen);if(!n)return;saveNotices(notices().map(x=>x.id===n.id?{...x,read:true}:x));const view=n.targetView||'notifications';document.querySelector(`[data-view="${view}"]`)?.click();renderNotifications();return}
   if(e.target.closest('#notification-mark-all')){saveNotices(notices().map(n=>({...n,read:true})));renderNotifications();return}
  });
  $('message-reply-form')?.addEventListener('submit',e=>{e.preventDefault();const body=$('message-reply-text').value.trim();if(!body)return;const group=conversationGroups().find(g=>g.id===e.currentTarget.dataset.conversationId);if(!group)return;const last=group.latest;const role=last.senderRole==='owner'?last.recipientRole:last.senderRole;const name=last.senderRole==='owner'?last.recipientName:last.senderName;if(sendMessage({role,name,subject:last.subject||'Conversation',body,conversationId:group.id}))$('message-reply-text').value=''});
  $('message-search')?.addEventListener('input',renderConversationList);
  document.querySelectorAll('[data-message-filter]').forEach(b=>b.addEventListener('click',()=>{messageFilter=b.dataset.messageFilter;document.querySelectorAll('[data-message-filter]').forEach(x=>x.classList.toggle('is-active',x===b));renderConversationList()}));
  $('notification-filter')?.addEventListener('change',e=>{selectedNotificationFilter=e.target.value;renderNotifications()});
  $('owner-settings-form')?.addEventListener('submit',saveSettings);$('owner-settings-reset')?.addEventListener('click',fillSettings);
  document.addEventListener('click',e=>{const nav=e.target.closest('[data-view]');if(nav?.dataset.view==='messages')renderMessages();if(nav?.dataset.view==='notifications')renderNotifications();if(nav?.dataset.view==='settings')fillSettings()});
  window.addEventListener('storage',e=>{if([MESSAGE_KEY,NOTICE_KEY,SETTINGS_KEY].includes(e.key))refreshAll()});
  window.addEventListener('actual:owner-data-changed',refreshAll);
  window.addEventListener('actual:commerce-updated',()=>{renderNotifications();setBadges()});
 }
 function refreshAll(){processIncomingMessages();setBadges();renderConversationList();if($('view-messages')?.classList.contains('active'))renderThread();if($('view-notifications')?.classList.contains('active'))renderNotifications()}
 function watchLowStock(){const products=read('actualTradingProductsV1',[]);products.filter(p=>Number(p.stock||0)<=Number(p.lowStockThreshold??p.threshold??5)).forEach(p=>{const key=`low-stock:${p.id}:${p.stock}`;const seen=read('actualHoldingLowStockNoticesV1',[]);if(seen.includes(key))return;seen.push(key);write('actualHoldingLowStockNoticesV1',seen.slice(-500));addNotice('Low stock alert',`${p.name||'Product'} has ${Number(p.stock||0)} item(s) remaining.`,'trading','shop','important')})}
 function init(){bind();fillSettings();processIncomingMessages();renderMessages();renderNotifications();setBadges();watchLowStock();setInterval(()=>{refreshAll();watchLowStock()},1800);}
 if(document.readyState==='loading'||document.readyState==='interactive')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
}


/* ===== Shared frontend profile-photo manager (Owner, Admin and Client) ===== */
(() => {
  'use strict';
  const SESSION_KEY = 'actualHoldingsFrontendSession';
  const MAX_FILE_BYTES = 5 * 1024 * 1024;
  const MAX_EDGE = 640;
  const QUALITY = 0.82;
  const PHOTO_PREFIX = 'actualHoldingsProfilePhoto:v1:';
  const OWNER_NAME = 'MUGISHA J.D.';

  function readUser() {
    try { return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null') || {}; }
    catch (_) { return {}; }
  }
  function currentRole() {
    const body = document.body;
    if (body.classList.contains('owner-ui')) return 'owner';
    if (body.classList.contains('management-app')) return 'admin';
    if (body.classList.contains('client-app')) return 'client';
    return String(readUser().role || 'user').toLowerCase();
  }
  function photoKey() {
    const user = readUser();
    const role = currentRole();
    const identity = role === 'owner'
      ? String(user.id || user.email || OWNER_NAME)
      : String(user.id || user.email || user.username || user.name || role);
    return PHOTO_PREFIX + role + ':' + identity.trim().toLowerCase().replace(/[^a-z0-9@._-]/g, '_');
  }
  function setAvatar(element, dataUrl) {
    if (!element) return;
    if (!element.dataset.profileOriginal) element.dataset.profileOriginal = (element.textContent || 'U').trim().slice(0, 1).toUpperCase() || 'U';
    if (dataUrl) {
      let image = element.querySelector('img.profile-avatar-photo');
      if (!image) {
        element.textContent = '';
        image = document.createElement('img');
        image.className = 'profile-avatar-photo';
        image.alt = 'Profile photo';
        image.decoding = 'async';
        element.appendChild(image);
      }
      image.src = dataUrl;
      element.classList.add('has-profile-photo');
      element.setAttribute('aria-label', 'Profile photo');
    } else {
      element.querySelector('img.profile-avatar-photo')?.remove();
      element.classList.remove('has-profile-photo');
      if (!element.textContent.trim()) element.textContent = element.dataset.profileOriginal;
    }
  }
  function applyPhoto(dataUrl) {
    const ids = currentRole() === 'owner'
      ? ['profile-initial', 'owner-profile-avatar']
      : currentRole() === 'admin'
        ? ['admin-avatar', 'top-avatar', 'admin-profile-avatar']
        : ['sidebar-avatar', 'top-avatar', 'profile-avatar'];
    ids.forEach(id => setAvatar(document.getElementById(id), dataUrl));
  }
  function loadPhoto() {
    let dataUrl = '';
    try { dataUrl = localStorage.getItem(photoKey()) || ''; } catch (_) {}
    applyPhoto(dataUrl);
  }
  function fileToCompressedDataUrl(file) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      const objectUrl = URL.createObjectURL(file);
      image.onload = () => {
        const ratio = Math.min(1, MAX_EDGE / Math.max(image.naturalWidth, image.naturalHeight));
        const width = Math.max(1, Math.round(image.naturalWidth * ratio));
        const height = Math.max(1, Math.round(image.naturalHeight * ratio));
        const canvas = document.createElement('canvas');
        canvas.width = width; canvas.height = height;
        const context = canvas.getContext('2d');
        if (!context) { URL.revokeObjectURL(objectUrl); reject(new Error('This browser cannot process the selected image.')); return; }
        context.drawImage(image, 0, 0, width, height);
        URL.revokeObjectURL(objectUrl);
        resolve(canvas.toDataURL('image/jpeg', QUALITY));
      };
      image.onerror = () => { URL.revokeObjectURL(objectUrl); reject(new Error('The selected image could not be opened.')); };
      image.src = objectUrl;
    });
  }
  async function handleInput(input) {
    const file = input?.files?.[0];
    if (!file) return;
    const status = document.getElementById(currentRole() === 'owner' ? 'owner-profile-photo-status' : 'profile-photo-status');
    const setStatus = message => { if (status) status.textContent = message; };
    if (!/^image\/(jpeg|png|webp)$/i.test(file.type)) {
      setStatus('Choose a JPG, PNG or WebP image.');
      input.value = '';
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      setStatus('The image is larger than 5 MB. Choose a smaller image.');
      input.value = '';
      return;
    }
    try {
      setStatus('Preparing your profile photo…');
      const dataUrl = await fileToCompressedDataUrl(file);
      localStorage.setItem(photoKey(), dataUrl);
      applyPhoto(dataUrl);
      setStatus('Profile photo updated in this browser.');
      window.dispatchEvent(new CustomEvent('actual:profile-photo-updated', { detail: { role: currentRole() } }));
    } catch (error) {
      setStatus(error.message || 'Unable to save this profile photo.');
    } finally {
      input.value = '';
    }
  }
  function bindInputs() {
    const role = currentRole();
    const ids = role === 'owner'
      ? ['owner-profile-photo-input']
      : role === 'admin'
        ? ['admin-profile-photo']
        : role === 'client'
          ? ['profile-photo-input']
          : [];
    ids.forEach(id => {
      const input = document.getElementById(id);
      if (!input || input.dataset.profilePhotoBound) return;
      input.dataset.profilePhotoBound = 'true';
      input.addEventListener('change', () => handleInput(input));
    });
  }
  function init() {
    if (!document.body.classList.contains('owner-ui') && !document.body.classList.contains('management-app') && !document.body.classList.contains('client-app')) return;
    if (currentRole() === 'owner') {
      const user = readUser();
      user.role = 'owner';
      user.name = OWNER_NAME;
      try { localStorage.setItem(SESSION_KEY, JSON.stringify(user)); } catch (_) {}
      const nameIds = ['profile-name', 'welcome-name'];
      nameIds.forEach(id => { const element = document.getElementById(id); if (element) element.textContent = OWNER_NAME; });
    }
    loadPhoto();
    bindInputs();
    window.addEventListener('storage', event => { if (event.key === photoKey()) loadPhoto(); });
  }
  window.ACTUALProfilePhotos = { handleInput, refresh: loadPhoto };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();

/* ===== Admin workspace: soft-delete UX, role-aware messaging, preferences and approval requests ===== */
(function initAdminWorkspaceArchitecture(){
  'use strict';
  if (!document.body.classList.contains('management-app') || !document.getElementById('admin-sidebar')) return;
  const BIN_KEY = 'actualHoldingsAdminRecycleBinV1';
  const MSG_KEY = 'actualHoldingsAdminMessagesV1';
  const PREF_KEY = 'actualHoldingsAdminPreferencesV1';
  const APPROVAL_KEY = 'actualHoldingsOwnerApprovalRequestsV1';
  const $ = id => document.getElementById(id);
  const read = (key, fallback=[]) => { try { const value=JSON.parse(localStorage.getItem(key)||'null'); return value ?? fallback; } catch (_) { return fallback; } };
  const write = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch (_) { return false; } };
  const safe = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const currentName = () => $('admin-name')?.textContent?.trim() || 'Admin';
  const stamp = () => new Date().toISOString();
  const notifyStatus = (el, message) => { if(el) el.textContent=message; };

  function renderRecycleBin(){
    const body=$('admin-recycle-body'); if(!body)return;
    const records=read(BIN_KEY,[]);
    const count=$('recycle-bin-count'); if(count)count.textContent=String(records.length);
    if(!records.length){body.innerHTML='<tr><td colspan="6">Recycle Bin is empty. Deleted records will appear here.</td></tr>';return;}
    body.innerHTML=records.map(item=>`<tr><td><strong>${safe(item.label)}</strong><br><small>${safe(item.id)}</small></td><td>${safe(item.type)}</td><td>${safe(item.deletedBy)}</td><td>${safe(new Date(item.deletedAt).toLocaleString())}</td><td>${safe(item.reason||'Admin soft deletion')}</td><td><div class="row-actions"><button class="secondary-btn" type="button" data-bin-restore="${safe(item.id)}">Restore</button><button class="secondary-btn danger-text" type="button" data-bin-request="${safe(item.id)}">Request permanent deletion</button></div></td></tr>`).join('');
  }
  function renderApprovalRequests(){
    const root=$('admin-approval-requests'); if(!root)return;
    const requests=read(APPROVAL_KEY,[]).filter(x=>x.requestedBy===currentName() || x.requestedByRole==='admin');
    root.innerHTML=requests.length?requests.slice().reverse().map(x=>`<div class="admin-approval-row"><span><strong>${safe(x.action)}</strong><br>${safe(x.recordLabel)} · ${safe(new Date(x.requestedAt).toLocaleString())}<br><small>Status: ${safe(x.status||'Pending Owner review')}</small></span><span class="admin-role-pill">${safe(x.status||'Pending')}</span></div>`).join(''):'<p class="admin-empty-state">No approval requests submitted from this browser.</p>';
  }
  function saveSoftDeleted(element,type,label){
    const bin=read(BIN_KEY,[]); const id=`ADM-DEL-${Date.now()}-${Math.random().toString(36).slice(2,7)}`;
    const parent=element.parentElement; const parentId=parent?.id||''; const index=parent?[...parent.children].indexOf(element):-1;
    const record={id,type,label:label||type,deletedBy:currentName(),deletedAt:stamp(),reason:'Soft deleted by Admin',parentId,index,html:element.outerHTML};
    bin.push(record);
    if(!write(BIN_KEY,bin)){alert('Could not move this record to the Recycle Bin. Browser storage may be full.');return false;}
    element.remove(); renderRecycleBin(); renderApprovalRequests(); return true;
  }
  function restoreRecord(id){
    const bin=read(BIN_KEY,[]); const item=bin.find(x=>x.id===id); if(!item)return;
    if(item.employeeRecord){const employeeKey='actualHoldingsAdminEmployeesV1';const employees=read(employeeKey,[]);if(!employees.some(x=>x.id===item.employeeRecord.id)){employees.push(item.employeeRecord);write(employeeKey,employees);}write(BIN_KEY,bin.filter(x=>x.id!==id));document.dispatchEvent(new CustomEvent('admin:employee-restored'));renderRecycleBin();return;}
    if(item.clientRecord){write(BIN_KEY,bin.filter(x=>x.id!==id));document.dispatchEvent(new CustomEvent('admin:client-restored',{detail:item.clientRecord}));renderRecycleBin();return;}
    if(item.type==='Client' && item.viewSnapshot){if($('admin-pc-view-content'))$('admin-pc-view-content').innerHTML=item.viewSnapshot;if($('admin-pc-view-title'))$('admin-pc-view-title').textContent=item.label;if($('admin-pc-view-subtitle'))$('admin-pc-view-subtitle').textContent=item.viewSubtitle||'';write(BIN_KEY,bin.filter(x=>x.id!==id));renderRecycleBin();$('admin-pc-view-dialog')?.showModal();return;}
    const parent=item.parentId?document.getElementById(item.parentId):null;
    if(parent && item.html){const nodes=[...parent.children];const ref=nodes[item.index]||null;const temp=document.createElement('tbody');temp.innerHTML=item.html;const restored=temp.firstElementChild;if(restored)parent.insertBefore(restored,ref);}
    const next=bin.filter(x=>x.id!==id);write(BIN_KEY,next);renderRecycleBin();
    const flash=$('flash');if(flash){flash.textContent=parent?'Record restored to its original list.':'Record removed from Recycle Bin. Reopen the source list to refresh its data.';flash.classList.add('show');setTimeout(()=>flash.classList.remove('show'),2600);}
  }
  function requestPermanentDeletion(id){
    const item=read(BIN_KEY,[]).find(x=>x.id===id);if(!item)return;
    const requests=read(APPROVAL_KEY,[]);
    requests.push({id:`APR-${Date.now()}`,action:'Permanent deletion',recordId:item.id,recordLabel:item.label,requestedBy:currentName(),requestedByRole:'admin',requestedAt:stamp(),status:'Pending Owner review'});
    if(!write(APPROVAL_KEY,requests)){alert('Could not save the Owner approval request.');return;}
    renderApprovalRequests();alert('Permanent deletion request recorded for Owner review. The record has not been permanently deleted.');
  }
  function renderMessages(){
    const root=$('admin-message-list');if(!root)return;
    const filter=$('admin-message-filter')?.value||'all';
    const items=read(MSG_KEY,[]).filter(m=>filter==='all'||m.role===filter).slice().reverse();
    root.innerHTML=items.length?items.map(m=>`<article class="admin-message-item"><header><strong>${safe(m.recipient)} <span class="admin-role-pill">${safe(m.role)}</span></strong><time>${safe(new Date(m.sentAt).toLocaleString())}</time></header><p><strong>${safe(m.subject)}</strong><br>${safe(m.body)}</p><small>Sent by ${safe(m.sender)}</small></article>`).join(''):'<div class="admin-empty-state">No messages match this filter.</div>';
  }
  function initMessages(){
    $('admin-message-send')?.addEventListener('click',()=>{
      const role=$('admin-message-role')?.value||'client',recipient=$('admin-message-recipient')?.value.trim(),subject=$('admin-message-subject')?.value.trim(),body=$('admin-message-body')?.value.trim();
      const status=$('admin-message-status');if(!recipient||!subject||!body){notifyStatus(status,'Enter a recipient, subject and message before sending.');return;}
      const items=read(MSG_KEY,[]);items.push({id:`ADM-MSG-${Date.now()}`,role,recipient,subject,body,sender:currentName(),sentAt:stamp(),read:false});
      if(!write(MSG_KEY,items)){notifyStatus(status,'Message could not be saved. Check browser storage.');return;}
      $('admin-message-recipient').value='';$('admin-message-subject').value='';$('admin-message-body').value='';notifyStatus(status,'Message saved in this browser demo. Server delivery will be enabled during backend integration.');renderMessages();
    });
    $('admin-message-filter')?.addEventListener('change',renderMessages);
    window.addEventListener('storage',event=>{if(event.key===MSG_KEY)renderMessages();if(event.key===BIN_KEY)renderRecycleBin();if(event.key===APPROVAL_KEY)renderApprovalRequests();});
    renderMessages();
  }
  function initSettings(){
    const form=$('admin-settings-form');if(!form)return;
    const prefs=read(PREF_KEY,{});
    if($('admin-setting-landing'))$('admin-setting-landing').value=prefs.landing||'dashboard';
    if($('admin-setting-client-view'))$('admin-setting-client-view').value=prefs.clientView||'all';
    ['email-alerts','inapp-alerts','compact-tables'].forEach(key=>{const el=$(`admin-setting-${key}`);if(el&&Object.prototype.hasOwnProperty.call(prefs,key))el.checked=!!prefs[key];});
    form.addEventListener('submit',event=>{event.preventDefault();const next={landing:$('admin-setting-landing').value,clientView:$('admin-setting-client-view').value,'email-alerts':$('admin-setting-email-alerts').checked,'inapp-alerts':$('admin-setting-inapp-alerts').checked,'compact-tables':$('admin-setting-compact-tables').checked,updatedAt:stamp(),updatedBy:currentName()};notifyStatus($('admin-settings-status'),write(PREF_KEY,next)?'Preferences saved in this browser. Company-wide settings remain Owner-controlled.':'Unable to save preferences. Check browser storage.');});
  }
  document.addEventListener('click',event=>{
    const restore=event.target.closest('[data-bin-restore]');if(restore){restoreRecord(restore.dataset.binRestore);return;}
    const request=event.target.closest('[data-bin-request]');if(request){requestPermanentDeletion(request.dataset.binRequest);return;}
    const clientViewDelete=event.target.closest('#admin-pc-view-delete');if(clientViewDelete){const dialog=$('admin-pc-view-dialog');const title=$('admin-pc-view-title')?.textContent?.trim()||'Client record';const subtitle=$('admin-pc-view-subtitle')?.textContent||'';const bin=read(BIN_KEY,[]);bin.push({id:`ADM-CLIENT-DEL-${Date.now()}`,type:'Client',label:title,deletedBy:currentName(),deletedAt:stamp(),reason:'Client soft deletion requested from profile view',viewSnapshot:$('admin-pc-view-content')?.innerHTML||'',viewSubtitle:subtitle});if(write(BIN_KEY,bin)){dialog?.close();renderRecycleBin();}return;}
    const deleteButton=event.target.closest('#employees-body [data-soft-delete], #employees-body [data-action="delete"], #pc-clients-body [data-soft-delete], #pc-clients-body [data-action="delete"], .client-management-card .row-delete');
    if(deleteButton){
      const record=deleteButton.closest('tr, .client-management-card, [data-record-card]');
      if(record){event.preventDefault();event.stopImmediatePropagation();const label=record.querySelector('strong')?.textContent?.trim()||record.querySelector('td')?.textContent?.trim()||'Selected record';const type=record.closest('#employees-body')?'Employee':'Client';saveSoftDeleted(record,type,label);const dialog=$('admin-pc-view-dialog');if(dialog?.open)dialog.close();}
    }
  },true);
  $('admin-recycle-refresh')?.addEventListener('click',()=>{renderRecycleBin();renderApprovalRequests();});
  document.addEventListener('DOMContentLoaded',()=>{renderRecycleBin();renderApprovalRequests();initMessages();initSettings();});
})();

/* Admin employee account CRUD demo: salary/payroll fields are intentionally excluded. */
(function initAdminEmployeeWorkspace(){
  'use strict';
  if(!document.body.classList.contains('management-app')||!document.getElementById('employees-body'))return;
  const KEY='actualHoldingsAdminEmployeesV1',BIN='actualHoldingsAdminRecycleBinV1';
  const $=id=>document.getElementById(id);
  const read=(key,fb=[])=>{try{return JSON.parse(localStorage.getItem(key)||'null')??fb}catch(_){return fb}};
  const write=(key,value)=>{try{localStorage.setItem(key,JSON.stringify(value));return true}catch(_){return false}};
  const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  let editing=null;
  function render(){
    const rows=$('employees-body');if(!rows)return;const list=read(KEY,[]).filter(x=>!x.deletedAt);
    if(!list.length){rows.innerHTML='<tr><td colspan="8">No employee records in this browser demo. Select “Add Employee” to create a local preview record.</td></tr>';return;}
    rows.innerHTML=list.map(e=>`<tr data-employee-id="${esc(e.id)}"><td><strong>${esc(e.name)}</strong><br><small>${esc(e.email)}</small></td><td>${esc(e.employeeNo||'—')}</td><td>${esc(e.position)}</td><td>${esc(e.role)}</td><td><span class="status">${esc(e.status)}</span></td><td>${esc(e.family||'Not assigned')}</td><td>${esc(e.attendance||'Not recorded')}</td><td><div class="row-actions"><button class="secondary-btn" type="button" data-employee-edit="${esc(e.id)}">Edit</button><button class="secondary-btn" type="button" data-attendance="${esc(e.id)}">Attendance</button><button class="secondary-btn danger-text" type="button" data-employee-delete="${esc(e.id)}">Delete</button></div></td></tr>`).join('');
  }
  function openForm(record){const form=$('employee-form'),dialog=$('employee-dialog');if(!form||!dialog)return;form.reset();editing=record?.id||null;$('employee-dialog-title').textContent=editing?'Edit Employee':'Add Employee';$('employee-id').value=record?.id||'';$('employee-user-id').value=record?.userId||'';$('employee-name').value=record?.name||'';$('employee-company').value=record?.company||'ACTUAL HOLDINGS';$('employee-email').value=record?.email||'';$('employee-phone').value=record?.phone||'';$('employee-position').value=record?.position||'';$('employee-role').value=record?.role||'accountant';$('employee-status').value=record?.status||'active';$('employee-hire-date').value=record?.hireDate||'';$('employee-family-ids').value=record?.family||'';$('employee-salary').closest('label')?.setAttribute('hidden','');$('employee-password-wrap')?.toggleAttribute('hidden',!!editing);dialog.showModal();}
  function saveForm(event){event.preventDefault();const list=read(KEY,[]);const id=editing||`EMP-${Date.now()}`;const record={id,userId:$('employee-user-id').value,name:$('employee-name').value.trim(),company:$('employee-company').value.trim(),email:$('employee-email').value.trim(),phone:$('employee-phone').value.trim(),position:$('employee-position').value.trim(),role:$('employee-role').value,status:$('employee-status').value,hireDate:$('employee-hire-date').value,family:[...$('employee-family-ids').selectedOptions].map(x=>x.textContent).join(', ')||'Not assigned',attendance:'Not recorded',updatedAt:new Date().toISOString()};if(!record.name||!record.email||!record.position)return;const next=editing?list.map(x=>x.id===editing?{...x,...record}:x):[...list,{...record,createdAt:new Date().toISOString()}];if(!write(KEY,next)){alert('Unable to save employee in browser storage.');return;}$('employee-dialog').close();editing=null;render();}
  document.addEventListener('click',event=>{
    if(event.target.closest('#new-admin-employee')){event.preventDefault();openForm(null);return;}
    const attendance=event.target.closest('[data-attendance]');if(attendance){const list=read(KEY,[]),record=list.find(x=>x.id===attendance.dataset.attendance);if(record){record.attendance=record.attendance==='Present'?'Absent':'Present';write(KEY,list);render();}return;}
    const edit=event.target.closest('[data-employee-edit]');if(edit){const record=read(KEY,[]).find(x=>x.id===edit.dataset.employeeEdit);if(record)openForm(record);return;}
    const del=event.target.closest('[data-employee-delete]');if(del){const record=read(KEY,[]).find(x=>x.id===del.dataset.employeeDelete);if(!record)return;const bin=read(BIN,[]);bin.push({id:`ADM-EMP-DEL-${Date.now()}`,type:'Employee',label:record.name,deletedBy:$('admin-name')?.textContent||'Admin',deletedAt:new Date().toISOString(),reason:'Employee soft deletion',employeeRecord:record});if(!write(BIN,bin))return;write(KEY,read(KEY,[]).filter(x=>x.id!==record.id));render();const count=$('recycle-bin-count');if(count)count.textContent=String(bin.length);}
  });
  $('employee-form')?.addEventListener('submit',saveForm);
  $('employee-dialog')?.querySelectorAll('[value="cancel"]')?.forEach(btn=>btn.addEventListener('click',()=>{$('employee-dialog').close();editing=null;}));
  document.addEventListener('admin:employee-restored',render);
  document.addEventListener('DOMContentLoaded',render);
})();


/* Seed illustrative staff rows for the visual frontend preview only. */
try { if (!localStorage.getItem('actualHoldingsAdminEmployeesV1')) localStorage.setItem('actualHoldingsAdminEmployeesV1', JSON.stringify([
 {id:'EMP-001',name:'Emmanuel Mugisha',email:'emmanuel@example.com',employeeNo:'EMP-001',position:'Manager',role:'family_manager',status:'active',family:'Operations',attendance:'Present'},
 {id:'EMP-002',name:'Marie Habineza',email:'marie@example.com',employeeNo:'EMP-002',position:'Sales Officer',role:'accountant',status:'active',family:'Sales',attendance:'Present'},
 {id:'EMP-003',name:'Jean Claude Uwimana',email:'jean@example.com',employeeNo:'EMP-003',position:'Technician',role:'designer',status:'active',family:'Support',attendance:'Present'},
 {id:'EMP-004',name:'Agnes Mukamana',email:'agnes@example.com',employeeNo:'EMP-004',position:'Accountant',role:'accountant',status:'active',family:'Finance',attendance:'Present'},
 {id:'EMP-005',name:'Eric Nyinyozima',email:'eric@example.com',employeeNo:'EMP-005',position:'Driver',role:'family_manager',status:'active',family:'Operations',attendance:'On duty'}
 ])); } catch (_) {}

/* ================================================================
   Admin dashboard frontend workspace — local preview interactions.
   Uses existing shared script.js and browser storage only.
   ================================================================ */
(function adminFrontendShowcase(){
 'use strict';
 const $=id=>document.getElementById(id), KEY='actualHoldingsAdminDemoClientsV2', ACT='actualHoldingsAdminDemoActivityV1';
 if(!document.body.classList.contains('management-app'))return;
 const read=(k,d=[])=>{try{return JSON.parse(localStorage.getItem(k)||'null')??d}catch(_){return d}},write=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));return true}catch(_){return false}};
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const sample=[{id:'CL-001',name:'Jean Bosco Niyibizi',phone:'+250780123456',email:'jean@example.com',status:'Active',joined:'12 Jan 2025',tin:'TIN-102938'},{id:'CL-002',name:'Aline Uwimana',phone:'+25078987654',email:'aline@example.com',status:'Active',joined:'18 Feb 2025',tin:'TIN-203948'},{id:'CL-003',name:'Patrick Rulondo',phone:'+250781234567',email:'patrick@example.com',status:'Active',joined:'03 Mar 2025',tin:'TIN-304958'},{id:'CL-004',name:'Claudine Mukantabana',phone:'+250782345678',email:'claudine@example.com',status:'Active',joined:'10 Apr 2025',tin:'TIN-405968'},{id:'CL-005',name:'Emmanuel Habimana',phone:'+250783456789',email:'emmanuel@example.com',status:'Active',joined:'22 May 2025',tin:'TIN-506978'}];
 let clients=read(KEY,sample);if(!Array.isArray(clients))clients=sample.slice();let editing=null,page=1,perPage=7;
 function toast(msg){const box=$('flash');if(!box)return;box.textContent=msg;box.classList.add('show');setTimeout(()=>box.classList.remove('show'),3200)}
 function log(action,entity,description){const a=read(ACT,[]);a.unshift({actor:$('admin-name')?.textContent||'Admin',action,entity,description,when:new Date().toLocaleString()});write(ACT,a.slice(0,100));renderActivity()}
 function renderClients(){const body=$('pc-clients-body'),head=$('pc-table-head');if(!body||!head)return;head.innerHTML='<tr><th>ID</th><th>Name</th><th>Phone</th><th>Email</th><th>Status</th><th>Joined</th><th>Actions</th></tr>';const q=($('client-search')?.value||'').toLowerCase(),status=$('pc-status-filter')?.value||'';let filtered=clients.filter(c=>!c.deletedAt&&(!q||[c.id,c.name,c.phone,c.email,c.tin].join(' ').toLowerCase().includes(q))&&(!status||c.status===status));const pages=Math.max(1,Math.ceil(filtered.length/perPage));page=Math.min(page,pages);const slice=filtered.slice((page-1)*perPage,page*perPage);body.innerHTML=slice.length?slice.map(c=>`<tr data-client-id="${esc(c.id)}"><td>${esc(c.id)}</td><td><strong>${esc(c.name)}</strong><br><small>${esc(c.tin||'')}</small></td><td>${esc(c.phone||'—')}</td><td>${esc(c.email||'—')}</td><td><span class="status">${esc(c.status||'Active')}</span></td><td>${esc(c.joined||'—')}</td><td><div class="row-actions"><button class="secondary-btn" data-client-view="${esc(c.id)}" type="button">View</button><button class="secondary-btn" data-client-edit="${esc(c.id)}" type="button">Edit</button><button class="secondary-btn danger-text" data-client-delete="${esc(c.id)}" type="button">Delete</button></div></td></tr>`).join(''):'<tr><td colspan="7">No client records found. Use Add New Client to create a demo record.</td></tr>';
 $('pc-client-count').textContent=`${filtered.length} clients`; $('pc-total').textContent=clients.filter(c=>!c.deletedAt).length;$('pc-compliant').textContent=filtered.filter(c=>c.status==='Active').length;$('pc-pending').textContent=filtered.filter(c=>c.status!=='Active').length;$('pc-na').textContent='0';$('pc-donut-total').textContent=clients.filter(c=>!c.deletedAt).length;$('pc-legend-compliant').textContent=filtered.filter(c=>c.status==='Active').length;$('pc-legend-pending').textContent=filtered.filter(c=>c.status!=='Active').length;$('pc-legend-na').textContent='0';$('pc-page-label').textContent=`Showing ${filtered.length?((page-1)*perPage+1):0}–${Math.min(page*perPage,filtered.length)} of ${filtered.length} clients`;$('pc-page-one').textContent=String(page);$('pc-page-two').textContent=String(Math.min(page+1,pages));$('pc-page-prev').disabled=page<=1;$('pc-page-next').disabled=page>=pages;
 }
 function openClient(record){const dlg=$('admin-pc-client-dialog'),form=$('admin-pc-client-form');if(!dlg||!form)return;form.reset();editing=record?.id||null;$('admin-pc-client-title').textContent=editing?'Edit Client':'Add New Client';form.elements.id.value=record?.id||'';for(const key of ['name','tin','phone','email','registration_date','contact_name','district','sector','street_address','notes'])if(form.elements[key])form.elements[key].value=record?.[key]||'';for(const [id,val] of [['pc-dialog-client-type',record?.client_type||'Business'],['pc-dialog-business-type',record?.business_type||'Other'],['pc-dialog-client-status',record?.status||'Active']]){const el=$(id);if(el){if(!el.options.length)el.innerHTML=(id.includes('status')?['Active','Pending','Inactive']:id.includes('type')?['Business','Individual','Organization']:['Accounting','Design','Photography','Music','Other']).map(x=>`<option>${x}</option>`).join('');el.value=val;}}dlg.showModal();}
 function saveClient(e){e.preventDefault();const f=e.currentTarget,d=Object.fromEntries(new FormData(f).entries());if(!d.name?.trim()){toast('Client name is required.');return;}const id=editing||`CL-${String(Date.now()).slice(-6)}`,record={...d,id,name:d.name.trim(),status:d.status||'Active',joined:editing?(clients.find(c=>c.id===editing)?.joined||'Today'):new Date().toLocaleDateString(),updatedAt:new Date().toISOString()};clients=editing?clients.map(c=>c.id===editing?{...c,...record}:c):[record,...clients];write(KEY,clients);$('admin-pc-client-dialog').close();renderClients();log(editing?'Updated client':'Created client',id,record.name);toast(editing?'Client updated in this browser.':'Client added in this browser.');editing=null;}
 function renderActivity(){const b=$('activity-body');if(!b)return;const a=read(ACT,[]);b.innerHTML=a.length?a.map(x=>`<tr><td>${esc(x.actor)}</td><td>${esc(x.action)}</td><td>${esc(x.entity)}</td><td>${esc(x.description)}</td><td>${esc(x.when)}</td></tr>`).join(''):'<tr><td colspan="5">No activity has been recorded in this browser yet.</td></tr>';}
 function renderRecycle(){const b=$('admin-recycle-body');if(!b)return;const a=read('actualHoldingsAdminRecycleBinV1',[]);const count=$('recycle-bin-count');if(count)count.textContent=String(a.length);if(!a.length){b.innerHTML='<tr><td colspan="6">Recycle Bin is empty. Deleted records will appear here.</td></tr>';return;}b.innerHTML=a.slice().reverse().map(x=>`<tr><td><strong>${esc(x.label||x.type)}</strong><br><small>${esc(x.id)}</small></td><td>${esc(x.type)}</td><td>${esc(x.deletedBy||'Admin')}</td><td>${esc(x.deletedAt?new Date(x.deletedAt).toLocaleDateString():'—')}</td><td>${esc(x.reason||'Soft deleted')}</td><td><div class="row-actions"><button class="secondary-btn" type="button" data-bin-restore="${esc(x.id)}">Restore</button><button class="secondary-btn danger-text" type="button" data-bin-request="${esc(x.id)}">Request delete</button></div></td></tr>`).join('');}
 function activate(id){const btn=document.querySelector(`.mg-nav[data-section="${id}"]`);if(btn)btn.click();}
 document.addEventListener('DOMContentLoaded',()=>{
  // Admin frontend navigation is deliberately independent of authenticated-session hydration.
  const navButtons=[...document.querySelectorAll('.mg-nav[data-section]')];
  const panels=[...document.querySelectorAll('.mg-section[id^="section-"]')];
  const title=$('section-title');
  function showSection(id){
   const target=$(`section-${id}`);
   if(!target){toast(`Section unavailable: ${id}`);return;}
   panels.forEach(panel=>panel.classList.toggle('active',panel===target));
   navButtons.forEach(button=>button.classList.toggle('active',button.dataset.section===id));
   const selected=navButtons.find(button=>button.dataset.section===id);
   if(title&&selected)title.textContent=selected.querySelector('span:last-child')?.textContent?.trim()||selected.textContent.trim();
   document.body.classList.remove('sidebar-open','mobile-open');
   $('mobile-menu')?.setAttribute('aria-expanded','false');
  }
  navButtons.forEach(button=>button.addEventListener('click',()=>showSection(button.dataset.section)));
  const closeSidebar=()=>{
   if(window.matchMedia('(max-width: 760px)').matches){document.body.classList.remove('sidebar-open','mobile-open');}
   else{document.body.classList.add('sidebar-collapsed');}
   $('mobile-menu')?.setAttribute('aria-expanded','false');
  };
  $('sidebar-close')?.addEventListener('click',closeSidebar);
  $('mobile-menu')?.addEventListener('click',()=>{
   if(window.matchMedia('(max-width: 760px)').matches){
    const open=document.body.classList.toggle('sidebar-open');
    document.body.classList.remove('mobile-open');
    $('mobile-menu').setAttribute('aria-expanded',String(open));
   }else{
    document.body.classList.toggle('sidebar-collapsed');
    $('mobile-menu').setAttribute('aria-expanded',String(!document.body.classList.contains('sidebar-collapsed')));
   }
  });
  $('management-backdrop')?.addEventListener('click',closeSidebar);
  document.addEventListener('keydown',event=>{if(event.key==='Escape')closeSidebar();});
  // Public frontend preview: do not invoke login/session hydration.
  $('admin-name').textContent=localStorage.getItem('actualHoldingsAdminDisplayName')||'Admin';$('hero-name').textContent=$('admin-name').textContent;$('top-name').textContent=$('admin-name').textContent;
  $('admin-avatar').textContent='A';$('top-avatar').textContent='A';
  if($('pc-status-filter')&&!$('pc-status-filter').options.length)$('pc-status-filter').innerHTML='<option value="">All Statuses</option><option>Active</option><option>Pending</option><option>Inactive</option>';
  renderClients();renderActivity();renderRecycle();
  // Seed the remaining section tables with clearly illustrative frontend examples.
  const demoRows={
   'requests-body':'<tr><td><strong>ISR-045</strong></td><td>Jean Bosco Niyibizi</td><td>ACTUAL TECH · Laptop repair</td><td><span class="status">High</span></td><td>Under Review</td><td>Emmanuel Mugisha</td><td><button class="secondary-btn" type="button" data-request-edit="ISR-045">Review</button></td></tr><tr><td><strong>ISR-044</strong></td><td>Aline Uwimana</td><td>ACTUAL ACCOUNTING · Tax declaration</td><td>Normal</td><td>Processing</td><td>Marie Habineza</td><td><button class="secondary-btn" type="button" data-request-edit="ISR-044">Update</button></td></tr>',
   'services-body':'<tr><td><strong>Tax Declaration</strong></td><td>ACTUAL ACCOUNTING</td><td>Quotation</td><td>On request</td><td><span class="status">Active</span></td></tr><tr><td><strong>Graphic Design</strong></td><td>ACTUAL DESIGN</td><td>Fixed / quotation</td><td>From RWF 25,000</td><td><span class="status">Active</span></td></tr><tr><td><strong>Photography</strong></td><td>ACTUAL PHOTOGRAPHY</td><td>Quotation</td><td>On request</td><td><span class="status">Active</span></td></tr>',
   'orders-body':'<tr data-demo-order="ORD-045"><td><strong>#ORD-045</strong></td><td>Aline Uwimana</td><td>RWF 250,000</td><td>Verified</td><td><select data-order-status="ORD-045"><option>Pending</option><option selected>Processing</option><option>Ready</option><option>Completed</option><option>Cancelled</option></select></td><td>07 Oct 2026</td></tr><tr data-demo-order="ORD-044"><td><strong>#ORD-044</strong></td><td>Jean Bosco Niyibizi</td><td>RWF 120,000</td><td>Pending</td><td><select data-order-status="ORD-044"><option selected>Awaiting payment</option><option>Processing</option><option>Ready</option><option>Completed</option><option>Cancelled</option></select></td><td>06 Oct 2026</td></tr>',
   'documents-body':'<tr><td><strong>Tax declaration Q3</strong></td><td>Jean Bosco Niyibizi</td><td>Tax document</td><td>Received</td><td>08 Oct 2026</td><td><button class="secondary-btn" type="button" disabled>Backend required</button></td></tr>',
   'payments-body':'<tr><td>PAY-1045</td><td>Aline Uwimana</td><td>RWF 250,000</td><td>Mobile Money</td><td><span class="status">Verified</span></td><td>07 Oct 2026</td></tr><tr><td>PAY-1044</td><td>Jean Bosco Niyibizi</td><td>RWF 120,000</td><td>Bank transfer</td><td>Pending</td><td>06 Oct 2026</td></tr>'
  };
  Object.entries(demoRows).forEach(([id,markup])=>{const el=$(id);if(el&&/Loading|No connected backend data/.test(el.textContent))el.innerHTML=markup;});
  // Request workflow and order status actions are local demo state; finance confirmation remains Owner-only.
  const requestState=read('actualHoldingsAdminDemoRequestsV1',[{id:'ISR-045',status:'under_review',priority:'high',assigned:'Emmanuel Mugisha',note:''},{id:'ISR-044',status:'processing',priority:'normal',assigned:'Marie Habineza',note:''}]);
  $('requests-body')?.addEventListener('click',e=>{const b=e.target.closest('[data-request-edit]');if(!b)return;const r=requestState.find(x=>x.id===b.dataset.requestEdit);if(!r)return;$('request-id').value=r.id;$('edit-status').value=r.status;$('edit-priority').value=r.priority;$('edit-note').value=r.note||'';const select=$('edit-assigned');if(select){if(!select.options.length)select.innerHTML='<option>Unassigned</option><option>Emmanuel Mugisha</option><option>Marie Habineza</option><option>Jean Claude Uwimana</option><option>Agnes Mukamana</option>';select.value=r.assigned||'Unassigned';}$('request-dialog').showModal();});
  $('request-form')?.addEventListener('submit',e=>{e.preventDefault();const id=$('request-id').value,r=requestState.find(x=>x.id===id);if(!r)return;r.status=$('edit-status').value;r.priority=$('edit-priority').value;r.assigned=$('edit-assigned').value;r.note=$('edit-note').value;write('actualHoldingsAdminDemoRequestsV1',requestState);const row=[...$('requests-body').rows].find(x=>x.textContent.includes(id));if(row){row.cells[3].textContent=r.priority;row.cells[4].textContent=r.status.replaceAll('_',' ');row.cells[5].textContent=r.assigned;}$('request-dialog').close();log('Updated service request',id,`Status: ${r.status}`);toast('Service request updated in this browser.');});
  $('request-dialog')?.querySelectorAll('[value=cancel]').forEach(b=>b.addEventListener('click',()=>$('request-dialog').close()));
  $('orders-body')?.addEventListener('change',e=>{const s=e.target.closest('[data-order-status]');if(!s)return;const data=read('actualHoldingsAdminDemoOrdersV1',{});data[s.dataset.orderStatus]=s.value;write('actualHoldingsAdminDemoOrdersV1',data);log('Updated order status',s.dataset.orderStatus,s.value);toast('Order status updated in this browser.');});
  const finance=$('admin-finance-summary');if(finance)finance.innerHTML='<article><small>Total revenue · demo</small><strong>RWF 12,480,000</strong></article><article><small>Pending payments · demo</small><strong>RWF 2,350,000</strong></article><article><small>Verified payments · demo</small><strong>RWF 9,730,000</strong></article>';
  const notifs=$('staff-notifications-list');if(notifs&&/Loading|No connected backend data/.test(notifs.textContent))notifs.innerHTML='<article class="panel"><strong>Owner approval required</strong><p>Permanent deletion request for Client #CL-023</p><small>1 hour ago · Requires Owner decision</small></article><article class="panel"><strong>New message</strong><p>Jean Bosco Niyibizi sent a message</p><small>2 hours ago</small></article><article class="panel"><strong>Service request updated</strong><p>Laptop Repair · ISR-045</p><small>3 hours ago</small></article><article class="panel"><strong>Low stock alert</strong><p>Laptop HP · Only 3 left</p><small>4 hours ago</small></article>';
  const reports=$('report-grid');if(reports&&!reports.children.length)reports.innerHTML='<article class="panel"><small>Client records · demo</small><h3>124</h3></article><article class="panel"><small>Active employees · demo</small><h3>28</h3></article><article class="panel"><small>Open requests · demo</small><h3>6</h3></article><article class="panel"><small>Orders this month · demo</small><h3>42</h3></article>';

  $('admin-pc-add')?.addEventListener('click',()=>openClient(null));$('pc-quick-add')?.addEventListener('click',()=>openClient(null));$('admin-pc-client-form')?.addEventListener('submit',saveClient);
  document.querySelectorAll('[data-pc-close]').forEach(b=>b.addEventListener('click',()=>$('admin-pc-client-dialog')?.close()));
  $('client-search')?.addEventListener('input',()=>{page=1;renderClients()});$('pc-status-filter')?.addEventListener('change',()=>{page=1;renderClients()});$('pc-apply-filter')?.addEventListener('click',renderClients);$('pc-reset-filter')?.addEventListener('click',()=>{$('client-search').value='';$('pc-status-filter').value='';page=1;renderClients()});$('pc-page-prev')?.addEventListener('click',()=>{page=Math.max(1,page-1);renderClients()});$('pc-page-next')?.addEventListener('click',()=>{page++;renderClients()});$('pc-page-one')?.addEventListener('click',()=>{page=1;renderClients()});$('pc-page-two')?.addEventListener('click',()=>{page++;renderClients()});
  $('pc-export')?.addEventListener('click',()=>{const rows=[['ID','Name','TIN','Phone','Email','Status'],...clients.filter(c=>!c.deletedAt).map(c=>[c.id,c.name,c.tin,c.phone,c.email,c.status])];const csv=rows.map(r=>r.map(v=>'"'+String(v??'').replace(/"/g,'""')+'"').join(',')).join('\r\n');const url=URL.createObjectURL(new Blob([csv],{type:'text/csv'}));const a=document.createElement('a');a.href=url;a.download='actual-holdings-clients.csv';a.click();URL.revokeObjectURL(url);});
  $('pc-template')?.addEventListener('click',()=>downloadTemplate());$('pc-template-quick')?.addEventListener('click',()=>downloadTemplate());function downloadTemplate(){const blob=new Blob(['Name,TIN,Phone,Email,Status,Client Type,Business Type\r\n'],{type:'text/csv'});const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='actual-holdings-client-template.csv';a.click();URL.revokeObjectURL(url)}
  $('pc-import')?.addEventListener('click',()=>$('pc-import-file')?.click());$('pc-import-file')?.addEventListener('change',e=>{const f=e.target.files?.[0];if(!f)return;if(!f.name.toLowerCase().endsWith('.csv')){toast('CSV import is available in this frontend preview. XLSX import will be connected during backend integration.');return;}const reader=new FileReader();reader.onload=()=>{const lines=String(reader.result).split(/\r?\n/).filter(Boolean).slice(1);let added=0;lines.forEach(line=>{const vals=line.split(',').map(v=>v.replace(/^"|"$/g,''));if(vals[0]?.trim()){clients.push({id:`CL-${Date.now()}-${added}`,name:vals[0],tin:vals[1]||'',phone:vals[2]||'',email:vals[3]||'',status:vals[4]||'Active',joined:new Date().toLocaleDateString()});added++;}});write(KEY,clients);renderClients();toast(`${added} client record(s) imported from CSV.`);e.target.value='';};reader.readAsText(f);});
  $('pc-report')?.addEventListener('click',()=>{activate('reports');toast('Operational report view opened.')});$('pc-help')?.addEventListener('click',()=>activate('activity'));$('pc-view-all-activity')?.addEventListener('click',()=>activate('activity'));
  $('pc-clients-body')?.addEventListener('click',e=>{const view=e.target.closest('[data-client-view]'),edit=e.target.closest('[data-client-edit]'),del=e.target.closest('[data-client-delete]');const id=view?.dataset.clientView||edit?.dataset.clientEdit||del?.dataset.clientDelete;if(!id)return;const rec=clients.find(c=>c.id===id);if(!rec)return;if(view){$('admin-pc-view-title').textContent=rec.name;$('admin-pc-view-subtitle').textContent=`${rec.id} · ${rec.email||'No email'} · ${rec.phone||'No phone'}`;$('admin-pc-view-content').innerHTML=`<div class="pc-view-detail-grid"><p><b>TIN</b><br>${esc(rec.tin||'—')}</p><p><b>Status</b><br>${esc(rec.status)}</p><p><b>Phone</b><br>${esc(rec.phone||'—')}</p><p><b>Email</b><br>${esc(rec.email||'—')}</p></div>`;$('admin-pc-view-dialog').showModal();$('admin-pc-view-edit').onclick=()=>{$('admin-pc-view-dialog').close();openClient(rec)};$('admin-pc-view-delete').onclick=()=>softDelete(rec);$('admin-pc-view-archive').onclick=()=>softDelete(rec);}else if(edit)openClient(rec);else softDelete(rec);});
  function softDelete(rec){const bin=read('actualHoldingsAdminRecycleBinV1',[]);bin.push({id:`DEL-${Date.now()}`,type:'Client',label:rec.name,deletedBy:$('admin-name')?.textContent||'Admin',deletedAt:new Date().toISOString(),reason:'Client soft-deleted',clientRecord:rec});if(!write('actualHoldingsAdminRecycleBinV1',bin))return;clients=clients.filter(c=>c.id!==rec.id);write(KEY,clients);renderClients();renderRecycle();log('Moved to Recycle Bin','Client',rec.name);toast('Client moved to Recycle Bin.');$('admin-pc-view-dialog')?.close();}
  $('admin-pc-view-dialog')?.querySelector('[data-pc-view-close]')?.addEventListener('click',()=>$('admin-pc-view-dialog').close());
  // Restore client records from the existing recycle-bin workflow.
  document.addEventListener('admin:client-restored',e=>{if(e.detail&&!clients.some(c=>c.id===e.detail.id)){clients.push(e.detail);write(KEY,clients);renderClients();toast('Client restored to the client list.');}});
  document.addEventListener('click',e=>{const jump=e.target.closest('[data-section]:not(.mg-nav)');if(jump){e.preventDefault();activate(jump.dataset.section);}});
  $('management-backdrop')?.addEventListener('click',()=>document.body.classList.remove('sidebar-open','mobile-open'));
  $('dashboard-add-client')?.addEventListener('click',()=>{activate('clients');openClient(null)});$('dashboard-add-employee')?.addEventListener('click',()=>{activate('employees');$('new-admin-employee')?.click()});
  $('top-notifications')?.addEventListener('click',()=>activate('notifications'));$('top-profile')?.addEventListener('click',()=>activate('profile'));
  $('admin-global-search-input')?.addEventListener('input',e=>{const q=e.target.value.trim();if(q){activate('clients');$('client-search').value=q;renderClients()}});document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();$('admin-global-search-input')?.focus()}});
  document.querySelectorAll('[data-ai-prompt]').forEach(b=>b.addEventListener('click',()=>{$('admin-ai-input').value=b.dataset.aiPrompt;$('admin-ai-input').focus()}));$('admin-ai-form')?.addEventListener('submit',e=>{e.preventDefault();const q=$('admin-ai-input').value.trim();if(!q)return;$('admin-ai-response').textContent='ACTUAL AI is currently a frontend preview. The AI service/API will be connected during backend integration. Your question: '+q;});
  $('mark-staff-notifications')?.addEventListener('click',()=>{document.querySelectorAll('#staff-notifications-list .notification-card, #staff-notifications-list article').forEach(x=>x.classList.add('is-read'));toast('Notifications marked as read in this preview.');});
  const clock=()=>{const now=new Date(),el=$('admin-live-clock'),date=$('admin-current-date');if(el)el.textContent=now.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});if(date)date.textContent=now.toLocaleDateString('en-GB',{weekday:'long',day:'2-digit',month:'long',year:'numeric'}).toUpperCase();};clock();setInterval(clock,30000);
  const profileForm=$('admin-profile-form');if(profileForm&&!profileForm.dataset.demoBound){profileForm.dataset.demoBound='1';profileForm.addEventListener('submit',e=>{e.preventDefault();const name=$('admin-profile-name').value.trim()||'Admin';localStorage.setItem('actualHoldingsAdminDisplayName',name);$('admin-name').textContent=name;$('hero-name').textContent=name;$('top-name').textContent=name;toast('Profile updated in this browser preview.');});}
 });
})();


/* ========================================================================
   ACTUAL HOLDINGS ADMIN — FINAL NAVIGATION + INTERACTION LAYER
   Scoped to admin.html. Keeps the shared stylesheet and script architecture.
   ======================================================================== */
(function actualAdminFinalLayer(){
  'use strict';
  if (!document.body.classList.contains('management-app')) return;

  const $ = id => document.getElementById(id);
  const isCompact = () => window.matchMedia('(max-width: 900px)').matches;
  const sidebar = $('admin-sidebar');
  const backdrop = $('management-backdrop');
  const menu = $('mobile-menu');
  const navItems = [...document.querySelectorAll('.mg-nav[data-section]')];
  const panels = [...document.querySelectorAll('.mg-section[id^="section-"]')];

  function syncSidebar(open){
    if (!sidebar) return;
    if (isCompact()) {
      sidebar.classList.toggle('open', !!open);
      backdrop?.classList.toggle('open', !!open);
      document.body.classList.toggle('sidebar-open', !!open);
      menu?.setAttribute('aria-expanded', String(!!open));
    } else {
      sidebar.classList.remove('open');
      backdrop?.classList.remove('open');
      document.body.classList.remove('sidebar-open');
      document.body.classList.toggle('sidebar-collapsed', !!open);
      menu?.setAttribute('aria-expanded', String(!open));
    }
  }
  function closeSidebar(){
    if (isCompact()) syncSidebar(false);
    else syncSidebar(document.body.classList.contains('sidebar-collapsed'));
  }
  function setSection(id){
    const target = $(`section-${id}`);
    if (!target) return false;
    panels.forEach(panel => panel.classList.toggle('active', panel === target));
    navItems.forEach(item => {
      const active = item.dataset.section === id;
      item.classList.toggle('active', active);
      item.setAttribute('aria-current', active ? 'page' : 'false');
    });
    const selected = navItems.find(item => item.dataset.section === id);
    const title = $('section-title');
    if (title && selected) title.textContent = selected.querySelector('span:last-child')?.textContent?.trim() || selected.textContent.trim();
    document.querySelector('.management-content')?.scrollTo({top:0, behavior:'smooth'});
    if (isCompact()) syncSidebar(false);
    return true;
  }

  // Capture-phase delegation prevents older page-wide handlers from overriding
  // the Admin-only sidebar behavior.
  document.addEventListener('click', event => {
    const nav = event.target.closest('.management-app .mg-nav[data-section]');
    if (nav) {
      event.preventDefault();
      event.stopImmediatePropagation();
      setSection(nav.dataset.section);
      return;
    }
    const jump = event.target.closest('.management-app [data-section]:not(.mg-nav)');
    if (jump) {
      const id = jump.dataset.section;
      if ($(`section-${id}`)) {
        event.preventDefault();
        event.stopImmediatePropagation();
        setSection(id);
        if (id === 'requests' && /new service request/i.test(jump.textContent)) {
          const dialog = $('request-dialog');
          if (dialog) {
            const newId = `ISR-${String(Date.now()).slice(-6)}`;
            $('request-id').value = `NEW:${newId}`;
            if($('admin-new-request-client'))$('admin-new-request-client').value='';
            if($('admin-new-request-service'))$('admin-new-request-service').value='Tax Declaration';
            $('edit-status').value = 'pending';
            $('edit-priority').value = 'normal';
            $('edit-note').value = '';
            const assigned = $('edit-assigned'); if (assigned) assigned.value = 'Unassigned';
            const heading = dialog.querySelector('h3'); if (heading) heading.textContent = 'Create Service Request';
            dialog.showModal();
          }
        }
      }
      return;
    }
    if (event.target.closest('#mobile-menu')) {
      event.preventDefault();
      event.stopImmediatePropagation();
      if (isCompact()) syncSidebar(!sidebar.classList.contains('open'));
      else syncSidebar(!document.body.classList.contains('sidebar-collapsed'));
      return;
    }
    if (event.target.closest('#sidebar-close')) {
      event.preventDefault();
      event.stopImmediatePropagation();
      if (isCompact()) syncSidebar(false);
      else syncSidebar(true);
      return;
    }
    if (event.target === backdrop || event.target.closest('#management-backdrop')) {
      event.preventDefault();
      event.stopImmediatePropagation();
      if (isCompact()) syncSidebar(false);
    }
  }, true);

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && isCompact() && sidebar?.classList.contains('open')) syncSidebar(false);
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      $('admin-global-search-input')?.focus();
    }
  }, true);

  window.addEventListener('resize', () => {
    if (!isCompact()) {
      sidebar?.classList.remove('open');
      backdrop?.classList.remove('open');
      document.body.classList.remove('sidebar-open');
      menu?.setAttribute('aria-expanded', String(!document.body.classList.contains('sidebar-collapsed')));
    } else {
      document.body.classList.remove('sidebar-collapsed');
      if (!sidebar?.classList.contains('open')) syncSidebar(false);
    }
  });

  function toast(message){
    const flash = $('flash');
    if (!flash) return;
    flash.textContent = message;
    flash.classList.add('show');
    window.clearTimeout(toast._timer);
    toast._timer = window.setTimeout(() => flash.classList.remove('show'), 2800);
  }

  // Public preview is intentional while this project is frontend-only.
  function init(){
    if (!sidebar || !panels.length) return;
    sidebar.classList.remove('open');
    backdrop?.classList.remove('open');
    if (isCompact()) syncSidebar(false);
    else syncSidebar(false); // desktop starts expanded, matching the supplied reference UI
    const active = panels.find(panel => panel.classList.contains('active'))?.id.replace('section-','') || 'dashboard';
    setSection(active);

    // Ensure preview controls remain usable without an authenticated session.
    ['logout-btn','top-logout-btn'].forEach(id => $(id)?.addEventListener('click', () => {
      localStorage.removeItem('actualHoldingsAdminPreviewSession');
      window.location.href = '../index.html';
    }));

    // Refresh actions always repaint their corresponding local demo data.
    document.querySelectorAll('.management-app [data-section="employees"]').forEach(button => {
      if (button.id !== 'new-admin-employee') button.addEventListener('click', () => {
        window.dispatchEvent(new CustomEvent('actual-admin-refresh-employees'));
      });
    });
    $('admin-recycle-refresh')?.addEventListener('click', () => toast('Recycle Bin refreshed from this browser preview.'));

    // Persist notification read state and provide a clear visual read/unread state.
    const notificationKey = 'actualHoldingsAdminNotificationsV1';
    let notificationState = {};
    try { notificationState = JSON.parse(localStorage.getItem(notificationKey) || '{}') || {}; } catch (_) {}
    const notificationRoot = $('staff-notifications-list');
    if (notificationRoot) {
      [...notificationRoot.children].forEach((card, index) => {
        const id = card.dataset.notificationId || `notification-${index}`;
        card.dataset.notificationId = id;
        if (notificationState[id]) card.classList.add('is-read');
        card.tabIndex = 0;
        card.setAttribute('role','button');
        card.setAttribute('aria-label','Mark notification as read');
        const mark = () => {
          notificationState[id] = true;
          try { localStorage.setItem(notificationKey, JSON.stringify(notificationState)); } catch (_) {}
          card.classList.add('is-read');
        };
        card.addEventListener('click', mark);
        card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); mark(); } });
      });
    }
    $('mark-staff-notifications')?.addEventListener('click', () => {
      if (notificationRoot) [...notificationRoot.children].forEach((card,index) => {
        const id = card.dataset.notificationId || `notification-${index}`;
        notificationState[id] = true;
        card.classList.add('is-read');
      });
      try { localStorage.setItem(notificationKey, JSON.stringify(notificationState)); } catch (_) {}
      const count = $('top-notification-count'); if (count) count.textContent = '0';
      const navCount = $('notification-nav-count'); if (navCount) navCount.textContent = '0';
      toast('All notifications marked as read in this browser.');
    });

    // Document preview: make the row action useful without pretending a server file exists.
    const docsBody = $('documents-body');
    if (docsBody) {
      docsBody.querySelectorAll('button[disabled]').forEach(button => {
        button.disabled = false;
        button.textContent = 'Preview details';
        button.classList.add('secondary-btn');
        button.addEventListener('click', () => {
          const row = button.closest('tr');
          const values = [...(row?.cells || [])].map(cell => cell.textContent.trim());
          showPreviewDialog('Document record', values.map((value,i) => `<p><strong>${['Document','Client','Type','Status','Uploaded'][i] || 'Detail'}:</strong> ${escapeHTML(value)}</p>`).join('') + '<p class="preview-note">The actual uploaded file will be available after secure backend document storage is connected.</p>');
        });
      });
    }

    // Global search: route to the matching area and filter the client table for client queries.
    $('admin-global-search-input')?.addEventListener('keydown', event => {
      if (event.key === 'Enter') {
        const query = event.currentTarget.value.trim();
        if (!query) return;
        setSection('clients');
        const search = $('client-search');
        if (search) {
          search.value = query;
          search.dispatchEvent(new Event('input', {bubbles:true}));
        }
      }
    });

    // Apply saved operational preferences without changing company-wide settings.
    try {
      const prefs = JSON.parse(localStorage.getItem('actualHoldingsAdminPreferencesV1') || '{}') || {};
      if (prefs['compact-tables']) document.body.classList.add('admin-compact-tables');
    } catch (_) {}
  }

  function escapeHTML(value){
    return String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  }
  function showPreviewDialog(title, body){
    let dialog = $('admin-generic-preview-dialog');
    if (!dialog) {
      dialog = document.createElement('dialog');
      dialog.id = 'admin-generic-preview-dialog';
      dialog.className = 'mg-dialog admin-preview-dialog';
      dialog.innerHTML = '<div class="dialog-head"><h3 id="admin-generic-preview-title"></h3><button type="button" class="dialog-close" aria-label="Close">×</button></div><div class="dialog-body" id="admin-generic-preview-body"></div><div class="dialog-actions"><button type="button" class="secondary-btn" data-preview-close>Close</button></div>';
      document.body.appendChild(dialog);
      dialog.querySelectorAll('.dialog-close,[data-preview-close]').forEach(button => button.addEventListener('click', () => dialog.close()));
    }
    $('admin-generic-preview-title').textContent = title;
    $('admin-generic-preview-body').innerHTML = body;
    if (!dialog.open) dialog.showModal();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once:true});
  else init();
})();


/* Admin Client 360 tabs: each tab now changes the visible detail panel. */
(function actualAdminClientTabs(){
  if (!document.body.classList.contains('management-app')) return;
  const tabContent = {
    overview: '<p class="admin-tab-empty">Client overview and contact details.</p>',
    services: '<p class="admin-tab-empty">No service assignments are connected to this client in the frontend preview.</p>',
    payments: '<p class="admin-tab-empty">Payment history is read-only for Admin. Live transaction records will load after backend integration.</p>',
    compliance: '<p class="admin-tab-empty">Tax compliance records will appear here when the compliance data source is connected.</p>',
    documents: '<p class="admin-tab-empty">Client documents will appear here after secure document storage is connected.</p>',
    history: '<p class="admin-tab-empty">Client activity history is not yet connected to the backend.</p>'
  };
  document.addEventListener('click', event => {
    const tab = event.target.closest('#admin-pc-view-tabs [data-tab]');
    if (!tab) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    document.querySelectorAll('#admin-pc-view-tabs [data-tab]').forEach(button => {
      const active = button === tab;
      button.classList.toggle('active', active);
      button.setAttribute('aria-selected', String(active));
    });
    const content = document.getElementById('admin-pc-view-content');
    if (content) {
      const type = tab.dataset.tab;
      if (type === 'overview') {
        const title = document.getElementById('admin-pc-view-title')?.textContent || 'Client';
        const sub = document.getElementById('admin-pc-view-subtitle')?.textContent || '';
        content.innerHTML = `<div class="pc-view-detail-grid"><p><b>Client</b><br>${title}</p><p><b>Reference / Contact</b><br>${sub}</p></div>`;
      } else content.innerHTML = tabContent[type] || '<p class="admin-tab-empty">No information is available in this preview.</p>';
    }
  }, true);
})();


/* Admin quick-action refinements: create a new local request and chart ranges. */
(function actualAdminQuickActions(){
  if (!document.body.classList.contains('management-app')) return;
  const $ = id => document.getElementById(id);
  const KEY = 'actualHoldingsAdminDemoRequestsV1';
  const read = () => { try { return JSON.parse(localStorage.getItem(KEY) || '[]') || []; } catch (_) { return []; } };
  const write = rows => { try { localStorage.setItem(KEY, JSON.stringify(rows)); return true; } catch (_) { return false; } };
  const esc = value => String(value ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function ensureRequestFields(){
    const form=$('request-form'); if(!form || $('admin-new-request-client')) return;
    let clients=[]; try{clients=JSON.parse(localStorage.getItem('actualHoldingsAdminDemoClientsV2')||'[]')||[]}catch(_){}
    if(!clients.length) clients=[{id:'CL-001',name:'Jean Bosco Niyibizi'},{id:'CL-002',name:'Aline Uwimana'},{id:'CL-003',name:'Patrick Rulondo'}];
    const clientLabel=document.createElement('label'); clientLabel.textContent='Client';
    const clientSelect=document.createElement('select'); clientSelect.id='admin-new-request-client'; clientSelect.required=true;
    clientSelect.innerHTML='<option value="">Select client</option>'+clients.map(c=>`<option value="${esc(c.name)}">${esc(c.name)}</option>`).join('');
    clientLabel.appendChild(clientSelect);
    const serviceLabel=document.createElement('label'); serviceLabel.textContent='Service';
    const serviceSelect=document.createElement('select'); serviceSelect.id='admin-new-request-service'; serviceSelect.required=true;
    serviceSelect.innerHTML=['Tax Declaration','Bookkeeping','Graphic Design','Photography','Music Production','IT Support','Other'].map((v,i)=>`<option value="${esc(v)}" ${i===0?'selected':''}>${esc(v)}</option>`).join('');
    serviceLabel.appendChild(serviceSelect);
    const hidden=$('request-id'); hidden?.insertAdjacentElement('afterend',serviceLabel); hidden?.insertAdjacentElement('afterend',clientLabel);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ensureRequestFields,{once:true});else ensureRequestFields();
  document.addEventListener('click', event => {
    const quick = event.target.closest('.management-app [data-section="requests"]');
    if (quick && /new service request/i.test(quick.textContent)) {
      const dialog = $('request-dialog');
      if (dialog) {
        const id = `ISR-${String(Date.now()).slice(-6)}`;
        $('request-id').value = `NEW:${id}`;
        $('edit-status').value = 'pending';
        $('edit-priority').value = 'normal';
        $('edit-note').value = '';
        const assigned = $('edit-assigned'); if (assigned) assigned.value = 'Unassigned';
        const heading = dialog.querySelector('h3'); if (heading) heading.textContent = 'Create Service Request';
        dialog.showModal();
      }
    }
  }, true);
  document.addEventListener('click', event => {
    const button = event.target.closest('#requests-body [data-request-edit]');
    if (!button) return;
    const record = read().find(item => item.id === button.dataset.requestEdit);
    if (!record) return; // seeded legacy rows retain their existing handler
    event.preventDefault();
    event.stopImmediatePropagation();
    $('request-id').value = record.id;
    if($('admin-new-request-client'))$('admin-new-request-client').value=record.client||'';
    if($('admin-new-request-service'))$('admin-new-request-service').value=record.service||'Tax Declaration';
    $('edit-status').value = record.status || 'pending';
    $('edit-priority').value = record.priority || 'normal';
    $('edit-note').value = record.note || '';
    const assigned = $('edit-assigned'); if (assigned) assigned.value = record.assigned || 'Unassigned';
    const heading = $('request-dialog')?.querySelector('h3'); if (heading) heading.textContent = 'Update Service Request';
    $('request-dialog')?.showModal();
  }, true);
  document.addEventListener('submit', event => {
    if (event.target?.id !== 'request-form') return;
    const rawId = $('request-id')?.value || '';
    const isNew = rawId.startsWith('NEW:');
    const recordId = isNew ? rawId.slice(4) : rawId;
    const rows = read();
    const existing = rows.find(item => item.id === recordId);
    if (!isNew && !existing) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    const record = {
      ...(existing || {}), id:recordId,
      client:$('admin-new-request-client')?.value || existing?.client || 'New client (to be selected)',
      service:$('admin-new-request-service')?.value || existing?.service || 'Service not selected',
      status:$('edit-status').value, priority:$('edit-priority').value,
      assigned:$('edit-assigned').value, note:$('edit-note').value,
      createdAt:existing?.createdAt || new Date().toISOString(),
      updatedAt:new Date().toISOString()
    };
    if (existing) rows[rows.indexOf(existing)] = record; else rows.push(record);
    if (!write(rows)) { alert('Unable to save this request in browser storage.'); return; }
    const body = $('requests-body');
    if (body) {
      let tr = [...body.rows].find(row => row.textContent.includes(recordId));
      if (!tr) { tr = document.createElement('tr'); body.prepend(tr); }
      tr.innerHTML = `<td><strong>${esc(record.id)}</strong></td><td>${esc(record.client)}</td><td>${esc(record.service)}</td><td>${esc(record.priority)}</td><td>${esc(record.status)}</td><td>${esc(record.assigned)}</td><td><button class="secondary-btn" type="button" data-request-edit="${esc(record.id)}">Review</button></td>`;
    }
    $('request-dialog').close();
    const heading = $('request-dialog')?.querySelector('h3'); if (heading) heading.textContent = 'Update Service Request';
    const flash = $('flash'); if (flash) { flash.textContent = isNew ? 'Service request created in this browser preview. Client and service assignment can be completed when backend workflows are connected.' : 'Service request updated in this browser preview.'; flash.classList.add('show'); setTimeout(()=>flash.classList.remove('show'),3200); }
    $('request-id').value = recordId;
  }, true);
  const range = $('admin-chart-range');
  range?.addEventListener('change', () => {
    const labels = document.querySelectorAll('.chart-x-labels span');
    const value = range.value;
    if (value === 'Last 30 days') ['Sep 30','Oct 5','Oct 10','Oct 15','Oct 20','Oct 25','Oct 30'].forEach((v,i)=>{if(labels[i])labels[i].textContent=v;});
    else if (value === 'This year') ['Jan','Mar','May','Jul','Sep','Oct','Nov'].forEach((v,i)=>{if(labels[i])labels[i].textContent=v;});
    else ['Oct 24','Oct 25','Oct 26','Oct 27','Oct 28','Oct 29','Oct 30'].forEach((v,i)=>{if(labels[i])labels[i].textContent=v;});
  });
})();
