# Evaluasi-Kelulusan

# 📝 Simple Blog — CRUD Artikel

Aplikasi **Simple Blog** berbasis **Vanilla JavaScript** yang memungkinkan pengguna untuk mengelola artikel (Melihat, Menambahkan, Mengedit, dan Menghapus) yang terintegrasi secara asynchronous dengan REST API publik **JSONPlaceholder**.

Project ini dibuat dengan tampilan antarmuka modern gaya *Glassmorphism* serta mendukung fitur penyesuaian tema (*Light & Dark Mode*).

---

## 🛠️ Teknologi yang Digunakan

- **HTML5**: Semantik dan struktur halaman.
- **CSS3 Modern**: Antarmuka berbasis *Glassmorphism*, *Responsive Design*, dan variabel warna *Dark/Light Mode*.
- **Vanilla JavaScript (ES6+)**:
  - Manipulasi DOM.
  - Pengelolaan data lokal menggunakan **Array of Objects**.
  - Komunikasi data asynchronous menggunakan **Fetch API** (`async/await`).
- **REST API**: [JSONPlaceholder](https://jsonplaceholder.typicode.com/) (`/posts`).

---

## 🚀 Fitur-Fitur Utama

1. **📖 Menampilkan Artikel (READ)**
   - Mengambil data artikel secara otomatis saat halaman dimuat melalui endpoint `GET /posts`.
   - Menyimpan dan mengelola data ke dalam **Array of Objects** lokal.
   - Menampilkan detail artikel (ID, Judul, Isi) beserta aksi edit dan hapus.

2. **➕ Menambahkan Artikel (CREATE)**
   - Form input judul dan isi artikel.
   - Pengiriman data menggunakan HTTP request `POST /posts`.
   - Menambahkan data baru secara dinamis ke array lokal dan melakukan render ulang ke DOM.

3. **✏️ Mengedit Artikel (UPDATE)**
   - Memuat data artikel yang dipilih ke dalam form edit secara otomatis.
   - Pengiriman pembaruan data menggunakan HTTP request `PUT /posts/{id}`.
   - Meng-update *state* array lokal dan me-render ulang daftar artikel.

4. **🗑️ Menghapus Artikel (DELETE)**
   - Fitur konfirmasi sebelum menghapus artikel.
   - Pengiriman permintaan hapus menggunakan HTTP request `DELETE /posts/{id}`.
   - Menghapus artikel dari array lokal dan me-render ulang antarmuka.

5. **🔍 Fitur Pencarian Real-time (Bonus)**
   - Menyaring daftar artikel berdasarkan kata kunci judul secara langsung saat pengguna mengetik (*case-insensitive*).

6. **🎨 Tema Gelap / Terang (Bonus)**
   - Fitur *toggle* tema (*Light/Dark Mode*) yang disimpan di `localStorage` agar preferensi pengguna tidak hilang saat halaman di-refresh.

7. **⏳ State Management (Bonus)**
   - **Loading State**: Menampilkan indikator saat data sedang diunduh dari server.
   - **Error Handling**: Pesan error yang ramah pengguna jika terjadi gangguan jaringan/server.
   - **Empty State**: Keterangan khusus jika artikel yang dicari/ditampilkan kosong.

---

## 📁 Struktur File Project

```text
simple-blog/
│
├── evaluasi-kelulusan.html   # Struktur antarmuka blog
├── evaluasi-kelulusan.css    # Styling Glassmorphism & Dark Mode
├── evaluasi-kelulusan.js     # Logika Vanilla JS & Fetch API
└── README.md                 # Dokumentasi proyek