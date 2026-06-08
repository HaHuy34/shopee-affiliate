// =========================
fetch("/api/visit");
// VIDEO DATA
// =========================
const videoData = {
  "Dragon Ball (1986)": [],
  "Dragon Ball Z (1989)": [
    {
      name: "Tập 136",
      src: "https://www.dailymotion.com/embed/video/k5cRz1VQSNtbPXGvJqS",
    },
    {
      name: "Tập 137",
      src: "https://www.dailymotion.com/embed/video/k5VVLvT6xuW6G2GvJqO",
    },
    {
      name: "Tập 138",
      src: "https://www.dailymotion.com/embed/video/k4NkW9BLmNnnf6GvOls",
    },
  ],
  "Dragon Ball Super (2015)": [],
  "Dragon Ball GT / Daima": [],
};

// =========================
// SHOPEE LINKS
// =========================
const shopeeLinks = {
  "Dragon Ball (1986)": "https://s.shopee.vn/1gG50bIPVR",
  "Dragon Ball Z (1989)": "https://s.shopee.vn/70HbMQ5oaE",
  "Dragon Ball Super (2015)": "https://s.shopee.vn/4VaGNqAb5r",
  "Dragon Ball GT / Daima": "https://s.shopee.vn/7KuRl3r9pZ",
};

// =========================
// STATE
// =========================
let currentIndex = 0;
let slides = [];

