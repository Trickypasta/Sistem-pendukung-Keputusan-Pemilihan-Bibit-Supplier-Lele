# 🐟 SPK Pemilihan Supplier Bibit Lele (Metode SAW)

Ini adalah proyek *full-stack* Sistem Pendukung Keputusan (SPK) untuk mengevaluasi dan memberikan peringkat kepada supplier bibit ikan lele menggunakan metode **Simple Additive Weighting (SAW)**.

Aplikasi ini dibangun menggunakan arsitektur modern **API + SPA**:
* **Backend (Dapur):** Dibuat menggunakan **Laravel 12** sebagai REST API.
* **Frontend (Restoran):** Dibuat menggunakan **React (Vite)** sebagai Single Page Application (SPA).

---

## 📸 Tampilan Aplikasi

<img width="1919" height="1068" alt="image" src="https://github.com/user-attachments/assets/dc088c6d-976d-4077-aee4-bf304d4fe1da" />

## ✨ Fitur Utama

Aplikasi ini memiliki fitur fungsional penuh, termasuk:

* **Dashboard:** Menampilkan ringkasan statistik (Total Kriteria & Alternatif) dan panduan penggunaan.
* **Data Kriteria (Full CRUD):**
    * Tambah, Edit, Hapus data kriteria (C1, C2, ...).
    * Validasi bobot dinamis (memberi peringatan jika total bobot tidak 1.00).
    * Input "Satuan" (Unit) untuk memperjelas Halaman Penilaian (Contoh: Rp, %, Skala 1-5).
* **Data Alternatif (Full CRUD):**
    * Tambah, Edit, Hapus data supplier (alternatif).
* **Input Penilaian:**
    * Tabel matriks dinamis yang menampilkan (Alternatif vs Kriteria).
    * Fitur **Auto-Save** (menyimpan nilai otomatis saat `onBlur` / pindah input).
* **Hasil Peringkat:**
    * Menampilkan hasil akhir peringkat supplier dari yang terbaik.
    * Tombol "Hitung Ulang" untuk mengambil data terbaru.
    * **Modal Detail Perhitungan:** Menjelaskan **kenapa** supplier itu menang (menampilkan rincian skor per kriteria).
    * **Rekomendasi "AI" Sederhana:** Memberikan analisis kelebihan & kekurangan supplier di dalam modal.
* **UI/UX Modern:**
    * *Sidebar* dengan indikator halaman aktif.
    * Ikon di seluruh aplikasi (menggunakan Ionicons).
    * Notifikasi *Toast* (menggunakan `react-toastify`) untuk semua aksi (Simpan, Update, Hapus, Error).
    * Tabel dan *form* dengan *styling* modern (menggunakan Tailwind CSS).

---

## 💻 Tumpukan Teknologi (Tech Stack)

### Backend (`backend_api`)
* **Laravel 12**
* **MySQL**
* Logika Kalkulasi SAW di *Service Class*
* REST API (Validasi, CRUD, dll.)

### Frontend (`frontend_react`)
* **React 18** (dibuat dengan **Vite**)
* **React Router v6** (untuk navigasi halaman)
* **Axios** (untuk *fetching* data ke API)
* **Tailwind CSS** (via CDN untuk *styling*)
* **Ionicons** (via CDN untuk ikon)
* **React-Toastify** (untuk notifikasi)

---

## 🚀 Instalasi & Menjalankan Proyek

Proyek ini terdiri dari 2 folder: `backend_api` dan `frontend_react`. Keduanya harus dijalankan **secara bersamaan** di 2 terminal terpisah.

### 1. Backend (Laravel API)

1.  **Clone repository ini:**
    ```bash
    git clone [URL_GITHUB_LU_NANTI]
    ```
2.  **Masuk ke folder backend:**
    ```bash
    cd spkjri/backend_api
    ```
3.  **Install dependensi PHP:**
    ```bash
    composer install
    ```
4.  **Setup file .env:**
    * Copy `.env.example` menjadi `.env`.
    * Atur koneksi database (DB_DATABASE, DB_USERNAME, DB_PASSWORD).
    * Buat database baru di MySQL (misal: `db_spk_lele`).
    ```bash
    cp .env.example .env
    php artisan key:generate
    ```
5.  **Jalankan migrasi database:**
    (Perintah ini akan membuat semua tabel: `kriterias`, `alternatifs`, `penilaians`)
    ```bash
    php artisan migrate
    ```
6.  **Jalankan server backend:**
    ```bash
    php artisan serve
    ```
    *Server akan berjalan di `http://127.0.0.1:8000`*

### 2. Frontend (React SPA)

1.  **Buka terminal BARU** (terminal backend jangan ditutup).
2.  **Masuk ke folder frontend:**
    ```bash
    cd spkjri/frontend_react
    ```
3.  **Install dependensi Node.js:**
    ```bash
    npm install
    ```
4.  **Jalankan server frontend:**
    ```bash
    npm run dev
    ```
    *Server akan berjalan di `http://localhost:5173`*

### 3. Konfigurasi Penting (CORS)

Agar *frontend* bisa "ngobrol" dengan *backend*, pastikan:

1.  **Backend (`backend_api/config/cors.php`):**
    Pastikan `'allowed_origins'` mengizinkan `localhost:5173`. Cara gampangnya, set ke `['*']`.
    ```php
    'allowed_origins' => ['*'], 
    ```
2.  **Frontend (`frontend_react/src/...`):**
    Pastikan variabel `API_URL` di semua file halaman (misal: `PageKriteria.jsx`) sudah menunjuk ke alamat *backend* yang benar.
    ```javascript
    const API_URL = "[http://127.0.0.1:8000/api](http://127.0.0.1:8000/api)";
    ```

**Selesai!** Buka `http://localhost:5173` di browser lu.
