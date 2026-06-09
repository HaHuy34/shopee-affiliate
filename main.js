fetch("/api/visit");
// VIDEO DATA & LINKS
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
    {
      name: "Tập 139",
      src: "https://www.dailymotion.com/embed/video/k6T7DGiiS7nZR7Gwpro",
    },
    {
      name: "Tập 140",
      src: "https://www.dailymotion.com/embed/video/k5MBxrWM2tZAoLGwprs",
    },
    {
      name: "Tập 141",
      src: "https://www.dailymotion.com/embed/video/k11XDJI1Q9nbMUGwprk",
    },
    {
      name: "Tập 142",
      src: "https://www.dailymotion.com/embed/video/k1l4MRTK8Ud7vlGwprg",
    },
    {
      name: "Tập 143",
      src: "https://www.dailymotion.com/embed/video/k7H0Cbi2Ar54iAGwprc",
    },
    ...Array.from({ length: 26 }, (_, i) => ({
      name: `Tập ${144 + i}`,
      src: "",
    })),
  ],
  "Dragon Ball Super (2015)": [],
  "Dragon Ball GT / Daima": [],
};

const shopeeLinks = {
  "Dragon Ball (1986)": "https://s.shopee.vn/1gG50bIPVR",
  "Dragon Ball Z (1989)": "https://s.shopee.vn/70HbMQ5oaE",
  "Dragon Ball Super (2015)": "https://s.shopee.vn/4VaGNqAb5r",
  "Dragon Ball GT / Daima": "https://s.shopee.vn/7KuRl3r9pZ",
};

