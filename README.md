# 🎙️ Fish Audio S2 Pro F16 GGUF — Google Colab & Local Runner

[![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/digitaldeveloperinfo/tts-s2-pro-fp16gguf/blob/main/s2_pro_f16_colab.ipynb)
[![License: Fish Audio Research License](https://img.shields.io/badge/License-Fish_Audio_Research-blue.svg)](https://huggingface.co/rodrigomt/s2-pro-gguf/blob/main/LICENSE.md)
[![Model](https://img.shields.io/badge/Model-rodrigomt%2Fs2--pro--gguf-orange)](https://huggingface.co/rodrigomt/s2-pro-gguf)

Repository ini berisi skrip dan notebook untuk menjalankan **Fish Audio S2 Pro F16 GGUF** di **Google Colab** (GPU T4/L4/A100) dan Linux lokal menggunakan engine C++/GGML berakselerasi CUDA: **[s2.cpp](https://github.com/rodrigomatta/s2.cpp)**.

---

## ⚡ Fitur Utama
- **Akurasi Penuh (F16):** Menggunakan `s2-pro-f16.gguf` (9.9 GB) tanpa penurunan kualitas kuantisasi.
- **Akselerasi CUDA:** Dijalankan via pure C++/GGML (`s2.cpp`) dengan backend CUDA tanpa overhead runtime Python/PyTorch saat inferensi.
- **Voice Cloning (Zero-shot):** Mendukung kloning suara hanya dengan menyertakan sampel audio 5–30 detik (WAV/MP3) beserta transkripnya.
- **Multi-platform:** Siap dijalankan langsung di Google Colab via tombol satu-klik atau di mesin Linux lokal.
- **HTTP Server Bawaan:** Mendukung REST API server bawaan untuk integrasi eksternal.

---

## 🚀 Jalankan Cepat di Google Colab

1. Klik tombol **[Open In Colab](https://colab.research.google.com/github/digitaldeveloperinfo/tts-s2-pro-fp16gguf/blob/main/s2_pro_f16_colab.ipynb)** di atas.
2. Pastikan Runtime Colab diatur ke **T4 GPU** (`Runtime` -> `Change runtime type` -> pilih `T4 GPU` atau lebih tinggi).
3. Jalankan setiap cell secara berurutan:
   - Cell 1: Verifikasi GPU & dependensi sistem
   - Cell 2: Kompilasi `s2.cpp` dengan flag CUDA
   - Cell 3: Unduh `s2-pro-f16.gguf` & `tokenizer.json`
   - Cell 4: Sintesis suara teks & putar audio

---

## 💻 Panduan Menjalankan di Mesin Lokal (Linux / Ubuntu)

### 1. Prasyarat
- GPU NVIDIA dengan VRAM minimal 12–16 GB.
- CUDA Toolkit ≥ 12.0
- CMake ≥ 3.14 dan GCC/G++ C++17
- Python 3.8+ (untuk download model via huggingface-hub)

### 2. Clone Repository & Submodule
```bash
git clone https://github.com/digitaldeveloperinfo/tts-s2-pro-fp16gguf.git
cd tts-s2-pro-fp16gguf

# Clone s2.cpp beserta submodule GGML
git clone --recurse-submodules https://github.com/rodrigomatta/s2.cpp.git
```

### 3. Kompilasi `s2.cpp`
```bash
cd s2.cpp
cmake -B build -DCMAKE_BUILD_TYPE=Release -DS2_CUDA=ON
cmake --build build --parallel $(nproc)
cd ..
```

### 4. Unduh Model `s2-pro-f16.gguf`
```bash
pip install huggingface_hub hf_transfer
python run_tts.py --download
```

### 5. Inferensi Text-to-Speech
```bash
python run_tts.py \
  --bin ./s2.cpp/build/s2 \
  --model s2-pro-f16.gguf \
  --tokenizer tokenizer.json \
  --cuda 0 \
  --text "Halo dunia, ini adalah pengujian suara S2 Pro F16." \
  --output output.wav
```

### 6. Voice Cloning
```bash
python run_tts.py \
  --bin ./s2.cpp/build/s2 \
  --model s2-pro-f16.gguf \
  --tokenizer tokenizer.json \
  --cuda 0 \
  --prompt-audio "path/to/reference.wav" \
  --prompt-text "Transkrip teks dari audio referensi." \
  --text "Teks baru yang disuarakan dengan karakter suara referensi." \
  --output cloned.wav
```

---

## 🛠️ Tips & Troubleshooting

- **Out of Memory (CUDA OOM):**
  Jika VRAM tidak cukup (misal VRAM < 12 GB), Anda dapat memindahkan proses dekoding codec ke CPU dengan menambahkan argumen `--codec-cpu`:
  ```bash
  python run_tts.py ... --codec-cpu
  ```
  Atau batasi jumlah layer transformer yang dioffload ke GPU:
  ```bash
  python run_tts.py ... -ngl 30
  ```
- **Kuantisasi Lebih Ringan:**
  Jika ingin versi yang jauh lebih hemat VRAM, gunakan model `s2-pro-q8_0.gguf` (5.6 GB) atau `s2-pro-q6_k.gguf` (4.5 GB) dari repository Hugging Face [rodrigomt/s2-pro-gguf](https://huggingface.co/rodrigomt/s2-pro-gguf).

---

## 📜 Lisensi & Atribusi
- Bobot model dilisensikan di bawah **Fish Audio Research License** (bebas untuk riset & non-komersial).
- Engine inferensi dikembangkan oleh komunitas di [rodrigomatta/s2.cpp](https://github.com/rodrigomatta/s2.cpp).
- GGUF Weights disediakan oleh [rodrigomt/s2-pro-gguf](https://huggingface.co/rodrigomt/s2-pro-gguf).
