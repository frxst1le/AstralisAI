/**
 * ASTRALIS AI — Core Interactive Engine
 * Handles responsive navigation, theme toggle, feature filters,
 * live interactive simulator, modal dialogs, and contact dispatch.
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initNavigation();
  initHeroTilt();
  initAboutTabs();
  initCounterAnimations();
  initFeatureFilters();
  initFeatureActions();
  initSimulator();
  initContactForm();
  initModal();
  initBackToTop();
  updateCurrentYear();
});

/* ==========================================================================
   1. THEME TOGGLE (DARK / LIGHT MODE)
   ========================================================================== */
function initThemeToggle() {
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const htmlEl = document.documentElement;

  // Retrieve stored theme or default to 'dark'
  const savedTheme = localStorage.getItem('astralis-theme') || 'dark';
  htmlEl.setAttribute('data-theme', savedTheme);

  if (!themeToggleBtn) return;

  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = htmlEl.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    htmlEl.setAttribute('data-theme', newTheme);
    localStorage.setItem('astralis-theme', newTheme);
    
    showToast(`Switched to ${newTheme === 'dark' ? 'Obsidian Dark' : 'Daylight Light'} mode`, newTheme === 'dark' ? '🌙' : '☀️');
  });
}

/* ==========================================================================
   2. NAVIGATION, STICKY HEADER & SCROLL SPY
   ========================================================================== */
function initNavigation() {
  const header = document.getElementById('siteHeader');
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Sticky header class on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Scroll spy for desktop navigation
    let currentSection = '';
    const scrollPosition = window.scrollY + 120;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  });

  // Mobile drawer toggle
  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.toggle('open');
      mobileToggle.classList.toggle('active');
      mobileToggle.setAttribute('aria-expanded', isOpen);
      mobileDrawer.setAttribute('aria-hidden', !isOpen);
    });

    // Close mobile drawer when clicking any link inside
    document.querySelectorAll('.mobile-nav-link, .mobile-cta-btn').forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        mobileToggle.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileDrawer.setAttribute('aria-hidden', 'true');
      });
    });

    // Close on Escape key
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileDrawer.classList.contains('open')) {
        mobileDrawer.classList.remove('open');
        mobileToggle.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileDrawer.setAttribute('aria-hidden', 'true');
      }
    });
  }
}

/* ==========================================================================
   3. HERO 3D TILT PARALLAX EFFECT
   ========================================================================== */
function initHeroTilt() {
  const card = document.getElementById('heroTiltCard');
  if (!card || window.innerWidth < 768) return;

  const wrapper = card.parentElement;

  wrapper.addEventListener('mousemove', (e) => {
    const rect = wrapper.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;
  });

  wrapper.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
  });
}

/* ==========================================================================
   4. ABOUT SECTION TABS
   ========================================================================== */
function initAboutTabs() {
  const tabButtons = document.querySelectorAll('.about-tab-btn');
  const tabPanels = document.querySelectorAll('.about-tab-panel');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-tab');

      // Update button active state & aria
      tabButtons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      // Update panels
      tabPanels.forEach(panel => {
        panel.classList.remove('active');
        if (panel.id === `panel-${targetId}`) {
          panel.classList.add('active');
        }
      });
    });
  });
}

/* ==========================================================================
   5. INTERSECTION OBSERVER ANIMATED NUMBER COUNTERS
   ========================================================================== */
function initCounterAnimations() {
  const counters = document.querySelectorAll('.stat-number');
  if (!counters.length) return;

  let hasAnimated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        animateAllCounters(counters);
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.querySelector('.stats-counter-strip');
  if (statsSection) {
    observer.observe(statsSection);
  }
}

function animateAllCounters(counters) {
  counters.forEach(counter => {
    const target = parseFloat(counter.getAttribute('data-target'));
    const suffix = counter.getAttribute('data-suffix') || '';
    const isFloat = target % 1 !== 0;
    const duration = 1600; // ms
    const startTime = performance.now();

    function updateCount(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentVal = easeOut * target;

      counter.textContent = (isFloat ? currentVal.toFixed(isFloat && target < 10 ? 1 : 2) : Math.floor(currentVal)) + suffix;

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        counter.textContent = target + suffix;
      }
    }

    requestAnimationFrame(updateCount);
  });
}

