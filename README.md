# 🎙️ Fish Audio S2 Pro F16 GGUF & OpenRouter Web Studio

[![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/digitaldeveloperinfo/tts-s2-pro-fp16gguf/blob/main/s2_pro_f16_colab.ipynb)
[![License: Fish Audio Research License](https://img.shields.io/badge/License-Fish_Audio_Research-blue.svg)](https://huggingface.co/rodrigomt/s2-pro-gguf/blob/main/LICENSE.md)
[![Model: Fish S2 Pro](https://img.shields.io/badge/Model-rodrigomt%2Fs2--pro--gguf-orange)](https://huggingface.co/rodrigomt/s2-pro-gguf)
[![OpenRouter: S2.1 Pro Free](https://img.shields.io/badge/OpenRouter-fish--audio%2Fs2.1--pro--free-emerald)](https://openrouter.ai/fish-audio/s2.1-pro-free)

Repository ini menyediakan dua metode lengkap untuk menjalankan model suara **Fish Audio S2 Pro**:
1. 🌐 **Web Studio Interface (`index.html`):** Antarmuka web interaktif siap pakai berbasis OpenRouter API (`fish-audio/s2.1-pro-free`).
2. 🚀 **Google Colab Notebook (`s2_pro_f16_colab.ipynb`):** Eksekusi mandiri model `s2-pro-f16.gguf` (9.9 GB) menggunakan engine C++/CUDA native `s2.cpp`.

---

## 🌐 1. Web Studio Interface (OpenRouter API)

Anda dapat menggunakan antarmuka web langsung di browser tanpa perlu server backend khusus (mendukung CORS langsung ke OpenRouter).

### Fitur Web Studio:
- **Input API Key Langsung:** Masukkan OpenRouter API Key Anda di halaman web (tersimpan aman hanya di `localStorage` browser Anda).
- **Variasi Suara Tak Terbatas (Multi-Voice):**
  - Preset suara Bahasa Indonesia (Pria & Wanita).
  - Preset suara global & narrator.
  - Mendukung ribuan **Custom Voice ID** (32-karakter hex) dari [Fish Audio Voice Library](https://fish.audio/voice-library).
- **Style & Emotion Markers:** Tombol cepat untuk menyisipkan penanda emosi seperti `[natural and conversational]`, `[calm]`, `[cheerful]`, `[energetic]`, `[whispering]`, `[serious]`, dll.
- **Audio Player & Riwayat:** Dilengkapi player audio HTML5, tombol unduh MP3, dan daftar riwayat generasi audio sesi berjalan.

### Cara Menjalankan Web Studio:
Cukup buka file `index.html` langsung di browser Anda (klik ganda `index.html`), atau jalankan mini web server lokal:
```bash
python -m http.server 8000
```
Lalu buka `http://localhost:8000` di browser.

*(Atau aktifkan **GitHub Pages** di repositori ini untuk meng-hosting web interface secara online gratis!)*

---

## 🚀 2. Jalankan di Google Colab (Offline GGUF Model)

1. Klik tombol **[Open In Colab](https://colab.research.google.com/github/digitaldeveloperinfo/tts-s2-pro-fp16gguf/blob/main/s2_pro_f16_colab.ipynb)** di atas.
2. Pastikan Runtime Colab diatur ke **T4 GPU** (`Runtime` -> `Change runtime type` -> pilih `T4 GPU` atau lebih tinggi).
3. Jalankan setiap cell secara berurutan:
   - Cell 1: Verifikasi GPU & dependensi sistem
   - Cell 2: Kompilasi `s2.cpp` dengan flag CUDA
   - Cell 3: Unduh `s2-pro-f16.gguf` & `tokenizer.json`
   - Cell 4: Sintesis suara teks & putar audio

---

## ❓ Tanya Jawab Teknis: Variasi Suara

### Apakah hanya tersedia satu suara?
**Tidak, ada ribuan variasi suara!**
- Model `fish-audio/s2.1-pro-free` di OpenRouter mendukung parameter `"voice"`.
- Anda dapat memasukkan sembarang **Voice ID** (32 karakter hex) dari ekosistem Fish Audio:
  - *Indonesia Pria:* `eb2dd6154ca64c658eb58d2932b7451d`
  - *Indonesia Wanita:* `a8d661f4e6d7456096581cda39636a6d`
  - *Official Demo:* `b347db033a6549378b48d00acb0d06cd`
  - Suara lainnya dapat dicari di [fish.audio/voice-library](https://fish.audio/voice-library).
- Jika parameter `voice` dikosongkan, API otomatis menggunakan suara bawaan (default speaker).
- Selain Voice ID, gaya dan intonasi dapat diubah secara dinamis dengan menambahkan **Emotion Tags** di awal teks seperti `[calm]`, `[energetic]`, `[whispering]`.

---

## 💻 3. Menjalankan di Mesin Lokal (Linux / Ubuntu)

### Prasyarat
- GPU NVIDIA (VRAM ≥ 12 GB direkomendasikan untuk F16)
- CUDA Toolkit ≥ 12.0, CMake ≥ 3.14, GCC/G++ C++17

```bash
# Clone & build
git clone --recurse-submodules https://github.com/rodrigomatta/s2.cpp.git
cd s2.cpp
cmake -B build -DCMAKE_BUILD_TYPE=Release -DS2_CUDA=ON
cmake --build build --parallel $(nproc)
cd ..

# Download model & jalankan
pip install huggingface_hub hf_transfer
python run_tts.py --download

# Inferensi
python run_tts.py \
  --bin ./s2.cpp/build/s2 \
  --model s2-pro-f16.gguf \
  --tokenizer tokenizer.json \
  --cuda 0 \
  --text "Halo dunia, ini adalah pengujian suara S2 Pro F16." \
  --output output.wav
```

---

## 📜 Lisensi & Atribusi
- Bobot model dilisensikan di bawah **Fish Audio Research License** (bebas untuk riset & non-komersial).
- Engine inferensi lokal oleh [rodrigomatta/s2.cpp](https://github.com/rodrigomatta/s2.cpp).
- GGUF Weights disediakan oleh [rodrigomt/s2-pro-gguf](https://huggingface.co/rodrigomt/s2-pro-gguf).
- API OpenRouter disediakan oleh [OpenRouter.ai](https://openrouter.ai).
