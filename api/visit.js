// export default async function handler(req, res) {
//   try {
//     // Lấy IP user
//     const ip =
//       req.headers["x-forwarded-for"]?.split(",")[0] ||
//       req.socket?.remoteAddress ||
//       "unknown";

//     // Lấy thông tin trình duyệt
//     const userAgent = req.headers["user-agent"] || "unknown";

//     // Lấy quốc gia từ IP (free API)
//     const geoRes = await fetch(`https://ipapi.co/${ip}/json/`);
//     const geo = await geoRes.json();

//     const country = geo.country_name || "Unknown";

//     // Gửi Discord
//     await fetch(process.env.DISCORD_WEBHOOK_URL, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         content:
//           `👀 Có người vừa vào web!\n` +
//           `🌍 Quốc gia: ${country}\n` +
//           `🌐 IP: ${ip}\n` +
//           `📱 Browser: ${userAgent}`,
//       }),
//     });

//     res.status(200).json({ ok: true });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// }
export default async function handler(req, res) {
  try {
    // =========================
    // 1. LẤY IP USER (chuẩn Vercel)
    // =========================
    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.headers["x-real-ip"] ||
      req.socket?.remoteAddress ||
      "unknown";

    // =========================
    // 2. USER AGENT
    // =========================
    const userAgent = req.headers["user-agent"] || "unknown";

    // =========================
    // 3. GEO LOCATION (fallback 2 API)
    // =========================
    let geo = null;

    try {
      const res1 = await fetch(`https://ipwho.is/${ip}`);
      const data1 = await res1.json();

      if (data1 && data1.success) {
        geo = {
          country: data1.country,
          region: data1.region,
          city: data1.city,
          isp: data1.connection?.isp || "Unknown ISP",
          lat: data1.latitude,
          lon: data1.longitude,
        };
      }
    } catch (e) {}

    // fallback nếu API fail
    if (!geo) {
      try {
        const res2 = await fetch(`https://ipapi.co/${ip}/json/`);
        const data2 = await res2.json();

        geo = {
          country: data2.country_name || "Unknown",
          region: data2.region || "",
          city: data2.city || "",
          isp: data2.org || "Unknown ISP",
          lat: data2.latitude,
          lon: data2.longitude,
        };
      } catch (e) {
        geo = {
          country: "Unknown",
          region: "",
          city: "",
          isp: "Unknown",
          lat: null,
          lon: null,
        };
      }
    }

    // =========================
    // 4. DISCORD PAYLOAD (đẹp hơn)
    // =========================
    const message =
      `🔥 NEW VISIT DETECTED\n` +
      `🌍 Country: ${geo.country}\n` +
      `🏙️ City: ${geo.city || "Unknown"}\n` +
      `📍 Region: ${geo.region || "Unknown"}\n` +
      `📡 ISP: ${geo.isp}\n` +
      `🌐 IP: ${ip}\n` +
      `📱 Device: ${userAgent}`;

    // =========================
    // 5. SEND TO DISCORD
    // =========================
    await fetch(process.env.DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: message,
      }),
    });

    // =========================
    // 6. RESPONSE
    // =========================
    res.status(200).json({
      ok: true,
      ip,
      geo,
    });
  } catch (err) {
    res.status(500).json({
      ok: false,
      error: err.message,
    });
  }
}
