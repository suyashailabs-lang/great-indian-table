/* Great Indian Table — page behaviour */
(() => {
  "use strict";

  const stories = Array.isArray(window.STORIES) ? window.STORIES : [];
  const music = window.PROFESSION_MUSIC || {};

  const $ = (id) => document.getElementById(id);
  const els = {
    body: document.body,
    media: $("viewer-media"),
    thumbs: $("story-thumbs"),
    profession: $("viewer-profession"),
    name: $("viewer-name"),
    quote: $("viewer-quote"),
    location: $("viewer-location"),
    meta: $("viewer-meta"),
    altView: $("alt-view"),
    altCount: $("alt-count"),
    player: $("music-player"),
    art: $("music-art"),
    musicTitle: $("music-title"),
    play: $("music-play"),
    prev: $("music-prev"),
    next: $("music-next"),
    open: $("music-open"),
    tracks: $("music-tracks"),
    playlist: $("music-playlist"),
    keyboardHint: $("keyboard-hint")
  };

  let storyIndex = 0;
  let imageIndex = 0;
  let musicIndex = 0;
  let imageTimer = 0;
  let ytPlayer = null;
  let ytReady = false;
  let ytPendingPlay = false;
  let currentVideoId = null;
  let musicPlaying = false;
  let lastArrowAt = 0;
  let wheelLockedUntil = 0;
  let touchStartY = 0;

  const escapeHTML = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);

  const getVideoId = (track) => {
    const url = track?.url || "";
    return url.match(/(?:embed\/|watch\?v=)([\w-]{6,})/)?.[1] || null;
  };

  const getTracks = () => music[stories[storyIndex]?.profession] || [];
  const getCurrentTrack = () => getTracks()[musicIndex] || getTracks()[0] || null;

  function setMusicButtonState() {
    if (!els.play) return;
    els.play.textContent = musicPlaying ? "❚❚" : "▶";
    els.play.setAttribute("aria-label", musicPlaying ? "Pause music" : "Play music");
    els.player?.classList.toggle("is-playing", musicPlaying);
  }

  function stopMusic() {
    musicPlaying = false;
    currentVideoId = null;
    if (ytPlayer && ytReady) {
      try { ytPlayer.stopVideo(); } catch (_) {}
    }
    setMusicButtonState();
  }

  function cueCurrentTrack() {
    const id = getVideoId(getCurrentTrack());
    if (!id || !ytPlayer || !ytReady) return;
    if (currentVideoId !== id) {
      currentVideoId = id;
      ytPlayer.cueVideoById(id);
    }
  }

  function playCurrentTrack() {
    const id = getVideoId(getCurrentTrack());
    if (!id) return;
    if (!ytReady || !ytPlayer) {
      ytPendingPlay = true;
      setMusicButtonState();
      return;
    }
    if (currentVideoId !== id) {
      currentVideoId = id;
      ytPlayer.loadVideoById(id);
    } else {
      ytPlayer.playVideo();
    }
    musicPlaying = true;
    setMusicButtonState();
  }

  function pauseCurrentTrack() {
    if (ytPlayer && ytReady) ytPlayer.pauseVideo();
    musicPlaying = false;
    setMusicButtonState();
  }

  function toggleMusic() {
    musicPlaying ? pauseCurrentTrack() : playCurrentTrack();
  }

  function selectTrack(index, autoPlay = true) {
    const tracks = getTracks();
    if (!tracks.length) return;
    musicIndex = (index + tracks.length) % tracks.length;
    const track = tracks[musicIndex];
    els.musicTitle.textContent = track.title;
    els.art.src = stories[storyIndex]?.images?.[0] || "assets/img/Hero.JPEG";
    els.play.dataset.url = getVideoId(track)
      ? `https://music.youtube.com/watch?v=${getVideoId(track)}`
      : "https://music.youtube.com/";
    renderPlaylist();
    autoPlay ? playCurrentTrack() : cueCurrentTrack();
  }

  function stepTrack(direction, autoPlay = true) {
    selectTrack(musicIndex + direction, autoPlay);
  }

  function openMusic() {
    window.open(els.play.dataset.url || "https://music.youtube.com/", "_blank", "noopener,noreferrer");
  }

  function renderPlaylist() {
    if (!els.playlist) return;
    const tracks = getTracks();
    els.playlist.innerHTML = `
      <div class="playlist-head"><span>Playlist</span><span>${tracks.length} tracks</span></div>
      ${tracks.map((track, index) => `
        <button class="playlist-row${index === musicIndex ? " is-current" : ""}" type="button" data-track-index="${index}">
          <span class="playlist-number">${String(index + 1).padStart(2, "0")}</span>
          <span class="playlist-dot"></span>
          <span class="playlist-title">${escapeHTML(track.title)}</span>
        </button>`).join("")}
    `;
    els.playlist.querySelectorAll("[data-track-index]").forEach((button) => {
      button.addEventListener("click", () => {
        selectTrack(Number(button.dataset.trackIndex), musicPlaying);
      });
    });
  }

  function setStoryMeta(story) {
    els.profession.textContent = story.profession || "";
    els.name.textContent = story.name || "";
    els.quote.textContent = story.quote ? `“${story.quote}”` : "";
    els.location.textContent = story.location || "";
  }

  function updateAltButton(story) {
    const count = story.images?.length || 0;
    imageIndex = Math.min(imageIndex, Math.max(0, count - 1));
    els.altView.hidden = count < 2;
    els.altCount.textContent = count >= 2
      ? `${String(imageIndex + 1).padStart(2, "0")} / ${String(count).padStart(2, "0")}`
      : "";
  }

  function renderThumbs() {
    els.thumbs.innerHTML = stories.map((story, index) => `
      <button class="story-thumb${index === storyIndex ? " is-active" : ""}" type="button" data-story-index="${index}" aria-label="View ${escapeHTML(story.name)}">
        <img loading="lazy" decoding="async" src="${escapeHTML(story.images?.[0] || "")}" alt="">
        <span>${String(index + 1).padStart(2, "0")}</span>
      </button>`).join("");

    els.thumbs.querySelectorAll("[data-story-index]").forEach((button) => {
      button.addEventListener("click", () => showStory(Number(button.dataset.storyIndex)));
    });

    els.thumbs.querySelector(`[data-story-index="${storyIndex}"]`)
      ?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }

  function enhanceLoadedImages() {
    els.media.querySelectorAll("img").forEach((image) => image.classList.add("is-parallax-layer"));
  }

  function triggerCinematic() {
    els.media.classList.remove("cinematic-flash");
    void els.media.offsetWidth;
    els.media.classList.add("cinematic-flash");
    window.clearTimeout(triggerCinematic.timer);
    triggerCinematic.timer = window.setTimeout(() => els.media.classList.remove("cinematic-flash"), 980);
  }

  function renderImage(src, animate = true) {
    if (!src) return;
    window.clearTimeout(imageTimer);
    const previous = els.media.querySelector("img");
    const next = document.createElement("img");
    const story = stories[storyIndex];
    next.src = src;
    next.alt = `${story.name}'s table in ${story.location}`;
    next.decoding = "async";
    next.fetchPriority = "high";
    if (animate) next.className = "is-new";
    els.media.appendChild(next);
    enhanceLoadedImages();

    if (!animate) {
      next.classList.add("is-visible");
      return;
    }

    requestAnimationFrame(() => requestAnimationFrame(() => next.classList.add("is-visible")));
    if (previous) {
      previous.classList.add("is-old");
      imageTimer = window.setTimeout(() => previous.remove(), 850);
    }
  }

  function showStory(index) {
    if (!stories.length) return;
    storyIndex = (index + stories.length) % stories.length;
    imageIndex = 0;
    musicIndex = 0;
    const story = stories[storyIndex];

    setStoryMeta(story);
    updateAltButton(story);
    els.media.querySelectorAll("img").forEach((image) => image.remove());
    renderImage(story.images?.[0], false);
    renderThumbs();
    selectTrack(0, false);
    triggerCinematic();
  }

  function showAlternateImage() {
    const story = stories[storyIndex];
    if (!story?.images || story.images.length < 2) return;
    imageIndex = (imageIndex + 1) % story.images.length;
    els.altCount.textContent = `${String(imageIndex + 1).padStart(2, "0")} / ${String(story.images.length).padStart(2, "0")}`;
    renderImage(story.images[imageIndex]);
  }

  function enterStories() {
    els.body.classList.add("is-stories");
    showStory(0);
    playCurrentTrack();
  }

  function leaveStories() {
    stopMusic();
    els.body.classList.remove("is-stories");
  }

  function preloadStoryImages() {
    const urls = [...new Set(stories.slice(0, 3).flatMap((story) => story.images || []))];
    urls.forEach((src) => {
      const image = new Image();
      image.decoding = "async";
      image.fetchPriority = "high";
      image.src = src;
    });
  }

  function setupParallax() {
    let frame = 0;
    els.media.addEventListener("pointermove", (event) => {
      if (event.pointerType === "touch" || window.innerWidth < 801) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = els.media.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width - .5) * 10;
        const y = ((event.clientY - rect.top) / rect.height - .5) * 7;
        els.media.style.setProperty("--px", `${x.toFixed(2)}px`);
        els.media.style.setProperty("--py", `${y.toFixed(2)}px`);
      });
    });
    els.media.addEventListener("pointerleave", () => {
      els.media.style.setProperty("--px", "0px");
      els.media.style.setProperty("--py", "0px");
    });
  }

  function flashKeyboardHint() {
    if (!els.keyboardHint) return;
    els.keyboardHint.classList.add("is-active");
    window.clearTimeout(flashKeyboardHint.timer);
    flashKeyboardHint.timer = window.setTimeout(() => els.keyboardHint.classList.remove("is-active"), 1800);
  }

  function handleStoryArrow(direction) {
    const now = Date.now();
    if (now - lastArrowAt < 260) return;
    lastArrowAt = now;
    showStory(storyIndex + direction);
  }

  function setupKeyboard() {
    document.addEventListener("keydown", (event) => {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey || event.isComposing) return;
      const target = event.target;
      if (target?.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target?.tagName)) return;
      if (!els.body.classList.contains("is-stories")) return;

      if (event.code === "ArrowLeft") { event.preventDefault(); handleStoryArrow(-1); }
      else if (event.code === "ArrowRight") { event.preventDefault(); handleStoryArrow(1); }
      else if (event.code === "Space") { event.preventDefault(); toggleMusic(); }
      else if (event.code === "ArrowUp") { event.preventDefault(); stepTrack(-1, true); }
      else if (event.code === "ArrowDown") { event.preventDefault(); stepTrack(1, true); }
      else if (event.code === "Escape") { event.preventDefault(); leaveStories(); }
      else return;
      flashKeyboardHint();
    }, true);
  }

  function setupGestures() {
    document.addEventListener("wheel", (event) => {
      if (!els.body.classList.contains("is-stories")) return;
      if (Date.now() < wheelLockedUntil || Math.abs(event.deltaY) < 18) return;
      wheelLockedUntil = Date.now() + 700;
      showStory(storyIndex + (event.deltaY > 0 ? 1 : -1));
    }, { passive: true });

    document.addEventListener("touchstart", (event) => {
      if (els.body.classList.contains("is-stories")) touchStartY = event.changedTouches[0].clientY;
    }, { passive: true });

    document.addEventListener("touchend", (event) => {
      if (!els.body.classList.contains("is-stories")) return;
      const distance = touchStartY - event.changedTouches[0].clientY;
      if (Math.abs(distance) > 45) showStory(storyIndex + (distance > 0 ? 1 : -1));
    }, { passive: true });
  }

  function setupPlaylist() {
    if (!els.tracks || !els.playlist) return;
    const open = () => { renderPlaylist(); els.player.classList.add("playlist-open"); els.tracks.classList.add("is-active"); };
    const close = () => { els.player.classList.remove("playlist-open"); els.tracks.classList.remove("is-active"); };

    els.tracks.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      els.player.classList.contains("playlist-open") ? close() : open();
    });
    els.tracks.addEventListener("mouseenter", open);
    els.tracks.addEventListener("focus", open);
    els.player.addEventListener("mouseleave", close);
  }

  function setupAbout() {
    const info = document.querySelector("[data-about]");
    const backdrop = $("about-backdrop");
    if (!info || !backdrop) return;
    const closeButton = $("about-close");
    const close = () => { backdrop.classList.remove("is-open"); backdrop.setAttribute("aria-hidden", "true"); };
    info.addEventListener("click", () => { backdrop.classList.add("is-open"); backdrop.setAttribute("aria-hidden", "false"); });
    closeButton.addEventListener("click", close);
    backdrop.addEventListener("click", (event) => { if (event.target === backdrop) close(); });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && backdrop.classList.contains("is-open")) close();
    });
  }

  function setupYouTube() {
    window.onYouTubeIframeAPIReady = () => {
      if (!window.YT?.Player || ytPlayer) return;
      ytPlayer = new YT.Player("yt-audio-engine", {
        width: "1",
        height: "1",
        videoId: "",
        playerVars: { autoplay: 0, controls: 0, disablekb: 1, fs: 0, iv_load_policy: 3, playsinline: 1, rel: 0 },
        events: {
          onReady() {
            ytReady = true;
            cueCurrentTrack();
            if (ytPendingPlay) {
              ytPendingPlay = false;
              playCurrentTrack();
            }
          },
          onStateChange(event) {
            if (event.data === YT.PlayerState.PLAYING) {
              musicPlaying = true;
              setMusicButtonState();
            } else if (event.data === YT.PlayerState.PAUSED) {
              musicPlaying = false;
              setMusicButtonState();
            } else if (event.data === YT.PlayerState.ENDED) {
              stepTrack(1, true);
            }
          },
          onError() {
            musicPlaying = false;
            setMusicButtonState();
          }
        }
      });
    };
  }

  function setupControls() {
    document.querySelector("[data-explore]")?.addEventListener("click", enterStories);
    document.querySelector("[data-home]")?.addEventListener("click", leaveStories);
    document.querySelectorAll("[data-slide]").forEach((button) => {
      button.addEventListener("click", () => showStory(storyIndex + Number(button.dataset.slide)));
    });
    els.altView?.addEventListener("click", showAlternateImage);
    els.prev?.addEventListener("click", () => stepTrack(-1, true));
    els.next?.addEventListener("click", () => stepTrack(1, true));
    els.play?.addEventListener("click", toggleMusic);
    els.open?.addEventListener("click", openMusic);
  }

  function init() {
    if (!stories.length) return;

    setMusicButtonState();
    renderThumbs();
    showStory(0);
    setupControls();
    setupKeyboard();
    setupGestures();
    setupPlaylist();
    setupAbout();
    setupParallax();
    preloadStoryImages();
    setupYouTube();
  }

  document.readyState === "loading"
    ? document.addEventListener("DOMContentLoaded", init, { once: true })
    : init();
})();
