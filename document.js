document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Header scroll state ---------- */
  const header = document.getElementById('siteHeader');
  const onScroll = () => {
    if (window.scrollY > 40) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');
  navToggle.addEventListener('click', () => {
    mainNav.classList.toggle('open');
    navToggle.classList.toggle('active');
  });
  mainNav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => mainNav.classList.remove('open'));
  });

  document.getElementById('headerBookBtn').addEventListener('click', () => {
    document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
  });

  /* ---------- Reduced motion check ---------- */
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Rose petal floating animation ---------- */
  const petalLayer = document.getElementById('petalLayer');
  const PETAL_COUNT = prefersReducedMotion ? 0 : 18;

  function createPetal() {
    const petal = document.createElement('div');
    petal.className = 'petal';
    const size = 10 + Math.random() * 14;
    const startX = Math.random() * 100;
    const fallDuration = 10 + Math.random() * 12;
    const swayDuration = 3 + Math.random() * 3;
    const delay = Math.random() * 12;

    petal.style.width = `${size}px`;
    petal.style.height = `${size * 0.8}px`;
    petal.style.left = `${startX}vw`;
    petal.style.animationDuration = `${fallDuration}s, ${swayDuration}s`;
    petal.style.animationDelay = `${delay}s, ${delay}s`;
    petal.style.opacity = (0.4 + Math.random() * 0.4).toFixed(2);

    petalLayer.appendChild(petal);
  }

  for (let i = 0; i < PETAL_COUNT; i++) createPetal();

  /* ---------- Gold particles canvas (hero) ---------- */
  const goldCanvas = document.getElementById('goldParticles');
  const goldCtx = goldCanvas.getContext('2d');
  let goldParticles = [];
  let heroSection = document.querySelector('.hero');

  function resizeGoldCanvas() {
    goldCanvas.width = heroSection.offsetWidth;
    goldCanvas.height = heroSection.offsetHeight;
  }

  function initGoldParticles() {
    resizeGoldCanvas();
    const count = prefersReducedMotion ? 0 : Math.floor((goldCanvas.width * goldCanvas.height) / 22000);
    goldParticles = [];
    for (let i = 0; i < count; i++) {
      goldParticles.push({
        x: Math.random() * goldCanvas.width,
        y: Math.random() * goldCanvas.height,
        r: 0.6 + Math.random() * 1.8,
        vx: (Math.random() - 0.5) * 0.15,
        vy: -0.1 - Math.random() * 0.25,
        alpha: 0.2 + Math.random() * 0.5,
        pulse: Math.random() * Math.PI * 2
      });
    }
  }

  function drawGoldParticles() {
    goldCtx.clearRect(0, 0, goldCanvas.width, goldCanvas.height);
    goldParticles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.pulse += 0.02;

      if (p.y < -10) p.y = goldCanvas.height + 10;
      if (p.x < -10) p.x = goldCanvas.width + 10;
      if (p.x > goldCanvas.width + 10) p.x = -10;

      const flicker = (Math.sin(p.pulse) + 1) / 2;
      const alpha = p.alpha * (0.5 + flicker * 0.5);

      goldCtx.beginPath();
      goldCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      goldCtx.fillStyle = `rgba(212, 175, 122, ${alpha})`;
      goldCtx.shadowColor = 'rgba(212, 175, 122, 0.8)';
      goldCtx.shadowBlur = 6;
      goldCtx.fill();
    });
    requestAnimationFrame(drawGoldParticles);
  }

  initGoldParticles();
  window.addEventListener('resize', initGoldParticles);
  drawGoldParticles();

  /* ---------- Parallax scrolling ---------- */
  const parallaxEls = document.querySelectorAll('[data-parallax]');
  let ticking = false;

  function updateParallax() {
    const scrollY = window.scrollY;
    parallaxEls.forEach(el => {
      const speed = parseFloat(el.dataset.parallax);
      const rect = el.closest('section').getBoundingClientRect();
      const offset = (rect.top) * speed;
      el.style.transform = `translateY(${offset * -1}px)`;
    });
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (prefersReducedMotion) return;
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }, { passive: true });

  /* ---------- Scroll reveal for cards ---------- */
  const revealTargets = document.querySelectorAll('.gallery-card, .service-card, .stat, .contact-list li');
  revealTargets.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.7s var(--ease), transform 0.7s var(--ease)';
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealTargets.forEach(el => revealObserver.observe(el));

  /* ---------- Envelope open/close ---------- */
  const envelope = document.getElementById('envelope');
  const envelopeFront = document.querySelector('.envelope-front');

  envelopeFront.addEventListener('click', () => {
    envelope.classList.toggle('open');
  });

  /* ---------- Sparkle canvas (form submission) ---------- */
  const sparkleCanvas = document.getElementById('sparkleCanvas');
  const sparkleCtx = sparkleCanvas.getContext('2d');
  let sparkles = [];
  let sparkleAnimId = null;

  function resizeSparkleCanvas() {
    const section = document.getElementById('booking');
    sparkleCanvas.width = section.offsetWidth;
    sparkleCanvas.height = section.offsetHeight;
  }
  resizeSparkleCanvas();
  window.addEventListener('resize', resizeSparkleCanvas);

  function spawnSparkleBurst(cx, cy) {
    const colors = ['#d4af7a', '#b76e79', '#f3c9d4', '#ffffff'];
    const count = prefersReducedMotion ? 20 : 60;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 5;
      sparkles.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        r: 1.5 + Math.random() * 2.5,
        life: 1,
        decay: 0.012 + Math.random() * 0.012,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
    if (!sparkleAnimId) animateSparkles();
  }

  function animateSparkles() {
    sparkleCtx.clearRect(0, 0, sparkleCanvas.width, sparkleCanvas.height);
    sparkles.forEach(s => {
      s.x += s.vx;
      s.y += s.vy;
      s.vy += 0.04;
      s.life -= s.decay;

      sparkleCtx.globalAlpha = Math.max(s.life, 0);
      sparkleCtx.beginPath();
      sparkleCtx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      sparkleCtx.fillStyle = s.color;
      sparkleCtx.shadowColor = s.color;
      sparkleCtx.shadowBlur = 8;
      sparkleCtx.fill();
    });
    sparkleCtx.globalAlpha = 1;

    sparkles = sparkles.filter(s => s.life > 0);

    if (sparkles.length > 0) {
      sparkleAnimId = requestAnimationFrame(animateSparkles);
    } else {
      sparkleCtx.clearRect(0, 0, sparkleCanvas.width, sparkleCanvas.height);
      sparkleAnimId = null;
    }
  }

  /* ---------- Booking form submission ---------- */
  const bookingForm = document.getElementById('bookingForm');
  const formNote = document.getElementById('formNote');
  const toast = document.getElementById('toast');

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3200);
  }

  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!bookingForm.checkValidity()) {
      bookingForm.reportValidity();
      return;
    }

    const data = {
      fullName: bookingForm.fullName.value.trim(),
      phone: bookingForm.phone.value.trim(),
      eventType: bookingForm.eventType.value,
      eventDate: bookingForm.eventDate.value,
      guests: bookingForm.guests.value
    };

    formNote.textContent = `Merci, ${data.fullName}. Your invitation has been sealed.`;

    const rect = sparkleCanvas.getBoundingClientRect();
    const originX = rect.width / 2;
    const originY = rect.height * 0.55;
    spawnSparkleBurst(originX, originY);

    showToast('Your reservation request has been sent ✦');

    setTimeout(() => {
      bookingForm.reset();
      envelope.classList.remove('open');
      formNote.textContent = '';
    }, 2600);
  });

  /* ---------- Set min date for booking to today ---------- */
  const eventDateInput = document.getElementById('eventDate');
  const today = new Date().toISOString().split('T')[0];
  eventDateInput.setAttribute('min', today);

});