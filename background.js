// Background service worker for message passing between content script and devtools panel

// Store connections to devtools panels, keyed by tab ID
const devtoolsConnections = new Map();

// Store dataLayer data for each tab
const tabData = new Map();

// Listen for connections from devtools panels
chrome.runtime.onConnect.addListener((port) => {
  if (port.name === 'devtools') {
    let tabId = null;
    
    // Listen for messages from the devtools panel
    const messageListener = (message) => {
      if (message.type === 'init') {
        tabId = message.tabId;
        devtoolsConnections.set(tabId, port);
        
        console.log(`DevTools panel connected for tab ${tabId}`);
      } else if (message.type === 'getInitialData') {
        // Request initial dataLayer state from content script
        const requestTabId = message.tabId;
        
        // Inject a script to request initial data
        chrome.tabs.sendMessage(requestTabId, {
          type: 'getInitialData'
        }).catch(() => {
          console.log('Could not communicate with content script');
        });
        
        // Also try to send any cached data
        if (tabData.has(requestTabId)) {
          port.postMessage({
            type: 'initialData',
            data: tabData.get(requestTabId)
          });
        }
      }
    };
    
    port.onMessage.addListener(messageListener);
    
    // Clean up when devtools panel is closed
    port.onDisconnect.addListener(() => {
      if (tabId !== null) {
        devtoolsConnections.delete(tabId);
        console.log(`DevTools panel disconnected for tab ${tabId}`);
      }
    });
  }
});

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const tabId = sender.tab?.id;
  
  if (!tabId) return;
  
  if (message.type === 'dataLayerPush') {
    // Store the data
    if (!tabData.has(tabId)) {
      tabData.set(tabId, []);
    }
    tabData.get(tabId).push(message.data.data);
    
    // Forward to devtools panel if connected
    const port = devtoolsConnections.get(tabId);
    if (port) {
      try {
        port.postMessage({
          type: 'dataLayerPush',
          data: message.data
        });
      } catch (error) {
        console.error('Error forwarding to devtools:', error);
        devtoolsConnections.delete(tabId);
      }
    }
  } else if (message.type === 'initialDataLayer') {
    // Store initial data
    tabData.set(tabId, message.data);
    
    // Forward to devtools panel if connected
    const port = devtoolsConnections.get(tabId);
    if (port) {
      try {
        port.postMessage({
          type: 'initialData',
          data: message.data
        });
      } catch (error) {
        console.error('Error forwarding initial data to devtools:', error);
        devtoolsConnections.delete(tabId);
      }
    }
  }
  
  return false;
});

// Clean up tab data when tabs are closed
chrome.tabs.onRemoved.addListener((tabId) => {
  tabData.delete(tabId);
  devtoolsConnections.delete(tabId);
});

// Clean up tab data when tabs are navigated
chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status === 'loading') {
    // Clear data for this tab on navigation
    tabData.delete(tabId);
  }
});
