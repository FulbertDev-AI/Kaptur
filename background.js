// background.js - Service Worker pour alarmes et captures
let isKapturEnabled = false;

chrome.runtime.onInstalled.addListener(() => {
  chrome.alarms.clear('kaptur-alarm');
  chrome.storage.local.set({ captures: [], participants: [], chat: [], captureCount: 0, participantCount: 0 });
  console.log('Kaptur installé. Alarmes désactivées par défaut.');
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'startKaptur') {
    isKapturEnabled = true;
    chrome.alarms.create('kaptur-alarm', { periodInMinutes: 5 });
    console.log('Kaptur démarré: alarmes toutes les 5min');
    sendResponse({ status: 'started' });
  } else if (request.action === 'stopKaptur') {
    isKapturEnabled = false;
    chrome.alarms.clear('kaptur-alarm');
    console.log('Kaptur arrêté');
    sendResponse({ status: 'stopped' });
  } else if (request.action === 'getData') {
    chrome.storage.local.get(['captures', 'participants', 'chat', 'captureCount', 'participantCount'], sendResponse);
    return true; // async response
  } else if (request.action === 'updateData') {
    chrome.storage.local.set(request.data);
    console.log('Données mises à jour:', request.data);
  }
});

// Alarme pour captures
chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === 'kaptur-alarm' && isKapturEnabled) {
    console.log('Alarme déclenchée: capture en cours...');
    
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab && tab.url.startsWith('https://meet.google.com/')) {
      try {
        // Capture d'écran
        const screenshot = await chrome.tabs.captureVisibleTab(tab.windowId, { format: 'png' });
        
        // Récup data from content script
        const data = await chrome.tabs.sendMessage(tab.id, { action: 'getCurrentData' });
        
        const timestamp = new Date().toISOString();
        const captureData = {
          timestamp,
          screenshot: screenshot,
          participants: data.participants || [],
          chat: data.chat || []
        };
        
        // Update storage
        const storage = await chrome.storage.local.get(['captures', 'captureCount']);
        const newCaptures = (storage.captures || []).concat([captureData]);
        await chrome.storage.local.set({
          captures: newCaptures,
          captureCount: (storage.captureCount || 0) + 1,
          participantCount: data.participants?.length || 0
        });
        
        console.log('Capture sauvegardée:', timestamp);
      } catch (error) {
        console.error('Erreur capture:', error);
      }
    } else {
      console.log('Non sur Google Meet ou onglet inactif');
    }
  }
});

