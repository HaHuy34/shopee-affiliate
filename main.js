// =========================
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
      src: "https://www.dailymotion.com/embed/video/k9GGmqwuKmxleUGvJqK",
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

  // =========================
  // GỢI Ý VIDEO TRƯỚC KHI HẾT 3 PHÚT
  // =========================
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
      updateSlide();

      const nextVideo = slides[currentIndex].querySelector("video");
      if (nextVideo) {
        setTimeout(() => {
          nextVideo.play().catch(() => {});
        }, 500); // Đợi CSS transition chạy xong mới play
      }
    }
  });

  suggestionCloseBtn?.addEventListener("click", () => {
    hideSuggestion();
    // Đánh dấu video hiện tại đã tắt gợi ý để không hiện lại popup nữa
    const currentVideo = slides[currentIndex]?.querySelector("video");
    if (currentVideo) currentVideo._suggestionDismissed = true;
  });

  // =========================
  // OPEN MODAL
  // =========================
  function openModal(series) {
    sliderContainer.innerHTML = "";
    if (episodeList) episodeList.innerHTML = "";
    sliderContainer.style.transform = `translateX(0%)`;

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

      const iframe = document.createElement("iframe");

      iframe.src = v.src;
      iframe.width = "100%";
      iframe.height = "500";
      iframe.frameBorder = "0";
      iframe.allow = "autoplay; fullscreen; picture-in-picture";
      iframe.allowFullscreen = true;

      slide.appendChild(title);
      slide.appendChild(iframe);

      sliderContainer.appendChild(slide);

      // Hashtag tập phim
      const chip = document.createElement("div");
      chip.className = "episode-chip";
      chip.textContent = "#" + v.name;

      chip.addEventListener("click", () => {
        currentIndex = index;
        updateSlide();
      });

      episodeList.appendChild(chip);
    });

    slides = document.querySelectorAll(".slide");

    currentIndex = 0;
    updateSlide();

    modal.classList.remove("hidden");
  }

  // =========================
  // CLOSE MODAL
  // =========================
  function closeModal() {
    modal.classList.add("hidden");

    document.querySelectorAll("#sliderContainer iframe").forEach((frame) => {
      frame.src = frame.src;
    });
  }

  closeBtn?.addEventListener("click", closeModal);
  overlay?.addEventListener("click", closeModal);

  // =========================
  // UPDATE SWIPER (Tạo hiệu ứng TRƯỢT CSS)
  // =========================
  function updateSlide() {
    sliderContainer.style.transform = `translateX(-${currentIndex * 100}%)`;

    slides.forEach((slide, i) => {
      if (i === currentIndex) {
        slide.classList.add("active");
      } else {
        slide.classList.remove("active");

        const iframe = slide.querySelector("iframe");

        if (iframe) {
          iframe.src = iframe.src;
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

    prevBtn.style.opacity = currentIndex === 0 ? "0" : "1";

    prevBtn.style.pointerEvents = currentIndex === 0 ? "none" : "auto";

    nextBtn.style.opacity = currentIndex === slides.length - 1 ? "0" : "1";

    nextBtn.style.pointerEvents =
      currentIndex === slides.length - 1 ? "none" : "auto";
  }
  // =========================
  // NEXT / PREV BUTTONS
  // =========================
  nextBtn?.addEventListener("click", () => {
    if (currentIndex < slides.length - 1) {
      currentIndex++;
      updateSlide();
    }
  });

  prevBtn?.addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateSlide();
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
