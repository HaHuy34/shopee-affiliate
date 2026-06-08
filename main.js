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

    if (link) {
      window.open(link, "_blank"); // mở tab mới Shopee
    } else {
      console.log("Không tìm thấy link cho:", series);
    }
  });
});
