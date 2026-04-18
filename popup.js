// popup.js - Logique interface popup
document.addEventListener('DOMContentLoaded', () => {
  const startBtn = document.getElementById('startBtn');
  const stopBtn = document.getElementById('stopBtn');
  const exportBtn = document.getElementById('exportBtn');
  const statusEl = document.getElementById('status');
  const participantCountEl = document.getElementById('participantCount');
  const captureCountEl = document.getElementById('captureCount');

  // Écouter changements storage pour live updates
  chrome.storage.onChanged.addListener((changes) => {
    if (changes.participantCount) participantCountEl.textContent = changes.participantCount.newValue || 0;
    if (changes.captureCount) captureCountEl.textContent = changes.captureCount.newValue || 0;
  });

  // Load initial data
  chrome.runtime.sendMessage({ action: 'getData' }, (data) => {
    participantCountEl.textContent = data.participantCount || 0;
    captureCountEl.textContent = data.captureCount || 0;
  });

  startBtn.onclick = () => {
    chrome.runtime.sendMessage({ action: 'startKaptur' }, (response) => {
      if (response.status === 'started') {
        startBtn.disabled = true;
        startBtn.classList.add('opacity-50');
        stopBtn.disabled = false;
        stopBtn.classList.remove('opacity-50');
        statusEl.textContent = 'Actif - Capture toutes 5min';
        statusEl.classList.add('text-kaptur-400');
      }
    });
  };

  stopBtn.onclick = () => {
    chrome.runtime.sendMessage({ action: 'stopKaptur' }, (response) => {
      if (response.status === 'stopped') {
        startBtn.disabled = false;
        startBtn.classList.remove('opacity-50');
        stopBtn.disabled = true;
        stopBtn.classList.add('opacity-50');
        statusEl.textContent = 'Arrêté';
        statusEl.classList.remove('text-kaptur-400');
      }
    });
  };

  exportBtn.onclick = async () => {
    const data = await chrome.storage.local.get(['captures', 'participants', 'chat']);
    
    // Créer onglet rapport
    const tab = await chrome.tabs.create({ url: 'rapport_final.html' });
    
    // Attendre chargement puis injecter data
    chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
      if (tabId === tab.id && info.status === 'complete') {
        chrome.tabs.onUpdated.removeListener(listener);
        chrome.tabs.sendMessage(tabId, { action: 'loadReportData', data });
      }
    });
  };
});