/* ==========================================================================
   6. FEATURE CATEGORY FILTER BUTTONS
   ========================================================================== */
function initFeatureFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.feature-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle button active state
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      cards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.classList.remove('hide');
          card.style.animation = 'fade-in 0.35s ease-out forwards';
        } else {
          card.classList.add('hide');
        }
      });

      showToast(`Filtered by: ${btn.textContent.trim()}`, '🔍');
    });
  });
}

/* ==========================================================================
   7. FEATURE CARD ACTIONS & COPY BUTTONS
   ========================================================================== */
function initFeatureActions() {
  // Feature inspect buttons
  const actionButtons = document.querySelectorAll('.feature-action-btn');
  actionButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const action = btn.getAttribute('data-action');
      openFeatureModal(action);
    });
  });

  // Feature copy buttons
  const copyButtons = document.querySelectorAll('.btn-icon-copy');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const textToCopy = btn.getAttribute('data-copy');
      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast(`Copied to clipboard: "${textToCopy}"`, '📋');
          btn.style.color = '#10b981';
          setTimeout(() => { btn.style.color = ''; }, 1800);
        }).catch(() => {
          showToast('Failed to copy to clipboard', '⚠️');
        });
      }
    });
  });
}

/* ==========================================================================
   8. INTERACTIVE FEATURE SIMULATOR CONSOLE
   ========================================================================== */
const simulatorData = {
  inference: {
    title: 'Module: Neural Inference Acceleration [v3.2.1]',
    fileName: 'pipeline.config.ts',
    lang: 'TypeScript',
    code: `// Initializing Astralis Neural Runtime
import { AstralisCluster, SpeculativeDecoder } from '@astralis/core';

export const pipeline = new AstralisCluster({
  region: 'anycast-global',
  engine: 'speculative-v3',
  maxTokensPerSec: 1840,
  zeroColdStart: true,
  fallbackRoute: 'edge-tokyo-02'
});

// Stream inference output directly
const stream = await pipeline.dispatch({
  prompt: 'Synthesize global multi-modal embeddings',
  temperature: 0.12,
  enclaveVerification: 'hardware-strict'
});`,
    m1Label: 'Tokens / Sec',
    m1Val: '1,842 t/s',
    m2Label: 'P99 Latency',
    m2Val: '1.14 ms',
    m3Label: 'Memory Saved',
    m3Val: '68.4%',
    initialLogs: [
      '[17:20:54] → Initializing Astralis Runtime Kernel...',
      '[17:20:54] ✓ Connected to Nearest PoP (Frankfurt-Edge-04, 1.1ms)',
      '[17:20:54] ⚡ Speculative decoding weights mapped to L2 cache',
      '[17:20:55] ◈ Stream active: 1,842 tokens/sec sustained'
    ]
  },
  security: {
    title: 'Module: Confidential Hardware Enclaves [v3.2.1]',
    fileName: 'security.enclave.rs',
    lang: 'Rust',
    code: `// Astralis Hardware Enclave Attestation
use astralis_enclave::{EnclavePolicy, HardwareAttestation};

pub async fn verify_session(jwt_token: &str) -> Result<EnclaveSession, EnclaveError> {
    let policy = EnclavePolicy::strict()
        .require_amd_sev_snp()
        .enforce_zero_data_leak();

    let session = HardwareAttestation::bind(&policy)
        .verify_hardware_hash(jwt_token)
        .await?;

    Ok(session)
}`,
    m1Label: 'Enclave Status',
    m1Val: 'ATTESTED',
    m2Label: 'Memory Leaks',
    m2Val: '0.00 %',
    m3Label: 'Certs Verified',
    m3Val: '100% OK',
    initialLogs: [
      '[17:22:10] → Requesting AMD SEV-SNP cryptographic report...',
      '[17:22:10] ✓ Hardware measurement verified: 0x7e8...a19',
      '[17:22:11] 🛡️ Ephemeral memory boundary isolated: 64 GB reserved',
      '[17:22:11] ◈ Zero-knowledge tunnel established to client'
    ]
  },
  edge: {
    title: 'Module: Global Anycast Telemetry PoP [v3.2.1]',
    fileName: 'telemetry.routing.json',
    lang: 'JSON',
    code: `{
  "routingEngine": "astralis-anycast-v2",
  "activePoPs": 160,
  "telemetry": {
    "tokyo-east": { "ping": "0.94ms", "health": "NOMINAL" },
    "frankfurt-01": { "ping": "1.12ms", "health": "NOMINAL" },
    "san-francisco": { "ping": "0.85ms", "health": "NOMINAL" },
    "sao-paulo": { "ping": "2.10ms", "health": "NOMINAL" }
  },
  "trafficBalancing": "dynamic-lowest-rtt"
}`,
    m1Label: 'Global PoPs',
    m1Val: '160 Active',
    m2Label: 'Avg Routing RTT',
    m2Val: '0.98 ms',
    m3Label: 'Packet Loss',
    m3Val: '0.0001%',
    initialLogs: [
      '[17:23:01] 🌐 Anycast BGP routes broadcasted to Tier-1 backbones',
      '[17:23:02] ✓ Tokyo-East ping: 0.94ms (100% SLA)',
      '[17:23:02] ✓ San Francisco ping: 0.85ms (100% SLA)',
      '[17:23:03] ◈ 12,480 concurrent webhooks routed seamlessly'
    ]
  },
  scaler: {
    title: 'Module: Predictive Auto-Scaling Engine [v3.2.1]',
    fileName: 'autoscaler.rule.yaml',
    lang: 'YAML',
    code: `apiVersion: astralis.io/v1
kind: AutonomousScaler
metadata:
  name: production-inference-scaler
spec:
  predictionWindow: 45s
  algorithm: lstm-temporal-v2
  minReplicas: 4
  maxReplicas: 128
  metrics:
    - type: InferenceQueueDepth
      threshold: 85
    - type: GpuVramUsage
      threshold: 80%`,
    m1Label: 'Active Replicas',
    m1Val: '18 Nodes',
    m2Label: 'Pre-warm Time',
    m2Val: '< 180 ms',
    m3Label: 'Cost Efficiency',
    m3Val: '+54.2%',
    initialLogs: [
      '[17:24:12] 📊 Time-series forecast model evaluated (45s window)',
      '[17:24:13] ◈ Approaching diurnal traffic surge pattern',
      '[17:24:13] ⚡ Pre-warmed 6 additional GPU pods in us-east-1',
      '[17:24:14] ✓ Zero throttling occurred during 350% query surge'
    ]
  }
};

