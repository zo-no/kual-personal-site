(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (reduceMotion.matches || !("IntersectionObserver" in window)) return;

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
        entry.target.style.setProperty("--io-opacity", String(0.28 + progress * 0.72));
        entry.target.style.setProperty("--io-shift", `${(1 - progress) * 42}px`);
        entry.target.style.setProperty("--io-blur", `${(1 - progress) * 9}px`);
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

  document.addEventListener("visibilitychange", () => {
    root.classList.toggle("page-hidden", document.hidden);
  });
})();
