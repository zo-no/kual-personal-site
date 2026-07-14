(() => {
  const initializeSiteEffects = () => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (reduceMotion.matches || !("IntersectionObserver" in window)) {
    const status = document.querySelector("[data-filter-status]");
    const value = document.querySelector("[data-filter-value]");
    const hint = document.querySelector("[data-filter-hint]");
    const toggle = document.querySelector("[data-filter-toggle]");
    if (status) status.textContent = "SIGNAL";
    if (value) value.textContent = "/ FOUND";
    if (hint) hint.textContent = "STATIC SIGNAL";
    if (toggle) {
      toggle.setAttribute("aria-pressed", "true");
      toggle.disabled = true;
    }
    return;
  }

  const root = document.documentElement;
  root.classList.add("io-enabled");

  const routeLinks = Array.from(document.querySelectorAll(".site-header [data-route]"));
  const currentPath = window.location.pathname.replace(/\/+$/, "");

  routeLinks.forEach((link) => {
    const route = link.dataset.route;
    const isCurrent = route === "blog"
      ? /\/blog(?:\/|$)/.test(currentPath)
      : currentPath.endsWith(`/${route}`);
    link.classList.toggle("is-current", isCurrent);
    if (isCurrent) link.setAttribute("aria-current", "page");
  });

  const readingProgress = document.querySelector("[data-reading-progress]");
  const articlePage = document.querySelector(".article-page");

  if (readingProgress && articlePage) {
    let readingFrame = 0;
    const updateReadingProgress = () => {
      readingFrame = 0;
      const start = articlePage.offsetTop;
      const distance = Math.max(1, articlePage.offsetHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, (window.scrollY - start) / distance));
      readingProgress.style.setProperty("--reading-progress", String(progress));
    };
    const queueReadingProgress = () => {
      if (readingFrame) return;
      readingFrame = window.requestAnimationFrame(updateReadingProgress);
    };
    updateReadingProgress();
    window.addEventListener("scroll", queueReadingProgress, { passive: true });
    window.addEventListener("resize", queueReadingProgress);
  }

  const revealSelectors = [
    ".section-kicker",
    ".about-copy",
    ".practice-list li",
    ".article-card",
    ".exploration-item",
    ".profile-label",
    ".profile-copy",
    ".value-list article",
    ".now-grid > *",
    ".blog-index-head",
    ".blog-note > *",
    ".article-summary",
    ".article-byline",
    ".prose > h2",
    ".prose > h3",
    ".prose > blockquote",
    ".more-writing > *",
    ".page-cta > *",
  ];

  const depthSelectors = [
    ".about-statement",
    ".practice-heading",
    ".writing-heading",
    ".exploring-heading",
    ".page-hero h1",
    ".article-hero h1",
  ];

  const revealElements = document.querySelectorAll(revealSelectors.join(","));
  const depthElements = document.querySelectorAll(depthSelectors.join(","));

  revealElements.forEach((element) => element.setAttribute("data-reveal", ""));
  depthElements.forEach((element) => element.setAttribute("data-depth", ""));

  const staggerGroups = document.querySelectorAll(
    ".practice-list, .article-grid, .exploration-list, .value-list",
  );

  staggerGroups.forEach((group) => {
    group.querySelectorAll(":scope > [data-reveal]").forEach((element, index) => {
      element.style.setProperty("--reveal-delay", `${Math.min(index * 90, 270)}ms`);
    });
  });

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { root: null, rootMargin: "0px 0px -8% 0px", threshold: 0.14 },
  );

  revealElements.forEach((element) => revealObserver.observe(element));

  const ratioThresholds = Array.from({ length: 11 }, (_, index) => index / 10);
  const depthObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          if (entry.boundingClientRect.top < 0) {
            entry.target.style.setProperty("--io-opacity", "1");
            entry.target.style.setProperty("--io-shift", "0px");
            entry.target.style.setProperty("--io-blur", "0px");
          }
          return;
        }

        const progress = Math.min(1, entry.intersectionRatio * 1.7);
        entry.target.style.setProperty("--io-opacity", String(0.4 + progress * 0.6));
        entry.target.style.setProperty("--io-shift", `${(1 - progress) * 30}px`);
        entry.target.style.setProperty("--io-blur", `${(1 - progress) * 5}px`);
      });
    },
    { root: null, threshold: ratioThresholds },
  );

  depthElements.forEach((element) => depthObserver.observe(element));

  const motionSurfaces = document.querySelectorAll(
    ".signal-field, .practice, .blog-page-hero, .value-section, .more-writing",
  );

  const motionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle("motion-active", entry.isIntersecting);
      });
    },
    { root: null, rootMargin: "120px 0px", threshold: 0 },
  );

  motionSurfaces.forEach((surface) => motionObserver.observe(surface));

  const sectionLinks = Array.from(document.querySelectorAll("[data-section-link]"));
  const homeSections = sectionLinks
    .map((link) => document.getElementById(link.dataset.sectionLink))
    .filter(Boolean);

  if (sectionLinks.length && homeSections.length) {
    const sectionVisibility = new Map(homeSections.map((section) => [section.id, 0]));
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          sectionVisibility.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
        });

        const activeSection = Array.from(sectionVisibility.entries())
          .sort((left, right) => right[1] - left[1])[0];
        if (!activeSection || activeSection[1] === 0) return;

        sectionLinks.forEach((link) => {
          const active = link.dataset.sectionLink === activeSection[0];
          link.classList.toggle("is-active", active);
          if (active) link.setAttribute("aria-current", "location");
          else link.removeAttribute("aria-current");
        });
      },
      { root: null, rootMargin: "-18% 0px -32% 0px", threshold: [0, 0.2, 0.4, 0.6, 0.8] },
    );

    homeSections.forEach((section) => sectionObserver.observe(section));
  }

  const signalField = document.querySelector(".signal-field");
  const signalCanvas = signalField?.querySelector("[data-signal-canvas]");
  const filterToggle = signalField?.querySelector("[data-filter-toggle]");
  const filterStatus = signalField?.querySelector("[data-filter-status]");
  const filterValue = signalField?.querySelector("[data-filter-value]");
  const filterHint = signalField?.querySelector("[data-filter-hint]");
  const fieldCaption = signalField?.querySelector("[data-field-caption]");
  const signalNodes = signalField
    ? Array.from(signalField.querySelectorAll("[data-signal-node]"))
    : [];

  if (signalField && signalCanvas && filterToggle) {
    const context = signalCanvas.getContext("2d");

    if (context) {
      root.classList.add("signal-canvas-enabled");

      const hero = signalField.closest(".hero");
      const accent = [240, 74, 36];
      const paper = [247, 243, 233];
      const pointer = { x: 0, active: false };
      const nodePositions = { product: 0.12, ai: 0.36, system: 0.63, writing: 0.88 };
      let width = 0;
      let height = 0;
      let pixelRatio = 1;
      let curvePoints = [];
      let noisePoints = [];
      let filterProgress = 0;
      let filterTarget = 0;
      let manualTarget = null;
      let activeNode = null;
      let visible = false;
      let frameId = 0;
      let previousTime = 0;
      let lastPercent = -1;
      let scrollQueued = false;

      const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
      const mix = (start, end, amount) => start + (end - start) * amount;
      const smooth = (value) => {
        const amount = clamp(value);
        return amount * amount * (3 - 2 * amount);
      };
      const seeded = (seed) => {
        const value = Math.sin(seed * 91.733 + 17.13) * 43758.5453;
        return value - Math.floor(value);
      };

      const cleanRatioAt = (t) => (
        0.82
        - Math.pow(t, 0.88) * 0.66
        + Math.sin(t * Math.PI * 3.2) * 0.025
        + Math.sin(t * Math.PI * 8.6) * 0.009
      );

      const buildCurve = () => {
        const left = 22;
        const right = width - 18;
        const top = 58;
        const bottom = height - 76;
        const plotHeight = bottom - top;
        const count = width < 560 ? 84 : 132;

        curvePoints = Array.from({ length: count }, (_, index) => {
          const t = index / (count - 1);
          const cleanY = top + cleanRatioAt(t) * plotHeight;
          const pulse = Math.sin(index * 1.91) * 10 + Math.sin(index * 0.47) * 7;
          const spike = index % 17 === 0
            ? (seeded(index + 4) - 0.5) * 72
            : index % 29 === 0
              ? (seeded(index + 9) - 0.5) * 94
              : 0;
          return {
            t,
            x: mix(left, right, t),
            cleanY,
            rawY: cleanY + pulse + spike,
          };
        });

        const dotCount = width < 560 ? 54 : 92;
        noisePoints = Array.from({ length: dotCount }, (_, index) => {
          const t = seeded(index + 33);
          const cleanY = top + cleanRatioAt(t) * plotHeight;
          return {
            x: mix(left, right, t),
            y: cleanY + (seeded(index + 71) - 0.5) * (45 + seeded(index + 12) * 90),
            size: 0.7 + seeded(index + 20) * 1.7,
            opacity: 0.16 + seeded(index + 45) * 0.45,
          };
        });
      };

      const resizeCanvas = () => {
        const rect = signalField.getBoundingClientRect();
        width = Math.max(1, rect.width);
        height = Math.max(1, rect.height);
        pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
        signalCanvas.width = Math.round(width * pixelRatio);
        signalCanvas.height = Math.round(height * pixelRatio);
        signalCanvas.style.width = `${width}px`;
        signalCanvas.style.height = `${height}px`;
        context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        buildCurve();
      };

      const filterAmountAt = (x) => {
        const halfWidth = mix(width * 0.015, width * 0.43, smooth(filterProgress));
        const feather = Math.max(24, width * 0.055);
        return smooth((halfWidth - Math.abs(x - width / 2)) / feather) * filterProgress;
      };

      const curveYAt = (t) => {
        const index = Math.round(clamp(t) * (curvePoints.length - 1));
        const point = curvePoints[index];
        return mix(point.rawY, point.cleanY, filterAmountAt(point.x));
      };

      const updateScrollTarget = () => {
        if (manualTarget !== null) {
          filterTarget = manualTarget;
          return;
        }

        if (window.innerWidth > 1100 && hero) {
          const stickyTop = Number.parseFloat(window.getComputedStyle(signalField).top) || 0;
          const range = Math.max(1, hero.offsetHeight - signalField.offsetHeight - stickyTop);
          filterTarget = clamp((window.scrollY - hero.offsetTop) / range);
        } else {
          const rect = signalField.getBoundingClientRect();
          filterTarget = clamp((window.innerHeight * 0.78 - rect.top) / (window.innerHeight * 0.52));
        }
      };

      const updateStatus = () => {
        const percent = Math.round(filterProgress * 100);
        if (percent === lastPercent) return;
        lastPercent = percent;

        if (filterProgress < 0.025) {
          filterStatus.textContent = "NOISE";
          filterValue.textContent = "/ 00";
          if (filterHint) filterHint.textContent = "SCROLL TO FILTER";
          filterToggle.setAttribute("aria-label", "向下滚动或点击过滤曲线噪声");
        } else if (filterProgress < 0.985) {
          filterStatus.textContent = "FILTERING";
          filterValue.textContent = `/ ${String(percent).padStart(2, "0")}`;
          if (filterHint) filterHint.textContent = "REMOVING MID NOISE";
          filterToggle.setAttribute("aria-label", `曲线噪声过滤进度 ${percent}%`);
        } else {
          filterStatus.textContent = "SIGNAL";
          filterValue.textContent = "/ FOUND";
          if (filterHint) filterHint.textContent = "SCROLL UP TO RESTORE";
          filterToggle.setAttribute("aria-label", "恢复原始噪声曲线");
        }

        const filtered = filterProgress > 0.82;
        signalField.classList.toggle("is-filtered", filtered);
        filterToggle.setAttribute("aria-pressed", String(filterTarget > 0.5));
      };

      const drawFilterWindow = () => {
        if (filterProgress < 0.015) return;
        const halfWidth = mix(width * 0.015, width * 0.43, smooth(filterProgress));
        const left = width / 2 - halfWidth;
        const right = width / 2 + halfWidth;
        const shade = context.createLinearGradient(left, 0, right, 0);
        shade.addColorStop(0, "rgba(240, 74, 36, 0)");
        shade.addColorStop(0.5, `rgba(240, 74, 36, ${0.025 + filterProgress * 0.025})`);
        shade.addColorStop(1, "rgba(240, 74, 36, 0)");
        context.fillStyle = shade;
        context.fillRect(left, 40, right - left, height - 92);
        context.strokeStyle = `rgba(240, 74, 36, ${0.18 + filterProgress * 0.34})`;
        context.lineWidth = 0.7;
        [left, right].forEach((x) => {
          context.beginPath();
          context.moveTo(x, 48);
          context.lineTo(x, height - 54);
          context.stroke();
        });
      };

      const drawNoisePoints = () => {
        noisePoints.forEach((point) => {
          const filtered = filterAmountAt(point.x);
          const opacity = point.opacity * (1 - filtered * 0.96);
          if (opacity < 0.012) return;
          context.fillStyle = `rgba(${paper.join(", ")}, ${opacity})`;
          context.beginPath();
          context.arc(point.x, point.y, point.size * (1 - filtered * 0.55), 0, Math.PI * 2);
          context.fill();
        });
      };

      const drawCurve = () => {
        context.strokeStyle = "rgba(247, 243, 233, 0.5)";
        context.lineWidth = 1;
        context.beginPath();
        curvePoints.forEach((point, index) => {
          const y = mix(point.rawY, point.cleanY, filterAmountAt(point.x));
          if (index === 0) context.moveTo(point.x, y);
          else context.lineTo(point.x, y);
        });
        context.stroke();

        if (filterProgress < 0.015) return;
        const halfWidth = mix(width * 0.015, width * 0.43, smooth(filterProgress));
        context.save();
        context.beginPath();
        context.rect(width / 2 - halfWidth, 0, halfWidth * 2, height);
        context.clip();
        context.strokeStyle = `rgba(${accent.join(", ")}, ${0.35 + filterProgress * 0.65})`;
        context.lineWidth = 1.7;
        context.beginPath();
        curvePoints.forEach((point, index) => {
          if (index === 0) context.moveTo(point.x, point.cleanY);
          else context.lineTo(point.x, point.cleanY);
        });
        context.stroke();
        context.restore();
      };

      const drawFocus = () => {
        const focusKey = activeNode && nodePositions[activeNode] !== undefined
          ? activeNode
          : pointer.active
            ? "pointer"
            : null;
        if (!focusKey) return;
        const t = focusKey === "pointer"
          ? clamp(pointer.x / width)
          : nodePositions[focusKey];
        const x = t * width;
        const y = curveYAt(t);
        context.strokeStyle = "rgba(247, 243, 233, 0.16)";
        context.lineWidth = 0.7;
        context.beginPath();
        context.moveTo(x, 44);
        context.lineTo(x, height - 52);
        context.stroke();
        context.fillStyle = `rgba(${accent.join(", ")}, 0.95)`;
        context.beginPath();
        context.arc(x, y, 3.2, 0, Math.PI * 2);
        context.fill();
      };

      const draw = (timestamp) => {
        frameId = 0;
        if (!visible || document.hidden) return;
        const delta = previousTime ? Math.min(40, timestamp - previousTime) : 16;
        previousTime = timestamp;
        const easing = Math.min(1, delta * 0.009);
        filterProgress = mix(filterProgress, filterTarget, easing);
        if (Math.abs(filterProgress - filterTarget) < 0.001) filterProgress = filterTarget;

        context.clearRect(0, 0, width, height);
        drawFilterWindow();
        drawNoisePoints();
        drawCurve();
        drawFocus();
        updateStatus();
        frameId = window.requestAnimationFrame(draw);
      };

      const startDrawing = () => {
        if (!frameId && visible && !document.hidden) {
          previousTime = 0;
          frameId = window.requestAnimationFrame(draw);
        }
      };

      const queueScrollUpdate = () => {
        if (scrollQueued) return;
        scrollQueued = true;
        window.requestAnimationFrame(() => {
          scrollQueued = false;
          manualTarget = null;
          updateScrollTarget();
          startDrawing();
        });
      };

      signalField.addEventListener("pointermove", (event) => {
        const rect = signalField.getBoundingClientRect();
        pointer.x = event.clientX - rect.left;
        pointer.active = true;
      });

      signalField.addEventListener("pointerleave", () => {
        pointer.active = false;
      });

      filterToggle.addEventListener("click", (event) => {
        event.stopPropagation();
        manualTarget = filterTarget > 0.5 ? 0 : 1;
        filterTarget = manualTarget;
        startDrawing();
      });

      signalNodes.forEach((node) => {
        const activate = () => {
          activeNode = node.dataset.signalNode;
          signalField.classList.add("has-active-node");
          signalNodes.forEach((item) => item.classList.toggle("is-active", item === node));
          if (fieldCaption) fieldCaption.textContent = node.dataset.signalCopy;
        };
        const deactivate = () => {
          activeNode = null;
          signalField.classList.remove("has-active-node");
          signalNodes.forEach((item) => item.classList.remove("is-active"));
          if (fieldCaption) fieldCaption.textContent = "RAW CURVE → FILTER WINDOW → SIGNAL";
        };
        node.addEventListener("pointerenter", activate);
        node.addEventListener("pointerleave", deactivate);
        node.addEventListener("focus", activate);
        node.addEventListener("blur", deactivate);
      });

      const canvasObserver = new IntersectionObserver(
        ([entry]) => {
          visible = entry.isIntersecting;
          if (visible) {
            updateScrollTarget();
            startDrawing();
          } else if (frameId) {
            window.cancelAnimationFrame(frameId);
            frameId = 0;
          }
        },
        { root: null, rootMargin: "100px 0px", threshold: 0 },
      );

      resizeCanvas();
      updateScrollTarget();
      canvasObserver.observe(signalField);
      window.addEventListener("scroll", queueScrollUpdate, { passive: true });

      if ("ResizeObserver" in window) {
        const resizeObserver = new ResizeObserver(() => {
          resizeCanvas();
          updateScrollTarget();
        });
        resizeObserver.observe(signalField);
      } else {
        window.addEventListener("resize", resizeCanvas);
      }
    }
  }

  document.addEventListener("visibilitychange", () => {
    root.classList.toggle("page-hidden", document.hidden);
  });
  };

  const scheduleInitialization = () => {
    window.setTimeout(initializeSiteEffects, 120);
  };

  if (document.readyState === "complete") {
    scheduleInitialization();
  } else {
    window.addEventListener("load", scheduleInitialization, { once: true });
  }
})();
