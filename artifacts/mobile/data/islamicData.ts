export type PrayerTime = {
  name: string;
  arabicName: string;
  time: string;
  passed?: boolean;
};

export type DakwahContent = {
  id: string;
  title: string;
  excerpt: string;
  category: 'Aqidah' | 'Fiqh' | 'Akhlak' | 'Sirah' | 'Quran' | 'Umum';
  author: string;
  readMinutes: number;
  date: string;
};

export type CommunityEvent = {
  id: string;
  title: string;
  description: string;
  dateLabel: string;
  time: string;
  location: string;
  type: 'kajian' | 'pengajian' | 'sosial' | 'rapat' | 'dzikir';
  capacity: number;
  registered: number;
};

export type MarketplaceItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  seller: string;
  halalCertified: boolean;
  unit: string;
};

export type QuranVerse = {
  surah: string;
  surahNumber: number;
  ayat: number | string;
  arabic: string;
  transliteration: string;
  terjemahan: string;
};

export const PRAYER_TIMES: PrayerTime[] = [
  { name: 'Subuh', arabicName: 'الصبح', time: '04:45' },
  { name: 'Syuruq', arabicName: 'الشروق', time: '06:05' },
  { name: 'Dzuhur', arabicName: 'الظهر', time: '12:10' },
  { name: 'Ashar', arabicName: 'العصر', time: '15:30' },
  { name: 'Maghrib', arabicName: 'المغرب', time: '18:02' },
  { name: 'Isya', arabicName: 'العشاء', time: '19:18' },
];

export const DAILY_VERSES: QuranVerse[] = [
  {
    surah: 'Al-Baqarah',
    surahNumber: 2,
    ayat: 286,
    arabic: 'لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا',
    transliteration: 'Lā yukallifu llāhu nafsan illā wusʿahā',
    terjemahan: 'Allah tidak membebani seseorang melainkan sesuai dengan kesanggupannya.',
  },
  {
    surah: 'Al-Imran',
    surahNumber: 3,
    ayat: 159,
    arabic: 'إِنَّ اللَّهَ يُحِبُّ الْمُتَوَكِّلِينَ',
    transliteration: 'Innallāha yuhibbu l-mutawakkilīn',
    terjemahan: 'Sesungguhnya Allah menyukai orang-orang yang bertawakal.',
  },
  {
    surah: 'Al-Hujurat',
    surahNumber: 49,
    ayat: 13,
    arabic: 'إِنَّ أَكْرَمَكُمْ عِندَ اللَّهِ أَتْقَاكُمْ',
    transliteration: 'Inna akramakum ʿindallāhi atqākum',
    terjemahan: 'Sesungguhnya yang paling mulia di antara kamu di sisi Allah ialah yang paling bertakwa.',
  },
  {
    surah: 'Al-Maidah',
    surahNumber: 5,
    ayat: 2,
    arabic: 'وَتَعَاوَنُوا عَلَى الْبِرِّ وَالتَّقْوَىٰ',
    transliteration: 'Wataʿāwanū ʿalā l-birri wa t-taqwā',
    terjemahan: 'Dan tolong-menolonglah kamu dalam kebajikan dan takwa.',
  },
  {
    surah: 'Az-Zumar',
    surahNumber: 39,
    ayat: 53,
    arabic: 'إِنَّ اللَّهَ يَغْفِرُ الذُّنُوبَ جَمِيعًا',
    transliteration: 'Innallāha yaghfiru z-zunūba jamīʿā',
    terjemahan: 'Sesungguhnya Allah mengampuni dosa-dosa semuanya.',
  },
  {
    surah: 'Al-Insyirah',
    surahNumber: 94,
    ayat: '5-6',
    arabic: 'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا',
    transliteration: 'Fa-inna maʿa l-ʿusri yusrā',
    terjemahan: 'Karena sesungguhnya bersama kesulitan ada kemudahan.',
  },
  {
    surah: 'Al-Ashr',
    surahNumber: 103,
    ayat: '1-3',
    arabic: 'وَالْعَصْرِ إِنَّ الْإِنسَانَ لَفِي خُسْرٍ',
    transliteration: 'Wal-ʿaṣr, inna l-insāna lafī khusr',
    terjemahan: 'Demi masa. Sungguh, manusia berada dalam kerugian.',
  },
];

