// DataLayer Visualizer Panel Script
(function() {
  'use strict';
  
  // State
  let events = [];
  let selectedEventIndex = null;
  let networkRequests = new Map();
  let persistEnabled = true;
  let ga4PropertyId = null;
  let columnWidth = 30; // percentage
  
  // DOM Elements
  const eventsList = document.getElementById('eventsList');
  const detailsContent = document.getElementById('detailsContent');
  const eventCount = document.getElementById('eventCount');
  const gtmStatus = document.getElementById('gtmStatus');
  const clearAllBtn = document.getElementById('clearAllBtn');
  const refreshBtn = document.getElementById('refreshBtn');
  const persistToggle = document.getElementById('persistToggle');
  const ga4DebugViewBtn = document.getElementById('ga4DebugViewBtn');
  const divider = document.getElementById('divider');
  const eventsPanel = document.getElementById('eventsPanel');
  const copyJsonBtn = document.getElementById('copyJsonBtn');
  const expandAllBtn = document.getElementById('expandAllBtn');
  const collapseAllBtn = document.getElementById('collapseAllBtn');
  const themeToggle = document.getElementById('themeToggle');
  
  // Theme management
  const THEME_KEY = 'datalayer-visualizer-theme';
  
  // Initialize
  init();
  
  function init() {
    initTheme();
    loadSettings();
    setupEventListeners();
    loadPersistedEvents();
    connectToBackgroundScript();
    
    // Load existing dataLayer events from the page
    chrome.devtools.inspectedWindow.eval(
      'window.dataLayer ? JSON.stringify(window.dataLayer) : "[]"',
      function(result, isException) {
        if (!isException && result) {
          try {
            const dataLayerEvents = JSON.parse(result);
            // Get the inspected window URL
            chrome.devtools.inspectedWindow.eval(
              'window.location.href',
              function(url) {
                dataLayerEvents.forEach((event, index) => {
                  addEvent({
                    index: index,
                    timestamp: Date.now(),
                    url: url || '',
                    data: event,
                    gtmPreview: { active: false, containerIds: [] },
                    ga4PropertyId: null
                  });
                });
              }
            );
          } catch (e) {
            console.error('Error parsing dataLayer:', e);
          }
        }
      }
    );
  }
  
  function loadSettings() {
    // Load column width
    const savedWidth = localStorage.getItem('columnWidth');
    if (savedWidth && eventsPanel) {
      columnWidth = parseFloat(savedWidth);
      eventsPanel.style.width = columnWidth + '%';
    }
    
    // Load GA4 Property ID
    chrome.storage.sync.get(['ga4PropertyId'], function(result) {
      if (result.ga4PropertyId) {
        ga4PropertyId = result.ga4PropertyId;
      }
    });
    
    // Load persist preference
    const persistPref = localStorage.getItem('persistEnabled');
    if (persistPref !== null) {
      persistEnabled = persistPref === 'true';
      updatePersistToggle();
    }
  }
  
  function setupEventListeners() {
    // Clear all button
    if (clearAllBtn) {
      clearAllBtn.addEventListener('click', clearAllEvents);
    }
    
    // Refresh button
    if (refreshBtn) {
      refreshBtn.addEventListener('click', refreshDataLayer);
    }
    
    // Persist toggle
    if (persistToggle) {
      persistToggle.addEventListener('click', togglePersist);
    }
    
    // GA4 DebugView button
    if (ga4DebugViewBtn) {
      ga4DebugViewBtn.addEventListener('click', openGA4DebugView);
      ga4DebugViewBtn.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        openSettingsModal();
      });
    }
    
    // Resizable divider
    setupResizableDivider();
    
    // Copy JSON button
    if (copyJsonBtn) {
      copyJsonBtn.addEventListener('click', copySelectedEventJson);
    }
    
    // Expand/Collapse buttons
    if (expandAllBtn) {
      expandAllBtn.addEventListener('click', () => toggleAllJson(false));
    }
    if (collapseAllBtn) {
      collapseAllBtn.addEventListener('click', () => toggleAllJson(true));
    }
    
    // Listen for navigation events
    chrome.devtools.network.onNavigated.addListener(function(url) {
      if (persistEnabled) {
        addNavigationMarker(url);
      } else {
        clearAllEvents();
      }
    });
    
    // Theme toggle button
    if (themeToggle) {
      themeToggle.addEventListener('click', toggleTheme);
    }
  }
  
  function initTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY);
    
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      // User has a saved preference
      applyTheme(savedTheme);
    } else {
      // Auto-detect from DevTools
      const devToolsTheme = chrome.devtools?.panels?.themeName;
      applyTheme(devToolsTheme === 'dark' ? 'dark' : 'light');
    }
  }
  
  function applyTheme(theme) {
    if (!themeToggle) return;
    const themeIcon = themeToggle.querySelector('.theme-icon');
    if (theme === 'dark') {
      document.body.classList.add('dark');
      if (themeIcon) themeIcon.textContent = '☀️';
    } else {
      document.body.classList.remove('dark');
      if (themeIcon) themeIcon.textContent = '🌙';
    }
  }
  
  function toggleTheme() {
    const isDark = document.body.classList.contains('dark');
    const newTheme = isDark ? 'light' : 'dark';
    localStorage.setItem(THEME_KEY, newTheme);
    applyTheme(newTheme);
  }
  
  function connectToBackgroundScript() {
    // Listen for messages from background script
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.type === 'DATALAYER_EVENT') {
        addEvent(message.data);
      } else if (message.type === 'NETWORK_REQUEST') {
        handleNetworkRequest(message.data);
      } else if (message.type === 'NETWORK_REQUEST_COMPLETED') {
        updateNetworkRequest(message.data);
      } else if (message.type === 'NETWORK_REQUEST_FAILED') {
        updateNetworkRequest(message.data);
      }
    });
    
    // Request existing events from background
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      if (tabs[0]) {
        chrome.runtime.sendMessage({
          type: 'GET_TAB_DATA',
          tabId: tabs[0].id
        }, function(response) {
          if (response && response.data) {
            response.data.forEach(event => addEvent(event));
          }
        });
      }
    });
  }
  
  function addEvent(eventData) {
    events.push(eventData);
    
    // Update GTM status if preview is active
    if (eventData.gtmPreview && eventData.gtmPreview.active) {
      updateGTMStatus(eventData.gtmPreview);
    }
    
    // Update GA4 property ID if detected
    if (eventData.ga4PropertyId && !ga4PropertyId) {
      ga4PropertyId = eventData.ga4PropertyId;
    }
    
    renderEventsList();
    
    // Persist to session storage if enabled
    if (persistEnabled) {
      persistEvents();
    }
  }
  
  function addNavigationMarker(url) {
    const marker = {
      index: events.length,
      timestamp: Date.now(),
      url: url,
      isNavigationMarker: true
    };
    events.push(marker);
    renderEventsList();
    persistEvents();
  }
  
  function renderEventsList() {
    if (!eventsList || !eventCount) return;
    
    eventsList.innerHTML = '';
    eventCount.textContent = events.length;
    
    // Render events in reverse order (most recent first)
    for (let i = events.length - 1; i >= 0; i--) {
      const event = events[i];
      if (event.isNavigationMarker) {
        const markerEl = createNavigationMarker(event, i);
        eventsList.appendChild(markerEl);
      } else {
        const eventEl = createEventElement(event, i);
        eventsList.appendChild(eventEl);
      }
    }
  }
  
  function createNavigationMarker(marker, index) {
    const div = document.createElement('div');
    div.className = 'event-item navigation-marker';
    div.innerHTML = `
      <div class="event-name">🔄 Navigation</div>
      <div class="event-url">${escapeHtml(marker.url)}</div>
      <div class="event-meta">
        <span class="event-timestamp">${formatTimestamp(marker.timestamp)}</span>
      </div>
    `;
    return div;
  }
  
  function createEventElement(event, index) {
    const div = document.createElement('div');
    div.className = 'event-item';
    if (selectedEventIndex === index) {
      div.classList.add('selected');
    }
    
    const eventName = getEventName(event.data);
    const networkIndicator = getNetworkIndicator(index);
    
    div.innerHTML = `
      <div class="event-header">
        <span class="event-name">${escapeHtml(eventName)}</span>
        <div class="event-indicators">
          ${networkIndicator}
        </div>
      </div>
      <div class="event-meta">
        <span class="event-timestamp">${formatTimestamp(event.timestamp)}</span>
        <span class="event-index">#${event.index}</span>
      </div>
      ${event.url ? `<div class="event-url">${escapeHtml(truncateUrl(event.url))}</div>` : ''}
    `;
    
    div.addEventListener('click', () => selectEvent(index));
    
    return div;
  }
  
  function getEventName(data) {
    if (!data) return 'Unknown';
    if (typeof data === 'string') return data;
    return data.event || data['gtm.element'] || data['0'] || 'dataLayer.push';
  }
  
  function getNetworkIndicator(eventIndex) {
    const request = networkRequests.get(eventIndex);
    if (!request) return '';
    
    const statusClass = request.status === 'completed' ? '' : 
                       request.status === 'failed' ? 'failed' : 'pending';
    
    return `<span class="network-indicator ${statusClass}" title="${request.type} - ${request.status}">${request.type}</span>`;
  }
  
  function selectEvent(index) {
    selectedEventIndex = index;
    renderEventsList();
    renderEventDetails(events[index]);
  }
  
  function renderEventDetails(event) {
    if (event.isNavigationMarker) {
      detailsContent.innerHTML = `
        <div class="json-container">
          <div><span class="json-key">Navigation Event</span></div>
          <div><span class="json-key">URL:</span> <span class="json-string">${escapeHtml(event.url)}</span></div>
          <div><span class="json-key">Timestamp:</span> <span class="json-number">${event.timestamp}</span></div>
        </div>
      `;
      return;
    }
    
    const jsonHtml = syntaxHighlightJson(event.data, 0, true);
    
    let networkHtml = '';
    const request = networkRequests.get(selectedEventIndex);
    if (request) {
      networkHtml = `
        <div class="network-details">
          <h4>📡 Network Request</h4>
          <div class="detail-row">
            <span class="detail-label">Type:</span>
            <span class="detail-value">${request.type}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Status:</span>
            <span class="detail-value">${request.status}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">URL:</span>
            <span class="detail-value">${escapeHtml(request.url)}</span>
          </div>
          ${request.statusCode ? `
            <div class="detail-row">
              <span class="detail-label">Status Code:</span>
              <span class="detail-value">${request.statusCode}</span>
            </div>
          ` : ''}
        </div>
      `;
    }
    
    detailsContent.innerHTML = `
      <div class="json-container">
        ${jsonHtml}
      </div>
      ${networkHtml}
    `;
    
    // Setup collapsible toggles
    setupJsonToggles();
  }
  
  function syntaxHighlightJson(obj, depth = 0, isRoot = false, trailingComma = '') {
    const indent = '  '.repeat(depth);
    const nextIndent = '  '.repeat(depth + 1);
    
    if (obj === null) {
      return `<span class="json-null">null</span>${trailingComma}`;
    }
    
    if (obj === undefined) {
      return `<span class="json-null">undefined</span>${trailingComma}`;
    }
    
    const type = typeof obj;
    
    if (type === 'boolean') {
      return `<span class="json-boolean">${obj}</span>${trailingComma}`;
    }
    
    if (type === 'number') {
      return `<span class="json-number">${obj}</span>${trailingComma}`;
    }
    
    if (type === 'string') {
      return `<span class="json-string">"${escapeHtml(obj)}"</span>${trailingComma}`;
    }
    
    if (Array.isArray(obj)) {
      if (obj.length === 0) {
        return `<span class="json-bracket">[]${trailingComma}</span>`;
      }
      
      const id = 'collapse-' + Math.random().toString(36).substring(2, 11);
      const itemCount = obj.length;
      let html = isRoot ? `<div class="json-line">` : '';
      html += `<span class="json-toggle" data-target="${id}">▼</span>`;
      html += `<span class="json-bracket">[</span>`;
      html += `<span class="json-preview" data-target="${id}"> // ${itemCount} item${itemCount !== 1 ? 's' : ''}</span>`;
      html += `<div class="json-content" id="${id}">`;
      
      obj.forEach((item, index) => {
        const comma = index < obj.length - 1 ? ',' : '';
        const itemHtml = syntaxHighlightJson(item, depth + 1, false, comma);
        html += `<div>${nextIndent}${itemHtml}</div>`;
      });
      
      html += `</div>`;
      html += `<div>${indent}<span class="json-bracket">]${trailingComma}</span></div>`;
      html += isRoot ? `</div>` : '';
      return html;
    }
    
    if (type === 'object') {
      const keys = Object.keys(obj);
      if (keys.length === 0) {
        return `<span class="json-bracket">{}${trailingComma}</span>`;
      }
      
      const id = 'collapse-' + Math.random().toString(36).substring(2, 11);
      const keyCount = keys.length;
      let html = isRoot ? `<div class="json-line">` : '';
      html += `<span class="json-toggle" data-target="${id}">▼</span>`;
      html += `<span class="json-bracket">{</span>`;
      html += `<span class="json-preview" data-target="${id}"> // ${keyCount} key${keyCount !== 1 ? 's' : ''}</span>`;
      html += `<div class="json-content" id="${id}">`;
      
      keys.forEach((key, index) => {
        const value = obj[key];
        const comma = index < keys.length - 1 ? ',' : '';
        html += `<div>${nextIndent}<span class="json-key">"${escapeHtml(key)}"</span>: ${syntaxHighlightJson(value, depth + 1, false, comma)}</div>`;
      });
      
      html += `</div>`;
      html += `<div>${indent}<span class="json-bracket">}${trailingComma}</span></div>`;
      html += isRoot ? `</div>` : '';
      return html;
    }
    
    return String(obj);
  }
  
  function setupJsonToggles() {
    const toggles = detailsContent.querySelectorAll('.json-toggle');
    toggles.forEach(toggle => {
      toggle.addEventListener('click', function() {
        const targetId = this.getAttribute('data-target');
        const target = document.getElementById(targetId);
        const preview = detailsContent.querySelector(`.json-preview[data-target="${targetId}"]`);
        
        if (target) {
          // Toggle the collapsed state
          target.classList.toggle('collapsed');
          // After toggle, check if content is now collapsed
          const isNowCollapsed = target.classList.contains('collapsed');
          
          // Sync chevron rotation with collapse state - when content is collapsed, chevron should be rotated
          if (isNowCollapsed) {
            this.classList.add('collapsed');
          } else {
            this.classList.remove('collapsed');
          }
          
          // Show preview when collapsed, hide when expanded
          if (preview) {
            preview.style.display = isNowCollapsed ? 'inline' : 'none';
          }
        }
      });
    });
  }
  
  function toggleAllJson(collapse) {
    const contents = detailsContent.querySelectorAll('.json-content');
    const toggles = detailsContent.querySelectorAll('.json-toggle');
    const previews = detailsContent.querySelectorAll('.json-preview');
    
    contents.forEach(content => {
      if (collapse) {
        content.classList.add('collapsed');
      } else {
        content.classList.remove('collapsed');
      }
    });
    
    toggles.forEach(toggle => {
      if (collapse) {
        toggle.classList.add('collapsed');
      } else {
        toggle.classList.remove('collapsed');
      }
    });
    
    previews.forEach(preview => {
      preview.style.display = collapse ? 'inline' : 'none';
    });
  }
  
  function handleNetworkRequest(request) {
    // Try to correlate with recent events
    const recentEventIndex = events.length - 1;
    if (recentEventIndex >= 0) {
      networkRequests.set(recentEventIndex, request);
      renderEventsList();
      
      // Update details if this event is selected
      if (selectedEventIndex === recentEventIndex) {
        renderEventDetails(events[recentEventIndex]);
      }
    }
  }
  
  function updateNetworkRequest(request) {
    // Find and update the request
    for (let [index, req] of networkRequests.entries()) {
      if (req.requestId === request.requestId) {
        networkRequests.set(index, request);
        renderEventsList();
        
        if (selectedEventIndex === index) {
          renderEventDetails(events[index]);
        }
        break;
      }
    }
  }
  
  function updateGTMStatus(gtmPreview) {
    if (!gtmStatus) return;
    
    if (gtmPreview.active) {
      gtmStatus.classList.add('active');
      const containerText = gtmPreview.containerIds.length > 0 
        ? ` (${gtmPreview.containerIds.join(', ')})` 
        : '';
      const statusText = gtmStatus.querySelector('.status-text');
      if (statusText) {
        statusText.textContent = `GTM Preview: Active${containerText}`;
      }
    }
  }
  
  function clearAllEvents() {
    events = [];
    networkRequests.clear();
    selectedEventIndex = null;
    renderEventsList();
    if (detailsContent) {
      detailsContent.innerHTML = '<div class="placeholder"><span>👈 Select an event to view details</span></div>';
    }
    
    // Clear persisted events
    chrome.storage.session.remove(['persistedEvents']);
    
    // Clear background data
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      if (tabs[0]) {
        chrome.runtime.sendMessage({
          type: 'CLEAR_TAB_DATA',
          tabId: tabs[0].id
        });
      }
    });
  }
  
  function refreshDataLayer() {
    const refreshIcon = document.querySelector('.refresh-icon');
    if (!refreshIcon) {
      console.error('Refresh icon not found');
      return;
    }
    
    refreshIcon.classList.add('spinning');
    
    // Clear existing events before refresh
    events = [];
    networkRequests.clear();
    selectedEventIndex = null;
    renderEventsList();
    if (detailsContent) {
      detailsContent.innerHTML = '<div class="placeholder"><span>👈 Select an event to view details</span></div>';
    }
    
    // Send message to background to re-inject and fetch dataLayer
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      if (tabs[0]) {
        chrome.runtime.sendMessage({
          action: 'refreshDataLayer',
          tabId: tabs[0].id
        }, (response) => {
          // Stop spinning after response or timeout
          setTimeout(() => {
            if (refreshIcon) {
              refreshIcon.classList.remove('spinning');
            }
          }, 1000);
        });
      } else {
        // No active tab, remove spinning immediately
        if (refreshIcon) {
          refreshIcon.classList.remove('spinning');
        }
      }
    });
  }
  
  function togglePersist() {
    persistEnabled = !persistEnabled;
    localStorage.setItem('persistEnabled', persistEnabled);
    updatePersistToggle();
  }
  
  function updatePersistToggle() {
    if (!persistToggle) return;
    const icon = document.getElementById('persistIcon');
    if (persistEnabled) {
      persistToggle.classList.add('btn-primary');
      persistToggle.classList.remove('btn-secondary');
      if (icon) icon.textContent = '💾';
    } else {
      persistToggle.classList.remove('btn-primary');
      persistToggle.classList.add('btn-secondary');
      if (icon) icon.textContent = '📋';
    }
  }
  
  function openGA4DebugView() {
    if (!ga4PropertyId) {
      // Try to detect from events
      for (let event of events) {
        if (event.ga4PropertyId) {
          ga4PropertyId = event.ga4PropertyId;
          break;
        }
      }
    }
    
    if (ga4PropertyId) {
      // Extract numeric property ID if it's a measurement ID (G-XXXXXXXX)
      let propertyId = ga4PropertyId;
      if (propertyId.startsWith('G-')) {
        // For measurement IDs, we need the numeric property ID
        // Show settings modal to ask user to configure
        openSettingsModal();
        return;
      }
      
      const url = `https://analytics.google.com/analytics/web/#/p${propertyId}/debugview`;
      chrome.tabs.create({ url: url });
    } else {
      openSettingsModal();
    }
  }
  
  function openSettingsModal() {
    const modal = document.getElementById('settingsModal');
    const input = document.getElementById('ga4PropertyId');
    
    if (ga4PropertyId) {
      input.value = ga4PropertyId;
    }
    
    modal.classList.add('show');
    
    // Setup modal event listeners
    document.getElementById('closeSettings').onclick = () => {
      modal.classList.remove('show');
    };
    
    document.getElementById('cancelSettings').onclick = () => {
      modal.classList.remove('show');
    };
    
    document.getElementById('saveSettings').onclick = () => {
      const value = input.value.trim();
      if (value) {
        ga4PropertyId = value;
        chrome.storage.sync.set({ ga4PropertyId: value });
      }
      modal.classList.remove('show');
    };
    
    // Close on outside click
    modal.onclick = (e) => {
      if (e.target === modal) {
        modal.classList.remove('show');
      }
    };
  }
  
  function copyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    textarea.style.top = '-9999px';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    
    let success = false;
    try {
      success = document.execCommand('copy');
    } catch (err) {
      console.error('Copy failed:', err);
    } finally {
      document.body.removeChild(textarea);
    }
    
    return success;
  }
  
  function copySelectedEventJson() {
    if (selectedEventIndex === null || !copyJsonBtn) return;
    
    const event = events[selectedEventIndex];
    if (event && !event.isNavigationMarker) {
      const json = JSON.stringify(event.data, null, 2);
      if (copyToClipboard(json)) {
        // Show feedback
        copyJsonBtn.textContent = '✅';
        setTimeout(() => {
          copyJsonBtn.textContent = '📋';
        }, 1500);
      }
    }
  }
  
  function setupResizableDivider() {
    if (!divider) return;
    
    let isDragging = false;
    
    divider.addEventListener('mousedown', (e) => {
      isDragging = true;
      divider.classList.add('dragging');
      document.body.style.cursor = 'col-resize';
      e.preventDefault();
    });
    
    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      
      const containerWidth = document.querySelector('.main-container').offsetWidth;
      const newWidth = (e.clientX / containerWidth) * 100;
      
      // Limit between 15% and 70%
      if (newWidth >= 15 && newWidth <= 70) {
        columnWidth = newWidth;
        eventsPanel.style.width = columnWidth + '%';
      }
    });
    
    document.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        divider.classList.remove('dragging');
        document.body.style.cursor = '';
        
        // Save preference
        localStorage.setItem('columnWidth', columnWidth);
      }
    });
  }
  
  function persistEvents() {
    chrome.storage.session.set({
      persistedEvents: events
    });
  }
  
  function loadPersistedEvents() {
    if (!persistEnabled) return;
    
    chrome.storage.session.get(['persistedEvents'], (result) => {
      if (result.persistedEvents && Array.isArray(result.persistedEvents)) {
        events = result.persistedEvents;
        renderEventsList();
      }
    });
  }
  
  // Helper functions
  function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      fractionalSecondDigits: 3
    });
  }
  
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
  
  function truncateUrl(url) {
    if (url.length > 50) {
      return url.substring(0, 47) + '...';
    }
    return url;
  }
})();