// =========================
// DOM READY
// =========================
document.addEventListener("DOMContentLoaded", () => {
  const timelineItems = document.querySelectorAll(".timeline-content");

  // Tự động gắn badge "New" nhấp nháy cho các phần có chứa video
  timelineItems.forEach((item) => {
    const series = item.getAttribute("data-series");
    if (videoData[series] && videoData[series].length > 0) {
      const h4 = item.querySelector("h4");
      if (h4) {
        const badge = document.createElement("span");
        badge.className = "badge-new";
        badge.textContent = "New";
        h4.appendChild(badge);
      }
    }
  });

  const modal = document.getElementById("videoModal");
  const modalContent = document.querySelector(".modal-content");
  const sliderContainer = document.getElementById("sliderContainer");
  const episodeList = document.getElementById("episodeList");
  const closeBtn = document.getElementById("closeModal");
  const overlay = document.querySelector(".modal-overlay");

  const nextBtn = document.getElementById("nextBtn");
  const prevBtn = document.getElementById("prevBtn");

  const musicBtn = document.getElementById("musicToggleBtn");
  const bgMusic = document.getElementById("bgMusic");

  const suggestionBox = document.getElementById("suggestionBox");
  const suggestionNextBtn = document.getElementById("suggestionNextBtn");
  const suggestionCloseBtn = document.getElementById("suggestionCloseBtn");

  let isPlaying = false;
  let hasInteracted = false;
  let navTimeout;

  // =========================
  // GỢI Ý VIDEO TRƯỚC KHI HẾT 3 PHÚT & AUTO HIDE NAV
  // =========================
  function showNavButtons() {
    if (prevBtn) {
      prevBtn.style.opacity = currentIndex === 0 ? "0" : "1";
      prevBtn.style.pointerEvents = currentIndex === 0 ? "none" : "auto";
    }
    if (nextBtn) {
      nextBtn.style.opacity = currentIndex === slides.length - 1 ? "0" : "1";
      nextBtn.style.pointerEvents =
        currentIndex === slides.length - 1 ? "none" : "auto";
    }

    clearTimeout(navTimeout);
    navTimeout = setTimeout(() => {
      if (prevBtn) {
        prevBtn.style.opacity = "0";
        prevBtn.style.pointerEvents = "none";
      }
      if (nextBtn) {
        nextBtn.style.opacity = "0";
        nextBtn.style.pointerEvents = "none";
      }
    }, 3000);
  }

  if (modalContent) {
    modalContent.addEventListener("mousemove", showNavButtons);
    modalContent.addEventListener("click", showNavButtons);
    modalContent.addEventListener("touchstart", showNavButtons);
  }

  function showSuggestion() {
    if (suggestionBox) suggestionBox.classList.remove("hidden");
  }

  function hideSuggestion() {
    if (suggestionBox) suggestionBox.classList.add("hidden");
  }

  suggestionNextBtn?.addEventListener("click", () => {
    hideSuggestion();
    if (currentIndex < slides.length - 1) {
      currentIndex++;
      updateSlide(true);
    }
  });

  suggestionCloseBtn?.addEventListener("click", () => {
    hideSuggestion();
    const currentIframe = slides[currentIndex]?.querySelector("iframe");
    if (currentIframe) currentIframe._suggestionDismissed = true;
  });

  // Giao tiếp với iframe Dailymotion để lấy thời gian
  window.addEventListener("message", (event) => {
    if (!event.origin.includes("dailymotion.com")) return;
    try {
      const data =
        typeof event.data === "string" ? JSON.parse(event.data) : event.data;
      if (!data.id) return;

      const iframe = document.getElementById(data.id);
      if (!iframe) return;

      if (data.event === "durationchange") {
        iframe._duration = data.duration;
      }

      if (data.event === "timeupdate") {
        const currentTime = data.time;
        const slideIndex = Array.from(slides).findIndex((s) =>
          s.contains(iframe),
        );

        if (slideIndex === currentIndex && slideIndex < slides.length - 1) {
          const duration = iframe._duration || 0;
          const remaining = duration - currentTime;

          if (
            remaining > 0 &&
            remaining <= 180 &&
            !iframe._suggestionDismissed
          ) {
            if (!iframe._suggestionShown) {
              iframe._suggestionShown = true;
              showSuggestion();
            }
          } else if (remaining > 180) {
            iframe._suggestionShown = false;
            hideSuggestion();
          }
        }
      }

      if (data.event === "video_end" || data.event === "end") {
        hideSuggestion();
        const slideIndex = Array.from(slides).findIndex((s) =>
          s.contains(iframe),
        );
        if (slideIndex === currentIndex && slideIndex < slides.length - 1) {
          currentIndex++;
          updateSlide(true);
        }
      }
    } catch (e) {}
  });

  // =========================
  // OPEN MODAL
  // =========================
  function openModal(series) {
    sliderContainer.innerHTML = "";
    if (episodeList) episodeList.innerHTML = "";
    sliderContainer.style.transform = `translateX(0%)`;
    hideSuggestion();

    const videos = videoData[series] || [];

    if (videos.length === 0) {
      alert("Chưa có video cho phần này!");
      return;
    }

    videos.forEach((v, index) => {
      const slide = document.createElement("div");
      slide.className = "slide";

      const title = document.createElement("div");
      title.className = "video-title";
      title.textContent = `${series} - ${v.name}`;

      const iframeId = `dm-iframe-${Date.now()}-${index}`;
      const iframe = document.createElement("iframe");

      iframe.id = iframeId;
      let srcUrl = v.src;
      if (!srcUrl.includes("api=")) {
        srcUrl +=
          (srcUrl.includes("?") ? "&" : "?") +
          `api=1&id=${iframeId}&autoplay=0`;
      }
      iframe.src = srcUrl;
      iframe.dataset.src = srcUrl;

      iframe._suggestionShown = false;
      iframe._suggestionDismissed = false;
      iframe._duration = 0;

      iframe.width = "100%";
      iframe.height = "500";
      iframe.frameBorder = "0";
      iframe.allow = "autoplay; fullscreen; picture-in-picture";
      iframe.allowFullscreen = true;
      iframe.className = "dailymotion-iframe";

      slide.appendChild(title);
      slide.appendChild(iframe);
      sliderContainer.appendChild(slide);

      const chip = document.createElement("div");
      chip.className = "episode-chip";
      chip.textContent = "#" + v.name;

      chip.addEventListener("click", () => {
        if (currentIndex !== index) {
          currentIndex = index;
          updateSlide(true);
        }
      });

      episodeList.appendChild(chip);
    });

    slides = document.querySelectorAll(".slide");

    currentIndex = 0;
    updateSlide(false);

    modal.classList.remove("hidden");
    showNavButtons();
  }

  // =========================
  // CLOSE MODAL
  // =========================
  function closeModal() {
    modal.classList.add("hidden");

    document.querySelectorAll("#sliderContainer iframe").forEach((iframe) => {
      iframe.src = "about:blank";
    });
    hideSuggestion();
  }

  closeBtn?.addEventListener("click", closeModal);
  overlay?.addEventListener("click", closeModal);

  // =========================
  // UPDATE SWIPER
  // =========================
  function updateSlide(autoPlay = false) {
    sliderContainer.style.transform = `translateX(-${currentIndex * 100}%)`;

    slides.forEach((slide, i) => {
      const iframe = slide.querySelector("iframe");

      if (i === currentIndex) {
        slide.classList.add("active");

        if (
          iframe &&
          (iframe.src === "about:blank" || iframe.src.endsWith("about:blank"))
        ) {
          if (autoPlay) {
            iframe.src = iframe.dataset.src.replace("autoplay=0", "autoplay=1");
          } else {
            iframe.src = iframe.dataset.src;
          }
        } else if (iframe && autoPlay) {
          iframe.contentWindow?.postMessage(
            JSON.stringify({ command: "play" }),
            "*",
          );
        }
      } else {
        slide.classList.remove("active");

        if (iframe && iframe.src !== "about:blank") {
          iframe.src = "about:blank";
        }
      }
    });

    const chips = episodeList.querySelectorAll(".episode-chip");
    chips.forEach((chip, i) => {
      chip.classList.toggle("active", i === currentIndex);
      if (i === currentIndex) {
        chip.scrollIntoView({
          behavior: "smooth",
          inline: "center",
          block: "nearest",
        });
      }
    });

    showNavButtons();
    hideSuggestion();
  }

  // =========================
  // NEXT / PREV BUTTONS
  // =========================
  nextBtn?.addEventListener("click", () => {
    if (currentIndex < slides.length - 1) {
      currentIndex++;
      updateSlide(true);
    }
  });

  prevBtn?.addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateSlide(true);
    }
  });

  // =========================
  // TIMELINE CLICK
  // =========================
  timelineItems.forEach((item) => {
    item.addEventListener("click", () => {
      const series = item.getAttribute("data-series");
      openModal(series);

      const link = shopeeLinks[series];
      if (link) window.open(link, "_blank");
    });
  });

  // =========================
  // ÂM NHẠC MẶC ĐỊNH
  // =========================
  if (bgMusic) {
    bgMusic.volume = 1.0;
  }

  function updateIcon() {
    if (musicBtn) {
      musicBtn.innerHTML = isPlaying
        ? `<span class="music-icon">⏸</span><span class="music-text"> Pause</span>`
        : `<span class="music-icon">🔊</span><span class="music-text"> Play Background Music</span>`;
    }
  }

  function startMusic() {
    if (bgMusic) {
      bgMusic.currentTime = 3;
      bgMusic
        .play()
        .then(() => {
          isPlaying = true;
          updateIcon();
        })
        .catch(() => {});
    }
  }

  musicBtn?.addEventListener("click", () => {
    hasInteracted = true;
    if (isPlaying) {
      bgMusic?.pause();
      isPlaying = false;
    } else {
      bgMusic?.play();
      isPlaying = true;
    }
    updateIcon();
  });

  updateIcon();
});
