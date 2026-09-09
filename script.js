/* ==========================================================================
   Jayanth M — Cloud & DevOps Portfolio interactions
   ========================================================================== */

(() => {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const root = document.documentElement;

  /* ---- Loader ---- */
  const loader = document.getElementById("loader");
  window.addEventListener("load", () => {
    if (!loader) return;
    setTimeout(() => {
      loader.classList.add("is-done");
      loader.setAttribute("aria-hidden", "true");
    }, prefersReducedMotion ? 0 : 450);
  });

  /* ---- Theme ---- */
  const themeToggle = document.getElementById("themeToggle");
  const storedTheme = localStorage.getItem("theme");
  root.setAttribute("data-theme", storedTheme || "dark");

  themeToggle?.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    drawDashboard();
  });

  /* ---- Year ---- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---- Mobile nav ---- */
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");
  const header = document.getElementById("header");

  const closeNav = () => {
    navMenu?.classList.remove("is-open");
    navToggle?.setAttribute("aria-expanded", "false");
  };

  navToggle?.addEventListener("click", () => {
    const open = navMenu?.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
  });

  navMenu?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeNav);
  });

  /* ---- Scroll UI ---- */
  const progress = document.getElementById("scrollProgress");
  const backTop = document.getElementById("backTop");

  const onScroll = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0;

    if (progress) {
      progress.style.width = `${pct}%`;
      progress.setAttribute("aria-valuenow", String(Math.round(pct)));
    }

    header?.classList.toggle("is-scrolled", scrollTop > 20);
    backTop?.classList.toggle("is-visible", scrollTop > 500);

    const sections = document.querySelectorAll("main section[id]");
    let current = "";
    sections.forEach((section) => {
      if (scrollTop >= section.offsetTop - 120) current = section.id;
    });
    document.querySelectorAll(".nav__link").forEach((link) => {
      const href = link.getAttribute("href") || "";
      link.classList.toggle("is-active", href === `#${current}`);
    });
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  backTop?.addEventListener("click", () => {
    smoothScrollTo(0);
  });

  /* ---- Premium smooth anchor scroll ---- */
  const easeInOutCubic = (t) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  const smoothScrollTo = (targetY, duration = 900) => {
    if (prefersReducedMotion) {
      window.scrollTo(0, targetY);
      return;
    }
    const startY = window.scrollY;
    const diff = targetY - startY;
    const start = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - start) / duration);
      window.scrollTo(0, startY + diff * easeInOutCubic(t));
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const id = anchor.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      smoothScrollTo(Math.max(0, top));
      closeNav();
    });
  });

  /* ---- Cursor glow + card spotlight ---- */
  const cursorGlow = document.getElementById("cursorGlow");
  const spotlightSelector =
    ".stat-card, .highlight-card, .skill-card, .project-card, .achieve-card, .timeline__card, .obs-card, .learning-card, .contact-item, .resume-panel";

  document.querySelectorAll(spotlightSelector).forEach((el) => {
    el.classList.add("spotlight");
  });

  if (!prefersReducedMotion && cursorGlow && window.matchMedia("(pointer: fine)").matches) {
    let glowX = 0;
    let glowY = 0;
    let viewX = 0;
    let viewY = 0;
    let ticking = false;

    const renderGlow = () => {
      viewX += (glowX - viewX) * 0.12;
      viewY += (glowY - viewY) * 0.12;
      cursorGlow.style.transform = `translate3d(${viewX}px, ${viewY}px, 0)`;
      ticking = false;
      if (Math.abs(glowX - viewX) > 0.3 || Math.abs(glowY - viewY) > 0.3) {
        ticking = true;
        requestAnimationFrame(renderGlow);
      }
    };

    window.addEventListener(
      "pointermove",
      (e) => {
        glowX = e.clientX;
        glowY = e.clientY;
        document.body.classList.add("is-pointer");
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(renderGlow);
        }
      },
      { passive: true }
    );

    window.addEventListener("pointerleave", () => {
      document.body.classList.remove("is-pointer");
    });

    document.querySelectorAll(".spotlight").forEach((card) => {
      card.addEventListener(
        "pointermove",
        (e) => {
          const rect = card.getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width) * 100;
          const y = ((e.clientY - rect.top) / rect.height) * 100;
          card.style.setProperty("--spot-x", `${x}%`);
          card.style.setProperty("--spot-y", `${y}%`);
        },
        { passive: true }
      );
    });
  }

  /* ---- Hero architecture parallax ---- */
  const heroArch = document.querySelector(".hero__arch");
  if (heroArch && !prefersReducedMotion) {
    window.addEventListener(
      "scroll",
      () => {
        const y = window.scrollY;
        if (y < window.innerHeight * 1.2) {
          heroArch.style.transform = `translate3d(0, ${y * 0.18}px, 0)`;
          heroArch.style.opacity = String(Math.max(0.08, 0.2 - y / 2500));
        }
      },
      { passive: true }
    );
  }

  /* ---- Typing ---- */
  const typingEl = document.getElementById("typingText");
  const phrases = [
    "AWS · Kubernetes · GitOps · Platform Engineering",
    "CI/CD · Infrastructure as Code · Cloud Security",
    "Observability · Automation · Enterprise Platforms",
    "Amazon EKS · ArgoCD · Jenkins · Terraform",
  ];

  if (typingEl && !prefersReducedMotion) {
    let phraseIndex = 0;
    let charIndex = 0;
    let deleting = false;

    const type = () => {
      const current = phrases[phraseIndex];
      typingEl.textContent = current.slice(0, charIndex);

      if (!deleting && charIndex < current.length) {
        charIndex += 1;
        setTimeout(type, 55);
      } else if (!deleting && charIndex === current.length) {
        deleting = true;
        setTimeout(type, 1600);
      } else if (deleting && charIndex > 0) {
        charIndex -= 1;
        setTimeout(type, 28);
      } else {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        setTimeout(type, 280);
      }
    };
    type();
  }

  /* ---- GSAP motion (ScrollTrigger + springs) ---- */
  const gsapReady = () =>
    typeof window.gsap !== "undefined" && typeof window.ScrollTrigger !== "undefined";

  const initMotion = () => {
    if (!gsapReady()) {
      /* Fallback: CSS / IntersectionObserver */
      const revealEls = document.querySelectorAll(".reveal");
      if ("IntersectionObserver" in window) {
        const revealObserver = new IntersectionObserver(
          (entries, obs) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) return;
              entry.target.classList.add("is-visible");
              obs.unobserve(entry.target);
            });
          },
          { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
        );
        revealEls.forEach((el) => revealObserver.observe(el));
      } else {
        revealEls.forEach((el) => el.classList.add("is-visible"));
      }

      const skillBars = document.querySelectorAll(".skill-bar");
      if ("IntersectionObserver" in window) {
        const skillObserver = new IntersectionObserver(
          (entries, obs) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) return;
              const bar = entry.target;
              bar.style.setProperty("--level", `${bar.getAttribute("data-level") || 80}%`);
              bar.classList.add("is-animated");
              obs.unobserve(bar);
            });
          },
          { threshold: 0.4 }
        );
        skillBars.forEach((bar) => skillObserver.observe(bar));
      }

      const counters = document.querySelectorAll("[data-count]");
      const formatCount = (value, decimals) =>
        decimals > 0 ? value.toFixed(decimals) : String(Math.round(value));
      const animateCount = (el) => {
        const target = Number(el.getAttribute("data-count")) || 0;
        const suffix = el.getAttribute("data-suffix") || "";
        const decimals = Number(el.getAttribute("data-decimals")) || 0;
        if (prefersReducedMotion) {
          el.textContent = `${formatCount(target, decimals)}${suffix}`;
          return;
        }
        const duration = 1400;
        const start = performance.now();
        const step = (now) => {
          const ratio = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - ratio, 3);
          el.textContent = `${formatCount(target * eased, decimals)}${suffix}`;
          if (ratio < 1) requestAnimationFrame(step);
          else el.textContent = `${formatCount(target, decimals)}${suffix}`;
        };
        requestAnimationFrame(step);
      };
      if ("IntersectionObserver" in window) {
        const countObserver = new IntersectionObserver(
          (entries, obs) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) return;
              animateCount(entry.target);
              obs.unobserve(entry.target);
            });
          },
          { threshold: 0.5 }
        );
        counters.forEach((el) => countObserver.observe(el));
      } else {
        counters.forEach(animateCount);
      }
      return;
    }

    const { gsap, ScrollTrigger } = window;
    gsap.registerPlugin(ScrollTrigger);

    /* Spring-like physics easing (overshoot = natural, not linear/robotic) */
    const spring = prefersReducedMotion ? "power1.out" : "back.out(1.2)";
    const soft = prefersReducedMotion ? "power1.out" : "expo.out";
    const dur = prefersReducedMotion ? 0.28 : 0.9;
    const yDist = prefersReducedMotion ? 0 : 36;

    /* Pre-hide hero children (no .reveal) before unlocking parent containers */
    const heroBits = gsap.utils.toArray(".hero__text > *:not(.stats), .hero__visual .hero__photo-wrap");
    if (heroBits.length) {
      gsap.set(heroBits, { opacity: 0, y: prefersReducedMotion ? 0 : 28 });
    }

    /* Staggered grids — set initial state before unlocking parents */
    const staggerSets = [
      { trigger: ".stats", items: ".stats .stat-card", stagger: 0.07 },
      { trigger: ".highlights", items: ".highlights__header, .highlight-card", stagger: 0.08 },
      { trigger: ".skills-grid", items: ".skill-card", stagger: 0.07 },
      { trigger: ".projects-grid", items: ".project-card", stagger: 0.08 },
      { trigger: ".achievements-grid", items: ".achieve-card", stagger: 0.07 },
      { trigger: ".timeline", items: ".timeline__item", stagger: 0.12 },
      { trigger: ".obs-grid", items: ".obs-card", stagger: 0.1 },
      { trigger: ".learning-grid", items: ".learning-card", stagger: 0.1 },
      { trigger: ".contact-info", items: ".contact-item", stagger: 0.08 },
      { trigger: ".stack-grid", items: ".stack-card", stagger: 0.05 },
    ];

    staggerSets.forEach(({ items }) => {
      const els = gsap.utils.toArray(items);
      if (els.length) gsap.set(els, { opacity: 0, y: yDist });
    });

    document.documentElement.classList.add("js-gsap");

    /* Skip cards/hero/parents handled by stagger or dedicated timelines */
    const skipSoloReveal =
      ".skill-card, .project-card, .achieve-card, .timeline__item, .stat-card, .highlight-card, .obs-card, .learning-card, .stack-card, .cert-card, .contact-item, .hero__text, .hero__visual, .stats, .highlights";

    /* Section / block reveals */
    gsap.utils.toArray(".reveal").forEach((el) => {
      if (el.matches(skipSoloReveal)) return;
      gsap.fromTo(
        el,
        { opacity: 0, y: yDist },
        {
          opacity: 1,
          y: 0,
          duration: dur,
          ease: soft,
          force3D: true,
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            toggleActions: "play none none none",
            once: true,
          },
          onComplete: () => el.classList.add("is-visible"),
        }
      );
    });

    staggerSets.forEach(({ trigger, items, stagger }) => {
      const rootEl = document.querySelector(trigger);
      const els = gsap.utils.toArray(items);
      if (!rootEl || !els.length) return;

      gsap.to(els, {
        opacity: 1,
        y: 0,
        duration: dur,
        ease: spring,
        force3D: true,
        stagger: prefersReducedMotion ? 0.02 : stagger,
        scrollTrigger: {
          trigger: rootEl,
          start: "top 85%",
          toggleActions: "play none none none",
          once: true,
        },
        onComplete: () => els.forEach((node) => node.classList.add("is-visible")),
      });
    });

    /* Hero entrance */
    if (heroBits.length) {
      gsap.to(heroBits, {
        opacity: 1,
        y: 0,
        duration: prefersReducedMotion ? 0.3 : 0.95,
        ease: spring,
        force3D: true,
        stagger: prefersReducedMotion ? 0.02 : 0.08,
        delay: prefersReducedMotion ? 0 : 0.12,
      });
    }

    /* Skill bars via scaleX (transform only) */
    document.querySelectorAll(".skill-bar").forEach((bar) => {
      const level = bar.getAttribute("data-level") || "80";
      bar.style.setProperty("--level", `${level}%`);
      const fill = bar.querySelector("span");
      if (!fill) return;
      gsap.fromTo(
        fill,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: prefersReducedMotion ? 0.3 : 1.1,
          ease: soft,
          transformOrigin: "left center",
          scrollTrigger: {
            trigger: bar,
            start: "top 90%",
            once: true,
          },
          onStart: () => bar.classList.add("is-animated"),
        }
      );
    });

    /* Stat counters */
    document.querySelectorAll("[data-count]").forEach((el) => {
      const target = Number(el.getAttribute("data-count")) || 0;
      const suffix = el.getAttribute("data-suffix") || "";
      const decimals = Number(el.getAttribute("data-decimals")) || 0;
      const state = { val: 0 };

      const formatCount = (value) =>
        decimals > 0 ? value.toFixed(decimals) : String(Math.round(value));

      ScrollTrigger.create({
        trigger: el,
        start: "top 90%",
        once: true,
        onEnter: () => {
          if (prefersReducedMotion) {
            el.textContent = `${formatCount(target)}${suffix}`;
            return;
          }
          gsap.to(state, {
            val: target,
            duration: 1.6,
            ease: "power2.out",
            onUpdate: () => {
              el.textContent = `${formatCount(state.val)}${suffix}`;
            },
            onComplete: () => {
              el.textContent = `${formatCount(target)}${suffix}`;
            },
          });
        },
      });
    });

    /* Contact form + resume + about + pipeline + edu */
    [".contact-form", ".resume-panel", ".edu-card", ".pipeline", ".about", ".obs-flow"].forEach((sel) => {
      const el = document.querySelector(sel);
      if (!el) return;
      if (el.classList.contains("reveal")) return; /* already covered by .reveal pass */
      gsap.fromTo(
        el,
        { opacity: 0, y: yDist },
        {
          opacity: 1,
          y: 0,
          duration: dur,
          ease: soft,
          force3D: true,
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            once: true,
          },
        }
      );
    });
  };

  if (gsapReady()) {
    initMotion();
  } else {
    /* GSAP scripts deferred — wait briefly if this file raced ahead */
    let tries = 0;
    const waitGsap = () => {
      tries += 1;
      if (gsapReady()) {
        initMotion();
      } else if (tries < 40) {
        setTimeout(waitGsap, 50);
      } else {
        initMotion();
      }
    };
    waitGsap();
  }

  /* ---- Resume modal ---- */
  const modal = document.getElementById("resumeModal");
  let lastFocus = null;

  const openModal = () => {
    if (!modal) return;
    lastFocus = document.activeElement;
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    modal.querySelector(".modal__close")?.focus();
  };

  const closeModal = () => {
    if (!modal) return;
    modal.hidden = true;
    document.body.style.overflow = "";
    if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
  };

  ["viewResumeBtn", "viewResumeBtn2"].forEach((id) => {
    document.getElementById(id)?.addEventListener("click", openModal);
  });

  modal?.querySelectorAll("[data-close-modal]").forEach((el) => {
    el.addEventListener("click", closeModal);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal && !modal.hidden) closeModal();
  });

  /* ---- Contact form → email client ---- */
  const form = document.getElementById("contactForm");
  const feedback = document.getElementById("formFeedback");
  const CONTACT_EMAIL = "jaygowda82@gmail.com";

  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const name = String(new FormData(form).get("name") || "").trim();
    const email = String(new FormData(form).get("email") || "").trim();
    const message = String(new FormData(form).get("message") || "").trim();

    const subject = encodeURIComponent(`Portfolio inquiry from ${name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    );

    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;

    if (feedback) {
      feedback.hidden = false;
      feedback.textContent =
        "Opening your email app to send the message. If nothing opens, email jaygowda82@gmail.com directly.";
    }
  });

  /* ---- Observability dashboard canvas ---- */
  const canvas = document.getElementById("dashCanvas");
  let dashPoints = [];

  const seedDash = () => {
    dashPoints = Array.from({ length: 36 }, (_, i) => ({
      x: i,
      y: 40 + Math.sin(i / 3.2) * 18 + Math.random() * 10,
    }));
  };

  const drawDashboard = () => {
    if (!canvas || !canvas.getContext) return;
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cssW = canvas.clientWidth || 640;
    const cssH = 140;
    canvas.width = cssW * dpr;
    canvas.height = cssH * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, cssW, cssH);

    const isLight = root.getAttribute("data-theme") === "light";
    ctx.strokeStyle = isLight ? "rgba(15,23,42,0.08)" : "rgba(148,163,184,0.12)";
    ctx.lineWidth = 1;
    for (let i = 1; i < 4; i += 1) {
      const y = (cssH / 4) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(cssW, y);
      ctx.stroke();
    }

    if (!dashPoints.length) seedDash();
    const maxX = dashPoints.length - 1;
    const mapX = (x) => (x / maxX) * cssW;
    const mapY = (y) => cssH - y;

    const gradient = ctx.createLinearGradient(0, 0, cssW, 0);
    gradient.addColorStop(0, "#326ce5");
    gradient.addColorStop(0.7, "#60a5fa");
    gradient.addColorStop(1, "#f6821f");

    ctx.beginPath();
    dashPoints.forEach((p, i) => {
      const x = mapX(p.x);
      const y = mapY(p.y);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.lineTo(cssW, cssH);
    ctx.lineTo(0, cssH);
    ctx.closePath();
    const fill = ctx.createLinearGradient(0, 0, 0, cssH);
    fill.addColorStop(0, "rgba(50,108,229,0.28)");
    fill.addColorStop(1, "rgba(50,108,229,0)");
    ctx.fillStyle = fill;
    ctx.fill();
  };

  seedDash();
  drawDashboard();

  if (!prefersReducedMotion) {
    setInterval(() => {
      dashPoints.push({
        x: dashPoints.length ? dashPoints[dashPoints.length - 1].x + 1 : 0,
        y: 42 + Math.sin(Date.now() / 700) * 16 + Math.random() * 8,
      });
      if (dashPoints.length > 36) {
        dashPoints.shift();
        dashPoints = dashPoints.map((p, i) => ({ x: i, y: p.y }));
      }
      drawDashboard();
    }, 900);
  }

  window.addEventListener("resize", drawDashboard);

  /* ---- Subtle live metric jitter (visual only) ---- */
  if (!prefersReducedMotion) {
    const liveNodes = document.querySelectorAll("[data-live]");
    setInterval(() => {
      liveNodes.forEach((node) => {
        const base = Number(node.getAttribute("data-live"));
        if (Number.isNaN(base)) return;
        if (base < 1) {
          const next = Math.max(0.05, Math.min(0.45, base + (Math.random() - 0.5) * 0.08));
          node.textContent = `${next.toFixed(2)}%`;
          return;
        }
        const next = Math.round(Math.max(base - 3, Math.min(base + 3, base + (Math.random() - 0.5) * 4)));
        node.textContent = `${next}%`;
      });
    }, 2200);
  }
})();
