/* Great Indian Table — story viewer behaviour */
(() => {
  "use strict";

  const stories = Array.isArray(window.STORIES) ? window.STORIES : [];
  const music = window.PROFESSION_MUSIC || {};
  const $ = (id) => document.getElementById(id);

  const els = {
    body: document.body,
    hero: document.querySelector(".hero"),
    media: $("viewer-media"),
    thumbs: $("story-thumbs"),
    profession: $("viewer-profession"),
    name: $("viewer-name"),
    quote: $("viewer-quote"),
    location: $("viewer-location"),
    home: document.querySelector("[data-home]"),
    explore: document.querySelector("[data-explore]"),
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
    keyboardHint: $("keyboard-hint"),
    about: document.querySelector("[data-about]"),
    aboutBackdrop: $("about-backdrop"),
    aboutClose: $("about-close")
  };

  if (!stories.length || !els.media) return;

  let storyIndex = 0;
  let imageIndex = 0;
  let musicIndex = 0;
  let imageTimer = 0;
  let cinematicTimer = 0;
  let ytPlayer = null;
  let ytReady = false;
  let ytPendingPlay = false;
  let currentVideoId = null;
  let musicPlaying = false;
  let wheelLockedUntil = 0;
  let touchStartY = 0;
  let pointerFrame = 0;

  const escapeHTML = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);

  const getTracks = () => music[stories[storyIndex]?.profession] || [];

  const getVideoId = (track) => {
    const url = track?.url || "";
    return url.match(/(?:embed\/|watch\?v=)([\w-]{6,})/)?.[1] || null;
  };

  const getCurrentTrack = () => {
    const tracks = getTracks();
    return tracks[musicIndex] || tracks[0] || null;
  };

  function syncMusicUI() {
    if (!els.player || !els.play) return;
    els.player.classList.add("is-visible");
    els.player.classList.toggle("is-playing", musicPlaying);
    els.play.textContent = musicPlaying ? "❚❚" : "▶";
    els.play.setAttribute("aria-label", musicPlaying ? "Pause music" : "Play music");
  }

  function stopMusic() {
    musicPlaying = false;
    ytPendingPlay = false;
    currentVideoId = null;
    if (ytPlayer && ytReady) {
      try { ytPlayer.stopVideo(); } catch (_) {}
    }
    els.player?.classList.remove("is-visible", "is-playing", "playlist-open");
    els.tracks?.classList.remove("is-active");
    syncMusicUI();
  }

  function cueCurrentTrack() {
    const id = getVideoId(getCurrentTrack());
    if (!id || !ytPlayer || !ytReady || currentVideoId === id) return;
    currentVideoId = id;
    ytPlayer.cueVideoById(id);
  }

  function playCurrentTrack() {
    const id = getVideoId(getCurrentTrack());
    if (!id) return;

    els.player?.classList.add("is-visible");

    if (!ytReady || !ytPlayer) {
      ytPendingPlay = true;
      syncMusicUI();
      return;
    }

    if (currentVideoId !== id) {
      currentVideoId = id;
      ytPlayer.loadVideoById(id);
    } else {
      ytPlayer.playVideo();
    }

    musicPlaying = true;
    syncMusicUI();
  }

  function pauseCurrentTrack() {
    if (ytPlayer && ytReady) ytPlayer.pauseVideo();
    musicPlaying = false;
    syncMusicUI();
  }

  function setTrack(index, autoPlay = true) {
    const tracks = getTracks();
    if (!tracks.length) {
      els.player?.classList.remove("is-visible");
      return;
    }

    musicIndex = (index + tracks.length) % tracks.length;
    const track = tracks[musicIndex];
    const videoId = getVideoId(track);

    els.player?.classList.add("is-visible");
    els.musicTitle.textContent = track.title;
    els.art.src = stories[storyIndex]?.images?.[0] || "assets/img/Hero.JPEG";
    els.play.dataset.url = videoId
      ? `https://music.youtube.com/watch?v=${videoId}`
      : "https://music.youtube.com/";

    renderPlaylist();
    autoPlay ? playCurrentTrack() : cueCurrentTrack();
  }

  function stepTrack(direction) {
    setTrack(musicIndex + direction, true);
  }

  function openMusic() {
    window.open(
      els.play?.dataset.url || "https://music.youtube.com/",
      "_blank",
      "noopener,noreferrer"
    );
  }

  function updateStoryText(story) {
    els.profession.textContent = story.profession || "";
    els.name.textContent = story.name || "";
    els.quote.textContent = story.quote ? `“${story.quote}”` : "";
    els.location.textContent = story.location || "";
  }

  function updateAlternatePhotoUI(story) {
    const count = story.images?.length || 0;
    imageIndex = Math.min(imageIndex, Math.max(0, count - 1));
    if (els.altView) els.altView.hidden = count < 2;
    if (els.altCount) {
      els.altCount.textContent = count >= 2
        ? `${String(imageIndex + 1).padStart(2, "0")} / ${String(count).padStart(2, "0")}`
        : "";
    }
  }

  function renderThumbs() {
    if (!els.thumbs) return;

    els.thumbs.innerHTML = stories.map((story, index) => `
      <button class="story-thumb${index === storyIndex ? " is-active" : ""}"
              type="button"
              data-story-index="${index}"
              aria-label="View ${escapeHTML(story.name)}">
        <img loading="lazy" decoding="async" src="${escapeHTML(story.images?.[0] || "")}" alt="">
        <span>${String(index + 1).padStart(2, "0")}</span>
      </button>`).join("");

    els.thumbs.querySelectorAll("[data-story-index]").forEach((button) => {
      button.addEventListener("click", () => showStory(Number(button.dataset.storyIndex)));
    });

    els.thumbs
      .querySelector(`[data-story-index="${storyIndex}"]`)
      ?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }

  function renderPlaylist() {
    if (!els.playlist) return;

    const tracks = getTracks();
    els.playlist.innerHTML = `
      <div class="playlist-head">
        <span>Playlist</span>
        <span>${tracks.length} tracks</span>
      </div>
      ${tracks.map((track, index) => `
        <button class="playlist-row${index === musicIndex ? " is-current" : ""}"
                type="button" data-track-index="${index}">
          <span class="playlist-number">${String(index + 1).padStart(2, "0")}</span>
          <span class="playlist-dot"></span>
          <span class="playlist-title">${escapeHTML(track.title)}</span>
        </button>`).join("")}`;

    els.playlist.querySelectorAll("[data-track-index]").forEach((button) => {
      button.addEventListener("click", () => {
        const wasPlaying = musicPlaying;
        setTrack(Number(button.dataset.trackIndex), wasPlaying);
      });
    });
  }

  function showImage(src, animate = true) {
    if (!src) return;
    window.clearTimeout(imageTimer);

    const previous = els.media.querySelector("img");
    const next = document.createElement("img");
    const story = stories[storyIndex];

    next.src = src;
    next.alt = `${story.name}'s table in ${story.location}`;
    next.decoding = "async";
    next.fetchPriority = "high";
    next.className = animate ? "is-new" : "is-visible";

    els.media.appendChild(next);

    if (animate) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => next.classList.add("is-visible"));
      });

      if (previous) {
        previous.classList.add("is-old");
        imageTimer = window.setTimeout(() => previous.remove(), 850);
      }
    }
  }

  function triggerCinematic() {
    els.media.classList.remove("cinematic-flash");
    void els.media.offsetWidth;
    els.media.classList.add("cinematic-flash");
    window.clearTimeout(cinematicTimer);
    cinematicTimer = window.setTimeout(() => {
      els.media.classList.remove("cinematic-flash");
    }, 980);
  }

  function showStory(index) {
    storyIndex = (index + stories.length) % stories.length;
    imageIndex = 0;
    musicIndex = 0;

    const story = stories[storyIndex];
    updateStoryText(story);
    updateAlternatePhotoUI(story);

    els.media.querySelectorAll("img").forEach((image) => image.remove());
    showImage(story.images?.[0], false);
    renderThumbs();
    setTrack(0, false);
    triggerCinematic();
  }

  function showAlternateImage() {
    const story = stories[storyIndex];
    if (!story?.images || story.images.length < 2) return;

    imageIndex = (imageIndex + 1) % story.images.length;
    if (els.altCount) {
      els.altCount.textContent = `${String(imageIndex + 1).padStart(2, "0")} / ${String(story.images.length).padStart(2, "0")}`;
    }

    showImage(story.images[imageIndex], true);
    triggerCinematic();
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

  function setupControls() {
    els.explore?.addEventListener("click", enterStories);
    els.home?.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      leaveStories();
    });

    document.querySelectorAll("[data-slide]").forEach((button) => {
      button.addEventListener("click", () => {
        showStory(storyIndex + Number(button.dataset.slide));
      });
    });

    els.altView?.addEventListener("click", showAlternateImage);
    els.prev?.addEventListener("click", () => stepTrack(-1));
    els.next?.addEventListener("click", () => stepTrack(1));
    els.play?.addEventListener("click", () => {
      musicPlaying ? pauseCurrentTrack() : playCurrentTrack();
    });
    els.open?.addEventListener("click", openMusic);
  }

  function setupPlaylist() {
    if (!els.tracks || !els.playlist || !els.player) return;

    const open = () => {
      renderPlaylist();
      els.player.classList.add("playlist-open");
      els.tracks.classList.add("is-active");
    };

    const close = () => {
      els.player.classList.remove("playlist-open");
      els.tracks.classList.remove("is-active");
    };

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
    if (!els.about || !els.aboutBackdrop) return;

    const close = () => {
      els.aboutBackdrop.classList.remove("is-open");
      els.aboutBackdrop.setAttribute("aria-hidden", "true");
    };

    els.about.addEventListener("click", () => {
      els.aboutBackdrop.classList.add("is-open");
      els.aboutBackdrop.setAttribute("aria-hidden", "false");
    });
    els.aboutClose?.addEventListener("click", close);
    els.aboutBackdrop.addEventListener("click", (event) => {
      if (event.target === els.aboutBackdrop) close();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && els.aboutBackdrop.classList.contains("is-open")) close();
    });
  }

  function setupKeyboard() {
    document.addEventListener("keydown", (event) => {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey || event.isComposing) return;
      const target = event.target;
      if (target?.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target?.tagName)) return;
      if (!els.body.classList.contains("is-stories")) return;

      switch (event.code) {
        case "ArrowLeft":
          event.preventDefault();
          showStory(storyIndex - 1);
          break;
        case "ArrowRight":
          event.preventDefault();
          showStory(storyIndex + 1);
          break;
        case "Space":
          event.preventDefault();
          els.play?.click();
          break;
        case "ArrowUp":
          event.preventDefault();
          els.prev?.click();
          break;
        case "ArrowDown":
          event.preventDefault();
          els.next?.click();
          break;
        case "Escape":
          event.preventDefault();
          leaveStories();
          break;
        default:
          return;
      }
      flashKeyboardHint();
    }, true);
  }

  function flashKeyboardHint() {
    if (!els.keyboardHint) return;
    els.keyboardHint.classList.add("is-active");
    window.clearTimeout(flashKeyboardHint.timer);
    flashKeyboardHint.timer = window.setTimeout(() => {
      els.keyboardHint.classList.remove("is-active");
    }, 1800);
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

  function setupParallax() {
    els.media.classList.add("is-parallax");

    els.media.addEventListener("pointermove", (event) => {
      if (event.pointerType === "touch" || window.innerWidth < 801) return;

      window.cancelAnimationFrame(pointerFrame);
      pointerFrame = window.requestAnimationFrame(() => {
        const rect = els.media.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width - 0.5) * 10;
        const y = ((event.clientY - rect.top) / rect.height - 0.5) * 7;
        els.media.style.setProperty("--px", `${x.toFixed(2)}px`);
        els.media.style.setProperty("--py", `${y.toFixed(2)}px`);
      });
    });

    els.media.addEventListener("pointerleave", () => {
      els.media.style.setProperty("--px", "0px");
      els.media.style.setProperty("--py", "0px");
    });
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

  function setupYouTube() {
    window.onYouTubeIframeAPIReady = () => {
      if (!window.YT?.Player || ytPlayer) return;

      ytPlayer = new YT.Player("yt-audio-engine", {
        width: "1",
        height: "1",
        videoId: "",
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          iv_load_policy: 3,
          playsinline: 1,
          rel: 0
        },
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
              syncMusicUI();
            } else if (event.data === YT.PlayerState.PAUSED) {
              musicPlaying = false;
              syncMusicUI();
            } else if (event.data === YT.PlayerState.ENDED) {
              stepTrack(1);
            }
          },
          onError() {
            musicPlaying = false;
            syncMusicUI();
          }
        }
      });
    };

    if (window.YT?.Player) window.onYouTubeIframeAPIReady();
  }

  function ready() {
    els.body.classList.remove("is-loading");
  }

  function init() {
    setupControls();
    setupPlaylist();
    setupAbout();
    setupKeyboard();
    setupGestures();
    setupParallax();
    preloadStoryImages();
    setupYouTube();
    renderThumbs();
    showStory(0);
    ready();
  }

  document.readyState === "loading"
    ? document.addEventListener("DOMContentLoaded", init, { once: true })
    : init();
})();
