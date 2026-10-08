// app.js — Client-side controller for Fish Audio S2.1 Pro via OpenRouter API

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const apiKeyInput = document.getElementById('apiKeyInput');
  const toggleKeyVisibility = document.getElementById('toggleKeyVisibility');
  const eyeIcon = document.getElementById('eyeIcon');
  const saveKeyBtn = document.getElementById('saveKeyBtn');
  const keyStatus = document.getElementById('keyStatus');

  const modelSelect = document.getElementById('modelSelect');
  const customModelInput = document.getElementById('customModelInput');

  const voicePresetSelect = document.getElementById('voicePresetSelect');
  const voiceIdInput = document.getElementById('voiceIdInput');
  const customVoiceContainer = document.getElementById('customVoiceContainer');

  const styleMarkersList = document.getElementById('styleMarkersList');
  const formatSelect = document.getElementById('formatSelect');

  const textInput = document.getElementById('textInput');
  const charCount = document.getElementById('charCount');
  const statusMessage = document.getElementById('statusMessage');
  const generateBtn = document.getElementById('generateBtn');
  const generateBtnText = document.getElementById('generateBtnText');
  const generateIcon = document.getElementById('generateIcon');

  const outputCard = document.getElementById('outputCard');
  const audioPlayer = document.getElementById('audioPlayer');
  const downloadBtn = document.getElementById('downloadBtn');
  const outputTime = document.getElementById('outputTime');
  const generationDetails = document.getElementById('generationDetails');

  const historyCard = document.getElementById('historyCard');
  const historyList = document.getElementById('historyList');
  const clearHistoryBtn = document.getElementById('clearHistoryBtn');

  // History state
  const historyItems = [];

  // 1. Initialize API Key from LocalStorage
  const savedKey = localStorage.getItem('openrouter_api_key');
  if (savedKey) {
    apiKeyInput.value = savedKey;
    updateKeyStatus(true);
  }

  function updateKeyStatus(saved) {
    if (saved) {
      keyStatus.textContent = '✓ Tersimpan di browser';
      keyStatus.className = 'text-[11px] text-emerald-400 font-medium';
    } else {
      keyStatus.textContent = 'Belum disimpan';
      keyStatus.className = 'text-[11px] text-slate-400 font-normal';
    }
  }

  saveKeyBtn.addEventListener('click', () => {
    const key = apiKeyInput.value.trim();
    if (!key) {
      localStorage.removeItem('openrouter_api_key');
      updateKeyStatus(false);
      showStatus('API Key dihapus dari penyimpanan lokal.', 'info');
      return;
    }
    localStorage.setItem('openrouter_api_key', key);
    updateKeyStatus(true);
    showStatus('API Key berhasil disimpan!', 'success');
  });

  apiKeyInput.addEventListener('input', () => {
    const key = apiKeyInput.value.trim();
    if (key === (localStorage.getItem('openrouter_api_key') || '')) {
      updateKeyStatus(!!key);
    } else {
      keyStatus.textContent = 'Perubahan belum disimpan';
      keyStatus.className = 'text-[11px] text-amber-400 font-normal';
    }
  });

  // Toggle API Key visibility
  let isKeyVisible = false;
  toggleKeyVisibility.addEventListener('click', () => {
    isKeyVisible = !isKeyVisible;
    apiKeyInput.type = isKeyVisible ? 'text' : 'password';
    eyeIcon.innerHTML = isKeyVisible
      ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"></path>'
      : '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>';
  });

  // 2. Model Selection Handling
  modelSelect.addEventListener('change', () => {
    if (modelSelect.value === 'custom') {
      customModelInput.classList.remove('hidden');
      customModelInput.focus();
    } else {
      customModelInput.classList.add('hidden');
    }
  });

  function getSelectedModel() {
    if (modelSelect.value === 'custom') {
      return customModelInput.value.trim() || 'fish-audio/s2.1-pro-free';
    }
    return modelSelect.value;
  }

  // 3. Voice Selection Handling
  voicePresetSelect.addEventListener('change', () => {
    const val = voicePresetSelect.value;
    if (val === 'custom') {
      voiceIdInput.value = '';
      voiceIdInput.focus();
    } else {
      voiceIdInput.value = val;
    }
  });

  voiceIdInput.addEventListener('input', () => {
    const entered = voiceIdInput.value.trim();
    let found = false;
    for (const opt of voicePresetSelect.options) {
      if (opt.value === entered && opt.value !== 'custom') {
        voicePresetSelect.value = entered;
        found = true;
        break;
      }
    }
    if (!found) {
      voicePresetSelect.value = entered ? 'custom' : '';
    }
  });

  // 4. Style Marker Chips Insertion
  styleMarkersList.addEventListener('click', (e) => {
    const btn = e.target.closest('.style-chip');
    if (!btn) return;
    const tag = btn.getAttribute('data-tag');
    insertTextAtCursor(tag + ' ');
  });

  // Quick Template Buttons
  document.querySelectorAll('.template-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const text = btn.getAttribute('data-text');
      textInput.value = text;
      updateCharCount();
      textInput.focus();
    });
  });

  function insertTextAtCursor(insertStr) {
    const start = textInput.selectionStart;
    const end = textInput.selectionEnd;
    const current = textInput.value;
    textInput.value = current.substring(0, start) + insertStr + current.substring(end);
    textInput.selectionStart = textInput.selectionEnd = start + insertStr.length;
    textInput.focus();
    updateCharCount();
  }

  // Character Counter
  function updateCharCount() {
    charCount.textContent = `${textInput.value.length} karakter`;
  }
  textInput.addEventListener('input', updateCharCount);
  updateCharCount();

  // Status message utility
  function showStatus(msg, type = 'info') {
    statusMessage.textContent = msg;
    if (type === 'error') {
      statusMessage.className = 'text-xs text-rose-400 font-medium';
    } else if (type === 'success') {
      statusMessage.className = 'text-xs text-emerald-400 font-medium';
    } else if (type === 'loading') {
      statusMessage.className = 'text-xs text-indigo-400 font-medium animate-pulse';
    } else {
      statusMessage.className = 'text-xs text-slate-400';
    }
  }

  // 5. Generate Audio Call
  generateBtn.addEventListener('click', async () => {
    const apiKey = apiKeyInput.value.trim();
    if (!apiKey) {
      showStatus('⚠️ Masukkan OpenRouter API Key terlebih dahulu.', 'error');
      apiKeyInput.focus();
      return;
    }

    const text = textInput.value.trim();
    if (!text) {
      showStatus('⚠️ Masukkan teks yang ingin disintesis.', 'error');
      textInput.focus();
      return;
    }

    const model = getSelectedModel();
    const voice = voiceIdInput.value.trim() || undefined;
    const format = formatSelect.value || 'mp3';

    // UI Loading state
    setLoading(true);
    showStatus('Sedang mengirim permintaan ke OpenRouter & mensintesis suara...', 'loading');

    const requestPayload = {
      model: model,
      input: text,
      response_format: format,
    };
    if (voice) {
      requestPayload.voice = voice;
    }

    const startTime = performance.now();

    try {
      const response = await fetch('https://openrouter.ai/api/v1/audio/speech', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.href || 'http://localhost',
          'X-Title': 'Fish Audio S2 TTS Studio',
        },
        body: JSON.stringify(requestPayload),
      });

      const elapsedSec = ((performance.now() - startTime) / 1000).toFixed(2);

      if (!response.ok) {
        let errorDetails = `HTTP ${response.status}`;
        try {
          const errJson = await response.json();
          if (errJson.error && errJson.error.message) {
            errorDetails = `${errJson.error.message} (Code: ${errJson.error.code || response.status})`;
          }
        } catch {
          const errText = await response.text();
          if (errText) errorDetails = errText;
        }

        if (response.status === 401) {
          throw new Error(`API Key tidak valid atau tidak memiliki akses (${errorDetails})`);
        } else if (response.status === 402) {
          throw new Error(`Saldo/kredit OpenRouter tidak mencukupi (${errorDetails})`);
        } else if (response.status === 404) {
          throw new Error(`Model '${model}' tidak ditemukan di OpenRouter TTS. Pastikan slug model benar.`);
        } else {
          throw new Error(`Gagal sintesis: ${errorDetails}`);
        }
      }

      // Successful audio response (raw binary bytes)
      const blob = await response.blob();
      const mimeType = format === 'mp3' ? 'audio/mpeg' : 'audio/wav';
      const audioBlob = new Blob([blob], { type: mimeType });
      const audioUrl = URL.createObjectURL(audioBlob);

      // Display in output card
      audioPlayer.src = audioUrl;
      outputCard.classList.remove('hidden');
      outputTime.textContent = `${elapsedSec}s`;
      generationDetails.textContent = `Model: ${model} | Voice: ${voice ? voice.substring(0, 8) + '...' : 'Default'}`;

      const filename = `fish_s2_${Date.now()}.${format}`;
      downloadBtn.href = audioUrl;
      downloadBtn.download = filename;

      // Autoplay
      audioPlayer.play().catch(() => {
        // Autoplay policy might require manual press
      });

      showStatus(`Selesai dalam ${elapsedSec} detik! Audio berhasil dibuat.`, 'success');

      // Add to session history
      addToHistory({
        url: audioUrl,
        filename: filename,
        text: text,
        time: new Date().toLocaleTimeString(),
        voice: voice || 'Default',
        model: model,
      });

    } catch (err) {
      console.error('TTS Error:', err);
      showStatus(`❌ ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  });

  function setLoading(isLoading) {
    generateBtn.disabled = isLoading;
    if (isLoading) {
      generateBtnText.textContent = 'Sedang Mensintesis...';
      generateIcon.innerHTML = `
        <svg class="animate-spin w-4 h-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
        </svg>
      `;
    } else {
      generateBtnText.textContent = 'Generate Suara';
      generateIcon.innerHTML = `
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      `;
    }
  }

  // 6. History Management
  function addToHistory(item) {
    historyItems.unshift(item);
    renderHistory();
  }

  function renderHistory() {
    if (historyItems.length === 0) {
      historyCard.classList.add('hidden');
      return;
    }
    historyCard.classList.remove('hidden');
    historyList.innerHTML = '';

    historyItems.forEach((item, idx) => {
      const el = document.createElement('div');
      el.className = 'p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between gap-3 text-xs';
      el.innerHTML = `
        <div class="flex-1 min-w-0">
          <p class="text-slate-200 truncate font-medium">"${escapeHtml(item.text)}"</p>
          <p class="text-[11px] text-slate-500 mt-0.5">${item.time} • Voice: ${item.voice}</p>
        </div>
        <div class="flex items-center gap-2 flex-shrink-0">
          <button class="play-hist-btn px-2.5 py-1 rounded bg-indigo-600/30 hover:bg-indigo-600 text-indigo-200 hover:text-white transition" data-idx="${idx}">
            ▶ Putar
          </button>
          <a href="${item.url}" download="${item.filename}" class="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition" title="Download">
            ⬇
          </a>
        </div>
      `;
      historyList.appendChild(el);
    });

    // Attach play event listeners
    document.querySelectorAll('.play-hist-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-idx'), 10);
        const item = historyItems[idx];
        if (item) {
          audioPlayer.src = item.url;
          outputCard.classList.remove('hidden');
          downloadBtn.href = item.url;
          downloadBtn.download = item.filename;
          generationDetails.textContent = `Model: ${item.model} | Voice: ${item.voice}`;
          audioPlayer.play().catch(() => {});
        }
      });
    });
  }

  clearHistoryBtn.addEventListener('click', () => {
    historyItems.length = 0;
    renderHistory();
  });

  function escapeHtml(string) {
    const div = document.createElement('div');
    div.innerText = string;
    return div.innerHTML;
  }
});