export const DAKWAH_CONTENTS: DakwahContent[] = [
  {
    id: '1',
    title: 'Keutamaan Shalat Berjamaah di Masjid',
    excerpt: 'Shalat berjamaah di masjid memiliki keutamaan 27 derajat dibanding shalat sendiri. Inilah hikmah dan cara meraihnya.',
    category: 'Fiqh',
    author: 'Ust. Ahmad Zaky',
    readMinutes: 5,
    date: '25 Jul 2026',
  },
  {
    id: '2',
    title: 'Memahami Tauhid: Pondasi Aqidah Islam',
    excerpt: 'Tauhid adalah kunci keselamatan. Memahami tiga jenis tauhid: Rububiyyah, Uluhiyyah, dan Asma wa Sifat.',
    category: 'Aqidah',
    author: 'Ust. Muhammad Fajri',
    readMinutes: 8,
    date: '24 Jul 2026',
  },
  {
    id: '3',
    title: 'Adab Bermedia Sosial Dalam Islam',
    excerpt: 'Di era digital, seorang Muslim perlu menjaga adab dalam bermedia sosial. Berikut panduan syar\'i yang perlu kita terapkan.',
    category: 'Akhlak',
    author: 'Ust. Ridwan Al-Hafidz',
    readMinutes: 6,
    date: '23 Jul 2026',
  },
  {
    id: '4',
    title: 'Sirah Nabawiyah: Pelajaran dari Perang Badr',
    excerpt: 'Perang Badr adalah peristiwa bersejarah yang mengandung banyak hikmah dan pelajaran bagi umat Islam hingga hari ini.',
    category: 'Sirah',
    author: 'Ust. Ibrahim Hasan',
    readMinutes: 12,
    date: '22 Jul 2026',
  },
  {
    id: '5',
    title: 'Tafsir Surah Al-Fatihah: Ibu Segala Surah',
    excerpt: 'Al-Fatihah dibaca minimal 17 kali sehari. Seberapa dalam kita memahami kandungan surah pembuka Al-Quran ini?',
    category: 'Quran',
    author: 'Ust. Yahya Assegaf',
    readMinutes: 10,
    date: '21 Jul 2026',
  },
  {
    id: '6',
    title: 'Muamalah Digital: Hukum Jual Beli Online',
    excerpt: 'Bagaimana hukum jual beli di marketplace digital? Apa syarat sahnya? Simak penjelasan para ulama kontemporer.',
    category: 'Fiqh',
    author: 'Ust. Salim Al-Amri',
    readMinutes: 7,
    date: '20 Jul 2026',
  },
];

export const COMMUNITY_EVENTS: CommunityEvent[] = [
  {
    id: '1',
    title: 'Kajian Subuh Ahad — Kitab Riyadhus Shalihin',
    description: 'Kajian rutin kitab Riyadhus Shalihin bersama Ustadz Ahmad setiap Ahad pagi setelah shalat Subuh berjamaah.',
    dateLabel: 'Ahad, 27 Jul 2026',
    time: '05:30 WIB',
    location: 'Masjid Al-Ikhlas, Jl. Raya Utama No. 12',
    type: 'kajian',
    capacity: 200,
    registered: 143,
  },
  {
    id: '2',
    title: 'Pengajian Ibu-Ibu: Akhlak Muslimah',
    description: 'Pengajian khusus ibu-ibu membahas akhlak seorang muslimah di rumah tangga dan lingkungan sosial.',
    dateLabel: 'Rabu, 30 Jul 2026',
    time: '09:00 WIB',
    location: 'Aula Muslimah At-Taqwa',
    type: 'pengajian',
    capacity: 100,
    registered: 67,
  },
  {
    id: '3',
    title: 'Aksi Sosial: Berbagi Sembako Dhuafa',
    description: 'Program berbagi sembako untuk warga dhuafa di sekitar kita. Mari bersama meringankan beban sesama.',
    dateLabel: 'Sabtu, 2 Agt 2026',
    time: '08:00 WIB',
    location: 'Masjid Baitul Hikmah, Kelurahan Cibadak',
    type: 'sosial',
    capacity: 50,
    registered: 38,
  },
  {
    id: '4',
    title: 'Majelis Dzikir & Shalawat Mingguan',
    description: 'Majelis dzikir dan shalawat bersama yang rutin dilaksanakan setiap malam Jumat bada Isya.',
    dateLabel: 'Kamis, 31 Jul 2026',
    time: '20:00 WIB',
    location: 'Masjid Ar-Rahman Blok C',
    type: 'dzikir',
    capacity: 300,
    registered: 201,
  },
  {
    id: '5',
    title: 'Rapat Koordinasi Pengurus DKM',
    description: 'Rapat bulanan untuk membahas program kerja, keuangan, dan kegiatan masjid periode Agustus 2026.',
    dateLabel: 'Selasa, 5 Agt 2026',
    time: '19:30 WIB',
    location: 'Ruang Rapat Masjid Al-Falah',
    type: 'rapat',
    capacity: 30,
    registered: 22,
  },
];

