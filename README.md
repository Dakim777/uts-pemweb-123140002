# Aplikasi Pelacak Harga Cryptocurrency

## Identitas
- **Nama:** Muhammad Daffa Hakim Matondang
- **NIM:** 123140002

## Deskripsi Project
Aplikasi web yang dibangun untuk UTS mata kuliah Pemrograman Web. Aplikasi ini berfungsi untuk memantau harga cryptocurrency secara real-time dengan fitur-fitur sebagai berikut:
- Menampilkan daftar 50 cryptocurrency teratas berdasarkan kapitalisasi pasar
- Penyaringan berdasarkan rentang harga dengan filter yang sudah disiapkan
- Informasi detail lengkap untuk setiap cryptocurrency
- Grafik pergerakan harga 7 hari terakhir menggunakan Recharts
- Pelacakan portfolio dengan penyimpanan lokal
- Tampilan responsif untuk perangkat mobile dan desktop
- Animasi dan transisi halus untuk pengalaman pengguna yang lebih baik

## Teknologi yang Digunakan
- React.js untuk pengembangan antarmuka
- API CoinGecko untuk data cryptocurrency
- Recharts untuk visualisasi grafik
- CSS3 untuk tampilan dan animasi
- Local Storage untuk penyimpanan data portfolio

## Cara Instalasi dan Menjalankan Aplikasi

1. Clone repository ini
```bash
git clone https://github.com/Dakim777/uts-pemweb-123140002.git
cd uts-pemweb-123140002
```

2. Install semua dependencies yang diperlukan
```bash
npm install
```

3. Jalankan aplikasi dalam mode pengembangan
```bash
npm start
```
Buka [http://localhost:3000](http://localhost:3000) di browser Anda untuk melihat aplikasi.

4. Untuk membuat versi production
```bash
npm run build
```
Perintah ini akan membuat versi production yang optimal di folder `build`.

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Tangkapan Layar Aplikasi

### Halaman Utama
![Halaman Utama](/screenshots/main-page.png)
- Tampilan tabel cryptocurrency dengan informasi market cap, harga, dan perubahan 24 jam
- Filter harga yang mudah digunakan dengan preset rentang harga
- Kolom portfolio untuk melacak investasi cryptocurrency

### Halaman Detail (Informasi Utama)
![Halaman Detail](/screenshots/detail-page.png)
- Header dengan logo dan nama cryptocurrency
- Informasi harga terkini dan perubahan 24 jam
- Grafik interaktif pergerakan harga 7 hari terakhir

### Halaman Detail (Informasi Tambahan)
![Halaman Detail Tambahan](/screenshots/detail-page2.png)
- Statistik market lengkap (Market Cap, Volume, Supply)
- Kalkulator portfolio untuk menghitung nilai investasi
- Tautan ke sumber informasi resmi

### Tampilan Mobile
![Tampilan Mobile](/screenshots/mobile-view.png)
- Desain responsif yang optimal untuk perangkat mobile
- Tata letak yang dioptimalkan untuk layar kecil
- Kemudahan navigasi dan interaksi di perangkat mobile

## Tautan Aplikasi
🌐 [Demo Langsung](https://uts-pemweb-123140002.vercel.app/)

## Fitur Utama
- [x] Pelacakan harga secara real-time
- [x] Pengelolaan portfolio
- [x] Penyaringan berdasarkan harga
- [x] Grafik harga 7 hari
- [x] Desain responsif
- [x] Penyimpanan data lokal
- [x] Animasi halus
- [x] Penanganan error
- [x] Status loading
- [x] Penanganan batasan rate API

## Dependensi Utama
```json
{
  "react": "^19.2.0",
  "react-dom": "^19.2.0",
  "react-scripts": "5.0.1",
  "recharts": "^2.6.0"
}
```

## Referensi API
Aplikasi ini memanfaatkan [API CoinGecko](https://www.coingecko.com/en/api) untuk mendapatkan data cryptocurrency.

## Catatan Tambahan
- Data diperbarui secara otomatis
- Data portfolio disimpan di penyimpanan lokal browser
- Dilengkapi mekanisme retry untuk panggilan API
- Menggunakan React hooks untuk manajemen state
