(() => {
  const initializeSiteEffects = () => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (reduceMotion.matches || !("IntersectionObserver" in window)) {
    const status = document.querySelector("[data-filter-status]");
    const value = document.querySelector("[data-filter-value]");
    const toggle = document.querySelector("[data-filter-toggle]");
    if (status) status.textContent = "SIGNAL";
    if (value) value.textContent = "/ FOUND";
    if (toggle) {
      toggle.setAttribute("aria-pressed", "true");
      toggle.disabled = true;
    }
    return;
  }

  const root = document.documentElement;
  root.classList.add("io-enabled");

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

      const accent = [240, 74, 36];
      const paper = [247, 243, 233];
      const pointer = { x: 0, y: 0, active: false };
      let width = 0;
      let height = 0;
      let ratio = 1;
      let particles = [];
      let anchors = {};
      let filterProgress = 0;
      let filterTarget = 0;
      let activeNode = null;
      let visible = false;
      let frameId = 0;
      let previousTime = 0;
      let autoPlayed = false;
      let lastPercent = -1;

      const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
      const mix = (start, end, amount) => start + (end - start) * amount;
      const smooth = (value) => {
        const amount = clamp(value);
        return amount * amount * (3 - 2 * amount);
      };

      const refreshAnchors = () => {
        const fieldRect = signalField.getBoundingClientRect();
        const centerRect = filterToggle.getBoundingClientRect();
        anchors = {
          center: {
            x: centerRect.left - fieldRect.left + centerRect.width / 2,
            y: centerRect.top - fieldRect.top + centerRect.height / 2,
          },
        };

        signalNodes.forEach((node) => {
          const nodeRect = node.getBoundingClientRect();
          anchors[node.dataset.signalNode] = {
            x: nodeRect.left - fieldRect.left + nodeRect.width / 2,
            y: nodeRect.top - fieldRect.top + nodeRect.height / 2,
          };
        });
      };

      const createParticles = () => {
        const count = width < 560 ? 82 : 132;
        const routeKeys = signalNodes.map((node) => node.dataset.signalNode);
        particles = Array.from({ length: count }, (_, index) => {
          const isSignal = index % 4 === 0 || index % 11 === 0;
          return {
            x: Math.random() * width,
            y: Math.random() * height,
            size: 0.7 + Math.random() * 1.8,
            opacity: 0.12 + Math.random() * 0.42,
            phase: Math.random() * Math.PI * 2,
            speed: 0.35 + Math.random() * 0.75,
            drift: 8 + Math.random() * 24,
            signal: isSignal,
            route: routeKeys[index % Math.max(1, routeKeys.length)],
            routePosition: 0.2 + Math.random() * 0.68,
            routeOffset: (Math.random() - 0.5) * 9,
          };
        });
      };

      const resizeCanvas = () => {
        const rect = signalField.getBoundingClientRect();
        width = Math.max(1, rect.width);
        height = Math.max(1, rect.height);
        ratio = Math.min(window.devicePixelRatio || 1, 2);
        signalCanvas.width = Math.round(width * ratio);
        signalCanvas.height = Math.round(height * ratio);
        signalCanvas.style.width = `${width}px`;
        signalCanvas.style.height = `${height}px`;
        context.setTransform(ratio, 0, 0, ratio, 0, 0);
        refreshAnchors();
        createParticles();
      };

      const updateStatus = () => {
        const percent = Math.round(filterProgress * 100);
        if (percent === lastPercent) return;
        lastPercent = percent;

        if (filterProgress < 0.025) {
          filterStatus.textContent = "NOISE";
          filterValue.textContent = "/ 00";
          if (filterHint) filterHint.textContent = "CLICK TO FILTER";
          filterToggle.setAttribute("aria-label", "过滤噪声并显示信号");
        } else if (filterProgress < 0.985) {
          filterStatus.textContent = "FILTERING";
          filterValue.textContent = `/ ${String(percent).padStart(2, "0")}`;
          if (filterHint) filterHint.textContent = "EXTRACTING SIGNAL";
          filterToggle.setAttribute("aria-label", `正在过滤噪声，进度 ${percent}%`);
        } else {
          filterStatus.textContent = "SIGNAL";
          filterValue.textContent = "/ FOUND";
          if (filterHint) filterHint.textContent = "CLICK TO RESET";
          filterToggle.setAttribute("aria-label", "恢复原始噪声");
        }

        const filtered = filterProgress > 0.82;
        signalField.classList.toggle("is-filtered", filtered);
        filterToggle.setAttribute("aria-pressed", String(filterTarget > 0.5));
      };

      const drawScanLine = () => {
        if (filterProgress <= 0.015 || filterProgress >= 0.995) return;
        const x = filterProgress * width;
        const glow = context.createLinearGradient(x - 54, 0, x + 18, 0);
        glow.addColorStop(0, "rgba(240, 74, 36, 0)");
        glow.addColorStop(0.75, "rgba(240, 74, 36, 0.16)");
        glow.addColorStop(1, "rgba(240, 74, 36, 0)");
        context.fillStyle = glow;
        context.fillRect(x - 54, 0, 72, height);
        context.strokeStyle = "rgba(240, 74, 36, 0.58)";
        context.lineWidth = 1;
        context.beginPath();
        context.moveTo(x + 0.5, 26);
        context.lineTo(x + 0.5, height - 26);
        context.stroke();
      };

      const drawConnections = () => {
        if (filterProgress < 0.22 || !anchors.center) return;
        const alphaBase = smooth((filterProgress - 0.22) / 0.68);

        signalNodes.forEach((node) => {
          const key = node.dataset.signalNode;
          const end = anchors[key];
          if (!end) return;
          const selected = !activeNode || activeNode === key;
          const alpha = alphaBase * (selected ? 0.38 : 0.055);
          context.strokeStyle = `rgba(${accent.join(", ")}, ${alpha})`;
          context.lineWidth = selected && activeNode ? 1.5 : 0.8;
          context.beginPath();
          context.moveTo(anchors.center.x, anchors.center.y);
          context.lineTo(end.x, end.y);
          context.stroke();
        });
      };

      const drawParticles = (time) => {
        const scanPosition = filterProgress * width;

        particles.forEach((particle) => {
          const waveX = Math.sin(time * particle.speed + particle.phase) * particle.drift;
          const waveY = Math.cos(time * particle.speed * 0.77 + particle.phase) * particle.drift * 0.46;
          let noiseX = particle.x + waveX;
          let noiseY = particle.y + waveY;

          if (pointer.active) {
            const dx = noiseX - pointer.x;
            const dy = noiseY - pointer.y;
            const distance = Math.hypot(dx, dy);
            const radius = width < 560 ? 92 : 130;
            if (distance > 0 && distance < radius) {
              const force = (1 - distance / radius) * 34;
              noiseX += (dx / distance) * force;
              noiseY += (dy / distance) * force;
            }
          }

          const localFilter = smooth(
            (scanPosition - particle.x + width * 0.06) / Math.max(80, width * 0.18),
          );
          let x = noiseX;
          let y = noiseY;
          let opacity = particle.opacity * (1 - localFilter);
          let size = particle.size * (1 - localFilter * 0.7);
          let color = paper;

          if (particle.signal && anchors.center && anchors[particle.route]) {
            const destination = anchors[particle.route];
            const routeX = mix(anchors.center.x, destination.x, particle.routePosition);
            const routeY = mix(anchors.center.y, destination.y, particle.routePosition);
            const angle = Math.atan2(destination.y - anchors.center.y, destination.x - anchors.center.x);
            const offsetX = Math.cos(angle + Math.PI / 2) * particle.routeOffset;
            const offsetY = Math.sin(angle + Math.PI / 2) * particle.routeOffset;
            x = mix(noiseX, routeX + offsetX, localFilter);
            y = mix(noiseY, routeY + offsetY, localFilter);
            const selected = !activeNode || activeNode === particle.route;
            opacity = mix(particle.opacity, selected ? 0.82 : 0.1, localFilter);
            size = mix(particle.size, selected ? particle.size * 1.15 : particle.size * 0.6, localFilter);
            color = [
              Math.round(mix(paper[0], accent[0], localFilter)),
              Math.round(mix(paper[1], accent[1], localFilter)),
              Math.round(mix(paper[2], accent[2], localFilter)),
            ];
          }

          if (opacity < 0.012 || size < 0.2) return;
          context.fillStyle = `rgba(${color.join(", ")}, ${opacity})`;
          context.beginPath();
          context.arc(x, y, size, 0, Math.PI * 2);
          context.fill();
        });
      };

      const draw = (timestamp) => {
        frameId = 0;
        if (!visible || document.hidden) return;

        const delta = previousTime ? Math.min(40, timestamp - previousTime) : 16;
        previousTime = timestamp;
        const direction = filterTarget > filterProgress ? 1 : -1;
        if (Math.abs(filterTarget - filterProgress) > 0.001) {
          filterProgress = clamp(filterProgress + direction * delta * (direction > 0 ? 0.00062 : 0.0009));
        } else {
          filterProgress = filterTarget;
        }

        context.clearRect(0, 0, width, height);
        drawConnections();
        drawParticles(timestamp / 1000);
        drawScanLine();
        updateStatus();
        frameId = window.requestAnimationFrame(draw);
      };

      const startDrawing = () => {
        if (!frameId && visible && !document.hidden) {
          previousTime = 0;
          frameId = window.requestAnimationFrame(draw);
        }
      };

      const setFilterTarget = (nextTarget) => {
        filterTarget = nextTarget;
        startDrawing();
      };

      signalField.addEventListener("pointerenter", () => {
        setFilterTarget(1);
      });

      signalField.addEventListener("pointermove", (event) => {
        const rect = signalField.getBoundingClientRect();
        pointer.x = event.clientX - rect.left;
        pointer.y = event.clientY - rect.top;
        pointer.active = true;
      });

      signalField.addEventListener("pointerleave", () => {
        pointer.active = false;
      });

      filterToggle.addEventListener("click", (event) => {
        event.stopPropagation();
        setFilterTarget(filterTarget > 0.5 ? 0 : 1);
      });

      signalNodes.forEach((node) => {
        const activate = () => {
          activeNode = node.dataset.signalNode;
          signalField.classList.add("has-active-node");
          signalNodes.forEach((item) => item.classList.toggle("is-active", item === node));
          if (fieldCaption) fieldCaption.textContent = node.dataset.signalCopy;
          setFilterTarget(1);
        };
        const deactivate = () => {
          activeNode = null;
          signalField.classList.remove("has-active-node");
          signalNodes.forEach((item) => item.classList.remove("is-active"));
          if (fieldCaption) fieldCaption.textContent = "OBSERVE → FILTER → CONNECT → BUILD";
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
            refreshAnchors();
            startDrawing();
            if (!autoPlayed) {
              autoPlayed = true;
              window.setTimeout(() => setFilterTarget(1), 520);
            }
          } else if (frameId) {
            window.cancelAnimationFrame(frameId);
            frameId = 0;
          }
        },
        { root: null, rootMargin: "100px 0px", threshold: 0 },
      );

      resizeCanvas();
      canvasObserver.observe(signalField);

      if ("ResizeObserver" in window) {
        const resizeObserver = new ResizeObserver(resizeCanvas);
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