export const MARKETPLACE_ITEMS: MarketplaceItem[] = [
  {
    id: '1',
    name: 'Kurma Ajwa Premium',
    description: 'Kurma Ajwa asli Madinah, kualitas premium, 500g',
    price: 185000,
    category: 'Makanan',
    seller: 'Toko Barakah',
    halalCertified: true,
    unit: 'bungkus',
  },
  {
    id: '2',
    name: 'Madu Hutan Murni',
    description: 'Madu hutan asli, tanpa campuran, 500ml',
    price: 120000,
    category: 'Kesehatan',
    seller: 'Hijau Nusantara',
    halalCertified: true,
    unit: 'botol',
  },
  {
    id: '3',
    name: 'Mukena Satin Premium',
    description: 'Mukena satin elegan, anti kusut, berbagai warna',
    price: 235000,
    category: 'Busana',
    seller: 'Azimah Store',
    halalCertified: true,
    unit: 'pcs',
  },
  {
    id: '4',
    name: 'Al-Quran Tajwid Warna',
    description: 'Al-Quran lengkap tajwid warna, kertas khusus, A5',
    price: 95000,
    category: 'Ibadah',
    seller: 'Pustaka Islami',
    halalCertified: true,
    unit: 'buku',
  },
  {
    id: '5',
    name: 'Herbal Habbatus Sauda',
    description: 'Kapsul habbatus sauda original, 100 kapsul',
    price: 75000,
    category: 'Kesehatan',
    seller: 'Thibbun Nabawi',
    halalCertified: true,
    unit: 'botol',
  },
  {
    id: '6',
    name: 'Sarung Wadimor Classic',
    description: 'Sarung premium untuk shalat dan sehari-hari',
    price: 145000,
    category: 'Busana',
    seller: 'Busana Muslim Barokah',
    halalCertified: true,
    unit: 'pcs',
  },
];

export const getDailyVerse = (): QuranVerse => {
  const dayOfWeek = new Date().getDay();
  return DAILY_VERSES[dayOfWeek];
};

export const getPrayerTimesWithStatus = (): PrayerTime[] => {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  return PRAYER_TIMES.map((p) => {
    const [h, m] = p.time.split(':').map(Number);
    return { ...p, passed: h * 60 + m < currentMinutes };
  });
};

export const getNextPrayer = (): PrayerTime | null => {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  for (const p of PRAYER_TIMES) {
    const [h, m] = p.time.split(':').map(Number);
    if (h * 60 + m > currentMinutes) return p;
  }
  return PRAYER_TIMES[0]; // Subuh tomorrow
};

export const formatRupiah = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

export const EVENT_TYPE_COLORS: Record<CommunityEvent['type'], string> = {
  kajian: '#1A7A4A',
  pengajian: '#2980B9',
  sosial: '#E67E22',
  rapat: '#8E44AD',
  dzikir: '#C9A84C',
};

export const EVENT_TYPE_LABELS: Record<CommunityEvent['type'], string> = {
  kajian: 'Kajian',
  pengajian: 'Pengajian',
  sosial: 'Sosial',
  rapat: 'Rapat',
  dzikir: 'Dzikir',
};
