// Background service worker for DataLayer Visualizer
// Handles network monitoring and cross-tab communication

const tabData = new Map();
const networkRequests = new Map();

// Network request monitoring for analytics endpoints
chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    const url = details.url;
    const tabId = details.tabId;
    
    // Check if this is an analytics request
    if (isAnalyticsRequest(url)) {
      const requestInfo = {
        requestId: details.requestId,
        url: url,
        method: details.method,
        timestamp: Date.now(),
        tabId: tabId,
        status: 'pending',
        type: getRequestType(url)
      };
      
      // Store request info
      networkRequests.set(details.requestId, requestInfo);
      
      // Notify the devtools panel
      chrome.runtime.sendMessage({
        type: 'NETWORK_REQUEST',
        data: requestInfo
      }).catch(() => {
        // DevTools might not be open, ignore error
      });
    }
  },
  { urls: ["<all_urls>"] },
  ["requestBody"]
);

chrome.webRequest.onCompleted.addListener(
  function(details) {
    const requestInfo = networkRequests.get(details.requestId);
    if (requestInfo) {
      requestInfo.status = 'completed';
      requestInfo.statusCode = details.statusCode;
      
      chrome.runtime.sendMessage({
        type: 'NETWORK_REQUEST_COMPLETED',
        data: requestInfo
      }).catch(() => {});
    }
  },
  { urls: ["<all_urls>"] }
);

chrome.webRequest.onErrorOccurred.addListener(
  function(details) {
    const requestInfo = networkRequests.get(details.requestId);
    if (requestInfo) {
      requestInfo.status = 'failed';
      requestInfo.error = details.error;
      
      chrome.runtime.sendMessage({
        type: 'NETWORK_REQUEST_FAILED',
        data: requestInfo
      }).catch(() => {});
    }
  },
  { urls: ["<all_urls>"] }
);

function isAnalyticsRequest(url) {
  return url.includes('google-analytics.com/g/collect') ||
         url.includes('google-analytics.com/collect') ||
         url.includes('analytics.google.com') ||
         url.includes('googletagmanager.com/gtm.js') ||
         url.includes('googletagmanager.com/gtag/');
}

function getRequestType(url) {
  if (url.includes('google-analytics.com/g/collect')) return 'GA4';
  if (url.includes('google-analytics.com/collect')) return 'UA';
  if (url.includes('googletagmanager.com')) return 'GTM';
  if (url.includes('analytics.google.com')) return 'GA';
  return 'Unknown';
}

// Handle messages from content script and devtools
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'DATALAYER_EVENT') {
    // Store event for the tab
    const tabId = sender.tab?.id || message.tabId;
    if (!tabData.has(tabId)) {
      tabData.set(tabId, []);
    }
    tabData.get(tabId).push(message.data);
    
    // Forward to devtools
    sendResponse({ success: true });
  } else if (message.type === 'GET_TAB_DATA') {
    const tabId = message.tabId;
    sendResponse({ data: tabData.get(tabId) || [] });
  } else if (message.type === 'CLEAR_TAB_DATA') {
    const tabId = message.tabId;
    tabData.delete(tabId);
    sendResponse({ success: true });
  }
  
  return true;
});

// Clean up when tabs are closed
chrome.tabs.onRemoved.addListener((tabId) => {
  tabData.delete(tabId);
});
