export default async function handler(req, res) {
  try {
    // Lấy IP user
    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.socket?.remoteAddress ||
      "unknown";

    // Lấy thông tin trình duyệt
    const userAgent = req.headers["user-agent"] || "unknown";

    // Lấy quốc gia từ IP (free API)
    const geoRes = await fetch(`https://ipapi.co/${ip}/json/`);
    const geo = await geoRes.json();

    const country = geo.country_name || "Unknown";

    // Gửi Discord
    await fetch(process.env.DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content:
          `👀 Có người vừa vào web!\n` +
          `🌍 Quốc gia: ${country}\n` +
          `🌐 IP: ${ip}\n` +
          `📱 Browser: ${userAgent}`,
      }),
    });

    res.status(200).json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
