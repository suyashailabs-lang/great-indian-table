/*
 * Great Indian Table — application controller
 *
 * This file owns the interactive behaviour of the single-page experience:
 * - story navigation
 * - story photo transitions
 * - parallax motion
 * - alternate-photo cinematic effect
 * - YouTube-based music playback
 * - playlist controls
 * - keyboard / wheel / touch navigation
 * - About modal
 *
 * The content itself lives in stories.js and music.js.
 */
(() => {
  "use strict";

  // ---------------------------------------------------------------------------
  // DATA + DOM REFERENCES
  // ---------------------------------------------------------------------------

  // Story and playlist data are deliberately kept outside this controller.
  const stories = Array.isArray(window.STORIES) ? window.STORIES : [];
  const music = window.PROFESSION_MUSIC || {};
  const $ = (id) => document.getElementById(id);

  // Cache the DOM nodes once so the rest of the controller stays readable.
  const els = {
    body: document.body,
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

  // Abort safely if the required story viewer markup is missing.
  if (!stories.length || !els.media) return;

  // ---------------------------------------------------------------------------
  // APPLICATION STATE
  // ---------------------------------------------------------------------------

  let storyIndex = 0;          // Which profession/story is currently visible.
  let imageIndex = 0;          // Which photo inside that story is visible.
  let musicIndex = 0;          // Which playlist track is selected.

  let imageTimer = 0;          // Removes the outgoing image after its fade.
  let cinematicTimer = 0;      // Removes the alternate-photo cinematic class.

  // YouTube player state.
  let ytPlayer = null;
  let ytReady = false;
  let ytPendingPlay = false;
  let currentVideoId = null;
  let musicPlaying = false;

  // Input throttling state.
  let wheelLockedUntil = 0;
  let touchStartY = 0;
  let pointerFrame = 0;

  // ---------------------------------------------------------------------------
  // SMALL HELPERS
  // ---------------------------------------------------------------------------

  // Story data contains text that is inserted into HTML attributes when the
  // thumbnail strip is rendered, so escape those values first.
  const escapeHTML = (value) => String(value ?? "").replace(/[&<>\"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '\"': "&quot;",
    "'": "&#39;"
  })[char]);

  // A profession is the key shared by stories.js and music.js.
  const getTracks = () => music[stories[storyIndex]?.profession] || [];

  // Convert the YouTube URLs stored in music.js into the ID the player API uses.
  const getVideoId = (track) => {
    const url = track?.url || "";
    return url.match(/(?:embed\/|watch\?v=)([\w-]{6,})/)?.[1] || null;
  };

  const getCurrentTrack = () => {
    const tracks = getTracks();
    return tracks[musicIndex] || tracks[0] || null;
  };

  // ---------------------------------------------------------------------------
  // MUSIC ENGINE
  // ---------------------------------------------------------------------------

  function syncMusicUI() {
    // Keep the visual player in sync with our playback state.
    if (!els.player || !els.play) return;
    els.player.classList.add("is-visible");
    els.player.classList.toggle("is-playing", musicPlaying);
    els.play.textContent = musicPlaying ? "❚❚" : "▶";
    els.play.setAttribute("aria-label", musicPlaying ? "Pause music" : "Play music");
  }

  function stopMusic() {
    // Stop YouTube playback and clear the controller state.
    musicPlaying = false;
    ytPendingPlay = false;
    currentVideoId = null;

    if (ytPlayer && ytReady) {
      try { ytPlayer.stopVideo(); } catch (_) {}
    }

    els.player?.classList.remove("is-visible", "is-playing", "playlist-open");
    els.tracks?.classList.remove("is-active");
  }

  function cueCurrentTrack() {
    // Cue means "prepare this track" without starting playback.
    const id = getVideoId(getCurrentTrack());
    if (!id || !ytPlayer || !ytReady || currentVideoId === id) return;

    currentVideoId = id;
    ytPlayer.cueVideoById(id);
  }

  function playCurrentTrack() {
    // This is the single path used whenever a track must actually start.
    const id = getVideoId(getCurrentTrack());
    if (!id) return;

    els.player?.classList.add("is-visible");

    // The story can be changed before the YouTube API has finished loading.
    // Remember the intent and honour it from onReady().
    if (!ytReady || !ytPlayer) {
      ytPendingPlay = true;
      musicPlaying = true;
      syncMusicUI();
      return;
    }

    // IMPORTANT: switching stories uses this function directly rather than
    // cueing first and trying to play afterwards. That avoids a race between
    // cueVideoById() and load/play when the user changes stories quickly.
    if (currentVideoId !== id) {
      currentVideoId = id;
      ytPlayer.loadVideoById(id);
      ytPlayer.playVideo();
    } else {
      ytPlayer.playVideo();
    }

    musicPlaying = true;
    syncMusicUI();
  }

  function pauseCurrentTrack() {
    // Pause, but keep the selected track so the user can resume it.
    if (ytPlayer && ytReady) ytPlayer.pauseVideo();
    musicPlaying = false;
    syncMusicUI();
  }

  function setTrack(index, autoPlay = true) {
    // Normalise the index so previous/next wrap around the playlist.
    const tracks = getTracks();
    if (!tracks.length) {
      els.player?.classList.remove("is-visible");
      return;
    }

    musicIndex = (index + tracks.length) % tracks.length;
    const track = tracks[musicIndex];
    const videoId = getVideoId(track);

    // Update the player chrome before changing playback.
    els.player?.classList.add("is-visible");
    if (els.musicTitle) els.musicTitle.textContent = track.title;
    if (els.art) els.art.src = stories[storyIndex]?.images?.[0] || "assets/img/Hero.JPEG";
    if (els.play) {
      els.play.dataset.url = videoId
        ? `https://music.youtube.com/watch?v=${videoId}`
        : "https://music.youtube.com/";
    }

    renderPlaylist();

    // autoPlay=false is used for an intentionally paused story state.
    autoPlay ? playCurrentTrack() : cueCurrentTrack();
  }

  function stepTrack(direction) {
    // Used by next/previous buttons and by automatic track advance.
    setTrack(musicIndex + direction, true);
  }

  function openMusic() {
    window.open(
      els.play?.dataset.url || "https://music.youtube.com/",
      "_blank",
      "noopener,noreferrer"
    );
  }

  // ---------------------------------------------------------------------------
  // STORY TEXT + PHOTO UI
  // ---------------------------------------------------------------------------

  function updateStoryText(story) {
    // Keep text updates separate from photo/music updates.
    els.profession.textContent = story.profession || "";
    els.name.textContent = story.name || "";
    els.quote.textContent = story.quote ? `“${story.quote}”` : "";
    els.location.textContent = story.location || "";
  }

  function updateAlternatePhotoUI(story) {
    // Hide the alternate-photo button for stories that have only one image.
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
    // Rebuild the bottom story selector whenever the active story changes.
    if (!els.thumbs) return;

    els.thumbs.innerHTML = stories.map((story, index) => `
      <button class="story-thumb${index === storyIndex ? " is-active" : ""}"
              type="button"
              data-story-index="${index}"
              aria-label="View ${escapeHTML(story.name)}">
        <img loading="lazy" decoding="async" src="${escapeHTML(story.images?.[0] || "")}" alt="">
        <span>${String(index + 1).padStart(2, "0")}</span>
      </button>`).join("");

    // Each thumbnail becomes a normal story-navigation control.
    els.thumbs.querySelectorAll("[data-story-index]").forEach((button) => {
      button.addEventListener("click", () => showStory(Number(button.dataset.storyIndex)));
    });

    // Keep the selected thumbnail centred when the strip is horizontally scrollable.
    els.thumbs
      .querySelector(`[data-story-index="${storyIndex}"]`)
      ?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }

  function renderPlaylist() {
    // The playlist is rebuilt because each story owns a different music list.
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
        // Preserve the current play/pause intent when selecting a different track.
        setTrack(Number(button.dataset.trackIndex), musicPlaying);
      });
    });
  }

  // ---------------------------------------------------------------------------
  // PHOTO TRANSITIONS
  // ---------------------------------------------------------------------------

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

    if (!animate) return;

    // Two animation frames ensure the browser paints the initial state first,
    // then transitions the new image into place.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => next.classList.add("is-visible"));
    });

    if (previous) {
      previous.classList.add("is-old");
      imageTimer = window.setTimeout(() => previous.remove(), 850);
    }
  }

  function triggerCinematic() {
    // This effect is intentionally reserved for changing photos INSIDE a story.
    // Story-to-story navigation does not call it, so there is no flash between stories.
    els.media.classList.remove("cinematic-flash");
    void els.media.offsetWidth; // Force reflow so the same animation can restart.
    els.media.classList.add("cinematic-flash");

    window.clearTimeout(cinematicTimer);
    cinematicTimer = window.setTimeout(() => {
      els.media.classList.remove("cinematic-flash");
    }, 980);
  }

  function showAlternateImage() {
    // Cycle through the photos belonging to the current story.
    const story = stories[storyIndex];
    if (!story?.images || story.images.length < 2) return;

    imageIndex = (imageIndex + 1) % story.images.length;
    updateAlternatePhotoUI(story);

    // Alternate-photo changes get the cinematic treatment; story changes do not.
    showImage(story.images[imageIndex], true);
    triggerCinematic();
  }

  function showStory(index) {
    // Capture the playback intent BEFORE changing the story or loading its next track.
    // musicPlaying represents what the user was listening to, so a story switch
    // should follow that same intent.
    const shouldKeepPlaying = musicPlaying;

    storyIndex = (index + stories.length) % stories.length;
    imageIndex = 0;
    musicIndex = 0;

    const story = stories[storyIndex];
    updateStoryText(story);
    updateAlternatePhotoUI(story);

    // Story changes are deliberately clean: replace the main photo without the
    // cinematic flash. The cinematic effect is only for the alternate photo.
    els.media.querySelectorAll("img").forEach((image) => image.remove());
    showImage(story.images?.[0], false);
    renderThumbs();

    // Load the first track for the new story. Do NOT autoplay here yet if the
    // previous story was paused.
    setTrack(0, shouldKeepPlaying);
  }

  // ---------------------------------------------------------------------------
  // ENTER / EXIT STORY VIEW
  // ---------------------------------------------------------------------------

  function enterStories() {
    els.body.classList.add("is-stories");
    showStory(0);

    // First entry is an explicit user gesture, so start the first story's music.
    playCurrentTrack();
  }

  function leaveStories() {
    stopMusic();
    els.body.classList.remove("is-stories");
  }

  // ---------------------------------------------------------------------------
  // MOUSE / BUTTON CONTROLS
  // ---------------------------------------------------------------------------

  function setupControls() {
    els.explore?.addEventListener("click", enterStories);

    // The archive intro is a pointer-events:none visual layer; stop the click
    // from bubbling and explicitly route Home back to the hero.
    els.home?.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      leaveStories();
    });

    // Desktop left/right story arrows.
    document.querySelectorAll("[data-slide]").forEach((button) => {
      button.addEventListener("click", () => {
        showStory(storyIndex + Number(button.dataset.slide));
      });
    });

    // Alternate-photo button and music controls.
    els.altView?.addEventListener("click", showAlternateImage);
    els.prev?.addEventListener("click", () => stepTrack(-1));
    els.next?.addEventListener("click", () => stepTrack(1));
    els.play?.addEventListener("click", () => {
      musicPlaying ? pauseCurrentTrack() : playCurrentTrack();
    });
    els.open?.addEventListener("click", openMusic);
  }

  // ---------------------------------------------------------------------------
  // PLAYLIST OPEN / CLOSE BEHAVIOUR
  // ---------------------------------------------------------------------------

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

  // ---------------------------------------------------------------------------
  // ABOUT MODAL
  // ---------------------------------------------------------------------------

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

  // ---------------------------------------------------------------------------
  // KEYBOARD NAVIGATION
  // ---------------------------------------------------------------------------

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

  // ---------------------------------------------------------------------------
  // WHEEL + TOUCH STORY NAVIGATION
  // ---------------------------------------------------------------------------

  function setupGestures() {
    document.addEventListener("wheel", (event) => {
      if (!els.body.classList.contains("is-stories")) return;
      if (Date.now() < wheelLockedUntil || Math.abs(event.deltaY) < 18) return;

      wheelLockedUntil = Date.now() + 700;
      showStory(storyIndex + (event.deltaY > 0 ? 1 : -1));
    }, { passive: true });

    document.addEventListener("touchstart", (event) => {
      if (els.body.classList.contains("is-stories")) {
        touchStartY = event.changedTouches[0].clientY;
      }
    }, { passive: true });

    document.addEventListener("touchend", (event) => {
      if (!els.body.classList.contains("is-stories")) return;

      const distance = touchStartY - event.changedTouches[0].clientY;
      if (Math.abs(distance) > 45) {
        showStory(storyIndex + (distance > 0 ? 1 : -1));
      }
    }, { passive: true });
  }

  // ---------------------------------------------------------------------------
  // POINTER PARALLAX
  // ---------------------------------------------------------------------------

  function setupParallax() {
    // The CSS already handles the image transform. JavaScript only calculates
    // the pointer offset and writes it to the shared --px / --py variables.
    els.media.classList.add("is-parallax");

    els.media.addEventListener("pointermove", (event) => {
      // Avoid unnecessary pointer work on touch devices and small screens.
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

  // ---------------------------------------------------------------------------
  // IMAGE PRELOADING
  // ---------------------------------------------------------------------------

  function preloadStoryImages() {
    // Preload the first few stories so navigation feels immediate.
    const urls = [...new Set(stories.slice(0, 3).flatMap((story) => story.images || []))];

    urls.forEach((src) => {
      const image = new Image();
      image.decoding = "async";
      image.fetchPriority = "high";
      image.src = src;
    });
  }

  // ---------------------------------------------------------------------------
  // YOUTUBE PLAYER INITIALISATION
  // ---------------------------------------------------------------------------

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

            // Honour a play request that happened before the API was ready.
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
              // Finish one track -> automatically move to the next track.
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

    // The API may already exist if this script is initialised after the iframe API.
    if (window.YT?.Player) window.onYouTubeIframeAPIReady();
  }

  // ---------------------------------------------------------------------------
  // STARTUP
  // ---------------------------------------------------------------------------

  function ready() {
    // Prevent the homepage copy from flashing before the app has initialised.
    els.body.classList.remove("is-loading");
  }

  function init() {
    // Initialise each independent subsystem once.
    setupControls();
    setupPlaylist();
    setupAbout();
    setupKeyboard();
    setupGestures();
    setupParallax();
    preloadStoryImages();
    setupYouTube();

    // Render the initial story in the DOM, but do not start music until the
    // visitor explicitly enters the story experience.
    renderThumbs();
    showStory(0);
    ready();
  }

  // Support both script placement strategies: before or after DOMContentLoaded.
  document.readyState === "loading"
    ? document.addEventListener("DOMContentLoaded", init, { once: true })
    : init();
})();
