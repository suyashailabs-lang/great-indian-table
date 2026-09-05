/* The Great Indian Table — Motion-style scroll zoom + Dimension story wall */
(function () {
  "use strict";

  function loadStyles() {
    if (document.querySelector('link[data-git-immersive-style]')) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "assets/immersive-entry.css";
    link.dataset.gitImmersiveStyle = "1";
    document.head.appendChild(link);
  }

  function initEntry() {
    if (document.body.dataset.gitEntryReady === "1") return;
    document.body.dataset.gitEntryReady = "1";

    if (!window.location.hash) {
      try { history.scrollRestoration = "manual"; } catch (err) {}
      window.scrollTo(0, 0);
    }

    const entry = document.createElement("div");
    entry.className = "git-entry";
    entry.setAttribute("aria-label", "The Great Indian Table introduction");
    entry.innerHTML = `
      <div class="git-entry-inner">
        <h2 class="git-entry-title">The Great Indian <em>Table</em></h2>
      </div>
    `;

    const spacer = document.createElement("div");
    spacer.className = "git-entry-spacer";
    spacer.setAttribute("aria-hidden", "true");

    document.body.insertBefore(spacer, document.body.firstChild);
    document.body.insertBefore(entry, document.body.firstChild);

    let raf = 0;
    let completed = false;
    const update = () => {
      raf = 0;
      // Match the Motion scroll-zoom pattern: a tall scroll range drives a
      // continuously pinned hero instead of a simple enter/exit transition.
      const progress = Math.min(1, Math.max(0, window.scrollY / Math.max(1, window.innerHeight * 1.55)));
      document.documentElement.style.setProperty("--entry-progress", progress.toFixed(4));
      entry.style.setProperty("--entry-progress", progress.toFixed(4));
      if (progress >= 0.985) {
        entry.classList.add("is-complete");
        completed = true;
      } else {
        entry.classList.remove("is-complete");
        completed = false;
      }
    };

    window.addEventListener("scroll", () => {
      if (!raf) raf = requestAnimationFrame(update);
    }, { passive: true });

    update();

    entry.addEventListener("click", () => {
      window.scrollTo({ top: window.innerHeight * 1.55, behavior: "smooth" });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !completed) {
        window.scrollTo({ top: window.innerHeight * 1.55, behavior: "smooth" });
      }
    });
  }

  function centerMapChapter() {
    const mapSection = document.querySelector(".map-section");
    const layout = mapSection && mapSection.querySelector(".map-layout");
    const panel = mapSection && mapSection.querySelector(".map-panel");
    if (!mapSection || !layout || !panel) return;
    mapSection.classList.add("git-map-centered");
    const copy = mapSection.querySelector(".map-copy");
    if (copy) copy.setAttribute("data-git-map-copy", "1");
  }

  function buildDimensionWall() {
    const grid = document.getElementById("stories-grid");
    if (!grid || grid.dataset.gitDimensionBuilt === "1") return;
    const cards = Array.from(grid.querySelectorAll(".table-card"));
    if (!cards.length) return;

    grid.dataset.gitDimensionBuilt = "1";
    const stage = document.createElement("div");
    stage.className = "git-dimension";
    stage.setAttribute("aria-label", "Stories from tables across India. Drag to rotate; click a card to flip it.");
    stage.innerHTML = `
      <div class="git-dimension-label"><strong>Stories</strong> / A living table of India</div>
      <div class="git-dimension-hint">Drag to rotate · Click a card to turn</div>
      <div class="git-dimension-ring" aria-live="polite"></div>
      <div class="git-dimension-core"><div><span>See the work.</span><small>Turn a story</small></div></div>
    `;

    const ring = stage.querySelector(".git-dimension-ring");
    const sourceCards = cards.map((card) => ({
      href: card.getAttribute("href") || "#story",
      img: card.querySelector("img")?.getAttribute("src") || "",
      alt: card.querySelector("img")?.getAttribute("alt") || "",
      city: card.querySelector("small")?.textContent || "India",
      name: card.querySelector("h3")?.textContent || "Untitled table",
      profession: card.querySelector("p")?.textContent || "Work",
      original: card
    }));

    const total = Math.min(sourceCards.length, 12);
    const radius = window.innerWidth < 760 ? 390 : 560;
    const cardNodes = [];

    sourceCards.slice(0, total).forEach((data, index) => {
      const card = document.createElement("article");
      card.className = "git-dimension-card";
      card.dataset.index = String(index);
      card.style.setProperty("--ry", `${(index / total) * 360}deg`);
      card.style.setProperty("--tz", `${radius}px`);
      card.innerHTML = `
        <div class="git-dimension-card-inner">
          <div class="git-dimension-face git-dimension-front">
            <img src="${escapeAttr(data.img)}" alt="${escapeAttr(data.alt)}" loading="lazy">
            <div class="git-dimension-front-copy">
              <small>${escapeHTML(data.city)}</small><h3>${escapeHTML(data.name)}</h3><p>${escapeHTML(data.profession)}</p>
            </div>
          </div>
          <div class="git-dimension-face git-dimension-back">
            <div><small>${escapeHTML(data.profession)}</small><h3>${escapeHTML(data.name)}</h3><p>${escapeHTML(data.city)}</p></div>
            <button class="git-dimension-open" type="button">Open story ↗</button>
          </div>
        </div>`;
      card.addEventListener("click", (event) => {
        if (event.target.closest("button")) return;
        card.classList.toggle("is-flipped");
      });
      card.querySelector(".git-dimension-open").addEventListener("click", (event) => {
        event.stopPropagation();
        data.original.click();
      });
      ring.appendChild(card);
      cardNodes.push(card);
    });

    grid.replaceWith(stage);

    let rotation = 0;
    let velocity = 0;
    let dragging = false;
    let lastX = 0;
    let lastTime = 0;
    let animationFrame = 0;

    function normalizeAngle(angle) {
      let value = ((angle % 360) + 360) % 360;
      if (value > 180) value -= 360;
      return value;
    }
    function render() {
      rotation += velocity;
      velocity *= 0.94;
      ring.style.transform = `rotateX(-7deg) rotateY(${rotation}deg)`;
      cardNodes.forEach((card, index) => {
        const facing = normalizeAngle((index / total) * 360 + rotation);
        card.classList.toggle("is-near", Math.abs(facing) < 58);
        card.classList.toggle("is-far", Math.abs(facing) > 118);
      });
      animationFrame = requestAnimationFrame(render);
    }
    stage.addEventListener("pointerdown", (event) => {
      dragging = true; stage.classList.add("is-dragging"); lastX = event.clientX; lastTime = performance.now(); stage.setPointerCapture?.(event.pointerId);
    });
    stage.addEventListener("pointermove", (event) => {
      if (!dragging) return;
      const now = performance.now(); const dx = event.clientX - lastX; const dt = Math.max(8, now - lastTime);
      rotation += dx * 0.22; velocity = (dx / dt) * 2.8; lastX = event.clientX; lastTime = now;
    });
    const stopDrag = () => { dragging = false; stage.classList.remove("is-dragging"); };
    stage.addEventListener("pointerup", stopDrag); stage.addEventListener("pointercancel", stopDrag);
    stage.addEventListener("pointerleave", () => { if (dragging) stopDrag(); });
    stage.addEventListener("wheel", (event) => { event.preventDefault(); velocity += event.deltaY * -0.0022; }, { passive:false });
    render();
    window.addEventListener("beforeunload", () => cancelAnimationFrame(animationFrame), { once:true });
  }

  function escapeHTML(value) { return String(value).replace(/[&<>\"]/g, (char) => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;" }[char])); }
  function escapeAttr(value) { return escapeHTML(value).replace(/'/g, "&#39;"); }

  function init() {
    loadStyles(); initEntry(); centerMapChapter();
    requestAnimationFrame(() => requestAnimationFrame(buildDimensionWall));
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once:true });
  else init();
})();
