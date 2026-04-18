// Content script for Google Meet data extraction
class KapturContent {
  constructor() {
    if (!window.location.href.startsWith('https://meet.google.com/')) {
      console.log('Kaptur: Not on Google Meet');
      return;
    }
    console.log('Kaptur: Initializing on Meet');
    this.participants = [];
    this.chat = [];
    this.initObservers();
    this.sendDataToBackground();
  }

  initObservers() {
    // Participants observer
    const participantObserver = new MutationObserver(this.updateParticipants.bind(this));
    participantObserver.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['data-self-name', 'aria-label']
    });

    // Chat observer
    const chatObserver = new MutationObserver(this.updateChat.bind(this));
    chatObserver.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  updateParticipants() {
    const items = document.querySelectorAll('[data-self-name], [role="gridcell"], .VDX9wd');
    const newParticipants = Array.from(items)
      .map(item => ({
        name: item.getAttribute('data-self-name') || 
              item.getAttribute('aria-label') || 
              item.textContent.trim().split('\\n')[0] || 'Inconnu',
        joined: new Date().toISOString()
      }))
      .filter(p => p.name !== 'Inconnu')
      .slice(0, 50); // Limit

    const changed = JSON.stringify(newParticipants) !== JSON.stringify(this.participants);
    if (changed) {
      this.participants = [...new Set(newParticipants.map(p => p.name))].map(name => ({
        name,
        joined: new Date().toISOString()
      }));
      console.log('Kaptur: Participants updated', this.participants.length);
      this.sendDataToBackground();
    }
  }

  updateChat() {
    const chatMessages = document.querySelectorAll('[data-message-author], .oIyJo, [jsname="Hc3bBd"], .NPEdkd');
    const newChat = Array.from(chatMessages)
      .map(msg => {
        const author = msg.getAttribute('data-message-author') || 
                       msg.querySelector('[data-self-name]')?.textContent || 'Système';
        const text = msg.textContent.trim();
        return { author, text, timestamp: new Date().toISOString() };
      })
      .filter(msg => msg.text.length > 0)
      .slice(-100); // Last 100 msgs

    if (newChat.length > this.chat.length) {
      this.chat = newChat;
      console.log('Kaptur: Chat updated', this.chat.length);
      this.sendDataToBackground();
    }
  }

  sendDataToBackground() {
    chrome.runtime.sendMessage({
      action: 'updateData',
      data: {
        participantCount: this.participants.length,
        participants: this.participants,
        chat: this.chat
      }
    });
  }
}

// Message handling from background
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getCurrentData') {
    sendResponse({
      participants: kapturContent ? kapturContent.participants : [],
      chat: kapturContent ? kapturContent.chat : []
    });
  }
});

// Init
const kapturContent = new KapturContent();

