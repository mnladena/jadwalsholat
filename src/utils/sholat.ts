export const fetchJSON = async (url) => {
  const response = await fetch(url);
  return response.json();
};

export const getCityFromCoordinates = async (lat, lon) => {
  try {
    const data = await fetchJSON(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
    );
    return {
      city:
        data?.address?.city ||
        data?.address?.town ||
        data?.address?.village ||
        "Tidak diketahui",
      village:
        data?.address?.village ||
        data?.address?.hamlet ||
        data?.address?.neighbourhood ||
        data?.address?.residential ||
        "Tidak diketahui",
    };
  } catch (error) {
    console.error("Gagal mendapatkan detail lokasi:", error);
    return { city: null, village: null };
  }
};

export const getCityId = async (cityName) => {
  try {
    const { data, status } = await fetchJSON(
      "https://api.myquran.com/v2/sholat/kota/semua"
    );
    return status
      ? data.find((c) =>
          c.lokasi.toLowerCase().includes(cityName.toLowerCase())
        )?.id || null
      : null;
  } catch (error) {
    console.error("Gagal menemukan ID kota:", error);
    return null;
  }
};

export const getNextPrayerTime = (jadwal, nextDayJadwal) => {
  const now = new Date();
  const jadwalSholat = [
    "imsak",
    "subuh",
    "terbit",
    "dhuha",
    "dzuhur",
    "ashar",
    "maghrib",
    "isya",
  ];

  let previousPrayer = null;
  for (const sholat of jadwalSholat) {
    const [hour, minute] = jadwal[sholat].split(":").map(Number);
    const sholatTime = new Date(now);
    sholatTime.setHours(hour, minute, 0);

    if (sholatTime > now) {
      return { name: previousPrayer, nextName: sholat, time: sholatTime };
    }
    previousPrayer = sholat;
  }

  const [hour, minute] = nextDayJadwal["imsak"].split(":").map(Number);
  const nextPrayerTime = new Date(now);
  nextPrayerTime.setDate(now.getDate() + 1);
  nextPrayerTime.setHours(hour, minute, 0);

  return {
    name: previousPrayer,
    nextName: "imsak (besok)",
    time: nextPrayerTime,
  };
};

export const formatTime = (ms) => {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(
    2,
    "0"
  );
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
};
