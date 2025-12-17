// This script runs in the context of the webpage and intercepts dataLayer.push() calls

(function() {
  'use strict';
  
  // Store the original push method
  let originalPush = null;
  let interceptedData = [];
  
  // Function to send data to the background script
  function sendToExtension(data) {
    window.postMessage({
      type: 'DATALAYER_PUSH',
      data: data,
      timestamp: Date.now(),
      source: 'datalayer-extension'
    }, '*');
  }
  
  // Function to intercept dataLayer
  function interceptDataLayer() {
    // Check if dataLayer exists
    if (typeof window.dataLayer === 'undefined') {
      // Create the dataLayer if it doesn't exist
      window.dataLayer = [];
    }
    
    // Store the original push method
    originalPush = window.dataLayer.push;
    
    // Capture existing items in dataLayer
    if (window.dataLayer.length > 0) {
      window.dataLayer.forEach(item => {
        interceptedData.push(item);
        sendToExtension(item);
      });
    }
    
    // Override the push method
    window.dataLayer.push = function(...args) {
      // Send each argument to the extension
      args.forEach(item => {
        interceptedData.push(item);
        sendToExtension(item);
      });
      
      // Call the original push method
      return originalPush.apply(this, args);
    };
  }
  
  // Inject the interception code immediately
  interceptDataLayer();
  
  // Also watch for dataLayer being redefined
  let dataLayerDescriptor = Object.getOwnPropertyDescriptor(window, 'dataLayer');
  if (!dataLayerDescriptor || dataLayerDescriptor.configurable) {
    let internalDataLayer = window.dataLayer || [];
    
    Object.defineProperty(window, 'dataLayer', {
      get: function() {
        return internalDataLayer;
      },
      set: function(value) {
        internalDataLayer = value;
        // Re-intercept when dataLayer is reassigned
        setTimeout(() => interceptDataLayer(), 0);
      },
      configurable: true
    });
  }
  
  // Listen for messages from the extension (for initial data requests)
  window.addEventListener('message', (event) => {
    // Only accept messages from the same window
    if (event.source !== window) return;
    
    if (event.data.type === 'GET_INITIAL_DATALAYER' && 
        event.data.source === 'datalayer-extension-request') {
      // Send all intercepted data
      window.postMessage({
        type: 'INITIAL_DATALAYER',
        data: interceptedData,
        source: 'datalayer-extension'
      }, '*');
    }
  });
  
})();

// Listen for messages from the page and forward to background script
window.addEventListener('message', (event) => {
  // Only accept messages from the same window
  if (event.source !== window) return;
  
  if (event.data.type === 'DATALAYER_PUSH' && 
      event.data.source === 'datalayer-extension') {
    // Forward to background script
    chrome.runtime.sendMessage({
      type: 'dataLayerPush',
      data: {
        timestamp: event.data.timestamp,
        data: event.data.data
      }
    }).catch(() => {
      // Ignore errors if extension context is invalidated
    });
  } else if (event.data.type === 'INITIAL_DATALAYER' && 
             event.data.source === 'datalayer-extension') {
    // Forward initial data to background script
    chrome.runtime.sendMessage({
      type: 'initialDataLayer',
      data: event.data.data
    }).catch(() => {
      // Ignore errors if extension context is invalidated
    });
  }
});
