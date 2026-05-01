/* ============================================================
   JASHWANTH RAJ — app.js
   Three.js 3D Hero · Custom Cursor · Parallax · Dark/Light Mode
   Scroll Reveal · 3D Card Tilt · Skill Bars · Form Handler
   ============================================================ */

'use strict';

/* ── THEME SYSTEM ────────────────────────────────────────── */
const ThemeManager = (() => {
  const root = document.documentElement;
  const toggle = document.getElementById('theme-toggle');
  const STORAGE_KEY = 'jr-theme';

  function setTheme(t) {
    root.setAttribute('data-theme', t);
    localStorage.setItem(STORAGE_KEY, t);
  }

  function init() {
    const saved = localStorage.getItem(STORAGE_KEY);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(saved || (prefersDark ? 'dark' : 'light'));

    toggle?.addEventListener('click', () => {
      const current = root.getAttribute('data-theme');
      setTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  return { init };
})();


/* ── CUSTOM CURSOR ───────────────────────────────────────── */
const CursorManager = (() => {
  let mx = 0, my = 0, rx = 0, ry = 0;
  let dot, ring, raf;

  function init() {
    if (window.matchMedia('(pointer:coarse)').matches) return; // skip on touch
    dot = document.getElementById('cursor-dot');
    ring = document.getElementById('cursor-ring');
    if (!dot || !ring) return;

    document.body.classList.add('cursor-custom');

    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

    document.querySelectorAll('a, button, .skill-card, .ach-card, .edu-card').forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });

    loop();
  }

  function loop() {
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
    rx += (mx - rx) * 0.1;
    ry += (my - ry) * 0.1;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    raf = requestAnimationFrame(loop);
  }

  return { init };
})();


/* ── THREE.JS HERO ───────────────────────────────────────── */
const HeroCanvas = (() => {
  let scene, camera, renderer, particles, lines;
  let mouse = { x: 0, y: 0 };
  let target = { x: 0, y: 0 };
  let w, h, raf;
  const PARTICLE_COUNT = 140;
  const MAX_DIST = 130;

  function init() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    w = canvas.parentElement.offsetWidth;
    h = canvas.parentElement.offsetHeight;

    // Scene
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 1000);
    camera.position.z = 400;

    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h);

    buildParticles();
    buildLines();
    bindEvents();
    animate();
  }

  function getAccentColor() {
    const theme = document.documentElement.getAttribute('data-theme');
    return theme === 'light' ? 0x4a9000 : 0xc8ff00;
  }

  function buildParticles() {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const sizes = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * w * 0.9;
      positions[i * 3 + 1] = (Math.random() - 0.5) * h * 0.9;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 200;
      sizes[i] = Math.random() * 3 + 1;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const mat = new THREE.PointsMaterial({
      color: getAccentColor(),
      size: 2,
      transparent: true,
      opacity: 0.6,
      sizeAttenuation: true,
    });

    particles = new THREE.Points(geo, mat);
    scene.add(particles);
  }

  function buildLines() {
    const positions = particles.geometry.attributes.position.array;
    const lineGeo = new THREE.BufferGeometry();
    const verts = [];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      for (let j = i + 1; j < PARTICLE_COUNT; j++) {
        const ax = positions[i*3], ay = positions[i*3+1], az = positions[i*3+2];
        const bx = positions[j*3], by = positions[j*3+1], bz = positions[j*3+2];
        const dist = Math.sqrt((ax-bx)**2+(ay-by)**2+(az-bz)**2);
        if (dist < MAX_DIST) {
          verts.push(ax, ay, az, bx, by, bz);
        }
      }
    }

    lineGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(verts), 3));
    const lineMat = new THREE.LineBasicMaterial({
      color: getAccentColor(),
      transparent: true,
      opacity: 0.08,
    });
    lines = new THREE.LineSegments(lineGeo, lineMat);
    scene.add(lines);
  }

  function bindEvents() {
    window.addEventListener('mousemove', e => {
      mouse.x = (e.clientX / w - 0.5) * 60;
      mouse.y = -(e.clientY / h - 0.5) * 60;
    });

    window.addEventListener('resize', () => {
      w = renderer.domElement.parentElement.offsetWidth;
      h = renderer.domElement.parentElement.offsetHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });

    // Update colors on theme change
    const observer = new MutationObserver(() => {
      const c = getAccentColor();
      if (particles) particles.material.color.setHex(c);
      if (lines) lines.material.color.setHex(c);
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  }

  function animate() {
    raf = requestAnimationFrame(animate);
    target.x += (mouse.x - target.x) * 0.04;
    target.y += (mouse.y - target.y) * 0.04;
    scene.rotation.y = target.x * 0.003;
    scene.rotation.x = target.y * 0.003;

    if (particles) {
      particles.rotation.y += 0.0005;
      particles.rotation.x += 0.0002;
    }

    renderer.render(scene, camera);
  }

  return { init };
})();


/* ── PARALLAX ────────────────────────────────────────────── */
const ParallaxManager = (() => {
  const layers = [];

  function init() {
    document.querySelectorAll('[data-parallax]').forEach(el => {
      layers.push({ el, speed: parseFloat(el.dataset.parallax) });
    });
    if (layers.length) window.addEventListener('scroll', onScroll, { passive: true });
  }

  function onScroll() {
    const sy = window.scrollY;
    layers.forEach(({ el, speed }) => {
      el.style.transform = `translateY(${sy * speed}px)`;
    });
  }

  return { init };
})();


