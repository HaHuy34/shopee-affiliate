<<<<<<< Updated upstream
fetch("/api/visit");
document.addEventListener("DOMContentLoaded", () => {
  // Timeline Click Logic (Placeholder behavior since episodes are removed)
  const timelineItems = document.querySelectorAll(".timeline-content");

  timelineItems.forEach((item, index) => {
    item.addEventListener("click", () => {
      const seriesName = item.getAttribute("data-series") || "Dragon Ball";
      alert(`Tính năng đang được ad update`);
      // Provide a minimal action
      // window.open('https://shopee.vn', '_blank', 'noopener,noreferrer');
    });
  });
});
const btn = document.getElementById("musicToggleBtn");
const bgMusic = document.getElementById("bgMusic");

bgMusic.volume = 1.0;

let isPlaying = false;
let hasUserInteracted = false;

// 🎧 phát nhạc từ giây 3
function startMusicFrom3() {
  bgMusic.currentTime = 3;

  bgMusic
    .play()
    .then(() => {
      isPlaying = true;
      updateIcon();
    })
    .catch((err) => console.log("Play failed:", err));
}

// 🔘 update icon
function updateIcon() {
  btn.innerHTML = isPlaying
    ? `<span class="music-icon">⏸</span>`
    : `<span class="music-icon">🔊</span>`;
}

// 🌍 auto start (chỉ chạy 1 lần duy nhất)
function autoStart() {
  if (hasUserInteracted) return;
  hasUserInteracted = true;

  startMusicFrom3();

  window.removeEventListener("click", autoStart);
  window.removeEventListener("scroll", autoStart);
  window.removeEventListener("keydown", autoStart);
  window.removeEventListener("touchstart", autoStart);
}

// 🔘 toggle button (quan trọng: KHÔNG reset currentTime nữa)
btn.addEventListener("click", () => {
  hasUserInteracted = true; // chặn autoStart sau khi user dùng nút

  if (isPlaying) {
    bgMusic.pause();
    isPlaying = false;
  } else {
    bgMusic.play().catch((err) => console.log(err));
    isPlaying = true;
  }

  updateIcon();
});

// 🌍 events kích hoạt auto play
window.addEventListener("click", autoStart);
window.addEventListener("scroll", autoStart);
window.addEventListener("keydown", autoStart);
window.addEventListener("touchstart", autoStart);

// init
updateIcon();

// LINK SHOPEE
=======
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
      src: "https://www.dailymotion.com/embed/video/k65OrdN9vWOhlDGvOls",
    },
  ],
  "Dragon Ball Super (2015)": [],
  "Dragon Ball GT / Daima": [],
};
>>>>>>> Stashed changes

const shopeeLinks = {
  "Dragon Ball (1986)": "https://s.shopee.vn/1gG50bIPVR",
  "Dragon Ball Z (1989)": "https://s.shopee.vn/70HbMQ5oaE",
  "Dragon Ball Super (2015)": "https://s.shopee.vn/4VaGNqAb5r",
  "Dragon Ball GT / Daima": "https://s.shopee.vn/7KuRl3r9pZ",
};

document.querySelectorAll(".timeline-content").forEach((item) => {
  item.addEventListener("click", () => {
    const series = item.getAttribute("data-series");

    const link = shopeeLinks[series];

<<<<<<< Updated upstream
    if (link) {
      window.open(link, "_blank"); // mở tab mới Shopee
=======
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
      iframe.dataset.src = v.src; // lưu link gốc

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

    clearTimeout(navTimeout);

    if (prevBtn) {
      prevBtn.style.opacity = "0";
      prevBtn.style.pointerEvents = "none";
    }

    if (nextBtn) {
      nextBtn.style.opacity = "0";
      nextBtn.style.pointerEvents = "none";
    }
  }

  closeBtn?.addEventListener("click", closeModal);
  overlay?.addEventListener("click", closeModal);

  // =========================
  // UPDATE SWIPER (Tạo hiệu ứng TRƯỢT CSS)
  // =========================
  function updateSlide() {
    sliderContainer.style.transform = `translateX(-${currentIndex * 100}%)`;

    slides.forEach((slide, i) => {
      const iframe = slide.querySelector("iframe");

      if (i === currentIndex) {
        slide.classList.add("active");

        // Chỉ load video đang xem
        if (
          iframe &&
          (iframe.src === "about:blank" || iframe.src.endsWith("about:blank"))
        ) {
          iframe.src = iframe.dataset.src;
        }
      } else {
        slide.classList.remove("active");

        // Tắt hoàn toàn video không xem
        if (iframe) {
          iframe.src = "about:blank";
        }
      }
    });

    // Active hashtag
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
    // Prev button
    // if (prevBtn) {
    //   prevBtn.style.opacity = currentIndex === 0 ? "0" : "1";

    //   prevBtn.style.pointerEvents = currentIndex === 0 ? "none" : "auto";
    // }

    // // Next button
    // if (nextBtn) {
    //   nextBtn.style.opacity = currentIndex === slides.length - 1 ? "0" : "1";

    //   nextBtn.style.pointerEvents =
    //     currentIndex === slides.length - 1 ? "none" : "auto";
    // }
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
>>>>>>> Stashed changes
    } else {
      console.log("Không tìm thấy link cho:", series);
    }
  });
});

// =========================
// AUTO SHOW/HIDE NAV BUTTONS
// =========================
let navTimeout;

function showNavButtons() {
  clearTimeout(navTimeout);

  // Hiện nút hợp lệ
  if (prevBtn) {
    if (currentIndex > 0) {
      prevBtn.style.opacity = "1";
      prevBtn.style.pointerEvents = "auto";
    } else {
      prevBtn.style.opacity = "0";
      prevBtn.style.pointerEvents = "none";
    }
  }

  if (nextBtn) {
    if (currentIndex < slides.length - 1) {
      nextBtn.style.opacity = "1";
      nextBtn.style.pointerEvents = "auto";
    } else {
      nextBtn.style.opacity = "0";
      nextBtn.style.pointerEvents = "none";
    }
  }

  // Sau 3s tự ẩn
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

const modalContent = document.querySelector(".modal-content");

["mousemove", "click", "touchstart", "touchmove"].forEach((event) => {
  modalContent?.addEventListener(event, () => {
    if (!modal.classList.contains("hidden")) {
      showNavButtons();
    }
  });
});
