(() => {
  const initializeSiteEffects = () => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (reduceMotion.matches || !("IntersectionObserver" in window)) {
    const status = document.querySelector("[data-filter-status]");
    const value = document.querySelector("[data-filter-value]");
    const hint = document.querySelector("[data-filter-hint]");
    const announcement = document.querySelector("[data-filter-announcement]");
    const signalField = document.querySelector(".signal-field");
    if (status) status.textContent = "SIGNAL";
    if (value) value.textContent = "/ FOUND";
    if (hint) hint.textContent = "STATIC SIGNAL";
    if (announcement) announcement.textContent = "三条项目线已完成过滤";
    if (signalField) signalField.classList.add("is-filtered");
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
    ".page-hero h1",
    ".article-hero h1",
  ];

  const revealElements = document.querySelectorAll(revealSelectors.join(","));
  const depthElements = document.querySelectorAll(depthSelectors.join(","));

  revealElements.forEach((element) => element.setAttribute("data-reveal", ""));
  depthElements.forEach((element) => element.setAttribute("data-depth", ""));

  const staggerGroups = document.querySelectorAll(
    ".practice-list, .article-grid, .value-list",
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
  const filterStatus = signalField?.querySelector("[data-filter-status]");
  const filterValue = signalField?.querySelector("[data-filter-value]");
  const filterHint = signalField?.querySelector("[data-filter-hint]");
  const filterAnnouncement = signalField?.querySelector("[data-filter-announcement]");
  const fieldCaption = signalField?.querySelector("[data-field-caption]");
  const signalNodes = signalField
    ? Array.from(signalField.querySelectorAll("[data-project-signal]"))
    : [];
  const hero = signalField?.closest(".hero");
  const projectSteps = hero
    ? Array.from(hero.querySelectorAll("[data-project-step]"))
    : [];

  if (signalField && signalCanvas && signalNodes.length) {
    const context = signalCanvas.getContext("2d");

    if (context) {
      root.classList.add("signal-canvas-enabled");

      const accent = [240, 74, 36];
      const paper = [247, 243, 233];
      const pointer = { x: 0, y: 0, active: false };
      const projectKeys = signalNodes.map((node) => node.dataset.projectSignal).filter(Boolean);
      const projectMeta = new Map(signalNodes.map((node) => [
        node.dataset.projectSignal,
        {
          copy: node.dataset.signalCopy,
          title: node.querySelector("strong")?.textContent || "项目",
        },
      ]));
      let width = 0;
      let height = 0;
      let pixelRatio = 1;
      let projectCurves = [];
      let projectProgress = projectKeys.map(() => 0);
      let projectTargets = projectKeys.map(() => 0);
      let filterProgress = 0;
      let activeStoryProject = null;
      let hoverProject = null;
      let visible = false;
      let frameId = 0;
      let previousTime = 0;
      let lastPercent = -1;
      let lastAnnouncement = "";
      let scrollQueued = false;

      const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
      const mix = (start, end, amount) => start + (end - start) * amount;
      const average = (values) => values.reduce((total, value) => total + value, 0) / Math.max(1, values.length);
      const smooth = (value) => {
        const amount = clamp(value);
        return amount * amount * (3 - 2 * amount);
      };
      const seeded = (seed) => {
        const value = Math.sin(seed * 91.733 + 17.13) * 43758.5453;
        return value - Math.floor(value);
      };

      const buildCurves = () => {
        const left = 24;
        const right = width - 24;
        const top = 86;
        const bottom = height - 104;
        const bandHeight = (bottom - top) / projectKeys.length;
        const count = width < 560 ? 84 : 132;

        projectCurves = projectKeys.map((key, lineIndex) => {
          const seed = (lineIndex + 1) * 41;
          const center = top + bandHeight * (lineIndex + 0.5);
          const noiseClusters = Array.from({ length: 3 }, (_, clusterIndex) => ({
            center: clamp(0.12 + clusterIndex * 0.34 + (seeded(seed + clusterIndex * 13) - 0.5) * 0.16, 0.08, 0.92),
            radius: 0.055 + seeded(seed + clusterIndex * 29) * 0.1,
            strength: 0.55 + seeded(seed + clusterIndex * 47) * 0.75,
          }));
          const noiseStrengthAt = (t) => noiseClusters.reduce((strongest, cluster) => {
            const distance = Math.abs(t - cluster.center) / cluster.radius;
            const strength = distance >= 1 ? 0 : (1 - distance) ** 2 * cluster.strength;
            return Math.max(strongest, strength);
          }, 0.08);
          const cleanYAt = (t) => {
            const direction = lineIndex === 0 ? -13 : lineIndex === 1 ? -7 : 10;
            const wave = Math.sin(t * Math.PI * (2.1 + lineIndex * 0.35) + lineIndex) * (8 + lineIndex * 2);
            const detail = Math.sin(t * Math.PI * 7.2 + seed) * 2.5;
            return center + (t - 0.5) * direction + wave + detail;
          };
          const points = Array.from({ length: count }, (_, index) => {
            const t = index / (count - 1);
            const cleanY = cleanYAt(t);
            const strength = noiseStrengthAt(t);
            const pulse = (
              Math.sin(index * (1.31 + lineIndex * 0.2) + seed) * 11
              + Math.sin(index * 0.43 + lineIndex) * 8
            ) * strength;
            const spike = strength > 0.24 && seeded(index * 3 + seed) > 0.82
              ? (seeded(index + seed) - 0.5) * Math.min(74, bandHeight * 0.55) * strength
              : 0;
            return {
              t,
              x: mix(left, right, t),
              cleanY,
              rawY: cleanY + pulse + spike,
            };
          });
          const dotCount = width < 560 ? 28 : 48;
          const noisePoints = Array.from({ length: dotCount }, (_, index) => {
            const cluster = noiseClusters[index % noiseClusters.length];
            const spread = seeded(index + seed + 12) - seeded(index + seed + 84);
            const t = clamp(cluster.center + spread * cluster.radius * 1.65, 0.02, 0.98);
            const cleanY = cleanYAt(t);
            return {
              x: mix(left, right, t),
              y: cleanY + (seeded(index + seed + 71) - 0.5) * Math.min(92, bandHeight * 0.78) * cluster.strength,
              size: 0.55 + seeded(index + seed + 20) ** 2 * 2.5,
              opacity: 0.09 + seeded(index + seed + 45) ** 2 * 0.5,
              phase: seeded(index + seed + 122) * Math.PI * 2,
              drift: 1 + seeded(index + seed + 151) * 4,
            };
          });
          const particleCount = width < 560 ? 11 : 18;
          const flowParticles = Array.from({ length: particleCount }, (_, index) => ({
            phase: seeded(index + seed + 201),
            speed: 0.000018 + seeded(index + seed + 233) * 0.000035,
            size: 0.75 + seeded(index + seed + 271) ** 2 * 2.2,
            drift: 1.5 + seeded(index + seed + 301) * 5,
            opacity: 0.22 + seeded(index + seed + 331) * 0.55,
          }));
          return {
            key,
            bandTop: top + bandHeight * lineIndex,
            bandBottom: top + bandHeight * (lineIndex + 1),
            points,
            noisePoints,
            flowParticles,
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
        buildCurves();
      };

      const filterAmountAt = (lineIndex, x) => {
        const progress = projectProgress[lineIndex] || 0;
        const halfWidth = mix(width * 0.015, width * 0.58, smooth(progress));
        const feather = Math.max(24, width * 0.055);
        return smooth((halfWidth - Math.abs(x - width / 2)) / feather) * progress;
      };

      const curveYAt = (lineIndex, t) => {
        const curve = projectCurves[lineIndex];
        if (!curve) return height / 2;
        const index = Math.round(clamp(t) * (curve.points.length - 1));
        const point = curve.points[index];
        return mix(point.rawY, point.cleanY, filterAmountAt(lineIndex, point.x));
      };

      const updateScrollTargets = () => {
        if (window.innerWidth <= 1100 || !hero || projectSteps.length !== projectKeys.length) {
          projectTargets = projectKeys.map(() => 1);
          projectProgress = projectTargets.slice();
          filterProgress = 1;
          return;
        }

        const stickyTop = Number.parseFloat(window.getComputedStyle(signalField).top) || 82;
        const stickyRange = Math.max(1, hero.offsetHeight - signalField.offsetHeight - stickyTop);
        const overallProgress = clamp((window.scrollY - hero.offsetTop) / stickyRange);
        const introLead = 0.14;
        const completionPoint = 0.9;
        const segmentSize = (completionPoint - introLead) / projectKeys.length;
        projectTargets = projectKeys.map((_, index) => (
          clamp((overallProgress - introLead - segmentSize * index) / segmentSize)
        ));
        if (overallProgress >= 0.94) {
          projectProgress = projectTargets.slice();
          filterProgress = 1;
        }
      };

      const updateStatus = () => {
        const percent = Math.round(filterProgress * 100);
        const effectiveProject = hoverProject || activeStoryProject;
        const activeTitle = projectMeta.get(effectiveProject)?.title;
        const phase = filterProgress < 0.025 ? "noise" : filterProgress < 0.985 ? "filtering" : "signal";

        if (percent !== lastPercent) {
          lastPercent = percent;
          if (phase === "noise") {
            filterStatus.textContent = "NOISE";
            filterValue.textContent = "/ 00";
            if (filterHint) filterHint.textContent = "SCROLL TO FILTER";
          } else if (phase === "filtering") {
            filterStatus.textContent = "FILTERING";
            filterValue.textContent = `/ ${String(percent).padStart(2, "0")}`;
            if (filterHint) filterHint.textContent = activeTitle ? activeTitle.toUpperCase() : "EXTRACTING SIGNAL";
          } else {
            filterStatus.textContent = "SIGNAL";
            filterValue.textContent = "/ FOUND";
            if (filterHint) filterHint.textContent = "THREE LINES RESOLVED";
          }
        }

        const announcementKey = `${phase}:${effectiveProject || "none"}`;
        if (announcementKey !== lastAnnouncement && filterAnnouncement) {
          lastAnnouncement = announcementKey;
          filterAnnouncement.textContent = phase === "noise"
            ? "三条项目线等待过滤"
            : phase === "signal"
              ? "三条项目线已完成过滤"
              : `正在过滤${activeTitle || "项目"}信号线`;
        }

        const filtered = filterProgress > 0.985;
        signalField.classList.toggle("is-filtered", filtered);
        if (!effectiveProject && fieldCaption) {
          fieldCaption.textContent = filtered
            ? "SIGNAL FOUND / THREE PROJECTS"
            : "THREE PROJECT LINES / SCROLL TO FILTER";
        }
      };

      const drawFilterWindow = () => {
        const effectiveProject = hoverProject || activeStoryProject;
        const activeIndex = effectiveProject ? projectKeys.indexOf(effectiveProject) : projectProgress.findIndex((value) => value > 0.01 && value < 0.995);
        if (activeIndex < 0) return;
        const curve = projectCurves[activeIndex];
        const progress = projectProgress[activeIndex];
        if (!curve || progress < 0.015) return;
        const halfWidth = mix(width * 0.015, width * 0.58, smooth(progress));
        const left = width / 2 - halfWidth;
        const right = width / 2 + halfWidth;
        const shade = context.createLinearGradient(left, 0, right, 0);
        shade.addColorStop(0, "rgba(240, 74, 36, 0)");
        shade.addColorStop(0.5, `rgba(240, 74, 36, ${0.018 + progress * 0.032})`);
        shade.addColorStop(1, "rgba(240, 74, 36, 0)");
        context.fillStyle = shade;
        context.fillRect(left, curve.bandTop + 8, right - left, curve.bandBottom - curve.bandTop - 16);
        context.strokeStyle = `rgba(240, 74, 36, ${0.18 + progress * 0.34})`;
        context.lineWidth = 0.7;
        [left, right].forEach((x) => {
          context.beginPath();
          context.moveTo(x, curve.bandTop + 10);
          context.lineTo(x, curve.bandBottom - 10);
          context.stroke();
        });
      };

      const drawNoisePoints = (timestamp) => {
        projectCurves.forEach((curve, lineIndex) => {
          curve.noisePoints.forEach((point) => {
            const filtered = filterAmountAt(lineIndex, point.x);
            const pulse = 0.72 + Math.sin(timestamp * 0.0012 + point.phase) * 0.28;
            const opacity = point.opacity * pulse * (1 - filtered * 0.97);
            if (opacity < 0.012) return;
            context.fillStyle = `rgba(${paper.join(", ")}, ${opacity})`;
            context.beginPath();
            context.arc(
              point.x + Math.cos(timestamp * 0.0005 + point.phase) * point.drift * (1 - filtered),
              point.y + Math.sin(timestamp * 0.0007 + point.phase) * point.drift * (1 - filtered),
              point.size * (1 - filtered * 0.55),
              0,
              Math.PI * 2,
            );
            context.fill();
          });
        });
      };

      const drawCurves = () => {
        const effectiveProject = hoverProject || activeStoryProject;
        projectCurves.forEach((curve, lineIndex) => {
          const progress = projectProgress[lineIndex];
          const active = curve.key === effectiveProject;
          context.strokeStyle = active
            ? `rgba(${accent.join(", ")}, ${0.58 + progress * 0.42})`
            : `rgba(${paper.join(", ")}, ${0.28 + progress * 0.42})`;
          context.lineWidth = active ? 1.8 : progress > 0.985 ? 1.35 : 1;
          context.beginPath();
          curve.points.forEach((point, index) => {
            const y = mix(point.rawY, point.cleanY, filterAmountAt(lineIndex, point.x));
            if (index === 0) context.moveTo(point.x, y);
            else context.lineTo(point.x, y);
          });
          context.stroke();
        });
      };

      const drawSignalParticles = (timestamp) => {
        const effectiveProject = hoverProject || activeStoryProject;
        context.save();
        context.globalCompositeOperation = "lighter";
        projectCurves.forEach((curve, lineIndex) => {
          const progress = projectProgress[lineIndex];
          const active = curve.key === effectiveProject;
          curve.flowParticles.forEach((particle) => {
            const t = (particle.phase + timestamp * particle.speed) % 1;
            const x = mix(24, width - 24, t);
            const filtered = filterAmountAt(lineIndex, x);
            const unsettled = 1 - filtered;
            const y = curveYAt(lineIndex, t)
              + Math.sin(timestamp * 0.001 + particle.phase * 11) * particle.drift * unsettled;
            const opacity = particle.opacity
              * (active ? 1 : 0.48)
              * (0.52 + progress * 0.48);
            const color = active ? accent : paper;
            const trail = 8 + particle.size * 5 + progress * 9;

            context.strokeStyle = `rgba(${color.join(", ")}, ${opacity * 0.2})`;
            context.lineWidth = Math.max(0.45, particle.size * 0.45);
            context.beginPath();
            context.moveTo(x - trail, curveYAt(lineIndex, clamp(t - trail / width)));
            context.lineTo(x, y);
            context.stroke();

            context.shadowColor = `rgba(${color.join(", ")}, ${opacity})`;
            context.shadowBlur = active ? 12 : 5;
            context.fillStyle = `rgba(${color.join(", ")}, ${opacity})`;
            context.beginPath();
            context.arc(x, y, particle.size * (active ? 1.15 : 0.82), 0, Math.PI * 2);
            context.fill();
          });
        });
        context.restore();
      };

      const drawFocus = () => {
        if (!pointer.active || !projectCurves.length) return;
        const t = clamp(pointer.x / width);
        const effectiveProject = hoverProject || activeStoryProject;
        let lineIndex = effectiveProject ? projectKeys.indexOf(effectiveProject) : -1;
        if (lineIndex < 0) {
          lineIndex = projectCurves.reduce((nearest, curve, index) => {
            const center = (curve.bandTop + curve.bandBottom) / 2;
            const nearestCenter = (projectCurves[nearest].bandTop + projectCurves[nearest].bandBottom) / 2;
            return Math.abs(pointer.y - center) < Math.abs(pointer.y - nearestCenter) ? index : nearest;
          }, 0);
        }
        const x = t * width;
        const y = curveYAt(lineIndex, t);
        context.strokeStyle = "rgba(247, 243, 233, 0.16)";
        context.lineWidth = 0.7;
        context.beginPath();
        context.moveTo(x, projectCurves[lineIndex].bandTop + 8);
        context.lineTo(x, projectCurves[lineIndex].bandBottom - 8);
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
        let moving = false;
        projectProgress = projectProgress.map((progress, index) => {
          const target = projectTargets[index];
          const next = mix(progress, target, easing);
          if (Math.abs(next - target) < 0.001) return target;
          moving = true;
          return next;
        });
        filterProgress = average(projectProgress);

        context.clearRect(0, 0, width, height);
        drawFilterWindow();
        drawNoisePoints(timestamp);
        drawCurves();
        drawSignalParticles(timestamp);
        drawFocus();
        updateStatus();
        if (moving || visible) frameId = window.requestAnimationFrame(draw);
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
          updateScrollTargets();
          startDrawing();
        });
      };

      signalField.addEventListener("pointermove", (event) => {
        const rect = signalField.getBoundingClientRect();
        pointer.x = event.clientX - rect.left;
        pointer.y = event.clientY - rect.top;
        pointer.active = true;
        startDrawing();
      });

      signalField.addEventListener("pointerleave", () => {
        pointer.active = false;
        startDrawing();
      });

      const updateProjectState = () => {
        const activeProject = hoverProject || activeStoryProject;
        signalField.classList.toggle("has-active-node", Boolean(activeProject));
        signalNodes.forEach((node) => node.classList.toggle("is-active", node.dataset.projectSignal === activeProject));
        projectSteps.forEach((step) => step.classList.toggle("is-active", step.dataset.projectStep === activeProject));
        if (fieldCaption) {
          fieldCaption.textContent = activeProject
            ? projectMeta.get(activeProject)?.copy || "THREE PROJECT LINES / SCROLL TO FILTER"
            : filterProgress > 0.985
              ? "SIGNAL FOUND / THREE PROJECTS"
              : "THREE PROJECT LINES / SCROLL TO FILTER";
        }
        lastPercent = -1;
        startDrawing();
      };

      signalNodes.forEach((node) => {
        const activate = () => {
          hoverProject = node.dataset.projectSignal;
          updateProjectState();
        };
        const deactivate = () => {
          hoverProject = null;
          updateProjectState();
        };
        node.addEventListener("pointerenter", activate);
        node.addEventListener("pointerleave", deactivate);
        node.addEventListener("focus", activate);
        node.addEventListener("blur", deactivate);
      });

      if (projectSteps.length) {
        const visibleSteps = new Map();
        const projectObserver = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) visibleSteps.set(entry.target.dataset.projectStep, entry.intersectionRatio);
              else visibleSteps.delete(entry.target.dataset.projectStep);
            });
            const nextActive = Array.from(visibleSteps.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] || null;
            if (nextActive !== activeStoryProject) {
              activeStoryProject = nextActive;
              updateProjectState();
            }
          },
          { root: null, rootMargin: "-34% 0px -34% 0px", threshold: [0, 0.2, 0.4, 0.6] },
        );
        projectSteps.forEach((step) => projectObserver.observe(step));
      }

      const canvasObserver = new IntersectionObserver(
        ([entry]) => {
          visible = entry.isIntersecting;
          if (visible) {
            updateScrollTargets();
            startDrawing();
          } else if (frameId) {
            window.cancelAnimationFrame(frameId);
            frameId = 0;
          }
        },
        { root: null, rootMargin: "100px 0px", threshold: 0 },
      );

      resizeCanvas();
      updateScrollTargets();
      canvasObserver.observe(signalField);
      window.addEventListener("scroll", queueScrollUpdate, { passive: true });

      if ("ResizeObserver" in window) {
        const resizeObserver = new ResizeObserver(() => {
          resizeCanvas();
          updateScrollTargets();
          startDrawing();
        });
        resizeObserver.observe(signalField);
      } else {
        window.addEventListener("resize", () => {
          resizeCanvas();
          updateScrollTargets();
          startDrawing();
        });
      }

      document.addEventListener("visibilitychange", () => {
        if (document.hidden && frameId) {
          window.cancelAnimationFrame(frameId);
          frameId = 0;
        } else {
          startDrawing();
        }
      });
    }
  }

  document.addEventListener("visibilitychange", () => {
    root.classList.toggle("page-hidden", document.hidden);
  });
  };

  const scheduleInitialization = () => {
    window.setTimeout(() => window.requestAnimationFrame(initializeSiteEffects), 700);
  };

  if (document.readyState === "complete") {
    scheduleInitialization();
  } else {
    window.addEventListener("load", scheduleInitialization, { once: true });
  }
})();