/* ── NAVBAR ──────────────────────────────────────────────── */
const NavManager = (() => {
  function init() {
    const nav = document.getElementById('navbar');
    const burger = document.getElementById('burger');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = mobileMenu?.querySelectorAll('a');

    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });

    burger?.addEventListener('click', () => {
      const open = burger.classList.toggle('open');
      mobileMenu?.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });

    mobileLinks?.forEach(a => {
      a.addEventListener('click', () => {
        burger.classList.remove('open');
        mobileMenu?.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    // Active link on scroll
    const sections = document.querySelectorAll('section[id]');
    const links = document.querySelectorAll('.nav-links a, .mobile-menu a');

    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          links.forEach(l => l.classList.remove('active'));
          links.forEach(l => { if (l.getAttribute('href') === `#${e.target.id}`) l.classList.add('active'); });
        }
      });
    }, { threshold: 0.4 });

    sections.forEach(s => obs.observe(s));
  }

  return { init };
})();


/* ── SCROLL REVEAL ───────────────────────────────────────── */
const RevealManager = (() => {
  function init() {
    const els = document.querySelectorAll('.reveal');
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in-view');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });

    els.forEach(el => obs.observe(el));
  }

  return { init };
})();


/* ── SKILL BARS ──────────────────────────────────────────── */
const SkillManager = (() => {
  function init() {
    const cards = document.querySelectorAll('.skill-card');
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in-view');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.3 });

    cards.forEach(c => obs.observe(c));
  }

  return { init };
})();


/* ── 3D CARD TILT ────────────────────────────────────────── */
const TiltManager = (() => {
  const TILT = 12;

  function bind(el) {
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;
      el.style.transform = `perspective(700px) rotateY(${x * TILT}deg) rotateX(${-y * TILT}deg) translateZ(10px)`;

      // Shine on hero card
      const shine = el.querySelector('.card-shine');
      if (shine) {
        const px = (e.clientX - r.left) / r.width * 100;
        const py = (e.clientY - r.top)  / r.height * 100;
        shine.style.setProperty('--mx', px + '%');
        shine.style.setProperty('--my', py + '%');
      }
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
      el.style.transition = 'transform 0.5s ease';
      setTimeout(() => el.style.transition = '', 500);
    });

    el.addEventListener('mouseenter', () => { el.style.transition = 'none'; });
  }

  function init() {
    document.querySelectorAll('.skill-card, .ach-card, .edu-card, .hero-3d-card, .info-card').forEach(bind);
  }

  return { init };
})();


/* ── ANIMATED COUNTER ────────────────────────────────────── */
const CounterManager = (() => {
  function animateNum(el, target, suffix = '') {
    const start = performance.now();
    const duration = 1800;
    const isDecimal = target % 1 !== 0;

    function step(now) {
      const p = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 4);
      const val = isDecimal ? (target * ease).toFixed(1) : Math.round(target * ease);
      el.textContent = val + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function init() {
    const nums = document.querySelectorAll('[data-count]');
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const target = parseFloat(e.target.dataset.count);
          const suffix = e.target.dataset.suffix || '';
          animateNum(e.target, target, suffix);
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.5 });

    nums.forEach(el => obs.observe(el));
  }

  return { init };
})();


/* ── CONTACT FORM ────────────────────────────────────────── */
const FormManager = (() => {
  function init() {
    const form = document.getElementById('contact-form');
    const btn = form?.querySelector('.form-submit');
    if (!form) return;

    form.addEventListener('submit', async e => {
      e.preventDefault();
      if (btn) { btn.textContent = 'Sending…'; btn.disabled = true; }

      // Wire to Formspree: replace YOUR_ID
      const data = new FormData(form);
      try {
        const res = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
          method: 'POST',
          body: data,
          headers: { 'Accept': 'application/json' },
        });
        if (res.ok) {
          if (btn) btn.textContent = 'Sent! ✓';
          form.reset();
        } else {
          throw new Error();
        }
      } catch {
        if (btn) { btn.textContent = 'Send Message →'; btn.disabled = false; }
        alert('Message could not be sent. Email me directly at iamjashuraj@gmail.com');
      }
    });
  }

  return { init };
})();


/* ── SMOOTH SCROLL ───────────────────────────────────────── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}


/* ── TYPING EFFECT ───────────────────────────────────────── */
function initTyping() {
  const el = document.getElementById('typing-text');
  if (!el) return;
  const words = ['Technical Support', 'Cybersecurity', 'Linux & Networking', 'Hardware Diagnostics', 'Problem Solving'];
  let wi = 0, ci = 0, deleting = false;

  function tick() {
    const word = words[wi];
    el.textContent = deleting ? word.substring(0, ci--) : word.substring(0, ci++);

    let delay = deleting ? 60 : 100;
    if (!deleting && ci > word.length) { delay = 1800; deleting = true; }
    else if (deleting && ci < 0) { ci = 0; wi = (wi + 1) % words.length; deleting = false; delay = 400; }

    setTimeout(tick, delay);
  }
  tick();
}


/* ── PRELOADER ───────────────────────────────────────────── */
function initPreloader() {
  const loader = document.getElementById('preloader');
  if (!loader) return;
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.style.opacity = '0';
      loader.style.pointerEvents = 'none';
      setTimeout(() => loader.remove(), 600);
    }, 600);
  });
}


/* ── INIT ────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  ThemeManager.init();
  CursorManager.init();
  NavManager.init();
  RevealManager.init();
  SkillManager.init();
  TiltManager.init();
  CounterManager.init();
  ParallaxManager.init();
  FormManager.init();
  initSmoothScroll();
  initTyping();
  initPreloader();

  // Three.js init — after scripts loaded
  if (typeof THREE !== 'undefined') {
    HeroCanvas.init();
  } else {
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    s.onload = () => HeroCanvas.init();
    document.head.appendChild(s);
  }
});
