// Content script to bridge the page context and extension
(function() {
  'use strict';
  
  // Prevent multiple injections of content script
  if (window.__DATALAYER_VISUALIZER_CONTENT_LOADED__) {
    console.log('DataLayer Visualizer: Content script already loaded, skipping injection');
    return;
  }
  window.__DATALAYER_VISUALIZER_CONTENT_LOADED__ = true;
  
  // Inject the script into page context
  const script = document.createElement('script');
  script.src = chrome.runtime.getURL('injected.js');
  script.onload = function() {
    this.remove();
  };
  (document.head || document.documentElement).appendChild(script);
  
  // Listen for messages from the injected script
  window.addEventListener('message', function(event) {
    // Only accept messages from same window
    if (event.source !== window) return;
    
    if (event.data.type === 'DATALAYER_PUSH') {
      // Forward to background script
      chrome.runtime.sendMessage({
        type: 'DATALAYER_EVENT',
        data: event.data.data
      }).catch(err => {
        console.error('DataLayer Visualizer: Error sending message', err);
      });
    }
  });
  
  console.log('DataLayer Visualizer: Content script loaded');
})();
