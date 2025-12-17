# Architecture Overview

This document explains how the DataLayer Visualiser Chrome extension works internally.

## Component Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Webpage                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  window.dataLayer.push({...})                        │  │
│  │         ↓ (intercepted)                              │  │
│  │  content.js (injected script)                        │  │
│  └────────────────────┬─────────────────────────────────┘  │
└────────────────────────┼────────────────────────────────────┘
                         ↓ (chrome.runtime.sendMessage)
┌────────────────────────┼────────────────────────────────────┐
│                  Extension Context                          │
│  ┌─────────────────────▼───────────────────────────────┐   │
│  │  background.js (service worker)                     │   │
│  │  - Manages connections                              │   │
│  │  - Routes messages between components               │   │
│  │  - Stores per-tab data                              │   │
│  └─────────────────────┬───────────────────────────────┘   │
└────────────────────────┼────────────────────────────────────┘
                         ↓ (port.postMessage)
┌────────────────────────┼────────────────────────────────────┐
│                   DevTools Context                          │
│  ┌─────────────────────▼───────────────────────────────┐   │
│  │  devtools.js                                        │   │
│  │  - Creates "DataLayer" panel                        │   │
│  └─────────────────────┬───────────────────────────────┘   │
│  ┌─────────────────────▼───────────────────────────────┐   │
│  │  panel.js + panel.html                              │   │
│  │  - Displays events with UI                          │   │
│  │  - Formats JSON with syntax highlighting            │   │
│  │  - Handles user interactions                        │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Message Flow

### 1. Initial Page Load

```
1. content.js injects into page at document_start
2. content.js captures existing dataLayer items
3. content.js overrides window.dataLayer.push()
4. User opens DevTools → DataLayer panel
5. panel.js connects to background.js via port
6. panel.js requests initial data
7. content.js sends existing items
8. background.js forwards to panel.js
9. panel.js displays all events
```

### 2. New dataLayer.push() Call

```
1. Page calls: dataLayer.push({event: 'click'})
2. content.js intercepts the call
3. content.js sends message to background.js
4. background.js stores data for tab
5. background.js forwards to panel.js via port
6. panel.js adds new event to UI with animation
7. Event is highlighted for 2 seconds
8. Auto-scroll moves to new event (if enabled)
```

## Key Technical Details

### Content Script Injection

- **Timing**: `document_start` - runs before page scripts
- **Purpose**: Intercept dataLayer.push() before any GTM code runs
- **Method**: Override Array.prototype.push on dataLayer object
- **Fallback**: Property descriptor on window.dataLayer to catch redefinitions

```javascript
// Simplified interception logic
window.dataLayer = window.dataLayer || [];
const originalPush = window.dataLayer.push;

window.dataLayer.push = function(...args) {
  // Capture and send to extension
  args.forEach(item => sendToExtension(item));
  // Call original push
  return originalPush.apply(this, args);
};
```

### Message Passing

**Content → Background:**
```javascript
chrome.runtime.sendMessage({
  type: 'dataLayerPush',
  data: { timestamp: Date.now(), data: {...} }
});
```

**Panel ↔ Background:**
```javascript
// Panel creates persistent connection
const port = chrome.runtime.connect({ name: 'devtools' });

// Two-way communication
port.postMessage({ type: 'init', tabId: ... });
port.onMessage.addListener((message) => { ... });
```

### Data Storage

- **Location**: background.js service worker
- **Structure**: Map<tabId, dataLayerItems[]>
- **Cleanup**: Automatic on tab close or navigation
- **Purpose**: Persist data if DevTools is closed/reopened

### UI Rendering

**JSON Formatting:**
- Recursive function with depth limiting (max 20 levels)
- Syntax highlighting using colored spans
- HTML escaping to prevent XSS
- Pretty-printed with indentation

**Animations:**
- Fade-in on event creation (0.3s)
- Background highlight for new events (2s)
- Smooth scroll to new events (when enabled)

## Security Considerations

### XSS Prevention

All user data (from dataLayer) is escaped before rendering:

```javascript
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
```

### Permissions

- **activeTab**: Minimal permission, only affects current tab
- **No host permissions**: Doesn't read page content
- **No storage permission**: Data only in memory
- **No network requests**: All processing is local

### Content Security Policy

- External CDN (Tailwind CSS) for styling only
- No inline scripts with eval()
- No remote code execution

## Performance Considerations

### Memory Management

- Tab data automatically cleaned up
- DevTools connection closed on panel close
- No persistent storage (all in-memory)

### Event Handling

- Efficient message passing (no polling)
- Depth-limited JSON formatting
- Event delegation for UI interactions

### Scalability

- Handles hundreds of events efficiently
- Collapse/expand to manage large payloads
- Clear history to reset memory

## Browser Compatibility

- **Chrome**: Full support (Manifest V3)
- **Edge**: Full support (Chromium-based)
- **Other Chromium browsers**: Expected to work

## Debugging

### Enable Debug Logs

Debug messages are logged with `console.debug()` in content.js:
- Message sending failures
- Extension context invalidation

### Check Extension Status

1. Go to `chrome://extensions/`
2. Find DataLayer Visualiser
3. Click "Details"
4. Check "Inspect views" for background page

### Verify Content Script

1. Open DevTools on any page
2. Go to Console
3. Check for "DataLayer extension" messages
4. Type `window.dataLayer` to verify interception

## Future Enhancements

Potential improvements for future versions:

- [ ] Filter events by type/property
- [ ] Search within events
- [ ] Export events to JSON/CSV
- [ ] Dark theme toggle
- [ ] Event comparison/diff view
- [ ] GTM container detection
- [ ] Variable resolution
- [ ] Trigger information
- [ ] Performance metrics
- [ ] Local storage persistence option

## Contributing

When contributing, maintain this architecture:
- Keep components loosely coupled
- Use message passing for all communication
- Follow existing coding style
- Add debug logging for troubleshooting
- Update this document for major changes