let currentSimulatorKey = 'inference';

function initSimulator() {
  const simButtons = document.querySelectorAll('.sim-btn');
  const titleEl = document.getElementById('simConsoleTitle');
  const fileNameEl = document.getElementById('simFileName');
  const codeDisplayEl = document.getElementById('simCodeDisplay');
  const m1Label = document.getElementById('metric1Label');
  const m1Val = document.getElementById('metric1Value');
  const m2Label = document.getElementById('metric2Label');
  const m2Val = document.getElementById('metric2Value');
  const m3Label = document.getElementById('metric3Label');
  const m3Val = document.getElementById('metric3Value');
  const terminalLog = document.getElementById('terminalLog');
  const copyBtn = document.getElementById('copySnippetBtn');
  const runBtn = document.getElementById('runSimulationBtn');
  const injectLoadBtn = document.getElementById('simInjectLoadBtn');
  const clearLogsBtn = document.getElementById('simClearLogsBtn');

  // Ribbon button click
  simButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      simButtons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const simKey = btn.getAttribute('data-sim');
      currentSimulatorKey = simKey;
      const data = simulatorData[simKey];

      if (!data) return;

      // Update UI elements
      titleEl.textContent = data.title;
      fileNameEl.textContent = data.fileName;
      codeDisplayEl.textContent = data.code;

      m1Label.textContent = data.m1Label;
      m1Val.textContent = data.m1Val;
      m2Label.textContent = data.m2Label;
      m2Val.textContent = data.m2Val;
      m3Label.textContent = data.m3Label;
      m3Val.textContent = data.m3Val;

      // Populate logs
      terminalLog.innerHTML = '';
      data.initialLogs.forEach(line => {
        const div = document.createElement('div');
        div.className = 'log-line';
        if (line.includes('✓')) div.classList.add('text-success');
        else if (line.includes('⚡')) div.classList.add('text-cyan');
        else if (line.includes('◈')) div.classList.add('text-light');
        else div.classList.add('text-muted');
        div.textContent = line;
        terminalLog.appendChild(div);
      });
      terminalLog.scrollTop = terminalLog.scrollHeight;

      showToast(`Loaded ${data.title.split(':')[1]?.trim() || simKey}`, '⚡');
    });
  });

  // Copy Snippet Button
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const code = codeDisplayEl.textContent;
      navigator.clipboard.writeText(code).then(() => {
        showToast('Code snippet copied to clipboard', '📋');
      });
    });
  }

  // Run Simulation Button
  if (runBtn) {
    runBtn.addEventListener('click', () => {
      runBtn.disabled = true;
      runBtn.innerHTML = '<span>⚡ Running Bench...</span>';
      
      const timestamp = new Date().toTimeString().split(' ')[0];
      appendLogLine(terminalLog, `[${timestamp}] 🚀 Running dynamic benchmark pass for ${currentSimulatorKey}...`, 'text-cyan');
      
      setTimeout(() => {
        const newTimestamp = new Date().toTimeString().split(' ')[0];
        appendLogLine(terminalLog, `[${newTimestamp}] ✓ Benchmark completed: 0 cold starts detected. P99 < 1.05ms`, 'text-success');
        runBtn.disabled = false;
        runBtn.innerHTML = '<span class="play-triangle">▶</span> <span>Trigger Benchmark</span>';
        showToast('Benchmark simulation completed with 100% score', '🎯');
      }, 1000);
    });
  }

  // Inject Load Button
  if (injectLoadBtn) {
    injectLoadBtn.addEventListener('click', () => {
      const timestamp = new Date().toTimeString().split(' ')[0];
      appendLogLine(terminalLog, `[${timestamp}] ⚡ INJECTING 5,000 CONCURRENT CLIENT PACKETS...`, 'text-cyan');
      
      setTimeout(() => {
        appendLogLine(terminalLog, `[${timestamp}] ✓ Mesh autoscaled +4 edge nodes. Throughput stabilized at 2,420 t/s`, 'text-emerald');
        showToast('Load test injected: All nodes healthy and within SLA', '🔥');
      }, 700);
    });
  }

  // Clear Terminal Button
  if (clearLogsBtn) {
    clearLogsBtn.addEventListener('click', () => {
      terminalLog.innerHTML = `<div class="log-line text-muted">[${new Date().toTimeString().split(' ')[0]}] Console cleared. Listening on telemetry port 8443...</div>`;
      showToast('Simulator terminal cleared', '🧹');
    });
  }
}

