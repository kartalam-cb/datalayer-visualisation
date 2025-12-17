// This script is injected into the page context to access the dataLayer
(function() {
  'use strict';
  
  // Check if already injected
  if (window.__DATALAYER_VISUALIZER_INJECTED__) {
    console.log('DataLayer Visualizer: Already injected, skipping');
    return;
  }
  window.__DATALAYER_VISUALIZER_INJECTED__ = true;
  
  let eventIndex = 0;
  
  // Track seen events to prevent duplicates
  const seenEvents = new Set();
  
  // Generate a fingerprint for an event to detect duplicates
  function generateEventFingerprint(event) {
    try {
      const content = JSON.stringify(event);
      const timeWindow = Math.floor(Date.now() / 100); // 100ms windows
      return `${content}_${timeWindow}`;
    } catch (e) {
      // Handle circular references or other JSON.stringify errors
      // Use a fallback fingerprint based on object properties
      console.warn('DataLayer Visualizer: Error creating fingerprint, using fallback', e);
      const fallback = Object.keys(event || {}).sort().join(',');
      const timeWindow = Math.floor(Date.now() / 100);
      return `${fallback}_${timeWindow}`;
    }
  }
  
  // Function to send events to content script
  function sendDataLayerEvent(event, originalPush) {
    // Generate fingerprint for deduplication
    const fingerprint = generateEventFingerprint(event);
    
    // Skip if we've seen this exact event recently
    if (seenEvents.has(fingerprint)) {
      console.log('DataLayer Visualizer: Skipping duplicate event', event);
      return;
    }
    seenEvents.add(fingerprint);
    
    // Clean up old fingerprints periodically to prevent memory bloat
    if (seenEvents.size > 1000) {
      const entries = Array.from(seenEvents);
      entries.slice(0, 500).forEach(e => seenEvents.delete(e));
      console.log('DataLayer Visualizer: Cleaned up old fingerprints');
    }
    
    const eventData = {
      index: eventIndex++,
      timestamp: Date.now(),
      url: window.location.href,
      data: event,
      gtmPreview: detectGTMPreview(),
      ga4PropertyId: detectGA4PropertyId()
    };
    
    window.postMessage({
      type: 'DATALAYER_PUSH',
      data: eventData
    }, '*');
  }
  
  // Detect GTM Preview Mode
  function detectGTMPreview() {
    const gtmPreview = {
      active: false,
      containerIds: []
    };
    
    // Check for Tag Assistant API
    if (window.__TAG_ASSISTANT_API) {
      gtmPreview.active = true;
    }
    
    // Check for GTM preview cookies
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      if (cookie.trim().startsWith('__TAG_ASSISTANT')) {
        gtmPreview.active = true;
      }
    }
    
    // Check for GTM containers
    if (window.google_tag_manager) {
      gtmPreview.containerIds = Object.keys(window.google_tag_manager);
      if (gtmPreview.containerIds.length > 0) {
        // Check if any container is in preview mode
        for (let containerId of gtmPreview.containerIds) {
          const container = window.google_tag_manager[containerId];
          if (container && container.dataLayer && container.dataLayer.gtmDom) {
            gtmPreview.active = true;
          }
        }
      }
    }
    
    return gtmPreview;
  }
  
  // Detect GA4 Property ID
  function detectGA4PropertyId() {
    let propertyId = null;
    
    // Check gtag config
    if (window.gtag_enable_tcf_support !== undefined || window.gtag) {
      // Try to find GA4 property ID in dataLayer
      if (window.dataLayer) {
        for (let item of window.dataLayer) {
          if (item && typeof item === 'object') {
            // Look for GA4 measurement ID (G-XXXXXXXX)
            if (item['gtm.start']) continue;
            
            const jsonStr = JSON.stringify(item);
            const match = jsonStr.match(/G-[A-Z0-9]+/);
            if (match) {
              propertyId = match[0];
              break;
            }
          }
        }
      }
    }
    
    return propertyId;
  }
  
  // Intercept dataLayer pushes
  if (window.dataLayer) {
    // Capture existing events
    window.dataLayer.forEach(event => {
      sendDataLayerEvent(event, false);
    });
    
    // Override push method
    const originalPush = window.dataLayer.push;
    window.dataLayer.push = function() {
      const args = Array.from(arguments);
      args.forEach(event => {
        sendDataLayerEvent(event, true);
      });
      return originalPush.apply(window.dataLayer, arguments);
    };
  } else {
    // Create dataLayer if it doesn't exist and monitor it
    Object.defineProperty(window, 'dataLayer', {
      get() {
        return this._dataLayer;
      },
      set(value) {
        this._dataLayer = value;
        if (Array.isArray(value)) {
          const originalPush = value.push;
          value.push = function() {
            const args = Array.from(arguments);
            args.forEach(event => {
              sendDataLayerEvent(event, true);
            });
            return originalPush.apply(value, arguments);
          };
        }
      },
      configurable: true
    });
  }
  
  console.log('DataLayer Visualizer: Monitoring active');
})();