document.addEventListener("DOMContentLoaded", () => {
  // Theme Toggle
  const themeBtn = document.getElementById("themeToggle");
  const currentTheme = localStorage.getItem("theme") || "dark";
  if (currentTheme === "light") {
    document.documentElement.setAttribute("data-theme", "light");
  }
  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme");
      if (current === "light") {
        document.documentElement.removeAttribute("data-theme");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.setAttribute("data-theme", "light");
        localStorage.setItem("theme", "light");
      }
    });
  }

  // 1. Scroll Events & Back To Top & Header Blur
  const header = document.getElementById("mainHeader");
  const bttBtn = document.getElementById("backToTop");

  function handleScroll() {
    const scrollY = window.scrollY;
    if (header) {
      if (scrollY > 50) header.classList.add("scrolled");
      else header.classList.remove("scrolled");
    }
    if (bttBtn) {
      if (scrollY > 500) bttBtn.classList.add("show");
      else bttBtn.classList.remove("show");
    }
  }
  window.addEventListener("scroll", handleScroll);
  handleScroll();

  if (bttBtn) {
    bttBtn.onclick = () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    };
  }

  // 2. Timeline & Modal Logic
  const timelineItems = document.querySelectorAll(".timeline-content");
  const modal = document.getElementById("videoModal");
  const modalContent = document.querySelector(".modal-content");
  const sliderContainer = document.getElementById("sliderContainer");
  const episodeList = document.getElementById("episodeList");
  const closeBtn = document.getElementById("closeModal");
  const overlay = document.querySelector(".modal-overlay");

  const nextBtn = document.getElementById("nextBtn");
  const prevBtn = document.getElementById("prevBtn");

  const suggestionBox = document.getElementById("suggestionBox");
  const suggestionNextBtn = document.getElementById("suggestionNextBtn");
  const suggestionCloseBtn = document.getElementById("suggestionCloseBtn");

  let currentIndex = 0;
  let slides = [];
  let navTimeout;

  // Attach "New" badges dynamically
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

  // Auto-hide Nav Buttons
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
      if (prevBtn) prevBtn.style.opacity = "0";
      if (nextBtn) nextBtn.style.opacity = "0";
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

  // Dailymotion window messages
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

      // End event navigates next
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

  function openModal(series, startIndex = 0) {
    sliderContainer.innerHTML = "";
    sliderContainer.style.transform = "translateX(0%)";
    hideSuggestion();

    let videos = videoData[series] || [];
    videos = videos.filter((v) => v.src && v.src.trim() !== "");

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

      slide.appendChild(title);
      slide.appendChild(iframe);
      sliderContainer.appendChild(slide);
    });

    slides = document.querySelectorAll(".slide");
    currentIndex = startIndex;
    updateSlide(true);

    modal.classList.remove("hidden");
    showNavButtons();
  }

  function closeModal() {
    modal.classList.add("hidden");
    document.querySelectorAll("#sliderContainer iframe").forEach((iframe) => {
      iframe.src = "about:blank";
    });
    hideSuggestion();
  }

  closeBtn?.addEventListener("click", closeModal);
  overlay?.addEventListener("click", closeModal);

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

    showNavButtons();
    hideSuggestion();
  }

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

  // timelineItems.forEach((item) => {
  //   item.addEventListener("click", () => {
  //     const series = item.getAttribute("data-series");
  //     window.location.href = `episodes.html?series=${encodeURIComponent(series)}`;

  //     const link = shopeeLinks[series];
  //     if (link) window.open(link, "_blank");
  //   });
  // });

  timelineItems.forEach((item) => {
    item.addEventListener("click", () => {
      const series = item.getAttribute("data-series");
      const link = shopeeLinks[series];

      if (link) window.open(link, "_blank");

      setTimeout(() => {
        window.location.href = `episodes.html?series=${encodeURIComponent(series)}`;
      }, 100);
    });
  });

  const grid = document.getElementById("episodeGrid");
  if (grid) {
    const urlParams = new URLSearchParams(window.location.search);
    const series = urlParams.get("series") || "Dragon Ball Z (1989)";

    const seriesTitle = document.getElementById("seriesTitle");
    if (seriesTitle) seriesTitle.textContent = series;

    let epCount = 291;
    if (series === "Dragon Ball (1986)") epCount = 153;
    if (series === "Dragon Ball Super (2015)") epCount = 131;
    if (series === "Dragon Ball GT / Daima") epCount = 64;

    const epCountEl = document.getElementById("epCount");
    if (epCountEl) epCountEl.textContent = `${epCount} Tập`;

    grid.innerHTML = "";
    const allVideos = videoData[series] || [];
    const validVideos = allVideos.filter((v) => v.src && v.src.trim() !== "");
    const latestAvailable =
      validVideos.length > 0
        ? Math.max(
            ...validVideos.map((v) => parseInt(v.name.replace(/\D/g, "")) || 0),
          )
        : 0;

    for (let i = 1; i <= epCount; i++) {
      const btn = document.createElement("button");
      const epNumStr = String(i).padStart(2, "0");
      const epName = `Tập ${i}`;
      const epNamePadded = `Tập ${epNumStr}`;

      const videoObj = allVideos.find(
        (v) =>
          v.name === epName || v.name === epNamePadded || v.name === String(i),
      );
      const hasVideo = videoObj && videoObj.src && videoObj.src.trim() !== "";
      const isLatest = latestAvailable > 0 && i === latestAvailable;

      btn.className = "episode-card" + (!hasVideo ? " disabled-ep" : "");
      btn.style.animationDelay = `${Math.min(i * 0.015, 1)}s`;

      if (isLatest) {
        btn.style.borderColor = "var(--primary)";
        btn.style.background =
          "linear-gradient(to top, rgba(245, 158, 11, 0.1), var(--bg-card))";
      }

      btn.innerHTML = `
                <div class="card-glow"></div>
                <span class="ep-label">Tập</span>
                <span class="ep-num" style="${isLatest ? "color: var(--primary)" : ""}">${epNumStr}</span>
                <div class="ep-play-icon">
                    <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="6 3 20 12 6 21 6 3"></polygon></svg>
                </div>
                ${isLatest ? '<span class="badge-new" style="position: absolute; top: 10px; right: 10px; margin: 0; font-size: 8px;">New</span>' : ""}
            `;

      btn.onclick = () => {
        if (!hasVideo) {
          alert(`Tập ${epNumStr} hiện admin chưa upload!`);
        } else {
          const idx = validVideos.findIndex((v) => v === videoObj);
          if (idx !== -1) {
            openModal(series, idx);
          }
        }
      };
      grid.appendChild(btn);
    }
  }
});

function goHome() {
  window.location.href = "index.html";
}
// goHome();