function appendLogLine(container, text, className) {
  const line = document.createElement('div');
  line.className = `log-line ${className || ''}`;
  line.textContent = text;
  container.appendChild(line);
  container.scrollTop = container.scrollHeight;
}

/* ==========================================================================
   9. CONTACT FORM INTERACTION & VALIDATION
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const nameInput = document.getElementById('fullName');
  const emailInput = document.getElementById('email');
  const messageInput = document.getElementById('message');
  const charCounter = document.getElementById('charCounter');
  const interestChips = document.querySelectorAll('.interest-chip');
  const selectedInterestInput = document.getElementById('selectedInterest');
  const submitBtn = document.getElementById('submitFormBtn');
  const spinner = document.getElementById('formSpinner');
  const btnText = document.getElementById('submitBtnText');
  const successBanner = document.getElementById('formSuccessBanner');
  const resetBtn = document.getElementById('resetFormBtn');
  const bookCallBtn = document.getElementById('bookCallBtn');

  // Interest chip buttons click
  interestChips.forEach(chip => {
    chip.addEventListener('click', () => {
      interestChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const topic = chip.getAttribute('data-topic');
      if (selectedInterestInput) {
        selectedInterestInput.value = topic;
      }
    });
  });

  // Character counter for textarea
  if (messageInput && charCounter) {
    messageInput.addEventListener('input', () => {
      const len = messageInput.value.length;
      charCounter.textContent = `${len} / 500`;
      if (len >= 450) {
        charCounter.style.color = 'var(--accent-amber)';
      } else {
        charCounter.style.color = 'var(--text-muted)';
      }
    });
  }

  // Form submission with validation
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;

      // Validate name
      if (!nameInput.value.trim()) {
        document.getElementById('nameError').classList.add('visible');
        nameInput.classList.add('invalid');
        isValid = false;
      } else {
        document.getElementById('nameError').classList.remove('visible');
        nameInput.classList.remove('invalid');
      }

      // Validate email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailInput.value.trim())) {
        document.getElementById('emailError').classList.add('visible');
        emailInput.classList.add('invalid');
        isValid = false;
      } else {
        document.getElementById('emailError').classList.remove('visible');
        emailInput.classList.remove('invalid');
      }

      // Validate message
      if (messageInput.value.trim().length < 10) {
        document.getElementById('messageError').classList.add('visible');
        messageInput.classList.add('invalid');
        isValid = false;
      } else {
        document.getElementById('messageError').classList.remove('visible');
        messageInput.classList.remove('invalid');
      }

      if (!isValid) return;

      // Simulating network request
      submitBtn.disabled = true;
      spinner.classList.add('active');
      btnText.textContent = 'Transmitting...';

      setTimeout(() => {
        submitBtn.disabled = false;
        spinner.classList.remove('active');
        btnText.textContent = 'Dispatch Inquiry';

        // Hide form inputs or show success banner
        form.querySelectorAll('.form-row, .form-group, .form-action-wrap').forEach(el => el.style.display = 'none');
        successBanner.classList.add('visible');

        showToast('Inquiry successfully dispatched to solutions engineers!', '🚀');
      }, 1200);
    });
  }

  // Reset form button
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      form.reset();
      form.querySelectorAll('.form-row, .form-group, .form-action-wrap').forEach(el => el.style.display = '');
      successBanner.classList.remove('visible');
      if (charCounter) charCounter.textContent = '0 / 500';
    });
  }

  // Schedule Call Button
  if (bookCallBtn) {
    bookCallBtn.addEventListener('click', () => {
      openScheduleModal();
    });
  }
}

/* ==========================================================================
   10. INTERACTIVE MODAL DIALOG
   ========================================================================== */
