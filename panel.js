let eventCount = 0;
let autoScrollEnabled = true;

// Get references to DOM elements
const eventsList = document.getElementById('eventsList');
const eventCountElement = document.getElementById('eventCount');
const clearBtn = document.getElementById('clearBtn');
const autoScrollCheckbox = document.getElementById('autoScroll');

// Handle auto-scroll checkbox
autoScrollCheckbox.addEventListener('change', (e) => {
  autoScrollEnabled = e.target.checked;
});

// Clear button handler
clearBtn.addEventListener('click', () => {
  eventsList.innerHTML = `
    <div class="bg-white rounded-lg shadow-sm p-6 text-center text-gray-500">
      <svg class="mx-auto h-12 w-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
      </svg>
      <p class="text-lg font-medium">No dataLayer events captured yet</p>
      <p class="text-sm mt-1">Waiting for dataLayer.push() calls...</p>
    </div>
  `;
  eventCount = 0;
  eventCountElement.textContent = '0';
});

// Format JSON with syntax highlighting
function formatJSON(obj, indent = 0) {
  const spaces = '  '.repeat(indent);
  
  if (obj === null) {
    return `<span class="json-null">null</span>`;
  }
  
  if (typeof obj === 'string') {
    return `<span class="json-string">"${escapeHtml(obj)}"</span>`;
  }
  
  if (typeof obj === 'number') {
    return `<span class="json-number">${obj}</span>`;
  }
  
  if (typeof obj === 'boolean') {
    return `<span class="json-boolean">${obj}</span>`;
  }
  
  if (Array.isArray(obj)) {
    if (obj.length === 0) return '[]';
    const items = obj.map(item => `${spaces}  ${formatJSON(item, indent + 1)}`);
    return `[\n${items.join(',\n')}\n${spaces}]`;
  }
  
  if (typeof obj === 'object') {
    const keys = Object.keys(obj);
    if (keys.length === 0) return '{}';
    const items = keys.map(key => {
      const value = formatJSON(obj[key], indent + 1);
      return `${spaces}  <span class="json-key">"${escapeHtml(key)}"</span>: ${value}`;
    });
    return `{\n${items.join(',\n')}\n${spaces}}`;
  }
  
  return String(obj);
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

// Add event to the display
function addEvent(eventData) {
  // Remove placeholder if it exists
  const placeholder = eventsList.querySelector('.text-center');
  if (placeholder && placeholder.parentElement === eventsList) {
    eventsList.innerHTML = '';
  }
  
  eventCount++;
  eventCountElement.textContent = eventCount;
  
  const timestamp = new Date(eventData.timestamp).toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    fractionalSecondDigits: 3
  });
  
  const eventDiv = document.createElement('div');
  eventDiv.className = 'event-item new-event bg-white rounded-lg shadow-sm p-4 border-l-4 border-blue-500';
  
  const formattedData = formatJSON(eventData.data);
  
  eventDiv.innerHTML = `
    <div class="flex justify-between items-start mb-3">
      <div class="flex items-center gap-3">
        <span class="text-sm font-semibold text-gray-700 bg-blue-100 px-3 py-1 rounded-full">
          Event #${eventCount}
        </span>
        <span class="text-xs text-gray-500 font-mono">${timestamp}</span>
      </div>
      <button class="toggle-btn text-sm text-blue-600 hover:text-blue-800 font-medium">
        Collapse
      </button>
    </div>
    <div class="event-content">
      <pre class="bg-gray-50 p-4 rounded-lg text-sm font-mono overflow-x-auto border border-gray-200">${formattedData}</pre>
    </div>
  `;
  
  // Add toggle functionality
  const toggleBtn = eventDiv.querySelector('.toggle-btn');
  const content = eventDiv.querySelector('.event-content');
  
  toggleBtn.addEventListener('click', () => {
    if (content.style.display === 'none') {
      content.style.display = 'block';
      toggleBtn.textContent = 'Collapse';
    } else {
      content.style.display = 'none';
      toggleBtn.textContent = 'Expand';
    }
  });
  
  eventsList.appendChild(eventDiv);
  
  // Remove the highlight animation class after it completes
  setTimeout(() => {
    eventDiv.classList.remove('new-event');
  }, 2000);
  
  // Auto-scroll to the new event
  if (autoScrollEnabled) {
    eventDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

// Connect to the background script
const port = chrome.runtime.connect({ name: 'devtools' });

// Send the tab ID to the background script
port.postMessage({
  type: 'init',
  tabId: chrome.devtools.inspectedWindow.tabId
});

// Listen for messages from the background script
port.onMessage.addListener((message) => {
  if (message.type === 'dataLayerPush') {
    addEvent(message.data);
  } else if (message.type === 'initialData') {
    // Handle initial dataLayer state
    if (message.data && message.data.length > 0) {
      message.data.forEach(item => {
        addEvent({
          timestamp: Date.now(),
          data: item
        });
      });
    }
  }
});

// Request initial dataLayer state when panel opens
setTimeout(() => {
  port.postMessage({
    type: 'getInitialData',
    tabId: chrome.devtools.inspectedWindow.tabId
  });
}, 500);