function initModal() {
  const modal = document.getElementById('interactiveModal');
  const closeBtn = document.getElementById('modalCloseBtn');
  const secondaryBtn = document.getElementById('modalSecondaryBtn');
  const openDemoBtn = document.getElementById('openDemoBtn');

  if (openDemoBtn) {
    openDemoBtn.addEventListener('click', () => {
      openDemoModal();
    });
  }

  function closeModal() {
    if (modal) {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
    }
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (secondaryBtn) secondaryBtn.addEventListener('click', closeModal);

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('open')) {
        closeModal();
      }
    });
  }

  // Footer doc links trigger preview
  document.querySelectorAll('.footer-action-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const docType = link.getAttribute('data-doc');
      openDocModal(docType);
    });
  });
}

function openDemoModal() {
  const modal = document.getElementById('interactiveModal');
  const title = document.getElementById('modalTitle');
  const body = document.getElementById('modalBody');

  title.textContent = 'Astralis 3.0 Platform Overview Demo';
  body.innerHTML = `
    <div style="background: rgba(0,0,0,0.4); border-radius: 12px; padding: 2rem; text-align: center; border: 1px solid var(--border-medium);">
      <div style="font-size: 3rem; margin-bottom: 1rem;">🎥</div>
      <h4 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 0.5rem; color: var(--text-primary);">Interactive Architecture Walkthrough</h4>
      <p style="font-size: 0.92rem; color: var(--text-secondary); max-width: 440px; margin: 0 auto 1.5rem auto;">
        Watch how Astralis routes 40,000+ simultaneous requests across 160 global PoPs with zero dropouts and hardware-verified memory enclaves.
      </p>
      <div style="display: flex; justify-content: center; gap: 0.75rem;">
        <button class="btn btn-primary btn-sm" onclick="showToast('Starting HD demo stream...', '🎬');">▶ Play Interactive Preview</button>
        <button class="btn btn-outline btn-sm" onclick="showToast('Downloaded technical whitepaper (PDF)', '📄');">Download Specs PDF</button>
      </div>
    </div>
  `;

  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
}

function openFeatureModal(action) {
  const modal = document.getElementById('interactiveModal');
  const title = document.getElementById('modalTitle');
  const body = document.getElementById('modalBody');

  const titles = {
    speculative: 'Dynamic Speculative Decoding Specification',
    anycast: 'Zero-Cold Anycast Mesh Network',
    autoscaling: 'Predictive Cluster Auto-Scaling',
    security: 'Hardware Secure Enclave Architecture',
    arbitration: 'Multi-Model Semantic Arbitration',
    branching: 'Live State Branching & Canary Releases'
  };

  title.textContent = titles[action] || 'Feature Deep Dive';
  body.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 1.25rem;">
      <p style="color: var(--text-secondary); font-size: 0.95rem; line-height: 1.6;">
        Astralis employs kernel-level optimizations to eradicate latency jitter and streamline real-time AI workloads.
      </p>
      <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-medium); border-radius: 8px; padding: 1rem; font-family: var(--font-mono); font-size: 0.82rem;">
        <div style="color: var(--primary-cyan); margin-bottom: 0.5rem;">// Protocol Configuration</div>
        <div>astralis config set --feature="${action}" --verify=strict</div>
        <div>astralis cluster test --benchmark=p99-latency</div>
      </div>
      <ul style="color: var(--text-primary); font-size: 0.9rem; display: flex; flex-direction: column; gap: 0.5rem; padding-left: 1.25rem;">
        <li>Guaranteed sub-2ms response latency at edge nodes</li>
        <li>Automated failover protocol with zero connection drops</li>
        <li>SOC2 Type II, HIPAA, and ISO 27001 audited security layer</li>
      </ul>
    </div>
  `;

  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
}

function openScheduleModal() {
  const modal = document.getElementById('interactiveModal');
  const title = document.getElementById('modalTitle');
  const body = document.getElementById('modalBody');

  title.textContent = 'Schedule Technical Architecture Review';
  body.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 1rem;">
      <p style="color: var(--text-secondary); font-size: 0.92rem;">
        Choose a time slot with our Solutions Engineering team. All meetings include technical scoping and a sandbox API key.
      </p>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
        <button class="btn btn-outline btn-sm" onclick="showToast('Reserved: Tomorrow 10:00 AM PST', '📅'); document.getElementById('interactiveModal').classList.remove('open');">Tomorrow 10:00 AM PST</button>
        <button class="btn btn-outline btn-sm" onclick="showToast('Reserved: Tomorrow 2:00 PM PST', '📅'); document.getElementById('interactiveModal').classList.remove('open');">Tomorrow 2:00 PM PST</button>
        <button class="btn btn-outline btn-sm" onclick="showToast('Reserved: Thursday 11:30 AM PST', '📅'); document.getElementById('interactiveModal').classList.remove('open');">Thursday 11:30 AM PST</button>
        <button class="btn btn-outline btn-sm" onclick="showToast('Reserved: Thursday 4:00 PM PST', '📅'); document.getElementById('interactiveModal').classList.remove('open');">Thursday 4:00 PM PST</button>
      </div>
    </div>
  `;

  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
}

function openDocModal(docType) {
  const modal = document.getElementById('interactiveModal');
  const title = document.getElementById('modalTitle');
  const body = document.getElementById('modalBody');

  title.textContent = `Astralis Documentation: ${docType.toUpperCase()}`;
  body.innerHTML = `
    <p style="color: var(--text-secondary); font-size: 0.95rem; margin-bottom: 1rem;">
      Access complete reference manuals, API endpoints, code snippets, and SDK installation guides.
    </p>
    <div style="background: rgba(0,0,0,0.3); border: 1px solid var(--border-subtle); border-radius: 8px; padding: 1rem; font-family: var(--font-mono); font-size: 0.85rem; color: var(--primary-cyan);">
      $ npm install @astralis/sdk<br>
      $ astralis init my-agent-cluster
    </div>
  `;

  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
}

/* ==========================================================================
   11. TOAST NOTIFICATIONS HELPER
   ========================================================================== */
function showToast(message, icon = '✨') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <span class="toast-icon">${icon}</span>
    <span class="toast-message">${message}</span>
  `;

  container.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  // Auto remove after 3.2s
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3200);
}

// Attach to window so inline onclick handlers can call it
window.showToast = showToast;

/* ==========================================================================
   12. BACK TO TOP BUTTON
   ========================================================================== */
function initBackToTop() {
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ==========================================================================
   13. CURRENT YEAR FOOTER UPDATE
   ========================================================================== */
function updateCurrentYear() {
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}
